import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, 
         Table, 
         Form, 
         Input, 
         Button, 
         Message, 
         Divider, 
         Badge, 
         Popconfirm,
         Layout } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SoftEdit from './components/SoftEdit';
// import SoftProcess from './components/Soft_Process';
import HostSoft from './components/Host_Soft';
import BatchAdd from './components/BatchAdd';
import SoftManageTree from '@/components/SoftManageTree';

const { Search } = Input;
const { Sider, Content } = Layout;

@connect(({ hostsoft, loading }) => ({
  hostsoft,
  loading: loading.models.hostsoft,
}))
class SoftManage extends Component {
  state = {
    current: 1,
    pageSize: 10,
    queKey: '',
    hostId:''
  };

  // componentDidMount() {
  //   this.getsoftlist();
  // }

  // getsoftlist = () => {
  //   const page = this.state.current;
  //   const limit = this.state.pageSize;
  //   const { queKey } = this.state;
  //   this.props.dispatch({
  //     type: 'hostsoft/fetchsoft',
  //     payload: {
  //       page,
  //       limit,
  //       queKey,
  //     },
  //   });
  // };

  getSoftlist = (hostId) => {
    // const { hostId } = this.state;
    // const hostId = values.hostId;
    const { dispatch } = this.props ;
    dispatch({
      type: 'hostsoft/getSoftwaresList',
      payload: { hostId } || { deleteHostId },
    });

    dispatch({
      type: 'hostsoft/getToHostList',
      payload: { hostId } || { deleteHostId },
    });
  };

  handleUpdate = values => {
    const { dispatch } = this.props;
    return dispatch({
      type: 'hostsoft/softSave',
      payload: values,
    }).then(res => {
      if (res.code === 200) {
        Message.success(res.msg);
        this.getSoftlist(values.hostId);
      } else {
        Message.error(res.msg);
      }
    });
  };

  handleEdite = values => {
    const { dispatch } = this.props;
    return dispatch({
      type: 'hostsoft/softEdit',
      payload: values,
    }).then(res => {
      if (res.code === 200) {
        Message.success(res.msg);
        this.getSoftlist(values.hostId);
      } else {
        Message.error(res.msg);
      }
    });
  };

  handleDelete = (id,hostId) => {
    const { dispatch } = this.props;
    return dispatch({
      type: 'hostsoft/softRemove',
      payload: id,
    }).then(res => {
      if (res.code === 200) {
        Message.success(res.msg);
        this.getSoftlist(hostId);
      } else {
        Message.error(res.msg);
      }
    });
  };

  handleSearch = values => {
    const page = this.state.current;
    const limit = this.state.pageSize;
    this.setState({
      queKey: values,
    });
    this.props.dispatch({
      type: 'hostsoft/searchSofts',
      payload: {
        queKey: values,
        page,
        limit,
      },
    });
  };

  changePage = page => {
    this.props.dispatch({
      type: 'hostsoft/searchSofts',
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
      type: 'hostsoft/searchSofts',
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

  getChildValue = val => {
    const hostId = val[0];
    this.setState({ hostId: hostId});

    const { dispatch } = this.props;
    dispatch({
      type: 'hostsoft/getSoftwaresList',
      payload: { hostId },
    });

    dispatch({
      type: 'hostsoft/getToHostList',
      payload: { hostId },
    });
  };

  // showSoftEidt = (e) => {
  //   e.preventdefault();
  //   if(!this.state.hostId){
  //     return;
  //   }
  // }

  render() {
    const columns = [
      {
        title: '软件名称',
        dataIndex: 'softwareName',
        key: 'softwareName',
        width: 200,
        ellipsis: true,
      },
      {
        title: '绝对目录',
        dataIndex: 'softwareAbsDir',
        key: 'softwareAbsDir',
        width: 250,
        ellipsis: true,
      },
      {
        title: '日志目录',
        dataIndex: 'softwareLogDir',
        key: 'softwareLogDir',
        width: 250,
        ellipsis: true,
      },
      {
        title: '启动命令',
        dataIndex: 'softwareStartCommand',
        key: 'softwareStartCommand',
        width: 250,
        ellipsis: true,
      
      },
      {
        title: '停止命令',
        dataIndex: 'softwareStopCommand',
        key: 'softwareStopCommand',
        width: 250,
        ellipsis: true,
      },
      {
        title: '检测命令',
        dataIndex: 'softwareCheckCommand',
        key: 'softwareCheckCommand',
        width: 250,
        ellipsis: true,
      },
      {
        title: '使用端口',
        dataIndex: 'softwarePort',
        key: 'softwarePort',
        width: 100,
      },
      {
        title: '软件版本',
        dataIndex: 'softwareVersion',
        key: 'softwareVersion',
        width: 100,
      },
      {
        title: '软件排序',
        dataIndex: 'softwareSort',
        key: 'softwareSort',
        width: 100,
      },
      {
        title: '软件备注',
        dataIndex: 'softwareRemark',
        key: 'softwareRemark',
        width:200,
        ellipsis: true
      },
      {
        title: '创建人',
        dataIndex: 'createUserNameExt',
        key: 'createUserNameExt',
        width: 100,
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 200,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        width: 200,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        width: 200,
        fixed: 'right',
        render: (text, record) => (
          <div>
            {/* <HostSoft
              title="配置软件"
              softwareId={record.id}
              softId={record.id}
              softName={record.hostName}
              loading={this.props.loading}
            >
              <a type="link">配置进程</a>
            </HostSoft> */}
            <Divider type="vertical" />
            <SoftEdit onSumit={values => this.handleEdite(values)} title="编辑软件" record={record} hostId={this.state.hostId}>
              <a type="link">编辑软件</a>
            </SoftEdit>
            <Divider type="vertical" />
            <Popconfirm title="确定删除此软件？" onConfirm={() => this.handleDelete(record.id,this.state.hostId)}>
              <a type="link">删除软件</a>
            </Popconfirm>
          </div>
        ),
      },
    ];
    const {
      hostsoft: { softdata,treesoftdata },
    } = this.props;
    const dataSource = treesoftdata;
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
          <Layout>
            <Sider theme="light">
                <SoftManageTree toFatherValue={this.getChildValue.bind(this)}/>
            </Sider>
            <Content style={{ background: '#fff' }}>
              {/* <Form style={{ float: 'right', width: '30%' }}>
                <Search placeholder="请输入关键字" onSearch={values => this.handleSearch(values)} />
              </Form> */}
          
              <SoftEdit onSumit={value => this.handleUpdate(value)} hostId={this.state.hostId}>
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
                scroll={{ x: 1500 }}
              />
            </Content>
          </Layout>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default SoftManage;
