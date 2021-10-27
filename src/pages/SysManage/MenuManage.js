import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import {
  Card,
  Table,
  Divider,
  Button,
  Message,
  Popconfirm,
  Input,
  Form,
  Icon,
  Layout,
  Tree,
  message,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import MenuModal from './components/MenuModal';

const { Search } = Input;
const { Sider, Content } = Layout;
const { TreeNode } = Tree;

function getAllLeaf(data) {
  const result = [];
  function getLeaf(data) {
    if (data[0].children.length === 1) {
      getLeaf(data[0].children);
    } else {
      result.push(data[0].children);
    }
  }
  getLeaf(data);
  return result[0];
}

@connect(({ upmsmenu, loading }) => ({
  upmsmenu,
  loading: loading.models.upmsmenu,
  treeloading: loading.effects['upmsmenu/fetchdatas'],
}))
class MenuManage extends Component {
  state = {
    current: 1,
    pageSize: 15,
    queKey: '',
    treeData: [],
    pidkey: '',
  };

  componentDidMount() {
    this.getlist();
    this.getalldata();
  }

  componentDidUpdate() {
    const propsstate = this.props.location.state;
    if (propsstate && propsstate.reset) {
      this.resetquekey();
      this.props.dispatch({
        type: 'upmsmenu/search',
        payload: {
          page: 1,
          limit: 15,
          queKey: '',
          pid: '',
        },
      });
      this.getalldata();
      router.push({
        pathname: `/sysmanage/menumanage`,
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

  // 按需加载树节点
  getalldata = () => {
    this.props
      .dispatch({
        type: 'upmsmenu/fetchdatas',
        payload: {
          pid: '0',
        },
      }).then(res => {
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
      type: 'upmsmenu/search',
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
          type: 'upmsmenu/fetchdatas',
          payload: {
            pid: treeNode.props.dataRef.key,
          },
        }).then(res => {
          if (res.data !== undefined) {
            const sontreedata = getAllLeaf(res.data);
            treeNode.props.dataRef.children = sontreedata;
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

  getlist = () => {
    const page = this.state.current;
    const limit = this.state.pageSize;
    const { queKey, pidkey } = this.state;
    this.props.dispatch({
      type: 'upmsmenu/search',
      payload: {
        page,
        limit,
        queKey,
        pid: pidkey,
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
      type: 'upmsmenu/search',
      payload: {
        queKey: values,
        page,
        limit,
      },
    });
  };

  changePage = page => {
    this.props.dispatch({
      type: 'upmsmenu/search',
      payload: {
        queKey: this.state.queKey,
        page,
        limit: this.state.pageSize,
        pid: this.state.pidkey,
      },
    });
    setTimeout(() => {
      this.setState({ current: page });
    }, 0);
  };

  onShowSizeChange = (current, pageSize) => {
    this.props.dispatch({
      type: 'upmsmenu/search',
      payload: {
        queKey: this.state.queKey,
        page: current,
        limit: pageSize,
        pid: this.state.pidkey,
      },
    });
    setTimeout(() => {
      this.setState({ pageSize });
    }, 0);
  };

  dataDeal = data => {
    const listArr = [];
    data.forEach(item => {
      if (item.pid === '0') {
        listArr.push(item);
      }
    });
    return listArr;
  };

  render() {
    const handleUpdate = values => {
      const { dispatch } = this.props;
      return dispatch({
        type: 'upmsmenu/update',
        payload: values,
      }).then(res => {
        if (res.code === 200) {
          Message.success(res.msg);
          this.getlist();
        } else {
          Message.error('添加菜单失败');
        }
      });
    };
    const handleEdite = values => {
      const { dispatch } = this.props;
      return dispatch({
        type: 'upmsmenu/edite',
        payload: values,
      }).then(res => {
        if (res.code === 200) {
          Message.success(res.msg);
          this.getlist();
        } else {
          Message.error('更新菜单失败');
        }
      });
    };
    const handleDelete = id => {
      const { dispatch } = this.props;
      return dispatch({
        type: 'upmsmenu/remove',
        payload: { id },
      }).then(res => {
        if (res.code === 200) {
          Message.success(res.msg);
          this.getlist();
        } else {
          Message.error('删除菜单失败');
        }
      });
    };

    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '菜单名称',
        dataIndex: 'menuDesc',
        key: 'menuDesc',
      },
      // {
      //   title: '英文名称',
      //   dataIndex: 'menuName',
      //   key: 'menuName',
      // },
      {
        title: '路由',
        dataIndex: 'menuUrl',
        key: 'menuUrl',
      },
      {
        title: '图标',
        dataIndex: 'menuIcon',
        key: 'menuIcon',
        render: (text, record) => (
          <span>
            <Icon type={record.menuIcon} style={{ fontSize: 22 }} />
          </span>
        ),
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        sorter: (a, b) => a.name.length - b.name.length,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        fixed: 'right',
        width: 150,
        render: (text, record) => (
          <div>
            <MenuModal
              onSumit={values => handleEdite(values)}
              title="编辑菜单"
              record={record}
              pidkey={record.pid}
            >
              <a type="link">编辑</a>
            </MenuModal>
            <Divider type="vertical" />
            <Popconfirm title="确定删除此菜单吗？" onConfirm={() => handleDelete(record.id)}>
              <a type="link">删除</a>
            </Popconfirm>
          </div>
        ),
      },
    ];
    const {
      upmsmenu: { data }, loading
    } = this.props;
    const dataSource = data.rows;
    const pagination = {
      showSizeChanger: true,
      onShowSizeChange: (current, pageSize) => this.onShowSizeChange(current, pageSize),
      current: this.state.current,
      pageSize: this.state.pageSize,
      total: data.total,
      showTotal: total => `总共  ${total}  条记录`,
      onChange: page => this.changePage(page),
    };
    // const mainnav = this.dataDeal(dataSource);
    return (
      <PageHeaderWrapper title="菜单管理">
        <Card>
          <Layout>
            <Sider theme="light">
              {(!this.props.location.state || (this.props.location.state && !this.props.location.state.reset)) && (
                <Tree loadData={this.onLoadData} onCheck={this.onCheck} onSelect={this.handleClick}>
                  {this.renderTreeNodes(this.state.treeData)}
                </Tree>
              )}
            </Sider>
            <Content style={{ background: '#fff' }}>
              <div>
                <Form style={{ float: 'right', width: '30%' }}>
                  <Search
                    placeholder="请输入关键字"
                    onSearch={values => this.handleSearch(values)}
                    defaultValue={this.state.queKey}
                    key={this.state.queKey}
                  />
                </Form>
                <MenuModal onSumit={handleUpdate} pidkey={this.state.pidkey}>
                  <Button
                    style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
                    type="dashed"
                    icon="plus"
                  >
                    新建菜单
                  </Button>
                </MenuModal>
                <Table
                  loading={loading}
                  dataSource={dataSource}
                  columns={columns}
                  rowKey={record => record.id}
                  pagination={pagination}
                  scroll={{ x: 1300 }}
                />
              </div>
            </Content>
          </Layout>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default MenuManage;
