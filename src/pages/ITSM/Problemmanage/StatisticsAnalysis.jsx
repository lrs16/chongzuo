import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import {
  Card,
  Row,
  Col,
  Avatar,
  Empty,
  Spin,
  InputNumber,
} from 'antd';
import moment from 'moment';
import SelectTime from '@/components/SelectTime/SelectTime';
import SmoothLine from '@/components/CustomizeCharts/SmoothLine';
import DonutPCT from '../Eventmanage/Eventstatistics/DonutPCT';
import StatisticsCard from '../Eventmanage/Eventstatistics/StatisticsCard';
import ColumnarY from '../Eventmanage/Eventstatistics/ColumnarY';
import AnalysisPopup from './AnalysisPopup';
import styles from './index.less';

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
    handlerunitarr,
  } = props;
  const [picval, setPicVal] = useState({});
  const [toplist, setToplist] = useState([]);
  const [type, setType] = useState([]);
  const [timeoutdata, setTimeoutdata] = useState([])
  const [values, setValues] = useState({});
  const [topN, setTopN] = useState(5) // 排序
  const [topN1, setTopN1] = useState(5) // 排序
  const [topN2, setTopN2] = useState(5) // 排序
  const [topN3, setTopN3] = useState(5) // 排序
  const [visible, setVisible] = useState(false);
  const [typeName, setTypename] = useState('');
  const [title, setTitle] = useState('');

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
    if (loading === false) {
      const obj1 = {
        type: '已解决',
        value: statratioArr.resolved,
      }
      const obj2 = {
        type: '未解决',
        value: statratioArr.total - statratioArr.resolved,
      }
      const obj3 = {
        type: '功能问题',
        value: statratioArr.function,
      }

      const obj4 = {
        type: '程序问题',
        value: statratioArr.program,
      }
      result.push(obj1, obj2);
      typeresult.push(obj3, obj4);
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

  const statpieData = (value) => {
    dispatch({
      type: 'problemstatistics/fetchstatpieData',
      payload: { ...value },
    });
  }

  const statratioData = (value) => {
    dispatch({
      type: 'problemstatistics/fetchstatratioData',
      payload: { ...value },
    });
  }

  const lineData = (value) => {
    dispatch({
      type: 'problemstatistics/fetchlineData',
      payload: { ...value },
    });
  }

  const timeoutarr = (value) => {
    dispatch({
      type: 'problemstatistics/timeoutLists',
      payload: {
        statTimeBegin: value.begin,
        statTimeEnd: value.end
      }
    })
  }

  // 分开的TOP
  const resgisterstatTop = (value) => {
    dispatch({
      type: 'problemstatistics/fetchresgisterstatTop',
      payload: {
        ...value,
        type: '登记人'
      }
    })
  }

  const handlerstatTop = (value) => {
    dispatch({
      type: 'problemstatistics/fetchhandlerstatTop',
      payload: {
        ...value,
        type: '处理人'
      }
    })
  }
  const resgisterunitstatTop = (value) => {
    dispatch({
      type: 'problemstatistics/fetchresgisterunitstatTop',
      payload: {
        ...value,
        type: '登记单位'
      }
    })
  }
  const handleunitstatTop = (value) => {
    dispatch({
      type: 'problemstatistics/fetchhandleunitstatTop',
      payload: {
        ...value,
        type: '处理单位'
      }
    })
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
                        <Avatar icon='tags' />
                        <b>问题工单情况</b>
                      </div>
                      <Col span={8}>
                        <StatisticsCard
                          title='问题总数'
                          value={obj.total}
                          desval={`${obj && obj.totalRingRatio}`}
                          suffix='单'
                          des='环比'
                          type={Number(obj.total) > Number(obj.prevResolved) ? 'up' : 'down'}
                          onGetVal={() => {
                            setPicVal({
                              model: '工单情况',
                              begin: values.beginTime,
                              end: values.endTime,
                              type: 'all'
                            });
                            setTimeout(() => {
                              setVisible(true)
                            },100)
                            setTitle('问题总数')
                          }}
                        />
                      </Col>

                      <Col span={8}>
                        <StatisticsCard
                          title='已解决'
                          value={obj.resolved}
                          desval={`${obj && obj.resolvedRingRatio}`}
                          suffix='单'
                          des='环比'
                          type={Number(obj.resolved) > Number(obj.prevResolved) ? 'up' : 'down'}
                          onGetVal={() => {
                            setPicVal({
                              model: '工单情况',
                              begin: values.beginTime,
                              end: values.endTime,
                              type: '已解决'
                            });
                            setTimeout(() => {
                              setVisible(true)
                            },100)
                            setTitle('已解决')
                          }}
                        />
                      </Col>

                      <Col span={8}>
                        <StatisticsCard
                          title='解决率'
                          value={obj.rate}
                          desval={`${obj && obj.rateRingRatio}%`}
                          suffix='%'
                          des='环比'
                          type={Number(obj.totalScore) > Number(obj.prevTotalScore) ? 'up' : 'down'}
                          onGetVal={() => { }}
                        />
                      </Col>
                    </Row>
                  </Col>

                  <Col span={8}>
                    <Row>
                      <div className={styles.statisticscard}>
                        <Avatar icon='layout' />
                        <b>问题分类情况</b>
                      </div>

                      <Col span={12}>
                        <StatisticsCard
                          title='程序问题'
                          value={obj.program}
                          desval={`${obj && obj.programRingRatio}`}
                          suffix='单'
                          des='环比'
                          type={Number(obj.program) > Number(obj.prevProgram) ? 'up' : 'down'}
                          onGetVal={(v) => {
                            setPicVal({
                              model: '问题分类',
                              begin: values.beginTime,
                              end: values.endTime,
                              type: '程序问题'
                            });
                            setTimeout(() => {
                              setVisible(true)
                            },100)
                            setTitle('程序问题')
                          }}
                        />
                      </Col>
                      <Col span={12}>
                        <StatisticsCard
                          title='功能问题'
                          value={obj.function}
                          desval={`${obj && obj.functionRingRatio}`}
                          suffix='单'
                          des='环比'
                          type={Number(obj.function) > Number(obj.prevFunction) ? 'up' : 'down'}
                          onGetVal={() => {
                            setPicVal({
                              model: '问题分类',
                              begin: values.beginTime,
                              end: values.endTime,
                              type: '功能问题'
                            });
                            setTimeout(() => {
                              setVisible(true)
                            },100)
                            setTitle('功能问题')
                          }}
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              )
            })}

            {/* 问题分类总情况 */}
            <Row style={{ marginTop: 24 }} gutter={24}>
              <div className={styles.statisticscard}>
                <Avatar icon="hdd" />
                <b>问题工单总情况</b>
              </div>
              <Col span={8}>
                <Card onMouseDown={() => setPicVal({})}>
                  <h4 style={{ fontWeight: 'bold' }}>问题处理情况占比</h4>
                  {toplist && toplist.length === 0 && <Empty style={{ height: '300px' }} />}
                  {toplist && toplist.length > 0 && (
                    <>
                      <DonutPCT
                        data={toplist}
                        height={300}
                        total={statratioArr && statratioArr.total}
                        totaltitle="问题处理总数"
                        padding={[10, 30, 10, 30]}
                        onGetVal={v => {
                          setPicVal({
                            model: '工单情况',
                            begin: values.beginTime,
                            end: values.endTime,
                            type: v === 'center' ? 'all' : v.type
                          });
                          setTimeout(() => {
                            setVisible(true)
                          },100)
                          setTitle(v === 'center' ? '问题处理总数' : v.type)
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
                        if (moment(values.beginTime).format('YYYY-MM-DD') === moment(values.endTime).format('YYYY-MM-DD')) {
                          setPicVal({
                            model: '工单情况',
                            type: '问题工单',
                            begin: `${moment(values.beginTime).format('YYYY-MM-DD')} ${v.date}:00:00`,
                            end: `${moment(values.endTime).format('YYYY-MM-DD')} ${v.date}:59:59`,
                          });
                          setTimeout(() => {
                            setVisible(true)
                          },100)
                        } else {
                          setPicVal({
                            model: '工单情况',
                            type: '问题工单',
                            begin: `${v.date} 00:00:00`,
                            end: `${v.date} 23:59:59`,
                          });
                          setVisible(true)
                        }
                        setTitle(v.name)
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
                <Avatar icon="code" />
                <b>问题分类统计分析</b>
              </div>
              <Col span={8}>
                <Card onMouseDown={() => setPicVal({})}>
                  <h4 style={{ fontWeight: 'bold' }}>问题分类总情况</h4>
                  {type && type.length === 0 && <Empty style={{ height: '300px' }} />}
                  {type && type.length > 0 && (
                    <>
                      <DonutPCT
                        data={type}
                        height={300}
                        total={statratioArr && (statratioArr.function + statratioArr.program)}
                        totaltitle="问题分类总数"
                        padding={[10, 30, 10, 30]}
                        onGetVal={v => {
                          setPicVal({
                            model: '问题分类',
                            begin: values.beginTime,
                            end: values.endTime,
                            type: v === 'center' ? 'all' : v.type
                          });
                          setTimeout(() => {
                            setVisible(true)
                          },100)
                          setTitle(v === 'center' ? '问题分类总数' : v.type)
                        }}
                      />
                    </>
                  )}
                </Card>
              </Col>

              <Col span={16}>
                <Card onMouseDown={() => setPicVal({})} style={{ marginLeft: '-1px' }}>
                  <h4 style={{ fontWeight: 'bold' }}>问题分类总趋势</h4>
                  {lineArr && lineArr['问题分类总趋势'] && lineArr['问题分类总趋势'].length === 0 && <Empty style={{ height: '300px' }} />}
                  {lineArr && lineArr['问题分类总趋势'] && lineArr['问题分类总趋势'].length > 0 && (
                    <>
                      <SmoothLine
                        data={lineArr && lineArr['问题分类总趋势']}
                        height={300}
                        padding={[30, 0, 50, 60]}
                        onGetVal={v => {
                          if (moment(values.beginTime).format('YYYY-MM-DD') === moment(values.endTime).format('YYYY-MM-DD')) {
                            setPicVal({
                              model: '问题分类',
                              type: v.name,
                              begin: `${moment(values.beginTime).format('YYYY-MM-DD')} ${v.date}:00:00`,
                              end: `${moment(values.endTime).format('YYYY-MM-DD')} ${v.date}:59:59`,
                            });
                            setTimeout(() => {
                              setVisible(true)
                            },100)
                          } else {
                            setPicVal({
                              model: '问题分类',
                              type: v.name,
                              begin: `${v.date} 00:00:00`,
                              end: `${v.date} 23:59:59`,
                            });
                            setVisible(true)
                          }
                          setTitle(v.name)
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
                  <h4 style={{ fontWeight: 'bold' }}>程序问题情况</h4>
                  {statpieArr && statpieArr['程序问题情况'] && statpieArr['程序问题情况'].length === 0 && <Empty style={{ height: '300px' }} />}
                  {statpieArr && statpieArr['程序问题情况'] && statpieArr['程序问题情况'].length > 0 && (
                    <>
                      <DonutPCT
                        data={statpieArr && statpieArr['程序问题情况']}
                        height={300}
                        total={piesum(statpieArr && statpieArr['程序问题情况'])}
                        totaltitle="程序问题总数"
                        padding={[10, 30, 10, 30]}
                        onGetVal={v => {
                          setPicVal({
                            model: '程序问题',
                            begin: values.beginTime,
                            end: values.endTime,
                            type: v === 'center' ? 'all' : v.type
                          });
                          setTimeout(() => {
                            setVisible(true)
                          },100)
                          setTitle(v === 'center' ? '程序问题总数' : v.type)
                        }}
                      />
                    </>
                  )}
                </Card>
              </Col>

              <Col span={16}>
                <Card onMouseDown={() => setPicVal({})} style={{ marginLeft: '-1px' }}>
                  <h4 style={{ fontWeight: 'bold' }}>程序问题趋势</h4>
                  {lineArr && lineArr['程序问题趋势'] && lineArr['程序问题趋势'].length === 0 && <Empty style={{ height: '300px' }} />}
                  {lineArr && lineArr['程序问题趋势'] && lineArr['程序问题趋势'].length > 0 && (
                    <>
                      {lineArr && lineArr['程序问题趋势'] && (
                        <SmoothLine
                          data={lineArr && lineArr['程序问题趋势']}
                          height={300}
                          padding={[30, 0, 50, 60]}
                          onGetVal={v => {
                            if (moment(values.beginTime).format('YYYY-MM-DD') === moment(values.endTime).format('YYYY-MM-DD')) {
                              setPicVal({
                                model: '程序问题',
                                type: v.name,
                                begin: `${moment(values.beginTime).format('YYYY-MM-DD')} ${v.date}:00:00`,
                                end: `${moment(values.endTime).format('YYYY-MM-DD')} ${v.date}:59:59`,
                              });
                              setTimeout(() => {
                                setVisible(true)
                              },100)
                            } else {
                              setPicVal({
                                model: '程序问题',
                                type: v.name,
                                begin: `${v.date} 00:00:00`,
                                end: `${v.date} 23:59:59`,
                              });
                              setTimeout(() => {
                                setVisible(true)
                              },100)
                            }
                            setTitle(v.name)
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
                  <h4 style={{ fontWeight: 'bold' }}>功能问题情况</h4>
                  {statpieArr && statpieArr['功能问题情况'] && statpieArr['功能问题情况'].length === 0 && <Empty style={{ height: '300px' }} />}
                  {statpieArr && statpieArr['功能问题情况'] && statpieArr['功能问题情况'].length > 0 && (
                    <>
                      <DonutPCT
                        data={statpieArr && statpieArr['功能问题情况']}
                        height={300}
                        total={piesum(statpieArr && statpieArr['功能问题情况'])}
                        totaltitle="功能问题总数"
                        padding={[10, 30, 10, 30]}
                        onGetVal={v => {
                          setPicVal({
                            model: '功能问题',
                            begin: values.beginTime,
                            end: values.endTime,
                            type: v === 'center' ? 'all' : v.type
                          });
                          setTimeout(() => {
                            setVisible(true)
                          },100)
                          setTitle(v === 'center' ? '功能问题总数' : v.type)
                        }}
                      />
                    </>
                  )}
                </Card>
              </Col>

              <Col span={16}>
                <Card onMouseDown={() => setPicVal({})} style={{ marginLeft: '-1px' }}>
                  <h4 style={{ fontWeight: 'bold' }}>功能问题趋势</h4>
                  {lineArr && lineArr['功能问题趋势'] && lineArr['功能问题趋势'].length === 0 && <Empty style={{ height: '300px' }} />}
                  {lineArr && lineArr['功能问题趋势'] && lineArr['功能问题趋势'].length > 0 && (
                    <>
                      <SmoothLine
                        data={lineArr && lineArr['功能问题趋势']}
                        height={300}
                        padding={[30, 0, 50, 60]}
                        onGetVal={v => {
                          if (moment(values.beginTime).format('YYYY-MM-DD') === moment(values.endTime).format('YYYY-MM-DD')) {
                            setPicVal({
                              model: '功能问题',
                              type: v.name,
                              begin: `${moment(values.beginTime).format('YYYY-MM-DD')} ${v.date}:00:00`,
                              end: `${moment(values.endTime).format('YYYY-MM-DD')} ${v.date}:59:59`,
                            });
                            setTimeout(() => {
                              setVisible(true)
                            },100)
                          } else {
                            setPicVal({
                              model: '功能问题',
                              type: v.name,
                              begin: `${v.date} 00:00:00`,
                              end: `${v.date} 23:59:59`,
                            });
                            setTimeout(() => {
                              setVisible(true)
                            },100)
                          }
                          setTitle(v.name)
                        }}
                      />
                    </>
                  )}
                </Card>
              </Col>
            </Row>

            <Row style={{ marginTop: 24 }} gutter={24}>
              <div className={styles.statisticscard}>
                <Avatar icon="bank" />
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
                      totaltitle="问题来源总数"
                      padding={[10, 30, 10, 30]}
                      onGetVal={v => {
                        setPicVal({
                          model: '问题来源',
                          begin: values.beginTime,
                          end: values.endTime,
                          type: v === 'center' ? 'all' : v.type
                        });
                        setTimeout(() => {
                          setVisible(true)
                        },100)
                        setTitle(v === 'center' ? '问题来源总数' : v.type)
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
                        if (moment(values.beginTime).format('YYYY-MM-DD') === moment(values.endTime).format('YYYY-MM-DD')) {
                          setPicVal({
                            model: '问题来源',
                            type: v.name,
                            begin: `${moment(values.beginTime).format('YYYY-MM-DD')} ${v.date}:00:00`,
                            end: `${moment(values.endTime).format('YYYY-MM-DD')} ${v.date}:59:59`,
                          });
                          setTimeout(() => {
                            setVisible(true)
                          },100)
                        } else {
                          setPicVal({
                            model: '问题来源',
                            type: v.name,
                            begin: `${v.date} 00:00:00`,
                            end: `${v.date} 23:59:59`,
                          });
                          setTimeout(() => {
                            setVisible(true)
                          },100)
                        }
                        setTitle(v.name)
                      }}
                    />
                  )}
                </Card>
              </Col>
            </Row>

            <Row style={{ marginTop: 24 }} gutter={24}>
              <Col span={12}>
                <div className={styles.statisticscard}>
                  <Avatar icon="appstore" />
                  <b>问题处理及时率</b>
                </div>
                <Card onMouseDown={() => setPicVal({})}>
                  {timeoutdata && timeoutdata.length === 0 && <Empty style={{ height: '300px' }} />}
                  {timeoutdata && timeoutdata.length > 0 && (
                    <DonutPCT
                      data={timeoutdata}
                      height={300}
                      total={piesum(timeoutdata)}
                      totaltitle="处理及时率总数"
                      padding={[10, 30, 10, 30]}
                      onGetVal={v => {
                        let timeStatus;
                        switch (v.type) {
                          case '按时处理':
                            timeStatus = '0';
                            break;
                          case '即将超时':
                            timeStatus = '1';
                            break;
                          case '已超时':
                            timeStatus = '2';
                            break;
                          default:
                            break;
                        }
                        setPicVal({
                          addTimeBegin: values.beginTime,
                          addTimeEnd: values.endTime,
                          timeStatus: v === 'center' ? '3' : timeStatus
                        });
                        setTypename('问题工单超时情况')
                        setTimeout(() => {
                          setVisible(true)
                        },100)
                        setTitle(v === 'center' ?'问题处理总数':v.type)
                      }}
                    />
                  )}
                </Card>
              </Col>

              <Col span={12}>
                <div className={styles.statisticscard}>
                  <Avatar icon="build" />
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
                          onGetVal={v => {
                            setPicVal({
                              model: '登记人',
                              begin: values.beginTime,
                              end: values.endTime,
                              type: v.type
                            });
                            setTimeout(() => {
                              setVisible(true)
                            },100)
                            setTitle(v.type)
                          }}
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
                  <Avatar icon="codepen" />
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
                          onGetVal={v => {
                            setPicVal({
                              model: '处理人',
                              begin: values.beginTime,
                              end: values.endTime,
                              type: v.type
                            });
                            setTimeout(() => {
                              setVisible(true)
                            },100)
                            setTitle(v.type)
                          }}
                        />
                      </Col>
                    </>
                  )}
                </Card>
              </Col>

              <Col span={12}>
                <div className={styles.statisticscard}>
                  <Avatar icon="interaction" />
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
                          padding={[30, 60, 50, 200]}
                          cols={Issuedscale}
                          onGetVal={v => {
                            setPicVal({
                              model: '登记单位',
                              begin: values.beginTime,
                              end: values.endTime,
                              type: v.type
                            });
                            setTimeout(() => {
                              setVisible(true)
                            },100)
                            setTitle(v.type)
                          }}
                        />
                      </Col>
                    </>
                  )}
                </Card>
              </Col>
            </Row>

            <AnalysisPopup
              visible={visible}
              typeName={typeName}
              title={title}
              popupParameters={picval}
              closePop={() => { setVisible(false); setTypename('') }}
            />
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
