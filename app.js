"use strict";
/* ============ أدوات ============ */
const $=id=>document.getElementById(id);
const nf=new Intl.NumberFormat("ar-EG");
const ar=n=>nf.format(n);
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const KEY="fe_v2";
const store={
  get(){try{return JSON.parse(localStorage.getItem(KEY))||{}}catch(e){return{}}},
  set(o){try{localStorage.setItem(KEY,JSON.stringify(o))}catch(e){}}
};
let S=Object.assign({done:{},heard:{},name:"",fs:2,reduced:false},store.get());
const save=()=>store.set(S);
const mq=window.matchMedia?matchMedia("(prefers-reduced-motion: reduce)"):{matches:false};
const reduced=()=>S.reduced||mq.matches;
const syn=window.speechSynthesis,hasTTS=!!syn&&typeof SpeechSynthesisUtterance!=="undefined";
const total=D.length;
const fmt=s=>{if(!isFinite(s))return"0:00";s=Math.floor(s);return Math.floor(s/60)+":"+String(s%60).padStart(2,"0")};
let toastT;
function toast(t){const e=$("toast");e.textContent=t;e.classList.add("on");clearTimeout(toastT);toastT=setTimeout(()=>e.classList.remove("on"),2200)}

/* ============ الرسوم (تعبيرية ومبتكرة) ============ */
const ART={
 spirit:c=>`<svg class="art" viewBox="0 0 160 100" aria-hidden="true"><ellipse cx="80" cy="94" rx="62" ry="5" fill="#0006"/>
  <path d="M26 34h108l-9 12H35z" fill="${c}"/><path d="M26 34h108" stroke="#fff6" stroke-width="2"/>
  <rect x="42" y="46" width="76" height="26" rx="7" fill="#d9dcef"/><rect x="50" y="52" width="22" height="10" rx="3" fill="#8e97c9"/>
  <rect x="104" y="14" width="4" height="32" fill="#aab3d8"/><rect x="97" y="8" width="18" height="10" rx="3" fill="#eef"/><circle cx="106" cy="13" r="3" fill="#223"/>
  <g fill="#2b3158" stroke="#a9b3e0" stroke-width="2"><circle cx="48" cy="82" r="11"/><circle cx="80" cy="82" r="11"/><circle cx="112" cy="82" r="11"/></g>
  <g stroke="#a9b3e0" stroke-width="3"><path d="M52 72l-4 10M80 72v10M108 72l4 10"/></g></svg>`,
 opp:c=>`<svg class="art" viewBox="0 0 160 100" aria-hidden="true"><ellipse cx="80" cy="94" rx="62" ry="5" fill="#0006"/>
  <path d="M22 38h116l-12 14H34z" fill="${c}"/><path d="M22 38h116" stroke="#fff6" stroke-width="2"/>
  <rect x="38" y="50" width="84" height="24" rx="8" fill="#e6e8f6"/><circle cx="60" cy="62" r="6" fill="#8e97c9"/><rect x="74" y="56" width="34" height="8" rx="3" fill="#aab3d8"/>
  <path d="M120 50l16-26" stroke="#aab3d8" stroke-width="4" stroke-linecap="round"/><circle cx="138" cy="21" r="6" fill="#eef"/><circle cx="140" cy="21" r="2.4" fill="#223"/>
  <g fill="#2b3158" stroke="#a9b3e0" stroke-width="2"><circle cx="46" cy="83" r="10"/><circle cx="80" cy="83" r="10"/><circle cx="114" cy="83" r="10"/></g></svg>`,
 ing:c=>`<svg class="art" viewBox="0 0 160 100" aria-hidden="true"><ellipse cx="80" cy="95" rx="40" ry="4" fill="#0006"/>
  <rect x="28" y="22" width="104" height="5" rx="2.5" fill="${c}"/><rect x="38" y="31" width="84" height="5" rx="2.5" fill="${c}" opacity=".6"/>
  <rect x="78" y="26" width="4" height="22" fill="#aab3d8"/>
  <rect x="62" y="12" width="36" height="8" rx="2" fill="#2a4a9a" stroke="#8fb4ff"/>
  <ellipse cx="80" cy="58" rx="22" ry="14" fill="#e6e8f6"/><circle cx="80" cy="58" r="6" fill="#223" stroke="#8e97c9" stroke-width="2"/>
  <g stroke="#a9b3e0" stroke-width="3" stroke-linecap="round"><path d="M64 68l-9 20M96 68l9 20M52 88h8M100 88h8"/></g></svg>`,
 alsep:c=>`<svg class="art" viewBox="0 0 160 100" aria-hidden="true"><ellipse cx="80" cy="92" rx="66" ry="6" fill="#0006"/>
  <path d="M0 92c30-6 120-6 160 0" stroke="#6c7090" stroke-width="2" fill="none"/>
  <path d="M80 62V26" stroke="#aab3d8" stroke-width="3"/><path d="M58 22q22 22 44 0z" fill="${c}" stroke="#fff" stroke-opacity=".5"/><circle cx="80" cy="14" r="3" fill="#ffd166"/>
  <rect x="58" y="62" width="44" height="26" rx="4" fill="#dfe2f3"/><rect x="66" y="68" width="14" height="8" fill="#8e97c9"/><circle cx="92" cy="72" r="4" fill="#ffd166"/>
  <path d="M58 76h-24M102 76h26" stroke="#a9b3e0" stroke-width="2" stroke-dasharray="4 3"/>
  <rect x="20" y="70" width="16" height="18" rx="3" fill="#c9cde0"/><rect x="124" y="66" width="18" height="22" rx="9" fill="#c9cde0"/></svg>`
};
const art=d=>(ART[d.id]||(()=>`<span class="art" style="font-size:3rem">${d.ic}</span>`))(d.color);

