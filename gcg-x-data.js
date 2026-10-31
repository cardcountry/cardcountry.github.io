(()=>{
  'use strict';
  const meta=window.GCG_DATA?.meta;
  if(!meta)return;
  meta.xSignals=[
    {id:'x-milwaukee-20261005',handle:'EgmanEvents',account:'Egman Events',date:'2026-10-05',event:'Play!TCG Milwaukee Regionals',placement:1,player:'Taidana',archetype:"Char's Z'Gok / Gundam",colors:['Blue'],players:500,code:'ST11-001',secondary:['ST01-001'],eventId:'ac89207a-b54d-4be6-bc14-1b8e428b467c',verified:'cross',note:'X 公布 Top 16；冠军、人数与卡表已和站内赛事资料交叉核对。',keywords:['Milwaukee','密尔沃基','密爾沃基','ミルウォーキー',"Char Z'Gok",'冠军','冠軍','優勝'],url:'https://x.com/EgmanEvents/status/2106933893899358666/photo/4'},
    {id:'x-lille-20261013',handle:'GundamTCGmeta',account:'Gundam TCG Meta',date:'2026-10-13',event:'Gundam Regional Lille',placement:1,player:'Dave',archetype:'Nu Gundam',colors:['Green'],players:200,code:'GD05-017',secondary:[],eventId:'d3a6a145-dbca-44ea-ac96-d035c712c020',verified:'cross',note:'X 冠军报道；赛事日期、人数与完整冠军卡表已和站内资料交叉核对。',keywords:['Lille','里尔','里爾','リール','Nu Gundam','ν Gundam','冠军','冠軍','優勝'],url:'https://x.com/GundamTCGmeta/status/2110043536624431550'}
  ];
  if(!(meta.sources||[]).some(source=>source.name==='X / Twitter · Verified GCG Decklists')){
    meta.sources.push({name:'X / Twitter · Verified GCG Decklists',role:'Regional results retained only when a complete in-app decklist can be cross-checked',url:'https://x.com/'});
  }
})();
