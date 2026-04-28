import { Modal } from 'antd';

type Props = {
  open?: boolean;
  src?: string;
  onClose?: () => void;
};

export const StreamingAudio = ({ open = false, src, onClose }: Props) => {
  return (
    <Modal open={open} title="音频预览" footer={null} onCancel={onClose} maskClosable={false}>
      {src ? <audio controls src={src} style={{ width: '100%' }} /> : <div>暂无音频</div>}
    </Modal>
  );
};
