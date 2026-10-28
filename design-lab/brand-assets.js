(()=>{
'use strict';
const p='./brand-assets/';
const files={
  dark:{logo:p+'logo-dark.webp',icon:p+'icon-dark.webp'},
  light:{logo:p+'logo-light.webp',icon:p+'icon-light.webp'}
};
const assetCache=new Map();
function check(src){if(!assetCache.has(src)){assetCache.set(src,new Promise(resolve=>{const i=new Image();i.onload=()=>resolve(true);i.onerror=()=>resolve(false);i.src=src;}));}return assetCache.get(src);}
function theme(){return document.documentElement.dataset.theme==='light'?'light':'dark';}
function apply(el,kind){if(el.dataset.evolveBrandPending)return;const mode=theme();const src=files[mode][kind];if(el.dataset.evolveBrandSrc===src)return;el.dataset.evolveBrandPending='1';
check(src).then(ok=>{delete el.dataset.evolveBrandPending;if(!ok||!el.isConnected)return;let img=el.querySelector(':scope > .evolve-brand-image');if(!img){img=document.createElement('img');img.className='evolve-brand-image'+(kind==='icon'?' evolve-icon-image':'');img.alt=kind==='logo'?'EVOLVE — No Sense Creations':'Ícone EVOLVE';img.decoding='async';el.append(img);}img.src=src;el.classList.add('evolve-branded');el.dataset.evolveBrandSrc=src;});}
function scan(){document.querySelectorAll('.portal-brand,.wordmark,.sidebar .brand,.top .brand').forEach(el=>apply(el,'logo'));document.querySelectorAll('.bootmark').forEach(el=>apply(el,'icon'));check(files[theme()].icon).then(ok=>{if(!ok)return;let favicon=document.querySelector('link[rel="icon"]');if(favicon){favicon.href=files[theme()].icon;favicon.type='image/webp';}});}
let queued=false;function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;scan()});}
new MutationObserver(schedule).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['data-theme']});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule);else schedule();
})();
