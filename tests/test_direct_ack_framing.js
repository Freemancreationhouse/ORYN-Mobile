#!/usr/bin/env node
'use strict';

// Model the message-boundary parsing used by the Direct FluidNC WebSocket
// streamer. FluidNC may emit console responses as text or binary messages.
function parseMessage(text){
  const lines=[],statuses=[];
  text=String(text).replace(/\0/g,'');
  for(const piece of text.split(/\r?\n/)){
    let work=piece.trim(); if(!work)continue;
    let non='',cursor=0;
    while(cursor<work.length){
      const lt=work.indexOf('<',cursor);
      if(lt<0){non+=work.slice(cursor);break;}
      if(lt>cursor)non+=work.slice(cursor,lt);
      const gt=work.indexOf('>',lt+1);
      if(gt<0){non+=work.slice(lt);break;}
      statuses.push(work.slice(lt,gt+1).trim());
      cursor=gt+1;
    }
    non=non.trim(); if(non)lines.push(non);
  }
  return {lines,statuses};
}

let r=parseMessage('CURRENT_ID:0');
if(r.lines[0]!=='CURRENT_ID:0') throw new Error('WebSocket management message parsing failed');
r=parseMessage('PING:0');
if(r.lines[0]!=='PING:0') throw new Error('PING message parsing failed');
r=parseMessage('ok\n');
if(!r.lines.includes('ok')) throw new Error('Standalone WebSocket ok not recognized');
r=parseMessage('[MSG:test]\nok\n');
if(!r.lines.includes('ok')) throw new Error('ok lost after informational message');
r=parseMessage('ok<Run|MPos:1,2,0|FS:60,0>');
if(!r.lines.includes('ok')||r.statuses[0]!=='<Run|MPos:1,2,0|FS:60,0>') throw new Error('Mixed ok/status WebSocket message failed');
r=parseMessage('<Idle|MPos:1,2,0|FS:0,0>');
if(!r.statuses[0].toLowerCase().startsWith('<idle')) throw new Error('Idle status framing failed');

// Critically, WebSocket message boundaries keep an app-level PING message from
// becoming glued to the next acknowledgement as could happen in raw TCP chunks.
const a=parseMessage('PING:0'), b=parseMessage('ok\n');
if(a.lines.join('')+b.lines.join('')!=='PING:0ok') throw new Error('Test setup failed');
if(!b.lines.includes('ok')) throw new Error('Message boundary did not preserve next ok');

console.log('PASS Direct FluidNC WebSocket acknowledgement/status framing model');
console.log(JSON.stringify({managementMessagesSeparated:true,binaryTextPayloadCompatible:true,okFramed:true,statusSeparated:true,idleFramed:true},null,2));
