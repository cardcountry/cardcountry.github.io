/* Visually reconstructed physical deck photo · original post and image retained. */
(()=>{
  const data=window.OPCG_DATA;if(!data)return;
  const deck=(data.meta?.OP17||[]).find(item=>item.leader==='OP05-098');if(!deck)return;
  const photoList={
    id:'x-photo-2117519511616409927',player:'ジョーカー / @AYAKANA_1124',placement:'Hokkaido Area 7-2',event:'Hokkaido Area',host:'Player-published physical deck photo',date:'2026-11-03',country:'Japan',players:null,format:'OP17.5 POST-BAN',source:'X · physical deck photo',sourceUrl:'https://x.com/AYAKANA_1124/status/2117519511616409927',sourceImageUrl:'https://pbs.twimg.com/media/HWLwxNTbwAAqcKC.jpg?name=orig',sourceType:'photo',visualVerified:true,transcribedAt:'2026-11-05',verification:'50/50 cards visually reconstructed',reportedRecord:'Hokkaido Area 7-2 · recent Flagship aggregate 15-0',cards:[
      {qty:4,code:'OP17-112',name:'Charlotte Linlin',category:'Character'},
      {qty:4,code:'OP16-119',name:'Marshall.D.Teach',category:'Character'},
      {qty:4,code:'OP16-108',name:'Shiryu',category:'Character'},
      {qty:4,code:'EB04-058',name:'Borsalino',category:'Character'},
      {qty:4,code:'OP17-102',name:'Charlotte Oven',category:'Character'},
      {qty:4,code:'OP16-104',name:'Catarina Devon',category:'Character'},
      {qty:4,code:'OP17-109',name:'Charlotte Pudding',category:'Character'},
      {qty:4,code:'OP15-103',name:'Genbo',category:'Character'},
      {qty:4,code:'OP17-107',name:'Charlotte Daifuku',category:'Character'},
      {qty:3,code:'OP09-114',name:'Lindbergh',category:'Character'},
      {qty:3,code:'OP11-106',name:'Zeus',category:'Character'},
      {qty:2,code:'EB01-059',name:'Kingdom Come',category:'Event'},
      {qty:4,code:'OP14-118',name:"You'll Frighten Me... ♡",category:'Event'},
      {qty:2,code:'OP06-115',name:"You're the One Who Should Disappear.",category:'Event'}
    ]
  };
  if(photoList.cards.reduce((sum,card)=>sum+card.qty,0)!==50)return;
  if(!deck.lists.some(list=>list.id===photoList.id))deck.lists.unshift(photoList);
  data.xSignals=data.xSignals||[];
  if(!data.xSignals.some(signal=>signal.url===photoList.sourceUrl))data.xSignals.unshift({deck:'OP05-098',title:'Yellow Enel · Hokkaido Area 7-2 physical photo list',detail:'原帖报告北海道 Area 7-2，并提到近期 Flagship 合计 15-0；50 张主牌已从原始照片逐张复核，不推断未声明名次。',handle:'@AYAKANA_1124',date:'2026-11-03',url:photoList.sourceUrl,sourceImageUrl:photoList.sourceImageUrl,visualVerified:true});
  data.sources=data.sources||[];
  if(!data.sources.some(source=>source.name==='Player-published physical deck photos'))data.sources.push({name:'Player-published physical deck photos',type:'实体卡表照片 / 玩家战绩',url:photoList.sourceUrl,note:'只导入能从原图复核为完整 50 张、并保留发布者原帖与原始战绩措辞的卡表。'});
  data.generated='2026-11-05';
})();

