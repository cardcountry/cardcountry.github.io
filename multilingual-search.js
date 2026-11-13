(()=>{
 'use strict';
 const base=window.MetaSearch||{},groups=[],cache=new Map();
 const normalize=value=>String(value??'').normalize('NFKC').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^\p{L}\p{N}]/gu,'');
 function register(rows){for(const row of rows){const values=[...new Set(row.filter(v=>typeof v==='string'&&v.trim()).map(normalize))].filter(v=>v.length>1);if(values.length>1)groups.push(values);}cache.clear();}
 register([
 ['Rayquaza','烈空坐','レックウザ'],['Archaludon','铝钢桥龙','鋁鋼橋龍','ブリジュラス'],['Palafin','海豚侠','海豚俠','イルカマン'],['Starmie','宝石海星','寶石海星','スターミー'],['Talonflame','烈箭鹰','烈箭鷹','ファイアロー'],['Prism Box','棱镜工具箱','稜鏡工具箱','プリズムバレット'],
 ['Traditional Chinese','繁中','繁體中文','繁体中文','Taiwan','台灣','台湾'],['Mega Charizard X','メガリザードンX','超級噴火龍X','超级喷火龙X'],['Team Rocket Mewtwo','ロケット団のミュウツー','火箭隊的超夢','火箭队的超梦'],['Mewtwo','ミュウツー','超夢','超梦'],
 ['Japan','Japanese','日本','日文','日本語'],['English','英文','英语','英語'],['Chinese','中文','中国','中國'],
 ['Red Blue','红蓝','紅藍','赤青'],['Red Green','红绿','紅綠','赤緑'],['Red White','红白','紅白','赤白'],['Red Purple','红紫','紅紫','赤紫'],['Red Black','红黑','紅黑','赤黒'],['Blue Green','蓝绿','藍綠','青緑'],['Blue White','蓝白','藍白','青白'],['Blue Purple','蓝紫','藍紫','青紫'],['Green Purple','绿紫','綠紫','緑紫'],['Green White','绿白','綠白','緑白'],['Purple Yellow','紫黄','紫黃'],['Black Yellow','黑黄','黑黃'],
 ['Dragapult','ドラパルト','多龙巴鲁托','多龍巴魯托','多龙','多龍'],['Dusknoir','ヨノワール','黑夜魔灵','黑夜魔靈'],['Dusclops','サマヨール','彷徨夜灵','彷徨夜靈'],
 ["N's Zoroark",'Nのゾロアーク','N的索罗亚克','N的索羅亞克'],['Zoroark','ゾロアーク','索罗亚克','索羅亞克'],['Alakazam','フーディン','胡地'],['Hydrapple','カミツオロチ','蜜集大蛇'],
 ['Festival Lead','おまつりおんど','庆典领舞','慶典領舞','祭典','庆典','慶典'],['Slowking','ヤドキング','呆呆王'],['Excadrill','ドリュウズ','龙头地鼠','龍頭地鼠'],['Lopunny','ミミロップ','长耳兔','長耳兔'],
 ['Kangaskhan','ガルーラ','袋兽','袋獸'],['Raging Bolt','タケルライコ','猛雷鼓'],['Arboliva','オリーヴァ','奥利瓦','奧利瓦'],['Honchkrow','ドンカラス','乌鸦头头','烏鴉頭頭'],
 ['Mew','ミュウ','梦幻','夢幻'],['Grimmsnarl','オーロンゲ','长毛巨魔','長毛巨魔'],['Froslass','ユキメノコ','雪妖女'],['Munkidori','マシマシラ','愿增猿','願增猿'],['Blaziken','バシャーモ','火焰鸡','火焰雞'],
 ['Charizard','リザードン','喷火龙','噴火龍'],['Pikachu','ピカチュウ','皮卡丘'],['Gardevoir','サーナイト','沙奈朵'],['Garchomp','ガブリアス','烈咬陆鲨','烈咬陸鯊'],['Lucario','ルカリオ','路卡利欧','路卡利歐'],
 ['Gholdengo','サーフゴー','赛富豪','賽富豪'],['Gengar','ゲンガー','耿鬼'],['Charcadet','カルボウ','炭小侍'],['Ceruledge','ソウブレイズ','苍炎刃鬼','蒼炎刃鬼'],['Dudunsparce','ノココッチ','土龙节节','土龍節節'],
 ['Rocks','ロックス','洛克斯','洛克斯D吉贝克','洛克斯D吉貝克'],['Luffy','ルフィ','路飞','路飛','鲁夫','魯夫'],['Ace','エース','艾斯'],['Enel','エネル','艾尼路'],
 ['Shanks','シャンクス','香克斯','红发','紅髮'],['Nico Robin','ニコロビン','妮可罗宾','妮可羅賓','罗宾','羅賓'],['Zoro','ゾロ','索隆','佐罗','佐羅'],['Sabo','サボ','萨波','薩波'],
 ['Buggy','バギー','巴基','巴其'],['Kaido','カイドウ','凯多','凱多'],['Boa Hancock','ボアハンコック','波雅汉库克','波雅漢庫克','汉库克','漢庫克'],['Trafalgar Law','トラファルガーロー','特拉法尔加罗','特拉法爾加羅'],
 ['Yamato','ヤマト','大和'],['Teach','ティーチ','蒂奇','黑胡子','黑鬍子'],['Mihawk','ミホーク','米霍克','鹰眼','鷹眼'],['Rosinante','ロシナンテ','罗西南迪','羅西南迪','柯拉松'],
 ['Gundam','ガンダム','高达','高達','钢弹','鋼彈'],['Strike Freedom','ストライクフリーダム','强袭自由','強襲自由','攻击自由','攻擊自由'],['Nu Gundam','νガンダム','ν高达','ν鋼彈','牛高达','牛鋼彈'],
 ['Barbatos','バルバトス','巴巴托斯','猎魔','獵魔'],['Shining Gundam','シャイニングガンダム','闪光高达','閃光鋼彈'],['Master Gundam','マスターガンダム','尊者高达','宗師鋼彈'],['Unicorn','ユニコーン','独角兽','獨角獸'],
 ['Kshatriya','クシャトリヤ','刹帝利','剎帝利'],['Aile Strike','エールストライク','翔翼型攻击','翔翼型攻擊','空战型强袭','空戰型強襲'],['Justice Gundam','ジャスティスガンダム','正义高达','正義鋼彈'],
 ['Turn X','ターンX','逆X'],['Turn A','ターンエー','∀ガンダム','倒A'],['Zaku','ザク','扎古','萨克','薩克'],['Char','シャア','夏亚','夏亞'],['Zeong','ジオング','吉翁号','吉翁號'],
 ['BLEACH','死神','境界'],['Jujutsu Kaisen','呪術廻戦','咒术回战','咒術迴戰'],['Demon Slayer','鬼滅の刃','鬼灭之刃','鬼滅之刃'],['HUNTER×HUNTER','ハンターハンター','全职猎人','全職獵人'],
 ['Code Geass','コードギアス','反逆的鲁鲁修','反逆的魯魯修','叛逆的鲁路修'],['Rozé','奪還のロゼ','夺还的罗赛','奪還的羅賽'],['Evangelion','ヱヴァンゲリヲン新劇場版','ヱヴァンゲリヲン','エヴァンゲリオン','福音战士','福音戰士','新世纪福音战士','新世紀福音戰士'],
 ['Solo Leveling','俺だけレベルアップな件','我独自升级','我獨自升級'],['Shangri-La Frontier','シャングリラフロンティア','香格里拉边境','香格里拉邊境'],['Shiny Colors','アイドルマスターシャイニーカラーズ','偶像大师闪耀色彩','偶像大師閃耀色彩'],
 ['Mushoku Tensei','無職転生','无职转生','無職轉生'],['Arknights','アークナイツ','明日方舟'],['Kamen Rider','仮面ライダー','假面骑士','假面騎士'],['Sakamoto Days','サカモトデイズ','坂本日常'],
 ['Attack on Titan','進撃の巨人','进击的巨人','進擊的巨人'],['One Punch Man','ワンパンマン','一拳超人'],['Chainsaw Man','チェンソーマン','电锯人','鏈鋸人'],['D.Gray-man','ディーグレイマン','驱魔少年','驅魔少年'],
 ['Riven','リヴェン','锐雯','銳雯'],['Rengar','レンガー','雷恩加尔','雷葛爾'],['Ahri','アーリ','阿狸'],['Irelia','イレリア','艾瑞莉娅','伊瑞莉雅'],['Jax','ジャックス','贾克斯','賈克斯'],
 ['Fiora','フィオラ','菲奥娜','菲歐拉'],['Viktor','ビクター','维克托','維克特'],['Ezreal','エズリアル','伊泽瑞尔','伊澤瑞爾'],['Ornn','オーン','奥恩','鄂爾'],['Azir','アジール','阿兹尔','阿祈爾'],
 ['Teemo','ティーモ','提莫'],['Annie','アニー','安妮'],['Lux','ラックス','拉克丝','拉克絲'],['Garen','ガレン','盖伦','蓋倫'],['Lee Sin','リーシン','李青','盲僧'],['Master Yi','マスターイー','易大师','易大師'],
 ['Jinx','ジンクス','金克丝','吉茵珂絲'],['Draven','ドレイヴン','德莱文','達瑞文'],['Leona','レオナ','蕾欧娜','雷歐娜'],['Miss Fortune','ミスフォーチュン','厄运小姐','好運姐'],
 ['Spider-Man','スパイダーマン','蜘蛛侠','蜘蛛俠','蜘蛛人'],['Iron Man','アイアンマン','钢铁侠','鋼鐵人'],['Captain America','キャプテンアメリカ','美国队长','美國隊長'],['Hulk','ハルク','绿巨人','綠巨人','浩克'],['Thor','ソー','雷神','索尔','索爾'],
 ['Aero Pegasus','エアロペガサス','空力天马','空力天馬'],['Wizard Rod','ウィザードロッド','魔导杖','魔導杖'],['Dran Buster','ドランバスター','龙破坏','龍破壞'],['Dran Sword','ドランソード','龙剑','龍劍'],
 ['Phoenix Wing','フェニックスウイング','凤凰羽','鳳凰羽'],['Silver Wolf','シルバーウルフ','银狼','銀狼'],['Cobalt Dragoon','コバルトドラグーン','钴蓝苍龙','鈷藍蒼龍'],['Shark Scale','シャークスケイル','鲨鱼天秤','鯊魚天秤']
 ]);
 if(window.GCG_OFFICIAL_DECKS)register(Object.entries(window.GCG_OFFICIAL_DECKS.names).map(([code,names])=>[code,...Object.values(names)]));
 if(window.OPCG_CARDS)register(window.OPCG_CARDS.map(c=>[c.code,c.name,c.name_ja]));
 if(window.OPCG_DATA?.meta)register(Object.values(window.OPCG_DATA.meta).flat().map(d=>[d.leader,d.name,...(d.aliases||[])]));
 function variants(value){const needle=normalize(value);if(cache.has(needle))return cache.get(needle);const found=new Set([needle]),relevant=groups.filter(aliases=>aliases.some(a=>needle.includes(a)));for(const aliases of relevant){for(const candidate of [...found])for(const a of aliases.filter(a=>candidate.includes(a)))for(const b of aliases){found.add(candidate.replaceAll(a,b));if(found.size>=160)break;}if(found.size>=160)break;}const values=[...found].filter(Boolean);if(cache.size>80)cache.clear();cache.set(needle,values);return values;}
 function values(fields){return fields.flatMap(v=>Array.isArray(v)?typeof v[1]==='number'?values([v[0]]):values(v):v&&typeof v==='object'?values(Object.values(v)):[v]).filter(v=>v!=null);}
 function matches(query,fields){if(!String(query).trim())return true;const hay=normalize(values(fields).join(' ')),qs=variants(query);if(qs.some(q=>hay.includes(q)))return true;if(groups.some(aliases=>aliases.includes(normalize(query))))return false;const words=String(query).trim().split(/\s+/);return words.length>1&&words.every(word=>variants(word).some(q=>hay.includes(q)));}
 window.MetaSearch={...base,normalize:base.normalize||normalize,matches,score:(query,fields)=>matches(query,fields)?1:0,registerAliases:register,queryVariants:variants,languagePolicy:'Search content across languages; interface language never filters deck results.'};
})();
