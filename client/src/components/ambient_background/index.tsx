import { useEffect, useRef } from 'react';

import './index.less';

type AmbientTheme = 'light' | 'dark';

type GlowSpec = {
  x: number;
  y: number;
  radius: number;
  color: number;
  alpha: number;
  speed: number;
  drift: number;
  phase: number;
};

type AmbientBackgroundProps = {
  themeMode: AmbientTheme;
};

type AmbientVariant = 'orbs' | 'aurora' | 'nebula';

type AmbientPreset = {
  variant: AmbientVariant;
  light: GlowSpec[];
  dark: GlowSpec[];
};

const ambientPresets: AmbientPreset[] = [
  {
    variant: 'orbs',
    light: [
      { x: 0.14, y: 0.14, radius: 420, color: 0x9aa0ff, alpha: 0.26, speed: 0.22, drift: 0.055, phase: 0.2 },
      { x: 0.82, y: 0.16, radius: 360, color: 0x80ddff, alpha: 0.2, speed: 0.17, drift: 0.05, phase: 1.8 },
      { x: 0.7, y: 0.78, radius: 520, color: 0xffc5e1, alpha: 0.16, speed: 0.13, drift: 0.045, phase: 3.1 },
      { x: 0.24, y: 0.86, radius: 460, color: 0xc4f0d0, alpha: 0.14, speed: 0.15, drift: 0.04, phase: 4.2 },
      { x: 0.5, y: 0.42, radius: 340, color: 0xffe6a6, alpha: 0.1, speed: 0.1, drift: 0.03, phase: 5.7 },
    ],
    dark: [
      { x: 0.16, y: 0.12, radius: 500, color: 0x4c56ff, alpha: 0.32, speed: 0.2, drift: 0.055, phase: 0.6 },
      { x: 0.84, y: 0.22, radius: 430, color: 0x1fd1ff, alpha: 0.2, speed: 0.16, drift: 0.045, phase: 2.0 },
      { x: 0.7, y: 0.86, radius: 560, color: 0x8f5cff, alpha: 0.22, speed: 0.13, drift: 0.05, phase: 3.5 },
      { x: 0.26, y: 0.78, radius: 520, color: 0x0dffa8, alpha: 0.1, speed: 0.12, drift: 0.038, phase: 5.0 },
      { x: 0.52, y: 0.44, radius: 360, color: 0xff8bd1, alpha: 0.11, speed: 0.1, drift: 0.032, phase: 5.8 },
    ],
  },
  {
    variant: 'aurora',
    light: [
      { x: 0.18, y: 0.28, radius: 460, color: 0xa6f4ff, alpha: 0.19, speed: 0.12, drift: 0.05, phase: 0.4 },
      { x: 0.42, y: 0.34, radius: 520, color: 0xc6b7ff, alpha: 0.2, speed: 0.1, drift: 0.055, phase: 1.5 },
      { x: 0.72, y: 0.4, radius: 480, color: 0xffc7e8, alpha: 0.14, speed: 0.09, drift: 0.045, phase: 2.9 },
      { x: 0.42, y: 0.82, radius: 620, color: 0xe5f2ff, alpha: 0.12, speed: 0.08, drift: 0.03, phase: 4.1 },
    ],
    dark: [
      { x: 0.18, y: 0.26, radius: 560, color: 0x29f0ff, alpha: 0.18, speed: 0.11, drift: 0.05, phase: 0.8 },
      { x: 0.46, y: 0.32, radius: 640, color: 0x665bff, alpha: 0.28, speed: 0.1, drift: 0.055, phase: 1.7 },
      { x: 0.74, y: 0.42, radius: 600, color: 0xd266ff, alpha: 0.18, speed: 0.09, drift: 0.045, phase: 2.8 },
      { x: 0.36, y: 0.84, radius: 680, color: 0x0edca4, alpha: 0.1, speed: 0.08, drift: 0.03, phase: 4.3 },
    ],
  },
  {
    variant: 'nebula',
    light: [
      { x: 0.24, y: 0.22, radius: 520, color: 0xd9c6ff, alpha: 0.22, speed: 0.12, drift: 0.045, phase: 0.5 },
      { x: 0.68, y: 0.18, radius: 440, color: 0xb9f5ff, alpha: 0.16, speed: 0.1, drift: 0.04, phase: 1.7 },
      { x: 0.78, y: 0.74, radius: 620, color: 0xffd1c2, alpha: 0.16, speed: 0.08, drift: 0.04, phase: 3.0 },
      { x: 0.28, y: 0.78, radius: 560, color: 0xdfffd6, alpha: 0.12, speed: 0.09, drift: 0.035, phase: 4.8 },
      { x: 0.5, y: 0.5, radius: 380, color: 0xffffff, alpha: 0.08, speed: 0.06, drift: 0.02, phase: 5.8 },
    ],
    dark: [
      { x: 0.24, y: 0.2, radius: 620, color: 0x6e66ff, alpha: 0.28, speed: 0.12, drift: 0.045, phase: 0.5 },
      { x: 0.7, y: 0.18, radius: 520, color: 0x20d6ff, alpha: 0.16, speed: 0.1, drift: 0.04, phase: 1.7 },
      { x: 0.78, y: 0.76, radius: 700, color: 0xff6fb6, alpha: 0.18, speed: 0.08, drift: 0.04, phase: 3.0 },
      { x: 0.28, y: 0.78, radius: 620, color: 0x25ffa8, alpha: 0.1, speed: 0.09, drift: 0.035, phase: 4.8 },
      { x: 0.52, y: 0.5, radius: 420, color: 0xffffff, alpha: 0.06, speed: 0.06, drift: 0.02, phase: 5.8 },
    ],
  },
];

