import {outLogin} from '@/services/ant-design-pro/api';
import {LogoutOutlined, SettingOutlined, UserOutlined} from '@ant-design/icons';
import {useEmotionCss} from '@ant-design/use-emotion-css';
import {history, useModel} from '@umijs/max';
import {Alert, Avatar, Button, message, Space, Spin} from 'antd';
import {setAlpha} from '@ant-design/pro-components';

import type {MenuInfo} from 'rc-menu/lib/interface';
import React, {useCallback} from 'react';
import {flushSync} from 'react-dom';
import HeaderDropdown from '../HeaderDropdown';
import {logoutUsingPOST} from "@/services/alias-openapi-backend/userController";

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

const Name = () => {
  const {initialState} = useModel('@@initialState');
  const {loginUser} = initialState || {};

  const nameClassName = useEmotionCss(({token}) => {
    return {
      width: '70px',
      height: '48px',
      overflow: 'hidden',
      lineHeight: '48px',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      [`@media only screen and (max-width: ${token.screenMD}px)`]: {
        display: 'none',
      },
    };
  });

  return <span className={`${nameClassName} anticon`}>{loginUser?.account}</span>;
};

const AvatarLogo = () => {
  const {initialState} = useModel('@@initialState');

  const {loginUser} = initialState || {};

  const avatarClassName = useEmotionCss(({token}) => {
    return {
      marginRight: '8px',
      color: token.colorPrimary,  //token.colorPrimary
      verticalAlign: 'top',
      background: setAlpha(token.colorBgContainer, 0.85),
      [`@media only screen and (max-width: ${token.screenMD}px)`]: {
        margin: 0,
      },
    };
  });

  return <Avatar size="small" className={avatarClassName}
                 src={loginUser?.avatar===null?"https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png":loginUser?.avatar} alt="avatar"/>;
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({menu}) => {
  /**
   * 退出登录，并且将当前的 url 保存
   */
  const loginOut = async () => {
    await outLogin();
    const {search, pathname} = window.location;
    const urlParams = new URL(window.location.href).searchParams;
    /** 此方法会跳转到 redirect 参数所在的位置 */
    const redirect = urlParams.get('redirect');
    // Note: There may be security issues, please note
    if (window.location.pathname !== '/user/login' && !redirect) {
      history.replace({
        pathname: '/user/login',
        // search: stringify({
        //   redirect: pathname + search,
        // }),
      });
    }
  };
  const actionClassName = useEmotionCss(({token}) => {
    return {
      display: 'flex',
      height: '48px',
      marginLeft: 'auto',
      overflow: 'hidden',
      alignItems: 'center',
      padding: '0 8px',
      cursor: 'pointer',
      borderRadius: token.borderRadius,
      '&:hover': {
        backgroundColor: token.colorBgTextHover,
      },
    };
  });
  const {initialState, setInitialState} = useModel('@@initialState');

  const onMenuClick = useCallback(
    async (event: MenuInfo) => {
      const {key} = event;
      if (key === 'logout') {
        flushSync(() => {
          setInitialState((s) => ({...s, loginUser: undefined}));
        });
        //删除 cookie
        document.cookie = "authorization=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        //localStorage.removeItem("api-open-platform-user")
        await logoutUsingPOST();
        history.push('/user/login');
        message.success("退出成功")
        return;
      }
      history.push(`/account/${key}`);
    },
    [setInitialState],
  );

  const loading = (
    <span className={actionClassName}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const {loginUser} = initialState;

  if (!loginUser || !loginUser.account) {
    return loading;
  }

  const menuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined/>,
      label: '退出登录',
    },
    // {
    //   key: 'center',
    //   icon: <UserOutlined/>,
    //   label: '个人中心',
    // },
  ];

  return (
    <HeaderDropdown
      menu={{
        selectedKeys: [],
        onClick: onMenuClick,
        items: menuItems,
      }}
    >
      <span className={actionClassName}>
        <AvatarLogo/>
        <Name/>
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
