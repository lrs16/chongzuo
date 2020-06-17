import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Table, Popconfirm, Button, Message, Divider, Badge } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import UpdateUser from './components/UpdateUser';
import NewUser from './components/NewUser';
import UserRole from './components/UserRole';

const statusMap = ['default', 'success', 'processing'];
const status = ['停用', '启用', '临时'];

@connect(({ usermanage, loading }) => ({
  usermanage,
  loading: loading.models.usermanage,
}))
class SysuserMangage extends Component {
  componentDidMount() {
    this.getuserslist();
    this.loaddeptree();
  }

  getuserslist() {
    this.props.dispatch({
      type: 'usermanage/fetch',
    });
  }

  loaddeptree = () => {
    this.props.dispatch({
      type: 'usermanage/fetchdept',
    });
  };

  render() {
    const handleUpdate = values => {
      const { dispatch } = this.props;
      return dispatch({
        type: 'usermanage/update',
        payload: values,
      }).then(res => {
        if (res.code === 200) {
          Message.success(res.msg);
          this.getuserslist();
        } else {
          Message.error('添加用户失败');
        }
      });
    };

    const handleEdite = values => {
      const { dispatch } = this.props;
      return dispatch({
        type: 'usermanage/update',
        payload: values,
      }).then(res => {
        if (res.code === 200) {
          Message.success(res.msg);
          this.getuserslist();
        } else {
          Message.error('更新用户信息失败');
        }
      });
    };

    const handleDelete = id => {
      const { dispatch } = this.props;
      return dispatch({
        type: 'usermanage/remove',
        payload: { id },
      }).then(res => {
        if (res.code === 200) {
          Message.success(res.msg);
          this.getuserslist();
        } else {
          Message.error('删除用户失败');
        }
      });
    };
    const columns = [
      {
        title: '用户ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '昵称',
        dataIndex: 'loginCode',
        key: 'loginCode',
      },
      {
        title: '用户名',
        dataIndex: 'userName',
        key: 'userName',
      },
      {
        title: '创建人',
        dataIndex: 'createUser',
        key: 'createUser',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        // defaultSortOrder: 'descend',  //排序
        // sorter: (a, b) => a.createTime - b.createTime, //排序
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '启用状态',
        dataIndex: 'userStatus',
        key: 'userStatus',
        render: (text, record) => (
          <span>
            <Badge status={statusMap[record.userStatus]} text={status[record.userStatus]} />
          </span>
        ),
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => (
          <div>
            <UserRole userId={record.id} userName={record.userName}>
              <a type="link">分配角色</a>
            </UserRole>
            <Divider type="vertical" />
            <span record={record}>
              <a type="link">密码重置</a>
            </span>
            <Divider type="vertical" />
            <UpdateUser
              onSumit={values => handleEdite(values)}
              title="编辑用户"
              record={record}
              loading={this.props.loading}
            >
              <a type="link">编辑</a>
            </UpdateUser>
            <Divider type="vertical" />

            <Popconfirm title="确定删除此用户吗？" onConfirm={() => handleDelete(record.id)}>
              <a type="link">删除</a>
            </Popconfirm>
          </div>
        ),
      },
    ];
    const {
      usermanage: { data, depdata },
      loading,
    } = this.props;
    const dataSource = [...data];
    return (
      <PageHeaderWrapper>
        <Card>
          <NewUser onSumit={handleUpdate} title="新建用户" depdatas={depdata} loading={loading}>
            <Button
              style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
              type="dashed"
              icon="plus"
            >
              新建用户
            </Button>
          </NewUser>
          <Table dataSource={dataSource} columns={columns} rowKey={record => record.id} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default SysuserMangage;
