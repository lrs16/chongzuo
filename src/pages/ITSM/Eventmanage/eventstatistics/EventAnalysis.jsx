import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Card,
  Row,
  Col,
  Avatar,
  Empty,
  Spin,
  InputNumber,
} from 'antd';
import SelectTime from '@/components/SelectTime/SelectTime';
import SmoothLine from '@/components/CustomizeCharts/SmoothLine';
import StatisticsCard from './StatisticsCard';
import DonutPCT from './DonutPCT';
import ColumnarY from './ColumnarY';
import AnalysisPopup from './AnalysisPopup';
import styles from '../../Problemmanage/index.less';

function EventAnalysis(props) {
  const {
    dispatch,
    loading,
    getObjectConditionsdata,
    getTypeConditionsdata,
    getTimeOutConditionsdata,
    getRegisterUserTopdata,
    getHandlerTopdata,
    getRegisterUnitTopdata,
    getHandleUnitTopdata,
    getOrderConditionsobj,
    getTimeoutHandlerToparr
  } = props;
  const [picval, setPicVal] = useState({});
  const [values, setValues] = useState({});
  const [topN, setTopN] = useState(5) // 排序
  const [topN1, setTopN1] = useState(5) // 排序
  const [topN2, setTopN2] = useState(5) // 排序
  const [topN3, setTopN3] = useState(5) // 排序
  const [topN4, setTopN4] = useState(5) // 排序
  const [visible, setVisible] = useState(false);
  const [typeName, setTypename] = useState('');
  const [title,setTitle] = useState('');

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
      vote.total = datas[i].total;
      vote.expected = datas[0].total;
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
      vote.total = datas[i].total;
      vote.expected = datas[0].total;
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
      vote.total = datas[i].total;
      vote.expected = datas[0].total;
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
      vote.total = datas[i].total;
      vote.expected = datas[0].total;
      newArr.push(vote);
    }
    return newArr.reverse();
  };
  const dataCylinder4 = (datas) => { // 柱状图集成数组
    const newArr = [];
    if (!Array.isArray(datas) || datas.length === 0) {
      return newArr;
    }
    for (let i = 0; datas.length < topN4 ? i < datas.length : i < topN4; i += 1) {
      const vote = {};
      vote.type = datas[i].type;
      vote.total = datas[i].total;
      vote.expected = datas[0].total;
      newArr.push(vote);
    }
    return newArr.reverse();
  };

  const getTypeConditions = (value) => {
    dispatch({
      type: 'eventstatistics/fetchgetTypeConditions',
      payload: { ...value }
    })
  }

  const getObjectConditions = (value) => {
    dispatch({
      type: 'eventstatistics/fetchgetObjectConditions',
      payload: { ...value }
    })
  }

  const getTimeOutConditions = (value) => {
    dispatch({
      type: 'eventstatistics/fetchgetTimeOutConditions',
      payload: { ...value }
    })
  }

  const getRegisterUserTop = (value) => {
    dispatch({
      type: 'eventstatistics/fetchgetRegisterUserTop',
      payload: { ...value }
    })
  }

  const getHandlerTop = (value) => {
    dispatch({
      type: 'eventstatistics/fetchgetHandlerTop',
      payload: { ...value }
    })
  }

  const getRegisterUnitTop = (value) => {
    dispatch({
      type: 'eventstatistics/fetchgetRegisterUnitTop',
      payload: { ...value }
    })
  }

  const getHandleUnitTop = (value) => {
    dispatch({
      type: 'eventstatistics/fetchgetHandleUnitTop',
      payload: { ...value }
    })
  }

  const getOrderConditions = (value) => {
    dispatch({
      type: 'eventstatistics/fetchgetOrderConditions',
      payload: { ...value }
    })
  }

  const getTimeoutHandlerTop = (value) => {
    dispatch({
      type:'eventstatistics/fetchgetTimeoutHandlerTop',
      payload:{...value}
    })
  }

  const Issuedscale = {
    total: {
      type: 'linear',
      alias: '返回结果数量',
      min: 0,
      tickInterval: 500,
    },
  };

  useEffect(() => {
    if (values && values.type) {
      const val = {
        time1: moment(values.beginTime).format('YYYY-MM-DD 00:00:00'),
        time2: moment(values.endTime).format('YYYY-MM-DD 23:59:59'),
        type: values.type === 'M' ? 'MONTH' : 'DAY',
        num: values.num || 1000
      }
      getTypeConditions(val);
      getObjectConditions(val);
      getTimeOutConditions(val);
      getRegisterUserTop(val);
      getHandlerTop(val);
      getRegisterUnitTop(val);
      getHandleUnitTop(val);
      getOrderConditions(val)
      getTimeoutHandlerTop(val)
    }
  }, [values])

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
            <>
              <Row style={{ marginTop: 10 }} gutter={24}>
                <Col
                  span={16}
                >
                  <div className={styles.statisticscard}>
                    <Avatar icon='deployment-unit' />
                    <b>事件工单总情况</b>
                  </div>
                  <Row>
                    <Col
                      span={4}
                      style={{ width: '20%' }}
                    >
                      <StatisticsCard
                        title='事件总数'
                        value={getOrderConditionsobj && getOrderConditionsobj.allNum}
                        suffix='单'
                        des='环比'
                        desval={`${getOrderConditionsobj && getOrderConditionsobj.allRingPoints}%`} type={Number((getOrderConditionsobj && getOrderConditionsobj.allRingPoints)) > 0 ? 'up' : 'down'}
                        onGetVal={() => {
                          setPicVal({
                            time1: values.beginTime,
                            time2: values.endTime,
                          });
                          setVisible(true)
                          setTitle('事件总数')
                        }}
                      />
                    </Col>

                    <Col
                      span={4}
                      style={{ width: '20%' }}
                    >
                      <StatisticsCard
                        title='已完成'
                        value={getOrderConditionsobj && getOrderConditionsobj.closeNum}
                        suffix='单'
                        des='环比'
                        desval={`${getOrderConditionsobj && getOrderConditionsobj.closeRingPoints}%`}
                        type={Number((getOrderConditionsobj && getOrderConditionsobj.closeRingPoints)) > 0 ? 'up' : 'down'}
                        onGetVal={() => {
                          setPicVal({
                            time1: values.beginTime,
                            time2: values.endTime,
                            eventStatus: '已关闭'
                          });
                          setVisible(true)
                          setTitle('已完成')
                        }}
                      />
                    </Col>

                    <Col
                      span={4}
                      style={{ width: '20%' }}
                    >
                      <StatisticsCard
                        title='未完成'
                        value={getOrderConditionsobj && getOrderConditionsobj.unCloseNum}
                        suffix='单'
                        des='环比'
                        desval={`${getOrderConditionsobj && getOrderConditionsobj.unCloseRingPoints}%`}
                        type={Number((getOrderConditionsobj && getOrderConditionsobj.unCloseRingPoints)) > 0 ? 'up' : 'down'}
                        onGetVal={() => {
                          setPicVal({
                            time1: values.beginTime,
                            time2: values.endTime,
                            eventStatus: '未完成'
                          });
                          setVisible(true);
                          setTitle('未完成')
                        }}
                      />
                    </Col>

                    <Col
                      span={4}
                      style={{ width: '20%' }}
                    >
                      <StatisticsCard
                        title='解决率'
                        value={getOrderConditionsobj && getOrderConditionsobj.point}
                        suffix='%'
                        des='环比'
                        desval={`${getOrderConditionsobj && getOrderConditionsobj.ringPoints}%`}
                        type={Number((getOrderConditionsobj && getOrderConditionsobj.ringPoints)) > 0 ? 'up' : 'down'}
                        onGetVal={() => { }}
                      />
                    </Col>

                    <Col
                      span={4}
                      style={{ width: '20%' }}
                    >
                      <StatisticsCard
                        title='及时率'
                        value={getOrderConditionsobj && getOrderConditionsobj.timeClosePoint}
                        suffix='%'
                        des='环比'
                        desval={`${getOrderConditionsobj && getOrderConditionsobj.timeClosePointRingPoints}%`}
                        type={Number((getOrderConditionsobj && getOrderConditionsobj.timeClosePointRingPoints)) > 0 ? 'up' : 'down'}
                        onGetVal={() => { }}
                      />
                    </Col>
                  </Row>
                </Col>

                <Col
                  span={8}
                >
                  <div className={styles.statisticscard}>
                    <Avatar icon='cluster' />
                    <b>一线解决事件单情况（客服）</b>
                  </div>
                  <Row>
                    <Col span={8}>
                      <StatisticsCard
                        title='受理总数'
                        value={getOrderConditionsobj && getOrderConditionsobj.allNum}
                        suffix='单'
                        des='环比'
                        desval={`${getOrderConditionsobj && getOrderConditionsobj.allRingPoints}%`}
                        type={Number((getOrderConditionsobj && getOrderConditionsobj.allRingPoints)) > 0 ? 'up' : 'down'}
                        onGetVal={() => {
                          setPicVal({
                            time1: values.beginTime,
                            time2: values.endTime,
                          });
                          setVisible(true)
                          setTitle('受理总数')
                        }}
                      />
                    </Col>
                    <Col span={8}>
                      <StatisticsCard
                        title='一线处理量'
                        value={getOrderConditionsobj && getOrderConditionsobj.selfHandleNum}
                        suffix='单'
                        des='环比'
                        desval={`${getOrderConditionsobj && getOrderConditionsobj.selfHandleNumRingPoints}%`}
                        type={Number((getOrderConditionsobj && getOrderConditionsobj.selfHandleRingPoints)) > 0 ? 'up' : 'down'}
                        onGetVal={() => {
                          setPicVal({
                            selfhandle: '是',
                            time1: values.beginTime,
                            time2: values.endTime,
                          });
                          setVisible(true);
                          setTitle('一线处理量')
                        }}
                      />
                    </Col>
                    <Col span={8}>
                      <StatisticsCard
                        title='一线解决率'
                        value={getOrderConditionsobj && getOrderConditionsobj.selfHandlePoint}
                        suffix='%'
                        des='环比'
                        desval={`${getOrderConditionsobj && getOrderConditionsobj.selfHandlePointRingPoints}%`}
                        type={Number((getOrderConditionsobj && getOrderConditionsobj.selfHandleRingPoints)) > 0 ? 'up' : 'down'}
                        onGetVal={() => { }}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </>

            {/* 问题分类总情况 */}
            <Row style={{ marginTop: 24 }} gutter={24}>
              <div className={styles.statisticscard}>
                <Avatar icon="robot" />
                <b>事件分类统计分析</b>
              </div>
              <Col span={8}>
                <Card onMouseDown={() => setPicVal({})}>
                  {getTypeConditionsdata && getTypeConditionsdata.pieChart && getTypeConditionsdata.pieChart.length === 0 && <Empty style={{ height: '300px' }} />}
                  {getTypeConditionsdata && getTypeConditionsdata.pieChart && getTypeConditionsdata.pieChart.length > 0 && (
                    <DonutPCT
                      data={getTypeConditionsdata && getTypeConditionsdata.pieChart}
                      height={300}
                      total={piesum(getTypeConditionsdata && getTypeConditionsdata.pieChart)}
                      totaltitle="事件分类总数"
                      padding={[10, 30, 10, 30]}
                      onGetVal={v => {
                        setPicVal({
                          eventType: v === 'center' ? '总数' : v.type,
                          time1: values.beginTime,
                          time2: values.endTime,
                        });
                        setTitle(v === 'center' ? '事件分类总数' : v.type);
                        setVisible(true)
                      }}
                    />
                  )}
                </Card>
              </Col>
              <Col span={16}>
                <Card onMouseDown={() => setPicVal({})} style={{ marginLeft: '-1px' }}>
                  {getTypeConditionsdata && getTypeConditionsdata.lineChart && getTypeConditionsdata.lineChart.length === 0 && <Empty style={{ height: '300px' }} />}
                  {getTypeConditionsdata && getTypeConditionsdata.lineChart && getTypeConditionsdata.lineChart.length > 0 && (
                    <SmoothLine
                      data={getTypeConditionsdata && getTypeConditionsdata.lineChart}
                      height={300}
                      padding={[30, 0, 50, 60]}
                      onGetVal={v => {
                        if (moment(values.beginTime).format('YYYY-MM-DD') === moment(values.endTime).format('YYYY-MM-DD')) {
                          setPicVal({
                            eventType: v.name,
                            time1: `${moment(values.beginTime).format('YYYY-MM-DD')} ${v.date}:00:00`,
                            time2: `${moment(values.endTime).format('YYYY-MM-DD')} ${v.date}:59:59`,
                          });
                          setVisible(true);
                          setTitle(v.name);
                        } else {
                          setPicVal({
                            eventType: v.name,
                            time1: `${v.date} 00:00:00`,
                            time2: `${v.date} 23:59:59`,
                          });
                          setVisible(true);
                          setTitle(v.name);
                        }
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
                <Avatar icon="barcode" />
                <b>事件对象统计分析</b>
              </div>
              <Col span={8}>
                <Card onMouseDown={() => setPicVal({})}>
                  {getObjectConditionsdata && getObjectConditionsdata.pieChart && getObjectConditionsdata.pieChart.length === 0 && <Empty style={{ height: '300px' }} />}
                  {getObjectConditionsdata && getObjectConditionsdata.pieChart && getObjectConditionsdata.pieChart.length > 0 && (
                    <DonutPCT
                      data={getObjectConditionsdata && getObjectConditionsdata.pieChart}
                      height={300}
                      total={piesum(getObjectConditionsdata && getObjectConditionsdata.pieChart)}
                      totaltitle="事件对象总数"
                      padding={[10, 30, 10, 30]}
                      onGetVal={v => {
                        const obj = {
                          time1: values.beginTime,
                          time2: values.endTime,
                        }
                        if (v === 'center') {
                          obj.eventObject = '总数'
                        } else {
                          obj.object = v.type;
                        }
                        setPicVal({
                          ...obj
                        });
                        setTypename(v === 'center' ? '' : '事件总数');
                        setVisible(true)
                        setTitle(v === 'center' ? '事件对象总数' : v.type)
                      }}
                    />
                  )}
                </Card>
              </Col>

              <Col span={16}>
                <Card onMouseDown={() => setPicVal({})} style={{ marginLeft: '-1px' }}>
                  {getObjectConditionsdata && getObjectConditionsdata.lineChart && getObjectConditionsdata.lineChart.length === 0 && <Empty style={{ height: '300px' }} />}
                  {getObjectConditionsdata && getObjectConditionsdata.lineChart && getObjectConditionsdata.lineChart.length > 0 && (
                    <SmoothLine
                      data={getObjectConditionsdata && getObjectConditionsdata.lineChart}
                      height={300}
                      padding={[30, 0, 50, 60]}
                      onGetVal={v => {
                        if (moment(values.beginTime).format('YYYY-MM-DD') === moment(values.endTime).format('YYYY-MM-DD')) {
                          setPicVal({
                            object: v.name,
                            time1: `${moment(values.beginTime).format('YYYY-MM-DD')} ${v.date}:00:00`,
                            time2: `${moment(values.endTime).format('YYYY-MM-DD')} ${v.date}:59:59`,
                          });
                          setTypename('事件总数');
                          setVisible(true);
                        } else {
                          setPicVal({
                            object: v.name,
                            time1: `${v.date} 00:00:00`,
                            time2: `${v.date} 23:59:59`,
                          });
                          setTypename('事件总数');
                          setVisible(true);
                
                        }
                        setTitle(v.name)

                      }}
                    />
                  )}
                </Card>
              </Col>
            </Row>

            {/* 程序问题情况 */}
            <Row style={{ marginTop: 24 }} gutter={24}>
              <Col span={12}>
                <div className={styles.statisticscard}>
                  <Avatar icon="reconciliation" />
                  <b>事件工单处理及时率</b>
                </div>
                <Card onMouseDown={() => setPicVal({})}>
                  {getTimeOutConditionsdata && getTimeOutConditionsdata.length === 0 && <Empty style={{ height: '300px' }} />}
                  {getTimeOutConditionsdata && getTimeOutConditionsdata.length > 0 && (
                    <DonutPCT
                      data={getTimeOutConditionsdata}
                      height={300}
                      total={piesum(getTimeOutConditionsdata)}
                      totaltitle="工单处理总数"
                      padding={[10, 30, 10, 30]}
                      onGetVal={v => {
                        let result;
                        switch (v.type) {
                          case '未超时':
                            result = 'noTimeout'
                            break;
                          case '已超时':
                            result = 'isTimeout'
                            break;
                          default:
                            break;
                        }
                        const obj = {
                          time1: values.beginTime,
                          time2: values.endTime,
                          tabType: v === 'center' ? 'unClose' : result
                        };
                        setPicVal({
                          ...obj
                        });
                        setTypename('超时情况');
                        setVisible(true);
                        setTitle(v === 'center' ? '工单处理总数' : v.type)
                      }}
                    />
                  )}

                </Card>
              </Col>
              <Col span={12}>
                <div className={styles.statisticscard}>
                  <Avatar icon="funnel-plot" />
                  <b>事件登记人Top{topN}</b>
                  <div style={{ float: 'right' }} >n：<InputNumber defaultValue={5} onChange={v => setTopN(v)} /></div>
                </div>
                <Card onMouseDown={() => setPicVal({})} style={{ marginLeft: '-1px' }}>
                  {getRegisterUserTopdata && getRegisterUserTopdata.length === 0 && <Empty style={{ height: '300px' }} />}
                  {getRegisterUserTopdata && getRegisterUserTopdata.length > 0 && (
                    <>
                      <Col span={24}>
                        <ColumnarY
                          cols={Issuedscale}
                          data={dataCylinder(getRegisterUserTopdata)}
                          height={300}
                          padding={[30, 60, 50, 100]}
                          onGetVal={v => {
                            setPicVal({
                              registerUser: v.type,
                              time1: values.beginTime,
                              time2: values.endTime,
                            });
                            setVisible(true);
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
                  <Avatar icon="flag" />
                  <b>按时处理人Top{topN1}</b>
                  <div style={{ float: 'right' }} >n：<InputNumber defaultValue={5} onChange={v => setTopN1(v)} /></div>
                </div>
                <Card onMouseDown={() => setPicVal({})}>
                  {getHandlerTopdata && getHandlerTopdata.length === 0 && <Empty style={{ height: '300px' }} />}
                  {getHandlerTopdata && getHandlerTopdata.length > 0 && (
                    <>
                      <Col span={24}>
                        <ColumnarY
                          cols={Issuedscale}
                          data={dataCylinder1(getHandlerTopdata)}
                          height={300}
                          padding={[30, 60, 50, 100]}
                          onGetVal={v => {
                            setPicVal({
                              handler: v.type,
                              time1: values.beginTime,
                              time2: values.endTime,
                              type: 'noTimeout',
                            });
                            setVisible(true)
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
                  <Avatar icon="flag" />
                  <b>超时处理人Top{topN4}</b>
                  <div style={{ float: 'right' }} >n：<InputNumber defaultValue={5} onChange={v => setTopN4(v)} /></div>
                </div>
                <Card onMouseDown={() => setPicVal({})}>
                  {getTimeoutHandlerToparr && getTimeoutHandlerToparr.length === 0 && <Empty style={{ height: '300px' }} />}
                  {getTimeoutHandlerToparr && getTimeoutHandlerToparr.length > 0 && (
                    <>
                      <Col span={24}>
                        <ColumnarY
                          cols={Issuedscale}
                          data={dataCylinder4(getTimeoutHandlerToparr)}
                          height={300}
                          padding={[30, 60, 50, 100]}
                          onGetVal={v => {
                            setPicVal({
                              time1: values.beginTime,
                              time2: values.endTime,
                              type: 'isTimeout',
                            });
                            setVisible(true);
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
                  <Avatar icon="deployment-unit" />
                  <b>事件处理单位Top{topN3}</b>
                  <div style={{ float: 'right' }} >n：<InputNumber defaultValue={5} onChange={v => setTopN3(v)} /></div>
                </div>
                <Card onMouseDown={() => setPicVal({})}>
                  {getHandleUnitTopdata && getHandleUnitTopdata.length === 0 && <Empty style={{ height: '300px' }} />}
                  {getHandleUnitTopdata && getHandleUnitTopdata.length > 0 && (
                    <>
                      <Col span={24}>
                        <ColumnarY
                          cols={Issuedscale}
                          data={dataCylinder3(getHandleUnitTopdata)}
                          height={300}
                          padding={[30, 60, 50, 210]}
                          onGetVal={v => {
                            setPicVal({
                              handleUnit: v.type,
                              time1: values.beginTime,
                              time2: values.endTime,
                              type: 'analysis'
                            });
                            setVisible(true)
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
                  <Avatar icon="container" />
                  <b>事件登记单位Top{topN2}</b>
                  <div style={{ float: 'right' }} >n：<InputNumber defaultValue={5} onChange={v => setTopN2(v)} /></div>
                </div>
                <Card onMouseDown={() => setPicVal({})} style={{ marginLeft: '-1px' }}>
                  {getRegisterUnitTopdata && getRegisterUnitTopdata.length === 0 && <Empty style={{ height: '300px' }} />}
                  {getRegisterUnitTopdata && getRegisterUnitTopdata.length > 0 && (
                    <>
                      <Col span={24}>
                        <ColumnarY
                          cols={Issuedscale}
                          data={dataCylinder2(getRegisterUnitTopdata)}
                          height={300}
                          padding={[30, 60, 50, 200]}
                          onGetVal={v => {
                            setPicVal({
                              registerUnit: v.type,
                              time1: values.beginTime,
                              time2: values.endTime,
                              type: 'analysis'
                            });
                            setVisible(true)
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

export default connect(({ eventstatistics, loading }) => ({
  getHandlerTopdata: eventstatistics.getHandlerTopdata, //   统计分析接口
  getObjectConditionsdata: eventstatistics.getObjectConditionsdata, //   
  getTypeConditionsdata: eventstatistics.getTypeConditionsdata, //   
  getTimeOutConditionsdata: eventstatistics.getTimeOutConditionsdata, //   
  getRegisterUserTopdata: eventstatistics.getRegisterUserTopdata, //   
  getRegisterUnitTopdata: eventstatistics.getRegisterUnitTopdata, //   
  getHandleUnitTopdata: eventstatistics.getHandleUnitTopdata, //   
  getOrderConditionsobj: eventstatistics.getOrderConditionsobj, //   
  getTimeoutHandlerToparr: eventstatistics.getTimeoutHandlerToparr, //   
  loading: loading.models.eventstatistics,
}))(EventAnalysis);
