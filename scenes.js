"use strict";
/* مشاهد كروكي أطفال متحركة: لكل مستكشف 4 مشاهد (واحد لكل فقرة) */
const INK="#2b2140";
const CAP={
 spirit:["الوصول إلى فوهة جوسيف","السيليكا والينابيع القديمة","عَلِقت في الرمال","١٢٤ ألف صورة"],
 opp:["أبعد من المخطط بكثير","توت المريخ","عاصفة الغبار","أطول من ماراثون"],
 ing:["مثبتة تحت بيرسيفيرنس","الطيران الأول","الهبوط الخشن","قماش الأخوين رايت"],
 alsep:["خمس محطات على القمر","جهاز الزلازل","اهتزازات داخل القمر","المعرفة باقية"]
};

/* عناصر مساعدة */
const lab=(x,y,t,w=170,fill="#fff3a8")=>`<g transform="translate(${x} ${y})"><g class="lab"><rect class="o" x="${-w/2}" y="-21" width="${w}" height="40" rx="15" fill="${fill}"/><text y="7" text-anchor="middle">${t}</text></g></g>`;
const star=(x,y,r,c="#ffd23f")=>{let p="";for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.45:r;p+=`${(x+Math.cos(a)*rr).toFixed(1)},${(y+Math.sin(a)*rr).toFixed(1)} `}return`<polygon class="o" stroke-width="3" points="${p}" fill="${c}"/>`};
const rays=(cx,cy,r)=>{let s="";for(let i=0;i<12;i++){const a=i*Math.PI/6;s+=`<line x1="${(cx+Math.cos(a)*(r+8)).toFixed(1)}" y1="${(cy+Math.sin(a)*(r+8)).toFixed(1)}" x2="${(cx+Math.cos(a)*(r+24)).toFixed(1)}" y2="${(cy+Math.sin(a)*(r+24)).toFixed(1)}"/>`}return`<g class="o spin" style="transform-origin:${cx}px ${cy}px">${s}</g>`};
const cloud=(x,y,s=1,d=0)=>`<g transform="translate(${x} ${y}) scale(${s})"><g class="cloud" style="animation-delay:${d}s"><path class="o" fill="#fff" d="M0 40 a20 20 0 0 1 10 -36 a28 28 0 0 1 52 -6 a22 22 0 0 1 34 22 a16 16 0 0 1 -6 20 Z"/></g></g>`;
const cheeks=(a,b,y)=>`<ellipse cx="${a}" cy="${y}" rx="7" ry="5" fill="#ff8fa3" opacity=".7"/><ellipse cx="${b}" cy="${y}" rx="7" ry="5" fill="#ff8fa3" opacity=".7"/>`;
const eye=(x,y,m)=>m==="sleep"?`<path class="o" stroke-width="3.5" fill="none" d="M${x-8} ${y} Q${x} ${y+7} ${x+8} ${y}"/>`:`<g class="eye"><ellipse class="o" stroke-width="3" cx="${x}" cy="${y}" rx="9" ry="10" fill="#fff"/><circle cx="${x+1}" cy="${y+1}" r="4.2" fill="${INK}"/></g>`;
const zzz=(x,y)=>`<g class="zz"><text x="${x}" y="${y}" class="big">z</text><text x="${x+18}" y="${y-22}" class="big" style="font-size:30px">Z</text><text x="${x+40}" y="${y-48}" class="big" style="font-size:38px">Z</text></g>`;

