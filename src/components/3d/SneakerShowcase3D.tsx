'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function SneakerShowcase3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    let animId: number;
    let renderer: THREE.WebGLRenderer;

    try {
      const width = containerRef.current.clientWidth || 600;
      const height = containerRef.current.clientHeight || 400;

      // 1. Scene
      const scene = new THREE.Scene();

      // 2. Camera
      const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
      camera.position.set(4, 2, 5);

      // 3. Renderer
      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true,
        alpha: true,
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // 4. Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
      scene.add(ambientLight);

      const mainLight = new THREE.DirectionalLight(0xffffff, 1.8);
      mainLight.position.set(10, 10, 10);
      scene.add(mainLight);

      const spotLight = new THREE.SpotLight(0xd4af37, 1.5);
      spotLight.position.set(-10, 10, 5);
      scene.add(spotLight);

      // 5. Sneaker Group
      const sneakerGroup = new THREE.Group();
      sneakerGroup.position.set(0, -0.2, 0);

      // Sole
      const soleGeo = new THREE.BoxGeometry(3.2, 0.4, 1.2);
      const soleMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.1 });
      const sole = new THREE.Mesh(soleGeo, soleMat);
      sole.position.set(0, -0.4, 0);
      sneakerGroup.add(sole);

      // Sole Grip
      const gripGeo = new THREE.BoxGeometry(3.3, 0.1, 1.25);
      const gripMat = new THREE.MeshStandardMaterial({ color: 0x111116, roughness: 0.8 });
      const grip = new THREE.Mesh(gripGeo, gripMat);
      grip.position.set(0, -0.55, 0);
      sneakerGroup.add(grip);

      // Leather Body
      const bodyGeo = new THREE.BoxGeometry(2.5, 0.8, 1.1);
      const bodyMat = new THREE.MeshStandardMaterial({ color: 0x0c0c0f, roughness: 0.3, metalness: 0.4 });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.position.set(-0.2, 0.1, 0);
      sneakerGroup.add(body);

      // Heel
      const heelGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.8, 16);
      const heelMat = new THREE.MeshStandardMaterial({ color: 0x1f1f28, roughness: 0.4 });
      const heel = new THREE.Mesh(heelGeo, heelMat);
      heel.position.set(-1.1, 0.5, 0);
      sneakerGroup.add(heel);

      // Gold Side Stripe
      const stripeGeo = new THREE.BoxGeometry(1.6, 0.15, 0.05);
      const stripeMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.1 });
      const stripeLeft = new THREE.Mesh(stripeGeo, stripeMat);
      stripeLeft.position.set(0.1, 0.15, 0.56);
      stripeLeft.rotation.z = -0.1;
      sneakerGroup.add(stripeLeft);

      const stripeRight = new THREE.Mesh(stripeGeo, stripeMat);
      stripeRight.position.set(0.1, 0.15, -0.56);
      stripeRight.rotation.z = -0.1;
      sneakerGroup.add(stripeRight);

      // Toe Cap
      const toeGeo = new THREE.SphereGeometry(0.6, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
      const toeMat = new THREE.MeshStandardMaterial({ color: 0x17171e, roughness: 0.3, metalness: 0.5 });
      const toe = new THREE.Mesh(toeGeo, toeMat);
      toe.position.set(1.1, -0.1, 0);
      sneakerGroup.add(toe);

      scene.add(sneakerGroup);

      // 6. Controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableZoom = false;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 1.5;

      let clock = new THREE.Clock();
      const animate = () => {
        controls.update();
        renderer.render(scene, camera);
        animId = requestAnimationFrame(animate);
      };
      animate();

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
      console.error(e);
    }
  }, []);

  return (
    <div ref={containerRef} className="w-full h-[280px] sm:h-[400px] relative rounded-2xl overflow-hidden bg-gradient-to-b from-brand-900 to-black border border-brand-800 shadow-2xl">
      {/* Mobile fast-loader image fallback */}
      <div className="block sm:hidden w-full h-full relative">
        <img
          src="https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=1000&auto=format&fit=crop"
          alt="360 Sneaker Spotlight"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
      </div>

      {/* Desktop 3D Canvas */}
      <canvas ref={canvasRef} className="hidden sm:block w-full h-full" />

      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] sm:text-xs font-mono text-brand-gold border border-brand-gold/30">
        360° SNEAKER SPOTLIGHT
      </div>
    </div>
  );
}
