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
import android.provider.Settings;
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
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

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

public class MainActivity extends Activity {
    private static final String PREFS = "oryn_mobile";
    private static final String PREF_LAST_URL = "last_url";
    private static final int FILE_CHOOSER_REQUEST = 9001;
    private static final int NEARBY_PERMISSION_REQUEST = 9002;

    private static final int C_BLACK = Color.rgb(11, 13, 16);
    private static final int C_PANEL = Color.rgb(20, 23, 27);
    private static final int C_BRASS = Color.rgb(199, 164, 99);
    private static final int C_BRASS_HI = Color.rgb(222, 192, 122);
    private static final int C_IVORY = Color.rgb(243, 240, 234);
    private static final int C_MUTED = Color.rgb(170, 168, 162);

    private FrameLayout root;
    private WebView webView;
    private LinearLayout overlay;
    private TextView status;
    private TextView detail;
    private ProgressBar spinner;
    private Button primaryButton;
    private Button secondaryButton;

    private String currentBaseUrl = null;
    private String pendingFoundUrl = null;
    private int discoveryGeneration = 0;
    private ExecutorService discoveryPool;
    private ValueCallback<Uri[]> filePathCallback;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        getWindow().setStatusBarColor(C_BLACK);
        getWindow().setNavigationBarColor(C_BLACK);

