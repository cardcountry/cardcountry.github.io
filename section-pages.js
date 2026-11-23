(()=>{'use strict';
const M=window.METALAB_SECTIONS,html=document.documentElement,gameId=html.dataset.pageGame,view=html.dataset.pageView,G=M?.games[gameId];if(!G||!view)return;
const updateLabels={'zh-cn':'维护日志（需登录）',zh:'維護日誌（需登入）',en:'Maintenance log (sign in)',ja:'メンテナンス履歴（要ログイン）'};const updateFooter=document.querySelector('body>footer');if(updateFooter&&!updateFooter.querySelector('[data-updates-link]')){const a=document.createElement('a');a.href='updates.html';a.dataset.updatesLink='';a.className='section-updates-link';a.textContent='维护日志（需登录）';updateFooter.append(a);}

const path=(topic='overview')=>topic==='overview'?`${gameId}.html`:`${gameId}-${topic}.html`;
const pick=()=>{const value=(document.getElementById('uiLang')||document.getElementById('homeLang'))?.value;return M.words[value]?value:html.lang.startsWith('en')?'en':html.lang.startsWith('ja')?'ja':html.lang==='zh-Hant'?'zh':'zh-cn';};
const copy=(topic,lang)=>gameId==='beyblade'&&topic==='decks'?[M.words[lang].beyMeta,M.words[lang].beyMetaShort,M.words[lang].beyMetaDesc]:M.topics[topic].labels[lang];
function topicForHash(hash){const key=hash.replace(/^#/,'');if(key==='usage-ranking')return'usage';if(['top','home','games',''].includes(key))return'overview';for(const [topic,ids]of Object.entries(G.roots))if(ids.includes(key))return topic;return null;}
function resolveLink(raw){if(!raw||raw.startsWith('http')||raw.startsWith('//'))return raw;const match=raw.match(/^(?:(ptcg|v22|gcg|opcg|unionarena|riftbound|marvel|beyblade)\.html)?(#[\w-]+)$/);if(!match)return raw;const targetGame=match[1]==='v22'?'ptcg':match[1]||gameId;const target=M.games[targetGame];const key=match[2].slice(1);let topic=key==='usage-ranking'?'usage':null;for(const [name,ids]of Object.entries(target.roots))if(ids.includes(key))topic=name;if(!topic&&['top','home'].includes(key))topic='overview';if(!topic)return raw;return topic==='overview'?`${targetGame}.html`:`${targetGame}-${topic}.html`;}
const oldTopic=topicForHash(location.hash);if(location.hash&&oldTopic&&oldTopic!==view){location.replace(path(oldTopic)+location.search);return;}
document.addEventListener('click',event=>{if(primaryNav?.classList.contains('open')&&(!header.contains(event.target)||event.target.closest('.ml-header-nav a[href]')))menuState(false);const a=event.target.closest('a[href]');if(!a||event.defaultPrevented||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;const raw=a.getAttribute('href'),next=resolveLink(raw);if(next!==raw){event.preventDefault();location.assign(next);}},true);
const select=document.querySelector('[data-section-select]');select?.addEventListener('change',()=>location.assign(select.value));
document.querySelector('[data-game-picker]')?.addEventListener('change',event=>location.assign(event.target.value));
const chromeWords={'zh-cn':['打开导航','关闭导航'],'zh':['開啟導覽','關閉導覽'],en:['Open navigation','Close navigation'],ja:['ナビゲーションを開く','ナビゲーションを閉じる']};
const header=document.querySelector('body>.ml-site-header'),primaryNav=header?.querySelector('.ml-header-nav'),menuButton=header?.querySelector('#menuBtn');
const personalRecordsCopy={'zh-cn':['我的战绩','战绩只存当前浏览器，可下载图片或JSON备份。'],zh:['我的戰績','戰績只存目前瀏覽器，可下載圖片或JSON備份。'],en:['My records','Records stay on this browser. Export images or a JSON backup.'],ja:['自分の戦績','このブラウザーだけに保存。画像やJSONで書き出せます。']};
const personalRecordsUrl='battle-records.html?game='+encodeURIComponent(gameId);
if(primaryNav){const personalNav=document.createElement('a');personalNav.href=personalRecordsUrl;personalNav.target='_top';personalNav.dataset.personalRecordsLabel='';primaryNav.append(personalNav);}
const personalGrid=view==='overview'?document.querySelector('.ml-topic-grid'):null;if(personalGrid){const a=document.createElement('a');a.className='ml-topic-card';a.href=personalRecordsUrl;a.target='_top';a.innerHTML='<span class="ml-topic-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M7 4H4v17h16V4h-3M8 2h8v5H8zM8 11h8M8 15h5"/></svg></span><span class="ml-topic-copy"><strong data-personal-records-label></strong><small data-personal-records-desc></small></span>';personalGrid.append(a);}

function menuState(open){if(!primaryNav||!menuButton)return;primaryNav.classList.toggle('open',open);menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',chromeWords[pick()][open?1:0]);if(menuButton.firstElementChild)menuButton.firstElementChild.textContent=open?'×':'☰';}
// Own this control before the retained legacy engines' click handlers run.
menuButton?.addEventListener('click',event=>{event.preventDefault();event.stopImmediatePropagation();menuState(!primaryNav.classList.contains('open'));},true);
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&primaryNav?.classList.contains('open')){menuState(false);menuButton.focus();}});
window.matchMedia?.('(min-width:1181px)').addEventListener?.('change',event=>{if(event.matches)menuState(false);});
function update(){const lang=pick(),W=M.words[lang],C=copy(view,lang);if(menuButton)menuButton.setAttribute('aria-label',chromeWords[lang][primaryNav.classList.contains('open')?1:0]);primaryNav?.setAttribute('aria-label',W.choose);select?.setAttribute?.('aria-label',W.choose);document.querySelector('[data-game-picker]')?.setAttribute?.('aria-label',W.switch);for(const node of document.querySelectorAll('[data-section-topic]')){const text=copy(node.dataset.sectionTopic,lang);node.textContent=text[Number(node.dataset.sectionCopy||0)];}for(const node of document.querySelectorAll('[data-section-word]'))node.textContent=W[node.dataset.sectionWord];for(const node of document.querySelectorAll('[data-game-home]'))node.textContent=G.code;const title=`${C[0]} · ${G.name} — META LAB`;if(document.title!==title)document.title=title;for(const element of document.querySelectorAll('[data-section-language]'))element.setAttribute('aria-label',W.language);if(view==='overview'){html.lang=lang==='zh'?'zh-Hant':lang==='zh-cn'?'zh-Hans':lang;try{localStorage.setItem('metalab-section-language',lang);}catch{}}for(const link of document.querySelectorAll('[data-updates-link]'))link.textContent=updateLabels[lang];for(const node of document.querySelectorAll('[data-personal-records-label]'))node.textContent=personalRecordsCopy[lang][0];for(const node of document.querySelectorAll('[data-personal-records-desc]'))node.textContent=personalRecordsCopy[lang][1];document.dispatchEvent(new CustomEvent('metalab:section-language',{detail:{language:lang}}));}
const languageSelect=document.getElementById('uiLang')||document.getElementById('homeLang');
try{const saved=localStorage.getItem('metalab-section-language');if(languageSelect&&M.words[saved]&&languageSelect.value!==saved){languageSelect.value=saved;if(!['overview','news'].includes(view))languageSelect.dispatchEvent(new Event('change',{bubbles:true}));}}catch{}
if(['overview','news'].includes(view)&&languageSelect)html.lang=languageSelect.value==='zh'?'zh-Hant':languageSelect.value==='zh-cn'?'zh-Hans':languageSelect.value;
languageSelect?.addEventListener('change',()=>{try{localStorage.setItem('metalab-section-language',languageSelect.value);}catch{}if(['overview','news'].includes(view))html.lang=languageSelect.value==='zh'?'zh-Hant':languageSelect.value==='zh-cn'?'zh-Hans':languageSelect.value;queueMicrotask(update);});update();
new MutationObserver(()=>{const lang=pick(),title=`${copy(view,lang)[0]} · ${G.name} — META LAB`;if(document.title!==title)document.title=title;}).observe(document.querySelector('title'),{childList:true,subtree:true,characterData:true});
if(view==='overview'){const host=document.querySelector('[data-hub-updates]');if(host)fetch('activity-feed.json?v=2026110801',{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error(r.status);return r.json();}).then(data=>{const recentDate=row=>[row.publishedOn,row.sourceUpdatedOn].filter(Boolean).sort().at(-1)||(row.eventOn&&row.eventOn<=data.builtOn?row.eventOn:'');const rows=data.items.filter(x=>x.game===gameId).sort((a,b)=>recentDate(b).localeCompare(recentDate(a))).slice(0,3);host.replaceChildren();for(const row of rows){const a=document.createElement('a');a.href=path('news');const small=document.createElement('small');small.textContent=[recentDate(row),row.sourceName].filter(Boolean).join(' · ');const title=document.createElement('strong');title.textContent=row.title;a.append(small,title);host.append(a);}if(!rows.length){const a=document.createElement('a');a.href=path('news');a.textContent=M.words[pick()].empty;host.append(a);}}).catch(()=>{host.replaceChildren();const a=document.createElement('a');a.href=path('news');a.textContent=M.words[pick()].empty;host.append(a);});}
})();
/* Shared dialog keyboard support. UA's existing custom/native dialogs own their focus behavior. */
(()=>{
 'use strict';
 if(!document.documentElement.dataset.pageView)return;
 const dialogs=[...document.querySelectorAll('.modal[role="dialog"]')];if(!dialogs.length)return;
 const focusable='a[href],button,input,select,textarea,summary,iframe,[contenteditable="true"],[tabindex]:not([tabindex="-1"])';
 let stack=[],lastTrigger=null,lastFocused=document.activeElement;
 const open=modal=>modal.classList.contains('open');
 const available=node=>node?.isConnected&&!node.disabled&&!node.closest('[hidden],.hidden,[data-inactive-root]')&&node.getClientRects().length>0;
 const entries=modal=>[...modal.querySelectorAll(focusable)].filter(node=>node.tabIndex>=0&&available(node));
 const closeButton=modal=>modal.querySelector('.close,.modal-close,[data-close]');
 const focus=node=>{if(available(node))node.focus({preventScroll:true});};
 const initial=modal=>{const target=closeButton(modal)||entries(modal)[0];if(target)focus(target);else{modal.tabIndex=-1;modal.focus({preventScroll:true});}};
 const closeLabel=()=>document.documentElement.lang.startsWith('ja')?'閉じる':document.documentElement.lang.startsWith('en')?'Close dialog':document.documentElement.lang==='zh-Hant'?'關閉視窗':'关闭弹窗';
 const label=modal=>{const heading=modal.querySelector('h2[id]');if(heading&&!modal.hasAttribute('aria-labelledby')&&!modal.hasAttribute('aria-label'))modal.setAttribute('aria-labelledby',heading.id);const close=closeButton(modal);if(close)close.setAttribute('aria-label',closeLabel());};
 for(const modal of dialogs)label(modal);
 document.addEventListener('metalab:section-language',()=>dialogs.forEach(label));
 document.addEventListener('click',event=>{const target=event.target.closest?.(focusable);if(target)lastTrigger=target;},true);
 document.addEventListener('keydown',event=>{
  if(event.key==='Enter'||event.key===' ')lastTrigger=document.activeElement;
  const modal=stack.at(-1)?.modal;if(!modal)return;
  if(event.key==='Escape'){
   const close=closeButton(modal);if(!close)return;
   event.preventDefault();event.stopImmediatePropagation();close.click();return;
  }
  if(event.key!=='Tab')return;
  const nodes=entries(modal),first=nodes[0],last=nodes.at(-1),active=document.activeElement;
  if(!first){event.preventDefault();initial(modal);return;}
  if(!modal.contains(active)||(event.shiftKey&&active===first)||(!event.shiftKey&&active===last)){
   event.preventDefault();focus(event.shiftKey?last:first);
  }
 },true);
 document.addEventListener('focusin',event=>{const previous=lastFocused;lastFocused=event.target;const pending=observer.takeRecords();if(pending.length)reconcile(pending,previous);const modal=stack.at(-1)?.modal;if(modal&&!modal.contains(event.target))initial(modal);},true);
 function reconcile(records=[],previousFocus=null){
  const previousTop=stack.at(-1)?.modal,removed=stack.filter(item=>!open(item.modal));
  stack=stack.filter(item=>open(item.modal));
  for(const modal of [...records.map(record=>record.target),...dialogs]){
   if(!open(modal)||stack.some(item=>item.modal===modal))continue;
   const active=document.activeElement;
   const opener=active&&active!==document.body&&!modal.contains(active)?active:previousFocus&&!modal.contains(previousFocus)?previousFocus:lastTrigger;
   stack.push({modal,opener});label(modal);
  }
  const current=stack.at(-1)?.modal;
  if(current===previousTop)return;
  const restore=removed[0]?.opener;
  if(current){if(restore&&current.contains(restore)&&available(restore))focus(restore);else if(!current.contains(document.activeElement))initial(current);}
  else if(available(restore))focus(restore);
 }
 const observer=new MutationObserver(records=>reconcile(records));
 for(const modal of dialogs)observer.observe(modal,{attributes:true,attributeFilter:['class']});
 reconcile();
})();
