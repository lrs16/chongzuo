import React from 'react';
import { Table } from 'antd';

function TemporaryList(props) {
  const { dataSource, losding } = props;
  const columns = [
    {
      title: '操作人',
      dataIndex: 'operater',
      key: 'operater',
    },
    {
      title: '操作时间',
      dataIndex: 'operateTime',
      key: 'operateTime',
    },
    {
      title: '操作前状态',
      dataIndex: 'operatePrev',
      key: 'operatePrev',
    },
    {
      title: '操作后状态',
      dataIndex: 'operateSuff',
      key: 'operateSuff',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
    },
  ];
  return (
    <Table
      dataSource={dataSource}
      loading={losding}
      columns={columns}
    />
  );
}

export default TemporaryList;