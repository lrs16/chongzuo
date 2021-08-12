import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Card,
  Table,
  Form,
  Input,
  // Button,
  Message,
  Popconfirm,
  Row,
  Divider,
  message,
  // Upload
} from 'antd';
// import Link from 'umi/link';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
// import ModelAdd from './components/ModelAdd';
import DefinitionPng from './components/DefinitionPng';
import SysUpload from './components/SysUpload'; // 附件下载组件
import DefinitionxmlData from './components/DefinitionxmlData';

const { Search } = Input;
@connect(({ processmanagement, loading }) => ({
  processmanagement,
  loading: loading.models.processmanagement,
}))
class ProcessDefinition extends Component {
  state = {
    current: 1,
    pageSize: 15,
    queKey: '',
    bodyParams: {
      name: '',
      key: '',
      category: ''
    },
    files: {
      arr: [],
      ischange: false
    }

  };

  componentDidMount() {
    this.getlist();
  }

  getlist = () => {
    const page = this.state.current;
    const limit = this.state.pageSize;
    const { bodyParams } = this.state;
    this.props.dispatch({
      type: 'processmanagement/definitionList',
      payload: {
        page,
        limit,
        bodyParams
      },
    })
  };

  handleSearch = values => {
    const page = this.state.current;
    const limit = this.state.pageSize;
    const datas = Object.assign({}, this.state.bodyParams, { name: '', key: values, category: ''});
    this.setState({
      bodyParams: datas
    })
    // this.setState({
    //   queKey: values,
    // });
    this.props.dispatch({
      type: 'processmanagement/definitionList',
      payload: {
        // queKey: values,
        bodyParams: datas,
        page,
        limit,
      },
    });
  };

  onShowSizeChange = (current, pageSize) => {
    this.props.dispatch({
      type: 'processmanagement/definitionList',
      payload: {
        // queKey: this.state.queKey,
        bodyParams: this.state.bodyParams,
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
      type: 'processmanagement/definitionList',
      payload: {
        // queKey: this.state.queKey,
        bodyParams: this.state.bodyParams,
        page,
        limit: this.state.pageSize,
      },
    });
    setTimeout(() => {
      this.setState({ current: page });
    }, 0);
  };

  handleDelete = id => {
    const { dispatch } = this.props;
    return dispatch({
      type: 'processmanagement/deleteDefinition',
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

  // handleUpdate = values => {
  //   const { dispatch } = this.props;
  //   return dispatch({
  //     type: 'processmanagement/modelSave',
  //     payload: values,
  //   }).then(res => {
  //     if (res.code === 200) {
  //       Message.success(res.msg);
  //       this.getlist();
  //     } else {
  //       Message.error(res.msg);
  //     }
  //   });
  // };

  // releaseModel = (modelId) => {
  //   const { dispatch } = this.props;
  //   return dispatch({
  //     type: 'processmanagement/releaseModels',
  //     payload: { modelId }
  //   }).then(res => {
  //     if (res.code === 200) {
  //       Message.success(res.msg);
  //     } else {
  //       Message.error(res.msg);
  //     }
  //   });
  // }

  stateChange = (id, suspendState) => {
    const { dispatch } = this.props;
    return dispatch({
      type: 'processmanagement/stateChange',
      payload: { id, suspendState }
    }).then(res => {
      if (res.code === 200) {
        message.success(res.msg);
        this.getlist();
      } else {
        message.error(res.msg);
      }
    });
  }

  render() {
    const {
      processmanagement: { definitionList },
    } = this.props;
    const dataSource = definitionList.rows;

    const pagination = {
      showSizeChanger: true,
      onShowSizeChange: (current, pageSize) => this.onShowSizeChange(current, pageSize),
      current: this.state.current,
      pageSize: this.state.pageSize,
      total: definitionList.total,
      showTotal: total => `总共  ${total}  条记录`,
      onChange: page => this.changePage(page),
    };

    const columns = [
      {
        title: '数据编号',
        dataIndex: 'id',
        key: 'id',
        width: 200,
        ellipsis: true
      },
      {
        title: '流程key',
        dataIndex: 'key',
        key: 'key',
        width: 200,
        ellipsis: true
      },
      {
        title: '流程名称',
        dataIndex: 'name',
        key: 'name',
        width: 200,
        ellipsis: true
      },
      {
        title: '流程版本',
        dataIndex: 'version',
        key: 'version',
        width: 200,
        ellipsis: true
      },
      {
        title: '流程描述',
        dataIndex: 'description',
        key: 'description',
        width: 150,
        ellipsis: true,
      },
      {
        title: '所属分类',
        dataIndex: 'category',
        key: 'category',
        width: 200,
        ellipsis: true,
      },
      {
        title: '部署时间',
        dataIndex: 'deploymentTime',
        key: 'deploymentTime',
        width: 200,
        ellipsis: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '流程定义',
        dataIndex: 'resourceName',
        key: 'resourceName',
        width: 200,
        ellipsis: true,
        render: (text, record) => (
          <>
            <DefinitionxmlData
              id={record.id}
              resourceName={record.resourceName}
            >
              <a type="link">{text}</a>
            </DefinitionxmlData>
          </>
        )
      },
      {
        title: '流程图',
        dataIndex: 'diagramResourceName',
        key: '',
        width: 200,
        ellipsis: true,
        render: (text, record) => (
          <>
            <DefinitionPng
              id={record.id}
              resourceName={record.diagramResourceName}
            >
              <a type="link">{text}</a>
            </DefinitionPng>
          </>
        )
      },
      {
        title: '状态名称',
        dataIndex: 'suspendStateName',
        key: 'suspendStateName',
        width: 200,
        ellipsis: true
      },
      {
        title: '部署编号',
        dataIndex: 'deploymentId',
        key: 'deploymentId',
        width: 200,
        ellipsis: true
      },
      {
        title: '状态编号',
        dataIndex: 'suspendState',
        key: 'suspendState',
        width: 200,
        ellipsis: true
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        width: 180,
        fixed: 'right',
        render: (text, record) => (
          <div style={{ margin: 0 }}>
            <a onClick={() => this.stateChange(record.id, record.suspendState)}>{record.suspendState === '1' ? '挂起' : '激活'}</a>
            <Divider type="vertical" />

            <Popconfirm title="确定删除此模型吗？" onConfirm={() => this.handleDelete(record.deploymentId)}>
              <a type="link">删除</a>
            </Popconfirm>
            {/* <Divider type="vertical" /> */}

            {/* <a type='link' onClick={() => this.releaseModel(record.id)}>发布</a> */}
          </div>
        ),
      },
    ];

    return (
      <PageHeaderWrapper title="流程模型">
        <Card>
          <Row>
            <Form style={{ float: 'right', width: '30%', margin: '0 0 16px 0' }}>
              <Search placeholder="请输入关键字" onSearch={values => this.handleSearch(values)} />
            </Form>
          </Row>
          <div style={{ width: 380, margin: '0 0 16px 0' }}>
            <SysUpload
              // fileslist={this.state.files.arr}
              // ChangeFileslist={
              //   v => {console.log(v)}
              // }
            />
          </div>
          
          {/* <div>
                  <ModelAdd onSumit={this.handleUpdate}>
                    <Button
                      style={{ width: '100%', margin: '16px 0 8px 0' }}
                      type="dashed"
                      icon="plus"
                    >
                      添加模型
                    </Button>
                  </ModelAdd>
                </div> */}
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

export default ProcessDefinition;
