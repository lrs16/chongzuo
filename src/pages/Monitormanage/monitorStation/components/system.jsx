import React from 'react';
import { Descriptions, Tabs, Row, Col, Card } from 'antd';
import { Bar, StackedArea } from '@ant-design/charts';

const { Item } = Descriptions;
const { TabPane } = Tabs;

export default () => {
  const data = [
    { year: '1991', value: 3, country: '已使用' },
    { year: '1992', value: 4, country: '已使用' },
    { year: '1993', value: 3.5, country: '已使用' },
    { year: '1994', value: 5, country: '已使用' },
    { year: '1995', value: 4.9, country: '已使用' },
    { year: '1991', value: 3, country: '未使用' },
    { year: '1992', value: 3, country: '未使用' },
    { year: '1993', value: 4, country: '未使用' },
    { year: '1994', value: 7, country: '未使用' },
    { year: '1995', value: 5, country: '未使用' },
  ];

  const areaConfig = {
    title: {
      visible: true,
      text: '基础面积图',
    },
    data,
    xField: 'year',
    yField: 'value',
    stackField: 'country',
    color: ['#6897a7', '#8bc0d6'],
    // xAxis: {
    //     type: 'dateTime',
    //     tickCount: 5,
    // },
    // width: 200,
    height: 300,
    label: {
      visible: true,
      type: 'area',
      autoScale: true,
    },
    legend: {
      visible: true,
      position: 'right-top',
    },
    responsive: true,
  };

  const barData = [
    {
      device: 'device:/data',
      used: 6,
    },
    {
      device: 'device:/dev',
      used: 96,
    },
    {
      device: 'device:/num',
      used: 30,
    },
    {
      device: 'device:/run',
      used: 50,
    },
  ];
  const barConfig = {
    title: {
      visible: true,
      text: '基础条形图',
    },
    forceFit: true,
    data: barData,
    xField: 'used',
    yField: 'device',
    label: {
      visible: true,
      formatter: v => `${v}G`,
    },
  };

  return (
    <Card>
      <Descriptions title="基本信息">
        <Item label="名称">xx操作系统</Item>
        <Item label="IP">192.168.1.0</Item>
        <Item label="设备类型">普通服务器</Item>
        <Item label="状态">在线</Item>
      </Descriptions>
      <Tabs defaultActiveKey="1">
        <TabPane tab="监控指标" key="1">
          <Row>
            <Col span={12}>
              <StackedArea {...areaConfig} />
            </Col>
            <Col span={12}>
              <Bar {...barConfig} />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Bar {...barConfig} />
            </Col>
          </Row>
        </TabPane>
        <TabPane tab="进程信息" key="2">
          <h1>进程信息</h1>
        </TabPane>
      </Tabs>
    </Card>
  );
};
