/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { Table, Badge } from 'antd';

const statusMap = ['error', 'success'];
const status = ['发送失败', '发送成功'];
class NoticHistory extends Component {
  render() {
    const rowSelection = {
      onChange:(selectedRows) =>{
        console.log(selectedRows);
      }
    };
    const columns = [
      {
        title: '短信内容',
        dataIndex: 'content',
        key: 'content',
        width: 300,
      },
      {
        title: '发送时间',
        dataIndex: 'sendingtime',
        key: 'sendingtime',
      },
      {
        title: '发送方式',
        dataIndex: 'sendingmethod',
        key: 'sendingmethod',
      },
      {
        title: '接收人',
        dataIndex: 'receiver',
        key: 'receiver',
      },
      {
        title: '接收号码',
        dataIndex: 'receivernumber',
        key: 'receivernumber',
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
        <Table dataSource={dataSource} 
        rowKey={record => record.notichid} 
        columns={columns} 
        rowSelection={rowSelection}
        />
      </div>
    );
  }
}

export default NoticHistory;
