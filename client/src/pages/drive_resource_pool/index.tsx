import {
  CodeOutlined,
  CustomerServiceOutlined,
  DatabaseOutlined,
  FileExcelOutlined,
  FileImageOutlined,
  FileMarkdownOutlined,
  FileOutlined,
  FilePdfOutlined,
  FilePptOutlined,
  FileProtectOutlined,
  FileSyncOutlined,
  FileTextOutlined,
  FileUnknownOutlined,
  FileWordOutlined,
  FileZipOutlined,
  FolderOpenOutlined,
  Html5Outlined,
  LeftOutlined,
  PlayCircleOutlined,
  ReloadOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Button, Card, Empty, Modal, Space, Statistic, Tooltip, Typography, message } from 'antd';
import type { ReactNode, UIEvent } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';

import './index.less';
import folderImg from '@/assets/img/folder.png';
import { getfolderandfileapi, getResourcePoolAudioStreamUrl, getResourcePoolVideoStreamUrl, getvideosceenshotsapi, playvideosteamapi } from '@/api/resource_pool';
import { StreamingAudio } from '@/components/streaming_audio';
import { StreamingVideoPlayer } from '@/components/streaming_video_player';
import { getUserState } from '@/store/user';
import { getResourcePoolSessionStack, saveResourcePoolSessionStack } from '@/store/session_route';
import { GetFileTypeInItem, PreviewFileType } from '@/utils/FileType';

type ResourceItem = {
  type: 'file' | 'folder';
  name: string;
  ext?: string;
  path: string;
  blob?: string | null;
  mediaType?: 'video' | 'audio' | string | null;
  duration?: number | null;
};

type ResourcePreviewState = {
  open: boolean;
  title: string;
  type: 'pdf' | 'html' | 'text';
  url?: string;
  text?: string;
};

const emptyResourcePreview: ResourcePreviewState = {
  open: false,
  title: '',
  type: 'text',
};

const textPreviewTypes: PreviewFileType[] = ['text', 'code', 'markdown'];
const browserPreviewTypes: PreviewFileType[] = ['pdf', 'html'];
const RESOURCE_PAGE_SIZE = 40;

const getResourceItemFileType = (item: ResourceItem) => GetFileTypeInItem({ ...item, suffix: item.ext }).type;

const isCoarsePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: none), (pointer: coarse)').matches;

const languageIconMap: Record<string, { label: string; className: string }> = {
  py: { label: 'PY', className: 'python' },
  cs: { label: 'CS', className: 'csharp' },
  js: { label: 'JS', className: 'javascript' },
  jsx: { label: 'JSX', className: 'javascript' },
  ts: { label: 'TS', className: 'typescript' },
  tsx: { label: 'TSX', className: 'typescript' },
  java: { label: 'JAVA', className: 'java' },
  kt: { label: 'KT', className: 'kotlin' },
  go: { label: 'GO', className: 'go' },
  rs: { label: 'RS', className: 'rust' },
  c: { label: 'C', className: 'c' },
  cpp: { label: 'C++', className: 'cpp' },
  cc: { label: 'C++', className: 'cpp' },
  cxx: { label: 'C++', className: 'cpp' },
  h: { label: 'H', className: 'c' },
  hpp: { label: 'H++', className: 'cpp' },
  php: { label: 'PHP', className: 'php' },
  rb: { label: 'RB', className: 'ruby' },
  swift: { label: 'SW', className: 'swift' },
  dart: { label: 'DART', className: 'dart' },
  lua: { label: 'LUA', className: 'lua' },
  sh: { label: 'SH', className: 'shell' },
  bash: { label: 'SH', className: 'shell' },
  zsh: { label: 'ZSH', className: 'shell' },
  ps1: { label: 'PS', className: 'powershell' },
  sql: { label: 'SQL', className: 'sql' },
  json: { label: 'JSON', className: 'json' },
  xml: { label: 'XML', className: 'xml' },
  yaml: { label: 'YAML', className: 'yaml' },
  yml: { label: 'YAML', className: 'yaml' },
  md: { label: 'MD', className: 'markdown' },
  markdown: { label: 'MD', className: 'markdown' },
  html: { label: 'HTML', className: 'html' },
  htm: { label: 'HTML', className: 'html' },
  vue: { label: 'VUE', className: 'vue' },
  svelte: { label: 'SV', className: 'svelte' },
  css: { label: 'CSS', className: 'css' },
  less: { label: 'LESS', className: 'css' },
  scss: { label: 'SCSS', className: 'css' },
  sass: { label: 'SASS', className: 'css' },
};

