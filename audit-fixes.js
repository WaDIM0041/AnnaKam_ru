/* Supplemental access fixes for the exported build; replace with source components when available. */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let menuWasOpen = false, previousOverflow = '', scheduled = false;
  const deferred = new WeakSet();
  function setAttributeIfChanged(node, name, value) { if (node.getAttribute(name) !== value) node.setAttribute(name, value); }
  function mobileMenu() { return document.querySelector('div.fixed.inset-0.z-40'); }
  function apply() {
    scheduled = false;
    const main = document.querySelector('main');
    if (main) {
      main.id = 'main-content';
      main.tabIndex = -1;
      if (!document.querySelector('.ak-skip-link')) {
        const link = document.createElement('a');
        link.className = 'ak-skip-link'; link.href = '#main-content'; link.textContent = 'Перейти к содержимому';
        document.body.prepend(link);
      }
      for (const section of main.querySelectorAll('section')) {
        if (!deferred.has(section) && section.getBoundingClientRect().top > innerHeight + 100) {
          deferred.add(section);
          const height = section.getBoundingClientRect().height;
          section.style.setProperty('--ak-section-height', Math.ceil(height) + 'px');
          section.classList.add('ak-deferred-section');
          // Direct listener: this event is not guaranteed to bubble.
          section.addEventListener('contentvisibilityautostatechange', event => {
            for (const animation of section.getAnimations({subtree: true})) {
              if (animation.effect?.getTiming().iterations !== Infinity) continue;
              if (event.skipped) { animation.pause(); animation.akPausedOffscreen = true; }
              else if (animation.akPausedOffscreen && !reduced.matches) { animation.play(); animation.akPausedOffscreen = false; }
            }
          });
        }
      }
    }
    const logo = document.querySelector('header a[href="#"]');
    if (logo) setAttributeIfChanged(logo, 'aria-label', 'Анна Камчатка — на главную');
    const up = document.querySelector('main > button.fixed');
    if (up) setAttributeIfChanged(up, 'aria-label', 'Вернуться к началу страницы');
    const menu = mobileMenu(), button = document.querySelector('header button');
    const open = !!menu && getComputedStyle(menu).display !== 'none';
    if (button) {
      setAttributeIfChanged(button, 'aria-label', open ? 'Закрыть меню' : 'Открыть меню');
      setAttributeIfChanged(button, 'aria-expanded', String(open));
      setAttributeIfChanged(button, 'aria-controls', 'ak-mobile-menu');
    }
    if (menu) { menu.id = 'ak-mobile-menu'; setAttributeIfChanged(menu, 'role', 'dialog'); setAttributeIfChanged(menu, 'aria-label', 'Навигация по сайту'); setAttributeIfChanged(menu, 'aria-modal', 'true'); }
    if (open && !menuWasOpen) { previousOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden'; requestAnimationFrame(() => menu.querySelector('a')?.focus()); }
    if (!open && menuWasOpen) { document.body.style.overflow = previousOverflow; button?.focus(); }
    menuWasOpen = open;
    const footer = document.querySelector('footer');
    if (footer && !footer.querySelector('.ak-cookie-preferences')) {
      const preferences = document.createElement('button'); preferences.className = 'ak-cookie-preferences'; preferences.type = 'button'; preferences.textContent = 'Настройки cookies';
      preferences.addEventListener('click', () => {
        try { localStorage.removeItem('ak-cookie-consent'); } catch {}
        location.reload();
      });
      footer.querySelector('nav')?.parentElement.append(preferences);
    }
    if (reduced.matches) {
      for (const animation of document.getAnimations()) {
        if (animation.effect?.getTiming().iterations === Infinity) animation.pause();
      }
    }
  }
  function schedule() { if (!scheduled) { scheduled = true; requestAnimationFrame(apply); } }
  document.addEventListener('keydown', event => {
    const menu = mobileMenu();
    if (!menu || getComputedStyle(menu).display === 'none') return;
    const button = document.querySelector('header button');
    if (event.key === 'Escape') { event.preventDefault(); button?.click(); }
    if (event.key === 'Tab') {
      const targets = [button, ...menu.querySelectorAll('a[href],button')].filter(Boolean);
      const first = targets[0], last = targets[targets.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  new MutationObserver(schedule).observe(document.body, {childList:true,subtree:true});
  reduced.addEventListener('change', schedule);
  addEventListener('resize', schedule, {passive:true});
  apply();
})();
