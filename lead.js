/* SalesBot lead wiring — rep routing, demo-request, Calendly, confirm-booking.
   Loaded (defer) by every page; replaces the design's stub form handlers. */
(function () {
  'use strict';
  var SUPA = 'https://ystegwqwuypguvfwcexg.supabase.co/functions/v1';

  /* ── Rep distribution ──
     Explicit campaign links ALWAYS set the rep (a rep's own link is a
     deliberate assignment); the generic pages are first-touch only, so
     navigating around never reassigns; a rep is ALWAYS stored so the
     lead is never saved null. */
  var REP_MAP = {
    '/':      { name: 'Roman Mamedov',   url: 'https://calendly.com/roman-blackholegrowth/salesbot-demo' },
    '/home':  { name: 'Roman Mamedov',   url: 'https://calendly.com/roman-blackholegrowth/salesbot-demo' },
    '/go-en': { name: 'Bukovics Eszter', url: 'https://calendly.com/eszter-bukovics/salesbot--ai-b2b-business-development' }
  };
  var DEFAULT_REP = REP_MAP['/'];
  var EXPLICIT_REPS = ['/go-en'];
  var path = location.pathname.replace(/\/$/, '') || '/';
  var stored = localStorage.getItem('sb_rep');
  if (REP_MAP[path] && (EXPLICIT_REPS.indexOf(path) !== -1 || !stored)) {
    localStorage.setItem('sb_rep', JSON.stringify(REP_MAP[path]));
  } else if (!stored) {
    localStorage.setItem('sb_rep', JSON.stringify(DEFAULT_REP));
  }
  localStorage.setItem('lang_override', 'en');
  function getRep() {
    try { return JSON.parse(localStorage.getItem('sb_rep')) || DEFAULT_REP; }
    catch (e) { return DEFAULT_REP; }
  }

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
      var co = document.getElementById('f-co');
      var msg = document.getElementById('f-msg');
      var note = document.getElementById('formNote');
      if (!n.value.trim() || !emailRe.test(em.value)) {
        if (note) {
          note.textContent = 'Please add your name and a valid work email.';
          note.style.color = '#f29b3f';
        }
        (!n.value.trim() ? n : em).focus();
        return;
      }
      var btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

      var rep = getRep();
      post('demo-request', {
        name: n.value.trim(),
        email: em.value.trim(),
        phone: '',
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
        '<p style="color:var(--text);font-size:1.02rem;line-height:1.5">' +
        'Got it — one more step. Grab a slot with your dedicated rep right now:</p>' +
        '<div id="calendlyEmbed" style="height:620px;margin-top:14px;min-width:280px"></div>';
      card.appendChild(box);
      card.style.maxHeight = '88vh';
      card.style.overflowY = 'auto';
      var embed = box.querySelector('#calendlyEmbed');
      withCalendly(function () {
        if (window.Calendly) {
          window.Calendly.initInlineWidget({ url: rep.url, parentElement: embed });
        } else {
          embed.innerHTML =
            '<a href="' + rep.url + '" target="_blank" rel="noopener" class="btn btn-p btn-lg" ' +
            'style="display:inline-flex;text-decoration:none">Book a slot &#8594;</a>';
        }
      });
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
          note.textContent = 'Please add your name and a valid work email.';
          note.style.color = '#f29b3f';
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
      cf.innerHTML = '<p style="color:var(--text);font-size:1.02rem;line-height:1.55">' +
        'Thanks — your message is on its way. We’ll get back to you within one business day.</p>';
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
