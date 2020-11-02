/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
// import moment from 'moment';
import { Card, Table, Divider, Tabs, Button, Form, Input, Row, Col, message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StartModal from './components/StartModal';
import SshconfigModal from './components/SshconfigModal';
import HostTree from '@/components/HostTree';

const { TabPane } = Tabs;
// const nameType = [
//   {key: 0, name: '启动命令', type: '1'}, 
//   {key: 1, name: '停止命令', type: '2'}, 
//   {key: 2, name: '检测命令', type: '3'},
// ];
@connect(({ softexetute, loading }) => ({
  softexetute,
  loading: loading.models.softexetute,
}))
class SoftExetute extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.newTabIndex = 0;
    const panes = [];
    this.state = {
      activeKey: '',
      panes,
      inputValue: '',
      sumitvalue: [],
      current: 1,
      pageSize: 10,
      queKey: '',
      eryPassword: '',
      hostId: '',
    };
  }
  // eslint-disable-next-line react/sort-comp
  componentDidMount() {
    // this.getList();
  }

  // getList = () => {
  //   this.props.dispatch({
  //     type: 'softexetute/getSoftwaresList',
  //     //payload: { hostId: '1310852028620083201' },
  //   });
  // };

  // 输入框输入的value值
  handleInputValue = e => {
    this.setState({ inputValue: e.target.value });
  };

  // 点击确认按钮
  handleSureSendData = () => {
    this.setState({
      inputValue: '',
    });
    // 点击确认向后台发送数据  1.输入的值 2.存储的值（ip，端口，用户名，密码）
    const { panes, activeKey } = this.state;
    const sametype = panes.filter(obj => {
      return obj.key === activeKey;
    });
    const { hostsIp, hostsSshUsername, hostsSshPort, passWord } = sametype[0];
    const command = this.state.inputValue;
    const { dispatch } = this.props;
    return dispatch({
      type: 'softexetute/getExecCommand',
      payload: {
        passWord: passWord,
        hostIp: hostsIp,
        port: hostsSshPort,
        userName: hostsSshUsername,
        command,
      },
    }).then(res => {
      const wordStr = ([] = res.msg.split('\n'));
      const strContent = wordStr.map((item, index) => {
        return (
          <p key={index} style={{ marginBottom: 0 }}>
            {item}
          </p>
        );
      });
      const title = hostsIp + `-` + hostsSshUsername;

      const sametypes = panes.filter(obj => {
        return obj.key === title;
      });

      if (sametypes.length >= 1) {
        sametypes[0].content = strContent;
        this.setState({ title });
      }
    });
  };

  // 确认按钮与enter绑定
  // eslint-disable-next-line react/sort-comp
  handleEnterKey(e) {
    if (e.nativeEvent.keyCode === 13) {
      this.handleSureSendData();
    }
  }

  // tabs标签的一系列操作 onChange  onEdit add remove
  onChange = activeKey => {
    this.setState({ activeKey });
  };

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  };

  add = (record, values, commitlist, passWord) => {
    const { hostsIp, hostsSshUsername, hostsSshPort } = values;
    const wordStr = ([] = commitlist.msg.split('\n'));
    const strContent = wordStr.map((item, index) => {
      return (
        <p key={index} style={{ marginBottom: 0 }}>
          {item}
        </p>
      );
    });

    const { panes } = this.state;
    const title = hostsIp + `-` + hostsSshUsername;

    const sametype = panes.filter(obj => {
      return obj.key === title;
    });

    if (sametype.length >= 1) {
      sametype[0].content = strContent;
      this.setState({ title });
    }
    if (sametype.length < 1) {
      panes.push({
        title: title,
        content: strContent,
        key: title,
        hostsIp,
        hostsSshUsername,
        hostsSshPort,
        passWord,
      });
      this.setState({ panes, activeKey: title });
    }
  };

  remove = targetKey => {
    // 点击X号时删除 tab
    let { activeKey } = this.state;
    let lastIndex;
    this.state.panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const panes = this.state.panes.filter(pane => pane.key !== targetKey);
    if (panes.length && activeKey === targetKey) {
      if (lastIndex >= 0) {
        activeKey = panes[lastIndex].key;
      } else {
        activeKey = panes[0].key;
      }
    }
    // this.setState({ panes, activeKey });
    setTimeout(() => {
      this.setState({ panes, activeKey });
    }, 0);
  };

  onShowSizeChange = (current, pageSize) => {
    this.props.dispatch({
      type: 'softexetute/fetchsoft',
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
      type: 'softexetute/fetchsoft',
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

  // 获取树杈传值
  getChildValue = val => {
    const hostId = val[0];
    this.setState({ hostId });
    const { dispatch } = this.props;
    dispatch({
      type: 'softexetute/getSoftwaresList',
      payload: { hostId },
    });

    dispatch({
      type: 'softexetute/getToHostList',
      payload: { hostId },
    });

  };

  // 启动/停止/检测命令
  // hanleCommit = (record, type) => {
  //   const { hostId } = this.state;
  //   const { id } = this.props.softexetute.treehostdata;
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'softexetute/getSofttoHostHandleType',
  //     payload: {
  //       hostsId: id || hostId,
  //       softId: record.id,
  //       handleType: type,
  //     },
  //   }).then(res => {
  // setTimeout(() => {
  //   if (res.state) {
  //     message.success("命令已执行" + "\n" + res.msg);
  //   } else {
  //     message.error(res.msg);
  //   }
  // }, 500);
  //   });
  // };

  start = (record) => {
    const { hostId } = this.state;
    const { id } = this.props.softexetute.treehostdata;

    const { dispatch } = this.props;
    dispatch({
      type: 'softexetute/getSofttoHostHandleType',
      payload: {
        hostsId: id || hostId,
        softId: record.id,
        handleType: '1'
      },
    }).then(res => {
      setTimeout(() => {
        if (res.state) {
          message.success("命令已执行" + "\n" + res.msg);
        } else {
          message.error(res.msg);
        }
      }, 500);
    })
  };

  stop = (record) => {
    const { hostId } = this.state;
    const { id } = this.props.softexetute.treehostdata;

    const { dispatch } = this.props;
    dispatch({
      type: 'softexetute/getSofttoHostHandleType',
      payload: {
        hostsId: id || hostId,
        softId: record.id,
        handleType: '2'
      },
    }).then(res => {
      setTimeout(() => {
        if (res.state) {
          message.success("命令已执行" + "\n" + res.msg);
        } else {
          message.error(res.msg);
        }
      }, 500);
    })
  };
  check = (record) => {
    const { hostId } = this.state;
    const { id } = this.props.softexetute.treehostdata;

    const { dispatch } = this.props;
    dispatch({
      type: 'softexetute/getSofttoHostHandleType',
      payload: {
        hostsId: id || hostId,
        softId: record.id,
        handleType: '3'
      },
    }).then(res => {
      setTimeout(() => {
        if (res.state) {
          message.success("命令已执行" + "\n" + res.msg);
        } else {
          message.error(res.msg);
        }
      }, 500);
    })
  };

  render() {
    const columns = [
      // {
      //   title: 'id',
      //   dataIndex: 'id',
      //   key: 'id',
      //   width: 200,
      // },
      {
        title: '软件名称',
        dataIndex: 'softwareName',
        key: 'softwareName',
        width: 150,
      },
      {
        title: '绝对目录',
        dataIndex: 'softwareAbsDir',
        key: 'softwareAbsDir',
        width: 250,
      },
      {
        title: '日志目录',
        dataIndex: 'softwareLogDir',
        key: 'softwareLogDir',
        width: 300,
      },
      {
        title: '启动命令',
        dataIndex: 'softwareStartCommand',
        key: 'softwareStartCommand',
        width: 200,
      },
      {
        title: '停止命令',
        dataIndex: 'softwareStopCommand',
        key: 'softwareStopCommand',
        width: 200,
      },
      {
        title: '检测命令',
        dataIndex: 'softwareCheckCommand',
        key: 'softwareCheckCommand',
        width: 480,
      },
      {
        title: '使用端口',
        dataIndex: 'softwarePort',
        key: 'softwarePort',
        width: 120,
      },
      {
        title: '软件版本',
        dataIndex: 'softwareVersion',
        key: 'softwareVersion',
        width: 120,
      },
      {
        title: '软件备注',
        dataIndex: 'softwareRemark',
        key: 'softwareRemark',
        width: 200,
      },
      // {
      //   title: '更新时间',
      //   dataIndex: 'updateTime',
      //   key: 'updateTime',
      //   width: 200,
      //   // render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      // },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        width: 450,
        fixed: 'right',
        render: (text, record) => (
          <div>
            <SshconfigModal
              title="SSH信息"
              record={record}
              hostId={this.state.hostId}
            >
              <a type="link">配置SSH</a>
            </SshconfigModal>
            <Divider type="vertical" />

            <StartModal
              title="执行命令"
              record={record}
              onSumit={(values, commitlist, passWord) => {
                this.add(record, values, commitlist, passWord);
              }}
            >
              <a type="link">执行命令</a>
            </StartModal>
            <Divider type="vertical" />

            <span>
              <a type="link" record={record} onClick={() => this.start(record)}>启动命令</a>
            </span>
            <Divider type="vertical" />
            <span>
              <a type="link" record={record} onClick={() => this.stop(record)}>停止命令</a>
            </span>
            <Divider type="vertical" />
            <span>
              <a type="link" record={record} onClick={() => this.check(record)}>检测命令</a>
            </span>
            <Divider type="vertical" />

            {/* <span>
              {nameType.map(({key, name, type}) => [
                <a key={key} record={record} onClick={() => this.hanleCommit(record, type)}>
                  {name}
                </a>,
                <Divider type="vertical" />
              ])}
            </span> */}

            <span>
              <Link
                to={{
                  pathname: `/automation/STT/execlog`,
                }}
              >
                执行日志
              </Link>
            </span>
          </div>
        ),
      },
    ];

    const {
      softexetute: { softdata, treesoftdata, data },
      loading,
    } = this.props;
    // const dataSource = softdata.rows;
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
      <PageHeaderWrapper title="主机操作">
        <Row style={{ display: 'flex' }} style={{ background: '#f1f1f1' }}>
          <Col span={5}>
            <Card>
              <HostTree toFatherValue={this.getChildValue.bind(this)} />
            </Card>
          </Col>
          <Col span={19}>
            <Card style={{ marginLeft: 8 }} bordered={false}>
              <div>
                <Table
                  dataSource={dataSource}
                  rowKey={record => record.id}
                  columns={columns}
                  pagination={pagination}
                  table-layout="fixed"
                  scroll={{ x: '100%' }}
                  loading={loading}
                />
                <Tabs
                  hideAdd
                  onChange={this.onChange}
                  activeKey={this.state.activeKey}
                  type="editable-card"
                  onEdit={this.onEdit}
                >
                  {this.state.panes.map(pane => (
                    <TabPane tab={pane.title} key={pane.key}>
                      <Row style={{ marginBottom: 10, marginLeft: 20, height: 150, overflow: 'auto' }}>
                        {pane.content}
                      </Row>
                      <Row style={{ marginBottom: 20, marginLeft: 20 }}>
                        <Col span={22}>
                          <Input
                            type="text"
                            ref={this.myRef}
                            value={this.state.inputValue}
                            onChange={this.handleInputValue}
                            onKeyDown={e => this.handleEnterKey(e)}
                            placeholder="请输入..."
                            size="large"
                          />
                        </Col>
                        <Col span={2}>
                          <Button
                            type="primary"
                            size="large"
                            onClick={this.handleSureSendData}
                            style={{ marginLeft: 10 }}
                          >
                            确定
                          </Button>
                        </Col>
                      </Row>
                    </TabPane>
                  ))}
                </Tabs>
              </div>
            </Card>
          </Col>
        </Row>
      </PageHeaderWrapper>
    );
  }
}
export default Form.create()(SoftExetute);
