# ORYN ESP32 28BYJ-48 Controller V1

Target hardware
- ESP32 DevKit / ESP-WROOM-32
- 2 x ULN2003A driver boards
- 2 x 5-wire 28BYJ-48-type unipolar geared steppers
- One USB 5 V supply powering the ESP32 and both ULN2003 boards
- ORYN axis convention: X = THETA, Y = RHO

## Important firmware version

Use FluidNC v3.8.3 for this exact unipolar configuration.

The official FluidNC project later removed unipolar-motor support from newer releases,
so do not use FluidNC 4.x with this config.yaml.

## Exact wiring used by the locked ORYN 28BYJ profile

THETA / X ULN2003
- IN1 -> ESP32 GPIO13
- IN2 -> ESP32 GPIO12
- IN3 -> ESP32 GPIO14
- IN4 -> ESP32 GPIO27

RHO / Y ULN2003
- IN1 -> ESP32 GPIO19
- IN2 -> ESP32 GPIO18
- IN3 -> ESP32 GPIO5
- IN4 -> ESP32 GPIO21

POWER
- ESP32 powered through its USB connector
- ESP32 5V/VIN -> VCC/+ on BOTH ULN2003 boards
- ESP32 GND -> GND/- on BOTH ULN2003 boards
- Keep all grounds common
- Plug each 5-wire stepper into its ULN2003 5-pin motor connector

Do NOT feed the motor boards from the ESP32 3V3 pin.

This one-USB arrangement assumes the motors are the 5 V version, as used in the
working table setup. Use a good-quality 5 V USB supply/cable; 2 A gives useful headroom.

## Controller values already matched by ORYN

The supplied config.yaml is copied from the locked ORYN V10.4.1 source.

- X steps_per_mm: 256
- Y steps_per_mm: 210
- X max travel: 4000
- Y max travel: 80
- X/Y max rate: 200
- X/Y acceleration: 10
- FluidNC stepping engine: RMT
- Half-step: false

ORYN's existing backend recognizes X=256 and Y=210 as its 28BYJ-48 Mini Pro profile.

Do not change the X/Y steps values before initial ORYN testing. Use ORYN's existing
360-degree and perimeter calibration process as the authoritative final machine calibration.

## Connection options

USB:
ESP32 USB -> Raspberry Pi USB
ORYN connects to the ESP32 serial port at 115200 baud.

Wi-Fi:
FluidNC Wi-Fi -> same LAN as the Raspberry Pi
ORYN can connect to ws://fluidnc.local:81.

If you want the existing ORYN automatic Wi-Fi route to work unchanged, keep the
FluidNC hostname as:
fluidnc

## First-time flash on Windows

1. Download FluidNC v3.8.3 Windows release:
   fluidnc-v3.8.3-win64.zip

2. Extract it.

3. Connect the ESP32 by USB.

4. Run:
   erase.bat

5. Then run:
   install-wifi.bat

6. Then run:
   install-fs.bat

7. Open FluidTerm or the FluidNC WebUI and upload this package's `config.yaml`
   into the root of the ESP32 filesystem as:
   config.yaml

8. Restart the ESP32.

## Wi-Fi setup

After flashing, FluidNC normally starts an AP for initial setup.

- Join the FluidNC Wi-Fi AP.
- Default AP password on the standard FluidNC setup is typically: 12345678
- Open: http://192.168.0.1
- Configure your normal Wi-Fi SSID/password.
- Keep hostname `fluidnc` if using ORYN's existing automatic Wi-Fi connection.
- Reboot the controller.

## Verification

In FluidTerm, send:

$I

You should see FluidNC v3.8.3.

Then:

$/axes/x/steps_per_mm

Expected:
256

Then:

$/axes/y/steps_per_mm

Expected:
210

For a very small direction test, with the mechanism in a safe position:

G91
G1 X0.1 F20
G1 Y0.1 F20
G90

If either physical motor direction is wrong, stop and correct the phase order/config
before doing homing or full calibration. Do not run full travel tests until small motion
is confirmed.

## ORYN setup

After the controller is connected:
1. Open the existing locked ORYN V10.4.1 software.
2. Connect to the ESP32 by USB serial or FluidNC Wi-Fi.
3. Confirm controller detection.
4. Run the existing ORYN radial/perimeter calibration.
5. Run the existing ORYN full-circle/Theta calibration.
6. Save calibration.
7. Test Centre and Perimeter.
8. Test one simple pattern at low speed.
9. Then test clearing + queued playback.

No Pi, Android, iPhone, or Windows application changes are required simply to use this
controller profile; it uses the GRBL/FluidNC interface already supported by ORYN.

## Do not change

- Do not change ORYN's Theta/Rho conversion.
- Do not configure a second polar-kinematics transform in FluidNC.
- X remains Theta.
- Y remains Rho.
- FluidNC stays Cartesian/empty kinematics because ORYN performs the polar conversion.
