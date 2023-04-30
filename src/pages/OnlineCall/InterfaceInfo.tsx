import {PageContainer, ProDescriptions} from '@ant-design/pro-components';
import React, {useEffect, useState} from 'react';
import {Button, Card, Form, message, Input, Divider, Alert, Switch, Tag, Empty} from 'antd';
import {
  getInterfaceInfoByIdUsingGET,
  invokeInterfaceUsingPOST,
} from '@/services/alias-openapi-backend/interfaceInfoController';
import {useParams} from '@@/exports';

const Index: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<API.InterfaceInfo>();
  const [invokeRes, setInvokeRes] = useState<any>();
  const [invokeLoading, setInvokeLoading] = useState(false);

  const params = useParams();

  const loadData = async () => {
    if (!params.id) {
      message.error('参数不存在');
      return;
    }
    setLoading(true);
    try {
      const res = await getInterfaceInfoByIdUsingGET({
        id: Number(params.id),
      });
      setData(res.data);
    } catch (error: any) {
      message.error('请求失败，' + error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const onFinish = async (values: any) => {
    if (!params.id) {
      message.error('接口不存在');
      return;
    }
    setInvokeLoading(true);
    setLoading(true);
    try {
      const res = await invokeInterfaceUsingPOST({
        id: data?.id,
        url: data?.url,
        method: data?.method,
        ...values,
      });
      //判断是否json
      let parse = null;
      if (res.data) {
        if (res.data.toString().startsWith('{') && res.data.toString().endsWith('}')) {
          parse = JSON.parse(res.data.toString());
        }
        if (parse && parse.code !== 0) {
          message.error(parse.message);
          setInvokeRes(parse.message);
          return;
        }
        if (res.code === 0) {
          message.success('调用成功');
          // @ts-ignore
          data.leftNum = data.leftNum - 1;
          setData(data);
          setInvokeRes(res.data);
        }
      }
    } catch (error: any) {
      message.error('操作失败，' + error.message);
    }
    setInvokeLoading(false);
    setLoading(false);
  };

  return (
    <PageContainer title="查看接口文档">
      <Card>
        {data ? (
          <ProDescriptions  title={data.name} column={1}>
            <ProDescriptions.Item label="接口状态">
              {<Switch disabled={true} checked={data.status !== 0} />}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="描述">{data.description}</ProDescriptions.Item>
            <ProDescriptions.Item label="请求地址">{data.url}</ProDescriptions.Item>
            <ProDescriptions.Item label="请求方法">
              {<Tag color="success">{data.method}</Tag>}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="请求头" valueType="jsonCode">{data.requestHeader}</ProDescriptions.Item>
            <ProDescriptions.Item label="请求参数">{data.requestParams}</ProDescriptions.Item>
            <ProDescriptions.Item label="响应头" valueType="jsonCode">{data.responseHeader}</ProDescriptions.Item>
            <ProDescriptions.Item label="剩余调用次数">
              <Tag color={data.leftNum ? (data?.leftNum > 10 ? '#87d068' : '#f50') : '#f50'}>
                {data.leftNum}
              </Tag>
            </ProDescriptions.Item>
          </ProDescriptions >
        ) : (
          <Empty />
        )}
      </Card>
      <Divider/>
      <Alert
        message="提示"
        banner
        description="为了接口调用正常，填写请求参数前请阅读上方给出的请求参数格式，根据给出的格式填写您的请求参数。"
      />
      <Card title="在线测试">
        <Form name="invoke" layout="vertical" onFinish={onFinish}>
          <Form.Item label="请求参数" name="userRequestParams">
            <Input.TextArea/>

          </Form.Item>
          <Form.Item wrapperCol={{span: 16}}>
            <Button type="primary" htmlType="submit">
              调用
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Divider/>
      <Card title="返回结果" loading={invokeLoading}>
        {invokeRes}
      </Card>
    </PageContainer>
  );
};

export default Index;
