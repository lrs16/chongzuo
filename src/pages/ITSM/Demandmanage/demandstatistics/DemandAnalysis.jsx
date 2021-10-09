import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Avatar, Empty } from 'antd';
import moment from 'moment';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StatistCycle from '../components/StatistCycle'; // 统计周期
import StatisticsCard from '../components/StatisticsCard';
import SmoothLine from '@/components/CustomizeCharts/SmoothLine';
import DonutPCT from '@/components/CustomizeCharts/DonutPCT';
import Cylinder from '@/components/CustomizeCharts/Cylinder';
import { ChartCard } from '@/components/Charts';

const cols = {
  rate: {
    // alias: '%',
    // tickCount: 10,
  },
};

// 饼图数据
const Donutdata = [
  { type: '未开发', value: 130 },
  { type: '已开发', value: 662 },
  { type: '已开发未发布', value: 649 },
  { type: '已发布', value: 200 },
];

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
  for (let i = 0; i < datas.length; i += 1) {
    const vote = {};
    vote.type = datas[i].status;
    vote.value = datas[i].quantity;
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
    vote.expected = '100';
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
  let sum = 0;
  if (arr && arr.length > 0) {
    arr.forEach(item => {
      sum += item.quantity;
    });
  };
  return sum;
};

function Statistics(props) {
  const { pagetitle } = props.route.name;
  const {
    dispatch,
    piedatalist, // 饼图
    linedatalist, // 趋势图
    demandtomeoutArr, // 需求超时情况饼图
  } = props;

  const [picval, setPicVal] = useState({});
  const [values, setValues] = useState({}); // 获取统计周期

  useEffect(() => {
    if (values) {
      const val = {
        begin: moment(values.beginTime).format('YYYY-MM-DD'),
        end: moment(values.endTime).format('YYYY-MM-DD'),
        // begin: '2021-08-01',
        // end: '2021-09-01'
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
        type: 'demandstatistic/fetchdemandTimeoutlist',
        payload: {
          startTime: moment(values.beginTime).format('YYYY-MM-DD'),
          endTime: moment(values.endTime).format('YYYY-MM-DD')
          // startTime: '2021-08-01',
          // endTime: '2021-09-01'
          // startTime: '',
          // endTime: ''
        }
      })
    }
  }, [values]);

  return (
    <PageHeaderWrapper
      title={pagetitle}
    >
      <div>
        {/* 统计周期 */}
        <StatistCycle ChangeDate={(v) => setValues(v)} />
        {/* 希求工单情况 */}
        <Card
          style={{ marginTop: 24, }}
        >
          <Row>
            <Avatar size="large" icon="desktop" style={{ backgroundColor: '#0366c3', verticalAlign: 'middle' }} />
            <b style={{ marginLeft: 12 }}>需求工单情况</b>
          </Row>
          <Row type="flex" justify="space-around">
            <Col>
              <StatisticsCard
                title='需求总数:'
                value={154}
                suffix='单'
                des='环比上月'
                desval='11%'
                type='down'
              // type={Number() > Number() ? 'up' : 'down'} 
              />
            </Col>
            <Col>
              <StatisticsCard
                title='已开发:'
                value={104}
                suffix='单'
                des='环比上月'
                desval='11%'
                type='down'
              // type={Number() > Number() ? 'up' : 'down'} 
              />
            </Col>
            <Col>
              <StatisticsCard
                title='已发布:'
                value={50}
                suffix='单'
                des='环比上月'
                desval='11%'
                type='down'
              // type={Number() > Number() ? 'up' : 'down'} 
              />
            </Col>
            <Col>
              <StatisticsCard
                title='开发率:'
                value={67.53}
                suffix='%'
                des='环比上月'
                desval='11%'
                type='up'
              // type={Number() > Number() ? 'up' : 'down'} 
              />
            </Col>
            <Col>
              <StatisticsCard
                title='发布率:'
                value={32.47}
                suffix='%'
                des='环比上月'
                desval='11%'
                type='up'
              // type={Number() > Number() ? 'up' : 'down'} 
              />
            </Col>
          </Row>
        </Card>
        {/* 需求工单总情况 */}
        <Card
          style={{ marginTop: 24 }}
        >
          <Row>
            <Avatar size="large" icon="pie-chart" style={{ backgroundColor: '#0366c3', verticalAlign: 'middle' }} />
            <b style={{ marginLeft: 12 }}>需求工单总情况</b>
          </Row>
          <Col span={8}>
            <Card onMouseDown={() => setPicVal({})} style={{ border: 'none' }}>
              <DonutPCT
                data={Donutdata}
                height={300}
                totaltitle='需求总数'
                total='154'
                padding={[10, 30, 30, 30]}
                onGetVal={(v) => { setPicVal({ ...picval, dutyUnit: v }) }}
              />
            </Card>
          </Col>
          <Col span={16}>
            <Card onMouseDown={() => setPicVal({})} style={{ marginLeft: '-1px', border: 'none', textAlign: 'right' }}>
              {linedatalist && ( // 需求工单量趋势
                <SmoothLine
                  data={linedataArr(linedatalist['需求工单量趋势'])}
                  height={300}
                  padding={[30, 0, 50, 60]}
                  onGetVal={(v) => { setPicVal({ ...picval, type: v }) }}
                />
              )}
            </Card>
          </Col>
        </Card>
        {/* 功能模块情况 饼+线 */}
        <Card
          style={{ marginTop: 24 }}
        >
          <Row>
            <Avatar size="large" icon="desktop" style={{ backgroundColor: '#0366c3', verticalAlign: 'middle' }} />
            <b style={{ marginLeft: 12 }}>功能模块情况</b>
          </Row>
          {
            piedatalist && ( // 饼图
              <Col span={8}>
                <Card onMouseDown={() => setPicVal({})} style={{ border: 'none' }}>
                  <DonutPCT
                    data={piedatalist['功能模块情况'] || []}
                    height={300}
                    totaltitle='需求总数'
                    total={piesum(piedatalist['功能模块情况'])}
                    padding={[10, 30, 30, 30]}
                    onGetVal={(v) => { setPicVal({ ...picval, dutyUnit: v }) }}
                  />
                </Card>
              </Col>)
          }
          {
            linedatalist && ( // 折线
              <Col span={16}>
                <Card onMouseDown={() => setPicVal({})} style={{ marginLeft: '-1px', border: 'none', textAlign: 'right' }}>
                  {linedatalist && (
                    <SmoothLine
                      data={linedataArr(linedatalist['功能模块情况趋势'])}
                      height={300}
                      padding={[30, 0, 50, 60]}
                      onGetVal={(v) => { setPicVal({ ...picval, type: v }) }}
                    />
                  )}
                </Card>
              </Col>
            )
          }
        </Card>
        {/* 需求类型统计分析 饼+线 */}
        <Card
          style={{ marginTop: 24, marginBottom: 24 }}
        >
          <Row>
            <Avatar size="large" icon="desktop" style={{ backgroundColor: '#0366c3', verticalAlign: 'middle' }} />
            <b style={{ marginLeft: 12 }}>需求类型统计分析</b>
          </Row>
          {
            piedatalist && (
              <Col span={8}>
                <Card onMouseDown={() => setPicVal({})} style={{ border: 'none' }}>
                  <DonutPCT
                    data={piedatalist['需求类型统计分析'] || []}
                    height={300}
                    totaltitle='需求总数'
                    total={piesum(piedatalist['需求类型统计分析'])}
                    padding={[10, 30, 30, 30]}
                    onGetVal={(v) => { setPicVal({ ...picval, dutyUnit: v }) }}
                  />
                </Card>
              </Col>
            )
          }
          {
            linedatalist && (
              <Col span={16}>
                <Card onMouseDown={() => setPicVal({})} style={{ marginLeft: '-1px', border: 'none', textAlign: 'right' }}>
                  <SmoothLine
                    data={linedataArr(linedatalist['需求类型趋势']) || []}
                    height={360}
                    padding={[30, 0, 50, 60]}
                    onGetVal={(v) => { setPicVal({ ...picval, type: v }) }}
                  />
                </Card>
              </Col>
            )
          }
        </Card>
        {/* 需求工单超时情况 饼 */}
        <Row gutter={12} style={{ marginBottom: 24 }}>
          {
            demandtomeoutArr && (
              <Col span={12}>
                <Card>
                  <>
                    <Avatar size="large" icon="desktop" style={{ backgroundColor: '#0366c3', verticalAlign: 'middle' }} />
                    <b style={{ marginLeft: 12 }}>需求工单超时情况</b>
                  </>
                  <ChartCard title="" contentHeight={350} onMouseDown={() => setPicVal({})} style={{ border: 'none' }}>
                    <DonutPCT
                      data={piedataArr(demandtomeoutArr)}
                      height={350}
                      totaltitle='需求总数'
                      total={piesum1(demandtomeoutArr)}
                      padding={[10, 30, 30, 30]}
                      onGetVal={(v) => { setPicVal({ ...picval, dutyUnit: v }) }}
                    /></ChartCard>
                </Card>
              </Col>
            )
          }

          {/* 需求申请人Top5 柱状图 */}
          {
            piedatalist && (
              <Col span={12}>
                <Card onMouseDown={() => setPicVal({})}>
                  <>
                    <Avatar size="large" icon="desktop" style={{ backgroundColor: '#0366c3', verticalAlign: 'middle' }} />
                    <b style={{ marginLeft: 12 }}>需求申请人Top5</b>
                  </>
                  <ChartCard title="CPU TOP5" contentHeight={350} onMouseDown={() => setPicVal({})} style={{ border: 'none' }}>
                    <Cylinder
                      height={350}
                      data={dataCylinder(piedatalist['需求申请人TOP']) || []}
                      padding={[0, 50, 30, 150]}
                      symbol="%"
                      cols={cols}
                      colors="l(270) 0:#04e8ff 0.5:#05bdfe 1:#05bdfe"
                      onGetVal={(v) => { setPicVal({ ...picval, type: v });}}
                    />
                    {/* {piedatalist['需求申请人TOP'].length === 0 && <Empty style={{ height: '250px' }} />}
                    {piedatalist['需求申请人TOP'].length > 0 && (
                      <Cylinder
                        height={350}
                        data={dataCylinder(piedatalist['需求申请人TOP']) || []}
                        padding={[0, 50, 30, 150]}
                        symbol="%"
                        cols={cols}
                        colors="l(270) 0:#04e8ff 0.5:#05bdfe 1:#05bdfe"
                        onGetVal={(v) => { setPicVal({ ...picval, type: v });}}
                      />
                    )} */}
                  </ChartCard>
                </Card>
              </Col>
            )
          }
        </Row>
        {/* 需求处理人Top5 柱状图 */}
        {
          piedatalist && (
            <Row gutter={12} style={{ marginBottom: 24 }}>
              <Col span={12}>
                <Card onMouseDown={() => setPicVal({})}>
                  <>
                    <Avatar size="large" icon="desktop" style={{ backgroundColor: '#0366c3', verticalAlign: 'middle' }} />
                    <b style={{ marginLeft: 12 }}>需求处理人Top5</b>
                  </>
                  <ChartCard title="CPU TOP5" contentHeight={350} onMouseDown={() => setPicVal({})} style={{ border: 'none' }}>
                    <Cylinder
                      height={350}
                      data={dataCylinder(piedatalist['需求处理人TOP']) || []}
                      padding={[0, 50, 30, 150]}
                      symbol="%"
                      cols={cols}
                      colors="l(270) 0:#04e8ff 0.5:#05bdfe 1:#05bdfe"
                      onGetVal={(v) => { setPicVal({ ...picval, type: v }); }}
                    />
                    {/* {piedatalist['需求处理人TOP'].length === 0 && <Empty style={{ height: '250px' }} />}
                    {piedatalist['需求处理人TOP'].length > 0 && (
                      <Cylinder
                        height={350}
                        data={dataCylinder(piedatalist['需求处理人TOP']) || []}
                        padding={[0, 50, 30, 150]}
                        symbol="%"
                        cols={cols}
                        colors="l(270) 0:#04e8ff 0.5:#05bdfe 1:#05bdfe"
                        onGetVal={(v) => { setPicVal({ ...picval, type: v }); }}
                      />
                    )} */}
                  </ChartCard>
                </Card>
              </Col>
              {/* 需求申请单位Top5 */}
              <Col span={12}>
                <Card onMouseDown={() => setPicVal({})}>
                  <>
                    <Avatar size="large" icon="desktop" style={{ backgroundColor: '#0366c3', verticalAlign: 'middle' }} />
                    <b style={{ marginLeft: 12 }}>需求申请单位Top5</b>
                  </>
                  <ChartCard title="CPU TOP5" contentHeight={350} onMouseDown={() => setPicVal({})} style={{ border: 'none' }}>
                    <Cylinder
                      height={350}
                      data={dataCylinder(piedatalist['需求申请单位TOP']) || []}
                      padding={[0, 50, 30, 150]}
                      symbol="%"
                      cols={cols}
                      colors="l(270) 0:#04e8ff 0.5:#05bdfe 1:#05bdfe"
                      onGetVal={(v) => { setPicVal({ ...picval, type: v });}}
                    />
                    {/* {piedatalist['需求申请单位TOP'].length === 0 && <Empty style={{ height: '250px' }} />}
                    {piedatalist['需求申请单位TOP'].length > 0 && (
                      <Cylinder
                        height={350}
                        data={dataCylinder(piedatalist['需求申请单位TOP']) || []}
                        padding={[0, 50, 30, 150]}
                        symbol="%"
                        cols={cols}
                        colors="l(270) 0:#04e8ff 0.5:#05bdfe 1:#05bdfe"
                        onGetVal={(v) => { setPicVal({ ...picval, type: v });}}
                      />
                    )} */}
                  </ChartCard>
                </Card>
              </Col>
            </Row>
          )
        }
        {/* 需求处理单位Top5 */}
        {
          piedatalist && (
            <Row gutter={12}>
              <Col span={12}>
                <Card onMouseDown={() => setPicVal({})}>
                  <>
                    <Avatar size="large" icon="desktop" style={{ backgroundColor: '#0366c3', verticalAlign: 'middle' }} />
                    <b style={{ marginLeft: 12 }}>需求处理单位Top5</b>
                  </>
                  <ChartCard title="CPU TOP5" contentHeight={350} onMouseDown={() => setPicVal({})} style={{ border: 'none' }}>
                    <Cylinder
                      height={350}
                      data={dataCylinder(piedatalist['需求处理单位TOP']) || []}
                      padding={[0, 50, 30, 150]}
                      symbol="%"
                      cols={cols}
                      colors="l(270) 0:#04e8ff 0.5:#05bdfe 1:#05bdfe"
                      onGetVal={(v) => { setPicVal({ ...picval, type: v }); }}
                    />
                    {/* {piedatalist['需求处理单位TOP'].length === 0 && <Empty style={{ height: '250px' }} />}
                    {piedatalist['需求处理单位TOP'].length > 0 && (
                      <Cylinder
                        height={350}
                        data={dataCylinder(piedatalist['需求处理单位TOP']) || []}
                        padding={[0, 50, 30, 150]}
                        symbol="%"
                        cols={cols}
                        colors="l(270) 0:#04e8ff 0.5:#05bdfe 1:#05bdfe"
                        onGetVal={(v) => { setPicVal({ ...picval, type: v }); }}
                      />
                    )} */}
                  </ChartCard>
                </Card>
              </Col>
            </Row>
          )
        }
      </div>
    </PageHeaderWrapper>
  );
}

export default connect(({ demandstatistic }) => ({
  piedatalist: demandstatistic.piedatalist, // 饼图
  linedatalist: demandstatistic.linedatalist, // 趋势折线图
  demandtomeoutArr: demandstatistic.demandtomeoutArr, // 工单超时情况饼图
}))(Statistics);