import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Table, Form, Input, Button, Message, Divider, Badge, Popconfirm } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SoftEdit from './components/SoftEdit';

const statusMap = ['default', 'success'];
const status = ['关闭', '启动'];
const { Search } = Input;

@connect(({ automaticmodel, loading }) => ({
  automaticmodel,
  loading: loading.models.automaticmodel,
}))
class SoftManage extends Component {
  componentDidMount() {
    this.getsoftlist();
  }

  getsoftlist() {
    this.props.dispatch({
      type: 'automaticmodel/fetchsoftlist',
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      automaticmodel: { softdata },
    } = this.props;
    const datasource = softdata;
    const handleUpdate = values => {
      const { dispatch } = this.props;
      return dispatch({
        type: 'automaticmodel/softSave',
        payload: values,
      }).then(res => {
        if (res.code === 200) {
          Message.success(res.msg);
          this.getsoftlist();
        } else {
          Message.error('添加软件失败');
        }
      });
    };

    const handleEdite = values => {
      const { dispatch } = this.props;
      return dispatch({
        type: 'automaticmodel/softEdit',
        payload: values,
      }).then(res => {
        if (res.code === 200) {
          Message.success(res.msg);
          this.getsoftlist();
        } else {
          Message.error(res.msg);
        }
      });
    };

    const handleDelete = id => {
      const { dispatch } = this.props;
      return dispatch({
        type: 'automaticmodel/softRemove',
        payload: id,
      }).then(res => {
        if (res.code === 200) {
          Message.success(res.msg);
          this.getsoftlist();
        } else {
          Message.error('删除软件失败！');
        }
      });
    };

    const columns = [
      {
        title: '编码',
        dataIndex: 'code',
        key: 'code',
      },
      {
        title: '软件名称',
        dataIndex: 'softName',
        key: 'softName',
      },
      {
        title: '版本',
        dataIndex: 'version',
        key: 'version',
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
      },
      {
        title: '状态',
        dataIndex: 'statue',
        key: 'statue',
        render: (text, record) => (
          <span>
            <Badge status={statusMap[record.statue]} text={status[record.statue]} />
          </span>
        ),
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => (
          <div>
            <span title="配置软件" roleId={record.id}>
              <a type="link">配置进程</a>
            </span>
            <Divider type="vertical" />
            <SoftEdit onSumit={values => handleEdite(values)} title="编辑软件" record={record}>
              <a type="link">编辑</a>
            </SoftEdit>
            <Divider type="vertical" />
            <Popconfirm title="确定删除此软件？" onConfirm={() => handleDelete(record.id)}>
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
          <SoftEdit onSumit={value => handleUpdate(value)}>
            <Button
              style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
              type="dashed"
              icon="plus"
            >
              添加软件
            </Button>
          </SoftEdit>
          <Table columns={columns} dataSource={datasource} rowKey={record => record.code} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}
export default Form.create()(SoftManage);
