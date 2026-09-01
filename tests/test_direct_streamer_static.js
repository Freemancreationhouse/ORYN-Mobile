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
const run=between('private void runDirectPattern(', 'private void waitForDirectIdle(');
const idle=between('private void waitForDirectIdle(', 'private void sendAndWaitOk(');
const ack=between('private void sendDirectPatternAndWaitOk(', 'private boolean containsFluidNcAlarm(');

// No fixed 15-second / acknowledgement deadline in Direct pattern playback.
const streamer=run+idle+ack;
for(const bad of ['15000','15.0s','acknowledgementDeadline','acknowledgement timed out']) {
  if(streamer.includes(bad)) throw new Error(`Fixed abort remains in Direct streamer: ${bad}`);
}
if(!ack.includes('while (true)')) throw new Error('Acknowledgement wait is not unbounded');
if(!ack.includes('catch (java.net.SocketTimeoutException timeout)')) throw new Error('Socket timeout handling missing');
if(!ack.includes('Never treat it as completion') || !ack.includes('never resend')) throw new Error('Timeout/backpressure exactly-once rule missing');
if((run.match(/sendDirectPatternAndWaitOk\(out, in, g\);/g)||[]).length!==1) throw new Error('Relative THR command must be sent exactly once per point');
if(!run.includes('if (acknowledgedPoints != pts.size())')) throw new Error('All-point completion invariant missing');
if(!run.includes('acknowledgedPoints++;')) throw new Error('Acknowledged point counter missing');
if(!idle.includes('while (true)')) throw new Error('Final Idle wait still has a deadline');
if(!idle.includes('if (z.contains("<idle")) return;')) throw new Error('FluidNC <Idle> completion gate missing');
if(!idle.includes("out.write('?')")) throw new Error('FluidNC status polling missing');
if(!run.includes('sock.setKeepAlive(true)')) throw new Error('Motion socket TCP keepalive missing');
if((run.match(/createDirectSocketForHost\(h\)/g)||[]).length!==1) throw new Error('Pattern streamer should own exactly one motion socket');

// Final per-file sequence must verify all points, then wait Idle. Final G90 must happen after the sequence.
const idxAll=run.indexOf('if (acknowledgedPoints != pts.size())');
const idxIdle=run.indexOf('waitForDirectIdle(out, in);',idxAll);
const idxG90=run.indexOf('sendDirectPatternAndWaitOk(out, in, "G90")');
if(!(idxAll>=0 && idxIdle>idxAll && idxG90>idxIdle)) throw new Error('Completion order is not all-points -> Idle -> G90');

// Pattern formula must remain coordinated relative XY.
if(!run.includes('"G91 G21 G1 X%.6f Y%.6f F%.3f"')) throw new Error('Coordinated relative G91/G21 XY command missing');

console.log('PASS Direct ESP32 streamer static validation');
console.log(JSON.stringify({no15SecondAbort:true,timeoutIsBackpressure:true,allPointsBeforeComplete:true,finalIdleGate:true,oneMotionSocket:true},null,2));
