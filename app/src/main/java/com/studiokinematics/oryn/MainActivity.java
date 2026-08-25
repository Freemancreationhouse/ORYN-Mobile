package com.studiokinematics.oryn;

import android.Manifest;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.graphics.drawable.GradientDrawable;
import android.net.ConnectivityManager;
import android.net.LinkAddress;
import android.net.LinkProperties;
import android.net.Network;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.Toast;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * ORYN Mobile 2.0
 *
 * The complete ORYN frontend is bundled inside the APK and opens immediately.
 * The Raspberry Pi / ORYN controller is a connection target, not the source of
 * the Android interface. Once selected, the existing frontend apiClient talks
 * directly to that ORYN table over Wi-Fi (including WebSockets).
 */
public class MainActivity extends Activity {
    private static final String PREFS = "oryn_mobile";
    private static final String PREF_LAST_URL = "last_url";
    private static final int FILE_CHOOSER_REQUEST = 9001;
    private static final int NEARBY_PERMISSION_REQUEST = 9002;

    private static final int C_BLACK = Color.rgb(11, 13, 16);
    private static final int C_PANEL = Color.rgb(20, 23, 27);
    private static final int C_BRASS = Color.rgb(199, 164, 99);
    private static final int C_IVORY = Color.rgb(243, 240, 234);

    private FrameLayout root;
    private WebView webView;
    private Button connectButton;
    private LocalOrynServer localServer;
    private ExecutorService discoveryPool;
    private int discoveryGeneration = 0;
    private ValueCallback<Uri[]> filePathCallback;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().setStatusBarColor(C_BLACK);
        getWindow().setNavigationBarColor(C_BLACK);

        buildUi();
        configureWebView();
        requestNearbyPermissionIfUseful();

        localServer = new LocalOrynServer(this);
        try {
            localServer.start();
            webView.loadUrl(LocalOrynServer.BASE_URL + "/");
        } catch (Exception e) {
            new AlertDialog.Builder(this)
                    .setTitle("ORYN could not start")
                    .setMessage("The local Android interface could not be started.\n\n" + e.getMessage())
                    .setPositiveButton("Close", (d, w) -> finish())
                    .show();
            return;
        }

