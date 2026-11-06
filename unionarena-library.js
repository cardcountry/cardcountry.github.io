(()=>{
  'use strict';
  const data=window.UNION_ARENA_DATA, recipes=window.UNION_ARENA_RECIPES||[];
  const catalog=window.UNION_ARENA_CATALOG;
  const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;};
  const image=(src,name)=>{const n=el('img');n.src=src;n.alt=name;n.loading='lazy';return n;};
  const stats=c=>{const box=el('div',null,'event-composition');[['energyCharacter','能量角色'],['special','SPECIAL'],['colour','COLOR'],['final','FINAL']].forEach(([key,label])=>{const n=el('span');n.append(el('b',String(c[key])),el('small',label));box.append(n);});return box;};
  const tile=(card,copies)=>{const n=el('article',null,'ua-list-card');n.append(image(card.image,card.name),el('b',card.name),el('span',card.number));if(copies)n.append(el('strong','×'+copies));return n;};
  const modal=document.querySelector('#uaDeckModal');let opener;
  function close(){modal.classList.add('hidden');document.body.style.overflow='';opener?.focus();}
  document.querySelector('#uaDeckClose').onclick=close;
  modal.addEventListener('click',e=>{if(e.target===modal)close();});
  modal.addEventListener('keydown',e=>{if(e.key==='Escape')close();if(e.key==='Tab'){const a=[...modal.querySelectorAll('button,a[href]')];if(e.shiftKey&&document.activeElement===a[0]){e.preventDefault();a.at(-1).focus();}else if(!e.shiftKey&&document.activeElement===a.at(-1)){e.preventDefault();a[0].focus();}}});
  for(const deck of data.eventDecks||[]){
    const recipe=recipes.find(r=>r.deckCode===deck.deckCode);if(!recipe||recipe.composition.total!==50)continue;
    const button=el('button',null,'event-deck-card');button.type='button';
    const copy=el('div',null,'event-deck-copy');copy.append(el('span',deck.place+' · '+deck.colour),el('h3',deck.series),el('p',deck.event+' · 公开 '+deck.revealed),stats(recipe.composition));button.append(image(deck.thumbnail,deck.series),copy);
    button.onclick=()=>{opener=button;document.querySelector('#uaDeckName').textContent=deck.series;document.querySelector('#uaDeckMeta').textContent=deck.place+' · '+deck.colour;document.querySelector('#uaDeckEvent').textContent=deck.event+' · 公开 '+deck.revealed+' · 核验 2026-11-06';const img=document.querySelector('#uaDeckImage');img.src=deck.thumbnail;img.alt=deck.series;document.querySelector('#uaDeckSource').href=deck.recipe;document.querySelector('#uaDeckComposition').replaceChildren(...stats(recipe.composition).children);document.querySelector('#uaDeckStatus').textContent='50 / 50 · 不含 AP';document.querySelector('#uaCardList').replaceChildren(...recipe.cards.map(c=>tile(c,c.copies)));modal.classList.remove('hidden');document.body.style.overflow='hidden';document.querySelector('#uaDeckClose').focus();};
    document.querySelector('#eventDeckGrid').append(button);
  }
  if(!catalog)return;
  const panel=el('div',null,'ua-local-library');const heading=el('h2','站内卡牌图鉴');
  panel.append(heading,el('p',`${catalog.cards.length.toLocaleString()} 张已公开卡图（含异画） · ${catalog.coverage?.length||1} 个作品目录 · 英文北美版 · 核验 ${catalog.checked}。不包含官方尚未公布图片的条目；不代表日文及亚洲版完整卡池。`));
  const input=el('input');input.type='search';input.placeholder='搜索卡名 / 卡号，例如 Ichigo、BLC-4-025';input.setAttribute('aria-label','搜索站内 UA 卡牌');
  const count=el('p');count.setAttribute('aria-live','polite');const grid=el('div',null,'ua-catalog-grid');
  const filters=el('div',null,'usage-controls');const series=el('select'),set=el('select');series.setAttribute('aria-label','作品');set.setAttribute('aria-label','系列');
  function options(select,values,label){select.replaceChildren();const all=el('option',label);all.value='';select.append(all);values.forEach(v=>{const o=el('option',v);o.value=v;select.append(o);});}
  options(series,[...new Set(catalog.cards.map(c=>c.series))],'全部作品');options(set,[...new Set(catalog.cards.map(c=>c.set))],'全部系列');filters.append(series,set);
  let page=1;const more=el('button','加载更多','search-submit');more.type='button';
  function render(){const q=input.value.trim().toLowerCase();const cards=catalog.cards.filter(c=>(c.number+' '+c.name).toLowerCase().includes(q)&&(!series.value||c.series===series.value)&&(!set.value||c.set===set.value));count.textContent=`${cards.length} 张卡牌 · 已显示 ${Math.min(cards.length,page*60)} 张`;grid.replaceChildren(...cards.slice(0,page*60).map(c=>{const a=el('a');a.href=c.source;a.target='_blank';a.rel='noopener';a.append(tile(c));return a;}));more.hidden=page*60>=cards.length;if(!cards.length)grid.append(el('p','没有匹配卡牌，请尝试卡号或英文卡名。'));}
  input.addEventListener('input',()=>{page=1;render();});series.addEventListener('change',()=>{options(set,[...new Set(catalog.cards.filter(c=>!series.value||c.series===series.value).map(c=>c.set))],'全部系列');page=1;render();});set.addEventListener('change',()=>{page=1;render();});more.onclick=()=>{page++;render();};panel.append(input,filters,count,grid,more);document.querySelector('#catalog .wrap').prepend(panel);render();
})();
