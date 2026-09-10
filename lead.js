/* SalesBot lead wiring — rep routing, demo-request, Calendly, confirm-booking.
   Loaded (defer) by every page (HU at root, EN under /en);
   replaces the design's stub form handlers. */
(function () {
  'use strict';
  var SUPA = 'https://ystegwqwuypguvfwcexg.supabase.co/functions/v1';
  var isEN = (document.documentElement.lang || 'hu') !== 'hu';

  /* ── Rep distribution ──
     Explicit campaign links ALWAYS set the rep (a rep's own link is a
     deliberate assignment); the generic pages are first-touch only, so
     navigating around never reassigns; a rep is ALWAYS stored so the
     lead is never saved null. */
  var ROMAN  = { name: 'Roman Mamedov',           url: 'https://idofoglalo.com/en/romanmamedov/salesbot-discovery' };
  var BOGATA = { name: 'Boross-Nagy Bogáta Luca', url: 'https://calendly.com/bogata-nagy/salesbot-demo' };
  var REP_MAP = {
    '/':        BOGATA,
    '/start':   { name: 'Szentes János',   url: 'https://calendly.com/janko-blackholemedia/salesbot-janko' },
    '/welcome': BOGATA,
    '/go':      { name: 'Bukovics Eszter', url: 'https://calendly.com/eszter-bukovics/salesbot-hatekony-ai-b2b-business-development-bemutato' },
    '/en':      ROMAN,
    '/home':    ROMAN,
    '/go-en':   { name: 'Bukovics Eszter', url: 'https://calendly.com/eszter-bukovics/salesbot--ai-b2b-business-development' }
  };
  var DEFAULT_REP = isEN ? ROMAN : BOGATA;
  /* campaign links: arriving from OUTSIDE (ad, LinkedIn, direct) assigns
     their rep even over a stored one; internal navigation (language
     toggle, menu) never reassigns — first-touch wins inside the site */
  var EXPLICIT_REPS = ['/start', '/go', '/welcome', '/go-en', '/home', '/en'];
  var path = location.pathname.replace(/\/$/, '') || '/';
  var stored = localStorage.getItem('sb_rep');
  var internalNav = document.referrer.indexOf(location.origin) === 0;
  if (REP_MAP[path] && ((!internalNav && EXPLICIT_REPS.indexOf(path) !== -1) || !stored)) {
    localStorage.setItem('sb_rep', JSON.stringify(REP_MAP[path]));
  } else if (!stored) {
    localStorage.setItem('sb_rep', JSON.stringify(DEFAULT_REP));
  }
  function getRep() {
    try { return JSON.parse(localStorage.getItem('sb_rep')) || DEFAULT_REP; }
    catch (e) { return DEFAULT_REP; }
  }

  /* ── language handling ──
     EN pages mark the visitor as EN; on HU pages an English browser is
     redirected once to the EN counterpart (the lang toggle knows it),
     unless the visitor already chose a language. */
  if (isEN) {
    localStorage.setItem('lang_override', 'en');
  } else if (!localStorage.getItem('lang_override') &&
             (navigator.language || '').toLowerCase().indexOf('en') === 0) {
    var tgl = document.querySelector('a.lang[href^="/en"]');
    if (tgl) {
      localStorage.setItem('lang_override', 'en');
      location.replace(tgl.getAttribute('href'));
    }
  }

  /* ── UI strings ── */
  var T = isEN ? {
    err: 'Please add your name and a valid work email.',
    sending: 'Sending…',
    next: 'Got it. One more step: grab a slot with your dedicated rep right now:',
    book: 'Book a slot →',
    contactOk: 'Thanks, your message is on its way. We’ll get back to you within one business day.'
  } : {
    err: 'Add meg a neved és egy érvényes email címet.',
    sending: 'Küldés…',
    next: 'Megkaptuk! Már csak egy lépés van hátra. Foglalj időpontot a hozzád rendelt értékesítőnkkel:',
    book: 'Időpontfoglalás →',
    contactOk: 'Köszönjük, az üzeneted megérkezett. Egy munkanapon belül válaszolunk.'
  };

  function post(fn, payload) {
    return fetch(SUPA + '/' + fn, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(function (err) { console.error(err); });
  }

  /* Calendly loads lazily on first successful demo request */
  var calendlyLoading = false, calendlyQueue = [];
  function withCalendly(cb) {
    if (window.Calendly) return cb();
    calendlyQueue.push(cb);
    if (calendlyLoading) return;
    calendlyLoading = true;
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = 'https://assets.calendly.com/assets/external/widget.css';
    document.head.appendChild(l);
    var s = document.createElement('script');
    s.src = 'https://assets.calendly.com/assets/external/widget.js';
    s.onload = s.onerror = function () {
      calendlyQueue.splice(0).forEach(function (fn) { fn(); });
    };
    document.head.appendChild(s);
  }

  var emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  var pendingLead = null;

  /* ── Demo modal form (every page) ── */
  var form = document.getElementById('demoForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var n = document.getElementById('f-name');
      var em = document.getElementById('f-email');
      var ph = document.getElementById('f-phone');
      var co = document.getElementById('f-co');
      var msg = document.getElementById('f-msg');
      var note = document.getElementById('formNote');
      if (!n.value.trim() || !emailRe.test(em.value)) {
        if (note) {
          note.textContent = T.err;
          note.style.color = '#ff9d42';
        }
        (!n.value.trim() ? n : em).focus();
        return;
      }
      var btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = T.sending; }

      var rep = getRep();
      post('demo-request', {
        name: n.value.trim(),
        email: em.value.trim(),
        phone: ph ? ph.value.trim() : '',
        company: co ? co.value.trim() : '',
        message: msg ? msg.value.trim() : '',
        rep: rep.name
      });
      pendingLead = { name: n.value.trim(), email: em.value.trim(), rep: rep.name };

      /* success + Calendly inline */
      var card = form.parentElement;
      form.style.display = 'none';
      var box = document.createElement('div');
      box.innerHTML =
        '<p style="color:var(--text);font-size:1.02rem;line-height:1.5">' + T.next + '</p>' +
        '<div id="calendlyEmbed" style="height:620px;margin-top:14px;min-width:280px"></div>';
      card.appendChild(box);
      card.style.maxHeight = '88vh';
      card.style.overflowY = 'auto';
      var embed = box.querySelector('#calendlyEmbed');
      if (rep.url.indexOf('idofoglalo.com') !== -1) {
        /* Időfoglaló (our own product) embeds as a plain iframe */
        embed.innerHTML = '<iframe src="' + rep.url + '" title="Booking" ' +
          'style="width:100%;height:100%;border:0;border-radius:12px;background:#fff"></iframe>';
      } else {
        withCalendly(function () {
          if (window.Calendly) {
            window.Calendly.initInlineWidget({ url: rep.url, parentElement: embed });
          } else {
            embed.innerHTML =
              '<a href="' + rep.url + '" target="_blank" rel="noopener" class="btn btn-p btn-lg" ' +
              'style="display:inline-flex;text-decoration:none">' + T.book + '</a>';
          }
        });
      }
    });
  }

  /* ── Contact page form ── */
  var cf = document.getElementById('contactForm');
  if (cf) {
    cf.addEventListener('submit', function (e) {
      e.preventDefault();
      var n = document.getElementById('c-name');
      var em = document.getElementById('c-email');
      var co = document.getElementById('c-co');
      var ph = document.getElementById('c-phone');
      var msg = document.getElementById('c-msg');
      var note = document.getElementById('cNote');
      if (!n.value.trim() || !emailRe.test(em.value)) {
        if (note) {
          note.textContent = T.err;
          note.style.color = '#ff9d42';
        }
        (!n.value.trim() ? n : em).focus();
        return;
      }
      post('demo-request', {
        name: n.value.trim(),
        email: em.value.trim(),
        phone: ph ? ph.value.trim() : '',
        company: co ? co.value.trim() : '',
        message: msg ? msg.value.trim() : '',
        rep: getRep().name
      });
      cf.innerHTML = '<p style="color:var(--text);font-size:1.02rem;line-height:1.55">' + T.contactOk + '</p>';
    });
  }

  /* ── Calendly booking detection → confirm-booking ── */
  addEventListener('message', function (e) {
    if (e.data && e.data.event === 'calendly.event_scheduled' && pendingLead) {
      post('confirm-booking', pendingLead);
      pendingLead = null;
    }
  });
})();
