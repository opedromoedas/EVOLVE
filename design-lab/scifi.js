(()=>{'use strict';
const key='evolve_designlab_v1', mkey='evolve_scifi_motion_v02',reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const $=s=>document.querySelector(s);
let motion=!reduced;try{if(localStorage.getItem(mkey)==='off')motion=false}catch(e){}
document.documentElement.dataset.fxMotion=motion?'on':'off';
function getState(){try{const s=JSON.parse(localStorage.getItem(key)||'null');return s&&s.setup?s:null}catch(e){return null}}
function updateButton(){const b=$('#fxMotion');if(!b)return;b.textContent=motion?'◉ MOTION ON':'◎ MOTION OFF';b.setAttribute('aria-pressed',String(motion));b.setAttribute('aria-label',motion?'Desativar animações decorativas':'Ativar animações decorativas')}
function setupButton(){if($('#fxMotion'))return;const bar=$('.lab-ribbon');if(!bar)return;const b=document.createElement('button');b.id='fxMotion';b.type='button';b.className='fx-motion-button';bar.insertBefore(b,bar.lastElementChild);b.addEventListener('click',()=>{motion=!motion;document.documentElement.dataset.fxMotion=motion?'on':'off';try{localStorage.setItem(mkey,motion?'on':'off')}catch(e){}updateButton()});updateButton()}
function data(s){const a=[];const now=new Date();for(let i=6;i>=0;i--){const d=new Date(now.getFullYear(),now.getMonth(),now.getDate()-i);const key=[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');const e=(s.events||[]).filter(v=>v.date===key);a.push({day:d.toLocaleDateString('pt-BR',{weekday:'short'}).replace('.','').slice(0,3).toUpperCase(),done:e.filter(v=>v.status==='done').length,planned:e.length})}return a}
function mission(s){const a=data(s),done=a.reduce((n,v)=>n+v.done,0),planned=a.reduce((n,v)=>n+v.planned,0),days=a.filter(v=>v.done>0).length,max=Math.max(1,...a.map(v=>v.done));
const pts=a.map((v,i)=>({x:9+i*67,y:96-v.done/max*74})),path=pts.map((v,i)=>(i?'L':'M')+v.x+','+v.y).join(' ');
const el=document.createElement('section');el.id='fxMission';el.className='fx-mission';el.setAttribute('aria-label','Telemetria de atividades realizadas nos últimos sete dias');
el.innerHTML='<div class="fx-mission__head"><span class="fx-label">◈ MISSION CONTROL / 7 DAYS</span><span class="fx-sub">DADOS LOCAIS · ÚLTIMOS 7 DIAS</span></div>'+
'<div class="fx-mission__grid"><div class="fx-plot"><div class="fx-plot__head"><span class="fx-sub">Atividades realizadas</span><span class="fx-value">'+done+' / '+planned+'</span></div>'+
'<svg class="fx-chart" viewBox="0 0 420 106" preserveAspectRatio="none" role="img" aria-label="Concluídas por dia: '+a.map(v=>v.day+' '+v.done).join(', ')+'"><line class="fx-grid-line" x1="0" y1="30" x2="420" y2="30"/><line class="fx-grid-line" x1="0" y1="67" x2="420" y2="67"/><line class="fx-grid-line" x1="0" y1="99" x2="420" y2="99"/><path class="fx-area" d="'+path+' L411,100 L9,100 Z"/><path class="fx-line" d="'+path+'"/>'+pts.map(v=>'<circle class="fx-node" cx="'+v.x+'" cy="'+v.y+'" r="3.5"/>').join('')+'</svg>'+
'<div class="fx-chart-labels" aria-hidden="true">'+a.map(v=>'<span>'+v.day+'</span>').join('')+'</div></div>'+
'<div class="fx-radar-shell"><div class="fx-radar-content"><div class="fx-radar" aria-hidden="true"><div class="fx-radar__center"><div class="fx-radar__number">'+days+'<small style="font-size:11px">/7</small></div><span class="fx-radar__caption">DIAS ATIVOS</span></div></div><div class="fx-radar__info"><div><strong>'+(s.goals||[]).length+'</strong><small>Metas ativas</small></div><div><strong>'+done+'</strong><small>Conclusões</small></div></div></div></div></div>'+
'<div class="fx-mission__foot">'+(done?'CONCLUSÕES CONFIRMADAS':'SEM CONCLUSÕES REGISTRADAS')+' · contagens reais deste dispositivo, sem enviar dados pessoais</div>';
return el}
let dirty=false,prev='';
function paint(){setupButton();const app=$('#app');if(!app||!app.querySelector('.app-shell'))return;const main=$('.main-inner');if(main&&!main.classList.contains('fx-view-enter'))main.classList.add('fx-view-enter');const hero=$('.hero'),s=getState();if(!hero||!s)return;const sign=JSON.stringify([s.goals?.length,(s.events||[]).map(v=>v.date+':'+v.status).join('|')]);if(sign===prev&&$('#fxMission'))return;prev=sign;const existing=$('#fxMission');if(existing)existing.remove();hero.after(mission(s))}
function queue(){if(dirty)return;dirty=true;requestAnimationFrame(()=>{dirty=false;paint()})}
function boot(){const app=$('#app');if(!app)return;setupButton();new MutationObserver(()=>queue()).observe(app,{childList:true,subtree:true});queue()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();