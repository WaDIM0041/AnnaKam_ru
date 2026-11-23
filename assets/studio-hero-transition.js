(() => {
  const hero = document.querySelector('.studio-hero');
  if (!hero) return;

  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = value => Math.max(0, Math.min(1, value));
  const ease = value => value * value * (3 - 2 * value);
  let frame = null;
  let previousTime;
  let progress = 0;
  let distance;

  function paint() {
    const retreat = ease(clamp(progress / .85));
    const fade = ease(clamp((progress - .12) / .88));
    hero.style.setProperty('--hero-photo-scale', 1 - retreat * .24);
    hero.style.setProperty('--hero-photo-opacity', 1 - fade);
    hero.style.setProperty('--hero-glow-opacity', ease(progress));
  }

  function render(time) {
    frame = null;
    const target = clamp(window.scrollY / distance);
    const elapsed = previousTime === undefined ? 16.7 : Math.min(time - previousTime, 50);
    progress += (target - progress) * (1 - Math.exp(-elapsed / 95));
    if (Math.abs(target - progress) < .002) progress = target;
    paint();

    previousTime = time;
    if (progress !== target) queueRender();
    else previousTime = undefined;
  }

  function queueRender() {
    if (!motion.matches && frame === null) frame = window.requestAnimationFrame(render);
  }

  function measure() {
    const bounds = hero.getBoundingClientRect();
    const viewport = document.documentElement.clientHeight;
    const top = bounds.top + window.scrollY;
    hero.style.setProperty('--hero-photo-top', top + 'px');
    hero.style.setProperty('--hero-photo-height', bounds.height + 'px');
    distance = Math.max(220, Math.min(450, (viewport - top) * .62));
  }

  function sync() {
    if (frame !== null) window.cancelAnimationFrame(frame);
    frame = null;
    previousTime = undefined;
    measure();
    hero.classList.toggle('is-photo-pinned', !motion.matches);
    progress = motion.matches ? 0 : clamp(window.scrollY / distance);
    paint();
  }

  window.addEventListener('scroll', queueRender, { passive: true });
  window.addEventListener('resize', sync);
  window.addEventListener('pageshow', sync);
  motion.addEventListener('change', sync);
  new ResizeObserver(measure).observe(hero);
  sync();
})();
