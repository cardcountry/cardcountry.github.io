(()=>{'use strict';
const topics={
 overview:{icon:'home',labels:{'zh-cn':['分类首页','首页','选择想看的内容，直接进入对应页面。'],zh:['分類首頁','首頁','選擇想看的內容，直接進入對應頁面。'],en:['Category home','Home','Choose what you want to explore.'],ja:['カテゴリー','ホーム','調べたい内容を選んでください。']}},
 news:{icon:'news',labels:{'zh-cn':['资讯动态','资讯','新卡、新品、规则公告与近期公开资讯。'],zh:['資訊動態','資訊','新卡、新品、規則公告與近期公開資訊。'],en:['News & updates','News','New cards, products, rules and public updates.'],ja:['ニュース','ニュース','新カード・商品・ルールと公開情報。']}},
 decks:{icon:'decks',labels:{'zh-cn':['赛事卡表','卡表','主流与冷门卡组、完整构成及对应对局资料。'],zh:['賽事牌組','牌組','主流與冷門牌組、完整構成及對應對局資料。'],en:['Tournament decks','Decks','Complete lists, mainstream and rogue decks, and matchups.'],ja:['大会デッキ','デッキ','大会レシピ・環境デッキ・対戦情報。']}},
 cards:{icon:'cards',labels:{'zh-cn':['卡牌图鉴','图鉴','搜索卡名、卡号、卡图和已收录效果。'],zh:['卡牌圖鑑','圖鑑','搜尋卡名、卡號、卡圖和已收錄效果。'],en:['Card encyclopedia','Cards','Find card names, numbers, artwork and available text.'],ja:['カード図鑑','カード','カード名・番号・画像・収録テキストを検索。']}},
 usage:{icon:'usage',labels:{'zh-cn':['使用率排行','使用率','按已收录样本查看排名、地区与统计范围。'],zh:['使用率排行','使用率','依已收錄樣本查看排名、地區與統計範圍。'],en:['Sample usage ranking','Usage','Rankings with sample counts, regions and date ranges.'],ja:['使用率ランキング','使用率','収録サンプル数・地域・集計期間を確認。']}},
 rules:{icon:'rules',labels:{'zh-cn':['规则入门','规则','开局、回合流程、构筑限制与官方教学。'],zh:['規則入門','規則','開局、回合流程、構築限制與官方教學。'],en:['Rules & getting started','Rules','Setup, turns, deck construction and official tutorials.'],ja:['ルール・遊び方','ルール','準備・ターン・構築条件と公式解説。']}},
 sources:{icon:'sources',labels:{'zh-cn':['来源与更新','来源','查看原始出处、资料范围和核验记录。'],zh:['來源與更新','來源','查看原始出處、資料範圍和核驗記錄。'],en:['Sources & coverage','Sources','Original sources, coverage and verification records.'],ja:['情報源・更新記録','情報源','出典・収録範囲・確認記録を参照。']}},
 official:{icon:'rules',labels:{'zh-cn':['官方构筑','构筑','单独查看官方配方及地区、语言资料。'],zh:['官方構築','構築','獨立查看官方配方及地區、語言資料。'],en:['Official deck recipes','Official','Official recipes with regional and language references.'],ja:['公式デッキレシピ','公式','公式レシピと地域・言語別の情報。']}},
 events:{icon:'news',labels:{'zh-cn':['赛事记录','赛事','赛事日期、公开成绩与相关卡表。'],zh:['賽事記錄','賽事','賽事日期、公開成績與相關牌組。'],en:['Tournament records','Events','Tournament dates, published results and related lists.'],ja:['大会記録','大会','開催日・公開結果・関連レシピ。']}},
 configs:{icon:'decks',labels:{'zh-cn':['赛事配置','配置','公开上位配置、零件组合与发布者成绩。'],zh:['賽事配置','配置','公開上位配置、零件組合與發布者成績。'],en:['Tournament combinations','Combos','Published combinations, parts and player results.'],ja:['大会カスタム','カスタム','公開入賞カスタム・パーツ・選手の成績。']}},
 parts:{icon:'cards',labels:{'zh-cn':['零件图鉴','零件','Blade、Ratchet、Bit 与 CX 零件数值。'],zh:['零件圖鑑','零件','Blade、Ratchet、Bit 與 CX 零件數值。'],en:['Parts encyclopedia','Parts','Blades, ratchets, bits, CX parts and their measurements.'],ja:['パーツ図鑑','パーツ','ブレード・ラチェット・ビット・CXパーツと数値。']}},
 builder:{icon:'builder',labels:{'zh-cn':['陀螺组装器','组装','单颗与 3on3 组装、数值和重复零件检查。'],zh:['陀螺組裝器','組裝','單顆與 3on3 組裝、數值和重複零件檢查。'],en:['Beyblade builder','Builder','Single and 3on3 builds, measurements and duplicate checks.'],ja:['カスタムツール','組立','単機・3on3構成、数値・重複パーツの確認。']}}
};
const standard=['decks','cards','news','usage','rules','sources'];
const games={
 ptcg:{name:'Pokémon TCG',code:'PTCG',accent:'#e1ff38',art:'home-assets/ptcg-dragapult.png',topics:standard,roots:{decks:['meta'],cards:['cards'],rules:['rules'],sources:['sources']}},
 gcg:{name:'GUNDAM CARD GAME',code:'GCG',accent:'#2adce6',art:'home-assets/gcg-strike-freedom.webp',topics:['decks','cards','news','official','usage','rules','sources'],roots:{decks:['meta'],cards:['cards'],official:['official-decks'],rules:['rules'],sources:['sources']}},
 opcg:{name:'ONE PIECE CARD GAME',code:'OPCG',accent:'#ff7663',art:'home-assets/opcg-rocks.png',topics:standard,roots:{decks:['meta'],cards:['cards'],rules:['rules'],sources:['sources']}},
 unionarena:{name:'UNION ARENA',code:'UNION ARENA',accent:'#c9f96b',art:'https://www.unionarena-tcg.com/na/images/cardlist/card/UEX08BT_BLC-4-039.png?v3',topics:standard,roots:{decks:['decks'],cards:['catalog'],rules:['rules'],sources:['sources']}},
 riftbound:{name:'RIFTBOUND',code:'RIFTBOUND',accent:'#6ee1cf',art:'home-assets/riftbound-riven.webp',topics:standard,roots:{decks:['meta'],cards:['cards'],rules:['rules'],sources:['sources']}},
 marvel:{name:'MARVEL HERO RUSH',code:'MARVEL',accent:'#8ab2ff',art:'home-assets/marvel-spiderman.webp',topics:['decks','cards','news','events','usage','rules','sources'],roots:{decks:['meta'],cards:['cards'],events:['events'],rules:['rules'],sources:['sources']}},
 beyblade:{name:'BEYBLADE X',code:'BEYBLADE X',accent:'#70dfff',art:'bey-assets/blades-db-ArPg.webp',topics:['configs','parts','builder','news','decks','usage','sources'],roots:{decks:['meta'],configs:['configs'],parts:['parts'],builder:['builder'],sources:['sources']}}
};
const words={
 'zh-cn':{all:'全部分类',choose:'浏览内容',back:'分类首页',recent:'近期收录',more:'查看全部资讯',loading:'正在读取资讯…',empty:'查看这个分类的已收录资讯',language:'界面语言',switch:'切换分类',browse:'选择一个栏目',beyMeta:'主流环境',beyMetaShort:'环境',beyMetaDesc:'查看已收录赛事中的主流配置与环境观察。'},
 zh:{all:'全部分類',choose:'瀏覽內容',back:'分類首頁',recent:'近期收錄',more:'查看全部資訊',loading:'正在讀取資訊…',empty:'查看這個分類的已收錄資訊',language:'介面語言',switch:'切換分類',browse:'選擇一個欄目',beyMeta:'主流環境',beyMetaShort:'環境',beyMetaDesc:'查看已收錄賽事的主流配置與環境觀察。'},
 en:{all:'All categories',choose:'Browse',back:'Category home',recent:'Recently collected',more:'All updates',loading:'Loading updates…',empty:'Explore collected updates for this category',language:'Interface language',switch:'Switch category',browse:'Choose a section',beyMeta:'Metagame overview',beyMetaShort:'Meta',beyMetaDesc:'Popular combinations and observations from collected events.'},
 ja:{all:'全カテゴリー',choose:'コンテンツ',back:'カテゴリーホーム',recent:'最近の収録',more:'すべてのニュース',loading:'読み込み中…',empty:'このカテゴリーの収録情報を見る',language:'表示言語',switch:'カテゴリー切替',browse:'コンテンツを選択',beyMeta:'環境情報',beyMetaShort:'環境',beyMetaDesc:'収録大会の主流カスタムと環境情報を確認。'}
};
window.METALAB_SECTIONS={games,topics,words,version:'2026111201'};
})();
