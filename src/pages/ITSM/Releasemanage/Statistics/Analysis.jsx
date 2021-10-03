import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Avatar, Empty } from 'antd';
import { ChartCard } from '@/components/Charts';
import StatisticsCard from '@/components/StatisticsCard';
import SelectTime from '@/components/SelectTime/SelectTime';
import DonutPCT from '@/components/CustomizeCharts/DonutPCT';
import SmoothLine from '@/components/CustomizeCharts/SmoothLine';
import Cylinder from '@/components/CustomizeCharts/Cylinder';
import ColumnarY from '@/components/CustomizeCharts/ColumnarY';
import styles from '../index.less';

const cols = {
  rate: {
    // alias: '%',
    // tickCount: 10,
  },
};

const Issuedscale = {
  total: {
    type: 'linear',
    alias: '返回结果数量',
    min: 0,
    tickInterval: 5000,
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

const issuedata = [
  {
    "id": "1437342791630413825",
    "date": "2021-09-13 17:10:00",
    "type": "正常",
    "total": 149120,
    "sjsj": "2021-09-13 00:00:00",
    "flag": false
  },
  {
    "id": "1437342791668162561",
    "date": "2021-09-13 17:10:00",
    "type": "无上行报文",
    "total": 20469,
    "sjsj": "2021-09-13 00:00:00",
    "flag": false
  },
  {
    "id": "1437342791689134082",
    "date": "2021-09-13 17:10:00",
    "type": "前置未返回",
    "total": 11868,
    "sjsj": "2021-09-13 00:00:00",
    "flag": false
  },
  {
    "id": "1437342791714299905",
    "date": "2021-09-13 17:10:00",
    "type": "否认",
    "total": 5226,
    "sjsj": "2021-09-13 00:00:00",
    "flag": false
  },
  {
    "id": "1437342791731077121",
    "date": "2021-09-13 17:10:00",
    "type": "超时",
    "total": 1112,
    "sjsj": "2021-09-13 00:00:00",
    "flag": false
  },
  {
    "id": "1437342791747854338",
    "date": "2021-09-13 17:10:00",
    "type": "设备离线",
    "total": 924,
    "sjsj": "2021-09-13 00:00:00",
    "flag": false
  },
  {
    "id": "1437342791764631554",
    "date": "2021-09-13 17:10:00",
    "type": "报文出错",
    "total": 168,
    "sjsj": "2021-09-13 00:00:00",
    "flag": false
  }
]

const CPUdatas = [
  {
    "type": "CPU",
    "expected": 100,
    "name": "238.54.142.91",
    "rate": 81,
    "startdate": "2021-10-01 00:00:00",
    "enddate": "2021-10-03 23:59:59",
  },
  {
    "type": "CPU",
    "expected": 100,
    "name": "213.113.16.141",
    "rate": 90,
    "startdate": "2021-10-01 00:00:00",
    "enddate": "2021-10-03 23:59:59",
  },
  {
    "type": "CPU",
    "expected": 100,
    "name": "178.116.21.161",
    "rate": 60,
    "startdate": "2021-10-01 00:00:00",
    "enddate": "2021-10-03 23:59:59",
  },
  {
    "type": "CPU",
    "expected": 100,
    "name": "78.247.130.67",
    "rate": 82,
    "startdate": "2021-10-01 00:00:00",
    "enddate": "2021-10-03 23:59:59",
  },
  {
    "type": "CPU",
    "expected": 100,
    "name": "72.14.153.133",
    "rate": 78,
    "startdate": "2021-10-01 00:00:00",
    "enddate": "2021-10-03 23:59:59",
  }
]

// 饼图数据
const Donutdata = [
  { type: '博联', value: 600, startdate: '2021-10-03 00:00:00', enddate: '2021-10-03 23:59:59' },
  { type: '南瑞', value: 200, startdate: '2021-10-03 00:00:00', enddate: '2021-10-02 23:59:59' },
];

const Donutdata2 = [
  { type: '计划发布', value: 151 },
  { type: '临时发布', value: 200 },
];

function Statistics(props) {
  const { dispatch, } = props;
  const [selectedTags, setSelectedTags] = useState([]);
  const [picval, setPicVal] = useState({});

  const handleChang = (tag, checked) => {
    if (checked) {
      setSelectedTags([tag])
    }
  }

  // useEffect(() => {
  //   dispatch({
  //     type: 'alarmovervies/fetchoversmooth',
  //     payload: { key: 'function' },
  //   });
  // }, [])
  return (
    <div>
      <SelectTime ChangeDate={(v) => console.log(v)} />
      <Row style={{ marginTop: 24 }}>
        <div className={styles.statisticscard}>
          <Avatar icon="desktop" />
          <b>发布总情况</b>
        </div>
        <Col span={6}>
          <StatisticsCard title='发布总次数：' value={1128} suffix='次' des='环比' desval='11%' type='up' />
        </Col>
        <Col span={6}>
          <StatisticsCard title='出厂测试总功能项：' value={93} suffix='项' des='环比' desval='3.5%' type='down' />
        </Col>
        <Col span={6}>
          <StatisticsCard title='发布成功项：' value={935888} suffix='次' des='环比' desval='6%' type='up' />
        </Col>
        <Col span={6}>
          <StatisticsCard title='发布成功率：' value={89.558} suffix='%' des='环比' desval='6%' type='up' />
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12} style={{ marginTop: 24 }}>
          <div className={styles.statisticscard}>
            <Avatar icon="desktop" />
            <b>平台验证情况</b>
          </div>
          <Row>
            <Col span={8}><StatisticsCard title='平台验证通过项：' value={152} suffix='项' des='环比' desval='6%' type='up' /></Col>
            <Col span={8}><StatisticsCard title='平台验证未通过项：' value={2} suffix='项' des='环比' desval='6%' type='down' /></Col>
            <Col span={8}><StatisticsCard title='平台验证成功率：' value={100.00} suffix='%' des='环比' desval='6%' type='down' /></Col>
          </Row>
        </Col>
        <Col span={12} style={{ marginTop: 24 }}>
          <div className={styles.statisticscard}>
            <Avatar icon="file-protect" />
            <b>业务验证情况</b>
          </div>
          <Row>
            <Col span={8}><StatisticsCard title='业务验证通过项：' value={150} suffix='项' des='环比' desval='6%' type='up' /></Col>
            <Col span={8}><StatisticsCard title='业务验证未通过项：' value={2} suffix='项' des='环比' desval='6%' type='down' /></Col>
            <Col span={8}><StatisticsCard title='平台验证成功率：' value={100.00} suffix='%' des='环比' desval='6%' type='down' /></Col>
          </Row>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12} style={{ marginTop: 24 }}>
          <div className={styles.statisticscard}>
            <Avatar icon="control" />
            <b>发布实施情况</b>
          </div>
          <Row>
            <Col span={8}><StatisticsCard title='实施通过项：' value={148} suffix='项' des='环比' desval='6%' type='up' /></Col>
            <Col span={8}><StatisticsCard title='实施未通过项：' value={0} suffix='项' des='环比' desval='6%' type='down' /></Col>
            <Col span={8}><StatisticsCard title='实施成功率：' value={100.00} suffix='%' des='环比' desval='6%' type='down' /></Col>
          </Row>
        </Col>
        <Col span={12} style={{ marginTop: 24 }}>
          <div className={styles.statisticscard}>
            <Avatar icon="security-scan" />
            <b>业务复核情况</b>
          </div>
          <Row>
            <Col span={8}><StatisticsCard title='复核通过项：' value={148} suffix='项' des='环比' desval='6%' type='up' /></Col>
            <Col span={8}><StatisticsCard title='复核未通过项：' value={0} suffix='项' des='环比' desval='6%' type='down' /></Col>
            <Col span={8}><StatisticsCard title='复核成功率：' value={100.00} suffix='%' des='环比' desval='6%' type='down' /></Col>
          </Row>
        </Col>
      </Row>
      <Row style={{ marginTop: 24 }}>
        <div className={styles.statisticscard}>
          <Avatar icon="cluster" />
          <b>发布工单责任单位情况</b>
        </div>
        <Col span={8}>
          <Card onMouseDown={() => setPicVal({})}>
            <DonutPCT
              data={Donutdata}
              height={300}
              totaltitle='发布总次数'
              total='550'
              padding={[10, 30, 10, 30]}
              onGetVal={(v) => { console.log('发布工单责任单位情况:饼图', v); setPicVal({ ...picval, dutyUnit: v }) }}
            />
          </Card>
        </Col>
        <Col span={16}>
          <Card onMouseDown={() => setPicVal({})} style={{ marginLeft: '-1px' }}>
            {Smoothdata && (
              <SmoothLine
                data={Smoothdata}
                height={300}
                padding={[30, 0, 50, 60]}
                onGetVal={(v) => { console.log('发布工单责任单位情况：曲线图', v); setPicVal({ ...picval, type: v }) }}
              />
            )}
          </Card>
        </Col>
      </Row>
      <Row style={{ marginTop: 24 }}>
        <div className={styles.statisticscard}>
          <Avatar icon="share-alt" />
          <b>发布类型统计分析</b>
        </div>
        <Col span={8}>
          <Card onMouseDown={() => setPicVal({})}>
            <DonutPCT
              data={Donutdata2}
              height={300}
              total="351"
              totaltitle='发布总次数'
              padding={[10, 30, 10, 30]}
              onGetVal={(v) => { console.log('饼图', v); setPicVal({ ...picval, dutyUnit: v }) }}
            />
          </Card>
        </Col>
        <Col span={16}>
          <Card onMouseDown={() => setPicVal({})} style={{ marginLeft: '-1px' }}>
            {Smoothdata && (
              <SmoothLine
                data={Smoothdata}
                height={300}
                padding={[30, 0, 50, 60]}
                onGetVal={(v) => { setPicVal({ ...picval, type: v }); console.log('曲线图', v) }}
              />
            )}
          </Card>
        </Col>
      </Row>
      <Row style={{ marginTop: 24 }}>
        <div className={styles.statisticscard}>
          <Avatar icon="share-alt" />
          <b>发布类型统计分析</b>
        </div>
        <Col span={12}>
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
                onGetVal={(v) => { setPicVal({ ...picval, type: v }); console.log('柱形图', v) }}
              />
            )}
          </ChartCard>
        </Col>
        <Col span={12}>
          <Card onMouseDown={() => setPicVal({})} style={{ marginLeft: '-1px' }}>
            {issuedata && issuedata.length === 0 && <Empty style={{ height: '250px' }} />}
            {issuedata && issuedata.length > 0 && (
              <ColumnarY
                cols={Issuedscale}
                data={issuedata}
                height={364}
                padding={[30, 60, 50, 100]}
                onGetVal={(v) => { setPicVal({ ...picval, type: v }); console.log('Y向柱形图', v) }}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default connect(({ alarmovervies, loading }) => ({
  // Smoothdata: alarmovervies.Smoothdata,
  loading: loading.models.alarmovervies,
}))(Statistics);