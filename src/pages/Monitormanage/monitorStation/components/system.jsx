import React from 'react';
import { connect } from 'dva';
import {
  Descriptions,
  Tabs,
  Row,
  Col,
  Card,
  Collapse,
  Skeleton,
  Tag,
  // Dropdown,
  // Button,
  // Icon,
  // Menu,
  // Select,
  Table,
  // Badge,
  Avatar,
} from 'antd';
// import { Bar, StackedArea, Donut } from '@ant-design/charts';
// import ProTable from '@ant-design/pro-table';
import { LineChart, StackedAreaChart } from 'bizcharts';
// import StackedAreas from './StackedArea';
import moment from 'moment';

const { Item } = Descriptions;
const { TabPane } = Tabs;
const { Panel } = Collapse;

const alertStatus = ['告警', '严重'];

@connect(({ hostHistory, loading }) => ({
  hostHistory,
  loading: loading.effects['hostHistory/listHistory'],
}))
class System extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // actionRef: {},
      processColumns: [
        {
          title: '进程名',
          hideInSearch: true,
          dataIndex: 'processName',
        },
        {
          title: '进程ID',
          hideInSearch: true,
          dataIndex: 'processID',
        },
        {
          title: '父进程ID',
          hideInSearch: true,
          dataIndex: 'parentProcessID',
        },
        {
          title: '线程数',
          hideInSearch: true,
          dataIndex: 'processNumber',
        },
        {
          title: 'CPU使用率',
          hideInSearch: true,
          dataIndex: 'cpuUsage',
        },
        {
          title: '内存使用率',
          hideInSearch: true,
          dataIndex: 'memoryUsage',
        },
        {
          title: '文件数',
          hideInSearch: true,
          dataIndex: 'filesNumber',
        },
      ],

      alarmColumns: [
        {
          title: '告警内容',
          hideInSearch: true,
          dataIndex: 'alertContent',
        },
        {
          title: '发生时间',
          hideInSearch: true,
          dataIndex: 'alertTime',
        },
        {
          title: '告警等级',
          hideInSearch: true,
          dataIndex: 'alertLevel',
          render: val => (
            <span>
              <font color={val === 0 ? 'yellow' : 'red'}>{alertStatus[val]} </font>
            </span>
          ),
        },
      ],

      cpuConfig: {
        title: {
          visible: true,
          text: 'CPU使用率',
        },
        meta: {
          x: {
            // type: 'linear',
            // tickCount: 5,
            formatter: v => moment(v).format('HH:mm:ss'),
            // const date = new Date(v + 8 * 3600 * 1000);
            // return date.toJSON().substr(0, 19).replace('T', ' ').replace(/-/g, '.');
          },
          y: {
            formatter: v => `${v}%`,
          },
          z: {
            nice: true,
            type: 'cat',
            // range: [0,1],
            formatter: val => (val === 0 ? '未使用' : '已使用'),
          },
        },
        xField: 'x',
        yField: 'y',
        stackField: 'z',
        legend: {
          visible: false,
        },
      },

      // diskAvailableConfig: {
      //   title: {
      //     visible: true,
      //     text: '磁盘使用量',
      //   },
      //   forceFit: true,
      //   xField: 'available',
      //   yField: 'path',
      //   colorField: 'path',
      //   xAxis: {
      //     visible: false,
      //     formatter: v => `${v}GB`,
      //   },
      // },

      // diskUseConfig: {
      //   title: {
      //     visible: true,
      //     text: '磁盘使用率',
      //   },
      //   radius: 0.5,
      //   angleField: 'value',
      //   colorField: 'path',
      //   label: {
      //     visible: false,
      //   },
      //   legend: {
      //     visible: true,
      //     position: 'left',
      //   },
      //   statistic: {
      //     visible: false,
      //   },
      // },

      ramUseConfig: {
        title: {
          visible: true,
          text: '内存使用情况',
        },
        meta: {
          x: {
            formatter: v => moment(v).format('HH:mm:ss'),
          },
          y: {
            formatter: val => `${parseFloat(val / 1024 / 1024 / 1014).toFixed(2)}GB`,
          },
          z: {
            type: 'cat',
            formatter: val => {
              let zval;
              switch (val) {
                case 0:
                  zval = '未使用';
                  break;
                case 1:
                  zval = '已使用';
                  break;
                case 2:
                  zval = '未分配';
                  break;
                default:
                  break;
              }
              return zval;
            },
          },
        },
        xField: 'x',
        yField: 'y',
        stackField: 'z',
        // xAxis: {
        //   tickCount: 5,
        // },
        legend: {
          visible: false,
        },
      },

      ramConfig: {
        forceFit: false,
        title: {
          visible: true,
          text: '内存使用率',
        },
        meta: {
          x: {
            type: 'timeCat',
            // tickCount: 2,
            tickInterval: 30,
            // tickLine: 30,
            formatter: v => {
              return moment(v).format('HH:mm:ss');
            },
          },
          y: {
            alias: '使用率',
            formatter: v => `${v}%`,
          },
        },
        xField: 'x',
        yField: 'y',
      },

      networkConfig: {
        title: {
          visible: true,
          text: '网络流量',
        },
        meta: {
          x: {
            formatter: v => {
              return moment(v).format('HH:mm:ss');
            },
          },
          y: {
            formatter: v => `${v}ks/s`,
          },
          z: {
            type: 'cat',
            formatter: val => (val === 0 ? '接收' : '发送'),
          },
        },
        xField: 'x',
        yField: 'y',
        seriesField: 'z',
        legend: {
          visible: false,
        },
      },

      ioConfig: {
        title: {
          visible: true,
          text: 'IO读写次数',
        },
        meta: {
          x: {
            formatter: v => {
              return moment(v).format('HH:mm:ss');
            },
          },
          y: {
            formatter: v => `${v}req/s`,
          },
          z: {
            type: 'cat',
            formatter: val => (val === 1 ? '写' : '读'),
          },
        },
        xField: 'x',
        yField: 'y',
        seriesField: 'z',
        legend: {
          visible: false,
        },
      },

      ioRateConfig: {
        title: {
          visible: true,
          text: 'IO读写速率',
        },
        meta: {
          x: {
            formatter: v => {
              return moment(v).format('HH:mm:ss');
            },
          },
          y: {
            formatter: v => `${v}ks/s`,
          },
          z: {
            type: 'cat',
            formatter: val => (val === 0 ? '读' : '写'),
          },
        },
        xField: 'x',
        yField: 'y',
        seriesField: 'z',
        legend: {
          visible: false,
        },
      },

      swapConfig: {
        title: {
          visible: true,
          text: '交换区',
        },
        meta: {
          x: {
            tickCount: 5,
            formatter: v => moment(v).format('HH:mm:ss'),
          },
          y: {
            formatter: val => `${parseFloat(val / 1024 / 1024 / 1014).toFixed(2)}GB`,
          },
          z: {
            type: 'cat',
            formatter: val => (val === 0 ? '空闲' : '已使用'),
          },
        },
        xField: 'x',
        yField: 'y',
        stackField: 'z',
        legend: {
          visible: false,
        },
      },

      cpuWaitIOConfig: {
        title: {
          visible: true,
          text: '当前CPU处在等待IO操作的百分比',
        },
        meta: {
          x: {
            formatter: v => moment(v).format('HH:mm:ss'),
          },
          y: {
            alias: 'IO',
            formatter: v => `${v}%`,
          },
        },
        xField: 'x',
        yField: 'y',
      },

      // systemLoadConfig: {
      //   title: {
      //     visible: true,
      //     text: '系统负载',
      //   },
      //   meta: {
      //     x: {
      //       formatter: val => moment(val).format('HH:mm:ss'),
      //     },
      //     y: {
      //       formatter: val => `${parseFloat(val).toFixed(2)}`,
      //     },
      //     z: {
      //       type: 'cat',
      //       formatter: val => {
      //         let zval;
      //         switch (val) {
      //           case 1:
      //             zval = '1min';
      //             break;
      //           case 2:
      //             zval = '5min';
      //             break;
      //           case 3:
      //             zval = '15min';
      //             break;
      //           default:
      //             break;
      //         }
      //         return zval;
      //       },
      //     },
      //   },
      //   xField: 'x',
      //   yField: 'y ',
      //   seriesField: 'z',
      //   legend: {
      //     visible: false,
      //   },
      // },

      // inodesConfig: {
      //   title: {
      //     visible: true,
      //     text: 'inodes使用率',
      //   },
      //   xField: 'date',
      //   yField: 'value',
      //   yAxis: {
      //     label: {
      //       formatter: v => `${v}%`,
      //     },
      //   },
      // },

      packetsConfig: {
        title: {
          visible: true,
          text: 'Packets',
        },
        meta: {
          x: {
            formatter: val => moment(val).format('HH:mm:ss'),
          },
          z: {
            type: 'cat',
            formatter: val => (val === 0 ? '接收' : '发送'),
          },
        },
        xField: 'x',
        yField: 'y',
        seriesField: 'z',
        legend: {
          visible: false,
        },
      },

      tcpConfig: {
        title: {
          visible: true,
          text: '网络-TCP',
        },
        meta: {
          x: {
            formatter: val => moment(val).format('HH:mm:ss'),
          },
          z: {
            type: 'cat',
            formatter: val => (val === 0 ? '接收' : '发送'),
          },
        },
        xField: 'x',
        yField: 'y',
        seriesField: 'z',
        legend: {
          visible: false,
        },
      },
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'hostHistory/listHistory',
      payload: { hostId: '10314', fromDate: '1595989911', toDate: '1596076311' },
    });
    dispatch({
      type: 'hostHistory/fetchSystemInfo',
      payload: { hostId: '10314' },
    });
  }

  render() {
    const {
      cpuConfig,
      // diskAvailableConfig,
      // diskUseConfig,
      ramUseConfig,
      ramConfig,
      networkConfig,
      ioConfig,
      ioRateConfig,
      swapConfig,
      cpuWaitIOConfig,
      // systemLoadConfig,
      // inodesConfig,
      packetsConfig,
      tcpConfig,
      // actionRef,
      processColumns,
      alarmColumns,
    } = this.state;

    const { hostHistory, value } = this.props;
    const {
      cpu,
      // diskAvailable,
      // diskUse,
      ram,
      ramUse,
      network,
      ioNumber,
      ioRate,
      swap,
      cpuWaitIO,
      // systemLoad,
      // inodes,
      packets,
      tcp,
    } = hostHistory.host;

    const systemInfo = hostHistory;

    const listData = [
      {
        key: '1',
        alertLevel: 1,
        label: 'system',
        alerContent: 'xxx使用率已达到53.0%（最近15分钟 最近值），大于阈值20.0%',
        time: '12-10 09:02:39',
      },
      {
        key: '2',
        alertLevel: 0,
        label: 'system',
        alerContent: 'xxx使用率已达到53.0%（最近15分钟 最近值），大于阈值20.0%',
        time: '12-10 09:02:39',
      },
    ];
    const columns = [
      {
        dataIndex: 'alertLevel',
        render: val => (
          <span>
            <font color={val === 0 ? 'yellow' : 'red'}>{alertStatus[val]} </font>
            <Avatar style={{ backgroundColor: val === 0 ? 'yellow' : 'red' }} size="small" />
          </span>
        ),
      },
      {
        dataIndex: 'label',
        render: val => (
          <span>
            <Tag style={{ marginBottom: 2, marginTop: 2 }}>{val}</Tag>
          </span>
        ),
      },
      { dataIndex: 'alerContent' },
      { dataIndex: 'time' },
    ];

    const processList = [
      {
        processName: 'init',
        processID: '55',
        parentProcessID: '0',
        processNumber: '3',
        cpuUsage: '5%',
        memoryUsage: '10%',
        filesNumber: 1,
      },
      {
        processName: 'bash',
        processID: '55',
        parentProcessID: '0',
        processNumber: '5',
        cpuUsage: '10%',
        memoryUsage: '15%',
        filesNumber: 1,
      },
      {
        processName: 'top',
        processID: '55',
        parentProcessID: '0',
        processNumber: '3',
        cpuUsage: '5%',
        memoryUsage: '10%',
        filesNumber: 1,
      },
      {
        processName: 'wininit.exe',
        processID: '55',
        parentProcessID: '0',
        processNumber: '3',
        cpuUsage: '5%',
        memoryUsage: '10%',
        filesNumber: 1,
      },
      {
        processName: 'wininit.exe',
        processID: '55',
        parentProcessID: '0',
        processNumber: '3',
        cpuUsage: '5%',
        memoryUsage: '10%',
        filesNumber: 1,
      },
      {
        processName: 'wininit.exe',
        processID: '55',
        parentProcessID: '0',
        processNumber: '3',
        cpuUsage: '5%',
        memoryUsage: '10%',
        filesNumber: 1,
      },
    ];

    const alertList = [
      {
        alertContent: 'XXX磁盘使用率已达到53.0%（最近15分钟 最近值），大于阈值20.0%',
        alertTime: '2020-07-18',
        alertLevel: 1,
      },
      {
        alertContent: 'XXX磁盘使用率已达到53.0%（最近15分钟 最近值），大于阈值20.0%',
        alertTime: '2020-07-18',
        alertLevel: 1,
      },
      {
        alertContent: 'XXX磁盘使用率已达到53.0%（最近15分钟 最近值），大于阈值90.0%',
        alertTime: '2020-07-18',
        alertLevel: 0,
      },
      {
        alertContent: 'XXX磁盘使用率已达到53.0%（最近15分钟 最近值），大于阈值80.0%',
        alertTime: '2020-07-18',
        alertLevel: 1,
      },
      {
        alertContent: 'XXX磁盘使用率已达到53.0%（最近15分钟 最近值），大于阈值98.0%',
        alertTime: '2020-07-18',
        alertLevel: 0,
      },
    ];

    return (
      <div>
        <Card style={{ marginBottom: 24 }}>
          <Descriptions title="基本信息">
            <Item label="名称">{value.name}</Item>
            <Item label="IP">{value.ip}</Item>
            <Item label="设备类型">主机</Item>
            <Item label="状态">
              {value.status === 1 ? <font color="green">在线</font> : '离线'}
            </Item>
          </Descriptions>
        </Card>
        <Collapse bordered={false} expandIconPosition="right">
          <Panel key="1" header="告警信息">
            <Table showHeader={false} pagination={false} columns={columns} dataSource={listData} />
          </Panel>
        </Collapse>
        <Card style={{ marginTop: 24 }}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="监控指标" key="1">
              <Skeleton loading={false}>
                {/* <Dropdown overlay={dmenu} trigger={['click']} getPopupContainer={triggerNode => triggerNode.parentElement}>
                  <Button>
                    Action <Icon type="down"/>
                  </Button>
                </Dropdown>
                <Select 
                  dropdownRender={men => (
                    <div>
                      {men}
                    </div>
                  )}
                ></Select> */}
                <Row>
                  <Col span={8}>
                    <StackedAreaChart {...cpuConfig} data={cpu} />
                  </Col>
                  <Col span={8}>
                    <LineChart {...ramConfig} data={ramUse} />
                  </Col>
                  <Col span={8}>
                    <StackedAreaChart {...ramUseConfig} data={ram} />
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <LineChart {...networkConfig} data={network} />
                  </Col>
                  <Col span={8}>
                    <LineChart {...ioConfig} data={ioNumber} />
                  </Col>
                  <Col span={8}>
                    <LineChart {...ioRateConfig} data={ioRate} />
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <StackedAreaChart {...swapConfig} data={swap} />
                  </Col>
                  <Col span={8}>
                    <LineChart {...cpuWaitIOConfig} data={cpuWaitIO} />
                  </Col>
                  <Col span={8}>
                    <LineChart {...packetsConfig} data={packets} />
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <LineChart {...tcpConfig} data={tcp} />
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    {/* <StackedArea {...cpuConfig} data={cpu} /> */}
                    {/* <StackedAreas 
                      title='CPU使用率' 
                      height={250} 
                      x={val => `${parseInt(val,0)}%`}
                      y={val => val === 0 ? '未使用' : '已使用'} 
                      data={cpu} 
                    /> */}
                  </Col>
                  <Col span={8}>{/* <Bar {...diskAvailableConfig} data={diskAvailable} /> */}</Col>
                  <Col span={8}>{/* <Donut {...diskUseConfig} data={diskUse} /> */}</Col>
                </Row>
                <Row>
                  <Col span={8}>{/* <StackedArea {...ramUseConfig} data={ram} /> */}</Col>
                  <Col span={6}>{/* <Line {...ramConfig} data={ramUse} /> */}</Col>
                  <Col span={6}>{/* <Line {...networkConfig} data={network} /> */}</Col>
                  <Col span={6}>{/* <Line {...ioConfig} data={io} /> */}</Col>
                  <Col span={6}>{/* <Line {...ioRateConfig} data={io} /> */}</Col>
                </Row>
                <Row>
                  <Col span={6}>{/* <StackedArea {...swapConfig} data={swap} /> */}</Col>
                  <Col span={6}>{/* <Line {...cpuWaitIOConfig} data={cpuWaitIO} /> */}</Col>
                  <Col span={6}>{/* <Line {...systemLoadConfig} data={systemLoad} /> */}</Col>
                  <Col span={6}>{/* <Line {...inodesConfig} data={inodes} /> */}</Col>
                </Row>
                <Row>
                  <Col span={6}>{/* <Line {...packetsConfig} data={packets} /> */}</Col>
                  <Col span={6}>{/* <Line {...tcpConfig} data={tcp} /> */}</Col>
                </Row>
              </Skeleton>
            </TabPane>
            <TabPane tab="进程信息" key="2">
              <Table Key="id" columns={processColumns} dataSource={processList} />
            </TabPane>
            <TabPane tab="系统信息" key="3">
              <Descriptions title="操作系统" column={1}>
                <Item label="内核">{systemInfo.kernel}</Item>
                <Item label="设备类型">{systemInfo.deviceType}</Item>
                <Item label="内核版本">{systemInfo.kernelVersion}</Item>
                <Item label="构建版本">{systemInfo.buildVersion}</Item>
                <Item label="主机名称">{systemInfo.hostName}</Item>
                <Item label="硬件平台">{systemInfo.hardwarePlatform}</Item>
                <Item label="操作系统">{systemInfo.operatingSystem}</Item>
              </Descriptions>
              <Descriptions title="文件系统">
                <Item>{systemInfo.fileSystem}</Item>
              </Descriptions>
              <Descriptions title="处理器" column={1}>
                <Item label="逻辑核数">{systemInfo.logicalCore}</Item>
                <Item label="主频(mhz)">{systemInfo.mhz}</Item>
                <Item label="缓存大小">{systemInfo.cacheSize}</Item>
                <Item label="厂商">{systemInfo.cpuVendor}</Item>
                <Item label="型号">{systemInfo.cpuModel}</Item>
                <Item label="物理核数">{systemInfo.physicalCore}</Item>
              </Descriptions>
              <Descriptions title="内存" column={1}>
                <Item label="交换分区">{systemInfo.swap}</Item>
                <Item label="物理内存">{systemInfo.ram}</Item>
              </Descriptions>
              <Descriptions title="网络" column={1}>
                <Item label="Name">{systemInfo.networkName}</Item>
                <Item label="MAC">{systemInfo.mac}</Item>
                <Item label="IP">{systemInfo.ip}</Item>
                <Item label="IPv6">{systemInfo.ipv6}</Item>
              </Descriptions>
            </TabPane>
            <TabPane tab="历史告警" key="4">
              <Table Key="id" columns={alarmColumns} dataSource={alertList} />
            </TabPane>
          </Tabs>
        </Card>
      </div>
    );
  }
}

export default System;
