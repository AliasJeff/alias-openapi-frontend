import {PageContainer} from '@ant-design/pro-components';

import {List} from 'antd';
import React, {useEffect, useState} from 'react';
import {listInterfaceInfoByPageUsingGET} from "@/services/alias-openapi-backend/interfaceInfoController";

const Index: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<API.InterfaceInfo[]>([]);
  const [total, setTotal] = useState<number>(0);
  const loadData = async (current = 1, pageSize = 7) => {
    setLoading(true);
    try {
      const res = await listInterfaceInfoByPageUsingGET({
        current,
        pageSize,
      });
      setList(res?.data?.records ?? []);
      setTotal(res?.data?.total ?? 0);
    } catch (error: any) {
    }
    setLoading(false);
  };
  useEffect(() => {
    loadData();
  }, []);
  return (
    <PageContainer>
      <List
        className="my-list"
        loading={loading}
        itemLayout="horizontal"
        dataSource={list}
        pagination={{
          pageSize: 7,
          total,
          showTotal(total: number) {
            return '共' + total + '条数据';
          },
          onChange(page, pageSize) {
            loadData(page, pageSize);
          },
        }}
        renderItem={(item) => {
          const router = `/online_call/interface_info/${item.id}`;
          return (
            <List.Item
              actions={[
                <a key={item.id} href={router}>
                  查看
                </a>,
              ]}
            >
              <List.Item.Meta
                title={<a href={router}>{item.name}</a>}
                description={item.description}
              />
            </List.Item>
          );
        }}
      />
    </PageContainer>

  );
};

export default Index;
