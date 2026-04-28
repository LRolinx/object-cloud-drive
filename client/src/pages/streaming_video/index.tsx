import { Card, Typography } from 'antd';

const StreamingVideoDemoPage = () => {
  return (
    <div style={{ padding: 32, width: '100%' }}>
      <Card>
        <Typography.Title level={4}>视频流 DEMO</Typography.Title>
        <Typography.Paragraph>
          旧客户端这里主要用来调试流媒体组件。当前版本先保留入口，正式播放能力已经集成在云盘页和资源池页里。
        </Typography.Paragraph>
      </Card>
    </div>
  );
};

export default StreamingVideoDemoPage;
