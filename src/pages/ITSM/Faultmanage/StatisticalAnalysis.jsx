import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Avatar, Empty, InputNumber } from 'antd';
import moment from 'moment';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { ChartCard } from '@/components/Charts';
import SelectTime from '@/components/SelectTime/SelectTime';
import DonutPCT from '@/components/CustomizeCharts/DonutPCT';
import SmoothLine from '@/components/CustomizeCharts/SmoothLine';
import ColumnarY from '@/components/CustomizeCharts/ColumnarY';
import styles from './index.less'
import StatisticsCard from './components/StatisticsCard';

const Issuedscale = {
  total: {
    type: 'linear',
    alias: '返回结果数量',
    min: 0,
    tickInterval: 10,
  },
};

function StatisticalAnalysis(props) {
  const { pagetitle } = props.route.name;
  const {
    dispatch,
    analysislist, // 工单总情况
    blameconditlist, // 故障责任单位总情况
    typeconditlist, // 故障分类总情况
    modelconditlist, // 故障模块总情况
    timeoutconditlist, // 故障超时总情况
    registeruserlist, // 故障登记人排名
    registeruserunitlist, // 故障登记人单位排名
    handlerlist, // 故障处理人排名 
    handleunitlist, // 故障处理人单位排名
  } = props;

  const [picval, setPicVal] = useState({});
  const [values, setValues] = useState({}); // 获取统计周期
  const [topN, setTopN] = useState({ val1: 5, val2: 5, val3: 5, val4: 5, }) // 排序

  const piesum = (arr) => { // 饼图统计总数
    let sum = 0;
    if (arr && arr.length > 0) {
      arr.forEach(item => {
        sum += item.value;
      });
    };
    return sum;
  };

  const dataCylinder = (datas, v) => { // 柱状图集成数组
    const newArr = [];
    if (!Array.isArray(datas) || datas.length === 0) {
      return newArr;
    }
    for (let i = 0; datas.length < topN[v] ? i < datas.length : i < topN[v]; i += 1) {
      const vote = {};
      vote.type = datas[i].type;
      vote.total = datas[i].total;
      vote.expected = datas[0].total;
      newArr.push(vote);
    }
    return newArr.reverse();
  };

  useEffect(() => {
    if (values && values.type) {
      const val = {
        time1: moment(values.beginTime).format('YYYY-MM-DD HH:mm:ss'),
        time2: moment(values.endTime).format('YYYY-MM-DD HH:mm:ss'),
        type: values.type
      };

      dispatch({ // 工单总情况
        type: 'faultstatics/getOrderConditions',
        payload: { ...val },
      });

      dispatch({ // 故障责任单位总情况
        type: 'faultstatics/getBlameConditions',
        payload: { ...val },
      });

      dispatch({ // 故障分类总情况
        type: 'faultstatics/getTypeConditions',
        payload: { ...val },
      });

      dispatch({ // 故障模块总情况
        type: 'faultstatics/getModelConditions',
        payload: { ...val },
      });

      dispatch({ // 故障超时总情况
        type: 'faultstatics/getTimeOutConditions',
        payload: { ...val },
      });

      dispatch({ // 故障登记人排名
        type: 'faultstatics/getRegisterUserTop',
        payload: { ...val, num: topN.val1 },
      });

      dispatch({ // 故障登记人单位排名
        type: 'faultstatics/getRegisterUnitTop',
        payload: { ...val, num: topN.val2 },
      });

      dispatch({ // 故障处理人排名
        type: 'faultstatics/getHandlerTop',
        payload: { ...val, num: topN.val3 },
      });

      dispatch({ // 故障处理人单位排名
        type: 'faultstatics/queryHandleUnitTop',
        payload: { ...val, num: topN.val4 },
      });
    }
  }, [values]);

  return (
    <PageHeaderWrapper
      title={pagetitle}
    >
      <div>
        {/* 统计周期 */}
        <SelectTime ChangeDate={(v) => setValues(v)} />
        {/* 工单 */}
        <Row gutter={24}>
          <Col span={8} style={{ marginTop: 24 }}>
            <div className={styles.statisticscard}>
              <Avatar icon="file-protect" />
              <b>故障工单情况</b>
            </div>
            {(!analysislist || (analysislist && analysislist === undefined)) && <Empty style={{ height: '100px' }} />}
            {
              analysislist && analysislist !== undefined && (
                <Row>
                  <Col span={8}><StatisticsCard title='故障总数：' value={analysislist.allNum} suffix='单' des='环比' desval={`${analysislist.allRingPoints}%`} type={Number(analysislist.allRingPoints) > 0 ? 'up' : 'down'} /></Col>
                  <Col span={8}><StatisticsCard title='已处理：' value={analysislist.closeNum} suffix='单' des='环比' desval={`${analysislist.closeRingPoints}%`} type={Number(analysislist.closeRingPoints) > 0 ? 'up' : 'down'} /></Col>
                  <Col span={8}><StatisticsCard title='解决率：' value={analysislist.point} suffix='%' des='环比' desval={`${analysislist.ringPoints}%`} type={Number(analysislist.ringPoints) > 0 ? 'up' : 'down'} /></Col>
                </Row>
              )
            }
          </Col>
          <Col span={8} style={{ marginTop: 24 }}>
            <div className={styles.statisticscard}>
              <Avatar icon="control" />
              <b>系统故障率、可用率</b>
            </div>
            {(!analysislist || (analysislist && analysislist === undefined)) && <Empty style={{ height: '100px' }} />}
            {
              analysislist && analysislist !== undefined && (
                <Row>
                  <Col span={8}><StatisticsCard title='故障时长：' value={analysislist.handleTime} suffix='H' des='环比' desval={`${analysislist.handleTimeRingPoints}%`} type={Number(analysislist.handleTimeRingPoints) > 0 ? 'up' : 'down'} /></Col>
                  <Col span={8}><StatisticsCard title='故障率：' value={analysislist.troublePoint} suffix='%' des='环比' desval={`${analysislist.troubleRingPoints}%`} type={Number(analysislist.troubleRingPoints) > 0 ? 'up' : 'down'} /></Col>
                  <Col span={8}><StatisticsCard title='可用率：' value={analysislist.canUserPoint} suffix='%' des='环比' desval={`${analysislist.canUserRingPoints}%`} type={Number(analysislist.canUserRingPoints) > 0 ? 'up' : 'down'} /></Col>
                </Row>
              )
            }
          </Col>
          <Col span={8} style={{ marginTop: 24 }}>
            <div className={styles.statisticscard}>
              <Avatar icon="security-scan" />
              <b>故障责任单位情况</b>
            </div>
            {(!analysislist || (analysislist && analysislist === undefined)) && <Empty style={{ height: '100px' }} />}
            {
              analysislist && analysislist !== undefined && (
                <Row>
                  <Col span={8}><StatisticsCard title='功能开发：' value={analysislist.development} suffix='单' des='环比' desval={`${analysislist.developmentRingPoints}%`} type={Number(analysislist.developmentRingPoints) > 0 ? 'up' : 'down'} /></Col>
                  <Col span={8}><StatisticsCard title='软件运维：' value={analysislist.soft} suffix='单' des='环比' desval={`${analysislist.softRingPoints}%`} type={Number(analysislist.softRingPoints) > 0 ? 'up' : 'down'} /></Col>
                  <Col span={8}><StatisticsCard title='硬件运维：' value={analysislist.hardware} suffix='单' des='环比' desval={`${analysislist.hardwareRingPoints}%`} type={Number(analysislist.hardwareRingPoints) > 0 ? 'up' : 'down'} /></Col>
                </Row>
              )
            }
          </Col>
        </Row>
        {/* 责任单位 */}
        <Row style={{ marginTop: 24 }}>
          <div className={styles.statisticscard}>
            <Avatar icon="cluster" />
            <b>故障责任单位情况</b>
          </div>
          <Col span={8}>
            <Card onMouseDown={() => setPicVal({})}>
              {(!blameconditlist.pieChart || (blameconditlist.pieChart && blameconditlist.pieChart.length === 0)) && <Empty style={{ height: '300px' }} />}
              {
                blameconditlist.pieChart && blameconditlist.pieChart.length > 0 && (
                  <DonutPCT
                    data={blameconditlist.pieChart || []}
                    height={300}
                    totaltitle='故障总数'
                    total={piesum(blameconditlist.pieChart)}
                    padding={[10, 30, 30, 30]}
                    onGetVal={(v) => { setPicVal({ ...picval, dutyUnit: v }) }}
                  />
                )
              }
            </Card>
          </Col>
          <Col span={16}>
            <Card onMouseDown={() => setPicVal({})} style={{ marginLeft: '-1px' }}>
              {(!blameconditlist.lineChart || (blameconditlist.lineChart && blameconditlist.lineChart.length === 0)) && <Empty style={{ height: '300px' }} />}
              {
                blameconditlist.lineChart && blameconditlist.lineChart.length > 0 && (
                  <SmoothLine
                    data={blameconditlist.lineChart || []}
                    height={300}
                    padding={[30, 0, 70, 60]}
                    onGetVal={(v) => { setPicVal({ ...picval, type: v }) }}
                  />
                )
              }
            </Card>
          </Col>
        </Row>
        {/* 故障类型统计分析 */}
        <Row style={{ marginTop: 24 }}>
          <div className={styles.statisticscard}>
            <Avatar icon="share-alt" />
            <b>故障类型统计分析</b>
          </div>
          <Col span={8}>
            <Card onMouseDown={() => setPicVal({})}>
              <h4 style={{ fontWeight: 'bold' }}>故障类型总情况</h4>
              {(!typeconditlist.allPieChart || (typeconditlist.allPieChart && typeconditlist.allPieChart.length === 0)) && <Empty style={{ height: '300px' }} />}
              {
                typeconditlist.allPieChart && typeconditlist.allPieChart.length > 0 && (
                  <DonutPCT
                    data={typeconditlist.allPieChart || []}
                    height={300}
                    total={piesum(typeconditlist.allPieChart)}
                    totaltitle='故障总数'
                    padding={[10, 30, 30, 30]}
                    onGetVal={(v) => { setPicVal({ ...picval, dutyUnit: v }) }}
                  />
                )
              }
            </Card>
          </Col>
          <Col span={16}>
            <Card onMouseDown={() => setPicVal({})} style={{ marginLeft: '-1px' }}>
              <h4 style={{ fontWeight: 'bold' }}>故障类型趋势分析</h4>
              {(!typeconditlist.allLineChart || (typeconditlist.allLineChart && typeconditlist.allLineChart.length === 0)) && <Empty style={{ height: '300px' }} />}
              {
                typeconditlist.allLineChart && typeconditlist.allLineChart.length > 0 && (
                  <SmoothLine
                    data={typeconditlist.allLineChart || []}
                    height={300}
                    padding={[30, 0, 70, 60]}
                    onGetVal={(v) => { setPicVal({ ...picval, type: v }) }}
                  />
                )
              }
            </Card>
          </Col>
          <Col span={8}>
            <Card onMouseDown={() => setPicVal({})}>
              <h4 style={{ fontWeight: 'bold' }}>硬件故障情况</h4>
              {(!typeconditlist.hardwarePieChart || (typeconditlist.hardwarePieChart && typeconditlist.hardwarePieChart.length === 0)) && <Empty style={{ height: '300px' }} />}
              {
                typeconditlist && typeconditlist.hardwarePieChart && typeconditlist.hardwarePieChart.length > 0 && (
                  <DonutPCT
                    data={typeconditlist.hardwarePieChart || []}
                    height={300}
                    total={piesum(typeconditlist.hardwarePieChart)}
                    totaltitle='硬件故障总数'
                    padding={[10, 30, 30, 30]}
                    onGetVal={(v) => { setPicVal({ ...picval, dutyUnit: v }) }}
                  />
                )
              }
            </Card>
          </Col>
          <Col span={16}>
            <Card onMouseDown={() => setPicVal({})} style={{ marginLeft: '-1px' }}>
              <h4 style={{ fontWeight: 'bold' }}>硬件故障趋势分析</h4>
              {(!typeconditlist.hardwareLineChart || (typeconditlist.hardwareLineChart && typeconditlist.hardwareLineChart.length === 0)) && <Empty style={{ height: '300px' }} />}
              {
                typeconditlist && typeconditlist.hardwareLineChart && typeconditlist.hardwareLineChart.length > 0 && (
                  <SmoothLine
                    data={typeconditlist.hardwareLineChart || []}
                    height={300}
                    padding={[30, 0, 70, 60]}
                    onGetVal={(v) => { setPicVal({ ...picval, type: v }) }}
                  />
                )
              }
            </Card>
          </Col>
          <Col span={8}>
            <Card onMouseDown={() => setPicVal({})}>
              <h4 style={{ fontWeight: 'bold' }}>软件故障情况</h4>
              {(!typeconditlist.softPieChart || (typeconditlist.softPieChart && typeconditlist.softPieChart.length === 0)) && <Empty style={{ height: '300px' }} />}
              {
                typeconditlist && typeconditlist.softPieChart && typeconditlist.softPieChart.length > 0 && (
                  <DonutPCT
                    data={typeconditlist.softPieChart || []}
                    height={300}
                    total={piesum(typeconditlist.softPieChart)}
                    totaltitle='软件故障总数'
                    padding={[10, 30, 30, 30]}
                    onGetVal={(v) => { setPicVal({ ...picval, dutyUnit: v }) }}
                  />
                )
              }
            </Card>
          </Col>
          <Col span={16}>
            <Card onMouseDown={() => setPicVal({})} style={{ marginLeft: '-1px' }}>
              <h4 style={{ fontWeight: 'bold' }}>软件故障趋势分析</h4>
              {(!typeconditlist.softLineChart || (typeconditlist.softLineChart && typeconditlist.softLineChart.length === 0)) && <Empty style={{ height: '300px' }} />}
              {
                typeconditlist && typeconditlist.softLineChart && typeconditlist.softLineChart.length > 0 && (
                  <SmoothLine
                    data={typeconditlist.softLineChart || []}
                    height={300}
                    padding={[30, 0, 70, 60]}
                    onGetVal={(v) => { setPicVal({ ...picval, type: v }) }}
                  />
                )
              }
            </Card>
          </Col>
        </Row>
        {/* 故障系统模块情况 */}
        <Row style={{ marginTop: 24 }}>
          <div className={styles.statisticscard}>
            <Avatar icon="share-alt" />
            <b>故障系统模块情况</b>
          </div>
          <Col span={8}>
            <Card onMouseDown={() => setPicVal({})}>
              {(!modelconditlist.pieChart || (modelconditlist.pieChart && modelconditlist.pieChart.length === 0)) && <Empty style={{ height: '300px' }} />}
              {
                modelconditlist.pieChart && modelconditlist.pieChart.length > 0 && (
                  <DonutPCT
                    data={modelconditlist.pieChart || []}
                    height={300}
                    total={piesum(modelconditlist.pieChart)}
                    totaltitle='总工单数'
                    padding={[10, 30, 30, 30]}
                    onGetVal={(v) => { setPicVal({ ...picval, dutyUnit: v }) }}
                  />
                )
              }
            </Card>
          </Col>
          <Col span={16}>
            <Card onMouseDown={() => setPicVal({})} style={{ marginLeft: '-1px' }}>
              {(!modelconditlist.lineChart || (modelconditlist.lineChart && modelconditlist.lineChart.length === 0)) && <Empty style={{ height: '300px' }} />}
              {modelconditlist.lineChart && modelconditlist.lineChart.length > 0 && (
                <SmoothLine
                  data={modelconditlist.lineChart || []}
                  height={300}
                  padding={[30, 0, 70, 60]}
                  onGetVal={(v) => { setPicVal({ ...picval, type: v }) }}
                />
              )}
            </Card>
          </Col>
        </Row>
        {/* 故障工单超时情况 + 故障登记人Top5 */}
        <Row gutter={12} style={{ marginTop: 24 }}>
          <Col span={12}>
            <div className={styles.statisticscard}>
              <Avatar icon="share-alt" />
              <b>故障工单超时情况</b>
            </div>
            <Card onMouseDown={() => setPicVal({})}>
              {(!timeoutconditlist || (timeoutconditlist && timeoutconditlist.length === 0)) && <Empty style={{ height: '364.5px' }} />}
              {
                timeoutconditlist && timeoutconditlist.length > 0 && (
                  <DonutPCT
                    data={timeoutconditlist || []}
                    height={364.5}
                    total={piesum(timeoutconditlist)}
                    totaltitle='总工单数'
                    padding={[10, 30, 30, 30]}
                    onGetVal={(v) => { setPicVal({ ...picval, dutyUnit: v }) }}
                  />
                )
              }
            </Card>
          </Col>
          <Col span={12}>
            <div className={styles.statisticscard}>
              <Avatar icon="share-alt" />
              <b>故障登记人Top{topN.val1}</b>
              <div style={{ float: 'right' }} >n：<InputNumber defaultValue={5} onChange={v => setTopN({ ...topN, val1: v })} /></div>
            </div>
            <ChartCard contentHeight={350} onMouseDown={() => setPicVal({})} >
              {(!registeruserlist || (registeruserlist && registeruserlist.length === 0)) && <Empty style={{ height: '350px' }} />}
              {registeruserlist && registeruserlist.length > 0 && (
                <ColumnarY
                  height={350}
                  data={dataCylinder(registeruserlist, 'val1')}
                  padding={[30, 60, 50, 100]}
                  cols={Issuedscale}
                  onGetVal={(v) => { setPicVal({ ...picval, type: v }); }}
                />
              )}
            </ChartCard>
          </Col>
        </Row>
        {/* 故障处理人Top5 + 故障登记单位Top5 */}
        <Row gutter={12} style={{ marginTop: 24 }}>
          <Col span={12}>
            <div className={styles.statisticscard}>
              <Avatar icon="share-alt" />
              <b>故障处理人Top{topN.val2}</b>
              <div style={{ float: 'right' }} >n：<InputNumber defaultValue={5} onChange={v => setTopN({ ...topN, val2: v })} /></div>
            </div>
            <ChartCard contentHeight={350} onMouseDown={() => setPicVal({})} >
              {(!handlerlist || (handlerlist && handlerlist.length === 0)) && <Empty style={{ height: '350px' }} />}
              {handlerlist && handlerlist.length > 0 && (
                <ColumnarY
                  height={350}
                  data={dataCylinder(handlerlist, 'val2')}
                  padding={[30, 60, 50, 100]}
                  cols={Issuedscale}
                  onGetVal={(v) => { setPicVal({ ...picval, type: v }); }}
                />
              )}
            </ChartCard>
          </Col>
          <Col span={12}>
            <div className={styles.statisticscard}>
              <Avatar icon="share-alt" />
              <b>故障登记单位Top{topN.val3}</b>
              <div style={{ float: 'right' }} >n：<InputNumber defaultValue={5} onChange={v => setTopN({ ...topN, val3: v })} /></div>
            </div>
            <ChartCard contentHeight={350} onMouseDown={() => setPicVal({})} >
              {(!registeruserunitlist || (registeruserunitlist && registeruserunitlist.length === 0)) && <Empty style={{ height: '350px' }} />}
              {registeruserunitlist && registeruserunitlist.length > 0 && (
                <ColumnarY
                  height={350}
                  data={dataCylinder(registeruserunitlist, 'val3')}
                  padding={[30, 60, 50, 100]}
                  cols={Issuedscale}
                  onGetVal={(v) => { setPicVal({ ...picval, type: v }); }}
                />
              )}
            </ChartCard>
          </Col>
        </Row>
        {/* 故障处理单位Top5 */}
        <Row gutter={12} style={{ marginTop: 24 }}>
          <Col span={12}>
            <div className={styles.statisticscard}>
              <Avatar icon="share-alt" />
              <b>故障处理单位Top{topN.val4}</b>
              <div style={{ float: 'right' }} >n：<InputNumber defaultValue={5} onChange={v => setTopN({ ...topN, val4: v })} /></div>
            </div>
            <ChartCard contentHeight={350} onMouseDown={() => setPicVal({})} >
              {(!handleunitlist || (handleunitlist && handleunitlist.length === 0)) && <Empty style={{ height: '350px' }} />}
              {handleunitlist && handleunitlist.length > 0 && (
                <ColumnarY
                  height={350}
                  data={dataCylinder(handleunitlist, 'val4')}
                  padding={[30, 60, 50, 100]}
                  cols={Issuedscale}
                  onGetVal={(v) => { setPicVal({ ...picval, type: v }); }}
                />
              )}
            </ChartCard>
          </Col>
        </Row>
      </div>
    </PageHeaderWrapper>
  );
}

export default connect(({ faultstatics }) => ({
  analysislist: faultstatics.analysislist, // 工单总情况
  blameconditlist: faultstatics.blameconditlist, // 故障责任单位总情况
  typeconditlist: faultstatics.typeconditlist, // 故障分类总情况
  modelconditlist: faultstatics.modelconditlist, // 故障模块总情况
  timeoutconditlist: faultstatics.timeoutconditlist, // 故障超时总情况
  registeruserlist: faultstatics.registeruserlist, // 故障登记人排名
  registeruserunitlist: faultstatics.registeruserunitlist, // 故障登记人单位排名
  handlerlist: faultstatics.handlerlist, // 故障处理人排名
  handleunitlist: faultstatics.handleunitlist, // 故障处理人单位排名
}))(StatisticalAnalysis);