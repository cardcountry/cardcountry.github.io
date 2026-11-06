/* On-demand PTCG deck composition. TCGdex is used only when a source list lacks stage/trainer subtype. */
(()=>{
  'use strict';
  const cache=new Map(),storageKey='metalab-ptcg-composition-v3';
  const pending=new Map();
  const labels={supporter:'Supporter',stage1:'Stage 1',stage2:'Stage 2',basic:'Basic',energy:'Energy',item:'Item',tool:'Tool',stadium:'Stadium'};
  const order=['supporter','stage1','stage2','basic','energy','item','tool','stadium'];
  // TCGdex-verified on 2026-11-06 for every unique card number in the 15 current Dragapult lists.
  // Keeping these classifications local prevents a transient API failure from producing a 59/60 result.
  const verifiedByCode={
    'ASC-142':'basic','ASC-16':'basic','ASC-196':'item','ASC-39':'basic','ASC-46':'basic',
    'CRI-70':'basic','CRI-82':'item','DRI-10':'basic','DRI-180':'stadium','DRI-40':'basic','DRI-41':'stage1',
    'JTG-120':'basic','JTG-121':'stage1','JTG-24':'stage2','JTG-56':'basic',
    'MEE-10':'energy','MEE-13':'energy','MEE-15':'energy','MEG-114':'supporter','MEG-119':'supporter',
    'MEG-125':'item','MEG-127':'stadium','MEG-131':'item','MEG-88':'basic','PFL-14':'basic','PFL-87':'supporter',
    'POR-62':'basic','POR-71':'item','POR-76':'supporter','POR-81':'item','POR-84':'supporter',
    'PRE-35':'basic','PRE-36':'stage1','PRE-37':'stage2','SCR-131':'stadium','SCR-133':'supporter',
    'TEF-128':'basic','TEF-129':'stage1','TEF-144':'item','TEF-152':'tool',
    'TWM-128':'basic','TWM-129':'stage1','TWM-130':'stage2','TWM-165':'item','TWM-39':'basic','TWM-53':'stage1','TWM-95':'basic'
  };
  const locale=()=>{
    const lang=(document.documentElement.lang||'zh-Hans').toLowerCase();
    if(lang.startsWith('ja'))return {title:'デッキ構成',loading:'カード分類を確認中…',checked:'枚を分類済み',pending:'枚は未確認'};
    if(lang.startsWith('en'))return {title:'Deck composition',loading:'Checking card classifications…',checked:'copies classified',pending:'copies pending'};
    if(lang.includes('hant'))return {title:'牌組構成',loading:'正在核對卡牌分類…',checked:'張已分類',pending:'張待核對'};
    return {title:'卡组构成',loading:'正在核对卡牌分类…',checked:'张已分类',pending:'张待核对'};
  };
  const text=value=>String(value??'').trim();
  const numberPart=value=>(text(value).match(/(?:^|[- ])0*(\d+)(?:\/\d+)?$/)||[])[1]||'';
  const isJapanese=value=>/[\u3040-\u30ff\u3400-\u9fff]/.test(text(value));
  try{Object.entries(JSON.parse(localStorage.getItem(storageKey)||'{}')).forEach(([key,value])=>{if(value&&value!=='unknown')cache.set(key,value)})}catch(error){}
  function remember(key,value){
    if(!value||value==='unknown')return value||'unknown';
    cache.set(key,value);
    try{localStorage.setItem(storageKey,JSON.stringify(Object.fromEntries(cache)))}catch(error){}
    return value;
  }
  function verifiedCode(card){
    const raw=text(card.code||`${card.set||''}-${card.no||''}`).toUpperCase(),match=raw.match(/^([A-Z0-9.]+)-0*(\d+)/);
    return match?verifiedByCode[`${match[1]}-${Number(match[2])}`]||'':'';
  }
  function directClass(card){
    const local=window.PTCG_CARD_TYPES?.byKey?.[`${card.name}|${card.set||''}|${card.no||''}`];
    if(local?.kind)return local.kind;
    const verified=verifiedCode(card);if(verified)return verified;
    const category=text(card.category||card.deckCategory).toLowerCase();
    const stage=text(card.stage).toLowerCase().replace(/[\s_-]/g,'');
    const trainer=text(card.trainerType).toLowerCase();
    if(category.includes('エネルギー')||/^energy\b/.test(category)||category.includes(' energy'))return'energy';
    if(category.includes('サポート')||/^supporter\b/.test(category)||category.includes(' supporter')||trainer.includes('supporter'))return'supporter';
    if(category.includes('ポケモンのどうぐ')||category.includes('pokemon tool')||category.includes('pokémon tool')||/^tool\b/.test(category)||trainer==='tool')return'tool';
    if(category.includes('グッズ')||/^item\b/.test(category)||category.includes(' item')||trainer==='item')return'item';
    if(category.includes('スタジアム')||/^stadium\b/.test(category)||trainer==='stadium')return'stadium';
    if(stage==='basic'||stage==='たね')return'basic';
    if(stage==='stage1'||stage==='1進化'||stage==='1进化')return'stage1';
    if(stage==='stage2'||stage==='2進化'||stage==='2进化')return'stage2';
    return'';
  }
  async function fetchJson(url){
    let lastError;
    for(let attempt=0;attempt<2;attempt++){
      try{const response=await fetch(url);if(!response.ok)throw new Error(`HTTP ${response.status}`);return await response.json()}
      catch(error){lastError=error;if(attempt===0)await new Promise(resolve=>setTimeout(resolve,250))}
    }
    throw lastError;
  }
  function detailClass(detail){
    const known=directClass(detail);if(known)return known;
    const category=text(detail?.category).toLowerCase();
    const trainer=text(detail?.trainerType).toLowerCase();
    const stage=text(detail?.stage).toLowerCase().replace(/[\s_-]/g,'');
    if(category.includes('energy')||category.includes('エネルギー'))return'energy';
    if(category.includes('trainer')||category.includes('トレーナー')){
      if(trainer.includes('supporter'))return'supporter';
      if(trainer.includes('tool'))return'tool';
      if(trainer.includes('item'))return'item';
      if(trainer.includes('stadium'))return'stadium';
      return'unknown';
    }
    if(category.includes('pokemon')||category.includes('pokémon')||category.includes('ポケモン')){
      if(stage==='basic'||stage==='たね')return'basic';
      if(stage==='stage1'||stage==='1進化'||stage==='1进化')return'stage1';
      if(stage==='stage2'||stage==='2進化'||stage==='2进化')return'stage2';
      return'other';
    }
    return'unknown';
  }
  async function remoteClass(card){
    const direct=directClass(card);if(direct)return direct;
    const name=text(card.name),code=text(card.code||`${card.set||''}-${card.no||''}`),lang=isJapanese(name)?'ja':'en',key=`${lang}|${name}|${code}`;
    if(cache.has(key))return cache.get(key);
    if(pending.has(key))return pending.get(key);
    const request=(async()=>{
      try{
        const params=new URLSearchParams({name,'pagination:page':1,'pagination:itemsPerPage':100});
        const found=(await fetchJson(`https://api.tcgdex.net/v2/${lang}/cards?${params}`)).filter(item=>item?.id&&String(item.image||'').startsWith('https://assets.tcgdex.net/')&&!/\/tcgp\//i.test(String(item.image)));
        const exact=found.filter(item=>text(item.name).toLowerCase()===name.toLowerCase()),local=numberPart(card.no||code);
        const selected=exact.find(item=>local&&String(item.localId).replace(/^0+/,'')===local)||exact[0];
        if(!selected)throw new Error('CARD_NOT_FOUND');
        const result=detailClass(await fetchJson(`https://api.tcgdex.net/v2/${lang}/cards/${encodeURIComponent(selected.id)}`));return remember(key,result);
      }catch(error){return'unknown'}finally{pending.delete(key)}
    })();
    pending.set(key,request);return request;
  }
  async function mapLimit(items,limit,worker){
    const output=new Array(items.length);let cursor=0;
    const run=async()=>{while(cursor<items.length){const index=cursor++;output[index]=await worker(items[index],index)}};
    await Promise.all(Array.from({length:Math.min(limit,items.length)},run));return output;
  }
  function markup(stats,total,resolved,unknown){
    const t=locale(),status=unknown?`${resolved}/${total} ${t.checked} · ${unknown} ${t.pending}`:`${resolved}/${total} ${t.checked}`;
    return `<div class="composition-head"><b>${t.title}</b><span>${status}</span></div><div class="composition-grid">${order.map(key=>`<div class="composition-stat"><span>${labels[key]}</span><b>${stats[key]||0}</b></div>`).join('')}</div>`;
  }
  async function render(cards,target){
    const element=typeof target==='string'?document.getElementById(target):target;if(!element)return;
    const requestId=String(Date.now()+Math.random());element.dataset.requestId=requestId;element.classList.remove('hidden');
    const t=locale(),normalized=(cards||[]).map(card=>({...card,qty:Number(card.qty)||0})).filter(card=>card.qty>0),total=normalized.reduce((sum,card)=>sum+card.qty,0);
    element.innerHTML=`<div class="composition-head"><b>${t.title}</b><span>${t.loading}</span></div><div class="composition-grid composition-loading">${order.map(key=>`<div class="composition-stat"><span>${labels[key]}</span><b>…</b></div>`).join('')}</div>`;
    const kinds=await mapLimit(normalized,6,remoteClass);if(element.dataset.requestId!==requestId)return;
    const stats=Object.fromEntries(order.map(key=>[key,0]));let resolved=0,unknown=0;
    kinds.forEach((kind,index)=>{const qty=normalized[index].qty;if(kind==='unknown'){unknown+=qty;return}resolved+=qty;if(Object.hasOwn(stats,kind))stats[kind]+=qty});
    element.innerHTML=markup(stats,total,resolved,unknown);
  }
  window.PTCGComposition={render};
})();
