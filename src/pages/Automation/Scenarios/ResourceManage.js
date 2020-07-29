/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Card, Divider, Button, Message, Popconfirm } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

@connect(({ jobresources, loading }) => ({
  jobresources,
  loading: loading.models.jobresources,
}))
class Resource extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'jobresources/fetch',
    });
  }

  render() {
    const columns = [
      {
        title: '编码',
        dataIndex: 'resoureid',
        key: 'resoureid',
      },
      {
        title: '设备名称',
        dataIndex: 'resourename',
        key: 'resourename',
      },
      {
        title: '类型',
        dataIndex: 'scriptType',
        key: 'scriptType',
      },
      {
        title: 'IP地址',
        dataIndex: 'resoureip',
        key: 'resoureip',
      },
      {
        title: '更新时间',
        dataIndex: 'Updatetime',
        key: 'Updatetime',
      },
      {
        title: '运行状态',
        dataIndex: 'status',
        key: 'status',
      },
      {
        title: 'Agent',
        dataIndex: 'Agent',
        key: 'Agent',
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => <Button type="link">删除</Button>,
      },
    ];
    const {
      jobresources: { list },
    } = this.props;
    const dataSource = [...list];
    return (
      <PageHeaderWrapper title="资源管理">
        <Card>
          <Table dataSource={dataSource} rowKey={record => record.resoureid} columns={columns} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Resource;
