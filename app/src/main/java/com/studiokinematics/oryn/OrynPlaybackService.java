package com.studiokinematics.oryn;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.net.wifi.WifiManager;
import android.os.Build;
import android.os.IBinder;
import android.os.PowerManager;

/**
 * Keeps an already-started Direct FluidNC motion session alive when Android
 * backgrounds the ORYN Activity or opens the system document picker.
 *
 * The service never owns, restarts, or resends motion. MainActivity's existing
 * exclusive acknowledged streamer remains the sole FluidNC motion owner.
 */
public final class OrynPlaybackService extends Service {
    private static final String CHANNEL_ID = "oryn_direct_playback";
    private static final int NOTIFICATION_ID = 1040410;
    private PowerManager.WakeLock wakeLock;
    private WifiManager.WifiLock wifiLock;

    public static void start(Context context, String label) {
        Intent intent = new Intent(context, OrynPlaybackService.class);
        intent.putExtra("label", label == null ? "Direct motion" : label);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) context.startForegroundService(intent);
        else context.startService(intent);
    }

    public static void stop(Context context) {
        try { context.stopService(new Intent(context, OrynPlaybackService.class)); }
        catch (Exception ignored) { }
    }

    @Override public void onCreate() {
        super.onCreate();
        PowerManager power = (PowerManager) getSystemService(Context.POWER_SERVICE);
        if (power != null) {
            wakeLock = power.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "ORYN:DirectPlayback");
            wakeLock.setReferenceCounted(false);
            wakeLock.acquire();
        }
        WifiManager wifi = (WifiManager) getApplicationContext().getSystemService(Context.WIFI_SERVICE);
        if (wifi != null) {
            wifiLock = wifi.createWifiLock(WifiManager.WIFI_MODE_FULL_HIGH_PERF, "ORYN:FluidNCPlayback");
            wifiLock.setReferenceCounted(false);
            wifiLock.acquire();
        }
    }

    @Override public int onStartCommand(Intent intent, int flags, int startId) {
        String label = intent == null ? "Direct motion" : intent.getStringExtra("label");
        startForeground(NOTIFICATION_ID, notification(label));
        // A killed process cannot safely resume an uncertain relative move.
        return START_NOT_STICKY;
    }

    private Notification notification(String label) {
        NotificationManager manager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && manager != null) {
            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID, "ORYN Direct playback", NotificationManager.IMPORTANCE_LOW);
            channel.setDescription("Keeps ESP32 pattern playback active in the background");
            manager.createNotificationChannel(channel);
        }
        Intent open = new Intent(this, MainActivity.class)
                .addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent pending = PendingIntent.getActivity(this, 0, open,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        return new Notification.Builder(this, CHANNEL_ID)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle("ORYN is playing")
                .setContentText(label == null || label.trim().isEmpty() ? "Direct ESP32 motion" : label)
                .setOngoing(true)
                .setOnlyAlertOnce(true)
                .setContentIntent(pending)
                .build();
    }

    @Override public void onDestroy() {
        if (wifiLock != null && wifiLock.isHeld()) wifiLock.release();
        if (wakeLock != null && wakeLock.isHeld()) wakeLock.release();
        super.onDestroy();
    }

    @Override public IBinder onBind(Intent intent) { return null; }
}
