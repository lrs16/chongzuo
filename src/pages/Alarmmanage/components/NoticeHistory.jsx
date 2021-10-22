/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { Table, Badge } from 'antd';

class NoticHistory extends Component {
  render() {
    const columns = [
      {
        title: '短信内容',
        dataIndex: 'smsContent',
        key: 'smsContent',
      },
      {
        title: '发送时间',
        dataIndex: 'sendingtime',
        key: 'sendingtime',
      },
      {
        title: '接收人',
        dataIndex: 'username',
        key: 'username',
      },
      {
        title: '接收号码',
        dataIndex: 'tel',
        key: 'tel',
      },
      {
        title: '状态',
        dataIndex: 'success',
        key: 'success',
        width: 100,
        render: (text) => {
          const status = new Map([
            [-1, '待发送'],
            [0, '发送成功'],
            [1, '发送失败'],
          ]);
          const statusMap = new Map([
            [-1, 'processing'],
            [0, 'success'],
            [1, 'error'],
          ])
          return (
            <span>
              <Badge status={statusMap.get(text)} text={status.get(text)} />
            </span>
          )
        },
      },
    ];

    const { data } = this.props;
    // console.log(data);
    const dataSource = [...data];
    return (
      <div>
        <Table dataSource={dataSource}
          rowKey={record => record.notichid}
          columns={columns}
        />
      </div>
    );
  }
}

export default NoticHistory;
