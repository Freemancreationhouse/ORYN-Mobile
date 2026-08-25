package com.studiokinematics.oryn;

import android.content.Context;
import android.content.res.AssetManager;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.InetAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Tiny loopback HTTP server used only to host the bundled ORYN frontend.
 * Machine-control requests switch to the selected remote ORYN table through
 * the frontend's existing apiClient/baseUrl mechanism. The local endpoints
 * intentionally describe a disconnected mobile shell and never perform motion.
 */
public final class LocalOrynServer {
    public static final int PORT = 8765;
    public static final String BASE_URL = "http://127.0.0.1:" + PORT;

    private final Context context;
    private final AssetManager assets;
    private final ExecutorService pool = Executors.newCachedThreadPool();
    private volatile boolean running;
    private ServerSocket serverSocket;

    public LocalOrynServer(Context context) {
        this.context = context.getApplicationContext();
        this.assets = this.context.getAssets();
    }

    public synchronized void start() throws IOException {
        if (running) return;
        serverSocket = new ServerSocket(PORT, 16, InetAddress.getByName("127.0.0.1"));
        running = true;
        pool.execute(() -> {
            while (running) {
                try {
                    Socket socket = serverSocket.accept();
                    pool.execute(() -> handle(socket));
                } catch (IOException e) {
                    if (running) e.printStackTrace();
                }
            }
        });
    }

    public synchronized void stop() {
        running = false;
        try {
            if (serverSocket != null) serverSocket.close();
        } catch (IOException ignored) {}
        pool.shutdownNow();
    }

    private void handle(Socket socket) {
        try (Socket s = socket;
             BufferedInputStream in = new BufferedInputStream(s.getInputStream());
             BufferedOutputStream out = new BufferedOutputStream(s.getOutputStream())) {

            String requestLine = readLine(in);
            if (requestLine == null || requestLine.isEmpty()) return;
            String[] first = requestLine.split(" ");
            if (first.length < 2) return;
            String method = first[0].toUpperCase(Locale.US);
            String rawPath = first[1];
            int q = rawPath.indexOf('?');
            String path = q >= 0 ? rawPath.substring(0, q) : rawPath;
            try { path = URLDecoder.decode(path, "UTF-8"); } catch (Exception ignored) {}

            Map<String, String> headers = new HashMap<>();
            while (true) {
                String line = readLine(in);
                if (line == null || line.isEmpty()) break;
                int c = line.indexOf(':');
                if (c > 0) headers.put(line.substring(0, c).trim().toLowerCase(Locale.US), line.substring(c + 1).trim());
            }
            int contentLength = 0;
            try { contentLength = Integer.parseInt(headers.getOrDefault("content-length", "0")); } catch (Exception ignored) {}
            if (contentLength > 0) {
                byte[] discard = new byte[Math.min(contentLength, 1024 * 1024)];
                int remaining = contentLength;
                while (remaining > 0) {
                    int n = in.read(discard, 0, Math.min(discard.length, remaining));
                    if (n < 0) break;
                    remaining -= n;
                }
            }

            if (path.startsWith("/api/")) {
                handleApi(method, path, out);
                return;
            }

            if ("/".equals(path)) path = "/index.html";
            String assetPath = "www" + path;
            serveAsset(assetPath, out);
        } catch (Exception ignored) {
        }
    }

