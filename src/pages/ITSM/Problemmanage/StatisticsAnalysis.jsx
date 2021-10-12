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
} from 'antd';
import moment from 'moment';
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
  console.log(lineArr, 'lineArr')
  const [picval, setPicVal] = useState({});
  const [bardata, setBardata] = useState([]);
  const [toplist, setToplist] = useState([]);
  const [type, setType] = useState([]);
  const [timeoutdata, setTimeoutdata] = useState([])
  const [values, setValues] = useState({});
  const [topN, setTopN] = useState(5);

  const Issuedscale = {
    total: {
      type: 'linear',
      alias: '返回结果数量',
      min: 0,
      tickInterval: 5000,
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

  const columnsYresult = datas => {
    const newArr = [];
    if (!Array.isArray(datas)) {
      return newArr;
    }
    for (let i = 0; i < datas.length; i += 1) {
      const vote = {};
      vote.type = datas[i].type;
      vote.total = datas[i].value;
      newArr.push(vote);
    }
    return newArr;
  }

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

  console.log(resgisterarr, 'resgisterarr')

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
        type: values.type === 'M' ? 'MONTH' : 'DAY',
        n: values.n || 5
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
                <div className={styles.statisticscard}>
                  <Avatar icon="cluster" />
                  <b>问题处理情况占比</b>
                </div>
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
                <div className={styles.statisticscard}>
                  <Avatar icon="cluster" />
                  <b>问题工单量趋势</b>
                </div>
                <Card onMouseDown={() => setPicVal({})} style={{ marginLeft: '-1px' }}>
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
            <Row style={{ marginTop: 24 }}>
              <div className={styles.statisticscard}>
                <Avatar icon="cluster" />
                <b>问题分类统计分析</b>
              </div>
              <Col span={8}>
                <div className={styles.statisticscard}>
                  <Avatar icon="cluster" />
                  <b>问题分类总情况</b>
                </div>
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
                <div className={styles.statisticscard}>
                  <Avatar icon="cluster" />
                  <b>问题分类总趋势</b>
                </div>
                <Card onMouseDown={() => setPicVal({})} style={{ marginLeft: '-1px' }}>
                  <SmoothLine
                    data={lineArr && lineArr['问题分类总趋势']}
                    height={300}
                    padding={[30, 0, 50, 60]}
                    onGetVal={v => {
                      setPicVal({ ...picval, type: v });
                      console.log('曲线图', v);
                    }}
                  />
                </Card>
              </Col>
            </Row>

            {/* 程序问题情况 */}
            <Row style={{ marginTop: 24 }}>
              <Col span={8}>
                <div className={styles.statisticscard}>
                  <Avatar icon="cluster" />
                  <b>程序问题情况</b>
                </div>
                <Card onMouseDown={() => setPicVal({})}>
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
                </Card>
              </Col>
              <Col span={16}>
                <div className={styles.statisticscard}>
                  <Avatar icon="cluster" />
                  <b>程序问题趋势</b>
                </div>
                <Card onMouseDown={() => setPicVal({})} style={{ marginLeft: '-1px' }}>
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
                </Card>
              </Col>
            </Row>

            {/* 功能问题情况 */}
            <Row style={{ marginTop: 24 }}>
              <Col span={8}>
                <div className={styles.statisticscard}>
                  <Avatar icon="cluster" />
                  <b>功能问题情况</b>
                </div>
                <Card onMouseDown={() => setPicVal({})}>
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
                </Card>
              </Col>
              <Col span={16}>
                <div className={styles.statisticscard}>
                  <Avatar icon="cluster" />
                  <b>功能问题趋势</b>
                </div>
                <Card onMouseDown={() => setPicVal({})} style={{ marginLeft: '-1px' }}>
                  <SmoothLine
                    data={lineArr && lineArr['功能问题趋势']}
                    height={300}
                    padding={[30, 0, 50, 60]}
                    onGetVal={v => {
                      setPicVal({ ...picval, type: v });
                      console.log('曲线图', v);
                    }}
                  />
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
                  <SmoothLine
                    data={lineArr && lineArr['问题来源']}
                    height={300}
                    padding={[30, 0, 50, 60]}
                    onGetVal={v => {
                      setPicVal({ ...picval, type: v });
                      console.log('曲线图', v);
                    }}
                  />
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
                  {resgisterarr && resgisterarr.length === 0 && <Empty style={{ height: '300px' }} />}
                  {resgisterarr && resgisterarr.length > 0 && (
                    <>
                      <Col span={20}>
                        {/* <Cylinder
                          height={300}
                          data={dataCylinder(resgisterarr)}
                          padding={[10, 50, 30, 120]}
                          symbol=""
                          cols={cols}
                          colors="l(270) 0:#04e8ff 0.5:#05bdfe 1:#05bdfe"
                          onGetVal={(v) => { setPicVal({ ...picval, type: v }); }}
                        /> */}

                        <ColumnarY
                          cols={Issuedscale}
                          data={columnsYresult(resgisterarr)}
                          height={300}
                          padding={[30, 60, 50, 100]}
                          onGetVal={(v) => { setPicVal({ ...picval, type: v }); console.log('Y向柱形图', v) }}
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
                  <Avatar icon="share-alt" />
                  <b>问题处理人Top5</b>
                </div>
                <Card>
                  {handlerarr && handlerarr.length === 0 && <Empty style={{ height: 300 }} />}
                  {handlerarr && handlerarr.length > 0 && (
                    <>
                      <Col span={20}>
                        {/* <Cylinder
                          height={300}
                          data={dataCylinder(handlerarr)}
                          padding={[10, 50, 30, 120]}
                          // padding={[10, 30, 30, 30]}
                          symbol=""
                          cols={cols}
                          colors="l(180) 0:#c408f8 0.5:#8105fb 1:#8105fb"
                          onGetVal={(v) => { setPicVal({ ...picval, type: v }); }}
                        /> */}
                        <ColumnarY
                          cols={Issuedscale}
                          data={columnsYresult(handlerarr)}
                          height={300}
                          padding={[30, 60, 50, 100]}
                          onGetVal={(v) => { setPicVal({ ...picval, type: v }); console.log('Y向柱形图', v) }}
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
                  <Avatar icon="share-alt" />
                  <b>问题登记单位Top5</b>
                </div>
                <Card>
                  {resgisterunitarr && resgisterunitarr.length === 0 && <Empty style={{ height: '300px' }} />}
                  {resgisterunitarr && resgisterunitarr.length > 0 && (
                    <>
                      <Col span={20}>
                        {/* <Cylinder
                          height={300}
                          data={dataCylinder(resgisterunitarr)}
                          padding={[10, 50, 30, 120]}
                          symbol=""
                          cols={cols}
                          colors="l(180) 0:#ffbb02 0.5:#fe7402 1:#fe7402"
                          onGetVal={(v) => { setPicVal({ ...picval, type: v }); }}
                        /> */}
                        <ColumnarY
                          cols={Issuedscale}
                          data={columnsYresult(resgisterunitarr)}
                          height={300}
                          padding={[30, 60, 50, 100]}
                          onGetVal={(v) => { setPicVal({ ...picval, type: v }); console.log('Y向柱形图', v) }}
                        />
                      </Col>

                      <Col span={4} style={{ zIndex: 1000 }}>
                        <Select
                          defaultValue={defaultNum3 || 5}
                          onChange={(e) => selectOnchange(e, 'registrationunit')}
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
              <Col span={12} style={{ zIndex: 1000 }}>
                <div className={styles.statisticscard}>
                  <Avatar icon="share-alt" />
                  <b>问题处理单位Top5</b>
                </div>
                <Card onMouseDown={() => setPicVal({})} style={{ marginLeft: '-1px' }}>
                  {handlerunitarr && handlerunitarr.length === 0 && <Empty style={{ height: '300px' }} />}
                  {handlerunitarr && handlerunitarr.length > 0 && (
                    <>
                      <Col span={20}>
                        {/* <Cylinder
                          height={300}
                          data={dataCylinder(handlerunitarr)}
                          padding={[10, 50, 30, 120]}
                          symbol=""
                          cols={cols}
                          colors="l(270) 0:#FFDAB9 0.5:#FFDEAD 1:#F5DEB3"
                          onGetVal={(v) => { setPicVal({ ...picval, type: v }); }}
                        /> */}

                        <ColumnarY
                          cols={Issuedscale}
                          data={columnsYresult(handlerunitarr)}
                          height={300}
                          padding={[30, 60, 50, 100]}
                          onGetVal={(v) => { setPicVal({ ...picval, type: v }); console.log('Y向柱形图', v) }}
                        />
                      </Col>

                      <Col span={4} style={{ zIndex: 1000 }}>
                        <Select
                          defaultValue={defaultNum4 || 5}
                          onChange={(e) => selectOnchange(e, 'handlerunit')}
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
