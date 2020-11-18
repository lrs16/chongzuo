/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { Table, Badge } from 'antd';

const recordingMap = ['success', 'error', 'default'];
const recording = ['已确认', '未确认', '已取消'];

const statusMap = ['error', 'success', 'default'];
const status = ['未消除', '已消除', '已取消'];
class AlarmHistory extends Component {
  render() {
    const rowSelection = {
      onChange:(selectedRows) =>{
        console.log(selectedRows);
      }
    };
    const columns = [
      {
        title: '告警时间',
        dataIndex: 'alarmtime',
        key: 'alarmtime',
      },
      {
        title: '恢复时间',
        dataIndex: 'restoretime',
        key: 'restoretime',
      },
      {
        title: '持续时长',
        dataIndex: 'duration',
        key: 'duration',
      },
      {
        title: '告警确认',
        dataIndex: 'eliminate',
        key: 'eliminate',
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
        <Table 
        dataSource={dataSource} 
        rowKey={record => record.historyid} 
        columns={columns} 
        rowSelection={rowSelection}
        />
      </div>
    );
  }
}

export default AlarmHistory;