    private void handleApi(String method, String path, OutputStream out) throws IOException {
        try {
            if ("/api/table-info".equals(path)) {
                JSONObject o = new JSONObject();
                o.put("id", "oryn-mobile-local");
                o.put("name", "ORYN Mobile");
                o.put("version", "2.0.0-mobile");
                sendJson(200, o.toString(), out);
                return;
            }
            if ("/api/app-name".equals(path)) {
                sendJson(200, "{\"name\":\"ORYN Mobile\"}", out);
                return;
            }
            if ("/api/known-tables".equals(path) && "GET".equals(method)) {
                sendJson(200, "{\"tables\":[]}", out);
                return;
            }
            if ("/api/settings".equals(path)) {
                JSONObject root = new JSONObject();
                root.put("app", new JSONObject().put("name", "ORYN").put("custom_logo", JSONObject.NULL));
                root.put("connection", new JSONObject().put("preferred_port", JSONObject.NULL));
                root.put("patterns", new JSONObject()
                        .put("clear_pattern_speed", 100)
                        .put("custom_clear_from_in", JSONObject.NULL)
                        .put("custom_clear_from_out", JSONObject.NULL));
                root.put("auto_play", new JSONObject()
                        .put("enabled", false).put("playlist", new JSONArray())
                        .put("run_mode", "sequential").put("pause_time", 0)
                        .put("clear_pattern", "adaptive").put("shuffle", false));
                root.put("scheduled_pause", new JSONObject()
                        .put("enabled", false).put("control_wled", false)
                        .put("finish_pattern", true).put("timezone", "UTC")
                        .put("time_slots", new JSONArray()));
                root.put("homing", new JSONObject()
                        .put("mode", "disabled").put("user_override", false)
                        .put("angular_offset_degrees", 0).put("home_on_connect", false)
                        .put("auto_home_enabled", false).put("auto_home_after_patterns", false)
                        .put("hard_reset_theta", false));
                root.put("led", new JSONObject().put("provider", "none"));
                root.put("security", new JSONObject().put("mode", "none").put("has_password", false));
                sendJson(200, root.toString(), out);
                return;
            }
            if ("/api/version".equals(path)) {
                sendJson(200, "{\"version\":\"2.0.0-mobile\"}", out);
                return;
            }
            if ("/api/manifest.webmanifest".equals(path)) {
                sendJson(200, "{\"name\":\"ORYN\",\"short_name\":\"ORYN\",\"display\":\"standalone\",\"start_url\":\"/\",\"theme_color\":\"#0a0a0a\",\"background_color\":\"#0a0a0a\"}", out);
                return;
            }
            if (path.startsWith("/api/pattern_history")) {
                sendJson(200, "[]", out);
                return;
            }
            if ("/api/pattern_history_all".equals(path)) {
                sendJson(200, "{}", out);
                return;
            }
            if ("/api/wifi/status".equals(path)) {
                sendJson(200, "{\"connected\":true,\"ssid\":\"Android\",\"ip\":\"local\"}", out);
                return;
            }
            if ("/api/wifi/networks".equals(path) || "/api/wifi/saved".equals(path)) {
                sendJson(200, "[]", out);
                return;
            }
            if ("/api/dw_leds/status".equals(path)) {
                sendJson(200, "{\"available\":false,\"power\":false}", out);
                return;
            }

            // Local shell never performs machine actions. This explicit 503 keeps
            // the UI responsive while clearly indicating that a table is required.
            sendJson(503, "{\"detail\":\"No ORYN table connected. Use Connect Table in the Android app.\"}", out);
        } catch (Exception e) {
            sendJson(500, "{\"detail\":\"Local ORYN mobile shell error\"}", out);
        }
    }

    private void serveAsset(String assetPath, OutputStream out) throws IOException {
        try (InputStream input = assets.open(assetPath)) {
            ByteArrayOutputStream buffer = new ByteArrayOutputStream();
            byte[] data = new byte[8192];
            int n;
            while ((n = input.read(data)) >= 0) buffer.write(data, 0, n);
            byte[] body = buffer.toByteArray();
            String mime = mimeFor(assetPath);
            send(200, "OK", mime, body, out);
        } catch (IOException e) {
            send(404, "Not Found", "text/plain; charset=utf-8", "Not found".getBytes(StandardCharsets.UTF_8), out);
        }
    }

    private static String readLine(InputStream in) throws IOException {
        ByteArrayOutputStream b = new ByteArrayOutputStream();
        int prev = -1;
        while (true) {
            int c = in.read();
            if (c < 0) break;
            if (prev == '\r' && c == '\n') {
                byte[] arr = b.toByteArray();
                int len = arr.length;
                if (len > 0 && arr[len - 1] == '\r') len--;
                return new String(arr, 0, len, StandardCharsets.UTF_8);
            }
            b.write(c);
            prev = c;
            if (b.size() > 16384) break;
        }
        return b.size() == 0 ? null : b.toString("UTF-8");
    }

    private static String mimeFor(String path) {
        String p = path.toLowerCase(Locale.US);
        if (p.endsWith(".html")) return "text/html; charset=utf-8";
        if (p.endsWith(".js")) return "application/javascript; charset=utf-8";
        if (p.endsWith(".css")) return "text/css; charset=utf-8";
        if (p.endsWith(".json") || p.endsWith(".webmanifest")) return "application/json; charset=utf-8";
        if (p.endsWith(".png")) return "image/png";
        if (p.endsWith(".jpg") || p.endsWith(".jpeg")) return "image/jpeg";
        if (p.endsWith(".svg")) return "image/svg+xml";
        if (p.endsWith(".ico")) return "image/x-icon";
        if (p.endsWith(".woff2")) return "font/woff2";
        if (p.endsWith(".woff")) return "font/woff";
        return "application/octet-stream";
    }

    private static void sendJson(int code, String json, OutputStream out) throws IOException {
        send(code, code == 200 ? "OK" : (code == 503 ? "Service Unavailable" : "Error"),
                "application/json; charset=utf-8", json.getBytes(StandardCharsets.UTF_8), out);
    }

    private static void send(int code, String text, String mime, byte[] body, OutputStream out) throws IOException {
        String headers = "HTTP/1.1 " + code + " " + text + "\r\n"
                + "Content-Type: " + mime + "\r\n"
                + "Content-Length: " + body.length + "\r\n"
                + "Cache-Control: no-cache\r\n"
                + "Access-Control-Allow-Origin: *\r\n"
                + "Connection: close\r\n\r\n";
        out.write(headers.getBytes(StandardCharsets.US_ASCII));
        out.write(body);
        out.flush();
    }
}
