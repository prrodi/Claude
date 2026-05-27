/* ================================================================
   APEX AUTO DETAILING — Main JavaScript
   ================================================================ */
'use strict';

/* ---- NAV SCROLL + ACTIVE LINK ---- */
(function(){
  const nav = document.getElementById('nav');
  if(!nav) return;
  window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>55),{passive:true});

  const page = location.pathname.split('/').pop()||'index.html';
  document.querySelectorAll('.nav-links a,.mob-nav a').forEach(a=>{
    if(a.getAttribute('href')===page||(page===''&&a.getAttribute('href')==='index.html'))
      a.classList.add('active');
  });
})();

/* ---- BURGER MENU ---- */
(function(){
  const btn = document.getElementById('burger');
  const mob = document.getElementById('mobNav');
  if(!btn||!mob) return;
  btn.addEventListener('click',()=>{
    btn.classList.toggle('open');
    mob.classList.toggle('open');
    document.body.style.overflow=mob.classList.contains('open')?'hidden':'';
  });
  mob.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    btn.classList.remove('open'); mob.classList.remove('open');
    document.body.style.overflow='';
  }));
})();

/* ---- SMOOTH SCROLL ---- */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const t=document.querySelector(a.getAttribute('href'));
    if(!t) return;
    e.preventDefault();
    const h=document.getElementById('nav')?.offsetHeight||76;
    window.scrollTo({top:t.getBoundingClientRect().top+scrollY-h,behavior:'smooth'});
  });
});

/* ---- INTERSECTION OBSERVER (reveals) ---- */
const io=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});
},{threshold:.08,rootMargin:'0px 0px -48px 0px'});
document.querySelectorAll('.reveal,.reveal-l,.reveal-r,.stagger').forEach(el=>io.observe(el));

/* ---- COUNT-UP ---- */
function runCount(el){
  const end=+el.dataset.target, dur=2000, dec=+(el.dataset.dec||0);
  const t0=performance.now(), ease=t=>1-Math.pow(1-t,3);
  (function tick(now){
    const p=Math.min((now-t0)/dur,1), v=ease(p)*end;
    el.textContent=dec?v.toFixed(dec):Math.floor(v);
    if(p<1) requestAnimationFrame(tick);
    else el.textContent=dec?end.toFixed(dec):end;
  })(t0);
}
const cio=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(!e.isIntersecting) return;
    e.target.querySelectorAll('[data-target]').forEach(runCount);
    cio.unobserve(e.target);
  });
},{threshold:.4});
document.querySelectorAll('.count-wrap').forEach(s=>cio.observe(s));

/* ---- BEFORE / AFTER SLIDER ---- */
document.querySelectorAll('.ba-wrap').forEach(wrap=>{
  const before=wrap.querySelector('.ba-before');
  const handle=wrap.querySelector('.ba-handle');
  if(!before||!handle) return;
  let drag=false;
  const set=x=>{
    const r=wrap.getBoundingClientRect();
    const pct=Math.min(Math.max((x-r.left)/r.width*100,2),98);
    before.style.width=pct+'%';
    handle.style.left=pct+'%';
  };
  handle.addEventListener('mousedown', ()=>drag=true);
  handle.addEventListener('touchstart',()=>drag=true,{passive:true});
  window.addEventListener('mousemove', e=>{if(drag)set(e.clientX);});
  window.addEventListener('touchmove', e=>{if(drag)set(e.touches[0].clientX);},{passive:true});
  window.addEventListener('mouseup',  ()=>drag=false);
  window.addEventListener('touchend', ()=>drag=false);
  wrap.addEventListener('click',e=>set(e.clientX));
});

/* ---- FAQ ACCORDION ---- */
document.querySelectorAll('.faq-q').forEach(q=>{
  q.addEventListener('click',()=>{
    const it=q.closest('.faq-item'), was=it.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i=>i.classList.remove('open'));
    if(!was) it.classList.add('open');
  });
});

/* ---- FORM SUBMIT ---- */
document.querySelectorAll('form[data-form]').forEach(form=>{
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const btn=form.querySelector('[type="submit"]');
    const msg=form.querySelector('.form-success');
    const orig=btn.textContent;
    btn.textContent='Sending…'; btn.disabled=true;
    setTimeout(()=>{
      msg?.classList.add('show');
      form.reset();
      btn.textContent=orig; btn.disabled=false;
      setTimeout(()=>msg?.classList.remove('show'),7000);
    },1200);
  });
});

/* ---- GALLERY FILTER ---- */
(function(){
  const btns=document.querySelectorAll('[data-filter]');
  const items=document.querySelectorAll('[data-cat]');
  if(!btns.length) return;
  btns.forEach(btn=>{
    btn.addEventListener('click',()=>{
      btns.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const f=btn.dataset.filter;
      items.forEach(it=>{
        const show=f==='all'||it.dataset.cat===f;
        it.style.opacity=show?'1':'0.1';
        it.style.transform=show?'scale(1)':'scale(.96)';
        it.style.pointerEvents=show?'all':'none';
      });
    });
  });
})();

/* ---- PARALLAX (hero bg) ---- */
(function(){
  const el=document.querySelector('.hero-parallax');
  if(!el) return;
  window.addEventListener('scroll',()=>{
    el.style.transform=`translateY(${scrollY*.3}px)`;
  },{passive:true});
})();

/* ---- HERO PARTICLES ---- */
(function(){
  const wrap=document.getElementById('pts');
  if(!wrap) return;
  for(let i=0;i<18;i++){
    const d=document.createElement('div');
    d.className='h-particle';
    const sz=Math.random()*2+1;
    Object.assign(d.style,{
      left:Math.random()*100+'%',
      width:sz+'px', height:sz+'px',
      background:`rgba(201,150,63,${Math.random()*.35+.15})`,
      animationDuration:(Math.random()*12+9)+'s',
      animationDelay:(Math.random()*16)+'s',
      '--dx':((Math.random()-.5)*80)+'px',
    });
    wrap.appendChild(d);
  }
})();
