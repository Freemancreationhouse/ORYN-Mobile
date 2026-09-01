#!/usr/bin/env node
'use strict';

// Protocol-model validation for the persistent FluidNC reader. This deliberately
// feeds replies in awkward TCP/Telnet boundaries matching the failure class seen
// on Android: split ok tokens, mixed status frames, and Telnet IAC negotiation.
function frame(chunks){
  const lines=[], statuses=[];
  let line='', status='', inStatus=false, telnetState=0;
  const offerLine=()=>{const t=line.trim();line='';if(t)lines.push(t)};
  for(const chunk of chunks){
    for(const ub of chunk){
      if(telnetState!==0){
        if(telnetState===1){if(ub===255){telnetState=0;continue}if(ub===250){telnetState=3;continue}if(ub>=251&&ub<=254){telnetState=2;continue}telnetState=0;continue}
        if(telnetState===2){telnetState=0;continue}
        if(telnetState===3){if(ub===255)telnetState=4;continue}
        if(telnetState===4){telnetState=ub===240?0:3;continue}
      }
      if(ub===255){telnetState=1;continue}
      const ch=String.fromCharCode(ub);
      if(inStatus){status+=ch;if(ch==='>'){const t=status.trim();status='';inStatus=false;if(t)statuses.push(t)}continue}
      if(ch==='<'){if(line)offerLine();inStatus=true;status='<';continue}
      if(ch==='\r'||ch==='\n'){if(line)offerLine();continue}
      if(ub>=0x20&&ub!==0x7f){line+=ch;if(line.trim().toLowerCase()==='ok')offerLine()}
    }
  }
  if(line)offerLine();
  return {lines,statuses};
}
const enc=s=>Array.from(Buffer.from(s,'utf8'));
let r=frame([enc('o'),enc('k\r'),enc('\n')]);
if(!r.lines.includes('ok'))throw new Error('split o/k acknowledgement not reconstructed');
r=frame([[255,251,1],enc('[MSG:test]\r\n'),enc('ok\r\n')]);
if(!r.lines.includes('ok'))throw new Error('ok lost after Telnet IAC negotiation');
r=frame([enc('<Run|MPos:1,2,0|FS:60,0>\r\n'),enc('o'),enc('k\r\n')]);
if(r.statuses[0] !== '<Run|MPos:1,2,0|FS:60,0>' || !r.lines.includes('ok'))throw new Error('mixed status/ok framing failed');
r=frame([enc('<Idle|MPos:1,2,0|FS:0,0>')]);
if(!r.statuses[0].toLowerCase().startsWith('<idle'))throw new Error('Idle status framing failed');
console.log('PASS Direct FluidNC acknowledgement/status framing model');
console.log(JSON.stringify({splitOk:true,telnetIacFiltered:true,statusSeparated:true,idleFramed:true},null,2));
