const fs=require('fs');
const js=fs.readFileSync('app/src/main/assets/www/offline/oryn-mobile-bootstrap.js','utf8');
const gradle=fs.readFileSync('app/build.gradle','utf8');
const java=fs.readFileSync('app/src/main/java/com/studiokinematics/oryn/MainActivity.java','utf8');
const must=[
 "const SCARA_ID='oryn-scara-esp32'",
 "const SCARA_AUTO_HOME_KEY='oryn_scara_auto_home_v1'",
 'function openScaraControlPanel()',
 'function installScaraControlLauncher()',
 "b.textContent='SCARA CONTROL'",
 'SET REFERENCE',
 'HOME / CENTRE',
 'PERIMETER 152 mm',
 'Automatic Home',
 'Radius / Perimeter Test',
 '30° Rotation Test',
 'Full 360° Test',
 'async function scaraSetReferenceAction()',
 'async function scaraHomeAction()',
 'async function scaraPerimeterAction()',
 'async function scaraThirtyDegreeTest()',
 'async function scaraFullCircleTest()',
 "if(p==='/send_home'){await scaraHomeAction()",
 "if(!directConfig()&&!scaraConfig())",
 "setTimeout(()=>maybeScaraAutoHome('connect'),1400)",
 'rotateThrText(raw,readPatternOrientationDegrees())'
];
for(const x of must) if(!js.includes(x)) throw new Error('Missing SCARA full-control marker: '+x);
if(!gradle.includes("versionName '10.4.1-scara-v04-full-control-hotfix2'"))throw new Error('VersionName not updated');
if(!gradle.includes('versionCode 1040419'))throw new Error('VersionCode not updated');
if(!java.includes('10.4.1-scara-v04-full-control-hotfix2'))throw new Error('MainActivity app version not updated');
for(const x of ["const DIRECT_ID='oryn-direct-fluidnc'",'directStartPattern','directHome','startDiscovery','/api/pattern-designer/save']) if(!js.includes(x)) throw new Error('Locked existing path missing: '+x);
console.log('SCARA V0.4 Full Control Hotfix 2 source checks passed.');
