const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
const js=fs.readFileSync(path.join(root,'app/src/main/assets/www/offline/oryn-mobile-bootstrap.js'),'utf8');
const checks=[
  ["clearMode==='clear_from_out'||clearMode==='from_perimeter'",'From Perimeter UI/legacy mapping missing'],
  ["clearName='clear_from_out.thr'",'clear_from_out file mapping missing'],
  ["clearMode==='clear_from_in'||clearMode==='from_center'",'From Center UI/legacy mapping missing'],
  ["clearName='clear_from_in.thr'",'clear_from_in file mapping missing'],
  ["clearMode==='clear_sideway'",'Sideways clear mapping missing']
];
for(const [needle,msg] of checks){if(!js.includes(needle))throw new Error(msg);}
const ui=fs.readFileSync(path.join(root,'app/src/main/assets/www/assets/index-D3rZVjEB.js'),'utf8');
if(!ui.includes('value:"clear_from_out",label:"From Perimeter"')) throw new Error('Locked UI From Perimeter value changed/unrecognized');
if(!ui.includes('value:"clear_from_in",label:"From Center"')) throw new Error('Locked UI From Center value changed/unrecognized');
console.log(JSON.stringify({from_perimeter:'clear_from_out.thr',from_center:'clear_from_in.thr',sideway:'clear_sideway.thr'},null,2));
