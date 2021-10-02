import React, { useState } from 'react';
// import { connect } from 'dva';
import { Card, Row, Col, Avatar, Empty } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StatistCycle from '../components/StatistCycle'; // 统计周期
import StatisticsCard from '../components/StatisticsCard';
import SmoothLine from '@/components/CustomizeCharts/SmoothLine';
import DonutPCT from '@/components/CustomizeCharts/DonutPCT';
import Cylinder from '@/components/CustomizeCharts/Cylinder';
import { ChartCard } from '@/components/Charts';

const cols = {
  rate: {
    // alias: '%',
    // tickCount: 10,
  },
};

// 饼图数据
const Donutdata = [
  { type: '未开发', value: 130 },
  { type: '已开发', value: 662 },
  { type: '已开发未发布', value: 649 },
  { type: '已发布', value: 200 },
];

const Smoothdata = [
  {
    "date": "2021-09-01",
    "name": "终端在线和入库",
    "value": 0
  },
  {
    "date": "2021-09-02",
    "name": "终端在线和入库",
    "value": 0
  },
  {
    "date": "2021-09-03",
    "name": "终端在线和入库",
    "value": 0
  },
  {
    "date": "2021-09-04",
    "name": "终端在线和入库",
    "value": 0
  },
  {
    "date": "2021-09-05",
    "name": "终端在线和入库",
    "value": 0
  },
  {
    "date": "2021-09-06",
    "name": "终端在线和入库",
    "value": 0
  },
  {
    "date": "2021-09-07",
    "name": "终端在线和入库",
    "value": 0
  },
  {
    "date": "2021-09-08",
    "name": "终端在线和入库",
    "value": 0
  },
  {
    "date": "2021-09-09",
    "name": "终端在线和入库",
    "value": 0
  },
  {
    "date": "2021-09-10",
    "name": "终端在线和入库",
    "value": 0
  },
  {
    "date": "2021-09-11",
    "name": "终端在线和入库",
    "value": 0
  },
  {
    "date": "2021-09-12",
    "name": "终端在线和入库",
    "value": 0
  },
  {
    "date": "2021-09-13",
    "name": "终端在线和入库",
    "value": 0
  },
  {
    "date": "2021-09-14",
    "name": "终端在线和入库",
    "value": 1
  },
  {
    "date": "2021-09-15",
    "name": "终端在线和入库",
    "value": 0
  },
  {
    "date": "2021-09-16",
    "name": "终端在线和入库",
    "value": 0
  },
  {
    "date": "2021-09-17",
    "name": "终端在线和入库",
    "value": 0
  },
  {
    "date": "2021-09-18",
    "name": "终端在线和入库",
    "value": 0
  },
  {
    "date": "2021-09-19",
    "name": "终端在线和入库",
    "value": 0
  },
  {
    "date": "2021-09-20",
    "name": "终端在线和入库",
    "value": 0
  },
  {
    "date": "2021-09-21",
    "name": "终端在线和入库",
    "value": 0
  },
  {
    "date": "2021-09-22",
    "name": "终端在线和入库",
    "value": 0
  },
  {
    "date": "2021-09-23",
    "name": "终端在线和入库",
    "value": 0
  },
  {
    "date": "2021-09-24",
    "name": "终端在线和入库",
    "value": 0
  },
  {
    "date": "2021-09-01",
    "name": "业务指标",
    "value": 0
  },
  {
    "date": "2021-09-02",
    "name": "业务指标",
    "value": 0
  },
  {
    "date": "2021-09-03",
    "name": "业务指标",
    "value": 0
  },
  {
    "date": "2021-09-04",
    "name": "业务指标",
    "value": 0
  },
  {
    "date": "2021-09-05",
    "name": "业务指标",
    "value": 0
  },
  {
    "date": "2021-09-06",
    "name": "业务指标",
    "value": 0
  },
  {
    "date": "2021-09-07",
    "name": "业务指标",
    "value": 0
  },
  {
    "date": "2021-09-08",
    "name": "业务指标",
    "value": 0
  },
  {
    "date": "2021-09-09",
    "name": "业务指标",
    "value": 0
  },
  {
    "date": "2021-09-10",
    "name": "业务指标",
    "value": 0
  },
  {
    "date": "2021-09-11",
    "name": "业务指标",
    "value": 0
  },
  {
    "date": "2021-09-12",
    "name": "业务指标",
    "value": 0
  },
  {
    "date": "2021-09-13",
    "name": "业务指标",
    "value": 1
  },
  {
    "date": "2021-09-14",
    "name": "业务指标",
    "value": 0
  },
  {
    "date": "2021-09-15",
    "name": "业务指标",
    "value": 1
  },
  {
    "date": "2021-09-16",
    "name": "业务指标",
    "value": 0
  },
  {
    "date": "2021-09-17",
    "name": "业务指标",
    "value": 0
  },
  {
    "date": "2021-09-18",
    "name": "业务指标",
    "value": 0
  },
  {
    "date": "2021-09-19",
    "name": "业务指标",
    "value": 0
  },
  {
    "date": "2021-09-20",
    "name": "业务指标",
    "value": 0
  },
  {
    "date": "2021-09-21",
    "name": "业务指标",
    "value": 0
  },
  {
    "date": "2021-09-22",
    "name": "业务指标",
    "value": 0
  },
  {
    "date": "2021-09-23",
    "name": "业务指标",
    "value": 0
  },
  {
    "date": "2021-09-24",
    "name": "业务指标",
    "value": 0
  },
  {
    "date": "2021-09-01",
    "name": "接口数据核查",
    "value": 0
  },
  {
    "date": "2021-09-02",
    "name": "接口数据核查",
    "value": 0
  },
  {
    "date": "2021-09-03",
    "name": "接口数据核查",
    "value": 0
  },
  {
    "date": "2021-09-04",
    "name": "接口数据核查",
    "value": 0
  },
  {
    "date": "2021-09-05",
    "name": "接口数据核查",
    "value": 0
  },
  {
    "date": "2021-09-06",
    "name": "接口数据核查",
    "value": 0
  },
  {
    "date": "2021-09-07",
    "name": "接口数据核查",
    "value": 0
  },
  {
    "date": "2021-09-08",
    "name": "接口数据核查",
    "value": 0
  },
  {
    "date": "2021-09-09",
    "name": "接口数据核查",
    "value": 0
  },
  {
    "date": "2021-09-10",
    "name": "接口数据核查",
    "value": 0
  },
  {
    "date": "2021-09-11",
    "name": "接口数据核查",
    "value": 0
  },
  {
    "date": "2021-09-12",
    "name": "接口数据核查",
    "value": 0
  },
  {
    "date": "2021-09-13",
    "name": "接口数据核查",
    "value": 0
  },
  {
    "date": "2021-09-14",
    "name": "接口数据核查",
    "value": 0
  },
  {
    "date": "2021-09-15",
    "name": "接口数据核查",
    "value": 0
  },
  {
    "date": "2021-09-16",
    "name": "接口数据核查",
    "value": 0
  },
  {
    "date": "2021-09-17",
    "name": "接口数据核查",
    "value": 0
  },
  {
    "date": "2021-09-18",
    "name": "接口数据核查",
    "value": 0
  },
  {
    "date": "2021-09-19",
    "name": "接口数据核查",
    "value": 0
  },
  {
    "date": "2021-09-20",
    "name": "接口数据核查",
    "value": 0
  },
  {
    "date": "2021-09-21",
    "name": "接口数据核查",
    "value": 0
  },
  {
    "date": "2021-09-22",
    "name": "接口数据核查",
    "value": 1
  },
  {
    "date": "2021-09-23",
    "name": "接口数据核查",
    "value": 0
  },
  {
    "date": "2021-09-24",
    "name": "接口数据核查",
    "value": 0
  },
  {
    "date": "2021-09-01",
    "name": "主站系统运行",
    "value": 0
  },
  {
    "date": "2021-09-02",
    "name": "主站系统运行",
    "value": 0
  },
  {
    "date": "2021-09-03",
    "name": "主站系统运行",
    "value": 0
  },
  {
    "date": "2021-09-04",
    "name": "主站系统运行",
    "value": 0
  },
  {
    "date": "2021-09-05",
    "name": "主站系统运行",
    "value": 0
  },
  {
    "date": "2021-09-06",
    "name": "主站系统运行",
    "value": 0
  },
  {
    "date": "2021-09-07",
    "name": "主站系统运行",
    "value": 0
  },
  {
    "date": "2021-09-08",
    "name": "主站系统运行",
    "value": 0
  },
  {
    "date": "2021-09-09",
    "name": "主站系统运行",
    "value": 0
  },
  {
    "date": "2021-09-10",
    "name": "主站系统运行",
    "value": 0
  },
  {
    "date": "2021-09-11",
    "name": "主站系统运行",
    "value": 0
  },
  {
    "date": "2021-09-12",
    "name": "主站系统运行",
    "value": 0
  },
  {
    "date": "2021-09-13",
    "name": "主站系统运行",
    "value": 0
  },
  {
    "date": "2021-09-14",
    "name": "主站系统运行",
    "value": 0
  },
  {
    "date": "2021-09-15",
    "name": "主站系统运行",
    "value": 0
  },
  {
    "date": "2021-09-16",
    "name": "主站系统运行",
    "value": 0
  },
  {
    "date": "2021-09-17",
    "name": "主站系统运行",
    "value": 0
  },
  {
    "date": "2021-09-18",
    "name": "主站系统运行",
    "value": 0
  },
  {
    "date": "2021-09-19",
    "name": "主站系统运行",
    "value": 0
  },
  {
    "date": "2021-09-20",
    "name": "主站系统运行",
    "value": 0
  },
  {
    "date": "2021-09-21",
    "name": "主站系统运行",
    "value": 1
  },
  {
    "date": "2021-09-22",
    "name": "主站系统运行",
    "value": 0
  },
  {
    "date": "2021-09-23",
    "name": "主站系统运行",
    "value": 0
  },
  {
    "date": "2021-09-24",
    "name": "主站系统运行",
    "value": 0
  },
  {
    "date": "2021-09-01",
    "name": "KAFKA消费",
    "value": 0
  },
  {
    "date": "2021-09-02",
    "name": "KAFKA消费",
    "value": 0
  },
  {
    "date": "2021-09-03",
    "name": "KAFKA消费",
    "value": 0
  },
  {
    "date": "2021-09-04",
    "name": "KAFKA消费",
    "value": 0
  },
  {
    "date": "2021-09-05",
    "name": "KAFKA消费",
    "value": 0
  },
  {
    "date": "2021-09-06",
    "name": "KAFKA消费",
    "value": 0
  },
  {
    "date": "2021-09-07",
    "name": "KAFKA消费",
    "value": 0
  },
  {
    "date": "2021-09-08",
    "name": "KAFKA消费",
    "value": 0
  },
  {
    "date": "2021-09-09",
    "name": "KAFKA消费",
    "value": 0
  },
  {
    "date": "2021-09-10",
    "name": "KAFKA消费",
    "value": 0
  },
  {
    "date": "2021-09-11",
    "name": "KAFKA消费",
    "value": 0
  },
  {
    "date": "2021-09-12",
    "name": "KAFKA消费",
    "value": 0
  },
  {
    "date": "2021-09-13",
    "name": "KAFKA消费",
    "value": 0
  },
  {
    "date": "2021-09-14",
    "name": "KAFKA消费",
    "value": 0
  },
  {
    "date": "2021-09-15",
    "name": "KAFKA消费",
    "value": 1
  },
  {
    "date": "2021-09-16",
    "name": "KAFKA消费",
    "value": 0
  },
  {
    "date": "2021-09-17",
    "name": "KAFKA消费",
    "value": 0
  },
  {
    "date": "2021-09-18",
    "name": "KAFKA消费",
    "value": 0
  },
  {
    "date": "2021-09-19",
    "name": "KAFKA消费",
    "value": 0
  },
  {
    "date": "2021-09-20",
    "name": "KAFKA消费",
    "value": 0
  },
  {
    "date": "2021-09-21",
    "name": "KAFKA消费",
    "value": 0
  },
  {
    "date": "2021-09-22",
    "name": "KAFKA消费",
    "value": 0
  },
  {
    "date": "2021-09-23",
    "name": "KAFKA消费",
    "value": 0
  },
  {
    "date": "2021-09-24",
    "name": "KAFKA消费",
    "value": 0
  }
];

