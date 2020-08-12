import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
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
  state = {
    current: 1,
    pageSize: 10,
    queKey: '',
  };
  componentDidMount() {
    this.getsoftlist();
  }

  // getsoftlist() {
  //   this.props.dispatch({
  //     type: 'automaticmodel/fetchsoftlist',
  //   });
  // }

  getsoftlist = () => {
    const page = this.state.current;
    const limit = this.state.pageSize;
    const { queKey } = this.state;
    this.props.dispatch({
      type: 'automaticmodel/fetchsoftlist',
      paload: {
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
      type: 'automaticmodel/softSearch',
      payload: {
        queKey: values,
        page,
        limit,
      },
    });
  };

  changePage = page => {
    this.props.dispatch({
      type: 'automaticmodel/search',
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
      type: 'automaticmodel/search',
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

  render() {
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
        title: 'id',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '软件名称',
        dataIndex: 'softwareName',
        key: 'softwareName',
      },
      {
        title: '软件使用端口',
        dataIndex: 'softwarePort',
        key: 'softwarePort',
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '软件版本',
        dataIndex: 'softwareVersion',
        key: 'softwareVersion',
      },
      // {
      //   title: '软件排序',
      //   dataIndex: 'softwareSort',
      //   key: 'softwareSort',
      // },
      {
        title: '软件备注',
        dataIndex: 'softwareRemark',
        key: 'softwareRemark',
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => (
          <div>
            <span
              title="配置软件"
              // roleId={record.id}
            >
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
    const {
      automaticmodel: { softdata },
    } = this.props;
    const dataSource = softdata.rows;
    const pagination = {
      showSizeChanger: true,
      onShowSizeChange: (current, pageSize) => this.onShowSizeChange(current, pageSize),
      current: this.state.current,
      pageSize: this.state.pageSize,
      total: softdata.total,
      onChange: page => this.changePage(page),
    };

    return (
      <PageHeaderWrapper>
        <Card>
          <Form style={{ float: 'right', width: '30%' }}>
            <Search placeholder="请输入关键字" onSearch={values => this.handleSearch(values)} />
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
          <Table
            columns={columns}
            dataSource={dataSource}
            rowKey={record => record.id}
            pagination={pagination}
            scroll={{ x: 'calc(700px + 50%)', y: 240 }}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}
export default Form.create()(SoftManage);
