"use client";

import { useEffect, useRef } from "react";

const SIM_RESOLUTION = 128;
const DYE_RESOLUTION = 1024;
const DENSITY_DISSIPATION = 3.5;
const VELOCITY_DISSIPATION = 2.2;
const PRESSURE_ITERATIONS = 20;
const CURL = 14;
const SPLAT_RADIUS = 0.12;
const SPLAT_FORCE = 3000;
const COLOR_CHANGE_INTERVAL = 120;
const IDLE_TIMEOUT = 2200;
const IDLE_SPLAT_FORCE_SCALE = 0.35;
const IDLE_COLOR_CHANGE_INTERVAL = 2600;

const THEME_COLOR_VARS = ["--accent", "--teal", "--violet", "--amber", "--rose", "--emerald"];

const BASE_VERTEX_SHADER = `
  precision highp float;
  attribute vec2 aPosition;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform vec2 texelSize;
  void main () {
    vUv = aPosition * 0.5 + 0.5;
    vL = vUv - vec2(texelSize.x, 0.0);
    vR = vUv + vec2(texelSize.x, 0.0);
    vT = vUv + vec2(0.0, texelSize.y);
    vB = vUv - vec2(0.0, texelSize.y);
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const CLEAR_SHADER = `
  precision mediump float;
  precision mediump sampler2D;
  varying highp vec2 vUv;
  uniform sampler2D uTexture;
  uniform float value;
  void main () {
    gl_FragColor = value * texture2D(uTexture, vUv);
  }
`;

const DISPLAY_SHADER = `
  precision highp float;
  precision highp sampler2D;
  varying vec2 vUv;
  uniform sampler2D uTexture;
  void main () {
    vec3 c = texture2D(uTexture, vUv).rgb;
    float a = clamp(max(max(c.r, c.g), c.b), 0.0, 0.55);
    gl_FragColor = vec4(c, a);
  }
`;

const SPLAT_SHADER = `
  precision highp float;
  precision highp sampler2D;
  varying vec2 vUv;
  uniform sampler2D uTarget;
  uniform float aspectRatio;
  uniform vec3 color;
  uniform vec2 point;
  uniform float radius;
  void main () {
    vec2 p = vUv - point.xy;
    p.x *= aspectRatio;
    vec3 splat = exp(-dot(p, p) / radius) * color;
    vec3 base = texture2D(uTarget, vUv).xyz;
    gl_FragColor = vec4(base + splat, 1.0);
  }
`;

const ADVECTION_SHADER = `
  precision highp float;
  precision highp sampler2D;
  varying vec2 vUv;
  uniform sampler2D uVelocity;
  uniform sampler2D uSource;
  uniform vec2 texelSize;
  uniform float dt;
  uniform float dissipation;
  void main () {
    vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
    vec4 result = texture2D(uSource, coord);
    float decay = 1.0 + dissipation * dt;
    gl_FragColor = result / decay;
  }
`;

const DIVERGENCE_SHADER = `
  precision mediump float;
  precision mediump sampler2D;
  varying highp vec2 vUv;
  varying highp vec2 vL;
  varying highp vec2 vR;
  varying highp vec2 vT;
  varying highp vec2 vB;
  uniform sampler2D uVelocity;
  void main () {
    float L = texture2D(uVelocity, vL).x;
    float R = texture2D(uVelocity, vR).x;
    float T = texture2D(uVelocity, vT).y;
    float B = texture2D(uVelocity, vB).y;
    vec2 C = texture2D(uVelocity, vUv).xy;
    if (vL.x < 0.0) { L = -C.x; }
    if (vR.x > 1.0) { R = -C.x; }
    if (vT.y > 1.0) { T = -C.y; }
    if (vB.y < 0.0) { B = -C.y; }
    float div = 0.5 * (R - L + T - B);
    gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
  }
