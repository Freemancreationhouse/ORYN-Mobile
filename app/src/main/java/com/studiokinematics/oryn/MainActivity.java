package com.studiokinematics.oryn;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.os.Build;
import android.provider.Settings;
import android.util.Base64;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Enumeration;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.atomic.AtomicBoolean;

public class MainActivity extends Activity {
    private static final String APP_HOST = "app.oryn";
    private static final int FILE_CHOOSER_REQUEST = 7001;
    private static final int SAVE_FILE_REQUEST = 7002;
    private WebView webView;
    private ValueCallback<Uri[]> fileChooserCallback;
    private String pendingSaveName;
    private String pendingSaveMime;
    private String pendingSavePayload;
    private boolean pendingSaveBase64;
    private final ExecutorService discoveryLauncher = Executors.newSingleThreadExecutor();
    private final AtomicBoolean discoveryRunning = new AtomicBoolean(false);
    private final AtomicBoolean freshLaunchPending = new AtomicBoolean(true);

    @Override public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().setStatusBarColor(Color.rgb(10,10,10));
        getWindow().setNavigationBarColor(Color.rgb(10,10,10));

        webView = new WebView(this);
        setContentView(webView);
        WebSettings s = webView.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setAllowFileAccess(false);
        // Pattern Forge uses Android's system document picker (content:// URI).
        // Keep raw file:// access disabled, but allow the picker-granted content URI.
        s.setAllowContentAccess(true);
        s.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setBuiltInZoomControls(false);
        s.setDisplayZoomControls(false);
        s.setTextZoom(100);
        webView.setBackgroundColor(Color.rgb(10,10,10));
        webView.addJavascriptInterface(new OrynAndroidBridge(), "OrynAndroid");
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback, WebChromeClient.FileChooserParams params) {
                if (fileChooserCallback != null) fileChooserCallback.onReceiveValue(null);
                fileChooserCallback = callback;
                Intent intent;
                try {
                    intent = params != null ? params.createIntent() : null;
                } catch (Exception ignored) {
                    intent = null;
                }
                if (intent == null) {
                    intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
                    intent.addCategory(Intent.CATEGORY_OPENABLE);
                    intent.setType("*/*");
                    intent.putExtra(Intent.EXTRA_MIME_TYPES, new String[]{
                            "image/png", "image/jpeg", "image/webp", "image/bmp",
                            "image/svg+xml", "text/plain", "application/octet-stream"
                    });
                }
                try {
                    startActivityForResult(Intent.createChooser(intent, "Choose artwork for ORYN Pattern Forge"), FILE_CHOOSER_REQUEST);
                    return true;
                } catch (Exception e) {
                    fileChooserCallback = null;
                    callback.onReceiveValue(null);
                    return false;
                }
            }
        });
        webView.setWebViewClient(new LocalAssetClient());

        // Android 15 targets are edge-to-edge by default. Keep ORYN controls above
        // the phone status/navigation bars instead of letting the bottom action
        // button sit under the system navigation controls.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            webView.setOnApplyWindowInsetsListener((v, insets) -> {
                int top = insets.getSystemWindowInsetTop();
                int bottom = insets.getSystemWindowInsetBottom();
                v.setPadding(0, top, 0, bottom);
                return insets;
            });
        }
        webView.loadUrl("http://" + APP_HOST + "/");
    }

    @Override protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == FILE_CHOOSER_REQUEST) {
            ValueCallback<Uri[]> callback = fileChooserCallback;
            fileChooserCallback = null;
            if (callback != null) {
                Uri[] result = null;
                if (resultCode == Activity.RESULT_OK) {
                    result = WebChromeClient.FileChooserParams.parseResult(resultCode, data);
                    // A few Android document providers omit parseResult data but
                    // still return a single data URI. Preserve that selection.
                    if ((result == null || result.length == 0) && data != null && data.getData() != null) {
                        result = new Uri[]{data.getData()};
                    }
                }
                callback.onReceiveValue(result);
            }
            return;
        }
        if (requestCode == SAVE_FILE_REQUEST) {
            if (resultCode == Activity.RESULT_OK && data != null && data.getData() != null) {
                final Uri uri = data.getData();
                final String name = pendingSaveName;
                final String payload = pendingSavePayload;
                final boolean encoded = pendingSaveBase64;
                discoveryLauncher.submit(() -> {
                    boolean ok = false;
                    String message;
                    try (OutputStream out = getContentResolver().openOutputStream(uri, "w")) {
                        if (out == null) throw new IllegalStateException("Could not open selected file");
                        byte[] bytes = encoded ? Base64.decode(payload == null ? "" : payload, Base64.DEFAULT)
                                : (payload == null ? new byte[0] : payload.getBytes(StandardCharsets.UTF_8));
                        out.write(bytes); out.flush(); ok = true;
                        message = "Saved file: " + (name == null ? "ORYN export" : name);
                    } catch (Exception e) {
                        message = "File save failed: " + e.getMessage();
                    }
                    final boolean result = ok; final String msg = message;
                    runOnUiThread(() -> {
                        if (webView != null) webView.evaluateJavascript(
                                "window.__orynPatternDesignerFileSaved&&window.__orynPatternDesignerFileSaved(" + result + "," + JSONObject.quote(name == null ? "" : name) + "," + JSONObject.quote(msg) + ");", null);
                    });
                });
            }
            clearPendingSave();
            return;
        }
        super.onActivityResult(requestCode, resultCode, data);
    }

    @Override public void onBackPressed() {
        if (webView != null && webView.canGoBack()) webView.goBack(); else super.onBackPressed();
    }

    @Override protected void onDestroy() {
        discoveryLauncher.shutdownNow();
        if (webView != null) { webView.destroy(); webView = null; }
        super.onDestroy();
    }

    private class LocalAssetClient extends WebViewClient {
        @Override public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
            Uri uri = request.getUrl();
            if (!APP_HOST.equalsIgnoreCase(uri.getHost())) return super.shouldInterceptRequest(view, request);
            String path = uri.getPath();
            if (path == null || path.equals("/") || path.isEmpty()) path = "/index.html";
            String assetPath = "www" + path;
            try {
                InputStream in = getAssets().open(assetPath);
                return responseFor(path, in);
            } catch (Exception ignored) {
                // BrowserRouter refresh fallback: non-file routes get the local app shell.
                if (!path.substring(path.lastIndexOf('/') + 1).contains(".")) {
                    try { return responseFor("/index.html", getAssets().open("www/index.html")); }
                    catch (Exception ignoredAgain) { }
                }
                return new WebResourceResponse("text/plain", "UTF-8", 404, "Not Found", Collections.emptyMap(), new ByteArrayInputStream(new byte[0]));
            }
        }

        private WebResourceResponse responseFor(String path, InputStream in) {
            String lower = path.toLowerCase();
            String mime = "application/octet-stream";
            if (lower.endsWith(".html")) mime = "text/html";
            else if (lower.endsWith(".js")) mime = "application/javascript";
            else if (lower.endsWith(".css")) mime = "text/css";
            else if (lower.endsWith(".json") || lower.endsWith(".webmanifest")) mime = "application/json";
            else if (lower.endsWith(".png")) mime = "image/png";
            else if (lower.endsWith(".webp")) mime = "image/webp";
            else if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) mime = "image/jpeg";
            else if (lower.endsWith(".svg")) mime = "image/svg+xml";
            else if (lower.endsWith(".ico")) mime = "image/x-icon";
            else if (lower.endsWith(".woff2")) mime = "font/woff2";
            else if (lower.endsWith(".woff")) mime = "font/woff";
            else if (lower.endsWith(".thr")) mime = "text/plain";
            return new WebResourceResponse(mime, (mime.startsWith("text/") || mime.contains("javascript") || mime.contains("json")) ? "UTF-8" : null, in);
        }
    }

    public class OrynAndroidBridge {
        @JavascriptInterface public String getAppVersion() { return "10.4.1-mobile4-pd"; }
        @JavascriptInterface public boolean consumeFreshLaunch() { return freshLaunchPending.getAndSet(false); }
        @JavascriptInterface public void openWifiSettings() {
            runOnUiThread(() -> {
                try { startActivity(new Intent(Settings.ACTION_WIFI_SETTINGS)); }
                catch (Exception e) { startActivity(new Intent(Settings.ACTION_SETTINGS)); }
            });
        }
        @JavascriptInterface public void startDiscovery() { startDiscoveryAsync(); }
        @JavascriptInterface public void saveFile(String filename, String mimeType, String payload, boolean base64) {
            runOnUiThread(() -> beginSaveFile(filename, mimeType, payload, base64));
        }
    }

    private void beginSaveFile(String filename, String mimeType, String payload, boolean base64) {
        pendingSaveName = (filename == null || filename.trim().isEmpty()) ? "oryn-export.txt" : filename.trim();
        pendingSaveMime = (mimeType == null || mimeType.trim().isEmpty()) ? "application/octet-stream" : mimeType.trim();
        pendingSavePayload = payload == null ? "" : payload;
        pendingSaveBase64 = base64;
        Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType(pendingSaveMime);
        intent.putExtra(Intent.EXTRA_TITLE, pendingSaveName);
        try {
            startActivityForResult(intent, SAVE_FILE_REQUEST);
        } catch (Exception e) {
            clearPendingSave();
            if (webView != null) webView.evaluateJavascript(
                    "window.__orynPatternDesignerFileSaved&&window.__orynPatternDesignerFileSaved(false,'','Unable to open Android file saver');", null);
        }
    }

    private void clearPendingSave() {
        pendingSaveName = null; pendingSaveMime = null; pendingSavePayload = null; pendingSaveBase64 = false;
    }

    private void startDiscoveryAsync() {
        if (!discoveryRunning.compareAndSet(false, true)) return;
        discoveryLauncher.submit(() -> {
            try { discoverOrynTables(); }
            finally { discoveryRunning.set(false); }
        });
    }

    private void discoverOrynTables() {
        Map<String, JSONObject> found = new ConcurrentHashMap<>();
        // Preferred stable host first.
        String[] preferred = {"http://oryn.local:8080", "http://oryn.local"};
        for (String base : preferred) {
            JSONObject t = probe(base, 700);
            if (t != null) {
                found.put(t.optString("id", base), t);
                deliverDiscovery(found.values());
                return;
            }
        }

        List<String> prefixes = local24Prefixes();
        if (prefixes.isEmpty()) { deliverDiscovery(Collections.emptyList()); return; }
        Set<String> candidates = new HashSet<>();
        for (String prefix : prefixes) {
            for (int i=1;i<=254;i++) {
                String ip=prefix+i;
                candidates.add("http://"+ip+":8080");
                candidates.add("http://"+ip);
            }
        }

        ExecutorService pool = Executors.newFixedThreadPool(48);
        List<Future<?>> jobs = new ArrayList<>();
        AtomicBoolean deliveredFirst = new AtomicBoolean(false);
        for (String base : candidates) {
            jobs.add(pool.submit(() -> {
                JSONObject t = probe(base, 380);
                if (t != null) {
                    String id=t.optString("id",base);
                    if (found.putIfAbsent(id,t)==null && deliveredFirst.compareAndSet(false,true)) deliverDiscovery(found.values());
                }
            }));
        }
        for (Future<?> f : jobs) { try { f.get(); } catch (Exception ignored) {} }
        pool.shutdownNow();
        deliverDiscovery(found.values());
    }

    private List<String> local24Prefixes() {
        Set<String> prefixes = new HashSet<>();
        try {
            Enumeration<NetworkInterface> ifaces = NetworkInterface.getNetworkInterfaces();
            while (ifaces.hasMoreElements()) {
                NetworkInterface nif=ifaces.nextElement();
                if (!nif.isUp() || nif.isLoopback()) continue;
                Enumeration<InetAddress> addrs=nif.getInetAddresses();
                while (addrs.hasMoreElements()) {
                    InetAddress a=addrs.nextElement();
                    if (!(a instanceof Inet4Address) || a.isLoopbackAddress() || a.isLinkLocalAddress()) continue;
                    String ip=a.getHostAddress();
                    if (!isPrivateIPv4(ip)) continue;
                    int cut=ip.lastIndexOf('.');
                    if (cut>0) prefixes.add(ip.substring(0,cut+1));
                }
            }
        } catch (Exception ignored) {}
        return new ArrayList<>(prefixes);
    }

    private boolean isPrivateIPv4(String ip) {
        try {
            String[] p=ip.split("\\."); if (p.length!=4) return false;
            int a=Integer.parseInt(p[0]), b=Integer.parseInt(p[1]);
            return a==10 || (a==172 && b>=16 && b<=31) || (a==192 && b==168);
        } catch (Exception e) { return false; }
    }

    private JSONObject probe(String base, int timeoutMs) {
        HttpURLConnection c=null;
        try {
            URL u=new URL(base+"/api/table-info");
            c=(HttpURLConnection)u.openConnection();
            c.setRequestMethod("GET");
            c.setConnectTimeout(timeoutMs); c.setReadTimeout(timeoutMs);
            c.setRequestProperty("Accept","application/json");
            c.setRequestProperty("User-Agent","ORYN-Android-Discovery/1.0");
            c.setInstanceFollowRedirects(true);
            if (c.getResponseCode()!=200) return null;
            BufferedReader br=new BufferedReader(new InputStreamReader(c.getInputStream(), StandardCharsets.UTF_8));
            StringBuilder sb=new StringBuilder(); String line; while((line=br.readLine())!=null) sb.append(line);
            JSONObject info=new JSONObject(sb.toString());
            if (info.optString("id").isEmpty() || info.optString("name").isEmpty()) return null;
            JSONObject out=new JSONObject();
            out.put("id",info.optString("id")); out.put("name",orynDisplayName(info.optString("name"))); out.put("url",base);
            out.put("host",new URL(base).getHost()); out.put("version",info.optString("version",null)); out.put("isOnline",true); out.put("isCurrent",false);
            return out;
        } catch (Exception ignored) { return null; }
        finally { if (c!=null) c.disconnect(); }
    }

    private String orynDisplayName(String raw) {
        String name = raw == null ? "" : raw.trim();
        if (name.isEmpty()) return "ORYN";
        name = name.replaceAll("(?i)UC[-_ ]DUNE[-_ ]MOTION", "UC-ORYN-MOTION");
        name = name.replaceAll("(?i)DUNE\\s*MOTION", "ORYN");
        if (name.equalsIgnoreCase("dune")) return "ORYN";
        return name;
    }

    private void deliverDiscovery(java.util.Collection<JSONObject> tables) {
        JSONArray arr=new JSONArray(); for (JSONObject t:tables) arr.put(t);
        final String js="window.__orynNativeDiscovery && window.__orynNativeDiscovery("+arr.toString()+");";
        runOnUiThread(() -> { if (webView!=null) webView.evaluateJavascript(js,null); });
    }
}
