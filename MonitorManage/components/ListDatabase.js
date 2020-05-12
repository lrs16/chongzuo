/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { Table, Badge } from 'antd';
import Link from 'umi/link';
import DrawerList from './DrawerList';

const dataSource = [
  {
    key: '1',
    id: '101',
    name: '冲值业务服务器',
    ip: '172.16.0.0',
    status: 1,
    cpu: '80%',
    RAM: '90%',
    load: '0.7',
    IOread: '0.05',
    IOwrite: '0.05',
    space: '18',
    lock: '10',
  },
  {
    key: '1',
    id: '102',
    name: '客服系统',
    ip: '172.16.0.108',
    status: 0,
    cpu: '10%',
    RAM: '15%',
    load: '0.2',
    IOread: '0.05',
    IOwrite: '0.25',
    space: '28',
    lock: '6',
  },
];

const statusMap = ['processing', 'default'];
const status = ['在线', '离线'];

class HostList extends Component {
  render() {
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => (
          <span>
            <Link to={`/monitormanage/home/databaseprofile/${record.id}`}>{text}</Link>
          </span>
        ),
      },
      {
        title: 'IP',
        dataIndex: 'ip',
        key: 'ip',
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
      {
        title: 'CPU使用率',
        dataIndex: 'cpu',
        key: 'cpu',
      },
      {
        title: '内存使用率',
        dataIndex: 'RAM',
        key: 'RAM',
      },
      {
        title: '负载(15m)',
        dataIndex: 'load',
        key: 'load',
      },
      {
        title: 'IO读速率',
        dataIndex: 'IOread',
        key: 'IOread',
      },
      {
        title: 'IO写速率',
        dataIndex: 'IOwrite',
        key: 'IOwrite',
      },
      {
        title: '表空间数量',
        dataIndex: 'space',
        key: 'space',
        render: (text, record) => (
          <div>
            <DrawerList title="表空间详情" record={record} roleid={record.id}>
              <a type="link">{text}</a>
            </DrawerList>
          </div>
        ),
      },
      {
        title: '锁表数量',
        dataIndex: 'lock',
        key: 'lock',
        render: (text, record) => (
          <div>
            <DrawerList title="表空间详情" record={record} roleid={record.id}>
              <a type="link">{text}</a>
            </DrawerList>
          </div>
        ),
      },
    ];
    return (
      <div>
        <Table dataSource={dataSource} rowKey={record => record.id} columns={columns} />
      </div>
    );
  }
}

export default HostList;
