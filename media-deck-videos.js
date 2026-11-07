(()=>{
 'use strict';
 const data=window.META_LAB_VIDEO_DATA||{videos:[]},normalize=v=>String(v||'').normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]/gu,''),esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const flatten=value=>Array.isArray(value)?value.flatMap(flatten):value&&typeof value==='object'?Object.values(value).flatMap(flatten):[String(value??'')];
 function select(game,context={}){
  const names=[context.archetype,context.name,context.key,context.legend,context.leader,context.blade].filter(Boolean),cards=flatten(context.cards||[]).map(normalize),format=String(context.format||''),region=normalize(context.region),blade=normalize(context.blade||context.archetype);
  return data.videos.filter(video=>{
   if(video.game!==game||video.verification!=='verified'||!/^BV[\da-zA-Z]{10}$/.test(video.bvid))return false;
   const match=video.match||{};let relevant=false;
   if(match.blades?.length)relevant=match.blades.some(value=>normalize(value)===blade);
   if(match.archetypes?.length)relevant||=match.archetypes.some(alias=>names.some(name=>normalize(alias)===normalize(name)||(window.MetaSearch?.matches(alias,[name])??false)));
   if(match.cardCodes?.length){if(!match.cardCodes.every(code=>cards.includes(normalize(code))))return false;relevant=true;}
   if(match.cardNames?.length){if(!match.cardNames.every(name=>cards.includes(normalize(name))))return false;relevant=true;}
   if(!relevant)return false;
   if(match.excludeFormats?.some(value=>normalize(format).includes(normalize(value))))return false;
   if(match.formats?.length&&!match.formats.some(value=>new RegExp('(^|[^a-z0-9])'+String(value).replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'($|[^a-z0-9.])','i').test(format)))return false;
   if(match.regions?.length&&!match.regions.some(value=>normalize(value)===region))return false;
   if(match.parts&&Object.entries(match.parts).some(([key,value])=>normalize(context[key])!==normalize(value)))return false;
   return true;
  });
 }
 function cards(game,context){return select(game,context).map(video=>'<article class="video-card related-video" data-video-id="'+esc(video.bvid)+'"><div class="video-frame"><iframe loading="lazy" src="https://player.bilibili.com/player.html?bvid='+encodeURIComponent(video.bvid)+'&amp;page=1&amp;autoplay=0" title="'+esc(video.title)+'" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div><div class="video-meta"><small>Bilibili · '+esc(video.kind||'教学与对战')+'</small><b>'+esc(video.title)+'</b><span>'+esc(video.creator)+' · '+esc(video.publishedAt||'发布日期未注明')+'</span><p>'+esc(video.scope)+'</p><a href="https://www.bilibili.com/video/'+encodeURIComponent(video.bvid)+'/" target="_blank" rel="noopener">观看原视频 ↗</a></div></article>').join('');}
 window.MetaLabMedia={select,cards,data};
})();
