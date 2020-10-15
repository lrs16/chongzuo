import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Drawer, Table, Col, Row, Button } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import creatHistory from 'history/createHashHistory'; // 返回上一页
const history = creatHistory(); // 返回上一页

const ComtriMode = ['', '自动', '手动'];
const SysAccount = ['', 'webApp'];

const DescriptionItem = ({ title, content }) => (
  <div
    style={{
      fontSize: 14,
      lineHeight: '22px',
      marginBottom: 7,
      color: 'rgba(0,0,0,0.65)',
    }}
  >
    <p
      style={{
        marginRight: 8,
        display: 'inline-block',
        color: 'rgba(0,0,0,0.85)',
      }}
    >
      {title}:
    </p>
    {content}
  </div>
);

@connect(({ softexetute, loading }) => ({
  softexetute,
  loading: loading.models.softexetute,
}))
class ExecLogView extends Component {
  state = {
    current: 1,
    pageSize: 10,
    queKey: '',
    visible: false,
    DescriptionItemList: [],
  };

  componentDidMount() {
    this.getExeclogListData();
  }

  getExeclogListData = () => {
    const { hostsIp } = this.props.softexetute.treehostdata;
    const ip = hostsIp;
    const page = this.state.current;
    const limit = this.state.pageSize;
    const { queKey } = this.state;
    this.props.dispatch({
      type: 'softexetute/getExeclogList',
      payload: {
        page,
        limit,
        queKey,
        ip,
      },
    });
  };

  changePage = page => {
    const { hostsIp } = this.props.softexetute.treehostdata;
    const ip = hostsIp;
    this.props.dispatch({
      type: 'softexetute/getExeclogList',
      payload: {
        page,
        limit: this.state.pageSize,
        queKey: this.state.queKey,
        ip,
      },
    });
    setTimeout(() => {
      this.setState({ current: page });
    }, 0);
  };

  onShowSizeChange = (current, pageSize) => {
    const { hostsIp } = this.props.softexetute.treehostdata;
    const ip = hostsIp;
    this.props.dispatch({
      type: 'softexetute/getExeclogList',
      payload: {
        queKey: this.state.queKey,
        page: current,
        limit: pageSize,
        ip,
      },
    });
    setTimeout(() => {
      this.setState({ pageSize });
    }, 0);
  };

  showDrawer = id => {
    this.setState({
      visible: true,
    });
    const { dispatch } = this.props;
    return dispatch({
      type: 'softexetute/getExeclogListDEtail',
      payload: { id },
    }).then(res => {
      if (res.code === 200) {
        this.setState({ DescriptionItemList: res.data });
      }
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  goBackPage = () => {
    history.goBack(); // 返回上一页
  };

  render() {
    const columns = [
      {
        title: '主机IP地址',
        dataIndex: 'execIp',
        key: 'execIp',
        width: 150,
      },
      {
        title: '用户密码(Linux密码)加密',
        dataIndex: 'execPass',
        key: 'execPass',
        width: 200,
      },
      {
        title: 'Linux端口',
        dataIndex: 'execPort',
        key: 'execPort',
        width: 100,
      },
      {
        title: '命令备注',
        dataIndex: 'execRemark',
        key: 'execRemark',
        width: 100,
      },
      {
        title: '执行的命令返回结果',
        dataIndex: 'execRet',
        key: 'execRet',
        width: 200,
        ellipsis: true,
      },
      {
        title: '密码盐',
        dataIndex: 'execSalt',
        key: 'execSalt',
        width: 200,
      },
      {
        title: '执行的命令',
        dataIndex: 'execStr',
        key: 'execStr',
        width: 200,
      },
      {
        title: '命令执行时间',
        dataIndex: 'execTime',
        key: 'execTime',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
        width: 200,
        ellipsis: true,
      },
      {
        title: '命令触发方式',
        dataIndex: 'execTrigger',
        key: 'execTrigger',
        width: 200,
        render: (text, record) => <span>{ComtriMode[record.execTrigger]}</span>,
      },
      {
        title: '用户名称(Linux账号)',
        dataIndex: 'execUser',
        key: 'execUser',
        width: 200,
      },
      {
        title: '系统账号',
        dataIndex: 'execUserid',
        key: 'execUserid',
        width: 200,
        render: (text, record) => <span>{SysAccount[record.execUserid]}</span>,
      },
      {
        title: '数据编号',
        dataIndex: 'id',
        key: 'id',
        width: 200,
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        width: 100,
        fixed: 'right',
        render: (text, record) => (
          <a type="link" onClick={() => this.showDrawer(record.id)}>
            详细
          </a>
        ),
      },
    ];
    const {
      softexetute: { execloglist },
      loading,
    } = this.props;
    const dataSource = execloglist && execloglist.rows;
    const { DescriptionItemList } = this.state;
    const pagination = {
      showSizeChanger: true,
      onShowSizeChange: (current, pageSize) => this.onShowSizeChange(current, pageSize),
      current: this.state.current,
      pageSize: this.state.pageSize,
      total: execloglist.total,
      onChange: page => this.changePage(page),
    };
    return (
      <PageHeaderWrapper title="日志详情" style={{ backgroundColor: '#fff' }}>
        <Row style={{ marginBottom: 10, textAlign: 'right' }}>
          <Button onClick={this.goBackPage}>《 返回列表</Button>
        </Row>
        <Table
          dataSource={dataSource}
          columns={columns}
          rowKey={record => record.id}
          scroll={{ x: 2100 }}
          table-layout="fixed"
          pagination={pagination}
          loading={loading}
        />
        <Drawer
          onClose={this.onClose}
          visible={this.state.visible}
          title="日志详情"
          width={1200}
          placement="right"
          closable={false}
        >
          <Row>
            {Object.keys(DescriptionItemList).map((key, index) => [
              <Col span={12} key={index}>
                <DescriptionItem title={key} content={DescriptionItemList[key]} />
              </Col>,
            ])}
          </Row>
        </Drawer>
      </PageHeaderWrapper>
    );
  }
}

export default ExecLogView;
