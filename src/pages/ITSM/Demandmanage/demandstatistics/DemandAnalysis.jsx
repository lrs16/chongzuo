import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Row, Col, Avatar, Empty, Spin, InputNumber } from 'antd';
import SelectTime from '@/components/SelectTime/SelectTime';
import DonutPCT from '../components/ChartFiles/DonutPCT';
import StatisticsCard from '../components/ChartFiles/StatisticsCard';
import SmoothLine from '../components/ChartFiles/SmoothLine';
import ColumnarY from '../components/ChartFiles/ColumnarY';
import styles from '../index.less';

const Issuedscale = {
  total: {
    type: 'linear',
    alias: '返回结果数量',
    min: 0,
    // range: [0,99],
    tickInterval: 10,
  },
};

function Statistics(props) {
  const {
    dispatch,
    loadingratio,
    piedatalist, // 饼图
    linedatalist, // 趋势图
    demandtimeoutlist, // 需求超时情况饼图
    ratiodatalist, // 工单数
  } = props;

  const [picval, setPicVal] = useState({});
  const [values, setValues] = useState({});
  const [topN, setTopN] = useState({ val1: 5, val2: 5, val3: 5, val4: 5, }); // 排序

  const dataCylindertop = (datas, v) => { // 柱状图集成数组
    const newArr = [];
    if (!Array.isArray(datas) || datas.length === 0) {
      return newArr;
    }
    for (let i = 0; datas.length < topN[v] ? i < datas.length : i < topN[v]; i += 1) {
      const vote = {};
      vote.type = datas[i].type;
      vote.total = datas[i].value;
      vote.expected = datas[0].value;
      newArr.push(vote);
    }
    return newArr.reverse();
  };

  const linedataArr = datas => { // 趋势折线
    const newArr = [];
    if (!Array.isArray(datas)) {
      return newArr;
    }
    for (let i = 0; i < datas.length; i += 1) {
      const vote = {};
      vote.value = datas[i].value;
      vote.name = datas[i].name;
      vote.date = datas[i].date;
      newArr.push(vote);
    }
    return newArr;
  };

  const piedataArr = datas => { // 饼图
    const newArr = [];
    if (!Array.isArray(datas)) {
      return newArr;
    }
    const newdData = datas;
    const newdatas = newdData.concat();
    newdatas.pop();
    for (let i = 0; i < newdatas.length; i += 1) {
      const vote = {};
      vote.type = newdatas[i].status;
      vote.value = newdatas[i].quantity;
      newArr.push(vote);
    }
    return newArr;
  };

  const piedataArrtwo = datas => { // 饼图
    const newArr = [];
    if (!Array.isArray(datas)) {
      return newArr;
    }
    const newdData = datas;
    const newdatas = newdData.concat();
    newdatas.shift();
    for (let i = 0; i < newdatas.length; i += 1) {
      const vote = {};
      vote.type = newdatas[i].type;
      vote.value = newdatas[i].value;
      newArr.push(vote);
    }
    return newArr;
  };

  const dataCylinder = datas => { // 柱状图
    const newArr = [];
    if (!Array.isArray(datas)) {
      return newArr;
    }
    for (let i = 0; i < datas.length; i += 1) {
      const vote = {};
      vote.name = datas[i].type;
      vote.rate = datas[i].value;
      vote.expected = datas[0].value;
      newArr.push(vote);
    }
    return newArr;
  };

  const piesum = (arr) => { // 计算总数
    let sum = 0;
    if (arr && arr.length > 0) {
      arr.forEach(item => {
        sum += item.value;
      });
    };
    return sum;
  };

  const piesum1 = (arr) => { // 计算总数
    if (arr && arr.length > 0) {
      const newarr = arr.map(item => {
        return item.value;
      });
      return newarr[0];
    };
    return false;
  };

  useEffect(() => {
    if (values && values.type) {
      const val = {
        begin: moment(values.beginTime).format('YYYY-MM-DD'),
        end: moment(values.endTime).format('YYYY-MM-DD'),
        type: values.type
      };
      dispatch({ // 饼图数据
        type: 'demandstatistic/getdemandstatipieData',
        payload: { ...val },
      });

      dispatch({ // 趋势折线数据
        type: 'demandstatistic/getdemandstatilineData',
        payload: { ...val },
      });

      dispatch({ // 需求超时情况饼图
        type: 'demandstatistic/getdemandTimeoutpieDate',
        payload: {
          startTime: moment(values.beginTime).format('YYYY-MM-DD'),
          endTime: moment(values.endTime).format('YYYY-MM-DD')
        }
      });

      dispatch({ // 趋势折线数据
        type: 'demandstatistic/getdemandstatiratioData',
        payload: { ...val },
      });
    }
  }, [values]);

  return (
    <div>
      {/* 统计周期 */}
      <SelectTime ChangeDate={(v) => setValues(v)} />
      <Spin spinning={loadingratio}>
        <Row style={{ marginTop: 16 }}>
          <div className={styles.statisticscard}>
            <Avatar icon="file-protect" />
            <b>需求工单情况</b>
          </div>
          {(!ratiodatalist || (ratiodatalist && ratiodatalist === undefined)) && <Empty style={{ height: '100px' }} />}
          {
            ratiodatalist && ratiodatalist !== undefined && (
              // <Row type="flex" justify="space-around">
              //   <Col span={4}><StatisticsCard title='需求总数：' time1={moment(values.beginTime).format('YYYY-MM-DD 00:00:00')}
              //     time2={moment(values.endTime).format('YYYY-MM-DD 23:59:59')} staticName="需求总数" value={ratiodatalist.total} suffix='单' des='环比' desval={`${ratiodatalist.totalMom}%`} type={Number(ratiodatalist.totalMom) > 0 ? 'up' : 'down'} /></Col>
              //   <Col span={5}><StatisticsCard title='已开发：' staticName="已开发" time1={moment(values.beginTime).format('YYYY-MM-DD')}
              //     time2={moment(values.endTime).format('YYYY-MM-DD')} value={ratiodatalist.dev} suffix='单' des='环比' desval={`${ratiodatalist.devMom}%`} type={Number(ratiodatalist.devMom) > 0 ? 'up' : 'down'} /></Col>
              //   <Col span={5}><StatisticsCard title='已发布：' staticName="已发布" time1={moment(values.beginTime).format('YYYY-MM-DD 00:00:00')}
              //     time2={moment(values.endTime).format('YYYY-MM-DD 23:59:59')} value={ratiodatalist.release} suffix='单' des='环比' desval={`${ratiodatalist.releaseMom}%`} type={Number(ratiodatalist.releaseMom) > 0 ? 'up' : 'down'} /></Col>
              //   <Col span={5}><StatisticsCard title='开发率：' value={ratiodatalist.devRate} suffix='%' des='环比' desval={`${ratiodatalist.devRateMom}%`} type={Number(ratiodatalist.devRateMom) > 0 ? 'up' : 'down'} /></Col>
              //   <Col span={5}><StatisticsCard title='发布率：' value={ratiodatalist.releaseRate} suffix='%' des='环比' desval={`${ratiodatalist.releaseRateMom}%`} type={Number(ratiodatalist.releaseRateMom) > 0 ? 'up' : 'down'} /></Col>
              // </Row>
              <Row type="flex" justify="space-around">
                <Col span={4}><StatisticsCard title='需求总数：' time1={moment(values.beginTime).format('YYYY-MM-DD 00:00:00')}
                  time2={moment(values.endTime).format('YYYY-MM-DD 23:59:59')} staticName="需求总数" value={ratiodatalist.total} suffix='单' des='环比' desval={`${ratiodatalist.totalMom}%`} type={Number(ratiodatalist.totalMom) > 0 ? 'up' : 'down'} /></Col>
                <Col span={5}><StatisticsCard title='已开发：' staticName="已开发" time1={moment(values.beginTime).format('YYYY-MM-DD')}
                  time2={moment(values.endTime).format('YYYY-MM-DD')} value={ratiodatalist.dev} suffix='单' des='环比' desval={`${ratiodatalist.devMom}%`} type={Number(ratiodatalist.devMom) > 0 ? 'up' : 'down'} /></Col>
                <Col span={5}><StatisticsCard title='未开发：' staticName="未开发" time1={moment(values.beginTime).format('YYYY-MM-DD 00:00:00')}
                  time2={moment(values.endTime).format('YYYY-MM-DD 23:59:59')} value={ratiodatalist.release} suffix='单' des='环比' desval={`${ratiodatalist.releaseMom}%`} type={Number(ratiodatalist.releaseMom) > 0 ? 'up' : 'down'} /></Col>
                <Col span={5}><StatisticsCard title='需求取消：' value={ratiodatalist.devRate} suffix='%' des='环比' desval={`${ratiodatalist.devRateMom}%`} type={Number(ratiodatalist.devRateMom) > 0 ? 'up' : 'down'} /></Col>
                <Col span={5}><StatisticsCard title='需求进度：' value={ratiodatalist.releaseRate} suffix='%' des='环比' desval={`${ratiodatalist.releaseRateMom}%`} type={Number(ratiodatalist.releaseRateMom) > 0 ? 'up' : 'down'} /></Col>
              </Row>
            )
          }
        </Row>
      </Spin>
      {/* // 需求工单总情况 （饼图+折线图） */}
      <Row style={{ marginTop: 16 }}>
        <div className={styles.statisticscard}>
          <Avatar icon="pie-chart" />
          <b>需求工单总情况</b>
        </div>
        <Col span={8}>
          <Card onMouseDown={() => setPicVal({})}>
            <h4 style={{ fontWeight: 'bold' }}>需求处理情况占比</h4>
            {(!piedatalist || (piedatalist && piedatalist === undefined)) && <Empty style={{ height: '300px' }} />}
            {
              piedatalist && piedatalist !== undefined && (
                <DonutPCT
                  data={piedataArrtwo(piedatalist['需求处理情况占比']) || []}
                  height={300}
                  totaltitle='需求总数'
                  staticName='需求工单总情况'
                  time1={moment(values.beginTime).format('YYYY-MM-DD 00:00:00')}
                  time2={moment(values.endTime).format('YYYY-MM-DD 23:59:59')}
                  total={piesum1(piedatalist['需求处理情况占比'])}
                  padding={[10, 30, 30, 30]}
                  onGetVal={(v) => { setPicVal({ ...picval, dutyUnit: v }) }}
                />
              )
            }
          </Card>
        </Col>
        <Col span={16}>
          <Card onMouseDown={() => setPicVal({})} style={{ marginLeft: '-1px' }}>
            <h4 style={{ fontWeight: 'bold' }}>需求工单量趋势</h4>
            {(!linedatalist || (linedatalist && linedatalist === undefined)) && <Empty style={{ height: '300px' }} />}
            {
              linedatalist && linedatalist !== undefined && (
                <SmoothLine
                  data={linedataArr(linedatalist['需求工单量趋势']) || []}
                  height={300}
                  padding={[30, 0, 60, 60]}
                  time1={moment(values.beginTime).format('YYYY-MM-DD 00:00:00')}
                  time2={moment(values.endTime).format('YYYY-MM-DD 23:59:59')}
                  staticName='需求工单总情况线'
                  onGetVal={(v) => { setPicVal({ ...picval, type: v }) }}
                />
              )
            }
          </Card>
        </Col>
      </Row>
      {/* // 功能模块情况 （饼图+折线图） */}
      <Row style={{ marginTop: 16 }}>
        <div className={styles.statisticscard}>
          <Avatar icon="gold" />
          <b>功能模块情况</b>
        </div>
        <Col span={8}>
          <Card onMouseDown={() => setPicVal({})}>
            {(!piedatalist || (piedatalist && piedatalist === undefined)) && <Empty style={{ height: '300px' }} />}
            {
              piedatalist && piedatalist !== undefined && (
                <DonutPCT
                  data={piedatalist['功能模块情况'] || []}
                  height={300}
                  time1={moment(values.beginTime).format('YYYY-MM-DD 00:00:00')}
                  time2={moment(values.endTime).format('YYYY-MM-DD 23:59:59')}
                  totaltitle='需求总数'
                  total={piesum(piedatalist['功能模块情况'])}
                  padding={[10, 30, 30, 30]}
                  staticName='功能模块情况'
                  onGetVal={(v) => { setPicVal({ ...picval, dutyUnit: v }) }}
                />
              )
            }
          </Card>
        </Col>
        <Col span={16}>
          <Card onMouseDown={() => setPicVal({})} style={{ marginLeft: '-1px' }}>
            {(!linedatalist || (linedatalist && linedatalist === undefined && linedataArr(linedatalist['功能模块情况趋势']).length === 0)) && <Empty style={{ height: '300px' }} />}
            {
              linedatalist && linedatalist !== undefined && linedataArr(linedatalist['功能模块情况趋势']).length > 0 && (
                <SmoothLine
                  data={linedataArr(linedatalist['功能模块情况趋势']) || []}
                  height={300}
                  padding={[30, 0, 60, 60]}
                  time1={moment(values.beginTime).format('YYYY-MM-DD 00:00:00')}
                  time2={moment(values.endTime).format('YYYY-MM-DD 23:59:59')}
                  staticName="功能模块情况线"
                  onGetVal={(v) => { setPicVal({ ...picval, type: v }) }}
                />
              )
            }
          </Card>
        </Col>
      </Row>
      {/* // 需求类型统计分析 （饼图+折线图） */}
      <Row style={{ marginTop: 16 }}>
        <div className={styles.statisticscard}>
          <Avatar icon="share-alt" />
          <b>需求类型统计分析</b>
        </div>
        <Col span={8}>
          <Card onMouseDown={() => setPicVal({})}>
            {(piedatalist && piedatalist === undefined && linedataArr(piedatalist['需求类型统计分析']).length === 0) && <Empty style={{ height: '300px' }} />}
            {
              piedatalist && piedatalist !== undefined && linedataArr(piedatalist['需求类型统计分析']).length > 0 && (
                <DonutPCT
                  data={piedatalist['需求类型统计分析'] || []}
                  height={300}
                  totaltitle='需求总数'
                  time1={moment(values.beginTime).format('YYYY-MM-DD 00:00:00')}
                  time2={moment(values.endTime).format('YYYY-MM-DD 23:59:59')}
                  total={piesum(piedatalist['需求类型统计分析'])}
                  staticName='需求类型统计分析'
                  padding={[10, 30, 30, 30]}
                  onGetVal={(v) => { setPicVal({ ...picval, dutyUnit: v }) }}
                />
              )
            }
          </Card>
        </Col>
        <Col span={16}>
          <Card onMouseDown={() => setPicVal({})} style={{ marginLeft: '-1px' }}>
            {(linedatalist && linedataArr(linedatalist['需求类型趋势']).length === 0) && <Empty style={{ height: '300px' }} />}
            {
              linedatalist && linedatalist !== undefined && linedataArr(linedatalist['需求类型趋势']).length > 0 && (
                <SmoothLine
                  data={linedataArr(linedatalist['需求类型趋势']) || []}
                  height={300}
                  padding={[30, 0, 60, 60]}
                  time1={moment(values.beginTime).format('YYYY-MM-DD 00:00:00')}
                  time2={moment(values.endTime).format('YYYY-MM-DD 23:59:59')}
                  staticName='需求类型统计分析线'
                  onGetVal={(v) => { setPicVal({ ...picval, type: v }) }}
                />
              )
            }
          </Card>
        </Col>
      </Row>
      {/* 需求工单超时情况 */}
      <Row style={{ marginTop: 16 }} gutter={16}>
        <Col span={12}>
          <div className={styles.statisticscard}>
            <Avatar icon="clock-circle" />
            <b>需求处理及时率</b>
          </div>
          <Card onMouseDown={() => setPicVal({})}>
            {(demandtimeoutlist && piedataArr(demandtimeoutlist).length === 0) && <Empty style={{ height: '300px' }} />}
            {demandtimeoutlist && piedataArr(demandtimeoutlist).length > 0 && (
              <DonutPCT
                data={piedataArr(demandtimeoutlist) || []}
                height={300}
                totaltitle='需求总数'
                total={demandtimeoutlist[demandtimeoutlist.length - 1].quantity}
                staticName='需求工单超时情况'
                time1={moment(values.beginTime).format('YYYY-MM-DD 00:00:00')}
                time2={moment(values.endTime).format('YYYY-MM-DD 23:59:59')}
                padding={[10, 30, 30, 30]}
                onGetVal={(v) => { setPicVal({ ...picval, dutyUnit: v }) }}
                colors={['#ee6666', '#5AD8A6']}
              />
            )}
          </Card>
        </Col>
        <Col span={12}>
          <div className={styles.statisticscard}>
            <Avatar icon="form" />
            <b>需求申请人Top{topN.val1}</b>
            <div style={{ float: 'right' }} >n：<InputNumber defaultValue={5} onChange={v => setTopN({ ...topN, val1: v })} /></div>
          </div>
          <Card onMouseDown={() => setPicVal({})}>
            {(piedatalist && dataCylinder(piedatalist['需求申请人TOP']).length === 0) && <Empty style={{ height: '300px' }} />}
            {piedatalist && dataCylinder(piedatalist['需求申请人TOP']).length > 0 && (
              <ColumnarY
                height={300}
                data={dataCylindertop(piedatalist['需求申请人TOP'], 'val1') || []}
                padding={[30, 60, 50, 100]}
                staticName="需求申请人"
                time1={moment(values.beginTime).format('YYYY-MM-DD 00:00:00')}
                time2={moment(values.endTime).format('YYYY-MM-DD 23:59:59')}
                cols={Issuedscale}
                onGetVal={(v) => { setPicVal({ ...picval, type: v }); }}
              />
            )}
          </Card>
        </Col>
      </Row>
      {/* 需求处理人Top + 需求申请单位Top */}
      <Row style={{ marginTop: 16 }} gutter={16}>
        <Col span={12}>
          <div className={styles.statisticscard}>
            <Avatar icon="tool" />
            <b>需求处理人Top{topN.val2}</b>
            <div style={{ float: 'right' }} >n：<InputNumber defaultValue={5} onChange={v => setTopN({ ...topN, val2: v })} /></div>
          </div>
          <Card onMouseDown={() => setPicVal({})}>
            {(piedatalist && dataCylinder(piedatalist['需求处理人TOP']).length === 0) && <Empty style={{ height: '300px' }} />}
            {piedatalist && dataCylinder(piedatalist['需求处理人TOP']).length > 0 && (
              <ColumnarY
                height={300}
                data={dataCylindertop(piedatalist['需求处理人TOP'], 'val2') || []}
                padding={[30, 60, 50, 100]}
                time1={moment(values.beginTime).format('YYYY-MM-DD 00:00:00')}
                time2={moment(values.endTime).format('YYYY-MM-DD 23:59:59')}
                staticName="需求处理人"
                cols={Issuedscale}
                onGetVal={(v) => { setPicVal({ ...picval, type: v }); }}
              />
            )}
          </Card>
        </Col>
        <Col span={12}>
          <div className={styles.statisticscard}>
            <Avatar icon="form" />
            <b>需求申请单位Top{topN.val3}</b>
            <div style={{ float: 'right' }} >n：<InputNumber defaultValue={5} onChange={v => setTopN({ ...topN, val3: v })} /></div>
          </div>
          <Card onMouseDown={() => setPicVal({})}>
            {(piedatalist && dataCylinder(piedatalist['需求申请单位TOP']).length === 0) && <Empty style={{ height: '300px' }} />}
            {piedatalist && dataCylinder(piedatalist['需求申请单位TOP']).length > 0 && (
              <ColumnarY
                height={300}
                data={dataCylindertop(piedatalist['需求申请单位TOP'], 'val3') || []}
                padding={[30, 60, 50, 200]}
                staticName="需求申请单位"
                time1={moment(values.beginTime).format('YYYY-MM-DD 00:00:00')}
                time2={moment(values.endTime).format('YYYY-MM-DD 23:59:59')}
                cols={Issuedscale}
                onGetVal={(v) => { setPicVal({ ...picval, type: v }); }}
              />
            )}
          </Card>
        </Col>
      </Row>
      {/* 需求处理单位Top */}
      {/* <Row style={{ marginTop: 16 }} gutter={16}>
        <Col span={12}>
          <div className={styles.statisticscard}>
            <Avatar icon="tool" />
            <b>需求处理单位Top{topN.val4}</b>
            <div style={{ float: 'right' }} >n：<InputNumber defaultValue={5} onChange={v => setTopN({ ...topN, val4: v })} /></div>
          </div>
          <Card onMouseDown={() => setPicVal({})}>
            {(piedatalist && dataCylinder(piedatalist['需求处理单位TOP']).length === 0) && <Empty style={{ height: '300px' }} />}
            {piedatalist && dataCylinder(piedatalist['需求处理单位TOP']).length > 0 && (
              <ColumnarY
                height={300}
                data={dataCylindertop(piedatalist['需求处理单位TOP'], 'val4') || []}
                padding={[30, 60, 50, 200]}
                staticName="需求处理单位"
                time1={moment(values.beginTime).format('YYYY-MM-DD 00:00:00')}
                time2={moment(values.endTime).format('YYYY-MM-DD 23:59:59')}
                cols={Issuedscale}
                onGetVal={(v) => { setPicVal({ ...picval, type: v }); }}
              />
            )}
          </Card>
        </Col>
      </Row> */}
    </div>
  );
}

export default connect(({ demandstatistic, loading }) => ({
  piedatalist: demandstatistic.piedatalist, // 饼图
  linedatalist: demandstatistic.linedatalist, // 趋势折线图
  demandtimeoutlist: demandstatistic.demandtimeoutpielist, // 工单超时情况饼图
  ratiodatalist: demandstatistic.ratiodatalist, // 工单数
  loadingratio: loading.effects['demandstatistic/getdemandstatiratioData'],
}))(Statistics);