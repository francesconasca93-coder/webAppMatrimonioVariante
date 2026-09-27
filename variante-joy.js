// Variante Joy: menu a pannello sulla sinistra (hamburger fisso, entrata
// sfalsata delle voci) e foto del pannello che si alternano allo scorrimento.

(function () {
  const toggle = document.getElementById('menu-toggle');
  const drawer = document.getElementById('drawer');
  const closeBtn = document.getElementById('drawer-close');
  const scrim = document.getElementById('scrim');
  if (!toggle || !drawer) return;

  const items = Array.from(drawer.querySelectorAll('li'));
  items.forEach((li, i) => { li.style.transitionDelay = `${0.05 + i * 0.035}s`; });

  function open() {
    document.body.classList.add('drawer-open');
    toggle.setAttribute('aria-expanded', 'true');
    // il focus va nel pannello, altrimenti resta su un bottone ormai coperto
    if (closeBtn) closeBtn.focus();
  }

  function close(returnFocus) {
    document.body.classList.remove('drawer-open');
    toggle.setAttribute('aria-expanded', 'false');
    if (returnFocus) toggle.focus();
  }

  toggle.addEventListener('click', () => {
    if (document.body.classList.contains('drawer-open')) close(true);
    else open();
  });

  if (closeBtn) closeBtn.addEventListener('click', () => close(true));
  if (scrim) scrim.addEventListener('click', () => close(true));

  // Chiude prima che il browser segua l'ancora: con body in overflow:hidden
  // lo scorrimento verso la sezione non avverrebbe.
  drawer.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', () => close(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('drawer-open')) close(true);
  });
})();

// Foto del pannello: ogni sezione con data-art indica quale mostrare, le altre
// tengono quella della sezione precedente. La sezione "corrente" è quella che
// sta attraversando la metà della finestra.
(function () {
  const slides = Array.from(document.querySelectorAll('.aux-slide'));
  const sections = Array.from(document.querySelectorAll('.main .page'));
  if (slides.length < 2 || !sections.length) return;

  let current = 0;
  const indexFor = sections.map((sec) => {
    const declared = parseInt(sec.dataset.art, 10);
    // data-art è 1-based per chi scrive l'HTML; fuori range si ignora
    if (declared >= 1 && declared <= slides.length) current = declared - 1;
    return current;
  });

  function show(i) {
    slides.forEach((img, n) => img.classList.toggle('is-active', n === i));
  }

  // Ogni sezione prende in prestito il colore della propria foto: è un dato
  // statico, si stampa una volta e non serve rifarlo allo scorrimento. Senza JS
  // le fasce restano su --paper-alt, che è il ripiego dichiarato nel CSS.
  sections.forEach((sec, i) => {
    const tint = slides[indexFor[i]].dataset.tint;
    if (tint) sec.style.setProperty('--tint', tint);
  });

  // Le sezioni sono contigue, quindi ce n'è sempre una sola a cavallo della metà
  // della finestra: la si ricava dalla geometria invece di accumulare gli stati
  // dell'osservatore, che al confine tra due sezioni sono ambigui in un verso o
  // nell'altro. L'osservatore serve solo a sapere quando ricontrollare.
  function currentIndex() {
    const mid = window.innerHeight / 2;
    for (let i = sections.length - 1; i > 0; i--) {
      if (sections[i].getBoundingClientRect().top <= mid) return i;
    }
    return 0;
  }

  function update() { show(indexFor[currentIndex()]); }

  update();

  const io = new IntersectionObserver(update, { rootMargin: '-45% 0px -45% 0px' });
  sections.forEach((sec) => io.observe(sec));
})();
