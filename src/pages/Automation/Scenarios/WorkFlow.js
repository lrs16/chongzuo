import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import { Card, Table, Button } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

@connect(({ opsscenes, loading }) => ({
  opsscenes,
  loading: loading.models.opsscenes,
}))
class WorkFlow extends Component {
  componentDidMount() {
    const { scenarioId } = this.props.location.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'opsscenes/fetchscript',
      payload: {
        id: scenarioId,
        limit: 100,
        pages: 0,
      },
    });
  }

  render() {
    const columns = [
      {
        title: '编码',
        dataIndex: 'detail.scriptId',
        key: 'detail.scriptId',
      },
      {
        title: '编排名称',
        dataIndex: 'detail.scriptName',
        key: 'detail.scriptName',
      },
      {
        title: '类型',
        dataIndex: 'detail.scriptType',
        key: 'detail.scriptType',
      },
      {
        title: '创建人',
        dataIndex: 'detail.scriptAuthor',
        key: 'detail.scriptAuthor',
      },
      {
        title: '最后修改人',
        dataIndex: 'detail.scriptLastModifiedBy',
        key: 'detail.scriptLastModifiedBy',
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => (
          // console.log(record.detail.xxlJobId)
          <Link
            to={{
              pathname: '/automation/opsscene/jobexecut',
              state: {
                Jobid: record.detail.xxlJobId,
                scenarioName: this.props.location.state.scenarioName,
                scriptName: record.detail.scriptName,
              },
            }}
          >
            执行历史
          </Link>
        ),
      },
    ];

    const {
      opsscenes: { scriptlist },
    } = this.props;
    const dataSource = [...scriptlist];
    const title = `${this.props.location.state.scenarioName}：脚本编排`;
    return (
      <PageHeaderWrapper title={title}>
        <Card>
          <Table dataSource={dataSource} rowKey={record => record.uid} columns={columns} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default WorkFlow;
