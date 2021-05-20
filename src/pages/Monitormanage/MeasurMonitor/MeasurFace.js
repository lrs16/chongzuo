import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Icon, Tooltip, Switch, Select, Button, Spin, Empty } from 'antd';
import { ChartCard } from '@/components/Charts';
import Donut from '@/components/CustomizeCharts/Donut';
import SeriesLine from '@/components/CustomizeCharts/SeriesLine';
import EdgeLine from '@/components/CustomizeCharts/EdgeLine';
import ColumnarY from '@/components/CustomizeCharts/ColumnarY';
import LineChart from '@/components/CustomizeCharts/LineChart';
import SelectArea from '@/components/Selects/SelectArea';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

//抄表接口数据
let settl = {
  total: 0,
  tjsj: '',
};

const changeSettData = datas => {
  const arr = Object.values(datas);
  const newArrs = []; // 新的数组格式
  if (!Array.isArray(arr)) {
    return newArrs;
  }
  settl.total = 0;
  for (let i = 0; i < arr.length; i += 1) {
    let vote = {};
    vote.type = arr[i].type;
    vote.count = arr[i].total;
    settl.total += arr[i].total;
    newArrs.push(vote);
  }
  if (arr.length > 0) {
    settl.tjsj = arr[0].date;
  }
  return newArrs;
};

const changearchdata = datas => {
  const arr = Object.values(datas);
  const newArrs = []; // 新的数组格式
  if (!Array.isArray(arr)) {
    return newArrs;
  }
  for (let i = 0; i < arr.length; i += 1) {
    const arrss = arr[i];
    for (let t = 0; t < arrss.length; t += 1) {
      const vote = {};
      vote.clock = moment(arrss[t].date).format('MM/DD HH:mm');
      vote.alert = arrss[t].flag;
      vote.value = arrss[t].total;
      vote.name = arrss[t].type;
      newArrs.push(vote);
      // newArrs.push(arrss[t]);
    }
  }
  return newArrs;
};
const changehour = datas => {
  const newArr = [];
  if (!Array.isArray(datas)) {
    return newArr;
  }
  for (let i = 0; i < datas.length; i += 1) {
    const vote = {};
    vote.value = datas[i].total;
    vote.date = moment(datas[i].date).format('MM/DD HH:mm');
    vote.alert = false;
    vote.alertvalue = datas[i].alarm;
    newArr.push(vote);
  }
  return newArr;
};
const changetable = datas => {
  const newArr = [];
  if (!Array.isArray(datas)) {
    return newArr;
  }
  for (let i = 0; i < datas.length; i += 1) {
    const vote = {};
    vote.name = '未同步';
    vote.value = datas[i].total;
    vote.clock = moment(datas[i].date).format('MM/DD HH:mm');
    // vote.clock = moment(datas[i].date).format('MM/DD HH:mm');
    newArr.push(vote);
  }
  if (datas.length > 0) {
    tjsj.cldzb = datas[0].date;
  }
  return newArr;
};

const changefacetree = datas => {
  const newArr = [];
  if (!Array.isArray(datas)) {
    return newArr;
  }
  const vote = {};
  vote.area = '计量中心';
  vote.children = datas;
  newArr.push(vote);
  if (datas.length > 0) {
    tjsj.zdzc = datas[0].date;
  }
  return newArr;
};
const Filecontent = '阈值：电能表<2000   终端<1000   采集关系<10000';
const Tablecontent = '理论值曲线';
const Donutdata = [
  {
    type: '已处理',
    count: 600,
  },
  {
    type: '未处理',
    count: 200,
  },
  {
    type: '处理中',
    count: 100,
  },
];

