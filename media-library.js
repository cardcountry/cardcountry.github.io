(()=>{
 'use strict';
 const game=window.BEYX_DATA?'beyblade':window.UNION_ARENA_DATA?'unionarena':window.OPCG_DATA?'opcg':window.GCG_DATA?'gcg':window.RIFTBOUND_DATA?'riftbound':window.MARVEL_DATA?'marvel':typeof decklists!=='undefined'?'ptcg':'';
 if(!game)return;
 const library={
  beyblade:[
   ['BV19VrGB4EH2','时钟幻象 7-55UN 实测与 UX-18 开箱','白神ShiroKami','2026-01-10','博主实测','Clock Mirage · 7-55 · Under Needle'],
   ['BV18ChizmEcE','鲛鲨狂鳞：三种非标准搭配测试','原视频发布者',null,'创意改造','Shark Scale · UX-15'],
   ['BV154CyBRE1w','CX-11 帝王威能三合一与攻击配置测试','白神ShiroKami','2025-11-15','博主实测','CX-11 · 攻击改造'],
   ['BV1qaZrBRE7g','28 款比赛配置与新手选配参考','白神ShiroKami','2026-02-20','配置教学','历史环境 · 非当前使用率排名']
  ],
  ptcg:[['BV19Max6yEu7','2026–2027 法兰克福 Regional 对战录像','哈皮CYHAPPY','2026-09-27','赛事录像','国际版 · M5 + 30周年 · 含多龙对局']],
  unionarena:[['BV17C411x7Mx','奏多＆诺娃卡组介绍','携战之境','2024-02-23','卡组教学','奇异贤伴 黑色天使 · 历史版本']],
  gcg:[['BV1rJbM6YEB3','高达卡牌：新手卡组选购参考','闪刀第一巴图鲁','2026-09-07','入门教学','GUNDAM CARD GAME'],['BV14JK66VEYG','GD05 自由高达：蓝绿地球联邦对战奥布自由','原视频发布者',null,'对战分析','GD05 · 历史版本']],
  riftbound:[['BV1Ckbe6CEbK','以艾翁为例的卡牌构筑与概率分析','巴黎流浪汉赖拉里','2026-08-18','构筑教学','艾翁 · 非赛事使用率数据'],['BV1shrWByEuL','钓钩剑姬构筑介绍与实战','闪电家_武汉店卡牌','2026-01-14','卡组教学','剑姬 · 历史版本']],
  opcg:[['BV1cwmgBUEe5','航海指针：蓝黄汉库珂构筑介绍','航海王卡牌对战',null,'卡组教学','简体中文版 · 非 EB05 环境指南']],
  marvel:[]
 };
 const node=(tag,text)=>{const n=document.createElement(tag);if(text)n.textContent=text;return n;};const section=node('section');section.className='usage-ranking media-library';section.id='bilibili-videos';section.append(node('small','BILIBILI · CREATOR VIDEOS'),node('h2',game==='beyblade'?'博主实测与创意改造':'Bilibili 教学与对战'),node('p','按卡组、配置和视频版本选择观看。博主测试与个人观点不计入赛事战绩或使用率；历史视频不代表当前环境。页面元数据核对：2026-11-07。'));
 const filters=node('div');filters.className='usage-controls';const select=node('select');select.setAttribute('aria-label','视频分类');for(const tag of ['全部视频',...new Set(library[game].map(v=>v[4]))])select.append(node('option',tag));const search=node('input');search.type='search';search.placeholder='搜索卡组、陀螺或配置';search.setAttribute('aria-label','搜索视频');filters.append(select,search);section.append(filters);
 const grid=node('div');grid.className='media-grid';section.append(grid);
 function render(){grid.replaceChildren();for(const [bvid,title,creator,date,kind,scope] of library[game].filter(v=>(select.selectedIndex===0||v[4]===select.value)&&v.join(' ').toLowerCase().includes(search.value.trim().toLowerCase()))){const card=node('article');card.className='media-card';card.append(node('small',kind),node('h3',title),node('p',scope),node('p',creator+' · '+(date||'发布日期待核验')));const open=node('a','在 Bilibili 观看 ↗');open.href='https://www.bilibili.com/video/'+bvid+'/';open.target='_blank';open.rel='noopener';card.append(open);grid.append(card);}if(!grid.children.length)grid.append(node('p',game==='marvel'?'暂未找到可核验的 MARVEL HERO RUSH 实体卡牌 Bilibili 视频；不混入同名手游或电影内容。':'没有符合条件的视频。'));}
 select.onchange=render;search.oninput=render;(document.querySelector('main')||document.body).append(section);render();const nav=document.querySelector('header nav');if(nav){const a=node('a',game==='beyblade'?'实测视频':'Bilibili');a.href='#bilibili-videos';nav.append(a);}
})();