/* ============ الخريطة ============ */
const worlds={mars:["🔴 المريخ","فوهات وسهول وغبار أحمر","mars"],moon:["🌕 القمر","رمال رمادية وصمت عميق","moon"]};
$("mapGrid").innerHTML=["moon","mars"].map(w=>`<section class="world ${w} rv"><div class="planet" aria-hidden="true"></div><h3>${worlds[w][0]}</h3><p>${worlds[w][1]}</p><div class="chars">${
 D.filter(d=>d.world===w).map(d=>`<button class="ch" data-id="${d.id}" style="--c:${d.color}" aria-label="افتح قصة ${d.name}">${art(d)}<span class="badge"></span><b>${d.name}</b><small>${d.en}</small><span class="tg">${d.tag}</span><span class="stars" aria-hidden="true"></span></button>`).join("")}</div></section>`).join("");
$("mapGrid").addEventListener("click",e=>{const b=e.target.closest(".ch");if(b)openC(b.dataset.id)});

function doneCount(){return D.filter(d=>S.done[d.id]).length}
function progress(){
  const n=doneCount();
  $("pt").textContent=ar(n)+" / "+ar(total);
  $("pLabel").textContent=n===0?"لم تبدأ بعد":n<total?"أنت في الطريق!":"مستكشف كامل ⭐";
  $("ringFg").style.strokeDashoffset=100-n/total*100;$("ringFg").style.opacity=n?1:0;
  const nextId=n<total?(D.find(d=>!S.done[d.id])||{}).id:null;
  document.querySelectorAll(".ch").forEach(b=>{
    const id=b.dataset.id,st=S.done[id];
    b.classList.toggle("done",!!st);b.classList.toggle("heard",!st&&!!S.heard[id]);
    b.classList.toggle("next-up",id===nextId&&n===0);
    b.querySelector(".badge").textContent=st?"✓ مكتمل":S.heard[id]?"استمعت":"جديد";
    b.querySelector(".stars").textContent=st?"★".repeat(st)+"☆".repeat(Math.max(0,2-st)):"";
  });
  $("winSec").classList.toggle("hide",n<total);
  if(n>=total)drawCert();
}

/* ============ الأرقام والمقارنة والخط الزمني ============ */
$("stats").innerHTML=STATS.map((s,i)=>`<div class="stat rv"><b data-n="${s.n}" data-s="${s.suf}">0</b><span>${s.l}</span></div>`).join("");
$("vsBox").innerHTML=VS.map(v=>`<button class="vs-item rv" data-id="${v.id}" aria-label="${v.label}: المخطط ${v.planTxt}، الفعلي ${v.realTxt}">
 <h3>${v.label}</h3>
 <div class="vs-row p"><span>المخطط</span><div class="tr"><i data-w="${Math.max(3,v.plan/v.real*100)}"></i></div><span class="v">${v.planTxt}</span></div>
 <div class="vs-row r"><span>الفعلي</span><div class="tr"><i data-w="100"></i></div><span class="v">${v.realTxt}</span></div></button>`).join("");
