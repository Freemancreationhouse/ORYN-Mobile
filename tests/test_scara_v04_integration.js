const fs=require('fs');
const js=fs.readFileSync('app/src/main/assets/www/offline/oryn-mobile-bootstrap.js','utf8');
const gradle=fs.readFileSync('app/build.gradle','utf8');
const must=[
 "const SCARA_ID='oryn-scara-esp32'",
 'function scaraConfig()',
 'async function probeScara(host)',
 'function openScaraConnect()',
 'async function scaraFetch(u,init={})',
 "'/api/set_reference'",
 "'/api/move_polar?theta_deg='",
 "'/api/play?file='",
 "'/api/pause'",
 "'/api/resume'",
 "'/api/stop'",
 'class ScaraStatusSocket',
 "scara.textContent='ORYN SCARA ESP32'",
 "b.textContent='SCARA SET REFERENCE'",
 'rotateThrText(raw,readPatternOrientationDegrees())'
];
for(const x of must){if(!js.includes(x))throw new Error('Missing SCARA integration marker: '+x);}
if(!gradle.includes("versionName '10.4.1-scara-v04'"))throw new Error('Android version not bumped');
// Guard the locked existing controller paths.
for(const x of ["const DIRECT_ID='oryn-direct-fluidnc'",'directStartPattern','directHome','startDiscovery','/api/pattern-designer/save'])if(!js.includes(x))throw new Error('Locked existing function missing: '+x);
console.log('SCARA V0.4 Android integration source checks passed.');
