// Shared helpers for every vertical video. Load after the page markup, then define SC, DUR and render(t).
// Contract: window.render(t) draws frame t (seconds) deterministically; window.DUR is the length.
const $=id=>document.getElementById(id);
const cl=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const P=(t,a,b)=>cl((t-a)/(b-a));                  // 0..1 progress
const ez=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;
const E=(t,a,b)=>ez(P(t,a,b));                    // eased progress
const lerp=(a,b,k)=>a+(b-a)*k;



// Scene fades. sc = {id:[start,end]}; ids in `holdLast` stay visible at the end.
function fadeScenes(t,sc,holdLast=[]){
 for(const [id,[a,b]] of Object.entries(sc)){const o=Math.min(P(t,a,a+.45),1-P(t,b-.45,b)); $(id).style.opacity=holdLast.includes(id)?P(t,a,a+.45):o;}
}

// The six-vertical tracker across the top. Call buildTracker(activeIndex) once.
// renderTracker(t, showFrom, handoffAt): active vertical pulses red; at handoffAt it turns green and the line fills to the next one.
function buildTracker(active){
 const el=document.createElement('div'); el.id='track'; el.className='abs'; el.style.cssText='left:260px;right:260px;top:64px;height:90px;opacity:0';
 const W=1400-48;
 el.innerHTML=`<div class="abs" style="left:24px;right:24px;top:22px;height:6px;border-radius:3px;background:var(--line)"></div><div id="tfill" class="abs" style="left:24px;top:22px;height:6px;border-radius:3px;background:var(--green4);width:0"></div>`+
  VERTICALS.map((s,i)=>`<div class="abs" style="left:${i*W/5}px;top:0;width:50px;text-align:center"><div id="td${i}" style="width:50px;height:50px;border-radius:50%;background:#fff;border:5px solid var(--line)"></div><div id="tl${i}" style="position:absolute;left:-60px;width:170px;top:62px;font-size:22px;font-weight:600;color:var(--ink3)">${s}</div></div>`).join('');
 $('stage').prepend(el); window.__active=active;
}
function renderTracker(t,showFrom,showTo,handoffAt){
 const a=window.__active, W=1400-48;
 $('track').style.opacity=E(t,showFrom,showFrom+.5)*(1-E(t,showTo-.4,showTo));
 const handed=t>=handoffAt;
 for(let i=0;i<6;i++){const d=$('td'+i),l=$('tl'+i); const done=i<a||(i===a&&handed), on=i===a&&!handed;
  d.style.background=done?'var(--green4)':on?'var(--brand)':'#fff'; d.style.borderColor=done?'var(--green4)':on?'var(--brand)':'var(--line)';
  d.style.transform=`scale(${on?1+.12*Math.sin(t*6):1})`; l.style.color=done?'var(--green)':on?'var(--brand6)':'var(--ink3)';}
 const k=a+(handed?E(t,handoffAt,handoffAt+1.2):0); $('tfill').style.width=`${cl(k/5)*W}px`;
}

// Simulated finger: path = [[t0,t1,x0,y0,x1,y1,tap]]. Needs <div id="touch" class="touch"> and <div id="rip" class="ripple"> in #stage.
function renderTouch(t,path){
 let vis=0,x=0,y=0,rk=-1;
 for(const [a,b,x0,y0,x1,y1,tap] of path){ if(t>=a-.3&&t<=b+.6){vis=1;const k=E(t,a,b);x=lerp(x0,x1,k);y=lerp(y0,y1,k); if(tap&&t>=b&&t<=b+.5) rk=(t-b)/.5;}}
 $('touch').style.opacity=vis; $('touch').style.left=x+'px'; $('touch').style.top=y+'px';
 if(rk>=0){const r=30+rk*70; Object.assign($('rip').style,{opacity:1-rk,left:(x-r)+'px',top:(y-r)+'px',width:2*r+'px',height:2*r+'px'});} else $('rip').style.opacity=0;
}

// Real footage: <video class="vid" data-src="file.mp4" data-start="12.0" muted playsinline preload="auto"> inside a .vbox with a .ph placeholder.
window.VIDS_READY=Promise.all([...document.querySelectorAll('video.vid')].map(v=>new Promise(res=>{v.addEventListener('loadeddata',res,{once:true}); v.addEventListener('error',()=>{v.parentElement.classList.add('missing');res();},{once:true}); v.src=v.dataset.src;})));
async function renderVideos(t){
 for(const v of document.querySelectorAll('video.vid')){ if(v.parentElement.classList.contains('missing')) continue;
  const st=+v.dataset.start, rate=+(v.dataset.rate||1), dur=isFinite(v.duration)?v.duration:12, vt=cl((t-st)*rate,0,Math.max(0,dur-0.05));
  if(window.CAPTURE){ if(Math.abs(v.currentTime-vt)>0.001){ await new Promise(r=>{v.onseeked=r; v.currentTime=vt;}); } }
  else { if(t>=st&&vt<dur-.05){ if(v.paused){v.currentTime=vt; v.playbackRate=rate; v.play();} } else v.pause(); } }
}
// Typewriter: shows the first part of txt between a and b.
const typed=(txt,t,a,b)=>txt.slice(0,Math.floor(txt.length*P(t,a,b)));

// Preview with ?play (loops in real time) or ?t=12.5 (one frame).
function boot(){
 const q=new URLSearchParams(location.search);
 if(q.has('play')){const t0=performance.now();const loop=()=>{render((performance.now()-t0)/1000%window.DUR);requestAnimationFrame(loop);};loop();}
 else render(+(q.get('t')||0));
}
