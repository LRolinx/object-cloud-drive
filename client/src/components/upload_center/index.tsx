import { CloudUploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { Badge, Button, Drawer, FloatButton, List, Progress, Space, Tag, Typography } from 'antd';
import { useMemo, useState } from 'react';

import { clearFinishedUploadTasks, removeUploadTask, useUploadStore } from '@/store/upload';
import { UploadType } from '@/types/UploadType';

const renderStatus = (uploadType?: number) => {
  switch (uploadType) {
    case UploadType.Waiting:
      return <Tag>等待中</Tag>;
    case UploadType.Checkout:
      return <Tag color="processing">校验中</Tag>;
    case UploadType.Prepare:
      return <Tag color="processing">准备中</Tag>;
    case UploadType.Exist:
      return <Tag color="warning">文件已存在</Tag>;
    case UploadType.Small:
      return <Tag color="error">文件太小</Tag>;
    case UploadType.Big:
      return <Tag color="error">文件太大</Tag>;
    case UploadType.Fast:
      return <Tag color="success">秒传完成</Tag>;
    case UploadType.Conduct:
      return <Tag color="processing">上传中</Tag>;
    case UploadType.Success:
      return <Tag color="success">上传完成</Tag>;
    case UploadType.Error:
      return <Tag color="error">上传失败</Tag>;
    default:
      return <Tag>未知状态</Tag>;
  }
};

const filebyteToText = (byte: number) => {
  if (byte < 1024) return `${byte} B`;
  if (byte < 1024 * 1024) return `${(byte / 1024).toFixed(2)} KB`;
  if (byte < 1024 * 1024 * 1024) return `${(byte / 1024 / 1024).toFixed(2)} MB`;
  return `${(byte / 1024 / 1024 / 1024).toFixed(2)} GB`;
};

export const UploadCenter = () => {
  const { tasks } = useUploadStore();
  const [open, setOpen] = useState(false);

  const activeCount = useMemo(
    () =>
      tasks.filter((task) =>
        [UploadType.Waiting, UploadType.Checkout, UploadType.Prepare, UploadType.Conduct].includes(
          task.uploadType
        )
      ).length,
    [tasks]
  );

  return (
    <>
      <Badge count={activeCount} overflowCount={999}>
        <FloatButton
          className="upload-center-float-button"
          icon={<CloudUploadOutlined />}
          onClick={() => setOpen(true)}
          style={{ right: 32 }}
        />
      </Badge>

      <Drawer
        className="upload-center-drawer"
        open={open}
        title="上传任务"
        width={440}
        onClose={() => setOpen(false)}
        extra={
          <Button size="small" onClick={clearFinishedUploadTasks}>
            清理已完成
          </Button>
        }
      >
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
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <Typography.Text strong ellipsis>
                    {task.fname}.{task.fext}
                  </Typography.Text>
                  {renderStatus(task.uploadType)}
                </div>
                <Typography.Text type="secondary">{filebyteToText(task.fileSize)}</Typography.Text>
                <Progress percent={Math.min(100, Math.max(0, Math.round(task.progress ?? 0)))} />
                {task.errorMessage && <Typography.Text type="danger">{task.errorMessage}</Typography.Text>}
              </Space>
            </List.Item>
          )}
        />
      </Drawer>
    </>
  );
};
