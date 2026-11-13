import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const site=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(site,'section-map.js'),'utf8'),context);
const {games,topics,words,version}=context.window.METALAB_SECTIONS;
const assetVersions=JSON.parse(fs.readFileSync(path.join(site,'data-pipeline/asset-versions.json'),'utf8'));
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const lang='zh-cn',w=words[lang],files=[];
const route=(g,t)=>t==='overview'?`${g}.html`:`${g}-${t}.html`;
const label=(g,t)=>g==='beyblade'&&t==='decks'?[w.beyMeta,w.beyMetaShort,w.beyMetaDesc]:topics[t].labels[lang];
const iconPaths={home:'M3 11 12 3l9 8M5 10v11h14V10M9 21v-7h6v7',news:'M4 4h16v16H4zM8 8h8M8 12h8M8 16h5',decks:'M5 7h12v14H5zM8 3h12v14M9 11h4M9 15h4',cards:'M5 3h14v18H5zM8 6h8v8H8zM8 17h5',usage:'M4 20V10h4v10M10 20V4h4v16M16 20v-7h4v7',rules:'M3 4h7l2 2 2-2h7v16h-7l-2 1-2-1H3zM12 6v15',sources:'M9 15l6-6M8 7l2-2a4 4 0 0 1 6 6l-2 2M10 11l-2 2a4 4 0 0 0 6 6l2-2',builder:'M14 3a5 5 0 0 0-6 6L3 18l3 3 9-6a5 5 0 0 0 6-6l-4 3-3-3 3-4z'};
const icon=t=>`<span class="ml-topic-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="${iconPaths[topics[t].icon]}"/></svg></span>`;
const languages='<option value="zh-cn">简体中文</option><option value="zh">繁體中文</option><option value="ja">日本語</option><option value="en">English</option>';
function breadcrumb(g,t){return `<nav class="ml-breadcrumb" aria-label="Breadcrumb"><a href="index.html" data-section-word="all">${w.all}</a><span aria-hidden="true">/</span><a href="${g}.html">${esc(games[g].code)}</a>${t==='overview'?'':`<span aria-hidden="true">/</span><span data-section-topic="${t}">${label(g,t)[0]}</span>`}</nav>`;}
function heading(g,t){return `<div class="ml-page-heading" id="ml-content" tabindex="-1">${breadcrumb(g,t)}<div class="ml-heading-row"><h1 class="ml-page-title" data-section-topic="${t}">${label(g,t)[0]}</h1><div class="ml-mobile-nav"><label for="mlTopic" data-section-word="choose">${w.choose}</label><select id="mlTopic" data-section-select aria-label="${w.choose}">${['overview',...games[g].topics].map(k=>`<option value="${route(g,k)}" data-section-topic="${k}"${k===t?' selected':''}>${label(g,k)[0]}</option>`).join('')}</select></div></div><p class="ml-page-desc" data-section-topic="${t}" data-section-copy="2">${label(g,t)[2]}</p></div>`;}
function header(g,t,legacy=''){
 const navId=legacy.match(/<nav\b[^>]*\bid=["']([^"']+)["']/)?.[1]||'mlPrimaryNav';
 const auto=legacy.match(/<label\b[^>]*class=["'][^"']*auto-(?:update-toggle|toggle)[^"']*["'][^>]*>[\s\S]*?<\/label>/)?.[0]||'';
 // Keep the original controls and IDs used by the game engines; own the chrome layout here.
 const compatibility=legacy.includes('id="deskBtn"')?'<button id="deskBtn" hidden aria-hidden="true" tabindex="-1"></button>':'';
 const picker=`<select class="ml-header-game" data-game-picker aria-label="${w.switch}">${Object.entries(games).map(([id,G])=>`<option value="${id}.html"${g===id?' selected':''}>${G.code}</option>`).join('')}</select>`;
 return `<header class="site-header ml-site-header"><div class="ml-header-inner"><a class="brand ml-site-brand" href="index.html" aria-label="META LAB"><span class="ml-brand-symbol" aria-hidden="true"></span><b>META LAB</b></a>${picker}<nav id="${navId}" class="ml-header-nav" aria-label="${w.choose}">${['overview',...games[g].topics].map(k=>`<a href="${route(g,k)}" data-section-topic="${k}" data-section-copy="1"${k===t?' aria-current="page"':''}>${label(g,k)[1]}</a>`).join('')}</nav><div class="header-tools nav-actions ml-header-tools">${auto}<select id="uiLang" data-section-language aria-label="${w.language}">${languages}</select><button type="button" id="menuBtn" aria-label="${w.choose}" aria-controls="${navId}" aria-expanded="false"><span aria-hidden="true">☰</span></button>${compatibility}</div></div></header>`;
}
function hub(g,t='overview'){
 const G=games[g],news=t==='news';
 return `<!doctype html>
<html lang="zh-Hans" data-page-game="${g}" data-page-view="${t}" style="--ml-accent:${G.accent}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${esc(G.name)}：分别进入资讯、赛事资料、图鉴与工具。"><title>${label(g,t)[0]} · ${esc(G.name)} — META LAB</title><link rel="stylesheet" href="section-pages.css?v=${version}">${news?'<link rel="stylesheet" href="activity-feed.css?v=2026110801">':''}<script src="section-map.js?v=${version}"></script><script src="section-pages.js?v=${version}" defer></script>${news?`<script src="multilingual-search.js?v=2026110710" defer></script><script src="activity-feed.js?v=${version}" defer></script>`:''}</head>
<body class="ml-hub">${header(g,t)}
<main class="ml-hub-main">${news?`${heading(g,t)}<section class="activity-section" id="latest"><div id="activityFeed"><p role="status">${w.loading}</p></div></section>`:`${breadcrumb(g,t)}<section class="ml-overview-hero"><div><p class="ml-kicker">${esc(G.name)}</p><h1>${G.code}</h1><p data-section-topic="overview" data-section-copy="2">${topics.overview.labels[lang][2]}</p></div><img class="ml-overview-art" src="${esc(G.art)}" alt="${esc(G.name)}"></section><div class="ml-topic-grid">${G.topics.map(topic=>`<a class="ml-topic-card" href="${route(g,topic)}">${icon(topic)}<span class="ml-topic-copy"><strong data-section-topic="${topic}">${label(g,topic)[0]}</strong><small data-section-topic="${topic}" data-section-copy="2">${label(g,topic)[2]}</small></span><span class="ml-arrow" aria-hidden="true">→</span></a>`).join('')}</div><section class="ml-recent"><div class="ml-recent-head"><h2 data-section-word="recent">${w.recent}</h2><a href="${g}-news.html" data-section-word="more">${w.more}</a></div><div class="ml-recent-list" data-hub-updates><p role="status" data-section-word="loading">${w.loading}</p></div></section>`}</main>
<footer class="ml-hub-footer"><a href="index.html" data-section-word="all">${w.all}</a> · META LAB / CARD COUNTRY KC</footer></body></html>\n`;
}
const changes=['comfort-ui.js','app.js','app-v22.js','gcg.js','opcg.js','riftbound.js','marvel.js','unionarena.js','unionarena-library.js','beyblade.js','usage-ranking.js','site-data-quality.js','activity-feed.js'];
function versionAssets(text){for(const asset of new Set([...changes,...Object.keys(assetVersions)]))text=text.replace(new RegExp(`((?:src|href)=["']${asset.replaceAll('.','\\.')})(?:\\?[^"']*)?(["'])`,'g'),(_,a,b)=>`${a}?v=${assetVersions[asset]||version}${b}`);return text;}
function markSections(main,active){let depth=0,stack=[];return main.replace(/<\/?section\b[^>]*>/gi,tag=>{if(/^<\//.test(tag)){depth--;stack.pop();if(depth<0)throw Error('Unbalanced section');return tag;}const id=tag.match(/\bid=["']([^"']+)["']/)?.[1];const isRoot=depth++===0;stack.push(id);if(!isRoot)return tag;if(active.includes(id)){if(/\bclass=/.test(tag))return tag.replace(/\bclass=(["'])(.*?)\1/,(_,q,c)=>`class=${q}${c} ml-active-section${q}`);return tag.replace(/>$/,' class="ml-active-section">');}return tag.replace(/>$/,' data-inactive-root hidden inert aria-hidden="true">');});}
function documentPage(g,t){let source=fs.readFileSync(path.join(site,'data-pipeline/page-templates',g+'.html'),'utf8');source=versionAssets(source);
 source=source.replace(/<html\b([^>]*)>/,`<html$1 data-page-game="${g}" data-page-view="${t}" style="--ml-accent:${games[g].accent}">`);
 source=source.replace(/<title>[\s\S]*?<\/title>/,`<title>${label(g,t)[0]} · ${esc(games[g].name)} — META LAB</title>`);
 source=source.replace(/<meta name="description"[^>]*>/,`<meta name="description" content="${esc(games[g].name+' · '+label(g,t)[0]+' · '+label(g,t)[2])}">`);
 source=source.replace('</head>',`<link rel="stylesheet" href="section-pages.css?v=${version}"><script src="section-map.js?v=${version}"></script><script src="section-pages.js?v=${version}" defer></script>\n</head>`);
 source=source.replace(/<header\b[^>]*>[\s\S]*?<\/header>/,legacy=>header(g,t,legacy));
 source=source.replace(/(<main\b[^>]*>)([\s\S]*?)(<\/main>)/,(_,a,body,z)=>a+heading(g,t)+markSections(body,games[g].roots[t]||[])+z);
 // Native lazy images in hidden support sections never start network requests.
 source=source.replace(/<img\b([^>]*)>/gi,(tag,attrs)=>/\bloading=/.test(attrs)?tag:`<img loading="lazy"${attrs}>`);
 if(g==='unionarena'&&!['cards','decks'].includes(t))source=source.replace(/<script\b[^>]*\bsrc=["']unionarena-(?:catalog(?:-jp)?|library)\.js[^"']*["'][^>]*>\s*<\/script>/g,'');
 // Replace obsolete top-of-monolith footer links with the category landing page.
 source=source.replace(/<a\b([^>]*?)href=["']#(?:home|top)["']([^>]*)>[\s\S]*?<\/a>/g,(_,a,b)=>`<a ${a.replace(/data-i18n=["'][^"']+["']/g,'')}href="${g}.html" ${b.replace(/data-i18n=["'][^"']+["']/g,'')} data-section-word="back">${w.back}</a>`);
 source=source.replace(/<footer\b/,`<nav class="ml-page-heading ml-return" aria-label="Return"><a href="${g}.html" data-section-word="back">${w.back}</a> · <a href="index.html" data-section-word="all">${w.all}</a></nav><footer`);
 return source;
}
for(const [g,G]of Object.entries(games)){for(const t of ['overview',...G.topics]){const name=route(g,t),content=versionAssets(t==='overview'||t==='news'?hub(g,t):documentPage(g,t));fs.writeFileSync(path.join(site,name),content);files.push({path:name,game:g,view:t,bytes:Buffer.byteLength(content)});}}
// The legacy compatibility address forwards its known section bookmarks too.
fs.writeFileSync(path.join(site,'v22.html'),`<!doctype html><html lang="zh-Hans"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PTCG — META LAB</title><script>const routes={meta:'decks',cards:'cards',rules:'rules',sources:'sources','usage-ranking':'usage'};const section=routes[location.hash.slice(1)];location.replace((section?'ptcg-'+section+'.html':'ptcg.html')+location.search);</script></head><body><a href="ptcg.html">进入 PTCG</a></body></html>\n`);files.push({path:'v22.html',game:'ptcg',view:'compatibility'});
const indexPath=path.join(site,'index.html');let index=versionAssets(fs.readFileSync(indexPath,'utf8'));fs.writeFileSync(indexPath,index);
fs.writeFileSync(path.join(site,'section-pages-manifest.json'),JSON.stringify({version,pages:files},null,2)+'\n');
console.log(JSON.stringify({version,pages:files.length,topics:files.filter(x=>!['overview','compatibility'].includes(x.view)).length}));
