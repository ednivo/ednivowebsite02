/* Shared lead storage: Supabase + the Google Sheet endpoint already used by Ednivo registration. */
(function(){
  window.EdNivoSaveLeadEverywhere = async function(data){
    const lead={
      name:String(data.name||'').trim(),
      email:String(data.email||'').trim().toLowerCase(),
      phone:String(data.phone||'').trim(),
      source:String(data.source||'website-lead').trim(),
      role:'student'
    };
    const jobs=[];
    jobs.push((async()=>{
      try{
        await window.EDNIVO_DB?.ready;
        if(window.ednivoSupabase){
          const {error}=await window.ednivoSupabase.from('leads').insert(lead);
          if(error) throw error;
          return {supabase:true};
        }
        return {supabase:false};
      }catch(e){console.warn('Supabase lead save failed:',e);return {supabase:false,error:e};}
    })());
    jobs.push((async()=>{
      try{
        if(typeof window.SCRIPT_URL!=='string'||!window.SCRIPT_URL) return {sheet:false};
        const fd=new FormData();
        fd.append('sheetTarget','newUser');
        fd.append('role','lead');
        fd.append('name',lead.name);
        fd.append('email',lead.email);
        fd.append('phone',lead.phone);
        fd.append('grade','Lead source: '+lead.source);
        fd.append('country','');
        fd.append('source',lead.source);
        fd.append('signupDate',new Date().toLocaleString());
        await fetch(window.SCRIPT_URL,{method:'POST',mode:'no-cors',body:fd});
        return {sheet:true};
      }catch(e){console.warn('Google Sheet lead save failed:',e);return {sheet:false,error:e};}
    })());
    return Promise.all(jobs);
  };
})();
