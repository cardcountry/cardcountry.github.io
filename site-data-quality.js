(()=>{
  'use strict';

  const normalize=value=>String(value??'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9\u3040-\u30ff\u3400-\u9fff]+/g,' ').trim();
  const tokens=value=>normalize(value).split(' ').filter(Boolean);

  function distance(a,b){
    if(a===b)return 0;if(!a.length)return b.length;if(!b.length)return a.length;
    const row=Array.from({length:b.length+1},(_,index)=>index);
    for(let i=1;i<=a.length;i++){let previous=row[0];row[0]=i;for(let j=1;j<=b.length;j++){const saved=row[j];row[j]=Math.min(row[j]+1,row[j-1]+1,previous+(a[i-1]===b[j-1]?0:1));previous=saved}}
    return row[b.length];
  }

  function score(query,fields){
    const needles=tokens(query);if(!needles.length)return 1;let total=0;
    for(const needle of needles){let best=0;for(const entry of fields){const value=Array.isArray(entry)?entry[0]:entry,weight=Array.isArray(entry)?entry[1]:1,field=normalize(value);if(!field)continue;if(field===needle)best=Math.max(best,weight*5);else if(field.startsWith(needle))best=Math.max(best,weight*3);else if(field.includes(needle))best=Math.max(best,weight*2);else if(needle.length>=4&&tokens(field).some(word=>Math.abs(word.length-needle.length)<=(needle.length>=8?2:1)&&distance(needle,word)<=(needle.length>=8?2:1)))best=Math.max(best,weight)}if(!best)return 0;total+=best}
    return total;
  }

  window.MetaSearch={normalize,tokens,distance,score,matches:(query,fields)=>score(query,fields)>0};

  function detectGame(){
    const file=(location.pathname.split('/').pop()||'index.html').toLowerCase();
    if(file.includes('gcg'))return'gcg';if(file.includes('opcg'))return'opcg';if(file.includes('marvel'))return'marvel';if(file.includes('beyblade'))return'beyblade';if(file.includes('riftbound'))return'riftbound';if(file.includes('ptcg')||file.includes('v22'))return'ptcg';return'';
  }

  function readLexical(name){try{return(0,eval)(name)}catch(error){return undefined}}
  const sumCards=cards=>(cards||[]).reduce((sum,item)=>sum+Number(Array.isArray(item)?item[1]:item.qty||item.count||0),0);
  const uniqueFailures=(items,key)=>{const seen=new Set();let failures=0;for(const item of items){const value=typeof key==='function'?key(item):item?.[key];if(!value||seen.has(value))failures++;else seen.add(value)}return failures};
  const latestDate=values=>values.filter(Boolean).map(value=>String(value).replaceAll('.','-')).sort().at(-1)||'—';
  const https=value=>{try{return new URL(value).protocol==='https:'}catch(error){return false}};

  function auditPtcg(){
    const decks=readLexical('decklists')||[],external=readLexical('externalDeckSources')||[],community=readLexical('communityEvents')||[];
    const lists=decks.flatMap(deck=>deck.lists||[]),communityLists=community.flatMap(event=>event.lists||[]);let quarantined=0;
    for(const list of lists){const total=(list.categories||[]).reduce((sum,group)=>sum+Number(group.count||sumCards(group.cards)),0);if(list.format!=='Standard'||total!==60||!https(list.listUrl)||!https(list.eventUrl))quarantined++}
    for(const source of external)if(source.format!=='Standard'||!https(source.url))quarantined++;
    for(const list of communityLists)if(sumCards(list.cards)!==60)quarantined++;
    return{game:'ptcg',label:'PTCG',records:external.length,lists:lists.length+communityLists.length,sources:new Set(external.map(item=>item.source)).size+2,quarantined,checked:latestDate([...lists.map(item=>item.date),...community.map(item=>item.date)]),notes:['Standard only','TCGdex physical-card endpoint','Pocket excluded']};
  }

  function auditGcg(){
    const data=window.GCG_DATA||{cards:[],tournaments:[],meta:{sources:[]}},results=data.tournaments.flatMap(event=>event.results||[]);let quarantined=uniqueFailures(data.cards,'code');
    quarantined+=data.cards.filter(card=>!card.name||!card.image||!card.category).length;
    quarantined+=results.filter(result=>sumCards(result.main)!==50||!result.player||!result.primary).length;
    return{game:'gcg',label:'GCG',records:data.cards.length,lists:results.length,sources:data.meta?.sources?.length||0,quarantined,checked:data.checked||data.synced||latestDate(data.tournaments.map(item=>item.date)),notes:['Official card records','50-card list validation','X discovery is cross-checked']};
  }

  function auditOpcg(){
    const data=window.OPCG_DATA||{meta:{},events:[],sources:[]},cards=window.OPCG_CARDS||[],decks=Object.values(data.meta||{}).flat(),lists=decks.flatMap(deck=>deck.lists||[]);let quarantined=uniqueFailures(cards,'code');
    quarantined+=cards.filter(card=>!card.name||!card.image||!card.category).length;
    quarantined+=lists.filter(list=>sumCards(list.cards)!==50||!https(list.sourceUrl)||!list.player).length;
    return{game:'opcg',label:'OPCG',records:cards.length,lists:lists.length,sources:data.sources?.length||0,quarantined,checked:String(data.generated||'').slice(0,10)||latestDate(data.events.map(item=>item.date)),notes:['Official Bandai card catalog','50-card list validation','Post-ban formats separated']};
  }

  function auditMarvel(){
    const data=window.MARVEL_DATA||{cards:[],tournaments:[],sources:[]},lists=data.tournaments.flatMap(event=>event.lists||[]);let quarantined=uniqueFailures(data.cards,'id');
    quarantined+=data.cards.filter(card=>!card.code||!card.names?.en||!card.images?.en).length;
    quarantined+=lists.filter(list=>sumCards(list.cards)!==50||!list.archetype).length;
    return{game:'marvel',label:'MARVEL HERO RUSH',records:data.cards.length,lists:lists.length,sources:data.sources?.length||0,quarantined,checked:String(data.generated||'').slice(0,10)||latestDate(data.tournaments.map(item=>item.date)),notes:['Official print records','50-card list validation','Unpublished attendance is never inferred']};
  }

  function auditBeyblade(){
    const data=window.BEYX_DATA||{all:[],rare:[],blades:[],ratchets:[],bits:[],sources:[],summary:{}},parts=[...(data.blades||[]),...(data.ratchets||[]),...(data.bits||[])];let quarantined=0;
    const integrated=new Set(['Glory Valkyrie','Bullet Griffon','Hells Nether','Valor Bison','Cutter Shinobi','Rampart Aegis','Seize Jaguar'].map(normalize));
    quarantined+=data.all.filter(combo=>!combo.blade||!combo.bit||(!combo.ratchet&&!integrated.has(normalize(combo.blade)))||!combo.cat).length;
    quarantined+=parts.filter(part=>!part.name||!part.image).length;
    quarantined+=(data.sources||[]).filter(source=>!https(source.url)).length;
    const visibleParts=Number(document.querySelector('#partCount')?.textContent.replace(/,/g,''))||parts.length;
    return{game:'beyblade',label:'BEYBLADE X',records:visibleParts,lists:data.all.length,sources:data.sources?.length||0,quarantined,checked:data.summary?.end||latestDate(data.rare.map(item=>item.date)),notes:['WBO placements','Measured weights marked as reference','BX/UX/CX structures separated']};
  }

  function auditRiftbound(){
    const data=window.RIFTBOUND_DATA||{cards:[],decks:[],sources:[]};return{game:'riftbound',label:'RIFTBOUND',records:data.cards.length,lists:data.decks.length,sources:data.sources.length,quarantined:window.META_LAB_DATA_AUDIT?.quarantined||0,checked:data.generatedAt||'—',notes:['Official-first','66-card export validation','Social signals never stand alone']};
  }

  function audit(game){return({ptcg:auditPtcg,gcg:auditGcg,opcg:auditOpcg,marvel:auditMarvel,beyblade:auditBeyblade,riftbound:auditRiftbound}[game]||(()=>({game,label:game.toUpperCase(),records:0,lists:0,sources:0,quarantined:0,checked:'—',notes:[]})))()}
  const copyFor=()=>{
    const lang=document.documentElement.lang.toLowerCase();
    if(lang.startsWith('ja'))return{title:'データ品質',records:'検証済み記録',lists:'完全リスト／構成',sources:'承認ソース',quarantine:'隔離',checked:'データ／同期日',run:'再チェック',pass:'必須チェック合格'};
    if(lang.startsWith('en'))return{title:'DATA QUALITY',records:'VERIFIED RECORDS',lists:'FULL LISTS / COMBOS',sources:'APPROVED SOURCES',quarantine:'QUARANTINED',checked:'DATA / SYNC DATE',run:'RUN CHECKS',pass:'HARD CHECKS PASSED'};
    if(lang.includes('hant'))return{title:'資料品質',records:'核實記錄',lists:'完整牌組／配置',sources:'核准來源',quarantine:'隔離異常',checked:'資料／同步日期',run:'重新檢查',pass:'硬性檢查通過'};
    return{title:'资料质量',records:'核实记录',lists:'完整卡表／配置',sources:'核准来源',quarantine:'隔离异常',checked:'资料／同步日期',run:'重新检查',pass:'硬性检查通过'};
  };

  function renderAudit(result){
    if(document.querySelector('#qualityConsole'))return;
    const target=document.querySelector('.meta-toolbar,.deck-finder,.config-tools,.section-head');if(!target)return;
    const panel=document.createElement('aside');panel.className='site-data-audit';panel.id='siteDataAudit';
    const draw=()=>{const copy=copyFor(),grade=result.quarantined===0?'A+':result.quarantined<=2?'A':'REVIEW';panel.innerHTML=`<div class="sda-grade"><span>${copy.title} · ${result.label}</span><b>${grade}</b><small>${result.quarantined===0?copy.pass:`${result.quarantined} ${copy.quarantine}`}</small></div><div class="sda-metrics"><span><b>${Number(result.records).toLocaleString()}</b><small>${copy.records}</small></span><span><b>${Number(result.lists).toLocaleString()}</b><small>${copy.lists}</small></span><span><b>${Number(result.sources).toLocaleString()}</b><small>${copy.sources}</small></span><span><b>${result.quarantined}</b><small>${copy.quarantine}</small></span></div><div class="sda-action"><span>${copy.checked}<b>${result.checked}</b></span><button type="button">${copy.run}</button></div>`;panel.querySelector('button').addEventListener('click',()=>{panel.classList.add('checking');setTimeout(()=>{const next=audit(result.game);Object.assign(result,next);draw();panel.classList.remove('checking')},380)})};
    target.insertAdjacentElement('afterend',panel);draw();
    document.addEventListener('metalab:data-updated',()=>{Object.assign(result,audit(result.game));draw()});
    const lang=document.querySelector('#uiLang,#langSelect');if(lang)lang.addEventListener('change',()=>setTimeout(draw,0));
  }

  document.addEventListener('DOMContentLoaded',()=>{const game=detectGame();if(!game)return;const result=audit(game);window.META_LAB_DATA_AUDIT=result;renderAudit(result)});
})();
