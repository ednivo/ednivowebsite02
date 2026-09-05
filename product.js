(function(){
  function priority(skillMap){return Object.entries(skillMap||{}).map(([skill,v])=>({skill,pct:v.total?Math.round(v.correct/v.total*100):0})).sort((a,b)=>a.pct-b.pct);}
  function buildPlan(profile,skillMap){
    const weak=priority(skillMap).slice(0,5); const target=Number(profile?.target_score||1450);
    const days=profile?.test_date?Math.max(14,Math.ceil((new Date(profile.test_date)-new Date())/86400000)):42;
    const daily=days<=21?'45–60 min':days<=45?'35–50 min':'30–45 min';
    const tasks=[]; weak.forEach((w,i)=>tasks.push({day:i+1,skill:w.skill,mastery:w.pct,task:`Targeted ${w.skill} practice`,minutes:i<2?15:10}));
    tasks.push({day:weak.length+1,skill:'Mixed review',mastery:null,task:'Mistake review + timed drill',minutes:15});
    return {target_score:target,test_date:profile?.test_date||null,daily_time:daily,days,focus:tasks,note:'Your plan prioritizes low-mastery skills, then retests them after practice and mocks.'};
  }
  function classifyError(correct,time,confidence){if(correct)return '';if(time>120)return 'Time pressure';if(confidence>=4)return 'Concept gap';return 'Reasoning / strategy';}
  function tutor(q,selected,answer,skill){return `Let’s diagnose the mistake, not just reveal the answer. This is ${skill||'an SAT'} practice. You chose ${selected}; the correct choice is ${answer}. ${q?.e||'Identify what the question is asking, name the rule, then eliminate choices that violate it.'}`;}
  window.EdNivoProduct={priority,buildPlan,classifyError,tutor};
})();
