import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Row, Col, Avatar, Select, Empty } from 'antd';
import { ChartCard } from '@/components/Charts';
import StatisticsCard from '@/components/StatisticsCard';
import SelectTime from '@/components/SelectTime/SelectTime';
import DonutPCT from '@/components/CustomizeCharts/DonutPCT';
import SmoothLine from '@/components/CustomizeCharts/SmoothLine';
import Cylinder from '@/components/CustomizeCharts/Cylinder';
import ColumnarY from '@/components/CustomizeCharts/ColumnarY';
import styles from '../../Problemmanage/index.less';
import Donut from '@/components/CustomizeCharts/Donut';
import Barchart from '@/components/CustomizeCharts/Barchart';

const { Option } = Select;
const cols = {
  rate: {
    // alias: '%',
    // tickCount: 10,
  },
};


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

// 饼图数据
const Donutdata = [
  { type: '博联', value: 600, startdate: '2021-10-03 00:00:00', enddate: '2021-10-03 23:59:59' },
  { type: '南瑞', value: 200, startdate: '2021-10-03 00:00:00', enddate: '2021-10-02 23:59:59' },
];

const Donutdata2 = [
  { type: '计划发布', value: 151 },
  { type: '临时发布', value: 200 },
];

const test = [
  {
    type: '按时处理',
    value: 1
  },
  {
    type: '超时处理',
    value: 5
  }
]

