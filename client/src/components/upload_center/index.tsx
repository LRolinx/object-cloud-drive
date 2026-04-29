import { CloudDownloadOutlined, CloudUploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { Badge, Button, Drawer, FloatButton, List, Progress, Space, Tabs, Tag, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';

import {
  clearFinishedUploadTasks,
  DownloadTaskStatus,
  removeDownloadTask,
  removeUploadTask,
  useUploadStore,
} from '@/store/upload';
import { UploadType } from '@/types/UploadType';

const renderStatus = (uploadType?: number) => {
  switch (uploadType) {
    case UploadType.Waiting:
      return <Tag className="transfer-status-tag">等待中</Tag>;
    case UploadType.Checkout:
      return <Tag className="transfer-status-tag" color="processing">校验中</Tag>;
    case UploadType.Prepare:
      return <Tag className="transfer-status-tag" color="processing">准备中</Tag>;
    case UploadType.Exist:
      return <Tag className="transfer-status-tag" color="warning">文件已存在</Tag>;
    case UploadType.Small:
      return <Tag className="transfer-status-tag" color="error">文件太小</Tag>;
    case UploadType.Big:
      return <Tag className="transfer-status-tag" color="error">文件太大</Tag>;
    case UploadType.Fast:
      return <Tag className="transfer-status-tag" color="success">秒传完成</Tag>;
    case UploadType.Conduct:
      return <Tag className="transfer-status-tag" color="processing">上传中</Tag>;
    case UploadType.Success:
      return <Tag className="transfer-status-tag" color="success">上传完成</Tag>;
    case UploadType.Error:
      return <Tag className="transfer-status-tag" color="error">上传失败</Tag>;
    default:
      return <Tag className="transfer-status-tag">未知状态</Tag>;
  }
};

const filebyteToText = (byte: number) => {
  if (byte < 1024) return `${byte} B`;
  if (byte < 1024 * 1024) return `${(byte / 1024).toFixed(2)} KB`;
  if (byte < 1024 * 1024 * 1024) return `${(byte / 1024 / 1024).toFixed(2)} MB`;
  return `${(byte / 1024 / 1024 / 1024).toFixed(2)} GB`;
};

const renderSpeed = (speed?: number) => {
  if (!speed || speed <= 0) {
    return '0 B/s';
  }
  return `${filebyteToText(speed)}/s`;
};

const renderDownloadStatus = (status: DownloadTaskStatus) => {
  switch (status) {
    case DownloadTaskStatus.Waiting:
      return <Tag className="transfer-status-tag">等待中</Tag>;
    case DownloadTaskStatus.Conduct:
      return <Tag className="transfer-status-tag" color="processing">下载中</Tag>;
    case DownloadTaskStatus.Success:
      return <Tag className="transfer-status-tag" color="success">下载完成</Tag>;
    case DownloadTaskStatus.Error:
      return <Tag className="transfer-status-tag" color="error">下载失败</Tag>;
    default:
      return <Tag className="transfer-status-tag">未知状态</Tag>;
  }
};

const getUploadFileName = (fname: string, fext: string) => `${fname}${fext ? `.${fext}` : ''}`;

export const UploadCenter = () => {
  const { tasks, downloadTasks } = useUploadStore();
  const [open, setOpen] = useState(false);

  const activeUploadCount = useMemo(
    () =>
      tasks.filter((task) =>
        [UploadType.Waiting, UploadType.Checkout, UploadType.Prepare, UploadType.Conduct].includes(
          task.uploadType
        )
      ).length,
    [tasks]
  );
  const activeDownloadCount = useMemo(
    () => downloadTasks.filter((task) => [DownloadTaskStatus.Waiting, DownloadTaskStatus.Conduct].includes(task.status)).length,
    [downloadTasks]
  );
  const activeCount = activeUploadCount + activeDownloadCount;
  const failedCount = useMemo(
    () =>
      tasks.filter((task) => task.uploadType === UploadType.Error || task.errorMessage).length +
      downloadTasks.filter((task) => task.status === DownloadTaskStatus.Error || task.errorMessage).length,
    [downloadTasks, tasks]
  );

  useEffect(() => {
    if (!activeCount) {
      return undefined;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '上传或下载任务仍在进行中，刷新页面会中断当前任务。';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [activeCount]);

  return (
    <>
      <Badge count={activeCount} overflowCount={999} title="进行中的传输任务">
        <Badge count={failedCount} overflowCount={99} color="red" offset={[-2, 34]} title="失败的传输任务">
          <FloatButton
            className={`upload-center-float-button${activeCount ? ' upload-center-float-button-active' : ''}`}
            icon={<CloudUploadOutlined />}
            onClick={() => setOpen(true)}
            style={{ right: 32 }}
          />
        </Badge>
      </Badge>

      <Drawer
        className="upload-center-drawer"
        open={open}
        title="传输任务"
        width={440}
        onClose={() => setOpen(false)}
        extra={
          <Button size="small" onClick={clearFinishedUploadTasks}>
            清理已完成
          </Button>
        }
      >
        <Tabs
          items={[
            {
              key: 'upload',
              label: (
                <Space size={6}>
                  <CloudUploadOutlined />
                  上传
                  <Badge count={activeUploadCount} size="small" />
                </Space>
              ),
              children: (
                <List
                  dataSource={tasks.slice().reverse()}
                  locale={{ emptyText: '没有上传任务' }}
                  renderItem={(task) => (
                    <List.Item
                      actions={[
                        <Button
                          key="remove"
                          type="text"
                          icon={<DeleteOutlined />}
                          onClick={() => task.taskId && removeUploadTask(task.taskId)}
                        />,
                      ]}
                    >
                      <Space direction="vertical" style={{ width: '100%' }} size={6}>
                        <div className="transfer-task-header">
                          <Typography.Text className="transfer-task-name" strong ellipsis>
                            {getUploadFileName(task.fname, task.fext)}
                          </Typography.Text>
                          {renderStatus(task.uploadType)}
                        </div>
                        <Typography.Text type="secondary">
                          {filebyteToText(task.uploadedBytes ?? 0)} / {filebyteToText(task.fileSize)}
                          {' · '}
                          {renderSpeed(task.speedBytesPerSecond)}
                        </Typography.Text>
                        <Progress percent={Math.min(100, Math.max(0, Math.round(task.progress ?? 0)))} />
                        {task.statusText && <Typography.Text type="secondary">{task.statusText}</Typography.Text>}
                        {task.errorMessage && <Typography.Text type="danger">{task.errorMessage}</Typography.Text>}
                      </Space>
                    </List.Item>
                  )}
                />
              ),
            },
            {
              key: 'download',
              label: (
                <Space size={6}>
                  <CloudDownloadOutlined />
                  下载
                  <Badge count={activeDownloadCount} size="small" />
                </Space>
              ),
              children: (
                <List
                  dataSource={downloadTasks.slice().reverse()}
                  locale={{ emptyText: '没有下载任务' }}
                  renderItem={(task) => (
                    <List.Item
                      actions={[
                        <Button
                          key="remove"
                          type="text"
                          icon={<DeleteOutlined />}
                          onClick={() => removeDownloadTask(task.taskId)}
                        />,
                      ]}
                    >
                      <Space direction="vertical" style={{ width: '100%' }} size={6}>
                        <div className="transfer-task-header">
                          <Typography.Text className="transfer-task-name" strong ellipsis>
                            {task.fileName}
                          </Typography.Text>
                          {renderDownloadStatus(task.status)}
                        </div>
                        <Typography.Text type="secondary">
                          {filebyteToText(task.downloadedBytes)} / {filebyteToText(task.fileSize)}
                          {' · '}
                          {renderSpeed(task.speedBytesPerSecond)}
                        </Typography.Text>
                        <Progress percent={Math.min(100, Math.max(0, Math.round(task.progress ?? 0)))} />
                        {task.statusText && <Typography.Text type="secondary">{task.statusText}</Typography.Text>}
                        {task.errorMessage && <Typography.Text type="danger">{task.errorMessage}</Typography.Text>}
                      </Space>
                    </List.Item>
                  )}
                />
              ),
            },
          ]}
        />
      </Drawer>
    </>
  );
};
