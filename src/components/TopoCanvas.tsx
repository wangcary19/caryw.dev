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
uniform sampler2D u_glyph;

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

// static base field (no ambient drift)
float baseField(vec2 p) {
  vec2 q = vec2(fbm(p), fbm(p + vec2(5.2, 1.3)));
  vec2 r = vec2(
    fbm(p + 2.0 * q + vec2(1.7, 9.2)),
    fbm(p + 2.0 * q + vec2(8.3, 2.8))
  );
  return fbm(p + 1.6 * r);
}

// cursor displaces the field
vec2 displace(vec2 p) {
  vec2 mdir = p - u_mouse;
  float mw = exp(-dot(mdir, mdir) * 5.0) * u_mouse_strength;
  return p + mdir * mw * 0.45;
}

float heightAt(vec2 p) {
  return baseField(displace(p));
}

// sample a digit glyph (10 digits laid out in one row)
float glyph(int d, vec2 uv) {
  vec2 tc = vec2((float(d) + uv.x) / 10.0, uv.y);
  return texture2D(u_glyph, tc).a;
}

// 2-digit number rendered in a label box (lu in [0,1] x [0,1])
float number2(vec2 lu, int n) {
  float digitsW = 0.7;
  float dw = digitsW / 2.0;
  float x0 = (1.0 - digitsW) / 2.0;
  float gx = (lu.x - x0) / dw;
  int di = int(floor(gx));
  if (di < 0 || di > 1) return 0.0;
  float du = fract(gx);

  float y0 = 0.2;
  float y1 = 0.8;
  if (lu.y < y0 || lu.y > y1) return 0.0;
  float dv = (lu.y - y0) / (y1 - y0);

  int val = (di == 0) ? n / 10 : int(mod(float(n), 10.0));
  return glyph(val, vec2(du, dv));
}

void main() {
  vec2 p = gl_FragCoord.xy / u_res.y;

  float h = heightAt(p);

  // click ripples
  for (int i = 0; i < 4; i++) {
    float age = u_time - u_ripple_t[i];
    if (age > 0.0 && age < 8.0) {
      float rd = distance(p, u_ripples[i]);
      h += sin(rd * 28.0 - age * 2.4) * exp(-rd * 2.4 - age * 0.6) * 0.06;
    }
  }

  // blue palette (matches site theme)
  vec3 navy = vec3(0.04, 0.08, 0.15);
  vec3 steel = vec3(0.20, 0.38, 0.60);
  vec3 sky = vec3(0.48, 0.68, 0.95);

  vec3 elev = mix(steel, sky, smoothstep(0.0, 1.0, h));

  // uniform-thickness contour lines
  float levels = 24.0;
  float f = fract(h * levels);
  float line = clamp(
    smoothstep(0.008, 0.0, f) + smoothstep(0.008, 0.0, 1.0 - f),
    0.0,
    1.0
  );

  vec3 col = mix(navy, elev, 0.10);
  col += sky * line * 0.5;

  // elevation labels on every 5th contour
  float px = 1.0 / u_res.y;
  float cs = 0.26;
  vec2 cell = floor(p / cs);
  vec2 cp = (cell + 0.5) * cs;
  vec2 ldp = p - cp;
  float halfW = 19.0 * px;
  float halfH = 8.0 * px;
  if (abs(ldp.x) < halfW && abs(ldp.y) < halfH) {
    float hh = heightAt(cp);
    float cci = hh * levels;
    float nearest = floor(cci + 0.5);
    float onLine = 1.0 - smoothstep(0.02, 0.12, abs(cci - nearest));
    float isIndex = 1.0 - step(0.5, mod(nearest, 5.0));
    if (onLine > 0.01 && isIndex > 0.5) {
      int n = int(nearest * 4.0 + 0.5);
      vec2 lu = vec2(
        (ldp.x + halfW) / (2.0 * halfW),
        (ldp.y + halfH) / (2.0 * halfH)
      );
      float cov = number2(lu, n);
      col = mix(col, vec3(0.78, 0.87, 1.0), cov * 0.9);
    }
  }

  // soft vignette
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  col *= 1.0 - 0.25 * dot(uv - 0.5, uv - 0.5) * 2.0;

  gl_FragColor = vec4(col, 1.0);
}
`;

const MAX_RIPPLES = 4;

/**
 * Full-screen WebGL canvas rendering a static blue topographic map. The field
 * is frozen until the cursor passes through it (which displaces the contour
 * lines); taps on buttons/links send ripples. Elevation labels are drawn on
 * every 5th contour using a small digit glyph atlas.
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
    const uGlyph = gl.getUniformLocation(prog, "u_glyph");

    // digit glyph atlas (0-9, one row)
    const atlas = document.createElement("canvas");
    atlas.width = 200;
    atlas.height = 20;
    const actx = atlas.getContext("2d");
    if (actx) {
      actx.fillStyle = "#ffffff";
      actx.font = "bold 16px 'Courier New', monospace";
      actx.textAlign = "center";
      actx.textBaseline = "middle";
      for (let i = 0; i < 10; i++) {
        actx.fillText(String(i), i * 20 + 10, 10);
      }
    }
    const glyphTex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, glyphTex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, atlas);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.uniform1i(uGlyph, 0);

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

    {
      const pt = toShaderPoint(canvas.clientWidth / 2, canvas.clientHeight / 2);
      targetX = mouseX = pt.x;
      targetY = mouseY = pt.y;
    }

    const start = performance.now();
    let raf = 0;
    const frame = (now: number) => {
      const t = (now - start) / 1000;

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
          rTime[i] = 1e6;
        }
      }

      gl.uniform1f(uTime, t);
      gl.uniform2f(uMouse, mouseX, mouseY);
      gl.uniform1f(uMouseStrength, strength);
      gl.uniform2fv(uRipples, rPos);
      gl.uniform1fv(uRippleT, rTime);

      gl.clearColor(0.04, 0.08, 0.15, 1);
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
      gl.deleteTexture(glyphTex);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} />;
}
