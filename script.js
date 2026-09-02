/* ============================================================
   AI.CREA.IT — script.js
   Vanilla JS + Lenis (smooth scroll). Nessun'altra dipendenza.
   ============================================================ */
(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 0. CARTA DEGLI SLOT (immagini/mappa.js) ----------
     Applica la mappa slot → file. Se mappa.js manca, restano
     i file scritti direttamente nell'HTML. */
  (function () {
    var M = window.MAPPA;
    if (!M) return;
    Object.keys(M).forEach(function (id) {
      var v = M[id];
      if (!v) return;
      if (typeof v === 'string') v = { d: v };
      var el = document.querySelector('[data-slot="' + id + '"]');
      if (!el) return;
      var t = el.tagName;
      if (t === 'PICTURE') {
        var so = el.querySelector('source'), im = el.querySelector('img');
        if (im && v.d) im.src = 'immagini/' + v.d + '.jpg';
        if (so) so.srcset = 'immagini/' + (v.m || v.d) + '.jpg';
      } else if (t === 'IMG') {
        if (v.d) el.src = 'immagini/' + v.d + '.jpg';
      } else if (t === 'VIDEO') {
        var s = el.querySelector('source');
        if (s && v.v) {
          var src = 'video/' + v.v + '.mp4';
          var changed = s.getAttribute('src') !== src;
          if (changed) s.src = src;
          el.poster = 'immagini/' + v.v + '-poster.jpg';
          /* load() зовём только если файл действительно поменялся и ролик
             не помечен как ленивый: иначе он тянет видео вопреки preload="none"
             и качает один и тот же файл дважды. */
          if (changed && el.preload !== 'none' && !el.hasAttribute('data-lazyplay')) el.load();
        }
      }
    });
  })();

  /* ---------- 1. PRELOADER ---------- */
  (function () {
    var pre = $('#preloader'), bar = $('#preBar');
    if (!pre) return;
    var p = 0;
    var t = setInterval(function () {
      p = Math.min(100, p + Math.random() * 18 + 6);
      if (bar) bar.style.width = p + '%';
      if (p >= 100) { clearInterval(t); }
    }, 110);
    function done() {
      if (bar) bar.style.width = '100%';
      setTimeout(function () { pre.classList.add('is-done'); }, 260);
    }
    if (document.readyState === 'complete') setTimeout(done, 500);
    else window.addEventListener('load', function () { setTimeout(done, 350); });
    // sicurezza: non bloccare mai la pagina
    setTimeout(done, 4000);
  })();

  /* ---------- 2. SMOOTH SCROLL (Lenis) ---------- */
  var lenis = null;
  if (!reduced && window.Lenis) {
    lenis = new window.Lenis({ duration: 1.1, smoothWheel: true, wheelMultiplier: 0.9 });
    var raf = function (time) { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
  function scrollToTop() {
    if (lenis) lenis.scrollTo(0); else window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  // ancore interne
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(el, { offset: -70 });
      else el.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ---------- 3. HEADER + SCROLLBAR + TO TOP ---------- */
  var header = $('#header'), thumb = $('#scrollThumb'), toTop = $('#toTop');
  var solidLocked = header && header.classList.contains('is-solid');
  if (toTop) toTop.addEventListener('click', scrollToTop);

  /* ---------- 4. MENU MODALE ---------- */
  (function () {
    var burger = $('#burger'), menu = $('#menu');
    if (!burger || !menu) return;
    function open() {
      menu.classList.add('is-open'); burger.classList.add('is-open');
      burger.setAttribute('aria-expanded', 'true');
      document.body.classList.add('is-locked'); if (lenis) lenis.stop();
    }
    function close() {
      menu.classList.remove('is-open'); burger.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('is-locked'); if (lenis) lenis.start();
    }
    burger.addEventListener('click', function () {
      menu.classList.contains('is-open') ? close() : open();
    });
    $$('[data-close-menu]', menu).forEach(function (el) { el.addEventListener('click', close); });
    $$('a', menu).forEach(function (a) { a.addEventListener('click', close); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  })();

  /* ---------- 5. MODALE VIDEO ---------- */
  (function () {
    var modal = $('#videoModal');
    if (!modal) return;
    function open() {
      modal.classList.add('is-open'); document.body.classList.add('is-locked'); if (lenis) lenis.stop();
      var v = modal.querySelector('video');
      if (v) {
        if (v.dataset.loaded !== '1') { v.load(); v.dataset.loaded = '1'; }
        var pr = v.play(); if (pr && pr.catch) pr.catch(function () {});
      }
    }
    function close() {
      modal.classList.remove('is-open'); document.body.classList.remove('is-locked'); if (lenis) lenis.start();
      var v = modal.querySelector('video'); if (v) { v.pause(); v.currentTime = 0; }
    }
    $$('[data-open-video]').forEach(function (b) { b.addEventListener('click', open); });
    $$('[data-close-video]', modal).forEach(function (b) { b.addEventListener('click', close); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  })();

  /* ---------- 6. REVEAL ---------- */
  (function () {
    var els = $$('.reveal, [data-stagger]');
    if (!els.length) return;
    if (!('IntersectionObserver' in window) || reduced) {
      els.forEach(function (el) { el.classList.add('is-in'); }); return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  })();

  /* ---------- 7. CONTATORI ---------- */
  (function () {
    var nums = $$('[data-count]');
    if (!nums.length || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target, target = parseFloat(el.getAttribute('data-count')) || 0;
        io.unobserve(el);
        if (reduced) { el.textContent = target; return; }
        var start = null, dur = 1500;
        function step(ts) {
          if (!start) start = ts;
          var p = Math.min(1, (ts - start) / dur);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased).toLocaleString('it-IT');
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });
    nums.forEach(function (n) { io.observe(n); });
  })();

  /* ---------- 8. TOOLTIP MAPPA ---------- */
  (function () {
    var map = $('#ecoMap');
    if (!map) return;
    var dots = $$('.map__dot', map);
    function show(id) {
      $$('.tooltip', map).forEach(function (t) { t.classList.toggle('is-open', t.getAttribute('data-tipfor') === id); });
      dots.forEach(function (d) { d.classList.toggle('is-active', d.getAttribute('data-tip') === id); });
      $$('.eco__list li').forEach(function (li) { li.classList.toggle('is-active', li.getAttribute('data-eco') === id); });
    }
    function hide() {
      $$('.tooltip', map).forEach(function (t) { t.classList.remove('is-open'); });
      dots.forEach(function (d) { d.classList.remove('is-active'); });
      $$('.eco__list li').forEach(function (li) { li.classList.remove('is-active'); });
    }
    dots.forEach(function (d) {
      var id = d.getAttribute('data-tip');
      var tip = map.querySelector('.tooltip[data-tipfor="' + id + '"]');
      if (tip) { tip.style.left = d.style.left; tip.style.top = d.style.top; }
      d.addEventListener('mouseenter', function () { show(id); });
      d.addEventListener('focus', function () { show(id); });
      d.addEventListener('click', function (e) { e.preventDefault(); show(id); });
    });
    map.addEventListener('mouseleave', hide);
    $$('.eco__list li[data-eco]').forEach(function (li) {
      li.addEventListener('mouseenter', function () { show(li.getAttribute('data-eco')); });
    });
  })();

  /* ---------- 9. GALLERIA DRAG + CURSORE ---------- */
  (function () {
    var wrap = $('#dragGallery'), track = $('#dragTrack'), cursor = $('#cursor');
    if (!wrap || !track) return;
    var down = false, startX = 0, startLeft = 0, moved = 0;

    wrap.addEventListener('pointerdown', function (e) {
      down = true; moved = 0;
      startX = e.clientX; startLeft = track.scrollLeft;
      track.classList.add('is-dragging');
      wrap.setPointerCapture && wrap.setPointerCapture(e.pointerId);
    });
    wrap.addEventListener('pointermove', function (e) {
      if (cursor && e.pointerType === 'mouse') {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
      }
      if (!down) return;
      var dx = e.clientX - startX;
      moved = Math.abs(dx);
      track.scrollLeft = startLeft - dx;
    });
    function up() { down = false; track.classList.remove('is-dragging'); }
    wrap.addEventListener('pointerup', up);
    wrap.addEventListener('pointercancel', up);
    wrap.addEventListener('pointerleave', up);

    if (cursor) {
      wrap.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') cursor.classList.add('is-visible'); });
      wrap.addEventListener('pointerleave', function () { cursor.classList.remove('is-visible'); });
    }
    // rotellina verticale → scroll orizzontale
    wrap.addEventListener('wheel', function (e) {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      var max = track.scrollWidth - track.clientWidth;
      if ((track.scrollLeft <= 0 && e.deltaY < 0) || (track.scrollLeft >= max - 1 && e.deltaY > 0)) return;
      e.preventDefault();
      track.scrollLeft += e.deltaY;
    }, { passive: false });
  })();

  /* ---------- 10. TABS ---------- */
  (function () {
    var tabs = $$('.tab');
    if (!tabs.length) return;
    tabs.forEach(function (t) {
      t.addEventListener('click', function () {
        var id = t.getAttribute('data-tab');
        tabs.forEach(function (x) {
          var on = x === t;
          x.classList.toggle('is-active', on);
          x.setAttribute('aria-selected', on ? 'true' : 'false');
        });
        $$('.tabpanel').forEach(function (p) {
          p.classList.toggle('is-active', p.getAttribute('data-panel') === id);
        });
      });
    });
  })();

  /* ---------- 11. FILTRI + LIGHTBOX (lavori) ---------- */
  (function () {
    var filters = $('#filters');
    if (filters) {
      var chips = $$('.chip', filters);
      var items = $$('#works .work');
      var label = $('#countLabel');
      chips.forEach(function (c) {
        c.addEventListener('click', function () {
          var f = c.getAttribute('data-filter');
          chips.forEach(function (x) { x.classList.toggle('is-active', x === c); });
          var n = 0;
          items.forEach(function (it) {
            var ok = (f === 'all') || it.getAttribute('data-cat') === f;
            it.style.display = ok ? '' : 'none';
            if (ok) n++;
          });
          if (label) label.textContent = n + (n === 1 ? ' lavoro' : ' lavori');
        });
      });
    }

  /* ---------- Видео играет только когда видно ----------
     На странице портфолио 16 роликов. Если все крутятся разом,
     телефон греется и батарея садится. Держим включёнными только те,
     что сейчас в кадре. */
  (function () {
    var vids = $$('video[data-lazyplay]');
    if (!vids.length || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) {
          if (v.dataset.loaded !== '1') { v.load(); v.dataset.loaded = '1'; }
          var pr = v.play(); if (pr && pr.catch) pr.catch(function () {});
        }
        else if (!v.paused) v.pause();
      });
    }, { rootMargin: '200px 0px', threshold: 0.1 });
    vids.forEach(function (v) { io.observe(v); });
  })();


    var lb = $('#lightbox');
    if (!lb) return;
    var stage = $('#lbStage'), cap = $('#lbCap');
    var nodes = $$('[data-lb]');
    var idx = 0;

    function render(i) {
      if (!nodes.length) return;
      idx = (i + nodes.length) % nodes.length;
      var node = nodes[idx];
      var media = node.querySelector('.work__media > *, .ph, img, video');
      stage.innerHTML = '';
      if (media) {
        var clone = media.cloneNode(true);
        clone.style.width = 'min(1100px, 92vw)';
        clone.style.height = 'auto';
        clone.style.maxHeight = '82vh';
        clone.style.objectFit = 'contain';
        stage.appendChild(clone);
      }
      cap.textContent = node.getAttribute('data-lb-cap') || '';
    }
    function open(i) {
      render(i); lb.classList.add('is-open');
      document.body.classList.add('is-locked'); if (lenis) lenis.stop();
    }
    function close() {
      lb.classList.remove('is-open'); stage.innerHTML = '';
      document.body.classList.remove('is-locked'); if (lenis) lenis.start();
    }
    nodes.forEach(function (n, i) {
      n.addEventListener('click', function () { open(i); });
      n.setAttribute('tabindex', '0');
      n.addEventListener('keydown', function (e) { if (e.key === 'Enter') open(i); });
    });
    $$('[data-close-lb]', lb).forEach(function (b) { b.addEventListener('click', close); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    var prev = $('[data-lb-prev]', lb), next = $('[data-lb-next]', lb);
    if (prev) prev.addEventListener('click', function (e) { e.stopPropagation(); render(idx - 1); });
    if (next) next.addEventListener('click', function (e) { e.stopPropagation(); render(idx + 1); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') render(idx - 1);
      if (e.key === 'ArrowRight') render(idx + 1);
    });
  })();

  /* ---------- 12. COOKIE ---------- */
  (function () {
    var bar = $('#cookie'), ok = $('#cookieOk');
    if (!bar) return;
    var KEY = 'aicreait_cookie_ok';
    var accepted = false;
    try { accepted = localStorage.getItem(KEY) === '1'; } catch (e) {}
    if (!accepted) setTimeout(function () { bar.classList.add('is-open'); }, 1800);
    if (ok) ok.addEventListener('click', function () {
      bar.classList.remove('is-open');
      try { localStorage.setItem(KEY, '1'); } catch (e) {}
    });
  })();

  /* ---------- 13. SCROLL LOOP (header, parallax, slider, processo) ---------- */
  var svcSticky = $('#svcSticky');
  var svcSlides = $$('.svc__slide');
  var svcNum = $('#svcNum'), svcBar = $('#svcBar');
  var processSteps = $$('.process__step');
  var processLabel = $('#processImgLabel');
  var processImg = $('#processImg');
  var METODO = (function () {
    var out = [];
    for (var i = 1; i <= 5; i++) {
      var m = window.MAPPA && window.MAPPA['06-' + i];
      out.push('immagini/' + ((m && m.d) || ('metodo-0' + i)) + '.jpg');
    }
    return out;
  })();
  var metodoShown = -1;
  var parallaxEls = $$('.parallax-image-move');
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    var vh = window.innerHeight;
    var docH = document.documentElement.scrollHeight - vh;

    if (header && !solidLocked) header.classList.toggle('is-solid', y > vh * 0.6);
    if (thumb) thumb.style.height = (docH > 0 ? Math.max(4, (y / docH) * 100) : 0) + '%';
    if (toTop) toTop.classList.toggle('is-visible', y > vh);

    // parallax
    if (!reduced) {
      parallaxEls.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        var prog = (r.top + r.height / 2 - vh / 2) / vh; // -1 … 1
        el.style.transform = 'translate3d(0,' + (prog * -34).toFixed(2) + 'px,0) scale(1.08)';
      });
    }

    // slider servizi
    if (svcSticky && svcSlides.length) {
      var r2 = svcSticky.getBoundingClientRect();
      var total = svcSticky.offsetHeight - vh;
      var p = total > 0 ? Math.min(1, Math.max(0, -r2.top / total)) : 0;
      var i = Math.min(svcSlides.length - 1, Math.floor(p * svcSlides.length));
      svcSlides.forEach(function (s, k) { s.classList.toggle('is-active', k === i); });
      if (svcNum) svcNum.textContent = ('0' + (i + 1)).slice(-2);
      if (svcBar) svcBar.style.height = ((i + 1) / svcSlides.length * 100) + '%';
    }

    // processo
    if (processSteps.length) {
      var best = null, bestD = Infinity;
      processSteps.forEach(function (s) {
        var r3 = s.getBoundingClientRect();
        var d = Math.abs(r3.top + r3.height / 2 - vh * 0.45);
        if (d < bestD) { bestD = d; best = s; }
      });
      processSteps.forEach(function (s) { s.classList.toggle('is-active', s === best); });
      if (best && processLabel) processLabel.textContent = 'Fase — ' + (best.getAttribute('data-label') || '');
      if (best && processImg) {
        var n = parseInt(best.getAttribute('data-step'), 10) - 1;
        if (n >= 0 && n < METODO.length && n !== metodoShown) {
          metodoShown = n;
          processImg.src = METODO[n];
          processImg.alt = 'Fase — ' + (best.getAttribute('data-label') || '');
        }
      }
    }

    ticking = false;
  }
  function requestTick() { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }
  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', requestTick);
  onScroll();

  /* ---------- 14. FORM BRIEF ---------- */
  (function () {
    var form = $('#briefForm');
    if (!form) return;
    var steps = $$('.form-step', form);
    var dots = $$('[data-stepdot]');
    var status = $('#formStatus');
    var success = $('#formSuccess');
    var submitBtn = $('#submitBtn');
    var current = 1;
    var MAIL = 'ai.crea.it@gmail.com';

    // preselezione pacchetto da ?pacchetto=starter|monthly|launch
    try {
      var pkg = new URLSearchParams(location.search).get('pacchetto');
      if (pkg) { var r = $('#pkg-' + pkg); if (r) r.checked = true; }
    } catch (e) {}

    function showStep(n) {
      current = n;
      steps.forEach(function (s) { s.hidden = s.getAttribute('data-step') !== String(n); });
      dots.forEach(function (d) { d.classList.toggle('is-active', d.getAttribute('data-stepdot') === String(n)); });
      var top = $('#modulo');
      if (top) { if (lenis) lenis.scrollTo(top, { offset: -90 }); else top.scrollIntoView({ behavior: 'smooth' }); }
    }

    function validField(el) {
      var field = el.closest('.field');
      var ok = el.checkValidity() && String(el.value).trim() !== '';
      if (el.type === 'checkbox') ok = el.checked || !el.required;
      if (field) field.classList.toggle('has-error', !ok);
      return ok;
    }
    function validStep(n) {
      var step = steps.filter(function (s) { return s.getAttribute('data-step') === String(n); })[0];
      if (!step) return true;
      var ok = true;
      $$('[required]', step).forEach(function (el) { if (!validField(el)) ok = false; });
      return ok;
    }

    $$('[data-next]', form).forEach(function (b) {
      b.addEventListener('click', function () { if (validStep(current)) showStep(current + 1); });
    });
    $$('[data-prev]', form).forEach(function (b) {
      b.addEventListener('click', function () { showStep(current - 1); });
    });
    $$('[required]', form).forEach(function (el) {
      el.addEventListener('blur', function () { validField(el); });
      el.addEventListener('input', function () { var f = el.closest('.field'); if (f) f.classList.remove('has-error'); });
      el.addEventListener('change', function () { var f = el.closest('.field'); if (f) f.classList.remove('has-error'); });
    });

    function collect() {
      var fd = new FormData(form), out = {};
      fd.forEach(function (v, k) {
        if (k.charAt(0) === '_') return;
        if (out[k]) out[k] += ', ' + v; else out[k] = v;
      });
      return out;
    }
    function mailtoFallback() {
      var d = collect(), body = '';
      Object.keys(d).forEach(function (k) { body += k + ': ' + d[k] + '\n'; });
      location.href = 'mailto:' + MAIL +
        '?subject=' + encodeURIComponent('Nuovo brief — ' + (d['Brand'] || '')) +
        '&body=' + encodeURIComponent(body);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validStep(3)) return;
      var action = form.getAttribute('action') || '';
      var configured = action.indexOf('FORMSPREE_ENDPOINT') === -1 && action.indexOf('formspree.io/f/') !== -1;

      if (!configured) {
        if (status) status.textContent = 'Invio automatico non ancora configurato — apro il programma di posta con il brief già compilato.';
        mailtoFallback();
        if (success) { form.style.display = 'none'; success.classList.add('is-open'); }
        return;
      }

      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Invio in corso…'; }
      if (status) status.textContent = '';

      fetch(action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      }).then(function (res) {
        if (!res.ok) throw new Error('bad status');
        form.style.display = 'none';
        if (success) success.classList.add('is-open');
        var top = $('#modulo');
        if (top) { if (lenis) lenis.scrollTo(top, { offset: -90 }); else top.scrollIntoView({ behavior: 'smooth' }); }
      }).catch(function () {
        if (status) status.textContent = 'Invio non riuscito. Apro il programma di posta come alternativa.';
        mailtoFallback();
      }).finally(function () {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Invia il brief'; }
      });
    });
  })();

})();
