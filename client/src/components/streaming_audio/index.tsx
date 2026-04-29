import { Button, Modal } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';

type Props = {
  open?: boolean;
  src?: string;
  data?: AudioSourceItem[];
  index?: number;
  onClose?: () => void;
};

type AudioSourceItem = string | { src: string; title?: string };

const getSourceValue = (item?: AudioSourceItem) => (typeof item === 'string' ? item : item?.src || '');
const getSourceTitle = (item: AudioSourceItem | undefined, index: number) => {
  if (!item) {
    return `音频 ${index + 1}`;
  }
  return typeof item === 'string' ? `音频 ${index + 1}` : item.title || `音频 ${index + 1}`;
};

const formatTime = (value: number) => {
  if (!Number.isFinite(value)) {
    return '00:00';
  }
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const clampIndex = (nextIndex: number, length: number) => Math.min(Math.max(nextIndex, 0), Math.max(length - 1, 0));

export const StreamingAudio = ({ open = false, src, data = [], index = 0, onClose }: Props) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const visualizerRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const audioGraphPromiseRef = useRef<Promise<void> | null>(null);
  const autoplayRef = useRef(false);
  const [currentIndex, setCurrentIndex] = useState(index);
  const [minimized, setMinimized] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.86);
  const sourceList = useMemo(() => (data.length ? data : src ? [{ src, title: '音频预览' }] : []), [data, src]);
  const currentSource = getSourceValue(sourceList[currentIndex]);
  const currentTitle = getSourceTitle(sourceList[currentIndex], currentIndex);

  useEffect(() => {
    if (!open) {
      setMinimized(false);
      audioRef.current?.pause();
      setIsPlaying(false);
    }
  }, [open]);

  useEffect(() => () => {
    audioContextRef.current?.close().catch(() => undefined);
  }, []);

  useEffect(() => {
    setCurrentIndex(index);
  }, [index, open]);

  useEffect(() => {
    if (!open || !currentSource) {
      return;
    }
    autoplayRef.current = true;
    setCurrentTime(0);
    setDuration(0);
  }, [currentSource, open]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    let disposed = false;
    let pixiApp: any;
    let bars: any[] = [];
    let ambience: any;

    const boot = async () => {
      const container = visualizerRef.current;
      if (!open || minimized || !container) {
        return;
      }

      const PIXI = await import('pixi.js');
      if (disposed || !visualizerRef.current) {
        return;
      }

      pixiApp = new PIXI.Application();
      await pixiApp.init({
        resizeTo: container,
        backgroundAlpha: 0,
        antialias: true,
        autoDensity: true,
        resolution: Math.min(window.devicePixelRatio || 1, 2),
      });

      if (disposed || !visualizerRef.current) {
        pixiApp.destroy(false);
        return;
      }

      container.appendChild(pixiApp.canvas);
      ambience = new PIXI.Graphics();
      pixiApp.stage.addChild(ambience);
      const layer = new PIXI.Container();
      pixiApp.stage.addChild(layer);

      const barCount = 52;
      bars = Array.from({ length: barCount }, () => {
        const graphic = new PIXI.Graphics();
        layer.addChild(graphic);
        return graphic;
      });

      pixiApp.ticker.add(() => {
        const width = pixiApp.screen.width;
        const height = pixiApp.screen.height;
        const analyser = analyserRef.current;
        const values = new Uint8Array(analyser?.frequencyBinCount || 64);
        if (analyser) {
          analyser.getByteFrequencyData(values);
        }

        const time = performance.now() * 0.001;
        const centerY = height * 0.43;

        ambience.clear();
        ambience.rect(0, 0, width, height);
        ambience.fill({ color: 0xffffff, alpha: 0.025 });
        ambience.roundRect(width * 0.08, centerY - 1, width * 0.84, 2, 2);
        ambience.fill({ color: 0xdbeafe, alpha: 0.22 });
        ambience.roundRect(width * 0.18, height * 0.18, width * 0.64, 1, 1);
        ambience.fill({ color: 0xffffff, alpha: 0.08 + Math.sin(time * 1.3) * 0.025 });

        const getBandLevel = (barIndex: number) => {
          if (!analyser) {
            return 0;
          }
          const bandStart = barIndex / bars.length;
          const bandEnd = (barIndex + 1) / bars.length;
          const curve = 2.35;
          const startIndex = Math.floor(Math.pow(bandStart, curve) * (values.length - 1));
          const endIndex = Math.max(startIndex + 1, Math.ceil(Math.pow(bandEnd, curve) * values.length));
          let total = 0;
          let weightTotal = 0;

          for (let index = startIndex; index <= Math.min(endIndex, values.length - 1); index += 1) {
            const distance = Math.abs(index - (startIndex + endIndex) / 2);
            const weight = 1 / (1 + distance);
            total += values[index] * weight;
            weightTotal += weight;
          }

          const normalized = weightTotal ? total / weightTotal / 255 : 0;
          const highFrequencyLift = 1 + bandStart * 0.72;
          return Math.min(1, normalized * highFrequencyLift);
        };

        bars.forEach((bar, barIndex) => {
          const rawLevel = getBandLevel(barIndex);
          const idle = 0.16 + Math.sin(time * 1.8 + barIndex * 0.38) * 0.05;
          const bandPhase = barIndex / Math.max(1, bars.length - 1);
          const glassFloor =
            0.045 +
            bandPhase * 0.026 +
            Math.sin(time * 2.1 + barIndex * 0.73) * 0.012 +
            Math.sin(time * 0.9 + barIndex * 1.17) * 0.008;
          const level = analyser ? Math.max(Math.max(0.035, glassFloor), rawLevel) : idle;
          const easedLevel = Math.pow(level, 0.72);
          const slotWidth = width / bars.length;
          const barWidth = Math.max(3, Math.min(8, slotWidth * 0.42));
          const x = barIndex * slotWidth + (slotWidth - barWidth) / 2;
          const maxHeight = height * 0.34;
          const upperHeight = Math.max(8, easedLevel * maxHeight);
          const lowerHeight = Math.max(4, upperHeight * 0.42);
          const radius = barWidth / 2;
          const palettePhase = barIndex / Math.max(1, bars.length - 1);
          const color =
            palettePhase < 0.34 ? 0xbfd7ff : palettePhase < 0.68 ? 0xd4fbff : 0xf5d7ff;
          const pulse = 0.52 + easedLevel * 0.44;

          bar.clear();
          bar.roundRect(x - barWidth * 0.52, centerY - upperHeight - 2, barWidth * 2.04, upperHeight + lowerHeight + 4, radius * 1.8);
          bar.fill({ color, alpha: 0.045 + easedLevel * 0.08 });
          bar.roundRect(x, centerY - upperHeight, barWidth, upperHeight, radius);
          bar.fill({ color, alpha: 0.34 * pulse });
          bar.roundRect(x + barWidth * 0.18, centerY - upperHeight + 4, Math.max(1.2, barWidth * 0.22), Math.max(5, upperHeight - 8), radius);
          bar.fill({ color: 0xffffff, alpha: 0.18 + easedLevel * 0.16 });
          bar.roundRect(x, centerY + 4, barWidth, lowerHeight, radius);
          bar.fill({ color, alpha: 0.09 + easedLevel * 0.11 });
          bar.roundRect(x + barWidth * 0.2, centerY + 6, Math.max(1, barWidth * 0.18), Math.max(2, lowerHeight - 4), radius);
          bar.fill({ color: 0xffffff, alpha: 0.08 });
        });
      });
    };

    boot();

    return () => {
      disposed = true;
      if (pixiApp) {
        pixiApp.destroy(true);
      }
    };
  }, [minimized, open]);

  const ensureAudioGraph = async () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    if (!audioGraphPromiseRef.current) {
      audioGraphPromiseRef.current = (async () => {
        if (!audioContextRef.current) {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          const context = new AudioContextClass();
          const analyser = context.createAnalyser();
          analyser.fftSize = 128;
          analyser.smoothingTimeConstant = 0.82;
          const sourceNode = context.createMediaElementSource(audio);
          sourceNode.connect(analyser);
          analyser.connect(context.destination);
          audioContextRef.current = context;
          analyserRef.current = analyser;
          sourceNodeRef.current = sourceNode;
        }
      })().catch((error) => {
        audioGraphPromiseRef.current = null;
        throw error;
      });
    }
    await audioGraphPromiseRef.current;
    const context = audioContextRef.current;
    if (context?.state === 'suspended') {
      await context.resume();
    }
  };

  const playCurrentAudio = async () => {
    const audio = audioRef.current;
    if (!audio || !currentSource) {
      return;
    }
    await ensureAudioGraph();
    await audio.play();
    setIsPlaying(true);
  };

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio || !currentSource) {
      return;
    }
    if (audio.paused) {
      await playCurrentAudio();
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const switchAudio = (nextIndex: number) => {
    const safeIndex = clampIndex(nextIndex, sourceList.length);
    setCurrentIndex(safeIndex);
    setCurrentTime(0);
    setDuration(0);
  };

  const closePreview = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
    setMinimized(false);
    onClose?.();
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={currentSource}
        crossOrigin="anonymous"
        autoPlay
        preload="metadata"
        onCanPlay={() => {
          if (!autoplayRef.current) {
            return;
          }
          autoplayRef.current = false;
          playCurrentAudio().catch(() => {
            setIsPlaying(false);
          });
        }}
        onLoadedMetadata={(event) => {
          const nextDuration = event.currentTarget.duration;
          setDuration(Number.isFinite(nextDuration) ? nextDuration : 0);
        }}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime || 0)}
        onPlay={() => {
          ensureAudioGraph().catch(() => undefined);
          setIsPlaying(true);
        }}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          if (currentIndex < sourceList.length - 1) {
            switchAudio(currentIndex + 1);
          } else {
            setIsPlaying(false);
          }
        }}
      />
      <Modal
        open={open && !minimized}
        width={820}
        title={
          <div className="media-preview-titlebar">
            <span>音频预览</span>
            <Button size="small" onClick={() => setMinimized(true)}>最小化</Button>
          </div>
        }
        footer={null}
        onCancel={closePreview}
        maskClosable={false}
      >
        {currentSource ? (
          <div className="streaming-audio-layout">
            <div className="streaming-audio-main">
              <section className="streaming-audio-hero">
                <div className="streaming-audio-visualizer" ref={visualizerRef} />
                <div className="streaming-audio-now">
                  <div className="streaming-audio-label">{isPlaying ? '正在播放' : '准备播放'}</div>
                  <TypographyTitle title={currentTitle} />
                  <div className="streaming-audio-subtitle">
                    {sourceList.length > 1 ? `${currentIndex + 1} / ${sourceList.length}` : '单曲预览'}
                  </div>
                </div>
              </section>
              <div className="streaming-audio-control-panel">
                <div className="streaming-audio-time">
                  <span>{formatTime(currentTime)}</span>
                  <input
                    type="range"
                    min={0}
                    max={duration || 0}
                    step={0.1}
                    value={Math.min(currentTime, duration || 0)}
                    onChange={(event) => {
                      const nextTime = Number(event.target.value);
                      if (audioRef.current) {
                        audioRef.current.currentTime = nextTime;
                      }
                      setCurrentTime(nextTime);
                    }}
                  />
                  <span>{formatTime(duration)}</span>
                </div>
                <div className="streaming-audio-buttons">
                  <Button shape="round" disabled={currentIndex <= 0} onClick={() => switchAudio(currentIndex - 1)}>上一首</Button>
                  <Button className="streaming-audio-play-button" type="primary" shape="round" onClick={togglePlay}>
                    {isPlaying ? '暂停' : '播放'}
                  </Button>
                  <Button shape="round" disabled={currentIndex >= sourceList.length - 1} onClick={() => switchAudio(currentIndex + 1)}>下一首</Button>
                  <label className="streaming-audio-volume">
                    音量
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={volume}
                      onChange={(event) => setVolume(Number(event.target.value))}
                    />
                  </label>
                </div>
              </div>
            </div>
            {sourceList.length > 1 && (
              <aside className="streaming-audio-playlist">
                <div className="streaming-video-playlist-title">同目录音频</div>
                <div className="streaming-video-playlist-scroll">
                  {sourceList.map((item, itemIndex) => (
                    <button
                      key={`${getSourceValue(item)}-${itemIndex}`}
                      type="button"
                      className={`streaming-audio-playlist-item${itemIndex === currentIndex ? ' is-active' : ''}`}
                      onClick={() => switchAudio(itemIndex)}
                    >
                      <span className="streaming-audio-playlist-index">{itemIndex + 1}</span>
                      <span className="streaming-video-playlist-name">{getSourceTitle(item, itemIndex)}</span>
                    </button>
                  ))}
                </div>
              </aside>
            )}
          </div>
        ) : (
          <div>暂无音频</div>
        )}
      </Modal>
      {open && minimized && (
        <div className="media-preview-mini">
          <div className="media-preview-mini-title">{currentTitle}</div>
          <Button size="small" type="primary" onClick={togglePlay}>{isPlaying ? '暂停' : '播放'}</Button>
          <Button size="small" onClick={() => setMinimized(false)}>还原</Button>
          <Button size="small" danger onClick={closePreview}>关闭</Button>
        </div>
      )}
    </>
  );
};

const TypographyTitle = ({ title }: { title: string }) => (
  <div className="streaming-audio-title" title={title}>
    {title}
  </div>
);
