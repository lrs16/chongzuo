import React, { Component } from 'react';
import {
  Typography,
  Input,
  Descriptions,
  Table,
  Tabs,
  Drawer,
  Form,
  Checkbox,
  Icon,
  Button,
} from 'antd';

const { TextArea } = Input;
const { TabPane } = Tabs;
const { Text } = Typography;
const withClick = (element, handleClick = () => {}) => {
  return <element.type {...element.props} onClick={handleClick} />;
};
const contentColor = ['#99CC66', '#FF6666'];
const content = ['发送成功', '发送失败'];

const statusColor = ['#99CC66', '#CCCCCC'];
const statusContent = ['待确认', '已确认'];

const levelBackgroud = ['red', '#FF9966', '#FFFF99', '#66CC99', '#CCCCCC'];
const levelContent = ['严重', '一般', '警告', '恢复', '未知'];

class CurrentalarmDetail extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    visible: false,
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  handleopenClick = () => {
    this.setState({
      visible: true,
    });
    // this.props.form.resetFields();
  };

  hanldeCancel = () => {
    this.setState({
      visible: false,
    });
  };

  // show = () => {
  //   document.getElementById('textarea').style.display = 'block';
  //   document.getElementById('icon').style.display = 'none';
  // }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { visible } = this.state;
    const { children, title, basic, opera, currentInfo, alarmNotificationInfo } = this.props;
    const dataSource = [...opera];
    const data = [...currentInfo];
    const notificaData = [...alarmNotificationInfo];

    const columns = [
      {
        title: '序号',
        dataIndex: 'serialnumber',
        key: 'serialnumber',
      },
      {
        title: '时间',
        dataIndex: 'datetime',
        key: 'datetime',
      },
      {
        title: '操作人',
        dataIndex: 'operator',
        key: 'operator',
      },
      {
        title: '操作记录',
        dataIndex: 'operationrecord',
        key: 'operationrecord',
      },
      {
        title: '状态',
        dataIndex: 'statue',
        key: 'statue',
        render: (text, record) => (
          // <Text type={contentColor[record.statue]}>{content[record.statue]}</Text>
          <span style={{ color: contentColor[record.statue] }}>{content[record.statue]}</span>
        ),
      },
    ];

    const historyInfoColumns = [
      {
        title: '告警时间',
        dataIndex: 'alarmtime',
        key: 'alarmtime',
      },
      {
        title: '恢复时间',
        dataIndex: 'recovertime',
        key: 'recovertime',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 60,
      },
      {
        title: '持续时间',
        dataIndex: 'duration',
        key: 'duration',
      },
      {
        title: '首次发生时间',
        dataIndex: 'firsttime',
        key: 'firsttime',
        width: 120,
      },
      {
        title: '确认',
        dataIndex: 'confirm',
        key: 'confirm',
        width: 80,
        render: (text, record) => (
          <span style={{ color: statusColor[record.status] }}>{statusContent[record.status]}</span>
        ),
      },
      {
        title: '动作',
        dataIndex: 'action',
        key: 'action',
        width: 70,
      },
    ];

    const notificationInfoColumns = [
      {
        title: '告警内容',
        dataIndex: 'alarmcontent',
        key: 'alarmcontent',
        width: 250,
      },
      {
        title: '发送时间',
        dataIndex: 'sendtime',
        key: 'sendtime',
        width: 130,
      },
      {
        title: '发送方式',
        dataIndex: 'sendway',
        key: 'sendway',
        width: 100,
      },
      {
        title: '接收人',
        dataIndex: 'receiver',
        key: 'receiver',
        width: 100,
      },
      {
        title: '状态',
        dataIndex: 'statue',
        key: 'statue',
        render: (text, record) => (
          <span style={{ color: contentColor[record.statue] }}>{content[record.statue]}</span>
        ),
      },
    ];

    return (
      <>
        {withClick(children, this.handleopenClick)}
        <Drawer
          width={720}
          title={title}
          visible={visible}
          maskClosable={true}
          onClose={this.onClose}
          centered="true"
          onCancel={this.hanldeCance}
        >
          <Tabs defaultActiveKey="1">
            <TabPane tab="基本信息" key="1">
              <Descriptions column={2}>
                <Descriptions.Item label="告警标题:" span={2}>
                  {basic.title}
                </Descriptions.Item>
                <Descriptions.Item label="设备名称:">{basic.name}</Descriptions.Item>
                <Descriptions.Item label="IP:">{basic.ip}</Descriptions.Item>
                <Descriptions.Item label="告警时间:">{basic.alarmtime}</Descriptions.Item>
                <Descriptions.Item label="恢复时间:">{basic.recovdatetime}</Descriptions.Item>
                <Descriptions.Item label="级    别:">
                  {/* <span style={{backgroudColor:'red',paddingLeft:10}}>{levelContent[basic.lever]}</span> */}
                  <span style={{ backgroudColor: levelBackgroud[basic.lever] }}>
                    {levelContent[basic.lever]}
                  </span>
                </Descriptions.Item>

                <Descriptions.Item label="持续时间:">{basic.continuedtime}</Descriptions.Item>
                <Descriptions.Item label="告警策略:" span={2}>
                  {basic.strategy}
                </Descriptions.Item>
                <Descriptions.Item label="告警详情:" span={2}>
                  {basic.detail}
                </Descriptions.Item>
                <Descriptions.Item label="派单编号">{basic.number}</Descriptions.Item>
                <Descriptions.Item label="允许手动关闭"></Descriptions.Item>
              </Descriptions>
              <Form layout="inline" onSubmit={this.handleSubmit}>
                <Form.Item label="确认告警:">
                  {getFieldDecorator('confirmAlarm')(<Checkbox value="yes"></Checkbox>)}
                </Form.Item>

                <Form.Item label="关闭告警:" style={{ marginLeft: 235 }}>
                  {getFieldDecorator('closeAlarm')(<Checkbox value="no"></Checkbox>)}
                </Form.Item>

                <Form.Item label="备注" style={{ display: 'block' }}>
                  {/* <Icon type="edit" id='icon' onClick={this.show}></Icon> */}
                  {getFieldDecorator('remark')(
                    <TextArea style={{ width: 400, height: 100 }}></TextArea>,
                  )}
                </Form.Item>

                <Form.Item style={{ marginLeft: 400 }}>
                  <Button type="primary" htmlType="submit">
                    更新告警
                  </Button>
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    更新告警策略
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>

            <TabPane tab="操作记录" key="2">
              <Table columns={columns} dataSource={dataSource}></Table>
            </TabPane>

            <TabPane tab="告警历史" key="3">
              <Table
                columns={historyInfoColumns}
                dataSource={data}
                style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}
              ></Table>
            </TabPane>

            <TabPane tab="告警通知" key="4">
              <Table columns={notificationInfoColumns} dataSource={notificaData}></Table>
            </TabPane>
          </Tabs>
        </Drawer>
      </>
    );
  }
}
export default Form.create()(CurrentalarmDetail);
