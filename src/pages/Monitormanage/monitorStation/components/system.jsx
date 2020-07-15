import React from 'react';
import { connect } from 'dva';
import { Descriptions, Tabs, Row, Col, Card, Collapse, Skeleton } from 'antd';
import { Bar, StackedArea, Donut, Line } from '@ant-design/charts';
import ProTable from '@ant-design/pro-table';

const { Item } = Descriptions;
const { TabPane } = Tabs;
const { Panel } = Collapse;

@connect(({ hostHistory, loading }) => ({
  hostHistory,
  loading: loading.effects['hostHistory/listHistory'],
}))
class System extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      actionRef: {},
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
          dataIndex: 'parentProcessID',
        },
        {
          title: 'CPU使用率',
          hideInSearch: true,
          dataIndex: 'parentProcessID',
        },
        {
          title: '内存使用率',
          hideInSearch: true,
          dataIndex: 'parentProcessID',
        },
        {
          title: '文件数',
          hideInSearch: true,
          dataIndex: 'parentProcessID',
        },
      ],

      alarmColumns: [
        {
          title: '告警内容',
          hideInSearch: true,
          dataIndex: 'parentProcessID',
        },
        {
          title: '发生时间',
          hideInSearch: true,
          dataIndex: 'parentProcessID',
        },
        {
          title: '告警等级',
          hideInSearch: true,
          dataIndex: 'parentProcessID',
        },
      ],

      cpuConfig: {
        title: {
          visible: true,
          text: 'CPU使用率',
        },
        xField: 'date',
        yField: 'value',
        stackField: 'action',
        xAxis: {
          label: {
            formatter: v => {
              const date = new Date();
              date.setTime(v * 1000);
              return date.toLocaleTimeString();
            },
          },
          tickCount: 6,
        },
        yAxis: {
          label: {
            formatter: v => `${v}%`,
          },
        },
        tooltip: {
          titleField: {
            formatter: v => {
              console.log(v);
              const date = new Date();
              date.setTime(v * 1000);
              return date.toLocaleTimeString();
            },
          },
        },
        legend: {
          visible: false,
        },
      },

      diskAvailableConfig: {
        title: {
          visible: true,
          text: '磁盘使用量',
        },
        forceFit: true,
        xField: 'available',
        yField: 'path',
        colorField: 'path',
        xAxis: {
          visible: false,
          formatter: v => `${v}GB`,
        },
      },

      diskUseConfig: {
        title: {
          visible: true,
          text: '磁盘使用率',
        },
        radius: 0.5,
        angleField: 'value',
        colorField: 'path',
        label: {
          visible: false,
        },
        legend: {
          visible: true,
          position: 'left',
        },
        statistic: {
          visible: false,
        },
      },

      ramUseConfig: {
        title: {
          visible: true,
          text: '内存使用情况',
        },
        xField: 'date',
        yField: 'value',
        stackField: 'action',
        legend: {
          visible: false,
        },
        yAxis: {
          label: {
            formatter: v => `${v}GB`,
          },
        },
      },

      ramConfig: {
        title: {
          visible: true,
          text: '内存使用率',
        },
        xField: 'date',
        yField: 'value',
        yAxis: {
          label: {
            formatter: v => `${v}%`,
          },
        },
      },

      networkConfig: {
        title: {
          visible: true,
          text: '网络流量',
        },
        xField: 'date',
        yField: 'value',
        seriesField: 'action',
        legend: {
          visible: false,
        },
        yAxis: {
          label: {
            formatter: v => `${v}ks/s`,
          },
        },
      },

      ioConfig: {
        title: {
          visible: true,
          text: 'IO读写次数',
        },
        xField: 'date',
        yField: 'value',
        seriesField: 'action',
        legend: {
          visible: false,
        },
        yAxis: {
          label: {
            formatter: v => `${v}req/s`,
          },
        },
      },

      ioRateConfig: {
        title: {
          visible: true,
          text: 'IO读写速率',
        },
        xField: 'date',
        yField: 'value',
        seriesField: 'action',
        legend: {
          visible: false,
        },
        yAxis: {
          label: {
            formatter: v => `${v}ks/s`,
          },
        },
      },

      swapConfig: {
        title: {
          visible: true,
          text: '交换区',
        },
        xField: 'date',
        yField: 'value',
        stackField: 'use',
        yAxis: {
          label: {
            formatter: v => `${v}GB`,
          },
        },
        legend: {
          visible: false,
        },
      },

      cpuWaitIOConfig: {
        title: {
          visible: true,
          text: '当前CPU处在等待IO操作的百分比',
        },
        xField: 'date',
        yField: 'value',
        yAxis: {
          label: {
            formatter: v => `${v}%`,
          },
        },
      },

      systemLoadConfig: {
        title: {
          visible: true,
          text: '系统负载',
        },
        xField: 'date',
        yField: 'value',
        seriesField: 'load',
        legend: {
          visible: false,
        },
      },

      inodesConfig: {
        title: {
          visible: true,
          text: 'inodes使用率',
        },
        xField: 'date',
        yField: 'value',
        yAxis: {
          label: {
            formatter: v => `${v}%`,
          },
        },
      },

      packetsConfig: {
        title: {
          visible: true,
          text: 'Packets',
        },
        xField: 'date',
        yField: 'value',
      },

      tcpConfig: {
        title: {
          visible: true,
          text: '网络-TCP',
        },
        xField: 'date',
        yField: 'value',
        seriesField: 'action',
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
      payload: { hostId: '10314', fromDate: '1594606689', toDate: '1594635827' },
    });
  }

  render() {
    const {
      cpuConfig,
      diskAvailableConfig,
      diskUseConfig,
      ramUseConfig,
      ramConfig,
      networkConfig,
      ioConfig,
      ioRateConfig,
      swapConfig,
      cpuWaitIOConfig,
      systemLoadConfig,
      inodesConfig,
      packetsConfig,
      tcpConfig,
      actionRef,
      processColumns,
      alarmColumns,
    } = this.state;
    const { hostHistory, value } = this.props;
    const {
      cpu,
      diskAvailable,
      diskUse,
      ram,
      ramUse,
      network,
      io,
      swap,
      cpuWaitIO,
      systemLoad,
      inodes,
      packets,
      tcp,
    } = hostHistory.host;

    return (
      <div>
        <Card style={{ marginBottom: 24 }}>
          <Descriptions title="基本信息">
            <Item label="名称">{value.name}</Item>
            <Item label="IP">{value.ip}</Item>
            <Item label="设备类型">主机</Item>
            <Item label="状态">{value.status === 1 ? '在线' : '离线'}</Item>
          </Descriptions>
        </Card>
        <Collapse defaultActiveKey={['1']} expandIconPosition="right" style={{ marginBottom: 24 }}>
          <Panel header="当前告警" key="1" />
        </Collapse>
        <Card>
          <Tabs defaultActiveKey="1">
            <TabPane tab="监控指标" key="1">
              <Skeleton loading={false}>
                <Row>
                  <Col span={6}>
                    <StackedArea {...cpuConfig} data={cpu} />
                  </Col>
                  <Col span={6}>
                    <Bar {...diskAvailableConfig} data={diskAvailable} />
                  </Col>
                  <Col span={6}>
                    <Donut {...diskUseConfig} data={diskUse} />
                  </Col>
                  <Col span={6}>
                    <StackedArea {...ramUseConfig} data={ram} />
                  </Col>
                </Row>
                <Row>
                  <Col span={6}>
                    <Line {...ramConfig} data={ramUse} />
                  </Col>
                  <Col span={6}>
                    <Line {...networkConfig} data={network} />
                  </Col>
                  <Col span={6}>
                    <Line {...ioConfig} data={io} />
                  </Col>
                  <Col span={6}>
                    <Line {...ioRateConfig} data={io} />
                  </Col>
                </Row>
                <Row>
                  <Col span={6}>
                    <StackedArea {...swapConfig} data={swap} />
                  </Col>
                  <Col span={6}>
                    <Line {...cpuWaitIOConfig} data={cpuWaitIO} />
                  </Col>
                  <Col span={6}>
                    <Line {...systemLoadConfig} data={systemLoad} />
                  </Col>
                  <Col span={6}>
                    <Line {...inodesConfig} data={inodes} />
                  </Col>
                </Row>
                <Row>
                  <Col span={6}>
                    <Line {...packetsConfig} data={packets} />
                  </Col>
                  <Col span={6}>
                    <Line {...tcpConfig} data={tcp} />
                  </Col>
                </Row>
              </Skeleton>
            </TabPane>
            <TabPane tab="进程信息" key="2">
              <ProTable actionRef={actionRef} search={false} rowKey="ip" columns={processColumns} />
            </TabPane>
            <TabPane tab="系统信息" key="3">
              <Descriptions title="操作系统" column={1}>
                <Item label="内核">{value.name}</Item>
                <Item label="设备类型">{value.ip}</Item>
                <Item label="内核版本">主机</Item>
                <Item label="构建版本">dd</Item>
                <Item label="主机名称">zj</Item>
                <Item label="硬件平台">zj</Item>
                <Item label="操作系统">zj</Item>
              </Descriptions>
              <Descriptions title="文件系统">
                <Item>
                  rootfs mounted on / 40.0GB /dev/vda1 mounted on / 40.0GB /dev/vdc1 mounted on
                  /data 147.5GB devtmpfs mounted on /dev 15.6GB tmpfs mounted on /dev/shm 15.6GB
                  tmpfs mounted on /run 15.6GB tmpfs mounted on /run/user/0 3.1GB tmpfs mounted on
                  /run/user/1001 3.1GB tmpfs mounted on /sys/fs/cgroup 15.6GB
                </Item>
              </Descriptions>
              <Descriptions title="处理器" column={1}>
                <Item label="逻辑核数">{value.name}</Item>
                <Item label="主频(mhz)">{value.ip}</Item>
                <Item label="缓存大小">主机</Item>
                <Item label="厂商">dd</Item>
                <Item label="型号">zj</Item>
                <Item label="物理核数">zj</Item>
              </Descriptions>
              <Descriptions title="内存" column={1}>
                <Item label="交换分区">{value.name}</Item>
                <Item label="物理内存">{value.ip}</Item>
              </Descriptions>
              <Descriptions title="网络" column={1}>
                <Item label="Name">{value.name}</Item>
                <Item label="MAC">{value.ip}</Item>
                <Item label="IP">主机</Item>
                <Item label="IPv6">dd</Item>
              </Descriptions>
            </TabPane>
            <TabPane tab="历史告警" key="4">
              <ProTable rowKey="id" columns={alarmColumns} search={false} rowSelection={{}} />
            </TabPane>
          </Tabs>
        </Card>
      </div>
    );
  }
}

export default System;
