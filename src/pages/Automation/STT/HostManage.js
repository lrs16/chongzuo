import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Table, Form, Input, Button, Message, Divider, Badge, Popconfirm } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import HostEdit from './components/HostEdit';
import HostSoft from './components/Host_Soft';

const statusMap = ['default', 'success'];
const status = ['离线', '在线'];
const { Search } = Input;
@connect(({ automaticmodel, loading }) => ({
  automaticmodel,
  loading: loading.models.automaticmodel,
}))
class HostManage extends Component {
  componentDidMount() {
    this.getlist();
  }

  getlist() {
    this.props.dispatch({
      type: 'automaticmodel/fetch',
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      automaticmodel: { list },
    } = this.props;
    const dataSource = list;
    const handleUpdate = values => {
      const { dispatch } = this.props;
      return dispatch({
        type: 'automaticmodel/update',
        payload: values,
      }).then(res => {
        if (res.code === 200) {
          Message.success(res.msg);
          this.getlist();
        } else {
          Message.error('添加主机失败');
        }
      });
    };

    const handleEdite = values => {
      const { dispatch } = this.props;
      return dispatch({
        type: 'automaticmodel/edit',
        payload: values,
      }).then(res => {
        if (res.code === 200) {
          Message.success(res.msg);
          this.getlist();
        } else {
          Message.error('更新主机失败！');
        }
      });
    };

    const handleDelete = id => {
      const { dispatch } = this.props;
      return dispatch({
        type: 'automaticmodel/remove',
        payload: id,
      }).then(res => {
        if (res.code === 200) {
          Message.success(res.msg);
          this.getlist();
        } else {
          Message.error('删除主机失败！');
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
        title: '分组',
        dataIndex: 'group',
        key: 'group',
      },
      {
        title: '设备名称',
        dataIndex: 'equipmentName',
        key: 'equipmentName',
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
        title: 'IP',
        dataIndex: 'ip',
        key: 'ip',
      },

      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => (
          <div>
            <HostSoft
              title="配置软件"
              // roleId={record.id
            >
              <a type="link">配置软件</a>
            </HostSoft>
            <Divider type="vertical" />
            <HostEdit onSumit={values => handleEdite(values)} title="编辑主机" record={record}>
              <a type="link">编辑</a>
            </HostEdit>
            <Divider type="vertical" />
            <Popconfirm title="确定删除此菜单吗？" onConfirm={() => handleDelete(record.id)}>
              <a type="link">删除</a>
            </Popconfirm>
          </div>
        ),
      },
    ];

    return (
      <PageHeaderWrapper title="主机管理">
        <Card>
          <Form style={{ float: 'right', width: '30%' }}>
            {getFieldDecorator('queKey')(
              <Search
                placeholder="请输入"
                // onSearch={values => handleSearch(values)}
              />,
            )}
          </Form>
          <HostEdit onSumit={handleUpdate}>
            <Button
              style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
              type="dashed"
              icon="plus"
            >
              添加主机
            </Button>
          </HostEdit>
          <Table columns={columns} dataSource={dataSource} rowKey={record => record.code} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}
export default Form.create()(HostManage);
