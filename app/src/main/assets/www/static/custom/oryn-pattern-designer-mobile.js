(() => {
  'use strict';
  const ID='oryn-mobile-pattern-designer-launch';
  const STYLE_ID='oryn-mobile-pattern-designer-style';
  const URL='/static/pattern-designer/index.html?mobile=1';
  let scheduled=false;

  function isBrowse(){
    if(location.pathname!=='/' && !location.pathname.toLowerCase().includes('browse')) return false;
    return Array.from(document.querySelectorAll('h1,h2')).some(el=>(el.textContent||'').trim()==='Browse Patterns');
  }
  function style(){
    if(document.getElementById(STYLE_ID)) return;
    const s=document.createElement('style');s.id=STYLE_ID;
    s.textContent=`
      #${ID}{display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:7px!important;min-height:40px!important;padding:0 14px!important;border-radius:10px!important;border:1px solid rgba(199,164,99,.62)!important;background:linear-gradient(145deg,#201d17,#151515)!important;color:#ddc187!important;font-weight:750!important;cursor:pointer!important;white-space:nowrap!important}
      #${ID}:active{transform:translateY(1px)}
      #${ID} .oryn-pd-symbol{font-size:16px;line-height:1}
      @media(max-width:560px){#${ID}{padding:0 10px!important;font-size:12px!important;gap:5px!important}}
      @media(max-width:390px){#${ID} .oryn-pd-word-pattern{display:none}}
    `;
    document.head.appendChild(s);
  }
  function forgeButton(){
    return document.getElementById('oryn-final-forge-launch') ||
      Array.from(document.querySelectorAll('button')).find(b=>(b.textContent||'').includes('Pattern Forge')) || null;
  }
  function install(){
    scheduled=false;
    if(!isBrowse()) return;
    if(document.getElementById(ID)) return;
    const heading=Array.from(document.querySelectorAll('h1,h2')).find(el=>(el.textContent||'').trim()==='Browse Patterns');
    if(!heading) return;
    const forge=forgeButton();
    const row=(forge&&forge.parentElement) || heading.parentElement?.parentElement;
    if(!row) return;
    style();
    const b=document.createElement('button');
    b.id=ID;b.type='button';b.setAttribute('aria-label','Open ORYN Pattern Designer');b.title='Open ORYN Pattern Designer';
    b.innerHTML='<span class="oryn-pd-symbol" aria-hidden="true">✦</span><span><span class="oryn-pd-word-pattern">Pattern </span>Designer</span>';
    b.addEventListener('click',()=>window.location.assign(URL));
    if(forge&&forge.parentElement===row) row.insertBefore(b,forge); else row.appendChild(b);
  }
  function schedule(){ if(scheduled)return;scheduled=true;requestAnimationFrame(install); }
  schedule();window.addEventListener('load',schedule,{once:true});window.addEventListener('popstate',schedule);
  new MutationObserver(()=>{if(!document.getElementById(ID))schedule();}).observe(document.documentElement,{childList:true,subtree:true});
})();
