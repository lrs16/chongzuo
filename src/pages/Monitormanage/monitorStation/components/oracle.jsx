import React from 'react';
import {
  Card,
  Descriptions,
  Collapse,
  Avatar,
  Table,
  Tag,
  Tabs,
  Row,
  Col,
  Typography,
  List,
} from 'antd';
import { LineChart, BarChart, StackedAreaChart, GaugeChart } from 'bizcharts';
// import { zeroFormat } from 'numeral';
// import mockjs from 'mockjs';

const { Item } = Descriptions;
const { Panel } = Collapse;
const { TabPane } = Tabs;

const alertStatus = ['告警', '严重'];

export default () => {
  const tableSpace = {
    title: {
      visible: true,
      text: '表空间增长趋势（GB）',
    },
    xField: 'x',
    yField: 'y',
    seriesField: 'z',
    legend: {
      position: 'bottom-center',
    },
  };

  const tableSpaceData = [
    { x: '2020-07-18', y: 190, z: 'dsdata' },
    { x: '2020-06-18', y: 150, z: 'dsdata' },
    { x: '2020-05-18', y: 170, z: 'dsdata' },
    { x: '2020-06-18', y: 180, z: 'syst' },
    { x: '2020-07-18', y: 180, z: 'syst' },
    { x: '2020-05-18', y: 280, z: 'syst' },
    { x: '2020-06-18', y: 200, z: 'ord' },
    { x: '2020-07-18', y: 210, z: 'ord' },
    { x: '2020-05-18', y: 190, z: 'ord' },
  ];

  const tableSpaceTotal = {
    title: {
      visible: true,
      text: '表空间总大小',
    },
    meta: {
      x: {
        alias: '大小',
        formatter: v => `${v}GB`,
      },
    },
    xField: 'x',
    yField: 'y',
    xAxis: {
      visible: false,
    },
  };

  const tableSpaceTotalData = [
    { x: 55, y: 'user' },
    { x: 40, y: 'admin' },
    { x: 100, y: 'ITSM' },
    { x: 80, y: 'SYSTEM' },
  ];

  const tableSpaceRate = {
    title: {
      visible: true,
      text: '表空间已使用百分比',
    },
    meta: {
      x: {
        alias: '百分比',
        formatter: v => `${v}%`,
      },
    },
    xField: 'x',
    yField: 'y',
    xAxis: {
      visible: false,
    },
  };

  const tableSpaceRateData = [
    { x: 95, y: 'user' },
    { x: 97, y: 'admin' },
    { x: 91, y: 'ITSM' },
    { x: 96, y: 'SYSTEM' },
  ];

  const cpuConfig = {
    title: {
      visible: true,
      text: 'CPU使用率',
    },
    xField: 'x',
    yField: 'y',
    stackField: 'z',
    legend: {
      visible: false,
    },
    yAxis: {
      formatter: val => `${val}%`,
    },
  };

  const cpuData = [
    { x: '2020-07-05', y: 80, z: '未使用' },
    { x: '2020-07-06', y: 70, z: '未使用' },
    { x: '2020-07-07', y: 89, z: '未使用' },
    { x: '2020-07-08', y: 78, z: '未使用' },
    { x: '2020-07-05', y: 20, z: '已使用' },
    { x: '2020-07-06', y: 30, z: '已使用' },
    { x: '2020-07-07', y: 11, z: '已使用' },
    { x: '2020-07-08', y: 22, z: '已使用' },
  ];

  const ioConfig = {
    title: {
      visible: true,
      text: 'IO读写次数',
    },
    meta: {
      y: {
        formatter: val => `${val}req/s`,
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
  };

  const ioData = [
    { x: '10:00', y: 4, z: '0' },
    { x: '15:00', y: 4.5, z: '0' },
    { x: '19:00', y: 5, z: '0' },
    { x: '10:00', y: 3.8, z: '1' },
    { x: '15:00', y: 4, z: '1' },
    { x: '19:00', y: 4.2, z: '1' },
  ];

  const ioRateConfig = {
    title: {
      visible: true,
      text: 'IO读写速率',
    },
    meta: {
      y: {
        formatter: val => `${val}kb/s`,
      },
    },
    xField: 'x',
    yField: 'y',
    seriesField: 'z',
    legend: {
      visible: false,
    },
  };

  const ioRateConfigData = [
    { x: '10:00', y: 300, z: '读' },
    { x: '14:00', y: 350, z: '读' },
    { x: '19:00', y: 400, z: '读' },
    { x: '10:00', y: 200, z: '写' },
    { x: '14:00', y: 230, z: '写' },
    { x: '19:00', y: 300, z: '写' },
  ];

  const ramUseConfig = {
    title: {
      visible: true,
      text: '内存使用情况',
    },
    meta: {
      y: {
        formatter: val => `${val}GB`,
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
    legend: {
      visible: false,
    },
  };

  const ramUseConfigData = [
    { x: '10:00', y: 10, z: 2 },
    { x: '15:00', y: 13, z: 2 },
    { x: '19:00', y: 15, z: 2 },
    { x: '10:00', y: 20, z: 1 },
    { x: '15:00', y: 25, z: 1 },
    { x: '19:00', y: 30, z: 1 },
    { x: '10:00', y: 5, z: 0 },
    { x: '15:00', y: 7, z: 0 },
    { x: '19:00', y: 9, z: 0 },
  ];

  const ramConfig = {
    title: {
      visible: true,
      text: '内存使用率',
    },
    meta: {
      y: {
        alias: '使用率',
        formatter: v => `${v}%`,
      },
    },
    xField: 'x',
    yField: 'y',
  };

  const ramConfigData = [
    { x: '14:00', y: 35 },
    { x: '16:00', y: 40 },
    { x: '19:00', y: 55 },
  ];

  const cattachNumber = {
    title: {
      visible: true,
      text: '当前连接数',
    },
    meta: {
      y: {
        alias: '连接数',
      },
    },
    xField: 'x',
    yField: 'y',
    label: {
      visible: false,
    },
  };

  const cattachNumberData = [
    { x: '14:00', y: 39 },
    { x: '16:00', y: 42 },
    { x: '19:00', y: 55 },
  ];

  const cacheHiRate = {
    title: {
      visible: true,
      text: 'Cache命中率',
    },
    value: 97.93,
    min: 0,
    max: 100,
    range: [0, 20, 40, 60, 80, 100],
    statistic: {
      visible: true,
      text: '97.93%',
    },
  };

  const listData = [
    {
      key: '1',
      alertLevel: 1,
      label: 'oralce',
      alerContent: 'xxx使用率已达到53.0%（最近15分钟 最近值），大于阈值20.0%',
      time: '12-10 09:02:39',
    },
    {
      key: '2',
      alertLevel: 0,
      label: 'oralce',
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

  const alarmColumns = [
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

  const top10 = [
    {
      title: 'Event',
      dataIndex: 'event',
    },
    {
      title: 'Waits',
      dataIndex: 'waits',
    },
    {
      title: 'Total Wait Time(sec)',
      dataIndex: 'totalWaitTime',
    },
    {
      title: 'Wait Avg(ms)',
      dataIndex: 'waitAvg',
    },
    {
      title: '%DB time',
      dataIndex: 'dbTime',
    },
    {
      title: 'Wait Class',
      dataIndex: 'waitClass',
    },
  ];

  const top10Data = [
    {
      event: 'DB CPU',
      waits: '',
      totalWaitTime: '334k',
      waitAvg: '',
      dbTime: '35.0',
      waitClass: '',
    },
    {
      event: 'direct path read',
      waits: '6,813,407',
      totalWaitTime: '33.4k',
      waitAvg: '4.91',
      dbTime: '3.5',
      waitClass: 'User I/O',
    },
    {
      event: 'gc buffer busy release',
      waits: '8,223,025',
      totalWaitTime: '20.0k',
      waitAvg: '1.18',
      dbTime: '1.9',
      waitClass: 'Cluster',
    },
  ];

  const topSql = [
    {
      title: 'Elapsed Time(s)',
      dataIndex: 'elapsedTime',
    },
    {
      title: 'Execution',
      dataIndex: 'execution',
    },
    {
      title: 'Elapsed Time per Exec(s)',
      dataIndex: 'perExec',
    },
    {
      title: '%Total',
      dataIndex: 'total',
    },
    {
      title: '%CPU',
      dataIndex: 'cpu',
    },
    {
      title: '%IO',
      dataIndex: 'io',
    },
    {
      title: 'SQL Id',
      dataIndex: 'sqlId',
    },
    {
      title: 'SQL Module',
      dataIndex: 'sqlModule',
    },
    {
      title: 'SQL Text',
      dataIndex: 'sqlText',
    },
  ];

  const topSqlData = [
    {
      elapsedTime: '15,855.10',
      execution: '55,066',
      perExec: '0.29',
      total: '1.64',
      cpu: '99.84',
      io: '0.00',
      sqlId: 'aynj7rgx1sxu3',
      sqlModule: 'JDBC Thin client',
      sqlText: '',
    },
    {
      elapsedTime: '12,838.61',
      execution: '19',
      perExec: '675.72',
      total: '1.33',
      cpu: '18.72',
      io: '72.80',
      sqlId: '57y1ttfzqvj3z6y9',
      sqlModule: 'JDBC Thin client',
      sqlText: '',
    },
  ];

  const sqlTime = [
    'Resources reported for PL/SOL code includes the resources used by all SOL statements called by the code',
    '％Total DB Time is the Elapsed Time of the SOL statement divided into the Total Database Time multiplied by 100',
    '％Total-Elapsed Time as a percentage of Total DB time',
    '%CPU. CPU Time as a percentage of Elapsed Time',
    '%IO-Use I/O Time as a  percentage  of Elapsed Time',
    'Captured SQL account for 45. 1% of Total DB Time (s) : 965, 518',
    'Captured PL/SQL account for 13. 8% of Total DB Time (s) : 965, 518',
  ];

  const parallelSql = [
    '33a8xs47c8vth',
    "merge /*+ parallel(16) */ into CJ_DYDLQX szqx using (select /*+ parallel(16) */ zb.id, zb.gddwbh, sjz.fssj DATA_TIME, zb.dnbbs, zb.zdzcbh, zb.cldh, zb.zddz , sjz.gxsj, zb.yxdnbbs, case when axdlzzt <128 then sjz.axdlz else null end axdlz , case when axdyzzt <128 then sjz.axdyz else null end axdyz , case when bxdlzzt <128 then sjz.bxdlz else null end bxdlz, case when bxdyzzt <128 then sjz.bxdyz else null end bxdyz , case when cxdlzzt <128 then sjz.cxdlz else null end cxdlz , case when cxdyzzt <128 then sjz.cxdyz else null end cxdyz from cj_gk_yc sjz, kh_cldzb zb, sb_yxzd zd where sjz.dbbh=zb.id and gxsj>=sysdate-2/24 and zd.zddz=zb.zddz and zd.gybbh='46' and zb.gddwbh is not null) BB on (bb.id=szqx.id and bb.data_time=szqx.sjs j and bb.gddwbh=szqx.gddwbm ) when matched then update set szqx.dnbzcbs=bb.dnbbs, szqx.yxdnbbs=bb.yxdnbbs, szqx.zddz =bb.zddz, szqx.qzjssj=bb.gxsj, szqx.cldh =bb.cldh, szqx.zdzcbh =bb.zdzcbh, szqx.ady=bb.axdyz, szqx.adl=bb.axdlz, szqx.bdy=bb.bxdyz, szqx.bdl=bb.bxdlz, szqx.cdy=bb.cxdyz, szqx.cdl=bb.cxdlz when not matched then insert ( szqx.id, szqx.yxdnbbs, szqx.sjsj, szqx.gddwbm, szqx.dnbzcbs, szqx.zddz , szqx.qzjssj, szqx.cldh, szqx.zdzcbh, szqx.ady, szqx.adl, szqx.bdy, szqx.bdl, szqx.cdy, szqx.cdl, szqx.sjlydm) VALUES ( bb.id, bb.yxdnbbs, bb.D ATA_TIME, bb.gddwbh, bb.dnbbs, bb.zddz, bb.gxsj, bb.cldh, bb.zdzcbh, bb.axdyz, bb.axdlz, bb.bxdyz, bb.bxdlz, bb.cxdyz, bb.cxdlz, 1)",
    'c0nks3ushp452',
    "merge /*+ parallel(16) */ into cj_glqx szqx using (select /*+ parallel(16) */ zb.id, zb.gddwbh, sjz.fssj DATA_TIME, zb.dnbbs, zb.zdzcbh, zb.cldh, zb.zddz , sjz.gxsj, zb.yxdnbbs, case when ygglzzt <128 then sjz.ygglz else null end ygglz , case when axygglzzt <128 then sjz.axygglz else null end axygglz, case when bxygglzzt <128 then sjz.bxygglz else null end bxygglz, case when cxygglzzt <128 then sjz.cxygglz else null end cxygglz, case when wgglzzt <128 then sjz.wgglz else null end wgglz, case when axwgglzzt <128 then sjz.axwgglz else null end axwgglz, case when bxwgglzzt <128 then sjz.bxwgglz else null end bxwgglz , case when cxwgglzzt <128 then sjz.cxwgglz else null end cxwgglz, case when glyszt <128 then sjz.gl ys else null end glys, case when axglysysz <128 then sjz.axglys else null end axglys, case when bxglysysz <128 then sjz.bxglys else null end bxglys , case when cxglysysz <128 then sjz.cxglys else null end cxglys from cj_gk_yc sjz, kh_cldzb zb, sb_yxzd zd where sjz.dbbh=zb.id and gxsj>=sysdate-2/24 and zd.zddz=zb.zddz and zd.gybbh='46' and zb.gddwbh is not null) BB on (bb.id=szqx.id and bb.data_time=szqx.sjsj and bb.gddwbh=szqx.gddwbm ) when matched then update set szqx.dnbzcbs=bb.dnbbs, szqx.yxdnbbs=bb.yxdnbbs, szqx.zddz =bb.zddz, szqx.qzjssj=bb.gxsj, szqx.cldh =bb.cldh, szqx.zdzcbh =bb.zdzcbh, szqx.zyggl=bb.ygglz, szqx.azxyg=bb.axygglz, szqx.bzxyg=bb.bxygglz, szqx.czxyg=bb.cxygglz, szqx.zwggl=bb.wgglz, szqx.azxwg=bb.axwg glz, szqx.bzxwg=bb.bxwgglz, szqx.czxwg=bb.cxwgglz, szqx.glys=bb.glys, szqx.aglys=bb.axglys, szqx.bglys=bb.bxglys, szqx.cglys=bb.cxglys when not matched then insert ( szqx.id, szqx.yxdnbbs, szqx.sjsj, szqx.gddwbm, szqx.dnbzcbs, szqx.zddz , szqx.qzjssj, szqx.cldh, szqx.zdzcbh, szqx.zyggl, szqx.azxyg, szqx.bzxyg, szqx.czxyg, szqx.zwggl, szqx.azxwg, szqx.bzxwg, szqx.czxwg, szqx.glys, szqx.aglys, szqx.bglys, szqx.cglys, szqx.sjlydm) VALUES ( bb.id, bb.yxdnbbs, bb.DATA_TIME, bb.gddwbh, bb.dnbbs, bb.zddz, bb. gxsj, bb.cldh, bb.zdzcbh, bb.ygglz, bb.axygglz, bb.bxygglz, bb.cxygglz, bb.wgglz, bb.axglys, bb.bxwgglz, bb.cxwgglz, bb.glys, bb.axglys, bb.bxglys, bb.cxglys, 5)",
  ];

  return (
    <div>
      <Card style={{ marginBottom: 24 }}>
        <Descriptions title="基本信息">
          <Item label="名称">xx操作系统</Item>
          <Item label="IP">192.168.1.0</Item>
          <Item label="数据库类型">Oracle</Item>
          <Item label="数据库版本">
            Oracle Database 11g Enterprise Edition Heiease 11.2.0.1.0-64bit Production
          </Item>
          <Item label="状态">
            <font color="green">在线</font>
          </Item>
          <Item label="锁表数量">8个</Item>
          <Item label="运行时长">35天17小时26分钟13秒</Item>
        </Descriptions>
      </Card>
      <Collapse bordered={false} expandIconPosition="right">
        <Panel key="1" header="告警信息">
          <Table showHeader={false} pagination={false} columns={columns} dataSource={listData} />
        </Panel>
      </Collapse>
      <Card style={{ marginTop: 24 }}>
        <Tabs defaultActiveKey="1">
          <TabPane key="1" tab="监控指标">
            <Row>
              <Col span={8}>
                <LineChart {...tableSpace} data={tableSpaceData} />
              </Col>
              <Col span={8}>
                <BarChart {...tableSpaceTotal} data={tableSpaceTotalData} />
              </Col>
              <Col span={8}>
                <BarChart {...tableSpaceRate} data={tableSpaceRateData} />
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <StackedAreaChart {...cpuConfig} data={cpuData} />
              </Col>
              <Col span={6}>
                <LineChart {...ioConfig} data={ioData} />
              </Col>
              <Col span={6}>
                <LineChart {...ioRateConfig} data={ioRateConfigData} />
              </Col>
              <Col span={6}>
                <StackedAreaChart {...ramUseConfig} data={ramUseConfigData} />
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <LineChart {...ramConfig} data={ramConfigData} />
              </Col>
              <Col span={6}>
                <LineChart {...cattachNumber} data={cattachNumberData} />
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <GaugeChart {...cacheHiRate} />
              </Col>
            </Row>
          </TabPane>
          <TabPane key="2" tab="性能分析">
            <Card title="TOP10等待事件" style={{ marginTop: 24 }}>
              <Table columns={top10} dataSource={top10Data} />
            </Card>
            <Card title="TOP SQL语句" style={{ marginTop: 24 }}>
              <Typography>
                <Typography.Title level={4}>SQL ordered by Elapsed Time</Typography.Title>
                <Typography.Paragraph>
                  <ul>
                    {sqlTime.map(val => (
                      <li>{val}</li>
                    ))}
                  </ul>
                </Typography.Paragraph>
              </Typography>
              <Table columns={topSql} dataSource={topSqlData} />
            </Card>
            <Card title="业务并行sql语句查询" style={{ marginTop: 24 }}>
              <List
                grid={{ column: 2 }}
                dataSource={parallelSql}
                renderItem={item => <List.Item>{item}</List.Item>}
              />
            </Card>
          </TabPane>
          <TabPane key="3" tab="历史告警">
            <Table Key="id" columns={alarmColumns} dataSource={alertList} />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};
