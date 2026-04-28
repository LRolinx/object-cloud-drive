import { CustomerServiceOutlined, FolderOpenOutlined, LeftOutlined, PlayCircleOutlined, ReloadOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Card, Empty, Space, Statistic, Tooltip, Typography, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';

import './index.less';
import folderImg from '@/assets/img/folder.png';
import { getfolderandfileapi, getResourcePoolVideoStreamUrl, getvideosceenshotsapi } from '@/api/resource_pool';
import { StreamingAudio } from '@/components/streaming_audio';
import { StreamingVideoPlayer } from '@/components/streaming_video_player';
import { getUserState } from '@/store/user';
import { getResourcePoolSessionStack, saveResourcePoolSessionStack } from '@/store/session_route';

type ResourceItem = {
  type: 'file' | 'folder';
  name: string;
  ext?: string;
  path: string;
  blob?: string | null;
  mediaType?: 'video' | 'audio' | string | null;
};

const audioExtensions = new Set(['MP3', 'AAC', 'M4A', 'WAV', 'OGG', 'ALAC', 'FLAC', 'APE']);
const videoExtensions = new Set(['MP4']);

const getResourceItemMediaType = (item: ResourceItem) => {
  if (item.mediaType === 'video' || item.mediaType === 'audio') {
    return item.mediaType;
  }
  const ext = item.ext?.toUpperCase();
  if (!ext) {
    return 'other';
  }
  if (videoExtensions.has(ext)) {
    return 'video';
  }
  if (audioExtensions.has(ext)) {
    return 'audio';
  }
  return 'other';
};

const ResourcePoolPage = () => {
  const user = getUserState();
  const [items, setItems] = useState<ResourceItem[]>([]);
  const [pathStack, setPathStack] = useState<{ name: string; path?: string }[]>(() => getResourcePoolSessionStack(getUserState().id));
  const [videoOpen, setVideoOpen] = useState(false);
  const [videoIndex, setVideoIndex] = useState(0);
  const [videoList, setVideoList] = useState<{ src: string; title: string; poster?: string | null }[]>([]);
  const [audioOpen, setAudioOpen] = useState(false);
  const [audioIndex, setAudioIndex] = useState(0);
  const [audioList, setAudioList] = useState<{ src: string; title: string }[]>([]);

  const currentPath = pathStack[pathStack.length - 1]?.path;

  const loadFolder = async (path?: string) => {
    const response = await getfolderandfileapi(path);
    const { code, data, message: msg } = response.data;
    if (code !== 200) {
      message.error(msg);
      return;
    }

    const nextItems: ResourceItem[] = data.map((item: ResourceItem) => ({ ...item, blob: null }));
    setItems(nextItems);
    nextItems.forEach(async (item, index) => {
      if (item.type !== 'file' || getResourceItemMediaType(item) !== 'video') {
        return;
      }
      try {
        const blobResponse = await getvideosceenshotsapi(item.name, item.ext || '', item.path);
        const url = URL.createObjectURL(blobResponse.data);
        setItems((prev) =>
          prev.map((currentItem, currentIndex) =>
            currentIndex === index ? { ...currentItem, blob: url } : currentItem
          )
        );
      } catch {
        //
      }
    });
  };

  useEffect(() => {
    loadFolder(currentPath);
  }, [currentPath]);

  useEffect(() => {
    saveResourcePoolSessionStack(user.id, pathStack);
  }, [pathStack, user.id]);

  const videoSources = useMemo(
    () =>
      items
        .filter((item) => item.type === 'file' && getResourceItemMediaType(item) === 'video')
        .map((item) => ({
          src: item.path,
          title: `${item.name}${item.ext ? `.${item.ext}` : ''}`,
          poster: item.blob,
        })),
    [items]
  );
  const folderCount = useMemo(() => items.filter((item) => item.type === 'folder').length, [items]);
  const audioSources = useMemo(
    () =>
      items
        .filter((item) => item.type === 'file' && getResourceItemMediaType(item) === 'audio')
        .map((item) => ({
          src: getResourcePoolVideoStreamUrl(item.path),
          title: `${item.name}${item.ext ? `.${item.ext}` : ''}`,
        })),
    [items]
  );

  const openItem = (item: ResourceItem) => {
    if (item.type === 'folder') {
      setPathStack((prev) => [...prev, { name: item.name, path: item.path }]);
      return;
    }
    const mediaType = getResourceItemMediaType(item);
    if (mediaType === 'video') {
      setVideoIndex(videoSources.findIndex((videoItem) => videoItem.src === item.path));
      setVideoList(videoSources);
      setVideoOpen(true);
      return;
    }
    if (mediaType === 'audio') {
      const currentSrc = getResourcePoolVideoStreamUrl(item.path);
      setAudioIndex(audioSources.findIndex((audioItem) => audioItem.src === currentSrc));
      setAudioList(audioSources);
      setAudioOpen(true);
      return;
    }
    message.warning('当前资源池暂时只支持视频和音频预览');
  };

  return (
    <div className="resource-page">
      <div className="resource-toolbar">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Typography.Title level={3} style={{ margin: 0 }}>
            资源池
          </Typography.Title>
          <Breadcrumb
            items={[
              {
                title: pathStack.length ? <a onClick={() => setPathStack([])}>根目录</a> : '根目录',
              },
              ...pathStack.map((item, index) => ({
                title:
                  index === pathStack.length - 1 ? (
                    item.name
                  ) : (
                    <a onClick={() => setPathStack((prev) => prev.slice(0, index + 1))}>{item.name}</a>
                  ),
              })),
            ]}
          />
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={() => loadFolder(currentPath)}>
            刷新
          </Button>
          {pathStack.length > 0 && (
            <Button icon={<LeftOutlined />} onClick={() => setPathStack((prev) => prev.slice(0, -1))}>
              返回上级
            </Button>
          )}
        </Space>
      </div>

      <div className="resource-summary">
        <Card size="small" className="resource-summary-card">
          <Statistic title="目录" value={folderCount} prefix={<FolderOpenOutlined />} />
        </Card>
        <Card size="small" className="resource-summary-card">
          <Statistic title="视频" value={videoSources.length} prefix={<VideoCameraOutlined />} />
        </Card>
      </div>

      {items.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Empty description="这里啥也没有呢~" />
        </div>
      ) : (
        <div className="resource-grid">
          {items.map((item) => {
            const displayName = `${item.name}${item.ext ? `.${item.ext}` : ''}`;
            const mediaType = getResourceItemMediaType(item);
            return (
              <div key={item.path} className="resource-card" onDoubleClick={() => openItem(item)}>
                <div className="resource-thumb-frame">
                  {item.type === 'folder' && <img className="resource-thumb" src={folderImg} />}
                  {item.type === 'file' && item.blob && mediaType === 'video' && <img className="resource-thumb" src={item.blob} />}
                  {item.type === 'file' && mediaType === 'audio' && <CustomerServiceOutlined className="resource-file-icon" />}
                  {item.type === 'file' && mediaType !== 'audio' && !item.blob && <PlayCircleOutlined className="resource-file-icon" />}
                </div>
                <Space direction="vertical" size={6} className="resource-card-meta">
                  <Tooltip title={displayName}>
                    <div className="resource-card-name">
                      {displayName}
                    </div>
                  </Tooltip>
                </Space>
              </div>
            );
          })}
        </div>
      )}

      <StreamingVideoPlayer
        open={videoOpen}
        data={videoList}
        index={videoIndex}
        sourceType="resourcepool"
        onClose={() => setVideoOpen(false)}
      />
      <StreamingAudio
        open={audioOpen}
        data={audioList}
        index={audioIndex}
        onClose={() => {
          setAudioOpen(false);
        }}
      />
    </div>
  );
};

export default ResourcePoolPage;
