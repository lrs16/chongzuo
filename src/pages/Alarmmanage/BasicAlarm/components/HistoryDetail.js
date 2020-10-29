import React, { Component } from 'react';
import { Form, Input, Descriptions, Table, Tabs, Drawer } from 'antd';

const { TextArea } = Input;
const { TabPane } = Tabs;
const withClick = (element, handleClick = () => {}) => {
  return <element.type {...element.props} onClick={handleClick} />;
};

class HistoryDetail extends Component {
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

  render() {
    const { visible } = this.state;
    const { children, title, basic, opera, historyInfo, notificationInfo } = this.props;
    const dataSource = [...opera];
    const data = [...historyInfo];

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
      },
      {
        title: '确认',
        dataIndex: 'confirm',
        key: 'confirm',
      },
      {
        title: '动作',
        dataIndex: 'action',
        key: 'action',
      },
    ];

    const notificationInfoColumns = [
      {
        title: '告警内容',
        dataIndex: 'alarmcontent',
        key: 'alarmcontent',
      },
      {
        title: '发送时间',
        dataIndex: 'sendtime',
        key: 'sendtime',
      },
      {
        title: '发送方式',
        dataIndex: 'sendway',
        key: 'sendway',
      },
      {
        title: '接收人',
        dataIndex: 'receiver',
        key: 'receiver',
      },
      {
        title: '状态',
        dataIndex: 'statue',
        key: 'statue',
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
                <Descriptions.Item label="级    别:">{basic.lever}</Descriptions.Item>
                <Descriptions.Item label="持续时间:">{basic.continuedtime}</Descriptions.Item>
                <Descriptions.Item label="告警策略:">{basic.strategy}</Descriptions.Item>
                <Descriptions.Item label="告警详情:">{basic.detail}</Descriptions.Item>
                <Descriptions.Item label="派单编号">{basic.number}</Descriptions.Item>
                <Descriptions.Item label=""></Descriptions.Item>
                <Descriptions.Item label="备注">{basic.remark}</Descriptions.Item>
              </Descriptions>
            </TabPane>

            <TabPane tab="操作记录" key="2">
              <Table columns={columns} dataSource={dataSource} rowKey={record => record.id}></Table>
            </TabPane>

             <TabPane tab="告警历史" key="3">
               <Table columns={historyInfoColumns} dataSource={data} rowKey={record => record.id}></Table>
             </TabPane> 

            <TabPane tab="告警通知" key="4">
              <Table columns={notificationInfoColumns} dataSource={notificationInfo} rowKey={record => record.id}></Table>
            </TabPane> 
          </Tabs>
        </Drawer>
      </>
    );
  }
}
export default HistoryDetail;
