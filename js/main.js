// SHAPO DIGITAL — shared interactions

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  });
}

// Mobile menu toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => navLinks.classList.remove('open'))
  );
}

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('active'), i * 80);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => obs.observe(el));
}

// Contact form (front-end only — connect to a form service like Formspree/EmailJS)
const contactForm = document.querySelector('#contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const status = document.querySelector('#formStatus');
    if (status) {
      status.textContent = 'תודה! נחזור אליך בהקדם 🙌';
      status.style.color = '#25d366';
    }
    contactForm.reset();
  });
}


// Premium WebGL hero object + GSAP/ScrollTrigger motion
(function initPremiumMotion(){
  const canvas = document.getElementById('shapoWebgl');
  if (!canvas || !window.THREE) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0, 6.8);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));

  const group = new THREE.Group();
  scene.add(group);

  const chrome = new THREE.Color(0xe8e8ee);
  const dim = new THREE.Color(0x8a8a95);

  const mainGeo = new THREE.IcosahedronGeometry(1.55, 1);
  const mainMat = new THREE.MeshBasicMaterial({ color: chrome, wireframe: true, transparent: true, opacity: 0.42 });
  const core = new THREE.Mesh(mainGeo, mainMat);
  group.add(core);

  const torusGeo = new THREE.TorusGeometry(2.15, 0.012, 16, 160);
  const torusMat = new THREE.MeshBasicMaterial({ color: chrome, transparent: true, opacity: 0.24 });
  const rings = [];
  for (let i = 0; i < 3; i++) {
    const ring = new THREE.Mesh(torusGeo, torusMat.clone());
    ring.rotation.set(i * 0.7, i * 0.95, i * 0.55);
    ring.material.opacity = 0.18 + i * 0.045;
    rings.push(ring);
    group.add(ring);
  }

  const starGeo = new THREE.BufferGeometry();
  const count = 130;
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i*3] = (Math.random() - .5) * 8;
    pos[i*3+1] = (Math.random() - .5) * 6;
    pos[i*3+2] = (Math.random() - .5) * 4;
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: dim, size: 0.025, transparent: true, opacity: 0.55 }));
  scene.add(stars);

  function resize(){
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(1, rect.width);
    const h = Math.max(1, rect.height);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  let mx = 0, my = 0;
  window.addEventListener('pointermove', (e) => {
    mx = (e.clientX / window.innerWidth - .5) * 0.35;
    my = (e.clientY / window.innerHeight - .5) * 0.25;
  }, { passive: true });

  function tick(){
    if (!prefersReducedMotion) {
      group.rotation.y += 0.004;
      group.rotation.x += 0.0018;
      stars.rotation.y -= 0.0008;
      rings.forEach((r, i) => { r.rotation.z += 0.0018 + i * 0.0008; });
      group.position.x += (mx - group.position.x) * 0.035;
      group.position.y += (-my - group.position.y) * 0.035;
    }
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();

  if (window.gsap && window.ScrollTrigger && !prefersReducedMotion) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.to(group.rotation, {
      y: Math.PI * 2.2,
      x: Math.PI * .45,
      ease: 'none',
      scrollTrigger: { trigger: '.hero-v2', start: 'top top', end: 'bottom top', scrub: true }
    });
    gsap.to('.glass-device', {
      y: -70,
      rotateX: 0,
      rotateY: 0,
      ease: 'none',
      scrollTrigger: { trigger: '.studio-section', start: 'top bottom', end: 'top 20%', scrub: true }
    });
    gsap.utils.toArray('.method-card, .process-card').forEach((card, i) => {
      gsap.to(card, {
        y: i % 2 ? 20 : -20,
        ease: 'none',
        scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });
  }
})();
