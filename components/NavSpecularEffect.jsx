"use client";

import { Color, Mesh, Program, Renderer, Triangle } from "ogl";
import { useEffect, useRef } from "react";

const PAD = 14;

const VERTEX_SHADER = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;

uniform vec2 uCenter;
uniform vec2 uHalfSize;
uniform float uAngle;
uniform float uPx;
uniform vec3 uLineColor;
uniform vec3 uBaseColor;
uniform float uIntensity;
uniform float uThickness;

out vec4 fragColor;

float sdRect(vec2 p, vec2 b) {
  vec2 d = abs(p) - b;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

void main() {
  vec2 p = gl_FragCoord.xy - uCenter;
  float d = sdRect(p, uHalfSize);
  vec2 lightDirection = vec2(cos(uAngle), sin(uAngle));
  vec2 normal = normalize(p / (uHalfSize * uHalfSize) + 1e-6);
  float facing = pow(abs(dot(normal, lightDirection)), 11.0);
  float base = (1.0 - smoothstep(0.0, 1.8 * uPx, abs(d))) * 0.42;
  float line = exp(-pow(d / max(uThickness, 0.001), 2.0));
  float edgeClamp = 1.0 - smoothstep(0.5 * uPx, 3.0 * uPx, abs(d));
  float highlight = line * facing * edgeClamp * uIntensity;
  vec3 color = uBaseColor * base + uLineColor * highlight;
  fragColor = vec4(color, clamp(base + highlight, 0.0, 1.0));
}
`;

export default function NavSpecularEffect() {
  const effectRef = useRef(null);

  useEffect(() => {
    const effect = effectRef.current;
    if (!effect) return undefined;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let renderer;
    try {
      renderer = new Renderer({
        alpha: true,
        premultipliedAlpha: true,
        antialias: true,
        dpr,
      });
    } catch {
      return undefined;
    }

    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const geometry = new Triangle(gl);
    if (geometry.attributes.uv) delete geometry.attributes.uv;
    const program = new Program(gl, {
      vertex: VERTEX_SHADER,
      fragment: FRAGMENT_SHADER,
      uniforms: {
        uCenter: { value: [0, 0] },
        uHalfSize: { value: [1, 1] },
        uAngle: { value: 2.4 },
        uPx: { value: dpr },
        uLineColor: { value: [1, 1, 1] },
        uBaseColor: { value: [0.18, 0.62, 0.78] },
        uIntensity: { value: 0.24 },
        uThickness: { value: 1.25 * dpr },
      },
      transparent: true,
    });
    const mesh = new Mesh(gl, { geometry, program });
    effect.appendChild(gl.canvas);

    const lineColor = new Color("#ffffff");
    const baseColor = new Color("#54c7ed");
    program.uniforms.uLineColor.value = [lineColor.r, lineColor.g, lineColor.b];
    program.uniforms.uBaseColor.value = [baseColor.r, baseColor.g, baseColor.b];

    const size = { width: 1, height: 1 };
    const resize = () => {
      const rect = effect.getBoundingClientRect();
      size.width = rect.width;
      size.height = rect.height;
      renderer.setSize(rect.width + PAD * 2, rect.height + PAD * 2);
      program.uniforms.uCenter.value = [
        (PAD + rect.width / 2) * dpr,
        (PAD + rect.height / 2) * dpr,
      ];
      program.uniforms.uHalfSize.value = [
        (rect.width / 2) * dpr,
        (rect.height / 2) * dpr,
      ];
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(effect);
    resize();

    let pointerAngle = 2.4;
    let pointerStrength = 0;
    const onPointerMove = (event) => {
      const rect = effect.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distanceY = Math.max(rect.top - event.clientY, 0, event.clientY - rect.bottom);
      pointerStrength = Math.max(0, 1 - distanceY / 280);
      pointerAngle = Math.atan2(centerY - event.clientY, event.clientX - centerX);
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let angle = 2.4;
    let idleAngle = 2.4;
    let brightness = 0.2;
    let previous = performance.now();
    let frame = 0;

    const update = (now) => {
      frame = window.requestAnimationFrame(update);
      const delta = Math.min((now - previous) / 1000, 0.05);
      previous = now;
      if (!reducedMotion) idleAngle += 0.11 * delta;
      const targetAngle = pointerStrength > 0.01 ? pointerAngle : idleAngle;
      const difference = ((targetAngle - angle + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
      angle += difference * (1 - Math.exp(-delta * 6));
      const targetBrightness = 0.2 + pointerStrength * 1.15;
      brightness += (targetBrightness - brightness) * (1 - Math.exp(-delta * 7));
      program.uniforms.uAngle.value = angle;
      program.uniforms.uIntensity.value = brightness;
      renderer.render({ scene: mesh });
    };
    frame = window.requestAnimationFrame(update);

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      gl.canvas.remove();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <span ref={effectRef} className="nav-specular-effect" aria-hidden="true" />;
}
