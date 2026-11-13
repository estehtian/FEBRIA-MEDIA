(() => {
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  menuToggle?.addEventListener('click', () => {
    const opened = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(opened));
    menuToggle.setAttribute('aria-label', opened ? 'Tutup navigasi' : 'Buka navigasi');
  });
  mainNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  }));

  const cards = [...document.querySelectorAll('.article-card')];
  const filters = [...document.querySelectorAll('.filter-chip')];
  const search = document.getElementById('searchInput');
  const empty = document.getElementById('emptyState');
  let activeFilter = 'all';
  function applyFilters() {
    const term = (search?.value || '').trim().toLowerCase();
    let visible = 0;
    cards.forEach(card => {
      const categoryMatch = activeFilter === 'all' || card.dataset.category === activeFilter;
      const text = (card.dataset.search + ' ' + card.innerText).toLowerCase();
      const searchMatch = !term || text.includes(term);
      const show = categoryMatch && searchMatch;
      card.hidden = !show;
      if (show) visible++;
    });
    if (empty) empty.hidden = visible !== 0;
  }
  filters.forEach(button => button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    filters.forEach(item => item.classList.toggle('selected', item === button));
    applyFilters();
  }));
  search?.addEventListener('input', applyFilters);

  const modal = document.getElementById('articleModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalCategory = document.getElementById('modalCategory');
  const modalBody = document.getElementById('modalBody');
  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  document.querySelectorAll('.read-link').forEach(button => button.addEventListener('click', () => {
    modalTitle.textContent = button.dataset.title || 'Artikel FEBRIA MEDIA';
    modalCategory.textContent = button.dataset.category || 'FEBRIA MEDIA';
    modalBody.textContent = button.dataset.body || '';
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.querySelector('.modal-close')?.focus();
  }));
  modal?.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && modal.classList.contains('open')) closeModal(); });
  document.getElementById('year').textContent = new Date().getFullYear();
})();