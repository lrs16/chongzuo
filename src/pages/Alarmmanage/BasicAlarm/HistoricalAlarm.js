import React, { Component } from 'react';
import { Card, 
         Input, 
         Table, 
         Tabs, 
         Form, 
         Button, 
         DatePicker, 
         Select,
         Row,
         Col } from 'antd';
import { connect } from 'dva';
import HistoryDetail from './components/HistoryDetail';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ExportJsonExcel from 'js-export-excel';

const { TabPane } = Tabs;
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 4 },
};
@connect(({ historicalalarm, loading }) => ({
  historicalalarm,
  loading: loading.models.historicalalarm,
}))
class HistoricalAlarm extends Component {
  state = {
    current: 1,
    pageSize: 1,
    queKey: '',
    selectedRows: [],
  };

  componentDidMount() {
    this.getlist();
    this.getBasicInfo();
    this.getOperaInfo();
    this.getHistoryInfo();
    this.getNotificationInfo();
  }

  getlist = () => {
    // const page = this.state.current;
    // const limit = this.state.pageSize;
    // const { quekey } = this.state;
    this.props.dispatch({
      type: 'historicalalarm/fetchhistorylist',
      // payload:{
      //   page,
      //   limit,
      //   quekey,
      // }
    });
  };

  getBasicInfo = () => {
    this.props.dispatch({
      type: 'historicalalarm/historyBasic',
    });
  };

  getOperaInfo = () => {
    this.props.dispatch({
      type: 'historicalalarm/historyOpera',
    });
  };

  getHistoryInfo = () => {
    this.props.dispatch({
      type: 'historicalalarm/alarmHistory',
    });
  };

  getNotificationInfo = () => {
    this.props.dispatch({
      type: 'historicalalarm/alarmNotification',
    });
  };

  showAdvancedquery = () => {
    document.getElementById('advancedquery').style.display = 'block';
    document.getElementById('simplequery').style.display = 'none';
  };

  hide = () => {
    document.getElementById('advancedquery').style.display = 'none';
    document.getElementById('simplequery').style.display = 'block';
  };

