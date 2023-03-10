/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Table, Popconfirm, Button, Message, Divider, Badge } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import RoleModal from './components/ReloModal';
import RoleMenu from './components/RoleMenu';

// const { Search } = Input;
const statusMap = ['default', 'success'];
const status = ['停用', '启用'];
@connect(({ upmsrole, loading }) => ({
  upmsrole,
  loading: loading.models.upmsrole,
}))
class RoleManage extends Component {
  state = {
    current: 1,
    pageSize: 15,
    // queKey: '',
  };

  componentDidMount() {
    this.getlist();
  }

  componentDidUpdate() {
    const propsstate = this.props.location.state;
    if (propsstate && propsstate.reset) {
      this.resetquekey();
      this.getlist()
      router.push({
        pathname: `/sysmanage/rolemanage`,
        state: { cach: false, reset: false }
      });
    }
  }

  resetquekey = () => {
    this.setState({
      current: 1,
      pageSize: 15,
      // queKey: '',
    })
  }
  // 查询接口报500
  // getlist = () => {
  //   const page = this.state.current;
  //   const limit = this.state.pageSize;
  //   const { queKey } = this.state;
  //   this.props.dispatch({
  //     type: 'upmsrole/search',
  //     payload: {
  //       page,
  //       limit,
  //       queKey,
  //     },
  //   });
  // };

  getlist = () => {
    this.props.dispatch({
      type: 'upmsrole/fetchdatas',
    });
  };

  render() {
    const handleUpdate = values => {
      const { dispatch } = this.props;
      return dispatch({
        type: 'upmsrole/update',
        payload: values,
      }).then(res => {
        if (res.code === 200) {
          Message.success(res.msg);
          this.getlist();
        } else {
          Message.error('添加角色失败');
        }
      });
    };
    const handleEdite = values => {
      const { dispatch } = this.props;
      return dispatch({
        type: 'upmsrole/edite',
        payload: values,
      }).then(res => {
        if (res.code === 200) {
          Message.success(res.msg);
          this.getlist();
        } else {
          Message.error('更新角色信息失败');
        }
      });
    };
    const handleDelete = id => {
      const { dispatch } = this.props;
      return dispatch({
        type: 'upmsrole/remove',
        payload: { id },
      }).then(res => {
        if (res.code === 200) {
          Message.success(res.msg);
          this.getlist();
        } else {
          Message.error('删除角色失败');
        }
      });
    };


    const onShowSizeChange = (current, pageSize) => {
      setTimeout(() => {
        this.setState({ pageSize });
      }, 0);
    };

    const changePage = (page) => {
      setTimeout(() => {
        this.setState({ current: page });
      }, 0);
    }

    const columns = [
      // {
      //   title: '角色代码',
      //   dataIndex: 'roleCode',
      //   key: 'roleCode',
      // },
      {
        title: '角色名',
        dataIndex: 'roleName',
        key: 'roleName',
        width: 200,
      },
      {
        title: '角色描述',
        dataIndex: 'roleRemark',
        key: 'roleRemark',
      },
      {
        title: '启用状态',
        dataIndex: 'roleStatus',
        key: 'roleStatus',
        width: 200,
        render: (text, record) => (
          <span>
            <Badge status={statusMap[record.roleStatus]} text={status[record.roleStatus]} />
          </span>
        ),
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        width: 300,
        render: (text, record) => {
          const title = `【${record.roleName}】分配菜单`;
          return (
            <div>
              <RoleMenu title={title} roleId={record.id}>
                <a type="link">菜单权限</a>
              </RoleMenu>
              <Divider type="vertical" />
              <RoleModal onSumit={values => handleEdite(values)} title="编辑菜单" record={record}>
                <a type="link">编辑</a>
              </RoleModal>
              <Divider type="vertical" />
              <Popconfirm title="确定删除此菜单吗？" onConfirm={() => handleDelete(record.id)}>
                <a type="link">删除</a>
              </Popconfirm>
            </div>
          );
        },
      },
    ];
    const {
      upmsrole: { data }, loading,
    } = this.props;
    const pagination = {
      showSizeChanger: true,
      onShowSizeChange: (current, pageSize) => onShowSizeChange(current, pageSize),
      current: this.state.current,
      pageSize: this.state.pageSize,
      total: data.total,
      onChange: page => changePage(page),
    };
    const dataSource = [...data];
    return (
      <PageHeaderWrapper title="角色管理">
        <Card>
          {/* <Form style={{ float: 'right', width: '30%' }}>
            <Search placeholder="请输入关键字" onSearch={values => this.handleSearch(values)} />
          </Form> */}
          <RoleModal onSumit={handleUpdate}>
            <Button
              style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
              type="dashed"
              icon="plus"
            >
              新增角色
            </Button>
          </RoleModal>
          <Table
            dataSource={dataSource}
            columns={columns}
            rowKey={record => record.id}
            pagination={pagination}
            loading={loading}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default RoleManage;