$("vsBox").addEventListener("click",e=>{const b=e.target.closest(".vs-item");if(b)openC(b.dataset.id)});
$("tl").innerHTML=TL.map(t=>{const d=D.find(x=>x.id===t.id);return`<li style="--c:${d.color}"><button data-id="${t.id}"><span class="y">${t.y}</span>${t.t}</button></li>`}).join("");
$("tl").addEventListener("click",e=>{const b=e.target.closest("button");if(b)openC(b.dataset.id)});

function countUp(el){
  const n=+el.dataset.n,suf=el.dataset.s||"";
  if(reduced()){el.textContent=ar(n)+suf;return}
  const t0=performance.now(),dur=1400;
  (function f(t){const p=clamp((t-t0)/dur,0,1),e=1-Math.pow(1-p,3);el.textContent=ar(Math.round(n*e))+suf;if(p<1)requestAnimationFrame(f)})(t0);
}
const io=("IntersectionObserver" in window)?new IntersectionObserver(es=>es.forEach(en=>{
  if(!en.isIntersecting)return;const el=en.target;io.unobserve(el);el.classList.add("in");
  el.querySelectorAll("[data-n]").forEach(countUp);
  el.querySelectorAll("[data-w]").forEach(i=>i.style.width=i.dataset.w+"%");
}),{threshold:.2}):null;
document.querySelectorAll(".rv,.tl li").forEach(el=>{if(io)io.observe(el);else{el.classList.add("in");el.querySelectorAll("[data-n]").forEach(countUp);el.querySelectorAll("[data-w]").forEach(i=>i.style.width=i.dataset.w+"%")}});

/* ============ الإعدادات ============ */
const FS=[88,100,112,125];
function applySettings(){
  document.documentElement.style.setProperty("--fs",FS[S.fs]+"%");
  document.documentElement.dataset.motion=reduced()?"reduced":"";
  $("motionBtn").setAttribute("aria-pressed",S.reduced);
}
$("fsUp").onclick=()=>{S.fs=Math.min(FS.length-1,S.fs+1);save();applySettings()};
$("fsDown").onclick=()=>{S.fs=Math.max(0,S.fs-1);save();applySettings()};
$("motionBtn").onclick=()=>{S.reduced=!S.reduced;save();applySettings();toast(S.reduced?"تم تقليل الحركة":"تم تفعيل الحركة")};

/* ============ السماء المتحركة ============ */
(function sky(){
  const c=$("sky"),x=c.getContext("2d");let w,h,dpr,stars=[],shoot=null,raf;
  function size(){dpr=Math.min(2,devicePixelRatio||1);w=innerWidth;h=innerHeight;c.width=w*dpr;c.height=h*dpr;x.setTransform(dpr,0,0,dpr,0,0);
    const n=Math.round(w*h/5200);stars=Array.from({length:n},()=>({x:Math.random()*w,y:Math.random()*h*1.6,r:Math.random()*1.4+.3,l:Math.random()*.9+.1,p:Math.random()*6.28,s:Math.random()*1.5+.5}))}
  function draw(t){
    x.clearRect(0,0,w,h);const sy=scrollY;
    for(const s of stars){const y=((s.y-sy*s.l*.15)%(h*1.6)+h*1.6)%(h*1.6);if(y>h)continue;
      const a=reduced()?.7:.45+.45*Math.sin(t/1000*s.s+s.p);x.globalAlpha=clamp(a,.1,1)*s.l+.1;x.fillStyle="#fff";x.beginPath();x.arc(s.x,y,s.r,0,6.283);x.fill()}
    x.globalAlpha=1;
    if(!reduced()){
      if(!shoot&&Math.random()<.004)shoot={x:Math.random()*w*.8+w*.2,y:Math.random()*h*.4,v:9+Math.random()*5,life:0};
      if(shoot){const s=shoot;s.x-=s.v;s.y+=s.v*.45;s.life++;const g=x.createLinearGradient(s.x,s.y,s.x+90,s.y-40);g.addColorStop(0,"#fff");g.addColorStop(1,"#fff0");
        x.strokeStyle=g;x.lineWidth=2;x.beginPath();x.moveTo(s.x,s.y);x.lineTo(s.x+90,s.y-40);x.stroke();if(s.life>60||s.x<-100)shoot=null}
    }
  }
  function loop(t){draw(t);raf=requestAnimationFrame(loop)}
  size();addEventListener("resize",size);
  document.addEventListener("visibilitychange",()=>{cancelAnimationFrame(raf);if(!document.hidden)raf=requestAnimationFrame(loop)});
  raf=requestAnimationFrame(loop);
})();

