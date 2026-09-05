/* Ednivo SAT engine — adaptive MVP. This is NOT College Board's scoring algorithm. */
(function(){
  const BANK=[
    // Math
    {id:'m01',s:'Math',skill:'Algebra',d:1,q:'Solve 3x + 5 = 20.',o:['5','6','7','8'],a:0,e:'Solve linear equations by isolating the variable.'},
    {id:'m02',s:'Math',skill:'Algebra',d:2,q:'If 2x - 7 = 15, what is x?',o:['4','9','11','22'],a:1,e:'Add 7, then divide by 2.'},
    {id:'m03',s:'Math',skill:'Algebra',d:3,q:'If 4x + 3 = 2x + 19, what is x?',o:['6','7','8','11'],a:2,e:'Move 2x to the left and 3 to the right.'},
    {id:'m04',s:'Math',skill:'Advanced Math',d:1,q:'Which value of x satisfies x² = 49?',o:['5','6','7','9'],a:2,e:'The positive square root of 49 is 7.'},
    {id:'m05',s:'Math',skill:'Advanced Math',d:2,q:'If x² − 7x + 12 = 0, what is the sum of the solutions?',o:['3','4','7','12'],a:2,e:'For x² + bx + c, the sum of roots is −b.'},
    {id:'m06',s:'Math',skill:'Advanced Math',d:3,q:'If f(x)=x²−4x+1, what is f(3)?',o:['-2','-1','0','2'],a:0,e:'Substitute 3 for x and simplify.'},
    {id:'m07',s:'Math',skill:'Problem Solving',d:1,q:'A quantity rises from 80 to 100. What is the percent increase?',o:['20%','25%','30%','40%'],a:1,e:'Increase divided by original value: 20/80.'},
    {id:'m08',s:'Math',skill:'Problem Solving',d:2,q:'A $120 item is discounted 15%. What is the sale price?',o:['$98','$102','$105','$108'],a:1,e:'Find 15% of 120 and subtract it from 120.'},
    {id:'m09',s:'Math',skill:'Problem Solving',d:3,q:'A population increases by 8% each year. If it starts at 2,500, which expression represents the population after 3 years?',o:['2500(1.08)^3','2500(1.24)','2500+8(3)','2500(0.92)^3'],a:0,e:'Repeated percentage growth is multiplicative.'},
    {id:'m10',s:'Math',skill:'Geometry',d:1,q:'A rectangle has length 8 and width 5. What is its area?',o:['13','26','40','80'],a:2,e:'Area of a rectangle is length × width.'},
    {id:'m11',s:'Math',skill:'Geometry',d:2,q:'A right triangle has legs 6 and 8. What is the hypotenuse?',o:['9','10','12','14'],a:1,e:'Use the Pythagorean theorem.'},
    {id:'m12',s:'Math',skill:'Geometry',d:3,q:'A circle has radius 6. What is its area in terms of π?',o:['6π','12π','36π','72π'],a:2,e:'Area is πr².'},
    {id:'m13',s:'Math',skill:'Data Analysis',d:1,q:'The mean of 4, 6, 8, and 10 is:',o:['6','7','8','9'],a:1,e:'Add the values and divide by four.'},
    {id:'m14',s:'Math',skill:'Data Analysis',d:2,q:'A data set has median 18. Which statement must be true?',o:['18 is the mean.','At least half the values are at or below 18.','18 is the largest value.','All values are within 18 of the mean.'],a:1,e:'That is the definition of a median.'},
    {id:'m15',s:'Math',skill:'Data Analysis',d:3,q:'A scatterplot shows points closely following an upward-sloping line. Which is most reasonable?',o:['Strong positive association','Strong negative association','No association','Perfect causation'],a:0,e:'An upward, tight pattern indicates a strong positive association.'},
    // RW
    {id:'r01',s:'Reading & Writing',skill:'Information & Ideas',d:1,q:'A study finds students who sleep more tend to perform better. Which statement is safest?',o:['Sleep definitely causes higher scores.','There is an association between sleep and performance.','Scores determine sleep.','No relationship exists.'],a:1,e:'Correlation alone does not establish causation.'},
    {id:'r02',s:'Reading & Writing',skill:'Information & Ideas',d:2,q:'A policy was followed by a 20% rise in recycling. Which evidence best supports an unexpected benefit?',o:['The policy title','A statistic showing recycling rose after the policy','A definition of recycling','The author’s biography'],a:1,e:'Relevant quantitative evidence directly supports the claim.'},
    {id:'r03',s:'Reading & Writing',skill:'Information & Ideas',d:3,q:'A passage reports that a city expanded bike lanes and traffic injuries fell, but notes several other changes occurred. Which conclusion is best?',o:['Bike lanes definitely caused the decline.','The decline proves the bike lanes had no effect.','The data suggest a possible relationship, but other factors may contribute.','The city should remove bike lanes.'],a:2,e:'The qualification prevents a causal claim.'},
    {id:'r04',s:'Reading & Writing',skill:'Craft & Structure',d:1,q:'The word “mitigate” most nearly means:',o:['increase','reduce','measure','predict'],a:1,e:'Mitigate means make less severe.'},
    {id:'r05',s:'Reading & Writing',skill:'Craft & Structure',d:2,q:'In a passage, “tentative” most nearly means:',o:['certain','preliminary','unrelated','ancient'],a:1,e:'Tentative describes something not yet final or certain.'},
    {id:'r06',s:'Reading & Writing',skill:'Craft & Structure',d:3,q:'An author describes an early hypothesis as “promising but incomplete.” The phrase primarily signals that the hypothesis is:',o:['already proven','worth exploring but not fully established','irrelevant','contradicted by all evidence'],a:1,e:'The wording balances optimism with a limitation.'},
    {id:'r07',s:'Reading & Writing',skill:'Expression of Ideas',d:1,q:'Which transition best signals a contrast?',o:['Similarly','Therefore','However','For example'],a:2,e:'However signals contrast.'},
    {id:'r08',s:'Reading & Writing',skill:'Expression of Ideas',d:2,q:'Which transition best introduces an example?',o:['However','For example','Therefore','Meanwhile'],a:1,e:'For example introduces a specific instance.'},
    {id:'r09',s:'Reading & Writing',skill:'Expression of Ideas',d:3,q:'The first sentence states that urban gardens can improve access to fresh food. Which sentence best supports that claim?',o:['Urban gardens can be colorful.','In one neighborhood, garden plots supplied fresh produce to dozens of families.','Many cities have tall buildings.','Gardening tools come in many sizes.'],a:1,e:'The specific result directly supports access to fresh food.'},
    {id:'r10',s:'Reading & Writing',skill:'Standard English Conventions',d:1,q:'The researchers ___ the results yesterday.',o:['publish','publishes','published','publishing'],a:2,e:'Yesterday calls for past tense.'},
    {id:'r11',s:'Reading & Writing',skill:'Standard English Conventions',d:2,q:'Which sentence is grammatically correct?',o:['The students was ready.','The students were ready.','The students is ready.','The students be ready.'],a:1,e:'Plural subject “students” takes “were.”'},
    {id:'r12',s:'Reading & Writing',skill:'Standard English Conventions',d:3,q:'Which choice correctly completes the sentence? “The collection of essays, along with the introduction, ___ available online.”',o:['are','were','is','have been'],a:2,e:'The subject is singular: collection.'},
    {id:'r13',s:'Reading & Writing',skill:'Standard English Conventions',d:2,q:'Which choice correctly punctuates the sentence?',o:['The experiment ended however the analysis continued.','The experiment ended; however, the analysis continued.','The experiment ended however, the analysis continued.','The experiment ended, however the analysis continued.'],a:1,e:'A semicolon can join independent clauses; however is followed by a comma.'},
    {id:'r14',s:'Reading & Writing',skill:'Information & Ideas',d:2,q:'A passage says a new battery design “maintained performance after 500 cycles.” What does this most directly suggest?',o:['The battery is inexpensive.','The battery retained performance through repeated use.','The battery charges instantly.','The battery contains no chemicals.'],a:1,e:'The statement directly concerns repeated-use durability.'},
    {id:'r15',s:'Reading & Writing',skill:'Craft & Structure',d:3,q:'If an author calls a result “counterintuitive,” the author most likely means it:',o:['matches expectations exactly','seems surprising at first','is impossible to measure','has no evidence'],a:1,e:'Counterintuitive means contrary to initial expectations.'}
  ];
  const bySkill={}; BANK.forEach(q=>(bySkill[q.skill]??=[]).push(q));
  function choose(pool, used, ability){
    const candidates=pool.filter(q=>!used.has(q.id)); if(!candidates.length)return null;
    let best=candidates[0],bestDiff=999;
    candidates.forEach(q=>{const diff=Math.abs(q.d-(ability+2)); if(diff<bestDiff){best=q;bestDiff=diff;}});
    return best;
  }
  function adaptiveDiagnostic(count=24){
    const used=new Set(),ability={Math:0,'Reading & Writing':0},out=[];
    const skills=Object.keys(bySkill);
    while(out.length<count){
      const section=out.filter(q=>q.s==='Math').length<=out.filter(q=>q.s==='Reading & Writing').length?'Math':'Reading & Writing';
      let targetSkills=skills.filter(k=>bySkill[k][0].s===section).sort((a,b)=>{
        const aa=out.filter(q=>q.skill===a),bb=out.filter(q=>q.skill===b); return aa.length-bb.length;
      });
      let skill=targetSkills[0];
      // After broad coverage, prioritize the weakest observed skill.
      const observed=targetSkills.filter(k=>out.some(q=>q.skill===k));
      if(observed.length && out.length>=8) skill=observed.sort((a,b)=>masteryFrom(out,a)-masteryFrom(out,b))[0];
      const q=choose(bySkill[skill],used,ability[section]);
      if(!q){const fallback=BANK.find(x=>x.s===section&&!used.has(x.id)); if(!fallback)break; out.push(fallback);used.add(fallback.id);continue;}
      out.push(q);used.add(q.id);
      // ability updated after response by runner; initial sequence approximates difficulty.
    }
    return out;
  }
  function masteryFrom(ans,skill){const a=ans.filter(x=>x.skill===skill);return a.length?a.filter(x=>x.correct).length/a.length:0.5;}
  function scoreSection(ans,section){
    const a=ans.filter(x=>x.s===section); if(!a.length)return 500;
    let ability=0; a.forEach(x=>{ability += x.correct ? (0.35 + x.d*0.08) : -(0.35 + (3-x.d)*0.04);});
    ability=Math.max(-2.5,Math.min(2.5,ability/a.length*3.2));
    return Math.round(200 + ((ability+2.5)/5)*600);
  }
  function analyze(answers){
    const map={}; answers.forEach(x=>{map[x.skill]??={correct:0,total:0};map[x.skill].total++;if(x.correct)map[x.skill].correct++;});
    const math=scoreSection(answers,'Math'),rw=scoreSection(answers,'Reading & Writing');
    return {math_score:Math.round(math/10)*10,rw_score:Math.round(rw/10)*10,total_score:Math.round((math+rw)/20)*10,skill_map:map,weak:Object.entries(map).map(([skill,v])=>({skill,pct:Math.round(v.correct/v.total*100)})).sort((a,b)=>a.pct-b.pct)};
  }
  window.EdNivoSAT={BANK,adaptiveDiagnostic,analyze,masteryFrom};
})();
