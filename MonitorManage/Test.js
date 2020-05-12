import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Card, Badge, Button, Message, Popconfirm, Tag } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const statusMap = ['default', 'processing'];
const status = ['离线', '在线'];
@connect(({ hostmonitorlist, loading }) => ({
  hostmonitorlist,
  loading: loading.models.hostmonitorlist,
}))
class HolistTest extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'hostmonitorlist/fetch',
      payload: { current: 1, pageSize: 10 },
    });
  }

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
        // render: (text, record) => (
        //   <span>
        //     <Link to={`/monitormanage/home/hostprofile/${record.id}`}>{text}</Link>
        //   </span>
        // ),
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
        dataIndex: 'cpuUsage',
        key: 'cpuUsage',
      },
      {
        title: '内存使用率',
        dataIndex: 'memoryUsage',
        key: 'memoryUsage',
      },
      {
        title: '负载(15m)',
        dataIndex: 'load',
        key: 'load',
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
        title: '标签',
        dataIndex: 'applyLabel',
        key: 'applyLabel',
        render: applyLabel => (
          <span>
            {applyLabel.map(tag => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </span>
        ),
      },
    ];

    const { hostmonitorlist = {} } = this.props;
    const dataSource = hostmonitorlist.data;
    return (
      <PageHeaderWrapper title="作业历史">
        <Card>
          <Table dataSource={dataSource} rowKey={record => record.id} columns={columns} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default HolistTest;