`;

const CURL_SHADER = `
  precision mediump float;
  precision mediump sampler2D;
  varying highp vec2 vUv;
  varying highp vec2 vL;
  varying highp vec2 vR;
  varying highp vec2 vT;
  varying highp vec2 vB;
  uniform sampler2D uVelocity;
  void main () {
    float L = texture2D(uVelocity, vL).y;
    float R = texture2D(uVelocity, vR).y;
    float T = texture2D(uVelocity, vT).x;
    float B = texture2D(uVelocity, vB).x;
    float vorticity = R - L - T + B;
    gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
  }
`;

const VORTICITY_SHADER = `
  precision highp float;
  precision highp sampler2D;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform sampler2D uVelocity;
  uniform sampler2D uCurl;
  uniform float curl;
  uniform float dt;
  void main () {
    float L = texture2D(uCurl, vL).x;
    float R = texture2D(uCurl, vR).x;
    float T = texture2D(uCurl, vT).x;
    float B = texture2D(uCurl, vB).x;
    float C = texture2D(uCurl, vUv).x;
    vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
    force /= length(force) + 0.0001;
    force *= curl * C;
    force.y *= -1.0;
    vec2 vel = texture2D(uVelocity, vUv).xy;
    vel += force * dt;
    vel = clamp(vel, -1000.0, 1000.0);
    gl_FragColor = vec4(vel, 0.0, 1.0);
  }
`;

const PRESSURE_SHADER = `
  precision mediump float;
  precision mediump sampler2D;
  varying highp vec2 vUv;
  varying highp vec2 vL;
  varying highp vec2 vR;
  varying highp vec2 vT;
  varying highp vec2 vB;
  uniform sampler2D uPressure;
  uniform sampler2D uDivergence;
  void main () {
    float L = texture2D(uPressure, vL).x;
    float R = texture2D(uPressure, vR).x;
    float T = texture2D(uPressure, vT).x;
    float B = texture2D(uPressure, vB).x;
    float divergence = texture2D(uDivergence, vUv).x;
    float pressure = (L + R + B + T - divergence) * 0.25;
    gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
  }
