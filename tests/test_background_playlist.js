#!/usr/bin/env node
'use strict';

const fs=require('fs');
const path=require('path');
const vm=require('vm');
const root=path.resolve(__dirname,'..');
const main=fs.readFileSync(path.join(root,'app/src/main/java/com/studiokinematics/oryn/MainActivity.java'),'utf8');
const service=fs.readFileSync(path.join(root,'app/src/main/java/com/studiokinematics/oryn/OrynPlaybackService.java'),'utf8');
const manifest=fs.readFileSync(path.join(root,'app/src/main/AndroidManifest.xml'),'utf8');
const designer=fs.readFileSync(path.join(root,'app/src/main/assets/www/static/pattern-designer/app.js'),'utf8');
let boot=fs.readFileSync(path.join(root,'app/src/main/assets/www/offline/oryn-mobile-bootstrap.js'),'utf8');

function assert(v,m){if(!v)throw new Error(m);}
const destroy=main.slice(main.indexOf('@Override protected void onDestroy()'),main.indexOf('private class LocalAssetClient'));
assert(!destroy.includes('directStop();'),'Activity destruction must not send a FluidNC Stop');
assert(destroy.includes('directRunning.get()')&&destroy.includes('directHoming.get()'),'Activity cleanup must preserve active motion');
assert(main.includes('OrynPlaybackService.start(getApplicationContext(), "Direct ESP32 pattern in progress")'),'Pattern start must promote playback to foreground');
assert(service.includes('PowerManager.PARTIAL_WAKE_LOCK'),'Foreground playback must hold a CPU wake lock');
assert(service.includes('WifiManager.WIFI_MODE_FULL_HIGH_PERF'),'Foreground playback must hold a high-performance Wi-Fi lock');
assert(service.includes('START_NOT_STICKY'),'Killed relative playback must never be restarted/resend uncertain motion');
assert(manifest.includes('android.permission.FOREGROUND_SERVICE_CONNECTED_DEVICE'),'Connected-device foreground permission missing');
assert(manifest.includes('android:stopWithTask="false"'),'Playback service must survive leaving the app task');
assert(main.includes('private static final AtomicBoolean freshLaunchPending'),'Fresh-launch state must survive Activity recreation');
assert(main.includes('private static final AtomicBoolean directRunning'),'Running state must survive Activity recreation');
assert(main.includes('private static volatile Socket directPatternSocket'),'Reopened controls must attach to the active FluidNC socket');
assert(main.includes('scanFluidNcWifiNetworks')&&main.includes('$WiFi/ListAPs'),'Wi-Fi setup must scan from the ESP32 itself');
assert(main.includes('!containsFluidNcOk(lower)'),'Wi-Fi setting writes must require real FluidNC acknowledgements');
assert(boot.includes('oryn-home-detect')&&boot.includes('Detect 2.4 GHz Networks from ESP32'),'Wi-Fi setup must expose ESP32-side 2.4 GHz detection');
assert(boot.includes("Using this phone's hotspot?")&&boot.includes('disconnect FluidNC Wi-Fi'),'Same-phone hotspot sequence must be visible in Wi-Fi setup');
assert(designer.includes("table.id==='oryn-direct-fluidnc'||table.directFluidNC"),'Pattern Designer must accept the active Direct table');
assert(designer.includes('directNative:true'),'Direct Pattern Designer saves must use the native Android library');
assert(designer.includes('target&&!target.directNative'),'Only remote Pi targets may use the remote save endpoint');