/* ============ الاحتفال ============ */
function confetti(){
  if(reduced())return;
  const c=$("fx"),x=c.getContext("2d");c.width=innerWidth;c.height=innerHeight;
  const cols=["#ffd166","#ff8a5b","#3ddc97","#8f7bff","#fff"];
  const ps=Array.from({length:120},()=>({x:innerWidth/2+(Math.random()-.5)*200,y:innerHeight*.35,vx:(Math.random()-.5)*14,vy:-Math.random()*13-3,r:Math.random()*6+3,c:cols[Math.random()*5|0],a:Math.random()*6,va:(Math.random()-.5)*.4}));
  let f=0;(function step(){x.clearRect(0,0,c.width,c.height);ps.forEach(p=>{p.vy+=.32;p.x+=p.vx;p.y+=p.vy;p.a+=p.va;x.save();x.translate(p.x,p.y);x.rotate(p.a);x.fillStyle=p.c;x.fillRect(-p.r,-p.r/2,p.r*2,p.r);x.restore()});
    if(++f<150)requestAnimationFrame(step);else x.clearRect(0,0,c.width,c.height)})();
}

/* ============ نافذة القصة والمشغل ============ */
const au=$("au");
let cur=null,lastFocus=null,P={playing:false,run:0,idx:0,fallback:false,starts:[],timer:null,speedI:0};
const SPEEDS=[1,1.25,1.5,.75];
let Q={i:0,first:0,wrong:false,answered:false};

// شكل الموجة
$("wave").innerHTML=Array.from({length:42},(_,i)=>`<i style="--h:${30+Math.abs(Math.sin(i*1.7))*70}%;animation-delay:${(i%9)*-.11}s"></i>`).join("");

function openC(id,opts){
  const d=D.find(x=>x.id===id);if(!d)return;
  hardStop();cur=d;
  if(!$("ov").classList.contains("on"))lastFocus=document.activeElement;
  const pn=$("ov").querySelector(".panel");pn.style.setProperty("--c",d.color);
  $("pn").textContent=`${d.name} (${d.en})`;$("ptag").textContent=d.tag;$("pic").innerHTML=art(d);
  $("idc").innerHTML=`<b>المكان:</b><span>${d.place}</span><b>الهدف:</b><span>${d.goal}</span>`+d.status.map(s=>`<b>${s[0]}:</b><span>${s[1]}</span>`).join("");
  $("st").className="story";
  $("st").innerHTML=d.story.map((p,i)=>`<p data-i="${i}" tabindex="0" role="button" aria-label="اقفز إلى الفقرة ${ar(i+1)}">${p}</p>`).join("");
  $("fc").className="fact";$("fc").textContent="";
  $("qz").classList.add("hide");$("reward").classList.add("hide");$("fb").textContent="";
  $("sr").innerHTML=d.src.map(s=>`<li><a href="${s[1]}" target="_blank" rel="noopener noreferrer">${s[0]}</a></li>`).join("");
  $("tts").textContent="";$("player").classList.remove("playing");
  setPlayBtn(false);$("seek").value=0;$("tcur").textContent="0:00";$("tdur").textContent="0:00";
  P.idx=0;P.fallback=!d.audio;P.starts=[];P.speedI=0;$("speed").textContent="1×";
  $("seek").disabled=P.fallback;
  if(d.audio){au.src=d.audio;au.playbackRate=1;au.load()}else{au.removeAttribute("src");au.load()}
  if(P.fallback)$("tts").textContent=hasTTS?"لا يوجد تسجيل صوتي لهذه القصة؛ ستُقرأ آليًا.":"لا يوجد تسجيل صوتي؛ ستظهر الفقرات تباعًا.";
  const i=D.indexOf(d);$("prevC").disabled=i<=0;$("nextC").disabled=i>=D.length-1;
  $("ov").classList.add("on");$("ov").setAttribute("aria-hidden","false");document.body.classList.add("lock");
  $("ov").scrollTop=0;
  try{if(!opts||!opts.noHash)history.replaceState(null,"","#"+id)}catch(e){}
  renderStage(d);startBoil();setMedia();
  setTimeout(()=>$("play").focus({preventScroll:true}),30);
}
function closeC(noHash){
  if(!$("ov").classList.contains("on"))return;
  hardStop();stopBoil();$("ov").classList.remove("on");$("ov").setAttribute("aria-hidden","true");document.body.classList.remove("lock");
  if(!noHash){try{history.replaceState(null,"",location.pathname+location.search)}catch(e){}}
  if(lastFocus&&lastFocus.focus)lastFocus.focus({preventScroll:true});
}
$("cl").onclick=()=>closeC();
$("ov").addEventListener("mousedown",e=>{if(e.target.id==="ov")closeC()});
$("prevC").onclick=()=>{const i=D.indexOf(cur);if(i>0)openC(D[i-1].id)};
$("nextC").onclick=()=>{const i=D.indexOf(cur);if(i<D.length-1)openC(D[i+1].id)};
addEventListener("hashchange",()=>{const id=location.hash.slice(1);if(D.some(d=>d.id===id)){if(!cur||cur.id!==id||!$("ov").classList.contains("on"))openC(id,{noHash:true})}else closeC(true)});

