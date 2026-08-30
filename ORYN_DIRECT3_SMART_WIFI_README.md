# ORYN Android Direct ESP32 V10.4.1 — Direct3 Smart Wi-Fi

Build marker: `ORYN-DIRECT-ESP32-V10.4.1-DIRECT3-SMARTWIFI-PD-20260831-1`

## Purpose

Direct3 removes the daily Android Wi-Fi switching workflow for FluidNC.

### Smart Direct AP flow

1. ORYN -> Sand Tables -> **ESP32 Smart Connect**
2. Tap **Scan Wi-Fi**.
3. Nearby `FluidNC` / ORYN ESP32 APs are shown inside ORYN.
4. Tap **Connect** and approve Android's system network request if shown.
5. Android creates a **local-only Wi-Fi network request** using `WifiNetworkSpecifier`.
6. ORYN binds only FluidNC TCP/Telnet sockets to that local network by using `Network.getSocketFactory()`.
7. Android's default network remains unbound and available for Internet traffic.
8. ORYN probes `192.168.0.1:23`, identifies FluidNC, then completes Direct table setup.

No manual trip through Android Wi-Fi Settings is required for the normal Direct3 flow.

## Internet behavior

Android 12+ devices can report whether simultaneous primary Wi-Fi + local-only Wi-Fi is supported. When supported, the phone can keep its normal Internet Wi-Fi while ORYN also holds the local FluidNC link. If the phone hardware does not support concurrent Wi-Fi, Android can still keep cellular as the default Internet network while ORYN uses the local FluidNC network.

Because an app cannot create a second physical Wi-Fi radio on hardware that does not support STA concurrency, Direct3 also includes the universal permanent solution below.

## Permanent Home Wi-Fi mode — recommended

After connecting to the FluidNC AP once from inside ORYN:

1. Expand **Permanent Home Wi-Fi setup**.
2. Enter the router SSID and password.
3. ORYN writes FluidNC settings:
   - `$Sta/SSID=...`
   - `$Sta/Password=...`
   - `$Sta/IPMode=DHCP`
   - `$WiFi/Mode=STA>AP`
4. Power-cycle the ESP32.
5. The ESP32 joins the same Internet router as the phone.
6. In ORYN tap **Find ESP32 on Home Wi-Fi**.
7. ORYN probes `fluidnc.local` and then the active Wi-Fi subnet for FluidNC on TCP port 23.

After this one-time setup, the phone remains on its normal Internet Wi-Fi for everyday ORYN control. FluidNC AP remains available as fallback when the router is unavailable.

## Android permissions

Direct3 declares and requests the Android Wi-Fi permissions needed to show SSIDs and request a local-only Wi-Fi connection:

- INTERNET
- ACCESS_NETWORK_STATE
- ACCESS_WIFI_STATE
- CHANGE_WIFI_STATE
- CHANGE_NETWORK_STATE
- NEARBY_WIFI_DEVICES
- ACCESS_FINE_LOCATION (Android scan APIs still require this for visible scan results)

ORYN uses scan information only to show nearby Wi-Fi networks and establish the requested FluidNC connection.

## Existing Direct2 functionality preserved

- Direct FluidNC Telnet control on port 23
- X = Theta, Y = Rho
- saved Theta revolution / Rho travel calibration values
- pattern playback, pause, resume, stop
- Centre / Perimeter / manual coordinate route
- offline ORYN pattern library
- Pattern Designer V2 with 77 generators
- Android generated `.thr` library
- Android bottom safe-area fix

The motion formulas and pattern conversion are unchanged. The only Direct motion transport change is that ESP32 sockets use the Android `Network` associated with the selected local FluidNC Wi-Fi when one is active.

## Build APK

GitHub Actions builds:

`ORYN-Direct-ESP32-V10.4.1-direct3-smartwifi-debug.apk`