class Store{constructor(init={}){this.m=new Map(Object.entries(init));}getItem(k){return this.m.has(k)?String(this.m.get(k)):null;}setItem(k,v){this.m.set(k,String(v));}removeItem(k){this.m.delete(k);}}
const generated=[{path:'custom/Generated Art.thr',native_path:'user/Generated Art.thr',name:'Generated Art',category:'custom',date_modified:1,coordinates_count:3}];
let started=null;
let saved=null;
const localStorage=new Store({
  orynmotion_active_table:'oryn-direct-fluidnc',oryn_direct_enabled:'1',
  oryn_direct_last:JSON.stringify({host:'192.168.0.1',thetaRev:50,rhoTravel:22.2,rhoDirection:1,feed:60}),
  orynmotion_tables:JSON.stringify({activeTableId:'oryn-direct-fluidnc',tables:[{id:'oryn-direct-fluidnc',directFluidNC:true,directHost:'192.168.0.1',thetaRevUnits:50,rhoTravelUnits:22.2,rhoDirection:1,directFeed:60,isCurrent:true,url:'http://app.oryn'}]})
});
const sessionStorage=new Store();
const document={documentElement:{classList:{contains(){return false;}}},body:{classList:{toggle(){}},appendChild(){}},getElementById(){return null;},querySelectorAll(){return[];},createTreeWalker(){return{nextNode(){return null;}}},createElement(){return{style:{},appendChild(){},remove(){},addEventListener(){},dataset:{},parentNode:{insertBefore(){}}};}};
class MO{constructor(){}observe(){}}
class WS{} WS.CONNECTING=0;WS.OPEN=1;WS.CLOSING=2;WS.CLOSED=3;
const OrynAndroid={
 consumeFreshLaunch(){return false;},directListPatterns(){return JSON.stringify(generated);},
 directStatus(){return JSON.stringify({connected:true,is_running:false,is_homing:false,rho:0});},
 directProbe(){return JSON.stringify({ok:true,host:'192.168.0.1'});},
 directStartPattern(...args){started=args;return true;},directReadPattern(){return '0 0\n1 0.5\n2 1\n';},
 directSavePattern(name,thr){saved={name,thr};return JSON.stringify({success:true,path:'custom/'+name+'.thr',name});}
};
const location={origin:'http://app.oryn',href:'http://app.oryn/',pathname:'/',hostname:'app.oryn',reload(){}};
const ctx={console,localStorage,sessionStorage,document,location,MutationObserver:MO,NodeFilter:{SHOW_TEXT:4},Node:{},window:null,URL,Response,Headers,Request,fetch:async()=>new Response('{}',{status:200,headers:{'content-type':'application/json'}}),WebSocket:WS,EventTarget,Event,MessageEvent,CloseEvent:global.CloseEvent||class{constructor(type,opts){this.type=type;Object.assign(this,opts)}},setTimeout(){return 1;},clearTimeout(){},setInterval(){return 1;},clearInterval(){},OrynAndroid};
ctx.window=ctx;
boot=boot.replace(/\}\)\(\);\s*$/,"window.__test={updateLocalPlaylist,playlists,directFetch,canonicalPatternPath};})();");
vm.createContext(ctx);vm.runInContext(boot,ctx,{filename:'bootstrap.js'});

let result=ctx.__test.updateLocalPlaylist({playlist_name:'Generated',pattern:'user/Generated Art.thr'},false);
assert(result.success,'Generated pattern add must succeed');
assert(result.files.length===1&&result.files[0]==='custom/Generated Art.thr','Native generated path must canonicalize to catalog path');
result=ctx.__test.updateLocalPlaylist({playlist:'Generated',file_name:'Generated Art'},false);
assert(result.files.length===1,'Generated pattern must not be duplicated through an alias');

(async()=>{
 const saveResponse=await ctx.__test.directFetch(new URL('http://direct.oryn/api/pattern-designer/save'),{method:'POST',body:JSON.stringify({name:'New Design',thr:'0 0\n1 0.5\n2 1\n'})});
 const savePayload=await saveResponse.json();
 assert(saveResponse.ok&&savePayload.success,'Direct Pattern Designer save must succeed');
 assert(saved&&saved.name==='New Design'&&saved.thr.includes('2 1'),'Direct Pattern Designer save must invoke native storage');
 assert(savePayload.path==='custom/New Design.thr','Saved Direct pattern must return its ORYN Library path');
 const response=await ctx.__test.directFetch(new URL('http://direct.oryn/run_playlist'),{method:'POST',body:JSON.stringify({playlist_name:'Generated',run_mode:'single',clear_pattern:'none'})});
 const payload=await response.json();
 assert(response.ok&&payload.success,'Direct generated-pattern playlist must start');
 assert(started,'Direct streamer was not invoked for playlist');
 const sequence=JSON.parse(started[1]);
 assert(sequence.length===1&&sequence[0].asset==='user/Generated Art.thr','Playlist must stream the generated native THR file');
 console.log('PASS Android background playback, Activity reattach, Pattern Designer save, and playlist validation');
})();
