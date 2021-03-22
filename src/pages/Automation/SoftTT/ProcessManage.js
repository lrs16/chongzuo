import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Table, Form, Input, Button, Message, Divider, Popconfirm, Row, Col } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProcessEdit from './components/ProcessEdit';
import BatchAdd from './components/BatchAdd';

const { Search } = Input;

@connect(({ upmsprocess, loading }) => ({
  upmsprocess,
  loading: loading.models.upmsprocess,
}))
class ProcessManage extends Component {
  state = {
    current: 1,
    pageSize: 15,
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
      type: 'upmsprocess/fetch',
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

  handleEdite = values => {
    const { dispatch } = this.props;
    return dispatch({
      type: 'upmsprocess/edite',
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

  handleDelete = id => {
    const { dispatch } = this.props;
    return dispatch({
      type: 'upmsprocess/remove',
      payload: { id },
    }).then(res => {
      if (res.code === 200) {
        Message.success(res.msg);
        this.getlist();
      } else {
        Message.error(res.msg);
      }
    });
  };

  handleAdd = values => {
    const { dispatch } = this.props;
    return dispatch({
      type: 'upmsprocess/add',
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

  handleBatchadd = str => {
    const { dispatch } = this.props;
    return dispatch({
      type: 'upmsprocess/batchAddprocess',
      payload: str,
    }).then(res => {
      if (res.code === 200) {
        Message.success(res.msg);
        this.getlist();
      } else {
        Message.error(res.msg);
      }
    });
  };

  render() {
    const columns = [
      {
        title: '进程名称',
        dataIndex: 'courseName',
        key: 'courseName',
      },
      {
        title: '进程代码',
        dataIndex: 'courseCode',
        key: 'courseCode',
      },
      {
        title: '进程备注',
        dataIndex: 'courseRemark',
        key: 'courseRemark',
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
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: 250,
        render: (text, record) => (
          <div>
            <ProcessEdit
              onSumit={values => this.handleEdite(values)}
              title="编辑进程"
              record={record}
            >
              <a type="link">编辑进程</a>
            </ProcessEdit>
            <Divider type="vertical" />
            <Popconfirm title="确定删除此进程？" onConfirm={() => this.handleDelete(record.id)}>
              <a type="link">删除进程</a>
            </Popconfirm>
          </div>
        ),
      },
    ];

    const {
      upmsprocess: { list },
    } = this.props;
    const dataSource = list.rows;

    const pagination = {
      showSizeChanger: true,
      onShowSizeChange: (current, pageSize) => this.onShowSizeChange(current, pageSize),
      current: this.state.current,
      pageSize: this.state.pageSize,
      total: list.total,
      showTotal: total => `总共  ${total}  条记录`,
      onChange: page => this.changePage(page),
    };

    return (
      <PageHeaderWrapper title="进程管理">
        <Card>
          <Row>
            <Form style={{ float: 'right', width: '30%' }}>
              <Search
                placeholder="请输入关键字"
                allowClear
                onSearch={values => this.handleSearch(values)}
              />
              ,
            </Form>
          </Row>
          <Row gutter={16}>
            <Col className="gutter-row" span={12}>
              <div>
                <ProcessEdit onSumit={values => this.handleAdd(values)}>
                  <Button
                    style={{ width: '100%', margin: '16px 0 8px 0' }}
                    type="dashed"
                    icon="plus"
                  >
                    添加进程
                  </Button>
                </ProcessEdit>
              </div>
            </Col>
            <Col className="gutter-row" span={12}>
              <div>
                <BatchAdd
                  processId="processId"
                  onsumitBatchprocess={str => this.handleBatchadd(str)}
                >
                  <Button
                    style={{ width: '100%', margin: '16px 0 8px 0' }}
                    type="dashed"
                    icon="plus"
                  >
                    批量添加
                  </Button>
                </BatchAdd>
              </div>
            </Col>
          </Row>
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

export default ProcessManage;