        buildUi();
        configureWebView();
        requestNearbyPermissionIfUseful();
        startDiscovery();
    }

    private void buildUi() {
        root = new FrameLayout(this);
        root.setBackgroundColor(C_BLACK);

        webView = new WebView(this);
        webView.setBackgroundColor(C_BLACK);
        webView.setVisibility(View.INVISIBLE);
        root.addView(webView, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT));

        overlay = new LinearLayout(this);
        overlay.setOrientation(LinearLayout.VERTICAL);
        overlay.setGravity(Gravity.CENTER);
        overlay.setPadding(dp(28), dp(32), dp(28), dp(32));
        overlay.setBackgroundColor(C_BLACK);

        FrameLayout.LayoutParams overlayParams = new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT);
        root.addView(overlay, overlayParams);

        ImageView logo = new ImageView(this);
        logo.setImageResource(com.studiokinematics.oryn.R.drawable.oryn_logo);
        logo.setScaleType(ImageView.ScaleType.CENTER_CROP);
        GradientDrawable logoBg = new GradientDrawable();
        logoBg.setShape(GradientDrawable.OVAL);
        logoBg.setColor(C_PANEL);
        logoBg.setStroke(dp(1), C_BRASS);
        logo.setBackground(logoBg);
        logo.setClipToOutline(true);
        LinearLayout.LayoutParams logoLp = new LinearLayout.LayoutParams(dp(92), dp(92));
        logoLp.bottomMargin = dp(20);
        overlay.addView(logo, logoLp);

        TextView title = new TextView(this);
        title.setText("ORYN");
        title.setTextColor(C_IVORY);
        title.setTextSize(28);
        title.setGravity(Gravity.CENTER);
        title.setTypeface(android.graphics.Typeface.DEFAULT_BOLD);
        overlay.addView(title);

        TextView subtitle = new TextView(this);
        subtitle.setText("Designed to Move");
        subtitle.setTextColor(C_BRASS_HI);
        subtitle.setTextSize(14);
        subtitle.setGravity(Gravity.CENTER);
        LinearLayout.LayoutParams subLp = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT);
        subLp.topMargin = dp(4);
        overlay.addView(subtitle, subLp);

        TextView brand = new TextView(this);
        brand.setText("by Studio Kinematics™");
        brand.setTextColor(C_MUTED);
        brand.setTextSize(12);
        brand.setGravity(Gravity.CENTER);
        LinearLayout.LayoutParams brandLp = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT);
        brandLp.topMargin = dp(3);
        brandLp.bottomMargin = dp(34);
        overlay.addView(brand, brandLp);

        spinner = new ProgressBar(this);
        spinner.setIndeterminate(true);
        spinner.getIndeterminateDrawable().setTint(C_BRASS);
        LinearLayout.LayoutParams spinLp = new LinearLayout.LayoutParams(dp(34), dp(34));
        spinLp.bottomMargin = dp(18);
        overlay.addView(spinner, spinLp);

        status = new TextView(this);
        status.setText("Finding your ORYN table…");
        status.setTextColor(C_IVORY);
        status.setTextSize(17);
        status.setGravity(Gravity.CENTER);
        status.setTypeface(android.graphics.Typeface.DEFAULT_BOLD);
        overlay.addView(status);

        detail = new TextView(this);
        detail.setText("Make sure your phone and Raspberry Pi are on the same Wi-Fi.");
        detail.setTextColor(C_MUTED);
        detail.setTextSize(13);
        detail.setGravity(Gravity.CENTER);
        LinearLayout.LayoutParams detailLp = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT);
        detailLp.topMargin = dp(8);
        detailLp.bottomMargin = dp(22);
        overlay.addView(detail, detailLp);

        primaryButton = makeButton("Connect", true);
        primaryButton.setVisibility(View.GONE);
        overlay.addView(primaryButton, buttonLayoutParams());

        secondaryButton = makeButton("Enter address manually", false);
        secondaryButton.setOnClickListener(v -> showManualAddressDialog());
        LinearLayout.LayoutParams secondaryLp = buttonLayoutParams();
        secondaryLp.topMargin = dp(10);
        overlay.addView(secondaryButton, secondaryLp);

        setContentView(root);
    }

    private Button makeButton(String text, boolean primary) {
        Button b = new Button(this);
        b.setText(text);
        b.setTextAllCaps(false);
        b.setTextSize(14);
        b.setTypeface(android.graphics.Typeface.DEFAULT_BOLD);
        b.setPadding(dp(18), 0, dp(18), 0);

        GradientDrawable bg = new GradientDrawable();
        bg.setCornerRadius(dp(12));
        if (primary) {
            bg.setColor(C_BRASS);
            bg.setStroke(dp(1), C_BRASS);
            b.setTextColor(Color.rgb(12, 12, 10));
        } else {
            bg.setColor(C_PANEL);
            bg.setStroke(dp(1), Color.rgb(55, 58, 62));
            b.setTextColor(C_IVORY);
        }
        b.setBackground(bg);
        return b;
    }

    private LinearLayout.LayoutParams buttonLayoutParams() {
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(
                Math.min(dp(360), getResources().getDisplayMetrics().widthPixels - dp(56)),
                dp(50));
        return lp;
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
        s.setUserAgentString(s.getUserAgentString() + " ORYN-Mobile/1.0");

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(
                    WebView webView,
                    ValueCallback<Uri[]> newFilePathCallback,
                    FileChooserParams fileChooserParams) {
                if (filePathCallback != null) {
                    filePathCallback.onReceiveValue(null);
                }
                filePathCallback = newFilePathCallback;

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
                    Toast.makeText(MainActivity.this,
                            "No file picker is available on this device.",
                            Toast.LENGTH_LONG).show();
                    return false;
                }
            }
        });

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageStarted(WebView view, String url, android.graphics.Bitmap favicon) {
                status.setText("Opening ORYN…");
                detail.setText(url);
                spinner.setVisibility(View.VISIBLE);
                overlay.setVisibility(View.VISIBLE);
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                webView.setVisibility(View.VISIBLE);
                overlay.setVisibility(View.GONE);
            }

            @Override
            public void onReceivedError(
                    WebView view,
                    WebResourceRequest request,
                    WebResourceError error) {
                if (request.isForMainFrame()) {
                    showOffline("Connection lost",
                            "ORYN is not reachable right now. Check that the Pi is powered and connected.");
                }
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if (isSameOrynHost(uri)) {
                    return false;
                }
                Intent external = new Intent(Intent.ACTION_VIEW, uri);
                try {
                    startActivity(external);
                } catch (ActivityNotFoundException ignored) {}
                return true;
            }
        });
    }

    private boolean isSameOrynHost(Uri uri) {
        if (currentBaseUrl == null || uri.getHost() == null) return true;
        try {
            Uri current = Uri.parse(currentBaseUrl);
            return uri.getHost().equalsIgnoreCase(current.getHost());
        } catch (Exception e) {
            return true;
        }
    }

    private void requestNearbyPermissionIfUseful() {
        if (Build.VERSION.SDK_INT >= 33) {
            if (checkSelfPermission(Manifest.permission.NEARBY_WIFI_DEVICES)
                    != PackageManager.PERMISSION_GRANTED) {
                requestPermissions(
                        new String[]{Manifest.permission.NEARBY_WIFI_DEVICES},
                        NEARBY_PERMISSION_REQUEST);
            }
        }
    }

    private void startDiscovery() {
        int generation = ++discoveryGeneration;
        pendingFoundUrl = null;
        primaryButton.setVisibility(View.GONE);
        secondaryButton.setVisibility(View.VISIBLE);
        spinner.setVisibility(View.VISIBLE);
        status.setText("Finding your ORYN table…");
        detail.setText("Checking the last table, oryn.local, and your local network.");
        overlay.setVisibility(View.VISIBLE);
        webView.setVisibility(View.INVISIBLE);

        if (discoveryPool != null) {
            discoveryPool.shutdownNow();
        }
        discoveryPool = Executors.newFixedThreadPool(40);

        String last = getPreferencesStore().getString(PREF_LAST_URL, null);
        discoveryPool.execute(() -> {
            if (generation != discoveryGeneration) return;

            // Reconnect automatically to a previously approved table.
            if (last != null && probeOryn(last)) {
                runOnUiThread(() -> {
                    if (generation == discoveryGeneration) {
                        loadOryn(last);
                    }
                });
                return;
            }

            String local = "http://oryn.local";
            if (probeOryn(local)) {
                runOnUiThread(() -> showFound(generation, local, "ORYN found via oryn.local"));
                return;
            }

            scanLocalSubnet(generation);
        });
    }

    private void scanLocalSubnet(int generation) {
        NetworkAddressInfo info = getActiveIpv4();
        if (info == null) {
            runOnUiThread(() -> showNotFound(generation,
                    "No local Wi-Fi/Ethernet address was detected."));
            return;
        }

        List<String> candidates = subnetCandidates(info);
        if (candidates.isEmpty()) {
            runOnUiThread(() -> showNotFound(generation,
                    "Could not determine the local network range."));
            return;
        }

        AtomicBoolean found = new AtomicBoolean(false);
        java.util.concurrent.atomic.AtomicInteger remaining =
                new java.util.concurrent.atomic.AtomicInteger(candidates.size());

        for (String ip : candidates) {
            discoveryPool.execute(() -> {
                try {
                    if (generation != discoveryGeneration || found.get()) return;
                    String base = "http://" + ip;
                    if (probeOryn(base) && found.compareAndSet(false, true)) {
                        runOnUiThread(() -> showFound(generation, base,
                                "ORYN found on your Wi-Fi"));
                    }
                } finally {
                    if (remaining.decrementAndGet() == 0
                            && !found.get()
                            && generation == discoveryGeneration) {
                        runOnUiThread(() -> showNotFound(generation,
                                "No ORYN table was found automatically."));
                    }
                }
            });
        }
    }

    private boolean probeOryn(String base) {
        HttpURLConnection c = null;
        try {
            URL url = new URL(normalizeBase(base) + "/api/app-name");
            c = (HttpURLConnection) url.openConnection();
            c.setConnectTimeout(650);
            c.setReadTimeout(650);
            c.setUseCaches(false);
            c.setRequestProperty("Accept", "application/json");
            int code = c.getResponseCode();
            if (code != 200) return false;

            BufferedReader br = new BufferedReader(
                    new InputStreamReader(c.getInputStream()));
            StringBuilder body = new StringBuilder();
            String line;
            while ((line = br.readLine()) != null) body.append(line);
            br.close();

            return body.toString().toUpperCase(Locale.US).contains("ORYN");
        } catch (Exception ignored) {
            return false;
        } finally {
            if (c != null) c.disconnect();
        }
    }

    private void showFound(int generation, String base, String message) {
        if (generation != discoveryGeneration) return;
        pendingFoundUrl = normalizeBase(base);
        spinner.setVisibility(View.GONE);
        status.setText("ORYN found");
        detail.setText(message + "\n" + pendingFoundUrl);
        primaryButton.setText("Connect");
        primaryButton.setVisibility(View.VISIBLE);
        primaryButton.setOnClickListener(v -> loadOryn(pendingFoundUrl));
        secondaryButton.setVisibility(View.VISIBLE);
    }

    private void showNotFound(int generation, String reason) {
        if (generation != discoveryGeneration) return;
        spinner.setVisibility(View.GONE);
        status.setText("ORYN not found");
        detail.setText(reason + "\nMake sure the phone and Pi are on the same Wi-Fi.");
        primaryButton.setText("Search again");
        primaryButton.setVisibility(View.VISIBLE);
        primaryButton.setOnClickListener(v -> startDiscovery());
        secondaryButton.setVisibility(View.VISIBLE);
    }

    private void showOffline(String heading, String message) {
        runOnUiThread(() -> {
            spinner.setVisibility(View.GONE);
            status.setText(heading);
            detail.setText(message);
            primaryButton.setText("Reconnect");
            primaryButton.setVisibility(View.VISIBLE);
            primaryButton.setOnClickListener(v -> startDiscovery());
            secondaryButton.setVisibility(View.VISIBLE);
            overlay.setVisibility(View.VISIBLE);
        });
    }

    private void loadOryn(String base) {
        currentBaseUrl = normalizeBase(base);
        getPreferencesStore().edit().putString(PREF_LAST_URL, currentBaseUrl).apply();
        pendingFoundUrl = null;

        spinner.setVisibility(View.VISIBLE);
        status.setText("Connecting…");
        detail.setText(currentBaseUrl);
        primaryButton.setVisibility(View.GONE);
        secondaryButton.setVisibility(View.GONE);
        overlay.setVisibility(View.VISIBLE);

        webView.loadUrl(currentBaseUrl + "/");
    }

    private void showManualAddressDialog() {
        final EditText input = new EditText(this);
        input.setSingleLine(true);
        input.setHint("oryn.local or 192.168.0.224");
        input.setTextColor(Color.BLACK);
        input.setHintTextColor(Color.DKGRAY);
        input.setPadding(dp(14), dp(8), dp(14), dp(8));

        new AlertDialog.Builder(this)
                .setTitle("Connect to ORYN")
                .setMessage("Enter the Raspberry Pi hostname or IP address.")
                .setView(input)
                .setNegativeButton("Cancel", null)
                .setPositiveButton("Connect", (dialog, which) -> {
                    String value = input.getText().toString().trim();
                    if (value.isEmpty()) return;
                    String base = normalizeBase(value);
                    spinner.setVisibility(View.VISIBLE);
                    status.setText("Checking ORYN…");
                    detail.setText(base);

                    int generation = ++discoveryGeneration;
                    if (discoveryPool != null) discoveryPool.shutdownNow();
                    discoveryPool = Executors.newFixedThreadPool(4);
                    discoveryPool.execute(() -> {
                        if (probeOryn(base)) {
                            runOnUiThread(() -> showFound(generation, base,
                                    "ORYN confirmed at this address"));
                        } else {
                            runOnUiThread(() -> showNotFound(generation,
                                    "No ORYN server responded at " + base));
                        }
                    });
                })
                .show();
    }

    private String normalizeBase(String value) {
        String v = value.trim();
        if (!v.startsWith("http://") && !v.startsWith("https://")) {
            v = "http://" + v;
        }
        while (v.endsWith("/")) v = v.substring(0, v.length() - 1);
        return v;
    }

    private NetworkAddressInfo getActiveIpv4() {
        try {
            ConnectivityManager cm =
                    (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
            Network network = cm.getActiveNetwork();
            if (network == null) return null;
            LinkProperties lp = cm.getLinkProperties(network);
            if (lp == null) return null;

            for (LinkAddress la : lp.getLinkAddresses()) {
                InetAddress address = la.getAddress();
                if (address instanceof Inet4Address
                        && !address.isLoopbackAddress()
                        && !address.isLinkLocalAddress()) {
                    return new NetworkAddressInfo(
                            (Inet4Address) address,
                            la.getPrefixLength());
                }
            }
        } catch (Exception ignored) {}
        return null;
    }

    private List<String> subnetCandidates(NetworkAddressInfo info) {
        List<String> out = new ArrayList<>();
        byte[] b = info.address.getAddress();
        int ip = ((b[0] & 0xff) << 24)
                | ((b[1] & 0xff) << 16)
                | ((b[2] & 0xff) << 8)
                | (b[3] & 0xff);

        int prefix = info.prefixLength;
        // Keep discovery bounded and fast. Networks larger than /23 are
        // intentionally scanned as the phone's local /24.
        if (prefix < 23 || prefix > 30) prefix = 24;

        int mask = prefix == 0 ? 0 : (int) (0xffffffffL << (32 - prefix));
        int network = ip & mask;
        int broadcast = network | ~mask;

        int count = 0;
        for (int candidate = network + 1;
             candidate < broadcast && count < 510;
             candidate++, count++) {
            if (candidate == ip) continue;
            out.add(String.format(Locale.US, "%d.%d.%d.%d",
                    (candidate >>> 24) & 0xff,
                    (candidate >>> 16) & 0xff,
                    (candidate >>> 8) & 0xff,
                    candidate & 0xff));
        }
        return out;
    }

    private SharedPreferences getPreferencesStore() {
        return getSharedPreferences(PREFS, MODE_PRIVATE);
    }

    private int dp(int value) {
        return Math.round(value * getResources().getDisplayMetrics().density);
    }

    @Override
    public void onBackPressed() {
        if (overlay.getVisibility() == View.VISIBLE
                && webView.getVisibility() == View.VISIBLE) {
            overlay.setVisibility(View.GONE);
            return;
        }
        if (webView.canGoBack()) {
            webView.goBack();
        } else if (webView.getVisibility() == View.VISIBLE) {
            new AlertDialog.Builder(this)
                    .setTitle("Close ORYN?")
                    .setMessage("Disconnect this mobile view?")
                    .setNegativeButton("Cancel", null)
                    .setPositiveButton("Close", (d, w) -> finish())
                    .show();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == FILE_CHOOSER_REQUEST) {
            Uri[] results = null;
            if (resultCode == Activity.RESULT_OK && data != null) {
                Uri uri = data.getData();
                if (uri != null) results = new Uri[]{uri};
            }
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
        if (webView != null) {
            webView.stopLoading();
            webView.destroy();
        }
        super.onDestroy();
    }

    private static class NetworkAddressInfo {
        final Inet4Address address;
        final int prefixLength;

        NetworkAddressInfo(Inet4Address address, int prefixLength) {
            this.address = address;
            this.prefixLength = prefixLength;
        }
    }
}