`;

const GRADIENT_SUBTRACT_SHADER = `
  precision mediump float;
  precision mediump sampler2D;
  varying highp vec2 vUv;
  varying highp vec2 vL;
  varying highp vec2 vR;
  varying highp vec2 vT;
  varying highp vec2 vB;
  uniform sampler2D uPressure;
  uniform sampler2D uVelocity;
  void main () {
    float L = texture2D(uPressure, vL).x;
    float R = texture2D(uPressure, vR).x;
    float T = texture2D(uPressure, vT).x;
    float B = texture2D(uPressure, vB).x;
    vec2 velocity = texture2D(uVelocity, vUv).xy;
    velocity.xy -= vec2(R - L, T - B);
    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`;

type GLContext = WebGLRenderingContext | WebGL2RenderingContext;

interface FBO {
  texture: WebGLTexture;
  fbo: WebGLFramebuffer;
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  attach: (id: number) => number;
}

interface DoubleFBO {
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  read: FBO;
  write: FBO;
  swap: () => void;
}

interface UniformProgram {
  program: WebGLProgram;
  uniforms: Record<string, WebGLUniformLocation | null>;
}

function hexToFloatRgb(hex: string): [number, number, number] {
  const clean = hex.trim().replace("#", "");
  if (clean.length !== 6) return [1, 1, 1];
  const bigint = parseInt(clean, 16);
  return [((bigint >> 16) & 255) / 255, ((bigint >> 8) & 255) / 255, (bigint & 255) / 255];
}

function getThemePalette(): [number, number, number][] {
  const styles = getComputedStyle(document.documentElement);
  return THEME_COLOR_VARS.map((name) => hexToFloatRgb(styles.getPropertyValue(name)));
}

export default function LiquidEther() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const contextAttributes = { alpha: true, antialias: false, depth: false, stencil: false, premultipliedAlpha: false };
    const gl2 = canvas.getContext("webgl2", contextAttributes) as WebGL2RenderingContext | null;
    const gl: GLContext | null = gl2 ?? (canvas.getContext("webgl", contextAttributes) as WebGLRenderingContext | null);
    if (!gl) return;

    const isWebGL2 = !!gl2;
    let halfFloatType: number;
    let supportLinear = false;

    if (isWebGL2) {
      gl.getExtension("EXT_color_buffer_float");
      supportLinear = !!gl.getExtension("OES_texture_float_linear");
      halfFloatType = (gl as WebGL2RenderingContext).HALF_FLOAT;
    } else {
      const halfFloat = gl.getExtension("OES_texture_half_float");
      supportLinear = !!gl.getExtension("OES_texture_half_float_linear");
      if (!halfFloat) return;
      halfFloatType = halfFloat.HALF_FLOAT_OES;
    }
    if (!halfFloatType) return;

    const filtering = supportLinear ? gl.LINEAR : gl.NEAREST;

    function getSupportedFormat(
      internalFormat: number,
      format: number
    ): { internalFormat: number; format: number } {
      if (!isWebGL2) return { internalFormat, format };
      const g = gl as WebGL2RenderingContext;
      const texture = gl!.createTexture();
      gl!.bindTexture(gl!.TEXTURE_2D, texture);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.NEAREST);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.NEAREST);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
      gl!.texImage2D(gl!.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, halfFloatType, null);
      const fb = gl!.createFramebuffer();
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, fb);
      gl!.framebufferTexture2D(gl!.FRAMEBUFFER, gl!.COLOR_ATTACHMENT0, gl!.TEXTURE_2D, texture, 0);
      const status = gl!.checkFramebufferStatus(gl!.FRAMEBUFFER);
      gl!.deleteTexture(texture);
      gl!.deleteFramebuffer(fb);
      if (status === gl!.FRAMEBUFFER_COMPLETE) return { internalFormat, format };
      return getSupportedFormat(g.R16F === internalFormat ? g.RGBA16F : g.RGBA16F, g.RGBA);
    }

    const g2 = gl as WebGL2RenderingContext;
    const rgbaFormat = isWebGL2 ? getSupportedFormat(g2.RGBA16F, gl.RGBA) : { internalFormat: gl.RGBA, format: gl.RGBA };
    const rgFormat = isWebGL2 ? getSupportedFormat(g2.RG16F, g2.RG) : { internalFormat: gl.RGBA, format: gl.RGBA };
    const rFormat = isWebGL2 ? getSupportedFormat(g2.R16F, g2.RED) : { internalFormat: gl.RGBA, format: gl.RGBA };

    function compileShader(type: number, source: string): WebGLShader | null {
      const shader = gl!.createShader(type);
      if (!shader) return null;
      gl!.shaderSource(shader, source);
      gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        gl!.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const baseVertexShader = compileShader(gl.VERTEX_SHADER, BASE_VERTEX_SHADER)!;
    function buildProgram(fragmentSource: string): UniformProgram {
      const fragmentShader = compileShader(gl!.FRAGMENT_SHADER, fragmentSource)!;
      const program = gl!.createProgram()!;
      gl!.attachShader(program, baseVertexShader);
      gl!.attachShader(program, fragmentShader);
      gl!.linkProgram(program);
      const uniforms: Record<string, WebGLUniformLocation | null> = {};
      const uniformCount = gl!.getProgramParameter(program, gl!.ACTIVE_UNIFORMS);
      for (let i = 0; i < uniformCount; i++) {
        const info = gl!.getActiveUniform(program, i);
        if (info) uniforms[info.name] = gl!.getUniformLocation(program, info.name);
      }
      return { program, uniforms };
    }

    const clearProgram = buildProgram(CLEAR_SHADER);
    const displayProgram = buildProgram(DISPLAY_SHADER);
    const splatProgram = buildProgram(SPLAT_SHADER);
    const advectionProgram = buildProgram(ADVECTION_SHADER);
    const divergenceProgram = buildProgram(DIVERGENCE_SHADER);
    const curlProgram = buildProgram(CURL_SHADER);
    const vorticityProgram = buildProgram(VORTICITY_SHADER);
    const pressureProgram = buildProgram(PRESSURE_SHADER);
    const gradientSubtractProgram = buildProgram(GRADIENT_SUBTRACT_SHADER);

    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
    const elementBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    function blit(target: FBO | null) {
      if (target == null) {
        gl!.viewport(0, 0, gl!.drawingBufferWidth, gl!.drawingBufferHeight);
        gl!.bindFramebuffer(gl!.FRAMEBUFFER, null);
      } else {
        gl!.viewport(0, 0, target.width, target.height);
        gl!.bindFramebuffer(gl!.FRAMEBUFFER, target.fbo);
      }
      gl!.drawElements(gl!.TRIANGLES, 6, gl!.UNSIGNED_SHORT, 0);
    }

    function createFBO(w: number, h: number, internalFormat: number, format: number, param: number): FBO {
      gl!.activeTexture(gl!.TEXTURE0);
      const texture = gl!.createTexture()!;
      gl!.bindTexture(gl!.TEXTURE_2D, texture);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, param);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, param);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
      gl!.texImage2D(gl!.TEXTURE_2D, 0, internalFormat, w, h, 0, format, halfFloatType, null);

      const fbo = gl!.createFramebuffer()!;
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, fbo);
      gl!.framebufferTexture2D(gl!.FRAMEBUFFER, gl!.COLOR_ATTACHMENT0, gl!.TEXTURE_2D, texture, 0);
      gl!.viewport(0, 0, w, h);
      gl!.clear(gl!.COLOR_BUFFER_BIT);

      return {
        texture,
        fbo,
        width: w,
        height: h,
        texelSizeX: 1 / w,
        texelSizeY: 1 / h,
        attach(id: number) {
          gl!.activeTexture(gl!.TEXTURE0 + id);
          gl!.bindTexture(gl!.TEXTURE_2D, texture);
          return id;
        },
      };
    }

    function createDoubleFBO(w: number, h: number, internalFormat: number, format: number, param: number): DoubleFBO {
      let fbo1 = createFBO(w, h, internalFormat, format, param);
      let fbo2 = createFBO(w, h, internalFormat, format, param);
      return {
        width: w,
        height: h,
        texelSizeX: fbo1.texelSizeX,
        texelSizeY: fbo1.texelSizeY,
        get read() {
          return fbo1;
        },
        get write() {
          return fbo2;
        },
        swap() {
          const temp = fbo1;
          fbo1 = fbo2;
          fbo2 = temp;
        },
      };
    }

    function getResolution(resolution: number) {
      const aspectRatio = gl!.drawingBufferWidth / gl!.drawingBufferHeight;
      const aspect = aspectRatio < 1 ? 1 / aspectRatio : aspectRatio;
      const min = Math.round(resolution);
      const max = Math.round(resolution * aspect);
      return gl!.drawingBufferWidth > gl!.drawingBufferHeight ? { width: max, height: min } : { width: min, height: max };
    }

    let dye: DoubleFBO;
    let velocity: DoubleFBO;
    let divergence: FBO;
    let curlFbo: FBO;
    let pressure: DoubleFBO;

    function initFramebuffers() {
      const simRes = getResolution(SIM_RESOLUTION);
      const dyeRes = getResolution(DYE_RESOLUTION);
      dye = createDoubleFBO(dyeRes.width, dyeRes.height, rgbaFormat.internalFormat, rgbaFormat.format, filtering);
      velocity = createDoubleFBO(simRes.width, simRes.height, rgFormat.internalFormat, rgFormat.format, filtering);
      divergence = createFBO(simRes.width, simRes.height, rFormat.internalFormat, rFormat.format, gl!.NEAREST);
      curlFbo = createFBO(simRes.width, simRes.height, rFormat.internalFormat, rFormat.format, gl!.NEAREST);
      pressure = createDoubleFBO(simRes.width, simRes.height, rFormat.internalFormat, rFormat.format, gl!.NEAREST);
    }

    function resizeCanvas() {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.round(canvas!.clientWidth * pixelRatio);
      const height = Math.round(canvas!.clientHeight * pixelRatio);
      if (canvas!.width !== width || canvas!.height !== height) {
        canvas!.width = width;
        canvas!.height = height;
        return true;
      }
      return false;
    }

    resizeCanvas();
    initFramebuffers();
    gl.disable(gl.BLEND);

    let palette = getThemePalette();
    const themeObserver = new MutationObserver(() => {
      palette = getThemePalette();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const pointer = { x: 0, y: 0, prevX: 0, prevY: 0, moved: false, color: palette[0] };
    let lastColorChangeTime = 0;
    let lastActivityTime = performance.now();

    const autopilot = { active: false, prevX: null as number | null, prevY: null as number | null, color: palette[0] };
    let lastIdleColorChangeTime = 0;

    function updatePointer(clientX: number, clientY: number) {
      const rect = canvas!.getBoundingClientRect();
      pointer.prevX = pointer.x;
      pointer.prevY = pointer.y;
      pointer.x = (clientX - rect.left) / rect.width;
      pointer.y = 1 - (clientY - rect.top) / rect.height;
      pointer.moved = true;
      lastActivityTime = performance.now();
      autopilot.active = false;
      autopilot.prevX = null;
      autopilot.prevY = null;
      const now = performance.now();
      if (now - lastColorChangeTime > COLOR_CHANGE_INTERVAL) {
        pointer.color = palette[Math.floor(Math.random() * palette.length)];
        lastColorChangeTime = now;
      }
    }

    function handlePointerMove(e: PointerEvent) {
      updatePointer(e.clientX, e.clientY);
    }
    function handleTouchMove(e: TouchEvent) {
      if (e.touches.length === 0) return;
      updatePointer(e.touches[0].clientX, e.touches[0].clientY);
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    function splat(x: number, y: number, dx: number, dy: number, color: [number, number, number]) {
      gl!.useProgram(splatProgram.program);
      velocity.read.attach(0);
      gl!.uniform1i(splatProgram.uniforms.uTarget, 0);
      gl!.uniform1f(splatProgram.uniforms.aspectRatio, canvas!.width / canvas!.height);
      gl!.uniform2f(splatProgram.uniforms.point, x, y);
      gl!.uniform3f(splatProgram.uniforms.color, dx, dy, 0);
      gl!.uniform1f(splatProgram.uniforms.radius, SPLAT_RADIUS / 100);
      blit(velocity.write);
      velocity.swap();

      dye.read.attach(0);
      gl!.uniform1i(splatProgram.uniforms.uTarget, 0);
      gl!.uniform3f(splatProgram.uniforms.color, color[0], color[1], color[2]);
      blit(dye.write);
      dye.swap();
    }

    let lastUpdateTime = performance.now();
    let rafId = 0;
    let paused = false;

    function onVisibilityChange() {
      paused = document.hidden;
      if (!paused) lastUpdateTime = performance.now();
    }
    document.addEventListener("visibilitychange", onVisibilityChange);

    function update() {
      rafId = requestAnimationFrame(update);
      if (paused) return;

      const now = performance.now();
      const dt = Math.min((now - lastUpdateTime) / 1000, 1 / 30);
      lastUpdateTime = now;

      if (resizeCanvas()) initFramebuffers();

      if (pointer.moved) {
        const dx = (pointer.x - pointer.prevX) * SPLAT_FORCE;
        const dy = (pointer.y - pointer.prevY) * SPLAT_FORCE;
        if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
          splat(pointer.x, pointer.y, dx, dy, pointer.color);
        }
        pointer.moved = false;
      } else if (now - lastActivityTime > IDLE_TIMEOUT) {
        autopilot.active = true;
        const t = now * 0.00015;
        const ax = 0.5 + Math.sin(t * 1.3) * 0.28;
        const ay = 0.5 + Math.cos(t * 0.9) * 0.22;
        if (now - lastIdleColorChangeTime > IDLE_COLOR_CHANGE_INTERVAL) {
          autopilot.color = palette[Math.floor(Math.random() * palette.length)];
          lastIdleColorChangeTime = now;
        }
        if (autopilot.prevX !== null && autopilot.prevY !== null) {
          const dx = (ax - autopilot.prevX) * SPLAT_FORCE * IDLE_SPLAT_FORCE_SCALE;
          const dy = (ay - autopilot.prevY) * SPLAT_FORCE * IDLE_SPLAT_FORCE_SCALE;
          splat(ax, ay, dx, dy, autopilot.color);
        }
        autopilot.prevX = ax;
        autopilot.prevY = ay;
      }

      gl!.viewport(0, 0, velocity.width, velocity.height);

      gl!.useProgram(curlProgram.program);
      gl!.uniform2f(curlProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      velocity.read.attach(0);
      gl!.uniform1i(curlProgram.uniforms.uVelocity, 0);
      blit(curlFbo);

      gl!.useProgram(vorticityProgram.program);
      gl!.uniform2f(vorticityProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      velocity.read.attach(0);
      gl!.uniform1i(vorticityProgram.uniforms.uVelocity, 0);
      curlFbo.attach(1);
      gl!.uniform1i(vorticityProgram.uniforms.uCurl, 1);
      gl!.uniform1f(vorticityProgram.uniforms.curl, CURL);
      gl!.uniform1f(vorticityProgram.uniforms.dt, dt);
      blit(velocity.write);
      velocity.swap();

      gl!.useProgram(divergenceProgram.program);
      gl!.uniform2f(divergenceProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      velocity.read.attach(0);
      gl!.uniform1i(divergenceProgram.uniforms.uVelocity, 0);
      blit(divergence);

      gl!.useProgram(clearProgram.program);
      pressure.read.attach(0);
      gl!.uniform1i(clearProgram.uniforms.uTexture, 0);
      gl!.uniform1f(clearProgram.uniforms.value, 0.8);
      blit(pressure.write);
      pressure.swap();

      gl!.useProgram(pressureProgram.program);
      gl!.uniform2f(pressureProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      divergence.attach(0);
      gl!.uniform1i(pressureProgram.uniforms.uDivergence, 0);
      for (let i = 0; i < PRESSURE_ITERATIONS; i++) {
        pressure.read.attach(1);
        gl!.uniform1i(pressureProgram.uniforms.uPressure, 1);
        blit(pressure.write);
        pressure.swap();
      }

      gl!.useProgram(gradientSubtractProgram.program);
      gl!.uniform2f(gradientSubtractProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      pressure.read.attach(0);
      gl!.uniform1i(gradientSubtractProgram.uniforms.uPressure, 0);
      velocity.read.attach(1);
      gl!.uniform1i(gradientSubtractProgram.uniforms.uVelocity, 1);
      blit(velocity.write);
      velocity.swap();

      gl!.useProgram(advectionProgram.program);
      gl!.uniform2f(advectionProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      velocity.read.attach(0);
      gl!.uniform1i(advectionProgram.uniforms.uVelocity, 0);
      gl!.uniform1i(advectionProgram.uniforms.uSource, 0);
      gl!.uniform1f(advectionProgram.uniforms.dt, dt);
      gl!.uniform1f(advectionProgram.uniforms.dissipation, VELOCITY_DISSIPATION);
      blit(velocity.write);
      velocity.swap();

      gl!.viewport(0, 0, dye.width, dye.height);
      gl!.useProgram(advectionProgram.program);
      velocity.read.attach(0);
      gl!.uniform1i(advectionProgram.uniforms.uVelocity, 0);
      dye.read.attach(1);
      gl!.uniform1i(advectionProgram.uniforms.uSource, 1);
      gl!.uniform1f(advectionProgram.uniforms.dissipation, DENSITY_DISSIPATION);
      blit(dye.write);
      dye.swap();

      gl!.viewport(0, 0, gl!.drawingBufferWidth, gl!.drawingBufferHeight);
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, null);
      gl!.clearColor(0, 0, 0, 0);
      gl!.clear(gl!.COLOR_BUFFER_BIT);
      gl!.useProgram(displayProgram.program);
      dye.read.attach(0);
      gl!.uniform1i(displayProgram.uniforms.uTexture, 0);
      gl!.enable(gl!.BLEND);
      gl!.blendFunc(gl!.SRC_ALPHA, gl!.ONE_MINUS_SRC_ALPHA);
      blit(null);
      gl!.disable(gl!.BLEND);
    }

    rafId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      themeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 h-full w-full opacity-60"
    />
  );
}