  handleReset = () => {
    this.props.form.resetFields();
  };

  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
    });
  };

  changePage = page => {
    this.props.dispatch({
      type: 'maintenanceplan/mainplayList',
      payload: {
        queKey: this.state.quekey,
        page,
        limit: this.state.pageSize,
      },
    });
    setTimeout(() => {
      this.setState({ current: page });
    }, 0);
  };

  onShowSizeChange = (current, pageSize) => {
    console.log(this.state.current);
    this.props.dispatch({
      type: 'maintenanceplan/mainplayList',
      payload: {
        quekey: this.state.quekey,
        page: current,
        limit: pageSize,
      },
    });
    setTimeout(() => {
      this.setState({ pageSize });
    }, 0);
  };

  exportExcel = () => {
    const { currentalarm } = this.props;
    const { selectedRows } = this.state;
    const option = {};

    option.fileName = 'excel';
    option.datas = [
      {
        sheetData: selectedRows.map(item => {
          const result = {};
          selectedRows.forEach(c => {
            result[c.line] = item['line'];
            result[c.alarmTitle] = item['alarmTitle'];
            result[c.alarmDetail] = item['alarmDetail'];
            result[c.equipmentName] = item['equipmentName'];
            result[c.ip] = item['ip'];
            result[c.alarmTime] = item['alarmTime'];
            result[c.recoveryTime] = item['recoveryTime'];
            result[c.level] = item['level'];
            result[c.threshold] = item['threshold'];
            result[c.currentValue] = item['currentValue'];
            result[c.duration] = item['duration'];
            result[c.alarmStatus] = item['alarmStatus'];
            result[c.alarmTimes] = item['alarmTimes'];
            result[c.alarmNotification] = item['alarmNotification'];
            result[c.alarmId] = item['alarmId'];
          });
          // console.log(result);
          return result;
        }),
        sheetName: 'ExcelName',
        // sheetFilter:selectedRows.map(item => item.level),
        sheetHeader: [
          '行数',
          '告警标题',
          '告警详情',
          '设备名称',
          'IP',
          '告警时间',
          '恢复时间',
          '级别',
          '阈值',
          '当前值',
          '持续时间',
          '告警状态',
          '告警次数',
          '告警通知',
          '告警ID',
        ],
        columnWidths: selectedRows.map(item => 10),
      },
    ];
    const toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
  };

  changeTabpane = activeKey => {
    this.props.dispatch({
      type: 'maintenanceplan/mainplayList',
      payload: {
        queKey: this.state.queKey,
        page: this.state.current,
        limit: this.state.pageSize,
        activeKey,
      },
    });
  };

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 20 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 4 },
        sm: { span: 17 },
      },
    };

    // const formItemLayout = {
    //   labelCol: {
    //     xs: { span: 24 },
    //     sm: { span: 8 },
    //   },
    //   wrapperCol: {
    //     xs: { span: 24 },
    //     sm: { span: 16 },
    //   },
    // };
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        this.setState({
          selectedRows: selectedRows,
        });
      },
    };
    const columns = [
      {
        title: '告警标题',
        dataIndex: 'alarmTitle',
        key: 'alarmTitle',
        width: 150,
        render: (text, record) => (
          <HistoryDetail
            basic={basicInfo}
            opera={opera}
            historyInfo={historyInfo}
            notificationInfo={notificationInfo}
          >
            <span>{text}</span>
          </HistoryDetail>
        ),
      },
      {
        title: '告警详情',
        dataIndex: 'alarmDetail',
        key: 'alarmDetail',
        width: 200,
      },
      {
        title: '设备名称',
        dataIndex: 'equipmentName',
        key: 'equipmentName',
        width: 120,
      },
      {
        title: 'IP',
        dataIndex: 'ip',
        key: 'ip',
        width: 120,
      },
      {
        title: '告警时间',
        dataIndex: 'alarmTime',
        key: 'alarmTime',
        width: 200,
      },
      {
        title: '恢复时间',
        dataIndex: 'recoveryTime',
        key: 'recoveryTime',
        width: 200,
      },
      {
        title: '级别',
        dataIndex: 'level',
        key: 'level',
      },
      {
        title: '阈值',
        dataIndex: 'threshold',
        key: 'threshold',
      },
      {
        title: '当前值',
        dataIndex: 'currentValue',
        key: 'currentValue',
      },
      {
        title: '持续时间',
        dataIndex: 'duration',
        key: 'duration',
        width: 150,
      },
      {
        title: '告警状态',
        dataIndex: 'alarmStatus',
        key: 'alarmStatus',
      },
      {
        title: '告警次数',
        dataIndex: 'alarmTimes',
        key: 'alarmTimes',
      },
      {
        title: '告警通知',
        dataIndex: 'alarmNotification',
        key: 'alarmNotification',
      },
      {
        title: '告警ID',
        dataIndex: 'alarmId',
        key: 'alarmId',
        width: 200,
      },
    ];
    const pagination = {
      showSizeChanger: true,
      showQuickJumper: true,
      onShowSizeChange: (current, pageSize) => this.onShowSizeChange(current, pageSize),
      current: this.state.current,
      pageSize: this.state.pageSize,
      onChange: page => this.changePage(page),
    };
    const { getFieldDecorator } = this.props.form;
    const { historicalalarm } = this.props;
    const {
      basicInfo = [],
      list = [],
      opera = [],
      historyInfo = [],
      notificationInfo = [],
    } = historicalalarm;
    const dataSource = [...list];

    return (
      <PageHeaderWrapper title="历史告警">
        <Card>
          <Form
            style={{ display: 'block' }}
            id="simplequery"
            onSubmit={this.handleSearch}
            {...formItemLayout}
          >
            <Row>
              <Col span={8}>
                <Form.Item label="告警标题">
                {getFieldDecorator('alarmTitle', {
                  initialValue: '',
                })(<Input />)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="设备名称">
                  {getFieldDecorator('equipmentName', {
                    initialValue: '',
                  })(<Input />)}
                </Form.Item>
              </Col>

              <Col span={7} style={{ textAlign: 'right' }}>
                <Button type="primary" htmlType="submit" style={{ marginLeft: 8 }}>
                  搜索
                </Button>
                <Button style={{ marginLeft: 8 }}>重置</Button>
                <span onClick={this.showAdvancedquery} style={{ marginLeft: 8 }}>展开</span>
                <Button onClick={this.exportExcel} style={{ marginLeft: 8 }}>导出</Button>
              </Col>
            </Row>
          </Form>

          <Form
            // layout="inline"
            id="advancedquery"
            style={{ display: 'none' }}
            onSubmit={this.handleSearch}
            {...formItemLayout}
          >
            <Row>
              <Col span={8}>
                <Form.Item label="告警标题">
                  {getFieldDecorator('alarmTitle', {
                    initialValue: '',
                  })(<Input />)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="设备名称">
                  {getFieldDecorator('equipmentName', {
                    initialValue: '',
                  })(<Input />)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="ip地址">
                  {getFieldDecorator('ip', {
                    initialValue: '',
                  })(<Input />)}
                </Form.Item>
              </Col>

              <Col  span={8}>
                <Form.Item label="告警时间">
                  {getFieldDecorator('alarmTime', {
                    // initialValue: '',
                  })(<DatePicker />)}
                </Form.Item>
                </Col>

              <Col span={8}>
                <Form.Item label="恢复时间">
                  {getFieldDecorator('recoveryTime', {
                    // initialValue: '',
                  })(<DatePicker />)}
                </Form.Item>
              </Col>

              
              <Col span={8}>
                <Form.Item label="严重性">
                  {getFieldDecorator('seriousness', {
                    initialValue: '',
                  })(<Select />)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="持续时间">
                  {getFieldDecorator('duration', {
                    // initialValue: '',
                  })(<DatePicker />)}
                </Form.Item>
              </Col>

              <Col className="gutter-row" span={8}>
                <Form.Item label="告警状态" >
                  {getFieldDecorator('alarmStatus', {
                    initialValue: '',
                  })(<Select/>)}
                </Form.Item>
              </Col>

              <Col className="gutter-row" span={8}>
                <Form.Item label="信息">
                  {getFieldDecorator('information', {
                    initialValue: '',
                  })(<Input />)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="告警确认">
                  {getFieldDecorator('alarmAcknowledgement', {
                    initialValue: '',
                  })(<Select/>)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="告警关闭">
                  {getFieldDecorator('alarmOff', {
                    initialValue: '',
                  })(<Select/>)}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="告警通知">
                  {getFieldDecorator('alarmNotification', {
                    initialValue: '',
                  })(<Select/>)}
                </Form.Item>
              </Col>

              {/* <Col span={8} style={{ textAlign: 'right' }}>
                  <Button type="primary" htmlType="submit">查询</Button>
                  <Button onClick={this.handleReset}>重置</Button>
                  <p onClick={this.hide}>收起</p>
              </Col> */}
              <Col span={23} style={{ textAlign: 'right' }}>
                <Button type="primary" htmlType="submit">
                  查 询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                  重 置
                </Button>
                <span style={{ marginLeft: 8 }} onClick={this.hide}>
                  收起
                </span>
              </Col>

              <Col span={5}>
                <Button>导出</Button>
              </Col>
          
            </Row>


          </Form>

          <Tabs onChange={this.changeTabpane}>
            <TabPane tab="全部" key="1">
              <Table
                columns={columns}
                dataSource={dataSource}
                scroll={{ x: 2000 }}
                pagination={pagination}
                rowSelection={rowSelection}
              ></Table>
            </TabPane>
            <TabPane tab="待处理" key="2">
              <Table
                columns={columns}
                dataSource={dataSource}
                scroll={{ x: 2000 }}
                pagination={pagination}
                rowSelection={rowSelection}
              ></Table>
            </TabPane>
            <TabPane tab="处理中" key="3">
              <Table
                columns={columns}
                dataSource={dataSource}
                scroll={{ x: 2000 }}
                pagination={pagination}
                rowSelection={rowSelection}
              ></Table>
            </TabPane>
            <TabPane tab="已完成" key="4">
              <Table
                columns={columns}
                dataSource={dataSource}
                scroll={{ x: 2000 }}
                pagination={pagination}
                rowSelection={rowSelection}
                rowKey={record => record.id}
              ></Table>
            </TabPane>
          </Tabs>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(HistoricalAlarm);
