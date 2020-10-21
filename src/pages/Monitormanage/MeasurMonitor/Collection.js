/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Icon, Tooltip, Select, Spin, Empty } from 'antd';
// import numeral from 'numeral';
// import moment from 'moment';
import { ChartCard } from '@/components/Charts';
// import Donut from '@/components/CustomizeCharts/Donut';
import Columncolor from '@/components/CustomizeCharts/Columncolor';
import LineChart from '@/components/CustomizeCharts/LineChart';
import Labelline from '@/components/CustomizeCharts/Labelline';
// import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const selectoption = [
  '广西电网公司',
  '南宁供电局',
  '柳州供电局',
  '桂林供电局',
  '贵港供电局',
  '玉林供电局',
  '来宾供电局',
  '河池供电局',
  '梧州供电局',
  '北海供电局',
  '钦州供电局',
  '防城港供电局',
  '崇左供电局',
  '贺州供电局',
];
const { Option } = Select;
const dataArr = datas => {
  const newArr = [];
  if (!Array.isArray(datas)) {
    return newArr;
  }
  for (let i = 0; i < datas.length; i += 1) {
    const vote = {};
    vote.rate = datas[i].rate;
    vote.type = datas[i].type;
    vote.alertvalue = 90;
    newArr.push(vote);
  }

  return newArr;
};

const celldata = datas => {
  const data = datas[0];
  const textmaps = new Map([
    ['tddc', '统调电厂'],
    ['dfdc', '地方电厂'],
    ['bdz', '变电站'],
    ['zb', '专变'],
    ['gb', '公变'],
    ['dy', '低压'],
  ]);
  const newArr = [];
  if (!Array.isArray(datas)) {
    return newArr;
  }
  Object.keys(data).map(key => {
    //  console.log(data[key]);// key=>属性名    data[key]=>属性值
    if (key !== 'dqbm') {
      newArr.push({
        type: textmaps.get(key),
        rate: data[key],
        alertvalue: 90,
      });
    }

    return newArr;
  });
  return newArr.slice(2);
};

const changedate = datas => {
  const newArr = [];
  if (!Array.isArray(datas)) {
    return newArr;
  }
  for (let i = 0; i < datas.length; i += 1) {
    const vote = {};
    vote.value = datas[i].data;
    vote.date = moment(datas[i].date).format('MM/DD');
    vote.alertvalue = 27000;
    newArr.push(vote);
  }
  return newArr;
};

const changehour = datas => {
  const newArr = [];
  if (!Array.isArray(datas)) {
    return newArr;
  }
  for (let i = 0; i < datas.length; i += 1) {
    const vote = {};
    vote.value = datas[i].data;
    vote.date = datas[i].hour;
    vote.alertvalue = 0;
    vote.alert = false;
    newArr.push(vote);
  }
  return newArr;
};

const changesales = datas => {
  const newArr = [];
  if (!Array.isArray(datas)) {
    return newArr;
  }
  for (let i = 0; i < datas.length; i += 1) {
    const vote = {};
    vote.value = datas[i].rate;
    vote.date = moment(datas[i].date).format('HH');
    vote.Max警戒值 = 10;
    vote.Min警戒值 = -10;
    newArr.push(vote);
  }
  return newArr;
};
const clock = '2020-2-15 15:58';

// 有用
const Labecols = {
  value: {
    min: 0,
    max: 29000,
    alias: '值',
  },
  date: {
    alias: '日期',
  },
  alertvalue: {
    min: 0,
    max: 29000,
    alias: '警戒值',
  },
};
const timecols = {
  value: {
    min: 0,
    max: 35000,
    range: [0, 1],
    // alias: '值',
  },
  date: {
    // max: 24,
    range: [0.02, 0.95],
    alias: '时间',
    tickInterval: 2,
  },
  alertvalue: {
    min: 0,
    max: 35000,
    alias: '警戒值',
  },
};
const lin2wcols = {
  value: {
    min: -30,
    max: 30,
    range: [0, 1],
    alias: '波动百分比',
  },
  date: {
    alias: '时间',
    tickInterval: 1,
  },
  Max警戒值: {
    min: -30,
    max: 30,
    alias: '警戒值',
  },
  Min警戒值: {
    min: -30,
    max: 30,
    alias: '警戒值',
  },
};