document.addEventListener("keydown",e=>{
  const on=$("ov").classList.contains("on");if(!on)return;
  if(e.key==="Escape"){closeC();return}
  if(e.key==="Tab"){
    const f=[...$("ov").querySelectorAll("button:not([disabled]),a[href],input:not([disabled]),[tabindex='0']")].filter(el=>el.offsetParent!==null);
    if(!f.length)return;const a=f[0],z=f[f.length-1];
    if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}
    else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}
    else if(!$("ov").contains(document.activeElement)){e.preventDefault();a.focus()}
  }
  if((e.key===" "||e.code==="Space")&&!/^(BUTTON|INPUT|A|TEXTAREA)$/.test(e.target.tagName)&&e.target.getAttribute("role")!=="button"){e.preventDefault();togglePlay()}
  if(e.key==="Enter"&&e.target.matches&&e.target.matches(".story p")){e.preventDefault();e.target.click()}
});

/* ===== مشهد الكروكي المتحرك ===== */
const stage=$("stage");let boil=null;
function renderStage(d){
  stage.innerHTML=`<div class="stage-view"><svg viewBox="0 0 640 400" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><defs><filter id="rough" x="-4%" y="-4%" width="108%" height="108%"><feTurbulence id="ft" type="fractalNoise" baseFrequency="0.035" numOctaves="1" seed="2"/><feDisplacementMap in="SourceGraphic" scale="5"/></filter></defs><g filter="url(#rough)">${SCENES[d.id]()}</g></svg></div>
  <div class="stage-cap"><div class="dots">${d.story.map((_,i)=>`<button class="dot" data-i="${i}" aria-label="المشهد ${ar(i+1)}: ${CAP[d.id][i]}"></button>`).join("")}</div><b id="stCap"></b></div>`;
  stage.querySelectorAll(".dot").forEach(b=>b.onclick=()=>gotoPara(+b.dataset.i));
  setScene(0);
}
function setScene(i){
  stage.dataset.s=i;
  stage.querySelectorAll(".sc").forEach((g,k)=>g.classList.toggle("on",k===i));
  stage.querySelectorAll(".dot").forEach((b,k)=>b.classList.toggle("on",k===i));
  const c=$("stCap");if(c&&cur)c.textContent=`${ar(i+1)}/${ar(cur.story.length)} · ${CAP[cur.id][i]}`;
}
function startBoil(){stopBoil();if(reduced())return;let k=0;boil=setInterval(()=>{const f=$("ft");if(f)f.setAttribute("seed",1+(k++%4))},170)}
function stopBoil(){clearInterval(boil);boil=null}

function setPlayBtn(p){stage.classList.toggle("talk",p);$("play").textContent=p?"⏸":"▶";$("play").setAttribute("aria-label",p?"إيقاف مؤقت":"شغّل القصة");$("player").classList.toggle("playing",p)}

