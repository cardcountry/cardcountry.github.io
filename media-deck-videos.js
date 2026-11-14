(()=>{
 'use strict';
 const data=window.META_LAB_VIDEO_DATA||{videos:[]},normalize=v=>String(v||'').normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]/gu,''),esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const flatten=value=>Array.isArray(value)?value.flatMap(flatten):value&&typeof value==='object'?Object.values(value).flatMap(flatten):[String(value??'')];
 function select(game,context={}){
  const names=[context.archetype,context.name,context.key,context.legend,context.leader,context.blade,context.series].filter(Boolean),cards=flatten(context.cards||[]).map(normalize),format=String(context.format||''),region=normalize(context.region),blade=normalize(context.blade||context.archetype);
  const selected=data.videos.filter(video=>{
   if(video.game!==game||video.verification!=='verified'||!/^BV[\da-zA-Z]{10}$/.test(video.bvid))return false;
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
  return selected.filter((video,index)=>selected.findIndex(v=>v.bvid===video.bvid)===index).sort((a,b)=>String(b.publishedAt||'').localeCompare(String(a.publishedAt||'')));
 }
 const relation=video=>video.relation==='exact-deck'?'对应完整卡表':video.relation==='same-blade-reference'?'同刃轮参考':'同牌型参考';
 function cards(game,context){return select(game,context).map(video=>'<article class="video-card related-video" data-video-id="'+esc(video.bvid)+'"><div class="video-meta"><small>Bilibili · '+esc(video.kind||'教学与对战')+' · '+relation(video)+(video.historical?' · 历史资料':'')+'</small><b>'+esc(video.title)+'</b><span>'+esc(video.creator||'发布者未注明')+' · '+esc(video.publishedAt||'发布日期未注明')+'</span><p>'+esc(video.scope)+'</p><div class="related-video-actions"><button type="button" data-video-play="'+esc(video.bvid)+'" aria-label="播放 '+esc(video.title)+'">▶ 播放视频</button><a href="https://www.bilibili.com/video/'+encodeURIComponent(video.bvid)+'/" target="_blank" rel="noopener noreferrer">观看原视频 ↗</a></div></div><div class="video-frame" data-video-player hidden></div></article>').join('');}
 if(typeof document!=='undefined')document.addEventListener('click',event=>{
  const button=event.target?.closest?.('[data-video-play]');if(!button)return;
  const video=data.videos.find(item=>item.bvid===button.dataset.videoPlay&&item.verification==='verified'&&/^BV[\da-zA-Z]{10}$/.test(item.bvid));if(!video)return;
  const frame=button.closest('[data-video-id]')?.querySelector('[data-video-player]');if(!frame||frame.querySelector('iframe'))return;
  const player=document.createElement('iframe');player.loading='lazy';player.src='https://player.bilibili.com/player.html?bvid='+encodeURIComponent(video.bvid)+'&page=1&autoplay=0';player.title=video.title;player.allowFullscreen=true;player.referrerPolicy='strict-origin-when-cross-origin';frame.hidden=false;frame.append(player);button.hidden=true;
 });
 window.MetaLabMedia={select,cards,data};
})();
