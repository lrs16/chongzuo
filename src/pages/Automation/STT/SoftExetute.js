/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Layout,
  Table,
  Divider,
  Card,
  Tabs,
  Button,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Popconfirm,
  message,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StartModal from './components/StartModal';

const { Sider, Content, Footer } = Layout;
const { TabPane } = Tabs;

@connect(({ softexetute, loading }) => ({
  softexetute,
  loading: loading.models.softexetute,
}))
class SoftExetute extends Component {
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
      activeKey: 1,
      panes,
      inputValue: '',
      content: '',
    };
  }
  // 输入框输入的value值
  handleInputValue = e => {
    this.setState({ inputValue: e.target.value });
  };

  // 点击确认按钮
  handleSureSendData = () => {
    //点击确认向后台发送数据  1.输入的值 2.存储的值（ip，端口，用户名，密码）
    // console.log(this.state.inputValue,"获取输入的值")

    console.log(this.props);
    const InputValueData = this.state.inputValue;
    const ipValue = sessionStorage.getItem('ip');
    const portValue = sessionStorage.getItem('port');
    const usernameValue = sessionStorage.getItem('username');
    const pswValue = sessionStorage.getItem('psw');
    this.props.dispatch({
      type: 'softexetute/submitData',
      payload: { ipValue, portValue, usernameValue, InputValueData, pswValue },
    });
    console.log(ipValue, portValue, usernameValue, pswValue, InputValueData, '取数据');

    this.setState({
      inputValue: '',
    });
  };

  // 确认按钮与enter绑定
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

  add = record => {
    //点击启动时添加tab
    const { panes } = this.state;
    const activeKey = `newTab${this.newTabIndex++}`;
    panes.push({ title: record.ip, content: this.state.content, key: activeKey });
    this.setState({ panes, activeKey });
  };

  remove = targetKey => {
    //点击X号时删除 tab
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

  stop = () => {
    //点击停止，发送字段 type:stop， 存储账号，密码 后端
    const usernameValue = sessionStorage.getItem('username');
    const pswValue = sessionStorage.getItem('psw');
    console.log(usernameValue, pswValue);
  };

  render() {
    const columns = [
      {
        title: '服务名',
        dataIndex: 'servicename',
        key: 'servicename',
      },
      {
        title: 'IP',
        dataIndex: 'ip',
        key: 'ip',
      },
      {
        title: '时间',
        dataIndex: 'datetime',
        key: 'datetime',
      },
      {
        title: '端口',
        dataIndex: 'port',
        key: 'port',
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => (
          <div>
            {/* <Button type='link' onClick={()=>this.add(record)}>ADD</Button> */}
            <StartModal title="启停" record={record} onSumit={() => this.add(record)}>
              <a type="link">启动</a>
            </StartModal>
            <Divider type="vertical" />
            <Popconfirm title="确认停止操作？" onClick={() => stop()} okText="Yes" cancelText="No">
              <a type="link">停止</a>
            </Popconfirm>
          </div>
        ),
      },
    ];
    const {
      softexetute: { list },
    } = this.props;
    const dataSource = [...list];

    return (
      <PageHeaderWrapper title="程序执行">
        <Layout style={{ minHeight: '600px', background: '#fff' }}>
          <Content style={{ minHeight: '300px' }}>
            <Table dataSource={dataSource} rowKey={record => record.ip} columns={columns} />
          </Content>

          {/* <Footer style={{ minHeight: '300px', background: '#fff',borderWidth: 1,borderColor: '#C0C0C0',borderStyle: 'solid',}}> */}
          <Tabs
            hideAdd
            onChange={this.onChange}
            activeKey={this.state.activeKey}
            type="editable-card"
            onEdit={this.onEdit}
            style={{ minHeight: '200px', background: '#fff' }}
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
