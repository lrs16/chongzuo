import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import numeral from 'numeral';
import { Card, Radio, Tabs, Table, Icon, Tag, Badge, Button, Spin, Row, Col } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import DescriptionList from '@/components/DescriptionList';
import TimeModal from './components/TimeModal';
import RecentIndicator from './components/RecentIndicator';
import OtherIndicator from './components/OtherIndicator';

const { TabPane } = Tabs;
const { Description } = DescriptionList;

const statusMap = ['default', 'processing'];
const status = ['离线', '在线'];
const alarmstatusMap = ['#FF3703', '#FF9B2F', '#FFDC1D', '#3FF6CE', '#56DF6B', '#ccc'];
const alertStatus = ['严重', '一般', '警告', '恢复', '正常', '未知'];

@connect(({ basichostmonitor, loading }) => ({
  basichostmonitor,
  loading: loading.models.basichostmonitor,
  loadingindicator: loading.effects['basichostmonitor/fetchcurrenthistory'],
}))
class Detail extends Component {
  state = {
    count: 2,
    dateString: '最近一次',
    applicationId: '',
    key: '',
  };

  componentDidMount() {
    const { count } = this.state;
    const { id } = this.props.location.state;
    this.props
      .dispatch({
        type: 'basichostmonitor/fetchradiogroups',
        payload: {
          id,
        },
      })
      .then(() => {
        const {
          basichostmonitor: { radiogroups },
        } = this.props;
        const { radiaokey } = this.props.location.state;
        const application = radiogroups.filter(obj => {
          return obj.name === radiaokey;
        });
        this.getdatas(count);
        this.getcurrentHistory(application[0]?.key);
        this.setState({ applicationId: application[0]?.key });
      });
  }

  getdatas = count => {
    this.props.dispatch({
      type: 'basichostmonitor/fetchsysalarmlist',
      payload: { count },
    });
  };

  gethistorydatas = () => {
    this.props.dispatch({
      type: 'basichostmonitor/fetchhistory',
    });
  };

  getprocessdatas = () => {
    this.props.dispatch({
      type: 'basichostmonitor/fetchprocess',
    });
  };

  // 最近一次指标监控
  getcurrentHistory = applicationId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'basichostmonitor/fetchcurrenthistory',
      payload: {
        applicationId,
      },
    });
  };

  gettimedatas(datas, startdata, enddata) {
    const { dispatch } = this.props;
    const { applicationId } = this.state;
    const toTime = moment().format('X');
    switch (datas) {
      case '最近一次':
        dispatch({
          type: 'basichostmonitor/fetchcurrenthistory',
          payload: {
            applicationId,
          },
        });
        break;
      case '30分钟':
        dispatch({
          type: 'basichostmonitor/fetchotherhistory',
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
          type: 'basichostmonitor/fetchotherhistory',
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
          type: 'basichostmonitor/fetchotherhistory',
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
          type: 'basichostmonitor/fetchotherhistory',
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
          type: 'basichostmonitor/fetchotherhistory',
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
          type: 'basichostmonitor/fetchotherhistory',
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
          type: 'basichostmonitor/fetchotherhistory',
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
          type: 'basichostmonitor/fetchotherhistory',
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
          type: 'basichostmonitor/fetchotherhistory',
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

    const columnsprocess = [
      {
        title: '进程名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '进程ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '父进程ID',
        dataIndex: 'parentid',
        key: 'parentid',
      },
      {
        title: '线程数',
        dataIndex: 'threads',
        key: 'threads',
      },
      {
        title: 'CPU使用率',
        dataIndex: 'cpuused',
        key: 'cpuused',
        render: text => <span>{numeral(text).format('0,0')}%</span>,
      },
      {},
      {
        title: '内存使用率',
        dataIndex: 'memoryused',
        key: 'memoryused',
        render: text => <span>{numeral(text).format('0,0')}%</span>,
      },
      {
        title: '磁盘使用率',
        dataIndex: 'diskused',
        key: 'diskused',
        render: text => <span>{numeral(text).format('0,0')}B/秒</span>,
      },
      {
        title: '网络使用率',
        dataIndex: 'network',
        key: 'network',
        render: text => <span>{numeral(text).format('0,0')}Mbps</span>,
      },
    ];

    const { dateString } = this.state;
    const { id, data, radiaokey } = this.props.location.state;
    const {
      loading,
      loadingindicator,
      basichostmonitor: {
        sysalarms,
        radiogroups,
        historyalarms,
        processlist,
        history,
        currentHistory,
      },
    } = this.props;
    const dataSource = sysalarms;
    const alarmcount = radiogroups.filter(obj => {
      return obj.name === radiaokey;
    });
    return (
      <PageHeaderWrapper title="监测详情">
        <Card>
          <Radio.Group
            // defaultValue="System"
            value={radiaokey}
            buttonStyle="solid"
            //   onChange={e => setShow(e.target.value)}
          >
            {radiogroups.map(({ key, alertNumber, name }) => [
              <Radio.Button value={name} key={key}>
                <Badge count={alertNumber} style={{ zIndex: '10' }}>
                  <span style={{ lineHeight: '30px' }}>{name}</span>
                </Badge>
              </Radio.Button>,
            ])}
          </Radio.Group>
        </Card>
        <Card style={{ marginBottom: 24, marginTop: '-1px' }}>
          <DescriptionList size="large" title="基本信息">
            <Description term="名称">{data.name}</Description>
            <Description term="IP">{data.ip}</Description>
            <Description term="监控分类">{data.monitorType}</Description>
            <Description term="状态">
              <Badge status={statusMap[data.status]} text={status[data.status]} />
            </Description>
            <Description term="系统版本">{data.systemVersion}</Description>
            <Description term="系统类型">{data.systemType}</Description>
            <Description term="机器名">{data.machineName}</Description>
          </DescriptionList>
        </Card>
        <Card style={{ marginBottom: 24 }}>
          <Tabs
            defaultActiveKey="1"
            onChange={this.handleChangetab}
            size="large"
            style={{ marginTop: '-15px' }}
          >
            <TabPane tab="当前告警" key="1">
              <Table
                loading={loading}
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
                  onClick={() => this.toggle(alarmcount[0].count)}
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
        </Card>
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
              <Spin spinning={loadingindicator}>
                {currentHistory !== '' && (
                  <>
                    {this.state.dateString === '最近一次' && (
                      <RecentIndicator id={id} currentHistory={currentHistory} />
                    )}
                    {this.state.dateString !== '最近一次' && <OtherIndicator datas={history} />}
                  </>
                )}
              </Spin>
            </TabPane>
            <TabPane tab="进程情况" key="4">
              <Table
                loading={loading}
                columns={columnsprocess}
                rowKey={record => record.id}
                dataSource={processlist}
              />
            </TabPane>
          </Tabs>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Detail;
