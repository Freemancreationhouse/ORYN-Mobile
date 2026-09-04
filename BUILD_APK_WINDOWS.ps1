$ErrorActionPreference = 'Stop'
$Project = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $Project

Write-Host "ORYN Android V10.4.1 Direct Final - local APK build" -ForegroundColor Cyan

# Prefer Android Studio's bundled Java when JAVA_HOME is not already valid.
if (-not $env:JAVA_HOME -or -not (Test-Path (Join-Path $env:JAVA_HOME 'bin\java.exe'))) {
  $studioJbr = 'C:\Program Files\Android\Android Studio\jbr'
  if (Test-Path (Join-Path $studioJbr 'bin\java.exe')) { $env:JAVA_HOME = $studioJbr }
}
if (-not $env:JAVA_HOME -or -not (Test-Path (Join-Path $env:JAVA_HOME 'bin\java.exe'))) {
  throw 'Java not found. Install Android Studio, then run this script again.'
}
$env:Path = (Join-Path $env:JAVA_HOME 'bin') + ';' + $env:Path

if (-not $env:ANDROID_SDK_ROOT) {
  $defaultSdk = Join-Path $env:LOCALAPPDATA 'Android\Sdk'
  if (Test-Path $defaultSdk) { $env:ANDROID_SDK_ROOT = $defaultSdk }
}
if (-not $env:ANDROID_SDK_ROOT -or -not (Test-Path $env:ANDROID_SDK_ROOT)) {
  throw 'Android SDK not found. Open Android Studio once, install Android SDK 35, then run this script again.'
}
$env:ANDROID_HOME = $env:ANDROID_SDK_ROOT

$platform = Join-Path $env:ANDROID_SDK_ROOT 'platforms\android-35\android.jar'
if (-not (Test-Path $platform)) {
  $sdkmanager = Join-Path $env:ANDROID_SDK_ROOT 'cmdline-tools\latest\bin\sdkmanager.bat'
  if (Test-Path $sdkmanager) {
    & $sdkmanager 'platforms;android-35' 'build-tools;35.0.0'
  } else {
    throw 'Android SDK Platform 35 is missing. Install Android 15 / API 35 from Android Studio SDK Manager.'
  }
}

$tools = Join-Path $Project '.tools'
$gradleHome = Join-Path $tools 'gradle-8.9'
$gradleExe = Join-Path $gradleHome 'bin\gradle.bat'
if (-not (Test-Path $gradleExe)) {
  New-Item -ItemType Directory -Force -Path $tools | Out-Null
  $zip = Join-Path $tools 'gradle-8.9-bin.zip'
  if (-not (Test-Path $zip)) {
    Write-Host 'Downloading Gradle 8.9...'
    Invoke-WebRequest 'https://services.gradle.org/distributions/gradle-8.9-bin.zip' -OutFile $zip
  }
  Expand-Archive -Path $zip -DestinationPath $tools -Force
}

& $gradleExe --no-daemon :app:assembleDebug
if ($LASTEXITCODE -ne 0) { throw "Gradle build failed with exit code $LASTEXITCODE" }

$apk = Join-Path $Project 'app\build\outputs\apk\debug\app-debug.apk'
if (-not (Test-Path $apk)) { throw 'Build completed but APK was not found.' }
$out = Join-Path $Project 'ORYN-V10.4.1-direct-final-orientation-fix-debug.apk'
Copy-Item $apk $out -Force
Write-Host "APK ready: $out" -ForegroundColor Green
