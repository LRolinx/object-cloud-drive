import { Button, Modal } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';

import { getResourcePoolVideoStreamUrl } from '@/api/resource_pool';
import { getVideoStreamUrl } from '@/api/video';
import './index.less';

type SourceType = 'drive' | 'resourcepool';
type VideoSourceItem = string | { src: string; title?: string; poster?: string | null };

type Props = {
  open?: boolean;
  data?: VideoSourceItem[];
  index?: number;
  sourceType?: SourceType;
  onClose?: () => void;
};

const getSourceValue = (item?: VideoSourceItem) => (typeof item === 'string' ? item : item?.src || '');
const getSourcePoster = (item?: VideoSourceItem) => (typeof item === 'string' ? '' : item?.poster || '');
const getSourceTitle = (item: VideoSourceItem | undefined, index: number) => {
  if (!item) {
    return `视频 ${index + 1}`;
  }
  return typeof item === 'string' ? `视频 ${index + 1}` : item.title || `视频 ${index + 1}`;
};

export const StreamingVideoPlayer = ({
  open = false,
  data = [],
  index = 0,
  sourceType = 'resourcepool',
  onClose,
}: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentIndex, setCurrentIndex] = useState(index);
  const [minimized, setMinimized] = useState(false);

  const currentSource = useMemo(() => getSourceValue(data[currentIndex]), [currentIndex, data]);
  const currentTitle = useMemo(() => getSourceTitle(data[currentIndex], currentIndex), [currentIndex, data]);
  const videoUrl = useMemo(() => {
    if (!open || !currentSource) {
      return '';
    }
    return sourceType === 'drive'
      ? getVideoStreamUrl(currentSource)
      : getResourcePoolVideoStreamUrl(currentSource);
  }, [currentSource, open, sourceType]);

  useEffect(() => {
    setCurrentIndex(index);
  }, [index, open]);

  useEffect(() => {
    if (!open) {
      setMinimized(false);
      videoRef.current?.pause();
    }
  }, [open]);

  const closePreview = () => {
    videoRef.current?.pause();
    setMinimized(false);
    onClose?.();
  };

  return (
    <>
      <Modal
        open={open && !minimized}
        width="86vw"
        title={
          <div className="media-preview-titlebar">
            <span>视频预览</span>
            <Button size="small" onClick={() => setMinimized(true)}>最小化</Button>
          </div>
        }
        footer={null}
        onCancel={closePreview}
        maskClosable={false}
        styles={{ body: { paddingTop: 12 } }}
      >
        <div className="streaming-video-layout">
          <div className="streaming-video-main">
            <video ref={videoRef} controls autoPlay preload="metadata" src={videoUrl} className="streaming-video-element" />
            {data.length > 1 && (
              <div className="streaming-video-actions">
                <Button
                  disabled={currentIndex <= 0}
                  onClick={() => setCurrentIndex((value) => Math.max(0, value - 1))}
                >
                  上一个
                </Button>
                <Button
                  disabled={currentIndex >= data.length - 1}
                  onClick={() => setCurrentIndex((value) => Math.min(data.length - 1, value + 1))}
                >
                  下一个
                </Button>
              </div>
            )}
          </div>
          <aside className="streaming-video-playlist">
            <div className="streaming-video-playlist-title">同目录视频</div>
            <div className="streaming-video-playlist-scroll">
              {data.map((item, itemIndex) => (
                <button
                  key={`${getSourceValue(item)}-${itemIndex}`}
                  type="button"
                  className={`streaming-video-playlist-item${itemIndex === currentIndex ? ' is-active' : ''}`}
                  onClick={() => setCurrentIndex(itemIndex)}
                >
                  <span className="streaming-video-playlist-thumb">
                    {getSourcePoster(item) ? (
                      <img src={getSourcePoster(item)} alt={getSourceTitle(item, itemIndex)} />
                    ) : (
                      <span>{itemIndex + 1}</span>
                    )}
                  </span>
                  <span className="streaming-video-playlist-meta">
                    <span className="streaming-video-playlist-name">{getSourceTitle(item, itemIndex)}</span>
                    <span className="streaming-video-playlist-subtitle">同目录视频</span>
                  </span>
                </button>
              ))}
            </div>
          </aside>
        </div>
      </Modal>
      {open && minimized && (
        <div className="media-preview-mini">
          <div className="media-preview-mini-title">{currentTitle}</div>
          <Button size="small" onClick={() => setMinimized(false)}>还原</Button>
          <Button size="small" danger onClick={closePreview}>关闭</Button>
        </div>
      )}
    </>
  );
};
