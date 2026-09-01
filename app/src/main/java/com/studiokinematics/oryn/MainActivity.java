package com.studiokinematics.oryn;

import android.app.Activity;
import android.Manifest;
import android.content.Context;
import android.content.pm.PackageManager;
import android.net.ConnectivityManager;
import android.net.LinkAddress;
import android.net.LinkProperties;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.net.NetworkRequest;
import android.net.wifi.ScanResult;
import android.net.wifi.WifiManager;
import android.net.wifi.WifiNetworkSpecifier;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
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
import android.view.ViewGroup;
import android.view.WindowInsets;
import android.widget.FrameLayout;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.StringReader;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.io.BufferedWriter;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
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
    private static final int WIFI_PERMISSION_REQUEST = 7003;
    // Measured ORYN Mini mechanical coupling constants. Saved user calibration
    // values (Full Circle and Perimeter) remain live runtime inputs.
    private static final double MINI_X_STEPS_PER_MM = 256.0;
    private static final double MINI_Y_STEPS_PER_MM = 210.0;
    private static final double MINI_GEAR_RATIO = 6.25;
    private static final double MINI_COUPLING_SIGN = -1.0;
    private WebView webView;
    private FrameLayout rootView;
    private ValueCallback<Uri[]> fileChooserCallback;
    private String pendingSaveName;
    private String pendingSaveMime;
    private String pendingSavePayload;
    private boolean pendingSaveBase64;
    private final ExecutorService discoveryLauncher = Executors.newSingleThreadExecutor();
    private final ExecutorService directNetworkExecutor = Executors.newSingleThreadExecutor();
    private final AtomicBoolean discoveryRunning = new AtomicBoolean(false);
    private final AtomicBoolean freshLaunchPending = new AtomicBoolean(true);

    // Smart Wi-Fi: ORYN requests a local-only FluidNC Wi-Fi network and
    // binds ONLY ESP32 sockets to it. The Android default network remains free
    // for Internet traffic (cellular or primary Wi-Fi where STA concurrency is supported).
    private WifiManager wifiManager;
    private ConnectivityManager connectivityManager;
    private volatile Network directWifiNetwork;
    private volatile ConnectivityManager.NetworkCallback directWifiCallback;
    private volatile String directWifiSsid = null;
    private volatile boolean wifiScanPending = false;
    private volatile String pendingWifiConnectSsid = null;
    private volatile String pendingWifiConnectPassword = null;

    // ORYN Direct (experimental): Android talks straight to FluidNC over Wi-Fi/Telnet.
    private final ExecutorService directExecutor = Executors.newSingleThreadExecutor();
    private final AtomicBoolean directRunning = new AtomicBoolean(false);
    private final AtomicBoolean directPaused = new AtomicBoolean(false);
    private final AtomicBoolean directStopRequested = new AtomicBoolean(false);
    private final AtomicBoolean directHoming = new AtomicBoolean(false);
    private volatile boolean directControllerOnline = false;
    private volatile Socket directPatternSocket;
    private volatile String directLastError = "";
    private volatile String directCurrentFile = null;
    private volatile int directPoint = 0;
    private volatile int directTotal = 0;
    private volatile double directTheta = 0.0;
    private volatile double directRho = 0.0;
    private volatile double directSpeed = 60.0;
    // Live FluidNC/mechanism profile used by the coupled Theta-Rho motion core.
    // Values are detected from the controller at motion start; they are not
    // written back to FluidNC and therefore cannot disturb a working setup.
    private volatile double directXStepsPerMm = 0.0;
    private volatile double directYStepsPerMm = 0.0;
    private volatile double directGearRatio = 0.0;
    private volatile double directCouplingSign = 0.0;
    private volatile String directMachineName = "";

    @Override public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().setStatusBarColor(Color.rgb(10,10,10));
        getWindow().setNavigationBarColor(Color.rgb(10,10,10));
        wifiManager = (WifiManager) getApplicationContext().getSystemService(Context.WIFI_SERVICE);
        connectivityManager = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);

        rootView = new FrameLayout(this);
        webView = new WebView(this);
        rootView.addView(webView, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT));
        setContentView(rootView);
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

        // Android 15 edge-to-edge safe area: shrink the actual WebView viewport
        // so ORYN fixed navigation stays above gesture / 3-button system controls.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            rootView.setOnApplyWindowInsetsListener((v, insets) -> {
                int left, top, right, bottom;
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                    android.graphics.Insets bars = insets.getInsets(WindowInsets.Type.systemBars());
                    left = bars.left; top = bars.top; right = bars.right; bottom = bars.bottom;
                } else {
                    left = insets.getSystemWindowInsetLeft();
                    top = insets.getSystemWindowInsetTop();
                    right = insets.getSystemWindowInsetRight();
                    bottom = insets.getSystemWindowInsetBottom();
                }
                FrameLayout.LayoutParams lp = (FrameLayout.LayoutParams) webView.getLayoutParams();
                if (lp.leftMargin != left || lp.topMargin != top || lp.rightMargin != right || lp.bottomMargin != bottom) {
                    lp.setMargins(left, top, right, bottom);
                    webView.setLayoutParams(lp);
                }
                return insets;
            });
            rootView.requestApplyInsets();
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
                    boolean ok = false; String message;
                    try (OutputStream outStream = getContentResolver().openOutputStream(uri, "w")) {
                        if (outStream == null) throw new IllegalStateException("Could not open selected file");
                        byte[] bytes = encoded ? Base64.decode(payload == null ? "" : payload, Base64.DEFAULT)
                                : (payload == null ? new byte[0] : payload.getBytes(StandardCharsets.UTF_8));
                        outStream.write(bytes); outStream.flush(); ok = true;
                        message = "Saved file: " + (name == null ? "ORYN export" : name);
                    } catch (Exception e) {
                        message = "File save failed: " + e.getMessage();
                    }
                    final boolean result = ok; final String msg = message;
                    runOnUiThread(() -> { if (webView != null) webView.evaluateJavascript(
                            "window.__orynPatternDesignerFileSaved&&window.__orynPatternDesignerFileSaved(" + result + "," + JSONObject.quote(name == null ? "" : name) + "," + JSONObject.quote(msg) + ");", null); });
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
        directNetworkExecutor.shutdownNow();
        releaseDirectWifiNetwork();
        directStop();
        directExecutor.shutdownNow();
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
        @JavascriptInterface public String getAppVersion() { return "10.4.1-unified-connection"; }
        @JavascriptInterface public boolean consumeFreshLaunch() { return freshLaunchPending.getAndSet(false); }
        @JavascriptInterface public void openWifiSettings() {
            runOnUiThread(() -> {
                try { startActivity(new Intent(Settings.ACTION_WIFI_SETTINGS)); }
                catch (Exception e) { startActivity(new Intent(Settings.ACTION_SETTINGS)); }
            });
        }
        @JavascriptInterface public void scanWifiNetworks() { requestWifiScan(); }
        @JavascriptInterface public void connectDirectWifi(String ssid, String password) { requestDirectWifiConnection(ssid, password); }
        @JavascriptInterface public void disconnectDirectWifi() { runOnUiThread(() -> releaseDirectWifiNetwork()); }
        @JavascriptInterface public String directWifiState() { return getDirectWifiStateJson(); }
        @JavascriptInterface public String configureFluidNcHomeWifi(String host, String ssid, String password) { return configureFluidNcForHomeWifi(host, ssid, password); }
        @JavascriptInterface public void discoverFluidNcLan(String preferredHost) { discoverFluidNcOnLanAsync(preferredHost); }
        @JavascriptInterface public void startDiscovery() { startDiscoveryAsync(); }
        @JavascriptInterface public void saveFile(String filename, String mimeType, String payload, boolean base64) {
            runOnUiThread(() -> beginSaveFile(filename, mimeType, payload, base64));
        }

        @JavascriptInterface public String directSavePattern(String name, String thr) { return saveDirectPattern(name, thr); }
        @JavascriptInterface public String directListPatterns() { return listDirectPatterns(); }
        @JavascriptInterface public String directReadPattern(String path) { return readDirectPattern(path); }
        @JavascriptInterface public boolean directDeletePattern(String path) { return deleteDirectPattern(path); }

        @JavascriptInterface public String directProbe(String host) {
            return probeDirectController(host);
        }

        @JavascriptInterface public void directProbeAsync(String host) {
            final String requested = normalizeDirectHost(host);
            directNetworkExecutor.submit(() -> {
                try {
                    JSONObject payload = new JSONObject(probeDirectController(requested));
                    payload.put("requested_host", requested);
                    deliverJs("window.__orynNativeDirectProbe&&window.__orynNativeDirectProbe(" + payload.toString() + ");");
                } catch (Exception e) {
                    try {
                        JSONObject payload = new JSONObject();
                        payload.put("ok", false); payload.put("requested_host", requested);
                        payload.put("error", e.getMessage() == null ? e.toString() : e.getMessage());
                        deliverJs("window.__orynNativeDirectProbe&&window.__orynNativeDirectProbe(" + payload.toString() + ");");
                    } catch (Exception ignored) { }
                }
            });
        }

        @JavascriptInterface public String directAction(String host, String command) {
            JSONObject out = new JSONObject();
            try {
                String r = telnetCommand(host, command, 3500);
                boolean success = !r.trim().isEmpty() && !r.toLowerCase(java.util.Locale.US).contains("error");
                // If FluidNC answered, transport is online even when the G-code itself was rejected.
                directControllerOnline = true;
                out.put("success", success);
                out.put("response", r);
                if (!success) out.put("detail", r.trim().isEmpty() ? "No response from FluidNC" : r.trim());
            } catch (Exception e) {
                directControllerOnline = false;
                try { out.put("success", false); out.put("detail", e.getMessage()); } catch (Exception ignored) {}
            }
            return out.toString();
        }

        @JavascriptInterface public boolean directHome(String host, double rhoTravelUnits, double rhoDirection, double feed) {
            // A second Home press while the first Home is already running is not
            // an error.  This also avoids a false failure when the UI auto-homes
            // and the user taps Home at the same time.
            if (directHoming.get()) return true;
            if (directRunning.get()) { directLastError = "A pattern is running"; return false; }
            if (!directHoming.compareAndSet(false, true)) return directHoming.get();
            directStopRequested.set(false); directPaused.set(false); directLastError = ""; directSpeed = feed;
            directExecutor.submit(() -> runDirectHome(host, rhoTravelUnits, rhoDirection, feed));
            return true;
        }

        @JavascriptInterface public boolean directStartPattern(String host, String assetPathsJson, double thetaRevUnits, double rhoTravelUnits, double rhoDirection, double feed) {
            if (directHoming.get() || !directRunning.compareAndSet(false, true)) return false;
            directStopRequested.set(false); directPaused.set(false); directLastError = ""; directSpeed = feed;
            directExecutor.submit(() -> runDirectPattern(host, assetPathsJson, thetaRevUnits, rhoTravelUnits, rhoDirection, feed));
            return true;
        }

        @JavascriptInterface public String directMoveLogical(String host, double targetTheta, double targetRho, double thetaRevUnits, double rhoTravelUnits, double rhoDirection, double feed) {
            JSONObject out = new JSONObject();
            if (directRunning.get() || directHoming.get()) {
                try { out.put("success", false); out.put("detail", "Direct motion is already active"); } catch (Exception ignored) {}
                return out.toString();
            }
            return runDirectLogicalMove(host, targetTheta, targetRho, thetaRevUnits, rhoTravelUnits, rhoDirection, feed);
        }

        @JavascriptInterface public String directStatus() {
            JSONObject o = new JSONObject();
            try {
                o.put("connected", directControllerOnline);
                o.put("is_running", directRunning.get()); o.put("is_paused", directPaused.get()); o.put("is_homing", directHoming.get());
                o.put("current_file", directCurrentFile); o.put("current", directPoint); o.put("total", directTotal);
                o.put("percentage", directTotal > 0 ? (100.0 * directPoint / directTotal) : 0.0);
                o.put("theta", directTheta); o.put("rho", directRho); o.put("speed", directSpeed); o.put("error", directLastError);
                o.put("x_steps_per_mm", directXStepsPerMm); o.put("y_steps_per_mm", directYStepsPerMm);
                o.put("gear_ratio", directGearRatio); o.put("coupling_sign", directCouplingSign);
                o.put("machine_name", directMachineName);
            } catch (Exception ignored) {}
            return o.toString();
        }

        @JavascriptInterface public void directStopNow() { directStop(); }
        @JavascriptInterface public void directPauseNow() { directRealtime((byte)'!'); directPaused.set(true); }
        @JavascriptInterface public void directResumeNow() { directRealtime((byte)'~'); directPaused.set(false); }
    }

    private String probeDirectController(String host) {
        JSONObject out = new JSONObject();
        try {
            // Never open a second Telnet client while Home/pattern owns FluidNC.
            if (directRunning.get() || directHoming.get()) {
                directControllerOnline = true;
                out.put("ok", true); out.put("busy", true);
                out.put("host", normalizeDirectHost(host));
                out.put("response", "FluidNC Direct motion session active");
                return out.toString();
            }
            String h = normalizeDirectHost(host);
            String r = telnetCommand(h, "$I", 2200);
            boolean ok = r.contains("FluidNC") || r.contains("Grbl");
            directControllerOnline = ok;
            if (ok) directLastError = "";
            out.put("ok", ok); out.put("response", r);
            try {
                String resolved = InetAddress.getByName(h).getHostAddress();
                out.put("host", (resolved == null || resolved.trim().isEmpty()) ? h : resolved);
            } catch (Exception ignored) { out.put("host", h); }
            if (!ok) out.put("error", "FluidNC/GRBL banner not received");
        } catch (Exception e) {
            directControllerOnline = false;
            try { out.put("ok", false); out.put("host", normalizeDirectHost(host)); out.put("error", e.getMessage() == null ? e.toString() : e.getMessage()); } catch (Exception ignored) { }
        }
        return out.toString();
    }

    @Override public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode != WIFI_PERMISSION_REQUEST) return;
        boolean ok = true;
        for (int r : grantResults) if (r != PackageManager.PERMISSION_GRANTED) ok = false;
        if (!ok) {
            wifiScanPending = false;
            pendingWifiConnectSsid = null;
            pendingWifiConnectPassword = null;
            deliverWifiScanError("Wi-Fi permission was not granted. ORYN needs Nearby Wi-Fi / Location permission only to show nearby SSIDs and connect to FluidNC.");
            return;
        }
        if (wifiScanPending) {
            wifiScanPending = false;
            performWifiScan();
        } else if (pendingWifiConnectSsid != null) {
            String ssid = pendingWifiConnectSsid, pass = pendingWifiConnectPassword;
            pendingWifiConnectSsid = null; pendingWifiConnectPassword = null;
            requestDirectWifiConnection(ssid, pass);
        }
    }

    private boolean hasWifiScanPermissions() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) return true;
        boolean fine = checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED;
        if (Build.VERSION.SDK_INT >= 33) {
            boolean nearby = checkSelfPermission(Manifest.permission.NEARBY_WIFI_DEVICES) == PackageManager.PERMISSION_GRANTED;
            return fine && nearby;
        }
        return fine;
    }

    private void requestWifiPermissions(boolean forScan, String ssid, String password) {
        wifiScanPending = forScan;
        pendingWifiConnectSsid = forScan ? null : ssid;
        pendingWifiConnectPassword = forScan ? null : password;
        runOnUiThread(() -> {
            if (Build.VERSION.SDK_INT >= 33) {
                requestPermissions(new String[]{Manifest.permission.NEARBY_WIFI_DEVICES, Manifest.permission.ACCESS_FINE_LOCATION}, WIFI_PERMISSION_REQUEST);
            } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                requestPermissions(new String[]{Manifest.permission.ACCESS_FINE_LOCATION}, WIFI_PERMISSION_REQUEST);
            }
        });
    }

    private void requestWifiScan() {
        if (!hasWifiScanPermissions()) { requestWifiPermissions(true, null, null); return; }
        performWifiScan();
    }

    private void performWifiScan() {
        runOnUiThread(() -> {
            if (wifiManager == null) { deliverWifiScanError("Wi-Fi service is unavailable on this phone."); return; }
            try {
                if (!wifiManager.isWifiEnabled()) { deliverWifiScanError("Turn Wi-Fi on, then scan again."); return; }
                try { wifiManager.startScan(); } catch (Exception ignored) { }
                new Handler(Looper.getMainLooper()).postDelayed(this::deliverWifiScanResults, 1500);
            } catch (SecurityException e) {
                deliverWifiScanError("Android blocked Wi-Fi scanning. Allow Nearby Wi-Fi and Location permission, then scan again.");
            }
        });
    }

    private void deliverWifiScanResults() {
        JSONArray arr = new JSONArray();
        try {
            List<ScanResult> results = wifiManager == null ? Collections.emptyList() : wifiManager.getScanResults();
            Map<String, ScanResult> best = new LinkedHashMap<>();
            for (ScanResult r : results) {
                String ssid = r.SSID == null ? "" : r.SSID.trim();
                if (ssid.isEmpty()) continue;
                ScanResult old = best.get(ssid);
                if (old == null || r.level > old.level) best.put(ssid, r);
            }
            List<ScanResult> sorted = new ArrayList<>(best.values());
            sorted.sort((a,b) -> {
                boolean af = isFluidNcSsid(a.SSID), bf = isFluidNcSsid(b.SSID);
                if (af != bf) return af ? -1 : 1;
                return Integer.compare(b.level, a.level);
            });
            for (ScanResult r : sorted) {
                JSONObject o = new JSONObject();
                String ssid = r.SSID == null ? "" : r.SSID.trim();
                o.put("ssid", ssid); o.put("rssi", r.level); o.put("fluidnc", isFluidNcSsid(ssid));
                String caps = r.capabilities == null ? "" : r.capabilities;
                o.put("secure", caps.contains("WPA") || caps.contains("WEP") || caps.contains("SAE"));
                o.put("security", caps); arr.put(o);
            }
            JSONObject payload = new JSONObject();
            payload.put("ok", true); payload.put("networks", arr); payload.put("state", new JSONObject(getDirectWifiStateJson()));
            deliverJs("window.__orynNativeWifiScan&&window.__orynNativeWifiScan(" + payload.toString() + ");");
        } catch (Exception e) { deliverWifiScanError(e.getMessage() == null ? e.toString() : e.getMessage()); }
    }

    private boolean isFluidNcSsid(String ssid) {
        String s = ssid == null ? "" : ssid.toLowerCase(java.util.Locale.US);
        return s.equals("fluidnc") || s.startsWith("fluidnc-") || s.contains("oryn");
    }

    private void deliverWifiScanError(String message) {
        try {
            JSONObject p = new JSONObject(); p.put("ok", false); p.put("error", message == null ? "Wi-Fi scan failed" : message); p.put("networks", new JSONArray());
            deliverJs("window.__orynNativeWifiScan&&window.__orynNativeWifiScan(" + p.toString() + ");");
        } catch (Exception ignored) { }
    }

    private void requestDirectWifiConnection(String rawSsid, String rawPassword) {
        final String ssid = rawSsid == null ? "" : rawSsid.trim();
        final String password = rawPassword == null ? "" : rawPassword;
        if (ssid.isEmpty()) { deliverDirectWifiState("error", ssid, "Select a Wi-Fi network first."); return; }
        if (!hasWifiScanPermissions()) { requestWifiPermissions(false, ssid, password); return; }
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) {
            deliverDirectWifiState("unsupported", ssid, "Android 10 or newer is required for ORYN local-only Wi-Fi. Use Home Wi-Fi mode on this phone.");
            return;
        }
        runOnUiThread(() -> {
            try {
                releaseDirectWifiNetwork();
                WifiNetworkSpecifier.Builder specBuilder = new WifiNetworkSpecifier.Builder().setSsid(ssid);
                if (!password.isEmpty()) specBuilder.setWpa2Passphrase(password);
                WifiNetworkSpecifier specifier = specBuilder.build();
                NetworkRequest request = new NetworkRequest.Builder()
                        .addTransportType(NetworkCapabilities.TRANSPORT_WIFI)
                        .removeCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
                        .setNetworkSpecifier(specifier).build();
                directWifiSsid = ssid;
                directWifiCallback = new ConnectivityManager.NetworkCallback() {
                    @Override public void onAvailable(Network network) {
                        directWifiNetwork = network;
                        deliverDirectWifiState("connected", ssid, "FluidNC local network is ready. ORYN ESP32 sockets are bound to it; Internet stays on Android's default network when available.");
                    }
                    @Override public void onLost(Network network) {
                        if (network.equals(directWifiNetwork)) directWifiNetwork = null;
                        directControllerOnline = false;
                        deliverDirectWifiState("lost", ssid, "FluidNC Wi-Fi connection was lost.");
                    }
                    @Override public void onUnavailable() {
                        directWifiNetwork = null;
                        deliverDirectWifiState("unavailable", ssid, "Android could not connect to this Wi-Fi. Check the password and approve the Android connection dialog.");
                    }
                };
                connectivityManager.requestNetwork(request, directWifiCallback, 30000);
                deliverDirectWifiState("requesting", ssid, "Approve the Android Wi-Fi connection dialog if it appears.");
            } catch (Exception e) { deliverDirectWifiState("error", ssid, e.getMessage() == null ? e.toString() : e.getMessage()); }
        });
    }

    private void releaseDirectWifiNetwork() {
        directControllerOnline = false;
        ConnectivityManager.NetworkCallback cb = directWifiCallback;
        directWifiCallback = null; directWifiNetwork = null; directWifiSsid = null;
        if (cb != null && connectivityManager != null) {
            try { connectivityManager.unregisterNetworkCallback(cb); } catch (Exception ignored) { }
        }
    }

    private boolean hasValidatedInternet() {
        try {
            Network n = connectivityManager == null ? null : connectivityManager.getActiveNetwork();
            NetworkCapabilities c = n == null ? null : connectivityManager.getNetworkCapabilities(n);
            return c != null && c.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET) && c.hasCapability(NetworkCapabilities.NET_CAPABILITY_VALIDATED);
        } catch (Exception e) { return false; }
    }

    private boolean staConcurrencySupported() {
        if (wifiManager == null || Build.VERSION.SDK_INT < Build.VERSION_CODES.S) return false;
        try { return wifiManager.isStaConcurrencyForLocalOnlyConnectionsSupported(); } catch (Exception e) { return false; }
    }

    private String getDirectWifiStateJson() {
        JSONObject o = new JSONObject();
        try {
            o.put("connected", directWifiNetwork != null); o.put("ssid", directWifiSsid);
            o.put("internet_available", hasValidatedInternet()); o.put("sta_concurrency_supported", staConcurrencySupported());
            o.put("android_api", Build.VERSION.SDK_INT); o.put("host", "192.168.0.1");
        } catch (Exception ignored) { }
        return o.toString();
    }

    private void deliverDirectWifiState(String status, String ssid, String message) {
        try {
            JSONObject o = new JSONObject(getDirectWifiStateJson()); o.put("status", status); o.put("ssid", ssid); o.put("message", message);
            deliverJs("window.__orynNativeWifiConnection&&window.__orynNativeWifiConnection(" + o.toString() + ");");
        } catch (Exception ignored) { }
    }

    private void deliverJs(String js) { runOnUiThread(() -> { if (webView != null) webView.evaluateJavascript(js, null); }); }

    private Socket createDirectSocket() throws Exception {
        Network n = directWifiNetwork;
        return n != null ? n.getSocketFactory().createSocket() : new Socket();
    }

    // Only bind sockets to Android's local-only FluidNC AP network
    // when we are actually talking to the AP address.  Once FluidNC joins the
    // user's home Wi-Fi (STA), its 192.168.x.x address must use Android's
    // normal/default Wi-Fi route, otherwise a stale WifiNetworkSpecifier
    // network can make motion commands fail even while the browser works.
    private Socket createDirectSocketForHost(String host) throws Exception {
        String h = normalizeDirectHost(host);
        Network n = directWifiNetwork;
        if (n != null && ("192.168.0.1".equals(h) || "fluidnc".equalsIgnoreCase(h))) {
            return n.getSocketFactory().createSocket();
        }
        return new Socket();
    }

    private String configureFluidNcForHomeWifi(String rawHost, String rawSsid, String rawPassword) {
        JSONObject out = new JSONObject();
        try {
            String ssid = cleanFluidSetting(rawSsid); String password = cleanFluidSetting(rawPassword);
            if (ssid.isEmpty()) throw new IllegalArgumentException("Home Wi-Fi name is required");
            String host = normalizeDirectHost(rawHost);
            String[] commands = new String[]{"$Sta/SSID=" + ssid, "$Sta/Password=" + password, "$Sta/IPMode=DHCP", "$WiFi/Mode=STA>AP"};
            JSONArray responses = new JSONArray();
            for (String c : commands) {
                String r = telnetCommand(host, c, 2500); responses.put(r);
                if (r.toLowerCase(java.util.Locale.US).contains("error:")) throw new java.io.IOException(r.trim());
            }
            out.put("success", true); out.put("responses", responses);
            out.put("message", "Wi-Fi settings saved to FluidNC. Power-cycle the ESP32; it will join the new router/hotspot and keep its FluidNC AP as fallback.");
        } catch (Exception e) {
            try { out.put("success", false); out.put("detail", e.getMessage() == null ? e.toString() : e.getMessage()); } catch (Exception ignored) { }
        }
        return out.toString();
    }

    private String cleanFluidSetting(String raw) {
        return raw == null ? "" : raw.replace("\r", "").replace("\n", "").trim();
    }

    private void discoverFluidNcOnLanAsync(String preferredHost) {
        directNetworkExecutor.submit(() -> {
            JSONObject found = null;
            // 1) Fast path: last known/supplied IP. This is especially useful on
            // the phone's own hotspot where Android's default network is cellular.
            String preferred = preferredHost == null ? "" : preferredHost.trim();
            if (!preferred.isEmpty()) {
                try {
                    String h = normalizeDirectHost(preferred);
                    String r = telnetCommandDefault(h, "$I", 1100);
                    if (r.contains("FluidNC") || r.contains("Grbl")) {
                        found = new JSONObject(); found.put("host", h); found.put("response", r);
                    }
                } catch (Exception ignored) { }
            }
            // 2) mDNS on a normal home/studio LAN.
            if (found == null) {
                try {
                    String r = telnetCommandDefault("fluidnc.local", "$I", 1000);
                    if (r.contains("FluidNC") || r.contains("Grbl")) {
                        found = new JSONObject();
                        String resolved = "fluidnc.local";
                        try { String ip = InetAddress.getByName("fluidnc.local").getHostAddress(); if (ip != null && !ip.trim().isEmpty()) resolved = ip; } catch (Exception ignored) { }
                        found.put("host", resolved); found.put("response", r);
                    }
                } catch (Exception ignored) { }
            }
            // 3) Scan every private IPv4 interface, not just Android's active
            // Internet network. This includes the phone-hotspot/tether interface.
            if (found == null) {
                List<String> prefixes = local24Prefixes();
                if (!prefixes.isEmpty()) {
                    ExecutorService pool = Executors.newFixedThreadPool(40);
                    java.util.concurrent.atomic.AtomicReference<JSONObject> hit = new java.util.concurrent.atomic.AtomicReference<>();
                    List<Future<?>> jobs = new ArrayList<>();
                    for (String prefix : prefixes) {
                        for (int i=1; i<=254; i++) {
                            final String host = prefix + i;
                            if (!preferred.isEmpty() && host.equals(normalizeDirectHost(preferred))) continue;
                            jobs.add(pool.submit(() -> {
                                if (hit.get() != null) return;
                                try {
                                    String r = telnetCommandDefault(host, "$I", 420);
                                    if (r.contains("FluidNC") || r.contains("Grbl")) {
                                        JSONObject h = new JSONObject(); h.put("host", host); h.put("response", r); hit.compareAndSet(null, h);
                                    }
                                } catch (Exception ignored) { }
                            }));
                        }
                    }
                    for (Future<?> f : jobs) { if (hit.get() != null) break; try { f.get(); } catch (Exception ignored) { } }
                    pool.shutdownNow(); found = hit.get();
                }
            }
            try {
                JSONObject payload = new JSONObject(); payload.put("ok", found != null);
                if (found != null) payload.put("device", found);
                else payload.put("error", "No FluidNC controller found on the current Wi-Fi / phone-hotspot network.");
                deliverJs("window.__orynNativeFluidDiscovery&&window.__orynNativeFluidDiscovery(" + payload.toString() + ");");
            } catch (Exception ignored) { }
        });
    }

    private String activeWifi24Prefix() {
        try {
            Network n = connectivityManager == null ? null : connectivityManager.getActiveNetwork();
            if (n == null) return null;
            NetworkCapabilities caps = connectivityManager.getNetworkCapabilities(n);
            if (caps == null || !caps.hasTransport(NetworkCapabilities.TRANSPORT_WIFI)) return null;
            LinkProperties lp = connectivityManager.getLinkProperties(n); if (lp == null) return null;
            for (LinkAddress la : lp.getLinkAddresses()) {
                InetAddress a = la.getAddress(); if (!(a instanceof Inet4Address)) continue;
                String ip = a.getHostAddress(); int cut = ip == null ? -1 : ip.lastIndexOf('.');
                if (cut > 0) return ip.substring(0, cut + 1);
            }
        } catch (Exception ignored) { }
        return null;
    }

    private String telnetCommandDefault(String host, String command, int timeoutMs) throws Exception {
        String h = normalizeDirectHost(host);
        try (Socket sock = new Socket()) {
            sock.connect(new InetSocketAddress(h, 23), timeoutMs); sock.setSoTimeout(timeoutMs);
            OutputStream out = sock.getOutputStream(); InputStream in = sock.getInputStream();
            try { Thread.sleep(50); while (in.available() > 0) in.read(); } catch (Exception ignored) { }
            out.write((command + "\n").getBytes(StandardCharsets.UTF_8)); out.flush();
            StringBuilder sb = new StringBuilder(); long end = System.currentTimeMillis() + timeoutMs; byte[] buf = new byte[1024];
            while (System.currentTimeMillis() < end) {
                try { int n = in.read(buf); if (n < 0) break; sb.append(new String(buf,0,n,StandardCharsets.UTF_8)); String z=sb.toString().toLowerCase(); if(z.contains("\nok")||z.endsWith("ok\r\n")||z.equals("ok\n")||z.contains("error:"))break; }
                catch (java.net.SocketTimeoutException e) { break; }
            }
            return sb.toString();
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
        try { startActivityForResult(intent, SAVE_FILE_REQUEST); }
        catch (Exception e) {
            clearPendingSave();
            if (webView != null) webView.evaluateJavascript(
                    "window.__orynPatternDesignerFileSaved&&window.__orynPatternDesignerFileSaved(false,'','Unable to open Android file saver');", null);
        }
    }

    private void clearPendingSave() {
        pendingSaveName = null; pendingSaveMime = null; pendingSavePayload = null; pendingSaveBase64 = false;
    }

    private File directPatternDir() {
        File d = new File(getFilesDir(), "oryn_direct_patterns");
        if (!d.exists()) d.mkdirs();
        return d;
    }

    private String safeDirectPatternName(String raw) {
        String n = raw == null ? "pattern" : raw.trim();
        if (n.toLowerCase(java.util.Locale.US).endsWith(".thr")) n = n.substring(0, n.length() - 4);
        n = n.replaceAll("[^A-Za-z0-9 _.-]+", "_").replaceAll("\\s+", " ").trim();
        if (n.isEmpty()) n = "pattern";
        if (n.length() > 100) n = n.substring(0, 100).trim();
        return n + ".thr";
    }

    private JSONObject inspectThr(String thr) throws Exception {
        int count = 0; double firstT = 0, firstR = 0, lastT = 0, lastR = 0; boolean have = false;
        try (BufferedReader br = new BufferedReader(new StringReader(thr == null ? "" : thr))) {
            String line;
            while ((line = br.readLine()) != null) {
                String q = line.trim(); if (q.isEmpty() || q.startsWith("#")) continue;
                String[] v = q.split("[\\s,]+"); if (v.length < 2) continue;
                double t = Double.parseDouble(v[0]), r = Double.parseDouble(v[1]);
                if (!Double.isFinite(t) || !Double.isFinite(r)) throw new IllegalArgumentException("THR contains non-finite coordinates");
                if (r < -0.0001 || r > 1.0001) throw new IllegalArgumentException("THR rho must stay between 0 and 1");
                if (!have) { firstT = t; firstR = r; have = true; }
                lastT = t; lastR = r; count++;
            }
        }
        if (count < 2) throw new IllegalArgumentException("THR must contain at least two coordinates");
        JSONObject meta = new JSONObject();
        meta.put("coordinates_count", count);
        JSONObject first = new JSONObject(); first.put("x", firstT); first.put("y", firstR); meta.put("first_coordinate", first);
        JSONObject last = new JSONObject(); last.put("x", lastT); last.put("y", lastR); meta.put("last_coordinate", last);
        return meta;
    }

    private String saveDirectPattern(String name, String thr) {
        JSONObject out = new JSONObject();
        try {
            JSONObject meta = inspectThr(thr);
            String fileName = safeDirectPatternName(name);
            File f = new File(directPatternDir(), fileName);
            try (FileOutputStream fos = new FileOutputStream(f, false)) { fos.write(thr.getBytes(StandardCharsets.UTF_8)); fos.flush(); }
            out.put("success", true); out.put("name", fileName.substring(0, fileName.length() - 4));
            out.put("path", "custom/" + fileName); out.put("native_path", "user/" + fileName);
            out.put("date_modified", f.lastModified() / 1000.0); out.put("category", "custom");
            out.put("coordinates_count", meta.getInt("coordinates_count"));
            out.put("first_coordinate", meta.getJSONObject("first_coordinate")); out.put("last_coordinate", meta.getJSONObject("last_coordinate"));
        } catch (Exception e) {
            try { out.put("success", false); out.put("detail", e.getMessage() == null ? e.toString() : e.getMessage()); } catch (Exception ignored) {}
        }
        return out.toString();
    }

    private String listDirectPatterns() {
        JSONArray arr = new JSONArray();
        File[] files = directPatternDir().listFiles((dir, name) -> name.toLowerCase(java.util.Locale.US).endsWith(".thr"));
        if (files == null) return arr.toString();
        java.util.Arrays.sort(files, (a,b) -> a.getName().compareToIgnoreCase(b.getName()));
        for (File f : files) {
            try {
                String thr = readFileUtf8(f); JSONObject meta = inspectThr(thr); JSONObject o = new JSONObject();
                String fileName=f.getName(); o.put("path", "custom/"+fileName); o.put("native_path", "user/"+fileName);
                o.put("name", fileName.substring(0,fileName.length()-4)); o.put("category", "custom");
                o.put("date_modified", f.lastModified()/1000.0); o.put("coordinates_count", meta.getInt("coordinates_count"));
                o.put("first_coordinate", meta.getJSONObject("first_coordinate")); o.put("last_coordinate", meta.getJSONObject("last_coordinate")); arr.put(o);
            } catch (Exception ignored) {}
        }
        return arr.toString();
    }

    private File directPatternFileFromPath(String path) {
        String raw = path == null ? "" : path.trim();
        int slash = raw.lastIndexOf('/'); if (slash >= 0) raw = raw.substring(slash + 1);
        String safe = safeDirectPatternName(raw);
        return new File(directPatternDir(), safe);
    }

    private String readDirectPattern(String path) {
        try { File f=directPatternFileFromPath(path); return f.isFile()?readFileUtf8(f):""; } catch (Exception e) { return ""; }
    }

    private boolean deleteDirectPattern(String path) {
        try { File f=directPatternFileFromPath(path); return f.isFile() && f.delete(); } catch (Exception e) { return false; }
    }

    private String readFileUtf8(File f) throws Exception {
        StringBuilder sb=new StringBuilder();
        try (BufferedReader br=new BufferedReader(new InputStreamReader(new FileInputStream(f), StandardCharsets.UTF_8))) {
            String line; while((line=br.readLine())!=null) sb.append(line).append('\n');
        }
        return sb.toString();
    }

    private String normalizeDirectHost(String host) {
        String h = host == null ? "" : host.trim();
        h = h.replaceFirst("(?i)^https?://", "");
        int slash = h.indexOf('/'); if (slash >= 0) h = h.substring(0, slash);
        int colon = h.indexOf(':'); if (colon > 0) h = h.substring(0, colon);
        return h.isEmpty() ? "192.168.0.1" : h;
    }

    private String telnetCommand(String host, String command, int timeoutMs) throws Exception {
        String h = normalizeDirectHost(host);
        try (Socket sock = createDirectSocketForHost(h)) {
            sock.connect(new InetSocketAddress(h, 23), timeoutMs);
            sock.setSoTimeout(timeoutMs);
            OutputStream out = sock.getOutputStream();
            InputStream in = sock.getInputStream();
            try { Thread.sleep(80); while (in.available() > 0) in.read(); } catch (Exception ignored) {}
            StringBuilder all = new StringBuilder();
            String[] lines = String.valueOf(command == null ? "" : command).split("\\r?\\n");
            for (String raw : lines) {
                String line = raw.trim();
                if (line.isEmpty()) continue;
                out.write((line + "\n").getBytes(StandardCharsets.UTF_8)); out.flush();
                String response = readCommandResponse(in, timeoutMs);
                if (all.length() > 0) all.append("\n");
                all.append(response);
                if (response.toLowerCase(java.util.Locale.US).contains("error:")) break;
            }
            return all.toString();
        }
    }

    private String readCommandResponse(InputStream in, int timeoutMs) throws Exception {
        StringBuilder sb = new StringBuilder();
        long end = System.currentTimeMillis() + timeoutMs;
        byte[] buf = new byte[1024];
        while (System.currentTimeMillis() < end) {
            try {
                int n = in.read(buf); if (n < 0) break;
                sb.append(new String(buf, 0, n, StandardCharsets.UTF_8));
                String z = sb.toString().toLowerCase(java.util.Locale.US);
                if (z.contains("\nok") || z.endsWith("ok\r\n") || z.equals("ok\n") || z.contains("error:")) break;
            } catch (java.net.SocketTimeoutException e) { break; }
        }
        return sb.toString();
    }

    private String readStatusFrame(InputStream in, int timeoutMs) throws Exception {
        StringBuilder sb = new StringBuilder();
        long end = System.currentTimeMillis() + timeoutMs;
        byte[] b = new byte[512];
        while (System.currentTimeMillis() < end) {
            try {
                int n = in.read(b); if (n < 0) break;
                sb.append(new String(b, 0, n, StandardCharsets.UTF_8));
                if (sb.indexOf(">") >= 0) break;
            } catch (java.net.SocketTimeoutException e) { break; }
        }
        return sb.toString();
    }

    private void runDirectHome(String host, double rhoTravelUnits, double rhoDirection, double feed) {
        Socket sock = null;
        boolean transportConnected = false;
        try {
            String h = normalizeDirectHost(host);
            sock = createDirectSocketForHost(h); directPatternSocket = sock;
            sock.connect(new InetSocketAddress(h, 23), 2500);
            transportConnected = true;
            directControllerOnline = true;
            sock.setSoTimeout(1200);
            OutputStream out = sock.getOutputStream(); InputStream in = sock.getInputStream();
            try { Thread.sleep(100); while (in.available() > 0) in.read(); } catch (Exception ignored) {}
            sendAndWaitOk(out, in, "$X");
            String jog = String.format(java.util.Locale.US, "$J=G91 G21 Y%.5f F%.3f", -rhoTravelUnits * rhoDirection, feed);
            sendAndWaitOk(out, in, jog);
            long deadline = System.currentTimeMillis() + 120000L;
            boolean idle = false;
            while (!directStopRequested.get() && System.currentTimeMillis() < deadline) {
                out.write('?'); out.flush();
                String status = readStatusFrame(in, 1000);
                if (status.contains("<Idle")) { idle = true; break; }
                Thread.sleep(180);
            }
            if (directStopRequested.get()) return;
            if (!idle) throw new java.io.IOException("Timed out waiting for FluidNC to finish homing");
            sendAndWaitOk(out, in, "G92 X0 Y0");
            directTheta = 0.0; directRho = 0.0; directControllerOnline = true;
        } catch (Exception e) {
            // A rejected/timeout motion command does not mean FluidNC disappeared.
            // Only a failure before the Telnet socket connected marks the controller offline.
            if (!transportConnected) directControllerOnline = false;
            directLastError = e.getMessage() == null ? e.toString() : e.getMessage();
        } finally {
            try { if (sock != null) sock.close(); } catch (Exception ignored) {}
            if (directPatternSocket == sock) directPatternSocket = null;
            directHoming.set(false); directStopRequested.set(false);
        }
    }

    private static final class DirectKinematicsProfile {
        double xStepsPerMm;
        double yStepsPerMm;
        double gearRatio;
        double sourceSign;
        String machineName;
    }

    private DirectKinematicsProfile detectDirectKinematics(String host) {
        DirectKinematicsProfile k = new DirectKinematicsProfile();
        String response = "";
        try {
            response = telnetCommand(host,
                    "$I\n$/axes/x/steps_per_mm\n$/axes/y/steps_per_mm", 2500);
        } catch (Exception ignored) { }

        k.machineName = extractFluidNcMachineName(response);
        k.xStepsPerMm = extractFluidNcSetting(response, "x", "steps_per_mm");
        k.yStepsPerMm = extractFluidNcSetting(response, "y", "steps_per_mm");

        String machine = k.machineName == null ? "" : k.machineName.toLowerCase(java.util.Locale.US);
        // ORYN Mini / 28BYJ-48 measured physical coupling (confirmed on the
        // actual table): X+ requires Y- compensation and X- requires Y+.
        // These are mechanical/controller scale constants, NOT the user's saved
        // Full Circle or Perimeter calibration values. Those live values are
        // still supplied separately as thetaRevUnits / rhoTravelUnits.
        boolean miniByj = machine.contains("28byj") || machine.contains("mini");
        if (miniByj) {
            k.xStepsPerMm = MINI_X_STEPS_PER_MM;
            k.yStepsPerMm = MINI_Y_STEPS_PER_MM;
            k.gearRatio = MINI_GEAR_RATIO;
            k.sourceSign = MINI_COUPLING_SIGN;
        } else {
            // Preserve the existing non-Mini V9 behavior.
            k.gearRatio = 10.0;
            k.sourceSign = 1.0;
        }

        directXStepsPerMm = k.xStepsPerMm;
        directYStepsPerMm = k.yStepsPerMm;
        directGearRatio = k.gearRatio;
        directCouplingSign = k.sourceSign;
        directMachineName = k.machineName == null ? "" : k.machineName;
        return k;
    }

    private String extractFluidNcMachineName(String response) {
        if (response == null) return "";
        java.util.regex.Matcher m = java.util.regex.Pattern
                .compile("(?im)\\[MSG:Machine:([^\\]\\r\\n]+)\\]")
                .matcher(response);
        return m.find() ? m.group(1).trim() : "";
    }

    private double extractFluidNcSetting(String response, String axis, String key) {
        if (response == null) return 0.0;
        String a = java.util.regex.Pattern.quote(axis);
        String k = java.util.regex.Pattern.quote(key);
        java.util.regex.Pattern[] ps = new java.util.regex.Pattern[]{
                java.util.regex.Pattern.compile("(?im)\\$/axes/" + a + "/" + k + "\\s*=\\s*([-+0-9.eE]+)"),
                java.util.regex.Pattern.compile("(?im)axes/" + a + "/" + k + "\\s*=\\s*([-+0-9.eE]+)")
        };
        for (java.util.regex.Pattern p : ps) {
            java.util.regex.Matcher m = p.matcher(response);
            if (m.find()) {
                try { return Math.abs(Double.parseDouble(m.group(1))); } catch (Exception ignored) { }
            }
        }
        return 0.0;
    }

    private double directCouplingOffset(double xIncrement, double rhoDirection, DirectKinematicsProfile k) {
        if (k == null || !(k.xStepsPerMm > 0.0) || !(k.yStepsPerMm > 0.0) || !(k.gearRatio > 0.0)) return 0.0;
        return xIncrement * (k.xStepsPerMm / (k.gearRatio * k.yStepsPerMm)) * k.sourceSign * rhoDirection;
    }

    private boolean isDirectClearFromIn(String displayName) {
        if (displayName == null) return false;
        String n = new File(displayName).getName().toLowerCase(java.util.Locale.US);
        return n.equals("clear_from_in.thr");
    }

    private boolean isDirectClearFromOut(String displayName) {
        if (displayName == null) return false;
        String n = new File(displayName).getName().toLowerCase(java.util.Locale.US);
        return n.equals("clear_from_out.thr");
    }

    private double directClearRhoTarget(double requestedRho, double previousRho,
                                        boolean clearFromIn, boolean clearFromOut,
                                        boolean firstPoint) {
        double r = Math.max(0.0, Math.min(1.0, requestedRho));
        // The first THR coordinate is the required clear entry position:
        // clear_from_in starts at Center; clear_from_out starts at Perimeter.
        if (firstPoint) return r;
        if (clearFromIn) return Math.max(previousRho, r);
        if (clearFromOut) return Math.min(previousRho, r);
        return r;
    }

    private double planDirectFeed(double dx, double dy, double requestedFeed) {
        // Match ORYN V9: the selected speed is a ceiling, never amplified.
        // The current compact controller is already configured with higher axis
        // max-rates than the default 60 feed, so no extra scaling is required.
        return Math.max(0.5, requestedFeed > 0.0 ? requestedFeed : 1.0);
    }

    private String runDirectLogicalMove(String host, double targetTheta, double targetRho,
                                        double thetaRevUnits, double rhoTravelUnits,
                                        double rhoDirection, double feed) {
        JSONObject result = new JSONObject();
        try {
            if (!Double.isFinite(targetTheta) || !Double.isFinite(targetRho) || targetRho < -0.0001 || targetRho > 1.0001)
                throw new IllegalArgumentException("Invalid logical Theta-Rho target");
            String h = normalizeDirectHost(host);
            DirectKinematicsProfile kin = detectDirectKinematics(h);
            double deltaTheta = targetTheta - directTheta;
            double deltaRho = targetRho - directRho;
            double dx = (deltaTheta / (Math.PI * 2.0)) * thetaRevUnits;
            double dyGeometry = deltaRho * rhoTravelUnits * rhoDirection;
            double dy = dyGeometry + directCouplingOffset(dx, rhoDirection, kin);
            double f = planDirectFeed(dx, dy, feed);
            String response = telnetCommand(h,
                    String.format(java.util.Locale.US, "$X\nG91 G21 G1 X%.6f Y%.6f F%.3f\nG90", dx, dy, f),
                    10000);
            if (response.toLowerCase(java.util.Locale.US).contains("error:"))
                throw new java.io.IOException(response.trim());
            directTheta = targetTheta;
            directRho = targetRho;
            directControllerOnline = true;
            directLastError = "";
            result.put("success", true);
            result.put("theta", directTheta); result.put("rho", directRho);
            result.put("dx", dx); result.put("dy", dy);
        } catch (Exception e) {
            directLastError = e.getMessage() == null ? e.toString() : e.getMessage();
            try { result.put("success", false); result.put("detail", directLastError); } catch (Exception ignored) {}
        }
        return result.toString();
    }

    private void runDirectPattern(String host, String assetPathsJson, double thetaRevUnits, double rhoTravelUnits, double rhoDirection, double feed) {
        Socket sock = null;
        try {
            JSONArray paths = new JSONArray(assetPathsJson);
            String h = normalizeDirectHost(host);
            DirectKinematicsProfile kin = detectDirectKinematics(h);

            // One exclusive Telnet motion session owns FluidNC for the complete
            // clear + pattern sequence. No polling/probe socket is opened while
            // directRunning/directHoming is active.
            sock = createDirectSocketForHost(h); directPatternSocket = sock;
            sock.connect(new InetSocketAddress(h, 23), 2500);
            sock.setKeepAlive(true);
            // A short SO_TIMEOUT is only a read heartbeat. Socket timeout means
            // planner back-pressure / still waiting; it is NEVER completion.
            sock.setSoTimeout(2000);
            directControllerOnline = true;
            OutputStream out = sock.getOutputStream(); InputStream in = sock.getInputStream();
            try { Thread.sleep(100); while (in.available() > 0) in.read(); } catch (Exception ignored) {}
            sendDirectPatternAndWaitOk(out, in, "$X");
            sendDirectPatternAndWaitOk(out, in, "G21");

            for (int pi=0; pi<paths.length() && !directStopRequested.get(); pi++) {
                Object item = paths.opt(pi);
                String rel;
                String displayName;
                if (item instanceof JSONObject) {
                    JSONObject spec = (JSONObject) item;
                    rel = spec.optString("asset", "");
                    displayName = spec.optString("display", rel);
                } else {
                    rel = paths.optString(pi, "");
                    displayName = rel;
                }
                if (rel.startsWith("/")) rel = rel.substring(1);
                if (displayName == null || displayName.trim().isEmpty()) displayName = rel;
                directCurrentFile = displayName;
                List<double[]> pts = new ArrayList<>();
                BufferedReader directReader;
                if (rel.startsWith("user/")) {
                    File f = directPatternFileFromPath(rel);
                    if (!f.isFile()) throw new java.io.FileNotFoundException("ORYN Direct pattern not found: " + rel);
                    directReader = new BufferedReader(new InputStreamReader(new FileInputStream(f), StandardCharsets.UTF_8));
                } else {
                    directReader = new BufferedReader(new InputStreamReader(getAssets().open("www/" + rel), StandardCharsets.UTF_8));
                }
                try (BufferedReader br = directReader) {
                    String line;
                    while ((line = br.readLine()) != null) {
                        String q = line.trim(); if (q.isEmpty() || q.startsWith("#")) continue;
                        String[] v = q.split("[\\s,]+"); if (v.length < 2) continue;
                        try { pts.add(new double[]{Double.parseDouble(v[0]), Double.parseDouble(v[1])}); } catch (Exception ignored) {}
                    }
                }
                directTotal = pts.size(); directPoint = 0;

                // Theta is periodic. Shift the entire file by an integer number of
                // turns so its first angle is nearest the current logical theta.
                double thetaOffset = 0.0;
                if (!pts.isEmpty()) {
                    double firstTheta = pts.get(0)[0];
                    double turns = Math.rint((directTheta - firstTheta) / (Math.PI * 2.0));
                    thetaOffset = turns * Math.PI * 2.0;
                }

                final boolean clearFromIn = isDirectClearFromIn(displayName);
                final boolean clearFromOut = isDirectClearFromOut(displayName);
                int acknowledgedPoints = 0;
                int pointIndex = 0;
                for (double[] pt : pts) {
                    if (directStopRequested.get()) break;
                    while (directPaused.get() && !directStopRequested.get()) Thread.sleep(80);
                    if (directStopRequested.get()) break;

                    double targetTheta = pt[0] + thetaOffset;
                    double targetRho = directClearRhoTarget(pt[1], directRho, clearFromIn, clearFromOut, pointIndex == 0);
                    double deltaTheta = targetTheta - directTheta;
                    double deltaRho = targetRho - directRho;

                    // Measured ORYN Mini Theta/Rho conversion. Saved live Full
                    // Circle and Perimeter calibrations remain the only geometry
                    // scale inputs. Coupling is based on the measured mechanism:
                    // dYcoupling = -dX * 256 / (6.25 * 210) * rhoDirection.
                    double xIncrement = (deltaTheta / (Math.PI * 2.0)) * thetaRevUnits;
                    double yGeometryIncrement = deltaRho * rhoTravelUnits * rhoDirection;
                    double couplingOffset = directCouplingOffset(xIncrement, rhoDirection, kin);
                    double yIncrement = yGeometryIncrement + couplingOffset;
                    double plannedFeed = planDirectFeed(xIncrement, yIncrement, feed);

                    if (!Double.isFinite(xIncrement) || !Double.isFinite(yIncrement))
                        throw new java.io.IOException("Invalid coupled Theta-Rho motor delta");

                    String g = String.format(java.util.Locale.US,
                            "G91 G21 G1 X%.6f Y%.6f F%.3f",
                            xIncrement, yIncrement, plannedFeed);

                    // Exactly-once relative motion: transmit once, then wait for
                    // that command's real ok/error. A read timeout only continues
                    // waiting; this command is NEVER resent after uncertainty.
                    sendDirectPatternAndWaitOk(out, in, g);

                    directTheta = targetTheta;
                    directRho = targetRho;
                    directPoint++;
                    acknowledgedPoints++;

                    // The first point is the physical entry position. Match the
                    // existing ORYN behavior but use the same no-abort Idle wait.
                    if (pointIndex == 0 && !directStopRequested.get())
                        waitForDirectIdle(out, in);
                    pointIndex++;
                }

                if (!directStopRequested.get()) {
                    // Completion is impossible until every parsed THR coordinate
                    // in this file has received its FluidNC acknowledgement.
                    if (acknowledgedPoints != pts.size())
                        throw new java.io.IOException("Direct streamer ended before all THR points were acknowledged");
                    // After the final coordinate, keep querying FluidNC until it
                    // explicitly reports <Idle>. Only then may this file complete.
                    waitForDirectIdle(out, in);
                }
            }

            // Restore absolute mode only AFTER all THR files and final Idle.
            if (!directStopRequested.get()) sendDirectPatternAndWaitOk(out, in, "G90");
        } catch (Exception e) {
            String detail = e.getMessage() == null ? e.toString() : e.getMessage();
            String file = directCurrentFile == null ? "pattern" : directCurrentFile;
            directLastError = "Pattern " + file + " stopped at point " + directPoint + "/" + directTotal + ": " + detail;
        }
        finally {
            if (directPatternSocket == sock) directPatternSocket = null;
            try { if (sock != null) sock.close(); } catch (Exception ignored) {}
            directRunning.set(false); directPaused.set(false); directStopRequested.set(false); directCurrentFile = null;
        }
    }

    private void waitForDirectIdle(OutputStream out, InputStream in) throws Exception {
        while (true) {
            if (directStopRequested.get()) throw new java.io.InterruptedIOException("ORYN Direct motion stopped");
            out.write('?'); out.flush();
            String status = readStatusFrame(in, 1200);
            String z = status == null ? "" : status.toLowerCase(java.util.Locale.US);
            if (z.contains("<idle")) return;
            if (containsFluidNcAlarm(z) || z.contains("error:"))
                throw new java.io.IOException(status.trim().isEmpty() ? "FluidNC reported an error" : status.trim());
            // Empty status / socket timeout is waiting/back-pressure, not completion.
            Thread.sleep(100);
        }
    }

    // Existing non-pattern command sender retained for Home/calibration/manual
    // actions. Direct pattern playback uses the separate no-abort streamer below.
    private void sendAndWaitOk(OutputStream out, InputStream in, String line) throws Exception {
        sendAndWaitOk(out, in, line, 180000L);
    }

    private void sendAndWaitOk(OutputStream out, InputStream in, String line, long acknowledgementDeadlineMs) throws Exception {
        out.write((line + "\n").getBytes(StandardCharsets.UTF_8)); out.flush();
        StringBuilder sb = new StringBuilder();
        byte[] b = new byte[512];
        long deadline = System.currentTimeMillis() + Math.max(5000L, acknowledgementDeadlineMs);
        while (System.currentTimeMillis() < deadline) {
            if (directStopRequested.get()) throw new java.io.InterruptedIOException("ORYN Direct motion stopped");
            try {
                int n = in.read(b);
                if (n < 0) throw new java.io.IOException("FluidNC connection closed");
                sb.append(new String(b, 0, n, StandardCharsets.UTF_8));
                String z = sb.toString().toLowerCase(java.util.Locale.US);
                if (z.contains("error:")) throw new java.io.IOException(sb.toString().trim());
                if (containsFluidNcOk(z)) return;
            } catch (java.net.SocketTimeoutException timeout) {
                // Preserve existing non-pattern behavior.
            }
        }
        throw new java.io.IOException("FluidNC acknowledgement timed out while motion planner was busy: " + line);
    }

    private void sendDirectPatternAndWaitOk(OutputStream out, InputStream in, String line) throws Exception {
        out.write((line + "\n").getBytes(StandardCharsets.UTF_8)); out.flush();
        StringBuilder sb = new StringBuilder();
        byte[] b = new byte[512];
        while (true) {
            if (directStopRequested.get()) throw new java.io.InterruptedIOException("ORYN Direct motion stopped");
            try {
                int n = in.read(b);
                if (n < 0) throw new java.io.EOFException("FluidNC connection closed");
                sb.append(new String(b, 0, n, StandardCharsets.UTF_8));
                String z = sb.toString().toLowerCase(java.util.Locale.US);
                if (containsFluidNcAlarm(z) || z.contains("error:"))
                    throw new java.io.IOException(sb.toString().trim());
                if (containsFluidNcOk(z)) return;
            } catch (java.net.SocketTimeoutException timeout) {
                // Critical Direct streaming rule: timeout means continue waiting.
                // Never treat it as completion and never resend this relative move.
            }
        }
    }

    private boolean containsFluidNcAlarm(String z) {
        if (z == null || z.isEmpty()) return false;
        return z.startsWith("alarm:") || z.contains("\nalarm:") || z.contains("\ralarm:");
    }

    private boolean containsFluidNcOk(String z) {
        if (z == null || z.isEmpty()) return false;
        return z.equals("ok") || z.equals("ok\n") || z.equals("ok\r\n")
                || z.startsWith("ok\n") || z.startsWith("ok\r\n")
                || z.contains("\nok\n") || z.contains("\nok\r\n")
                || z.endsWith("\nok") || z.endsWith("\nok\r\n");
    }

    private void directRealtime(byte b) {
        try { Socket s = directPatternSocket; if (s != null && s.isConnected() && !s.isClosed()) { s.getOutputStream().write(b); s.getOutputStream().flush(); } } catch (Exception ignored) {}
    }

    private void directStop() {
        directStopRequested.set(true); directPaused.set(false);
        try { Socket s = directPatternSocket; if (s != null && s.isConnected() && !s.isClosed()) { s.getOutputStream().write(0x18); s.getOutputStream().flush(); s.close(); } } catch (Exception ignored) {}
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
