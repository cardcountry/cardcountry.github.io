(()=>{
  'use strict';
  const translations={
    'zh-cn':{
      autoUpdate:'自动更新',navGames:'选择游戏',navFeatures:'资料功能',navAbout:'关于本站',heroIntro:'一个入口，查看实体卡牌游戏的规则、环境卡组、赛事卡表与完整卡牌资料。',chooseGame:'选择卡牌游戏',physicalOnly:'只收录实体 TCG 资料',liveGames:'已开放游戏',languages:'界面语言',verifiedData:'核实赛事资料',gamesTitle:'选择要查看的竞技游戏',gamesText:'已开放项目可以进入完整资料库；其余类别已预留扩充位置。',ptcgText:'查看 Standard 规则、主流与非主流卡组、完整赛事卡表、对局分析及多语言卡牌效果。',gcgText:'查看 GCG 规则、GD05 赛事环境、完整卡表、对局攻略、X 战绩与全卡牌图鉴。',beyText:'查看全球与日本赛事上位配置、主流环境、完整零件数值，并用组装台计算单颗或 3on3 套组。',opcgText:'查看官方规则、OP17.5 禁限后环境、同型赛事卡表、X 战绩、对局攻略与完整卡牌图鉴。',marvelText:'查看官方规则、核实赛事环境、44 份完整上位卡表、主流对局分析、未来预测与多语言官方全卡图鉴。',enterPtcg:'进入 PTCG 资料库',enterGcg:'进入 GCG 资料库',enterBey:'进入 BEYBLADE X 资料库',enterOpcg:'进入 OPCG 资料库',enterMarvel:'进入 MARVEL HERO RUSH 资料库',coming:'即将开放',featuresTitle:'从第一次上桌到赛事准备',featuresText:'每个已开放项目都使用一致的查找流程。',featureRules:'快速理解规则',featureRulesText:'整理实体卡牌游戏的开局、回合流程、构筑限制与胜利条件。',featureMeta:'读取当前环境',featureMetaText:'用赛事日期、参赛人数、名次与趋势图判断当前主流。',featureDecks:'查看完整卡表',featureDecksText:'同类型卡组集中呈现，并可直接点击卡图查看卡牌效果。',featureCards:'检索卡牌资料',featureCardsText:'按系列、颜色、类型、稀有度与等级筛选完整卡牌图鉴。',aboutTitle:'为实体卡牌玩家制作的资料入口',aboutText:'META LAB 由 Card Country KC 制作。本站优先采用官方与可核实的赛事来源，不把数码版或不明确图片混入实体卡牌资料。',startNow:'开始查看',maker:'制作是由 Card Country KC'
    },
    zh:{
      autoUpdate:'自動更新',navGames:'選擇遊戲',navFeatures:'資料功能',navAbout:'關於本站',heroIntro:'一個入口，查看實體卡牌遊戲的規則、環境牌組、賽事牌組與完整卡牌資料。',chooseGame:'選擇卡牌遊戲',physicalOnly:'只收錄實體 TCG 資料',liveGames:'已開放遊戲',languages:'介面語言',verifiedData:'核實賽事資料',gamesTitle:'選擇要查看的競技遊戲',gamesText:'已開放項目可以進入完整資料庫；其餘類別已預留擴充位置。',ptcgText:'查看 Standard 規則、主流與非主流牌組、完整賽事牌組、對局分析及多語言卡牌效果。',gcgText:'查看 GCG 規則、GD05 賽事環境、完整牌組、對局攻略、X 戰績與全卡牌圖鑑。',beyText:'查看全球與日本賽事上位配置、主流環境、完整零件數值，並用組裝台計算單顆或 3on3 套組。',opcgText:'查看官方規則、OP17.5 禁限後環境、同型賽事牌組、X 戰績、對局攻略與完整卡牌圖鑑。',marvelText:'查看官方規則、核實賽事環境、44 份完整上位牌組、主流對局分析、未來預測與多語言官方全卡圖鑑。',enterPtcg:'進入 PTCG 資料庫',enterGcg:'進入 GCG 資料庫',enterBey:'進入 BEYBLADE X 資料庫',enterOpcg:'進入 OPCG 資料庫',enterMarvel:'進入 MARVEL HERO RUSH 資料庫',coming:'即將開放',featuresTitle:'從第一次上桌到賽事準備',featuresText:'每個已開放項目都使用一致的查找流程。',featureRules:'快速理解規則',featureRulesText:'整理實體卡牌遊戲的開局、回合流程、構築限制與勝利條件。',featureMeta:'讀取目前環境',featureMetaText:'用賽事日期、參賽人數、名次與趨勢圖判斷目前主流。',featureDecks:'查看完整牌組',featureDecksText:'同類型牌組集中呈現，並可直接點擊卡圖查看卡牌效果。',featureCards:'檢索卡牌資料',featureCardsText:'按系列、顏色、類型、稀有度與等級篩選完整卡牌圖鑑。',aboutTitle:'為實體卡牌玩家製作的資料入口',aboutText:'META LAB 由 Card Country KC 製作。本站優先採用官方與可核實的賽事來源，不把數碼版或不明確圖片混入實體卡牌資料。',startNow:'開始查看',maker:'製作是由 Card Country KC'
    },
    ja:{
      autoUpdate:'自動更新',navGames:'ゲーム選択',navFeatures:'データ機能',navAbout:'このサイトについて',heroIntro:'実物TCGのルール、メタ、イベントデッキ、全カード情報を一つの入口から確認できます。',chooseGame:'TCGを選択',physicalOnly:'実物TCGデータのみ収録',liveGames:'公開中ゲーム',languages:'表示言語',verifiedData:'検証済み大会データ',gamesTitle:'競技ゲームを選択',gamesText:'公開中のタイトルは完全なデータベースへ移動できます。その他は拡張用に準備済みです。',ptcgText:'Standardルール、メタ／ローグデッキ、大会リスト、対面分析、多言語カード効果を確認。',gcgText:'GCGルール、GD05環境、完全なデッキリスト、攻略、X実績、全カード図鑑を確認。',beyText:'世界・日本の大会入賞コンボ、現在のメタ、全パーツ数値を確認し、1機または3on3を組み立てて性能を計算。',opcgText:'公式ルール、OP17.5制限後メタ、同型大会リスト、X戦績、対面攻略、全カード図鑑を確認。',marvelText:'公式ルール、検証済み大会環境、完全な上位44リスト、主要対面分析、将来予測、多言語公式カード図鑑を確認。',enterPtcg:'PTCGデータベースへ',enterGcg:'GCGデータベースへ',enterBey:'BEYBLADE Xデータベースへ',enterOpcg:'OPCGデータベースへ',enterMarvel:'MARVEL HERO RUSHデータベースへ',coming:'準備中',featuresTitle:'初対戦から大会準備まで',featuresText:'公開中の各タイトルで同じ検索フローを使用できます。',featureRules:'ルールを素早く理解',featureRulesText:'準備、ターン進行、構築制限、勝利条件を整理。',featureMeta:'現在のメタを読む',featureMetaText:'大会日、参加者数、順位、トレンドから環境を判断。',featureDecks:'完全なデッキを見る',featureDecksText:'同型デッキをまとめ、カード画像から効果を直接確認。',featureCards:'カード情報を検索',featureCardsText:'セット、色、種類、レアリティ、レベルで全カードを絞り込み。',aboutTitle:'実物TCGプレイヤーのための情報入口',aboutText:'META LABはCard Country KCが制作。公式・検証可能な大会情報を優先し、デジタル版や不明確な画像を実物TCGデータに混在させません。',startNow:'今すぐ見る',maker:'制作：Card Country KC'
    },
    en:{
      autoUpdate:'AUTO UPDATE',navGames:'CHOOSE GAME',navFeatures:'DATA TOOLS',navAbout:'ABOUT',heroIntro:'One entry point for physical TCG rules, metagames, tournament decklists and complete card data.',chooseGame:'CHOOSE A TCG',physicalOnly:'PHYSICAL TCG DATA ONLY',liveGames:'LIVE GAMES',languages:'INTERFACE LANGUAGES',verifiedData:'VERIFIED EVENT DATA',gamesTitle:'CHOOSE YOUR COMPETITIVE SYSTEM',gamesText:'Open titles lead to a complete database; the remaining systems are reserved for future expansion.',ptcgText:'Standard rules, mainstream and rogue decks, complete event lists, matchup analysis and multilingual card text.',gcgText:'GCG rules, the GD05 metagame, complete decklists, matchup guides, verified X results and the full card catalog.',beyText:'Explore global and Japanese tournament combos, the current meta, complete part telemetry, and calculate single or 3on3 builds.',opcgText:'Official rules, the post-ban OP17.5 field, grouped event lists, verified X results, matchup guides and the full catalog.',marvelText:'Official rules, verified tournament meta, 44 complete top lists, major matchup plans, forward model and a multilingual official catalog.',enterPtcg:'ENTER PTCG DATABASE',enterGcg:'ENTER GCG DATABASE',enterBey:'ENTER BEYBLADE X DATABASE',enterOpcg:'ENTER OPCG DATABASE',enterMarvel:'ENTER MARVEL HERO RUSH DATABASE',coming:'COMING SOON',featuresTitle:'FROM FIRST GAME TO EVENT PREP',featuresText:'Every live title follows the same consistent discovery flow.',featureRules:'LEARN THE RULES',featureRulesText:'Setup, turn flow, construction limits and win conditions for physical play.',featureMeta:'READ THE META',featureMetaText:'Judge the field through event dates, player counts, placements and usage trends.',featureDecks:'OPEN FULL DECKLISTS',featureDecksText:'Compare every list in one archetype and open card text directly from card art.',featureCards:'SEARCH CARD DATA',featureCardsText:'Filter complete catalogs by set, color, type, rarity and level.',aboutTitle:'A DATA ENTRANCE FOR PHYSICAL TCG PLAYERS',aboutText:'META LAB is made by Card Country KC. Official and verifiable event sources are prioritized, with digital-only or ambiguous imagery excluded from physical TCG data.',startNow:'START EXPLORING',maker:'CREATED BY CARD COUNTRY KC'
    }
  };
  const $=selector=>document.querySelector(selector),$$=selector=>[...document.querySelectorAll(selector)];
  let language='zh-cn';
  try{const saved=localStorage.getItem('metalab-home-language');if(translations[saved])language=saved}catch(error){}
  function setLanguage(next){
    language=translations[next]?next:'zh-cn';
    $('#homeLang').value=language;
    document.documentElement.lang=language==='zh'?'zh-Hant':language==='zh-cn'?'zh-Hans':language;
    $$('[data-i18n]').forEach(element=>{const value=translations[language][element.dataset.i18n];if(value)element.textContent=value});
    try{localStorage.setItem('metalab-home-language',language)}catch(error){}
  }
  const AUTO_KEY='metalab-auto-update';
  const homeAuto=$('#homeAutoUpdate');
  function readAutoUpdate(){try{return localStorage.getItem(AUTO_KEY)!=='off'}catch(error){return true}}
  function setAutoUpdate(enabled,persist=true){homeAuto.checked=enabled;if(persist){try{localStorage.setItem(AUTO_KEY,enabled?'on':'off')}catch(error){}}}
  homeAuto.addEventListener('change',event=>setAutoUpdate(event.target.checked));
  setAutoUpdate(readAutoUpdate(),false);
  $('#homeLang').addEventListener('change',event=>setLanguage(event.target.value));
  $('#homeMenu').addEventListener('click',()=>$('#homeNav').classList.toggle('open'));
  $$('#homeNav a').forEach(link=>link.addEventListener('click',()=>$('#homeNav').classList.remove('open')));
  const assetMap={
    'ptcg.html':['decks-data.js?v=13','sources-data.js?v=13','app.js?v=44'],
    'gcg.html':['gcg.css?v=9','gcg-data.js?v=4','gcg-x-data.js?v=4','gcg.js?v=7'],
    'beyblade.html':['beyblade.css?v=6','beyblade-data.js?v=2','beyblade.js?v=7'],
    'opcg.html':['opcg.css?v=11','opcg-data.js?v=2','opcg.js?v=5'],
    'marvel.html':['marvel.css?v=2','marvel-data.js?v=1','marvel.js?v=2']
  };
  const warmed=new Set();
  function prefetchPage(href){
    if(warmed.has(href))return;warmed.add(href);
    [href,...(assetMap[href]||[])].forEach(url=>{const link=document.createElement('link');link.rel='prefetch';link.href=url;document.head.appendChild(link)});
  }
  $$('.game-card').forEach(card=>{
    const href=card.getAttribute('href');
    ['pointerenter','focus','touchstart'].forEach(type=>card.addEventListener(type,()=>prefetchPage(href),{once:true,passive:true}));
    card.addEventListener('click',event=>{
      if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
      event.preventDefault();prefetchPage(href);$('#wipeLabel').textContent=card.dataset.destination||'META LAB';$('#pageWipe').classList.add('active');$('#pageWipe').setAttribute('aria-hidden','false');document.body.classList.add('is-leaving');setTimeout(()=>{window.location.href=href},330);
    });
  });
  const idle=window.requestIdleCallback||((callback)=>setTimeout(callback,900));
  idle(()=>{const connection=navigator.connection;if(!connection?.saveData&&!/2g/.test(connection?.effectiveType||'')){prefetchPage('ptcg.html');prefetchPage('gcg.html');prefetchPage('beyblade.html');prefetchPage('opcg.html');prefetchPage('marvel.html')}});
  window.addEventListener('pageshow',event=>{if(event.persisted){$('#pageWipe').classList.remove('active');$('#pageWipe').setAttribute('aria-hidden','true');document.body.classList.remove('is-leaving')}});
  setLanguage(language);
})();
