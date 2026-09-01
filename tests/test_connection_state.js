const fs=require('fs');
const vm=require('vm');
class Store{constructor(init={}){this.m=new Map(Object.entries(init));}getItem(k){return this.m.has(k)?String(this.m.get(k)):null;}setItem(k,v){this.m.set(k,String(v));}removeItem(k){this.m.delete(k);}clear(){this.m.clear();}}
function buildContext(init={}, fresh=true){
 const localStorage=new Store(init), sessionStorage=new Store();
 const document={documentElement:{},body:{appendChild(){},},getElementById(){return null;},querySelectorAll(){return[];},createTreeWalker(){return{nextNode(){return null;}}},createElement(){return {style:{},appendChild(){},remove(){},addEventListener(){},dataset:{},parentNode:{insertBefore(){}}};}};
 class MO{constructor(cb){} observe(){} disconnect(){}}
 class WS{}; WS.CONNECTING=0;WS.OPEN=1;WS.CLOSING=2;WS.CLOSED=3;
 let reloads=0;
 let homes=[];
 const location={origin:'http://app.oryn',href:'http://app.oryn/',pathname:'/',hostname:'app.oryn',reload(){reloads++;}};
 const OrynAndroid={
   consumeFreshLaunch(){const x=fresh;fresh=false;return x;},
   directStatus(){return JSON.stringify({connected:true,is_running:false,is_homing:false});},
   directProbe(h){return JSON.stringify({ok:true,host:h,response:'FluidNC'});},
   directHome(...args){homes.push(args);return true;},
   directProbeAsync(h){}, startDiscovery(){}, directListPatterns(){return'[]';}
 };
 const ctx={console,localStorage,sessionStorage,document,location,MutationObserver:MO,NodeFilter:{SHOW_TEXT:4},Node:{},window:null,URL,Response,Headers,Request,fetch:async()=>new Response('{}',{status:200,headers:{'content-type':'application/json'}}),WebSocket:WS,EventTarget,Event,MessageEvent,CloseEvent:global.CloseEvent||class{constructor(type,opts){this.type=type;Object.assign(this,opts)}},setTimeout(){return 1;},clearTimeout(){},setInterval(){return 1;},clearInterval(){},OrynAndroid};
 ctx.window=ctx;ctx.window.OrynAndroid=OrynAndroid;
 ctx.__reloads=()=>reloads;
 ctx.__homes=()=>homes.slice();
 return ctx;
}
const path=require('path');
const file=path.join(__dirname,'..','app','src','main','assets','www','offline','oryn-mobile-bootstrap.js');
let code=fs.readFileSync(file,'utf8');
code=code.replace(/\}\)\(\);\s*$/,"window.__test={ensureOfflineTable,activateDirectTable,localKnownTables,directConfig,mergeDiscovered,directFetch,readDirectSavedRaw,runPendingDirectAutoHome};})();");
function evalCtx(ctx){vm.createContext(ctx);vm.runInContext(code,ctx,{filename:'bootstrap.js'});return ctx;}
function parseTables(c){return JSON.parse(c.localStorage.getItem('orynmotion_tables'));}
function assert(cond,msg){if(!cond)throw new Error(msg);}
(async()=>{
 const ghost={tables:[
  {id:'oryn-mobile-offline',name:'ORYN Offline',url:'http://app.oryn',isCurrent:true},
  {id:'oryn-direct-fluidnc',name:'ORYN Offline',url:'http://app.oryn',host:'10.99.1.146',directFluidNC:true,isCurrent:false},
  {id:'pi-1',name:'Living Pi',url:'http://192.168.1.50:8080',host:'192.168.1.50',isCurrent:false}
 ],activeTableId:'oryn-direct-fluidnc'};
 const init={orynmotion_tables:JSON.stringify(ghost),orynmotion_active_table:'oryn-direct-fluidnc',oryn_direct_enabled:'1',oryn_direct_last:JSON.stringify({host:'10.99.1.146',thetaRev:50,rhoTravel:22.2,rhoDirection:1,feed:60})};
 let c=evalCtx(buildContext(init,true));
 let d=parseTables(c);
 assert(d.activeTableId==='oryn-mobile-offline','cold start must force offline');
 assert(!d.tables.some(t=>t.id==='oryn-direct-fluidnc'),'cold start must remove ghost direct row');
 assert(d.tables.some(t=>t.id==='pi-1'),'cold start must preserve Pi');
 assert(c.localStorage.getItem('oryn_direct_enabled')==='0','cold start must disable direct mode');
 assert(JSON.parse(c.localStorage.getItem('oryn_direct_last')).rhoTravel===22.2,'cold start must preserve calibration');

 c.__test.activateDirectTable('10.99.1.146',{thetaRev:50,rhoTravel:22.2,rhoDirection:1,feed:60});
 d=parseTables(c);
 assert(d.activeTableId==='oryn-direct-fluidnc','activation sets direct active');
 assert(d.tables.filter(t=>t.id==='oryn-direct-fluidnc').length===1,'exactly one direct row');
 assert(d.tables.find(t=>t.id==='oryn-direct-fluidnc').isCurrent===true,'direct is current backend');
 assert(d.tables.find(t=>t.id==='oryn-mobile-offline').isCurrent===false,'offline not current while direct');
 assert(c.localStorage.getItem('oryn_direct_enabled')==='1','direct enabled');
 assert(c.sessionStorage.getItem('oryn_direct_auto_home_pending_v1')==='10.99.1.146','activation queues one automatic Home');
 assert(c.__test.runPendingDirectAutoHome(c.__test.directConfig())===true,'pending automatic Home starts');
 assert(c.__homes().length===1,'automatic Home runs exactly once');
 assert(c.sessionStorage.getItem('oryn_direct_auto_home_pending_v1')===null,'automatic Home marker is consumed');
 assert(c.__test.runPendingDirectAutoHome(c.__test.directConfig())===false&&c.__homes().length===1,'reload cannot repeat automatic Home');
 c.__test.ensureOfflineTable(false);
 d=parseTables(c);
 assert(d.activeTableId==='oryn-direct-fluidnc','internal reload preserves direct');
 const known=c.__test.localKnownTables();
 assert(known.some(t=>t.id==='oryn-mobile-offline'),'direct mode exposes offline switch target');
 assert(!known.some(t=>t.id==='oryn-direct-fluidnc'),'direct must never appear as known remote');
 assert(known.some(t=>t.id==='pi-1'),'Pi remains known');

 let r=await c.__test.directFetch(new URL('http://direct.oryn/api/table-info'),{method:'GET'});let j=await r.json();
 assert(j.id==='oryn-direct-fluidnc'&&/ESP32 FluidNC/.test(j.name),'direct table-info identity');
 r=await c.__test.directFetch(new URL('http://direct.oryn/api/table-info'),{method:'PATCH',body:JSON.stringify({name:'Workshop ESP32'})});j=await r.json();
 assert(j.name==='Workshop ESP32','direct rename works');
 assert(parseTables(c).tables.find(t=>t.id==='oryn-direct-fluidnc').name==='Workshop ESP32','rename persists table row');

 c.__test.mergeDiscovered([{id:'pi-2',name:'Studio Pi',url:'http://192.168.1.60:8080',host:'192.168.1.60'}]);
 d=parseTables(c);
 assert(d.tables.filter(t=>t.id==='oryn-direct-fluidnc').length===1,'discovery keeps exactly one direct');
 assert(d.tables.some(t=>t.id==='pi-2'),'discovery adds Pi');
 assert(d.activeTableId==='oryn-direct-fluidnc','discovery does not steal active direct');

 c.localStorage.setItem('orynmotion_active_table','oryn-mobile-offline');c.__test.ensureOfflineTable(false);d=parseTables(c);
 assert(d.activeTableId==='oryn-mobile-offline','offline switch works');
 assert(!d.tables.some(t=>t.id==='oryn-direct-fluidnc'),'offline switch removes direct pseudo-row');
 assert(c.localStorage.getItem('oryn_direct_enabled')==='0','offline disables direct transport routing');

 c.localStorage.setItem('orynmotion_active_table','pi-1');c.__test.ensureOfflineTable(false);d=parseTables(c);
 assert(d.activeTableId==='pi-1','Pi selection preserved');
 assert(d.tables.find(t=>t.id==='oryn-mobile-offline').isCurrent===true,'local offline backend remains This while Pi selected');
 assert(d.tables.some(t=>t.id==='pi-1'),'Pi entry preserved');
 console.log('PASS connection-state deterministic tests');
})();
