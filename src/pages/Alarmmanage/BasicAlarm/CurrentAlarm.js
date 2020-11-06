import React, { Component } from 'react';
import { Card,
         Tabs,
         Form, 
         Table, 
         Message, 
         Radio, 
         Button, 
         Input, 
         message,
         Row,
         Col
  } from 'antd';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import CurrentalarmDetail from './components/CurrentalarmDetail';
import { ChartCard } from '@/components/Charts';
import ExportJsonExcel from 'js-export-excel';
import { Chart, Interval, Interaction, registerInteraction, Tooltip } from 'bizcharts';
//import resources from '../Automation/Scenarios/models/resources';

const { TabPane } = Tabs;
const { Search } = Input;
@connect(({ currentalarm, loading }) => ({
  currentalarm,
  loading: loading.models.currentalarm,
}))
class CurrentAlarm extends Component {
  constructor(props) {
    super(props);
      this.state = {
        pagetitle:this.props.route.name,
      };
    }
  
  state = {
    current: 1,
    pageSize: 3,
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
      type: 'currentalarm/currentList',
      // payload:{
      //   page,
      //   limit,
      //   quekey,
      // }
    });
  };

  getBasicInfo = () => {
    this.props.dispatch({
      type: 'currentalarm/currentBasic',
    });
  };

  getOperaInfo = () => {
    this.props.dispatch({
      type: 'currentalarm/currentOpera',
    });
  };

  getHistoryInfo = () => {
    this.props.dispatch({
      type: 'currentalarm/currentHistory',
    });
  };

  getNotificationInfo = () => {
    this.props.dispatch({
      type: 'currentalarm/alarmNotification',
    });
  };

  changePage = page => {
    this.props.dispatch({
      type: 'currentalarm/currentList',
      payload: {
        quekey: this.state.quekey,
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
      type: 'currentalarm/currentList',
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

  confirmWarning = () => {
    if (this.state.selectedRows.length) {
      const confirmList = [];
      this.state.selectedRows.forEach(item => {
        const id = item.id;
        confirmList.push(id);
      });
      const { dispatch } = this.props;
      dispatch({
        type: 'currentalarm/confirmWarning',
        payload: confirmList,
      }).then(res => {
        if (res.code === 200) {
          Message.success(res.msg);
          this.getlist();
        } else {
          Message.error('确认告警失败');
        }
      });
    } else {
      message.info('至少选择一条数据');
    }
  };

  cancelConfirmation = () => {
    if (this.state.selectedRows.length) {
      const confirmList = [];
      this.state.selectedRows.forEach(item => {
        const id = item.id;
        confirmList.push(id);
      });
      const { dispatch } = this.props;
      dispatch({
        type: 'currentalarm/cancelConfirmation',
        payload: confirmList,
      }).then(res => {
        if (res.code === 200) {
          Message.success(res.msg);
          this.getlist();
        } else {
          Message.error('取消告警失败');
        }
      });
    } else {
      message.info('至少选择一条数据');
    }
  };

  handleClose = () => {
    if (this.state.selectedRows.length) {
      const closeList = [];
      this.state.selectedRows.forEach(item => {
        const id = item.id;
        closeList.push(id);
      });
      const { dispatch } = this.props;
      dispatch({
        type: 'currentalarm/currentalarmClose',
        payload: closeList,
      }).then(res => {
        if (res.code === 200) {
          Message.success(res.msg);
          this.getlist();
        } else {
          Message.error('关闭失败');
        }
      });
    } else {
      message.info('至少选择一条数据');
    }
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

  render() {
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
          <CurrentalarmDetail
            basic={basicInfo}
            opera={opera}
            currentInfo={currentInfo}
            alarmNotificationInfo={notificationInfo}
          >
            <span style={{ color: '	#1E90FF' }}>{text}</span>
          </CurrentalarmDetail>
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
    const { currentalarm } = this.props;
    const {
      basicInfo = [],
      list = [],
      opera = [],
      currentInfo = [],
      notificationInfo = [],
    } = currentalarm;
    const dataSource = [...list];

    const pagination = {
      showSizeChanger: true,
      showQuickJumper: true,
      onShowSizeChange: (current, pageSize) => this.onShowSizeChange(current, pageSize),
      current: this.state.current,
      pageSize: this.state.pageSize,
      onChange: page => this.changePage(page),
    };

    const data = [
      { year: '00:30', type: '严重', sales: 50 },
      { year: '01:00', type: '严重', sales: 20 },
      { year: '01:30', type: '严重', sales: 3 },
      { year: '02:00', type: '严重', sales: 40 },
      { year: '02:30', type: '严重', sales: 10 },
      { year: '03:00', type: '严重', sales: 7 },
      { year: '04:00', type: '严重', sales: 20 },
      { year: '04:30', type: '严重', sales: 7 },
      { year: '05:00', type: '严重', sales: 30 },
      { year: '05:30', type: '严重', sales: 3 },
      { year: '06:00', type: '严重', sales: 30 },
      { year: '06:30', type: '严重', sales: 35 },
      { year: '07:00', type: '严重', sales: 35 },
      { year: '07:30', type: '严重', sales: 35 },
      { year: '08:00', type: '严重', sales: 35 },
      { year: '08:30', type: '严重', sales: 35 },
      { year: '09:00', type: '严重', sales: 35 },
      { year: '09:30', type: '严重', sales: 35 },
      { year: '10:00', type: '严重', sales: 35 },
      { year: '10:30', type: '严重', sales: 35 },
      { year: '11:00', type: '严重', sales: 35 },
      { year: '12:30', type: '严重', sales: 35 },

      { year: '00:30', type: '一般', sales: 10 },
      { year: '01:00', type: '一般', sales: 11 },
      { year: '01:30', type: '一般', sales: 66 },
      { year: '02:00', type: '一般', sales: 10 },
      { year: '02:30', type: '一般', sales: 4 },
      { year: '03:00', type: '一般', sales: 46 },
      { year: '04:00', type: '一般', sales: 11 },
      { year: '04:30', type: '一般', sales: 54 },
      { year: '05:00', type: '一般', sales: 30 },
      { year: '05:30', type: '一般', sales: 3 },
      { year: '06:00', type: '一般', sales: 30 },
      { year: '06:30', type: '一般', sales: 35 },
      { year: '07:00', type: '一般', sales: 35 },
      { year: '07:30', type: '一般', sales: 35 },
      { year: '08:00', type: '一般', sales: 35 },
      { year: '08:30', type: '一般', sales: 35 },
      { year: '09:00', type: '一般', sales: 35 },
      { year: '09:30', type: '一般', sales: 35 },
      { year: '10:00', type: '一般', sales: 35 },
      { year: '10:30', type: '一般', sales: 35 },
      { year: '11:00', type: '一般', sales: 35 },
      { year: '12:30', type: '一般', sales: 35 },

      { year: '00:30', type: '警告', sales: 10 },
      { year: '01:00', type: '警告', sales: 11 },
      { year: '01:30', type: '警告', sales: 6 },
      { year: '02:00', type: '警告', sales: 10 },
      { year: '02:30', type: '警告', sales: 40 },
      { year: '03:00', type: '警告', sales: 46 },
      { year: '04:00', type: '警告', sales: 11 },
      { year: '04:30', type: '警告', sales: 54 },
      { year: '05:00', type: '警告', sales: 30 },
      { year: '05:30', type: '警告', sales: 3 },
      { year: '06:00', type: '警告', sales: 30 },
      { year: '06:30', type: '警告', sales: 35 },
      { year: '07:00', type: '警告', sales: 35 },
      { year: '07:30', type: '警告', sales: 35 },
      { year: '08:00', type: '警告', sales: 35 },
      { year: '08:30', type: '警告', sales: 35 },
      { year: '09:00', type: '警告', sales: 35 },
      { year: '09:30', type: '警告', sales: 35 },
      { year: '10:00', type: '警告', sales: 35 },
      { year: '10:30', type: '警告', sales: 35 },
      { year: '11:00', type: '警告', sales: 35 },
      { year: '12:30', type: '警告', sales: 35 },

      { year: '00:30', type: '恢复', sales: 10 },
      { year: '01:00', type: '恢复', sales: 11 },
      { year: '01:30', type: '恢复', sales: 6 },
      { year: '02:00', type: '恢复', sales: 10 },
      { year: '02:30', type: '恢复', sales: 40 },
      { year: '03:00', type: '恢复', sales: 46 },
      { year: '04:00', type: '恢复', sales: 11 },
      { year: '04:30', type: '恢复', sales: 54 },
      { year: '05:00', type: '恢复', sales: 30 },
      { year: '05:30', type: '恢复', sales: 3 },
      { year: '06:00', type: '恢复', sales: 30 },
      { year: '06:30', type: '恢复', sales: 35 },
      { year: '07:00', type: '恢复', sales: 35 },
      { year: '07:30', type: '恢复', sales: 35 },
      { year: '08:00', type: '恢复', sales: 35 },
      { year: '08:30', type: '恢复', sales: 35 },
      { year: '09:00', type: '恢复', sales: 35 },
      { year: '09:30', type: '恢复', sales: 35 },
      { year: '10:00', type: '恢复', sales: 35 },
      { year: '10:30', type: '恢复', sales: 35 },
      { year: '11:00', type: '恢复', sales: 35 },
      { year: '12:30', type: '恢复', sales: 35 },

      { year: '00:30', type: '未知', sales: 10 },
      { year: '01:00', type: '未知', sales: 11 },
      { year: '01:30', type: '未知', sales: 6 },
      { year: '02:00', type: '未知', sales: 10 },
      { year: '02:30', type: '未知', sales: 40 },
      { year: '03:00', type: '未知', sales: 46 },
      { year: '04:00', type: '未知', sales: 11 },
      { year: '04:30', type: '未知', sales: 54 },
      { year: '05:00', type: '未知', sales: 30 },
      { year: '05:30', type: '未知', sales: 3 },
      { year: '06:00', type: '未知', sales: 30 },
      { year: '06:30', type: '未知', sales: 35 },
      { year: '07:00', type: '未知', sales: 35 },
      { year: '07:30', type: '未知', sales: 35 },
      { year: '08:00', type: '未知', sales: 35 },
      { year: '08:30', type: '未知', sales: 35 },
      { year: '09:00', type: '未知', sales: 35 },
      { year: '09:30', type: '未知', sales: 35 },
      { year: '10:00', type: '未知', sales: 35 },
      { year: '10:30', type: '未知', sales: 35 },
      { year: '11:00', type: '未知', sales: 35 },
      { year: '12:30', type: '未知', sales: 35 },
    ];

    const scale = {
      sales: {
        max: 160,
        tickInterval: 20,
        nice: true,
      },
    };

    return (
      <PageHeaderWrapper title={this.state.pagetitle}>
        <Card>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 500, fontSize: 20 }}>告警实时情况</span>
            <div>
              <span
                style={{
                  padding: 7,
                  backgroundColor: 'red',
                  fontSize: 12,
                  borderRadius: 5,
                  marginRight: 10,
                }}
              >
                严重
              </span>
              <span
                style={{
                  padding: 7,
                  backgroundColor: '#FF9966',
                  fontSize: 12,
                  borderRadius: 5,
                  marginRight: 10,
                }}
              >
                一般
              </span>
              <span
                style={{
                  padding: 7,
                  backgroundColor: '#FFFF99',
                  fontSize: 12,
                  borderRadius: 5,
                  marginRight: 10,
                }}
              >
                警告
              </span>
              <span
                style={{
                  padding: 7,
                  backgroundColor: '#66CC99',
                  fontSize: 12,
                  borderRadius: 5,
                  marginRight: 10,
                }}
              >
                恢复
              </span>
              <span
                style={{
                  padding: 7,
                  backgroundColor: '#99CC33',
                  fontSize: 12,
                  borderRadius: 5,
                  marginRight: 10,
                }}
              >
                正常
              </span>
              <span
                style={{ padding: 7, backgroundColor: '#CCCCCC', fontSize: 12, borderRadius: 5 }}
              >
                未知
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
            <div
              style={{
                backgroundColor: 'red',
                paddingTop: 40,
                paddingLeft: 80,
                paddingRight: 80,
                paddingBottom: 40,
                borderRadius: 5,
              }}
            >
              <span style={{ position: 'relative', right: 50, bottom: 20 }}>严重</span>
              <span>0</span>
            </div>

            <div
              style={{
                backgroundColor: '#FF9966',
                paddingTop: 40,
                paddingLeft: 80,
                paddingRight: 80,
                paddingBottom: 40,
                borderRadius: 5,
              }}
            >
              <span style={{ position: 'relative', right: 50, bottom: 20 }}>一般</span>
              <span>0</span>
            </div>

            <div
              style={{
                backgroundColor: '#FFFF99',
                paddingTop: 40,
                paddingLeft: 80,
                paddingRight: 80,
                paddingBottom: 40,
                borderRadius: 5,
              }}
            >
              <span style={{ position: 'relative', right: 50, bottom: 20 }}>警告</span>
              <span>0</span>
            </div>

            <div
              style={{
                backgroundColor: '#66CC99',
                paddingTop: 40,
                paddingLeft: 80,
                paddingRight: 80,
                paddingBottom: 40,
                borderRadius: 5,
              }}
            >
              <span style={{ position: 'relative', right: 50, bottom: 20 }}>恢复</span>
              <span>0</span>
            </div>

            <div
              style={{
                backgroundColor: '#CCCCCC',
                paddingTop: 40,
                paddingLeft: 80,
                paddingRight: 80,
                paddingBottom: 40,
                borderRadius: 5,
              }}
            >
              <span style={{ position: 'relative', right: 50, bottom: 20 }}>未知</span>
              <span>0</span>
            </div>
          </div>
          <p style={{ fontWeight: 500, fontSize: 20 }}>告警趋势</p>

          <Chart padding={[10, 20, 50, 40]} autoFit height={500} data={data} scale={scale}>
            <Tooltip showMarkers={false} />
            <Interval
              position="year*sales"
              color={['type', ['red', '#FF9966', '#FFFF99', '#66CC99', '#CCCCCC']]}
              adjust="stack"
            />
            <Interaction type="element-highlight" />
            <Interaction type="element-link" />
            <Tooltip shared />
          </Chart>
        </Card>

        <Card>
          <Row>

            <Col span={12}>
              <Button type="primary" style={{marginRight:'8px'}} onClick={this.confirmWarning}>
                警告确认
              </Button>
              <Button style={{marginRight:'8px'}} onClick={this.cancelConfirmation}>
                取消确认
              </Button>
              <Button type="link" style={{ borderColor: 'yellow',marginRight:'8px'}} onClick={this.handleClose}>
                关闭
              </Button>
              {/* <Button onClick={this.exportExcel}>导出</Button> */}
              <Button >导出</Button>
            </Col>

            <Col span={8}>
              <Radio.Group defaultValue="a">
                <Radio.Button value="a">告警标题</Radio.Button>
                <Radio.Button value="b">设备名称</Radio.Button>
                <Radio.Button value="c">IP</Radio.Button>
              </Radio.Group>
            </Col>

            <Col span={4}>
              <Form>
                <Search placeholder="请输入关键字" />
              </Form>
            </Col>

          </Row>

          <Tabs>
            <TabPane tab="tab1" key="1">
              <Table
                columns={columns}
                dataSource={dataSource}
                pagination={pagination}
                scroll={{ x: 2000 }}
                rowSelection={rowSelection}
                rowKey={record => record.id}
              ></Table>
            
            </TabPane>
         
            {/* <TabPane tab="tab2" key="2">
              <Table></Table>
            </TabPane>
            <TabPane tab="tab3" key="3">
              <Table></Table>
            </TabPane> */}
          </Tabs>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(CurrentAlarm);
