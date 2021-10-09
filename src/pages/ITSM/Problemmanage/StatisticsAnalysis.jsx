import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Avatar, Select, Input } from 'antd';
import { ChartCard } from '@/components/Charts';
import StatisticsCard from '@/components/StatisticsCard';
import SelectTime from '@/components/SelectTime/SelectTime';
import DonutPCT from '@/components/CustomizeCharts/DonutPCT';
import SmoothLine from '@/components/CustomizeCharts/SmoothLine';
import Cylinder from '@/components/CustomizeCharts/Cylinder';
import ColumnarY from '@/components/CustomizeCharts/ColumnarY';
import styles from '../Problemmanage/index.less';
import Donut from '@/components/CustomizeCharts/Donut';
import Barchart from '@/components/CustomizeCharts/Barchart';

const { Option } = Select;
const cols = {
  rate: {
    // alias: '%',
    // tickCount: 10,
  },
};
const Donutdatatwo = [
  {
    type: '事件单',
    count: 600,
  },
  {
    type: '故障单',
    count: 200,
  },
  {
    type: '问题单',
    count: 100,
  },
  {
    type: '需求单',
    count: 111,
  },
  {
    type: '发布单',
    count: 150,
  },
];

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
    date: '2021-09-01',
    name: '终端在线和入库',
    value: 0,
  },
  {
    date: '2021-09-02',
    name: '终端在线和入库',
    value: 0,
  },
  {
    date: '2021-09-03',
    name: '终端在线和入库',
    value: 0,
  },
  {
    date: '2021-09-04',
    name: '终端在线和入库',
    value: 0,
  },
  {
    date: '2021-09-05',
    name: '终端在线和入库',
    value: 0,
  },
  {
    date: '2021-09-06',
    name: '终端在线和入库',
    value: 0,
  },
  {
    date: '2021-09-07',
    name: '终端在线和入库',
    value: 0,
  },
  {
    date: '2021-09-08',
    name: '终端在线和入库',
    value: 0,
  },
  {
    date: '2021-09-09',
    name: '终端在线和入库',
    value: 0,
  },
  {
    date: '2021-09-10',
    name: '终端在线和入库',
    value: 0,
  },
  {
    date: '2021-09-11',
    name: '终端在线和入库',
    value: 0,
  },
  {
    date: '2021-09-12',
    name: '终端在线和入库',
    value: 0,
  },
  {
    date: '2021-09-13',
    name: '终端在线和入库',
    value: 0,
  },
  {
    date: '2021-09-14',
    name: '终端在线和入库',
    value: 1,
  },
  {
    date: '2021-09-15',
    name: '终端在线和入库',
    value: 0,
  },
  {
    date: '2021-09-16',
    name: '终端在线和入库',
    value: 0,
  },
  {
    date: '2021-09-17',
    name: '终端在线和入库',
    value: 0,
  },
  {
    date: '2021-09-18',
    name: '终端在线和入库',
    value: 0,
  },
  {
    date: '2021-09-19',
    name: '终端在线和入库',
    value: 0,
  },
  {
    date: '2021-09-20',
    name: '终端在线和入库',
    value: 0,
  },
  {
    date: '2021-09-21',
    name: '终端在线和入库',
    value: 0,
  },
  {
    date: '2021-09-22',
    name: '终端在线和入库',
    value: 0,
  },
  {
    date: '2021-09-23',
    name: '终端在线和入库',
    value: 0,
  },
  {
    date: '2021-09-24',
    name: '终端在线和入库',
    value: 0,
  },
  {
    date: '2021-09-01',
    name: '业务指标',
    value: 0,
  },
  {
    date: '2021-09-02',
    name: '业务指标',
    value: 0,
  },
  {
    date: '2021-09-03',
    name: '业务指标',
    value: 0,
  },
  {
    date: '2021-09-04',
    name: '业务指标',
    value: 0,
  },
  {
    date: '2021-09-05',
    name: '业务指标',
    value: 0,
  },
  {
    date: '2021-09-06',
    name: '业务指标',
    value: 0,
  },
  {
    date: '2021-09-07',
    name: '业务指标',
    value: 0,
  },
  {
    date: '2021-09-08',
    name: '业务指标',
    value: 0,
  },
  {
    date: '2021-09-09',
    name: '业务指标',
    value: 0,
  },
  {
    date: '2021-09-10',
    name: '业务指标',
    value: 0,
  },
  {
    date: '2021-09-11',
    name: '业务指标',
    value: 0,
  },
  {
    date: '2021-09-12',
    name: '业务指标',
    value: 0,
  },
  {
    date: '2021-09-13',
    name: '业务指标',
    value: 1,
  },
  {
    date: '2021-09-14',
    name: '业务指标',
    value: 0,
  },
  {
    date: '2021-09-15',
    name: '业务指标',
    value: 1,
  },
  {
    date: '2021-09-16',
    name: '业务指标',
    value: 0,
  },
  {
    date: '2021-09-17',
    name: '业务指标',
    value: 0,
  },
  {
    date: '2021-09-18',
    name: '业务指标',
    value: 0,
  },
  {
    date: '2021-09-19',
    name: '业务指标',
    value: 0,
  },
  {
    date: '2021-09-20',
    name: '业务指标',
    value: 0,
  },
  {
    date: '2021-09-21',
    name: '业务指标',
    value: 0,
  },
  {
    date: '2021-09-22',
    name: '业务指标',
    value: 0,
  },
  {
    date: '2021-09-23',
    name: '业务指标',
    value: 0,
  },
  {
    date: '2021-09-24',
    name: '业务指标',
    value: 0,
  },
  {
    date: '2021-09-01',
    name: '接口数据核查',
    value: 0,
  },
  {
    date: '2021-09-02',
    name: '接口数据核查',
    value: 0,
  },
  {
    date: '2021-09-03',
    name: '接口数据核查',
    value: 0,
  },
  {
    date: '2021-09-04',
    name: '接口数据核查',
    value: 0,
  },
  {
    date: '2021-09-05',
    name: '接口数据核查',
    value: 0,
  },
  {
    date: '2021-09-06',
    name: '接口数据核查',
    value: 0,
  },
  {
    date: '2021-09-07',
    name: '接口数据核查',
    value: 0,
  },
  {
    date: '2021-09-08',
    name: '接口数据核查',
    value: 0,
  },
  {
    date: '2021-09-09',
    name: '接口数据核查',
    value: 0,
  },
  {
    date: '2021-09-10',
    name: '接口数据核查',
    value: 0,
  },
  {
    date: '2021-09-11',
    name: '接口数据核查',
    value: 0,
  },
  {
    date: '2021-09-12',
    name: '接口数据核查',
    value: 0,
  },
  {
    date: '2021-09-13',
    name: '接口数据核查',
    value: 0,
  },
  {
    date: '2021-09-14',
    name: '接口数据核查',
    value: 0,
  },
  {
    date: '2021-09-15',
    name: '接口数据核查',
    value: 0,
  },
  {
    date: '2021-09-16',
    name: '接口数据核查',
    value: 0,
  },
  {
    date: '2021-09-17',
    name: '接口数据核查',
    value: 0,
  },
  {
    date: '2021-09-18',
    name: '接口数据核查',
    value: 0,
  },
  {
    date: '2021-09-19',
    name: '接口数据核查',
    value: 0,
  },
  {
    date: '2021-09-20',
    name: '接口数据核查',
    value: 0,
  },
  {
    date: '2021-09-21',
    name: '接口数据核查',
    value: 0,
  },
  {
    date: '2021-09-22',
    name: '接口数据核查',
    value: 1,
  },
  {
    date: '2021-09-23',
    name: '接口数据核查',
    value: 0,
  },
  {
    date: '2021-09-24',
    name: '接口数据核查',
    value: 0,
  },
  {
    date: '2021-09-01',
    name: '主站系统运行',
    value: 0,
  },
  {
    date: '2021-09-02',
    name: '主站系统运行',
    value: 0,
  },
  {
    date: '2021-09-03',
    name: '主站系统运行',
    value: 0,
  },
  {
    date: '2021-09-04',
    name: '主站系统运行',
    value: 0,
  },
  {
    date: '2021-09-05',
    name: '主站系统运行',
    value: 0,
  },
  {
    date: '2021-09-06',
    name: '主站系统运行',
    value: 0,
  },
  {
    date: '2021-09-07',
    name: '主站系统运行',
    value: 0,
  },
  {
    date: '2021-09-08',
    name: '主站系统运行',
    value: 0,
  },
  {
    date: '2021-09-09',
    name: '主站系统运行',
    value: 0,
  },
  {
    date: '2021-09-10',
    name: '主站系统运行',
    value: 0,
  },
  {
    date: '2021-09-11',
    name: '主站系统运行',
    value: 0,
  },
  {
    date: '2021-09-12',
    name: '主站系统运行',
    value: 0,
  },
  {
    date: '2021-09-13',
    name: '主站系统运行',
    value: 0,
  },
  {
    date: '2021-09-14',
    name: '主站系统运行',
    value: 0,
  },
  {
    date: '2021-09-15',
    name: '主站系统运行',
    value: 0,
  },
  {
    date: '2021-09-16',
    name: '主站系统运行',
    value: 0,
  },
  {
    date: '2021-09-17',
    name: '主站系统运行',
    value: 0,
  },
  {
    date: '2021-09-18',
    name: '主站系统运行',
    value: 0,
  },
  {
    date: '2021-09-19',
    name: '主站系统运行',
    value: 0,
  },
  {
    date: '2021-09-20',
    name: '主站系统运行',
    value: 0,
  },
  {
    date: '2021-09-21',
    name: '主站系统运行',
    value: 1,
  },
  {
    date: '2021-09-22',
    name: '主站系统运行',
    value: 0,
  },
  {
    date: '2021-09-23',
    name: '主站系统运行',
    value: 0,
  },
  {
    date: '2021-09-24',
    name: '主站系统运行',
    value: 0,
  },
  {
    date: '2021-09-01',
    name: 'KAFKA消费',
    value: 0,
  },
  {
    date: '2021-09-02',
    name: 'KAFKA消费',
    value: 0,
  },
  {
    date: '2021-09-03',
    name: 'KAFKA消费',
    value: 0,
  },
  {
    date: '2021-09-04',
    name: 'KAFKA消费',
    value: 0,
  },
  {
    date: '2021-09-05',
    name: 'KAFKA消费',
    value: 0,
  },
  {
    date: '2021-09-06',
    name: 'KAFKA消费',
    value: 0,
  },
  {
    date: '2021-09-07',
    name: 'KAFKA消费',
    value: 0,
  },
  {
    date: '2021-09-08',
    name: 'KAFKA消费',
    value: 0,
  },
  {
    date: '2021-09-09',
    name: 'KAFKA消费',
    value: 0,
  },
  {
    date: '2021-09-10',
    name: 'KAFKA消费',
    value: 0,
  },
  {
    date: '2021-09-11',
    name: 'KAFKA消费',
    value: 0,
  },
  {
    date: '2021-09-12',
    name: 'KAFKA消费',
    value: 0,
  },
  {
    date: '2021-09-13',
    name: 'KAFKA消费',
    value: 0,
  },
  {
    date: '2021-09-14',
    name: 'KAFKA消费',
    value: 0,
  },
  {
    date: '2021-09-15',
    name: 'KAFKA消费',
    value: 1,
  },
  {
    date: '2021-09-16',
    name: 'KAFKA消费',
    value: 0,
  },
  {
    date: '2021-09-17',
    name: 'KAFKA消费',
    value: 0,
  },
  {
    date: '2021-09-18',
    name: 'KAFKA消费',
    value: 0,
  },
  {
    date: '2021-09-19',
    name: 'KAFKA消费',
    value: 0,
  },
  {
    date: '2021-09-20',
    name: 'KAFKA消费',
    value: 0,
  },
  {
    date: '2021-09-21',
    name: 'KAFKA消费',
    value: 0,
  },
  {
    date: '2021-09-22',
    name: 'KAFKA消费',
    value: 0,
  },
  {
    date: '2021-09-23',
    name: 'KAFKA消费',
    value: 0,
  },
  {
    date: '2021-09-24',
    name: 'KAFKA消费',
    value: 0,
  },
];

