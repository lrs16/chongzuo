import React from 'react';
import { Table, Badge } from 'antd';

const recordingMap = ['success', 'error', 'default'];
const recording = ['取消告警', '确认告警', '已取消'];

const statusMap = ['error', 'success', 'default'];
const status = ['执行失败', '执行成功', '已取消'];

function OperationRecord(props) {
  const { data } = props;
  const columns = [
    {
      title: '操作时间',
      dataIndex: 'operattime',
      key: 'operattime',
    },
    {
      title: '操作账号',
      dataIndex: 'account',
      key: 'account',
    },
    {
      title: '账户名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '操作记录',
      dataIndex: 'recording',
      key: 'recording',
      render: (text, record) => (
        <span>
          <Badge status={recordingMap[record.recording]} text={recording[record.recording]} />
        </span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => (
        <span>
          <Badge status={statusMap[record.status]} text={status[record.status]} />
        </span>
      ),
    },
  ];
  return (
    <Table
      dataSource={data}
      rowKey={record => record.operatid}
      columns={columns}
    />
  );
}

export default OperationRecord;