const CPUdatas = [
  {
    "type": "CPU",
    "expected": 100,
    "name": "238.54.142.91",
    "rate": 81
  },
  {
    "type": "CPU",
    "expected": 100,
    "name": "213.113.16.141",
    "rate": 90
  },
  {
    "type": "CPU",
    "expected": 100,
    "name": "178.116.21.161",
    "rate": 60
  },
  {
    "type": "CPU",
    "expected": 100,
    "name": "78.247.130.67",
    "rate": 82
  },
  {
    "type": "CPU",
    "expected": 100,
    "name": "72.14.153.133",
    "rate": 78
  }
]

function Statistics(props) {
  const { pagetitle } = props.route.name;
  const [picval, setPicVal] = useState({});
  return (
    <PageHeaderWrapper
      title={pagetitle}
    >
      <div>
        {/* 统计周期 */}
        <StatistCycle ChangeDate={(v) => console.log(v)} />
        {/* 希求工单情况 */}
        <Card
          style={{ marginTop: 24, }}
        >
          <Row>
            <Avatar size="large" icon="desktop" style={{ backgroundColor: '#0366c3', verticalAlign: 'middle' }} />
            <b style={{ marginLeft: 12 }}>需求工单情况</b>
          </Row>
          <Row type="flex" justify="space-around">
            <Col>
              <StatisticsCard
                title='需求总数:'
                value={154}
                suffix='单'
                des='环比上月'
                desval='11%'
                type='down'
              // type={Number() > Number() ? 'up' : 'down'} 
              />
            </Col>
            <Col>
              <StatisticsCard
                title='已开发:'
                value={104}
                suffix='单'
                des='环比上月'
                desval='11%'
                type='down'
              // type={Number() > Number() ? 'up' : 'down'} 
              />
            </Col>
            <Col>
              <StatisticsCard
                title='已发布:'
                value={50}
                suffix='单'
                des='环比上月'
                desval='11%'
                type='down'
              // type={Number() > Number() ? 'up' : 'down'} 
              />
            </Col>
            <Col>
              <StatisticsCard
                title='开发率:'
                value={67.53}
                suffix='%'
                des='环比上月'
                desval='11%'
                type='up'
              // type={Number() > Number() ? 'up' : 'down'} 
              />
            </Col>
            <Col>
              <StatisticsCard
                title='发布率:'
                value={32.47}
                suffix='%'
                des='环比上月'
                desval='11%'
                type='up'
              // type={Number() > Number() ? 'up' : 'down'} 
              />
            </Col>
          </Row>
        </Card>
        {/* 需求工单总情况 */}
        <Card
          style={{ marginTop: 24 }}
        >
          <Row>
            <Avatar size="large" icon="pie-chart" style={{ backgroundColor: '#0366c3', verticalAlign: 'middle' }} />
            <b style={{ marginLeft: 12 }}>需求工单总情况</b>
          </Row>
          <Col span={12}>
            <Card onMouseDown={() => setPicVal({})} style={{ border: 'none' }}>
              <DonutPCT
                data={Donutdata}
                height={300}
                totaltitle='需求总数'
                total='154'
                padding={[10, 30, 10, 30]}
                onGetVal={(v) => { setPicVal({ ...picval, dutyUnit: v }) }}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card onMouseDown={() => setPicVal({})} style={{ marginLeft: '-1px', border: 'none', textAlign: 'right' }}>
              {Smoothdata && (
                <SmoothLine
                  data={Smoothdata}
                  height={300}
                  padding={[30, 0, 50, 60]}
                  onGetVal={(v) => { setPicVal({ ...picval, type: v }) }}
                />
              )}
            </Card>
          </Col>
        </Card>
        {/* 功能模块情况 */}
        <Card
          style={{ marginTop: 24 }}
        >
          <Row>
            <Avatar size="large" icon="desktop" style={{ backgroundColor: '#0366c3', verticalAlign: 'middle' }} />
            <b style={{ marginLeft: 12 }}>功能模块情况</b>
          </Row>
          <Col span={12}>
            <Card onMouseDown={() => setPicVal({})} style={{ border: 'none' }}>
              <DonutPCT
                data={Donutdata}
                height={300}
                totaltitle='需求总数'
                total='154'
                padding={[10, 30, 10, 30]}
                onGetVal={(v) => { setPicVal({ ...picval, dutyUnit: v }) }}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card onMouseDown={() => setPicVal({})} style={{ marginLeft: '-1px', border: 'none', textAlign: 'right' }}>
              {Smoothdata && (
                <SmoothLine
                  data={Smoothdata}
                  height={300}
                  padding={[30, 0, 50, 60]}
                  onGetVal={(v) => { setPicVal({ ...picval, type: v }) }}
                />
              )}
            </Card>
          </Col>
        </Card>
        {/* 需求类型统计分析 */}
        <Card
          style={{ marginTop: 24, marginBottom: 24 }}
        >
          <Row>
            <Avatar size="large" icon="desktop" style={{ backgroundColor: '#0366c3', verticalAlign: 'middle' }} />
            <b style={{ marginLeft: 12 }}>需求类型统计分析</b>
          </Row>
          <Col span={12}>
            <Card onMouseDown={() => setPicVal({})} style={{ border: 'none' }}>
              <DonutPCT
                data={Donutdata}
                height={300}
                totaltitle='需求总数'
                total='154'
                padding={[10, 30, 10, 30]}
                onGetVal={(v) => { setPicVal({ ...picval, dutyUnit: v }) }}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card onMouseDown={() => setPicVal({})} style={{ marginLeft: '-1px', border: 'none', textAlign: 'right' }}>
              {Smoothdata && (
                <SmoothLine
                  data={Smoothdata}
                  height={360}
                  padding={[30, 0, 50, 60]}
                  onGetVal={(v) => { setPicVal({ ...picval, type: v }) }}
                />
              )}
            </Card>
          </Col>
        </Card>
        {/* 需求工单超时情况 */}
        <Row gutter={12} style={{marginBottom: 24}}>
          <Col span={12}>
            <Card>
              <>
                <Avatar size="large" icon="desktop" style={{ backgroundColor: '#0366c3', verticalAlign: 'middle' }} />
                <b style={{ marginLeft: 12 }}>需求工单超时情况</b>
              </>
              <ChartCard title="" contentHeight={350} onMouseDown={() => setPicVal({})} style={{ border: 'none' }}>
                {CPUdatas.length === 0 && <Empty style={{ height: '250px' }} />}
                {CPUdatas.length > 0 && (
                  <DonutPCT
                  data={Donutdata}
                  height={350}
                  totaltitle='需求总数'
                  total='154'
                  padding={[10, 30, 10, 30]}
                  onGetVal={(v) => { setPicVal({ ...picval, dutyUnit: v }) }}
                />
                )}
              </ChartCard>
            </Card>
          </Col>
          {/* 需求申请人Top5 */}
          <Col span={12}>
            <Card onMouseDown={() => setPicVal({})}>
              <>
                <Avatar size="large" icon="desktop" style={{ backgroundColor: '#0366c3', verticalAlign: 'middle' }} />
                <b style={{ marginLeft: 12 }}>需求申请人Top5</b>
              </>
              <ChartCard title="CPU TOP5" contentHeight={350} onMouseDown={() => setPicVal({})} style={{ border: 'none' }}>
                {CPUdatas.length === 0 && <Empty style={{ height: '250px' }} />}
                {CPUdatas.length > 0 && (
                  <Cylinder
                    height={350}
                    data={CPUdatas}
                    padding={[0, 50, 30, 150]}
                    symbol="%"
                    cols={cols}
                    colors="l(270) 0:#04e8ff 0.5:#05bdfe 1:#05bdfe"
                    onGetVal={(v) => { setPicVal({ ...picval, type: v }); console.log(v) }}
                  />
                )}
              </ChartCard>
            </Card>
          </Col>
        </Row>
        {/* 需求处理人Top5 */}
        <Row gutter={12} style={{marginBottom: 24}}>
          <Col span={12}>
            <Card onMouseDown={() => setPicVal({})}>
              <>
                <Avatar size="large" icon="desktop" style={{ backgroundColor: '#0366c3', verticalAlign: 'middle' }} />
                <b style={{ marginLeft: 12 }}>需求处理人Top5</b>
              </>
              <ChartCard title="CPU TOP5" contentHeight={350} onMouseDown={() => setPicVal({})} style={{ border: 'none' }}>
                {CPUdatas.length === 0 && <Empty style={{ height: '250px' }} />}
                {CPUdatas.length > 0 && (
                  <Cylinder
                    height={350}
                    data={CPUdatas}
                    padding={[0, 50, 30, 150]}
                    symbol="%"
                    cols={cols}
                    colors="l(270) 0:#04e8ff 0.5:#05bdfe 1:#05bdfe"
                    onGetVal={(v) => { setPicVal({ ...picval, type: v }); console.log(v) }}
                  />
                )}
              </ChartCard>
            </Card>
          </Col>
          {/* 需求申请单位Top5 */}
          <Col span={12}>
            <Card onMouseDown={() => setPicVal({})}>
              <>
                <Avatar size="large" icon="desktop" style={{ backgroundColor: '#0366c3', verticalAlign: 'middle' }} />
                <b style={{ marginLeft: 12 }}>需求申请单位Top5</b>
              </>
              <ChartCard title="CPU TOP5" contentHeight={350} onMouseDown={() => setPicVal({})} style={{ border: 'none' }}>
                {CPUdatas.length === 0 && <Empty style={{ height: '250px' }} />}
                {CPUdatas.length > 0 && (
                  <Cylinder
                    height={350}
                    data={CPUdatas}
                    padding={[0, 50, 30, 150]}
                    symbol="%"
                    cols={cols}
                    colors="l(270) 0:#04e8ff 0.5:#05bdfe 1:#05bdfe"
                    onGetVal={(v) => { setPicVal({ ...picval, type: v }); console.log(v) }}
                  />
                )}
              </ChartCard>
            </Card>
          </Col>
        </Row>
        {/* 需求处理单位Top5 */}
        <Row gutter={12}>
          <Col span={12}>
            <Card onMouseDown={() => setPicVal({})}>
              <>
                <Avatar size="large" icon="desktop" style={{ backgroundColor: '#0366c3', verticalAlign: 'middle' }} />
                <b style={{ marginLeft: 12 }}>需求处理单位Top5</b>
              </>
              <ChartCard title="CPU TOP5" contentHeight={350} onMouseDown={() => setPicVal({})} style={{ border: 'none' }}>
                {CPUdatas.length === 0 && <Empty style={{ height: '250px' }} />}
                {CPUdatas.length > 0 && (
                  <Cylinder
                    height={350}
                    data={CPUdatas}
                    padding={[0, 50, 30, 150]}
                    symbol="%"
                    cols={cols}
                    colors="l(270) 0:#04e8ff 0.5:#05bdfe 1:#05bdfe"
                    onGetVal={(v) => { setPicVal({ ...picval, type: v }); console.log(v) }}
                  />
                )}
              </ChartCard>
            </Card>
          </Col>
        </Row>
      </div>
    </PageHeaderWrapper>
  );
}

export default Statistics;