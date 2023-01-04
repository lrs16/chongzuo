import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Card,
  Table,
  Input,
  Popconfirm,
  Button,
  Message,
  Divider,
  Badge,
  Tooltip,
  Form,
  // Pagination,
} from 'antd';
import router from 'umi/router';
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

const { Search } = Input;

const statusMap = ['default', 'success', 'processing'];
const status = ['停用', '启用', '临时'];

@connect(({ usermanage, loading }) => ({
  usermanage,
  loading: loading.models.usermanage,
}))
class SysuserMangage extends Component {

  state = {
    current: 1,
    pageSize: 15,
    queKey: '',
  };

  componentDidMount() {
    this.getlist();
  }

  componentDidUpdate() {
    const propsstate = this.props.location.state;
    if (propsstate && propsstate.reset) {
      this.resetquekey();
      this.props.dispatch({
        type: 'usermanage/search',
        payload: {
          page: 1,
          limit: 15,
          queKey: '',
        },
      });
      router.push({
        pathname: `/sysmanage/usersmanage`,
        state: { cach: false, reset: false }
      });
    }
  }

  resetquekey = () => {
    this.setState({
      current: 1,
      pageSize: 15,
      queKey: '',
    })
  }

  getlist = () => {
    const page = this.state.current;
    const limit = this.state.pageSize;
    const { queKey } = this.state;
    this.props.dispatch({
      type: 'usermanage/search',
      payload: {
        page,
        limit,
        queKey,
      },
    });
  };

  handleSearch = values => {
    const page = this.state.current;
    const limit = this.state.pageSize;
    this.setState({
      queKey: values,
    });
    this.props.dispatch({
      type: 'usermanage/search',
      payload: {
        queKey: values,
        page: 1,
        limit: 15,
      },
    });
  };

  changePage = page => {
    this.props.dispatch({
      type: 'usermanage/search',
      payload: {
        queKey: this.state.queKey,
        page,
        limit: this.state.pageSize,
      },
    });
    setTimeout(() => {
      this.setState({ current: page });
    }, 0);
  };

  onShowSizeChange = (current, pageSize) => {
    this.props.dispatch({
      type: 'usermanage/search',
      payload: {
        queKey: this.state.queKey,
        page: 1,
        limit: pageSize,
      },
    });
    setTimeout(() => {
      this.setState({ current: 1, pageSize });
    }, 0);
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
          this.getlist();
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
          this.getlist();
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
          this.getlist();
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
          this.getlist();
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

    // 分页
    const pagination = {
      showSizeChanger: true,
      onShowSizeChange: (current, pageSize) => this.onShowSizeChange(current, pageSize),
      current: this.state.current,
      pageSize: this.state.pageSize,
      total: data.total,
      showTotal: total => `总共  ${total}  条记录`,
      onChange: page => this.changePage(page),
    };

    const dataSource = data.rows;
    return (
      <PageHeaderWrapper>
        <Card>
          <Form style={{ float: 'right', width: '30%' }}>
            <Search placeholder="请输入关键字" onSearch={values => this.handleSearch(values)} defaultValue={this.state.queKey} key={this.state.queKey} />
          </Form>
          <NewUser onSumit={handleUpdate} title="新建用户" depdatas={depdata} loading={loading}>
            <Button
              style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
              type="dashed"
              icon="plus"
            >
              新建用户
            </Button>
          </NewUser>
          <Table
            loading={loading}
            dataSource={dataSource}
            columns={columns}
            rowKey={record => record.id}
            pagination={pagination}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default SysuserMangage;
