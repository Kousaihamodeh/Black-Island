'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Dynamic3DShowcaseProps {
  modelUrl?: string | null;
  imageUrl?: string | null;
  scale?: number;
  rotationSpeed?: number;
  autoRotate?: boolean;
  mouseInteraction?: boolean;
  lightingPower?: number;
  height?: string;
}

export default function Dynamic3DShowcase({
  modelUrl,
  imageUrl = '/logo.png',
  scale = 1.0,
  rotationSpeed = 0.005,
  autoRotate = true,
  mouseInteraction = true,
  lightingPower = 1.5,
  height = '450px',
}: Dynamic3DShowcaseProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const heightPx = mountRef.current.clientHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / heightPx, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    mountRef.current.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, lightingPower * 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xd4af37, lightingPower * 1.5, 50);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const goldSpotLight = new THREE.SpotLight(0xd4af37, lightingPower * 2);
    goldSpotLight.position.set(-5, -5, 5);
    scene.add(goldSpotLight);

    // Group Container
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Metallic Gold Outer Ring
    const ringGeo = new THREE.TorusGeometry(1.8 * scale, 0.04, 16, 100);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.9,
      roughness: 0.2,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    mainGroup.add(ringMesh);

    // Core Geometry Mesh (Texture texture or metallic octagon)
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(imageUrl || '/logo.png');

    const coreGeo = new THREE.CylinderGeometry(1.2 * scale, 1.2 * scale, 0.1, 32);
    const coreMat = new THREE.MeshStandardMaterial({
      map: texture,
      color: 0xffffff,
      metalness: 0.4,
      roughness: 0.3,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.rotation.x = Math.PI / 2;
    mainGroup.add(coreMesh);

    // Mouse Parallax Interaction
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!mouseInteraction) return;
      const rect = mountRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (autoRotate) {
        mainGroup.rotation.y += rotationSpeed;
        ringMesh.rotation.z += rotationSpeed * 1.2;
      }

      if (mouseInteraction) {
        mainGroup.rotation.x += (mouseY * 0.3 - mainGroup.rotation.x) * 0.05;
        mainGroup.rotation.y += (mouseX * 0.3 - mainGroup.rotation.y) * 0.05;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [modelUrl, imageUrl, scale, rotationSpeed, autoRotate, mouseInteraction, lightingPower]);

  return <div ref={mountRef} className="w-full relative rounded-2xl overflow-hidden" style={{ height }} />;
}