        // Discovery is intentionally background-only. It never blocks the UI.
        webView.postDelayed(this::startBackgroundDiscovery, 1200);
    }

    private void buildUi() {
        root = new FrameLayout(this);
        root.setBackgroundColor(C_BLACK);

        webView = new WebView(this);
        webView.setBackgroundColor(C_BLACK);
        root.addView(webView, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT));

        connectButton = new Button(this);
        connectButton.setText("Connect Table");
        connectButton.setAllCaps(false);
        connectButton.setTextColor(Color.rgb(12, 12, 10));
        connectButton.setTextSize(13);
        connectButton.setTypeface(android.graphics.Typeface.DEFAULT_BOLD);
        connectButton.setPadding(dp(14), 0, dp(14), 0);
        GradientDrawable bg = new GradientDrawable();
        bg.setCornerRadius(dp(14));
        bg.setColor(C_BRASS);
        bg.setStroke(dp(1), C_BRASS);
        connectButton.setBackground(bg);
        connectButton.setElevation(dp(8));
        connectButton.setOnClickListener(v -> showConnectDialog());

        FrameLayout.LayoutParams cp = new FrameLayout.LayoutParams(dp(128), dp(46));
        cp.gravity = Gravity.TOP | Gravity.END;
        cp.topMargin = dp(14);
        cp.rightMargin = dp(14);
        root.addView(connectButton, cp);

        setContentView(root);
    }

    private void configureWebView() {
        WebSettings s = webView.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setAllowFileAccess(true);
        s.setAllowContentAccess(true);
        s.setLoadsImagesAutomatically(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setUseWideViewPort(true);
        s.setLoadWithOverviewMode(false);
        s.setBuiltInZoomControls(false);
        s.setDisplayZoomControls(false);
        s.setCacheMode(WebSettings.LOAD_DEFAULT);
        s.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        s.setUserAgentString(s.getUserAgentString() + " ORYN-Mobile/2.0 Standalone");

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback,
                                             FileChooserParams params) {
                if (filePathCallback != null) filePathCallback.onReceiveValue(null);
                filePathCallback = callback;
                Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
                intent.addCategory(Intent.CATEGORY_OPENABLE);
                intent.setType("*/*");
                intent.putExtra(Intent.EXTRA_MIME_TYPES, new String[]{
                        "image/png", "image/jpeg", "image/webp", "image/bmp",
                        "image/svg+xml", "application/dxf", "image/vnd.dxf",
                        "text/plain", "application/octet-stream"
                });
                try {
                    startActivityForResult(intent, FILE_CHOOSER_REQUEST);
                    return true;
                } catch (ActivityNotFoundException e) {
                    filePathCallback = null;
                    Toast.makeText(MainActivity.this, "No file picker is available.", Toast.LENGTH_LONG).show();
                    return false;
                }
            }
        });

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                connectButton.bringToFront();
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                if (request.isForMainFrame() && request.getUrl().toString().startsWith(LocalOrynServer.BASE_URL)) {
                    Toast.makeText(MainActivity.this, "ORYN mobile interface failed to load.", Toast.LENGTH_LONG).show();
                }
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                String scheme = uri.getScheme();
                if ("http".equalsIgnoreCase(scheme) || "https".equalsIgnoreCase(scheme)) return false;
                try { startActivity(new Intent(Intent.ACTION_VIEW, uri)); } catch (Exception ignored) {}
                return true;
            }
        });
    }

    private void showConnectDialog() {
        String last = getPreferencesStore().getString(PREF_LAST_URL, "");
        final EditText input = new EditText(this);
        input.setSingleLine(true);
        input.setHint("oryn.local or 192.168.0.224");
        input.setText(last == null ? "" : last.replace("http://", "").replace("https://", ""));
        input.setTextColor(Color.BLACK);
        input.setHintTextColor(Color.DKGRAY);
        input.setPadding(dp(14), dp(8), dp(14), dp(8));

        AlertDialog dialog = new AlertDialog.Builder(this)
                .setTitle("Connect ORYN Table")
                .setMessage("The app works independently. Enter a table address, or let ORYN search your Wi-Fi.")
                .setView(input)
                .setNegativeButton("Cancel", null)
                .setNeutralButton("Search Wi-Fi", null)
                .setPositiveButton("Connect", null)
                .create();
        dialog.setOnShowListener(d -> {
            dialog.getButton(AlertDialog.BUTTON_NEUTRAL).setOnClickListener(v -> {
                dialog.dismiss();
                Toast.makeText(this, "Searching for ORYN on your Wi-Fi…", Toast.LENGTH_SHORT).show();
                startBackgroundDiscovery(true);
            });
            dialog.getButton(AlertDialog.BUTTON_POSITIVE).setOnClickListener(v -> {
                String value = input.getText().toString().trim();
                if (value.isEmpty()) return;
                dialog.dismiss();
                connectToTable(normalizeBase(value), true);
            });
        });
        dialog.show();
    }

    private void startBackgroundDiscovery() { startBackgroundDiscovery(false); }

    private void startBackgroundDiscovery(boolean userInitiated) {
        final int generation = ++discoveryGeneration;
        if (discoveryPool != null) discoveryPool.shutdownNow();
        discoveryPool = Executors.newFixedThreadPool(32);

        String last = getPreferencesStore().getString(PREF_LAST_URL, null);
        discoveryPool.execute(() -> {
            if (generation != discoveryGeneration) return;
            if (last != null && probeOryn(last)) {
                if (userInitiated) runOnUiThread(() -> showFoundDialog(last));
                return;
            }
            String local = "http://oryn.local";
            if (probeOryn(local)) {
                runOnUiThread(() -> showFoundDialog(local));
                return;
            }
            scanLocalSubnet(generation, userInitiated);
        });
    }

    private void scanLocalSubnet(int generation, boolean userInitiated) {
        NetworkAddressInfo info = getActiveIpv4();
        if (info == null) {
            if (userInitiated) runOnUiThread(() -> Toast.makeText(this, "No local Wi-Fi address detected.", Toast.LENGTH_LONG).show());
            return;
        }
        List<String> candidates = subnetCandidates(info);
        AtomicBoolean found = new AtomicBoolean(false);
        java.util.concurrent.atomic.AtomicInteger remaining = new java.util.concurrent.atomic.AtomicInteger(candidates.size());
        for (String ip : candidates) {
            discoveryPool.execute(() -> {
                try {
                    if (generation != discoveryGeneration || found.get()) return;
                    String base = "http://" + ip;
                    if (probeOryn(base) && found.compareAndSet(false, true)) {
                        runOnUiThread(() -> showFoundDialog(base));
                    }
                } finally {
                    if (remaining.decrementAndGet() == 0 && !found.get() && userInitiated && generation == discoveryGeneration) {
                        runOnUiThread(() -> Toast.makeText(this, "No ORYN table found. The app remains available offline.", Toast.LENGTH_LONG).show());
                    }
                }
            });
        }
    }

    private void showFoundDialog(String base) {
        String normalized = normalizeBase(base);
        new AlertDialog.Builder(this)
                .setTitle("ORYN table found")
                .setMessage(normalized + "\n\nConnect this Android app to the table?")
                .setNegativeButton("Later", null)
                .setPositiveButton("Connect", (d, w) -> connectToTable(normalized, false))
                .show();
    }

    private void connectToTable(String base, boolean verifyFirst) {
        ExecutorService one = Executors.newSingleThreadExecutor();
        one.execute(() -> {
            try {
                String normalized = normalizeBase(base);
                if (verifyFirst && !probeOryn(normalized)) {
                    runOnUiThread(() -> Toast.makeText(this, "No ORYN server responded at " + normalized, Toast.LENGTH_LONG).show());
                    return;
                }
                TableInfo info = fetchTableInfo(normalized);
                if (info == null) {
                    runOnUiThread(() -> Toast.makeText(this, "ORYN table information could not be read.", Toast.LENGTH_LONG).show());
                    return;
                }
                getPreferencesStore().edit().putString(PREF_LAST_URL, normalized).apply();
                runOnUiThread(() -> activateTableInFrontend(normalized, info));
            } finally {
                one.shutdown();
            }
        });
    }

    private TableInfo fetchTableInfo(String base) {
        HttpURLConnection c = null;
        try {
            c = (HttpURLConnection) new URL(base + "/api/table-info").openConnection();
            c.setConnectTimeout(2500);
            c.setReadTimeout(2500);
            c.setUseCaches(false);
            int code = c.getResponseCode();
            if (code != 200) return null;
            String body = readBody(c);
            JSONObject o = new JSONObject(body);
            return new TableInfo(o.optString("id", base), o.optString("name", "ORYN"), o.optString("version", ""));
        } catch (Exception e) {
            return null;
        } finally {
            if (c != null) c.disconnect();
        }
    }

    private void activateTableInFrontend(String base, TableInfo info) {
        try {
            JSONObject table = new JSONObject();
            table.put("id", info.id);
            table.put("name", info.name);
            table.put("appName", "ORYN");
            table.put("url", base);
            Uri u = Uri.parse(base);
            table.put("host", u.getHost());
            if (u.getPort() > 0) table.put("port", u.getPort());
            table.put("version", info.version);
            table.put("isOnline", true);
            table.put("isCurrent", false);

            String tableJson = table.toString();
            String js = "(function(){try{" +
                    "var t=" + tableJson + ";" +
                    "var k='orynmotion_tables';var a='orynmotion_active_table';" +
                    "var d={tables:[],activeTableId:t.id};" +
                    "try{var old=JSON.parse(localStorage.getItem(k)||'{}');if(Array.isArray(old.tables))d.tables=old.tables;}catch(e){}" +
                    "d.tables=d.tables.filter(function(x){return x.id!==t.id && x.id!=='oryn-mobile-local';});" +
                    "d.tables.unshift(t);localStorage.setItem(k,JSON.stringify(d));localStorage.setItem(a,t.id);" +
                    "location.reload();" +
                    "}catch(e){console.error(e);}})();";
            webView.evaluateJavascript(js, null);
            Toast.makeText(this, "Connected to " + info.name, Toast.LENGTH_SHORT).show();
        } catch (Exception e) {
            Toast.makeText(this, "Could not activate ORYN table.", Toast.LENGTH_LONG).show();
        }
    }

    private boolean probeOryn(String base) {
        HttpURLConnection c = null;
        try {
            URL url = new URL(normalizeBase(base) + "/api/app-name");
            c = (HttpURLConnection) url.openConnection();
            c.setConnectTimeout(800);
            c.setReadTimeout(800);
            c.setUseCaches(false);
            c.setRequestProperty("Accept", "application/json");
            int code = c.getResponseCode();
            if (code != 200) return false;
            String body = readBody(c);
            return body.toUpperCase(Locale.US).contains("ORYN");
        } catch (Exception ignored) {
            return false;
        } finally {
            if (c != null) c.disconnect();
        }
    }

    private static String readBody(HttpURLConnection c) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(c.getInputStream()));
        StringBuilder body = new StringBuilder();
        String line;
        while ((line = br.readLine()) != null) body.append(line);
        br.close();
        return body.toString();
    }

    private void requestNearbyPermissionIfUseful() {
        if (Build.VERSION.SDK_INT >= 33 && checkSelfPermission(Manifest.permission.NEARBY_WIFI_DEVICES) != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(new String[]{Manifest.permission.NEARBY_WIFI_DEVICES}, NEARBY_PERMISSION_REQUEST);
        }
    }

    private String normalizeBase(String value) {
        String v = value.trim();
        if (!v.startsWith("http://") && !v.startsWith("https://")) v = "http://" + v;
        while (v.endsWith("/")) v = v.substring(0, v.length() - 1);
        return v;
    }

    private NetworkAddressInfo getActiveIpv4() {
        try {
            ConnectivityManager cm = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
            Network network = cm.getActiveNetwork();
            if (network == null) return null;
            LinkProperties lp = cm.getLinkProperties(network);
            if (lp == null) return null;
            for (LinkAddress la : lp.getLinkAddresses()) {
                InetAddress address = la.getAddress();
                if (address instanceof Inet4Address && !address.isLoopbackAddress() && !address.isLinkLocalAddress()) {
                    return new NetworkAddressInfo((Inet4Address) address, la.getPrefixLength());
                }
            }
        } catch (Exception ignored) {}
        return null;
    }

    private List<String> subnetCandidates(NetworkAddressInfo info) {
        List<String> out = new ArrayList<>();
        byte[] b = info.address.getAddress();
        int ip = ((b[0] & 0xff) << 24) | ((b[1] & 0xff) << 16) | ((b[2] & 0xff) << 8) | (b[3] & 0xff);
        int prefix = info.prefixLength;
        if (prefix < 23 || prefix > 30) prefix = 24;
        int mask = (int) (0xffffffffL << (32 - prefix));
        int network = ip & mask;
        int broadcast = network | ~mask;
        int count = 0;
        for (int candidate = network + 1; candidate < broadcast && count < 510; candidate++, count++) {
            if (candidate == ip) continue;
            out.add(String.format(Locale.US, "%d.%d.%d.%d", (candidate >>> 24) & 0xff, (candidate >>> 16) & 0xff, (candidate >>> 8) & 0xff, candidate & 0xff));
        }
        return out;
    }

    private SharedPreferences getPreferencesStore() { return getSharedPreferences(PREFS, MODE_PRIVATE); }
    private int dp(int value) { return Math.round(value * getResources().getDisplayMetrics().density); }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) webView.goBack();
        else new AlertDialog.Builder(this)
                .setTitle("Close ORYN?")
                .setMessage("The Android app can be opened again without a table connection.")
                .setNegativeButton("Cancel", null)
                .setPositiveButton("Close", (d, w) -> finish())
                .show();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == FILE_CHOOSER_REQUEST) {
            Uri[] results = null;
            if (resultCode == Activity.RESULT_OK && data != null && data.getData() != null) results = new Uri[]{data.getData()};
            if (filePathCallback != null) {
                filePathCallback.onReceiveValue(results);
                filePathCallback = null;
            }
            return;
        }
        super.onActivityResult(requestCode, resultCode, data);
    }

    @Override
    protected void onDestroy() {
        discoveryGeneration++;
        if (discoveryPool != null) discoveryPool.shutdownNow();
        if (localServer != null) localServer.stop();
        if (webView != null) { webView.stopLoading(); webView.destroy(); }
        super.onDestroy();
    }

    private static class NetworkAddressInfo {
        final Inet4Address address; final int prefixLength;
        NetworkAddressInfo(Inet4Address address, int prefixLength) { this.address = address; this.prefixLength = prefixLength; }
    }
    private static class TableInfo {
        final String id, name, version;
        TableInfo(String id, String name, String version) { this.id = id; this.name = name; this.version = version; }
    }
}
