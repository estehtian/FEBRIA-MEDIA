(() => {
 const menuBtn=document.querySelector('.menu-btn'),nav=document.querySelector('.nav');
 menuBtn?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuBtn.setAttribute('aria-expanded',String(open));menuBtn.textContent=open?'×':'☰';});
 nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
 document.querySelectorAll('#year').forEach(el=>el.textContent=new Date().getFullYear());
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const catTitle={update:'FEBRIA UPDATE',business:'FEBRIA BUSINESS',tech:'FEBRIA TECH',viral:'FEBRIA VIRAL FACT'};
 function card(a){
  const href=a.url||('artikel/'+a.id+'.html');
  const art=a.image?'<img src="'+esc(a.image)+'" alt="" loading="lazy" style="width:100%;height:100%;object-fit:cover">':'<span>'+esc(a.art||a.label||'FEBRIA MEDIA')+'</span>';
  return '<article class="article-card" data-category="'+esc(a.category)+'"><a class="article-art art-'+esc(a.category)+'" href="'+esc(href)+'">'+art+'</a><div class="article-content"><div class="meta">'+esc(a.label)+'<span>• '+esc(a.read||'BERITA TERBIT')+'</span></div><h3><a href="'+esc(href)+'">'+esc(a.title)+'</a></h3><p>'+esc(a.excerpt)+'</p><a class="read-more" href="'+esc(href)+'">Baca artikel ↗</a></div></article>';
 }
 function render(articles){
  const grid=document.getElementById('articleGrid'),search=document.getElementById('searchInput'),empty=document.getElementById('emptyState');
  let filter=new URLSearchParams(location.search).get('k')||'all';
  const filters=[...document.querySelectorAll('[data-filter]')];
  function draw(){if(!grid)return;const q=(search?.value||'').toLowerCase().trim();const found=articles.filter(a=>(filter==='all'||a.category===filter)&&((a.title+' '+a.excerpt+' '+a.label).toLowerCase().includes(q)));grid.innerHTML=found.map(card).join('');if(empty)empty.hidden=found.length>0;filters.forEach(b=>b.classList.toggle('active',b.dataset.filter===filter));}
  filters.forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;draw();}));search?.addEventListener('input',draw);draw();
  const categoryPage=document.getElementById('categoryArticles');
  if(categoryPage){const key=new URLSearchParams(location.search).get('k')||'all';const list=articles.filter(a=>key==='all'||a.category===key);const heading=document.getElementById('categoryTitle');if(heading)heading.textContent=catTitle[key]||'Semua Artikel';categoryPage.innerHTML=list.map(card).join('')||'<p>Belum ada artikel dalam kategori ini.</p>';}
  const archive=document.getElementById('archiveArticles');if(archive)archive.innerHTML=articles.map(card).join('');
 }
 Promise.resolve(window.FEBRIA_ARTICLES_READY||window.FEBRIA_ARTICLES||[]).then(items=>render(items||window.FEBRIA_ARTICLES||[]));
})();