function marsBG(){return`
<rect width="640" height="400" fill="#ffe0b8"/>
<circle class="o" cx="540" cy="76" r="34" fill="#ffd23f"/>${rays(540,76,34)}
<circle cx="530" cy="70" r="3.5" fill="${INK}"/><circle cx="550" cy="70" r="3.5" fill="${INK}"/><path class="o" stroke-width="3" fill="none" d="M528 84 Q540 94 552 84"/>
${cloud(40,60,1,0)}${cloud(260,40,.7,-6)}
<path class="o" fill="#d9703f" d="M-10 285 Q90 214 200 268 Q300 222 400 266 Q520 226 650 272 V410 H-10Z"/>
<path class="o" fill="#ee9366" d="M-10 305 H650 V410 H-10Z"/>
<g stroke="#c4633a" stroke-width="3.5" fill="none" stroke-linecap="round"><path d="M40 372 q10 -8 20 0 M150 385 q10 -8 20 0 M330 380 q10 -8 20 0 M500 372 q10 -8 20 0 M590 390 q10 -8 20 0 M240 360 q8 -6 16 0"/></g>
<ellipse class="o" cx="80" cy="330" rx="22" ry="11" fill="#c4633a"/><ellipse class="o" cx="580" cy="338" rx="16" ry="8" fill="#c4633a"/>`}
function moonBG(){let st="";[[40,40],[110,100],[200,50],[290,110],[360,36],[430,90],[250,170],[60,170],[600,160],[480,30],[160,150]].forEach((p,i)=>st+=`<circle class="tw" cx="${p[0]}" cy="${p[1]}" r="${2+i%3}" fill="#fff" style="animation-delay:${-i*.37}s"/>`);return`
<rect width="640" height="400" fill="#2a2f78"/>${st}
<circle class="o" cx="545" cy="84" r="38" fill="#4fa3ff"/><path fill="#5fd38d" stroke="${INK}" stroke-width="3" d="M520 70 q14 -16 30 -4 q-6 18 -22 16 z M552 92 q12 -4 18 8 q-12 10 -22 2z"/>
<path class="o" fill="#b9bdd6" d="M-10 290 Q120 240 250 280 Q380 236 500 276 Q580 250 650 280 V410 H-10Z"/>
<path class="o" fill="#d7dae9" d="M-10 305 H650 V410 H-10Z"/>
<ellipse class="o" cx="90" cy="360" rx="34" ry="10" fill="#bfc3dc"/><ellipse class="o" cx="540" cy="372" rx="40" ry="11" fill="#bfc3dc"/><ellipse class="o" cx="330" cy="388" rx="26" ry="7" fill="#bfc3dc"/>`}

