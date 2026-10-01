/* Shared Ednivo lead storage: save independently to Supabase + Google Sheets. */
(function(){
  const SHEET_WEB_APP_URL='https://script.google.com/macros/s/AKfycbzI4NpaGcHm_25hJplHXXzf2f2-sYN4qr37IbkVSjawnjAHausQuHjXDLVCV3_elIHl/exec';

  window.EdNivoSaveLeadEverywhere = async function(data){
    const rawPhone=String(data.phone||'').trim();
    const lead={
      name:String(data.name||'').trim() || 'Not provided',
      email:String(data.email||'').trim().toLowerCase(),
      phone:rawPhone,
      country_code:String(data.country_code||'').trim(),
      country:String(data.country||'').trim(),
      source:String(data.source||'website-lead').trim(),
      page_url:String(data.page_url||location.href).trim()
    };

    const supabaseJob=(async()=>{
      try{
        await window.EDNIVO_DB?.ready;
        if(!window.ednivoSupabase) throw new Error('Supabase client unavailable');
        const {error}=await window.ednivoSupabase.from('leads').insert(lead);
        if(error) throw error;
        return {supabase:true};
      }catch(error){
        console.warn('Supabase lead save failed:',error);
        return {supabase:false,error:String(error?.message||error)};
      }
    })();

    const sheetJob=(async()=>{
      try{
        /* text/plain keeps this a CORS-simple request; Apps Script reads e.postData.contents as JSON. */
        await fetch(SHEET_WEB_APP_URL,{
          method:'POST',
          mode:'no-cors',
          headers:{'Content-Type':'text/plain;charset=utf-8'},
          body:JSON.stringify(lead)
        });
        return {sheet:true};
      }catch(error){
        console.warn('Google Sheet lead save failed:',error);
        return {sheet:false,error:String(error?.message||error)};
      }
    })();

    const [supabase,sheet]=await Promise.all([supabaseJob,sheetJob]);
    return {supabase,sheet};
  };
})();
