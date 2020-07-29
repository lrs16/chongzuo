import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Card, Divider, Button, Message, Popconfirm } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

@connect(({ jobsmanage, loading }) => ({
  jobsmanage,
  loading: loading.models.jobsmanage,
}))
class Home extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'jobsmanage/fetch',
    });
  }

  render() {
    const columns = [
      {
        title: '编码',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '作业名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '最后执行时间',
        dataIndex: 'endtime',
        key: 'endtime',
      },
      {
        title: '最后执行状态',
        dataIndex: 'state',
        key: 'state',
      },
      {
        title: '启动状态',
        dataIndex: 'state',
        key: 'state',
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => (
          <div>
            <Button type="link" href="">
              作业历史
            </Button>
            <Button type="link" href="">
              删除
            </Button>
          </div>
        ),
      },
    ];

    const {
      jobsmanage: { list },
    } = this.props;
    const dataSource = [...list];

    return (
      <PageHeaderWrapper title="定时作业">
        <div>
          {' '}
          <Button>新建定时作业</Button>
        </div>
        <Card>
          <Table dataSource={dataSource} rowKey={record => record.id} columns={columns} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Home;
