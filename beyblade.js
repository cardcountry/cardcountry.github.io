(()=>{
  'use strict';
  const snapshot=window.BEYX_DATA||{meta:[],all:[],rare:[],summary:{},blades:[],ratchets:[],bits:[],assists:[],sources:[]};
  const state={
    meta:[...(snapshot.meta||[])],all:[...(snapshot.all||[])],rare:[...(snapshot.rare||[])],summary:{...(snapshot.summary||{})},
    blades:[...(snapshot.blades||[])].filter(p=>p&&p.name&&p.name!=='\\\\'),ratchets:[...(snapshot.ratchets||[])].filter(p=>p&&p.name),
    bits:[...(snapshot.bits||[])].filter(p=>p&&p.name&&p.name!=='\\\\'),assists:[...(snapshot.assists||[])],sources:[...(snapshot.sources||[])]
  };
  const partKind=part=>{
    const image=String(part?.image||'');
    if(image.includes('blades-cx-chip'))return 'lockChips';
    if(image.includes('blades-cx-main'))return 'mainBlades';
    if(image.includes('blades-cx-assist'))return 'assistBlades';
    if(image.includes('blades-cx-metal'))return 'metalBlades';
    if(image.includes('blades-cx-over'))return 'overBlades';
    return 'blades';
  };
  const componentParts={blades:[],lockChips:[],mainBlades:[],assistBlades:[],metalBlades:[],overBlades:[],ratchets:state.ratchets,bits:state.bits};
  state.blades.forEach(part=>{const kind=partKind(part);if(kind==='blades'&&!/^CX-/i.test(part.code||''))componentParts.blades.push(part);else if(kind!=='blades')componentParts[kind].push(part)});
  const assistNames=new Set(componentParts.assistBlades.map(part=>part.name));
  state.assists.forEach(name=>{if(name&&!assistNames.has(name)){componentParts.assistBlades.push({name,type:'Balance',weight:null,code:'CX',spin:'R',contacts:null,image:''});assistNames.add(name)}});
  if(!state.sources.some(source=>source.name==='BeyBase CX Guide'))state.sources.push({name:'BeyBase CX Guide',role:'Verified BX/UX three-part structure, CX Lock Chip / Main / Assist Blade structure and Expand Blade subsystem',url:'https://beybase.com/beyblade-x-custom-line-cx-buyers-guide/'});
  const $=selector=>document.querySelector(selector);
  const $$=selector=>[...document.querySelectorAll(selector)];
  const esc=value=>String(value??'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const number=value=>Number(value||0).toLocaleString();
  const labelType=value=>({Attack:t('attack'),Defense:t('defense'),Stamina:t('stamina'),Balance:t('balance')}[String(value||'').split(/[\s/(]/)[0]]||value||'—');
  const I18N={
    'zh-cn':{
      navMeta:'主流配置',navConfigs:'赛事配置',navParts:'零件数值',navBuilder:'组装分析',autoUpdate:'自动更新',heroText:'集中查看 BEYBLADE X 赛事上位配置、零件实测数值，并在 3on3 组装台即时计算整颗陀螺的数据与套组合法性。',startBuild:'开始组装',browseConfigs:'查看赛事配置',metaCombos:'主流配置',trackedCombos:'追踪配置',events:'WBO 赛事',observations:'赛事零件记录',metaTitle:'当前主流配置',usageTitle:'赛事零件使用量',usageNote:'数据为近 60 日 WBO 上位配置的零件出现次数。',configsTitle:'赛事配置资料库',configSearch:'搜索 Blade、Ratchet、Bit 或类型…',allTiers:'全部级别',allTypes:'全部类型',loadMore:'载入更多配置',recentPlacements:'近期赛事上位记录',partsTitle:'零件数值图鉴',blades:'刃轮',partSearch:'搜索零件名称、编号或类型…',loadMoreParts:'载入更多零件',partNote:'重量为目录值或玩家实测参考；同款零件会有制造公差。比赛前请以手上实物与当地规则为准。',builderTitle:'陀螺组装与数据分析',builderNote:'单颗计算 · 3ON3 重复零件检查 · 即时数值',singleMode:'单颗组装',deckMode:'3ON3 套组',estimatedWeight:'预估总重量',selectParts:'请选择完整零件',copyBuild:'复制配置',resetBuild:'重置',calculatedTitle:'计算数值说明',calculatedNote:'攻击、防御、持久、爆裂抗性与操控为依据零件类型、重量、Ratchet 高度／接触点及 Bit 形状／齿数计算的比较指数，并非官方印刷数值。',sourcesTitle:'资料来源与更新',sourcePolicyTitle:'资料处理原则',sourcePolicy:'赛事环境优先采用 WBO 上位记录与 BBX Vault 聚合；零件规格采用 BeybladeHub 与实测重量资料；规则以 TOMY 官方赛事规章为准。自动更新开启时每 10 分钟检查公开环境资料。',footerCredit:'制作是由 Card Country KC',disclaimer:'非官方玩家资料工具。BEYBLADE X 名称、图片及相关权利归 TOMY 与各权利人所有；赛事占比仅反映所列公开样本。',appearances:'上位出现',wins:'冠军',winRate:'夺冠率',metaIndex:'环境指数',placements:'相关赛事记录',noRecords:'暂无对应的近期记录',strength:'配置重点',caution:'注意事项',attack:'攻击',defense:'防御',stamina:'持久',balance:'平衡',weight:'重量',spin:'旋转',contacts:'接触点',height:'高度',shape:'底尖形状',gear:'齿数',shaft:'轴径',code:'编号',tier:'级别',blade:'刃轮',assist:'辅助刃（可选）',ratchet:'棘轮',bit:'轴心',incomplete:'配置尚未完成',legal:'配置合法，可用于套组记录',duplicate:'3ON3 不可使用重复的 Blade、Ratchet、Bit 或 Assist',copied:'配置已复制',copyFailed:'无法复制，请手动记录',noResults:'没有符合条件的资料',viewDetails:'查看详情',snapshot:'离线快照',syncing:'正在检查公开资料…',synced:'公开资料已同步',syncFailed:'实时更新暂时无法连接，继续使用离线快照',sourceRole:'资料用途',calculated:'计算指数',average:'套组平均',deckWeight:'套组总重',select:'请选择',unknown:'暂无资料',records:'笔记录'
    },
    zh:{
      navMeta:'主流配置',navConfigs:'賽事配置',navParts:'零件數值',navBuilder:'組裝分析',autoUpdate:'自動更新',heroText:'集中查看 BEYBLADE X 賽事上位配置、零件實測數值，並在 3on3 組裝台即時計算整顆陀螺的數據與套組合法性。',startBuild:'開始組裝',browseConfigs:'查看賽事配置',metaCombos:'主流配置',trackedCombos:'追蹤配置',events:'WBO 賽事',observations:'賽事零件記錄',metaTitle:'目前主流配置',usageTitle:'賽事零件使用量',usageNote:'數據為近 60 日 WBO 上位配置的零件出現次數。',configsTitle:'賽事配置資料庫',configSearch:'搜尋 Blade、Ratchet、Bit 或類型…',allTiers:'全部級別',allTypes:'全部類型',loadMore:'載入更多配置',recentPlacements:'近期賽事上位記錄',partsTitle:'零件數值圖鑑',blades:'刃輪',partSearch:'搜尋零件名稱、編號或類型…',loadMoreParts:'載入更多零件',partNote:'重量為目錄值或玩家實測參考；同款零件會有製造公差。比賽前請以手上實物與當地規則為準。',builderTitle:'陀螺組裝與數據分析',builderNote:'單顆計算 · 3ON3 重複零件檢查 · 即時數值',singleMode:'單顆組裝',deckMode:'3ON3 套組',estimatedWeight:'預估總重量',selectParts:'請選擇完整零件',copyBuild:'複製配置',resetBuild:'重設',calculatedTitle:'計算數值說明',calculatedNote:'攻擊、防禦、持久、爆裂抗性與操控為依據零件類型、重量、Ratchet 高度／接觸點及 Bit 形狀／齒數計算的比較指數，並非官方印刷數值。',sourcesTitle:'資料來源與更新',sourcePolicyTitle:'資料處理原則',sourcePolicy:'賽事環境優先採用 WBO 上位記錄與 BBX Vault 聚合；零件規格採用 BeybladeHub 與實測重量資料；規則以 TOMY 官方賽事規章為準。自動更新開啟時每 10 分鐘檢查公開環境資料。',footerCredit:'製作是由 Card Country KC',disclaimer:'非官方玩家資料工具。BEYBLADE X 名稱、圖片及相關權利歸 TOMY 與各權利人所有；賽事佔比僅反映所列公開樣本。',appearances:'上位出現',wins:'冠軍',winRate:'奪冠率',metaIndex:'環境指數',placements:'相關賽事記錄',noRecords:'暫無對應的近期記錄',strength:'配置重點',caution:'注意事項',attack:'攻擊',defense:'防禦',stamina:'持久',balance:'平衡',weight:'重量',spin:'旋轉',contacts:'接觸點',height:'高度',shape:'底尖形狀',gear:'齒數',shaft:'軸徑',code:'編號',tier:'級別',blade:'刃輪',assist:'輔助刃（可選）',ratchet:'棘輪',bit:'軸心',incomplete:'配置尚未完成',legal:'配置合法，可用於套組記錄',duplicate:'3ON3 不可使用重複的 Blade、Ratchet、Bit 或 Assist',copied:'配置已複製',copyFailed:'無法複製，請手動記錄',noResults:'沒有符合條件的資料',viewDetails:'查看詳情',snapshot:'離線快照',syncing:'正在檢查公開資料…',synced:'公開資料已同步',syncFailed:'即時更新暫時無法連線，繼續使用離線快照',sourceRole:'資料用途',calculated:'計算指數',average:'套組平均',deckWeight:'套組總重',select:'請選擇',unknown:'暫無資料',records:'筆記錄'
    },
    ja:{
      navMeta:'メタ構成',navConfigs:'大会構成',navParts:'パーツ数値',navBuilder:'組立分析',autoUpdate:'自動更新',heroText:'BEYBLADE Xの入賞コンボ、パーツ実測値を確認し、3on3ビルダーで性能指標とデッキの合法性を即時計算できます。',startBuild:'組み立てる',browseConfigs:'大会構成を見る',metaCombos:'メタ構成',trackedCombos:'追跡コンボ',events:'WBO大会',observations:'大会パーツ記録',metaTitle:'現在の主流構成',usageTitle:'大会パーツ使用数',usageNote:'直近60日間のWBO入賞構成におけるパーツ出現数です。',configsTitle:'大会コンボデータベース',configSearch:'ブレード、ラチェット、ビット、タイプを検索…',allTiers:'全ティア',allTypes:'全タイプ',loadMore:'さらに表示',recentPlacements:'最近の入賞記録',partsTitle:'パーツ数値カタログ',blades:'ブレード',partSearch:'パーツ名、品番、タイプを検索…',loadMoreParts:'さらにパーツを表示',partNote:'重量はカタログ値またはユーザー実測の参考値です。製造公差があるため、大会前に実物と地域ルールを確認してください。',builderTitle:'ベイブレード組立・性能分析',builderNote:'1機計算 · 3ON3重複チェック · 即時性能指標',singleMode:'1機ビルド',deckMode:'3ON3デッキ',estimatedWeight:'推定総重量',selectParts:'全パーツを選択してください',copyBuild:'構成をコピー',resetBuild:'リセット',calculatedTitle:'計算指標について',calculatedNote:'攻撃、防御、持久、バースト耐性、操作性は、タイプ・重量・ラチェット高／接触点・ビット形状／ギア数から算出した比較指標で、公式印刷値ではありません。',sourcesTitle:'データソースと更新',sourcePolicyTitle:'データ処理方針',sourcePolicy:'大会環境はWBO入賞記録とBBX Vault集計、パーツ仕様はBeybladeHubと実測重量、ルールはTOMY公式大会規定を優先します。自動更新中は10分ごとに公開環境データを確認します。',footerCredit:'制作：Card Country KC',disclaimer:'非公式のプレイヤー向けデータツールです。BEYBLADE Xの名称・画像等の権利はTOMYおよび各権利者に帰属します。使用率は掲載された公開サンプルのみを反映します。',appearances:'入賞採用',wins:'優勝',winRate:'優勝率',metaIndex:'メタ指数',placements:'関連入賞記録',noRecords:'最近の該当記録はありません',strength:'構成の強み',caution:'注意点',attack:'攻撃',defense:'防御',stamina:'持久',balance:'バランス',weight:'重量',spin:'回転',contacts:'接触点',height:'高さ',shape:'先端形状',gear:'ギア数',shaft:'軸径',code:'品番',tier:'ティア',blade:'ブレード',assist:'アシスト（任意）',ratchet:'ラチェット',bit:'ビット',incomplete:'構成が未完成です',legal:'合法な構成です',duplicate:'3ON3ではBlade、Ratchet、Bit、Assistを重複できません',copied:'構成をコピーしました',copyFailed:'コピーできません。手動で記録してください',noResults:'条件に一致するデータがありません',viewDetails:'詳細を見る',snapshot:'オフラインスナップショット',syncing:'公開データを確認中…',synced:'公開データを同期しました',syncFailed:'ライブ更新に接続できないため、スナップショットを使用します',sourceRole:'データ用途',calculated:'計算指標',average:'デッキ平均',deckWeight:'デッキ総重量',select:'選択してください',unknown:'データなし',records:'件'
    },
    en:{
      navMeta:'META COMBOS',navConfigs:'EVENT COMBOS',navParts:'PART DATA',navBuilder:'BUILD LAB',autoUpdate:'AUTO UPDATE',heroText:'Explore BEYBLADE X tournament-winning combinations and measured part data, then calculate performance indicators and 3on3 legality in the assembly lab.',startBuild:'START BUILDING',browseConfigs:'BROWSE EVENT COMBOS',metaCombos:'META COMBOS',trackedCombos:'TRACKED COMBOS',events:'WBO EVENTS',observations:'EVENT PART RECORDS',metaTitle:'CURRENT META COMBOS',usageTitle:'TOURNAMENT PART USAGE',usageNote:'Part appearances in top-finishing WBO combinations over the latest 60-day window.',configsTitle:'TOURNAMENT COMBO INDEX',configSearch:'Search Blade, Ratchet, Bit or type…',allTiers:'ALL TIERS',allTypes:'ALL TYPES',loadMore:'LOAD MORE COMBOS',recentPlacements:'RECENT EVENT PLACEMENTS',partsTitle:'PART TELEMETRY CATALOG',blades:'BLADES',partSearch:'Search part name, code or type…',loadMoreParts:'LOAD MORE PARTS',partNote:'Weights are catalog or community-measured references; manufacturing variance exists. Verify your physical parts and local rules before an event.',builderTitle:'ASSEMBLY & PERFORMANCE LAB',builderNote:'SINGLE BUILD · 3ON3 DUPLICATE CHECK · LIVE INDICATORS',singleMode:'SINGLE BUILD',deckMode:'3ON3 DECK',estimatedWeight:'ESTIMATED TOTAL WEIGHT',selectParts:'SELECT ALL REQUIRED PARTS',copyBuild:'COPY BUILD',resetBuild:'RESET',calculatedTitle:'ABOUT CALCULATED VALUES',calculatedNote:'Attack, defense, stamina, burst resistance and control are comparative indicators calculated from type, weight, Ratchet height/contacts and Bit shape/gear. They are not official printed statistics.',sourcesTitle:'SOURCES & UPDATE POLICY',sourcePolicyTitle:'DATA POLICY',sourcePolicy:'Tournament meta prioritizes WBO placements aggregated by BBX Vault; part specifications use BeybladeHub and measured weights; rules follow official TOMY event regulations. When enabled, live public data is checked every 10 minutes.',footerCredit:'CREATED BY CARD COUNTRY KC',disclaimer:'Unofficial player data tool. BEYBLADE X names, images and related rights belong to TOMY and their respective owners. Usage shares reflect only the listed public sample.',appearances:'PLACEMENTS',wins:'WINS',winRate:'WIN RATE',metaIndex:'META INDEX',placements:'RELATED RESULTS',noRecords:'NO MATCHING RECENT RESULTS',strength:'STRENGTH',caution:'CAUTION',attack:'ATTACK',defense:'DEFENSE',stamina:'STAMINA',balance:'BALANCE',weight:'WEIGHT',spin:'SPIN',contacts:'CONTACTS',height:'HEIGHT',shape:'TIP SHAPE',gear:'GEAR TEETH',shaft:'SHAFT',code:'CODE',tier:'TIER',blade:'BLADE',assist:'ASSIST (OPTIONAL)',ratchet:'RATCHET',bit:'BIT',incomplete:'BUILD IS INCOMPLETE',legal:'BUILD IS LEGAL',duplicate:'3ON3 CANNOT REPEAT A BLADE, RATCHET, BIT OR ASSIST',copied:'BUILD COPIED',copyFailed:'COPY FAILED — RECORD IT MANUALLY',noResults:'NO DATA MATCHES THESE FILTERS',viewDetails:'VIEW DETAILS',snapshot:'OFFLINE SNAPSHOT',syncing:'CHECKING PUBLIC DATA…',synced:'PUBLIC DATA SYNCED',syncFailed:'LIVE UPDATE UNAVAILABLE — USING SNAPSHOT',sourceRole:'DATA ROLE',calculated:'CALCULATED INDEX',average:'DECK AVERAGE',deckWeight:'DECK TOTAL WEIGHT',select:'SELECT',unknown:'NO DATA',records:'RECORDS'
    }
  };
  let language='zh-cn';
  try{const saved=localStorage.getItem('metalab-language')||localStorage.getItem('metalab-home-language');if(I18N[saved])language=saved}catch(error){}
  function t(key){return I18N[language]?.[key]||I18N.en[key]||key}
  function setLanguage(next){
    language=I18N[next]?next:'zh-cn';
    $('#uiLang').value=language;
    document.documentElement.lang=language==='zh'?'zh-Hant':language==='zh-cn'?'zh-Hans':language;
    $$('[data-i18n]').forEach(node=>{if(t(node.dataset.i18n))node.textContent=t(node.dataset.i18n)});
    $$('[data-i18n-placeholder]').forEach(node=>node.placeholder=t(node.dataset.i18nPlaceholder));
    $$('[data-bey-label]').forEach(node=>node.textContent=builderText(node.dataset.beyLabel));
    $$('[data-smart]').forEach(node=>node.textContent=smartText(node.dataset.smart));
    try{localStorage.setItem('metalab-language',language);localStorage.setItem('metalab-home-language',language)}catch(error){}
    renderAll();
    if(lastSmartResult)renderSmartResult(lastSmartResult);
    if($('#comboModal').classList.contains('open')&&currentModalCombo)openCombo(currentModalCombo);
  }
  const normal=value=>String(value||'').toLowerCase().replace(/[^a-z0-9]/g,'');
  /*
   * Never use partial-name matching for Blade artwork. Short CX part names such
   * as "O" and "G" used to match unrelated names (for example Valor Bison),
   * which is how an Over Blade was shown as a complete UX Blade.
   */
  const BLADE_ALIASES=new Map(Object.entries({
    ringaether:'heavensring',talonptera:'pteraswing',tacklegoat:'goattackle',
    scarletgaruda:'crimsongaruda',croccrunch:'crococrunch'
  }));
  const VERIFIED_BLADE_OVERRIDES=[
    {name:'Valor Bison',type:'Stamina',weight:null,code:'HASBRO UX',spin:'R',contacts:null,image:'bey-assets/blades-db-ValorBison.webp'},
    {name:'Cutter Shinobi',type:'Balance',weight:null,code:'HASBRO UX',spin:'R',contacts:null,image:'bey-assets/blades-db-CutterShinobi.webp'},
    {name:'Rampart Aegis',type:'Defense',weight:null,code:'HASBRO UX',spin:'R',contacts:null,image:'bey-assets/blades-db-RampartAegis.webp'},
    {name:'Seize Jaguar',type:'Balance',weight:null,code:'HASBRO UX',spin:'R',contacts:null,image:'bey-assets/blades-db-SeizeJaguar.webp'},
    {name:'Suppress Superion',type:'Balance',weight:null,code:'HASBRO UX',spin:'R',contacts:null,image:'bey-assets/blades-db-SuppressSuperion.webp'},
    {name:'Hack Viking',type:'Balance',weight:null,code:'HASBRO UX',spin:'R',contacts:null,image:'bey-assets/blades-db-HackViking.webp'},
    {name:'Pegasus Blast',type:'Attack',weight:null,code:'CX',spin:'R',contacts:null,image:'bey-assets/combo-cx-PegasusBlast.webp',composite:true},
    {name:'Ragna Rage',type:'Attack',weight:null,code:'CX EXPAND',spin:'R',contacts:null,image:'bey-assets/combo-cx-RagnaRage.webp',composite:true},
    {name:'Valkyrie Volt',type:'Attack',weight:null,code:'CX',spin:'R',contacts:null,image:'bey-assets/combo-cx-ValkyrieVolt.webp',composite:true},
    {name:'Phoenix Flare',type:'Defense',weight:null,code:'CX',spin:'R',contacts:null,image:'bey-assets/combo-cx-PhoenixFlare.webp',composite:true},
    {name:'Leon Fang',type:'Attack',weight:null,code:'CX',spin:'R',contacts:null,image:'bey-assets/combo-cx-LeonFang.webp',composite:true},
    {name:'Knight Fortress',type:'Defense',weight:null,code:'CX EXPAND',spin:'R',contacts:null,image:'bey-assets/combo-cx-KnightFortress.webp',composite:true},
    {name:'Hells Arc',type:'Stamina',weight:null,code:'CX',spin:'R',contacts:null,image:'bey-assets/combo-cx-HellsArc.webp',composite:true},
    {name:'Emperor Might',type:'Balance',weight:null,code:'CX',spin:'R',contacts:null,image:'bey-assets/combo-cx-EmperorMight.webp',composite:true},
    {name:'Dran Brave',type:'Attack',weight:null,code:'CX',spin:'R',contacts:null,image:'bey-assets/combo-cx-DranBrave.webp',composite:true},
    {name:'Croco Tread',type:'Defense',weight:null,code:'CX EXPAND',spin:'R',contacts:null,image:'bey-assets/combo-cx-CrocoTread.webp',composite:true},
    {name:'Cerberus Flame',type:'Stamina',weight:null,code:'CX',spin:'R',contacts:null,image:'bey-assets/combo-cx-CerberusFlame.webp',composite:true},
    {name:'Bahamut Blitz',type:'Attack',weight:null,code:'CX EXPAND',spin:'R',contacts:null,image:'bey-assets/combo-cx-BahamutBlitz.webp',composite:true},
    {name:'Enlil Hurricane',type:'Balance',weight:null,code:'CX INFINITY',spin:'R',contacts:null,image:'bey-assets/combo-cx-EnlilHurricane.webp',composite:true},
    {name:'Lightning L-Drago',type:'Attack',weight:null,code:'BXG-07 · MODE UNCONFIRMED',spin:'L',contacts:null,image:'bey-assets/combo-variant-LightningLDrago.webp',composite:true}
  ];
  const verifiedBladeMap=new Map(VERIFIED_BLADE_OVERRIDES.map(part=>[normal(part.name),part]));
  const INTEGRATED_BLADE_NAMES=new Set([
    'Glory Valkyrie','Bullet Griffon','Hells Nether','HellsNether','Valor Bison','Cutter Shinobi','Rampart Aegis','Seize Jaguar'
  ].map(normal));
  const isIntegratedBlade=name=>INTEGRATED_BLADE_NAMES.has(normal(name));
  const isLocklessBit=part=>part&&!part.type&&part.shape==='Multi-mode'&&Number(part.weight)>10;
  const isIntegratedCombo=combo=>combo?.system==='uxi'||(!combo?.ratchet&&combo?.bit&&isIntegratedBlade(combo?.blade));
  VERIFIED_BLADE_OVERRIDES.filter(part=>!part.composite).forEach(part=>{
    if(!componentParts.blades.some(item=>normal(item.name)===normal(part.name)))componentParts.blades.push(part);
  });
  const clockMirage=componentParts.blades.find(part=>normal(part.name)==='clockmirage');
  if(clockMirage&&Number(clockMirage.contacts)>20)clockMirage.contacts=null;
  const bisonBurrow=componentParts.blades.find(part=>normal(part.name)==='bisonburrow');
  if(bisonBurrow&&bisonBurrow.code==='UX-00-')bisonBurrow.code='UX-00';
  function comboPartsLine(combo){
    return [combo.assist,isIntegratedCombo(combo)?builderText('integratedLock'):combo.ratchet,combo.bit].filter(Boolean).join(' · ');
  }
  function bladeFor(name){
    const requested=normal(name),target=BLADE_ALIASES.get(requested)||requested,complete=componentParts.blades;
    if(!target)return {};
    return verifiedBladeMap.get(requested)||complete.find(item=>normal(item.name)===target)||state.blades.find(item=>normal(item.name)===target)||{};
  }
  function bitFor(name){return state.bits.find(item=>normal(item.name)===normal(name)||normal(item.code)===normal(name))||{}}
  function comboName(combo){
    if(combo.system==='cx')return [combo.lockChip,combo.structure==='expand'?combo.metalBlade:combo.mainBlade,combo.structure==='expand'?combo.overBlade:'',combo.assist,combo.ratchet,combo.bit].filter(Boolean).join(' · ');
    if(isIntegratedCombo(combo))return [combo.blade,combo.bit].filter(Boolean).join(' · ');
    return [combo.blade,combo.system==='bxux'?'':combo.assist,combo.ratchet,combo.bit].filter(Boolean).join(' · ')
  }
  function typeClass(type){const value=String(type||'').toLowerCase();return ['attack','defense','stamina','balance'].find(key=>value.includes(key))||'balance'}
  function empty(message=t('noResults')){return `<div class="empty-state"><b>NO SIGNAL</b><span>${esc(message)}</span></div>`}
  function updateSummary(){
    const summary=state.summary||{};
    $('#statCombos').textContent=number(state.meta.length);$('#statTracked').textContent=number(state.all.length);
    $('#statEvents').textContent=number(summary.events);$('#statParts').textContent=number(summary.parts);
    $('#configCount').textContent=number(state.all.length);$('#partCount').textContent=number(Object.values(componentParts).reduce((sum,items)=>sum+items.length,0));
    $('#metaRange').textContent=`WBO · ${summary.week||'SNAPSHOT'} · ${summary.start||'—'} → ${summary.end||'—'}`;
    $('#syncStatus').textContent=`${autoEnabled?'LIVE CHECK':'SNAPSHOT'} · ${summary.week||'LOCAL'}`;
  }
  let usageTab='blades';
  function renderUsage(){
    const rows=usageTab==='bits'?(state.summary.top_bits||[]):(state.summary.top_blades||[]),max=Math.max(1,...rows.map(row=>Number(row[1])||0));
    $('#usageBars').innerHTML=rows.slice(0,8).map(([name,value])=>`<div class="usage-row"><label title="${esc(name)}">${esc(name)}</label><div class="usage-track"><i style="width:${Math.max(3,Number(value)/max*100)}%"></i></div><b>${number(value)}</b></div>`).join('')||empty();
  }
  function renderMeta(){
    $('#metaGrid').innerHTML=state.meta.slice(0,8).map((combo,index)=>{
      const blade=bladeFor(combo.blade),rate=combo.app?Math.round((combo.wins||0)/combo.app*100):0;
      return `<button class="meta-card ${typeClass(combo.cat)}" data-combo-kind="meta" data-combo-index="${index}"><span class="meta-rank"><b>${String(index+1).padStart(2,'0')}</b>${esc(t('tier'))} ${esc(combo.tier||'—')}</span><h3>${esc(combo.blade)}</h3><div class="combo-line">${esc(comboPartsLine(combo)||'CUSTOM SYSTEM')}</div><div class="meta-numbers"><span><b>${number(combo.app)}</b>${esc(t('appearances'))}</span><span><b>${number(combo.wins)}</b>${esc(t('wins'))}</span><span><b>${rate}%</b>${esc(t('winRate'))}</span></div>${blade.image?`<img loading="lazy" src="${esc(blade.image)}" alt="${esc(combo.blade)}">`:''}</button>`
    }).join('')||empty();
    renderUsage();
  }
  let configLimit=18;
  function filteredConfigs(){
    const query=normal($('#configSearch').value),tier=$('#tierFilter').value,type=$('#typeFilter').value;
    return state.all.filter(combo=>{
      const haystack=normal([combo.blade,combo.assist,combo.ratchet,combo.bit,combo.cat].join(' '));
      return (!query||haystack.includes(query))&&(!tier||combo.tier===tier)&&(!type||String(combo.cat||'').includes(type));
    });
  }
  function renderConfigs(){
    const filtered=filteredConfigs(),shown=filtered.slice(0,configLimit);
    $('#configGrid').innerHTML=shown.map(combo=>{
      const original=state.all.indexOf(combo),blade=bladeFor(combo.blade);
      return `<button class="config-card ${typeClass(combo.cat)}" data-combo-kind="all" data-combo-index="${original}"><span>${esc(combo.cat||t('unknown'))} · ${esc(t('tier'))} ${esc(combo.tier||'—')}</span><h3>${esc(combo.blade)}</h3><p>${esc(comboPartsLine(combo)||'—')}</p><footer><small><b>${number(combo.app)}</b><br>${esc(t('appearances'))}</small><small><b>${number(combo.wins)}</b><br>${esc(t('wins'))}</small><small><b>${number(combo.meta)}</b><br>${esc(t('metaIndex'))}</small></footer>${blade.image?`<img loading="lazy" src="${esc(blade.image)}" alt="${esc(combo.blade)}">`:''}</button>`
    }).join('')||empty();
    $('#configCount').textContent=number(filtered.length);
    $('#loadMore').hidden=shown.length>=filtered.length;
  }
  function formatDate(value){try{return new Intl.DateTimeFormat(language==='zh-cn'?'zh-CN':language==='zh'?'zh-TW':language==='ja'?'ja-JP':'en-GB',{year:'numeric',month:'short',day:'numeric'}).format(new Date(value))}catch(error){return value}}
  function renderPlacements(){
    $('#placementGrid').innerHTML=state.rare.slice(0,12).map(record=>{const blade=bladeFor(record.blade);return `<article class="placement-card"><time>${esc(formatDate(record.date||''))}</time><i>#${esc(record.place||'—')}</i><b>${esc(record.blade)}</b><span>${esc(comboPartsLine(record)||'—')}</span>${blade.image?`<img loading="lazy" src="${esc(blade.image)}" alt="${esc(record.blade)}">`:''}</article>`}).join('')||empty();
  }
  let partTab='blades',partLimit=20;
  function currentParts(){return componentParts[partTab]||[]}
  function filteredParts(){
    const query=normal($('#partSearch').value),type=$('#partType').value;
    return currentParts().filter(part=>(!query||normal([part.name,part.code,part.type,part.shape].join(' ')).includes(query))&&(!type||part.type===type));
  }
  function metric(label,value,unit=''){return `<div><small>${esc(label)}</small><b>${value!==null&&value!==undefined&&value!==''?`${esc(value)}${unit}`:'—'}</b></div>`}
  function renderParts(){
    const filtered=filteredParts(),shown=filtered.slice(0,partLimit);
    $('#partsGrid').innerHTML=shown.map(part=>{
      let metrics='';
      if(['blades','lockChips','mainBlades','assistBlades','metalBlades','overBlades'].includes(partTab))metrics=metric(t('weight'),part.weight,'g')+metric(t('spin'),part.spin)+(partTab==='blades'&&isIntegratedBlade(part.name)?metric(builderText('system'),builderText('integratedLock')):metric(t('contacts'),part.contacts))+metric(t('code'),part.code||(partTab==='blades'?'BX / UX':'CX'));
      if(partTab==='ratchets')metrics=metric(t('weight'),part.weight,'g')+metric(t('contacts'),part.contacts)+metric(t('height'),part.height)+metric(language==='en'?'TYPE':language==='ja'?'タイプ':'类型',labelType(part.type));
      if(partTab==='bits')metrics=metric(t('weight'),part.weight,'g')+metric(t('shape'),part.shape)+(isLocklessBit(part)?metric(language==='en'?'LOCK':language==='ja'?'ロック':'固锁',language==='en'?'NONE':language==='ja'?'なし':'无'):metric(t('gear'),part.gear))+metric(t('height'),part.height);
      return `<article class="part-card ${typeClass(part.type)}"><div class="part-image">${part.image?`<img loading="lazy" src="${esc(part.image)}" alt="${esc(part.name)}">`:''}</div><span>${esc(part.code||partTab.slice(0,-1).toUpperCase())} · ${esc(labelType(part.type))}${partTab==='blades'&&isIntegratedBlade(part.name)?` · ${esc(builderText('integratedLock'))}`:''}</span><h3 title="${esc(part.name)}">${esc(part.name)}</h3><div class="part-metrics">${metrics}</div></article>`
    }).join('')||empty();
    $('#partCount').textContent=number(filtered.length);$('#loadMoreParts').hidden=shown.length>=filtered.length;
  }
  function renderSources(){
    $('#sourceGrid').innerHTML=state.sources.map((source,index)=>`<a class="source-card" href="${esc(source.url)}" target="_blank" rel="noopener"><span>${String(index+1).padStart(2,'0')}</span><h3>${esc(source.name)}</h3><p><b>${esc(t('sourceRole'))}</b>${esc(source.role)}</p><i>↗</i></a>`).join('');
  }
  let buildMode='single';
  const emptyBuild=()=>({system:'bxux',structure:'standard',blade:'',lockChip:'',mainBlade:'',metalBlade:'',overBlade:'',assist:'',ratchet:'',bit:'',bladeWeight:''});
  let builds=[emptyBuild(),emptyBuild(),emptyBuild()];
  const averageWeight=(items,fallback)=>{const values=items.map(item=>Number(item.weight)).filter(value=>value>0);return values.length?values.reduce((a,b)=>a+b,0)/values.length:fallback};
  const fallbackWeight={blade:averageWeight(componentParts.blades,34),lockChip:1.73,mainBlade:30.2,metalBlade:28.5,overBlade:3.8,assist:5.1,ratchet:averageWeight(state.ratchets,7),bit:averageWeight(state.bits,2.5)};
  function options(items,current,placeholder,key='name'){
    return `<option value="">${esc(placeholder)}</option>`+items.slice().sort((a,b)=>String(a[key]||a).localeCompare(String(b[key]||b),'en')).map(item=>{const value=typeof item==='string'?item:item[key];return `<option value="${esc(value)}" ${value===current?'selected':''}>${esc(value)}</option>`}).join('');
  }
  function choices(items,current){return items.map(([value,label])=>`<option value="${esc(value)}" ${value===current?'selected':''}>${esc(label)}</option>`).join('')}
  function partByName(kind,name){return (componentParts[kind]||[]).find(part=>part.name===name)||{}}
  function builderBlades(system){
    const integrated=componentParts.blades.filter(part=>isIntegratedBlade(part.name));
    const missing=[...new Set(state.all.filter(combo=>isIntegratedCombo(combo)).map(combo=>combo.blade))].filter(name=>!integrated.some(part=>normal(part.name)===normal(name))).map(name=>({name,type:state.all.find(combo=>normal(combo.blade)===normal(name))?.cat||'Balance',weight:null,code:'UX',spin:'R',contacts:null,image:''}));
    return system==='uxi'?[...integrated,...missing]:componentParts.blades.filter(part=>!isIntegratedBlade(part.name));
  }
  function builderText(key){
    const copy={
      'zh-cn':{measured:'战刃总成实测重量',weightHint:'留空则使用目录值或估算值',notice:'BX／传统 UX 使用战刃、棘轮和轴心；UX Expand 的固锁已整合在战刃内，只需选择一体式战刃与轴心。CX 才使用纹章／锁芯、主战刃及辅助战刃。输入战刃总成实测克数后会覆盖估算值。',mark:'实测',system:'系统',bxux:'BX / UX 三件式',uxi:'UX 固锁一体式',cx:'CX 自定义式',integratedLock:'内置固锁',integratedBlade:'UX 一体式战刃',structure:'CX 战刃结构',standard:'标准：主战刃',expand:'Expand：金属＋上层',lockChip:'纹章／锁芯',mainBlade:'主战刃',metalBlade:'金属战刃',overBlade:'上层战刃',assistBlade:'辅助战刃',completeBlade:'BX／UX 完整战刃',partComplete:'BX／UX 战刃',partChip:'CX 纹章／锁芯',partMain:'CX 主战刃',partAssist:'CX 辅助战刃',partMetal:'CX 金属战刃',partOver:'CX 上层战刃',systemNote:'系统槽位会自动限制零件：UX 一体式仅显示战刃与轴心，不再要求棘轮。'},
      zh:{measured:'戰刃總成實測重量',weightHint:'留空則使用目錄值或估算值',notice:'BX／傳統 UX 使用戰刃、棘輪和軸心；UX Expand 的固鎖已整合在戰刃內，只需選擇一體式戰刃與軸心。CX 才使用紋章／鎖芯、主戰刃及輔助戰刃。輸入戰刃總成實測克數後會覆蓋估算值。',mark:'實測',system:'系統',bxux:'BX / UX 三件式',uxi:'UX 固鎖一體式',cx:'CX 自訂式',integratedLock:'內置固鎖',integratedBlade:'UX 一體式戰刃',structure:'CX 戰刃結構',standard:'標準：主戰刃',expand:'Expand：金屬＋上層',lockChip:'紋章／鎖芯',mainBlade:'主戰刃',metalBlade:'金屬戰刃',overBlade:'上層戰刃',assistBlade:'輔助戰刃',completeBlade:'BX／UX 完整戰刃',partComplete:'BX／UX 戰刃',partChip:'CX 紋章／鎖芯',partMain:'CX 主戰刃',partAssist:'CX 輔助戰刃',partMetal:'CX 金屬戰刃',partOver:'CX 上層戰刃',systemNote:'系統槽位會自動限制零件：UX 一體式只顯示戰刃與軸心，不再要求棘輪。'},
      ja:{measured:'ブレード一式の実測重量',weightHint:'空欄はカタログ値または推定値',notice:'BX／従来UXはブレード・ラチェット・ビットの3パーツ構成です。UXエクスパンドはラチェット一体型ブレードのため、ブレードとビットのみを選択します。CXはロックチップ、メイン、アシストブレードを使用します。',mark:'実測',system:'システム',bxux:'BX / UX 3パーツ',uxi:'UX ラチェット一体型',cx:'CX カスタム',integratedLock:'ラチェット一体型',integratedBlade:'UX 一体型ブレード',structure:'CXブレード構造',standard:'標準：メインブレード',expand:'Expand：メタル＋オーバー',lockChip:'ロックチップ',mainBlade:'メインブレード',metalBlade:'メタルブレード',overBlade:'オーバーブレード',assistBlade:'アシストブレード',completeBlade:'BX／UX完成ブレード',partComplete:'BX／UXブレード',partChip:'CXロックチップ',partMain:'CXメイン',partAssist:'CXアシスト',partMetal:'CXメタル',partOver:'CXオーバー',systemNote:'UX一体型ではブレードとビットのみを表示し、別体ラチェットは要求しません。'},
      en:{measured:'MEASURED BLADE ASSEMBLY',weightHint:'Blank uses catalog or estimated values',notice:'BX and traditional UX use a Blade, Ratchet and Bit. UX Expand integrates the Ratchet into the Blade, so only an integrated Blade and Bit are selected. CX uses Lock Chip, Main and Assist Blade components.',mark:'MEASURED',system:'SYSTEM',bxux:'BX / UX · 3 PART',uxi:'UX · INTEGRATED RATCHET',cx:'CX · CUSTOM',integratedLock:'INTEGRATED RATCHET',integratedBlade:'UX INTEGRATED BLADE',structure:'CX BLADE STRUCTURE',standard:'STANDARD · MAIN BLADE',expand:'EXPAND · METAL + OVER',lockChip:'LOCK CHIP',mainBlade:'MAIN BLADE',metalBlade:'METAL BLADE',overBlade:'OVER BLADE',assistBlade:'ASSIST BLADE',completeBlade:'BX / UX COMPLETE BLADE',partComplete:'BX / UX BLADES',partChip:'CX LOCK CHIPS',partMain:'CX MAIN',partAssist:'CX ASSIST',partMetal:'CX METAL',partOver:'CX OVER',systemNote:'UX integrated builds show only Blade and Bit; a separate Ratchet is not required.'}
    };return copy[language]?.[key]||copy.en[key]
  }
  function smartText(key){
    const copy={
      'zh-cn':{eyebrow:'TARGET BUILD GENERATOR',title:'目标数值随机组装',desc:'设定五项期望指数，系统会随机测试可完整组装的组合，并从最接近目标的候选中抽取一颗。',system:'限定系统',any:'全部系统',attack:'攻击',defense:'防御',stamina:'持久',burst:'爆裂抗性',control:'操控',generate:'随机生成匹配配置',ready:'调整目标后开始生成',generated:'已生成完整配置',match:'目标匹配度',actual:'生成数值',working:'正在计算候选组合…'},
      zh:{eyebrow:'TARGET BUILD GENERATOR',title:'目標數值隨機組裝',desc:'設定五項期望指數，系統會隨機測試可完整組裝的組合，並從最接近目標的候選中抽取一顆。',system:'限定系統',any:'全部系統',attack:'攻擊',defense:'防禦',stamina:'持久',burst:'爆裂抗性',control:'操控',generate:'隨機生成匹配配置',ready:'調整目標後開始生成',generated:'已生成完整配置',match:'目標匹配度',actual:'生成數值',working:'正在計算候選組合…'},
      ja:{eyebrow:'TARGET BUILD GENERATOR',title:'目標値ランダムビルド',desc:'5つの目標指数を設定すると、組立可能な組み合わせをランダム検証し、最も近い候補群から1機を生成します。',system:'システム指定',any:'全システム',attack:'攻撃',defense:'防御',stamina:'持久',burst:'バースト耐性',control:'操作性',generate:'条件に近い構成を生成',ready:'目標値を調整して生成してください',generated:'完成構成を生成しました',match:'目標一致度',actual:'生成値',working:'候補を計算中…'},
      en:{eyebrow:'TARGET BUILD GENERATOR',title:'RANDOM TARGET BUILDER',desc:'Set five target indices. The engine samples complete compatible combinations, then randomly selects from the closest matches.',system:'LIMIT SYSTEM',any:'ALL SYSTEMS',attack:'ATTACK',defense:'DEFENSE',stamina:'STAMINA',burst:'BURST RESISTANCE',control:'CONTROL',generate:'GENERATE MATCHED BUILD',ready:'ADJUST TARGETS, THEN GENERATE',generated:'COMPLETE BUILD GENERATED',match:'TARGET MATCH',actual:'RESULT',working:'SCORING CANDIDATES…'}
    };return copy[language]?.[key]||copy.en[key]||key
  }
  function measuredBladeWeight(build){const value=Number(build.bladeWeight);return build.bladeWeight!==''&&Number.isFinite(value)&&value>=15&&value<=80?value:null}
  function buildParts(build){
    return {blade:bladeFor(build.blade),lockChip:partByName('lockChips',build.lockChip),mainBlade:partByName('mainBlades',build.mainBlade),metalBlade:partByName('metalBlades',build.metalBlade),overBlade:partByName('overBlades',build.overBlade),assist:partByName('assistBlades',build.assist),ratchet:partByName('ratchets',build.ratchet),bit:partByName('bits',build.bit)};
  }
  function componentWeight(part,fallback){return Number(part?.weight)>0?Number(part.weight):fallback}
  function bladeAssemblyWeight(build,parts){
    const measured=measuredBladeWeight(build);if(measured!==null)return measured;
    if(build.system!=='cx')return componentWeight(parts.blade,fallbackWeight.blade);
    let total=componentWeight(parts.lockChip,fallbackWeight.lockChip)+componentWeight(parts.assist,fallbackWeight.assist);
    if(build.structure==='expand')total+=componentWeight(parts.metalBlade,fallbackWeight.metalBlade)+componentWeight(parts.overBlade,fallbackWeight.overBlade);
    else total+=componentWeight(parts.mainBlade,fallbackWeight.mainBlade);
    return total;
  }
  function buildComplete(build){return build.system==='cx'?(build.lockChip&&build.assist&&build.ratchet&&build.bit&&(build.structure==='expand'?(build.metalBlade&&build.overBlade):build.mainBlade)):build.system==='uxi'?(build.blade&&build.bit):(build.blade&&build.ratchet&&build.bit)}
  function field(label,field,items,current){return `<div class="build-field"><label>${esc(label)}</label><select data-field="${esc(field)}">${options(items,current,t('select'))}</select></div>`}
  function renderBuilder(){
    const count=buildMode==='deck'?3:1;
    $('.builder-shell').classList.toggle('deck-mode',buildMode==='deck');
    $('#customWeightNotice').textContent=` ${builderText('notice')}`;
    $('#buildSlots').innerHTML=builds.slice(0,count).map((build,index)=>{
      const p=buildParts(build),cx=build.system==='cx',integrated=build.system==='uxi',primary=cx?(build.structure==='expand'?p.metalBlade:p.mainBlade):p.blade;
      const complete=buildComplete(build),name=comboName(build),measured=measuredBladeWeight(build),weight=calcWeight(build,p);
      const systemField=`<div class="build-field system-build-field"><label>${esc(builderText('system'))}</label><select data-field="system">${choices([['bxux',builderText('bxux')],['uxi',builderText('uxi')],['cx',builderText('cx')]],build.system)}</select></div>`;
      const weightField=`<label class="blade-weight-input" title="${esc(builderText('weightHint'))}"><span>${esc(builderText('measured'))}</span><input data-field="bladeWeight" type="number" min="15" max="80" step="0.01" inputmode="decimal" value="${esc(build.bladeWeight)}" placeholder="${complete?bladeAssemblyWeight({...build,bladeWeight:''},p).toFixed(2):'—'}"><b>g</b></label>`;
      let bladeFields='';
      if(cx){
        bladeFields=`<div class="build-field"><label>${esc(builderText('structure'))}</label><select data-field="structure">${choices([['standard',builderText('standard')],['expand',builderText('expand')]],build.structure)}</select></div>${field(builderText('lockChip'),'lockChip',componentParts.lockChips,build.lockChip)}${build.structure==='expand'?field(builderText('metalBlade'),'metalBlade',componentParts.metalBlades,build.metalBlade)+field(builderText('overBlade'),'overBlade',componentParts.overBlades,build.overBlade):field(builderText('mainBlade'),'mainBlade',componentParts.mainBlades,build.mainBlade)}${field(builderText('assistBlade'),'assist',componentParts.assistBlades,build.assist)}<div class="build-field weight-only">${weightField}</div>`;
      }else{
        bladeFields=`<div class="build-field blade-build-field"><label>${esc(builderText(integrated?'integratedBlade':'completeBlade'))}</label><select data-field="blade">${options(builderBlades(build.system),build.blade,t('select'))}</select>${weightField}</div>`;
      }
      const components=(cx?[[builderText('lockChip'),p.lockChip.image,build.lockChip],[build.structure==='expand'?builderText('overBlade'):builderText('mainBlade'),build.structure==='expand'?p.overBlade.image:p.mainBlade.image,build.structure==='expand'?build.overBlade:build.mainBlade],[builderText('assistBlade'),p.assist.image,build.assist]]:[]).concat(integrated?[]:[[t('ratchet'),p.ratchet.image,build.ratchet]],[[t('bit'),p.bit.image,build.bit]]).filter(item=>item[2]);
      return `<section class="build-slot ${cx?'cx-build':integrated?'uxi-build':'bxux-build'} ${name?'has-build':''}" data-slot="${index}"><span class="slot-no">${index+1}</span>${systemField}${bladeFields}${integrated?'':field(t('ratchet'),'ratchet',state.ratchets,build.ratchet)}${field(t('bit'),'bit',state.bits,build.bit)}<div class="slot-preview"><div class="assembly-stage"><i class="assembly-ring ring-one"></i><i class="assembly-ring ring-two"></i>${primary.image?`<img class="assembly-blade" src="${esc(primary.image)}" alt="${esc(primary.name||name)}">`:`<span class="assembly-empty">X</span>`}${integrated?`<span class="integrated-badge">${esc(builderText('integratedLock'))}</span>`:''}<div class="component-rack">${components.map(([label,image,partName])=>`<span>${image?`<img src="${esc(image)}" alt="${esc(partName)}">`:''}<small>${esc(label)}</small><b title="${esc(partName)}">${esc(partName)}</b></span>`).join('')}</div></div><div class="assembly-caption"><b>${esc(name||t('incomplete'))}</b><small>${complete?`${weight.toFixed(2)}g · ${esc(labelType(primary.type||p.bit.type))}${measured!==null?` · ${esc(builderText('mark'))}`:''}`:esc(t('selectParts'))}</small></div></div></section>`
    }).join('');
    updateTelemetry();
  }
  function calcWeight(build,parts=buildParts(build)){
    return bladeAssemblyWeight(build,parts)+(build.system==='uxi'?0:componentWeight(parts.ratchet,fallbackWeight.ratchet))+componentWeight(parts.bit,fallbackWeight.bit);
  }
  const typeBase={
    Attack:[78,43,42,58,55],Defense:[43,79,58,76,59],Stamina:[38,57,86,62,70],Balance:[61,62,65,65,65]
  };
  const clamp=value=>Math.max(0,Math.min(100,Math.round(value)));
  function calculateBuild(build){
    const p=buildParts(build);if(!buildComplete(build))return null;
    const primary=build.system==='cx'?(build.structure==='expand'?p.metalBlade:p.mainBlade):p.blade;
    const key=['Attack','Defense','Stamina','Balance'].includes(primary.type)?primary.type:'Balance';
    const score=[...typeBase[key]],bladeWeight=bladeAssemblyWeight(build,p),reference=build.system==='cx'?37:build.system==='uxi'?43:34,ratchetHeight=build.system==='uxi'?65:(Number(p.ratchet.height)||65),contacts=build.system==='uxi'?5:(Number(p.ratchet.contacts)||0);
    score[0]+=(bladeWeight-reference)*1.25+(65-ratchetHeight)*.32;
    score[1]+=(bladeWeight-reference)*.9+contacts*.65;
    score[2]+=(bladeWeight-reference)*.35-(ratchetHeight-60)*.18;
    score[3]+=(70-ratchetHeight)*.65+Math.min(contacts,9)*.42;
    score[4]+=Math.max(0,8-Math.abs(contacts-5))*.35;
    const bitType=p.bit.type||'Balance',shape=String(p.bit.shape||'').toLowerCase(),gear=Number(p.bit.gear)||12,shaft=Number(p.bit.shaft)||85;
    if(bitType==='Attack'){score[0]+=15;score[2]-=8;score[4]-=5}if(bitType==='Defense'){score[1]+=14;score[3]+=7;score[0]-=5}if(bitType==='Stamina'){score[2]+=17;score[4]+=6;score[0]-=7}if(bitType==='Balance'){score[0]+=4;score[1]+=4;score[2]+=4;score[4]+=5}
    if(shape.includes('flat')){score[0]+=7;score[4]-=3}if(shape.includes('round')){score[2]+=8;score[4]+=4}if(shape.includes('sharp')){score[1]+=6;score[4]+=7}
    score[0]+=(gear-12)*.8;score[3]+=(shaft-85)*.22;score[4]-=Math.abs(shaft-85)*.08;
    if(build.system==='cx'){
      const assistType=p.assist.type||'Balance';
      if(assistType==='Attack'){score[0]+=5;score[2]-=2}if(assistType==='Defense'){score[1]+=5;score[3]+=3}if(assistType==='Stamina'){score[2]+=5;score[4]+=2}if(assistType==='Balance'){score[1]+=2;score[2]+=2;score[4]+=2}
      score[3]+=2;
    }
    if(build.system==='uxi'){score[3]+=4;score[1]+=2}
    return {scores:score.map(clamp),weight:calcWeight(build,p),type:key,name:comboName(build)};
  }
  const SMART_STATS=['attack','defense','stamina','burst','control'];
  let lastSmartResult=null;
  function setupSmartBuilder(){
    const anchor=$('.builder-mode');if(!anchor||$('#smartBuilder'))return;
    anchor.insertAdjacentHTML('beforebegin',`<section class="smart-builder" id="smartBuilder" aria-labelledby="smartBuilderTitle"><header><span data-smart="eyebrow">TARGET BUILD GENERATOR</span><h3 id="smartBuilderTitle" data-smart="title">目标数值随机组装</h3><p data-smart="desc">设定五项期望指数，系统会随机测试可完整组装的组合，并从最接近目标的候选中抽取一颗。</p></header><div class="smart-builder-controls"><label class="smart-system"><span><i>01</i><b data-smart="system">限定系统</b></span><select id="smartSystem"><option value="any" data-smart="any">全部系统</option><option value="bxux" data-bey-label="bxux">BX / UX 三件式</option><option value="uxi" data-bey-label="uxi">UX 固锁一体式</option><option value="cx" data-bey-label="cx">CX 自定义式</option></select></label><div class="smart-targets">${SMART_STATS.map((key,index)=>`<label><span><i>${String(index+2).padStart(2,'0')}</i><b data-smart="${key}">${smartText(key)}</b><output for="smart-${key}">${[72,62,68,72,66][index]}</output></span><input id="smart-${key}" data-smart-stat="${key}" type="range" min="20" max="100" step="1" value="${[72,62,68,72,66][index]}"></label>`).join('')}</div><button id="generateSmartBuild" type="button"><span data-smart="generate">随机生成匹配配置</span><i>↗</i></button></div><footer class="smart-result idle" id="smartResult"><div><span data-smart="ready">调整目标后开始生成</span><b id="smartResultName">—</b></div><strong><small data-smart="match">目标匹配度</small><b id="smartMatch">—</b></strong><div class="smart-actual" id="smartActual"></div></footer></section>`);
    $('#smartResult').insertAdjacentHTML('afterbegin','<div class="smart-result-art" id="smartResultArt" aria-hidden="true"><span>X</span></div>');
    $('#smartBuilder').addEventListener('input',event=>{const input=event.target.closest('[data-smart-stat]');if(input)input.previousElementSibling.querySelector('output').value=input.value});
    $('#generateSmartBuild').addEventListener('click',generateSmartBuild);
  }
  const randomItem=items=>items[Math.floor(Math.random()*items.length)];
  function randomBuild(system){
    const chosen=system==='any'?randomItem(['bxux','uxi','cx']):system,build=emptyBuild();build.system=chosen;
    if(chosen==='bxux'){
      const blade=randomItem(builderBlades('bxux')),ratchet=randomItem(state.ratchets),bit=randomItem(state.bits);
      if(!blade||!ratchet||!bit)return null;Object.assign(build,{blade:blade.name,ratchet:ratchet.name,bit:bit.name});
    }else if(chosen==='uxi'){
      const blade=randomItem(builderBlades('uxi')),bit=randomItem(state.bits);
      if(!blade||!bit)return null;Object.assign(build,{blade:blade.name,bit:bit.name});
    }else{
      const canExpand=componentParts.metalBlades.length&&componentParts.overBlades.length,structure=canExpand&&Math.random()<.38?'expand':'standard';
      const chip=randomItem(componentParts.lockChips),assist=randomItem(componentParts.assistBlades),ratchet=randomItem(state.ratchets),bit=randomItem(state.bits);
      if(!chip||!assist||!ratchet||!bit)return null;Object.assign(build,{structure,lockChip:chip.name,assist:assist.name,ratchet:ratchet.name,bit:bit.name});
      if(structure==='expand'){
        const metal=randomItem(componentParts.metalBlades),over=randomItem(componentParts.overBlades);if(!metal||!over)return null;build.metalBlade=metal.name;build.overBlade=over.name;
      }else{
        const main=randomItem(componentParts.mainBlades);if(!main)return null;build.mainBlade=main.name;
      }
    }
    return build;
  }
  function smartTargets(){return SMART_STATS.map(key=>Number($(`#smart-${key}`).value)||60)}
  function smartDistance(scores,targets){return Math.sqrt(scores.reduce((sum,value,index)=>sum+(value-targets[index])**2,0)/scores.length)}
  function renderSmartResult(result){
    if(!result)return;const box=$('#smartResult');if(!box)return;
    box.classList.remove('idle','working');box.classList.add('ready');
    $('#smartResultName').previousElementSibling.textContent=smartText('generated');$('#smartResultName').textContent=result.calculated.name;
    $('#smartMatch').textContent=`${Math.max(0,Math.round(100-result.distance))}%`;
    const p=buildParts(result.build),cx=result.build.system==='cx',layers=cx?[
      ['assist',p.assist],
      [result.build.structure==='expand'?'metal':'main',result.build.structure==='expand'?p.metalBlade:p.mainBlade],
      ...(result.build.structure==='expand'?[['over',p.overBlade]]:[]),
      ['chip',p.lockChip]
    ]:[['complete',p.blade]];
    $('#smartResultArt').innerHTML=layers.filter(([,part])=>part?.image).map(([kind,part])=>`<img class="${esc(kind)}" src="${esc(part.image)}" alt="${esc(part.name||result.calculated.name)}">`).join('')||'<span>X</span>';
    $('#smartActual').innerHTML=result.calculated.scores.map((value,index)=>`<span><small>${esc(smartText(SMART_STATS[index]))}</small><b>${value}</b></span>`).join('');
  }
  async function generateSmartBuild(){
    const button=$('#generateSmartBuild'),resultBox=$('#smartResult');button.disabled=true;resultBox.className='smart-result working';$('#smartResultName').previousElementSibling.textContent=smartText('working');$('#smartResultName').textContent='SCANNING 2,800';$('#smartMatch').textContent='…';$('#smartActual').innerHTML='';$('#smartResultArt').innerHTML='<span>…</span>';
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    const system=$('#smartSystem').value,targets=smartTargets(),ranked=[];
    for(let index=0;index<2800;index++){
      const build=randomBuild(system),calculated=build&&calculateBuild(build);if(!calculated)continue;
      ranked.push({build,calculated,distance:smartDistance(calculated.scores,targets)});
    }
    ranked.sort((a,b)=>a.distance-b.distance);const best=ranked[0];if(!best){resultBox.className='smart-result idle';$('#smartResultName').previousElementSibling.textContent=smartText('ready');$('#smartResultName').textContent='—';$('#smartMatch').textContent='—';$('#smartResultArt').innerHTML='<span>X</span>';button.disabled=false;return}const shortlist=ranked.filter(item=>item.distance<=best.distance+3.5).slice(0,14),chosen=randomItem(shortlist.length?shortlist:[best]);
    builds[0]={...chosen.build};buildMode='single';$$('.builder-mode button').forEach(node=>node.classList.toggle('active',node.dataset.mode==='single'));renderBuilder();
    lastSmartResult=chosen;renderSmartResult(chosen);resultBox.classList.remove('pulse');void resultBox.offsetWidth;resultBox.classList.add('pulse');button.disabled=false;
  }
  function duplicateValues(entries,key){const values=entries.map(item=>item[key]).filter(Boolean);return new Set(values).size!==values.length}
  function legality(){
    const active=builds.slice(0,buildMode==='deck'?3:1),complete=active.every(buildComplete);
    if(!complete)return {kind:'',text:t('incomplete')};
    if(buildMode==='deck'&&['blade','lockChip','mainBlade','metalBlade','overBlade','assist','ratchet','bit'].some(key=>duplicateValues(active,key)))return {kind:'invalid',text:t('duplicate')};
    return {kind:'valid',text:t('legal')};
  }
  function updateTelemetry(){
    const active=builds.slice(0,buildMode==='deck'?3:1),calculated=active.map(calculateBuild).filter(Boolean),validity=legality();
    const averages=[0,1,2,3,4].map(index=>calculated.length?calculated.reduce((sum,item)=>sum+item.scores[index],0)/calculated.length:0);
    const labels=[t('attack'),t('defense'),t('stamina'),language==='en'?'BURST RESISTANCE':language==='ja'?'バースト耐性':language==='zh'?'爆裂抗性':'爆裂抗性',language==='en'?'CONTROL':language==='ja'?'操作性':language==='zh'?'操控':'操控'];
    $('#scoreList').innerHTML=labels.map((label,index)=>`<div class="score-row"><label>${esc(label)}</label><div class="score-track"><i style="width:${clamp(averages[index])}%"></i></div><b>${clamp(averages[index])}</b></div>`).join('');
    const total=calculated.reduce((sum,item)=>sum+item.weight,0);
    $('#totalWeight').textContent=calculated.length?`${total.toFixed(1)} g`:'— g';
    $('#buildName').textContent=buildMode==='deck'?(language==='ja'?'3ON3 デッキ':language==='en'?'3ON3 DECK':'3ON3 套组'):(calculated[0]?.name||'—');
    $('#buildRole').textContent=calculated.length?`${buildMode==='deck'?t('average'):labelType(calculated[0].type)} · ${t('calculated')}`:'SELECT PARTS';
    $('#legality').className=`legality ${validity.kind}`;$('#legality span').textContent=validity.text;
  }
  function buildText(){
    const active=builds.slice(0,buildMode==='deck'?3:1);return active.map((item,index)=>`${buildMode==='deck'?`${index+1}. `:''}[${item.system==='cx'?'CX':item.system==='uxi'?'UX-I':'BX/UX'}] ${comboName(item)||t('incomplete')}${measuredBladeWeight(item)!==null?` · Blade ${Number(item.bladeWeight).toFixed(2)}g`:''}`).join('\n');
  }
  let toastTimer;
  function toast(message){const node=$('#toast');node.textContent=message;node.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>node.classList.remove('show'),2200)}
  let currentModalCombo=null;
  function relatedRecords(combo){return state.rare.filter(record=>normal(record.blade)===normal(combo.blade)&&(!combo.bit||normal(record.bit)===normal(combo.bit))).slice(0,10)}
  function openCombo(combo){
    if(!combo)return;currentModalCombo=combo;const blade=bladeFor(combo.blade),records=relatedRecords(combo),rate=combo.app?Math.round((combo.wins||0)/combo.app*100):0;
    $('#modalImage').src=blade.image||'';$('#modalImage').alt=combo.blade||'';$('#modalImage').hidden=!blade.image;
    $('#modalTier').textContent=`${t('tier')} ${combo.tier||'—'} · ${labelType(combo.cat)}`;$('#modalTitle').textContent=combo.blade||'—';$('#modalType').textContent=comboPartsLine(combo)||'—';
    $('#modalStats').innerHTML=[
      [t('appearances'),number(combo.app)],[t('wins'),number(combo.wins)],[t('winRate'),`${rate}%`],[t('metaIndex'),number(combo.meta)]
    ].map(([label,value])=>`<div><small>${esc(label)}</small><b>${esc(value)}</b></div>`).join('');
    const notes=[];if(combo.pro)notes.push(`<article><b>${esc(t('strength'))}</b><p>${esc(combo.pro)}</p></article>`);if(combo.contro)notes.push(`<article><b>${esc(t('caution'))}</b><p>${esc(combo.contro)}</p></article>`);
    $('#modalCopy').innerHTML=notes.join('')||`<article><b>${esc(t('calculated'))}</b><p>${esc(`${combo.app||0} ${t('records')} · ${labelType(combo.cat)}`)}</p></article>`;
    $('#modalRecords').innerHTML=`<h3>${esc(t('placements'))}</h3>`+(records.length?records.map(record=>`<div><time>${esc(formatDate(record.date||''))}</time><b>#${esc(record.place||'—')}</b><span>${esc(comboName(record))}</span></div>`).join(''):`<p>${esc(t('noRecords'))}</p>`);
    $('#comboModal').classList.add('open');document.body.classList.add('modal-open');$('#closeModal').focus();
  }
  function closeModal(){$('#comboModal').classList.remove('open');document.body.classList.remove('modal-open')}
  function renderAll(){updateSummary();renderMeta();renderConfigs();renderPlacements();renderParts();renderBuilder();renderSources()}
  setupSmartBuilder();

  $('#uiLang').addEventListener('change',event=>setLanguage(event.target.value));
  $('#menuBtn').addEventListener('click',()=>$('#nav').classList.toggle('open'));
  $$('#nav a').forEach(link=>link.addEventListener('click',()=>$('#nav').classList.remove('open')));
  $$('.usage-tabs button').forEach(button=>button.addEventListener('click',()=>{usageTab=button.dataset.usage;$$('.usage-tabs button').forEach(node=>node.classList.toggle('active',node===button));renderUsage()}));
  ['configSearch','tierFilter','typeFilter'].forEach(id=>$('#'+id).addEventListener(id==='configSearch'?'input':'change',()=>{configLimit=18;renderConfigs()}));
  $('#loadMore').addEventListener('click',()=>{configLimit+=18;renderConfigs()});
  $$('.part-tabs button').forEach(button=>button.addEventListener('click',()=>{partTab=button.dataset.part;partLimit=20;$$('.part-tabs button').forEach(node=>node.classList.toggle('active',node===button));renderParts()}));
  ['partSearch','partType'].forEach(id=>$('#'+id).addEventListener(id==='partSearch'?'input':'change',()=>{partLimit=20;renderParts()}));
  $('#loadMoreParts').addEventListener('click',()=>{partLimit+=20;renderParts()});
  document.addEventListener('click',event=>{
    const card=event.target.closest('[data-combo-kind]');if(card){const collection=card.dataset.comboKind==='meta'?state.meta:state.all;openCombo(collection[Number(card.dataset.comboIndex)]);return}
    if(event.target===$('#comboModal'))closeModal();
  });
  $('#closeModal').addEventListener('click',closeModal);document.addEventListener('keydown',event=>{if(event.key==='Escape')closeModal()});
  $$('.builder-mode button').forEach(button=>button.addEventListener('click',()=>{buildMode=button.dataset.mode;$$('.builder-mode button').forEach(node=>node.classList.toggle('active',node===button));renderBuilder()}));
  $('#buildSlots').addEventListener('change',event=>{
    const control=event.target.closest('[data-field]'),slot=event.target.closest('[data-slot]');if(!control||!slot)return;
    const build=builds[Number(slot.dataset.slot)],fieldName=control.dataset.field,value=control.value;
    if(fieldName==='system'){Object.assign(build,emptyBuild(),{system:value});renderBuilder();return}
    if(fieldName==='structure'){build.structure=value;build.mainBlade='';build.metalBlade='';build.overBlade='';build.bladeWeight='';renderBuilder();return}
    if(['blade','lockChip','mainBlade','metalBlade','overBlade','assist'].includes(fieldName)&&build[fieldName]!==value)build.bladeWeight='';
    build[fieldName]=value;renderBuilder();
  });
  $('#resetBuild').addEventListener('click',()=>{builds=builds.map(()=>emptyBuild());renderBuilder()});
  $('#copyBuild').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(buildText());toast(t('copied'))}catch(error){toast(t('copyFailed'))}});

  const AUTO_KEY='metalab-auto-update';let autoEnabled=true,autoTimer=null,syncing=false;
  try{autoEnabled=localStorage.getItem(AUTO_KEY)!=='off'}catch(error){}
  function setAuto(enabled,persist=true){
    autoEnabled=enabled;$('#autoUpdate').checked=enabled;if(persist){try{localStorage.setItem(AUTO_KEY,enabled?'on':'off')}catch(error){}}
    clearInterval(autoTimer);autoTimer=null;if(enabled){syncRemote();autoTimer=setInterval(syncRemote,600000)}updateSummary();
  }
  function setSync(message){$('#syncStatus').textContent=message}
  function usableRemote(remote){return remote&&(['meta','all','rare'].some(key=>Array.isArray(remote[key]))||remote.bbx||remote.parts)}
  function mergeRemote(remote){
    const root=remote.bbx&&typeof remote.bbx==='object'?{...remote,...remote.bbx}:remote;
    if(Array.isArray(root.meta)&&root.meta.length)state.meta=[...root.meta];if(Array.isArray(root.all)&&root.all.length)state.all=[...root.all];if(Array.isArray(root.rare)&&root.rare.length)state.rare=[...root.rare];
    const summary=root.summary||root.parts;if(summary&&typeof summary==='object'&&!Array.isArray(summary))state.summary={...state.summary,...summary};
    renderAll();setSync(`${t('synced')} · ${state.summary.week||'LIVE'}`);
  }
  function syncRemote(){
    if(!autoEnabled||syncing)return;syncing=true;setSync(t('syncing'));
    const prior=window.BBX_DATA;try{delete window.BBX_DATA}catch(error){window.BBX_DATA=undefined}
    const script=document.createElement('script'),timeout=setTimeout(()=>finish(false),12000);let done=false;
    function finish(ok){if(done)return;done=true;clearTimeout(timeout);syncing=false;script.remove();const remote=window.BBX_DATA;if(ok&&usableRemote(remote))mergeRemote(remote);else{window.BBX_DATA=prior;setSync(`${t('syncFailed')} · ${state.summary.week||'LOCAL'}`)}}
    script.src=`https://www.bbxvault.com/assets/js/data.js?auto=${Date.now()}`;script.async=true;script.onload=()=>finish(true);script.onerror=()=>finish(false);document.head.appendChild(script);
  }
  $('#autoUpdate').addEventListener('change',event=>setAuto(event.target.checked));
  window.addEventListener('storage',event=>{if(event.key===AUTO_KEY)setAuto(event.newValue!=='off',false)});
  document.addEventListener('error',event=>{if(event.target.tagName==='IMG')event.target.classList.add('image-error')},true);
  setLanguage(language);setAuto(autoEnabled,false);
})();
