/* Ednivo public-site engagement + contact popup */
(function(){
  const WA='https://wa.me/919424312427?text='+encodeURIComponent('Hi Ednivo! I need help with SAT preparation.');
  function esc(v){return String(v||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
  function openHelp(reason){
    if(document.getElementById('ednivoHelpModal') || document.getElementById('ednivoLeadGate')) return;
    const wrap=document.createElement('div');wrap.id='ednivoHelpModal';wrap.className='engage-overlay';
    wrap.innerHTML=`<div class="engage-card" role="dialog" aria-modal="true" aria-labelledby="helpTitle">
      <button class="engage-close" aria-label="Close">×</button>
      <div class="engage-kicker">Need more assistance?</div>
      <h2 id="helpTitle">Let’s help you choose the right SAT path.</h2>
      <p>Share your details and our team will get back to you.</p>
      <form id="helpForm" class="engage-form">
        <label>Email<input type="email" name="email" required placeholder="you@example.com"></label>
        <label>Phone / WhatsApp<input type="tel" name="phone" required placeholder="+91 94243 12427"></label>
        <button class="btn btn-primary" type="submit">Request assistance →</button>
      </form>
      <div id="helpStatus" class="engage-status"></div>
      <a class="engage-wa" href="${WA}" target="_blank" rel="noopener">Chat directly on WhatsApp</a>
    </div>`;
    document.body.appendChild(wrap);
    const close=()=>{wrap.remove();sessionStorage.setItem('ednivo_help_seen','1')};
    wrap.querySelector('.engage-close').onclick=close;
    wrap.addEventListener('click',e=>{if(e.target===wrap)close()});
    wrap.querySelector('#helpForm').onsubmit=async e=>{
      e.preventDefault(); const fd=new FormData(e.currentTarget), email=fd.get('email'), phone=fd.get('phone'), status=wrap.querySelector('#helpStatus');
      status.textContent='Sending…';
      try{
        if(window.EdNivoSaveLeadEverywhere){await window.EdNivoSaveLeadEverywhere({email,phone,source:'website-assistance-popup'});}else if(window.EDNIVO_DB?.configured){await window.EDNIVO_DB.ready; await window.ednivoSupabase.from('leads').insert({email,phone,source:'website-assistance-popup',role:'student'});}
        localStorage.setItem('ednivo_assistance_lead',JSON.stringify({email,phone,reason,created_at:new Date().toISOString()}));
        status.textContent='Our Team will get back to you.'; e.currentTarget.reset();
        setTimeout(close,1400);
      }catch(err){status.textContent='Our Team will get back to you.';localStorage.setItem('ednivo_assistance_lead',JSON.stringify({email,phone,reason,created_at:new Date().toISOString()}));setTimeout(close,1400)}
    };
  }
  function addFloatingWhatsApp(){
    if(document.getElementById('ednivoFloatingWA')) return;
    const a=document.createElement('a');
    a.id='ednivoFloatingWA';
    a.className='floating-wa';
    a.href=WA;
    a.target='_blank';
    a.rel='noopener';
    a.setAttribute('aria-label','Chat with Ednivo on WhatsApp');
    a.title='Chat with Ednivo on WhatsApp';
    a.innerHTML='<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16 3.2a12.8 12.8 0 0 0-11 19.3L3.2 28.8l6.5-1.7A12.8 12.8 0 1 0 16 3.2Zm0 23.2c-2 0-3.9-.6-5.5-1.7l-.4-.3-3.8 1 1-3.7-.3-.4A10.2 10.2 0 1 1 16 26.4Zm5.6-7.5c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.5-1.6-.9-.8-1.6-1.8-1.8-2.1-.2-.3 0-.5.2-.7l.5-.6c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.2-.7-1.7-.9-2.3-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.6 1.1 2.8c.1.2 1.8 2.8 4.4 3.9.6.3 1.1.4 1.5.6.6.2 1.1.2 1.5.1.5-.1 1.9-.8 2.2-1.5.3-.7.3-1.3.2-1.4-.1-.1-.3-.2-.6-.4Z"/></svg>';
    document.body.appendChild(a);
  }
  function setup(){
    const isStudentArea = !!document.querySelector('.student-app') || document.body.classList.contains('login-page') || location.pathname.endsWith('/login.html') || location.pathname.endsWith('login.html');
    if(!isStudentArea) addFloatingWhatsApp();
    if(sessionStorage.getItem('ednivo_help_seen')) return;
    window.setTimeout(()=>{if(!document.getElementById('ednivoLeadGate')) openHelp('10-second visit')},10000);
    document.addEventListener('mouseleave',e=>{if(e.clientY<=0&&!sessionStorage.getItem('ednivo_help_seen')&&!document.getElementById('ednivoLeadGate')) openHelp('exit intent')},{once:true});
  }
  document.addEventListener('DOMContentLoaded',setup);
  window.EdNivoHelp=openHelp;
})();
