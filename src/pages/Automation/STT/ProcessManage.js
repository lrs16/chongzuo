import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Table, Form, Input, Button, Message, Divider, Badge, Popconfirm } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProcessEdit from './components/ProcessEdit';

const { Search } = Input;

@connect(({ automaticmodel, loading }) => ({
  automaticmodel,
  loading: loading.models.automaticmodel,
}))
class ProcessManage extends Component {
  componentDidMount() {
    this.getProcessList();
  }

  getProcessList() {
    const { dispatch } = this.props;
    dispatch({
      type: 'automaticmodel/fetchprocessList',
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      automaticmodel: { processdata },
    } = this.props;
    const dataSource = processdata;

    const handleEdite = values => {
      const { dispatch } = this.props;
      return dispatch({
        type: '/automaticmodel/processEdit',
        payload: values,
      }).then(res => {
        if (res.code === 200) {
          Message.success(res.msg);
          this.getProcessList();
        } else {
          Message.error('编辑进程失败');
        }
      });
    };

    const handleDelete = id => {
      const { dispatch } = this.props;
      return dispatch({
        type: 'automaticmodel/processRemove',
        payload: id,
      }).then(res => {
        if (res.code === 200) {
          Message.success(res.msg);
          this.getsoftlist();
        } else {
          Message.error('删除进程失败！');
        }
      });
    };

    const handleUpdate = values => {
      const { dispatch } = this.props;
      return dispatch({
        type: 'automaticmodel/processSave',
        payload: values,
      }).then(res => {
        if (res.code === 200) {
          Message.success(res.msg);
          this.getProcessList();
        } else {
          Message.error(res.msg);
        }
      });
    };

    const columns = [
      {
        title: '编码',
        dataIndex: 'code',
        key: 'index',
      },
      {
        title: '应用',
        dataIndex: 'application',
        key: 'application',
      },
      {
        title: '进程名称',
        dataIndex: 'processName',
        key: 'processName',
      },
      {
        title: 'CPU',
        dataIndex: 'cpu',
        key: 'cpu',
      },
      {
        title: '内存',
        dataIndex: 'memory',
        key: 'memory',
      },
      {
        title: '磁盘',
        dataIndex: 'disk',
        key: 'disk',
      },
      {
        title: '网络',
        dataIndex: 'network',
        key: 'network',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => (
          <div>
            <ProcessEdit onSumit={values => handleEdite(values)} title="编辑进程" record={record}>
              <a type="link">编辑</a>
            </ProcessEdit>
            <Divider type="vertical" />
            <Popconfirm title="确定删除此进程？" onConfirm={() => handleDelete(record.id)}>
              <a type="link">删除</a>
            </Popconfirm>
          </div>
        ),
      },
    ];

    return (
      <PageHeaderWrapper>
        <Card>
          <Form style={{ float: 'right', width: '30%' }}>
            {getFieldDecorator('queKey')(
              <Search
                placeholder="请输入"
                // onSearch={values => handleSearch(values)}
              />,
            )}
          </Form>
          <ProcessEdit onSumit={values => handleUpdate(values)}>
            <Button
              style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
              type="dashed"
              icon="plus"
            >
              添加进程
            </Button>
          </ProcessEdit>
          <Table columns={columns} dataSource={dataSource} rowKey={record => record.id} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}
export default Form.create()(ProcessManage);
