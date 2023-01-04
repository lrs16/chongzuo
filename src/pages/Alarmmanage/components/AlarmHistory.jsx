/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import moment from 'moment';
import { Table, Badge } from 'antd';

// const recordingMap = ['success', 'error', 'default'];
// const recording = ['已确认', '未确认', '已取消'];

// const statusMap = ['error', 'success', 'default'];
// const status = ['未消除', '已消除', '已取消'];
class AlarmHistory extends Component {
  render() {
    const columns = [
      {
        title: '告警时间',
        dataIndex: 'warnTime',
        key: 'warnTime',
      },
      {
        title: '恢复时间',
        dataIndex: 'clearTime',
        key: 'clearTime',
      },
      {
        title: '持续时长',
        dataIndex: 'duration',
        key: 'duration',
        render: (text, record) => {
          let tempTime = '';
          let day = '';
          let houre = '';
          let minutes = '';
          let seconds = '';
          if (record.warnTime && record.clearTime) {
            const addtime = moment(record.warnTime);
            const endtime = moment(record.clearTime);
            const dura = endtime.format('x') - addtime.format('x');
            tempTime = moment.duration(dura);
            if (tempTime.days() !== 0) {
              day = `${tempTime.days()}天`
            };
            if (tempTime.hours() !== 0) {
              houre = `${tempTime.hours()}小时`
            };
            if (tempTime.minutes() !== 0) {
              minutes = `${tempTime.minutes()}分`
            };
            if ((tempTime.days() === 0 && tempTime.hours() === 0 && tempTime.minutes() === 0 && tempTime.seconds() === 0) || tempTime.seconds() !== 0) {
              seconds = `${tempTime.seconds()}秒`
            }
          };
          return (
            <>
              {record.warnTime && record.clearTime ? (<>{day}{houre}{minutes}{seconds}</>) : ''}
            </>
          )
        },
      },
      {
        title: '消除状态',
        dataIndex: 'clearStatus',
        key: 'clearStatus',
        render: (text) => (
          <Badge status={text === '待消除' ? 'error' : 'default'} text={text} />
        ),
      },
      {
        title: '确认状态',
        dataIndex: 'confirmStatus',
        key: 'confirmStatus',
        render: (text) => (
          <Badge status={text === '已确认' ? 'success' : 'error'} text={text} />
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
        />
      </div>
    );
  }
}

export default AlarmHistory;
