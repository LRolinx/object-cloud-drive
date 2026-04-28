import { FolderOpenOutlined, LeftOutlined, PlayCircleOutlined, ReloadOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Card, Empty, Space, Statistic, Tooltip, Typography, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';

import './index.less';
import folderImg from '@/assets/img/folder.png';
import { getfolderandfileapi, getvideosceenshotsapi } from '@/api/resource_pool';
import { StreamingVideoPlayer } from '@/components/streaming_video_player';

type ResourceItem = {
  type: 'file' | 'folder';
  name: string;
  ext?: string;
  path: string;
  blob?: string | null;
};

const ResourcePoolPage = () => {
  const [items, setItems] = useState<ResourceItem[]>([]);
  const [pathStack, setPathStack] = useState<{ name: string; path?: string }[]>([]);
  const [videoOpen, setVideoOpen] = useState(false);
  const [videoIndex, setVideoIndex] = useState(0);
  const [videoList, setVideoList] = useState<{ src: string; title: string; poster?: string | null }[]>([]);

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
      if (item.type !== 'file' || item.ext?.toUpperCase() !== 'MP4') {
        return;
      }
      try {
        const blobResponse = await getvideosceenshotsapi(item.name, item.ext, item.path);
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

  const videoSources = useMemo(
    () =>
      items
        .filter((item) => item.type === 'file' && item.ext?.toUpperCase() === 'MP4')
        .map((item) => ({
          src: item.path,
          title: `${item.name}${item.ext ? `.${item.ext}` : ''}`,
          poster: item.blob,
        })),
    [items]
  );
  const folderCount = useMemo(() => items.filter((item) => item.type === 'folder').length, [items]);

  const openItem = (item: ResourceItem) => {
    if (item.type === 'folder') {
      setPathStack((prev) => [...prev, { name: item.name, path: item.path }]);
      return;
    }
    if (item.ext?.toUpperCase() !== 'MP4') {
      message.warning('当前资源池暂时只支持 MP4 预览');
      return;
    }
    setVideoIndex(videoSources.findIndex((videoItem) => videoItem.src === item.path));
    setVideoList(videoSources);
    setVideoOpen(true);
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
            return (
              <div key={item.path} className="resource-card" onDoubleClick={() => openItem(item)}>
                <div className="resource-thumb-frame">
                  {item.type === 'folder' && <img className="resource-thumb" src={folderImg} />}
                  {item.type === 'file' && item.blob && <img className="resource-thumb" src={item.blob} />}
                  {item.type === 'file' && !item.blob && <PlayCircleOutlined className="resource-file-icon" />}
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
    </div>
  );
};

export default ResourcePoolPage;