// توقيت الفقرات حسب طول النص
function computeStarts(dur){
  const lens=cur.story.map(p=>p.length),tot=lens.reduce((a,b)=>a+b,0);let acc=0;
  P.starts=lens.map(l=>{const s=acc/tot*dur;acc+=l;return s});
}
au.addEventListener("loadedmetadata",()=>{if(!cur||P.fallback)return;computeStarts(au.duration);$("tdur").textContent=fmt(au.duration)});
au.addEventListener("error",()=>{ if(!cur||!cur.audio||!au.getAttribute("src"))return; P.fallback=true;$("seek").disabled=true;$("tdur").textContent="--:--";
  $("tts").textContent=hasTTS?"تعذّر تحميل التسجيل الصوتي؛ سيتم استخدام القراءة الآلية.":"تعذّر تحميل التسجيل الصوتي؛ ستظهر الفقرات تباعًا.";
  if(P.playing){P.playing=false;startFallback(P.idx)}});
au.addEventListener("timeupdate",()=>{
  if(P.fallback||!au.duration)return;
  $("seek").value=au.currentTime/au.duration*1000;$("tcur").textContent=fmt(au.currentTime);
  let i=0;for(let k=0;k<P.starts.length;k++)if(au.currentTime>=P.starts[k])i=k;
  if(i!==P.idx||!document.querySelector(".story p.cur"))showPara(i);
});
au.addEventListener("ended",()=>{if(!P.fallback)finish()});
au.addEventListener("pause",()=>{if(!P.fallback&&!au.ended){P.playing=false;setPlayBtn(false)}});
au.addEventListener("play",()=>{if(!P.fallback){P.playing=true;setPlayBtn(true)}});

function showPara(i){
  P.idx=i;setScene(i);$("st").classList.add("active");
  document.querySelectorAll(".story p").forEach((p,k)=>p.classList.toggle("cur",k===i));
  const p=document.querySelector(`.story p[data-i="${i}"]`);if(p&&!reduced())p.scrollIntoView({block:"nearest",behavior:"smooth"});
  if(i>=cur.fact)showFact();
}
function showFact(){$("fc").textContent="💡 "+cur.factText;$("fc").classList.add("on")}
function markHeard(){if(!S.heard[cur.id]){S.heard[cur.id]=1;save();progress()}}

function togglePlay(){P.playing?pause():play()}
function play(){
  markHeard();
  if(!P.fallback){
    au.playbackRate=SPEEDS[P.speedI];
    if(au.ended||au.currentTime>=au.duration-.1){au.currentTime=0}
    const pr=au.play();if(pr&&pr.catch)pr.catch(()=>{});
    if(!document.querySelector(".story p.cur"))showPara(P.idx);
    return;
  }
  startFallback(P.idx);
}
function pause(){
  if(!P.fallback){au.pause();return}
  P.run++;P.playing=false;clearTimeout(P.timer);if(hasTTS)syn.cancel();setPlayBtn(false);
}
function hardStop(){
  P.run++;P.playing=false;clearTimeout(P.timer);if(hasTTS)syn.cancel();
  try{au.pause()}catch(e){}
  document.querySelectorAll(".story p.cur").forEach(p=>p.classList.remove("cur"));
  setPlayBtn(false);
}
$("play").onclick=togglePlay;
$("stop").onclick=()=>{hardStop();P.idx=0;if(!P.fallback)try{au.currentTime=0}catch(e){};$("seek").value=0;$("tcur").textContent="0:00";$("st").classList.remove("active");setScene(0)};
$("back10").onclick=()=>skip(-10);$("fwd10").onclick=()=>skip(10);
function skip(s){
  if(P.fallback){gotoPara(clamp(P.idx+(s>0?1:-1),0,cur.story.length-1));return}
  if(au.duration)au.currentTime=clamp(au.currentTime+s,0,au.duration-.05);
}
$("seek").addEventListener("input",()=>{if(!P.fallback&&au.duration){au.currentTime=$("seek").value/1000*au.duration}});
$("speed").onclick=()=>{P.speedI=(P.speedI+1)%SPEEDS.length;const s=SPEEDS[P.speedI];$("speed").textContent=s+"×";au.playbackRate=s};
$("skipBtn").onclick=()=>{hardStop();markHeard();showFact();showQuiz()};
function gotoPara(i){
  if(!P.fallback){if(P.starts[i]!=null){au.currentTime=P.starts[i]+.01;if(au.paused)play()}}
  else{hardStop();P.idx=i;startFallback(i)}
}
$("st").addEventListener("click",e=>{const p=e.target.closest("p");if(p)gotoPara(+p.dataset.i)});