/* الشخصيات */
function rover(c,o={}){
 const m=o.mood||"happy";
 const mouth=m==="sad"?"M-12 -8 Q0 -22 12 -8":m==="sleep"?"M-9 -12 H9":"M-12 -14 Q0 0 12 -14";
 const wheel=x=>`<g transform="translate(${x} 14)"><g class="wheel"><circle class="o" r="16" fill="#4b4466"/><circle r="5" fill="#fff" stroke="${INK}" stroke-width="3"/><path stroke="#fff" stroke-width="3" stroke-linecap="round" d="M0 -12V12M-12 0H12"/></g></g>`;
 return`<g class="${o.cls||""}">${wheel(-46)}${wheel(0)}${wheel(46)}
 <path class="o" d="M-72 -46 L72 -46 L58 -70 L-58 -70Z" fill="${c}"/><path stroke="${INK}" stroke-width="3" fill="none" d="M-24 -46 L-19 -70 M24 -46 L19 -70 M-64 -58H64"/>
 <rect class="o" x="-54" y="-46" width="108" height="46" rx="14" fill="#fff"/>
 ${eye(-20,-28,m)}${eye(20,-28,m)}${cheeks(-38,38,-12)}
 <path class="mouth o" d="${mouth}" fill="${m==="sleep"?"none":"#ff6b81"}"/>
 <path class="o" fill="none" d="M40 -70 L48 -96"/><rect class="o" x="34" y="-114" width="30" height="18" rx="6" fill="#fff"/><circle class="o" cx="52" cy="-105" r="5" fill="#9ad0ff" stroke-width="3"/></g>`;
}
function heli(o={}){
 const m=o.mood||"happy";
 const rotor=o.broken?`<g class="rotor-b"><path class="o" fill="none" stroke-width="9" d="M-90 -68 L-12 -68 L6 -60 L22 -40"/><path stroke="#fff" stroke-width="5" d="M-6 -69 l8 12" /><rect x="-12" y="-76" width="20" height="14" fill="#fff" stroke="${INK}" stroke-width="3" transform="rotate(20 0 -68)"/><path stroke="#e5575b" stroke-width="3" d="M-2 -72 v8 M-6 -68 h8" transform="rotate(20 0 -68)"/></g>`
  :`<g class="rotor"><rect class="o" x="-90" y="-70" width="180" height="10" rx="5" fill="#ffd166"/></g>`;
 return`<g><path class="o" fill="none" stroke-width="7" d="M30 -2 L92 -14"/><ellipse class="o" cx="95" cy="-16" rx="4" ry="14" fill="#ffd166"/>
 <path class="o" fill="none" d="M-24 22 L-32 46 M24 22 L32 46 M-46 46 H-18 M18 46 H46"/>
 <ellipse class="o" rx="42" ry="30" fill="#fff"/>${eye(-14,-5,m)}${eye(14,-5,m)}${cheeks(-28,28,10)}
 <path class="mouth o" d="${m==="sad"?"M-9 18 Q0 8 9 18":"M-9 12 Q0 22 9 12"}" fill="#ff6b81"/>
 <rect class="o" x="-4" y="-48" width="8" height="20" fill="#9aa5c8"/><rect class="o" x="-27" y="-58" width="54" height="12" rx="3" fill="#4a7be0"/>${rotor}</g>`;
}
function station(c,o={}){
 const m=o.mood||"happy";
 return`<g><path class="o" fill="none" d="M-34 -8 Q-44 0 -52 -6"/><rect class="o" x="-76" y="-26" width="26" height="26" rx="8" fill="#ffd166"/><path stroke="${INK}" stroke-width="3" fill="none" d="M-72 -12 l5 -8 l5 14 l5 -12 l4 6"/>
 <path class="o" fill="none" d="M20 -44 L20 -98"/><g class="dish"><path class="o" d="M-2 -100 Q20 -70 44 -100 Z" fill="${c}"/></g><circle class="o blink" cx="20" cy="-106" r="5" fill="#ff6b81"/>
 <path class="o" fill="none" d="M-22 0 l-8 12 M44 0 l8 12"/>
 <rect class="o" x="-36" y="-46" width="80" height="46" rx="12" fill="#e8eaf6"/>${eye(-10,-28,m)}${eye(24,-28,m)}${cheeks(-22,36,-12)}
 <path class="mouth o" d="${m==="sleep"?"M3 -12 H15":"M2 -14 Q9 -3 18 -14"}" fill="${m==="sleep"?"none":"#ff6b81"}"/></g>`;
}
const flag=(x,y,t,c,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})"><path class="o" fill="none" d="M0 0 V-70"/><path class="o" fill="${c}" d="M0 -70 H64 L52 -52 L64 -34 H0 Z"/><text x="30" y="-46" text-anchor="middle" style="font-size:17px">${t}</text></g>`;

