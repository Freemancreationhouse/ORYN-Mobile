#!/usr/bin/env node
'use strict';
const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
const catalogDoc=JSON.parse(fs.readFileSync(path.join(root,'app/src/main/assets/www/offline/pattern-catalog.json'),'utf8'));
const catalog=Array.isArray(catalogDoc)?catalogDoc:(catalogDoc.patterns||[]);
const java=fs.readFileSync(path.join(root,'app/src/main/java/com/studiokinematics/oryn/MainActivity.java'),'utf8');
function entry(name){
  const x=catalog.find(v=>v.path===name);
  if(!x) throw new Error(`Missing ${name} from catalog`);
  return x;
}
function points(name){
  const e=entry(name);
  const rel=e.thr_url.replace(/^\//,'');
  const p=path.join(root,'app/src/main/assets/www',rel);
  return fs.readFileSync(p,'utf8').split(/\r?\n/).map(s=>s.trim()).filter(s=>s&&!s.startsWith('#')).map(s=>s.split(/[\s,]+/).slice(0,2).map(Number));
}
function normalizedRhos(pts, mode){
  let prev=0.37; // arbitrary current machine radius before clear entry
  const out=[];
  for(let i=0;i<pts.length;i++){
    const raw=pts[i][1];
    const r=Math.max(0,Math.min(1,raw));
    const next=i===0?r:(mode==='in'?Math.max(prev,r):Math.min(prev,r));
    out.push(next); prev=next;
  }
  return out;
}
function assertProgress(name,mode){
  const pts=points(name), rs=normalizedRhos(pts,mode);
  if(pts.length<100) throw new Error(`${name} unexpectedly short`);
  for(let i=1;i<rs.length;i++){
    if(mode==='in' && rs[i]+1e-12<rs[i-1]) throw new Error(`${name} moved inward at ${i}`);
    if(mode==='out' && rs[i]-1e-12>rs[i-1]) throw new Error(`${name} moved outward at ${i}`);
  }
  if(mode==='in' && !(rs[0] <= 0.001 && rs.at(-1)>=0.999)) throw new Error(`${name} endpoints invalid`);
  if(mode==='out' && !(rs[0] >= 0.999 && rs.at(-1)<=0.0011)) throw new Error(`${name} endpoints invalid`);
  return {points:pts.length,start:rs[0],end:rs.at(-1)};
}
if(!java.includes('if (firstPoint) return r;')) throw new Error('clear entry-point handling missing');
if(!java.includes('if (clearFromIn) return Math.max(previousRho, r);')) throw new Error('clear_from_in monotonic clamp missing');
if(!java.includes('if (clearFromOut) return Math.min(previousRho, r);')) throw new Error('clear_from_out monotonic clamp missing');
const fromIn=assertProgress('clear_from_in.thr','in');
const fromOut=assertProgress('clear_from_out.thr','out');
console.log('PASS clear progression through common Direct streamer');
console.log(JSON.stringify({clear_from_in:fromIn,clear_from_out:fromOut},null,2));
