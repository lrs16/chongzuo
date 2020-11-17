import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Drawer, Table, Col, Row, Button, Card } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
// eslint-disable-next-line import/no-unresolved
import creatHistory from 'history/createHashHistory'; // 返回上一页

const history = creatHistory(); // 返回上一页
const ComtriMode = ['', '自动', '手动'];
// const SysAccount = ['', 'webApp'];

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
        title: '执行用户',
        dataIndex: 'execUserNameExt',
        key: 'execUserNameExt',
        width: 150,
        sorter: (a, b) => a.execIp - b.execIp,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: '主机IP',
        dataIndex: 'execIp',
        key: 'execIp',
        width: 150,
        sorter: (a, b) => a.execIp - b.execIp,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: '主机账号',
        dataIndex: 'execUser',
        key: 'execUser',
        width: 150,
        sorter: (a, b) => a.execUser - b.execUser,
        sortDirections: ['descend', 'ascend'],
      },
      // {
      //   title: '主机密码',
      //   dataIndex: 'execPass',
      //   key: 'execPass',
      //   width: 210,
      //   sorter: (a, b) => a.execPass - b.execPass,
      //   sortDirections: ['descend', 'ascend'],
      // },
      {
        title: '主机端口',
        dataIndex: 'execPort',
        key: 'execPort',
        width: 120,
        sorter: (a, b) => a.execPort - b.execPort,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: '执行命令',
        dataIndex: 'execStr',
        key: 'execStr',
        width: 150,
        ellipsis: true,
        sorter: (a, b) => a.execStr - b.execStr,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: '执行返回',
        dataIndex: 'execRet',
        key: 'execRet',
        width: 450,
        ellipsis: true,
        sorter: (a, b) => a.execRet - b.execRet,
        sortDirections: ['descend', 'ascend'],
      },
      // {
      //   title: '系统用户数据编号',
      //   dataIndex: 'execUserid',
      //   key: 'execUserid',
      //   width: 200,
      //   render: (text, record) => <span>{SysAccount[record.execUserid]}</span>,
      // },
      {
        title: '触发方式',
        dataIndex: 'execTrigger',
        key: 'execTrigger',
        width: 120,
        render: (text, record) => <span>{ComtriMode[record.execTrigger]}</span>,
        sorter: (a, b) => a.execTrigger - b.execTrigger,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: '执行备注',
        dataIndex: 'execRemark',
        key: 'execRemark',
        width: 120,
        sorter: (a, b) => a.execRemark - b.execRemark,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: '执行时间',
        dataIndex: 'execTime',
        key: 'execTime',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
        width: 200,
        ellipsis: true,
        sorter: (a, b) => a.execTime - b.execTime,
        sortDirections: ['descend', 'ascend'],
      },
      // {
      //   title: '密码盐',
      //   dataIndex: 'execSalt',
      //   key: 'execSalt',
      //   width: 200,
      // },
      // {
      //   title: '数据编号',
      //   dataIndex: 'id',
      //   key: 'id',
      //   width: 200,
      // },
      // {
      //   title: '系统用户数据编号',
      //   dataIndex: 'execUserid',
      //   key: 'execUserid',
      //   width: 200,
      // },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        width: 80,
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

    const DescriptionItemList1 = JSON.parse(
      JSON.stringify(DescriptionItemList)
        .replace(/execUserNameExt/g, "执行用户")
        .replace(/execUser/g, "主机账号")
        .replace(/execIp/g, "主机IP")
        .replace(/execPort/g, "主机端口")
        .replace(/execTrigger/g, "触发方式")
        .replace(/execStr/g, "执行命令")
        .replace(/execRet/g, "执行返回")
        .replace(/execTime/g, "执行时间")
        .replace(/execRemark/g, "执行备注")
    );

    Object.keys(DescriptionItemList1).forEach(key => {
      if (key) {
        delete DescriptionItemList1.主机账号id;
        delete DescriptionItemList1.execPass;
        delete DescriptionItemList1.execSalt;
        delete DescriptionItemList1.id;
      }
    });

    const pagination = {
      showSizeChanger: true,
      onShowSizeChange: (current, pageSize) => this.onShowSizeChange(current, pageSize),
      current: this.state.current,
      pageSize: this.state.pageSize,
      total: execloglist.total,
      onChange: page => this.changePage(page),
    };
    return (
      <PageHeaderWrapper title="日志详情">
        <Card>
          <Row style={{ marginBottom: 10, textAlign: 'right' }}>
            <Button onClick={this.goBackPage}>《 返回列表</Button>
          </Row>

          <Table
            dataSource={dataSource}
            columns={columns}
            rowKey={record => record.id}
            scroll={{ x: 1700 }}
            table-layout="fixed"
            pagination={pagination}
            loading={loading}
          />

          <Drawer
            onClose={this.onClose}
            visible={this.state.visible}
            title="日志详情"
            width={1000}
            placement="right"
            closable={false}
          >
            <Row>
              {Object.keys(DescriptionItemList1).map((key) => [
                <Col span={12} key={key}>
                  <DescriptionItem title={key} content={DescriptionItemList1[key]} />
                </Col>,
              ])}
            </Row>
          </Drawer>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ExecLogView;
