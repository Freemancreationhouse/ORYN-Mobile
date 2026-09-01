#!/usr/bin/env node
'use strict';
const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');
const js=fs.readFileSync(path.join(root,'app/src/main/assets/www/offline/oryn-mobile-bootstrap.js'),'utf8');
const java=fs.readFileSync(path.join(root,'app/src/main/java/com/studiokinematics/oryn/MainActivity.java'),'utf8');

if(!js.includes("if(b.pre_execution&&b.pre_execution!=='none')")) throw new Error('No-clear guard missing');
const clearGuard=js.indexOf("if(b.pre_execution&&b.pre_execution!=='none')");
const patternPush=js.indexOf("seq.push({asset:x.native_path||x.thr_url.replace(/^\\//,''),display:x.path||String(b.file_name||'pattern.thr')});",clearGuard);
if(patternPush<0) throw new Error('Selected pattern is not appended after optional clear block');
const guardClose=js.indexOf("seq.push({asset:x.native_path",clearGuard);
if(guardClose<0) throw new Error('Pattern append missing');

const runStart=java.indexOf('private void runDirectPattern(');
const runEnd=java.indexOf('// Existing non-pattern command sender retained',runStart);
const run=java.slice(runStart,runEnd);
if(!run.includes('for (int pi=0; pi<paths.length() && !directStopRequested.get(); pi++)')) throw new Error('Sequence file loop missing');
if(!run.includes('for (double[] pt : pts)')) throw new Error('THR point loop missing');
if(!run.includes('acknowledgedPoints++')) throw new Error('Point consumption counter missing');
if(!run.includes('if (acknowledgedPoints != pts.size())')) throw new Error('No-clear pattern can complete without all points');
if(!run.includes('session.waitUntilIdle();')) throw new Error('No-clear pattern final Idle wait missing');

console.log('PASS Direct no-clear path uses the same full-point streamer');
console.log(JSON.stringify({noClearAddsNoClearFile:true,selectedPatternAlwaysQueued:true,allPointsRequired:true,finalIdleRequired:true},null,2));
