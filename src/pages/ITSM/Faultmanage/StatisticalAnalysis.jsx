import React, { useState } from 'react';
// import { connect } from 'dva';
import { Card, Row, Col, Avatar, Empty } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { ChartCard } from '@/components/Charts';
import SelectTime from '@/components/SelectTime/SelectTime';
import DonutPCT from '@/components/CustomizeCharts/DonutPCT';
import SmoothLine from '@/components/CustomizeCharts/SmoothLine';
import Cylinder from '@/components/CustomizeCharts/Cylinder';
import styles from './index.less'
import StatisticsCard from './components/StatisticsCard';

const cols = {
  rate: {
    // alias: '%',
    // tickCount: 10,
  },
};

// const Donutdata = [
//   {
//     "type": "业务指标",
//     "value": 2
//   },
//   {
//     "type": "终端在线和入库",
//     "value": 1
//   },
//   {
//     "type": "KAFKA消费",
//     "value": 1
//   },
//   {
//     "type": "接口数据核查",
//     "value": 1
//   },
//   {
//     "type": "主站系统运行",
//     "value": 1
//   }
// ];

const Smoothdata = [
  {
    "date": "1",
    "name": "功能开发",
    "value": 5
  },
  {
    "date": "2",
    "name": "功能开发",
    "value": 10
  },
  {
    "date": "3",
    "name": "功能开发",
    "value": 10
  },
  {
    "date": "4",
    "name": "功能开发",
    "value": 5
  },
  {
    "date": "5",
    "name": "功能开发",
    "value": 0
  },
  {
    "date": "6",
    "name": "功能开发",
    "value": 0
  },
  {
    "date": "7",
    "name": "功能开发",
    "value": 0
  },
  {
    "date": "8",
    "name": "功能开发",
    "value": 0
  },
  {
    "date": "9",
    "name": "功能开发",
    "value": 0
  },
  {
    "date": "10",
    "name": "功能开发",
    "value": 0
  },
  {
    "date": "11",
    "name": "功能开发",
    "value": 0
  },
  {
    "date": "12",
    "name": "功能开发",
    "value": 0
  },
  {
    "date": "13",
    "name": "功能开发",
    "value": 0
  },
  {
    "date": "14",
    "name": "功能开发",
    "value": 1
  },
  {
    "date": "15",
    "name": "功能开发",
    "value": 10
  },
  {
    "date": "16",
    "name": "功能开发",
    "value": 5
  },
  {
    "date": "17",
    "name": "功能开发",
    "value": 0
  },
  {
    "date": "18",
    "name": "功能开发",
    "value": 0
  },
  {
    "date": "19",
    "name": "功能开发",
    "value": 0
  },
  {
    "date": "20",
    "name": "功能开发",
    "value": 0
  },
  {
    "date": "21",
    "name": "功能开发",
    "value": 0
  },
  {
    "date": "22",
    "name": "功能开发",
    "value": 0
  },
  {
    "date": "23",
    "name": "功能开发",
    "value": 0
  },
  {
    "date": "24",
    "name": "功能开发",
    "value": 0
  },
  {
    "date": "1",
    "name": "软件运维",
    "value": 0
  },
  {
    "date": "2",
    "name": "软件运维",
    "value": 5
  },
  {
    "date": "3",
    "name": "软件运维",
    "value": 10
  },
  {
    "date": "4",
    "name": "软件运维",
    "value": 15
  },
  {
    "date": "5",
    "name": "软件运维",
    "value": 20
  },
  {
    "date": "6",
    "name": "软件运维",
    "value": 25
  },
  {
    "date": "7",
    "name": "软件运维",
    "value": 30
  },
  {
    "date": "8",
    "name": "软件运维",
    "value": 35
  },
  {
    "date": "9",
    "name": "软件运维",
    "value": 40
  },
  {
    "date": "10",
    "name": "软件运维",
    "value": 5
  },
  {
    "date": "11",
    "name": "软件运维",
    "value": 10
  },
  {
    "date": "12",
    "name": "软件运维",
    "value": 20
  },
  {
    "date": "13",
    "name": "软件运维",
    "value": 15
  },
  {
    "date": "14",
    "name": "软件运维",
    "value": 20
  },
  {
    "date": "15",
    "name": "软件运维",
    "value": 15
  },
  {
    "date": "16",
    "name": "软件运维",
    "value": 10
  },
  {
    "date": "17",
    "name": "软件运维",
    "value": 20
  },
  {
    "date": "18",
    "name": "软件运维",
    "value": 30
  },
  {
    "date": "19",
    "name": "软件运维",
    "value": 30
  },
  {
    "date": "20",
    "name": "软件运维",
    "value": 10
  },
  {
    "date": "21",
    "name": "软件运维",
    "value": 5
  },
  {
    "date": "22",
    "name": "软件运维",
    "value": 10
  },
  {
    "date": "23",
    "name": "软件运维",
    "value": 15
  },
  {
    "date": "24",
    "name": "软件运维",
    "value": 20
  },
  {
    "date": "1",
    "name": "系统运维",
    "value": 5
  },
  {
    "date": "2",
    "name": "系统运维",
    "value": 10
  },
  {
    "date": "3",
    "name": "系统运维",
    "value": 20
  },
  {
    "date": "4",
    "name": "系统运维",
    "value": 30
  },
  {
    "date": "5",
    "name": "系统运维",
    "value": 5
  },
  {
    "date": "6",
    "name": "系统运维",
    "value": 10
  },
  {
    "date": "7",
    "name": "系统运维",
    "value": 30
  },
  {
    "date": "8",
    "name": "系统运维",
    "value": 35
  },
  {
    "date": "9",
    "name": "系统运维",
    "value": 5
  },
  {
    "date": "10",
    "name": "系统运维",
    "value": 0
  },
  {
    "date": "11",
    "name": "系统运维",
    "value": 5
  },
  {
    "date": "12",
    "name": "系统运维",
    "value": 10
  },
  {
    "date": "13",
    "name": "系统运维",
    "value": 15
  },
  {
    "date": "14",
    "name": "系统运维",
    "value": 20
  },
  {
    "date": "15",
    "name": "系统运维",
    "value": 15
  },
  {
    "date": "16",
    "name": "系统运维",
    "value": 20
  },
  {
    "date": "17",
    "name": "系统运维",
    "value": 0
  },
  {
    "date": "18",
    "name": "系统运维",
    "value": 0
  },
  {
    "date": "19",
    "name": "系统运维",
    "value": 0
  },
  {
    "date": "20",
    "name": "系统运维",
    "value": 0
  },
  {
    "date": "21",
    "name": "系统运维",
    "value": 0
  },
  {
    "date": "22",
    "name": "系统运维",
    "value": 0
  },
  {
    "date": "23",
    "name": "系统运维",
    "value": 0
  },
  {
    "date": "24",
    "name": "系统运维",
    "value": 0
  },
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

// 饼图数据
const Donutdata = [
  { type: '硬件运维', value: 402 },
  { type: '功能研发', value: 299 },
  { type: '软件运维', value: 299 },
];

const Donutdata2 = [
  { type: '软件', value: 260 },
  { type: '硬件', value: 260 },
];

const Donutdata3 = [
  { type: '服务器故障', value: 89.4 },
  { type: '安防故障', value: 88.1 },
  { type: '数据库故障', value: 12.1 },
  { type: '网络故障', value: 18.4 },
  { type: '计量系统故障', value: 23.5 },
  { type: '人为误操作', value: 12.77 },
  { type: '终端设备故障', value: 89.4 },
  { type: '程序运行或配置故障', value: 25.5 },
  { type: '配电设备故障', value: 3.83 },
];

const Donutdata4 = [
  { type: '数据备份', value: 89.4 },
  { type: '前台应用', value: 88.1 },
  { type: '外部接口', value: 12.1 },
  { type: 'VNC所承载程序', value: 18.4 },
  { type: '中间件所承载程序', value: 23.5 },
  { type: '前置采集程序', value: 12.77 },
  { type: '后台解析程序', value: 89.4 },
  { type: '数据库读写程序', value: 25.5 },
];

const Donutdata5 = [
  { type: '采集管理', value: 89.4 },
  { type: '数据管理', value: 88.1 },
  { type: '系统管理', value: 12.1 },
  { type: '业务应用', value: 18.4 },
  { type: '运维管理', value: 23.5 },
  { type: '首页', value: 12.77 },
  { type: '导航数', value: 89.4 },
];

function StatisticalAnalysis(props) {
  const { pagetitle } = props.route.name;
  // const [selectedTags, setSelectedTags] = useState([]);
  const [picval, setPicVal] = useState({});

  // const handleChang = (tag, checked) => {
  //   if (checked) {
  //     setSelectedTags([tag])
  //   }
  // }

  // useEffect(() => {
  //   dispatch({
  //     type: 'alarmovervies/fetchoversmooth',
  //     payload: { key: 'function' },
  //   });
  // }, [])

  return (
    <PageHeaderWrapper
      title={pagetitle}
    >
      <div>
        <SelectTime ChangeDate={(v) => console.log(v)} />
        <Row gutter={24}>
          <Col span={8} style={{ marginTop: 24 }}>
            <div className={styles.statisticscard}>
              <Avatar icon="file-protect" />
              <b>故障工单情况</b>
            </div>
            <Row>
              <Col span={8}><StatisticsCard title='故障总数：' value={521} suffix='单' des='环比' desval='11%' type='up' /></Col>
              <Col span={8}><StatisticsCard title='已处理：' value={511} suffix='单' des='环比' desval='11%' type='up' /></Col>
              <Col span={8}><StatisticsCard title='解决率：' value={98.10} suffix='%' des='环比' desval='11%' type='down' /></Col>
            </Row>
          </Col>
          <Col span={8} style={{ marginTop: 24 }}>
            <div className={styles.statisticscard}>
              <Avatar icon="control" />
              <b>系统故障率、可用率</b>
            </div>
            <Row>
              <Col span={8}><StatisticsCard title='故障时长：' value={10.28} suffix='H' des='环比' desval='11%' type='up' /></Col>
              <Col span={8}><StatisticsCard title='故障率：' value={0.24} suffix='%' des='环比' desval='11%' type='down' /></Col>
              <Col span={8}><StatisticsCard title='可用率：' value={99.76} suffix='%' des='环比' desval='11%' type='down' /></Col>
            </Row>
          </Col>
          <Col span={8} style={{ marginTop: 24 }}>
            <div className={styles.statisticscard}>
              <Avatar icon="security-scan" />
              <b>故障责任单位情况</b>
            </div>
            <Row>
              <Col span={8}><StatisticsCard title='功能开发：' value={50} suffix='单' des='环比' desval='11%' type='up' /></Col>
              <Col span={8}><StatisticsCard title='软件运维：' value={51} suffix='单' des='环比' desval='11%' type='down' /></Col>
              <Col span={8}><StatisticsCard title='硬件运维：' value={53} suffix='单' des='环比' desval='11%' type='down' /></Col>
            </Row>
          </Col>
        </Row>
        <Row style={{ marginTop: 24 }}>
          <div className={styles.statisticscard}>
            <Avatar icon="cluster" />
            <b>故障责任单位情况</b>
          </div>
          <Col span={8}>
            <Card onMouseDown={() => setPicVal({})}>
              <DonutPCT
                data={Donutdata}
                height={300}
                totaltitle='故障总数'
                total='521'
                padding={[10, 30, 30, 30]}
                onGetVal={(v) => { setPicVal({ ...picval, dutyUnit: v }) }}
              />
            </Card>
          </Col>
          <Col span={16}>
            <Card onMouseDown={() => setPicVal({})} style={{ marginLeft: '-1px' }}>
              {Smoothdata && (
                <SmoothLine
                  data={Smoothdata}
                  // cols = {colsa}
                  height={300}
                  padding={[30, 0, 70, 60]}
                  onGetVal={(v) => { setPicVal({ ...picval, type: v }) }}
                />
              )}
            </Card>
          </Col>
        </Row>
        <Row style={{ marginTop: 24 }}>
          <div className={styles.statisticscard}>
            <Avatar icon="share-alt" />
            <b>故障类型统计分析</b>
          </div>
          <Col span={8}>
            <Card onMouseDown={() => setPicVal({})}>
              <h4 style={{fontWeight: 'bold'}}>故障类型总情况</h4>
              <DonutPCT
                data={Donutdata2}
                height={300}
                total="521"
                totaltitle='故障总数'
                padding={[10, 30, 30, 30]}
                onGetVal={(v) => { setPicVal({ ...picval, dutyUnit: v }) }}
              />
            </Card>
          </Col>
          <Col span={16}>
            <Card onMouseDown={() => setPicVal({})} style={{ marginLeft: '-1px' }}>
              <h4 style={{fontWeight: 'bold'}}>故障类型趋势分析</h4>
              {Smoothdata && (
                <SmoothLine
                  data={Smoothdata}
                  height={300}
                  padding={[30, 0, 70, 60]}
                  onGetVal={(v) => { setPicVal({ ...picval, type: v }) }}
                />
              )}
            </Card>
          </Col>
          <Col span={8}>
            <Card onMouseDown={() => setPicVal({})}>
              <h4 style={{fontWeight: 'bold'}}>硬件故障情况</h4>
              <DonutPCT
                data={Donutdata3}
                height={300}
                total="261"
                totaltitle='硬件故障总数'
                padding={[10, 30, 30, 30]}
                onGetVal={(v) => { setPicVal({ ...picval, dutyUnit: v }) }}
              />
            </Card>
          </Col>
          <Col span={16}>
            <Card onMouseDown={() => setPicVal({})} style={{ marginLeft: '-1px' }}>
              <h4 style={{fontWeight: 'bold'}}>硬件故障趋势分析</h4>
              {Smoothdata && (
                <SmoothLine
                  data={Smoothdata}
                  height={300}
                  padding={[30, 0, 70, 60]}
                  onGetVal={(v) => { setPicVal({ ...picval, type: v }) }}
                />
              )}
            </Card>
          </Col>
          <Col span={8}>
            <Card onMouseDown={() => setPicVal({})}>
              <h4 style={{fontWeight: 'bold'}}>软件故障情况</h4>
              <DonutPCT
                data={Donutdata4}
                height={300}
                total="261"
                totaltitle='软件故障总数'
                padding={[10, 30, 30, 30]}
                onGetVal={(v) => { setPicVal({ ...picval, dutyUnit: v }) }}
              />
            </Card>
          </Col>
          <Col span={16}>
            <Card onMouseDown={() => setPicVal({})} style={{ marginLeft: '-1px' }}>
              <h4 style={{fontWeight: 'bold'}}>软件故障趋势分析</h4>
              {Smoothdata && (
                <SmoothLine
                  data={Smoothdata}
                  height={300}
                  padding={[30, 0, 70, 60]}
                  onGetVal={(v) => { setPicVal({ ...picval, type: v }) }}
                />
              )}
            </Card>
          </Col>
        </Row>
        <Row style={{ marginTop: 24 }}>
          <div className={styles.statisticscard}>
            <Avatar icon="share-alt" />
            <b>故障系统模块情况</b>
          </div>
          <Col span={8}>
            <Card onMouseDown={() => setPicVal({})}>
              <DonutPCT
                data={Donutdata5}
                height={300}
                total="521"
                totaltitle='总工单数'
                padding={[10, 30, 30, 30]}
                onGetVal={(v) => { setPicVal({ ...picval, dutyUnit: v }) }}
              />
            </Card>
          </Col>
          <Col span={16}>
            <Card onMouseDown={() => setPicVal({})} style={{ marginLeft: '-1px' }}>
              {Smoothdata && (
                <SmoothLine
                  data={Smoothdata}
                  height={300}
                  padding={[30, 0, 70, 60]}
                  onGetVal={(v) => { setPicVal({ ...picval, type: v }) }}
                />
              )}
            </Card>
          </Col>
        </Row>
        <Row gutter={12} style={{ marginTop: 24 }}>
          <Col span={12}>
            <div className={styles.statisticscard}>
              <Avatar icon="share-alt" />
              <b>故障工单超时情况</b>
            </div>
            <Card onMouseDown={() => setPicVal({})}>
              <DonutPCT
                data={Donutdata5}
                height={364.5}
                total="521"
                totaltitle='总工单数'
                padding={[10, 30, 30, 30]}
                onGetVal={(v) => { setPicVal({ ...picval, dutyUnit: v }) }}
              />
            </Card>
          </Col>
          <Col span={12}>
            <div className={styles.statisticscard}>
              <Avatar icon="share-alt" />
              <b>故障登记人Top5</b>
            </div>
            <ChartCard title="CPU TOP5" contentHeight={350} onMouseDown={() => setPicVal({})} >
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
          </Col>
        </Row>
        <Row gutter={12} style={{ marginTop: 24 }}>
          <Col span={12}>
            <div className={styles.statisticscard}>
              <Avatar icon="share-alt" />
              <b>故障处理人Top5</b>
            </div>
            <ChartCard title="CPU TOP5" contentHeight={350} onMouseDown={() => setPicVal({})} >
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
          </Col>
          <Col span={12}>
            <div className={styles.statisticscard}>
              <Avatar icon="share-alt" />
              <b>故障登记单位Top5</b>
            </div>
            <ChartCard title="CPU TOP5" contentHeight={350} onMouseDown={() => setPicVal({})} >
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
          </Col>
        </Row>
        <Row gutter={12} style={{ marginTop: 24 }}>
          <Col span={12}>
            <div className={styles.statisticscard}>
              <Avatar icon="share-alt" />
              <b>故障处理单位Top5</b>
            </div>
            <ChartCard title="CPU TOP5" contentHeight={350} onMouseDown={() => setPicVal({})} >
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
          </Col>
        </Row>
      </div>
    </PageHeaderWrapper>
  );
}

export default StatisticalAnalysis;
// export default connect(({ loading }) => ({
//   // Smoothdata: alarmovervies.Smoothdata,
//   loading: loading.models.alarmovervies,
// }))(StatisticalAnalysis);