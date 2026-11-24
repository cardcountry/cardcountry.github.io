import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

// This indexes reviewed local data and separately verified collector output.
// It does not fetch sources itself or turn maintenance dates into publication dates.
// Set METALAB_FEED_DATE explicitly to the client's YYYY-MM-DD for every run.
// PowerShell example: $env:METALAB_FEED_DATE='2026-11-08'; node data-pipeline/build-activity-feed.mjs
// Never infer the maintenance date from the execution host's timezone.
const site = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const work = process.env.METALAB_FEED_REPORT_DIR
  ? path.resolve(process.env.METALAB_FEED_REPORT_DIR)
  : path.resolve(site, '../work/aggregation-20261108');
const builtOn = process.env.METALAB_FEED_DATE;
const output = path.join(site, 'activity-feed.json');
const games = [
  { id:'ptcg', name:'Pokémon TCG', page:'ptcg.html' },
  { id:'gcg', name:'GUNDAM CARD GAME', page:'gcg.html' },
  { id:'opcg', name:'ONE PIECE CARD GAME', page:'opcg.html' },
  { id:'unionarena', name:'UNION ARENA', page:'unionarena.html' },
  { id:'riftbound', name:'RIFTBOUND', page:'riftbound.html' },
  { id:'marvel', name:'MARVEL HERO RUSH', page:'marvel.html' },
  { id:'beyblade', name:'BEYBLADE X', page:'beyblade.html' }
];
const types = new Set(['news','product','rules','event','deck','meta']);
const langMap = { Japanese:'ja', English:'en', Thai:'th', 'Traditional Chinese':'zh-TW', 'Simplified Chinese':'zh-CN', jp:'ja', ja:'ja', en:'en', th:'th', tw:'zh-TW', 'zh-tw':'zh-TW', 'zh-cn':'zh-CN', 'zh-TW':'zh-TW', 'zh-CN':'zh-CN', 'zh-Hant':'zh-TW', 'zh-Hans':'zh-CN', 'asia-en':'en' };
const normalizeLanguage = value => langMap[value] || 'unknown';
const date = value => {
  if (!value || typeof value !== 'string') return null;
  let m = value.match(/^(\d{4})[.\/-](\d{1,2})[.\/-](\d{1,2})(?:T.*)?$/);
  if (!m) { const us = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/); if (us) m = [us[0],us[3],us[1],us[2]]; }
  if (!m) return null;
  const s = `${m[1]}-${m[2].padStart(2,'0')}-${m[3].padStart(2,'0')}`;
  return Number.isNaN(Date.parse(s)) || new Date(s).toISOString().slice(0,10)!==s ? null : s;
};
if (!builtOn || date(builtOn)!==builtOn) throw new Error('Set METALAB_FEED_DATE explicitly to the client date in YYYY-MM-DD format; no host-timezone default is used.');
const canonical = value => {
  try {
    const u = new URL(value);
    if (u.protocol !== 'https:') return null;
    u.hash = '';
    for (const key of [...u.searchParams.keys()]) if (/^(utm_|fbclid$|gclid$)/i.test(key)) u.searchParams.delete(key);
    u.searchParams.sort();
    return u.href;
  } catch { return null; }
};
// Card edition and source-page language are independent. Only explicit source
// metadata, known localized pages, or a reviewed exact social URL establish the
// source language. A Japanese deck on an English database is still an English
// source; a social profile and a language-selectable recipe page stay unknown.
function sourceLanguageOf(value, explicit) {
  const stated = normalizeLanguage(explicit);
  if (stated !== 'unknown') return stated;
  const url = canonical(value);
  if (!url) return 'unknown';
  if (url === 'https://x.com/AYAKANA_1124/status/2117519511616409927') return 'ja';
  const {hostname,pathname} = new URL(url);
  if (['limitlesstcg.com','onepiece.limitlesstcg.com','onepiecetopdecks.com'].includes(hostname)) return 'en';
  if (['www.pokemon-card.com','players.pokemon-card.com'].includes(hostname)) return 'ja';
  if (hostname === 'asia.pokemon-card.com' && pathname.startsWith('/tw/')) return 'zh-TW';
  if (hostname === 'www.unionarena-tcg.com') {
    if (pathname.startsWith('/jp/')) return 'ja';
    if (pathname.startsWith('/na/')) return 'en';
    if (pathname.startsWith('/tc/')) return 'zh-TW';
  }
  return 'unknown';
}
const previous = fs.existsSync(output) ? JSON.parse(fs.readFileSync(output,'utf8')) : {items:[]};
const oldById = new Map((previous.items||[]).map(x=>[x.id,x]));
const firstCollectedFile=path.join(site,'data-pipeline/feed-first-collected.json');
const firstCollected=new Map(Object.entries(fs.existsSync(firstCollectedFile)?JSON.parse(fs.readFileSync(firstCollectedFile,'utf8')).firstCollectedOn||{}:{}));
const history=process.env.METALAB_FEED_PREVIOUS?JSON.parse(fs.readFileSync(process.env.METALAB_FEED_PREVIOUS,'utf8')):{items:[]};
for(const item of [...(previous.items||[]),...(history.items||[])]){const known=date(item.firstCollectedOn),saved=firstCollected.get(item.id);if(known&&(!saved||known<saved))firstCollected.set(item.id,known);}
const context = {window:{}};
vm.createContext(context);
const inputFiles = ['decks-data.js','community-data.js','ptcg-visual-data.js','ptcg-jp-recent.js','ptcg-tw-public.js','ptcg-jp-increment.js','gcg-data.js','gcg-jp-recent.js','gcg-preview-increment.js','gcg-event-increment.js','gcg-official-decks.js','gcg-auto-events.js','opcg-data.js','opcg-recent-data.js','opcg-photo-data.js','opcg-eb05-jp.js','opcg-eb05-increment.js','opcg-image-cache.js','opcg-op18-cards.js','opcg-op18-jp.js','unionarena-data.js','unionarena-recipes.js','unionarena-jp-decks.js','unionarena-recommended.js','riftbound-data.js','marvel-data.js','beyblade-data.js'];
for (const file of inputFiles) {
  const source=path.join(site,file);
  // Bootstrap is safe before the collector has produced its first GCG increment.
  if(file==='gcg-auto-events.js'&&!fs.existsSync(source))continue;
  vm.runInContext(fs.readFileSync(source,'utf8'),context,{filename:file,timeout:10000});
}
const data = context.window;
const records = new Map(), pending = [], duplicates = [], curatedIds = new Set();
const sectionContext={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(site,'section-map.js'),'utf8'),sectionContext);
const sections=sectionContext.window.METALAB_SECTIONS.games;
const manifest=JSON.parse(fs.readFileSync(path.join(site,'section-pages-manifest.json'),'utf8'));
const htmlIds = new Map(manifest.pages.map(p=>[p.path,new Set([...fs.readFileSync(path.join(site,p.path),'utf8').matchAll(/\bid=["']([^"']+)["']/g)].map(x=>x[1]))]));
function internalDestination(game,requested){
  let [page,anchor]=String(requested||game.page).split('#');
  // Preserve old source adapters while publishing direct links to the new
  // physical topic documents. Validate against the real generated documents.
  if(page===game.page&&anchor){
    const topic=anchor==='usage-ranking'?'usage':Object.entries(sections[game.id].roots).find(([,roots])=>roots.includes(anchor))?.[0];
    if(topic){page=`${game.id}-${topic}.html`;if(topic==='usage')anchor=undefined;}
  }
  if(!manifest.pages.some(p=>p.path===page&&p.game===game.id&&p.view!=='compatibility')||
     (anchor&&!htmlIds.get(page)?.has(anchor)))throw new Error(`Unknown internal destination ${requested}`);
  return page+(anchor?'#'+anchor:'');
}
function add(input, semantic='') {
  const game = games.find(g=>g.id===input.game);
  const sourceUrl = canonical(input.sourceUrl);
  if (!game || !types.has(input.type) || !sourceUrl || !input.title || input.status==='pending') { pending.push({game:input.game,title:input.title,reason:'Missing public source, title, supported game/type, or pending verification'}); return; }
  const internalUrl = internalDestination(game,input.internalUrl);
  const identity = `${input.game}|${input.type}|${sourceUrl}|${semantic}`;
  const id = `${input.game}-${crypto.createHash('sha256').update(identity).digest('hex').slice(0,16)}`;
  const publishedOn = date(input.publishedOn), sourceUpdatedOn = date(input.sourceUpdatedOn), eventOn = date(input.eventOn), verifiedOn = date(input.verifiedOn);
  const record = {
    ...input,id,sourceUrl,sourceName:input.sourceName||new URL(sourceUrl).hostname,
    sourceLanguage:normalizeLanguage(input.sourceLanguage),printEdition:normalizeLanguage(input.printEdition),
    publishedOn,sourceUpdatedOn,eventOn,availableOn:date(input.availableOn),
    firstCollectedOn:date(firstCollected.get(id))||date(oldById.get(id)?.firstCollectedOn)||builtOn,
    verifiedOn,status:input.status==='verified'&&verifiedOn?'verified':'indexed',
    internalUrl,format:input.format||'unknown',region:input.region||'unknown',
    aliases:[...new Set(input.aliases||[])].filter(x=>typeof x==='string'&&x)
  };
  if (publishedOn && publishedOn>builtOn) throw new Error(`Future publication date: ${record.title}`);
  if (sourceUpdatedOn && sourceUpdatedOn>builtOn) throw new Error(`Future source update date: ${record.title}`);
  if (verifiedOn && verifiedOn>builtOn) throw new Error(`Future verification date: ${record.title}`);
  if (records.has(id)) { duplicates.push({id,title:record.title}); if(records.get(id).status==='verified')return id; }
  records.set(id,record);
  return id;
}
const sum = (entries,field='qty') => (entries||[]).reduce((n,x)=>n+(Number(x[field])||0),0);
const decklists = vm.runInContext('decklists',context);
for (const group of decklists) for (const list of group.lists||[]) {
  const total = (list.categories||[]).reduce((n,c)=>n+sum(c.cards),0);
  if (total!==60) { pending.push({game:'ptcg',title:list.event,reason:`Incomplete list total ${total}`});continue; }
  const publicBuild = list.listId?.startsWith('tw-public-');
  add({game:'ptcg',type:'deck',title:`${group.name} · ${list.player||list.place||'公开构筑'}`,
    summary:`${list.event}；${publicBuild?'完整公开构筑，原页未声明比赛成绩':`${list.place||'未注明名次'}${list.players?'；'+list.players+' 人':''}`}；60 张。`,
    sourceUrl:list.listUrl,sourceName:list.sourceLabel||'Limitless TCG',
    sourceLanguage:sourceLanguageOf(list.listUrl,list.sourceLanguage),printEdition:list.language,
    publishedOn:null,...((list.publishedOn||list.sourceUpdatedOn)?{publishedOn:date(list.publishedOn),sourceUpdatedOn:date(list.sourceUpdatedOn)}:{}),eventOn:publicBuild?null:date(list.date),verifiedOn:list.checked,
    status:list.checked?'verified':'indexed',internalUrl:'ptcg.html#meta',format:list.format||'Standard',
    region:list.region||'International',aliases:[group.name,group.key,list.variant||'',...(list.searchAliases||[])],resultSourceUrl:list.eventUrl},list.listId||list.player||'');
}
for (const event of data.GCG_DATA.tournaments||[]) {
  const complete = (event.results||[]).filter(r=>Array.isArray(r.main)&&r.main.reduce((n,x)=>n+Number(x[1]||0),0)===50);
  if (!complete.length) {pending.push({game:'gcg',title:event.name,reason:'No complete 50-card list'});continue;}
  add({game:'gcg',type:'event',title:event.name,
    summary:`${event.players?event.players+' 人；':''}${complete.length} 份完整 50 张赛事卡表；${event.venue||event.region||'地区未注明'}。`,
    sourceUrl:event.sourceUrl,sourceName:event.sourceUrl?.includes('gcg-stats')?'GCG STATS':'Egman Events',
    sourceLanguage:sourceLanguageOf(event.sourceUrl,event.sourceLanguage),printEdition:event.printLanguage??event.language,eventOn:event.date,publishedOn:null,verifiedOn:event.checked,
    status:event.checked?'verified':'indexed',internalUrl:'gcg.html#meta',format:event.format,region:event.region,
    listCount:complete.length,aliases:[event.venue||'',event.setGroup||'']},event.id);
}
// Regional explanations of the same official recipe are one feed entry. Every
// regional source remains visible, and source language is not print language.
const officialGroups = new Map();
for (const r of data.GCG_OFFICIAL_DECKS.records||[]) {
  if(sum(r.entries)!==50){pending.push({game:'gcg',title:r.title,reason:'Official recipe does not total 50'});continue;}
  const key = `${r.fingerprint}|${r.format}`;
  if(!officialGroups.has(key))officialGroups.set(key,[]);
  officialGroups.get(key).push(r);
}
for (const [key,list] of officialGroups) {
  const r = list.find(x=>x.sourceLocale==='jp')||list[0];
  add({game:'gcg',type:'deck',title:r.title,summary:`官方完整 50 张配方；${list.length} 种地区／解说语言来源，卡图印刷版本为 ${r.edition}。`,
    sourceUrl:r.sourceUrl,sourceName:'GUNDAM CARD GAME Official',sourceLanguage:r.sourceLocale,printEdition:r.edition,
    publishedOn:r.date,eventOn:null,verifiedOn:r.checked,status:'verified',internalUrl:'gcg.html#official-decks',
    format:r.format,region:'Japan / Asia',aliases:list.map(x=>x.title),
    alternateSources:list.map(x=>({url:x.sourceUrl,language:normalizeLanguage(x.sourceLocale),label:x.sourceLocaleLabel,publishedOn:date(x.date)}))},key);
}
for (const [format,groups] of Object.entries(data.OPCG_DATA.meta||{})) if(Array.isArray(groups)) for(const group of groups) for(const list of group.lists||[]) {
  if(sum(list.cards)!==50){pending.push({game:'opcg',title:list.event,reason:'Incomplete 50-card list'});continue;}
  add({game:'opcg',type:'deck',title:`${group.name} · ${list.player||list.placement||'公开卡表'}`,
    summary:`${list.event||'赛事未注明'}${list.host?' · '+list.host:''}；${list.placement||'成绩未注明'}；50 张＋领袖。`,
    sourceUrl:list.sourceUrl,sourceName:list.source,sourceLanguage:sourceLanguageOf(list.sourceUrl,list.sourceLanguage),printEdition:list.printLanguage??list.language,
    publishedOn:null,eventOn:list.date,verifiedOn:list.checked,status:list.checked?'verified':'indexed',
    internalUrl:'opcg.html#meta',format:list.format||format,region:list.region||list.country||'unknown',
    aliases:[group.name,group.leader||'',list.archetype||'']},list.id||list.player||'');
}
for(const deck of data.UNION_ARENA_DATA.eventDecks||[]) {
  if(deck.composition?.total!==50){pending.push({game:'unionarena',title:deck.event,reason:'No verified complete 50-card composition'});continue;}
  add({game:'unionarena',type:'deck',title:`${deck.series} · ${deck.place}`,summary:`${deck.event}；${deck.colour}；完整 50 张。成绩按原页记录。`,
    sourceUrl:deck.recipe,sourceName:'UNION ARENA Official / TCG+',sourceLanguage:sourceLanguageOf(deck.recipe,deck.sourceLanguage),printEdition:deck.language,
    publishedOn:deck.revealed,eventOn:null,verifiedOn:deck.checked||data.UNION_ARENA_DATA.checked,status:'verified',
    internalUrl:'unionarena.html#decks',format:'unknown',region:deck.region||'North America',
    aliases:[deck.series,deck.event],resultSourceUrl:deck.source,
    alternateSources:deck.source?[{url:deck.source,language:sourceLanguageOf(deck.source),label:'Official event results',publishedOn:date(deck.revealed)}]:[]},`${deck.event}|${deck.place}`);
}
// Complete official examples are discoverable but never tournament usage samples.
for(const deck of data.UA_OFFICIAL_RECOMMENDED?.records||[]) {
  if(deck.composition?.total!==50){pending.push({game:'unionarena',title:deck.series,reason:'Incomplete official recommendation'});continue;}
  add({game:'unionarena',type:'deck',title:deck.series+' · 官方推荐构筑',summary:deck.colour+'；完整50张官方示例，非赛事成绩，不计入赛事使用率。',
    sourceUrl:deck.recipe,sourceName:'UNION ARENA Official / TCG+',sourceLanguage:sourceLanguageOf(deck.recipe),printEdition:deck.printLanguage,
    publishedOn:deck.publishedOn,sourceUpdatedOn:deck.sourceUpdatedOn,eventOn:null,verifiedOn:deck.checked,status:'verified',
    internalUrl:'unionarena-decks.html',format:'Official recommended build',region:deck.region,competitive:false,usageEligible:false,
    aliases:[deck.series,...deck.cards.map(c=>c.name)],alternateSources:[{url:deck.sourceUrl,language:sourceLanguageOf(deck.sourceUrl,deck.sourceLanguage),label:'Official recommended builds',publishedOn:date(deck.publishedOn),sourceUpdatedOn:date(deck.sourceUpdatedOn)}]},deck.deckCode);
}
for(const deck of data.RIFTBOUND_DATA.decks||[]) {
  const official=new URL(deck.source).hostname==='playriftbound.com';
  const verifiedOn=deck.verifiedOn||deck.checked||null;
  add({game:'riftbound',type:'deck',title:`${deck.legend} · ${deck.player}`,summary:`${deck.event}；${deck.placement}；${deck.total} 张（包含来源记录的传奇、符文、战场与备牌）。`,
    sourceUrl:deck.source,sourceName:deck.sourceName||(official?'Riftbound 官方网站':'Riftdecks'),sourceLanguage:deck.sourceLanguage||'en',printEdition:deck.printLanguage,
    publishedOn:deck.publishedOn||null,eventOn:deck.date,verifiedOn,status:verifiedOn?'verified':'indexed',
    internalUrl:'riftbound.html#meta',format:deck.format||'Radiance · Constructed',region:deck.region||'unknown',aliases:[deck.legend,...(deck.domains||[])]},deck.id);
}
// These legacy aggregates lack per-event original URLs. Keep one plainly scoped
// index record, without inventing a publication date or a verification date.
const marvelEvents=data.MARVEL_DATA.tournaments||[];
add({game:'marvel',type:'meta',title:'MARVEL HERO RUSH · 已收录赛事卡表索引',
  summary:`${marvelEvents.length} 场赛事、${marvelEvents.reduce((n,e)=>n+(e.lists?.length||0),0)} 份卡表。来源链接为汇总入口；缺逐赛事原帖链接，不能据此声称最新或已逐项复核。`,
  sourceUrl:data.MARVEL_DATA.sources.find(s=>s.name==='MHR Deck Lab')?.url,sourceName:'MHR Deck Lab',sourceLanguage:'en',
  sourceScope:'collection',publishedOn:null,eventOn:null,verifiedOn:null,status:'indexed',internalUrl:'marvel.html#events',
  format:'unknown',region:'Multiple',coverageThrough:marvelEvents.map(e=>date(e.date)).filter(Boolean).sort().at(-1)||null});
