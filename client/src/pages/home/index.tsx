import { CloudOutlined, DatabaseOutlined, LogoutOutlined, PlaySquareOutlined } from '@ant-design/icons';
import { Avatar, Button, Modal, Space, Typography, message } from 'antd';
import { ChangeEvent, MouseEvent as ReactMouseEvent, memo, useEffect, useMemo, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import './index.less';
import { clearUserState, getUserState, setUserState } from '@/store/user';
import { resetDriveNavigation } from '@/store/drive';
import { clearSessionRoute, getSectionSessionRoute, rememberSessionRoute, SessionSection } from '@/store/session_route';
import { UploadCenter } from '@/components/upload_center';
import { updateavatarapi } from '@/api/user';

const menuItems = [
  { key: '/home/drive', section: 'drive' as SessionSection, label: '我的云盘', icon: <CloudOutlined /> },
  { key: '/home/driveResourcePool', section: 'resourcePool' as SessionSection, label: '资源池', icon: <DatabaseOutlined /> },
  { key: '/home/streamingVideo', section: 'streamingVideo' as SessionSection, label: '视频流DEMO', icon: <PlaySquareOutlined /> },
];

const isMenuActive = (pathname: string, menuKey: string) => pathname === menuKey || pathname.startsWith(`${menuKey}/`);

const AVATAR_CANVAS_WIDTH = 420;
const AVATAR_CANVAS_HEIGHT = 300;

type AvatarCrop = {
  x: number;
  y: number;
  size: number;
};

type AvatarDrawInfo = {
  offsetX: number;
  offsetY: number;
  drawWidth: number;
  drawHeight: number;
  scale: number;
};

export default memo(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const cropCanvasRef = useRef<HTMLCanvasElement>(null);
  const cropImageRef = useRef<HTMLImageElement | null>(null);
  const cropDrawInfoRef = useRef<AvatarDrawInfo | null>(null);
  const cropDragRef = useRef<{
    mode: 'move' | 'resize';
    corner?: 'nw' | 'ne' | 'sw' | 'se';
    startX: number;
    startY: number;
    startCrop: AvatarCrop;
  } | null>(null);
  const [userVersion, setUserVersion] = useState(0);
  const [avatarCropOpen, setAvatarCropOpen] = useState(false);
  const [avatarSource, setAvatarSource] = useState('');
  const [avatarCrop, setAvatarCrop] = useState<AvatarCrop>({ x: 90, y: 30, size: 240 });
  const user = useMemo(() => getUserState(), [location.pathname, userVersion]);

  const logout = () => {
    clearSessionRoute(user.id);
    clearUserState();
    resetDriveNavigation();
    navigate('/login', { replace: true });
  };

  useEffect(() => {
    rememberSessionRoute(user.id, location.pathname);
  }, [location.pathname, user.id]);

  const readAvatarFile = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error('图片读取失败'));
      reader.readAsDataURL(file);
    });

  const getAvatarDrawInfo = (image: HTMLImageElement): AvatarDrawInfo => {
    const scale = Math.min(AVATAR_CANVAS_WIDTH / image.naturalWidth, AVATAR_CANVAS_HEIGHT / image.naturalHeight);
    const drawWidth = image.naturalWidth * scale;
    const drawHeight = image.naturalHeight * scale;
    return {
      offsetX: (AVATAR_CANVAS_WIDTH - drawWidth) / 2,
      offsetY: (AVATAR_CANVAS_HEIGHT - drawHeight) / 2,
      drawWidth,
      drawHeight,
      scale,
    };
  };

  const clampAvatarCrop = (crop: AvatarCrop, info = cropDrawInfoRef.current): AvatarCrop => {
    if (!info) {
      return crop;
    }
    const minSize = 72;
    const maxSize = Math.min(info.drawWidth, info.drawHeight);
    const size = Math.min(Math.max(crop.size, minSize), maxSize);
    const x = Math.min(Math.max(crop.x, info.offsetX), info.offsetX + info.drawWidth - size);
    const y = Math.min(Math.max(crop.y, info.offsetY), info.offsetY + info.drawHeight - size);
    return { x, y, size };
  };

  const drawAvatarCrop = () => {
    const canvas = cropCanvasRef.current;
    const image = cropImageRef.current;
    if (!canvas || !image) {
      return;
    }
    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    const info = getAvatarDrawInfo(image);
    cropDrawInfoRef.current = info;
    const crop = clampAvatarCrop(avatarCrop, info);
    if (crop.x !== avatarCrop.x || crop.y !== avatarCrop.y || crop.size !== avatarCrop.size) {
      setAvatarCrop(crop);
      return;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#0f172a';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, info.offsetX, info.offsetY, info.drawWidth, info.drawHeight);

    context.fillStyle = 'rgba(2, 6, 23, 0.58)';
    context.fillRect(0, 0, canvas.width, crop.y);
    context.fillRect(0, crop.y + crop.size, canvas.width, canvas.height - crop.y - crop.size);
    context.fillRect(0, crop.y, crop.x, crop.size);
    context.fillRect(crop.x + crop.size, crop.y, canvas.width - crop.x - crop.size, crop.size);

    context.strokeStyle = 'rgba(255, 255, 255, 0.95)';
    context.lineWidth = 2;
    context.strokeRect(crop.x + 1, crop.y + 1, crop.size - 2, crop.size - 2);
    context.strokeStyle = 'rgba(139, 147, 255, 0.88)';
    context.lineWidth = 1;
    context.strokeRect(crop.x + 6, crop.y + 6, crop.size - 12, crop.size - 12);

    const handleSize = 14;
    context.fillStyle = '#fff';
    context.strokeStyle = '#8b93ff';
    context.lineWidth = 2;
    [
      [crop.x, crop.y],
      [crop.x + crop.size, crop.y],
      [crop.x, crop.y + crop.size],
      [crop.x + crop.size, crop.y + crop.size],
    ].forEach(([x, y]) => {
      context.beginPath();
      context.roundRect(x - handleSize / 2, y - handleSize / 2, handleSize, handleSize, 4);
      context.fill();
      context.stroke();
    });
  };

  useEffect(() => {
    if (!avatarSource) {
      cropImageRef.current = null;
      return;
    }
    const image = new Image();
    image.onload = () => {
      const info = getAvatarDrawInfo(image);
      cropImageRef.current = image;
      cropDrawInfoRef.current = info;
      const size = Math.min(info.drawWidth, info.drawHeight) * 0.72;
      setAvatarCrop({
        x: info.offsetX + (info.drawWidth - size) / 2,
        y: info.offsetY + (info.drawHeight - size) / 2,
        size,
      });
    };
    image.onerror = () => message.error('图片读取失败');
    image.src = avatarSource;
  }, [avatarSource]);

  useEffect(() => {
    drawAvatarCrop();
  }, [avatarCrop, avatarSource]);

  const getCanvasPoint = (event: ReactMouseEvent<HTMLCanvasElement>) => {
    const canvas = cropCanvasRef.current;
    if (!canvas) {
      return { x: 0, y: 0 };
    }
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const handleCropPointerDown = (event: ReactMouseEvent<HTMLCanvasElement>) => {
    const point = getCanvasPoint(event);
    const resizeHotArea = 24;
    const corners = [
      { key: 'nw' as const, x: avatarCrop.x, y: avatarCrop.y },
      { key: 'ne' as const, x: avatarCrop.x + avatarCrop.size, y: avatarCrop.y },
      { key: 'sw' as const, x: avatarCrop.x, y: avatarCrop.y + avatarCrop.size },
      { key: 'se' as const, x: avatarCrop.x + avatarCrop.size, y: avatarCrop.y + avatarCrop.size },
    ];
    const activeCorner = corners.find(
      (corner) => Math.abs(point.x - corner.x) <= resizeHotArea && Math.abs(point.y - corner.y) <= resizeHotArea
    )?.key;
    const insideCrop =
      point.x >= avatarCrop.x &&
      point.x <= avatarCrop.x + avatarCrop.size &&
      point.y >= avatarCrop.y &&
      point.y <= avatarCrop.y + avatarCrop.size;

    if (!insideCrop && !activeCorner) {
      return;
    }

    cropDragRef.current = {
      mode: activeCorner ? 'resize' : 'move',
      corner: activeCorner,
      startX: point.x,
      startY: point.y,
      startCrop: avatarCrop,
    };
  };

  const handleCropPointerMove = (event: ReactMouseEvent<HTMLCanvasElement>) => {
    const drag = cropDragRef.current;
    if (!drag) {
      return;
    }
    const point = getCanvasPoint(event);
    const deltaX = point.x - drag.startX;
    const deltaY = point.y - drag.startY;
    if (drag.mode === 'move') {
      setAvatarCrop(clampAvatarCrop({ ...drag.startCrop, x: drag.startCrop.x + deltaX, y: drag.startCrop.y + deltaY }));
      return;
    }
    const growMap = {
      nw: Math.max(-deltaX, -deltaY),
      ne: Math.max(deltaX, -deltaY),
      sw: Math.max(-deltaX, deltaY),
      se: Math.max(deltaX, deltaY),
    };
    const corner = drag.corner || 'se';
    const nextSize = drag.startCrop.size + growMap[corner];
    const nextCrop = {
      ...drag.startCrop,
      size: nextSize,
      x: corner === 'nw' || corner === 'sw' ? drag.startCrop.x + drag.startCrop.size - nextSize : drag.startCrop.x,
      y: corner === 'nw' || corner === 'ne' ? drag.startCrop.y + drag.startCrop.size - nextSize : drag.startCrop.y,
    };
    setAvatarCrop(clampAvatarCrop(nextCrop));
  };

  const handleCropPointerUp = () => {
    cropDragRef.current = null;
  };

  const cropAvatarAsBase64 = () => {
    const image = cropImageRef.current;
    const info = cropDrawInfoRef.current;
    if (!image || !info) {
      throw new Error('请先选择头像图片');
    }

    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('无法处理头像');
    }

    const crop = clampAvatarCrop(avatarCrop, info);
    const sourceX = (crop.x - info.offsetX) / info.scale;
    const sourceY = (crop.y - info.offsetY) / info.scale;
    const sourceSize = crop.size / info.scale;
    context.fillStyle = '#fff';
    context.fillRect(0, 0, size, size);
    context.drawImage(image, sourceX, sourceY, sourceSize, sourceSize, 0, 0, size, size);
    return canvas.toDataURL('image/jpeg', 0.88);
  };

  const updateAvatar = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) {
      return;
    }
    if (!file.type.startsWith('image/')) {
      message.warning('请选择图片文件');
      return;
    }
    if (!user.id) {
      message.warning('请先登录');
      return;
    }

    try {
      const photo = await readAvatarFile(file);
      setAvatarSource(photo);
      setAvatarCropOpen(true);
    } catch (error) {
      message.error(error instanceof Error ? error.message : '图片读取失败');
    }
  };

  const confirmAvatarCrop = async () => {
    try {
      const photo = cropAvatarAsBase64();
      const response = await updateavatarapi(user.id, photo);
      const { code, message: msg } = response.data;
      if (code !== 200) {
        message.error(msg);
        return;
      }
      setUserState({ photo });
      setUserVersion((version) => version + 1);
      setAvatarCropOpen(false);
      setAvatarSource('');
      message.success(msg);
    } catch (error) {
      message.error(error instanceof Error ? error.message : '头像更新失败');
    }
  };

  return (
    <div className="home">
      <div className="main">
        <div className="siderbar">
          <div className="logo">
            <p>对象云盘</p>
          </div>

          <ul className="siderbarUl">
            {menuItems.map((item) => {
              const active = isMenuActive(location.pathname, item.key);
              return (
                <li
                  key={item.key}
                  className={active ? 'liOn' : ''}
                  onClick={() => navigate(getSectionSessionRoute(user.id, item.section))}
                >
                  {item.icon}
                  <p>{item.label}</p>
                </li>
              );
            })}
          </ul>

          <div className="headBox">
            <div className="headChildBox">
              <button className="avatarButton" type="button" onClick={() => setAvatarCropOpen(true)}>
                <Avatar src={user.photo || undefined}>{user.nickname?.slice(0, 1) || 'U'}</Avatar>
              </button>
              <input ref={avatarInputRef} className="avatarInput" type="file" accept="image/*" onChange={updateAvatar} />
              <p className="userName">{user.nickname || '未登录用户'}</p>
              <Button type="text" icon={<LogoutOutlined />} onClick={logout} />
            </div>
          </div>
        </div>

        <div className="content">
          <Outlet />
        </div>
      </div>
      <UploadCenter />
      <Modal
        open={avatarCropOpen}
        title="头像设置"
        okText="保存头像"
        cancelText="取消"
        onOk={confirmAvatarCrop}
        onCancel={() => {
          setAvatarCropOpen(false);
          setAvatarSource('');
        }}
        okButtonProps={{ disabled: !avatarSource }}
        maskClosable={false}
        destroyOnClose
      >
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          {avatarSource ? (
            <div className="avatarCropCanvasWrap">
              <canvas
                ref={cropCanvasRef}
                className="avatarCropCanvas"
                width={AVATAR_CANVAS_WIDTH}
                height={AVATAR_CANVAS_HEIGHT}
                onMouseDown={handleCropPointerDown}
                onMouseMove={handleCropPointerMove}
                onMouseUp={handleCropPointerUp}
                onMouseLeave={handleCropPointerUp}
              />
              <Typography.Text type="secondary">
                拖动裁剪框移动头像，拖动四角白色方块调整大小，比例会保持正方形。
              </Typography.Text>
            </div>
          ) : (
            <div className="avatarCropEmpty">
              <Typography.Text type="secondary">先选择一张图片，然后在画布上裁剪头像区域。</Typography.Text>
            </div>
          )}
          <Button onClick={() => avatarInputRef.current?.click()}>
            {avatarSource ? '重新选择图片' : '选择图片'}
          </Button>
        </Space>
      </Modal>
    </div>
  );
});
