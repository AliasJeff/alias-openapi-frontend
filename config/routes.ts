export default [
  { path: '/', name: '主页', icon: 'crown', component: './Index' },
  { path: '/interface_info/:id', name: '查看接口', icon: 'smile', component: './InterfaceInfo', hideInMenu: true },

  { path: '/online_call', name: '在线调用', icon: 'AppstoreOutlined',
    routes: [
      {path: '/online_call', name: '在线调用', component: './OnlineCall/index',hideInMenu: true},
      {
        path: '/online_call/interface_info/:id',
        name: '接口详情',
        component: './OnlineCall/InterfaceInfo',
        hideInMenu: true,
      },
    ]
  },

  {
    path: '/get_request_counts',
    name: '购买次数',
    icon: 'crown',
    routes: [{ path: '/get_request_counts', component: './PurchaseRequests/index'}],
  },
  // {
  //   path: '/my_order_info',
  //   name: '我的订单',
  //   icon: 'ContainerOutlined',
  //   routes: [{ path: '/my_order_info', component: './Order/myOrderInfo'}],
  // },
  // {
  //   path:'/order',
  //   layout: false,
  //   routes: [{name: '订单支付',path:'/order/order',component:'./Order/order'},
  //     {name: '支付状态查询',path: '/order/paymentStatus',component: './Order/payStatus'}]
  // },

  {
    path: '/user',
    layout: false,
    routes: [
      { name: '登录', path: '/user/login', component: './User/Login' },
      { component: './404' },
    ],
  },
  {
    path: '/admin',
    name: '管理页',
    icon: 'lock',
    access: 'canAdmin',
    routes: [
      { name: '接口管理', icon: 'table', path: '/admin/interface_info', component: './Admin/InterfaceInfo' },
      { component: './404' },
    ],
  },
  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
];
