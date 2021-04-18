import React from 'react';
import { Table, Row, Button } from 'antd';

const columns = [
  {
    title: '序号',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '设备名称及用途',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '设备型号配置',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: '部署应用',
    dataIndex: 'app',
    key: 'app',
  },
]

function EditeTable(props) {
  const { title } = props;
  return (
    <>
      <Row style={{ marginBottom: 8 }}>
        <h4 style={{ float: 'left' }}><span style={{ color: '#f5222d', marginRight: 4, fontWeight: 'normal' }}>*</span>{title}</h4>
        <div style={{ float: 'right' }}>
          <Button type='primary' style={{ marginRight: 8 }}>新增</Button>
          <Button type='danger' style={{ marginRight: 8 }} ghost>移除</Button>
          <Button type='primary' >导出清单</Button>
        </div>
      </Row>
      <Table
        columns={columns}
        bordered
        size='middle'
      />
    </>
  );
}

export default EditeTable;