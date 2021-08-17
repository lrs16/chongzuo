import React from 'react';
import { Card, Table } from 'antd';

function SuperviseList(props) {
  const { data, loading } = props;
  const columns = [
    {
      title: '序号',
      dataIndex: 'key',
      key: 'key',
      render: (text, record, index) => {
        return <>{`${index + 1}`}</>;
      },
    },
    {
      title: '督办内容',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: '督办人',
      dataIndex: 'superviseUser',
      key: 'superviseUser',
    },
    {
      title: '督办时间',
      dataIndex: 'superviseTime',
      key: 'superviseTime',
    },
  ];
  return (
    <Card style={{ height: 'calc(100vh - 300px)' }}>
      <Table dataSource={data} columns={columns} loading={loading} rowKey={(_, index) => index.toString()}/>
    </Card>
  );
}

export default SuperviseList;