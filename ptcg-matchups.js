(()=>{
 'use strict';
 const original=window.MetaLabMatchups;if(!original?.resolve||!original?.render)return;
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const copy={
  'zh-cn':{title:'对局速览',intro:'按已收录样本胜率分档，展开分类查看对手。',labels:['有利','微有利','五五开','微不利','不利'],opponents:'个对手',empty:'暂无足够样本',thin:'样本不足，暂不判断',wins:'胜',losses:'负',ties:'和',matches:'场',coverage:'资料覆盖',unknown:'待补充',details:'判断方法、完整统计与来源',reference:'国际赛场记录，仅供参考',scope:'所选地区或卡池暂缺适用样本，不套用国际赛事优劣。',pending:'暂缺可准确对应此构筑的对局记录。',sample:'样本分档',rate:'样本胜率',opponent:'对手',record:'胜 / 负 / 和',interval:'95% 区间',source:'来源',checked:'资料核验',selected:'所选卡表',note:'胜率＝胜 ÷（胜＋负），和局单列。至少30场分出胜负的记录才分类；五五开为45%–55%，55%–60%之间为微有利，40%–45%之间为微不利，达到60%为有利，不超过40%为不利。按未舍入值判断。',caveat:'这是所列赛事样本的分档，不保证当前卡池或具体60张构筑的克制关系。镜像与未分类对手已排除；统计区间仅提示不确定性。'},
  zh:{title:'對局速覽',intro:'按已收錄樣本勝率分檔，展開分類查看對手。',labels:['有利','微有利','五五開','微不利','不利'],opponents:'個對手',empty:'暫無足夠樣本',thin:'樣本不足，暫不判斷',wins:'勝',losses:'負',ties:'和',matches:'場',coverage:'資料涵蓋',unknown:'待補充',details:'判斷方法、完整統計與來源',reference:'國際賽場記錄，僅供參考',scope:'所選地區或卡池暫缺適用樣本，不套用國際賽事優劣。',pending:'暫缺可準確對應此構築的對局記錄。',sample:'樣本分檔',rate:'樣本勝率',opponent:'對手',record:'勝 / 負 / 和',interval:'95% 區間',source:'來源',checked:'資料核驗',selected:'所選牌組',note:'勝率＝勝 ÷（勝＋負），和局單列。至少30場分出勝負的記錄才分類；五五開為45%–55%，55%–60%之間為微有利，40%–45%之間為微不利，達到60%為有利，不超過40%為不利。按未四捨五入值判斷。',caveat:'這是所列賽事樣本的分檔，不保證目前卡池或具體60張構築的剋制關係。鏡像與未分類對手已排除；統計區間僅提示不確定性。'},
  en:{title:'Matchup overview',intro:'Grouped by recorded win rate. Expand a group to see opponents.',labels:['Favorable','Slightly favorable','Even','Slightly unfavorable','Unfavorable'],opponents:'opponents',empty:'No sufficient sample yet',thin:'More samples needed',wins:'W',losses:'L',ties:'D',matches:'games',coverage:'Data coverage',unknown:'Not available',details:'Method, full statistics & sources',reference:'International event records · reference only',scope:'No applicable sample for this region or card pool. International grades are not applied.',pending:'No exact matchup record for this build yet.',sample:'Sample-based grades',rate:'Recorded win rate',opponent:'Opponent',record:'W / L / D',interval:'95% interval',source:'Source',checked:'Data verified',selected:'Selected list',note:'Win rate = wins / (wins + losses); draws are separate. At least 30 decided games are required. Even: 45%–55%; slightly favorable: above55% and below60%; slightly unfavorable: above40% and below45%; favorable: at least60%; unfavorable: at most40%. Use unrounded rates.',caveat:'These grades describe the listed event sample, not a guarantee for the current card pool or an exact 60-card build. Mirrors and unclassified opponents are excluded. Intervals indicate statistical uncertainty.'},
  ja:{title:'対戦相性の概要',intro:'収録済み対戦の勝率で分類。項目を開くと相手を確認できます。',labels:['有利','微有利','五分','微不利','不利'],opponents:'種類',empty:'十分なサンプルはまだありません',thin:'サンプル不足・判断保留',wins:'勝',losses:'敗',ties:'分',matches:'戦',coverage:'データ期間',unknown:'未収録',details:'分類方法・全統計・出典',reference:'国際大会の記録・参考のみ',scope:'選択地域・カードプールのデータが不足しています。国際大会の相性は適用しません。',pending:'この構築に対応する対戦記録は未収録です。',sample:'サンプルによる分類',rate:'収録勝率',opponent:'対戦相手',record:'勝 / 敗 / 分',interval:'95% 区間',source:'出典',checked:'資料確認',selected:'選択リスト',note:'勝率＝勝ち÷（勝ち＋負け）。引き分けは別記。勝敗のついた30戦以上が分類対象です。五分45%–55%、微有利55%超60%未満、微不利40%超45%未満、有利60%以上、不利40%以下。丸め前の値を使用。',caveat:'掲載大会のサンプルに基づく分類であり、現行カードプールや特定の60枚構築の相性を保証しません。ミラー・未分類相手は除外。区間は統計上の不確実性を示します。'}
 };
 const keys=['favored','slightly-favored','even','slightly-unfavored','unfavored'];
 function language(){const value=typeof document==='undefined'?'zh-Hans':document.documentElement.lang||'zh-Hans';return value.startsWith('en')?'en':value.startsWith('ja')?'ja':/hant|^zh$|tw|hk/i.test(value)?'zh':'zh-cn';}
 function classify(row,scope=true){
  if(!scope)return 'reference';
  const w=Number(row.wins),l=Number(row.losses),t=Number(row.ties??0);
  if(![w,l,t].every(v=>Number.isFinite(v)&&Number.isInteger(v)&&v>=0)||w+l<30)return 'pending';
  const rate=w/(w+l);
  return rate>=.6?'favored':rate>.55?'slightly-favored':rate>=.45?'even':rate>.4?'slightly-unfavored':'unfavored';
 }
 const rate=row=>Number.isFinite(row.winPercent)?row.winPercent.toFixed(1)+'%':'—';
 function rowHtml(row,t){return '<li class="ptcg-matchup-row"><div><b>'+esc(row.opponent)+'</b><small>'+esc(row.wins)+' '+t.wins+' · '+esc(row.losses)+' '+t.losses+' · '+esc(row.ties)+' '+t.ties+'</small></div><div class="ptcg-matchup-rate"><strong>'+rate(row)+'</strong><small>'+esc(row.matches)+' '+t.matches+'</small></div></li>';}
 function records(rows,t){return '<ul class="ptcg-matchup-list">'+rows.map(row=>rowHtml(row,t)).join('')+'</ul>';}
 function details(result,t){
  const source=result.source||{},url=/^https:\/\//.test(source.url||'')?'<a href="'+esc(source.url)+'" target="_blank" rel="noopener noreferrer">'+esc(source.name)+'</a>':esc(source.name);
  const raw=result.rows.length?'<div class="ptcg-matchup-raw-scroll" role="region" aria-label="'+t.record+'" tabindex="0"><table><thead><tr><th>'+t.opponent+'</th><th>'+t.record+'</th><th>'+t.rate+'</th><th>'+t.interval+'</th></tr></thead><tbody>'+result.rows.map(row=>'<tr><th scope="row">'+esc(row.opponent)+'</th><td>'+row.wins+' / '+row.losses+' / '+row.ties+'</td><td>'+rate(row)+'</td><td>'+(row.low===null?'—':row.low.toFixed(0)+'–'+row.high.toFixed(0)+'%')+'</td></tr>').join('')+'</tbody></table></div>':'';
  return '<details class="ptcg-matchup-details"><summary>'+t.details+'</summary><p>'+t.note+'</p><p>'+t.caveat+'</p><p>'+esc(source.region)+' · '+esc(source.format)+'</p><p>'+t.checked+'：'+esc(result.checked)+' · '+t.source+'：'+url+'</p>'+((result.context?.region||result.context?.format)?'<p>'+t.selected+'：'+esc([result.context.region,result.context.format,result.context.date].filter(Boolean).join(' · '))+'</p>':'')+raw+'</details>';
 }
 function render(context){
  const result=original.resolve('ptcg',context),t=copy[language()],source=result.source||{},dates=[source.coverageStart,source.coverageEnd].filter(Boolean),coverage=dates.length?[...new Set(dates)].join(' — '):t.unknown;
  let html='<section class="ptcg-matchup-simple" data-matchup-game="ptcg" data-matchup-state="'+esc(result.state)+'"><header><small>'+t.sample+'</small><h3>'+t.title+(result.archetype?' · '+esc(result.archetype):'')+'</h3><p>'+t.intro+'</p></header><p class="ptcg-matchup-coverage">'+t.coverage+'：'+esc(coverage)+'</p>';
  if(!result.scope.ok){
   html+='<p class="ptcg-matchup-scope">'+(result.rows.length?t.scope:t.pending)+'</p>';
   if(result.rows.length)html+='<details class="ptcg-matchup-reference"><summary>'+t.reference+' · '+result.rows.length+'</summary>'+records(result.rows,t)+'</details>';
  }else{
   const buckets=Object.fromEntries(keys.map(key=>[key,[]])),pending=[];
   for(const row of result.rows){const key=classify(row);if(buckets[key])buckets[key].push(row);else pending.push(row);}
   html+='<div class="ptcg-matchup-groups">'+keys.map((key,index)=>'<details class="ptcg-matchup-group ptcg-matchup-group--'+key+'" data-matchup-grade="'+key+'"'+(buckets[key].length?' open':'')+'><summary><span class="ptcg-matchup-badge">'+t.labels[index]+'</span><span>'+buckets[key].length+' '+t.opponents+'</span></summary>'+(buckets[key].length?records(buckets[key],t):'<p class="ptcg-matchup-empty">'+t.empty+'</p>')+'</details>').join('')+'</div>';
   if(pending.length)html+='<details class="ptcg-matchup-pending"><summary>'+t.thin+' · '+pending.length+' '+t.opponents+'</summary>'+records(pending,t)+'</details>';
   if(!result.rows.length)html+='<p class="ptcg-matchup-empty">'+t.pending+'</p>';
  }
  return html+details(result,t)+'</section>';
 }
 window.MetaLabPtcgMatchups=Object.freeze({version:'2026-11-14.1',classify,render,keys,minDecided:30});
 window.MetaLabMatchups=Object.freeze({...original,render:(game,context)=>original.resolve(game,{}).game==='ptcg'?render(context):original.render(game,context)});
})();
