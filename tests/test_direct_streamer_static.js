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
const session=between('private final class DirectFluidNcSession', 'private void runDirectPattern(');
const run=between('private void runDirectPattern(', '// Existing non-pattern command sender retained');
const directStreamer=session+run;

// No fixed 15-second / acknowledgement deadline in Direct playback.
for(const bad of ['15000','15.0s','acknowledgementDeadlineMs','acknowledgement timed out while motion planner was busy']) {
  if(directStreamer.includes(bad)) throw new Error(`Fixed abort remains in Direct streamer: ${bad}`);
}
if(!session.includes('BlockingQueue<String> lineReplies')) throw new Error('Persistent framed reply queue missing');
if(!session.includes('BlockingQueue<String> statusFrames')) throw new Error('Persistent status-frame queue missing');
if(!session.includes('catch (java.net.SocketTimeoutException timeout) { continue; }')) throw new Error('Reader timeout must continue waiting');
if(!session.includes('line.toString().trim().equalsIgnoreCase("ok")')) throw new Error('Standalone fragmented ok framing missing');
if(!session.includes('if (ub == 255) { telnetState = 1; continue; }')) throw new Error('Telnet IAC filtering missing');
if(!session.includes('while (true)')) throw new Error('Unbounded Direct acknowledgement/Idle wait missing');
if(!session.includes('lineReplies.poll(500, TimeUnit.MILLISECONDS)')) throw new Error('Backpressure poll loop missing');
if(!session.includes('if (z.equals("ok")) return;')) throw new Error('Real ok acknowledgement gate missing');
if(!session.includes('statusFrames.poll(150, TimeUnit.MILLISECONDS)')) throw new Error('Status frame Idle polling missing');
if(!session.includes('if (z.contains("<idle")) return;')) throw new Error('FluidNC Idle completion gate missing');
if(!run.includes('sock.setTcpNoDelay(true)')) throw new Error('TCP_NODELAY missing');
if(!run.includes('sock.setKeepAlive(true)')) throw new Error('TCP keepalive missing');
if(!run.includes('acquireDirectPatternRuntimeLocks()')) throw new Error('Direct runtime Wi-Fi/CPU hold missing');
if(!run.includes('releaseDirectPatternRuntimeLocks()')) throw new Error('Direct runtime lock release missing');
if((run.match(/createDirectSocketForHost\(h\)/g)||[]).length!==1) throw new Error('Pattern streamer should own exactly one socket');
if((run.match(/session\.sendCommandAndWaitOk\(g\);/g)||[]).length!==1) throw new Error('Relative THR command must be sent exactly once per point');
if(!run.includes('if (acknowledgedPoints != pts.size())')) throw new Error('All-point completion invariant missing');
if(!run.includes('acknowledgedPoints++;')) throw new Error('Acknowledged point counter missing');
if(!run.includes('session.waitUntilIdle();')) throw new Error('Final Idle wait missing');
if(!run.includes('"G91 G21 G1 X%.6f Y%.6f F%.3f"')) throw new Error('Coordinated relative G91/G21 XY command missing');
if(run.includes('sendDirectPatternAndWaitOk')) throw new Error('Old raw chunk acknowledgement reader still used');

const idxAll=run.indexOf('if (acknowledgedPoints != pts.size())');
const idxIdle=run.indexOf('session.waitUntilIdle();',idxAll);
const idxG90=run.indexOf('session.sendCommandAndWaitOk("G90")');
if(!(idxAll>=0 && idxIdle>idxAll && idxG90>idxIdle)) throw new Error('Completion order is not all-points -> Idle -> G90');

console.log('PASS Direct ESP32 persistent FluidNC streamer static validation');
console.log(JSON.stringify({
  no15SecondAbort:true,
  persistentReplyFraming:true,
  telnetNegotiationFiltered:true,
  timeoutIsBackpressure:true,
  exactlyOnceRelativeMove:true,
  allPointsBeforeComplete:true,
  finalIdleGate:true,
  oneMotionSocket:true,
  tcpNoDelay:true,
  runtimeWifiCpuHold:true
},null,2));
