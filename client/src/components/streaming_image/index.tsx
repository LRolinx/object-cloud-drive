import { Modal } from 'antd';

type Props = {
  open?: boolean;
  src?: string;
  onClose?: () => void;
};

export const StreamingImage = ({ open = false, src, onClose }: Props) => {
  return (
    <Modal open={open} width="80vw" title="图片预览" footer={null} onCancel={onClose} maskClosable={false}>
      {src ? (
        <img src={src} style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain' }} />
      ) : (
        <div>暂无图片</div>
      )}
    </Modal>
  );
};
