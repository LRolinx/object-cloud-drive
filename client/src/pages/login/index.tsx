/**
 * <p>
 * 登录页
 * </p>
 *
 * @version: v1.0
 * @author: Clover
 * @create: 2022-11-25 11:42
 */
import { memo, useContext, useEffect, useState } from 'react'
import { Button, Checkbox, Col, Form, theme, Input, Row } from 'antd'
import { ValidateStatus } from 'antd/es/form/FormItem'
import { useIntl, FormattedMessage } from 'react-intl'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { invoke } from '@tauri-apps/api'

import * as StringUtils from '@/utils/StringUtils'
import { InjectContextProvider } from '@/components/InjectContextProvider'
import { ValidateErrorEntity } from '@/types/antd'

export const LoginPage = memo((p, c) => {

  const [form] = Form.useForm<Account.LoginTo>()
  const intl = useIntl()
  const contextHolder = useContext(InjectContextProvider.Context) // 全局上下文
  const [validateStatus, setValidateStatus] = useState<{ [key in Account.LoginToKeys]: ValidateStatus }>({
    password: '',
    username: ''
  })
  const [errorMessageBoxState, setErrorMessageBoxState] = useState(false)

  const onFormFinishFailed = async (errorInfo: ValidateErrorEntity<Account.LoginTo>) => {
    let firstField
    if ((firstField = errorInfo.errorFields[0])) {
      if (firstField.errors[0]) {
        if (errorMessageBoxState) return
        setErrorMessageBoxState(true)
        contextHolder.message?.error(firstField.errors[0], () => {
          setErrorMessageBoxState(false)
        })

        setValidateStatus({
          ...validateStatus,
          [firstField.name[0]]: 'error'
        })
      }
    }
  }

  const clearValidateStatus = (field: Account.LoginToKeys) => {
    if (StringUtils.hasText(validateStatus[field])) {
      setValidateStatus({ ...validateStatus, [field]: '' })
    }
  }

  const onFinish = (value: Account.LoginTo) => {
  }

  const { token } = theme.useToken()

  useEffect(() => {
    // 页面挂载完成，显示窗口
    invoke('show_win')
  }, [])
  return <>
    <Form
      data-tauri-drag-region
      form={form}
      scrollToFirstError={true}
      labelCol={{ span: 2 }}
      onFinishFailed={onFormFinishFailed}
      autoComplete='off'
      onFinish={onFinish}
      style={{
        height: '100vh',
        width: '100vw',
        padding: 40,
        paddingTop: 100
      }}
    >
      <Form.Item
        name={'username'}
        validateStatus={validateStatus.username}
        rules={[{ required: true, message: intl.formatMessage({ id: 'pleaseInputYourUsername' }) }]}
      >
        <Input
          prefix={<UserOutlined style={{ color: token.colorTextPlaceholder }} />}
          placeholder={intl.formatMessage({ id: 'username' })}
          onChange={() => clearValidateStatus('username')}
        />
      </Form.Item>
      <Form.Item
        name={'password'}
        help={''}
        validateStatus={validateStatus.password}
        rules={[{ required: true, message: intl.formatMessage({ id: 'pleaseInputYourPassword' }) }]}
      >
        <Input.Password
          prefix={<LockOutlined style={{ color: token.colorTextPlaceholder }} />}
          onChange={() => clearValidateStatus('password')}
          autoComplete={'none'}
          placeholder={intl.formatMessage({ id: 'password' })}
        />
      </Form.Item>
      <Form.Item>
        <Row>
          <Col flex={1}>
            <Checkbox><FormattedMessage id={'rememberMe'} /></Checkbox>
          </Col>
          <Col>
            <Link to={'/forget'}><FormattedMessage id={'forgotThePassword'} /></Link>
          </Col>
        </Row>
      </Form.Item>
      <Button block htmlType={'submit'} type={'primary'} ><FormattedMessage id={'login'} /></Button>
    </Form>
  </>
})
