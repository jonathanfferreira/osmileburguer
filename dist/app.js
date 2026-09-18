/* O Smile V2 — progressive enhancement; all content and order links are static HTML. */
(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
  const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(pointer: fine)');
  let reducedMotion = motionPreference.matches;

  function track(event, properties = {}) {
    const detail = { event, ...properties };
    window.dispatchEvent(new CustomEvent('smile:analytics', { detail }));
    if (Array.isArray(window.dataLayer)) window.dataLayer.push(detail);
  }

  function bindAnalytics() {
    $$('[data-order]').forEach(link => link.addEventListener('click', () => {
      track(`click_order_${link.dataset.order}`, {
        product: link.dataset.product || link.closest('[data-product]')?.dataset.product || null
      });
    }));
    $$('[data-instagram]').forEach(link => link.addEventListener('click', () => track('click_instagram')));
  }

  function initMenu() {
    const button = $('.menu-toggle');
    const nav = $('#mobile-nav');
    function setOpen(open, restoreFocus = false) {
      nav.hidden = !open;
      button.setAttribute('aria-expanded', String(open));
      button.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
      if (open) track('open_mobile_menu');
      if (restoreFocus) button.focus();
    }
    button.addEventListener('click', () => setOpen(nav.hidden));
    nav.addEventListener('click', event => { if (event.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !nav.hidden) setOpen(false, true);
    });
    document.addEventListener('pointerdown', event => {
      if (!nav.hidden && !nav.contains(event.target) && !button.contains(event.target)) setOpen(false);
    });
    matchMedia('(max-width:700px)').addEventListener('change', event => {
      if (!event.matches) setOpen(false);
    });
  }

  function initReveals() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        if (!reducedMotion) entry.target.classList.add('is-revealing');
        observer.unobserve(entry.target);
      });
    }, { threshold: .12 });
    $$('.reveal').forEach(element => observer.observe(element));
  }

  function initBurger() {
    const scene = $('#burger-scene');
    const stage = $('#burger-toggle');
    const range = $('#layer-range');
    const counter = $('.experience-counter');
    let value = 0, target = 0, velocity = 0, frame = 0, lastTime = 0;
    let pinned = false, manual = false, hovered = false, gesture = null, swallowClick = false;
    let lastAnnounced = false;

    function render() {
      const progress = clamp(value);
      scene.style.setProperty('--open', progress.toFixed(4));
      scene.style.setProperty('--label-opacity', clamp((progress - .24) / .32).toFixed(3));
      counter.textContent = `${Math.round(progress * 100).toString().padStart(2, '0')} / 100`;
      const expanded = progress > .2;
      if (expanded !== lastAnnounced) {
        stage.setAttribute('aria-expanded', String(expanded));
        stage.setAttribute('aria-label', expanded ? 'Fechar as camadas do Rachando o Bico' : 'Abrir as camadas do Rachando o Bico');
        lastAnnounced = expanded;
      }
      if (document.activeElement !== range) range.value = Math.round(progress * 100);
      range.setAttribute('aria-valuetext', progress < .01 ? 'Burger montado' : `${Math.round(progress * 100)}% aberto`);
    }

    function tick(time) {
      const dt = Math.min((time - (lastTime || time - 16)) / 1000, .032);
      lastTime = time;
      velocity += ((target - value) * 190 - velocity * 25) * dt;
      value = clamp(value + velocity * dt);
      render();
      if (Math.abs(target - value) > .0008 || Math.abs(velocity) > .008) frame = requestAnimationFrame(tick);
      else { value = target; velocity = 0; frame = 0; lastTime = 0; render(); }
    }

    function setTarget(next, immediate = false) {
      target = clamp(next);
      if (reducedMotion || immediate) {
        cancelAnimationFrame(frame); frame = 0; lastTime = 0; velocity = 0; value = target; render();
      } else if (!frame) frame = requestAnimationFrame(tick);
    }

    function report(method) {
      track('interaction_burger_exploded', { method, progress: Math.round(target * 100), product: 'rachando' });
    }

    stage.addEventListener('pointerenter', event => {
      if (event.pointerType !== 'mouse' || !finePointer.matches || reducedMotion) return;
      hovered = true;
      if (!pinned && !gesture) setTarget(.28);
    });
    stage.addEventListener('pointermove', event => {
      if (gesture?.id === event.pointerId) {
        const dy = gesture.y - event.clientY;
        if (Math.abs(dy) > 6) gesture.moved = true;
        if (gesture.moved) {
          manual = true;
          const travel = Math.max(170, Math.min(260, scene.clientHeight * .43));
          setTarget(gesture.start + dy / travel, true);
          event.preventDefault();
        }
        return;
      }
      if (event.pointerType !== 'mouse' || reducedMotion || !finePointer.matches) return;
      const rect = stage.getBoundingClientRect();
      const x = clamp((event.clientX - rect.left) / rect.width);
      const y = clamp((event.clientY - rect.top) / rect.height);
      scene.style.setProperty('--mouse-x', ((x - .5) * 1.5).toFixed(3));
      scene.style.setProperty('--mouse-y', ((y - .5) * 1.5).toFixed(3));
    });
    stage.addEventListener('pointerleave', () => {
      hovered = false;
      scene.style.setProperty('--mouse-x', '0');
      scene.style.setProperty('--mouse-y', '0');
      if (!gesture && !pinned) setTarget(0);
    });
    stage.addEventListener('pointerdown', event => {
      if (!event.isPrimary || event.button !== 0) return;
      swallowClick = false;
      gesture = { id: event.pointerId, y: event.clientY, start: value, moved: false };
      stage.setPointerCapture(event.pointerId);
    });
    function finishGesture(event, cancelled = false) {
      if (!gesture || gesture.id !== event.pointerId) return;
      const completed = gesture;
      gesture = null;
      if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
      if (completed.moved && !cancelled) {
        swallowClick = true;
        const dy = completed.y - event.clientY;
        if (dy > 25) pinned = true;
        else if (dy < -25) pinned = false;
        else pinned = value >= .45;
        setTarget(pinned ? 1 : 0);
        report('drag');
      } else if (cancelled) setTarget(completed.start);
    }
    stage.addEventListener('pointerup', event => finishGesture(event));
    stage.addEventListener('pointercancel', event => finishGesture(event, true));
    stage.addEventListener('click', event => {
      if (swallowClick && event.detail !== 0) { swallowClick = false; return; }
      manual = true;
      pinned = !pinned;
      setTarget(pinned ? 1 : 0);
      report(event.detail === 0 ? 'keyboard' : 'click');
    });
    stage.addEventListener('keydown', event => {
      if (!['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault(); manual = true;
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? 1 : target + (event.key === 'ArrowUp' ? .1 : -.1);
      setTarget(next); pinned = target > 0; report('keyboard');
    });
    range.addEventListener('input', () => {
      manual = true; pinned = Number(range.value) > 0; setTarget(Number(range.value) / 100);
    });
    range.addEventListener('change', () => report('range'));
    new ResizeObserver(() => {
      const unit = clamp(scene.clientWidth / 630, .7, 1.08);
      scene.style.setProperty('--unit', unit.toFixed(3));
    }).observe(scene);
    render();
    return {
      story(progress) {
        if (!manual && !hovered && !gesture && !reducedMotion && innerWidth > 800) setTarget(progress * .14);
      },
      motionChanged() { setTarget(target, true); scene.style.setProperty('--mouse-x', '0'); scene.style.setProperty('--mouse-y', '0'); }
    };
  }

  function initScroll(burger) {
    const header = $('#header'), sticky = $('.sticky-order');
    const hero = $('.hero'), inside = $('.inside'), brand = $('.brand-moment'), ending = $('.final-cta');
    let pending = false;
    function update() {
      pending = false;
      const heroRect = hero.getBoundingClientRect();
      const insideRect = inside.getBoundingClientRect();
      const brandRect = brand.getBoundingClientRect();
      const endingRect = ending.getBoundingClientRect();
      const fixed = scrollY > 145;
      header.classList.toggle('scrolled', fixed);
      document.body.classList.toggle('header-fixed', fixed);
      sticky.classList.toggle('visible', heroRect.bottom < innerHeight * .45 && endingRect.top > innerHeight * .8);
      if (reducedMotion) return;
      if (heroRect.bottom > 0) hero.style.setProperty('--hero-progress', clamp(-heroRect.top / heroRect.height).toFixed(3));
      if (brandRect.top < innerHeight && brandRect.bottom > 0) brand.style.setProperty('--brand-progress', clamp((innerHeight - brandRect.top) / (innerHeight + brandRect.height)).toFixed(3));
      if (insideRect.top < innerHeight && insideRect.bottom > 0) burger.story(clamp(-insideRect.top / Math.max(300, insideRect.height - innerHeight)));
    }
    function schedule() { if (!pending) { pending = true; requestAnimationFrame(update); } }
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule, { passive: true });
    update();
    return update;
  }

  function initPointerDepth() {
    $$('[data-depth]').forEach(element => {
      let frame = 0, x = 0, y = 0;
      element.addEventListener('pointermove', event => {
        if (reducedMotion || event.pointerType !== 'mouse' || !finePointer.matches) return;
        const rect = element.getBoundingClientRect();
        x = ((event.clientX - rect.left) / rect.width - .5) * 2;
        y = ((event.clientY - rect.top) / rect.height - .5) * 2;
        if (!frame) frame = requestAnimationFrame(() => {
          element.style.setProperty('--depth-x', x.toFixed(3));
          element.style.setProperty('--depth-y', y.toFixed(3)); frame = 0;
        });
      });
      element.addEventListener('pointerleave', () => {
        cancelAnimationFrame(frame); frame = 0;
        element.style.setProperty('--depth-x', '0'); element.style.setProperty('--depth-y', '0');
      });
    });
  }

  function initCursor() {
    const cursor = $('.cursor-tag');
    let active = false, frame = 0, x = 0, y = 0, tx = 0, ty = 0;
    function draw() {
      x += (tx - x) * .2; y += (ty - y) * .2;
      cursor.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;
      if (active && (Math.abs(tx - x) > .2 || Math.abs(ty - y) > .2)) frame = requestAnimationFrame(draw);
      else frame = 0;
    }
    function hide() { active = false; cursor.style.opacity = '0'; cancelAnimationFrame(frame); frame = 0; }
    $$('[data-cursor],.button:not(.sticky-order)').forEach(element => {
      element.addEventListener('pointerenter', event => {
        if (reducedMotion || event.pointerType !== 'mouse' || !finePointer.matches) return;
        active = true; cursor.textContent = element.dataset.cursor || 'PEDIR';
        x = tx = event.clientX + 18; y = ty = event.clientY + 18;
        cursor.style.opacity = '1'; if (!frame) frame = requestAnimationFrame(draw);
      });
      element.addEventListener('pointermove', event => {
        if (!active) return; tx = event.clientX + 18; ty = event.clientY + 18;
        if (!frame) frame = requestAnimationFrame(draw);
      });
      element.addEventListener('pointerleave', hide);
    });
    document.addEventListener('visibilitychange', () => { if (document.hidden) hide(); });
    return hide;
  }

  bindAnalytics(); initMenu(); initReveals(); initPointerDepth();
  const burger = initBurger();
  const updateScroll = initScroll(burger);
  const hideCursor = initCursor();
  motionPreference.addEventListener('change', event => {
    reducedMotion = event.matches;
    hideCursor(); burger.motionChanged();
    $$('[data-depth]').forEach(element => {
      element.style.setProperty('--depth-x', '0'); element.style.setProperty('--depth-y', '0');
    });
    if (reducedMotion) $$('.is-revealing').forEach(element => element.classList.remove('is-revealing'));
    updateScroll();
  });
})();