add({game:'beyblade',type:'meta',title:'BEYBLADE X · 已收录赛事配置与零件',
  summary:`${data.BEYX_DATA.all.length} 种配置，统计覆盖 ${data.BEYX_DATA.summary.start} 至 ${data.BEYX_DATA.summary.end}。来源链接为汇总入口；配置记录缺逐场原帖链接，覆盖截止日不是发布日。`,
  sourceUrl:data.BEYX_DATA.sources.find(s=>s.name==='BBX Vault')?.url,sourceName:'BBX Vault / WBO',sourceLanguage:'en',
  sourceScope:'collection',publishedOn:null,eventOn:null,verifiedOn:null,status:'indexed',internalUrl:'beyblade.html#configs',
  format:'BEYBLADE X',region:'Multiple',coverageThrough:date(data.BEYX_DATA.summary.end)});

const curatedPath=path.join(site,'data-pipeline/activity-curated.json');
let curatedCount=0;
if(fs.existsSync(curatedPath)) {
  const curated=JSON.parse(fs.readFileSync(curatedPath,'utf8'));
  const inputs=Array.isArray(curated)?curated:curated.items;
  if(!Array.isArray(inputs))throw new Error('activity-curated.json must be an array or {items:[]}');
  for(const r of inputs) {
    if(r.status!=='verified'||!date(r.verifiedOn)){pending.push({game:r.game,title:r.title,reason:'Curated item needs explicit verified status and date'});continue;}
    const id=add(r,r.semanticKey||'');if(id)curatedIds.add(id);curatedCount++;
  }
}
// Automatic collection is a separate, append-only catalog; manual reviewed
// records always win for the same public page. Deck/event semantic keys retain
// their per-list identity rather than collapsing several results on one URL.
const autoPath=path.join(site,'data-pipeline/auto/approved.json'),autoIds=new Set();
const manualIds=new Set(records.keys());
const manualByPage=new Map();
for(const record of records.values()){if(record.type==='deck'||record.sourceScope==='collection')continue;const key=record.game+'|'+record.sourceUrl,list=manualByPage.get(key)||[];manualByPage.set(key,list.concat(record));}
// A verified index title can enrich search aliases without changing editorial facts.
function enrichManualAliases(input,url){
  if(input.ingestEvidence?.verification!=='official-index'||typeof input.title!=='string'||!input.title.trim()||input.title.length>400)return;
  if([input.publishedOn,input.sourceUpdatedOn,input.verifiedOn].some(value=>value&&(!date(value)||date(value)>builtOn)))return;
  for(const record of manualByPage.get(input.game+'|'+url)||[]){if(input.title===record.title||input.title===record.originalTitle)continue;record.aliases=[...new Set([...(record.aliases||[]),input.title])];}
}
const manualPages=new Map();
for(const record of records.values()){if(['deck','event'].includes(record.type))continue;const key=record.game+'|'+record.sourceUrl,dates=manualPages.get(key)||[];manualPages.set(key,dates.concat([record.publishedOn,record.sourceUpdatedOn].filter(Boolean)));}
const autoPages=new Set();let automaticCount=0,automaticSkipped=0;
if(fs.existsSync(autoPath)){
  const approved=JSON.parse(fs.readFileSync(autoPath,'utf8'));
  if(approved.schemaVersion!==1||!Array.isArray(approved.items))throw Error('Automatic catalog must be schemaVersion1 and items[]');
  for(const r of approved.items){
    const e=r?.ingestEvidence,url=canonical(r?.sourceUrl);let safeSource=false;
    try{const u=new URL(r.sourceUrl);safeSource=u.protocol==='https:'&&!u.username&&!u.password;}catch{}
    const validEvidence=e&&e.schemaVersion===1&&typeof e.sourceId==='string'&&e.sourceId.trim()&&
      canonical(e.sourceUrl)===url&&typeof e.evidenceUrl==='string'&&canonical(e.evidenceUrl)&&!new URL(e.evidenceUrl).username&&!new URL(e.evidenceUrl).password&&typeof e.adapter==='string'&&e.adapter.trim()&&
      typeof e.fetchedAt==='string'&&/^\d{4}-\d{2}-\d{2}T/.test(e.fetchedAt)&&!Number.isNaN(Date.parse(e.fetchedAt))&&
      typeof e.contentSha256==='string'&&/^[a-f0-9]{64}$/i.test(e.contentSha256)&&
      ['official-index','complete-deck'].includes(e.verification);
    if(r?.status!=='verified'||!date(r?.verifiedOn)||!safeSource||!url||!validEvidence){
      pending.push({game:r?.game,title:r?.title,reason:'Automatic item needs verified status/date and complete matching ingest evidence'});continue;
    }
    const pageKey=r.game+'|'+url,semantic=['deck','event'].includes(r.type);
    if(!semantic&&autoPages.has(pageKey)){automaticSkipped++;continue;}
    if(!semantic&&manualPages.has(pageKey)){
      const latestManual=manualPages.get(pageKey).sort().at(-1),automaticDate=[date(r.publishedOn),date(r.sourceUpdatedOn)].filter(Boolean).sort().at(-1);
      // A stable, dated newer announcement may share a product landing page;
      // undated or older automatic records must never displace manual facts.
      if(!latestManual||!automaticDate||automaticDate<=latestManual||typeof r.semanticKey!=='string'||!r.semanticKey.startsWith('auto-index|')||r.semanticKey.length<=11){enrichManualAliases(r,url);automaticSkipped++;continue;}
    }
    // Check identity before add(): add replaces indexed records, so an after-add
    // check would already have overwritten a manually maintained record.
    const expectedId=`${r.game}-${crypto.createHash('sha256').update(`${r.game}|${r.type}|${url}|${r.semanticKey||''}`).digest('hex').slice(0,16)}`;
    if(manualIds.has(expectedId)){enrichManualAliases(r,url);automaticSkipped++;continue;}
    const id=add(r,r.semanticKey||'');
    if(!id)continue;
    autoIds.add(id);if(!semantic)autoPages.add(pageKey);automaticCount++;
  }
}
const timelineDate = item => [item.publishedOn,item.sourceUpdatedOn].filter(Boolean).sort().at(-1) || (item.eventOn && item.eventOn<=builtOn ? item.eventOn : '') || '';
const sort=(a,b)=>timelineDate(b).localeCompare(timelineDate(a))||a.id.localeCompare(b.id);
const all=[...records.values()].sort(sort),included=[],trimmed=[];
for(const game of games) {
  const entries=all.filter(x=>x.game===game.id);
  // Keep every reviewed news/product/rules record and one of every content type.
  // A run of new tournament lists must not silently hide undated official news.
  const curated=entries.filter(x=>curatedIds.has(x.id)),automatic=entries.filter(x=>autoIds.has(x.id));
  // Retain previously published manual records and at least100 other existing facts.
  const priorManual=entries.filter(x=>!autoIds.has(x.id)&&oldById.has(x.id));
  const manualKeep=new Map([...curated,...priorManual,...entries.filter(x=>!autoIds.has(x.id)&&!curatedIds.has(x.id)).slice(0,100)].map(x=>[x.id,x]));
  const chosen=[...manualKeep.values(),...automatic];
  const selected=new Set(chosen.map(x=>x.id));
  for(const type of new Set(entries.map(x=>x.type))){const representative=entries.find(x=>x.type===type);if(!chosen.some(x=>x.type===type)){chosen.push(representative);selected.add(representative.id);}}
  const limit=Math.max(160,automatic.length+chosen.filter(x=>!autoIds.has(x.id)).length);
  for(const record of entries){if(chosen.length>=limit)break;if(!selected.has(record.id)){chosen.push(record);selected.add(record.id);}}
  chosen.sort(sort);
  included.push(...chosen);
  trimmed.push(...entries.filter(x=>!chosen.includes(x)).map(x=>({id:x.id,game:x.game,reason:'Per-game feed cap; full record retained in game database'})));
  const sourceDates=chosen.map(x=>[x.publishedOn,x.sourceUpdatedOn].filter(Boolean).sort().at(-1)).filter(Boolean).sort();
  const eventDates=chosen.map(x=>x.eventOn).filter(x=>x&&x<=builtOn).sort();
  const upcomingEvents=chosen.map(x=>x.eventOn).filter(x=>x&&x>builtOn).sort();
  game.reviewedOn=chosen.map(x=>x.verifiedOn).filter(Boolean).sort().at(-1)||null;
  game.latestSourceDate=sourceDates.at(-1)||null;
  game.latestEventDate=eventDates.at(-1)||null;
  game.upcomingEventDate=upcomingEvents[0]||null;
  game.sourceDateKnown=sourceDates.length;
  game.sourceCount=new Set(chosen.map(x=>new URL(x.sourceUrl).hostname)).size;
  game.recordCount=chosen.length;
}
included.sort(sort);
const result={schemaVersion:1,builtOn,games,items:included};
for(const item of included)firstCollected.set(item.id,item.firstCollectedOn);
fs.writeFileSync(firstCollectedFile,JSON.stringify({schemaVersion:1,firstCollectedOn:Object.fromEntries([...firstCollected].sort(([a],[b])=>a.localeCompare(b)))},null,2)+'\n');
fs.writeFileSync(output,JSON.stringify(result,null,2)+'\n');
fs.mkdirSync(work,{recursive:true});
const report={builtOn,files:inputFiles,curatedCount,automaticCount,automaticSkipped,totalBeforeCap:all.length,totalIncluded:included.length,
  byGame:Object.fromEntries(games.map(g=>[g.id,{records:g.recordCount,latestPublication:g.latestSourceDate,latestEvent:g.latestEventDate,reviewedOn:g.reviewedOn}])),
  duplicates,trimmed,pending,datePolicy:'Only explicit source publication/revealed dates become publishedOn. Event dates are eventOn; maintenance dates never become publication dates.',
  limitations:['Builder indexes local reviewed data plus verified collector output; network collection is performed separately, not by this builder.','MARVEL and BEY legacy aggregates point to collection sources; individual original-event provenance remains pending.','firstCollectedOn is first inclusion in this cross-game feed, not first website import.']};
fs.writeFileSync(path.join(work,'feed-build-report.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({items:included.length,games:report.byGame,duplicates:duplicates.length,trimmed:trimmed.length,pending:pending.length}));
