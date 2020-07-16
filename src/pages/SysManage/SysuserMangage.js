import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Table, Popconfirm, Button, Message, Divider, Badge, Tooltip } from 'antd';
import {
  ToolOutlined,
  UnlockOutlined,
  SolutionOutlined,
  DeleteOutlined,
  IdcardOutlined,
} from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import UpdateUser from './components/UserUpdate';
import NewUser from './components/UserNew';
import UserRole from './components/UserRole';
import ViewUser from './components/UserView';

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
          Message.error(res.msg);
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
          Message.error('更新用户信息失败！');
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
          Message.error('删除用户失败！');
        }
      });
    };
    const handleReset = id => {
      const { dispatch } = this.props;
      return dispatch({
        type: 'usermanage/reset',
        payload: { id },
      }).then(res => {
        if (res.code === 200) {
          Message.success(res.msg);
          this.getuserslist();
        } else {
          Message.error('重置密码失败！');
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
        title: '登录账号',
        dataIndex: 'loginCode',
        key: 'loginCode',
      },
      {
        title: '用户名',
        dataIndex: 'userName',
        key: 'userName',
      },
      {
        title: '所属部门',
        dataIndex: 'deptNameExt',
        key: 'deptNameExt',
      },
      {
        title: '创建人',
        dataIndex: 'createUserNameExt',
        key: 'createUserNameExt',
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
              <Tooltip title="配置权限">
                <a type="link">
                  <ToolOutlined />
                </a>
              </Tooltip>
            </UserRole>
            <Divider type="vertical" />
            <Popconfirm title="确定重置该用户登录密码吗？" onConfirm={() => handleReset(record.id)}>
              <Tooltip title="重置密码">
                <a type="link">
                  <UnlockOutlined />
                </a>
              </Tooltip>
            </Popconfirm>
            <Divider type="vertical" />
            <UpdateUser
              onSumit={values => handleEdite(values)}
              title="编辑用户"
              record={record}
              loading={this.props.loading}
            >
              <Tooltip title="编辑用户信息">
                <a type="link">
                  <SolutionOutlined />
                </a>
              </Tooltip>
            </UpdateUser>
            <Divider type="vertical" />
            <ViewUser record={record} userId={record.id}>
              <Tooltip title="查看用户信息">
                <a type="link">
                  <IdcardOutlined />
                </a>
              </Tooltip>
            </ViewUser>
            {record.loginCode !== 'admin' && (
              <>
                <Divider type="vertical" />
                <Popconfirm title="确定删除此用户吗？" onConfirm={() => handleDelete(record.id)}>
                  <Tooltip title="删除用户">
                    <a type="link">
                      <DeleteOutlined />
                    </a>
                  </Tooltip>
                </Popconfirm>
              </>
            )}
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
