(() => {
 const articles = window.FEBRIA_ARTICLES || [];
 const menuBtn=document.querySelector('.menu-btn'),nav=document.querySelector('.nav');
 menuBtn?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuBtn.setAttribute('aria-expanded',String(open));menuBtn.textContent=open?'×':'☰';});
 nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
 document.querySelectorAll('#year').forEach(el=>el.textContent=new Date().getFullYear());
 const grid=document.getElementById('articleGrid'),search=document.getElementById('searchInput'),empty=document.getElementById('emptyState');
 let filter=new URLSearchParams(location.search).get('k')||'all';
 const filters=[...document.querySelectorAll('[data-filter]')];
 function card(a){return `<article class="article-card" data-category="${a.category}"><a class="article-art art-${a.category}" href="artikel/${a.id}.html"><span>${a.art}</span></a><div class="article-content"><div class="meta">${a.label}<span>• ${a.read}</span></div><h3><a href="artikel/${a.id}.html">${a.title}</a></h3><p>${a.excerpt}</p><a class="read-more" href="artikel/${a.id}.html">Baca artikel ↗</a></div></article>`;}
 function render(){if(!grid)return;const q=(search?.value||'').toLowerCase().trim();const found=articles.filter(a=>(filter==='all'||a.category===filter)&&(`${a.title} ${a.excerpt} ${a.label}`).toLowerCase().includes(q));grid.innerHTML=found.map(card).join('');if(empty)empty.hidden=found.length>0;filters.forEach(b=>b.classList.toggle('active',b.dataset.filter===filter));}
 filters.forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;render();}));search?.addEventListener('input',render);render();
 const catTitle={update:'FEBRIA UPDATE',business:'FEBRIA BUSINESS',tech:'FEBRIA TECH',viral:'FEBRIA VIRAL FACT'};
 const categoryPage=document.getElementById('categoryArticles');
 if(categoryPage){const key=new URLSearchParams(location.search).get('k')||'all';const list=articles.filter(a=>key==='all'||a.category===key);document.getElementById('categoryTitle').textContent=catTitle[key]||'Semua Artikel';categoryPage.innerHTML=list.map(card).join('')||'<p>Belum ada artikel dalam kategori ini.</p>';}
 const archive=document.getElementById('archiveArticles');if(archive)archive.innerHTML=articles.map(card).join('');
})();