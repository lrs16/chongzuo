import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Card,
  Row,
  Col,
  Avatar,
  Select,
  Empty,
  Spin,
  InputNumber
} from 'antd';
import StatisticsCard from '../eventstatistics/StatisticsCard';
import SelectTime from '@/components/SelectTime/SelectTime';
import DonutPCT from '@/components/CustomizeCharts/DonutPCT';
import SmoothLine from '@/components/CustomizeCharts/SmoothLine';
import ColumnarY from '../eventstatistics/ColumnarY';
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
    getOrderConditionsobj
  } = props;
  const [selectedTags, setSelectedTags] = useState([]);
  const [picval, setPicVal] = useState({});
  const [bardata, setBardata] = useState([]);
  const [values, setValues] = useState({});
  const [topN, setTopN] = useState(5) // 排序
  const [topN1, setTopN1] = useState(5) // 排序
  const [topN2, setTopN2] = useState(5) // 排序
  const [topN3, setTopN3] = useState(5) // 排序

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

  // const dataCylinder = datas => {
  //   const newArr = [];
  //   if (!Array.isArray(datas)) {
  //     return newArr;
  //   }
  //   for (let i = 0; i < datas.length; i += 1) {
  //     const vote = {};
  //     vote.name = datas[i].type;
  //     vote.rate = datas[i].total;
  //     vote.type = '环节';
  //     newArr.push(vote);
  //   }
  //   return newArr;
  // };

  const getTypeConditions = (values) => {
    dispatch({
      type: 'eventstatistics/fetchgetTypeConditions',
      payload: { ...values }
    })
  }

  const getObjectConditions = (values) => {
    dispatch({
      type: 'eventstatistics/fetchgetObjectConditions',
      payload: { ...values }
    })
  }

  const getTimeOutConditions = (values) => {
    dispatch({
      type: 'eventstatistics/fetchgetTimeOutConditions',
      payload: { ...values }
    })
  }

  const getRegisterUserTop = (values) => {
    dispatch({
      type: 'eventstatistics/fetchgetRegisterUserTop',
      payload: { ...values }
    })
  }

  const getHandlerTop = (values) => {
    dispatch({
      type: 'eventstatistics/fetchgetHandlerTop',
      payload: { ...values }
    })
  }

  const getRegisterUnitTop = (values) => {
    dispatch({
      type: 'eventstatistics/fetchgetRegisterUnitTop',
      payload: { ...values }
    })
  }

  const getHandleUnitTop = (values) => {
    dispatch({
      type: 'eventstatistics/fetchgetHandleUnitTop',
      payload: { ...values }
    })
  }

  const getOrderConditions = (values) => {
    dispatch({
      type: 'eventstatistics/fetchgetOrderConditions',
      payload: { ...values }
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
        num: values.num || 5
      }
      getTypeConditions(val);
      getObjectConditions(val);
      getTimeOutConditions(val);
      getRegisterUserTop(val);
      getHandlerTop(val);
      getRegisterUnitTop(val);
      getHandleUnitTop(val);
      getOrderConditions(val)
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
            {([getOrderConditionsobj] || []).map((obj, index) => {
              return (
                <>
                  <Row key={index} style={{ marginTop: 10 }} gutter={24}>
                    <Col span={16}>
                      <Row>
                        <div className={styles.statisticscard}>
                          <Avatar icon='desktop' />
                          <b>事件工单总情况</b>
                        </div>
                        <Col span={6}>
                          <StatisticsCard title='事件总数' value={obj && obj.allNum} suffix='单' des='环比' desval={`${obj && obj.allRingPoints}%`} type={Number((obj && obj.allRingPoints)) > 0 ? 'up' : 'down'} />
                        </Col>
                        <Col span={6}>
                          <StatisticsCard title='已完成' value={obj && obj.closeNum} suffix='单' des='环比' desval={`${obj && obj.closeRingPoints}%`} type={Number((obj && obj.closeRingPoints)) > 0 ? 'up' : 'down'} />
                        </Col>
                        <Col span={6}>
                          <StatisticsCard title='未完成' value={obj && obj.unCloseNum} suffix='单' des='环比' desval={`${obj && obj.unCloseRingPoints}%`} type={Number((obj && obj.unCloseRingPoints)) > 0 ? 'up' : 'down'} />
                        </Col>
                        <Col span={6}>
                          <StatisticsCard title='解决率' value={obj && obj.point} suffix='%' des='环比' desval={`${obj && obj.ringPoints}%`} type={Number((obj && obj.ringPoints)) > 0 ? 'up' : 'down'} />
                        </Col>
                      </Row>
                    </Col>

                    <Col span={8}>
                      <Row>
                        <div className={styles.statisticscard}>
                          <Avatar icon='desktop' />
                          <b>一线解决事件单情况（客服）</b>
                        </div>
                        <Col span={24}>
                          <Col span={8}>
                            <StatisticsCard title='受理总数' value={obj && obj.allNum} suffix='单' des='环比' desval={`${obj && obj.allRingPoints}%`} type={Number((obj && obj.allRingPoints)) > 0 ? 'up' : 'down'} />
                          </Col>
                          <Col span={8}>
                            <StatisticsCard title='一线处理量' value={obj && obj.selfHandleNum} suffix='单' des='环比' desval={`${obj && obj.selfHandleNumRingPoints}%`} type={Number((obj && obj.selfHandleRingPoints)) > 0 ? 'up' : 'down'} />
                          </Col>
                          <Col span={8}>
                            <StatisticsCard title='一线解决率' value={obj && obj.selfHandlePoint} suffix='%' des='环比' desval={`${obj && obj.selfHandlePointRingPoints}%`} type={Number((obj && obj.selfHandleRingPoints)) > 0 ? 'up' : 'down'} />
                          </Col>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </>
              )
            })}

            {/* 问题分类总情况 */}
            <Row style={{ marginTop: 24 }} gutter={24}>
              <div className={styles.statisticscard}>
                <Avatar icon="cluster" />
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
                      totaltitle="事件总数"
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
                  {getTypeConditionsdata && getTypeConditionsdata.lineChart && getTypeConditionsdata.lineChart.length === 0 && <Empty style={{ height: '300px' }} />}
                  {getTypeConditionsdata && getTypeConditionsdata.lineChart && getTypeConditionsdata.lineChart.length > 0 && (
                    <SmoothLine
                      data={getTypeConditionsdata && getTypeConditionsdata.lineChart}
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
                      totaltitle="事件总数"
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
                  {getObjectConditionsdata && getObjectConditionsdata.lineChart && getObjectConditionsdata.lineChart.length === 0 && <Empty style={{ height: '300px' }} />}
                  {getObjectConditionsdata && getObjectConditionsdata.lineChart && getObjectConditionsdata.lineChart.length > 0 && (
                    <SmoothLine
                      data={getObjectConditionsdata && getObjectConditionsdata.lineChart}
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
            <Row style={{ marginTop: 24 }} gutter={24}>
              <Col span={12}>
                <div className={styles.statisticscard}>
                  <Avatar icon="cluster" />
                  <b>事件工单超时情况</b>
                </div>
                <Card onMouseDown={() => setPicVal({})}>
                  {getTimeOutConditionsdata && getTimeOutConditionsdata.length === 0 && <Empty style={{ height: '300px' }} />}
                  {getTimeOutConditionsdata && getTimeOutConditionsdata.length > 0 && (
                    <DonutPCT
                      data={getTimeOutConditionsdata}
                      height={300}
                      total={piesum(getTimeOutConditionsdata)}
                      totaltitle="总工单数"
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
                  <Avatar icon="cluster" />
                  <b>事件登记人Top{topN}</b>
                  <div style={{ float: 'right' }} >n：<InputNumber defaultValue={5} onChange={v => setTopN(v)} /></div>
                  {/* <div style={{ float: 'right' }}>
                    <Select
                      defaultValue={defaultNum1 || 5}
                      onChange={(e) => selectOnchange(e, 'registrant')}
                      style={{ width: '100%'}}
                    >
                      <Option value="5">5</Option>
                      <Option value="10">10</Option>
                      <Option value="15">15</Option>
                      <Option value="20">20</Option>
                    </Select>
                  </div> */}
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
                  <Avatar icon="cluster" />
                  <b>事件处理人Top{topN1}</b>
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
                          onGetVal={(v) => { setPicVal({ ...picval, type: v }); console.log('Y向柱形图', v) }}
                        />
                      </Col>

                      {/* <Col span={4} style={{ zIndex: 1000 }}>
                        <Select
                          defaultValue={defaultNum2 || 5}
                          onChange={(e) => selectOnchange(e, 'handler')}
                          style={{ width: '100%' }}
                        >
                          <Option value="5">5</Option>
                          <Option value="10">10</Option>
                          <Option value="15">15</Option>
                          <Option value="20">20</Option>
                        </Select>
                      </Col> */}
                    </>
                  )}
                </Card>
              </Col>
              <Col span={12}>
                <div className={styles.statisticscard}>
                  <Avatar icon="cluster" />
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
                          onGetVal={(v) => { setPicVal({ ...picval, type: v }); console.log('Y向柱形图', v) }}
                        />
                      </Col>

                      {/* <Col span={4} style={{ zIndex: 1000 }}>
                        <Select
                          defaultValue={defaultNum3 || 5}
                          style={{ width: '100%' }}
                          onChange={(e) => selectOnchange(e, 'registrationunit')}>
                          <Option value="5">5</Option>
                          <Option value="10">10</Option>
                          <Option value="15">15</Option>
                          <Option value="20">20</Option>
                        </Select>
                      </Col> */}
                    </>
                  )}
                </Card>
              </Col>
            </Row>

            <Row style={{ marginTop: 24 }} gutter={24}>
              <Col span={12}>
                <div className={styles.statisticscard}>
                  <Avatar icon="cluster" />
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
                          padding={[30, 60, 50,200]}
                          onGetVal={(v) => { setPicVal({ ...picval, type: v }); console.log('Y向柱形图', v) }}
                        />
                      </Col>

                      {/* <Col span={4} style={{ zIndex: 1000 }}>
                        <Select
                          onChange={(e) => selectOnchange(e, 'handlerunit')}
                          defaultValue={defaultNum4 || 5}
                          style={{ width: '100%' }}
                        >
                          <Option value="5">5</Option>
                          <Option value="10">10</Option>
                          <Option value="15">15</Option>
                          <Option value="20">20</Option>
                        </Select>
                      </Col> */}
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

export default connect(({ eventstatistics, loading }) => ({
  getHandlerTopdata: eventstatistics.getHandlerTopdata, //   统计分析接口
  getObjectConditionsdata: eventstatistics.getObjectConditionsdata, //   
  getTypeConditionsdata: eventstatistics.getTypeConditionsdata, //   
  getTimeOutConditionsdata: eventstatistics.getTimeOutConditionsdata, //   
  getRegisterUserTopdata: eventstatistics.getRegisterUserTopdata, //   
  getRegisterUnitTopdata: eventstatistics.getRegisterUnitTopdata, //   
  getHandleUnitTopdata: eventstatistics.getHandleUnitTopdata, //   
  getOrderConditionsobj: eventstatistics.getOrderConditionsobj, //   
  loading: loading.models.eventstatistics,
}))(EventAnalysis);
