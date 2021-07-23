import React from 'react';
import { Card, Table } from 'antd';

function UploadList(props) {
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
      title: '操作人',
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: '操作时间',
      dataIndex: 'addTime',
      key: 'addTime',
    },
    {
      title: '操作类型',
      dataIndex: 'type',
      key: 'type',
    },
  ];
  return (
    <Card style={{ height: 'calc(100vh - 300px)' }}>
      <Table dataSource={data} columns={columns} loading={loading} />
    </Card>
  );
}

export default UploadList;