// 18:23
import Footer from '@/components/Footer';
import {
  AlipayCircleOutlined,
  LockOutlined, MailOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormCaptcha,
  ProFormInstance,
  ProFormText,
} from '@ant-design/pro-components';
import {useEmotionCss} from '@ant-design/use-emotion-css';
import {FormattedMessage, history, SelectLang, useIntl, useModel, Helmet} from '@umijs/max';
import {Alert, Button, message, Tabs} from 'antd';
import Settings from '../../../../config/defaultSettings';
import React, {useRef, useState} from 'react';
import {loginUsingPOST, registerUsingPOST, sendEmailUsingPOST} from "@/services/alias-openapi-backend/userController";
import {flushSync} from "react-dom";

const ActionIcons = () => {
  const langClassName = useEmotionCss(({token}) => {
    return {
      marginLeft: '8px',
      color: 'rgba(0, 0, 0, 0.2)',
      fontSize: '24px',
      verticalAlign: 'middle',
      cursor: 'pointer',
      transition: 'color 0.3s',
      '&:hover': {
        color: token.colorPrimaryActive,
      },
    };
  });

  return (
    <>
      <AlipayCircleOutlined key="AlipayCircleOutlined" className={langClassName}/>
      <TaobaoCircleOutlined key="TaobaoCircleOutlined" className={langClassName}/>
      <WeiboCircleOutlined key="WeiboCircleOutlined" className={langClassName}/>
    </>
  );
};

const Lang = () => {
  const langClassName = useEmotionCss(({token}) => {
    return {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
    };
  });

  return (
    <div className={langClassName} data-lang>
      {SelectLang && <SelectLang/>}
    </div>
  );
};

const LoginMessage: React.FC<{
  content: string;
}> = ({content}) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};