const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount;

const mixColor = (from: number, to: number, amount: number) => {
  const fr = (from >> 16) & 255;
  const fg = (from >> 8) & 255;
  const fb = from & 255;
  const tr = (to >> 16) & 255;
  const tg = (to >> 8) & 255;
  const tb = to & 255;

  return (
    (Math.round(lerp(fr, tr, amount)) << 16) |
    (Math.round(lerp(fg, tg, amount)) << 8) |
    Math.round(lerp(fb, tb, amount))
  );
};

const getPalette = (preset: AmbientPreset, themeMode: AmbientTheme) => (themeMode === 'dark' ? preset.dark : preset.light);

export const AmbientBackground = ({ themeMode }: AmbientBackgroundProps) => {
  const pixiCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fallbackCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const presetRef = useRef<AmbientPreset>(ambientPresets[Math.floor(Math.random() * ambientPresets.length)]);
  const themeRef = useRef(themeMode);

  useEffect(() => {
    themeRef.current = themeMode;
  }, [themeMode]);

  useEffect(() => {
    let disposed = false;
    let pixiApp: any;
    const spriteList: any[] = [];
    const preset = presetRef.current;
    const pixiGlows = getPalette(preset, themeRef.current).map((item) => ({ ...item }));
    const canvasGlows = getPalette(preset, themeRef.current).map((item) => ({ ...item }));
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const toRgb = (color: number) => ({
      red: (color >> 16) & 255,
      green: (color >> 8) & 255,
      blue: color & 255,
    });

    const getAnimatedGlow = (glow: GlowSpec, time: number, width: number, height: number) => {
      const offsetX = Math.sin(time * glow.speed + glow.phase) * glow.drift;
      const offsetY = Math.cos(time * glow.speed * 0.82 + glow.phase) * glow.drift;
      const radius = glow.radius * (0.94 + Math.sin(time * 0.2 + glow.phase) * 0.06);

      return {
        x: (glow.x + offsetX) * width,
        y: (glow.y + offsetY) * height,
        radius,
      };
    };

    const createGlowTexture = (PIXI: any, color: number) => {
      const size = 512;
      const textureCanvas = document.createElement('canvas');
      textureCanvas.width = size;
      textureCanvas.height = size;
      const context = textureCanvas.getContext('2d');

      if (!context) {
        return PIXI.Texture.WHITE;
      }

      const { red, green, blue } = toRgb(color);
      const gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      gradient.addColorStop(0, `rgba(${red}, ${green}, ${blue}, 0.95)`);
      gradient.addColorStop(0.38, `rgba(${red}, ${green}, ${blue}, 0.42)`);
      gradient.addColorStop(1, `rgba(${red}, ${green}, ${blue}, 0)`);
      context.fillStyle = gradient;
      context.fillRect(0, 0, size, size);

      return PIXI.Texture.from(textureCanvas);
    };

    const drawGlow = (sprite: any, glow: GlowSpec, time: number, width: number, height: number) => {
      const animatedGlow = getAnimatedGlow(glow, time, width, height);

      sprite.x = animatedGlow.x;
      sprite.y = animatedGlow.y;
      sprite.width = animatedGlow.radius * 2;
      sprite.height = animatedGlow.radius * 2;
      sprite.alpha = glow.alpha;
    };

    const drawFallbackFrame = (time: number) => {
      const canvas = fallbackCanvasRef.current;
      if (!canvas) {
        return;
      }

      const context = canvas.getContext('2d');
      if (!context) {
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const resolution = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(rect.width * resolution));
      const height = Math.max(1, Math.round(rect.height * resolution));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      const targetGlows = getPalette(preset, themeRef.current);
      const transitionSpeed = reduceMotion ? 0.02 : 0.055;

      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = 'source-over';

      if (preset.variant === 'aurora') {
        const baseGradient = context.createLinearGradient(0, 0, width, height);
        baseGradient.addColorStop(0, themeRef.current === 'dark' ? 'rgba(54, 68, 160, 0.1)' : 'rgba(255, 255, 255, 0.12)');
        baseGradient.addColorStop(1, themeRef.current === 'dark' ? 'rgba(9, 14, 31, 0.03)' : 'rgba(190, 226, 255, 0.08)');
        context.fillStyle = baseGradient;
        context.fillRect(0, 0, width, height);
      }

      canvasGlows.forEach((glow, index) => {
        const target = targetGlows[index];
        glow.x = lerp(glow.x, target.x, transitionSpeed);
        glow.y = lerp(glow.y, target.y, transitionSpeed);
        glow.radius = lerp(glow.radius, target.radius, transitionSpeed);
        glow.alpha = lerp(glow.alpha, target.alpha * 1.8, transitionSpeed);
        glow.color = mixColor(glow.color, target.color, transitionSpeed);

        const animatedGlow = getAnimatedGlow(glow, time, width, height);
        const { red, green, blue } = toRgb(glow.color);
        const gradient = context.createRadialGradient(
          animatedGlow.x,
          animatedGlow.y,
          0,
          animatedGlow.x,
          animatedGlow.y,
          animatedGlow.radius,
        );

        gradient.addColorStop(0, `rgba(${red}, ${green}, ${blue}, ${Math.min(glow.alpha, 0.72)})`);
        gradient.addColorStop(0.42, `rgba(${red}, ${green}, ${blue}, ${Math.min(glow.alpha * 0.5, 0.42)})`);
        gradient.addColorStop(1, `rgba(${red}, ${green}, ${blue}, 0)`);

        context.fillStyle = gradient;
        context.fillRect(0, 0, width, height);
      });

      if (preset.variant === 'aurora') {
        context.globalCompositeOperation = 'screen';
        canvasGlows.slice(0, 3).forEach((glow, index) => {
          const { red, green, blue } = toRgb(glow.color);
          const yBase = height * (0.24 + index * 0.12);
          const amplitude = height * (0.035 + index * 0.012);
          const ribbonGradient = context.createLinearGradient(0, yBase - amplitude * 3, 0, yBase + amplitude * 3);
          ribbonGradient.addColorStop(0, `rgba(${red}, ${green}, ${blue}, 0)`);
          ribbonGradient.addColorStop(0.48, `rgba(${red}, ${green}, ${blue}, ${themeRef.current === 'dark' ? 0.13 : 0.08})`);
          ribbonGradient.addColorStop(1, `rgba(${red}, ${green}, ${blue}, 0)`);

          context.beginPath();
          context.moveTo(-width * 0.08, yBase);
          for (let step = 0; step <= 8; step += 1) {
            const x = (step / 8) * width * 1.16 - width * 0.08;
            const y = yBase + Math.sin(time * (0.32 + index * 0.05) + step * 0.82 + glow.phase) * amplitude;
            context.lineTo(x, y);
          }
          for (let step = 8; step >= 0; step -= 1) {
            const x = (step / 8) * width * 1.16 - width * 0.08;
            const y = yBase + amplitude * 3.2 + Math.sin(time * (0.26 + index * 0.04) + step * 0.76 + glow.phase) * amplitude;
            context.lineTo(x, y);
          }
          context.closePath();
          context.fillStyle = ribbonGradient;
          context.fill();
        });
      }

      if (preset.variant === 'nebula') {
        context.globalCompositeOperation = 'screen';
        for (let index = 0; index < 18; index += 1) {
          const angle = index * 2.399 + time * 0.02;
          const distance = (0.12 + (index % 6) * 0.065) * Math.min(width, height);
          const x = width * 0.5 + Math.cos(angle) * distance;
          const y = height * 0.48 + Math.sin(angle * 1.21) * distance * 0.72;
          const size = Math.max(width, height) * (0.002 + (index % 3) * 0.0012);
          context.fillStyle = themeRef.current === 'dark' ? 'rgba(226, 236, 255, 0.1)' : 'rgba(255, 255, 255, 0.18)';
          context.beginPath();
          context.arc(x, y, size, 0, Math.PI * 2);
          context.fill();
        }
      }
    };

    let animationId = 0;
    let fallbackStartTime = performance.now();
    const renderFallback = () => {
      if (disposed) {
        return;
      }

      const elapsed = (performance.now() - fallbackStartTime) / 1000;
      drawFallbackFrame(reduceMotion ? 0.1 : elapsed);
      animationId = window.requestAnimationFrame(renderFallback);
    };

    renderFallback();

    const boot = async () => {
      const canvas = pixiCanvasRef.current;
      if (!canvas) {
        return;
      }

      try {
        const PIXI = await import('pixi.js');
        if (disposed || !pixiCanvasRef.current) {
          return;
        }

        pixiApp = new PIXI.Application();
        await pixiApp.init({
          canvas,
          resizeTo: window,
          backgroundAlpha: 0,
          antialias: true,
          autoDensity: true,
          resolution: Math.min(window.devicePixelRatio || 1, 2),
          preference: ['webgl', 'canvas'],
          powerPreference: 'low-power',
        });

        if (disposed) {
          pixiApp.destroy(false);
          return;
        }

        canvas.dataset.pixiReady = 'true';

        const layer = new PIXI.Container();
        pixiApp.stage.addChild(layer);

        pixiGlows.forEach((glow) => {
          const sprite = new PIXI.Sprite(createGlowTexture(PIXI, glow.color));
          sprite.anchor.set(0.5);
          sprite.blendMode = 'add';
          layer.addChild(sprite);
          spriteList.push(sprite);
        });

        let time = 0;
        pixiApp.ticker.add((ticker: any) => {
          const targetGlows = getPalette(preset, themeRef.current);
          const transitionSpeed = Math.min(0.08 * ticker.deltaTime, 0.22);
          time += reduceMotion ? 0.001 : ticker.deltaMS / 1000;

          pixiGlows.forEach((glow, index) => {
            const target = targetGlows[index];
            glow.x = lerp(glow.x, target.x, transitionSpeed);
            glow.y = lerp(glow.y, target.y, transitionSpeed);
            glow.radius = lerp(glow.radius, target.radius, transitionSpeed);
            glow.alpha = lerp(glow.alpha, target.alpha, transitionSpeed);
            const nextColor = mixColor(glow.color, target.color, transitionSpeed);
            if (nextColor !== glow.color) {
              glow.color = nextColor;
              spriteList[index].texture = createGlowTexture(PIXI, glow.color);
            }
            drawGlow(spriteList[index], glow, time, pixiApp.renderer.width, pixiApp.renderer.height);
          });
        });
      } catch (error) {
        canvas.dataset.pixiReady = 'false';
        console.error('Ambient Pixi background failed to initialize', error);
        return;
      }
    };

    boot();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(animationId);
      if (pixiApp) {
        pixiApp.destroy(false);
      }
    };
  }, []);

  return (
    <div className="ambient-background" aria-hidden="true">
      <canvas className="ambient-background-canvas ambient-background-pixi-canvas" ref={pixiCanvasRef} data-pixi-ready="pending" />
      <canvas className="ambient-background-canvas ambient-background-fallback-canvas" ref={fallbackCanvasRef} />
    </div>
  );
};
