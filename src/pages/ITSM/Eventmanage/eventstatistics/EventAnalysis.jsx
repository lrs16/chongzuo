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
  Spin
} from 'antd';
import StatisticsCard from '@/components/StatisticsCard';
import SelectTime from '@/components/SelectTime/SelectTime';
import DonutPCT from '@/components/CustomizeCharts/DonutPCT';
import SmoothLine from '@/components/CustomizeCharts/SmoothLine';
import Cylinder from '@/components/CustomizeCharts/Cylinder';
import ColumnarY from '@/components/CustomizeCharts/ColumnarY';
import styles from '../../Problemmanage/index.less';
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

  const piesum = (arr) => {
    let sum = 0;
    if (arr && arr.length > 0) {
      arr.forEach(item => {
        sum += item.value;
      });
    };
    return sum
  };


  useEffect(() => {
    defaultNum1 = '';
    defaultNum2 = '';
    defaultNum3 = '';
    defaultNum4 = '';
  }, []);


  const dataCylinder = datas => {
    const newArr = [];
    if (!Array.isArray(datas)) {
      return newArr;
    }
    for (let i = 0; i < datas.length; i += 1) {
      const vote = {};
      vote.name = datas[i].type;
      vote.rate = datas[i].total;
      vote.type = '环节';
      newArr.push(vote);
    }
    return newArr;
  };

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

  const selectOnchange = (e, type) => {
    switch (type) {
      case 'registrant':
        defaultNum1 = e;
        getRegisterUserTop({
          begin: moment(values.beginTime).format('YYYY-MM-DD 00:00:00'),
          end: moment(values.endTime).format('YYYY-MM-DD 23:59:59'),
          num: e
        });
        break;
      case 'handler':
        defaultNum2 = e;
        getHandlerTop({
          begin: moment(values.beginTime).format('YYYY-MM-DD 00:00:00'),
          end: moment(values.endTime).format('YYYY-MM-DD 23:59:59'),
          num: e
        });
        break;
      case 'registrationunit':
        defaultNum3 = e;
        getRegisterUnitTop({
          begin: moment(values.beginTime).format('YYYY-MM-DD 00:00:00'),
          end: moment(values.endTime).format('YYYY-MM-DD 23:59:59'),
          num: e
        });
        break;
      case 'handlerunit':
        defaultNum4 = e;
        getHandleUnitTop({
          begin: moment(values.beginTime).format('YYYY-MM-DD 00:00:00'),
          end: moment(values.endTime).format('YYYY-MM-DD 23:59:59'),
          num: e
        });
        break;
      default:
        break;
    }
  }

  const Issuedscale = {
    total: {
      type: 'linear',
      alias: '返回结果数量',
      min: 0,
      tickInterval: 5000,
    },
  };

  console.log(getRegisterUnitTopdata, 'getRegisterUnitTopdata')

  const issuedata = [
    // {
    //   "id": "1437342791630413825",
    //   "date": "2021-09-13 17:10:00",
    //   "type": "正常",
    //   "total": 149120,
    //   "sjsj": "2021-09-13 00:00:00",
    //   "flag": false
    // },
    {
      "id": "1437342791668162561",
      "date": "2021-09-13 17:10:00",
      "type": "无上行报文",
      "total": 20469,
      "sjsj": "2021-09-13 00:00:00",
      "flag": false
    },
    // {
    //   "id": "1437342791689134082",
    //   "date": "2021-09-13 17:10:00",
    //   "type": "前置未返回",
    //   "total": 11868,
    //   "sjsj": "2021-09-13 00:00:00",
    //   "flag": false
    // },
    // {
    //   "id": "1437342791714299905",
    //   "date": "2021-09-13 17:10:00",
    //   "type": "否认",
    //   "total": 5226,
    //   "sjsj": "2021-09-13 00:00:00",
    //   "flag": false
    // },
    // {
    //   "id": "1437342791731077121",
    //   "date": "2021-09-13 17:10:00",
    //   "type": "超时",
    //   "total": 1112,
    //   "sjsj": "2021-09-13 00:00:00",
    //   "flag": false
    // },
    // {
    //   "id": "1437342791747854338",
    //   "date": "2021-09-13 17:10:00",
    //   "type": "设备离线",
    //   "total": 924,
    //   "sjsj": "2021-09-13 00:00:00",
    //   "flag": false
    // },
    // {
    //   "id": "1437342791764631554",
    //   "date": "2021-09-13 17:10:00",
    //   "type": "报文出错",
    //   "total": 168,
    //   "sjsj": "2021-09-13 00:00:00",
    //   "flag": false
    // }
  ]

  useEffect(() => {
    if (values && values.type) {
      const val = {
        begin: moment(values.beginTime).format('YYYY-MM-DD 00:00:00'),
        end: moment(values.endTime).format('YYYY-MM-DD 23:59:59'),
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

            <Row style={{ marginTop: 24 }}>
              {([getOrderConditionsobj] || []).map((obj, index) => {
                return (
                  <>
                    <Row key={index} style={{ marginTop: 10 }}>
                      <div className={styles.statisticscard}>
                        <Avatar icon='desktop' />
                        <b>事件工单总情况</b>
                      </div>

                      <Col span={6}>
                        <StatisticsCard title='事件总数' value={obj && obj.allNum} suffix='单' des='环比' type={(obj && obj.allRingPoints).substr(0, 1) === '-' ? 'down' : 'up'} />
                      </Col>
                      <Col span={6}>
                        <StatisticsCard title='已完成' value={obj && obj.closeNum} suffix='单' des='环比' type={(obj && obj.closeRingPoints).substr(0, 1) === '-' ? 'down' : 'up'} />
                      </Col>
                      <Col span={6}>
                        <StatisticsCard title='未完成' value={obj && obj.unCloseNum} suffix='单' des='环比' type={(obj && obj.unCloseRingPoints).substr(0, 1) === '-' ? 'down' : 'up'} />
                      </Col>
                      <Col span={6}>
                        <StatisticsCard title='解决率' value={obj && obj.point} suffix='%' des='环比' type={(obj && obj.ringPoints).substr(0, 1) === '-' ? 'down' : 'up'} />
                      </Col>
                    </Row>

                    <Row key={index} style={{ marginTop: 10 }}>
                      <div className={styles.statisticscard}>
                        <Avatar icon='desktop' />
                        <b>一线解决事件单情况（客服）</b>
                      </div>

                      <Col span={8}>
                        <StatisticsCard title='受理总数' value={obj && obj.allNum} suffix='单' des='环比' type={(obj && obj.allRingPoints).substr(0, 1) === '-' ? 'down' : 'up'} />
                      </Col>
                      <Col span={8}>
                        <StatisticsCard title='一线处理量' value={obj && obj.selfHandleNum} suffix='单' des='环比' type={(obj && obj.selfHandleRingPoints).substr(0, 1) === '-' ? 'down' : 'up'} />
                      </Col>
                      <Col span={8}>
                        <StatisticsCard title='一线解决率' value={obj && obj.selfHandlePoint} suffix='%' des='环比' type={(obj && obj.selfHandleRingPoints).substr(0, 1) === '-' ? 'down' : 'up'} />
                      </Col>

                    </Row>
                  </>
                )
              })}
            </Row>

            {/* 问题分类总情况 */}
            <Row style={{ marginTop: 24 }}>
              <div className={styles.statisticscard}>
                <Avatar icon="cluster" />
                <b>事件分类统计分析</b>
              </div>
              <Col span={8}>
                <Card onMouseDown={() => setPicVal({})}>
                  <DonutPCT
                    data={getTypeConditionsdata && getTypeConditionsdata.pieChart}
                    height={300}
                    total={piesum(getTypeConditionsdata)}
                    totaltitle="事件总数"
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
            <Row style={{ marginTop: 24 }}>
              <div className={styles.statisticscard}>
                <Avatar icon="cluster" />
                <b>事件对象统计分析</b>
              </div>
              <Col span={8}>
                <Card onMouseDown={() => setPicVal({})}>
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
            <Row style={{ marginTop: 24 }}>
              <Col span={8}>
                <div className={styles.statisticscard}>
                  <Avatar icon="cluster" />
                  <b>事件工单超时情况</b>
                </div>
                <Card onMouseDown={() => setPicVal({})}>
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
                </Card>
              </Col>
              <Col span={16}>
                <div className={styles.statisticscard}>
                  <Avatar icon="cluster" />
                  <b>事件登记人Top5</b>
                </div>
                <Card onMouseDown={() => setPicVal({})} style={{ marginLeft: '-1px' }}>
                  {getRegisterUserTopdata && getRegisterUserTopdata.length === 0 && <Empty style={{ height: '300px' }} />}
                  {getRegisterUserTopdata && getRegisterUserTopdata.length > 0 && (
                    <>
                      <Col span={20}>
                        <Cylinder
                          height={300}
                          data={dataCylinder(getRegisterUserTopdata)}
                          padding={[0, 50, 30, 150]}
                          symbol=""
                          cols={cols}
                          colors="l(270) 0:#04e8ff 0.5:#05bdfe 1:#05bdfe"
                          onGetVal={(v) => { setPicVal({ ...picval, type: v }); }}
                        />
                      </Col>

                      <Col span={4} style={{ zIndex: 1000 }}>
                        <Select
                          defaultValue={defaultNum1 || 5}
                          onChange={(e) => selectOnchange(e, 'registrant')}
                          style={{ width: '100%' }}
                        >
                          <Option value="5">5</Option>
                          <Option value="10">10</Option>
                          <Option value="15">15</Option>
                          <Option value="20">20</Option>
                        </Select>
                      </Col>
                    </>
                  )}
                </Card>
              </Col>
            </Row>

            <Row style={{ marginTop: 24 }}>
              <Col span={12}>
                <div className={styles.statisticscard}>
                  <Avatar icon="cluster" />
                  <b>事件处理人Top5</b>
                </div>
                <Card onMouseDown={() => setPicVal({})}>
                  {getHandlerTopdata && getHandlerTopdata.length === 0 && <Empty style={{ height: '300px' }} />}
                  {getHandlerTopdata && getHandlerTopdata.length > 0 && (
                    <>
                      <Col span={20}>
                        <Cylinder
                          height={300}
                          data={dataCylinder(getHandlerTopdata)}
                          padding={[0, 50, 30, 150]}
                          symbol=""
                          cols={cols}
                          colors="l(270) 0:#04e8ff 0.5:#05bdfe 1:#05bdfe"
                          onGetVal={(v) => { setPicVal({ ...picval, type: v }); }}
                        />
                      </Col>

                      <Col span={4} style={{ zIndex: 1000 }}>
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
                      </Col>

                    </>

                  )}
                </Card>
              </Col>
              <Col span={12}>
                <div className={styles.statisticscard}>
                  <Avatar icon="cluster" />
                  <b>事件登记单位Top5</b>
                </div>
                <Card onMouseDown={() => setPicVal({})} style={{ marginLeft: '-1px' }}>
                  {getRegisterUnitTopdata && getRegisterUnitTopdata.length === 0 && <Empty style={{ height: '300px' }} />}
                  {getRegisterUnitTopdata && getRegisterUnitTopdata.length > 0 && (
                    <>
                      <Col span={20}>
                        {/* <Cylinder
                          height={300}
                          data={dataCylinder(getRegisterUserTopdata)}
                          padding={[0, 50, 30, 150]}
                          symbol=""
                          cols={cols}
                          colors="l(270) 0:#04e8ff 0.5:#05bdfe 1:#05bdfe"
                          onGetVal={(v) => { setPicVal({ ...picval, type: v }); }}
                        /> */}
                        <ColumnarY
                          cols={Issuedscale}
                          data={getRegisterUnitTopdata}
                          height={300}
                          padding={[30, 60, 50, 100]}
                          onGetVal={(v) => { setPicVal({ ...picval, type: v }); console.log('Y向柱形图', v) }}
                        />
                      </Col>

                      <Col span={4} style={{ zIndex: 1000 }}>
                        <Select
                          defaultValue={defaultNum3 || 5}
                          style={{ width: '100%' }}
                          onChange={(e) => selectOnchange(e, 'registrationunit')}>
                          <Option value="5">5</Option>
                          <Option value="10">10</Option>
                          <Option value="15">15</Option>
                          <Option value="20">20</Option>
                        </Select>
                      </Col>
                    </>
                  )}
                </Card>
              </Col>
            </Row>

            <Row style={{ marginTop: 24 }}>
              <div className={styles.statisticscard}>
                <Avatar icon="cluster" />
                <b>事件处理单位Top5</b>
              </div>
              <Col span={12}>
                <Card onMouseDown={() => setPicVal({})}>
                  {getHandleUnitTopdata && getHandleUnitTopdata.length === 0 && <Empty style={{ height: '300px' }} />}
                  {getHandleUnitTopdata && getHandleUnitTopdata.length > 0 && (
                    <>
                      <Col span={20}>
                        <Cylinder
                          height={300}
                          data={dataCylinder(getHandleUnitTopdata)}
                          padding={[0, 50, 30, 150]}
                          symbol=""
                          cols={cols}
                          colors="l(270) 0:#04e8ff 0.5:#05bdfe 1:#05bdfe"
                          onGetVal={(v) => { setPicVal({ ...picval, type: v }); }}
                        />
                      </Col>

                      <Col span={4} style={{ zIndex: 1000 }}>
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
                      </Col>
                    </>
                  )}


                </Card>
              </Col>


              <Col span={12}>
                <Card>
                  <ColumnarY
                    cols={Issuedscale}
                    data={issuedata}
                    height={364}
                    padding={[30, 60, 50, 100]}
                    onGetVal={(v) => { setPicVal({ ...picval, type: v }); console.log('Y向柱形图', v) }}
                  />
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
  getHandlerTopdata: eventstatistics.getHandlerTopdata, //   
  getRegisterUnitTopdata: eventstatistics.getRegisterUnitTopdata, //   
  getHandleUnitTopdata: eventstatistics.getHandleUnitTopdata, //   
  getOrderConditionsobj: eventstatistics.getOrderConditionsobj, //   
  loading: loading.models.eventstatistics,
}))(EventAnalysis);
