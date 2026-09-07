'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    let animId: number;
    let renderer: THREE.WebGLRenderer;

    try {
      const width = containerRef.current.clientWidth || 450;
      const height = containerRef.current.clientHeight || 450;

      // 1. Scene
      const scene = new THREE.Scene();

      // 2. Camera
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.set(0, 0, 6.5);

      // 3. Renderer
      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // 4. Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const mainLight = new THREE.DirectionalLight(0xffffff, 1.8);
      mainLight.position.set(5, 5, 5);
      scene.add(mainLight);

      const goldLight = new THREE.PointLight(0xd4af37, 2, 10);
      goldLight.position.set(-5, -5, 2);
      scene.add(goldLight);

      const spotLight = new THREE.SpotLight(0xffffff, 2);
      spotLight.position.set(0, 8, 4);
      scene.add(spotLight);

      // 5. Build BLACK ISLAND Metallic Emblem Group
      const emblemGroup = new THREE.Group();

      // Outer Metallic Ring
      const ringGeo = new THREE.TorusGeometry(2.1, 0.08, 32, 100);
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0x1a1a22,
        metalness: 0.9,
        roughness: 0.15,
      });
      const outerRing = new THREE.Mesh(ringGeo, ringMat);
      emblemGroup.add(outerRing);

      // Inner Gold Octagon Ring
      const octGeo = new THREE.TorusGeometry(1.7, 0.05, 16, 8);
      const octMat = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        metalness: 0.95,
        roughness: 0.2,
      });
      const octRing = new THREE.Mesh(octGeo, octMat);
      octRing.rotation.z = Math.PI / 4;
      emblemGroup.add(octRing);

      // Center Obsidian Cylinder Core
      const cylGeo = new THREE.CylinderGeometry(1.3, 1.3, 0.15, 64);
      const cylMat = new THREE.MeshStandardMaterial({
        color: 0x09090b,
        metalness: 0.85,
        roughness: 0.2,
      });
      const centerCyl = new THREE.Mesh(cylGeo, cylMat);
      centerCyl.rotation.x = Math.PI / 2;
      emblemGroup.add(centerCyl);

      // Inner Floating Island Pyramid Core
      const pyrGeo = new THREE.ConeGeometry(0.7, 0.8, 4);
      const pyrMat = new THREE.MeshStandardMaterial({
        color: 0x22222b,
        metalness: 0.9,
        roughness: 0.15,
      });
      const pyramid = new THREE.Mesh(pyrGeo, pyrMat);
      pyramid.position.set(0, -0.1, 0.1);
      emblemGroup.add(pyramid);

      scene.add(emblemGroup);

      // 6. Controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 1.2;

      // 7. Animation Loop
      let clock = new THREE.Clock();
      const animate = () => {
        const elapsedTime = clock.getElapsedTime();
        emblemGroup.rotation.y = elapsedTime * 0.3;
        emblemGroup.rotation.x = Math.sin(elapsedTime * 0.5) * 0.12;

        controls.update();
        renderer.render(scene, camera);
        animId = requestAnimationFrame(animate);
      };

      animate();

      // Handle Resize
      const handleResize = () => {
        if (!containerRef.current || !renderer) return;
        const w = containerRef.current.clientWidth;
        const h = containerRef.current.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animId);
        renderer.dispose();
      };
    } catch (e) {
      console.error('WebGL error', e);
      setHasWebGL(false);
    }
  }, []);

  if (!hasWebGL) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-brand-950 via-brand-900 to-brand-800 rounded-2xl border border-brand-700/50 p-8 shadow-2xl">
        <img src="/logo.png" alt="BLACK ISLAND" className="w-48 h-48 object-contain drop-shadow-[0_0_25px_rgba(212,175,55,0.3)] animate-pulse-subtle" />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-[280px] sm:h-[450px] lg:h-[550px] relative rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing">
      {/* Mobile fast-loader fallback - zero WebGL lag on phone GPUs */}
      <div className="block sm:hidden w-full h-full flex items-center justify-center bg-gradient-to-tr from-brand-950 via-brand-900 to-black rounded-2xl border border-brand-800/80 p-6 shadow-2xl">
        <img src="/logo.png" alt="BLACK ISLAND" className="w-32 h-32 object-contain drop-shadow-[0_0_25px_rgba(212,175,55,0.4)]" />
      </div>

      {/* Desktop WebGL Interactive 3D Canvas */}
      <canvas ref={canvasRef} className="hidden sm:block w-full h-full" />
      
      <div className="hidden sm:flex absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-[11px] text-gray-300 pointer-events-none tracking-widest uppercase items-center gap-2 font-mono">
        <span className="w-2 h-2 rounded-full bg-brand-gold animate-ping" />
        Interactive 3D Identity • Drag to Rotate
      </div>
    </div>
  );
}
