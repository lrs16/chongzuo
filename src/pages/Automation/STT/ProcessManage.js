import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Card,
  Table,
  Form,
  Input,
  Button,
  Message,
  Divider,
  Badge,
  Popconfirm,
  Pagination,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProcessEdit from './components/ProcessEdit';

const { Search } = Input;

@connect(({ upmsprocess, loading }) => ({
  upmsprocess,
  loading: loading.models.upmsprocess,
}))
class ProcessManage extends Component {
  state = {
    current: 1,
    pagesize: 10,
    quwKey: '',
  };
  componentDidMount() {
    // this.getlist();
    const { dispatch } = this.props;
    dispatch({
      type: 'upmsprocess/fetch',
    });
  }

  // getlist = () => {
  //   const page = this.state.current;
  //   const limit = this.state.pageSize;
  //   const { queKey } = this.state;
  //   this.props.dispatch({
  //     type: 'upmsprocess/fetch',
  //     payload: {
  //       page,
  //       limit,
  //       queKey,
  //     },
  //   });
  // };

  // 点击查询
  handleSearch = values => {
    const page = this.state.current;
    const limit = this.state.pageSize;
    this.setState({
      queKey: values,
    });
    this.props.dispatch({
      type: 'upmsprocess/search',
      payload: {
        queKey: values,
        page,
        limit,
      },
    });
  };

  changePage = page => {
    this.props.dispatch({
      type: 'upmsprocess/search',
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
      type: 'upmsprocess/search',
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
    const reload = () => {
      const { dispatch } = this.props;
      dispatch({
        type: 'upmsprocess/fetch',
      });
    };

    const handleEdite = values => {
      const { dispatch } = this.props;
      return dispatch({
        type: 'upmsprocess/edite',
        payload: values,
      }).then(res => {
        if (res.code === 200) {
          Message.success(res.msg);
          reload();
        } else {
          Message.error('编辑失败');
        }
      });
    };

    const handleDelete = id => {
      const { dispatch } = this.props;
      return dispatch({
        type: 'upmsprocess/remove',
        payload: id,
      }).then(res => {
        if (res.code === 200) {
          Message.success(res.msg);
          reload();
        } else {
          Message.error('删除失败');
        }
      });
    };

    const handleAdd = values => {
      const { dispatch } = this.props;
      return dispatch({
        type: 'upmsprocess/add',
        payload: values,
      }).then(res => {
        if (res.code === 200) {
          Message.success(res.msg);
          reload();
        } else {
          Message.error('添加失败');
        }
      });
    };

    const columns = [
      {
        title: '编码',
        dataIndex: 'code',
        key: 'index',
      },
      {
        title: '应用',
        dataIndex: 'application',
        key: 'application',
      },
      {
        title: '进程名称',
        dataIndex: 'processName',
        key: 'processName',
      },
      {
        title: 'CPU',
        dataIndex: 'cpu',
        key: 'cpu',
      },
      {
        title: '内存',
        dataIndex: 'memory',
        key: 'memory',
      },
      {
        title: '磁盘',
        dataIndex: 'disk',
        key: 'disk',
      },
      {
        title: '网络',
        dataIndex: 'network',
        key: 'network',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => (
          <div>
            <ProcessEdit onSumit={values => handleEdite(values)} title="编辑进程" record={record}>
              <a type="link">编辑</a>
            </ProcessEdit>
            <Divider type="vertical" />
            <Popconfirm title="确定删除此进程？" onConfirm={() => handleDelete(record.id)}>
              <a type="link">删除</a>
            </Popconfirm>
          </div>
        ),
      },
    ];

    const {
      upmsprocess: { list },
    } = this.props;
    const dataSource = [...list];

    //分页操作
    const pagination = {
      showSizeChanger: true,
      onShowSizeChange: (current, pageSize) => this.onShowSizeChange(current, pageSize),
      current: this.state.current,
      pageSize: this.state.pageSize,
      total: list.total,
      onChange: page => this.changePage(page),
    };

    const { getFieldDecorator } = this.props.form;

    return (
      <PageHeaderWrapper>
        <Card>
          <Form style={{ float: 'right', width: '30%' }}>
            {getFieldDecorator('queKey')(
              <Search
                placeholder="请输入关键字"
                allowClear
                onSearch={values => this.handleSearch(values)}
              />,
            )}
          </Form>
          <ProcessEdit onSumit={values => handleAdd(values)}>
            <Button
              style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
              type="dashed"
              icon="plus"
            >
              添加进程
            </Button>
          </ProcessEdit>
          <Table
            columns={columns}
            dataSource={dataSource}
            rowKey={record => record.id}
            pagination={pagination}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}
export default Form.create()(ProcessManage);
