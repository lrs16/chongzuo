import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Card,  Divider, Button, Message, Popconfirm  } from 'antd';
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
  
    const columns = [{
      title: '编码',
      dataIndex: 'id',
      key: 'id',
    }, {
      title: '作业名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '执行状态',
      dataIndex: 'state',
      key: 'state',
    },{
      title: '开始时间',
      dataIndex: 'starttime',
      key: 'starttime',
    },{
      title: '结束时间',
      dataIndex: 'endtime',
      key: 'endtime',
    },{
      title: '启动方式',
      dataIndex: 'startingmode',
      key: 'startingmode',
    },{
      title: '总耗时(s)',
      dataIndex: 'taking',
      key: 'taking',
    },{
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (text, record) => (
        <div>
          <Button type="link" href={`/automation/viewjob/${record.id}`}>查看详情</Button>
          <Button type="link">删除</Button>         
        </div>
      ),
    }
  ];  
 
    const { jobsmanage: { list } } = this.props;
    const dataSource = [...list];

    return (
      <PageHeaderWrapper title="作业历史"> 
        <Card> 
          <Table
            dataSource={dataSource}          
            rowKey={record => record.id}
            columns={columns}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Home;