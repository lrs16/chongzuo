/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import moment from 'moment';
import cookie from 'react-cookies';
import {
  Layout,
  Table,
  Divider,
  Tabs,
  Button,
  Form,
  Input,
  Row,
  Col,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StartModal from './components/StartModal';

// const { Content } = Layout;
const { TabPane } = Tabs;

@connect(({ softexetute, loading }) => ({
  softexetute,
  loading: loading.models.softexetute,
}))
class SoftExetute extends Component {
  // eslint-disable-next-line react/sort-comp
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ 
      type: 'softexetute/fetch',
    });
  }

  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.newTabIndex = 0;
    const panes = [];
    this.state = {
      activeKey: '1',
      panes,
      inputValue: '',
      inputContent: '',
      sumitvalue: [],
      current: 1,
      pageSize: 10,
    };
  }

  // 输入框输入的value值
  handleInputValue = e => {
    this.setState({ inputValue: e.target.value });
  };

  // 点击确认按钮
  handleSureSendData = () => {
    this.setState({
      inputValue: '',
    });
    // console.log(this.state.sumitvalue);
    // 点击确认向后台发送数据  1.输入的值 2.存储的值（ip，端口，用户名，密码）
    const passWord = cookie.load('passWord');// 从cookie取出
    const { hostsIp, hostsSshPort, hostsSshUsername, command } = this.state.sumitvalue
    const hostIp = hostsIp;
    const port = hostsSshPort;
    const userName = hostsSshUsername;
    const InputValueData = this.state.inputValue;
    const { dispatch } = this.props;
    return dispatch({
      type: 'softexetute/getExecCommand',
      payload: {  passWord, hostIp, port, userName,command, InputValueData },
    }).then(res => {
        this.setState({
          inputContent: res.data.execLog,
        })
    });
  };

  // 确认按钮与enter绑定
  // eslint-disable-next-line react/sort-comp
  handleEnterKey(e) {
    // console.log(e.nativeEvent.keyCode,"e事件")
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

  add = (record, values,commitlist) => {
    // console.log(commitlist);
    // 点击启动时添加tab
    const { panes } = this.state;
    const activeKey = `newTab${this.newTabIndex++}`;
    panes.push({ title: values.hostsIp, content: commitlist.data.execLog || this.state.inputContent || '暂无数据', key: activeKey });
    
    this.setState({ panes, activeKey, sumitvalue: values});
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
    this.setState({ panes, activeKey });
  };

  // stop = () => {
  //   // 点击停止，发送字段 type:stop， 存储账号，密码 后端
  //   // const usernameValue = sessionStorage.getItem('username');
  //   // const pswValue = sessionStorage.getItem('psw');
  //   // console.log(usernameValue, pswValue);
  // };

  render() {
    const columns = [
      {
        title: 'id',
        dataIndex: 'id',
        key: 'id',
        width: 200,
      },
      {
        title: '主机名称',
        dataIndex: 'hostsName',
        key: 'hostsName',
      },
      {
        title: 'IP地址',
        dataIndex: 'hostsIp',
        key: 'hostsIp',
      },
      // {
      //   title: '状态',
      //   dataIndex: 'hostsStatus',
      //   key: 'hostsStatus',
      // },
      // {
      //   title: '主机分区',
      //   dataIndex: 'hostsZoneId',
      //   key: 'hostsZoneId',
      // },
      // {
      //   title: '主机操作系统',
      //   dataIndex: 'hostsOsId',
      //   key: 'hostsOsId',
      // },
      // {
      //   title: '机柜',
      //   dataIndex: 'hostsCabinetId',
      //   key: 'hostsCabinetId',
      // },
      {
        title: '主机备注',
        dataIndex: 'hostsRemark',
        key: 'hostsRemark',
      },
      {
        title: '更新时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 200,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => (
          
          <div>
            {/* <a type="link">编辑IP</a> */}
            {/* <Divider type="vertical" /> */}
            <StartModal title="启停" 
                record={record} 
                onSumit={(values,commitlist) => this.add(record,values,commitlist)}
            >
              <a type="link">启动</a>
            </StartModal>
            <Divider type="vertical" />
            {/* <Popconfirm title="确认停止操作？" onClick={() => this.stop()} okText="Yes" cancelText="No">
              <a type="link">停止</a>
            </Popconfirm>
            <Divider type="vertical" /> */}
            <span>
              <Link
                  to={{
                    pathname: `/automation/STT/execlog`,
                    state: {
                        id: record.id,
                    },
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
      softexetute: { list },
    } = this.props;
    // console.log(list.data, "list")
    const dataSource = list.data;
    const pagination = {
      showSizeChanger: true,
      // onShowSizeChange: (current, pageSize) => this.onShowSizeChange(current, pageSize),
      current: this.state.current,
      pageSize: this.state.pageSize,
      total: list.total,
      // onChange: page => this.changePage(page),
    };
    return (
      <PageHeaderWrapper title="程序执行">
        <Layout style={{ minHeight: '600px', background: '#fff' }}>
          {/* <Content style={{ minHeight: '300px' }}> */}
            <Table 
                dataSource={dataSource} 
                rowKey={record => record.id} 
                columns={columns} 
                pagination={pagination}
            />
          {/* </Content> */}

          {/* <Footer style={{ minHeight: '300px', background: '#fff',borderWidth: 1,borderColor: '#C0C0C0',borderStyle: 'solid',}}> */}
          <Tabs
            hideAdd
            onChange={this.onChange}
            activeKey={this.state.activeKey}
            type="editable-card"
            onEdit={this.onEdit}
            // style={{ minHeight: '200px', background: '#fff' }}
          >
            {this.state.panes.map(pane => (
              <TabPane tab={pane.title} key={pane.key}>
                <Row style={{ marginBottom: 10, minHeight: '100px', marginLeft: 20 }}>
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
          {/* </Footer> */}
        </Layout>
      </PageHeaderWrapper>
    );
  }
}
export default Form.create()(SoftExetute);