function EventAnalysis(props) {
  const {
    dispatch,
    statpieArr,
    loading,
    statisticData,
    statsSumdata,
    lineArr,
    statratioArr,
    timeoutArr,
    getHandlerTopdata,
    getTypeConditionsdata,
    getTypeConditionsdatalineChart,
  } = props;
  console.log(getTypeConditionsdata, 'getTypeConditionsdata')
  console.log(getTypeConditionsdatalineChart, 'getTypeConditionsdatalineChart')
  const [selectedTags, setSelectedTags] = useState([]);
  const [picval, setPicVal] = useState({});
  const [bardata, setBardata] = useState([]);
  const [toplist, setToplist] = useState([]);
  const [type, setType] = useState([]);
  const [timeoutdata, setTimeoutdata] = useState([])

  const piesum = (arr) => {
    let sum = 0;
    if (arr && arr.length > 0) {
      arr.forEach(item => {
        sum += item.value;
      });
    };
    return sum
  };

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


  // console.log(statpieArr, 'statpieArr')

  const dataCylinder = datas => {
    const newArr = [];
    if (!Array.isArray(datas)) {
      return newArr;
    }
    for (let i = 0; i < datas.length; i += 1) {
      const vote = {};
      vote.name = datas[i].type;
      vote.rate = datas[i].value;
      vote.type = '环节';
      newArr.push(vote);
    }
    return newArr;
  };

  // console.log(dataCylinder(statpieArr['问题登记人TOP']))

  useEffect(() => {
    const result = [];
    const typeresult = [];
    let timeoutList = [];
    let changeType = []
    if (loading === false) {
      const obj1 = {
        // total: statratioArr.total,
        // resolved: statratioArr.resolved,
        // rate: statratioArr.Rate,
        type: '已解决',
        value: statratioArr.resolved,
        // value:'60%',
      }
      const obj2 = {
        // total: statratioArr.total,
        // resolved: statratioArr.resolved,
        // rate: statratioArr.Rate,
        type: '未解决',
        value: statratioArr.total - statratioArr.resolved,
      }
      const obj3 = {
        // total: statratioArr.total,
        // program: statratioArr.program,
        // function: statratioArr.function,
        // rate: statratioArr.Rate,
        type: '功能问题',
        value: statratioArr.function,
      }

      const obj4 = {
        // total: statratioArr.total,
        // program: statratioArr.program,
        // function: statratioArr.function,
        // rate: statratioArr.Rate,
        type: '程序问题',
        value: statratioArr.program,
      }
      result.push(obj1, obj2);
      typeresult.push(obj3, obj4);
      // timeoutList = JSON.parse(JSON.stringify(timeoutArr)
      //   .replace(/statName/g, 'type')
      //   .replace(/statCount/g, 'value')
      //   // .replace(/second_object/g, 'field3')
      //   // .replace(/last_num/g, 'field4')
      //   // .replace(/now_num/g, 'field5')
      //   // .replace(/points_count/g, 'field6')
      // );
      timeoutList = timeoutArr.map(item => {
        return {
          type: item.statName,
          value: Number(item.statCount)
        }
      })

      setTimeoutdata(timeoutList)
      setToplist(result);
      setType(typeresult)

    }
  }, [loading])

  useEffect(() => {
    if (statsSumdata && statsSumdata.length > 0) {
      const result = JSON.parse(JSON.stringify(statsSumdata).replace(/assessScore/g, '分值'));
      setBardata(result);
    }
  }, [loading]);

  const getHandlerTop = () => {
    dispatch({
      type: 'eventstatistics/fetchgetHandlerTop',
      payload: { startTime: moment().startOf('month').format('YYYY-MM-DD 00:00:00'), endTime: moment(moment().endOf('month').format('YYYY-MM-DD 23:59:59')) }
    })
  }

  const getTypeConditions = () => {
    dispatch({
      type: 'eventstatistics/fetchgetTypeConditions',
      payload: {
        type: 'MONTH',
        startTime: moment().startOf('month').format('YYYY-MM-DD 00:00:00'),
        endTime: moment().endOf('month').format('YYYY-MM-DD 23:59:59')
      }
    })
  }

  useEffect(() => {
    // getHandlerTop()
    getTypeConditions()
    dispatch({
      type: 'problemstatistics/fetchstatpieData',
      payload: { begin: '2021-08-01 00:00:00', end: '2021-09-01 00:00:00' },
    });
    dispatch({
      type: 'problemstatistics/fetchstatratioData',
      payload: { begin: '2021-08-01 00:00:00', end: '2021-09-01 00:00:00' },
    });
    dispatch({
      type: 'problemstatistics/fetchlineData',
      payload: { begin: '2021-08-01 00:00:00', end: '2021-09-01 00:00:00' },
    });
    dispatch({
      type: 'problemstatistics/timeoutLists',
      payload: { statTimeBegin: '2021-08-01 00:00:00', statTimeEnd: '2021-09-01 00:00:00' }
    })
  }, []);

  return (
    <div>
      {
        loading === false && (
          <>
            <SelectTime ChangeDate={v => console.log(v)} />
            <Row style={{ marginTop: 24 }}>
              {([statratioArr] || []).map((obj, index) => {
                return (
                  <Row key={index} style={{ marginTop: 10 }}>
                    <div className={styles.statisticscard}>
                      <Avatar icon='desktop' />
                      <b>问题工单情况</b>
                    </div>

                    <Col span={8}>
                      <StatisticsCard title='问题总数' value={obj.total} suffix='单' des='环比' type={Number(obj.total) > Number(obj.prevResolved) ? 'up' : 'down'} />
                    </Col>
                    <Col span={8}>
                      <StatisticsCard title='已解决' value={obj.resolved} suffix='单' des='环比' type={Number(obj.resolved) > Number(obj.prevResolved) ? 'up' : 'down'} />
                    </Col>
                    <Col span={8}>
                      <StatisticsCard title='解决率' value={obj.Rate} suffix='%' des='环比' type={Number(obj.totalScore) > Number(obj.prevTotalScore) ? 'up' : 'down'} />
                    </Col>
                  </Row>
                )
              })}

              {([statratioArr] || []).map((obj, index) => {
                return (
                  <Row key={index} style={{ marginTop: 10 }}>
                    <div className={styles.statisticscard}>
                      <Avatar icon='desktop' />
                      <b>问题分类情况</b>
                    </div>

                    <Col span={12}>
                      <StatisticsCard title='程序问题' value={obj.program} suffix='单' des='环比' type={Number(obj.program) > Number(obj.prevProgram) ? 'up' : 'down'} />
                    </Col>
                    <Col span={12}>
                      <StatisticsCard title='功能问题' value={obj.function} suffix='单' des='环比' type={Number(obj.function) > Number(obj.prevFunction) ? 'up' : 'down'} />
                    </Col>

                  </Row>
                )
              })}

            </Row>


            {/* 问题分类总情况 */}
            <Row style={{ marginTop: 24 }}>
              <div className={styles.statisticscard}>
                <Avatar icon="cluster" />
                <b>问题工单总情况</b>
              </div>
              <Col span={8}>
                <Card onMouseDown={() => setPicVal({})}>
                  <DonutPCT
                    data={toplist}
                    height={300}
                    total={statratioArr.total}
                    totaltitle="问题总数"
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
                      data={lineArr && lineArr['问题工单量趋势']}
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

            {/* 问题分类统计分析 */}
            {/* 问题分类总情况 */}
            <Row style={{ marginTop: 24 }}>
              <div className={styles.statisticscard}>
                <Avatar icon="cluster" />
                <b>问题分类统计分析</b>
              </div>
              <Col span={8}>
                <Card onMouseDown={() => setPicVal({})}>
                  <DonutPCT
                    data={type}
                    height={300}
                    total={statratioArr.total}
                    totaltitle="问题总数"
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
                      data={lineArr && lineArr['问题分类总趋势']}
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

            {/* 程序问题情况 */}
            <Row style={{ marginTop: 24 }}>
              <Col span={8}>
                <Card onMouseDown={() => setPicVal({})}>
                  <DonutPCT
                    // data={Donutdata}
                    data={statpieArr && statpieArr['程序问题情况']}
                    height={300}
                    total={piesum(statpieArr && statpieArr['程序问题情况'])}
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
                  {lineArr && lineArr['程序问题趋势'] && (
                    <SmoothLine
                      // data={Smoothdata}
                      data={lineArr && lineArr['程序问题趋势']}
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

            {/* 功能问题情况 */}
            <Row style={{ marginTop: 24 }}>
              <Col span={8}>
                <Card onMouseDown={() => setPicVal({})}>
                  <DonutPCT
                    data={statpieArr && statpieArr['程序问题情况']}
                    height={300}
                    // total={piesum( statpieArr && statpieArr['程序问题情况'])}
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
                      data={lineArr && lineArr['程序问题趋势']}
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
                    data={statpieArr && statpieArr['问题来源统计分析']}
                    height={300}
                    total={piesum(statpieArr && statpieArr['问题来源统计分析'])}
                    totaltitle="问题总数"
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
                  {lineArr && lineArr['问题来源'] && (
                    <SmoothLine
                      data={lineArr && lineArr['问题来源']}
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

            <Row style={{ marginTop: 24 }} gutter={16}>
              <Col span={8}>
                <div className={styles.statisticscard}>
                  <Avatar icon="cluster" />
                  <b>问题工单超时情况</b>
                </div>
                <Card onMouseDown={() => setPicVal({})}>
                  <DonutPCT
                    data={timeoutdata}
                    height={300}
                    total={piesum(timeoutdata)}
                    totaltitle="问题总数"
                    padding={[10, 30, 10, 30]}
                    onGetVal={v => {
                      console.log('饼图', v);
                      setPicVal({ ...picval, dutyUnit: v });
                    }}
                  />
                </Card>
              </Col>

              <Col span={16}>
                <div className={styles.statisticscard}>
                  <Avatar icon="share-alt" />
                  <b>问题登记人Top5</b>
                </div>
                <Card onMouseDown={() => setPicVal({})} style={{ marginLeft: '-1px' }}>
                  {statpieArr && statpieArr['问题登记人TOP'] && statpieArr['问题登记人TOP'].length === 0 && <Empty style={{ height: '300px' }} />}
                  {statpieArr && statpieArr['问题登记人TOP'] && statpieArr['问题登记人TOP'].length > 0 && (
                    <Cylinder
                      height={300}
                      data={dataCylinder(statpieArr && statpieArr['问题登记人TOP'])}
                      padding={[0, 50, 30, 150]}
                      symbol=""
                      cols={cols}
                      colors="l(270) 0:#04e8ff 0.5:#05bdfe 1:#05bdfe"
                      onGetVal={(v) => { setPicVal({ ...picval, type: v }); }}
                    />
                    // <Barchart
                    //   data={statpieArr['问题登记人TOP']}
                    //   position='type*value'
                    // // height={315}
                    // // detailParams={newdata => { showDetaillist(newdata, 'barchart') }}
                    // />

                  )}
                </Card>
              </Col>
            </Row>

            <Row style={{ marginTop: 24 }}>
              <Col span={8}>
                <div className={styles.statisticscard}>
                  <Avatar icon="share-alt" />
                  <b>问题处理人Top5</b>
                </div>
                <ChartCard>
                  {statpieArr && statpieArr['问题处理人Top'] && statpieArr['问题处理人Top'].length === 0 && <Empty style={{ height: '300px' }} />}
                  {statpieArr && statpieArr['问题处理人Top'] && statpieArr['问题处理人Top'].length > 0 && (
                    <Cylinder
                      height={300}
                      data={dataCylinder(statpieArr && statpieArr['问题处理人Top'])}
                      padding={[0, 50, 30, 150]}
                      symbol=""
                      cols={cols}
                      colors="l(270) 0:#04e8ff 0.5:#05bdfe 1:#05bdfe"
                      onGetVal={(v) => { setPicVal({ ...picval, type: v }); }}
                    />
                    // <Barchart
                    //   data={statpieArr['问题处理人Top']}
                    //   position='type*value'
                    // // height={315}
                    // // detailParams={newdata => { showDetaillist(newdata, 'barchart') }}
                    // />
                  )}
                </ChartCard>
              </Col>

              <Col span={16}>
                <div className={styles.statisticscard}>
                  <Avatar icon="share-alt" />
                  <b>需求申请单位Top5</b>
                </div>
                <ChartCard>
                  {statpieArr && statpieArr['问题登记人TOP'] && statpieArr['问题登记人TOP'].length === 0 && <Empty style={{ height: '300px' }} />}
                  {statpieArr && statpieArr['问题登记人TOP'] && statpieArr['问题登记人TOP'].length > 0 && (
                    <Cylinder
                      height={300}
                      data={dataCylinder(statpieArr && statpieArr['问题登记人TOP'])}
                      padding={[0, 50, 30, 150]}
                      symbol=""
                      cols={cols}
                      colors="l(270) 0:#04e8ff 0.5:#05bdfe 1:#05bdfe"
                      onGetVal={(v) => { setPicVal({ ...picval, type: v }); }}
                    />
                  )}
                </ChartCard>
              </Col>
            </Row>

            <Row style={{ marginTop: 24 }}>
              <ChartCard title="问题登记单位Top5">
                <Col span={16} style={{ zIndex: 1000 }}>
                  {statpieArr && statpieArr['问题登记单位TOP'] && statpieArr['问题登记单位TOP'].length === 0 && <Empty style={{ height: '300px' }} />}
                  {statpieArr && statpieArr['问题登记单位TOP'] && statpieArr['问题登记单位TOP'].length > 0 && (
                    <Cylinder
                      height={300}
                      data={dataCylinder(statpieArr && statpieArr['问题登记单位TOP'])}
                      padding={[0, 50, 30, 150]}
                      symbol=""
                      cols={cols}
                      colors="l(270) 0:#04e8ff 0.5:#05bdfe 1:#05bdfe"
                      onGetVal={(v) => { setPicVal({ ...picval, type: v }); }}
                    />
                  )}
                </Col>
              </ChartCard>
            </Row>

          </>
        )
      }

    </div>
  );
}

export default connect(({ problemstatistics, eventstatistics, qualityassessment, loading }) => ({
  statpieArr: problemstatistics.statpieArr,
  lineArr: problemstatistics.lineArr,
  statratioArr: problemstatistics.statratioArr,
  statisticData: qualityassessment.statisticData,
  statsSumdata: qualityassessment.statsSumdata,
  getHandlerTopdata: eventstatistics.getHandlerTopdata, //   统计分析接口
  getTypeConditionsdatalineChart: eventstatistics.getTypeConditionsdatalineChart, //   统计分析接口
  loading: loading.models.problemstatistics,
  timeoutArr: problemstatistics.timeoutArr
}))(EventAnalysis);
