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
      vote.clock = moment(arrss[t].date).format('HH');
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
    vote.date = moment(datas[i].date).format('HH');
    vote.alert = false;
    vote.alertvalue = 10;
    newArr.push(vote);
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

const facetree = {
  name: '计量中心',
  children: [
    {
      name: '南宁',
      state: 0,
    },
    {
      name: '柳州',
      state: 0,
    },
    {
      name: '桂林',
      state: 0,
    },
    {
      name: '贵港',
      state: 1,
    },
    {
      name: '玉林',
      state: 0,
    },
    {
      name: '梧州',
      state: 1,
    },
  ],
};

const Tabledatas = [
  { name: '未同步', clock: 1, value: 1100, alert: false },
  { name: '未同步', clock: 2, value: 1300, alert: false },
  { name: '未同步', clock: 3, value: 1000, alert: false },
  { name: '未同步', clock: 4, value: 1000, alert: false },
  { name: '未同步', clock: 5, value: 1000, alert: false },
  { name: '未同步', clock: 6, value: 1100, alert: false },
  { name: '未同步', clock: 7, value: 1250, alert: false },
  { name: '未同步', clock: 8, value: 990, alert: false },
  { name: '未同步', clock: 9, value: 1350, alert: false },
  { name: '未同步', clock: 10, value: 1550, alert: false },
  { name: '未同步', clock: 11, value: 1450, alert: false },
  { name: '未同步', clock: 12, value: 1350, alert: false },
  { name: '未同步', clock: 13, value: 1100, alert: false },
  { name: '未同步', clock: 14, value: 1500, alert: false },
  { name: '未同步', clock: 15, value: 1100, alert: false },
  { name: '未同步', clock: 16, value: 1100, alert: false },
  { name: '未同步', clock: 17, value: 990, alert: false },
  { name: '未同步', clock: 18, value: 1100, alert: false },
  { name: '未同步', clock: 19, value: 1350, alert: false },
  { name: '未同步', clock: 20, value: 1500, alert: false },
  { name: '未同步', clock: 21, value: 1450, alert: false },
  { name: '未同步', clock: 22, value: 1400, alert: false },
  { name: '未同步', clock: 23, value: 1350, alert: false },
  { name: '未同步', clock: 24, value: 1300, alert: false },
  { name: '基准值', clock: 1, value: 1400, alert: false },
  { name: '基准值', clock: 2, value: 1350, alert: false },
  { name: '基准值', clock: 3, value: 1300, alert: false },
  { name: '基准值', clock: 4, value: 1250, alert: false },
  { name: '基准值', clock: 5, value: 1200, alert: false },
  { name: '基准值', clock: 6, value: 1150, alert: false },
  { name: '基准值', clock: 7, value: 1100, alert: false },
  { name: '基准值', clock: 8, value: 1050, alert: false },
  { name: '基准值', clock: 9, value: 1000, alert: false },
  { name: '基准值', clock: 10, value: 1100, alert: false },
  { name: '基准值', clock: 11, value: 1150, alert: false },
  { name: '基准值', clock: 12, value: 1200, alert: false },
  { name: '基准值', clock: 13, value: 1250, alert: false },
  { name: '基准值', clock: 14, value: 1300, alert: false },
  { name: '基准值', clock: 15, value: 1350, alert: false },
  { name: '基准值', clock: 16, value: 1250, alert: false },
  { name: '基准值', clock: 17, value: 1200, alert: false },
  { name: '基准值', clock: 18, value: 1150, alert: false },
  { name: '基准值', clock: 19, value: 1300, alert: false },
  { name: '基准值', clock: 20, value: 1150, alert: false },
  { name: '基准值', clock: 21, value: 1300, alert: false },
  { name: '基准值', clock: 22, value: 1250, alert: false },
  { name: '基准值', clock: 23, value: 1000, alert: false },
  { name: '基准值', clock: 24, value: 1000, alert: false },
];
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
    min: 1,
    max: 24,
    range: [0, 0.95],
    alias: '时刻',
    tickInterval: 1,
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
    min: -10,
    max: 50,
    range: [0, 1],
    alias: '超时记录数',
  },
  date: {
    range: [0.02, 0.9],
    alias: '时刻',
    tickInterval: 1,
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
      type: 'measurface/fetcharch',
    });
    dispatch({
      type: 'measurface/fetchissue',
    });
    dispatch({
      type: 'measurface/fetchfile',
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
      measurface: { settldata, archdata, issuedata, filetdata, tabledata, orderdata },
    } = this.props;

    const archdatas = changearchdata(archdata);
    const orderdatas = changehour(orderdata);
    return (
      <PageHeaderWrapper title="接口数据核查情况">
        <div>
          <Row gutter={24} type="flex">
            <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
              <ChartCard title="抄表结算接口">
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
                  {Donutdata === undefined && <Empty style={{ height: '250px' }} />}
                  {Donutdata !== undefined && (
                    <Donut data={Donutdata} height={350} padding={[0, 0, 0, 0]} />
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
                {archdatas.length === 0 && <Empty style={{ height: '250px' }} />}
                <Spin spinning={loading} style={{ background: '#ffffff' }}>
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
              <ChartCard title="参考下发（1h/刷新）" contentHeight={350}>
                {issuedata.length === 0 && <Empty style={{ height: '250px' }} />}
                <Spin spinning={loading} style={{ background: '#ffffff' }}>
                  {issuedata.length > 0 && (
                    <ColumnarY
                      cols={Issuedscale}
                      data={issuedata}
                      height={350}
                      padding={[30, 60, 50, 220]}
                    />
                  )}
                </Spin>
              </ChartCard>
            </Col>
            <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
              <ChartCard title="1h/自动召测测试" contentHeight={350}>
                <div style={{ margin: '50px 0 0 0' }}>
                  {facetree === undefined && <Empty style={{ height: '250px' }} />}
                  <Spin spinning={loading} style={{ background: '#ffffff' }}>
                    {facetree !== undefined && (
                      <EdgeLine datas={facetree} height={300} padding={[20, 60, 10, 50]} />
                    )}
                  </Spin>
                </div>
                <div style={{ margin: '10px', position: 'absolute', top: '10px', zIndex: '100px' }}>
                  <span>档案召测测试</span>
                  <SelectArea />
                  <Button type="primary">手工召测</Button>
                </div>
              </ChartCard>
            </Col>
            <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
              <ChartCard title="测量点主表生成" contentHeight={350}>
                {Tabledatas.length === 0 && <Empty style={{ height: '250px' }} />}
                <Spin spinning={loading} style={{ background: '#ffffff' }}>
                  {Tabledatas.length > 0 && (
                    <SeriesLine
                      cols={Tablecols}
                      data={Tabledatas}
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
                {orderdatas.length === 0 && <Empty style={{ height: '250px' }} />}
                <Spin spinning={loading} style={{ background: '#ffffff' }}>
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