/* المشاهد */
const SCENES={
spirit:()=>`${marsBG()}
<g class="sc s0"><g transform="translate(110 270)"><path class="o" fill="#b07a3a" d="M-5 0 H5 V74 H-5Z"/><rect class="o" x="-66" y="-26" width="132" height="42" rx="9" fill="#fff3a8"/><text y="5" text-anchor="middle" style="font-size:17px">فوهة جوسيف</text></g>
 <g transform="translate(270 330)"><g class="drive">${rover("#ff7a4d")}</g></g>${lab(420,176,"٩٠ يومًا مريخيًا مخططة",230)}</g>
<g class="sc s1"><ellipse class="o" cx="170" cy="338" rx="62" ry="17" fill="#fff7cf"/>
 <g class="spk"><g>${star(140,334,11,"#fff")}${star(172,342,8,"#ffd23f")}${star(200,332,10,"#fff")}</g></g>
 <circle class="steam" cx="150" cy="320" r="9" fill="#fff" opacity=".85"/><circle class="steam d2" cx="180" cy="320" r="11" fill="#fff" opacity=".85"/><circle class="steam d3" cx="205" cy="320" r="8" fill="#fff" opacity=".85"/>
 <path class="o" fill="none" stroke-dasharray="3 10" d="M300 345 Q240 360 190 345"/>
 <g transform="translate(360 330)">${rover("#ff7a4d",{cls:"tilt"})}</g>${lab(180,176,"سيليكا… ينابيع قديمة؟",220)}</g>
<g class="sc s2"><g transform="translate(320 330)"><g class="stuck">${rover("#ff7a4d",{mood:"sad"})}</g></g>
 <path class="o" fill="#f2b27c" d="M170 372 Q235 330 320 338 Q405 330 470 372 Z"/><path stroke="#c4633a" stroke-width="3" fill="none" stroke-linecap="round" d="M230 362 q10 -6 20 0 M360 358 q10 -6 20 0"/>
 <path class="sweat" fill="#7fd4ff" stroke="${INK}" stroke-width="3" d="M380 222 q-9 14 0 20 q9 -6 0 -20z"/>
 <g transform="translate(130 250)"><path class="o" fill="#b07a3a" d="M-5 0 H5 V74 H-5Z"/><rect class="o" x="-58" y="-26" width="116" height="42" rx="9" fill="#fff3a8"/><text y="5" text-anchor="middle" style="font-size:17px">مارس ٢٠١٠</text></g>${lab(450,186,"آخر اتصال 📡",150)}</g>
<g class="sc s3"><g transform="translate(260 330)">${rover("#ff7a4d")}</g>
 <g transform="translate(310 216)"><g class="flash">${star(0,0,26,"#fff7a1")}</g></g>
 ${[[390,230,0],[440,190,.6],[500,230,1.2],[420,130,1.8],[520,150,2.4]].map(p=>`<g transform="translate(${p[0]} ${p[1]})"><g class="ph" style="animation-delay:${p[2]*-.5}s"><rect class="o" x="-17" y="-17" width="34" height="34" rx="4" fill="#fff"/><rect x="-12" y="-12" width="24" height="17" fill="#9ad0ff"/><circle cx="-4" cy="-6" r="3" fill="#ffd23f"/></g></g>`).join("")}${lab(450,300,"+١٢٤ ألف صورة 📷",200)}</g>`,

opp:()=>`${marsBG()}
<g class="sc s0">${flag(40,350,"١ كم","#cfd3e6",.9)}${flag(585,350,"٤٥ كم","#6fdc9a",1.1)}
 <path class="o trail" fill="none" stroke-dasharray="4 14" d="M40 372 H585"/>
 <g transform="translate(200 330)"><g class="drive long">${rover("#ffc83d")}</g></g>${lab(320,170,"المخطط ١ كم · الفعلي ٤٥ كم!",290)}</g>
<g class="sc s1">${[[250,338],[285,350],[320,336],[352,352],[386,340],[300,372],[345,376],[262,368]].map((p,i)=>`<g transform="translate(${p[0]} ${p[1]})"><g class="berry" style="animation-delay:${-i*.25}s"><circle class="o" r="13" fill="#4a6fff"/><path stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" d="M-6 -4 Q-4 -9 2 -9"/></g></g>`).join("")}
 <g transform="translate(150 322) scale(.85)">${rover("#ffc83d")}</g>
 <g transform="translate(320 300)"><g class="mag"><circle class="o" r="58" fill="#ffffff55" stroke-width="7"/><path class="o" stroke-width="12" d="M42 42 L80 80"/></g></g>${lab(470,186,"«توت المريخ» = هيماتيت",250)}</g>
<g class="sc s2"><g transform="translate(320 330)">${rover("#ffc83d",{mood:"sleep"})}</g>
 <rect width="640" height="400" fill="#8a5a3a" opacity=".38"/>
 <g class="dust"><path fill="#b5703f" opacity=".8" d="M-40 90 q60 -50 120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 V150 H-40Z"/><path fill="#c98a50" opacity=".75" d="M-60 190 q60 -50 120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 V250 H-60Z"/><path fill="#a9663a" opacity=".7" d="M-20 290 q60 -40 120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 V340 H-20Z"/></g>
 ${zzz(380,210)}<g transform="translate(90 250)"><rect class="o" width="64" height="32" rx="6" fill="#fff"/><rect class="o" x="64" y="9" width="7" height="14" fill="#fff"/><rect class="blink" x="6" y="6" width="9" height="20" fill="#e5575b"/></g>${lab(470,120,"عاصفة غبار 🌪️ ١٠ يونيو ٢٠١٨",300)}</g>
<g class="sc s3"><g transform="translate(300 330)">${rover("#ffc83d")}</g>
 <g transform="translate(60 340)"><path class="o" fill="none" d="M0 0 V-110"/><path class="o" fill="none" d="M580 0 V-110"/><path class="o" fill="#fff" d="M0 -110 H580 V-82 H0Z"/><g>${Array.from({length:29},(_,i)=>`<rect x="${i*20}" y="${-110+(i%2)*14}" width="20" height="14" fill="${INK}"/>`).join("")}</g></g>
 <g transform="translate(500 200)"><g class="medal"><path class="o" fill="#e5575b" d="M-20 -80 L0 -22 L20 -80Z"/><circle class="o" r="36" fill="#ffd23f"/><circle r="26" fill="none" stroke="${INK}" stroke-width="3" stroke-dasharray="5 5"/><text y="9" text-anchor="middle" style="font-size:26px">٤٥</text></g></g>
 ${star(130,170,14)}${star(220,130,10,"#ff8fa3")}${star(420,150,12,"#6fdc9a")}${lab(250,90,"أطول من ماراثون كامل! 🏅",270)}</g>`,

ing:()=>`${marsBG()}
<g class="sc s0"><g transform="translate(330 368) scale(.45)">${heli()}</g><g transform="translate(330 306)">${rover("#8fb4ff")}</g>${lab(500,372,"أنا تحت البطن!",190)}
 <g transform="translate(130 196)"><g class="lab"><path class="o" fill="#fff" d="M-60 -30 q-30 0 -30 30 q0 30 30 30 h10 l-6 26 l26 -26 h30 q30 0 30 -30 q0 -30 -30 -30z"/><text y="9" text-anchor="middle" style="font-size:15px">هل أستطيع الطيران؟</text></g></g>${lab(500,170,"٥ رحلات فقط!",180)}</g>
<g class="sc s1"><ellipse class="shadow" cx="320" cy="350" rx="60" ry="10" fill="#0003"/><g transform="translate(320 200)"><g class="fly">${heli()}</g></g>
 <path class="o trail" fill="none" stroke-dasharray="4 14" d="M80 320 Q200 120 320 200 T560 130"/>
 ${["الرحلة ١","الرحلة ٢٥","الرحلة ٥٠","الرحلة ٧٢"].map((t,i)=>`<g transform="translate(320 322)"><g class="cnt c${i}"><rect class="o" x="-70" y="-20" width="140" height="38" rx="14" fill="#fff3a8"/><text y="7" text-anchor="middle">${t}</text></g></g>`).join("")}${lab(480,60,"١٩ أبريل ٢٠٢١ — أول طيران!",270)}</g>
<g class="sc s2"><g transform="translate(320 300) rotate(-14)">${heli({mood:"sad",broken:true})}</g>
 <g transform="translate(320 230)"><g class="dizzy">${star(-50,0,9)}${star(0,-14,9,"#ff8fa3")}${star(50,0,9,"#9ad0ff")}</g></g>
 <circle class="puff" cx="250" cy="346" r="14" fill="#f5d2b0" stroke="${INK}" stroke-width="3"/><circle class="puff d2" cx="400" cy="348" r="11" fill="#f5d2b0" stroke="${INK}" stroke-width="3"/>${lab(320,60,"الرحلة الأخيرة ١٨ يناير ٢٠٢٤",290)}</g>
<g class="sc s3"><g transform="translate(320 292)"><g class="fly slow">${heli()}</g></g>
 <g transform="translate(330 215)"><rect class="patch o" x="-14" y="-3" width="28" height="22" rx="3" fill="#fff3a8"/></g>
 <g transform="translate(120 160)"><g class="lab"><ellipse class="o" rx="86" ry="52" fill="#fff"/><g class="plane"><path class="o" fill="none" d="M-22 -14 V10 M22 -14 V10"/><rect class="o" x="-42" y="-20" width="84" height="9" rx="4" fill="#ffd166"/><rect class="o" x="-42" y="8" width="84" height="9" rx="4" fill="#ffd166"/><ellipse class="o" cx="0" cy="-3" rx="26" ry="8" fill="#fff"/><path class="o" fill="none" d="M26 -3 L46 -10 M-28 -3 H-38"/></g><circle cx="-92" cy="52" r="8" class="o" fill="#fff"/></g></g>
 ${star(550,260,12,"#fff7a1")}${lab(440,60,"قماش جناح طائرة الأخوين رايت",300)}</g>`,

alsep:()=>`${moonBG()}
<g class="sc s0">${[[70,0.55],[170,0.7],[290,0.85],[420,1],[540,1.15]].map((p,i)=>`<g transform="translate(${p[0]} ${318+i*10}) scale(${p[1]*.62})"><g class="pop" style="animation-delay:${-i*.5}s">${station("#8fd4ff")}</g></g>`).join("")}
 ${[70,170,290,420,540].map((x,i)=>`<g transform="translate(${x} ${208+i*8})"><circle class="o" r="14" fill="#ffd23f" stroke-width="3"/><text y="6" text-anchor="middle" style="font-size:17px">${["١","٢","٣","٤","٥"][i]}</text></g>`).join("")}${lab(320,60,"٥ محطات · ١٩٦٩ – ١٩٧٢",280)}</g>
<g class="sc s1"><g transform="translate(250 345) scale(1.15)">${station("#8fd4ff")}</g>
 <g transform="translate(470 170)"><rect class="o" x="-90" y="-60" width="180" height="120" rx="10" fill="#fff"/><path class="o wig" pathLength="100" fill="none" stroke="#e5575b" stroke-width="4" d="M-80 0 H-50 l6 -34 l10 60 l10 -50 l10 30 l8 -12 H-10 l6 -40 l10 70 l10 -54 l8 24 H40 l6 -26 l8 40 l6 -14 H80"/></g>${lab(470,260,"جهاز الزلازل السلبي",210)}</g>
<g class="sc s2"><g transform="translate(120 345)">${station("#8fd4ff",{})}</g>
 <g class="meteor"><circle class="o" cx="520" cy="80" r="16" fill="#ff9a6b"/><path stroke="#ffd23f" stroke-width="7" stroke-linecap="round" d="M538 64 L580 24 M534 76 L600 50"/></g>
 <g transform="translate(470 318)"><ellipse class="ring" rx="22" ry="7" fill="none" stroke="#fff" stroke-width="4"/><ellipse class="ring r2" rx="22" ry="7" fill="none" stroke="#fff" stroke-width="4"/><ellipse class="ring r3" rx="22" ry="7" fill="none" stroke="#fff" stroke-width="4"/></g>${lab(330,170,"موجات تعبر داخل القمر",250)}</g>
<g class="sc s3"><g transform="translate(250 345) scale(1.1)">${station("#8fd4ff",{mood:"sleep"})}</g>${zzz(340,250)}
 <g transform="translate(450 150)"><g class="bulb"><circle r="44" fill="#fff7a1" opacity=".35"/><path class="o" fill="#ffe66d" d="M0 -30 a24 24 0 0 1 14 44 v10 h-28 v-10 a24 24 0 0 1 14 -44z"/><path class="o" fill="none" d="M-9 30 h18 M-7 38 h14"/></g></g>
 ${lab(450,258,"المعرفة تبقى حيّة ✨",230)}${lab(150,60,"٣٠ سبتمبر ١٩٧٧",190)}</g>`
};
