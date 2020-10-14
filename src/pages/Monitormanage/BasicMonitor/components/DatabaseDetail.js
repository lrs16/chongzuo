import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import numeral from 'numeral';
import { Card, Tabs, Table, Icon, Tag, Badge, Button } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import TimeModal from './TimeModal';
import DatabaseLastcheck from './DatabaseLastcheck';
import DatabaseOthercheck from './DatabaseOthercheck';
import DatabaseChart from './DatabaseChart';

const { TabPane } = Tabs;
const { Description } = DescriptionList;

const statusMap = ['default', 'processing'];
const status = ['离线', '在线'];
const alarmstatusMap = ['#FF3703', '#FF9B2F', '#FFDC1D', '#3FF6CE', '#56DF6B', '#ccc'];
const alertStatus = ['严重', '一般', '警告', '恢复', '正常', '未知'];

@connect(({ databasedetail, loading }) => ({
  databasedetail,
  loadinginfo: loading.effects['databasedetail/fetchdetail'],
  loadingcurreem: loading.effects['databasedetail/fetchCurrentalarm'],
}))
@connect(({ hostdetail, loading }) => ({
  hostdetail,
  loading: loading.models.hostdetail,
  loadingindicator: loading.effects['hostdetail/fetchcurrenthistory'],
  loadingorther: loading.effects['hostdetail/fetchotherhistory'],
}))
class DatabaseDetail extends Component {
  state = {
    count: 2,
    dateString: '最近一次',
  };

  componentDidMount() {
    const { count } = this.state;
    const { applicationId } = this.props;
    this.getdatas(count);
    this.getcurrentHistory(applicationId);
    this.getbaseinfo();
  }

  //基本信息
  getbaseinfo = () => {
    const { databaseId } = this.props;
    this.props.dispatch({
      type: 'databasedetail/fetchdetail',
      payload: { databaseId },
    });
  };
  // 当前告警
  getdatas = count => {
    this.props.dispatch({
      type: 'databasedetail/fetchCurrentalarm',
      payload: { count },
    });
  };

  // 历史告警
  gethistorydatas = () => {
    this.props.dispatch({
      type: 'hostdetail/fetchhistory',
    });
  };

  // 进程情况
  getprocessdatas = () => {
    this.props.dispatch({
      type: 'hostdetail/fetchprocess',
    });
  };

  // 最近一次指标监控
  getcurrentHistory = () => {
    const { dispatch, applicationId } = this.props;
    dispatch({
      type: 'hostdetail/fetchcurrenthistory',
      payload: {
        applicationId,
      },
    });
  };

  gettimedatas(datas, startdata, enddata) {
    const { dispatch, applicationId } = this.props;
    const toTime = moment().format('X');
    switch (datas) {
      case '最近一次':
        dispatch({
          type: 'hostdetail/fetchcurrenthistory',
          payload: {
            applicationId,
          },
        });
        break;
      case '30分钟':
        dispatch({
          type: 'hostdetail/fetchotherhistory',
          payload: {
            applicationId,
            formTime: moment()
              .subtract(30, 'minute')
              .format('X'),
            toTime,
          },
        });
        break;
      case '1小时':
        dispatch({
          type: 'hostdetail/fetchotherhistory',
          payload: {
            applicationId,
            formTime: moment()
              .subtract(1, 'hour')
              .format('X'),
            toTime,
          },
        });
        break;
      case '3小时':
        dispatch({
          type: 'hostdetail/fetchotherhistory',
          payload: {
            applicationId,
            formTime: moment()
              .subtract(3, 'hour')
              .format('X'),
            toTime,
          },
        });
        break;
      case '12小时':
        dispatch({
          type: 'hostdetail/fetchotherhistory',
          payload: {
            applicationId,
            formTime: moment()
              .subtract(12, 'hour')
              .format('X'),
            toTime,
          },
        });
        break;
      case '1天':
        dispatch({
          type: 'hostdetail/fetchotherhistory',
          payload: {
            applicationId,
            formTime: moment()
              .subtract(1, 'days')
              .format('X'),
            toTime,
          },
        });
        break;
      case '3天':
        dispatch({
          type: 'hostdetail/fetchotherhistory',
          payload: {
            applicationId,
            formTime: moment()
              .subtract(3, 'days')
              .format('X'),
            toTime,
          },
        });
        break;
      case '7天':
        dispatch({
          type: 'hostdetail/fetchotherhistory',
          payload: {
            applicationId,
            formTime: moment()
              .subtract(7, 'days')
              .format('X'),
            toTime,
          },
        });
        break;
      case '1月':
        dispatch({
          type: 'hostdetail/fetchotherhistory',
          payload: {
            applicationId,
            formTime: moment()
              .subtract(1, 'months')
              .format('X'),
            toTime,
          },
        });
        break;
      default:
        dispatch({
          type: 'hostdetail/fetchotherhistory',
          payload: {
            applicationId,
            formTime: moment(startdata).format('X'),
            toTime: moment(enddata).format('X'),
          },
        });
        break;
    }
  }

