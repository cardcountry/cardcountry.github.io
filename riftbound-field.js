(()=>{
 'use strict';
 const view=document.documentElement.dataset.pageView||'';
 if(view&&view!=='usage')return;
 function fieldSnapshot(value){
  if(!value||!Array.isArray(value.rows)||!value.rows.length)return null;
  const rows=value.rows,seen=new Set();
  for(const row of rows){if(!row||typeof row.legend!=='string')return null;const key=row.legend.trim().toLowerCase();if(!key||seen.has(key)||!['day1','day2'].every(day=>Number.isInteger(row[day])&&row[day]>=0))return null;seen.add(key)}
  if(!['publishedOn','verifiedOn','eventStartedOn','eventEndedOn'].every(key=>/^\d{4}-\d{2}-\d{2}$/.test(String(value[key]||''))))return null;
  if(!['day1','day2'].every(day=>Number.isInteger(value[day+'Decks'])&&value[day+'Decks']>0&&rows.reduce((sum,row)=>sum+row[day],0)===value[day+'Decks']))return null;
  try{const url=new URL(value.source);if(url.protocol!=='https:'||url.hostname!=='playriftbound.com')return null}catch{return null}
  return value;
 }
 function fieldRows(snapshot,day,query='',matches){
  const selected=day==='day1'?'day1':'day2',denominator=snapshot[selected+'Decks'];let prior=-1,rank=0;
  return snapshot.rows.map((row,index)=>({...row,index})).sort((a,b)=>b[selected]-a[selected]||a.index-b.index).map((row,index)=>{if(row[selected]!==prior)rank=index+1;prior=row[selected];return{...row,rank,day1Share:row.day1/snapshot.day1Decks*100,day2Share:row.day2/snapshot.day2Decks*100,count:row[selected],denominator}}).filter(row=>!query.trim()||(matches?matches(query,[row.legend]):row.legend.toLowerCase().includes(query.trim().toLowerCase())));
 }
 function fieldWords(lang){if(!['zh-cn','zh','en','ja'].includes(lang))lang='en';return({
  'zh-cn':{title:'官方赛事卡组分布',kind:'欧洲冠军赛 · 官方提交样本',note:'D1、D2分别统计当日提交的卡组，不代表现场总人数；与下方本站收录卡表使用率分开。占比按样本数计算，四舍五入至1位小数。',event:'比赛',published:'报道',verified:'资料核验',sort:'排序依据',day1:'Day 1',day2:'Day 2',decks:'提交卡组',search:'搜索传奇或已收录的中英日别名',source:'官方原文',all:'显示全部',top:'仅看前10',entries:'牌型',empty:'没有匹配的官方牌型',showing:'显示',of:'／'},
  zh:{title:'官方賽事牌組分布',kind:'歐洲冠軍賽 · 官方提交樣本',note:'D1、D2分別統計當日提交的牌組，不代表現場總人數；與下方本站收錄牌組使用率分開。占比按樣本數計算，四捨五入至1位小數。',event:'比賽',published:'報導',verified:'資料核驗',sort:'排序依據',day1:'Day 1',day2:'Day 2',decks:'提交牌組',search:'搜尋傳奇或已收錄的中英日別名',source:'官方原文',all:'顯示全部',top:'僅看前10',entries:'牌型',empty:'沒有匹配的官方牌型',showing:'顯示',of:'／'},
  en:{title:'Official tournament deck field',kind:'EUROPEAN CHAMPIONSHIP · OFFICIAL SUBMITTED DECKS',note:'Each day uses its own submitted-deck sample, not event attendance. This is separate from the collected-list usage below. Shares are calculated from counts and rounded to one decimal.',event:'EVENT',published:'ARTICLE',verified:'DATA VERIFIED',sort:'SORT BY',day1:'Day 1',day2:'Day 2',decks:'submitted decks',search:'Search legend or indexed Chinese, English or Japanese aliases',source:'OFFICIAL ARTICLE',all:'SHOW ALL',top:'TOP 10 ONLY',entries:'archetypes',empty:'No matching official archetype',showing:'SHOWING',of:'/'},
  ja:{title:'公式大会のデッキ分布',kind:'欧州選手権 · 公式提出デッキのサンプル',note:'各日は当日の提出デッキ数を分母とし、大会の総参加人数ではありません。下の収録リスト使用率とは別集計です。割合は件数から計算し、小数第1位に丸めています。',event:'大会',published:'記事',verified:'データ確認',sort:'並び順',day1:'Day 1',day2:'Day 2',decks:'提出デッキ',search:'レジェンド名・収録済みの中英日別名で検索',source:'公式記事',all:'全件表示',top:'上位10件のみ',entries:'アーキタイプ',empty:'一致する公式アーキタイプなし',showing:'表示',of:'／'}
 })[lang]}
 const state={day:'day2',query:'',all:false},make=(tag,cls,text)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el};
 let host=null;
 function mount(){
  const parent=document.querySelector('#usage-ranking');if(!parent)return;
  const data=(window.RIFTBOUND_DATA?.officialFieldSnapshots||[]).filter(fieldSnapshot).sort((a,b)=>String(b.publishedOn).localeCompare(String(a.publishedOn)))[0];if(!data){host?.remove();host=null;return}
  const lang=document.querySelector('#uiLang')?.value||'zh-cn',w=fieldWords(lang);
  if(!host?.isConnected){host=make('section','rift-official-field');host.id='riftOfficialField';parent.prepend(host)}
  host.replaceChildren();host.setAttribute('aria-labelledby','riftFieldTitle');
  const kicker=make('small','rf-kicker',w.kind),title=make('h2','',w.title);title.id='riftFieldTitle';
  const dates=make('p','rf-dates',`${w.event} ${data.eventStartedOn} — ${data.eventEndedOn} · ${w.published} ${data.publishedOn} · ${w.verified} ${data.verifiedOn}`);
  const note=make('p','rf-note',w.note),controls=make('div','rf-controls'),sort=make('div','rf-sort');sort.setAttribute('role','group');sort.setAttribute('aria-label',w.sort);
  const buttons={};for(const day of ['day1','day2']){const button=make('button','',`${w[day]} · ${data[day+'Decks']}`);button.type='button';button.setAttribute('aria-label',`${w.sort} ${w[day]} · ${data[day+'Decks']} ${w.decks}`);button.addEventListener('click',()=>{state.day=day;draw()});buttons[day]=button;sort.append(button)}
  const search=make('input','rf-search');search.type='search';search.placeholder=w.search;search.setAttribute('aria-label',w.search);search.value=state.query;search.addEventListener('input',()=>{state.query=search.value;draw()});controls.append(sort,search);
  const summary=make('p','rf-summary'),list=make('ol','rf-rows'),more=make('button','rf-more');more.type='button';summary.setAttribute('aria-live','polite');
  more.addEventListener('click',()=>{state.all=!state.all;draw()});
  const source=make('a','rf-source',w.source+' ↗');source.href=data.source;source.target='_blank';source.rel='noopener noreferrer';
  host.append(kicker,title,dates,note,controls,summary,list,more,source);
  function draw(){
   for(const day of ['day1','day2'])buttons[day].setAttribute('aria-pressed',String(day===state.day));host.dataset.day=state.day;
   const rows=fieldRows(data,state.day,state.query,window.MetaSearch?.matches?.bind(window.MetaSearch)),visible=state.all||state.query.trim()?rows:rows.slice(0,10);
   summary.textContent=`${w.sort} ${w[state.day]} · ${w.showing} ${visible.length}${w.of}${rows.length} ${w.entries}`;list.replaceChildren();
   for(const row of visible){const li=make('li','rf-row'),rank=make('span','rf-rank',String(row.rank).padStart(2,'0')),name=make('b','rf-name',row.legend),values=make('div','rf-values');
    for(const day of ['day1','day2']){const value=make('span','rf-value'),label=make('small','',w[day]),count=make('strong','',`${row[day]} / ${data[day+'Decks']}`),share=make('em','',row[day+'Share'].toFixed(1)+'%');value.append(label,count,share);values.append(value)}
    const bar=make('progress','rf-bar');bar.max=row.denominator;bar.value=row.count;bar.setAttribute('aria-label',`${row.legend} · ${w[state.day]} · ${(row.count/row.denominator*100).toFixed(1)}%`);li.append(rank,name,values,bar);list.append(li);
   }
   if(!rows.length)list.append(make('li','rf-empty',w.empty));more.hidden=!!state.query.trim()||rows.length<=10;more.textContent=state.all?w.top:`${w.all} ${rows.length} ${w.entries}`;
  }
  draw();
 }
 mount();document.addEventListener('DOMContentLoaded',mount);document.addEventListener('metalab:data-updated',mount);document.querySelector('#uiLang')?.addEventListener('change',mount);
})();
