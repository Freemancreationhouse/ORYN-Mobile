#!/usr/bin/env node
'use strict';
const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
const java=fs.readFileSync(path.join(root,'app/src/main/java/com/studiokinematics/oryn/MainActivity.java'),'utf8');
function between(a,b){
  const i=java.indexOf(a); if(i<0) throw new Error(`Missing ${a}`);
  const j=java.indexOf(b,i+1); if(j<0) throw new Error(`Missing end ${b}`);
  return java.slice(i,j);
}
const session=between('private final class DirectFluidNcWebSocketSession', 'private void runDirectPattern(');
const run=between('private void runDirectPattern(', '// Existing non-pattern command sender retained');
const directStreamer=session+run;

// No fixed 15-second acknowledgement/playback abort in Direct pattern playback.
for(const bad of ['15000','15.0s','acknowledgementDeadlineMs','acknowledgement timed out while motion planner was busy']) {
  if(directStreamer.includes(bad)) throw new Error(`Fixed abort remains in Direct streamer: ${bad}`);
}
if(!session.includes('Sec-WebSocket-Key')) throw new Error('FluidNC WebSocket handshake missing');
if(!session.includes('Sec-WebSocket-Accept')) throw new Error('WebSocket handshake validation missing');
if(!session.includes('frame.write(0x80 | len)')) throw new Error('Client WebSocket masking bit missing');
if(!session.includes('maskRandom.nextBytes(mask)')) throw new Error('Per-frame WebSocket mask missing');
if(!session.includes('catch (java.net.SocketTimeoutException timeout)')) throw new Error('Socket timeout/backpressure handling missing');
if(!session.includes('continue; // heartbeat only')) throw new Error('Reader timeout must continue waiting');
if(!session.includes('lineReplies.poll(500, TimeUnit.MILLISECONDS)')) throw new Error('Backpressure acknowledgement wait missing');
if(!session.includes('if (z.equals("ok")) return;')) throw new Error('Real ok acknowledgement gate missing');
if(!session.includes('if (z.contains("<idle")) return;')) throw new Error('FluidNC Idle completion gate missing');
if(!session.includes('CURRENT_ID / ACTIVE_ID / PING')) throw new Error('WebSocket management message handling missing');
if(!session.includes('if (opcode == 0x9) { sendFrame(0xA, payload); continue; }')) throw new Error('WebSocket ping/pong handling missing');
if(!run.includes('new InetSocketAddress(h, 81)')) throw new Error('Direct pattern streamer is not using FluidNC WebSocket port 81');
if(run.includes('new InetSocketAddress(h, 23)')) throw new Error('Direct pattern streamer still uses Telnet port 23');
if(!run.includes('sock.setTcpNoDelay(true)')) throw new Error('TCP_NODELAY missing');
if(!run.includes('sock.setKeepAlive(true)')) throw new Error('TCP keepalive missing');
if(!run.includes('acquireDirectPatternRuntimeLocks()')) throw new Error('Direct runtime Wi-Fi/CPU hold missing');
if(!run.includes('releaseDirectPatternRuntimeLocks()')) throw new Error('Direct runtime lock release missing');
if((run.match(/createDirectSocketForHost\(h\)/g)||[]).length!==1) throw new Error('Pattern streamer should own exactly one motion socket');
if((run.match(/session\.sendCommandAndWaitOk\(g\);/g)||[]).length!==1) throw new Error('Relative THR command must be sent exactly once per point');
if(!run.includes('if (acknowledgedPoints != pts.size())')) throw new Error('All-point completion invariant missing');
if(!run.includes('acknowledgedPoints++;')) throw new Error('Acknowledged point counter missing');
if(!run.includes('session.waitUntilIdle();')) throw new Error('Final Idle wait missing');
if(!run.includes('"G91 G21 G1 X%.6f Y%.6f F%.3f"')) throw new Error('Coordinated relative G91/G21 XY command missing');

const idxAll=run.indexOf('if (acknowledgedPoints != pts.size())');
const idxIdle=run.indexOf('session.waitUntilIdle();',idxAll);
const idxG90=run.indexOf('session.sendCommandAndWaitOk("G90")');
if(!(idxAll>=0 && idxIdle>idxAll && idxG90>idxIdle)) throw new Error('Completion order is not all-points -> Idle -> G90');

const stopBlock=between('private void directStop()', 'private void startDiscoveryAsync()');
if(!stopBlock.includes('ws.sendEmergencyReset()')) throw new Error('Explicit Stop does not send WebSocket ctrl-X');

console.log('PASS Direct ESP32 FluidNC WebSocket streamer static validation');
console.log(JSON.stringify({
  no15SecondAbort:true,
  websocketPort81:true,
  oneMotionConnection:true,
  maskedClientFrames:true,
  pingPong:true,
  timeoutIsBackpressure:true,
  exactlyOnceRelativeMove:true,
  allPointsBeforeComplete:true,
  finalIdleGate:true,
  explicitStopCtrlX:true
},null,2));
