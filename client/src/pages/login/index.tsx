import { Button, Card, Checkbox, Form, Input, Space, Typography, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { invoke } from '@tauri-apps/api';

import { VerificationCodeInput } from '@/components/verification_code_input';
import { loginapi, registeredapi } from '@/api/user';
import MathTools from '@/utils/MathTools';
import { getUserState, setUserState } from '@/store/user';

const ACCOUNT_STORAGE_KEY = 'object-cloud-account';
const PASSWORD_STORAGE_KEY = 'object-cloud-password';

const encodeRememberValue = (value: string) => {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return window.btoa(binary);
};

const decodeUtf8Base64 = (value: string) => {
  const binary = window.atob(value);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

const decodeLegacyRememberValue = (value: string) =>
  window.atob(window.atob(value.replace(/s\+/g, '=').replace(/··/g, '=')));

const decodeRememberValue = (value: string) => {
  try {
    return decodeUtf8Base64(value);
  } catch {
    try {
      return decodeLegacyRememberValue(value);
    } catch {
      return null;
    }
  }
};

export const LoginPage = () => {
  const navigate = useNavigate();
  const [loginForm] = Form.useForm<Account.LoginTo>();
  const [registeredForm] = Form.useForm();
  const [isRegistered, setIsRegistered] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const currentUser = useMemo(() => getUserState(), []);

  useEffect(() => {
    invoke('show_win');
    if (currentUser.isLogin) {
      navigate('/home/drive', { replace: true });
    }

    const account = localStorage.getItem(ACCOUNT_STORAGE_KEY);
    const password = localStorage.getItem(PASSWORD_STORAGE_KEY);
    if (account && password) {
      const decodedAccount = decodeRememberValue(account);
      const decodedPassword = decodeRememberValue(password);
      if (decodedAccount === null || decodedPassword === null) {
        localStorage.removeItem(ACCOUNT_STORAGE_KEY);
        localStorage.removeItem(PASSWORD_STORAGE_KEY);
        setRememberMe(false);
        return;
      }

      setRememberMe(true);
      loginForm.setFieldsValue({
        username: decodedAccount,
        password: decodedPassword,
      });
    }
  }, [currentUser.isLogin, loginForm, navigate]);

  const onLogin = async (values: Account.LoginTo) => {
    const account = values.username?.trim() ?? '';
    const password = values.password?.trim() ?? '';
    if (!account || !password) {
      message.warning('用户名和密码不能为空');
      return;
    }

    const response = await loginapi(MathTools.encryptForKey(account), MathTools.encryptForKey(password));
    const { code, message: msg, data } = response.data;
    if (code !== 200) {
      message.error(msg);
      return;
    }

    if (rememberMe) {
      localStorage.setItem(ACCOUNT_STORAGE_KEY, encodeRememberValue(account));
      localStorage.setItem(PASSWORD_STORAGE_KEY, encodeRememberValue(password));
    } else {
      localStorage.removeItem(ACCOUNT_STORAGE_KEY);
      localStorage.removeItem(PASSWORD_STORAGE_KEY);
    }

    setUserState({
      isLogin: true,
      id: data.userUuid,
      photo: data.photo,
      nickname: data.nickName,
    });
    message.success(msg);
    navigate('/home/drive', { replace: true });
  };

  const onRegistered = async (values: any) => {
    const { nickName, account, password, confirmPassword, registeredCode } = values;
    if (!nickName?.trim() || !account?.trim() || !password?.trim() || !registeredCode?.trim()) {
      message.warning('请完善注册信息');
      return;
    }
    if (password !== confirmPassword) {
      message.warning('确认密码和密码不相同');
      return;
    }

    const response = await registeredapi(
      nickName.trim(),
      MathTools.encryptForKey(account.trim()),
      MathTools.encryptForKey(password.trim()),
      registeredCode.trim()
    );
    const { code, message: msg } = response.data;
    if (code !== 200) {
      message.error(msg);
      return;
    }
    message.success(msg);
    registeredForm.resetFields();
    setIsRegistered(false);
  };

  return (
    <div className="login-page">
      <Card style={{ width: 420, borderRadius: 20, boxShadow: '0 20px 60px rgba(41,61,125,0.12)' }}>
        <Space direction="vertical" size={20} style={{ width: '100%' }}>
          <div>
            <Typography.Title level={3} style={{ marginBottom: 4 }}>
              {isRegistered ? '注册对象云盘' : '登录对象云盘'}
            </Typography.Title>
            <Typography.Text type="secondary">
              {isRegistered ? '使用旧客户端的注册逻辑完成初始化' : '继续进入我的云盘'}
            </Typography.Text>
          </div>

          {!isRegistered && (
            <Form form={loginForm} layout="vertical" onFinish={onLogin}>
              <Form.Item name="username" label="用户名" rules={[{ required: true, message: '请输入用户名' }]}>
                <Input placeholder="用户名" />
              </Form.Item>
              <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码' }]}>
                <Input.Password placeholder="密码" />
              </Form.Item>
              <Form.Item>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Checkbox checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)}>
                    记住账号和密码
                  </Checkbox>
                  <a onClick={() => setIsRegistered(true)}>注册账号</a>
                </div>
              </Form.Item>
              <Button type="primary" htmlType="submit" block>
                立即登录
              </Button>
            </Form>
          )}

          {isRegistered && (
            <Form form={registeredForm} layout="vertical" onFinish={onRegistered}>
              <Form.Item name="nickName" label="昵称" rules={[{ required: true, message: '请输入昵称' }]}>
                <Input placeholder="昵称" maxLength={32} />
              </Form.Item>
              <Form.Item name="account" label="用户名" rules={[{ required: true, message: '请输入用户名' }]}>
                <Input placeholder="用户名" maxLength={32} />
              </Form.Item>
              <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码' }]}>
                <Input.Password placeholder="密码" maxLength={32} />
              </Form.Item>
              <Form.Item name="confirmPassword" label="确认密码" rules={[{ required: true, message: '请再次输入密码' }]}>
                <Input.Password placeholder="确认密码" maxLength={32} />
              </Form.Item>
              <Form.Item name="registeredCode" label="注册码" rules={[{ required: true, message: '请输入注册码' }]}>
                <VerificationCodeInput maxLength={6} placeholder="注册码" />
              </Form.Item>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button type="primary" htmlType="submit" block>
                  立即注册
                </Button>
                <Button block onClick={() => setIsRegistered(false)}>
                  返回登录
                </Button>
              </Space>
            </Form>
          )}
        </Space>
      </Card>
    </div>
  );
};