const issuedata = [
  {
    id: '1437342791630413825',
    date: '2021-09-13 17:10:00',
    type: '正常',
    total: 149120,
    sjsj: '2021-09-13 00:00:00',
    flag: false,
  },
  {
    id: '1437342791668162561',
    date: '2021-09-13 17:10:00',
    type: '无上行报文',
    total: 20469,
    sjsj: '2021-09-13 00:00:00',
    flag: false,
  },
  {
    id: '1437342791689134082',
    date: '2021-09-13 17:10:00',
    type: '前置未返回',
    total: 11868,
    sjsj: '2021-09-13 00:00:00',
    flag: false,
  },
  {
    id: '1437342791714299905',
    date: '2021-09-13 17:10:00',
    type: '否认',
    total: 5226,
    sjsj: '2021-09-13 00:00:00',
    flag: false,
  },
  {
    id: '1437342791731077121',
    date: '2021-09-13 17:10:00',
    type: '超时',
    total: 1112,
    sjsj: '2021-09-13 00:00:00',
    flag: false,
  },
  {
    id: '1437342791747854338',
    date: '2021-09-13 17:10:00',
    type: '设备离线',
    total: 924,
    sjsj: '2021-09-13 00:00:00',
    flag: false,
  },
  {
    id: '1437342791764631554',
    date: '2021-09-13 17:10:00',
    type: '报文出错',
    total: 168,
    sjsj: '2021-09-13 00:00:00',
    flag: false,
  },
];

