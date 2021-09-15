import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Table, Form, Input, Button, Message, Divider, Badge, Popconfirm, Row } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import HostEdit from './components/HostEdit';
// import HostSoft from './components/Host_Soft';
// import BatchAdd from './components/BatchAdd';
// import HostManageTree from '@/components/HostManageTree';

const statusMap = ['default', 'success'];
const status = ['停用', '在用'];
// const cabinet = ['A座机柜', 'B座机柜'];
const operatSystem = ['window', 'linux'];
const hostPart = ['安全接入区', '二区', '三区'];
const { Search } = Input;

@connect(({ hostsoft, loading }) => ({
  hostsoft,
  loading: loading.models.hostsoft,
}))
class HostManage extends Component {
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
      type: 'hostsoft/fetchhost',
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
      type: 'hostsoft/fetchhost',
      payload: {
        queKey: values,
        page,
        limit,
      },
    });
  };

  onShowSizeChange = (current, pageSize) => {
    this.props.dispatch({
      type: 'hostsoft/search',
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
      type: 'hostsoft/search',
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
    const { dispatch } = this.props;
    dispatch({
      type: 'hostsoft/edit',
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
      type: 'hostsoft/remove',
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
      type: 'hostsoft/update',
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
      type: 'hostsoft/batchAddhost',
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
    const {
      hostsoft: { hostdata },
    } = this.props;
    const dataSource = hostdata.rows;
    const pagination = {
      showSizeChanger: true,
      onShowSizeChange: (current, pageSize) => this.onShowSizeChange(current, pageSize),
      current: this.state.current,
      pageSize: this.state.pageSize,
      total: hostdata.total,
      showTotal: total => `总共  ${total}  条记录`,
      onChange: page => this.changePage(page),
    };

    const columns = [
      {
        title: '设备名称',
        dataIndex: 'hostsName',
        key: 'hostsName',
        width: 200,
        ellipsis: true,
      },
      {
        title: '主机IP',
        dataIndex: 'hostsIp',
        key: 'hostsIp',
        width: 150,
        ellipsis: true,
      },
      {
        title: '主机分区',
        dataIndex: 'hostsZoneId',
        key: 'hostsZoneId',
        width: 150,
        render: (text, record) => <span>{hostPart[record.hostsZoneId]}</span>,
      },
      {
        title: '操作系统',
        dataIndex: 'hostsOsId',
        key: 'hostsOsId',
        width: 150,
        render: (text, record) => <span>{operatSystem[record.hostsOsId]}</span>,
      },
      {
        title: '主机状态',
        dataIndex: 'hostsStatus',
        key: 'hostsStatus',
        width: 150,
        render: (text, record) => (
          <span>
            <Badge status={statusMap[record.hostsStatus]} text={status[record.hostsStatus]} />
          </span>
        ),
      },

      // {
      //   title: '机柜',
      //   dataIndex: 'hostsCabinetId',
      //   key: 'hostsCabinetId',
      //   render: (text, record) => <span>{cabinet[record.hostsCabinetId]}</span>,
      // },
      {
        title: '主机排序',
        dataIndex: 'hostsSort',
        key: 'hostsSort',
        width: 150,
      },
      {
        title: '主机备注',
        dataIndex: 'hostsRemark',
        key: 'hostsRemark',
        width: 200,
        ellipsis: true,
      },
      {
        title: '创建人',
        dataIndex: 'createUserNameExt',
        key: 'createUserNameExt',
        width: 150,
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 200,
        ellipsis: true,
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        width: 200,
        ellipsis: true,
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
              hostId={record.id}
              hostName={record.hostsName}
              loading={this.props.loading}
            >
              <a type="link">配置软件</a>
            </HostSoft> */}
            <Divider type="vertical" />
            <HostEdit
              onSumit={values => this.handleEdite(values)}
              title="编辑主机"
              record={record}
              refresh={this.getlist}
            >
              <a type="link">编辑主机</a>
            </HostEdit>
            <Divider type="vertical" />
            <Popconfirm title="确定删除此菜单吗？" onConfirm={() => this.handleDelete(record.id)}>
              <a type="link">删除主机</a>
            </Popconfirm>
          </div>
        ),
      },
    ];

    return (
      <PageHeaderWrapper title="主机管理">
        <Card>
          {/* <Layout>
            <Sider theme='light'>
              {/* <HostManageTree /> */}
          {/* </Sider>  */}

          {/* <Content style={{ background: '#fff' }}> */}
          <Row>
            <Form style={{ float: 'right', width: '30%' }}>
              <Search placeholder="请输入关键字" onSearch={values => this.handleSearch(values)} />
            </Form>
          </Row>
          {/* <Row gutter={16}>
              <Col className="gutter-row" span={12}> */}
          <div>
            <HostEdit onSumit={this.handleUpdate}>
              <Button style={{ width: '100%', margin: '16px 0 8px 0' }} type="dashed" icon="plus">
                添加主机
              </Button>
            </HostEdit>
          </div>
          {/* </Col> */}
          {/* 
              <Col className="gutter-row" span={12}>
                <div>
                  <BatchAdd hostId="hostId" onsumitBatch={str => this.handleBatchadd(str)}>
                    <Button
                      style={{ width: '100%', margin: '16px 0 8px 0' }}
                      type="dashed"
                      icon="plus"
                    >
                      批量添加
                    </Button>
                  </BatchAdd>
                </div>
              </Col> */}
          {/* </Row> */}
          <Table
            columns={columns}
            dataSource={dataSource}
            rowKey={record => record.id}
            pagination={pagination}
            scroll={{ x: 1500 }}
          />
          {/* </Content> */}

          {/* </Layout> */}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default HostManage;