function startFallback(from){
  hardStop();const my=++P.run;P.playing=true;setPlayBtn(true);
  let v=null;if(hasTTS){v=syn.getVoices().find(x=>/^ar/i.test(x.lang))||null}
  if(hasTTS&&!v&&!$("tts").textContent)$("tts").textContent="لا يوجد صوت عربي على جهازك؛ اقرأ النص أثناء ظهور الفقرات.";
  const next=i=>{
    if(my!==P.run)return;
    if(i>=cur.story.length){finish();return}
    showPara(i);const t=cur.story[i],sp=SPEEDS[P.speedI];
    if(hasTTS&&v){const u=new SpeechSynthesisUtterance(t);u.lang="ar-SA";u.voice=v;u.rate=.9*sp;u.onend=()=>next(i+1);u.onerror=()=>{if(my===P.run)next(i+1)};syn.speak(u)}
    else P.timer=setTimeout(()=>next(i+1),Math.max(3000,t.split(/\s+/).length*450/sp));
  };
  next(from);
}
function finish(){
  P.playing=false;setPlayBtn(false);P.idx=0;
  showFact();showQuiz();
}

/* Media Session */
function setMedia(){
  if(!("mediaSession" in navigator)||!cur)return;
  try{
    navigator.mediaSession.metadata=new MediaMetadata({title:cur.name,artist:"المستكشفون المنسيون",album:cur.en});
    navigator.mediaSession.setActionHandler("play",play);navigator.mediaSession.setActionHandler("pause",pause);
    navigator.mediaSession.setActionHandler("seekbackward",()=>skip(-10));navigator.mediaSession.setActionHandler("seekforward",()=>skip(10));
  }catch(e){}
}

/* ============ التحدي ============ */
function showQuiz(){
  if($("qz").classList.contains("hide")&&$("reward").classList.contains("hide")){
    Q={i:0,first:0,wrong:false,answered:false};$("qz").classList.remove("hide");renderQ();
  }
  $("qz").scrollIntoView({block:"nearest",behavior:reduced()?"auto":"smooth"});
}
function renderQ(){
  const q=cur.qs[Q.i];Q.wrong=false;Q.answered=false;
  $("qn").textContent=`السؤال ${ar(Q.i+1)} من ${ar(cur.qs.length)}`;
  $("qq").textContent=q.q;$("fb").textContent="";$("qNext").classList.add("hide");$("qo").innerHTML="";
  const idx=q.o.map((_,i)=>i);for(let i=idx.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[idx[i],idx[j]]=[idx[j],idx[i]]}
  idx.forEach(i=>{
    const b=document.createElement("button");b.className="opt";b.textContent=q.o[i];
    b.onclick=()=>{
      if(i===q.a){
        b.classList.add("ok");[...$("qo").children].forEach(x=>x.disabled=true);Q.answered=true;
        if(!Q.wrong)Q.first++;
        $("fb").style.color="var(--ok)";$("fb").textContent="✅ إجابة صحيحة! "+q.ex;
        $("qNext").textContent=Q.i<cur.qs.length-1?"السؤال التالي ←":"أنهِ التحدي ✓";$("qNext").classList.remove("hide");$("qNext").focus({preventScroll:true});
      }else{Q.wrong=true;b.classList.add("no");b.disabled=true;$("fb").style.color="var(--bad)";$("fb").textContent="❌ حاول مرة أخرى — أعد قراءة القصة."}
    };
    $("qo").appendChild(b);
  });
}
$("qNext").onclick=()=>{
  if(Q.i<cur.qs.length-1){Q.i++;renderQ();return}
  const stars=Math.max(1,Q.first);S.done[cur.id]=Math.max(S.done[cur.id]||0,stars);save();progress();
  $("qz").classList.add("hide");
  $("rStars").innerHTML=Array.from({length:cur.qs.length},(_,i)=>`<span style="animation-delay:${i*.25}s">${i<stars?"⭐":"☆"}</span>`).join("");
  const all=doneCount()>=total;
  $("rTxt").textContent=all?"أنهيت كل المستكشفين الأربعة! شهادتك جاهزة في أسفل الصفحة.":`أحسنت! أنجزت ${ar(doneCount())} من ${ar(total)} مستكشفين.`;
  $("rNext").textContent=all?"اعرض شهادتي 🏅":"المستكشف التالي ←";
  $("reward").classList.remove("hide");$("reward").scrollIntoView({block:"nearest",behavior:reduced()?"auto":"smooth"});
  confetti();
};
$("rNext").onclick=()=>{
  if(doneCount()>=total){closeC();setTimeout(()=>$("winSec").scrollIntoView({behavior:reduced()?"auto":"smooth"}),50);return}
  const i=D.indexOf(cur);const n=D.slice(i+1).concat(D.slice(0,i)).find(d=>!S.done[d.id]);if(n)openC(n.id);
};