const Login: React.FC = () => {
  const [userLoginState] = useState<API.LoginResult>({});
  const [type, setType] = useState<string>('account');
  const {setInitialState} = useModel('@@initialState');
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerForm, setRegisterForm] = useState<any>([])
  const [visible, setVisible] = useState(false);
  const formRef = useRef<ProFormInstance>();
  const [loginLoading, setLoginLoading] = useState(false)

  const containerClassName = useEmotionCss(() => {
    return {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    };
  });

  const intl = useIntl();
  const fetchUserInfo = (userInfo: API.UserVO) => {
    if (userInfo) {
      flushSync(() => {
        setInitialState({loginUser: userInfo});
      });
    }
  };


  /**
   * 跳转注册账号表单
   */
  const register = async () => {
    setType("register")
    setRegisterLoading(false)
  }

  /**
   * 延迟动画价值
   * @param time
   */
  const waitTime = (time: number = 100) => {
    return new Promise((resolve) => {
      setLoginLoading(true)
      setTimeout(() => {
        resolve(true);
      }, time);
    });
  };

  const handleSubmit = async (values: API.UserLoginRequest) => {
    try {
      // 登录
      const res = await loginUsingPOST({...values});
      if (res.message === 'ok') {
        const defaultLoginSuccessMessage = intl.formatMessage({
          id: 'pages.login.success',
          defaultMessage: '登录成功！',
        });
        setTimeout(100); // 下面是异步的更新方法，不能立即拿到登录信息，所以得到数据后等待100ms
        fetchUserInfo(res?.data)
        setInitialState({
          loginUser: res.data
        })
        message.success(defaultLoginSuccessMessage);
        // await fetchUserInfo();
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');

        // return;
      }
    } catch (error) {
      const defaultLoginFailureMessage = intl.formatMessage({
        id: 'pages.login.failure',
        defaultMessage: '登录失败，请重试！',
      });
      console.log(error);
      message.error(defaultLoginFailureMessage);
    }
  };
  const {status, type: loginType} = userLoginState;

  /**
   * 处理注册请求
   */
  const handleRegisterSubmit = async (values: API.UserRegisterRequest) => {
    try {
      setRegisterLoading(true)
      setRegisterForm(values)
      setVisible(false)
      setRegisterLoading(false)
      const res = await registerUsingPOST({...values})
      if (res.message === 'ok') {
        message.success("注册成功！")
        setType("account")
        //注册成功后重置表单
        formRef.current?.resetFields()
      } else {
        message.error(res.message);
      }
    } catch (error) {
    }
  }

  /**
   * 验证注册表单
   * @param values
   */
  const registerSubmit = async (values: any) => {
    setVisible(true)
    setRegisterLoading(true)
    setRegisterForm(values)
  }

  return (
    <div className={containerClassName}>
      <Helmet>
        <title>
          {intl.formatMessage({
            id: 'menu.login',
            defaultMessage: '登录页',
          })}
          - {Settings.title}
        </title>
      </Helmet>
      <Lang/>
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          formRef={formRef}
          logo={<img alt="logo" src="/logo.svg"/>}
          title="Alias-API开放平台"
          subTitle={intl.formatMessage({id: 'Ant Design 是西湖区最具影响力的 Web 设计规范'})}
          initialValues={{
            autoLogin: true,
          }}
          actions={[
            <FormattedMessage
              key="loginWith"
              id="pages.login.loginWith"
              defaultMessage="其他登录方式"
            />,
            <ActionIcons key="icons"/>,
          ]}
          onFinish={async (values) => {
            if (type === "register") {
              await handleRegisterSubmit(values as API.UserRegisterRequest)
            }
            await handleSubmit(values as API.UserLoginRequest);
          }}
          //自定义实现登录按钮
          submitter={{
            searchConfig: {
              resetText: '返回登录'
            },

            render: (props, doms) => {
              if (type === 'register') {
                return [
                  <Button type="default" onClick={() => {
                    setType('account')
                  }}>
                  返回登录
                  </Button>,
                  <Button type="primary" onClick={() => {
                  formRef.current?.submit()
                }} loading={registerLoading} style={{width: 230, height: 40, marginTop: 10, margin: "auto"}}>
                  立即注册
                </Button>
                ]
              } else return <Button type="primary" loading={loginLoading} onClick={() => {
                formRef.current?.submit()
              }} style={{width: '100%', height: 40, marginTop: 15}}>
                登录
              </Button>
            },
          }}
        >
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            items={[
              {
                key: 'account',
                label: intl.formatMessage({
                  id: 'pages.login.accountLogin.tab',
                  defaultMessage: '账户密码登录',
                }),
              },
            ]}
          />

          {status === 'error' && loginType === 'account' && (
            <LoginMessage
              content={intl.formatMessage({
                id: 'pages.login.accountLogin.errorMessage',
                defaultMessage: '账户或密码错误(admin/ant.design)',
              })}
            />
          )}
          {type === 'account' && (
            <>
              <ProFormText
                name="account"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined/>,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.username.placeholder',
                  defaultMessage: '账号/用户名',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.username.required"
                        defaultMessage="请输入账号或用户名!"
                      />
                    ),
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined/>,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.password.placeholder',
                  defaultMessage: '密码',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.password.required"
                        defaultMessage="请输入密码！"
                      />
                    ),
                  },
                ]}
              />
            </>
          )}

          {type === 'register' && (
            <>
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined/>,
                }}
                name="account"
                placeholder={'账号'}
                rules={[
                  {
                    required: true,
                    message: '请输入账号！',
                  },
                  {
                    min: 4,
                    message: '账号长度不能小于4'
                  }
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined/>,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.password.placeholder',
                  defaultMessage: '密码',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.password.required"
                        defaultMessage="请输入密码！"
                      />
                    ),
                  },
                  {
                    min: 6,
                    message: '密码长度不能小于6'
                  }
                ]}
              />
              <ProFormText.Password
                name="checkPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined/>,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.password.placeholder',
                  defaultMessage: '确认密码',
                })}
                rules={[
                  ({getFieldValue}) => ({
                    validator(rule, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve()
                      }
                      return Promise.reject("两次密码输入不一致")
                    }
                  })
                ]}
              />
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <MailOutlined className={'prefixIcon'}/>,
                }}
                name="email"
                placeholder={'邮箱'}
                rules={[
                  {
                    required: true,
                    message: '请输入邮箱！',
                  },
                  {
                    pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
                    message: '邮箱格式错误！',
                  },
                ]}
              />
              <ProFormCaptcha
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={'prefixIcon'}/>,
                }}
                captchaProps={{
                  size: 'large',
                }}
                placeholder={'请输入验证码'}
                captchaTextRender={(timing, count) => {
                  if (timing) {
                    return `${count} ${'后重新获取'}`;
                  }
                  return '获取验证码';
                }}
                name="code"
                phoneName="email"
                rules={[
                  {
                    required: true,
                    message: '请输入验证码！',
                  },
                ]}
                onGetCaptcha={async (email) => {
                  //获取验证成功后才会进行倒计时
                  try {
                    const result = await sendEmailUsingPOST({
                      email,
                    });
                    if (!result) {
                      return;
                    }
                    message.success(result.data);
                  } catch (e) {
                  }
                }}
              />
            </>
          )}

          <div
            style={{
              marginBottom: 24,
            }}
          >
            <a hidden={type === 'register'} style={{float: "left"}} onClick={register}>
              <FormattedMessage id="pages.login.register" defaultMessage="注册账号"/>
            </a>
            {/*todo 忘记密码*/}
            {/*<a*/}
            {/*  style={{*/}
            {/*    float: 'right',*/}
            {/*  }}*/}
            {/*>*/}
            {/*  <FormattedMessage id="pages.login.forgotPassword" defaultMessage="忘记密码"/>*/}
            {/*</a>*/}
          </div>
        </LoginForm>
      </div>
      <Footer/>

    </div>
  );
};

export default Login;
