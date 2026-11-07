import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

// This indexes reviewed site data. It does not crawl remote sites or imply that
// running the builder has re-verified the underlying sources.
// Set METALAB_FEED_DATE explicitly to the client's YYYY-MM-DD for every run.
// PowerShell example: $env:METALAB_FEED_DATE='2026-11-08'; node data-pipeline/build-activity-feed.mjs
// Never infer the maintenance date from the execution host's timezone.
const site = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const work = path.resolve(site, '../work/aggregation-20261108');
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
const langMap = { Japanese:'ja', English:'en', Thai:'th', 'Traditional Chinese':'zh-TW', 'Simplified Chinese':'zh-CN', jp:'ja', ja:'ja', en:'en', th:'th', tw:'zh-TW', 'zh-tw':'zh-TW', 'zh-cn':'zh-CN', 'zh-TW':'zh-TW', 'zh-CN':'zh-CN', 'asia-en':'en' };
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
const context = {window:{}};
vm.createContext(context);
const inputFiles = ['decks-data.js','community-data.js','ptcg-visual-data.js','ptcg-jp-recent.js','ptcg-tw-public.js','gcg-data.js','gcg-jp-recent.js','gcg-official-decks.js','opcg-data.js','opcg-recent-data.js','opcg-photo-data.js','opcg-eb05-jp.js','unionarena-data.js','unionarena-recipes.js','unionarena-jp-decks.js','riftbound-data.js','marvel-data.js','beyblade-data.js'];
for (const file of inputFiles) vm.runInContext(fs.readFileSync(path.join(site,file),'utf8'),context,{filename:file,timeout:10000});
const data = context.window;
const records = new Map(), pending = [], duplicates = [];
const htmlIds = new Map(games.map(g=>[g.id,new Set([...fs.readFileSync(path.join(site,g.page),'utf8').matchAll(/\bid=["']([^"']+)["']/g)].map(x=>x[1]))]));
function add(input, semantic='') {
  const game = games.find(g=>g.id===input.game);
  const sourceUrl = canonical(input.sourceUrl);
  if (!game || !types.has(input.type) || !sourceUrl || !input.title || input.status==='pending') { pending.push({game:input.game,title:input.title,reason:'Missing public source, title, supported game/type, or pending verification'}); return; }
  const internalUrl = input.internalUrl || game.page;
  const [page,anchor] = internalUrl.split('#');
  if (page!==game.page || (anchor && !htmlIds.get(game.id).has(anchor))) throw new Error(`Unknown internal destination ${internalUrl}`);
  const identity = `${input.game}|${input.type}|${sourceUrl}|${semantic}`;
  const id = `${input.game}-${crypto.createHash('sha256').update(identity).digest('hex').slice(0,16)}`;
  const publishedOn = date(input.publishedOn), sourceUpdatedOn = date(input.sourceUpdatedOn), eventOn = date(input.eventOn), verifiedOn = date(input.verifiedOn);
  const record = {
    ...input,id,sourceUrl,sourceName:input.sourceName||new URL(sourceUrl).hostname,
    sourceLanguage:normalizeLanguage(input.sourceLanguage),printEdition:normalizeLanguage(input.printEdition),
    publishedOn,sourceUpdatedOn,eventOn,availableOn:date(input.availableOn),
    firstCollectedOn:date(oldById.get(id)?.firstCollectedOn)||builtOn,
    verifiedOn,status:input.status==='verified'&&verifiedOn?'verified':'indexed',
    internalUrl,format:input.format||'unknown',region:input.region||'unknown',
    aliases:[...new Set(input.aliases||[])].filter(x=>typeof x==='string'&&x)
  };
  if (publishedOn && publishedOn>builtOn) throw new Error(`Future publication date: ${record.title}`);
  if (sourceUpdatedOn && sourceUpdatedOn>builtOn) throw new Error(`Future source update date: ${record.title}`);
  if (records.has(id)) { duplicates.push({id,title:record.title}); if(records.get(id).status==='verified')return; }
  records.set(id,record);
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
    publishedOn:null,eventOn:publicBuild?null:date(list.date),verifiedOn:list.checked,
    status:list.checked?'verified':'indexed',internalUrl:'ptcg.html#meta',format:list.format||'Standard',
    region:list.region||'International',aliases:[group.name,group.key,list.variant||''],resultSourceUrl:list.eventUrl},list.listId||list.player||'');
}
for (const event of data.GCG_DATA.tournaments||[]) {
  const complete = (event.results||[]).filter(r=>Array.isArray(r.main)&&r.main.reduce((n,x)=>n+Number(x[1]||0),0)===50);
  if (!complete.length) {pending.push({game:'gcg',title:event.name,reason:'No complete 50-card list'});continue;}
  add({game:'gcg',type:'event',title:event.name,
    summary:`${event.players?event.players+' 人；':''}${complete.length} 份完整 50 张赛事卡表；${event.venue||event.region||'地区未注明'}。`,
    sourceUrl:event.sourceUrl,sourceName:event.sourceUrl?.includes('gcg-stats')?'GCG STATS':'Egman Events',
    sourceLanguage:sourceLanguageOf(event.sourceUrl,event.sourceLanguage),printEdition:event.language,eventOn:event.date,publishedOn:null,verifiedOn:event.checked,
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
    sourceUrl:list.sourceUrl,sourceName:list.source,sourceLanguage:sourceLanguageOf(list.sourceUrl,list.sourceLanguage),printEdition:list.language,
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
for(const deck of data.RIFTBOUND_DATA.decks||[]) {
  add({game:'riftbound',type:'deck',title:`${deck.legend} · ${deck.player}`,summary:`${deck.event}；${deck.placement}；${deck.total} 张（包含来源记录的传奇、符文、战场与备牌）。`,
    sourceUrl:deck.source,sourceName:'Riftdecks',sourceLanguage:'en',publishedOn:null,eventOn:deck.date,verifiedOn:null,status:'indexed',
    internalUrl:'riftbound.html#meta',format:'Radiance · Constructed',region:'unknown',aliases:[deck.legend,...(deck.domains||[])]},deck.id);
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
    add(r,r.semanticKey||'');curatedCount++;
  }
}
const timelineDate = item => item.publishedOn || item.sourceUpdatedOn || (item.eventOn && item.eventOn<=builtOn ? item.eventOn : '') || '';
const sort=(a,b)=>timelineDate(b).localeCompare(timelineDate(a))||a.id.localeCompare(b.id);
const all=[...records.values()].sort(sort),included=[],trimmed=[];
for(const game of games) {
  const entries=all.filter(x=>x.game===game.id);
  // Keep both official recipes and event records represented in capped games.
  let chosen=entries.slice(0,160);
  const missingType=[...new Set(entries.map(x=>x.type))].filter(t=>!chosen.some(x=>x.type===t));
  for(const type of missingType){chosen.pop();chosen.push(entries.find(x=>x.type===type));}
  included.push(...chosen);
  trimmed.push(...entries.filter(x=>!chosen.includes(x)).map(x=>({id:x.id,game:x.game,reason:'Per-game feed cap; full record retained in game database'})));
  const sourceDates=chosen.map(x=>x.publishedOn||x.sourceUpdatedOn).filter(Boolean).sort();
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
fs.writeFileSync(output,JSON.stringify(result,null,2)+'\n');
fs.mkdirSync(work,{recursive:true});
const report={builtOn,files:inputFiles,curatedCount,totalBeforeCap:all.length,totalIncluded:included.length,
  byGame:Object.fromEntries(games.map(g=>[g.id,{records:g.recordCount,latestPublication:g.latestSourceDate,latestEvent:g.latestEventDate,reviewedOn:g.reviewedOn}])),
  duplicates,trimmed,pending,datePolicy:'Only explicit source publication/revealed dates become publishedOn. Event dates are eventOn; maintenance dates never become publication dates.',
  limitations:['Builder indexes local reviewed data; no network collection or background crawler is claimed.','MARVEL and BEY legacy aggregates point to collection sources; individual original-event provenance remains pending.','firstCollectedOn is first inclusion in this cross-game feed, not first website import.']};
fs.writeFileSync(path.join(work,'feed-build-report.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({items:included.length,games:report.byGame,duplicates:duplicates.length,trimmed:trimmed.length,pending:pending.length}));
