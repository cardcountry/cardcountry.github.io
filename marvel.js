(()=>{
  'use strict';
  const D=window.MARVEL_DATA||{cards:[],tournaments:[],videos:{},sources:[],xSignals:[]};
  const $=selector=>document.querySelector(selector);
  const $$=selector=>[...document.querySelectorAll(selector)];
  const esc=value=>String(value??'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const AUTO_KEY='metalab-auto-update';
  let uiLang='zh-cn',deckQuery='',cardQuery='',cardPage=1,cardView='image',deckView='image';
  let currentDeck=null,currentList=null,currentDeckTab='list',currentCard=null,toastTimer=null;

  // TRANSLATIONS
  const copy={
    'zh-cn':{navRules:'基础规则',navMeta:'环境卡组',navEvents:'赛事记录',navCards:'卡牌检索',navSources:'资料来源',autoUpdate:'官方资料自动同步',heroText:'从官方规则、当前赛事环境到完整 50 张上位卡表与多语言全卡图鉴，为实体 Marvel Hero Rush 玩家整理的站内竞技资料库。',heroMeta:'查看当前环境',heroCards:'检索完整图鉴',statCards:'官方卡图记录',statLists:'核实上位卡表',statEvents:'收录赛事',statLang:'界面语言',rulesTitle:'从守护时间线开始',ruleSetupTitle:'开局准备',ruleSetup:'双方各准备正好 50 张主牌组、9 张 Rush 牌组与 Rush Point 卡；随机决定先后，抽 6 张起手牌，可进行一次全手重抽。',ruleBuildTitle:'牌组构筑',ruleBuild:'主牌组可使用最多两种颜色；同一卡号最多 3 张。Starter Deck 是可直接使用的合法 50 张牌组。',ruleFlowTitle:'回合流程',ruleFlow:'Start → Draw → Action → Battle → Counter → End。部署角色、调整 BATTLE / BASE，再处理攻击与反击。',ruleWinTitle:'胜利条件',ruleWin:'成功攻击对手 Weakness 可获得 Rush Point；率先累积 9 点 Rush Point 的玩家获胜。',videoTitle:'教学与进阶裁定',videoText:'先用基础教学理解 Call、Set、BATTLE 与 Weakness，再查看进阶裁定和勘误。',phase1:'Start：处理开始阶段效果',phase2:'Draw：抽牌并整理资源',phase3:'Action / Battle：部署、移动与攻击',phase4:'Counter / End：反击后结束回合',metaTitle:'当前赛事环境',deckSearchLabel:'搜索卡组、选手、赛事或卡名',deckSearchPlaceholder:'例如 Red Blue / Spider-Man / Anjas…',chartTitle:'近期与此前环境矩形对比',chartNote:'最近 5 场赛事对比此前 3 场；比例只代表收录的上位卡表样本。',recent:'最近 5 场',prior:'此前 3 场',mainDecksTitle:'主流与新兴卡组',mainDecksText:'点击类型后一次显示所有同型完整卡表，再选择赛事版本。',predictionTitle:'未来主流预测',predictionNote:'依据近期占比变化、上位转换和新系列采用率推算；不是保证结果。',xTitle:'社群赛事信号',xText:'X 只用于发现线索；没有完整 50 张卡表的内容不会进入环境统计。',eventsTitle:'赛事日期、场地与上位记录',cardsTitle:'Marvel Hero Rush 全卡图鉴',cardSearchPlaceholder:'输入卡名、卡号、效果或特征…',clearFilters:'清除筛选',imageLangNote:'简中、繁中与英文显示对应官方卡图；日文界面暂使用官方英文卡图，因为官方尚未提供日文实体版。',imageView:'卡图',nameView:'卡名',loadMore:'载入更多卡牌',sourcesTitle:'筛选后的资料来源',sourcePolicyTitle:'资料处理原则',sourcePolicy:'规则、卡文与卡图以 Marvel Hero Rush 官方为准；赛事卡表采用公开上位记录并核对为完整 50 张。未公布参赛人数的赛事明确标记为未公开，不以 Top Cut 数量反推人数。',footerCredit:'制作是由 Card Country KC',disclaimer:'非官方玩家资料工具。MARVEL HERO RUSH 的名称、卡图及相关权利归 Marvel、CardFun、Jason Entertainment 与各权利人所有。',deckTabList:'完整卡表',deckTabGuide:'核心攻略',deckTabMatchup:'主流对局',deckTabVideo:'相关视频',effectTitle:'官方卡片效果',traitTitle:'特征',effectNote:'卡片资料来自官方公开卡牌接口；赛事裁定以最新官方规则和勘误为准。'},
    zh:{navRules:'基礎規則',navMeta:'環境牌組',navEvents:'賽事紀錄',navCards:'卡牌檢索',navSources:'資料來源',autoUpdate:'官方資料自動同步',heroText:'從官方規則、目前賽事環境到完整 50 張上位牌組與多語言全卡圖鑑，為實體 Marvel Hero Rush 玩家整理的站內競技資料庫。',heroMeta:'查看目前環境',heroCards:'檢索完整圖鑑',statCards:'官方卡圖紀錄',statLists:'核實上位牌組',statEvents:'收錄賽事',statLang:'介面語言',rulesTitle:'從守護時間線開始',ruleSetupTitle:'開局準備',ruleSetup:'雙方各準備正好 50 張主牌組、9 張 Rush 牌組與 Rush Point 卡；隨機決定先後，抽 6 張起手牌，可進行一次全手重抽。',ruleBuildTitle:'牌組構築',ruleBuild:'主牌組可使用最多兩種顏色；同一卡號最多 3 張。Starter Deck 是可直接使用的合法 50 張牌組。',ruleFlowTitle:'回合流程',ruleFlow:'Start → Draw → Action → Battle → Counter → End。部署角色、調整 BATTLE / BASE，再處理攻擊與反擊。',ruleWinTitle:'勝利條件',ruleWin:'成功攻擊對手 Weakness 可獲得 Rush Point；率先累積 9 點 Rush Point 的玩家獲勝。',videoTitle:'教學與進階裁定',videoText:'先用基礎教學理解 Call、Set、BATTLE 與 Weakness，再查看進階裁定和勘誤。',phase1:'Start：處理開始階段效果',phase2:'Draw：抽牌並整理資源',phase3:'Action / Battle：部署、移動與攻擊',phase4:'Counter / End：反擊後結束回合',metaTitle:'目前賽事環境',deckSearchLabel:'搜尋牌組、選手、賽事或卡名',deckSearchPlaceholder:'例如 Red Blue / Spider-Man / Anjas…',chartTitle:'近期與此前環境矩形對比',chartNote:'最近 5 場賽事對比此前 3 場；比例只代表收錄的上位牌組樣本。',recent:'最近 5 場',prior:'此前 3 場',mainDecksTitle:'主流與新興牌組',mainDecksText:'點擊類型後一次顯示所有同型完整牌組，再選擇賽事版本。',predictionTitle:'未來主流預測',predictionNote:'依據近期占比變化、上位轉換和新系列採用率推算；不是保證結果。',xTitle:'社群賽事信號',xText:'X 只用於發現線索；沒有完整 50 張牌組的內容不會進入環境統計。',eventsTitle:'賽事日期、場地與上位紀錄',cardsTitle:'Marvel Hero Rush 全卡圖鑑',cardSearchPlaceholder:'輸入卡名、卡號、效果或特徵…',clearFilters:'清除篩選',imageLangNote:'簡中、繁中與英文顯示對應官方卡圖；日文介面暫使用官方英文卡圖，因官方尚未提供日文實體版。',imageView:'卡圖',nameView:'卡名',loadMore:'載入更多卡牌',sourcesTitle:'篩選後的資料來源',sourcePolicyTitle:'資料處理原則',sourcePolicy:'規則、卡文與卡圖以 Marvel Hero Rush 官方為準；賽事牌組採用公開上位紀錄並核對為完整 50 張。未公布參賽人數的賽事明確標記為未公開，不以 Top Cut 數量反推人數。',footerCredit:'製作是由 Card Country KC',disclaimer:'非官方玩家資料工具。MARVEL HERO RUSH 的名稱、卡圖及相關權利歸 Marvel、CardFun、Jason Entertainment 與各權利人所有。',deckTabList:'完整牌組',deckTabGuide:'核心攻略',deckTabMatchup:'主流對局',deckTabVideo:'相關影片',effectTitle:'官方卡片效果',traitTitle:'特徵',effectNote:'卡片資料來自官方公開卡牌介面；賽事裁定以最新官方規則和勘誤為準。'},
    ja:{navRules:'基本ルール',navMeta:'環境デッキ',navEvents:'大会記録',navCards:'カード検索',navSources:'情報源',autoUpdate:'公式データ自動同期',heroText:'公式ルール、現在の大会環境、完全な50枚の上位リスト、多言語カードカタログを一つにまとめたMarvel Hero Rush競技データベース。',heroMeta:'現在のメタを見る',heroCards:'カードを検索',statCards:'公式カード画像',statLists:'検証済み上位リスト',statEvents:'収録大会',statLang:'表示言語',rulesTitle:'タイムラインを守る準備',ruleSetupTitle:'ゲームの準備',ruleSetup:'50枚ちょうどのメインデッキ、9枚のRushデッキ、Rush Pointカードを準備。ランダムに先後を決め、6枚引き、手札すべてを1度だけ引き直せます。',ruleBuildTitle:'デッキ構築',ruleBuild:'メインデッキは最大2色。同じカード番号は3枚まで。Starter Deckはそのまま使える合法な50枚デッキです。',ruleFlowTitle:'ターンの流れ',ruleFlow:'Start → Draw → Action → Battle → Counter → End。キャラクターを展開し、BATTLE / BASEを調整して攻撃と反撃を処理します。',ruleWinTitle:'勝利条件',ruleWin:'相手のWeaknessへの攻撃が成功するとRush Pointを獲得。先に9 Rush Pointへ到達したプレイヤーの勝利です。',videoTitle:'遊び方と上級裁定',videoText:'Call、Set、BATTLE、Weaknessの基本を学び、その後に上級裁定とエラッタを確認します。',phase1:'Start：開始時効果を処理',phase2:'Draw：カードを引き資源を整える',phase3:'Action / Battle：展開、移動、攻撃',phase4:'Counter / End：反撃後にターン終了',metaTitle:'現在の大会メタ',deckSearchLabel:'デッキ、選手、大会、カード名を検索',deckSearchPlaceholder:'例 Red Blue / Spider-Man / Anjas…',chartTitle:'直近と以前のメタ比較',chartNote:'直近5大会と以前3大会の比較。比率は収録した上位リストのサンプルのみです。',recent:'直近5大会',prior:'以前3大会',mainDecksTitle:'主流・新興デッキ',mainDecksText:'タイプを選ぶと同型の全リストを表示し、大会版を選択できます。',predictionTitle:'今後のメタ予測',predictionNote:'直近シェア変化、上位転換、新セット採用率によるモデル予測であり、結果の保証ではありません。',xTitle:'コミュニティ大会シグナル',xText:'Xは発見用。完全な50枚リストがない投稿は環境統計に入れません。',eventsTitle:'大会日程・会場・上位記録',cardsTitle:'Marvel Hero Rush 全カード',cardSearchPlaceholder:'カード名、番号、効果、特徴を入力…',clearFilters:'絞り込み解除',imageLangNote:'簡体字・繁体字・英語は各公式画像を表示。公式日本語版がないため、日本語UIでは公式英語画像と英語カード文を使用します。',imageView:'画像',nameView:'カード名',loadMore:'さらに表示',sourcesTitle:'選別済み情報源',sourcePolicyTitle:'データ方針',sourcePolicy:'ルール、カード文、画像は公式を優先。大会リストは公開上位記録から完全な50枚を確認。参加人数が未公開の場合は未公開と表示し、Top Cut数から推定しません。',footerCredit:'制作：Card Country KC',disclaimer:'非公式プレイヤーツール。MARVEL HERO RUSHの名称・画像等の権利はMarvel、CardFun、Jason Entertainmentほか各権利者に帰属します。',deckTabList:'完全リスト',deckTabGuide:'プレイガイド',deckTabMatchup:'主要対面',deckTabVideo:'関連動画',effectTitle:'公式カード効果',traitTitle:'特徴',effectNote:'カード情報は公式公開APIから取得。大会裁定は最新公式ルールとエラッタを参照してください。'},
    en:{navRules:'RULES',navMeta:'META',navEvents:'EVENTS',navCards:'CARD SEARCH',navSources:'SOURCES',autoUpdate:'AUTO-SYNC OFFICIAL DATA',heroText:'An on-site competitive desk for official rules, current tournament metagame, complete 50-card top lists and the multilingual Marvel Hero Rush catalog.',heroMeta:'VIEW CURRENT META',heroCards:'SEARCH ALL CARDS',statCards:'official card prints',statLists:'verified top lists',statEvents:'tracked events',statLang:'interface languages',rulesTitle:'Guard the timeline',ruleSetupTitle:'Game setup',ruleSetup:'Prepare exactly 50 cards, a 9-card Rush Deck and Rush Point card. Randomly decide turn order, draw 6 cards, and you may fully redraw once.',ruleBuildTitle:'Deck construction',ruleBuild:'Use no more than two colors. A single card number is limited to three copies. Starter Decks are legal, ready-to-play 50-card decks.',ruleFlowTitle:'Turn sequence',ruleFlow:'Start → Draw → Action → Battle → Counter → End. Call characters, manage BATTLE / BASE, then resolve attacks and counters.',ruleWinTitle:'Winning',ruleWin:'A successful attack into the opponent’s Weakness earns a Rush Point. The first player to reach 9 Rush Points wins.',videoTitle:'Learn and verify rulings',videoText:'Learn Call, Set, BATTLE and Weakness first, then consult advanced rulings and errata.',phase1:'Start: resolve start-of-turn effects',phase2:'Draw: draw and organize resources',phase3:'Action / Battle: deploy, move and attack',phase4:'Counter / End: counter, then end the turn',metaTitle:'Current tournament field',deckSearchLabel:'Search deck, player, event or card',deckSearchPlaceholder:'Try Red Blue / Spider-Man / Anjas…',chartTitle:'Recent versus prior field',chartNote:'The latest five events versus the prior three; shares only describe the collected top-list sample.',recent:'LATEST 5',prior:'PRIOR 3',mainDecksTitle:'Meta and emerging decks',mainDecksText:'Open an archetype to see every verified list of that type, then choose an event version.',predictionTitle:'Forward meta model',predictionNote:'Based on recent share change, top-cut conversion and new-set adoption. This is not a guarantee.',xTitle:'Community event signals',xText:'X is discovery-only; posts without a complete 50-card list do not enter the metagame sample.',eventsTitle:'Event dates, venues and finishes',cardsTitle:'Marvel Hero Rush card atlas',cardSearchPlaceholder:'Search name, code, effect or trait…',clearFilters:'CLEAR FILTERS',imageLangNote:'Simplified Chinese, Traditional Chinese and English show their matching official print. Japanese uses the official English print because no official Japanese physical edition is available.',imageView:'ART',nameView:'NAMES',loadMore:'LOAD MORE',sourcesTitle:'Curated sources',sourcePolicyTitle:'Data policy',sourcePolicy:'Rules, text and art follow official sources. Tournament entries are public top records cross-checked as complete 50-card lists. Unpublished attendance remains explicitly unknown and is never inferred from Top Cut size.',footerCredit:'Made by Card Country KC',disclaimer:'Unofficial player resource. MARVEL HERO RUSH names, card art and related rights belong to Marvel, CardFun, Jason Entertainment and their respective owners.',deckTabList:'FULL LIST',deckTabGuide:'PILOT GUIDE',deckTabMatchup:'META MATCHUPS',deckTabVideo:'VIDEOS',effectTitle:'OFFICIAL CARD EFFECT',traitTitle:'TRAITS',effectNote:'Card data comes from the public official card API. Use the newest official rules and errata for tournament rulings.'}
  };
  const t=key=>copy[uiLang]?.[key]||copy.en[key]||key;

  // DATA MODEL
  let cards=[...D.cards];
  const pickCanonical=input=>{
    const map=new Map();
    input.forEach(card=>{const prior=map.get(card.code);if(!prior||(['C','R','SR'].includes(card.rarity)&&!['C','R','SR'].includes(prior.rarity)))map.set(card.code,card)});
    return map;
  };
  let cardMap=pickCanonical(cards);
  const allLists=D.tournaments.flatMap(event=>event.lists.map((list,index)=>({...list,event,eventIndex:index,total:list.cards.reduce((sum,row)=>sum+Number(row[1]||0),0)})));
  const deckGroups=[...new Set(allLists.map(list=>list.archetype))].map(name=>{
    const lists=allLists.filter(list=>list.archetype===name);
    const recent=lists.filter(list=>D.tournaments.slice(0,5).some(event=>event.id===list.event.id)).length;
    const prior=lists.length-recent;
    return {name,lists,recent,prior,share:recent/Math.max(1,D.tournaments.slice(0,5).flatMap(event=>event.lists).length)*100,priorShare:prior/Math.max(1,D.tournaments.slice(5).flatMap(event=>event.lists).length)*100};
  }).sort((a,b)=>b.share-a.share||b.lists.length-a.lists.length);
  const heroCards={'Red / Blue':'BP01-077','Red / Green':'SD04-001','Yellow / Green':'SP01-021','Blue / Green':'SP01-085','Red / Yellow':'BP01-040','Yellow / Blue':'SD03-011'};
  const colorLabel=value=>{
    const map={Red:{'zh-cn':'红','zh':'紅',ja:'赤',en:'Red'},Blue:{'zh-cn':'蓝','zh':'藍',ja:'青',en:'Blue'},Green:{'zh-cn':'绿','zh':'綠',ja:'緑',en:'Green'},Yellow:{'zh-cn':'黄','zh':'黃',ja:'黄',en:'Yellow'},Purple:{'zh-cn':'紫','zh':'紫',ja:'紫',en:'Purple'},Orange:{'zh-cn':'橙','zh':'橙',ja:'橙',en:'Orange'}};
    return String(value).split(' / ').map(part=>map[part]?.[uiLang]||part).join(' / ');
  };
  const langKey=()=>uiLang==='ja'?'en':uiLang;
  const cardName=card=>card?.names?.[langKey()]||card?.names?.en||card?.code||'—';
  const cardEffect=card=>card?.effects?.[langKey()]||card?.effects?.en||'—';
  const cardTrait=card=>card?.traits?.[langKey()]||card?.traits?.en||'—';
  const cardImage=(card,large=false)=>{const key=card?.fallback?.[langKey()]||card?.fallback?.en;if(key&&!String(card?.id||'').startsWith('live-'))return `marvel-cards/${encodeURIComponent(key)}.webp`;return card?.[large?'large':'images']?.[langKey()]||card?.[large?'large':'images']?.en||''};
  const displayDate=value=>String(value||'—').replace(/-/g,'.');
  const deckHero=deck=>cardMap.get(heroCards[deck.name])||cardMap.get(deck.lists[0]?.cards[0]?.[0]);
  const deckHaystack=deck=>`${deck.name} ${deck.lists.map(list=>`${list.player} ${list.event.name} ${list.cards.map(row=>`${row[0]} ${cardName(cardMap.get(row[0]))}`).join(' ')}`).join(' ')}`.toLowerCase();
  const attendance=event=>event.players?`${event.players} ${uiLang==='en'?'players':'人'}`:(uiLang==='ja'?'参加人数未公開':uiLang==='en'?'attendance not published':uiLang==='zh'?'參賽人數未公開':'参赛人数未公开');
  const showToast=message=>{const toast=$('#toast');toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2800)};
  const openModal=id=>{$('#'+id).classList.add('open');document.body.style.overflow='hidden'};
  const closeModal=id=>{$('#'+id)?.classList.remove('open');if(!$('.modal.open'))document.body.style.overflow=''};

  function setLanguage(value){
    uiLang=copy[value]?value:'zh-cn';document.documentElement.lang=uiLang==='zh-cn'?'zh-Hans':uiLang==='zh'?'zh-Hant':uiLang;
    $$('#uiLang option').forEach(option=>option.selected=option.value===uiLang);
    $$('[data-i18n]').forEach(node=>{const value=t(node.dataset.i18n);if(value)node.textContent=value});
    $$('[data-i18n-placeholder]').forEach(node=>node.placeholder=t(node.dataset.i18nPlaceholder));
    renderAll();
    if(currentDeck)renderDeckModal(false);
    if(currentCard)openCard(currentCard.code,false);
  }

  // META RENDERING
  const strategy={
    'Red / Blue':{
      guide:{
        'zh-cn':['起手优先 BP01-002、BP01-011 与能补充 BASE 的 BP01-077；这套不是无脑快攻，手牌里的 Black Widow 同时是 -2000 Counter。','中盘用 BP01-066 回收被击退的低等级 Human，以一次手牌换回场面；SD03-011 的站位减攻与 BP01-064 的 BATTLE 条件要在移动前规划。','收尾先用降低 Power 的 Counter 制造战斗差，再让高 R、可再次攻击或二次展开的角色连续压 Weakness。不要把可救回场面的 BP01-066 过早当普通展开。'],
        zh:['起手優先 BP01-002、BP01-011 與能補充 BASE 的 BP01-077；這套不是無腦快攻，手牌裡的 Black Widow 同時是 -2000 Counter。','中盤用 BP01-066 回收被擊退的低等級 Human，以一次手牌換回場面；SD03-011 的站位減攻與 BP01-064 的 BATTLE 條件要在移動前規劃。','收尾先用降低 Power 的 Counter 製造戰鬥差，再讓高 R、可再次攻擊或二次展開的角色連續壓 Weakness。不要把可救回場面的 BP01-066 過早當普通展開。'],
        ja:['初手はBP01-002、BP01-011、BASEを補充するBP01-077を優先。単純な速攻ではなく、Black Widowは手札から-2000 Counterになる。','中盤はBP01-066で退場した低Lv Humanを戻し、SD03-011の位置別弱体化とBP01-064のBATTLE条件を移動前に設計する。','終盤はPower低下で戦闘差を作ってから、再攻撃・再展開を連続させてWeaknessを狙う。BP01-066を早く通常展開しすぎない。'],
        en:['Mulligan for BP01-002, BP01-011 and BP01-077, which replenishes BASE. This is not pure aggro: Black Widow is also a -2000 Counter from hand.','In midgame, use BP01-066 to return a low-level Human lost from BATTLE. Plan movement before resolving SD03-011 position debuffs and BP01-064’s BATTLE condition.','Close by creating a power gap with hand counters, then chain high-R, second-attack or replay pressure into Weakness. Do not spend BP01-066 as an ordinary body too early.']},
      matchup:{'Red / Blue':['even','Mirror: protect flexible Counter density, track BP01-066 and do not expose the first important attacker without a second wave.'],'Red / Green':['favored','Use blue position control to deny clean Loki attachments; force green to spend Counter bodies before committing the final Weakness sequence.'],'Yellow / Green':['unfavored','Remove or displace Web engines before they attach. If SP01-021 remains in BASE, expect swaps, Double Attack and a longer Counter phase.'],'Blue / Green':['even','Avoid feeding Green Goblin value. Preserve a card that can pressure BASE and pace threats around blue movement effects.']}
    },
    'Red / Green':{
      guide:{
        'zh-cn':['BP01-100 是低等级 Counter 与 R 调整点，BP01-106 能把多余绿色卡换成两张新牌；起手要有一张 1 级启动件加一条 3→6 级曲线。','中盘围绕 SD04-001 Loki：把它从手牌附着到 Human 会令目标 R 变 0 但 +1000 Power，适合保护重要角色或改变战斗计算，不等于无条件提速。','面对移位与裁切，先让 BP01-106/SD04-010 等低成本牌承担交换，再保留 BP01-011 与高等级威胁作为第二波。收尾前确认手牌 Counter 数量。'],
        zh:['BP01-100 是低等級 Counter 與 R 調整點，BP01-106 能把多餘綠色卡換成兩張新牌；起手要有一張 1 級啟動件加一條 3→6 級曲線。','中盤圍繞 SD04-001 Loki：把它從手牌附著到 Human 會令目標 R 變 0 但 +1000 Power，適合保護重要角色或改變戰鬥計算，不等於無條件提速。','面對移位與裁切，先讓低成本牌承擔交換，再保留 BP01-011 與高等級威脅作第二波。收尾前確認手牌 Counter 數量。'],
        ja:['BP01-100は低Lv Counter兼R調整、BP01-106は余った緑を2枚に交換する。初手はLv1の始動とLv3→6のカーブを確保。','中盤はSD04-001 Lokiが中心。Humanに付けるとRは0になるがPower+1000。重要キャラの保護と戦闘計算変更に使い、単なる加速とは考えない。','移動・prune相手には低コストを交換に使い、BP01-011と高Lv脅威を第二波に残す。詰める前にCounter枚数を確認。'],
        en:['BP01-100 is both a low-level Counter and R modifier; BP01-106 turns an excess green card into two fresh cards. Keep a level-1 starter plus a 3-to-6 curve.','SD04-001 Loki defines the midgame: attaching it to a Human sets R to 0 but adds 1000 Power. Use that to protect a key unit or alter combat math, not as unconditional acceleration.','Against movement and pruning, trade low-cost bodies first and preserve BP01-011 plus the high-level threat for wave two. Recount hand Counters before the closing turn.']},
      matchup:{'Red / Blue':['unfavored','Blue can break the attachment turn with position control. Present two medium threats instead of loading every resource onto one Human.'],'Red / Green':['even','The mirror turns on BP01-106 hand quality and who converts SD04-001 without losing tempo. Attack the opponent’s refill body first.'],'Yellow / Green':['even','Contest SP01-021 and SP01-025 early; save R reduction for the turn they threaten Ghost-Spider Double Attack.'],'Blue / Green':['favored','Pressure before its movement engine stabilizes; keep a cheap Counter body to answer a sudden Green Goblin ownership swap.']}
    },
    'Yellow / Green':{
      guide:{
        'zh-cn':['这是 Web 附着／交换引擎，不是把最大角色依费用拍下。优先找到 SP01-021 与 SP01-025：前者从 BASE 提供每回合附着，后者看顶三张找 Web。','SP01-022 Ghost-Spider 负责 Double Attack；SP01-026 可与 Ghost-Spider/Gwen 从手牌交换并降低对手 BATTLE 角色 Power。先布置交换目标，再宣告关键攻击。','SP01-065 在自己回合获得 AIR STRIKE、对手回合可转换为 BLOCK；SP01-068 被击退后仍能作为干扰附件。优势局扩大附件价值，劣势局不要为单次 Double Attack 清空手牌。'],
        zh:['這是 Web 附著／交換引擎，不是把最大角色依費用拍下。優先找到 SP01-021 與 SP01-025。','SP01-022 負責 Double Attack；SP01-026 可與 Ghost-Spider/Gwen 從手牌交換並降低對手 BATTLE 角色 Power。先佈置交換目標，再宣告關鍵攻擊。','SP01-065 在自己回合取得 AIR STRIKE、對手回合可轉換為 BLOCK；SP01-068 被擊退後仍能作干擾附件。劣勢局不要為單次 Double Attack 清空手牌。'],
        ja:['Webの付与・swapエンジン。最大Lvを順に出すデッキではない。SP01-021とSP01-025を優先し、BASE付与とトップ3検索を起動する。','SP01-022がDouble Attack、SP01-026がGhost-Spider/GwenとswapしBATTLEのPowerを下げる。先に交換先を用意してから重要な攻撃を宣言。','SP01-065は自分のターンにAIR STRIKE、相手ターンにBLOCKへ変換。SP01-068は退場後も妨害付与になる。不利時に一度のDouble Attackへ手札を使い切らない。'],
        en:['This is a Web attach/swap engine, not a curve-out deck. Prioritize SP01-021 and SP01-025 for once-per-turn BASE attachment and top-three Web selection.','SP01-022 supplies Double Attack; SP01-026 swaps with Ghost-Spider or Gwen from hand and reduces a BATTLE character’s Power. Set up the swap target before declaring the key attack.','SP01-065 converts into AIR STRIKE on your turn and BLOCK on theirs; SP01-068 remains disruptive after retreat. Extend attachment value when ahead, but never empty the hand for one Double Attack while behind.']},
      matchup:{'Red / Blue':['favored','Spread attached value across two Web characters so one movement effect cannot end the turn. Make Red/Blue spend Black Widow before the Double Attack turn.'],'Red / Green':['even','Deny its clean 3-to-6 curve with Shocker movement and random BASE pressure from Black Cat. Respect Loki combat math.'],'Yellow / Green':['even','In the mirror, SP01-021 uptime and SP01-025 selection matter more than the first attack. Keep a swap response in hand.'],'Blue / Green':['favored','Your swap engine can escape some fixed-position pressure. Avoid handing Green Goblin multiple turns of deck-prune value.']}
    }
  };

  function renderUsage(){
    const max=Math.max(1,...deckGroups.flatMap(deck=>[deck.share,deck.priorShare]));
    $('#usageChart').innerHTML=deckGroups.map(deck=>{const delta=deck.share-deck.priorShare;return `<button class="usage-cell" data-deck-name="${esc(deck.name)}"><strong>${esc(colorLabel(deck.name))}</strong><small>${deck.recent} / ${D.tournaments.slice(0,5).flatMap(event=>event.lists).length} · ${deck.prior} / ${D.tournaments.slice(5).flatMap(event=>event.lists).length}</small><div class="usage-bars"><i class="current" style="height:${Math.max(3,deck.share/max*60)}px"></i><i class="previous" style="height:${Math.max(3,deck.priorShare/max*60)}px"></i></div><span class="${delta<0?'down':''}">${delta>0?'+':''}${delta.toFixed(1)}pt</span></button>`}).join('');
  }
  function renderDecks(){
    const query=deckQuery.trim().toLowerCase();const shown=deckGroups.filter(deck=>!query||deckHaystack(deck).includes(query));
    $('#deckResultNote').textContent=query?(uiLang==='en'?`${shown.length} archetypes · all matching lists retained`:`${shown.length} 个类型 · 保留所有匹配卡表`):'';
    $('#deckGrid').innerHTML=shown.map((deck,index)=>{const hero=deckHero(deck);return `<button class="deck-card" data-deck-name="${esc(deck.name)}"><div class="deck-card-art"><img src="${esc(cardImage(hero))}" alt="${esc(cardName(hero))}" loading="lazy"></div><div class="deck-card-copy"><span>${index<2?'META CORE':index<4?'RISING SIGNAL':'ROGUE VERIFIED'}</span><h4>${esc(colorLabel(deck.name))}</h4><p>${esc(cardName(hero))} · ${esc(hero?.code||'')}</p><div class="deck-stats"><span><b>${deck.lists.length}</b><small>${uiLang==='en'?'LISTS':'完整卡表'}</small></span><span><b>${deck.share.toFixed(1)}%</b><small>${uiLang==='en'?'RECENT SHARE':'近期占比'}</small></span></div></div></button>`}).join('')||`<p>${uiLang==='en'?'No matching verified list.':'没有找到匹配的核实卡表。'}</p>`;
  }
  function renderPredictions(){
    const items=[
      {type:'hold',name:'Red / Blue',tag:'HOLD · HIGH SHARE',reason:{'zh-cn':'近 5 场占 60.7%，与此前 62.5% 接近；卡差、回场与站位控制仍完整，预计维持第一梯队。',zh:'近 5 場占 60.7%，與此前 62.5% 接近；卡差、回場與站位控制仍完整，預計維持第一梯隊。',ja:'直近60.7%、以前62.5%で高位横ばい。手札差、再展開、位置制御が揃い第一集団を維持する予測。',en:'60.7% in the latest sample versus 62.5% prior. Card advantage, replay and position control support a top-tier hold.'}},
      {type:'watch',name:'Red / Green',tag:'WATCH · PULLBACK',reason:{'zh-cn':'仍是第二大类型，但样本由 31.2% 降至 21.4%；需要证明它能稳定穿过蓝色控制与 Web 新体系。',zh:'仍是第二大類型，但樣本由 31.2% 降至 21.4%；需要證明它能穩定穿過藍色控制與 Web 新體系。',ja:'第2勢力だが31.2%から21.4%へ低下。青の制御と新Web系を安定して突破できるかが焦点。',en:'Still second, but down from 31.2% to 21.4%. It must prove a stable route through blue control and the new Web shell.'}},
      {type:'rise',name:'Yellow / Green',tag:'RISE · SPIDER-VERSE',reason:{'zh-cn':'此前样本为 0，近 5 场已有 2 份上位；SP01 的 Web 附着、交换与 Double Attack 显示真实上升信号。',zh:'此前樣本為 0，近 5 場已有 2 份上位；SP01 的 Web 附著、交換與 Double Attack 顯示真實上升信號。',ja:'以前0件から直近2件へ。SP01のWeb付与、swap、Double Attackが明確な上昇シグナル。',en:'Zero prior lists, now two recent tops. SP01 Web attachment, swapping and Double Attack form a credible rising signal.'}},
      {type:'watch',name:'Blue / Green',tag:'WATCH · SMALL SAMPLE',reason:{'zh-cn':'近 5 场有 2 份、此前为 0；移位与资源干扰值得观察，但样本太小，暂不能称为稳定主流。',zh:'近 5 場有 2 份、此前為 0；移位與資源干擾值得觀察，但樣本太小，暫不能稱為穩定主流。',ja:'直近2件、以前0件。移動と資源妨害は注目だが、標本が小さく安定メタとはまだ言えない。',en:'Two recent lists after zero prior. Movement and resource disruption are worth tracking, but the sample is too small to call established.'}}
    ];
    $('#predictionGrid').innerHTML=items.map(item=>`<article class="prediction-card ${item.type}"><span>${item.tag}</span><h4>${esc(colorLabel(item.name))}</h4><p>${esc(item.reason[uiLang]||item.reason.en)}</p></article>`).join('');
  }

  // DECK MODAL
  const genericGuide={
    'Blue / Green':{
      'zh-cn':['起手寻找低等级资源件与能改变 BATTLE / BASE 的卡；不要只因 Green Goblin 能抽两张就立刻把它送给对手。','中盘用 BP01-085 在结束阶段把 RETREAT 资源转成一次移动，再以 SD04-001、BP01-100 和 SP01-058 改变战斗位置与 R 计算。','把牌库裁切视为副收益，不要为磨牌放弃 Weakness 节奏；对快攻先保住能产生下一次移动的角色。'],
      zh:['起手尋找低等級資源件與能改變 BATTLE / BASE 的卡；不要只因 Green Goblin 能抽兩張就立刻把它送給對手。','中盤用 BP01-085 在結束階段把 RETREAT 資源轉成一次移動，再以 SD04-001、BP01-100 和 SP01-058 改變戰鬥位置與 R 計算。','把牌庫裁切視為副收益，不要為磨牌放棄 Weakness 節奏；對快攻先保住能產生下一次移動的角色。'],
      ja:['低Lv資源とBATTLE / BASE移動を探す。Green Goblinの2ドローだけを理由に相手側へ早く渡さない。','BP01-085でRETREATを終了時の移動へ変換し、SD04-001、BP01-100、SP01-058で位置とRを操作する。','デッキ削りは副次的価値。Weaknessテンポを捨てず、速い相手には次の移動を生むキャラを守る。'],
      en:['Find low-level resource pieces and BATTLE / BASE movement. Do not donate Green Goblin early merely because it draws two.','Turn RETREAT into end-step movement with BP01-085, then manipulate positions and R through SD04-001, BP01-100 and SP01-058.','Treat deck pruning as secondary value. Do not surrender Weakness tempo; against aggro, preserve the character that creates your next move.']},
    'Red / Yellow':{
      'zh-cn':['围绕 Ultron 与高投入的 3 级组件建立稳定起手，而不是追求单张高等级牌。','用红色减攻保护黄色的战斗交换，观察对手 Counter 后才决定是否扩大战线。','这是单份上位样本；照卡表练习时优先确认费用线与每回合可用 Counter，不把小样本当成已证实优势。'],zh:['圍繞 Ultron 與高投入的 3 級組件建立穩定起手。','用紅色減攻保護黃色戰鬥交換，觀察對手 Counter 後才擴大戰線。','這是單份上位樣本；先確認費用線與每回合可用 Counter，不把小樣本當成已證實優勢。'],ja:['Ultronと3枚採用のLv3群を軸に安定した初手を作る。','赤のPower低下で黄の戦闘交換を支え、相手Counterを見てから盤面を広げる。','上位1件のみ。カーブと毎ターンのCounterを検証し、小標本を有利証明と扱わない。'],en:['Build a stable opener around Ultron and the heavily played level-3 package.','Use red power reduction to protect yellow combat exchanges, expanding only after reading opposing Counters.','This is a single top-list sample. Test its curve and available Counter each turn rather than treating a small sample as proof of an edge.']},
    'Yellow / Blue':{
      'zh-cn':['起手需要黄色的战斗支点与蓝色补牌／站位件各一部分，避免只有同一颜色的高等级牌。','利用 SD03-004 在 BACK / BASE 的数值变化和 SD03-011 的区域减攻，先制造有利战斗再转向 Weakness。','这同样是单份历史样本；对 SP01 新环境要重新验证，尤其是 Web 交换能绕过固定站位计划。'],zh:['起手需要黃色戰鬥支點與藍色補牌／站位件各一部分。','利用 SD03-004 在 BACK / BASE 的數值變化和 SD03-011 的區域減攻，先製造有利戰鬥再轉向 Weakness。','這是單份歷史樣本；對 SP01 新環境要重新驗證 Web 交換。'],ja:['黄の戦闘軸と青の補充・位置カードを両方確保し、片色の高Lvだけの手札を避ける。','SD03-004のBACK / BASE補正とSD03-011の領域弱体化で有利交換を作り、その後Weaknessへ。','歴史標本1件。SP01のWeb swapに対して再検証が必要。'],en:['Keep both a yellow combat anchor and blue draw/position piece; avoid a hand of high levels from one color.','Exploit SD03-004’s BACK / BASE modifiers and SD03-011’s zone debuff to win combat before pivoting to Weakness.','This is one historical sample and needs retesting into SP01, especially Web swaps that bypass fixed-position plans.']}
  };
  const fallbackMatchups={
    'Red / Blue':{'Red / Blue':'Track BP01-066 recursion and keep a second attack wave.','Red / Green':'Break the Loki attachment turn with position control.','Yellow / Green':'Remove SP01-021 before the Web swap chain.','Blue / Green':'Do not give Green Goblin repeated pruning turns.'},
    'Red / Green':{'Red / Blue':'Split threats so blue cannot answer one stacked Human.','Red / Green':'Resource quality and BP01-106 conversion decide the mirror.','Yellow / Green':'Keep R reduction for Ghost-Spider Double Attack.','Blue / Green':'Pressure before its movement engine stabilizes.'},
    'Yellow / Green':{'Red / Blue':'Spread attachments and tax Black Widow before the Double Attack.','Red / Green':'Move early curve pieces and respect Loki combat math.','Yellow / Green':'SP01-021 uptime and swap density decide the mirror.','Blue / Green':'Avoid giving Green Goblin free long-game value.'},
    'Blue / Green':{'Red / Blue':'Preserve movement engines through Red/Blue’s first recursion wave.','Red / Green':'Interrupt its 3-to-6 curve before Loki changes combat math.','Yellow / Green':'Pressure SP01-021 and keep Web characters out of ideal zones.','Blue / Green':'The player extracting safer Green Goblin value gains the resource edge.'}
  };
  function openDeck(name){
    currentDeck=deckGroups.find(deck=>deck.name===name);if(!currentDeck)return;
    currentList=currentDeck.lists[0];currentDeckTab='list';deckView='image';renderDeckModal();openModal('deckModal');
  }
  function renderDeckModal(updateHeader=true){
    const hero=deckHero(currentDeck);if(updateHeader){$('#deckModalImage').src=cardImage(hero,true)||cardImage(hero);$('#deckModalImage').alt=cardName(hero);$('#deckModalRank').textContent=`${currentDeck.lists.length} VERIFIED 50-CARD LISTS · ${currentDeck.share.toFixed(1)}% RECENT SHARE`;$('#deckModalTitle').textContent=colorLabel(currentDeck.name);$('#deckModalSummary').textContent=uiLang==='en'?'Choose any event version below. Every list is stored and rendered on-site.':uiLang==='ja'?'下の大会版を選択してください。すべての完全リストをサイト内表示します。':'选择下方任一赛事版本；所有完整卡表都直接在站内显示。'}
    $('#deckListPicker').innerHTML=currentDeck.lists.map((list,index)=>`<button class="${list===currentList?'active':''}" data-list-index="${index}"><b>${esc(list.place)} · ${esc(list.player||'—')}</b><span>${esc(displayDate(list.event.date))} · ${esc(list.event.name)}</span><small>${list.total}/50 · ${esc(attendance(list.event))}</small></button>`).join('');
    $$('.deck-tabs button').forEach(button=>button.classList.toggle('active',button.dataset.deckTab===currentDeckTab));
    renderDeckDetail();
  }
  function listIntel(list){
    const rows=list.cards.map(([code,qty])=>({code,qty,card:cardMap.get(code)}));
    const average=rows.reduce((sum,row)=>sum+(Number(row.card?.level)||0)*row.qty,0)/Math.max(1,list.total);
    const curve=[rows.filter(row=>(row.card?.level||0)<=2).reduce((s,r)=>s+r.qty,0),rows.filter(row=>(row.card?.level||0)>=3&&(row.card?.level||0)<=4).reduce((s,r)=>s+r.qty,0),rows.filter(row=>(row.card?.level||0)>=5).reduce((s,r)=>s+r.qty,0)];
    const max=Math.max(...curve,1);const core=[...rows].sort((a,b)=>b.qty-a.qty||(b.card?.level||0)-(a.card?.level||0)).slice(0,6);
    const labels=uiLang==='en'?['LV 0–2','LV 3–4','LV 5+']:uiLang==='ja'?['Lv 0–2','Lv 3–4','Lv 5+']:['等级 0–2','等级 3–4','等级 5+'];
    return `<section class="deck-intel"><header><div><span>AUTO LIST ANALYSIS</span><h3>${uiLang==='en'?'Deck structure':uiLang==='ja'?'デッキ構造分析':'卡组结构分析'}</h3></div><small>${uiLang==='en'?'Calculated from this exact public list':'由当前公开完整卡表自动计算'}</small></header><div class="intel-stats"><span><b>${list.total}/50</b><small>${uiLang==='en'?'COMPLETE':'完整度'}</small></span><span><b>${average.toFixed(1)}</b><small>${uiLang==='en'?'AVG LEVEL':'平均等级'}</small></span><span><b>${new Set(rows.map(row=>row.card?.color).filter(Boolean)).size}</b><small>${uiLang==='en'?'COLORS':'颜色数'}</small></span><span><b>${rows.length}</b><small>${uiLang==='en'?'UNIQUE CODES':'独立卡号'}</small></span></div>${curve.map((count,index)=>`<div class="curve-row"><label>${labels[index]}</label><i><b style="width:${count/max*100}%"></b></i><strong>${count}</strong></div>`).join('')}<p>${uiLang==='en'?'Highest-copy cards:':'高投入核心：'} ${core.map(row=>`${row.qty}× ${cardName(row.card)}`).join(' · ')}</p></section>`;
  }
  function renderDeckList(){
    const list=currentList;const header=`<div class="deck-detail-head"><div><h3>${esc(list.place)} · ${esc(list.player||'—')}</h3><p>${esc(displayDate(list.event.date))} · ${esc(list.event.name)} · ${esc(list.event.location||'—')} · ${esc(attendance(list.event))}</p><p>${esc(list.event.source)} · ${list.total}/50 VERIFIED · ${uiLang==='en'?'STORED ON-SITE':'站内显示'}</p></div><div class="deck-view-toggle"><button class="${deckView==='image'?'active':''}" data-deck-view="image">${t('imageView')}</button><button class="${deckView==='name'?'active':''}" data-deck-view="name">${t('nameView')}</button></div></div>`;
    if(deckView==='name')return header+listIntel(list)+`<table class="deck-name-list"><tbody>${list.cards.map(([code,qty])=>{const card=cardMap.get(code);return `<tr data-card-code="${esc(code)}"><td>${qty}×</td><td>${esc(cardName(card))}</td><td>${esc(code)}</td><td>LV ${esc(card?.level??'—')} · ${esc(card?.color||'')}</td></tr>`}).join('')}</tbody></table>`;
    return header+listIntel(list)+`<div class="deck-cards">${list.cards.map(([code,qty])=>{const card=cardMap.get(code);return `<button class="deck-card-item" data-card-code="${esc(code)}"><span class="qty" data-qty="${qty}"><img src="${esc(cardImage(card))}" alt="${esc(cardName(card))}" loading="lazy"></span><b>${esc(cardName(card))}</b><small>${esc(code)}</small></button>`}).join('')}</div>`;
  }
  function renderGuide(){
    const steps=strategy[currentDeck.name]?.guide?.[uiLang]||genericGuide[currentDeck.name]?.[uiLang]||genericGuide[currentDeck.name]?.en||['Build around the highest-copy cards in the selected list.','Plan BATTLE / BASE movement before declaring combat.','This archetype has a small sample; test the exact curve rather than assuming a favorable field.'];
    const headings=uiLang==='en'?['OPENING & MULLIGAN','MIDGAME SEQUENCING','CLOSING & RISK']:uiLang==='ja'?['初手・引き直し','中盤の手順','終盤・リスク']:['起手与重抽','中盘操作','收尾与风险'];
    return `<div class="guide-grid">${steps.map((step,index)=>`<article><span>0${index+1} / ${headings[index]}</span><h3>${headings[index]}</h3><p>${esc(step)}</p></article>`).join('')}<article><span>LIST-SPECIFIC CHECK</span><h3>${uiLang==='en'?'Before every turn':'每回合检查'}</h3><p>${uiLang==='en'?'Count cards still available for Counter, choose the next BATTLE / BASE position, then decide which attacker actually needs protection.':'先计算仍可用于 Counter 的手牌，确认下一步 BATTLE / BASE 位置，再决定哪一名攻击者真正值得保护。'}</p></article></div>`;
  }
  function renderMatchups(){
    const opponents=deckGroups.slice(0,4);const known=strategy[currentDeck.name]?.matchup||{};const notes=fallbackMatchups[currentDeck.name]||{};
    return `<div class="matchup-grid">${opponents.map(opponent=>{const item=known[opponent.name];const state=item?.[0]||'even';const base=item?.[1]||notes[opponent.name]||'Protect the engine and adapt the BATTLE / BASE plan to the opposing curve.';const label=state==='favored'?'ADVANTAGE PLAN':state==='unfavored'?'RISK PLAN':'EVEN / SKILL PLAN';return `<article class="${state}"><span>${label}</span><h3>VS ${esc(colorLabel(opponent.name))}</h3><p>${esc(base)}</p></article>`}).join('')}</div><p class="official-note">${uiLang==='en'?'These are strategic field plans, not unverified win-rate claims.':'对局标签是主流牌型的操作计划，不冒充未经公开样本验证的胜率。'}</p>`;
  }
  function renderVideos(){const videos=D.videos[currentDeck.name]||D.videos.meta||[];return `<div class="video-grid">${videos.map(video=>`<article><iframe src="https://www.youtube-nocookie.com/embed/${esc(video.id)}" title="${esc(video.title)}" loading="lazy" allowfullscreen></iframe><h4>${esc(video.title)}</h4></article>`).join('')}</div>`}
  function renderDeckDetail(){const detail=$('#deckDetail');detail.innerHTML=currentDeckTab==='list'?renderDeckList():currentDeckTab==='guide'?renderGuide():currentDeckTab==='matchup'?renderMatchups():renderVideos()}

  // CARD CATALOG
  function populateSetFilter(){const sets=[...new Set(cards.map(card=>card.series).filter(Boolean))].sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}));$('#setFilter').innerHTML=`<option value="">ALL SERIES</option>${sets.map(set=>`<option value="${esc(set)}">${esc(set)}</option>`).join('')}`}
  function filteredCards(){
    const set=$('#setFilter').value,color=$('#colorFilter').value,level=$('#levelFilter').value,rarity=$('#rarityFilter').value,query=cardQuery.trim().toLowerCase();
    return cards.filter(card=>{
      if(set&&card.series!==set)return false;if(color&&card.color!==color)return false;if(level&&String(card.level)!==level)return false;if(rarity&&card.rarity!==rarity)return false;
      const haystack=`${card.code} ${Object.values(card.names||{}).join(' ')} ${Object.values(card.effects||{}).join(' ')} ${Object.values(card.traits||{}).join(' ')} ${card.color} ${card.rarity}`.toLowerCase();
      return !query||haystack.includes(query);
    });
  }
  function imageError(event){
    const img=event.currentTarget;const card=cards.find(item=>item.id===img.dataset.cardId)||cardMap.get(img.dataset.cardCode);const fallback=card?.fallback?.[langKey()]||card?.fallback?.en;
    const remote=card?.images?.[langKey()]||card?.images?.en;if(remote&&!img.dataset.fallback){img.dataset.fallback='1';img.src=remote;return}img.style.opacity='.18';
  }
  function renderCards(){
    const results=filteredCards(),shown=results.slice(0,cardPage*56),grid=$('#cardGrid');grid.classList.toggle('name-view',cardView==='name');
    grid.innerHTML=shown.map(card=>`<button class="card-item" data-card-id="${esc(card.id)}"><img src="${esc(cardImage(card))}" data-card-id="${esc(card.id)}" alt="${esc(cardName(card))}" loading="lazy"><b>${esc(cardName(card))}</b><small>${esc(card.code)} · ${esc(card.color)} · LV ${esc(card.level)} · ${esc(card.rarity)}</small><span class="name-effect">${esc(cardEffect(card))}</span></button>`).join('');
    grid.querySelectorAll('img').forEach(img=>img.addEventListener('error',imageError,{once:true}));
    $('#cardResultCount').textContent=uiLang==='ja'?`${results.length.toLocaleString()}件中 ${shown.length.toLocaleString()}件を表示`:uiLang==='en'?`SHOWING ${shown.length.toLocaleString()} OF ${results.length.toLocaleString()} PRINTS`:`显示 ${shown.length.toLocaleString()} / ${results.length.toLocaleString()} 张官方卡图记录`;
    $('#loadMoreCards').hidden=shown.length>=results.length;$$('.view-toggle button').forEach(button=>button.classList.toggle('active',button.dataset.view===cardView));
  }
  function openCard(reference,open=true){
    const card=cards.find(item=>item.id===reference)||cardMap.get(reference);if(!card){showToast(uiLang==='en'?'Card data not found.':'没有找到这张卡的资料。');return}currentCard=card;
    $('#cardModalImage').src=cardImage(card,true)||cardImage(card);$('#cardModalImage').dataset.cardId=card.id;$('#cardModalImage').alt=cardName(card);$('#cardModalImage').onerror=imageError;
    $('#cardModalCode').textContent=`${card.code} · ${card.series} · ${card.rarity}`;$('#cardModalName').textContent=cardName(card);
    const badges=[card.color,`LV ${card.level}`,card.power&&`POWER ${card.power}`,card.range&&`R ${card.range}`,card.type].filter(Boolean);$('#cardModalBadges').innerHTML=badges.map(value=>`<span>${esc(value)}</span>`).join('');
    $('#cardModalEffect').textContent=cardEffect(card);$('#cardModalTrait').textContent=cardTrait(card);if(open)openModal('cardModal');
  }

  // AUXILIARY SECTIONS
  function renderRuleVideos(){$('#ruleVideos').innerHTML=(D.videos.rules||[]).map(video=>`<article><iframe src="https://www.youtube-nocookie.com/embed/${esc(video.id)}" title="${esc(video.title)}" loading="lazy" allowfullscreen></iframe><h4>${esc(video.title)}</h4></article>`).join('')}
  function renderEvents(){
    $('#eventGrid').innerHTML=D.tournaments.map(event=>`<article class="event-card"><header><div><time>${esc(displayDate(event.date))}</time><h3>${esc(event.name)}</h3></div><b>${esc(attendance(event))}</b></header><p>${esc(event.location)} · ${esc(event.organizer)} · ${esc(event.source)}</p><div>${event.lists.map((list,index)=>`<button data-event-id="${esc(event.id)}" data-event-list="${index}"><b>${esc(list.place)}</b> ${esc(list.player||'—')} · ${esc(colorLabel(list.archetype))}</button>`).join('')}</div></article>`).join('');
  }
  function renderX(){
    const localized={
      'zh-cn':['公开对局记录提到快攻与控制对面；仅作发现信号，不视为完整卡表。','SP01 产品与 Infinity Clash 2026 赛事讯息；赛事卡表仍需另行核实。','五轮 Starter Deck 赛事观察，仅保留作环境背景。'],
      zh:['公開對局紀錄提到快攻與控制對面；僅作發現信號，不視為完整牌組。','SP01 產品與 Infinity Clash 2026 賽事訊息；賽事牌組仍需另行核實。','五輪 Starter Deck 賽事觀察，僅保留作環境背景。'],
      ja:['公開対戦記録はアグロとコントロール対面に言及。完全リストではなく発見シグナルのみ。','SP01製品とInfinity Clash 2026の告知。大会リストは別途検証が必要。','Starter Deck大会5回戦の観察。環境背景としてのみ保持。'],
      en:D.xSignals.map(signal=>signal.note)
    };
    $('#xGrid').innerHTML=D.xSignals.map((signal,index)=>`<article class="x-card"><span>X DISCOVERY · ${esc(signal.handle)}</span><h4>${esc(signal.title)}</h4><p>${esc(localized[uiLang]?.[index]||signal.note)}</p></article>`).join('');
  }
  function renderSources(){
    const roleCopy={
      'zh-cn':['官方规则、卡牌图鉴、卡图、产品与公告','核实上位赛事卡表与社群牌组分析','官方教学与 Infinity Clash 赛事公告','仅用作赛事与卡组线索发现；完整卡表必须另行核实'],
      zh:['官方規則、卡牌圖鑑、卡圖、產品與公告','核實上位賽事牌組與社群牌組分析','官方教學與 Infinity Clash 賽事公告','僅用作賽事與牌組線索發現；完整牌組必須另行核實'],
      ja:['公式ルール、カードリスト、画像、製品、告知','検証済み上位大会リストとコミュニティ分析','公式チュートリアルとInfinity Clash告知','大会・デッキ発見専用。完全リストは別途検証'],
      en:D.sources.map(source=>source.role)
    };
    $('#sourceGrid').innerHTML=D.sources.map((source,index)=>`<article class="source-card"><span>${index<2?'PRIMARY / VERIFIED':'DISCOVERY / CROSS-CHECK'}</span><h3>${esc(source.name)}</h3><p>${esc(roleCopy[uiLang]?.[index]||source.role)}</p><a href="${esc(source.url)}" target="_blank" rel="noopener">${uiLang==='ja'?'情報源を確認':uiLang==='en'?'VERIFY SOURCE':'查看来源记录'} ↗</a></article>`).join('');
  }
  function renderAll(){renderUsage();renderDecks();renderPredictions();renderEvents();renderX();renderSources();renderCards();renderRuleVideos()}

  // LIVE SYNC
  const apiLanguage={"zh-cn":'zh-CN',zh:'zh-TW',ja:'en',en:'en'};
  const dataLanguage={'zh-CN':'zh-cn','zh-TW':'zh',en:'en'};
  async function fetchOfficialLanguage(language){
    const response=await fetch(`https://server.marvelherorush.com/marvel/card/list?language=${encodeURIComponent(language)}&page=1&page_size=1000`,{cache:'no-store'});if(!response.ok)throw new Error(`official api ${response.status}`);const payload=await response.json();if(!Array.isArray(payload.list))throw new Error('invalid official payload');return payload;
  }
  function mergeOfficial(payload,language){
    const key=dataLanguage[language],used=new Set(),buckets=new Map();
    cards.forEach(card=>{const bucket=`${card.code}|${card.rarity}`;(buckets.get(bucket)||buckets.set(bucket,[]).get(bucket)).push(card)});
    payload.list.forEach(raw=>{
      const bucket=`${raw.card_no}|${raw.rarity}`,keyId=raw.image?.key;let card=(buckets.get(bucket)||[]).find(item=>!used.has(item)&&item.fallback?.[key]===keyId)||(buckets.get(bucket)||[]).find(item=>!used.has(item));
      if(!card){card={id:`live-${language}-${raw.id}`,code:raw.card_no,series:raw.product_series,rarity:raw.rarity,level:Number(raw.level)||0,range:Number(raw.attack_range)||0,power:Number(raw.power)||0,color:raw.attribute,type:raw.card_type,names:{},effects:{},traits:{},images:{},large:{},fallback:{}};cards.push(card);(buckets.get(bucket)||buckets.set(bucket,[]).get(bucket)).push(card)}
      used.add(card);card.series=raw.product_series||card.series;card.level=Number(raw.level)||card.level;card.range=Number(raw.attack_range)||card.range;card.power=Number(raw.power)||card.power;card.color=raw.attribute||card.color;card.type=raw.card_type||card.type;
      card.names[key]=raw.name;card.effects[key]=raw.effect;card.traits[key]=raw.feature;card.images[key]=raw.image?.variants?.small?.url||raw.image?.url||card.images[key];card.large[key]=raw.image?.variants?.medium?.url||raw.image?.variants?.large?.url||raw.image?.url||card.large[key];card.fallback[key]=raw.image?.key||card.fallback[key];
    });
    cardMap=pickCanonical(cards);
  }
  async function checkPublishedUpdate(){
    const toggle=$('#autoUpdate');if(!toggle.checked)return;const status=$('#syncStatus');status.classList.add('checking');status.classList.remove('error');
    try{
      const desired=[apiLanguage[uiLang],...['zh-CN','zh-TW','en']].filter((item,index,array)=>array.indexOf(item)===index);let synced=0;
      for(const language of desired){try{const payload=await fetchOfficialLanguage(language);mergeOfficial(payload,language);synced+=payload.total||payload.list.length}catch(error){if(language===desired[0])throw error}}
      populateSetFilter();renderCards();$('#statCards').textContent=cards.length.toLocaleString();$('#cardTotal').textContent=cards.length.toLocaleString();
      const stamp=`OFFICIAL API LIVE · ${new Date().toISOString().slice(0,10)} · ${synced.toLocaleString()} LANGUAGE RECORDS`;status.querySelector('span').textContent=stamp;$('#liveCardNote').textContent='OFFICIAL API · LIVE';
      try{localStorage.setItem('metalab-marvel-api-check',new Date().toISOString())}catch(error){}
    }catch(error){
      try{const published=await fetch(`marvel-data.js?check=${Date.now()}`,{method:'HEAD',cache:'no-store'});if(!published.ok)throw new Error('published check failed');status.querySelector('span').textContent=uiLang==='en'?'PUBLISHED DATA CHECKED · VERIFIED SNAPSHOT ACTIVE':'已检查发布资料 · 核实快照正常';$('#liveCardNote').textContent='PUBLISHED DATA · CHECKED'}
      catch(checkError){status.classList.add('error');status.querySelector('span').textContent=uiLang==='en'?'UPDATE CHECK UNAVAILABLE · VERIFIED SNAPSHOT ACTIVE':'暂时无法检查更新 · 已保留核实快照';$('#liveCardNote').textContent='VERIFIED SNAPSHOT · ACTIVE'}
    }finally{status.classList.remove('checking')}
  }

  // EVENTS AND BOOT
  function bindEvents(){
    $('#uiLang').addEventListener('change',event=>setLanguage(event.target.value));
    $('#menuBtn').addEventListener('click',()=>$('#nav').classList.toggle('open'));$$('#nav a').forEach(link=>link.addEventListener('click',()=>$('#nav').classList.remove('open')));
    $('#deckSearch').addEventListener('input',event=>{deckQuery=event.target.value;renderDecks()});$('#clearDeckSearch').addEventListener('click',()=>{deckQuery='';$('#deckSearch').value='';renderDecks();$('#deckSearch').focus()});
    $('#cardSearch').addEventListener('input',event=>{cardQuery=event.target.value;cardPage=1;renderCards()});
    ['setFilter','colorFilter','levelFilter','rarityFilter'].forEach(id=>$('#'+id).addEventListener('change',()=>{cardPage=1;renderCards()}));
    $('#clearFilters').addEventListener('click',()=>{cardQuery='';$('#cardSearch').value='';['setFilter','colorFilter','levelFilter','rarityFilter'].forEach(id=>$('#'+id).value='');cardPage=1;renderCards()});
    $$('.view-toggle button').forEach(button=>button.addEventListener('click',()=>{cardView=button.dataset.view;renderCards()}));$('#loadMoreCards').addEventListener('click',()=>{cardPage++;renderCards()});
    document.addEventListener('click',event=>{
      const eventList=event.target.closest('[data-event-id]');if(eventList){const tournament=D.tournaments.find(item=>item.id===eventList.dataset.eventId),list=tournament?.lists[Number(eventList.dataset.eventList)];if(list){openDeck(list.archetype);currentList=currentDeck.lists.find(item=>item.event.id===tournament.id&&item.eventIndex===Number(eventList.dataset.eventList))||currentList;renderDeckModal(false)}return}
      const deckButton=event.target.closest('[data-deck-name]');if(deckButton){openDeck(deckButton.dataset.deckName);return}
      const cardById=event.target.closest('[data-card-id]');if(cardById){openCard(cardById.dataset.cardId);return}
      const cardByCode=event.target.closest('[data-card-code]');if(cardByCode){openCard(cardByCode.dataset.cardCode);return}
      const listButton=event.target.closest('[data-list-index]');if(listButton&&currentDeck){currentList=currentDeck.lists[Number(listButton.dataset.listIndex)];renderDeckModal(false);return}
      const tab=event.target.closest('[data-deck-tab]');if(tab&&currentDeck){currentDeckTab=tab.dataset.deckTab;renderDeckModal(false);return}
      const deckViewButton=event.target.closest('[data-deck-view]');if(deckViewButton){deckView=deckViewButton.dataset.deckView;renderDeckDetail();return}
      const close=event.target.closest('[data-close]');if(close){closeModal(close.dataset.close);return}if(event.target.classList.contains('modal'))closeModal(event.target.id);
    });
    document.addEventListener('keydown',event=>{if(event.key==='Escape')$$('.modal.open').forEach(modal=>closeModal(modal.id))});
    const toggle=$('#autoUpdate');try{toggle.checked=localStorage.getItem(AUTO_KEY)!=='off'}catch(error){toggle.checked=true}toggle.addEventListener('change',event=>{try{localStorage.setItem(AUTO_KEY,event.target.checked?'on':'off')}catch(error){}if(event.target.checked)checkPublishedUpdate()});
  }
  populateSetFilter();bindEvents();
  $('#statCards').textContent=cards.length.toLocaleString();$('#statLists').textContent=allLists.length.toLocaleString();$('#statEvents').textContent=D.tournaments.length.toLocaleString();$('#cardTotal').textContent=cards.length.toLocaleString();$('#metaStamp').textContent=`${D.tournaments.length} EVENTS · ${allLists.length} VERIFIED 50-CARD LISTS`;
  setLanguage('zh-cn');if($('#autoUpdate').checked)setTimeout(checkPublishedUpdate,700);
})();
