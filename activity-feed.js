(()=>{
  'use strict';
  const translations={
    'zh-cn':{all:'全部',game:'游戏',search:'搜索资讯',placeholder:'卡组、角色、卡号或关键词',type:'内容',language:'原文语言',any:'不限',news:'资讯／新卡',product:'新品／系列',rules:'规则／禁限',event:'赛事',deck:'完整卡表',meta:'环境／数据',ja:'日文',en:'英文','zh-CN':'简体中文','zh-TW':'繁体中文',unknown:'未注明',published:'发布',eventDate:'赛事',available:'发售',noDate:'日期未注明',source:'原文',database:'进入资料库',verified:'已核验',indexed:'已有收录',verifiedOn:'核验',snapshot:'资讯流整理',results:'条结果',shown:'当前显示',more:'加载更多',empty:'没有符合条件的已收录资讯，试试减少条件。',coverage:'收录范围与日期',coverageText:'这里汇集已收录的公开资料。按原文发布日期或明确的赛事日期排列；发售日期另列。未注明日期的资料排在最后。原文保持原语言，可在同一搜索框查找；选择“原文语言”才限制来源语言。收录范围会继续扩充。',coverageNote:'“已核验”标明具体核验日期；“已有收录”沿用数据库记录，本轮未重新逐条核验。资料日期与整理日期分别显示。',latestSource:'最新发布日期',latestEvent:'最新赛事日期',checked:'最近核验',records:'条资讯',sources:'个来源',pending:'待补',loading:'正在读取已收录资讯…',failed:'暂时无法读取资讯，分类资料库仍可访问。',retry:'重试'},
    zh:{all:'全部',game:'遊戲',search:'搜尋資訊',placeholder:'牌組、角色、卡號或關鍵字',type:'內容',language:'原文語言',any:'不限',news:'資訊／新卡',product:'新品／系列',rules:'規則／禁限',event:'賽事',deck:'完整牌組',meta:'環境／資料',ja:'日文',en:'英文','zh-CN':'簡體中文','zh-TW':'繁體中文',unknown:'未註明',published:'發布',eventDate:'賽事',available:'發售',noDate:'日期未註明',source:'原文',database:'進入資料庫',verified:'已核驗',indexed:'已有收錄',verifiedOn:'核驗',snapshot:'資訊流整理',results:'筆結果',shown:'目前顯示',more:'載入更多',empty:'沒有符合條件的已收錄資訊，試試減少條件。',coverage:'收錄範圍與日期',coverageText:'彙集已收錄的公開資料，依原文發布日期或明確的賽事日期排列；發售日期另列。未註明日期的資料排在最後。原文保持原語言，可在同一搜尋框尋找；選擇「原文語言」才限制來源語言。收錄範圍會持續擴充。',coverageNote:'「已核驗」標明具體核驗日期；「已有收錄」沿用資料庫記錄，本輪未重新逐筆核驗。資料日期與整理日期分開顯示。',latestSource:'最新發布日期',latestEvent:'最新賽事日期',checked:'最近核驗',records:'筆資訊',sources:'個來源',pending:'待補',loading:'正在讀取已收錄資訊…',failed:'暫時無法讀取資訊，仍可進入分類資料庫。',retry:'重試'},
    ja:{all:'すべて',game:'ゲーム',search:'情報検索',placeholder:'デッキ・キャラ・カード番号・キーワード',type:'内容',language:'原文言語',any:'指定なし',news:'ニュース・新カード',product:'商品・セット',rules:'ルール・制限',event:'大会',deck:'完全デッキ',meta:'環境・データ',ja:'日本語',en:'英語','zh-CN':'簡体字中国語','zh-TW':'繁体字中国語',unknown:'記載なし',published:'公開',eventDate:'大会',available:'発売',noDate:'日付記載なし',source:'出典',database:'データベースへ',verified:'確認済み',indexed:'収録済み',verifiedOn:'確認',snapshot:'情報一覧の整理日',results:'件',shown:'表示中',more:'もっと見る',empty:'一致する収録情報がありません。条件を減らしてみてください。',coverage:'収録範囲と日付',coverageText:'公開情報を集約し、元の公開日または明記された大会日で表示。発売日は別途表示し、日付不明は最後に並べます。原文は元の言語を保持し、同じ検索欄から検索できます。原文言語の指定時のみ出典を絞ります。',coverageNote:'確認済みには確認日を表示。収録済みは既存データの索引で、今回すべてを再確認したものではありません。情報の日付と一覧の整理日は別々に表示します。',latestSource:'最新の公開日',latestEvent:'最新の大会日',checked:'最終確認',records:'件',sources:'出典',pending:'未確認',loading:'収録情報を読み込み中…',failed:'情報を読み込めません。タイトル別データは引き続き利用できます。',retry:'再試行'},
    en:{all:'ALL',game:'Game',search:'Search updates',placeholder:'Deck, character, card number or keyword',type:'Content',language:'Source language',any:'Any',news:'News / reveals',product:'Products / sets',rules:'Rules / restrictions',event:'Events',deck:'Full lists',meta:'Meta / data',ja:'Japanese',en:'English','zh-CN':'Simplified Chinese','zh-TW':'Traditional Chinese',unknown:'Not stated',published:'Published',eventDate:'Event',available:'Release',noDate:'Date not stated',source:'Original',database:'Open database',verified:'Verified',indexed:'Previously indexed',verifiedOn:'Checked',snapshot:'Feed compiled',results:'results',shown:'Showing',more:'Load more',empty:'No collected updates match. Try fewer filters.',coverage:'Coverage and dates',coverageText:'A collection of public information, ordered by original publication or stated event date. Product release dates are shown separately. Undated records appear last. Original titles keep their language; use one search box across sources. Only the source-language filter restricts language.',coverageNote:'Verified items show a check date. Previously indexed items come from existing databases and were not all reverified in this pass. Source dates and the compilation date are separate.',latestSource:'Latest publication',latestEvent:'Latest event',checked:'Last checked',records:'items',sources:'sources',pending:'Pending',loading:'Loading collected updates…',failed:'Updates could not load. The game databases remain available.',retry:'Retry'}
  };
  Object.assign(translations['zh-cn'],{updated:'来源更新',collection:'汇总入口',checked:'最近单条核验',latestSource:'最新发布／更新',latestEvent:'最近已举行赛事',dateEvidence:'日期出处',through:'资料覆盖至'});
  Object.assign(translations.zh,{updated:'來源更新',collection:'彙總入口',checked:'最近單筆核驗',latestSource:'最新發布／更新',latestEvent:'最近已舉行賽事',dateEvidence:'日期出處',through:'資料涵蓋至'});
  Object.assign(translations.ja,{updated:'出典更新',collection:'集計入口',checked:'直近の個別確認',latestSource:'最新公開・更新',latestEvent:'直近の開催済み大会',dateEvidence:'日付の出典',through:'収録範囲の末日'});
  Object.assign(translations.en,{updated:'Source updated',collection:'Collection index',checked:'Latest individual check',latestSource:'Latest publication / update',latestEvent:'Latest completed event',dateEvidence:'Date source',through:'Coverage through'});
  Object.assign(translations['zh-cn'],{otherSources:'多地区原文',resultSource:'成绩出处'});
  Object.assign(translations.zh,{otherSources:'多地區原文',resultSource:'成績出處'});
  Object.assign(translations.ja,{otherSources:'地域別の出典',resultSource:'成績の出典'});
  Object.assign(translations.en,{otherSources:'Regional sources',resultSource:'Result source'});
  translations['zh-cn'].th='泰文';translations.zh.th='泰文';translations.ja.th='タイ語';translations.en.th='Thai';
  translations['zh-cn'].print='卡牌';translations.zh.print='卡牌';translations.ja.print='カード';translations.en.print='Print';
  const gameNames={ptcg:'PTCG',gcg:'GCG',opcg:'OPCG',unionarena:'UNION ARENA',riftbound:'RIFTBOUND',marvel:'MARVEL HERO RUSH',beyblade:'BEYBLADE X'};
  const types=['news','product','rules','event','deck','meta'];
  const languages=['ja','en','zh-CN','zh-TW','th','unknown'];
  const normalize=value=>String(value??'').normalize('NFKC').toLocaleLowerCase().replace(/[\s・·_—–-]+/g,' ').trim();
  const date=value=>/^\d{4}-\d{2}-\d{2}$/.test(value||'')?value:null;
  const dateOf=item=>date(item.publishedOn)||date(item.sourceUpdatedOn)||date(item.eventOn)||'';
  const timelineDate=(item,asOf)=>date(item.publishedOn)||date(item.sourceUpdatedOn)||(date(item.eventOn)&&item.eventOn<=asOf?item.eventOn:'');
  function select(items,filters={},asOf='9999-12-31'){
    const terms=normalize(filters.query).split(' ').filter(Boolean);
    const matches=item=>{const fields=[item.title,item.originalTitle,item.summary,item.sourceName,item.format,item.region,gameNames[item.game],item.printEdition,({ja:'Japanese 日文 日本語',en:'English 英文','zh-TW':'Traditional Chinese 繁体中文 繁體中文','zh-CN':'Simplified Chinese 简体中文 簡體中文'})[item.printEdition]||'',...(item.aliases||[])];return window.MetaSearch?.matches?window.MetaSearch.matches(filters.query||'',fields):terms.every(term=>normalize(fields.join(' ')).includes(term))};
    return items.filter(item=>(!filters.game||item.game===filters.game)&&(!filters.type||item.type===filters.type)&&(!filters.language||item.sourceLanguage===filters.language||(item.alternateSources||[]).some(source=>source.language===filters.language))&&matches(item)).sort((a,b)=>timelineDate(b,asOf).localeCompare(timelineDate(a,asOf))||String(a.title).localeCompare(String(b.title))||a.id.localeCompare(b.id));
  }
  const escape=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  function sourceUrl(value){try{const u=new URL(value);return u.protocol==='https:'?u.href:''}catch{return ''}}
  function internalUrl(value){return /^(?:ptcg|gcg|opcg|unionarena|riftbound|marvel|beyblade)\.html(?:[?#][^\s<>"']*)?$/.test(value||'')?value:''}
  function card(item,t){
    const src=sourceUrl(item.sourceUrl),dest=internalUrl(item.internalUrl),day=dateOf(item);
    const kind=date(item.publishedOn)?t.published:date(item.sourceUpdatedOn)?t.updated:t.eventDate;
    const checked=item.status==='verified'&&date(item.verifiedOn),evidence=sourceUrl(item.dateEvidenceUrl),result=sourceUrl(item.resultSourceUrl);
    const alternates=(item.alternateSources||[]).filter(x=>sourceUrl(x.url));
    const sourceLanguages=[...new Set([item.sourceLanguage,...alternates.map(x=>x.language)])];
    const tags=[gameNames[item.game]||item.game,t[item.type]||item.type,sourceLanguages.map(lang=>t[lang]||t.unknown).join(' / '),item.printEdition&&item.printEdition!=='unknown'?t.print+' '+(t[item.printEdition]||item.printEdition):'',item.format,item.region,item.sourceScope==='collection'?t.collection:''].filter(value=>value&&value!=='unknown');
    const links=[
      src?`<a class="activity-original" href="${escape(src)}" target="_blank" rel="noopener noreferrer">${escape(t.source)} · ${escape(item.sourceName||new URL(src).hostname)} ↗</a>`:'',
      dest?`<a href="${escape(dest)}">${escape(t.database)} →</a>`:'',
      evidence&&evidence!==src?`<a href="${escape(evidence)}" target="_blank" rel="noopener noreferrer">${escape(t.dateEvidence)}</a>`:'',
      result&&result!==src?`<a href="${escape(result)}" target="_blank" rel="noopener noreferrer">${escape(t.resultSource)}</a>`:'',
      date(item.coverageThrough)?`<span>${escape(t.through)} ${item.coverageThrough}</span>`:'',
      date(item.availableOn)?`<span>${escape(t.available)} ${item.availableOn}</span>`:'',
      date(item.eventOn)&&item.eventOn!==day?`<span>${escape(t.eventDate)} ${item.eventOn}${date(item.eventEndsOn)?' – '+item.eventEndsOn:''}</span>`:'',
      `<span class="activity-verification">${escape(checked?`${t.verified} · ${t.verifiedOn} ${item.verifiedOn}`:t.indexed)}</span>`
    ].join('');
    const alternateHtml=alternates.length>1?`<details class="activity-alternates"><summary>${escape(t.otherSources)} · ${alternates.length}</summary><ul>${alternates.map(x=>`<li><a href="${escape(sourceUrl(x.url))}" target="_blank" rel="noopener noreferrer">${escape(t[x.language]||x.label||t.unknown)} ↗</a>${date(x.publishedOn)?` · ${escape(t.published)} ${x.publishedOn}`:''}</li>`).join('')}</ul></details>`:'';
    return `<article class="activity-item"><div class="activity-date">${day?`<time datetime="${day}">${day}</time><span>${escape(kind)}</span>`:`<span class="undated">${escape(t.noDate)}</span>`}</div><div class="activity-item-content"><div class="activity-tags">${tags.map((x,i)=>`<span${i===0?' class="game-tag"':''}>${escape(x)}</span>`).join('')}</div><h3>${src?`<a href="${escape(src)}" target="_blank" rel="noopener noreferrer">${escape(item.title)}</a>`:escape(item.title)}</h3>${item.summary?`<p class="activity-summary">${escape(item.summary)}</p>`:''}<div class="activity-source-line">${links}</div>${alternateHtml}</div></article>`;
  }
  // Pure helpers also support deterministic build checks without loading game catalogs.
  window.MetaLabActivity={select,dateOf,sourceUrl,internalUrl,card};
  const root=document.getElementById('activityFeed');if(!root)return;
  let data=null,visible=12,filters={game:'',type:'',language:'',query:''};
  const language=()=>document.getElementById('homeLang')?.value||'zh-cn';
  const dict=()=>translations[language()]||translations['zh-cn'];
  const options=(values,t)=>`<option value="">${escape(t.any)}</option>`+values.map(value=>`<option value="${value}">${escape(t[value])}</option>`).join('');
  function renderResults(){
    if(!data)return;const t=dict(),items=select(data.items,filters,data.builtOn);
    root.querySelector('[data-activity-results]').innerHTML=items.length?items.slice(0,visible).map(item=>card(item,t)).join(''):`<p class="activity-empty">${escape(t.empty)}</p>`;
    root.querySelector('[data-activity-count]').textContent=`${items.length} ${t.results} · ${t.shown} ${Math.min(visible,items.length)}`;
    root.querySelector('[data-activity-more]').hidden=visible>=items.length;
    root.querySelectorAll('[data-activity-game]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.activityGame===filters.game)));
  }
  function render(){
    if(!data)return;const t=dict();
    root.innerHTML=`<div class="activity-controls"><fieldset class="activity-games"><legend>${escape(t.game)}</legend>${[['',t.all],...data.games.map(game=>[game.id,gameNames[game.id]||game.name])].map(([id,label])=>`<button type="button" data-activity-game="${escape(id)}" aria-pressed="${id===filters.game}">${escape(label)}</button>`).join('')}</fieldset><div class="activity-fields"><label>${escape(t.search)}<input type="search" data-activity-search placeholder="${escape(t.placeholder)}" value="${escape(filters.query)}" autocomplete="off"></label><label>${escape(t.type)}<select data-activity-type>${options(types,t)}</select></label><label>${escape(t.language)}<select data-activity-language>${options(languages,t)}</select></label></div></div><div class="activity-meta"><p data-activity-count role="status" aria-live="polite"></p><p>${escape(t.snapshot)} <time datetime="${escape(data.builtOn)}">${escape(data.builtOn)}</time></p></div><div class="activity-list" data-activity-results></div><button class="activity-more" type="button" data-activity-more>${escape(t.more)}</button><details class="activity-coverage"><summary>${escape(t.coverage)}</summary><p>${escape(t.coverageText)}</p><p>${escape(t.coverageNote)}</p><div class="activity-coverage-grid">${data.games.map(game=>`<a href="${escape(internalUrl(game.page))}"><b>${escape(gameNames[game.id]||game.name)}</b><span>${game.recordCount} ${escape(t.records)} · ${game.sourceCount} ${escape(t.sources)}</span><span>${escape(t.latestSource)} ${escape(date(game.latestSourceDate)||t.unknown)}</span><span>${escape(t.latestEvent)} ${escape(date(game.latestEventDate)||t.unknown)}</span><span>${escape(t.checked)} ${escape(date(game.reviewedOn)||t.pending)}</span></a>`).join('')}</div></details>`;
    root.querySelector('[data-activity-type]').value=filters.type;
    root.querySelector('[data-activity-language]').value=filters.language;
    root.querySelectorAll('[data-activity-game]').forEach(button=>button.addEventListener('click',()=>{filters.game=button.dataset.activityGame;visible=12;renderResults()}));
    root.querySelector('[data-activity-search]').addEventListener('input',event=>{filters.query=event.target.value;visible=12;renderResults()});
    ['type','language'].forEach(key=>root.querySelector(`[data-activity-${key}]`).addEventListener('change',event=>{filters[key]=event.target.value;visible=12;renderResults()}));
    root.querySelector('[data-activity-more]').addEventListener('click',()=>{visible+=12;renderResults()});renderResults();
  }
  async function load(){
    const t=dict();root.innerHTML=`<p class="activity-loading" role="status">${escape(t.loading)}</p>`;
    try{const response=await fetch('activity-feed.json?v=2026110801',{cache:'no-cache'});if(!response.ok)throw Error(response.status);const next=await response.json();if(next.schemaVersion!==1||!Array.isArray(next.items)||!Array.isArray(next.games))throw Error('Unsupported feed');data=next;render()}
    catch(error){root.innerHTML=`<p class="activity-error" role="status">${escape(dict().failed)} <button type="button">${escape(dict().retry)}</button></p>`;root.querySelector('button').addEventListener('click',load)}
  }
  window.addEventListener('metalab:home-language',()=>{if(data)render()});load();
})();
