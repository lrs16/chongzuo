import React, { Component } from 'react';
import { connect } from 'dva';
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
  Tag,
  Layout,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import MenuModal from './components/MenuModal';

const { Search } = Input;
const { Sider, Content } = Layout;

@connect(({ upmsmenu, loading }) => ({
  upmsmenu,
  loading: loading.models.upmsmenu,
}))
class MenuManage extends Component {
  state = {
    current: 1,
    pageSize: 10,
    queKey: '',
  };

  componentDidMount() {
    this.getlist();
  }

  getlist = () => {
    const page = this.state.current;
    const limit = this.state.pageSize;
    const { queKey } = this.state;
    this.props.dispatch({
      type: 'upmsmenu/search',
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
        title: '英文名称',
        dataIndex: 'menuName',
        key: 'menuName',
      },
      {
        title: '中文名称',
        dataIndex: 'menuDesc',
        key: 'menuDesc',
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
        render: (text, record) => (
          <div>
            <MenuModal onSumit={values => handleEdite(values)} title="编辑菜单" record={record}>
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
      upmsmenu: { data },
    } = this.props;
    const dataSource = data.rows;
    const pagination = {
      showSizeChanger: true,
      onShowSizeChange: (current, pageSize) => this.onShowSizeChange(current, pageSize),
      current: this.state.current,
      pageSize: this.state.pageSize,
      total: data.total,
      onChange: page => this.changePage(page),
    };
    // const mainnav = this.dataDeal(dataSource);
    return (
      <PageHeaderWrapper title="菜单管理">
        <Card>
          <Layout>
            <Sider theme="light">{/* <DeptTree /> */}</Sider>
            <Content style={{ background: '#fff' }}>
              <div>
                {/* <div style={{ float: 'left', width: '60%' }}>
              {mainnav.map(item => {
                return (
                  <Button key={item.id} style={{ marginRight: 10 }}>
                    {item.menuDesc}
                  </Button>
                );
              })}
            </div> */}
                <Form style={{ float: 'right', width: '30%' }}>
                  <Search
                    placeholder="请输入关键字"
                    onSearch={values => this.handleSearch(values)}
                  />
                </Form>
                <MenuModal onSumit={handleUpdate}>
                  <Button
                    style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
                    type="dashed"
                    icon="plus"
                  >
                    新建菜单
                  </Button>
                </MenuModal>
                <Table
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

export default MenuManage;
