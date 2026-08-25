package com.studiokinematics.oryn;

import android.content.Context;
import android.content.res.AssetManager;
import android.util.Base64;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * APK-local ORYN runtime.
 *
 * It serves the complete bundled ORYN frontend and, crucially, implements the
 * WebSocket endpoints the existing frontend uses to decide whether its backend
 * is alive.  The local status intentionally reports connection_status=false:
 * the Android application is ready, while the physical sand table is not yet
 * connected.  Selecting a real ORYN table switches the unchanged frontend to
 * that table's backend.
 */
public final class LocalOrynServer {
    public static final int PORT = 8765;
    public static final String BASE_URL = "http://127.0.0.1:" + PORT;
    private static final String WS_MAGIC = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";

    private final AssetManager assets;
    private final ExecutorService pool = Executors.newCachedThreadPool();
    private volatile boolean running;
    private ServerSocket serverSocket;

    public LocalOrynServer(Context context) {
        this.assets = context.getApplicationContext().getAssets();
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
        try { if (serverSocket != null) serverSocket.close(); } catch (IOException ignored) {}
        pool.shutdownNow();
    }

    private void handle(Socket socket) {
        try {
            socket.setTcpNoDelay(true);
            BufferedInputStream in = new BufferedInputStream(socket.getInputStream());
            BufferedOutputStream out = new BufferedOutputStream(socket.getOutputStream());

            String requestLine = readLine(in);
            if (requestLine == null || requestLine.isEmpty()) { socket.close(); return; }
            String[] first = requestLine.split(" ");
            if (first.length < 2) { socket.close(); return; }
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

            if ("websocket".equalsIgnoreCase(headers.get("upgrade"))) {
                handleWebSocket(path, headers, socket, in, out);
                return;
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

            try (Socket s = socket; BufferedOutputStream autoOut = out) {
                if (path.startsWith("/api/")) { handleApi(method, path, autoOut); return; }
                if ("/".equals(path)) path = "/index.html";
                serveAsset("www" + path, autoOut);
            }
        } catch (Exception ignored) {
            try { socket.close(); } catch (Exception ignored2) {}
        }
    }

    private void handleWebSocket(String path, Map<String, String> headers, Socket socket,
                                 InputStream in, OutputStream out) throws Exception {
        String key = headers.get("sec-websocket-key");
        if (key == null) { socket.close(); return; }
        String accept = Base64.encodeToString(
                MessageDigest.getInstance("SHA-1").digest((key.trim() + WS_MAGIC).getBytes(StandardCharsets.US_ASCII)),
                Base64.NO_WRAP);
        String response = "HTTP/1.1 101 Switching Protocols\r\n"
                + "Upgrade: websocket\r\n"
                + "Connection: Upgrade\r\n"
                + "Sec-WebSocket-Accept: " + accept + "\r\n\r\n";
        out.write(response.getBytes(StandardCharsets.US_ASCII));
        out.flush();

        try (Socket s = socket) {
            if ("/ws/status".equals(path)) {
                while (running && !s.isClosed()) {
                    sendWsText(out, statusEnvelope());
                    Thread.sleep(1000L);
                }
            } else if ("/ws/cache-progress".equals(path)) {
                sendWsText(out, "{\"type\":\"cache_progress\",\"data\":{\"is_running\":false,\"stage\":\"idle\",\"processed_files\":0,\"total_files\":0}}");
                while (running && !s.isClosed()) { sendWsPing(out); Thread.sleep(15000L); }
            } else if ("/ws/logs".equals(path)) {
                while (running && !s.isClosed()) { sendWsText(out, "{\"type\":\"heartbeat\"}"); Thread.sleep(5000L); }
            } else {
                sendWsClose(out);
            }
        } catch (Exception ignored) {}
    }

    private static String statusEnvelope() {
        return "{\"type\":\"status_update\",\"data\":{" +
                "\"current_file\":null," +
                "\"is_paused\":false," +
                "\"manual_pause\":false," +
                "\"scheduled_pause\":false," +
                "\"is_running\":false," +
                "\"is_homing\":false," +
                "\"sensor_homing_failed\":false," +
                "\"is_clearing\":false," +
                "\"progress\":null," +
                "\"playlist\":null," +
                "\"speed\":100," +
                "\"pause_time_remaining\":0," +
                "\"original_pause_time\":null," +
                "\"connection_status\":false," +
                "\"current_theta\":0.0," +
                "\"current_rho\":0.0," +
                "\"firmware_version\":null," +
                "\"table_type\":null," +
                "\"rho_calibrated\":false," +
                "\"rho_travel_units\":null," +
                "\"perimeter_calibration_active\":false," +
                "\"perimeter_calibration_current_units\":0.0" +
                "}}";
    }

    private static synchronized void sendWsText(OutputStream out, String text) throws IOException {
        sendWsFrame(out, 0x1, text.getBytes(StandardCharsets.UTF_8));
    }

    private static synchronized void sendWsPing(OutputStream out) throws IOException {
        sendWsFrame(out, 0x9, new byte[0]);
    }

    private static synchronized void sendWsClose(OutputStream out) throws IOException {
        sendWsFrame(out, 0x8, new byte[0]);
    }

    private static void sendWsFrame(OutputStream out, int opcode, byte[] payload) throws IOException {
        out.write(0x80 | (opcode & 0x0f));
        int len = payload.length;
        if (len <= 125) {
            out.write(len);
        } else if (len <= 65535) {
            out.write(126); out.write((len >>> 8) & 0xff); out.write(len & 0xff);
        } else {
            out.write(127);
            for (int i = 7; i >= 0; i--) out.write((int) (((long) len >>> (8 * i)) & 0xff));
        }
        out.write(payload);
        out.flush();
    }

    private void handleApi(String method, String path, OutputStream out) throws IOException {
        try {
            if ("/api/table-info".equals(path)) {
                JSONObject o = new JSONObject();
                o.put("id", "oryn-mobile-local"); o.put("name", "ORYN Mobile"); o.put("version", "3.0.0-mobile");
                sendJson(200, o.toString(), out); return;
            }
            if ("/api/app-name".equals(path)) { sendJson(200, "{\"name\":\"ORYN\"}", out); return; }
            if ("/api/known-tables".equals(path) && "GET".equals(method)) { sendJson(200, "{\"tables\":[]}", out); return; }
            if ("/api/settings".equals(path)) {
                JSONObject root = new JSONObject();
                root.put("app", new JSONObject().put("name", "ORYN").put("custom_logo", JSONObject.NULL));
                root.put("connection", new JSONObject().put("preferred_port", JSONObject.NULL));
                root.put("patterns", new JSONObject().put("clear_pattern_speed",100).put("custom_clear_from_in",JSONObject.NULL).put("custom_clear_from_out",JSONObject.NULL));
                root.put("auto_play", new JSONObject().put("enabled",false).put("playlist",new JSONArray()).put("run_mode","sequential").put("pause_time",0).put("clear_pattern","adaptive").put("shuffle",false));
                root.put("scheduled_pause", new JSONObject().put("enabled",false).put("control_wled",false).put("finish_pattern",true).put("timezone","UTC").put("time_slots",new JSONArray()));
                root.put("homing", new JSONObject().put("mode","disabled").put("user_override",false).put("angular_offset_degrees",0).put("home_on_connect",false).put("auto_home_enabled",false).put("auto_home_after_patterns",false).put("hard_reset_theta",false));
                root.put("led", new JSONObject().put("provider","none"));
                root.put("security", new JSONObject().put("mode","none").put("has_password",false));
                sendJson(200, root.toString(), out); return;
            }
            if ("/api/version".equals(path)) { sendJson(200, "{\"version\":\"3.0.0-mobile\"}", out); return; }
            if ("/api/manifest.webmanifest".equals(path)) { sendJson(200, "{\"name\":\"ORYN\",\"short_name\":\"ORYN\",\"display\":\"standalone\",\"start_url\":\"/\",\"theme_color\":\"#0a0a0a\",\"background_color\":\"#0a0a0a\"}", out); return; }
            if (path.startsWith("/api/pattern_history")) { sendJson(200, "[]", out); return; }
            if ("/api/pattern_history_all".equals(path)) { sendJson(200, "{}", out); return; }
            if ("/api/wifi/status".equals(path)) { sendJson(200, "{\"connected\":true,\"ssid\":\"Android\",\"ip\":\"local\"}", out); return; }
            if ("/api/wifi/networks".equals(path) || "/api/wifi/saved".equals(path)) { sendJson(200, "[]", out); return; }
            if ("/api/dw_leds/status".equals(path)) { sendJson(200, "{\"available\":false,\"power\":false}", out); return; }
            if ("/api/connection/status".equals(path)) { sendJson(200, "{\"connected\":false,\"port\":null}", out); return; }
            sendJson(503, "{\"detail\":\"No ORYN table connected. Tap Connect Table in the Android app.\"}", out);
        } catch (Exception e) { sendJson(500, "{\"detail\":\"Local ORYN mobile runtime error\"}", out); }
    }

    private void serveAsset(String assetPath, OutputStream out) throws IOException {
        try (InputStream input = assets.open(assetPath)) {
            ByteArrayOutputStream buffer = new ByteArrayOutputStream(); byte[] data = new byte[8192]; int n;
            while ((n = input.read(data)) >= 0) buffer.write(data, 0, n);
            send(200, "OK", mimeFor(assetPath), buffer.toByteArray(), out);
        } catch (IOException e) { send(404, "Not Found", "text/plain; charset=utf-8", "Not found".getBytes(StandardCharsets.UTF_8), out); }
    }

    private static String readLine(InputStream in) throws IOException {
        ByteArrayOutputStream b = new ByteArrayOutputStream(); int prev = -1;
        while (true) {
            int c = in.read(); if (c < 0) break;
            if (prev == '\r' && c == '\n') {
                byte[] arr = b.toByteArray(); int len = arr.length; if (len > 0 && arr[len - 1] == '\r') len--;
                return new String(arr, 0, len, StandardCharsets.UTF_8);
            }
            b.write(c); prev = c; if (b.size() > 16384) break;
        }
        return b.size() == 0 ? null : b.toString("UTF-8");
    }

    private static String mimeFor(String path) {
        String p = path.toLowerCase(Locale.US);
        if (p.endsWith(".html")) return "text/html; charset=utf-8"; if (p.endsWith(".js")) return "application/javascript; charset=utf-8";
        if (p.endsWith(".css")) return "text/css; charset=utf-8"; if (p.endsWith(".json") || p.endsWith(".webmanifest")) return "application/json; charset=utf-8";
        if (p.endsWith(".png")) return "image/png"; if (p.endsWith(".jpg") || p.endsWith(".jpeg")) return "image/jpeg"; if (p.endsWith(".svg")) return "image/svg+xml";
        if (p.endsWith(".ico")) return "image/x-icon"; if (p.endsWith(".woff2")) return "font/woff2"; if (p.endsWith(".woff")) return "font/woff";
        return "application/octet-stream";
    }

    private static void sendJson(int code, String json, OutputStream out) throws IOException {
        send(code, code == 200 ? "OK" : (code == 503 ? "Service Unavailable" : "Error"), "application/json; charset=utf-8", json.getBytes(StandardCharsets.UTF_8), out);
    }

    private static void send(int code, String text, String mime, byte[] body, OutputStream out) throws IOException {
        String headers = "HTTP/1.1 " + code + " " + text + "\r\nContent-Type: " + mime + "\r\nContent-Length: " + body.length
                + "\r\nCache-Control: no-cache\r\nAccess-Control-Allow-Origin: *\r\nConnection: close\r\n\r\n";
        out.write(headers.getBytes(StandardCharsets.US_ASCII)); out.write(body); out.flush();
    }
}
