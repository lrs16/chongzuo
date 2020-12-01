import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Card,
  Table,
  Form,
  Input,
  Button,
  Message,
  Divider,
  Popconfirm,
  Row,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ModelEdit from './components/ModelEdit';

const { Search } = Input;

@connect(({ processmanagement, loading }) => ({
  processmanagement,
  loading: loading.models.processmanagement,
}))
class ProcessModel extends Component {
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
      type: 'processmanagement/fetchlist',
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
      type: 'processmanagement/fetchlist',
      payload: {
        queKey: values,
        page,
        limit,
      },
    });
  };

  onShowSizeChange = (current, pageSize) => {
    this.props.dispatch({
      type: 'processmanagement/fetchlist',
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

  changePage = page => {
    this.props.dispatch({
      type: 'processmanagement/fetchlist',
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

  handleEdite = values => {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'hostsoft/edit',
    //   payload: values,
    // }).then(res => {
    //   if (res.code === 200) {
    //     Message.success(res.msg);
    //     this.getlist();
    //   } else {
    //     Message.error(res.msg);
    //   }
    // });
  };

  handleDelete = id => {
    const { dispatch } = this.props;
    return dispatch({
      type: 'processmanagement/modelDelete',
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

  handleUpdate = values => {
    const { dispatch } = this.props;
    return dispatch({
      type: 'processmanagement/modelSave',
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


  render() {
    const {
      processmanagement: { list },
    } = this.props;
    const dataSource = list.rows;
    
    const pagination = {
      showSizeChanger: true,
      onShowSizeChange: (current, pageSize) => this.onShowSizeChange(current, pageSize),
      current: this.state.current,
      pageSize: this.state.pageSize,
      total: list.total,
      onChange: page => this.changePage(page),
    };

    const columns = [
      {
        title: '数据编号',
        dataIndex: 'id',
        key: 'id',
        width:200,
        ellipsis: true
      },
      {
        title: '模型关键字',
        dataIndex: 'key',
        key: 'key',
        width:200,
        ellipsis: true
      },
      {
        title: '模型名称',
        dataIndex: 'name',
        key: 'name',
        width:200,
        ellipsis: true
      },
      {
        title: '模型版本',
        dataIndex: 'version',
        key: 'version',
        width:200,
        ellipsis: true
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width:200,
        ellipsis: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '最后更新时间',
        dataIndex: 'lastUpdateTime',
        key: 'lastUpdateTime',
        width:200,
        ellipsis: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '元数据',
        dataIndex: 'metaInfo',
        key: 'metaInfo',
        width: 150,
        ellipsis: true,
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        width: 200,
        fixed: 'right',
        render: (text, record) => (
          <div>
            <ModelEdit
              // onSumit={values => this.handleEdite(values)}
              title="编辑模型"
              record={record}
              modelsId={record.id}
              // refresh={this.getlist}
            >
              <Button type='primary' style={{padding:0,marginRight:10}}>编辑模型</Button>
            </ModelEdit>
            {/* <Divider type="vertical" /> */}
            <Popconfirm title="确定删除此模型吗？" onConfirm={() => this.handleDelete(record.id)}>
              <Button type='danger' style={{padding:0}}>删除模型</Button>
            </Popconfirm>
          </div>
        ),
      },
    ];

    return (
      <PageHeaderWrapper title="流程模型">
        <Card>
            <Row>
              <Form style={{ float: 'right', width: '30%' }}>
                <Search placeholder="请输入关键字" onSearch={values => this.handleSearch(values)} />
              </Form>
            </Row>
                <div>
                  <ModelEdit onSumit={this.handleUpdate}>
                    <Button
                      style={{ width: '100%', margin: '16px 0 8px 0' }}
                      type="dashed"
                      icon="plus"
                    >
                      添加模型
                    </Button>
                  </ModelEdit>
                </div>
            <Table
            columns={columns}
            dataSource={dataSource}
            rowKey={record => record.id}
            pagination={pagination}
            scroll={{ x: 1500 }}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ProcessModel;
