/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { Table, Badge } from 'antd';
import Link from 'umi/link';
import { MiniProgress } from '@/components/Charts';
import numeral from 'numeral';
import DrawerList from './DrawerList';

const statusMap = ['default', 'processing'];
const status = ['离线', '在线'];

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
        title: '数据库类型',
        dataIndex: 'type',
        key: 'type',
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
        dataIndex: 'cpuUsage',
        key: 'cpuUsage',
        render: text => (
          <span>
            {numeral(text).format('0,0.00')}%
            <MiniProgress percent={text} strokeWidth={8} target={80} />
          </span>
        ),
      },
      {
        title: '内存使用率',
        dataIndex: 'memoryUsage',
        key: 'memoryUsage',
        render: text => (
          <span>
            {numeral(text).format('0,0.00')}%
            <MiniProgress percent={text} strokeWidth={8} target={80} />
          </span>
        ),
      },
      {
        title: 'IO读速率',
        dataIndex: 'ioReadRate',
        key: 'ioReadRate',
      },
      {
        title: 'IO写速率',
        dataIndex: 'ioWriteRate',
        key: 'ioWriteRate',
      },
      {
        title: '表空间数量',
        dataIndex: 'tableSpace',
        key: 'tableSpace',
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
        dataIndex: 'lockTable',
        key: 'lockTable',
        render: (text, record) => (
          <div>
            <DrawerList title="表空间详情" record={record} roleid={record.id}>
              <a type="link">{text}</a>
            </DrawerList>
          </div>
        ),
      },
    ];
    const { datas } = this.props;
    return (
      <div>
        <Table dataSource={datas} rowKey={record => record.id} columns={columns} />
      </div>
    );
  }
}

export default HostList;
