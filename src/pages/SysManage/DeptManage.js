/* eslint-disable react/sort-comp */
import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import {
  Layout,
  Card,
  Form,
  Button,
  Input,
  Message,
  Table,
  Divider,
  Badge,
  Popconfirm,
  Tree,
  message,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

// import DeptTree from '@/components/DeptTree';
// import DeptList from './components/DeptList';
import DeptModal from './components/DeptModal';

const { Search } = Input;
const { Sider, Content } = Layout;
const { TreeNode } = Tree;
const statusMap = ['default', 'success'];
const status = ['停用', '启用'];

@connect(({ upmsdept, loading }) => ({
  upmsdept,
  loading: loading.models.upmsdept,
}))
class DeptManage extends Component {
  state = {
    current: 1,
    pageSize: 15,
    queKey: '',
    treeData: [],
    pidkey: '',
  };

  componentDidMount() {
    this.getlist();
    this.getdeptree('7AC3EF0F701402A2E0530A644F130365');
  }

  componentDidUpdate() {
    const propsstate = this.props.location.state;
    if (propsstate && propsstate.reset) {
      this.resetquekey();
      this.props.dispatch({
        type: 'upmsdept/search',
        payload: {
          page: '',
          limit: '',
          queKey: '',
          pid: '',
        },
      });
      this.getdeptree('7AC3EF0F701402A2E0530A644F130365');
      router.push({
        pathname: `/sysmanage/deptmanage`,
        state: { cach: false, reset: false }
      });
    }
  }

  resetquekey = () => {
    this.setState({
      current: 1,
      pageSize: 15,
      queKey: '',
      treeData: [],
      pidkey: '',
    })
  }

  getlist = () => {
    const page = this.state.current;
    const limit = this.state.pageSize;
    const { queKey, pidkey } = this.state;
    this.props.dispatch({
      type: 'upmsdept/search',
      payload: {
        page,
        limit,
        queKey,
        pid: pidkey,
      },
    });
  };

  getdeptree = pid => {
    this.props
      .dispatch({
        type: 'upmsdept/needtree',
        payload: { pid },
      })
      .then(res => {
        setTimeout(() => {
          this.setState({ treeData: res.data });
        }, 0);
      });
  };

  // 点击节点
  handleClick = selectedKeys => {
    setTimeout(() => {
      this.setState({ pidkey: selectedKeys[0] });
    }, 0);
    const page = this.state.current;
    const limit = this.state.pageSize;
    this.props.dispatch({
      type: 'upmsdept/search',
      payload: {
        page,
        limit,
        pid: selectedKeys[0],
      },
    });
  };

  // 点击加载结点
  onLoadData = treeNode =>
    new Promise(resolve => {
      if (treeNode.props.children) {
        resolve();
        return;
      }
      this.props
        .dispatch({
          type: 'upmsdept/needtree',
          payload: {
            pid: treeNode.props.dataRef.key,
          },
        })
        .then(res => {
          if (res.data !== undefined) {
            treeNode.props.dataRef.children = res.data;
          } else {
            message.info('已经到最后一层！');
          }
        });
      setTimeout(() => {
        this.setState({
          treeData: [...this.state.treeData],
        });
        resolve();
      }, 600);
    });

  // 渲染树结构
  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} {...item} dataRef={item} />;
    });

  handleSearch = values => {
    const page = this.state.current;
    const limit = this.state.pageSize;
    this.setState({
      queKey: values,
    });
    this.props.dispatch({
      type: 'upmsdept/search',
      payload: {
        queKey: values,
        page,
        limit,
      },
    });
  };

  changePage = page => {
    this.props.dispatch({
      type: 'upmsdept/search',
      payload: {
        queKey: this.state.queKey,
        pid: this.state.pidkey,
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
      type: 'upmsdept/search',
      payload: {
        queKey: this.state.queKey,
        pid: this.state.pidkey,
        page: current,
        limit: pageSize,
      },
    });
    setTimeout(() => {
      this.setState({ pageSize });
    }, 0);
  };

  handleUpdate = values => {
    const { dispatch } = this.props;
    return dispatch({
      type: 'upmsdept/update',
      payload: values,
    }).then(res => {
      if (res.code === 200) {
        Message.success(res.msg);
        this.getlist();
      } else {
        Message.error('添加组织失败');
      }
    });
  };

  handleEdite = values => {
    const { dispatch } = this.props;
    return dispatch({
      type: 'upmsdept/edite',
      payload: values,
    }).then(res => {
      if (res.code === 200) {
        Message.success(res.msg);
        this.getlist();
      } else {
        Message.error('更新组织失败');
      }
    });
  };

  handleDelete = id => {
    const { dispatch } = this.props;
    return dispatch({
      type: 'upmsdept/remove',
      payload: { id },
    }).then(res => {
      if (res.code === 200) {
        Message.success(res.msg);
        this.getlist();
      } else {
        Message.error('删除组织失败');
      }
    });
  };

  render() {
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      },
      // {
      //   title: '组织序号',
      //   dataIndex: 'deptSort',
      //   key: 'deptSort',
      // },
      {
        title: '组织名称',
        dataIndex: 'deptName',
        key: 'deptName',
      },
      // {
      //   title: '更新时间',
      //   dataIndex: 'updateTime',
      //   key: 'updateTime',
      //   sorter: (a, b) => a.name.length - b.name.length,
      //   render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      // },
      {
        title: '启用状态',
        dataIndex: 'deptStatus',
        key: 'deptStatus',
        render: (text, record) => (
          <span>
            <Badge status={statusMap[record.deptStatus]} text={status[record.deptStatus]} />
          </span>
        ),
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => (
          <div>
            <DeptModal
              onSumit={values => this.handleEdite(values)}
              title="编辑组织"
              record={record}
              pidkey={record.pid}
            >
              <a type="link">编辑</a>
            </DeptModal>
            <Divider type="vertical" />
            <Popconfirm title="确定删除此组织吗？" onConfirm={() => this.handleDelete(record.id)}>
              <a type="link">删除</a>
            </Popconfirm>
          </div>
        ),
      },
    ];

    const {
      loading,
      upmsdept: { data },
    } = this.props;

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
      <PageHeaderWrapper title="组织管理">
        <Card>
          <Layout>
            <Sider
              theme="light"
              width={220}
              style={{
                overflow: 'auto',
                height: 'calc(100vh - 177px)',
              }}
            >
              {(!this.props.location.state || (this.props.location.state && !this.props.location.state.reset)) && (
                <Tree loadData={this.onLoadData} onSelect={this.handleClick}>
                  {this.renderTreeNodes(this.state.treeData)}
                </Tree>
              )}
            </Sider>
            <Content
              style={{
                overflow: 'auto',
                height: 'calc(100vh - 177px)',
                background: '#fff',
              }}
            >
              <div style={{ background: '#fff' }}>
                <Form style={{ float: 'right', width: '30%' }}>
                  <Search
                    placeholder="请输入关键字"
                    onSearch={values => this.handleSearch(values)}
                    defaultValue={this.state.queKey}
                    key={this.state.queKey}
                  />
                </Form>
                <DeptModal onSumit={this.handleUpdate} pidkey={this.state.pidkey}>
                  <Button
                    style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
                    type="dashed"
                    icon="plus"
                  >
                    新建组织
                  </Button>
                </DeptModal>
                <Table
                  loading={loading}
                  dataSource={dataSource}
                  columns={columns}
                  rowKey={record => record.id}
                  pagination={pagination}
                />
              </div>
            </Content>
          </Layout>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default DeptManage;