/* ============ الشهادة والمشاركة ============ */
function drawCert(){
  const c=$("cert"),x=c.getContext("2d"),W=c.width,H=c.height;
  const g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,"#0b1130");g.addColorStop(1,"#2a1d6a");x.fillStyle=g;x.fillRect(0,0,W,H);
  let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
  for(let i=0;i<140;i++){x.globalAlpha=rnd()*.8+.1;x.fillStyle="#fff";x.beginPath();x.arc(rnd()*W,rnd()*H,rnd()*2+.4,0,6.283);x.fill()}
  x.globalAlpha=1;x.strokeStyle="#ffd166";x.lineWidth=6;x.strokeRect(30,30,W-60,H-60);x.lineWidth=2;x.strokeRect(46,46,W-92,H-92);
  x.direction="rtl";x.textAlign="center";const F="Cairo,Tahoma,sans-serif";
  x.fillStyle="#ffd166";x.font=`900 64px ${F}`;x.fillText("شهادة مستكشف",W/2,170);
  x.font="110px serif";x.fillText("🚀",W/2,300);
  x.fillStyle="#a9b3e0";x.font=`600 34px ${F}`;x.fillText("تُمنح هذه الشهادة إلى",W/2,380);
  x.fillStyle="#fff";x.font=`900 80px ${F}`;x.fillText($("nameIn").value.trim()||"المستكشف الصغير",W/2,490);
  x.strokeStyle="#ffd16688";x.lineWidth=2;x.beginPath();x.moveTo(300,520);x.lineTo(W-300,520);x.stroke();
  x.fillStyle="#eef1ff";x.font=`600 34px ${F}`;
  x.fillText("لإكمالها رحلة «المستكشفون المنسيون» والاستماع إلى قصص",W/2,590);
  x.fillText("سبيريت وأوبورتيونيتي وإنجينيويتي ومحطة ألسيب",W/2,640);
  x.fillStyle="#a9b3e0";x.font=`400 26px ${F}`;x.fillText(new Date().toLocaleDateString("ar-EG",{year:"numeric",month:"long",day:"numeric"}),W/2,735);
}
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{if(doneCount()>=total)drawCert()});
let certT;$("nameIn").value=S.name||"";
$("nameIn").addEventListener("input",()=>{S.name=$("nameIn").value;save();clearTimeout(certT);certT=setTimeout(drawCert,120)});
$("certBtn").onclick=()=>{drawCert();$("cert").toBlob(b=>{const a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="explorer-certificate.png";a.click();setTimeout(()=>URL.revokeObjectURL(a.href),2000);toast("تم تحميل الشهادة 🏅")})};
async function share(url,text){
  try{if(navigator.share){await navigator.share({title:"المستكشفون المنسيون",text,url});return}}catch(e){if(e&&e.name==="AbortError")return}
  try{await navigator.clipboard.writeText(url);toast("تم نسخ الرابط 🔗")}catch(e){toast(url)}
}
$("shareBtn").onclick=()=>share(location.href.split("#")[0],"أكملت رحلة المستكشفون المنسيون! جرّبها أنت أيضًا.");
$("shareOne").onclick=()=>share(location.href.split("#")[0]+"#"+cur.id,`استمع إلى قصة ${cur.name}`);
$("randomBtn").onclick=()=>{const pool=D.filter(d=>!S.done[d.id]);const l=pool.length?pool:D;openC(l[Math.random()*l.length|0].id)};
$("resetBtn").onclick=()=>{if(confirm("هل تريد مسح تقدمك والبدء من جديد؟")){S.done={};S.heard={};save();progress();toast("تمت إعادة الضبط")}};

/* ============ البدء ============ */
if(hasTTS)syn.getVoices();
applySettings();progress();
if(D.some(d=>"#"+d.id===location.hash))openC(location.hash.slice(1),{noHash:true});
