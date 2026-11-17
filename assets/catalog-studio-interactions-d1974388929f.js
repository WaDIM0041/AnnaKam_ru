const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const footerHover = window.matchMedia('(any-hover: hover)');
document.querySelectorAll('.footer-socials > :is(a, button)').forEach(control => {
  const icon = control.querySelector(':scope > svg, :scope > span');
  if (!icon) return;

  let spin;
  const play = () => {
    if (reduceMotion.matches || spin?.playState === 'running') return;
    spin = icon.animate(
      [{ transform: 'perspective(140px) rotateY(0deg)' }, { transform: 'perspective(140px) rotateY(360deg)' }],
      { duration: 620, easing: 'ease-in-out' }
    );
  };
  control.addEventListener('pointerenter', event => {
    if (footerHover.matches && event.pointerType !== 'touch') play();
  });
  control.addEventListener('click', play);
});

const winterDialog = document.querySelector('#winter-dialog');
if (winterDialog) {
  const winterVideo = winterDialog.querySelector('video');
  let winterOpener = null;
  document.querySelectorAll('[data-winter-open]').forEach(button => button.addEventListener('click', () => {
    winterOpener = button;
    if (!winterVideo.getAttribute('src')) winterVideo.src = winterDialog.dataset.winterSrc;
    winterDialog.showModal();
    winterVideo.play().catch(() => {});
  }));
  winterDialog.querySelector('.winter-close').addEventListener('click', () => winterDialog.close());
  winterDialog.addEventListener('close', () => {
    winterVideo.pause();
    winterVideo.currentTime = 0;
    winterOpener?.focus();
  });
}
document.querySelectorAll('[data-studio-emblem]').forEach(emblem => {
let emblemAnimations = [];
let emblemTimer;
let emblemVisible = false;
let emblemParts = [];
if (emblem) {
  const svg = emblem.querySelector('svg');
  const paths = svg.querySelectorAll('path');
  const outer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  paths[0].before(outer);
  outer.append(paths[0], ...svg.querySelectorAll('circle'));
  emblemParts = [outer, paths[1], svg.querySelector('[data-identity-letters]')].filter(Boolean);
  emblemParts.forEach(part => {
    part.style.transformBox = 'view-box';
    part.style.transformOrigin = '50% 50%';
  });
}
const cancelEmblem = () => {
  clearTimeout(emblemTimer);
  emblemAnimations.forEach(animation => animation.cancel());
  emblemAnimations = [];
};
const scheduleEmblem = () => {
  clearTimeout(emblemTimer);
  if (!emblemVisible || document.hidden || reduceMotion.matches) return;
  emblemTimer = setTimeout(() => spinEmblem(false), 4000);
};
const spinEmblem = clicked => {
  if (reduceMotion.matches) return;
  cancelEmblem();
  emblemAnimations = emblemParts.map((part, index) => part.animate(
    [{ transform: 'rotateY(0deg)' }, { transform: clicked ? 'rotateY(1440deg)' : 'rotateY(720deg)' }],
    { duration: clicked ? 4200 : 2600, delay: index * 300, easing: 'cubic-bezier(.45,0,.18,1)' }
  ));
  emblemAnimations[emblemAnimations.length - 1].onfinish = scheduleEmblem;
};
if (emblem) {
  emblem.addEventListener('click', () => spinEmblem(true));
  new IntersectionObserver(entries => {
    emblemVisible = entries[0].isIntersecting;
    if (emblemVisible) scheduleEmblem(); else cancelEmblem();
  }, { threshold: 0.25 }).observe(emblem);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelEmblem(); else scheduleEmblem();
  });
  reduceMotion.addEventListener('change', () => {
    if (reduceMotion.matches) cancelEmblem(); else scheduleEmblem();
  });
}

});

const container = document.querySelector('[data-house-video]');
const video = container?.querySelector('video');
if (video && !reduceMotion.matches) {
  const title = container.querySelector('[data-video-title]');
  const clips = [video.querySelector('source').src, new URL(container.dataset.secondVideo, video.querySelector('source').src).href];
  const letters = Array.from(title.textContent);
  title.replaceChildren(...letters.map((letter, index) => {
    const span = document.createElement('span');
    span.textContent = letter;
    span.style.setProperty('--letter-index', index);
    return span;
  }));
  let visible = false;
  let clipIndex = 0;
  let timer;
  let generation = 0;
  const stop = () => {
    generation++;
    clearTimeout(timer);
    video.pause();
    container.classList.remove('is-playing', 'is-revealing');
  };
  const start = () => {
    stop();
    if (!visible || document.hidden) return;
    const current = generation;
    video.src = clips[clipIndex];
    video.load();
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (current === generation) container.classList.add('is-revealing');
    }));
    timer = setTimeout(() => {
      if (current !== generation || !visible || document.hidden) return;
      video.play().then(() => {
        if (current === generation && visible && !document.hidden) container.classList.add('is-playing');
        else video.pause();
      }).catch(() => {});
    }, 1700);
  };
  video.addEventListener('ended', () => {
    clipIndex = (clipIndex + 1) % clips.length;
    start();
  });
  const observer = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (visible) start(); else stop();
  }, { threshold: 0.25 });
  observer.observe(container);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop(); else if (visible) start();
  });
}

document.querySelectorAll('[data-copy-max]').forEach(maxButton => maxButton.addEventListener('click', async () => {
  const feedback = maxButton.closest('footer')?.querySelector('[data-footer-max-feedback]') || document.querySelector('[data-max-feedback]');
  try {
    await navigator.clipboard.writeText('+79990668884');
    feedback.textContent = 'Номер скопирован. Вставьте его в поиск MAX.';
  } catch {
    feedback.textContent = 'Не удалось скопировать номер. Попробуйте открыть сайт в другом браузере.';
  }
}));
