/* eslint-disable react/sort-comp */
import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
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
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
//import DeptTree from '@/components/DeptTree';
// import DeptList from './components/DeptList';
import DeptModal from './components/DeptModal';

const { Search } = Input;
const { Sider, Content } = Layout;
const statusMap = ['success', 'default'];
const status = ['启用', '停用'];

@connect(({ upmsdept, loading }) => ({
  upmsdept,
  loading: loading.models.upmsdept,
}))
class DeptManage extends Component {
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
      type: 'upmsdept/search',
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
        page: current,
        limit: pageSize,
      },
    });
    setTimeout(() => {
      this.setState({ pageSize });
    }, 0);
  };

  reloadtree() {
    const { dispatch } = this.props;
    dispatch({
      type: 'deptree/fetch',
    });
  }

  handleUpdate = values => {
    const { dispatch } = this.props;
    return dispatch({
      type: 'upmsdept/update',
      payload: values,
    }).then(res => {
      if (res.code === 200) {
        Message.success(res.msg);
        this.getlist();
        this.reloadtree();
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
        this.reloadtree();
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
        this.reloadtree();
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
      {
        title: '上级编号',
        dataIndex: 'pid',
        key: 'pid',
      },
      {
        title: '组织序号',
        dataIndex: 'deptSort',
        key: 'deptSort',
      },
      {
        title: '组织名称',
        dataIndex: 'deptName',
        key: 'deptName',
      },

      {
        title: '更新时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        sorter: (a, b) => a.name.length - b.name.length,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
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
              title="编辑脚本"
              record={record}
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
      onChange: page => this.changePage(page),
    };
    const dataSource = data.rows;
    return (
      <PageHeaderWrapper title="组织管理">
        <Card>
          <Layout>
            <Sider theme="light">{/* <DeptTree /> */}</Sider>
            <Content style={{ background: '#fff' }}>
              <div style={{ background: '#fff' }}>
                <Form style={{ float: 'right', width: '30%' }}>
                  <Search
                    placeholder="请输入关键字"
                    onSearch={values => this.handleSearch(values)}
                  />
                </Form>
                <DeptModal onSumit={this.handleUpdate}>
                  <Button
                    style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
                    type="dashed"
                    icon="plus"
                  >
                    新建组织
                  </Button>
                </DeptModal>
                {/* <DeptList
                  loading={loading}
                  datas={dataSource}
                  total ={data.total}
                  DeleteData={this.handleDelete}
                  doEdite={this.handleUpdate}
                  dochangpage = {this.changePage}
                  doSizeChange = {this.onShowSizeChange}
                /> */}
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
