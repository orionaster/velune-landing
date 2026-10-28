'use strict';

(() => {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const toggle = document.querySelector('#motion-toggle');
  const running = new Set();
  const scrollLayers = [];
  const activeFallback = new Set();
  const timelines = new WeakMap();
  const nativeTimeline = typeof window.ViewTimeline === 'function';
  let fallbackFrame = null;
  const titles = new WeakMap();
  let paused = false;
  let heroVisible = true;
  let scrollRun = null;
  const enabled = () => !preference.matches && !paused;
  const ease = 'cubic-bezier(.22,.61,.36,1)';

  function animate(element, frames, options = {}) {
    if (!enabled() || !element) return;
    const animation = element.animate(frames, {duration: 760, easing: ease, fill: 'backwards', ...options});
    running.add(animation);
    animation.finished.catch(() => {}).finally(() => running.delete(animation));
    return animation;
  }
  // Timed entrances belong only to the initial hero and direct action feedback.
  // Below the hero, visual information is revealed by scroll position.
  function lift(element, {distance = 14, delay = 0, duration = 760, opacity} = {}) {
    if (!element) return;
    const bounds = element.getBoundingClientRect();
    const visible = bounds.top < innerHeight && bounds.bottom > 0;
    animate(element, [{opacity: opacity ?? (visible ? .4 : 0), translate: `0 ${distance}px`}, {opacity: 1, translate: '0 0'}], {delay, duration});
  }
  function titleFragments(heading) {
    if (titles.has(heading)) return titles.get(heading);
    for (const node of [...heading.childNodes]) {
      if (node.nodeType !== Node.TEXT_NODE || !node.textContent.trim()) continue;
      const span = document.createElement('span');
      span.className = 'motion-fragment';
      if (/\s$/.test(node.textContent)) span.dataset.space = '';
      node.before(span); span.append(node); // Move original i18n nodes, never clone.
    }
    const fragments = [...heading.children].filter(element => element.tagName !== 'BR');
    fragments.forEach(element => element.classList.add('motion-fragment'));
    titles.set(heading, fragments);
    return fragments;
  }
  function heading(headingElement, delay = 0) {
    if (!headingElement) return;
    titleFragments(headingElement).forEach((fragment, index) => lift(fragment, {distance: 18, delay: delay + index * 85, duration: 900}));
  }
  // Establish text layout before navigation measures section positions.
  document.querySelectorAll('#hero-title,.section-heading h2,.about-copy h2,.aside-content>h3').forEach(titleFragments);
  function focusAfterScroll(element) {
    if (!element?.isConnected) return;
    if (!element.matches('a,button,input,select,textarea,[tabindex]')) element.setAttribute('tabindex', '-1');
    element.focus({preventScroll: true});
  }
  function stopScroll() { scrollRun?.cancel(); }
  // Only explicit navigation is eased. Wheel, touch and keyboard scrolling stay
  // native, and a new gesture cancels navigation immediately without prevention.
  function scrollToTarget(target, {focus = null, gap = 24} = {}) {
    if (!target) return;
    stopScroll();
    const start = window.scrollY;
    const headerHeight = document.querySelector('.site-header').getBoundingClientRect().height;
    const max = Math.max(0, document.documentElement.scrollHeight - innerHeight);
    const end = Math.max(0, Math.min(max, start + target.getBoundingClientRect().top - headerHeight - gap));
    if (!enabled() || Math.abs(end - start) < 2) {
      window.scrollTo({top: end, behavior: 'instant'}); focusAfterScroll(focus); return;
    }
    const duration = Math.min(1150, Math.max(480, 390 + Math.sqrt(Math.abs(end - start)) * 13));
    const started = performance.now();
    let frame;
    const events = ['wheel', 'touchstart', 'pointerdown', 'keydown'];
    const cancel = () => {
      cancelAnimationFrame(frame);
      events.forEach(type => window.removeEventListener(type, cancel));
      if (scrollRun?.cancel === cancel) scrollRun = null;
    };
    scrollRun = {cancel};
    events.forEach(type => window.addEventListener(type, cancel, {passive: true}));
    function tick(now) {
      if (scrollRun?.cancel !== cancel) return;
      const progress = Math.min(1, (now - started) / duration);
      const eased = (1 - Math.cos(Math.PI * progress)) / 2;
      window.scrollTo({top: start + (end - start) * eased, behavior: 'instant'});
      if (progress < 1) frame = requestAnimationFrame(tick);
      else { cancel(); focusAfterScroll(focus); }
    }
    frame = requestAnimationFrame(tick);
  }
  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[href^="#"]');
    const target = link && document.getElementById(link.hash.slice(1));
    if (!target) return;
    event.preventDefault();
    if (location.hash !== link.hash) history.pushState(null, '', link.hash);
    scrollToTarget(target, {focus: target.querySelector('h1,h2,h3') || target});
  });

  function sync() {
    document.documentElement.dataset.motion = enabled() ? 'on' : 'off';
    document.documentElement.dataset.heroMotion = enabled() && heroVisible && !document.hidden ? 'on' : 'off';
    const label = preference.matches ? 'Motion follows your device preference' : paused ? 'Resume motion' : 'Pause motion';
    toggle.querySelector('span:last-child').textContent = window.VeluneI18n.t(label);
    toggle.setAttribute('aria-pressed', String(paused || preference.matches));
    toggle.disabled = preference.matches;
    if (!enabled()) {
      stopScroll();
      for (const animation of running) animation.cancel();
      document.querySelectorAll('.service-card').forEach(card => card.style.removeProperty('transform'));
    }
    for (const layer of scrollLayers) {
      if (!enabled()) { layer.animation?.cancel(); layer.animation = null; }
      else if (!layer.animation) mountScrollLayer(layer);
    }
    if (!nativeTimeline) queueFallback(true);
    if (document.hidden) stopScroll();
  }
  toggle.addEventListener('click', () => { paused = !paused; sync(); });
  preference.addEventListener('change', sync);
  window.VeluneI18n.subscribe(sync);
  document.addEventListener('visibilitychange', sync);
  new IntersectionObserver(([entry]) => { heroVisible = entry.isIntersecting; sync(); }).observe(document.querySelector('.hero'));

  // Scroll reveals use position, never elapsed time. Their final frame cannot
  // arrive while the reader is stationary below the previous section.
  function updateFallback(layer) {
    if (!layer.animation || !enabled()) return;
    const bounds = layer.subject.getBoundingClientRect();
    const travel = Math.max(1, .42 * (innerHeight * .8 + bounds.height));
    const progress = Math.max(0, Math.min(1, (innerHeight * .92 - bounds.top) / travel));
    layer.animation.currentTime = progress * 1000;
  }
  function queueFallback(all = false) {
    if (nativeTimeline || !enabled()) return;
    if (all) scrollLayers.forEach(layer => updateFallback(layer));
    if (fallbackFrame !== null) return;
    fallbackFrame = requestAnimationFrame(() => {
      fallbackFrame = null;
      activeFallback.forEach(updateFallback);
    });
  }
  const fallbackObserver = !nativeTimeline ? new IntersectionObserver(entries => {
    for (const entry of entries) {
      for (const layer of scrollLayers) {
        if (layer.subject !== entry.target) continue;
        if (entry.isIntersecting) activeFallback.add(layer); else activeFallback.delete(layer);
        updateFallback(layer);
      }
    }
  }) : null;
  function mountScrollLayer(layer) {
    if (!enabled()) return;
    if (nativeTimeline) {
      let timeline = timelines.get(layer.subject);
      if (!timeline) {
        timeline = new window.ViewTimeline({subject:layer.subject, axis:'block', inset:'12% 8%'});
        timelines.set(layer.subject, timeline);
      }
      layer.animation = layer.element.animate(layer.frames, {
        timeline, fill:'both', easing:'linear', rangeStart:'entry 0%', rangeEnd:'cover 42%'
      });
    } else {
      layer.animation = layer.element.animate(layer.frames, {duration:1000, fill:'both', easing:'linear'});
      layer.animation.pause();
      updateFallback(layer);
    }
  }
  function scrub(element, frames, {subject = element, start = 0, end = 1} = {}) {
    if (!element || !subject) return;
    element.dataset.scrollLayer = '';
    subject.dataset.scrollSubject = '';
    const [from, to] = frames;
    const keyframes = [{...from, offset:0}];
    if (start > 0) keyframes.push({...from, offset:start});
    keyframes.push({...to, offset:end});
    if (end < 1) keyframes.push({...to, offset:1});
    const layer = {element, subject, frames:keyframes, animation:null};
    scrollLayers.push(layer);
    mountScrollLayer(layer);
    fallbackObserver?.observe(subject);
  }
  function scrollLift(element, {distance = 24, subject = element, start = 0, end = 1, opacity = 0} = {}) {
    scrub(element, [{opacity, translate:`0 ${distance}px`}, {opacity:1, translate:'0 0'}], {subject, start, end});
  }
  function scrollBlock(element, {distance = 36, mask = 60, radius = 0, start = 0, end = 1} = {}) {
    if (!element) return;
    element.dataset.visualReveal = '';
    scrub(element, [
      {opacity:0, translate:`0 ${distance}px`, clipPath:`inset(0 0 ${mask}% 0 round ${radius}px)`},
      {opacity:1, translate:'0 0', clipPath:`inset(0 0 0% 0 round ${radius}px)`}
    ], {start, end});
  }
  function scrollHeading(element) {
    if (!element) return;
    titleFragments(element).forEach((fragment, index) => scrollLift(fragment, {
      subject:element, distance:28, start:Math.min(index * .12, .24), end:Math.min(.76 + index * .12, 1)
    }));
  }
  if (!nativeTimeline) {
    window.addEventListener('scroll', () => queueFallback(), {passive:true});
    window.addEventListener('resize', () => queueFallback(true), {passive:true});
    window.VeluneI18n.subscribe(() => queueFallback(true));
    document.fonts?.ready.then(() => queueFallback(true));
  }
  document.documentElement.dataset.scrollReveals = nativeTimeline ? 'native' : 'position';
  document.querySelectorAll('.section-heading').forEach(area => {
    scrollBlock(area, {distance:24, mask:45, end:.62});
    scrollHeading(area.querySelector('h2'));
    scrollLift(area.querySelector('p'), {distance:12, start:.12});
  });
  document.querySelectorAll('.service-card').forEach((card, index) => {
    const stagger = matchMedia('(max-width:700px)').matches ? 0 : index * .06;
    scrollBlock(card, {distance:44, mask:58, radius:10, start:stagger});
    // Every visible part has its own position timeline, including the bottom of
    // tall mobile cards; a photo entering cannot pre-play the button below it.
    scrub(card.querySelector('.service-photo'), [
      {clipPath:'inset(0 0 55% 0)'}, {clipPath:'inset(0 0 0% 0)'}
    ]);
    card.querySelectorAll('.service-category,h3,.service-body p,.service-body button').forEach(leaf => scrollLift(leaf, {distance:12}));
  });
  document.querySelectorAll('.service-bottom,.team-heading').forEach(item => scrollBlock(item, {distance:16, mask:35, end:.8}));
  const about = document.querySelector('.about-copy');
  if (about) {
    scrollBlock(about, {distance:32, mask:35, end:.7});
    scrollHeading(about.querySelector('h2'));
    about.querySelectorAll('p,a').forEach(leaf => scrollLift(leaf, {distance:14}));
  }
  const gallery = document.querySelector('.space-gallery');
  if (gallery) {
    gallery.querySelectorAll('figure').forEach(figure => scrub(figure, [
      {opacity:0, translate:'0 36px', clipPath:'inset(0 0 75% 0 round 8px)'}, {opacity:1, translate:'0 0', clipPath:'inset(0 0 0% 0 round 8px)'}
    ]));
    scrollLift(gallery.querySelector('.gallery-caption'), {distance:8});
  }
  document.querySelectorAll('.team-role').forEach(card => {
    scrollBlock(card, {distance:26, mask:55, radius:8, end:.85});
    scrollLift(card.querySelector('.team-photo'), {distance:14});
    scrollLift(card.querySelector('h4'), {distance:10});
    scrollLift(card.querySelector('p'), {distance:10, start:.08});
  });
  scrollBlock(document.querySelector('.visit-card'), {distance:32, mask:65, radius:10});
  document.querySelectorAll('.visit-information>div').forEach(item => scrollLift(item, {distance:16}));
  scrollHeading(document.querySelector('.faq>h3'));
  document.querySelectorAll('.faq details').forEach(item => scrollBlock(item, {distance:24, mask:55, radius:6}));
  const booking = document.querySelector('.booking-panel');
  if (booking) {
    scrollBlock(booking, {distance:28, mask:35, radius:12, end:.8});
    scrollLift(booking.querySelector('.booking-topline'), {distance:8});
    scrollLift(booking.querySelector('.stepper'), {distance:8});
  }
  const aside = document.querySelector('.booking-aside');
  if (aside) {
    scrollBlock(aside, {distance:32, mask:65, radius:11, end:.8});
    scrollHeading(aside.querySelector('h3'));
    aside.querySelectorAll('.aside-content>p,.booking-summary>div').forEach(leaf => scrollLift(leaf, {distance:10, end:.5}));
  }

  document.querySelectorAll('.service-card').forEach(card => {
    let frame;
    card.addEventListener('pointermove', event => {
      if (!enabled() || !finePointer.matches || event.pointerType === 'touch') return;
      const {left, top, width, height} = card.getBoundingClientRect();
      const x = (event.clientX - left) / width - .5;
      const y = (event.clientY - top) / height - .5;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (enabled()) card.style.transform = `perspective(1400px) translateY(-4px) rotateX(${-y * 1.5}deg) rotateY(${x * 2}deg)`;
      });
    });
    card.addEventListener('pointerleave', () => { cancelAnimationFrame(frame); card.style.removeProperty('transform'); });
  });
  window.VeluneMotion = {
    get enabled() { return enabled(); }, scrollTo: scrollToTarget,
    step(element, direction) {
      // Short crossfade then a slight directional settle, with an unmoving shell.
      animate(element, [{opacity: .45, translate:`${direction * 10}px 0`}, {opacity: 1, translate:'0 0'}], {duration: 360});
    },
    success(element) {
      heading(element.querySelector('h3'), 70);
      animate(element.querySelector('.success-icon'), [{scale: '.9', opacity: .3}, {scale: '1', opacity: 1}], {duration: 500});
      element.querySelectorAll('.success-summary>div').forEach((row, i) => lift(row, {distance: 6, delay: 160 + i * 45, duration: 500}));
    }
  };
  sync();
  const hero = document.querySelector('.hero-copy');
  lift(hero.querySelector('.hero-kicker'), {distance: 8, opacity: 0, duration: 850});
  heading(hero.querySelector('h1'), 90);
  lift(hero.querySelector('.hero-description'), {distance: 12, delay: 240, duration: 950});
  hero.querySelectorAll('.hero-buttons>a').forEach((button, i) => lift(button, {distance: 10, delay: 340 + i * 65, duration: 850}));
  hero.querySelectorAll('.hero-facts>div').forEach((fact, i) => lift(fact, {distance: 7, delay: 430 + i * 70, duration: 850}));
  lift(document.querySelector('.hero-note'), {distance: 12, delay: 510, duration: 1050});
})();