const CPUdatas = [
  {
    type: 'CPU',
    expected: 100,
    name: '238.54.142.91',
    rate: 81,
    startdate: '2021-10-01 00:00:00',
    enddate: '2021-10-03 23:59:59',
  },
  {
    type: 'CPU',
    expected: 100,
    name: '213.113.16.141',
    rate: 90,
    startdate: '2021-10-01 00:00:00',
    enddate: '2021-10-03 23:59:59',
  },
  {
    type: 'CPU',
    expected: 100,
    name: '178.116.21.161',
    rate: 60,
    startdate: '2021-10-01 00:00:00',
    enddate: '2021-10-03 23:59:59',
  },
  {
    type: 'CPU',
    expected: 100,
    name: '78.247.130.67',
    rate: 82,
    startdate: '2021-10-01 00:00:00',
    enddate: '2021-10-03 23:59:59',
  },
  {
    type: 'CPU',
    expected: 100,
    name: '72.14.153.133',
    rate: 78,
    startdate: '2021-10-01 00:00:00',
    enddate: '2021-10-03 23:59:59',
  },
];

// 饼图数据
const Donutdata = [
  { type: '博联', value: 600, startdate: '2021-10-03 00:00:00', enddate: '2021-10-03 23:59:59' },
  { type: '南瑞', value: 200, startdate: '2021-10-03 00:00:00', enddate: '2021-10-02 23:59:59' },
];

