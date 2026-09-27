(function(){
  function init(){
    const toggle=document.querySelector('.mobile-menu-toggle');
    const nav=document.querySelector('.mobile-nav');
    const overlay=document.querySelector('.mobile-nav-overlay');
    const close=document.querySelector('.mobile-menu-close');
    if(!toggle||!nav) return;
    const open=()=>{document.body.classList.add('mobile-nav-open');toggle.setAttribute('aria-expanded','true');overlay&&overlay.setAttribute('aria-hidden','false');};
    const shut=()=>{document.body.classList.remove('mobile-nav-open');toggle.setAttribute('aria-expanded','false');overlay&&overlay.setAttribute('aria-hidden','true');};
    toggle.addEventListener('click',()=>document.body.classList.contains('mobile-nav-open')?shut():open());
    close&&close.addEventListener('click',shut);
    overlay&&overlay.addEventListener('click',shut);
    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',shut));
    document.addEventListener('keydown',e=>{if(e.key==='Escape')shut();});
    window.addEventListener('resize',()=>{if(window.innerWidth>900)shut();});
  }
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();