@connect(({ collection, loading }) => ({
  collection,
  loading: loading.models.collection,
}))
class Collection extends Component {
  componentDidMount() {
    const area = '南宁供电局';
    this.getdatas(area);
    this.interval = setInterval(() => this.getdatas(area), 600000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getdatas(area) {
    const { dispatch } = this.props;
    const sortarea = area.substring(0, 2);
    dispatch({
      type: 'collection/fetchcomplete',
      payload: { area },
    });
    dispatch({
      type: 'collection/fetchcoverage',
      payload: { area },
    });
    dispatch({
      type: 'collection/fetchmeterread',
      payload: { area },
    });
    dispatch({
      type: 'collection/fetchzeroread',
    });
    dispatch({
      type: 'collection/fetchhourread',
    });
    dispatch({
      type: 'collection/fetchsales',
      payload: { sortarea },
    });
    dispatch({
      type: 'collection/fetchsupply',
      payload: { sortarea },
    });
  }

  handleChange = value => {
    this.getdatas(value);
  };

  render() {
    const {
      loading,
      collection: { complete, coverage, meterread, zeroread, hourread, salesdata, supplydata },
    } = this.props;

    const completedata = dataArr(complete);
    const coverages = celldata(coverage);
    console.log(coverages);
    const meterreads = celldata(meterread);
    const zeroreads = changedate(zeroread);
    const hourreads = changehour(hourread);
    const salesdatas = changesales(salesdata);
    const supplydatas = changesales(supplydata);

    return (
      <PageHeaderWrapper title="采集指标情况">
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 35,
            width: '400px',
            padding: '10px 16px',
            textAlign: 'right',
            fontSize: '1.2em',
            color: 'rgba(0, 0, 0, 0.85)',
          }}
        >
          {/* 取数时间：{clock} */}
        </div>
        <div style={{ marginBottom: 12 }}>
          <span>统计口径：</span>
          <Select
            showSearch
            style={{ width: 300 }}
            placeholder="南宁供电局"
            optionFilterProp="children"
            onChange={this.handleChange}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {selectoption.map((item, index) => {
              return (
                <Option key={index.toString()} value={item}>
                  {item}
                </Option>
              );
            })}
          </Select>
        </div>
        <div>
          <Row gutter={24} type="flex">
            <Col xl={12} lg={24} style={{ marginBottom: 24 }}>
              <ChartCard
                title="采集完整率"
                action={
                  <Tooltip title="指标说明">
                    <Icon type="info-circle-o" />
                  </Tooltip>
                }
                contentHeight={350}
              >
                <Spin spinning={loading} style={{ background: '#ffffff' }}>
                  {completedata.length === 0 && <Empty style={{ height: '250px' }} />}
                  {completedata.length > 0 && (
                    <Columncolor height={350} data={completedata} padding={[30, 30, 30, 50]} />
                  )}
                </Spin>
              </ChartCard>
            </Col>
            <Col xl={12} lg={24} style={{ marginBottom: 24 }}>
              <ChartCard
                title="终端覆盖率"
                action={
                  <Tooltip title="指标说明">
                    <Icon type="info-circle-o" />
                  </Tooltip>
                }
                contentHeight={350}
              >
                <Spin spinning={loading} style={{ background: '#ffffff' }}>
                  {coverages.length === 0 && <Empty style={{ height: '250px' }} />}
                  {coverages.length > 0 && (
                    <Columncolor height={350} data={coverages} padding={[30, 50, 30, 50]} />
                  )}
                </Spin>
              </ChartCard>
            </Col>
            <Col xl={12} lg={24} style={{ marginBottom: 24 }}>
              <ChartCard
                title="自动抄表率"
                action={
                  <Tooltip title="指标说明">
                    <Icon type="info-circle-o" />
                  </Tooltip>
                }
                contentHeight={350}
              >
                <Spin spinning={loading} style={{ background: '#ffffff' }}>
                  {meterreads.length === 0 && <Empty style={{ height: '250px' }} />}
                  {meterreads.length > 0 && (
                    <Columncolor height={350} data={meterreads} padding={[30, 50, 30, 50]} />
                  )}
                </Spin>
              </ChartCard>
            </Col>
            <Col xl={12} lg={24} style={{ marginBottom: 24 }}>
              <ChartCard
                title="关口0点采集"
                action={
                  <Tooltip title="指标说明">
                    <Icon type="info-circle-o" />
                  </Tooltip>
                }
                contentHeight={350}
              >
                <Spin spinning={loading} style={{ background: '#ffffff' }}>
                  {Labecols.length === 0 && <Empty style={{ height: '250px' }} />}
                  {zeroreads.length > 0 && (
                    <Labelline
                      height={350}
                      data={zeroreads}
                      cols={Labecols}
                      padding={[30, 30, 30, 50]}
                    />
                  )}
                </Spin>
              </ChartCard>
            </Col>
            <Col xl={12} lg={24} style={{ marginBottom: 24 }}>
              <ChartCard
                title="关口整点采集"
                action={
                  <Tooltip title="指标说明">
                    <Icon type="info-circle-o" />
                  </Tooltip>
                }
                contentHeight={350}
              >
                <Spin spinning={loading} style={{ background: '#ffffff' }}>
                  {hourreads.length === 0 && <Empty style={{ height: '250px' }} />}
                  {hourreads.length > 0 && (
                    <LineChart
                      height={350}
                      data={hourreads}
                      cols={timecols}
                      padding={[30, 40, 30, 60]}
                    />
                  )}
                </Spin>
              </ChartCard>
            </Col>

            <Col xl={12} lg={24} style={{ marginBottom: 24 }}>
              <ChartCard
                title="供电量分析（与前一日供电量比值）"
                action={
                  <Tooltip title="指标说明">
                    <Icon type="info-circle-o" />
                  </Tooltip>
                }
                contentHeight={350}
              >
                <Spin spinning={loading} style={{ background: '#ffffff' }}>
                  {salesdatas.length === 0 && <Empty style={{ height: '250px' }} />}
                  {salesdatas.length > 0 && (
                    <LineChart
                      height={350}
                      data={salesdatas}
                      cols={lin2wcols}
                      padding={[30, 30, 30, 60]}
                    />
                  )}
                </Spin>
              </ChartCard>
            </Col>

            <Col xl={12} lg={24} style={{ marginBottom: 24 }}>
              <ChartCard
                title="售电量分析（与前一日售电量比值）"
                action={
                  <Tooltip title="指标说明">
                    <Icon type="info-circle-o" />
                  </Tooltip>
                }
                contentHeight={350}
              >
                <Spin spinning={loading} style={{ background: '#ffffff' }}>
                  {supplydatas.length === 0 && <Empty style={{ height: '250px' }} />}
                  {supplydatas.length > 0 && (
                    <LineChart
                      height={350}
                      data={supplydatas}
                      cols={lin2wcols}
                      padding={[30, 30, 30, 50]}
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

export default Collection;
