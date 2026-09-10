const fs=require('fs');
const js=fs.readFileSync('app/src/main/assets/www/offline/oryn-mobile-bootstrap.js','utf8');
const gradle=fs.readFileSync('app/build.gradle','utf8');
const java=fs.readFileSync('app/src/main/java/com/studiokinematics/oryn/MainActivity.java','utf8');
const must=[
 "SCARA-V04-PREVIEW-TIME-HOTFIX3",
 'function buildScaraTiming(pts,radiusMm,speedMmS)',
 'function updateScaraTiming(current,percentage)',
 "const pts=parseThrText(raw);if(!pts.length)",
 'scaraState.total=pts.length',
 'scaraState.time_cumulative=timing.cum',
 'scaraState.total_time=timing.total',
 'current_file:scaraState.current_file||null',
 'total:tot,percentage:pct',
 'elapsed_time:Number(scaraState.elapsed_time||0)',
 'remaining_time:Number(scaraState.remaining_time||0)',
 'True automatic homing after complete ESP32 power loss requires physical joint reference sensors',
 'GPIO32 and GPIO33'
];
for(const x of must)if(!js.includes(x))throw new Error('Missing preview/time hotfix marker: '+x);
if(js.includes('current_file:st.pattern||scaraState.current_file||null'))throw new Error('Remote temporary SCARA filename can still replace local preview filename.');
if(js.includes('total:Math.max(Number(st.played_points||0),1),percentage:Number(st.progress||0),elapsed_time:0,remaining_time:0'))throw new Error('Old zero-timing SCARA progress payload still present.');
if(!gradle.includes("versionName '10.4.1-scara-v04-preview-time-hotfix3'"))throw new Error('VersionName not updated.');
if(!gradle.includes('versionCode 1040420'))throw new Error('VersionCode not updated.');
if(!java.includes('10.4.1-scara-v04-preview-time-hotfix3'))throw new Error('MainActivity version not updated.');
for(const x of ["const DIRECT_ID='oryn-direct-fluidnc'",'directStartPattern','directHome','startDiscovery','/api/pattern-designer/save'])if(!js.includes(x))throw new Error('Locked existing function missing: '+x);
console.log('SCARA V0.4 Preview + Timing Hotfix 3 checks passed.');
