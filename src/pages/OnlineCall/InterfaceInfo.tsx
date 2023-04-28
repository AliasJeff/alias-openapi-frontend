import {PageContainer} from '@ant-design/pro-components';
import React, {useEffect, useState} from 'react';
import {Button, Card, Descriptions, Form, message, Input, Spin, Divider} from 'antd';
import {
  getInterfaceInfoByIdUsingGET,
  invokeInterfaceUsingPOST,
} from '@/services/alias-openapi-backend/interfaceInfoController';
import {useParams} from '@@/exports';

/**
 * 主页
 * @constructor
 */
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
          <Descriptions title={data.name} column={1}>
            <Descriptions.Item label="接口状态">{data.status ? '开启' : '关闭'}</Descriptions.Item>
            <Descriptions.Item label="描述">{data.description}</Descriptions.Item>
            <Descriptions.Item label="请求地址">{data.url}</Descriptions.Item>
            <Descriptions.Item label="请求方法">{data.method}</Descriptions.Item>
            <Descriptions.Item label="请求参数">{data.requestParams}</Descriptions.Item>
            <Descriptions.Item label="请求头">{data.requestHeader}</Descriptions.Item>
            <Descriptions.Item label="响应头">{data.responseHeader}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{new Date(data.createTime).toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label="更新时间">{new Date(data.updateTime).toLocaleString()}</Descriptions.Item>
          </Descriptions>
        ) : (
          <>接口不存在</>
        )}
      </Card>
      <Divider/>
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
