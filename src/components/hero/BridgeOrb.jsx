'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// ────────────────────────────────────────────────────────────────
// BridgeOrb — animated 3D scene representing "Front + Conexus".
// A pulsing wireframe icosahedron orbited by particles drifting
// between teal (technical) and coral (human). Pure Three.js, no
// React-Three-Fiber — keeps bundle small and SSR-safe.
//
// Respects prefers-reduced-motion (renders a single static frame).
// ────────────────────────────────────────────────────────────────

const TEAL = new THREE.Color('#5eead4');
const CORAL = new THREE.Color('#ff6b6b');
const BRIDGE = new THREE.Color('#a78bfa');

export default function BridgeOrb({ className = '' }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const reduceMotion =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Mobile budget: fewer particles, lower DPR, no resize observer
    // overhead. Desktop gets the full cinematic treatment. We branch
    // off viewport width because hardwareConcurrency lies on iOS.
    const isMobile =
      typeof window !== 'undefined' &&
      (window.innerWidth < 768 ||
        window.matchMedia('(pointer: coarse)').matches);
    // Tightened mobile budget for Lighthouse 90+ on low-end Androids.
    // 80 particles is still visually rich (each carries the bridge
    // gradient color), but ~43% less per-frame matrix math than 140.
    const PARTICLE_COUNT = isMobile ? 80 : 400;
    const PIXEL_RATIO_CAP = isMobile ? 1.25 : 2;

    // ── Scene + camera ────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100,
    );
    camera.position.set(0, 0, 4.6);

    // WebGL init can throw on Safari iOS under memory pressure,
    // browsers with WebGL disabled, or headless envs. Fail soft so
    // the rest of the hero (text, CTAs) keeps rendering.
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        failIfMajorPerformanceCaveat: false,
      });
    } catch (err) {
      console.warn(
        '[BridgeOrb] WebGL unavailable, skipping 3D scene:',
        err?.message,
      );
      return undefined;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, PIXEL_RATIO_CAP));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // GPU context loss handling — when the OS evicts our context
    // (tab backgrounded, mobile memory pressure) we pause the loop;
    // when restored we resume. Prevents the canvas from going black
    // permanently on long sessions.
    let contextLost = false;
    const onContextLost = (e) => {
      e.preventDefault();
      contextLost = true;
    };
    const onContextRestored = () => {
      contextLost = false;
    };
    renderer.domElement.addEventListener(
      'webglcontextlost',
      onContextLost,
      false,
    );
    renderer.domElement.addEventListener(
      'webglcontextrestored',
      onContextRestored,
      false,
    );

    // ── Wireframe icosahedron — the "core" of the bridge ──────
    const coreGeo = new THREE.IcosahedronGeometry(1.35, 1);
    const coreMat = new THREE.MeshBasicMaterial({
      color: TEAL,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    // Inner solid (slightly smaller) with subtle gradient feel
    const innerGeo = new THREE.IcosahedronGeometry(1.0, 0);
    const innerMat = new THREE.MeshBasicMaterial({
      color: BRIDGE,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const inner = new THREE.Mesh(innerGeo, innerMat);
    scene.add(inner);

    // ── Particle field — the "connection threads" ─────────────
    // Count comes from the device profile decided above (140 mobile,
    // 400 desktop). All allocations sized once so the GC stays
    // happy during the whole animation lifetime.
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const speeds = new Float32Array(PARTICLE_COUNT);
    const baseRadii = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Random point on a sphere of varying radius
      const r = 1.7 + Math.random() * 1.6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // Color — interpolate between teal and coral by particle index
      const t = i / PARTICLE_COUNT;
      const c = new THREE.Color().lerpColors(TEAL, CORAL, t);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      speeds[i] = 0.15 + Math.random() * 0.5;
      baseRadii[i] = r;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ── Soft ambient glow ring (large, blurred via opacity) ──
    const glowGeo = new THREE.RingGeometry(1.8, 2.15, 64);
    const glowMat = new THREE.MeshBasicMaterial({
      color: BRIDGE,
      transparent: true,
      opacity: 0.08,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    scene.add(glow);

    // ── Resize ────────────────────────────────────────────────
    function onResize() {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    // ── Mouse parallax (desktop only — saves CPU on mobile) ───
    let targetRotX = 0;
    let targetRotY = 0;
    function onMouse(e) {
      const rect = mount.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      targetRotY = nx * 0.6;
      targetRotX = ny * 0.4;
    }
    if (!isMobile) {
      window.addEventListener('mousemove', onMouse, { passive: true });
    }

    // Pause animation when the canvas leaves the viewport — we still
    // hold the WebGL context alive but stop the per-frame work.
    let inView = true;
    const visibilityObserver =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            ([entry]) => {
              inView = entry.isIntersecting;
            },
            { threshold: 0 },
          )
        : null;
    if (visibilityObserver) visibilityObserver.observe(mount);

    // ── Animation loop ────────────────────────────────────────
    let frameId;
    let elapsed = 0;
    const clock = new THREE.Clock();

    function tick() {
      if (!inView || contextLost) {
        // Schedule another check, but skip the per-frame work.
        // contextLost guard prevents calling .render() on a dead
        // GPU context (which throws and breaks the loop).
        frameId = requestAnimationFrame(tick);
        return;
      }
      const dt = clock.getDelta();
      elapsed += dt;

      // Smoothly approach mouse target
      core.rotation.y += (targetRotY - core.rotation.y) * 0.04;
      core.rotation.x += (targetRotX - core.rotation.x) * 0.04;
      core.rotation.y += dt * 0.12;
      core.rotation.x += dt * 0.05;

      inner.rotation.y -= dt * 0.18;
      inner.rotation.x -= dt * 0.07;

      // Particle drift — gentle pulse along radius
      const posAttr = particles.geometry.attributes.position;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const px = positions[i * 3];
        const py = positions[i * 3 + 1];
        const pz = positions[i * 3 + 2];
        const len = Math.sqrt(px * px + py * py + pz * pz) || 1;
        const targetR = baseRadii[i] + Math.sin(elapsed * speeds[i] + i) * 0.18;
        const k = targetR / len;
        posAttr.array[i * 3] = px * k;
        posAttr.array[i * 3 + 1] = py * k;
        posAttr.array[i * 3 + 2] = pz * k;
      }
      posAttr.needsUpdate = true;
      particles.rotation.y += dt * 0.04;

      glow.rotation.z += dt * 0.06;

      renderer.render(scene, camera);
      if (!reduceMotion) frameId = requestAnimationFrame(tick);
    }

    if (reduceMotion) {
      renderer.render(scene, camera);
    } else {
      frameId = requestAnimationFrame(tick);
    }

    // ── Cleanup ───────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(frameId);
      if (!isMobile) window.removeEventListener('mousemove', onMouse);
      if (visibilityObserver) visibilityObserver.disconnect();
      renderer.domElement.removeEventListener(
        'webglcontextlost',
        onContextLost,
      );
      renderer.domElement.removeEventListener(
        'webglcontextrestored',
        onContextRestored,
      );
      ro.disconnect();
      coreGeo.dispose();
      coreMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      glowGeo.dispose();
      glowMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
}
