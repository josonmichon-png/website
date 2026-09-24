"use client";

import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from "ogl";
import { useEffect, useRef } from "react";

import "./CircularGallery.css";

const lerp = (start, end, amount) => start + (end - start) * amount;

function createTextTexture(gl, text, font, color) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  context.font = font;
  const metrics = context.measureText(text);
  const fontSize = Number(font.match(/(\d+)px/)?.[1] || 30);
  canvas.width = Math.ceil(metrics.width) + 48;
  canvas.height = Math.ceil(fontSize * 1.45) + 24;

  context.font = font;
  context.fillStyle = color;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new Texture(gl, { generateMipmaps: false });
  texture.image = canvas;
  return { texture, width: canvas.width, height: canvas.height };
}

class GalleryTitle {
  constructor({ gl, parent, text, color, font }) {
    const { texture, width, height } = createTextTexture(gl, text, font, color);
    const geometry = new Plane(gl);
    const program = new Program(gl, {
      vertex: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tMap, vUv);
          if (color.a < 0.1) discard;
          gl_FragColor = color;
        }
      `,
      uniforms: { tMap: { value: texture } },
      transparent: true,
    });

    this.mesh = new Mesh(gl, { geometry, program });
    const textHeight = parent.scale.y * 0.14;
    this.mesh.scale.set(textHeight * (width / height), textHeight, 1);
    this.mesh.position.y = -parent.scale.y * 0.58;
    this.mesh.setParent(parent);
  }
}

class GalleryMedia {
  constructor({ gl, geometry, image, text, index, length, scene, screen, viewport, bend, textColor, borderRadius, font }) {
    this.gl = gl;
    this.extra = 0;
    this.index = index;
    this.length = length;
    this.screen = screen;
    this.viewport = viewport;
    this.bend = bend;

    const texture = new Texture(gl, { generateMipmaps: true });
    const program = new Program(gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          p.z = (sin(p.x * 4.0 + uTime) + cos(p.y * 2.0 + uTime)) * (0.07 + uSpeed * 0.35);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        varying vec2 vUv;

        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }

        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          vec4 color = texture2D(tMap, uv);
          float distance = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          float alpha = 1.0 - smoothstep(-0.002, 0.002, distance);
          gl_FragColor = vec4(color.rgb, alpha);
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [1, 1] },
        uSpeed: { value: 0 },
        uTime: { value: Math.random() * 100 },
        uBorderRadius: { value: borderRadius },
      },
      transparent: true,
    });

    this.plane = new Mesh(gl, { geometry, program });
    this.plane.setParent(scene);
    this.program = program;

    const imageElement = new Image();
    imageElement.src = image;
    imageElement.onload = () => {
      texture.image = imageElement;
      program.uniforms.uImageSizes.value = [imageElement.naturalWidth, imageElement.naturalHeight];
    };

    this.onResize({ screen, viewport });
    this.title = new GalleryTitle({ gl, parent: this.plane, text, color: textColor, font });
  }

  onResize({ screen, viewport }) {
    this.screen = screen;
    this.viewport = viewport;
    const scale = this.screen.height / 980;
    this.plane.scale.y = (this.viewport.height * (520 * scale)) / this.screen.height;
    this.plane.scale.x = (this.viewport.width * (620 * scale)) / this.screen.width;
    this.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y];
    this.padding = 1.25;
    this.width = this.plane.scale.x + this.padding;
    this.widthTotal = this.width * this.length;
    this.x = this.width * this.index;
  }

  update(scroll, direction) {
    this.plane.position.x = this.x - scroll.current - this.extra;
    const x = this.plane.position.x;
    const halfViewport = this.viewport.width / 2;

    if (this.bend === 0) {
      this.plane.position.y = 0;
      this.plane.rotation.z = 0;
    } else {
      const bend = Math.abs(this.bend);
      const radius = (halfViewport * halfViewport + bend * bend) / (2 * bend);
      const effectiveX = Math.min(Math.abs(x), halfViewport);
      const arc = radius - Math.sqrt(radius * radius - effectiveX * effectiveX);
      this.plane.position.y = this.bend > 0 ? -arc : arc;
      this.plane.rotation.z = (this.bend > 0 ? -1 : 1) * Math.sign(x) * Math.asin(effectiveX / radius);
    }

    const speed = scroll.current - scroll.last;
    this.program.uniforms.uTime.value += 0.035;
    this.program.uniforms.uSpeed.value = speed;

    const planeOffset = this.plane.scale.x / 2;
    const isBefore = this.plane.position.x + planeOffset < -halfViewport;
    const isAfter = this.plane.position.x - planeOffset > halfViewport;
    if (direction === "right" && isBefore) this.extra -= this.widthTotal;
    if (direction === "left" && isAfter) this.extra += this.widthTotal;
  }
}

class GalleryApp {
  constructor(container, options) {
    this.container = container;
    this.scrollSpeed = options.scrollSpeed;
    this.scroll = { ease: options.scrollEase, current: 0, target: 0, last: 0, position: 0 };
    this.renderer = new Renderer({ alpha: true, antialias: true, dpr: Math.min(window.devicePixelRatio || 1, 2) });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    this.container.appendChild(this.gl.canvas);
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
    this.scene = new Transform();
    this.geometry = new Plane(this.gl, { heightSegments: 32, widthSegments: 64 });

    this.onResize();
    const loopedItems = options.items.concat(options.items);
    this.medias = loopedItems.map((item, index) => new GalleryMedia({
      gl: this.gl,
      geometry: this.geometry,
      image: item.image,
      text: item.text,
      index,
      length: loopedItems.length,
      scene: this.scene,
      screen: this.screen,
      viewport: this.viewport,
      bend: options.bend,
      textColor: options.textColor,
      borderRadius: options.borderRadius,
      font: options.font,
    }));

    this.bindEvents();
    this.update();
  }

  onResize = () => {
    this.screen = { width: this.container.clientWidth, height: this.container.clientHeight };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({ aspect: this.screen.width / this.screen.height });
    const height = 2 * Math.tan((this.camera.fov * Math.PI) / 360) * this.camera.position.z;
    this.viewport = { width: height * this.camera.aspect, height };
    this.medias?.forEach((media) => media.onResize({ screen: this.screen, viewport: this.viewport }));
  };

  snap = () => {
    const width = this.medias?.[0]?.width;
    if (!width) return;
    this.scroll.target = Math.round(this.scroll.target / width) * width;
  };

  onPointerDown = (event) => {
    this.isDown = true;
    this.start = event.clientX;
    this.scroll.position = this.scroll.current;
    this.container.setPointerCapture?.(event.pointerId);
  };

  onPointerMove = (event) => {
    if (!this.isDown) return;
    this.scroll.target = this.scroll.position + (this.start - event.clientX) * this.scrollSpeed * 0.025;
  };

  onPointerUp = () => {
    this.isDown = false;
    this.snap();
  };

  onWheel = (event) => {
    this.scroll.target += (event.deltaY > 0 ? 1 : -1) * this.scrollSpeed * 0.18;
    clearTimeout(this.wheelTimer);
    this.wheelTimer = window.setTimeout(this.snap, 160);
  };

  onKeyDown = (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home"].includes(event.key)) return;
    event.preventDefault();
    if (event.key === "Home") this.scroll.target = 0;
    if (event.key === "ArrowRight") this.scroll.target += this.scrollSpeed * 4;
    if (event.key === "ArrowLeft") this.scroll.target -= this.scrollSpeed * 4;
    this.snap();
  };

  bindEvents() {
    window.addEventListener("resize", this.onResize);
    this.container.addEventListener("pointerdown", this.onPointerDown);
    this.container.addEventListener("pointermove", this.onPointerMove);
    this.container.addEventListener("pointerup", this.onPointerUp);
    this.container.addEventListener("pointercancel", this.onPointerUp);
    this.container.addEventListener("wheel", this.onWheel, { passive: true });
    this.container.addEventListener("keydown", this.onKeyDown);
  }

  update = () => {
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
    const direction = this.scroll.current > this.scroll.last ? "right" : "left";
    this.medias.forEach((media) => media.update(this.scroll, direction));
    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;
    this.raf = window.requestAnimationFrame(this.update);
  };

  destroy() {
    window.cancelAnimationFrame(this.raf);
    window.clearTimeout(this.wheelTimer);
    window.removeEventListener("resize", this.onResize);
    this.container.removeEventListener("pointerdown", this.onPointerDown);
    this.container.removeEventListener("pointermove", this.onPointerMove);
    this.container.removeEventListener("pointerup", this.onPointerUp);
    this.container.removeEventListener("pointercancel", this.onPointerUp);
    this.container.removeEventListener("wheel", this.onWheel);
    this.container.removeEventListener("keydown", this.onKeyDown);
    this.gl.canvas.remove();
  }
}

export default function CircularGallery({
  items,
  bend = 2.6,
  textColor = "#090b0c",
  borderRadius = 0.06,
  font = "900 30px Arial",
  scrollSpeed = 2,
  scrollEase = 0.055,
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !items?.length) return undefined;
    const app = new GalleryApp(containerRef.current, {
      items,
      bend,
      textColor,
      borderRadius,
      font,
      scrollSpeed,
      scrollEase,
    });
    return () => app.destroy();
  }, [items, bend, textColor, borderRadius, font, scrollSpeed, scrollEase]);

  return (
    <div
      className="circular-gallery"
      ref={containerRef}
      tabIndex={0}
      role="region"
      aria-label="互动项目画廊。按住鼠标横向拖动，或使用左右方向键浏览。"
    />
  );
}
