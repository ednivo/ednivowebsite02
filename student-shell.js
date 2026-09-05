
(function(){
  const links=[
    ['overview','student-dashboard.html','▦','Overview'],
    ['practice','practice.html','▣','Practice'],
    ['classes','classes.html','◫','Upcoming & Recordings'],
    ['syllabus','syllabus.html','☷','SAT Syllabus'],
    ['calculator','score-calculator.html','◈','Score Calculator'],
    ['ai','ai-tutor.html','✦','AI SAT Coach']
  ];
  function user(){try{return JSON.parse(localStorage.getItem('pw_user')||'{}')}catch(e){return {}}}
  async function getProfile(){
    const u=user();
    try{
      if(window.EDNIVO_DB?.configured){
        await window.EDNIVO_DB.ready;
        const s=await window.ednivoSupabase.auth.getSession();
        if(s.data?.session){
          const p=await window.EDNIVO_DB.getProfile(s.data.session.user.id);
          return p||u;
        }
      }
    }catch(e){}
    return u;
  }
  function initials(name){return (name||'Student').split(/\s+/).slice(0,2).map(x=>x[0]).join('').toUpperCase()}
  function render(p){
    const page=document.body.dataset.portal||'overview';
    const side=document.createElement('aside'); side.className='student-side'; side.id='studentSide';
    side.innerHTML=`<div class="side-brand"><a class="logo" href="student-dashboard.html">edniv<i>o</i></a><div class="course-meta"><b>SAT Preparation</b>GCC Student Workspace</div></div>
      <nav class="side-nav">${links.map(x=>`<a class="${page===x[0]?'active':''}" href="${x[1]}"><span class="ico">${x[2]}</span>${x[3]}</a>`).join('')}</nav>
      <div class="side-bottom"><div class="profile-mini"><div class="avatar">${initials(p.name)}</div><div><div class="name">${p.name||'Student'}</div><div class="email">${p.email||''}</div></div></div><button class="logout" id="logoutBtn">Log out</button></div>`;
    document.querySelector('.student-app').prepend(side);
    const main=document.querySelector('.student-main');
    const top=main.querySelector('.student-top');
    if(top){
      const title=top.querySelector('[data-page-title]'); if(title) title.textContent=links.find(x=>x[0]===page)?.[3]||'Overview';
      const actions=top.querySelector('.top-actions');
      if(actions) actions.innerHTML=`<button class="icon-btn mobile-side-toggle" id="menuBtn">☰</button><button class="icon-btn" title="Notifications">♧</button><button class="profile-btn" id="profileBtn"><span class="avatar">${initials(p.name)}</span><span>${p.name||'Student'}</span></button>`;
    }
    document.getElementById('logoutBtn')?.addEventListener('click',async()=>{try{await ednivoSignOut()}catch(e){logout()}});
    document.getElementById('menuBtn')?.addEventListener('click',()=>document.getElementById('studentSide').classList.toggle('open'));
    document.getElementById('profileBtn')?.addEventListener('click',()=>document.getElementById('studentSide').classList.toggle('open'));
    window.EDNIVO_STUDENT=p;
    window.dispatchEvent(new CustomEvent('ednivo:student-ready',{detail:p}));
  }
  document.addEventListener('DOMContentLoaded',async()=>{
    if(!document.querySelector('.student-app')) return;
    const p=await getProfile();
    if(!p || !p.email){location.href='login.html?redirect='+encodeURIComponent(location.href);return;}
    render(p);
  });
})();
