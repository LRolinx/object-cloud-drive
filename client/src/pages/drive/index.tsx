import {
  DeleteOutlined,
  DownloadOutlined,
  EyeOutlined,
  FileImageOutlined,
  FileOutlined,
  FileTextOutlined,
  InboxOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  ReloadOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {
  Breadcrumb,
  Button,
  Empty,
  Image,
  Input,
  Modal,
  Space,
  Tooltip,
  Typography,
  message,
} from 'antd';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import './index.less';
import folderImg from '@/assets/img/folder.png';
import { adduserfolderapi, batchAddUserFolderApi, deluserfileorfolderapi, getuserfileandfolderapi, getuserfileforfileidapi } from '@/api/drive';
import { getvideosceenshotsapi } from '@/api/video';
import { examinefileapi, uploadsecondpassapi, uploadstreamfileapi } from '@/api/update';
import { StreamingVideoPlayer } from '@/components/streaming_video_player';
import { BatchAddUserFileType } from '@/types/BatchAddUserFileType';
import { BatchAddUserFolderType } from '@/types/BatchAddUserFolderType';
import { FileAndFloderType } from '@/types/FileAndFolderType';
import { UploadType } from '@/types/UploadType';
import { GetFileTypeInItem } from '@/utils/FileType';
import MathTools from '@/utils/MathTools';
import { getDriveNavigation, setDriveNavigation } from '@/store/drive';
import { getUserState } from '@/store/user';
import { addUploadTasks, updateUploadTask } from '@/store/upload';
import { hashFileInWorker } from '@/utils/fileHash';

type FileItem = FileAndFloderType & {
  blob?: string | null;
  pUUid?: string;
};

const getFolderIdFromSplat = (splat: string | undefined) => {
  if (!splat) {
    return MathTools.RootUUID();
  }
  const folders = splat.split('/').filter(Boolean);
  return folders[folders.length - 1] ?? MathTools.RootUUID();
};

const getFileNameAndExt = (value: string) => {
  const index = value.lastIndexOf('.');
  if (index === -1) {
    return { fname: value, fext: '' };
  }
  return {
    fname: value.slice(0, index),
    fext: value.slice(index + 1),
  };
};

const calculateSliceSize = (size: number) => {
  const mbSize = Number((size / 1024 ** 2).toFixed(2));
  const ratio = parseInt(((mbSize / 100) * 2).toString(), 10);
  if (ratio <= 2) {
    return 2;
  }
  if (ratio > 10) {
    return 10;
  }
  return ratio;
};

const createFolderPlan = (files: File[], currentFolderId: string) => {
  const folders: BatchAddUserFolderType[] = [];
  const folderMap = new Map<string, string>();
  const tasks: BatchAddUserFileType[] = [];

  for (const file of files) {
    const relativePath = (file as File & { webkitRelativePath?: string }).webkitRelativePath || file.name;
    const parts = relativePath.split('/').filter(Boolean);
    const fileName = parts[parts.length - 1];
    const directoryParts = parts.slice(0, -1);

    let parentFolderId = currentFolderId;
    let currentKey = '';

    for (const directory of directoryParts) {
      currentKey = `${currentKey}/${directory}`;
      const existedFolderId = folderMap.get(currentKey);
      if (existedFolderId) {
        parentFolderId = existedFolderId;
        continue;
      }

      const folderUuid = MathTools.UUID();
      folderMap.set(currentKey, folderUuid);
      folders.push({
        pUuid: parentFolderId,
        folderUuid,
        folderName: directory,
      });
      parentFolderId = folderUuid;
    }

    const { fname, fext } = getFileNameAndExt(fileName);
    tasks.push({
      taskId: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      uploadType: UploadType.Waiting,
      uploadCurrentChunkNum: 0,
      currentChunkMax: 0,
      file,
      fileSize: file.size,
      fileType: file.type,
      fname,
      fext,
      filePath: relativePath,
      fileSha256: '',
      folderId: parentFolderId,
      userFileExist: false,
      fileExist: false,
      uploadedBytes: 0,
      progress: 0,
      statusText: '等待中',
    });
  }

  return { folders, tasks };
};

const getFileDisplayName = (name: string, suffix?: string) => `${name}${suffix ? `.${suffix}` : ''}`.toLowerCase();

const getUniqueFileName = (baseName: string, suffix: string, usedNames: Set<string>) => {
  let candidate = baseName;
  let index = 1;

  while (usedNames.has(getFileDisplayName(candidate, suffix))) {
    candidate = `${baseName} (${index})`;
    index += 1;
  }

  usedNames.add(getFileDisplayName(candidate, suffix));
  return candidate;
};

const DrivePage = () => {
  const user = getUserState();
  const navigate = useNavigate();
  const params = useParams();
  const currentFolderId = getFolderIdFromSplat(params['*']);
  const [loading, setLoading] = useState(false);
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [fileData, setFileData] = useState<FileItem[]>([]);
  const [dragging, setDragging] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [videoList, setVideoList] = useState<{ src: string; title: string; poster?: string | null }[]>([]);
  const [videoIndex, setVideoIndex] = useState(0);
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
  const [imagePreviewSrc, setImagePreviewSrc] = useState('');
  const previewUrlsRef = useRef<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const directoryInputRef = useRef<HTMLInputElement>(null);
  const dragDepthRef = useRef(0);

  const navigation = useMemo(() => getDriveNavigation(), [currentFolderId, fileData.length]);

  const runWithConcurrency = useCallback(async <T,>(
    items: T[],
    concurrency: number,
    handler: (item: T, index: number) => Promise<void>
  ) => {
    const executing = new Set<Promise<void>>();

    for (const [index, item] of items.entries()) {
      const task = Promise.resolve().then(() => handler(item, index));
      executing.add(task);
      const cleanup = () => executing.delete(task);
      task.then(cleanup).catch(cleanup);

      if (executing.size >= concurrency) {
        await Promise.race(executing);
      }
    }

    await Promise.all(executing);
  }, []);

  const cleanupPreviewUrls = useCallback(() => {
    previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    previewUrlsRef.current = [];
  }, []);

  const loadPreview = useCallback(async (item: FileItem) => {
    const fileType = GetFileTypeInItem(item).type;
    if (fileType !== 'image' && fileType !== 'video') {
      return null;
    }

    try {
      const response =
        fileType === 'image'
          ? await getuserfileforfileidapi(item.id)
          : await getvideosceenshotsapi(item.fileSha256 || item.id);
      const url = URL.createObjectURL(response.data);
      previewUrlsRef.current.push(url);
      return url;
    } catch {
      return null;
    }
  }, []);

  const loadFiles = useCallback(async () => {
    setLoading(true);
    cleanupPreviewUrls();
    try {
      const response = await getuserfileandfolderapi(user.id, currentFolderId);
      const { code, data, message: msg } = response.data;
      if (code !== 200) {
        message.error(msg);
        return;
      }

      const nextList: FileItem[] = data.map((item: FileItem) => ({ ...item, blob: null }));
      setFileData(nextList);

      nextList.forEach(async (item, index) => {
        const blob = await loadPreview(item);
        if (!blob) {
          return;
        }
        setFileData((prev) =>
          prev.map((currentItem, currentIndex) =>
            currentIndex === index ? { ...currentItem, blob } : currentItem
          )
        );
      });
    } finally {
      setLoading(false);
    }
  }, [cleanupPreviewUrls, currentFolderId, loadPreview, user.id]);

  useEffect(() => {
    loadFiles();
    return cleanupPreviewUrls;
  }, [cleanupPreviewUrls, loadFiles]);

  useEffect(() => {
    if (directoryInputRef.current) {
      directoryInputRef.current.setAttribute('webkitdirectory', '');
      directoryInputRef.current.setAttribute('directory', '');
    }
  }, []);

  useEffect(() => {
    if (currentFolderId === MathTools.RootUUID()) {
      setDriveNavigation([]);
    } else {
      const current = getDriveNavigation();
      const matchedIndex = current.findIndex((item) => item.id === currentFolderId);
      if (matchedIndex >= 0) {
        setDriveNavigation(current.slice(0, matchedIndex + 1));
      }
    }
  }, [currentFolderId]);

  const createFolder = async () => {
    const value = newFolderName.trim();
    if (!value) {
      message.warning('文件夹名称不能为空');
      return;
    }

    const response = await adduserfolderapi(user.id, currentFolderId, value);
    const { code, message: msg } = response.data;
    if (code !== 200) {
      message.error(msg);
      return;
    }

    setCreatingFolder(false);
    setNewFolderName('');
    message.success('新建文件夹成功');
    loadFiles();
  };

  const uploadSingleTask = async (task: BatchAddUserFileType) => {
    if (task.file.size <= 0) {
      if (task.taskId) {
        updateUploadTask(task.taskId, {
          uploadType: UploadType.Small,
          errorMessage: '文件太小',
          statusText: '文件太小',
        });
      }
      return;
    }

    if (task.taskId) {
      updateUploadTask(task.taskId, {
        uploadType: UploadType.Checkout,
        statusText: '计算哈希中',
      });
    }

    task.fileSha256 = await hashFileInWorker(task.taskId ?? String(Date.now()), task.file);
    const examineResponse = await examinefileapi(user.id, task.folderId, task.fileSha256, task.fname, task.fext);
    const { code, data, message: msg } = examineResponse.data;
    if (code !== 200) {
      throw new Error(msg);
    }

    if (data.userFileExist) {
      if (task.taskId) {
        updateUploadTask(task.taskId, {
          uploadType: UploadType.Exist,
          progress: 100,
          uploadedBytes: task.file.size,
          statusText: '文件已存在',
        });
      }
      return;
    }

    if (data.fileExist) {
      await uploadsecondpassapi(user.id, task.folderId, task.fname, task.filePath, task.fext, task.fileSha256);
      if (task.taskId) {
        updateUploadTask(task.taskId, {
          uploadType: UploadType.Fast,
          progress: 100,
          uploadedBytes: task.file.size,
          uploadCurrentChunkNum: 1,
          currentChunkMax: 1,
          statusText: '秒传完成',
        });
      }
      return;
    }

    const chunkSize = calculateSliceSize(task.file.size) * 1024 ** 2;
    const chunks = Math.ceil(task.file.size / chunkSize);
    const chunkLoadedMap = new Map<number, number>();
    let finishedChunkCount = 0;

    if (task.taskId) {
      updateUploadTask(task.taskId, {
        uploadType: UploadType.Conduct,
        currentChunkMax: chunks,
        uploadCurrentChunkNum: 0,
        uploadedBytes: 0,
        progress: 0,
        statusText: `并发上传中 (${chunks} 分片)`,
      });
    }

    const chunkIndexes = Array.from({ length: chunks }, (_, index) => index);
    const chunkConcurrency = Math.min(6, Math.max(2, navigator.hardwareConcurrency ? Math.floor(navigator.hardwareConcurrency / 2) : 4));

    await runWithConcurrency(chunkIndexes, chunkConcurrency, async (chunkIndex) => {
      const start = chunkIndex * chunkSize;
      const end = Math.min(start + chunkSize, task.file.size);
      const currentChunkSize = end - start;
      const formData = new FormData();
      formData.append('file', task.file.slice(start, end));

      const response = await uploadstreamfileapi(
        formData,
        user.id,
        task.folderId,
        task.fname,
        task.filePath,
        task.fext,
        task.fileSha256,
        chunks,
        chunkIndex,
        (progressEvent) => {
          chunkLoadedMap.set(chunkIndex, progressEvent.loaded ?? currentChunkSize);
          const uploadedBytes = Array.from(chunkLoadedMap.values()).reduce((sum, value) => sum + value, 0);
          if (task.taskId) {
            updateUploadTask(task.taskId, {
              uploadedBytes,
              progress: Math.min(99, (uploadedBytes / task.file.size) * 100),
              uploadType: UploadType.Conduct,
            });
          }
        }
      );

      if (response.data.code !== 200) {
        throw new Error(response.data.message);
      }

      chunkLoadedMap.set(chunkIndex, currentChunkSize);
      finishedChunkCount += 1;
      const uploadedBytes = Array.from(chunkLoadedMap.values()).reduce((sum, value) => sum + value, 0);
      if (task.taskId) {
        updateUploadTask(task.taskId, {
          uploadCurrentChunkNum: finishedChunkCount,
          uploadedBytes,
          progress: Math.min(99, (uploadedBytes / task.file.size) * 100),
          uploadType: UploadType.Conduct,
        });
      }
    });

    if (task.taskId) {
      updateUploadTask(task.taskId, {
        uploadType: UploadType.Success,
        uploadedBytes: task.file.size,
        uploadCurrentChunkNum: chunks,
        currentChunkMax: chunks,
        progress: 100,
        statusText: '上传完成',
      });
    }
  };

  const uploadFiles = async (files: File[]) => {
    if (!files.length) {
      return;
    }

    setLoading(true);
    try {
      const { folders, tasks } = createFolderPlan(files, currentFolderId);
      const usedNamesByFolder = new Map<string, Set<string>>();
      const currentFolderNames = new Set(
        fileData
          .filter((item) => item.type === 'file')
          .map((item) => getFileDisplayName(item.name, item.suffix))
      );
      usedNamesByFolder.set(currentFolderId, currentFolderNames);

      for (const task of tasks) {
        const usedNames = usedNamesByFolder.get(task.folderId) ?? new Set<string>();
        task.fname = getUniqueFileName(task.fname, task.fext, usedNames);
        usedNamesByFolder.set(task.folderId, usedNames);
      }

      addUploadTasks(tasks);
      if (folders.length) {
        const folderResponse = await batchAddUserFolderApi(user.id, folders);
        if (folderResponse.data.code !== 200) {
          message.error(folderResponse.data.message);
          return;
        }
      }

      const fileConcurrency = Math.min(3, Math.max(1, navigator.hardwareConcurrency ? Math.floor(navigator.hardwareConcurrency / 4) : 2));
      await runWithConcurrency(tasks, fileConcurrency, async (task) => {
        try {
          await uploadSingleTask(task);
        } catch (error) {
          if (task.taskId) {
            updateUploadTask(task.taskId, {
              uploadType: UploadType.Error,
              errorMessage: error instanceof Error ? error.message : '上传失败',
              statusText: '上传失败',
            });
          }
          throw error;
        }
      });

      message.success('上传完成');
      loadFiles();
    } catch (error) {
      message.error(error instanceof Error ? error.message : '上传失败');
    } finally {
      setLoading(false);
      setDragging(false);
    }
  };

  const openFolderOrFile = async (item: FileItem) => {
    if (item.type === 'folder') {
      setDriveNavigation([...getDriveNavigation(), { id: item.id, text: item.name }]);
      navigate(`/home/drive/${item.id}`);
      return;
    }

    const fileType = GetFileTypeInItem(item).type;
    if (fileType === 'image' && item.blob) {
      setImagePreviewSrc(item.blob);
      setImagePreviewOpen(true);
      return;
    }
    if (fileType === 'video') {
      const videos = fileData.filter((currentItem) => currentItem.type === 'file' && GetFileTypeInItem(currentItem).type === 'video');
      const videoItems = videos.map((currentItem) => ({
        src: currentItem.fileSha256 || currentItem.id,
        title: `${currentItem.name}${currentItem.suffix ? `.${currentItem.suffix}` : ''}`,
        poster: currentItem.blob,
      }));
      setVideoIndex(videoItems.findIndex((videoItem) => videoItem.src === (item.fileSha256 || item.id)));
      setVideoList(videoItems);
      setVideoOpen(true);
      return;
    }

    try {
      const response = await getuserfileforfileidapi(item.id);
      const url = URL.createObjectURL(response.data);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch {
      message.warning('当前文件暂不支持预览');
    }
  };

  const downloadFile = async (item: FileItem) => {
    try {
      const response = await getuserfileforfileidapi(item.id);
      const url = URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${item.name}${item.suffix ? `.${item.suffix}` : ''}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      message.error('下载失败');
    }
  };

  const removeFile = async (item: FileItem) => {
    const response = await deluserfileorfolderapi(item.id, item.type);
    const { code, message: msg } = response.data;
    if (code !== 200) {
      message.error(msg);
      return;
    }
    message.success(msg);
    loadFiles();
  };

  return (
    <div
      className="drive-page"
      onDragEnter={(event) => {
        event.preventDefault();
        dragDepthRef.current += 1;
        setDragging(true);
      }}
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
        if (dragDepthRef.current === 0) {
          setDragging(false);
        }
      }}
      onDrop={(event) => {
        event.preventDefault();
        dragDepthRef.current = 0;
        setDragging(false);
        const droppedFiles = Array.from(event.dataTransfer.files);
        uploadFiles(droppedFiles);
      }}
    >
      {dragging && (
        <div className="drive-drop-mask">
          <Space direction="vertical" size={10}>
            <InboxOutlined />
            <span>松开即可上传到当前目录</span>
            <Typography.Text type="secondary">支持直接拖入文件和文件夹</Typography.Text>
          </Space>
        </div>
      )}

      <div className="drive-toolbar">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Typography.Title level={3} style={{ margin: 0 }}>
            我的云盘
          </Typography.Title>
          <Breadcrumb
            items={[
              {
                title: <a onClick={() => navigate('/home/drive')}>根目录</a>,
              },
              ...navigation.map((item, index) => ({
                title:
                  index === navigation.length - 1 ? (
                    item.text
                  ) : (
                    <a onClick={() => navigate(`/home/drive/${item.id}`)}>{item.text}</a>
                  ),
              })),
            ]}
          />
        </div>

        <Space>
          <Button icon={<ReloadOutlined />} onClick={loadFiles}>
            刷新
          </Button>
          <Button icon={<UploadOutlined />} loading={loading} onClick={() => fileInputRef.current?.click()}>
            上传文件
          </Button>
          <Button onClick={() => directoryInputRef.current?.click()}>
            上传文件夹
          </Button>
          <Button icon={<PlusOutlined />} type="primary" onClick={() => setCreatingFolder(true)}>
            新建文件夹
          </Button>
        </Space>
      </div>

      <div className="drive-list">
        {fileData.length === 0 ? (
          <div className="drive-empty">
            <Empty description="这里啥也没有呢~" />
          </div>
        ) : (
          <div className="drive-grid">
            {fileData.map((item) => {
              const fileType = GetFileTypeInItem(item).type;
              const displayName = `${item.name}${item.suffix ? `.${item.suffix}` : ''}`;
              return (
                <div key={`${item.type}-${item.id}`} className="drive-card" onDoubleClick={() => openFolderOrFile(item)}>
                  <div className="drive-thumb-frame">
                    {item.type === 'folder' && <img className="drive-folder" src={folderImg} />}
                    {item.type === 'file' && item.blob && fileType === 'image' && (
                      <Image preview={false} className="drive-thumb" src={item.blob} />
                    )}
                    {item.type === 'file' && item.blob && fileType === 'video' && (
                      <div className="drive-video-thumb">
                        <img className="drive-thumb" src={item.blob} />
                        <PlayCircleOutlined className="drive-video-play" />
                      </div>
                    )}
                    {item.type === 'file' && !item.blob && fileType === 'image' && <FileImageOutlined className="drive-file-icon" />}
                    {item.type === 'file' && !item.blob && fileType === 'video' && <PlayCircleOutlined className="drive-file-icon" />}
                    {item.type === 'file' && fileType !== 'image' && fileType !== 'video' && fileType !== 'text' && (
                      <FileOutlined className="drive-file-icon" />
                    )}
                    {item.type === 'file' && fileType === 'text' && <FileTextOutlined className="drive-file-icon" />}
                  </div>

                  <Space direction="vertical" size={6} className="drive-card-meta">
                    <Tooltip title={displayName}>
                      <div className="drive-card-name">
                        {displayName}
                      </div>
                    </Tooltip>
                    <div className="drive-card-time">
                      {item.updateTime?.slice(0, 16)}
                    </div>
                  </Space>

                  <div className="drive-card-actions">
                    <Tooltip title="预览/打开">
                      <Button
                        className="drive-card-action-btn"
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={(event) => {
                          event.stopPropagation();
                          openFolderOrFile(item);
                        }}
                      />
                    </Tooltip>
                    {item.type === 'file' && (
                      <Tooltip title="下载">
                        <Button
                          className="drive-card-action-btn"
                          size="small"
                          icon={<DownloadOutlined />}
                          onClick={(event) => {
                            event.stopPropagation();
                            downloadFile(item);
                          }}
                        />
                      </Tooltip>
                    )}
                    <Tooltip title="删除">
                      <Button
                        className="drive-card-action-btn"
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={(event) => {
                          event.stopPropagation();
                          removeFile(item);
                        }}
                      />
                    </Tooltip>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Modal
        open={creatingFolder}
        title="新建文件夹"
        onOk={createFolder}
        onCancel={() => setCreatingFolder(false)}
        maskClosable={false}
      >
        <Input
          value={newFolderName}
          placeholder="请输入文件夹名称"
          onChange={(event) => setNewFolderName(event.target.value)}
        />
      </Modal>

      <StreamingVideoPlayer
        open={videoOpen}
        data={videoList}
        index={videoIndex}
        sourceType="drive"
        onClose={() => setVideoOpen(false)}
      />
      <Modal
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

      <input
        ref={fileInputRef}
        type="file"
        multiple
        style={{ display: 'none' }}
        onChange={(event) => {
          const files = Array.from(event.target.files ?? []);
          uploadFiles(files);
          event.target.value = '';
        }}
      />
      <input
        ref={directoryInputRef}
        type="file"
        multiple
        style={{ display: 'none' }}
        onChange={(event) => {
          const files = Array.from(event.target.files ?? []);
          uploadFiles(files);
          event.target.value = '';
        }}
      />
    </div>
  );
};

export default DrivePage;
