import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import {
  Card,
  Row,
  Col,
  Avatar,
  Select,
  Empty,
  Input,
  Spin,
  InputNumber
} from 'antd';
import moment from 'moment';
import StatisticsCard from '../../ITSM/Eventmanage/eventstatistics/StatisticsCard';
import SelectTime from '@/components/SelectTime/SelectTime';
import DonutPCT from '@/components/CustomizeCharts/DonutPCT';
import SmoothLine from '@/components/CustomizeCharts/SmoothLine';
import Cylinder from '@/components/CustomizeCharts/Cylinder';
import ColumnarY from '../Eventmanage/eventstatistics/ColumnarY';
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

let defaultNum1 = 5;
let defaultNum2 = 5;
let defaultNum3 = 5;
let defaultNum4 = 5;

function StatisticsAnalysis(props) {
  const {
    dispatch,
    statpieArr,
    loading,
    lineArr,
    statratioArr,
    timeoutArr,
    resgisterarr,
    handlerarr,
    resgisterunitarr,
    handlerunitarr
  } = props;
  const [picval, setPicVal] = useState({});
  const [bardata, setBardata] = useState([]);
  const [toplist, setToplist] = useState([]);
  const [type, setType] = useState([]);
  const [timeoutdata, setTimeoutdata] = useState([])
  const [values, setValues] = useState({});
  const [topN, setTopN] = useState(5) // 排序
  const [topN1, setTopN1] = useState(5) // 排序
  const [topN2, setTopN2] = useState(5) // 排序
  const [topN3, setTopN3] = useState(5) // 排序

  const Issuedscale = {
    total: {
      type: 'linear',
      alias: '返回结果数量',
      min: 0,
      tickInterval: 100,
    },
  };

  const piesum = (arr) => {
    let sum = 0;
    if (arr && arr.length > 0) {
      arr.forEach(item => {
        sum += item.value;
      });
    };
    return sum
  };

  // const dataCylinder = datas => {
  //   const newArr = [];
  //   if (!Array.isArray(datas)) {
  //     return newArr;
  //   }
  //   for (let i = 0; i < datas.length; i += 1) {
  //     const vote = {};
  //     vote.name = datas[i].type;
  //     vote.rate = datas[i].value;
  //     vote.type = '环节';
  //     newArr.push(vote);
  //   }
  //   return newArr;
  // };

  const dataCylinder = (datas) => { // 柱状图集成数组
    const newArr = [];
    if (!Array.isArray(datas) || datas.length === 0) {
      return newArr;
    }
    for (let i = 0; datas.length < topN ? i < datas.length : i < topN; i += 1) {
      const vote = {};
      vote.type = datas[i].type;
      vote.total = datas[i].value;
      vote.expected = datas[0].value;
      newArr.push(vote);
    }
    return newArr.reverse();
  };

  const dataCylinder1 = (datas) => { // 柱状图集成数组
    const newArr = [];
    if (!Array.isArray(datas) || datas.length === 0) {
      return newArr;
    }
    for (let i = 0; datas.length < topN1 ? i < datas.length : i < topN1; i += 1) {
      const vote = {};
      vote.type = datas[i].type;
      vote.total = datas[i].value;
      vote.expected = datas[0].value;
      newArr.push(vote);
    }
    return newArr.reverse();
  };
  const dataCylinder2 = (datas) => { // 柱状图集成数组
    const newArr = [];
    if (!Array.isArray(datas) || datas.length === 0) {
      return newArr;
    }
    for (let i = 0; datas.length < topN2 ? i < datas.length : i < topN2; i += 1) {
      const vote = {};
      vote.type = datas[i].type;
      vote.total = datas[i].value;
      vote.expected = datas[0].value;
      newArr.push(vote);
    }
    return newArr.reverse();
  };
  const dataCylinder3 = (datas) => { // 柱状图集成数组
    const newArr = [];
    if (!Array.isArray(datas) || datas.length === 0) {
      return newArr;
    }
    for (let i = 0; datas.length < topN3 ? i < datas.length : i < topN3; i += 1) {
      const vote = {};
      vote.type = datas[i].type;
      vote.total = datas[i].value;
      vote.expected = datas[0].value;
      newArr.push(vote);
    }
    return newArr.reverse();
  };

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
      // timeoutList = timeoutArr.map(item => {
      //   return {
      //     type: item.statName,
      //     value: Number(item.statCount)
      //   }
      // })
      timeoutList = timeoutArr.filter(item => {
        return item.statName !== '合计'
      }).map(items => {
        return {
          type: items.statName,
          value: Number(items.statCount)
        }
      })
      setTimeoutdata(timeoutList)
      setToplist(result);
      setType(typeresult)

    }
  }, [loading])

  useEffect(() => {
    defaultNum1 = '';
    defaultNum2 = '';
    defaultNum3 = '';
    defaultNum4 = '';
  }, [])

  const dataAssigneetimeout = datas => {
    const newArr = [];
    if (!Array.isArray(datas) || datas.length === 0) {
      return newArr;
    }
    for (let i = 0; datas.length < topN ? i < datas.length : i < topN; i += 1) {
      const vote = {};
      vote.name = datas[i].name;
      vote.rate = datas[i].value;
      vote.expected = datas[0].value;
      newArr.push(vote);
    }
    return newArr.reverse();
  };

  const handleInput = (val) => {
    setTopN(val)
  };


  const statpieData = (values) => {
    dispatch({
      type: 'problemstatistics/fetchstatpieData',
      payload: { ...values },
    });
  }

  const statratioData = (values) => {
    console.log('values111: ', values);
    dispatch({
      type: 'problemstatistics/fetchstatratioData',
      payload: { ...values },
    });
  }

  const lineData = (values) => {
    dispatch({
      type: 'problemstatistics/fetchlineData',
      payload: { ...values },
    });
  }

  const timeoutarr = (values) => {
    dispatch({
      type: 'problemstatistics/timeoutLists',
      payload: { ...values }
    })
  }

  // 分开的TOP
  const resgisterstatTop = (values) => {
    dispatch({
      type: 'problemstatistics/fetchresgisterstatTop',
      payload: {
        ...values,
        type: '登记人'
      }
    })
  }

  const handlerstatTop = (values) => {
    dispatch({
      type: 'problemstatistics/fetchhandlerstatTop',
      payload: {
        ...values,
        type: '处理人'
      }
    })
  }
  const resgisterunitstatTop = (values) => {
    dispatch({
      type: 'problemstatistics/fetchresgisterunitstatTop',
      payload: {
        ...values,
        type: '登记单位'
      }
    })
  }
  const handleunitstatTop = (values) => {
    dispatch({
      type: 'problemstatistics/fetchhandleunitstatTop',
      payload: {
        ...values,
        type: '处理单位'
      }
    })
  }

  const selectOnchange = (e, type) => {
    switch (type) {
      case 'registrant':
        defaultNum1 = e;
        resgisterstatTop({
          begin: moment(values.beginTime).format('YYYY-MM-DD 00:00:00'),
          end: moment(values.endTime).format('YYYY-MM-DD 23:59:59'),
          n: e
        });
        break;
      case 'handler':
        defaultNum2 = e;
        handlerstatTop({
          begin: moment(values.beginTime).format('YYYY-MM-DD 00:00:00'),
          end: moment(values.endTime).format('YYYY-MM-DD 23:59:59'),
          n: e
        });
        break;
      case 'registrationunit':
        defaultNum3 = e;
        resgisterunitstatTop({
          begin: moment(values.beginTime).format('YYYY-MM-DD 00:00:00'),
          end: moment(values.endTime).format('YYYY-MM-DD 23:59:59'),
          n: e
        });
        break;
      case 'handlerunit':
        defaultNum4 = e;
        getHandleUnitTop({
          begin: moment(values.beginTime).format('YYYY-MM-DD 00:00:00'),
          end: moment(values.endTime).format('YYYY-MM-DD 23:59:59'),
          n: e
        });
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    if (values && values.type) {
      const val = {
        begin: moment(values.beginTime).format('YYYY-MM-DD 00:00:00'),
        end: moment(values.endTime).format('YYYY-MM-DD 23:59:59'),
        type: values.type,
        n: 1000
      }
      statpieData(val);
      statratioData(val);
      lineData(val);
      timeoutarr(val);
      resgisterstatTop(val);
      handlerstatTop(val);
      resgisterunitstatTop(val);
      handleunitstatTop(val);
    }
  }, [values]);

  return (
    <div>
      <SelectTime ChangeDate={(v) => setValues(v)} />

      {loading !== false && (
        <div style={{ textAlign: 'center' }}>
          <Spin />
        </div>
      )}

      {
        loading === false && (
          <>
            {([statratioArr] || []).map((obj, index) => {
              return (
                <Row key={index} style={{ marginTop: 10 }} gutter={24}>
                  <Col span={16}>
                    <Row>
                      <div className={styles.statisticscard}>
                        <Avatar icon='desktop' />
                        <b>问题工单情况</b>
                      </div>
                      <Col span={8}>
                        <StatisticsCard title='问题总数' value={obj.total} desval={`${obj && obj.totalRingRatio}`} suffix='单' des='环比' type={Number(obj.total) > Number(obj.prevResolved) ? 'up' : 'down'} />
                      </Col>
                      <Col span={8}>
                        <StatisticsCard title='已解决' value={obj.resolved} desval={`${obj && obj.resolvedRingRatio}`} suffix='单' des='环比' type={Number(obj.resolved) > Number(obj.prevResolved) ? 'up' : 'down'} />
                      </Col>
                      <Col span={8}>
                        <StatisticsCard title='解决率' value={obj.Rate} desval={`${obj && obj.rate}`} suffix='%' des='环比' type={Number(obj.totalScore) > Number(obj.prevTotalScore) ? 'up' : 'down'} />
                      </Col>
                    </Row>
                  </Col>

                  <Col span={8}>
                    <Row>
                      <div className={styles.statisticscard}>
                        <Avatar icon='desktop' />
                        <b>问题分类情况</b>
                      </div>

                      <Col span={12}>
                        <StatisticsCard title='程序问题' value={obj.program} desval={`${obj && obj.programRingRatio}`} suffix='单' des='环比' type={Number(obj.program) > Number(obj.prevProgram) ? 'up' : 'down'} />
                      </Col>
                      <Col span={12}>
                        <StatisticsCard title='功能问题' value={obj.function} desval={`${obj && obj.functionRingRatio}`} suffix='单' des='环比' type={Number(obj.function) > Number(obj.prevFunction) ? 'up' : 'down'} />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              )
            })}

            {/* 问题分类总情况 */}
            <Row style={{ marginTop: 24 }} gutter={24}>
              <div className={styles.statisticscard}>
                <Avatar icon="cluster" />
                <b>问题工单总情况</b>
              </div>
              <Col span={8}>
                <Card onMouseDown={() => setPicVal({})}>
                  {toplist && toplist.length === 0 && <Empty style={{ height: '300px' }} />}
                  {toplist && toplist.length > 0 && (
                    <>
                      <h4 style={{ fontWeight: 'bold' }}>问题处理情况占比</h4>
                      <DonutPCT
                        data={toplist}
                        height={300}
                        total={statratioArr && statratioArr.total}
                        totaltitle="问题总数"
                        padding={[10, 30, 10, 30]}
                        onGetVal={v => {
                          console.log('饼图', v);
                          setPicVal({ ...picval, dutyUnit: v });
                        }}
                      />
                    </>
                  )}

                </Card>
              </Col>
              <Col span={16}>
                <Card onMouseDown={() => setPicVal({})} style={{ marginLeft: '-1px' }}>
                  <h4 style={{ fontWeight: 'bold' }}>问题工单量趋势</h4>
                  {lineArr && lineArr['问题工单量趋势'] && lineArr['问题工单量趋势'].length === 0 && <Empty style={{ height: '300px' }} />}
                  {lineArr && lineArr['问题工单量趋势'] && lineArr['问题工单量趋势'].length > 0 && (
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
            <Row style={{ marginTop: 24 }} gutter={24}>
              <div className={styles.statisticscard}>
                <Avatar icon="cluster" />
                <b>问题分类统计分析</b>
              </div>
              <Col span={8}>
                <Card onMouseDown={() => setPicVal({})}>
                  {type && type.length === 0 && <Empty style={{ height: '300px' }} />}
                  {type && type.length > 0 && (
                    <>
                      <h4 style={{ fontWeight: 'bold' }}>问题分类总情况</h4>
                      <DonutPCT
                        data={type}
                        height={300}
                        total={statratioArr && statratioArr.total}
                        totaltitle="问题总数"
                        padding={[10, 30, 10, 30]}
                        onGetVal={v => {
                          console.log('饼图', v);
                          setPicVal({ ...picval, dutyUnit: v });
                        }}
                      />
                    </>
                  )}
                </Card>
              </Col>

              <Col span={16}>
                <Card onMouseDown={() => setPicVal({})} style={{ marginLeft: '-1px' }}>
                  {lineArr && lineArr['问题分类总趋势'] && lineArr['问题分类总趋势'].length === 0 && <Empty style={{ height: '300px' }} />}
                  {lineArr && lineArr['问题分类总趋势'] && lineArr['问题分类总趋势'].length > 0 && (
                    <>
                      <h4 style={{ fontWeight: 'bold' }}>问题分类总趋势</h4>
                      <SmoothLine
                        data={lineArr && lineArr['问题分类总趋势']}
                        height={300}
                        padding={[30, 0, 50, 60]}
                        onGetVal={v => {
                          setPicVal({ ...picval, type: v });
                          console.log('曲线图', v);
                        }}
                      />
                    </>
                  )}
                </Card>
              </Col>
            </Row>

            {/* 程序问题情况 */}
            <Row style={{ marginTop: 24 }} gutter={24}>
              <Col span={8}>
                <Card onMouseDown={() => setPicVal({})}>
                  {statpieArr && statpieArr['程序问题情况'] && statpieArr['程序问题情况'].length === 0 && <Empty style={{ height: '300px' }} />}
                  {statpieArr && statpieArr['程序问题情况'] && statpieArr['程序问题情况'].length > 0 && (
                    <>
                      <h4 style={{ fontWeight: 'bold' }}>程序问题情况</h4>
                      <DonutPCT
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
                    </>
                  )}

                </Card>
              </Col>
              <Col span={16}>
                <Card onMouseDown={() => setPicVal({})} style={{ marginLeft: '-1px' }}>
                  {lineArr && lineArr['程序问题趋势'] && lineArr['程序问题趋势'].length === 0 && <Empty style={{ height: '300px' }} />}
                  {lineArr && lineArr['程序问题趋势'] && lineArr['程序问题趋势'].length > 0 && (
                    <>
                      <h4 style={{ fontWeight: 'bold' }}>程序问题趋势</h4>
                      {lineArr && lineArr['程序问题趋势'] && (
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
                    </>
                  )}

                </Card>
              </Col>
            </Row>

            {/* 功能问题情况 */}
            <Row style={{ marginTop: 24 }} gutter={24}>
              <Col span={8}>
                <Card onMouseDown={() => setPicVal({})}>
                  {statpieArr && statpieArr['功能问题情况'] && statpieArr['功能问题情况'].length === 0 && <Empty style={{ height: '300px' }} />}
                  {statpieArr && statpieArr['功能问题情况'] && statpieArr['功能问题情况'].length > 0 && (
                    <>
                      <h4 style={{ fontWeight: 'bold' }}>功能问题情况</h4>
                      <DonutPCT
                        data={statpieArr && statpieArr['功能问题情况']}
                        height={300}
                        total={piesum(statpieArr && statpieArr['功能问题情况'])}
                        totaltitle="功能问题总数"
                        padding={[10, 30, 10, 30]}
                        onGetVal={v => {
                          console.log('饼图', v);
                          setPicVal({ ...picval, dutyUnit: v });
                        }}
                      />
                    </>
                  )}

                </Card>
              </Col>
              <Col span={16}>
                <Card onMouseDown={() => setPicVal({})} style={{ marginLeft: '-1px' }}>
                  {lineArr && lineArr['功能问题趋势'] && lineArr['功能问题趋势'].length === 0 && <Empty style={{ height: '300px' }} />}
                  {lineArr && lineArr['功能问题趋势'] && lineArr['功能问题趋势'].length > 0 && (
                    <>
                      <h4 style={{ fontWeight: 'bold' }}>功能问题趋势</h4>
                      <SmoothLine
                        data={lineArr && lineArr['功能问题趋势']}
                        height={300}
                        padding={[30, 0, 50, 60]}
                        onGetVal={v => {
                          setPicVal({ ...picval, type: v });
                          console.log('曲线图', v);
                        }}
                      />
                    </>
                  )}

                </Card>
              </Col>
            </Row>

            <Row style={{ marginTop: 24 }} gutter={24}>
              <div className={styles.statisticscard}>
                <Avatar icon="cluster" />
                <b>问题来源统计分析</b>
              </div>
              <Col span={8}>
                <Card onMouseDown={() => setPicVal({})}>
                  {statpieArr && statpieArr['问题来源统计分析'] && statpieArr['问题来源统计分析'].length === 0 && <Empty style={{ height: '300px' }} />}
                  {statpieArr && statpieArr['问题来源统计分析'] && statpieArr['问题来源统计分析'].length > 0 && (
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
                  )}

                </Card>
              </Col>
              <Col span={16}>
                <Card onMouseDown={() => setPicVal({})} style={{ marginLeft: '-1px' }}>
                  {lineArr && lineArr['问题来源'] && lineArr['问题来源'].length === 0 && <Empty style={{ height: '300px' }} />}
                  {lineArr && lineArr['问题来源'] && lineArr['问题来源'].length > 0 && (
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

            <Row style={{ marginTop: 24 }} gutter={24}>
              <Col span={12}>
                <div className={styles.statisticscard}>
                  <Avatar icon="cluster" />
                  <b>问题工单超时情况</b>
                </div>
                <Card onMouseDown={() => setPicVal({})}>
                  {timeoutdata && timeoutdata.length === 0 && <Empty style={{ height: '300px' }} />}
                  {timeoutdata && timeoutdata.length > 0 && (
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
                  )}
                </Card>
              </Col>

              <Col span={12}>
                <div className={styles.statisticscard}>
                  <Avatar icon="share-alt" />
                  <b>问题登记人Top{topN}</b>
                  <div style={{ float: 'right' }} >n：<InputNumber defaultValue={5} onChange={v => setTopN(v)} /></div>
                </div>
                <Card onMouseDown={() => setPicVal({})} style={{ marginLeft: '-1px' }}>
                  {resgisterarr && resgisterarr.length === 0 && <Empty style={{ height: '300px' }} />}
                  {resgisterarr && resgisterarr.length > 0 && (
                    <>
                      <Col span={24}>
                        <ColumnarY
                          data={dataCylinder(resgisterarr)}
                          height={300}
                          padding={[30, 60, 50, 100]}
                          cols={Issuedscale}
                          onGetVal={(v) => { setPicVal({ ...picval, type: v }); console.log('Y向柱形图', v) }}
                        />
                      </Col>
                    </>
                  )}
                </Card>
              </Col>
            </Row>

            <Row style={{ marginTop: 24 }} gutter={24}>
              <Col span={12}>
                <div className={styles.statisticscard}>
                  <Avatar icon="share-alt" />
                  <b>问题处理人Top{topN1}</b>
                  <div style={{ float: 'right' }} >n：<InputNumber defaultValue={5} onChange={v => setTopN1(v)} /></div>
                </div>
                <Card>
                  {handlerarr && handlerarr.length === 0 && <Empty style={{ height: 300 }} />}
                  {handlerarr && handlerarr.length > 0 && (
                    <>
                      <Col span={24}>
                        <ColumnarY
                          height={300}
                          data={dataCylinder1(handlerarr)}
                          padding={[30, 60, 50, 100]}
                          cols={Issuedscale}
                          onGetVal={(v) => { setPicVal({ ...picval, type: v }); console.log('Y向柱形图', v) }}
                        />
                      </Col>
                    </>
                  )}
                </Card>
              </Col>

              <Col span={12}>
                <div className={styles.statisticscard}>
                  <Avatar icon="share-alt" />
                  <b>问题登记单位Top{topN2}</b>
                  <div style={{ float: 'right' }} >n：<InputNumber defaultValue={5} onChange={v => setTopN2(v)} /></div>
                </div>
                <Card>
                  {resgisterunitarr && resgisterunitarr.length === 0 && <Empty style={{ height: '300px' }} />}
                  {resgisterunitarr && resgisterunitarr.length > 0 && (
                    <>
                      <Col span={24}>
                        <ColumnarY
                          height={300}
                          data={dataCylinder2(resgisterunitarr)}
                          padding={[30, 60, 50, 100]}
                          cols={Issuedscale}
                          onGetVal={(v) => { setPicVal({ ...picval, type: v }); console.log('Y向柱形图', v) }}
                        />
                      </Col>
                    </>
                  )}
                </Card>
              </Col>
            </Row>

            <Row style={{ marginTop: 24 }} gutter={24}>
              <Col span={12} style={{ zIndex: 1000 }}>
                <div className={styles.statisticscard}>
                  <Avatar icon="share-alt" />
                  <b>问题处理单位Top{topN3}</b>
                  <div style={{ float: 'right' }} >n：<InputNumber defaultValue={5} onChange={v => setTopN3(v)} /></div>
                </div>
                <Card onMouseDown={() => setPicVal({})} style={{ marginLeft: '-1px' }}>
                  {handlerunitarr && handlerunitarr.length === 0 && <Empty style={{ height: '300px' }} />}
                  {handlerunitarr && handlerunitarr.length > 0 && (
                    <>
                      <Col span={24}>
                        <ColumnarY
                          height={300}
                          data={dataCylinder3(handlerunitarr)}
                          padding={[30, 60, 50, 100]}
                          cols={Issuedscale}
                          onGetVal={(v) => { setPicVal({ ...picval, type: v }); console.log('Y向柱形图', v) }}
                        />
                      </Col>
                    </>
                  )}
                </Card>
              </Col>
            </Row>
          </>
        )
      }
    </div>
  );
}

export default connect(({ problemstatistics, loading }) => ({
  statpieArr: problemstatistics.statpieArr,
  lineArr: problemstatistics.lineArr,
  statratioArr: problemstatistics.statratioArr,
  statToparr: problemstatistics.statToparr,
  resgisterarr: problemstatistics.resgisterarr,
  handlerarr: problemstatistics.handlerarr,
  resgisterunitarr: problemstatistics.resgisterunitarr,
  handlerunitarr: problemstatistics.handlerunitarr,
  loading: loading.models.problemstatistics,
  timeoutArr: problemstatistics.timeoutArr
}))(StatisticsAnalysis);
