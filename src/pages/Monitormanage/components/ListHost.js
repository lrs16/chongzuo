/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { Table, Tag, Badge } from 'antd';
import Link from 'umi/link';
import numeral from 'numeral';
import { ChartCard, MiniProgress } from '@/components/Charts';

const statusMap = ['default', 'processing'];
const status = ['离线', '在线'];

class HostList extends Component {
  render() {
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        width: 120,
        render: (text, record) => (
          <span>
            <Link to={`/monitormanage/home/hostprofile/${record.id}`}>{text}</Link>
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
        width: 80,
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
        width: 120,
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
        width: 120,
        render: text => (
          <span>
            {numeral(text).format('0,0.00')}%
            <MiniProgress percent={text} strokeWidth={8} target={80} />
          </span>
        ),
      },
      {
        title: '负载(15m)',
        dataIndex: 'load',
        key: 'load',
        width: 100,
        render: text => <span>{numeral(text).format('0,0.00')}</span>,
      },
      {
        title: 'IO读速率',
        dataIndex: 'ioReadRate',
        key: 'ioReadRate',
        width: 100,
        render: text => <span>{numeral(text).format('0,0.00')}</span>,
      },
      {
        title: 'IO写速率',
        dataIndex: 'ioWriteRate',
        key: 'ioWriteRate',
        width: 100,
        render: text => <span>{numeral(text).format('0,0.00')}</span>,
      },
      {
        title: '标签',
        dataIndex: 'applyLabel',
        key: 'applyLabel',
        render: applyLabel => (
          <span>
            {applyLabel.map(tag => (
              <Tag key={tag} style={{ marginBottom: 2, marginTop: 2 }}>
                {tag}
              </Tag>
            ))}
          </span>
        ),
      },
    ];
    const dataSource = this.props.datas;
    return (
      <div>
        <Table dataSource={dataSource} rowKey={record => record.id} columns={columns} />
      </div>
    );
  }
}

export default HostList;