let tjsj = {
  zdzc: '', // 自动召测测试
};
// 有用
const Filecols = {
  clock: {
    range: [0.05, 0.95],
    alias: '时刻',
    tickInterval: 1,
  },
  value: {
    // max:17500,
    range: [0, 0.9],
    alias: '待同步档案数量',
    // tickInterval: 2500,
  },
};
const Issuedscale = {
  total: {
    type: 'linear',
    alias: '返回结果数量',
    min: 0,
    tickInterval: 5000,
  },
};
const Tablecols = {
  clock: {
    // min: 1,
    // max: 24,
    range: [0, 0.95],
    alias: '时刻',
    tickInterval: 2,
  },
  value: {
    max: 5000,
    range: [0, 0.9],
    alias: '主表未同步数据量',
    tickInterval: 1000,
  },
};
const timecols = {
  value: {
    min: 0,
    max: 50,
    range: [0, 1],
    alias: '超时记录数',
  },
  date: {
    range: [0.02, 0.9],
    alias: '时刻',
    tickInterval: 2,
  },
  alertvalue: {
    min: -10,
    max: 50,
    alias: '警戒值',
  },
};
const Filecolor = ['#1890ff', '#2fc25b', '#f00'];
const Tablecolor = ['#4061d7', '#bbb', '#f00'];
@connect(({ measurface, loading }) => ({
  measurface,
  loading: loading.models.measurface,
}))
class MeasurFace extends Component {
  componentDidMount() {
    this.getdatas();
    this.interval = setInterval(() => this.getdatas(), 600000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getdatas() {
    const { dispatch } = this.props;
    dispatch({
      type: 'measurface/fetchsettl',
    });
    dispatch({
      type: 'measurface/fetcharch', // 档案同步
    });
    dispatch({
      type: 'measurface/fetchissue', // 参数下发
    });
    dispatch({
      type: 'measurface/fetchfile', //
    });
    dispatch({
      type: 'measurface/fetchtable',
    });
    dispatch({
      type: 'measurface/fetchorder',
    });
  }

  getsettl() {
    const { dispatch } = this.props;
    dispatch({
      type: 'measurface/fetchsettl',
    });
  }

  onChange = checked => {
    if (checked === true) {
      setInterval(() => this.getsettl(), 20000);
    } else setTimeout(() => this.getsettl(), 20000);
  };

  render() {
    const {
      loading,
      measurface: {
        settldata, // 抄表结算接口数据
        archdata, // 档案同步
        issuedata, // 参数下发
        filetdata,
        tabledata, // 测量点主表生成
        orderdata,
      },
    } = this.props;
    const settldatas = changeSettData(settldata);
    const archdatas = changearchdata(archdata);
    const orderdatas = changehour(orderdata);
    const tabledatas = changetable(tabledata);
    // console.log('打印',tabledata.records);
    const facetree = changefacetree(filetdata);
    return (
      <PageHeaderWrapper title="接口数据核查情况">
        <div>
          <Row gutter={24} type="flex">
            <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
              <ChartCard title={`抄表结算接口 ${settl.tjsj}`}>
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: -18,
                    textAlign: 'right',
                  }}
                >
                  <span>开始/结束进程</span>
                  <Switch
                    style={{ margin: '-5px 10px 0 10px' }}
                    checkedChildren="开"
                    unCheckedChildren="结"
                    defaultChecked
                    onChange={this.onChange}
                  />
                  <span>5s/刷新</span>
                </div>

                <Spin spinning={loading} style={{ background: '#ffffff' }}>
                  {settldatas === undefined && <Empty style={{ height: '250px' }} />}
                  {settldatas !== undefined && (
                    <Donut
                      data={settldatas}
                      height={350}
                      total={settl.total}
                      padding={[10, 10, 10, 10]}
                    />
                  )}
                </Spin>
              </ChartCard>
            </Col>
            <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
              <ChartCard
                title="档案同步接口（同步中间库）"
                action={
                  <Tooltip title="指标说明： 红点为超阈值数量">
                    <Icon type="info-circle-o" style={{ color: '#f60' }} />
                  </Tooltip>
                }
                contentHeight={350}
              >
                <Spin spinning={loading} style={{ background: '#ffffff' }}>
                  {archdatas.length === 0 && <Empty style={{ height: '250px' }} />}
                  {archdatas.length > 0 && (
                    <SeriesLine
                      cols={Filecols}
                      data={archdatas}
                      content={Filecontent}
                      Color={Filecolor}
                      height={350}
                      padding={[30, 20, 70, 80]}
                    />
                  )}
                </Spin>
              </ChartCard>
            </Col>
            <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
              <ChartCard
                title={`参数下发  ${issuedata.length > 0 ? issuedata[0].date : ''}`}
                contentHeight={350}
              >
                <Spin spinning={loading} style={{ background: '#ffffff' }}>
                  {issuedata.length === 0 && <Empty style={{ height: '250px' }} />}
                  {issuedata.length > 0 && (
                    <ColumnarY
                      cols={Issuedscale}
                      data={issuedata}
                      height={350}
                      padding={[30, 60, 50, 100]}
                    />
                  )}
                </Spin>
              </ChartCard>
            </Col>
            <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
              <ChartCard title={`自动召测测试`} contentHeight={350}>
                <div style={{ margin: '0px 0 0 0' }}>
                  <Spin spinning={loading} style={{ background: '#ffffff' }}>
                    {facetree.length === 0 && <Empty style={{ height: '250px' }} />}
                    {facetree.length !== 0 && (
                      <EdgeLine datas={facetree[0]} height={350} padding={[20, 50, 10, 50]} />
                    )}
                  </Spin>
                </div>
                {/* <div style={{ margin: '10px', position: 'absolute', top: '10px', zIndex: '100px' }}>
                  <span>档案召测测试</span>
                  <SelectArea />
                  <Button type="primary">手工召测</Button>
                </div> */}
              </ChartCard>
            </Col>
            <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
              <ChartCard title="测量点主表生成" contentHeight={350}>
                <Spin spinning={loading} style={{ background: '#ffffff' }}>
                  {tabledatas.length === 0 && <Empty style={{ height: '250px' }} />}
                  {tabledata.length > 0 && (
                    <SeriesLine
                      cols={Tablecols}
                      data={tabledatas}
                      content={Tablecontent}
                      Color={Tablecolor}
                      height={350}
                      padding={[30, 20, 70, 80]}
                    />
                  )}
                </Spin>
              </ChartCard>
            </Col>
            <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
              <ChartCard title="费控指令-KAFKA指令超时" contentHeight={350}>
                <Spin spinning={loading} style={{ background: '#ffffff' }}>
                  {orderdatas.length === 0 && <Empty style={{ height: '250px' }} />}
                  {orderdatas.length > 0 && (
                    <LineChart
                      height={350}
                      data={orderdatas}
                      cols={timecols}
                      padding={[30, 30, 30, 75]}
                    />
                  )}
                </Spin>
              </ChartCard>
            </Col>
          </Row>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default MeasurFace;