const getLanguageIcon = (extension: string | undefined, baseClassName: string) => {
  const language = languageIconMap[String(extension || '').trim().replace(/^\./, '').toLowerCase()];
  if (!language) {
    return null;
  }

  return (
    <span className={`${baseClassName} resource-language-icon resource-language-icon-${language.className}`}>
      <span className="resource-language-icon-label">{language.label}</span>
    </span>
  );
};

const getResourceFileIcon = (fileType: PreviewFileType, item?: ResourceItem): ReactNode => {
  const className = `resource-file-icon resource-file-icon-${fileType}`;

  switch (fileType) {
    case 'image':
      return <FileImageOutlined className={className} />;
    case 'video':
      return <PlayCircleOutlined className={className} />;
    case 'audio':
      return <CustomerServiceOutlined className={className} />;
    case 'pdf':
      return <FilePdfOutlined className={className} />;
    case 'word':
      return <FileWordOutlined className={className} />;
    case 'excel':
      return <FileExcelOutlined className={className} />;
    case 'ppt':
      return <FilePptOutlined className={className} />;
    case 'archive':
      return <FileZipOutlined className={className} />;
    case 'code':
      return getLanguageIcon(item?.ext, className) || <CodeOutlined className={className} />;
    case 'markdown':
      return getLanguageIcon(item?.ext || 'md', className) || <FileMarkdownOutlined className={className} />;
    case 'html':
      return getLanguageIcon(item?.ext || 'html', className) || <Html5Outlined className={className} />;
    case 'package':
      return <FileSyncOutlined className={className} />;
    case 'database':
      return <DatabaseOutlined className={className} />;
    case 'design':
      return <FileProtectOutlined className={className} />;
    case 'text':
      return <FileTextOutlined className={className} />;
    case 'unknown':
      return <FileUnknownOutlined className={className} />;
    default:
      return <FileOutlined className={className} />;
  }
};

