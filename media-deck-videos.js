(()=>{
 'use strict';
 const data=window.META_LAB_VIDEO_DATA||{videos:[]},normalize=v=>String(v||'').normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]/gu,''),esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const flatten=value=>Array.isArray(value)?value.flatMap(flatten):value&&typeof value==='object'?Object.values(value).flatMap(flatten):[String(value??'')];

 const media=video=>{
  const platform=video.platform||'bilibili';
  if(platform==='bilibili'&&/^BV[\da-zA-Z]{10}$/.test(video.bvid||''))return {id:video.bvid,key:video.bvid,name:'Bilibili',source:'https://www.bilibili.com/video/'+encodeURIComponent(video.bvid)+'/',embed:'https://player.bilibili.com/player.html?bvid='+encodeURIComponent(video.bvid)+'&page=1&autoplay=0'};
  if(platform==='youtube'&&typeof video.youtubeId==='string'&&/^[A-Za-z0-9_-]{11}$/.test(video.youtubeId))return {id:video.youtubeId,key:'youtube:'+video.youtubeId,name:'YouTube',source:'https://www.youtube.com/watch?v='+encodeURIComponent(video.youtubeId),embed:video.embedAllowed===true?'https://www.youtube-nocookie.com/embed/'+encodeURIComponent(video.youtubeId)+'?autoplay=0&rel=0':''};
  return null;
 };
 function select(game,context={}){
  const names=[context.archetype,context.name,context.key,context.legend,context.leader,context.blade,context.series].filter(Boolean),cards=flatten(context.cards||[]).map(normalize),format=String(context.format||''),region=normalize(context.region),blade=normalize(context.blade||context.archetype);
  const selected=data.videos.filter(video=>{
   if(video.game!==game||video.verification!=='verified'||!media(video))return false;
   const match=video.match||{};let relevant=false;
   if(match.deckIds?.length){if(!match.deckIds.includes(context.deckId))return false;relevant=true;}
   if(match.blades?.length)relevant=match.blades.some(value=>normalize(value)===blade);
   const archetypeMatched=match.archetypes?.some(alias=>names.some(name=>normalize(alias)===normalize(name)||(window.MetaSearch?.matches(alias,[name])??false)))||false;
   if(match.requireArchetype&&!archetypeMatched)return false;
   relevant||=archetypeMatched;
   if(match.cardCodes?.length){if(!match.cardCodes.every(code=>cards.includes(normalize(code))))return false;relevant=true;}
   if(match.cardNames?.length){if(!match.cardNames.every(name=>cards.includes(normalize(name))))return false;relevant=true;}
   if(!relevant)return false;
   if(match.colours?.length&&!match.colours.some(value=>normalize(value)===normalize(context.colour||context.color)))return false;
   if(match.excludeFormats?.some(value=>normalize(format).includes(normalize(value))))return false;
   if(match.formats?.length&&!match.formats.some(value=>new RegExp('(^|[^a-z0-9])'+String(value).replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'($|[^a-z0-9.])','i').test(format)))return false;
   if(match.regions?.length&&!match.regions.some(value=>normalize(value)===region))return false;
   if(match.parts&&Object.entries(match.parts).some(([key,value])=>normalize(context[key])!==normalize(value)))return false;
   return true;
  });
  return selected.filter((video,index)=>selected.findIndex(v=>media(v).key===media(video).key)===index).sort((a,b)=>String(b.publishedAt||'').localeCompare(String(a.publishedAt||'')));
 }
 const relation=video=>video.relation==='exact-combo'?'对应完整配置':video.relation==='exact-deck'?'对应完整卡表':video.relation==='same-blade-reference'?'同刃轮参考':'同牌型参考';
 function cards(game,context){return select(game,context).map(video=>{
  const item=media(video),play=item.embed?'<button type="button" data-video-play="'+esc(item.key)+'" aria-label="播放 '+esc(video.title)+'">▶ 播放视频</button>':'<span>此视频请在原站观看</span>';
  return '<article class="video-card related-video" data-video-id="'+esc(item.key)+'"><div class="video-meta"><small>'+item.name+' · '+esc(video.kind||'教学与对战')+' · '+relation(video)+(video.historical?' · 历史资料':'')+'</small><b>'+esc(video.title)+'</b><span>'+esc(video.creator||'发布者未注明')+' · '+esc(video.publishedAt||'发布日期未注明')+'</span><p>'+esc(video.scope)+'</p><div class="related-video-actions">'+play+'<a href="'+esc(item.source)+'" target="_blank" rel="noopener noreferrer">观看原视频 ↗</a></div></div>'+(item.embed?'<div class="video-frame" data-video-player hidden></div>':'')+'</article>';
 }).join('');}
 if(typeof document!=='undefined')document.addEventListener('click',event=>{
  const button=event.target?.closest?.('[data-video-play]');if(!button)return;
  const video=data.videos.find(item=>item.verification==='verified'&&media(item)?.key===button.dataset.videoPlay),item=video&&media(video);if(!item?.embed)return;
  const frame=button.closest('[data-video-id]')?.querySelector('[data-video-player]');if(!frame||frame.querySelector('iframe'))return;
  const player=document.createElement('iframe');player.loading='lazy';player.src=item.embed;player.title=video.title;player.allowFullscreen=true;player.referrerPolicy='strict-origin-when-cross-origin';frame.hidden=false;frame.append(player);button.hidden=true;
 });
 window.MetaLabMedia={select,cards,data};
})();
