import {PageContainer} from '@ant-design/pro-components';

import {Alert, Button, Card, Col, Row, Spin, Statistic} from 'antd';
import React, {useEffect, useState} from 'react';
import {
  AccountBookOutlined,
  LikeOutlined,
  RiseOutlined,
  UserOutlined
} from "@ant-design/icons";
import {
  getInterfaceCountUsingGET,
  getInterfaceInvokeCountUsingGET
} from "@/services/alias-openapi-backend/interfaceInfoController";
import {getUserCountUsingGET} from "@/services/alias-openapi-backend/userController";
import {getInvokeCountUsingGET, getStarsUsingGET} from "@/services/alias-openapi-backend/userInterfaceInfoController";
import BarChart from "@/pages/Index/components/echartsComponents";

const Index: React.FC = () => {
  const [activeUser, setActiveUser] = useState<any>()
  const [interfaceCount, setInterfaceCount] = useState<any>()
  const [invokeCount, setInvokeCount] = useState<any>()
  const [starsCount, setStarsCount] = useState<any>()
  const [data, setData] = useState<any>();
  useEffect(() => {
    loadData()
  }, []);

  const loadData = async () => {
    try {
      //获取活跃用户数
      const resUser = await getUserCountUsingGET()
      //获取可调用接口数
      const resInterface = await getInterfaceCountUsingGET()
      //获取接口总调用数
      const resInvoke = await getInvokeCountUsingGET()
      //获取GitHub上该项目的stars
      const resStars = await getStarsUsingGET()

      //获取图表数据
      const chartsData = await getInterfaceInvokeCountUsingGET();
      const newData = chartsData.data?.map(item => ({
        interface: item.name,
        value: item.totalNum
      }));

      setData(newData);

      setInterfaceCount(resInterface?.data)
      setInvokeCount(resInvoke?.data)
      setStarsCount(resStars?.data)
      // setOrderSuccess(0)
      setActiveUser(resUser?.data)
    } catch (e) {
    }
  }


  return (
    <PageContainer key="index">
      <Alert type="success" message="开发不易，给孩子点个Stars吧(˚ ˃̣̣̥᷄⌓˂̣̣̥᷅ )~ →→→→→→→→→" showIcon
             action={[
               <Button size="small" onClick={() => {
                 window.open("https://github.com/YukeSeko/YukeSeko-Interface")
               }} type="link">
                 这次一定！(Github)
               </Button>,
               <Button size="small" onClick={() => {
                 console.log('点击了第二个按钮');
               }} type="link">
                 这次一定！(Gitee)
               </Button>
             ]}
      />

      <Row style={{marginTop: 20}} gutter={16}>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="全 站 用 户 数"
              value={activeUser}
              valueStyle={{color: '#0000FF'}}
              prefix={<UserOutlined/>}
              suffix="位"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="全 站 可 调 用 接 口 数"
              value={interfaceCount}
              valueStyle={{color: '#cf1322'}}
              prefix={<RiseOutlined/>}
              suffix="个"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="全 站 接 口 总 调 用 数"
              value={invokeCount}
              valueStyle={{color: '#3f8600'}}
              prefix={<AccountBookOutlined/>}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Stars"
              value={starsCount}
              prefix={<LikeOutlined/>}
            />
          </Card>
        </Col>
      </Row>

      <Row
        style={{
          marginTop: 20,
          fontSize: 25,
          textAlign: 'center',
          color: 'rgba(0, 0, 0, 0.45)',
          letterSpacing: 10,
          display: 'flex',
          justifyContent: 'center',
        }}
        gutter={16}>
        接 口 调 用 次 数 统 计
      </Row>

      {data ? (
        <BarChart data={data}/>
      ) : (
        <Spin
          size="large"
          style={{
            marginLeft: 8,
            marginRight: 8,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          正在加载资源，请等待
        </Spin>
      )}

    </PageContainer>

  );
};

export default Index;
