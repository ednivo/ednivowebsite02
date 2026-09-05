/* Ednivo database layer: Supabase when configured, localStorage fallback otherwise. */
(function(){
  const configured = window.EDNIVO_SUPABASE_URL && !String(window.EDNIVO_SUPABASE_URL).includes('YOUR_') &&
    window.EDNIVO_SUPABASE_ANON_KEY && !String(window.EDNIVO_SUPABASE_ANON_KEY).includes('YOUR_');
  window.EDNIVO_DB = { configured: !!configured };

  function loadScript(src){ return new Promise((resolve,reject)=>{ const s=document.createElement('script'); s.src=src; s.async=true; s.onload=resolve; s.onerror=()=>reject(new Error('Could not load Supabase client from '+src)); document.head.appendChild(s); }); }
  async function init(){
    if(!configured) return null;
    if(!window.supabase){
      try { await loadScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'); }
      catch(primaryError) {
        try { await loadScript('https://unpkg.com/@supabase/supabase-js@2'); }
        catch(fallbackError) {
          window.EDNIVO_SUPABASE_LOAD_ERROR = 'Supabase client could not be loaded. Check your hosting CSP/firewall and allow jsdelivr.net or unpkg.com.';
          throw fallbackError;
        }
      }
    }
    if(!window.supabase || typeof window.supabase.createClient !== 'function'){
      throw new Error('Supabase JavaScript client loaded incorrectly.');
    }
    window.ednivoSupabase = window.supabase.createClient(window.EDNIVO_SUPABASE_URL, window.EDNIVO_SUPABASE_ANON_KEY);
    return window.ednivoSupabase;
  }
  const ready = init().catch(e=>{ console.warn('Supabase unavailable.',e); window.EDNIVO_DB.configured=false; window.EDNIVO_DB.error=e; return null; });
  window.EDNIVO_DB.ready = ready;

  function localAuthMode(){ try{return !!sessionStorage.getItem('ednivo_otp_verified_email');}catch(e){return false;} }

  const local = {
    get(k){ try{return JSON.parse(localStorage.getItem(k)||'null')}catch(e){return null} },
    set(k,v){ localStorage.setItem(k,JSON.stringify(v)); return v; }
  };

  window.EDNIVO_DB.saveProfile = async function(profile){
    const sb=await ready;
    if(sb && !localAuthMode()){ const {data,error}=await sb.from('profiles').upsert(profile,{onConflict:'id'}).select().single(); if(error) throw error; return data; }
    return local.set('ednivo_profile',profile);
  };
  window.EDNIVO_DB.getProfile = async function(id){
    const sb=await ready;
    if(sb && !localAuthMode()){ const {data,error}=await sb.from('profiles').select('*').eq('id',id).maybeSingle(); if(error) throw error; return data; }
    return local.get('ednivo_profile');
  };
  window.EDNIVO_DB.saveDiagnostic = async function(result){
    const sb=await ready;
    if(sb && !localAuthMode()){ const {data,error}=await sb.from('diagnostic_results').insert(result).select().single(); if(error) throw error; return data; }
    const arr=local.get('ednivo_diagnostics')||[]; arr.push({...result,id:Date.now()}); local.set('ednivo_diagnostics',arr); return result;
  };
  window.EDNIVO_DB.getMyDiagnostics = async function(userId){
    const sb=await ready;
    if(sb && !localAuthMode()){ const {data,error}=await sb.from('diagnostic_results').select('*').eq('user_id',userId).order('created_at',{ascending:false}); if(error) throw error; return data||[]; }
    return local.get('ednivo_diagnostics')||[];
  };
  window.EDNIVO_DB.linkParentByEmail = async function(childEmail){
    const sb=await ready;
    if(sb && !localAuthMode()){ const {data,error}=await sb.rpc('link_parent_by_email',{child_email:String(childEmail||'').trim().toLowerCase()}); if(error) throw error; return data; }
    return {local:true};
  };
  window.EDNIVO_DB.getLinkedChildren = async function(){
    const sb=await ready;
    if(sb && !localAuthMode()){ const {data,error}=await sb.from('parent_links').select('student_id,profiles!parent_links_student_id_fkey(name,email,country,grade,target_score,test_date)').eq('parent_id',(await sb.auth.getUser()).data.user.id); if(error) throw error; return data||[]; }
    return [];
  };
  window.EDNIVO_DB.getChildDiagnostics = async function(studentId){
    const sb=await ready; if(sb && !localAuthMode()){const {data,error}=await sb.from('diagnostic_results').select('*').eq('user_id',studentId).order('created_at',{ascending:false});if(error)throw error;return data||[];} return [];
  };
  window.EDNIVO_DB.getChildAttempts = async function(studentId){
    const sb=await ready; if(sb && !localAuthMode()){const {data,error}=await sb.from('practice_attempts').select('*').eq('user_id',studentId).order('created_at',{ascending:false});if(error)throw error;return data||[];} return [];
  };
  window.EDNIVO_DB.getChildMocks = async function(studentId){
    const sb=await ready; if(sb && !localAuthMode()){const {data,error}=await sb.from('mock_results').select('*').eq('user_id',studentId).order('created_at',{ascending:false});if(error)throw error;return data||[];} return [];
  };
  window.EDNIVO_DB.savePracticeAttempt = async function(attempt){
    const sb=await ready;
    if(sb && !localAuthMode()){ const {data,error}=await sb.from('practice_attempts').insert(attempt).select().single(); if(error) throw error; return data; }
    const arr=local.get('ednivo_attempts')||[]; arr.push({...attempt,id:Date.now()}); local.set('ednivo_attempts',arr); return attempt;
  };
  window.EDNIVO_DB.getMyAttempts = async function(userId){
    const sb=await ready;
    if(sb && !localAuthMode()){ const {data,error}=await sb.from('practice_attempts').select('*').eq('user_id',userId).order('created_at',{ascending:false}); if(error) throw error; return data||[]; }
    return local.get('ednivo_attempts')||[];
  };
  window.EDNIVO_DB.saveStudyPlan = async function(plan){
    const sb=await ready;
    if(sb && !localAuthMode()){ const {data,error}=await sb.from('study_plans').upsert(plan,{onConflict:'user_id'}).select().single(); if(error) throw error; return data; }
    return local.set('ednivo_study_plan',plan);
  };
  window.EDNIVO_DB.saveMockResult = async function(result){
    const sb=await ready;
    if(sb && !localAuthMode()){ const {data,error}=await sb.from('mock_results').insert(result).select().single(); if(error) throw error; return data; }
    const arr=local.get('ednivo_mocks')||[]; const row={...result,id:Date.now(),created_at:new Date().toISOString()}; arr.unshift(row); local.set('ednivo_mocks',arr); return row;
  };
  window.EDNIVO_DB.getMyMocks = async function(userId){
    const sb=await ready;
    if(sb && !localAuthMode()){ const {data,error}=await sb.from('mock_results').select('*').eq('user_id',userId).order('created_at',{ascending:false}); if(error) throw error; return data||[]; }
    return local.get('ednivo_mocks')||[];
  };
  window.EDNIVO_DB.getMyPracticeStats = async function(userId){
    const attempts=await window.EDNIVO_DB.getMyAttempts(userId);
    const bySkill={}; attempts.forEach(a=>{ const k=a.skill||'Other'; bySkill[k] ||= {correct:0,total:0}; bySkill[k].total++; if(a.correct) bySkill[k].correct++; });
    return {attempts,bySkill};
  };
  window.EDNIVO_DB.getStudyPlan = async function(userId){
    const sb=await ready;
    if(sb && !localAuthMode()){ const {data,error}=await sb.from('study_plans').select('*').eq('user_id',userId).maybeSingle(); if(error) throw error; return data; }
    return local.get('ednivo_study_plan');
  };
  window.EDNIVO_DB.createLead = async function(lead){
    const sb=await ready;
    if(sb && !localAuthMode()){ const {data,error}=await sb.from('leads').insert(lead).select().single(); if(error) throw error; return data; }
    const arr=local.get('ednivo_leads')||[]; arr.push({...lead,id:Date.now()}); local.set('ednivo_leads',arr); return lead;
  };
})();
