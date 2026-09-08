"use client";

import { useEffect, useRef } from "react";

const VERT = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;

uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_mouse_strength;
uniform vec2 u_ripples[4];
uniform float u_ripple_t[4];

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 p = gl_FragCoord.xy / u_res.y;
  float t = u_time * 0.04;

  // flowing domain warp
  vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t * 0.5));
  vec2 r = vec2(
    fbm(p + 2.0 * q + vec2(1.7, 9.2) + t * 0.2),
    fbm(p + 2.0 * q + vec2(8.3, 2.8) - t * 0.15)
  );
  float h = fbm(p + 1.6 * r);

  // mouse "impact" — push the surface up under the cursor
  float md = distance(p, u_mouse);
  h += exp(-md * md * 6.0) * u_mouse_strength * 0.22;

  // click ripples — expanding waves
  for (int i = 0; i < 4; i++) {
    float age = u_time - u_ripple_t[i];
    if (age > 0.0 && age < 8.0) {
      float rd = distance(p, u_ripples[i]);
      h += sin(rd * 28.0 - age * 2.4) * exp(-rd * 2.4 - age * 0.6) * 0.06;
    }
  }

  // relaxing blue palette (matches the site's navy + light-blue theme)
  vec3 navy = vec3(0.04, 0.08, 0.15);
  vec3 steel = vec3(0.20, 0.38, 0.60);
  vec3 sky = vec3(0.48, 0.68, 0.95);

  vec3 elev = mix(steel, sky, smoothstep(0.0, 1.0, h));

  // very thin contour lines at band boundaries
  float levels = 24.0;
  float f = fract(h * levels);
  float line = clamp(
    smoothstep(0.01, 0.0, f) + smoothstep(0.01, 0.0, 1.0 - f),
    0.0,
    1.0
  );

  vec3 col = mix(navy, elev, 0.10);
  col += sky * line * 0.55;

  // soft vignette
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  col *= 1.0 - 0.25 * dot(uv - 0.5, uv - 0.5) * 2.0;

  gl_FragColor = vec4(col, 1.0);
}
`;

const MAX_RIPPLES = 4;

/**
 * Full-screen WebGL canvas rendering an animated blue topographic map.
 * The cursor pushes the surface, and taps on buttons/links send ripples
 * through it. If WebGL is unavailable the canvas stays transparent and the
 * parent's fallback (glacier photo) shows through.
 */
export default function TopoCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: false,
    }) as WebGLRenderingContext | null;
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type);
      if (!sh) return null;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(sh));
        gl.deleteShader(sh);
        return null;
      }
      return sh;
    };

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    // fullscreen triangle
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(prog, "a_pos");
    if (aPos >= 0) {
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    }

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");
    const uMouseStrength = gl.getUniformLocation(prog, "u_mouse_strength");
    const uRipples = gl.getUniformLocation(prog, "u_ripples");
    const uRippleT = gl.getUniformLocation(prog, "u_ripple_t");

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // cursor tracking (height-normalized, y-up, matching shader `p`)
    let targetX = 0.5;
    let targetY = 0.5;
    let mouseX = 0.5;
    let mouseY = 0.5;
    let strength = 0;

    const toShaderPoint = (cx: number, cy: number) => {
      const h = canvas.clientHeight || 1;
      return { x: cx / h, y: (h - cy) / h };
    };

    const onMove = (e: PointerEvent) => {
      const pt = toShaderPoint(e.clientX, e.clientY);
      targetX = pt.x;
      targetY = pt.y;
      strength = 1.0;
    };

    // ripples on button/link taps
    const ripples: { x: number; y: number; start: number }[] = [];
    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as Element | null;
      if (!t || typeof t.closest !== "function") return;
      if (!t.closest("button, a")) return;
      const pt = toShaderPoint(e.clientX, e.clientY);
      ripples.push({ x: pt.x, y: pt.y, start: performance.now() / 1000 });
      if (ripples.length > MAX_RIPPLES) ripples.shift();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerdown", onPointerDown, true);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
    };
    resize();
    window.addEventListener("resize", resize);

    // initial cursor center
    {
      const pt = toShaderPoint(canvas.clientWidth / 2, canvas.clientHeight / 2);
      targetX = mouseX = pt.x;
      targetY = mouseY = pt.y;
    }

    const start = performance.now();
    let raf = 0;
    const frame = (now: number) => {
      const t = (now - start) / 1000;

      // smooth the cursor toward its target, decay the impact
      mouseX += (targetX - mouseX) * 0.1;
      mouseY += (targetY - mouseY) * 0.1;
      strength *= 0.97;

      const rPos = new Float32Array(MAX_RIPPLES * 2);
      const rTime = new Float32Array(MAX_RIPPLES);
      for (let i = 0; i < MAX_RIPPLES; i++) {
        if (i < ripples.length) {
          rPos[i * 2] = ripples[i].x;
          rPos[i * 2 + 1] = ripples[i].y;
          rTime[i] = ripples[i].start;
        } else {
          rPos[i * 2] = 0;
          rPos[i * 2 + 1] = 0;
          rTime[i] = 1e6; // future → skipped in shader
        }
      }

      gl.uniform1f(uTime, t);
      gl.uniform2f(uMouse, mouseX, mouseY);
      gl.uniform1f(uMouseStrength, strength);
      gl.uniform2fv(uRipples, rPos);
      gl.uniform1fv(uRippleT, rTime);

      gl.clearColor(0.02, 0.04, 0.09, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      if (!reduced) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("resize", resize);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} />;
}
