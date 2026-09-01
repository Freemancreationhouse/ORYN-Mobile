#!/usr/bin/env node
'use strict';
const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
const javaPath=path.join(root,'app/src/main/java/com/studiokinematics/oryn/MainActivity.java');
const java=fs.readFileSync(javaPath,'utf8');

function numberConst(name){
  const m=java.match(new RegExp(`private\\s+static\\s+final\\s+double\\s+${name}\\s*=\\s*([-+0-9.]+)`));
  if(!m) throw new Error(`Missing ${name}`);
  return Number(m[1]);
}
const xSteps=numberConst('MINI_X_STEPS_PER_MM');
const ySteps=numberConst('MINI_Y_STEPS_PER_MM');
const gear=numberConst('MINI_GEAR_RATIO');
const sign=numberConst('MINI_COUPLING_SIGN');
if(xSteps!==256 || ySteps!==210 || gear!==6.25 || sign!==-1) {
  throw new Error(`Measured Mini constants changed: ${JSON.stringify({xSteps,ySteps,gear,sign})}`);
}
const coupling=xSteps/(gear*ySteps);
const yForX5=5*coupling*sign;
const yForXMinus5=-5*coupling*sign;
if(Math.abs(coupling-0.19504761904761905)>1e-12) throw new Error('Coupling coefficient mismatch');
if(Math.abs(yForX5-(-0.9752380952380952))>1e-12) throw new Error(`X+5 compensation mismatch: ${yForX5}`);
if(Math.abs(yForXMinus5-0.9752380952380952)>1e-12) throw new Error(`X-5 compensation mismatch: ${yForXMinus5}`);

// Confirm the implementation still uses saved live calibration values in the THR transform.
for(const token of [
  'xIncrement = (deltaTheta / (Math.PI * 2.0)) * thetaRevUnits',
  'yGeometryIncrement = deltaRho * rhoTravelUnits * rhoDirection',
  'directCouplingOffset(xIncrement, rhoDirection, kin)'
]) if(!java.includes(token)) throw new Error(`Missing live calibration transform: ${token}`);

console.log('PASS measured Direct ESP32 coupling');
console.log(JSON.stringify({xSteps,ySteps,gear,coupling,x5Compensation:yForX5,xMinus5Compensation:yForXMinus5},null,2));