const ResourcePoolPage = () => {
  const user = getUserState();
  const [items, setItems] = useState<ResourceItem[]>([]);
  const [pathStack, setPathStack] = useState<{ name: string; path?: string }[]>(() => getResourcePoolSessionStack(getUserState().id));
  const [videoOpen, setVideoOpen] = useState(false);
  const [videoIndex, setVideoIndex] = useState(0);
  const [videoList, setVideoList] = useState<{ src: string; title: string; poster?: string | null; duration?: number | null }[]>([]);
  const [audioOpen, setAudioOpen] = useState(false);
  const [audioIndex, setAudioIndex] = useState(0);
  const [audioList, setAudioList] = useState<{ src: string; title: string }[]>([]);
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
  const [imagePreviewSrc, setImagePreviewSrc] = useState('');
  const [resourcePreview, setResourcePreview] = useState<ResourcePreviewState>(emptyResourcePreview);
  const [folderPage, setFolderPage] = useState(1);
  const [hasMoreItems, setHasMoreItems] = useState(false);
  const [folderLoading, setFolderLoading] = useState(false);
  const resourcePreviewUrlRef = useRef<string | null>(null);
  const folderRequestRef = useRef(0);
  const folderLoadingRef = useRef(false);

  const currentPath = pathStack[pathStack.length - 1]?.path;

  const loadFolder = async (path?: string, nextPage = 1, reset = true) => {
    if (!reset && folderLoadingRef.current) {
      return;
    }

    const requestId = folderRequestRef.current + 1;
    folderRequestRef.current = requestId;
    folderLoadingRef.current = true;
    setFolderLoading(true);
    try {
      const response = await getfolderandfileapi(path, nextPage, RESOURCE_PAGE_SIZE);
      if (folderRequestRef.current !== requestId) {
        return;
      }
      const { code, data, message: msg } = response.data;
      if (code !== 200) {
        message.error(msg);
        return;
      }

      const pageData = Array.isArray(data)
        ? { items: data, page: nextPage, hasMore: false }
        : data;
      const nextItems: ResourceItem[] = pageData.items.map((item: ResourceItem) => ({ ...item, blob: null }));
      setItems((prev) => (reset ? nextItems : [...prev, ...nextItems]));
      setFolderPage(pageData.page);
      setHasMoreItems(pageData.hasMore);

      nextItems.forEach(async (item) => {
        const fileType = getResourceItemFileType(item);
        if (item.type !== 'file' || (fileType !== 'video' && fileType !== 'image')) {
          return;
        }
        try {
          const blobResponse =
            fileType === 'video'
              ? await getvideosceenshotsapi(item.name, item.ext || '', item.path)
              : await playvideosteamapi(item.path);
          const url = URL.createObjectURL(blobResponse.data);
          setItems((prev) =>
            prev.map((currentItem) => (currentItem.path === item.path ? { ...currentItem, blob: url } : currentItem))
          );
        } catch {
          //
        }
      });
    } catch {
      if (folderRequestRef.current === requestId) {
        message.error('目录加载失败');
      }
    } finally {
      if (folderRequestRef.current === requestId) {
        folderLoadingRef.current = false;
        setFolderLoading(false);
      }
    }
  };

  useEffect(() => {
    setItems([]);
    setFolderPage(1);
    setHasMoreItems(false);
    loadFolder(currentPath, 1, true);
  }, [currentPath]);

  useEffect(() => {
    saveResourcePoolSessionStack(user.id, pathStack);
  }, [pathStack, user.id]);

  const videoSources = useMemo(
    () =>
      items
        .filter((item) => item.type === 'file' && getResourceItemFileType(item) === 'video')
        .map((item) => ({
          src: item.path,
          title: `${item.name}${item.ext ? `.${item.ext}` : ''}`,
          poster: item.blob,
          duration: item.duration,
        })),
    [items]
  );
  const folderCount = useMemo(() => items.filter((item) => item.type === 'folder').length, [items]);
  const audioSources = useMemo(
    () =>
      items
        .filter((item) => item.type === 'file' && getResourceItemFileType(item) === 'audio')
        .map((item) => ({
          src: getResourcePoolAudioStreamUrl(item.path),
          title: `${item.name}${item.ext ? `.${item.ext}` : ''}`,
        })),
    [items]
  );

  const closeResourcePreview = () => {
    if (resourcePreviewUrlRef.current) {
      URL.revokeObjectURL(resourcePreviewUrlRef.current);
      resourcePreviewUrlRef.current = null;
    }
    setResourcePreview(emptyResourcePreview);
  };

  const loadMoreItems = () => {
    if (folderLoadingRef.current || !hasMoreItems) {
      return;
    }
    loadFolder(currentPath, folderPage + 1, false);
  };

  const handleGridScroll = (event: UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    if (target.scrollHeight - target.scrollTop - target.clientHeight < 360) {
      loadMoreItems();
    }
  };

  const openItem = async (item: ResourceItem) => {
    if (item.type === 'folder') {
      setPathStack((prev) => [...prev, { name: item.name, path: item.path }]);
      return;
    }
    const fileType = getResourceItemFileType(item);
    const title = `${item.name}${item.ext ? `.${item.ext}` : ''}`;
    if (fileType === 'image' && item.blob) {
      setImagePreviewSrc(item.blob);
      setImagePreviewOpen(true);
      return;
    }
    if (fileType === 'video') {
      setAudioOpen(false);
      setVideoIndex(videoSources.findIndex((videoItem) => videoItem.src === item.path));
      setVideoList(videoSources);
      setVideoOpen(true);
      return;
    }
    if (fileType === 'audio') {
      const currentSrc = getResourcePoolAudioStreamUrl(item.path);
      setVideoOpen(false);
      setAudioIndex(audioSources.findIndex((audioItem) => audioItem.src === currentSrc));
      setAudioList(audioSources);
      setAudioOpen(true);
      return;
    }

    try {
      const response = await playvideosteamapi(item.path);
      const blob = response.data;

      if (fileType === 'image') {
        const url = URL.createObjectURL(blob);
        setImagePreviewSrc(url);
        setImagePreviewOpen(true);
        return;
      }

      if (textPreviewTypes.includes(fileType)) {
        closeResourcePreview();
        setResourcePreview({
          open: true,
          title,
          type: 'text',
          text: await blob.text(),
        });
        return;
      }

      if (browserPreviewTypes.includes(fileType)) {
        closeResourcePreview();
        const url = URL.createObjectURL(blob);
        resourcePreviewUrlRef.current = url;
        setResourcePreview({
          open: true,
          title,
          type: fileType === 'pdf' ? 'pdf' : 'html',
          url,
        });
        return;
      }

      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
      message.info('该格式已尝试用浏览器打开，若浏览器不支持可直接下载');
    } catch {
      message.warning('当前资源池暂不支持预览该文件');
    }
  };

  return (
    <div className="resource-page">
      <div className="resource-toolbar">
        <div className="resource-toolbar-info">
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
        <div className="resource-toolbar-actions">
          <Button icon={<ReloadOutlined />} loading={folderLoading} onClick={() => loadFolder(currentPath, 1, true)}>
            刷新
          </Button>
          {pathStack.length > 0 && (
            <Button icon={<LeftOutlined />} onClick={() => setPathStack((prev) => prev.slice(0, -1))}>
              返回上级
            </Button>
          )}
        </div>
      </div>

      <div className="resource-summary">
        <Card size="small" className="resource-summary-card">
          <Statistic title="已加载目录" value={folderCount} prefix={<FolderOpenOutlined />} />
        </Card>
        <Card size="small" className="resource-summary-card">
          <Statistic title="已加载视频" value={videoSources.length} prefix={<VideoCameraOutlined />} />
        </Card>
      </div>

      {!folderLoading && items.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Empty description="这里啥也没有呢~" />
        </div>
      ) : (
        <div className="resource-grid" onScroll={handleGridScroll}>
          {items.map((item) => {
            const displayName = `${item.name}${item.ext ? `.${item.ext}` : ''}`;
            const fileType = getResourceItemFileType(item);
            return (
              <div
                key={item.path}
                className="resource-card"
                onClick={() => {
                  if (isCoarsePointer()) {
                    openItem(item);
                  }
                }}
                onDoubleClick={() => openItem(item)}
              >
                <div className="resource-thumb-frame">
                  {item.type === 'folder' && <img className="resource-thumb" src={folderImg} />}
                  {item.type === 'file' && item.blob && (fileType === 'video' || fileType === 'image') && <img className="resource-thumb" src={item.blob} />}
                  {item.type === 'file' && !(item.blob && (fileType === 'video' || fileType === 'image')) && getResourceFileIcon(fileType, item)}
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
          {(folderLoading || hasMoreItems) && (
            <div className="resource-grid-status">
              {folderLoading ? '加载中...' : '向下滚动加载更多'}
            </div>
          )}
        </div>
      )}

      <StreamingVideoPlayer
        open={videoOpen}
        data={videoList}
        index={videoIndex}
        sourceType="resourcepool"
        onClose={() => setVideoOpen(false)}
      />
      {audioOpen && (
        <StreamingAudio
          open
          data={audioList}
          index={audioIndex}
          onClose={() => {
            setAudioOpen(false);
          }}
        />
      )}
      <Modal
        className="resource-image-modal"
        open={imagePreviewOpen}
        footer={null}
        width="72vw"
        onCancel={() => setImagePreviewOpen(false)}
        maskClosable={false}
      >
        <img
          src={imagePreviewSrc}
          style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: 16 }}
        />
      </Modal>
      <Modal
        className="resource-preview-modal"
        open={resourcePreview.open}
        title={resourcePreview.title}
        footer={null}
        width={resourcePreview.type === 'text' ? '76vw' : '82vw'}
        onCancel={closeResourcePreview}
        maskClosable={false}
        destroyOnClose
      >
        {resourcePreview.type === 'text' ? (
          <pre className="resource-text-preview">{resourcePreview.text}</pre>
        ) : (
          <iframe
            className="resource-browser-preview"
            title={resourcePreview.title}
            src={resourcePreview.url}
            sandbox={resourcePreview.type === 'html' ? 'allow-same-origin' : undefined}
          />
        )}
      </Modal>
    </div>
  );
};

export default ResourcePoolPage;
