(() => {
  const fan = document.querySelector('.fan');
  const layer = document.querySelector('.emoji-layer');
  if (!fan || !layer) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const MAX_PARTICLES = 90;
  const SPAWN_INTERVAL_MS = 70;
  const particles = [];
  let running = true;

  fan.addEventListener('mouseenter', () => { running = false; });
  fan.addEventListener('mouseleave', () => { running = true; });
  fan.addEventListener('touchstart', () => { running = false; }, { passive: true });
  fan.addEventListener('touchend', () => { running = true; });

  function fanCenter() {
    const r = fan.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + 180 };
  }

  function spawn() {
    if (particles.length >= MAX_PARTICLES) return;

    const c = fanCenter();
    const el = document.createElement('span');
    el.className = 'foot';
    el.textContent = '🦶';
    layer.appendChild(el);

    const angle = Math.random() * Math.PI * 2;
    const speed = 7 + Math.random() * 6;
    const verticalBias = -1.5 + (Math.random() - 0.5) * 2;

    particles.push({
      el,
      x: c.x + (Math.random() - 0.5) * 30,
      y: c.y + (Math.random() - 0.5) * 30,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed + verticalBias,
      rot: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 14,
      scale: 0.9 + Math.random() * 0.7,
    });
  }

  let lastSpawn = 0;
  let last = performance.now();

  function tick(now) {
    const dt = Math.min(2.5, (now - last) / 16.67);
    last = now;

    if (running && now - lastSpawn > SPAWN_INTERVAL_MS) {
      spawn();
      lastSpawn = now;
    }

    const W = window.innerWidth;
    const H = window.innerHeight;

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];

      if (running) {
        p.vy += 0.06 * dt;
        p.vx *= Math.pow(0.992, dt);
        p.vy *= Math.pow(0.992, dt);
      } else {
        p.vy += 0.7 * dt;
        p.vx *= Math.pow(0.94, dt);
      }

      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot += p.vRot * dt;

      p.el.style.transform = `translate(${p.x}px, ${p.y}px) rotate(${p.rot}deg) scale(${p.scale})`;

      if (p.y > H + 120 || p.x < -120 || p.x > W + 120) {
        p.el.remove();
        particles.splice(i, 1);
      }
    }

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
})();