  toggle = count => {
    this.setState({ count });
    this.getdatas(count);
  };

  handleChangetab = key => {
    const { count } = this.state;
    switch (key) {
      case '1':
        this.getdatas(count);
        break;
      case '2':
        this.gethistorydatas();
        break;
      case '4':
        this.getprocessdatas();
        break;
      default:
        break;
    }
  };

  onChangeBut = (datas, startdata, enddata) => {
    this.setState({
      dateString: datas,
    });

    this.gettimedatas(datas, startdata, enddata);
  };

  render() {
    const columns = [
      {
        dataIndex: 'alarmstatus',
        render: (text, record) => {
          const colors = alarmstatusMap[record.alarmstatus];
          return (
            <span>
              <span style={{ color: `${colors}` }}>{alertStatus[text]}</span>
              <Icon
                type="exclamation-circle"
                theme="filled"
                style={{ color: `${colors}`, fontSize: '1.5em', marginLeft: 15 }}
              />
            </span>
          );
        },
      },
      {
        dataIndex: 'applyLabel',
        render: val => (
          <span>
            <Tag style={{ marginBottom: 2, marginTop: 2 }}>{val}</Tag>
          </span>
        ),
      },
      { dataIndex: 'alerContent' },
      { dataIndex: 'time' },
    ];

    const columnshistory = [
      {
        title: '告警内容',
        dataIndex: 'alerContent',
        key: 'alerContent',
      },
      {
        title: '发生时间',
        dataIndex: 'time',
        key: 'time',
      },
      {
        title: '告警等级',
        dataIndex: 'alarmstatus',
        key: 'alarmstatus',
        render: (text, record) => {
          const colors = alarmstatusMap[record.alarmstatus];
          return <span style={{ color: `${colors}` }}>{alertStatus[text]}</span>;
        },
      },
    ];

    // 功能未实现
    // const columnsprocess = [
    //   {
    //     title: '进程名',
    //     dataIndex: 'name',
    //     key: 'name',
    //   },
    //   {
    //     title: '进程ID',
    //     dataIndex: 'id',
    //     key: 'id',
    //   },
    //   {
    //     title: '父进程ID',
    //     dataIndex: 'parentid',
    //     key: 'parentid',
    //   },
    //   {
    //     title: '线程数',
    //     dataIndex: 'threads',
    //     key: 'threads',
    //   },
    //   {
    //     title: 'CPU使用率',
    //     dataIndex: 'cpuused',
    //     key: 'cpuused',
    //     render: text => <span>{numeral(text).format('0,0')}%</span>,
    //   },
    //   {},
    //   {
    //     title: '内存使用率',
    //     dataIndex: 'memoryused',
    //     key: 'memoryused',
    //     render: text => <span>{numeral(text).format('0,0')}%</span>,
    //   },
    //   {
    //     title: '磁盘使用率',
    //     dataIndex: 'diskused',
    //     key: 'diskused',
    //     render: text => <span>{numeral(text).format('0,0')}B/秒</span>,
    //   },
    //   {
    //     title: '网络使用率',
    //     dataIndex: 'network',
    //     key: 'network',
    //     render: text => <span>{numeral(text).format('0,0')}Mbps</span>,
    //   },
    // ];

    const { dateString } = this.state;
    //  const { id, data, radiaokey } = this.props.location.state;
    const {
      loading,
      //   loadingindicator,
      loadingorther,
      data,
      alarmtype,
      hostdetail: { historyalarms, processlist, history, currentHistory },
      databasedetail: { baseinfo, currealarms },
    } = this.props;
    console.log(this.props.databasedetail);
    const dataSource = currealarms.data;
    return (
      <>
        <Card style={{ marginBottom: 24, marginTop: '-1px' }}>
          <DescriptionList size="large" title="基本信息">
            <Description term="名称">{baseinfo.name}</Description>
            <Description term="IP">{baseinfo.ip}</Description>
            <Description term="监控分类">{baseinfo.type}</Description>
            {/* <Description term="状态">
              <Badge status={statusMap[data.status]} text={status[data.status]} /> 
            </Description>*/}
            <Description term="Locks">{baseinfo.lock}个</Description>
            <Description term="运行时长">{baseinfo.runTime}</Description>
            <Description term="processes /max processes">
              {baseinfo.processes}/{baseinfo.maxProcesses}
            </Description>
            <Description term="session/max session">
              {baseinfo.session}/{baseinfo.maxSession}
            </Description>
          </DescriptionList>
          <DescriptionList size="large">
            <Description term="归档空间目录(值)">{baseinfo.archiveDirectory}</Description>
            <Description term="Oracle安装目录">{baseinfo.installDirectory}</Description>
            <Description term="数据库版本">{baseinfo.version}</Description>
          </DescriptionList>
        </Card>
        {/* 功能未实现 */}
        {/* <Card style={{ marginBottom: 24 }}>
          <Tabs
            defaultActiveKey="1"
            onChange={this.handleChangetab}
            size="large"
            style={{ marginTop: '-15px' }}
          >
            <TabPane tab="当前告警" key="1">
              <Table
                // loading={loadingcurreem}
                showHeader={false}
                pagination={false}
                columns={columns}
                rowKey={record => record.id}
                dataSource={dataSource}
                size="default "
              />
              {this.state.count === 2 && (
                <Icon
                  type="down"
                  style={{ float: 'right', marginTop: '5px', marginRight: '5px' }}
                  // onClick={() => this.toggle(alarmtype[0].count)}
                  onClick={() => this.toggle(3)}
                />
              )}
              {this.state.count !== 2 && (
                <Icon
                  type="up"
                  style={{ float: 'right', marginTop: '5px', marginRight: '5px' }}
                  onClick={() => this.toggle(2)}
                />
              )}
            </TabPane>
            <TabPane tab="历史告警" key="2">
              <div style={{ padding: '0 0 10px 10px' }}>最近24小时：5条</div>
              <Table
                loading={loading}
                columns={columnshistory}
                rowKey={record => record.id}
                dataSource={historyalarms}
                size="default "
              />
            </TabPane>
          </Tabs>
        </Card> */}
        <Card>
          <Tabs
            defaultActiveKey="1"
            onChange={this.handleChangetab}
            size="large"
            style={{ marginTop: '-15px' }}
          >
            <TabPane tab="监控指标" key="3">
              <div style={{ textAlign: 'right', marginBottom: 15 }}>
                <TimeModal onButClick={this.onChangeBut}>
                  <Button shape="round" icon="clock-circle" style={{ width: 350 }}>
                    {dateString}
                  </Button>
                </TimeModal>
              </div>
              {this.state.dateString === '最近一次' && (
                <DatabaseLastcheck currentHistory={currentHistory} loading={loading} />
              )}
              {this.state.dateString !== '最近一次' && (
                <DatabaseOthercheck datas={history} loading={loadingorther} />
              )}
              <DatabaseChart />
            </TabPane>
            {/* 功能未实现 */}
            {/* <TabPane tab="性能分析" key="4">
              <Table
                loading={loading}
                columns={columnsprocess}
                rowKey={record => record.id}
                dataSource={processlist}
              />
            </TabPane> */}
          </Tabs>
        </Card>
      </>
    );
  }
}

export default DatabaseDetail;