const Donutdata2 = [
  { type: '计划发布', value: 151 },
  { type: '临时发布', value: 200 },
];

function StatisticsAnalysis(props) {
  const {
    dispatch,
    statpieArr,
    loading,
    statisticData,
    statsSumdata,
    lineArr,
    statratioArr
  } = props;
  console.log(statratioArr, 'statratioArr')
  const [selectedTags, setSelectedTags] = useState([]);
  const [picval, setPicVal] = useState({});
  const [bardata, setBardata] = useState([]);
  const [toplist, setToplist] = useState([]);
  console.log('toplist: ', toplist);

  const handleChang = (tag, checked) => {
    if (checked) {
      setSelectedTags([tag]);
    }
  };

  const getlist = () => {
    dispatch({
      type: 'qualityassessment/fetchstatsRatio',
      payload: {
        beginTime: '2021-03-01',
        endTime: '2021-09-01',
        type: 'LIST',
      },
    });
  };

  const projectAssessment = () => {
    dispatch({
      type: 'qualityassessment/fetchstatsSum',
      payload: {
        beginTime: '2021-03-01',
        endTime: '2021-09-01',
      },
    });
  };

  useEffect(() => {
    getlist();
    projectAssessment();
  }, []);

  console.log(statratioArr, 'statratioArr')

  useEffect(() => {
    if (statsSumdata && statsSumdata.length > 0) {
      const result = JSON.parse(JSON.stringify(statsSumdata).replace(/assessScore/g, '分值'));
      setBardata(result);
    }
  }, [loading]);

  console.log(statpieArr, 'statpieArr');

  useEffect(() => {
    dispatch({
      type: 'problemstatistics/fetchstatpieData',
      payload: { begin: '2021-08-01 00:00:00', end: '2021-09-01 00:00:00' },
    });
    dispatch({
      type: 'problemstatistics/fetchstatratioData',
      payload: { begin: '2021-08-01 00:00:00', end: '2021-09-01 00:00:00' },
    });
  }, []);
  return (
    <div>
      <SelectTime ChangeDate={v => console.log(v)} />
  

      <Row style={{ marginTop: 24 }}>
        <Col span={8}>
          <Card onMouseDown={() => setPicVal({})}>
            <DonutPCT
              data={Donutdata2}
              height={300}
              total="351"
              totaltitle="程序问题总数"
              padding={[10, 30, 10, 30]}
              onGetVal={v => {
                console.log('饼图', v);
                setPicVal({ ...picval, dutyUnit: v });
              }}
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
                onGetVal={v => {
                  setPicVal({ ...picval, type: v });
                  console.log('曲线图', v);
                }}
              />
            )}
          </Card>
        </Col>
      </Row>

      <Row style={{ marginTop: 24 }}>
        <Col span={8}>
          <Card onMouseDown={() => setPicVal({})}>
            <DonutPCT
              data={Donutdata2}
              height={300}
              total="351"
              totaltitle="功能问题总数"
              padding={[10, 30, 10, 30]}
              onGetVal={v => {
                console.log('饼图', v);
                setPicVal({ ...picval, dutyUnit: v });
              }}
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
                onGetVal={v => {
                  setPicVal({ ...picval, type: v });
                  console.log('曲线图', v);
                }}
              />
            )}
          </Card>
        </Col>
      </Row>

      <Row style={{ marginTop: 24 }}>
        <div className={styles.statisticscard}>
          <Avatar icon="cluster" />
          <b>问题来源统计分析</b>
        </div>
        <Col span={8}>
          <Card onMouseDown={() => setPicVal({})}>
            <DonutPCT
              data={Donutdata}
              height={300}
              totaltitle="问题总数"
              total="550"
              padding={[10, 30, 10, 30]}
              onGetVal={v => {
                console.log('发布工单责任单位情况:饼图', v);
                setPicVal({ ...picval, dutyUnit: v });
              }}
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
                onGetVal={v => {
                  console.log('发布工单责任单位情况：曲线图', v);
                  setPicVal({ ...picval, type: v });
                }}
              />
            )}
          </Card>
        </Col>
      </Row>

      <Row style={{ marginTop: 24 }}>
        <div className={styles.statisticscard}>
          <Avatar icon="cluster" />
          <b>问题来源统计分析</b>
        </div>
        <Col span={8}>
          <Card onMouseDown={() => setPicVal({})}>
            <DonutPCT
              data={Donutdata}
              height={300}
              totaltitle="问题总数"
              total="550"
              padding={[10, 30, 10, 30]}
              onGetVal={v => {
                console.log('发布工单责任单位情况:饼图', v);
                setPicVal({ ...picval, dutyUnit: v });
              }}
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
                onGetVal={v => {
                  console.log('发布工单责任单位情况：曲线图', v);
                  setPicVal({ ...picval, type: v });
                }}
              />
            )}
          </Card>
        </Col>
      </Row>

      <Row style={{ marginTop: 24 }}>
        <Col span={8}>
          <ChartCard title="问题工单超时情况">
            <Donut
              data={Donutdatatwo}
              height={300}
              total="1161"
              padding={[10, 30, 10, 30]}
              detailParams={newdata => {
                showDetaillist(newdata, 'donut');
              }}
            />
          </ChartCard>
        </Col>

        <Col span={16}>
          <ChartCard title="问题工单超时情况">
            {Smoothdata && (
              <SmoothLine
                data={Smoothdata}
                height={300}
                padding={[30, 0, 50, 60]}
                onGetVal={v => {
                  console.log('发布工单责任单位情况：曲线图', v);
                  setPicVal({ ...picval, type: v });
                }}
              />
            )}
          </ChartCard>
        </Col>
      </Row>

      <Row style={{ marginTop: 24 }}>
        <Col span={20}>
          <Donut
            data={Donutdatatwo}
            height={300}
            total="1161"
            padding={[10, 30, 10, 30]}
            detailParams={newdata => {
              showDetaillist(newdata, 'donut');
            }}
          />
        </Col>
        <Col span={16}>
          <ChartCard title="问题登记单位Top5">
            <Col span={20}>
              {Smoothdata && (
                <SmoothLine
                  data={Smoothdata}
                  height={300}
                  padding={[30, 0, 50, 60]}
                  onGetVal={v => {
                    console.log('发布工单责任单位情况：曲线图', v);
                    setPicVal({ ...picval, type: v });
                  }}
                />
              )}
            </Col>


            <Col span={4} style={{ zIndex: 1000 }}>
              <Select defaultValue="5">
                <Option value="5">5</Option>
                <Option value="10">10</Option>
                <Option value="15">15</Option>
                <Option value="20">20</Option>
              </Select>
            </Col>

          </ChartCard>
        </Col>

      </Row>


      <Row style={{ marginTop: 24 }}>
        <Col span={24}>
          {/* <ChartCard title='项目考核情况'> */}
          <Barchart
            data={bardata}
            title="项目考核情况"
            // position='contractName*分值'
            xField="分值"
            yField="contractName"
            colors="l(270) 0:#04e8ff 0.5:#05bdfe 1:#05bdfe"
          // height={315}
          // detailParams={newdata => { showDetaillist(newdata, 'barchart') }}
          />
          {/* </ChartCard> */}
        </Col>
      </Row>
    </div>
  );
}

export default connect(({ problemstatistics, qualityassessment, loading }) => ({
  statpieArr: problemstatistics.statpieArr,
  lineArr: problemstatistics.lineArr,
  statratioArr: problemstatistics.statratioArr,
  statisticData: qualityassessment.statisticData,
  statsSumdata: qualityassessment.statsSumdata,
  // loading: loading.models.alarmovervies,
  loading: loading.models.qualityassessment,
}))(StatisticsAnalysis);
