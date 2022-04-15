import React from 'react';
import { Table } from 'antd';

function ProcessList(props) {
  const { procelist, loading } = props;
  const columns = [
    {
      title: '操作人',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: '操作时间',
      dataIndex: 'operationTime',
      key: 'operationTime',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
    },
  ];
  return <Table dataSource={procelist} loading={loading} columns={columns} />;
}

export default ProcessList;
