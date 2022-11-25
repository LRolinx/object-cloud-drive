/**
 * <p>
 * 登录页
 * </p>
 *
 * @version: v1.0
 * @author: Clover
 * @create: 2022-11-25 11:42
 */
import { Button, Checkbox, Form, Input } from 'antd';
import { useContext } from 'react';
import { IntlProvider, FormattedMessage, useIntl } from 'react-intl';

export const LoginPage: React.FC = () => {
  const intl = useIntl()

  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return <>
    <Form
      data-tauri-drag-region
      name="basic"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      style={{
        height: '100vh',
        width: '100vw',
        padding: 40,
        paddingTop: 100
      }}
    >
      <Form.Item
        name="username"
        rules={[{ required: true, message: intl.formatMessage({ id: 'pleaseInputYourUsername' }) }]}
      >
        <Input placeholder={intl.formatMessage({id: 'username'})} />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[{ required: true, message: intl.formatMessage({ id: 'pleaseInputYourPassword' }) }]}
      >
        <Input.Password placeholder={intl.formatMessage({id: 'password'})} />
      </Form.Item>

      <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 0, span: 0 }}>
        <Checkbox><FormattedMessage id={'rememberMe'} /></Checkbox>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 0, span: 0 }}>
        <Button type="primary" htmlType="submit" block>
          <FormattedMessage id={'login'} />
        </Button>
      </Form.Item>
    </Form>
  </>
}
