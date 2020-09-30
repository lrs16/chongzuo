/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { Table, Badge } from 'antd';

const recordingMap = ['success', 'error', 'default'];
const recording = ['已确认', '未确认', '已取消'];

const statusMap = ['error', 'success', 'default'];
const status = ['未消除', '已消除', '已取消'];
class OperationRecord extends Component {
  render() {
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

    const { data } = this.props;
    // console.log(data);
    const dataSource = [...data];
    return (
      <div>
        <Table dataSource={dataSource} rowKey={record => record.operatid} columns={columns} />
      </div>
    );
  }
}

export default OperationRecord;
