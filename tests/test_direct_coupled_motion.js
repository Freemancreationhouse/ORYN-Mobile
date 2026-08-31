#!/usr/bin/env node
'use strict';
const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
const thr=path.join(root,'app/src/main/assets/www/offline/patterns/3e2636755d7c94db.thr');
const pts=fs.readFileSync(thr,'utf8').split(/\r?\n/).map(s=>s.trim()).filter(s=>s&&!s.startsWith('#')).map(s=>s.split(/[\s,]+/).slice(0,2).map(Number));
if(pts.length!==3447) throw new Error('Unexpected clear_from_out coordinate count: '+pts.length);
const turns=(pts.at(-1)[0]-pts[0][0])/(2*Math.PI);
if(Math.abs(turns-32.9853394206)>1e-6) throw new Error('Unexpected clear turns: '+turns);

// Match the locked Pi V9 formula for the compact 28BYJ/Mini profile.
const thetaRev=50, rhoTravel=22.2, rhoDirection=1, xSteps=256, ySteps=180, gear=32, sourceSign=-1;
let theta=0, rho=0, sumX=0, sumY=0;
for(const [targetTheta,targetRho] of pts){
  const dTheta=targetTheta-theta, dRho=targetRho-rho;
  const dx=(dTheta/(2*Math.PI))*thetaRev;
  const yGeom=dRho*rhoTravel*rhoDirection;
  const coupling=dx*(xSteps/(gear*ySteps))*sourceSign*rhoDirection;
  const dy=yGeom+coupling;
  sumX+=dx; sumY+=dy; theta=targetTheta; rho=targetRho;
}
const expectedX=(pts.at(-1)[0]/(2*Math.PI))*thetaRev;
const expectedY=(pts.at(-1)[1]-0)*rhoTravel + expectedX*(xSteps/(gear*ySteps))*sourceSign;
if(Math.abs(sumX-expectedX)>1e-9) throw new Error('X delta accumulation mismatch');
if(Math.abs(sumY-expectedY)>1e-9) throw new Error('Y coupled accumulation mismatch');

// At ~3 revolutions, coupling must be materially active; otherwise the failure
// seen on the physical table (circling near one radius) can recur.
let i=0; while(i<pts.length-1 && pts[i][0] < 6*Math.PI) i++;
const t=pts[i][0], r=pts[i][1];
const x=(t/(2*Math.PI))*thetaRev;
const yGeom=(r-0)*rhoTravel; // from center start to this target
const yCoupling=x*(xSteps/(gear*ySteps))*sourceSign;
if(Math.abs(yCoupling)<5.0) throw new Error('Expected strong Mini coupling by 3 turns');
console.log('PASS direct coupled motion parity');
console.log(JSON.stringify({points:pts.length,turns,threeTurn:{rho:r,x,yGeom,yCoupling,totalY:yGeom+yCoupling},final:{sumX,sumY}},null,2));
