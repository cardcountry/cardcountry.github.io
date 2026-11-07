(()=>{
 'use strict';
 const main=document.querySelector('main');if(!main)return;
 const path=location.pathname.split('/').pop(),isHome=!path||path==='index.html';
 const byId=id=>document.getElementById(id),node=(tag,text)=>{const n=document.createElement(tag);if(text)n.textContent=text;return n;};
 const copies={zh:{title:'快速开始',decks:'找卡表',cards:'查图鉴',rules:'看规则',ranking:'使用率',hint:'中文 / English / 日本語 · 已收录译名与卡号可互搜',top:'返回顶部'},ja:{title:'QUICK ACCESS',decks:'デッキ',cards:'カード',rules:'ルール',ranking:'使用率',hint:'中文 / English / 日本語 · 収録済みの別名とカード番号で検索',top:'トップへ'},en:{title:'QUICK ACCESS',decks:'Decks',cards:'Cards',rules:'Rules',ranking:'Usage',hint:'中文 / English / 日本語 · Search indexed aliases and card numbers',top:'Back to top'}};
 const locale=()=>document.documentElement.lang.startsWith('ja')?'ja':document.documentElement.lang.startsWith('en')?'en':'zh';
 let bar,back;
 function update(){const copy=copies[locale()];if(bar){bar.querySelector('strong').textContent=copy.title;for(const a of bar.querySelectorAll('[data-quick-label]'))a.textContent=copy[a.dataset.quickLabel];}for(const hint of document.querySelectorAll('.cross-search-hint'))hint.textContent=copy.hint;back?.setAttribute('aria-label',copy.top);}
 if(!isHome){bar=node('div');bar.className='quick-tools';bar.setAttribute('role','navigation');bar.setAttribute('aria-label','快速操作 / Quick access');bar.append(node('strong'));const deckInput=byId('deckSearch')||byId('configSearch')||document.querySelector('input[aria-label="搜索 UA 卡组"]')||byId('officialSearch'),deckSection=deckInput?.closest('section'),cardInput=byId('cardSearch')||byId('partSearch');const links=[['decks',byId('meta')||deckSection],['cards',byId('cards')||byId('catalog')||cardInput?.closest('section')],['rules',byId('rules')||byId('learn')],['ranking',byId('usage-ranking')]];for(const [key,target]of links){if(!target?.id)continue;const a=node('a');a.href='#'+target.id;a.dataset.quickLabel=key;bar.append(a);}main.prepend(bar);
  const inputs=[...new Set([deckInput,document.querySelector('input[aria-label="搜索 UA 卡组"]')].filter(Boolean))];for(const input of inputs){const hint=node('small');hint.className='cross-search-hint';const host=input.closest('.deck-finder')||input.parentElement;host.append(hint);}document.addEventListener('keydown',e=>{if(e.key==='/'&&!e.ctrlKey&&!e.metaKey&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)&&!document.activeElement.isContentEditable&&deckInput){e.preventDefault();deckInput.focus();deckInput.scrollIntoView({block:'center',behavior:'smooth'});}});
 }
 back=node('button','↑');back.type='button';back.className='back-to-top';back.addEventListener('click',()=>window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}));document.body.append(back);
 (byId('uiLang')||byId('homeLang'))?.addEventListener('change',()=>requestAnimationFrame(update));update();
})();
