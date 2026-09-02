/* SalesBot aurora — canvas northern-lights behind every page hero.
   Time-lapse curtains in the brand gradient; the cursor bends the light.
   Loaded (defer) on all pages; hides the static CSS fallback when live. */
(function () {
  'use strict';
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var host = document.querySelector('.phero') || document.querySelector('section.hero');
  if (!host) return;

  /* container: reuse the subpages' .aurora div, or create one on the homepage */
  var box = host.querySelector('.aurora');
  if (box) {
    Array.prototype.forEach.call(box.children, function (c) { c.style.display = 'none'; });
  } else {
    box = document.createElement('div');
    box.setAttribute('aria-hidden', 'true');
    var grid = host.querySelector('.gridlines');
    if (grid) grid.insertAdjacentElement('afterend', box); else host.prepend(box);
  }
  box.style.cssText = 'position:absolute;inset:0;z-index:1;pointer-events:none;overflow:hidden';
  var wrap = host.querySelector('.wrap');
  if (wrap && getComputedStyle(wrap).zIndex === 'auto') {
    wrap.style.position = 'relative'; wrap.style.zIndex = '2';
  }

  var cv = document.createElement('canvas');
  cv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;filter:blur(26px) saturate(1.2);opacity:.72;' +
    /* keep the copy readable: the canvas fades over the central text column */
    '-webkit-mask-image:radial-gradient(ellipse 62% 58% at 50% 46%,rgba(0,0,0,.22),#000 82%);' +
    'mask-image:radial-gradient(ellipse 62% 58% at 50% 46%,rgba(0,0,0,.22),#000 82%)';
  box.appendChild(cv);
  var ctx = cv.getContext('2d');

  /* subtle shadow lifts the sub-copy off the light */
  var st = document.createElement('style');
  st.textContent = '.hero-sub,.phero .lede,.hero .pill,.hero-top .fade{text-shadow:0 1px 14px rgba(5,5,7,.75)}';
  document.head.appendChild(st);

  /* low-res buffer — CSS blur + upscale keeps it soft and cheap */
  var SCALE = 5, W = 0, H = 0;
  function resize() {
    W = Math.max(60, Math.round(box.clientWidth / SCALE));
    H = Math.max(40, Math.round(box.clientHeight / SCALE));
    cv.width = W; cv.height = H;
  }
  resize();
  addEventListener('resize', resize, { passive: true });

  /* three curtains in the brand aurora */
  var CURTAINS = [
    { base: .26, amp: .09, f1: 5.1, f2: 11.0, sp: .55, th: .30, a: .36, c: ['#a76bff', '#45c6f2'] },
    { base: .46, amp: .11, f1: 3.7, f2:  8.3, sp: .38, th: .26, a: .28, c: ['#45c6f2', '#2fdfa4'] },
    { base: .66, amp: .08, f1: 6.3, f2: 13.0, sp: .70, th: .22, a: .22, c: ['#2fdfa4', '#f29b3f'] }
  ];

  /* cursor influence — light bends toward the pointer */
  var mx = .5, my = .35, tx = .5, ty = .35, power = 0, tpower = 0;
  host.addEventListener('pointermove', function (e) {
    var r = host.getBoundingClientRect();
    tx = (e.clientX - r.left) / r.width;
    ty = (e.clientY - r.top) / r.height;
    tpower = 1;
  });
  host.addEventListener('pointerleave', function () { tpower = 0; });

  function hex(c) {
    return [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
  }
  function rgba(c, a) { var v = hex(c); return 'rgba(' + v[0] + ',' + v[1] + ',' + v[2] + ',' + a + ')'; }

  var STEPS = 26, t = 0, running = true, last = 0;

  function draw(now) {
    var dt = Math.min(.05, (now - last) / 1000 || .016);
    last = now;
    t += dt;
    mx += (tx - mx) * .055; my += (ty - my) * .055;
    power += (tpower - power) * .04;

    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';

    for (var ci = 0; ci < CURTAINS.length; ci++) {
      var C = CURTAINS[ci];
      var pts = [];
      for (var i = 0; i <= STEPS; i++) {
        var u = i / STEPS;
        var y = C.base
          + Math.sin(u * C.f1 + t * C.sp + ci * 1.7) * C.amp
          + Math.sin(u * C.f2 - t * C.sp * 1.6 + ci) * C.amp * .45;
        /* gaussian pull toward the cursor */
        var g = Math.exp(-Math.pow((u - mx) * 3.2, 2));
        y += (my - y) * g * .55 * power;
        pts.push([u * W, y * H]);
      }
      var thick = C.th * H * (1 + power * .25);
      var grad = ctx.createLinearGradient(0, (C.base - C.amp) * H, 0, C.base * H + thick);
      grad.addColorStop(0, rgba(C.c[0], C.a));
      grad.addColorStop(.55, rgba(C.c[1], C.a * .7));
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (var j = 1; j <= STEPS; j++) ctx.lineTo(pts[j][0], pts[j][1]);
      for (var k = STEPS; k >= 0; k--) ctx.lineTo(pts[k][0], pts[k][1] + thick);
      ctx.closePath();
      ctx.fill();
    }
    if (running && !RM) requestAnimationFrame(draw);
  }

  if (RM) { draw(16); return; }

  /* only animate while the hero is on screen */
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) {
      var vis = en[0].isIntersecting;
      if (vis && !running) { running = true; last = 0; requestAnimationFrame(draw); }
      else if (!vis) running = false;
    }, { threshold: 0 }).observe(host);
  }
  requestAnimationFrame(draw);
})();
