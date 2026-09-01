#!/usr/bin/env node
'use strict';

const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
const java=fs.readFileSync(path.join(root,'app/src/main/java/com/studiokinematics/oryn/MainActivity.java'),'utf8');
const boot=fs.readFileSync(path.join(root,'app/src/main/assets/www/offline/oryn-mobile-bootstrap.js'),'utf8');

function assert(value,message){if(!value)throw new Error(message);}
function methodBody(source,signature,nextSignature){
  const start=source.indexOf(signature),end=source.indexOf(nextSignature,start+signature.length);
  assert(start>=0&&end>start,'Could not isolate '+signature);
  return source.slice(start,end);
}
function rhoSeries(file){
  return fs.readFileSync(file,'utf8').split(/\r?\n/).map(x=>x.trim()).filter(x=>x&&!x.startsWith('#')).map(x=>Number(x.split(/[\s,]+/)[1]));
}

const playback=methodBody(java,'private void runDirectPattern(', 'private void beginDirectFileTiming(');
assert(playback.indexOf('new DirectFluidNcSession(h)')<playback.indexOf('detectDirectKinematics(session)'),
  'Pattern profile detection must use the one exclusive motion session');
assert(!playback.includes('detectDirectKinematics(h)'), 'Pattern must not open a second profile socket');
assert(playback.includes('session.command(g)'), 'Every coordinated point must use the persistent session');
assert(playback.includes('directPoint++'), 'Acknowledged THR points must advance progress');
assert(playback.indexOf('session.awaitIdle();')<playback.indexOf('completeDirectFileTiming();'),
  'Completion must wait for FluidNC Idle before finalizing time');
assert(playback.includes('directRunning.set(false)'), 'Playback session must release the running state for the next pattern');

const session=methodBody(java,'private final class DirectFluidNcSession', 'private String cleanFluidNcFrame(');
assert(session.includes('catch (java.net.SocketTimeoutException waiting)'), 'Socket timeout must be framed as waiting');
assert(session.includes('return null;'), 'Read timeout must return waiting/backpressure');
assert(!session.includes('acknowledgementDeadline')&&!session.includes('Timed out waiting'),
  'Persistent playback session must not contain a fixed acknowledgement abort');
assert(session.includes('socket.setTcpNoDelay(true)')&&session.includes('socket.setKeepAlive(true)'),
  'Playback socket must be configured for a persistent motion stream');

for(const field of ['elapsed_time','remaining_time','last_completed_time']){
  assert(java.includes(`o.put("${field}"`),`Native status missing ${field}`);
  assert(boot.includes(`${field}:`),`Web status bridge missing ${field}`);
}
assert(boot.includes('DIRECT_AUTO_HOME_PENDING')&&boot.includes('runPendingDirectAutoHome'),
  'Direct connection must queue and consume automatic Home');
assert(boot.includes("b.pre_execution==='clear_from_out'"), 'Clear From Perimeter alias is missing');

const clearIn=rhoSeries(path.join(root,'app/src/main/assets/www/offline/patterns/ffdf5ef9d3979a9a.thr'));
const clearOut=rhoSeries(path.join(root,'app/src/main/assets/www/offline/patterns/3e2636755d7c94db.thr'));
assert(clearIn[0]<=0.001&&clearIn.at(-1)>=0.999,'clear_from_in must run Center to Perimeter');
assert(clearOut[0]>=0.999&&clearOut.at(-1)<=0.001,'clear_from_out must run Perimeter to Center');

console.log('PASS Direct auto-home, timer, consecutive-session, Idle, and clear-direction validation');
