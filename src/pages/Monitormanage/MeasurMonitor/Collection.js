/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { Row, Col, Icon, Tooltip, Select } from 'antd';
// import numeral from 'numeral';
// import moment from 'moment';
import { ChartCard } from '@/components/Charts';
// import Donut from '@/components/CustomizeCharts/Donut';
import Columncolor from '@/components/CustomizeCharts/Columncolor';
import LineChart from '@/components/CustomizeCharts/LineChart';
// import Line2WChart from '@/components/CustomizeCharts/Line2WChart';
// import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const { Option } = Select;
const ColumncolorData = [
  {
    name: '低压',
    完成率: 100,
    警戒值: 90,
  },
  {
    name: '公变',
    完成率: 100,
    警戒值: 90,
  },
  {
    name: '专变',
    完成率: 90,
    警戒值: 90,
  },
  {
    name: '统调电厂',
    完成率: 95,
    警戒值: 90,
  },
  {
    name: '地方电厂',
    完成率: 100,
    警戒值: 90,
  },
  {
    name: '变电站',
    完成率: 88,
    警戒值: 90,
  },
];
const ColumncolorData2 = [
  {
    name: '低压',
    完成率: 90,
    警戒值: 90,
  },
  {
    name: '公变',
    完成率: 60,
    警戒值: 90,
  },
  {
    name: '专变',
    完成率: 100,
    警戒值: 90,
  },
  {
    name: '统调电厂',
    完成率: 100,
    警戒值: 90,
  },
  {
    name: '地方电厂',
    完成率: 98,
    警戒值: 90,
  },
  {
    name: '变电站',
    完成率: 100,
    警戒值: 90,
  },
];
const LineChartData = [
  {
    clock: '6',
    value: 10000,
    警戒值: 27000,
    alert: false,
  },
  {
    clock: '7',
    value: 9800,
    警戒值: 27000,
    alert: false,
  },
  {
    clock: '8',
    value: 32000,
    警戒值: 27000,
    alert: true,
  },
  {
    clock: '9',
    value: 8600,
    警戒值: 27000,
    alert: false,
  },
  {
    clock: '10',
    value: 10556,
    警戒值: 27000,
    alert: false,
  },
  {
    clock: '11',
    value: 17560,
    警戒值: 27000,
    alert: false,
  },
  {
    clock: '12',
    value: 10660,
    警戒值: 27000,
    alert: false,
  },
  {
    clock: '13',
    value: 9650,
    警戒值: 27000,
    alert: false,
  },
  {
    clock: '14',
    value: 28000,
    警戒值: 27000,
    alert: true,
  },
  {
    clock: '15',
    value: 29000,
    警戒值: 27000,
    alert: true,
  },
];

const Wholehour = [
  { clock: '1', value: 9800, Min警戒值: 0, alert: false },
  { clock: '2', value: 32000, Min警戒值: 0, alert: false },
  { clock: '3', value: 8600, Min警戒值: 0, alert: false },
  { clock: '4', value: 10556, Min警戒值: 0, alert: false },
  { clock: '5', value: 17560, Min警戒值: 0, alert: false },
  { clock: '6', value: 10660, Min警戒值: 0, alert: false },
  { clock: '7', value: 9650, Min警戒值: 0, alert: false },
  { clock: '8', value: 25000, Min警戒值: 0, alert: false },
  { clock: '9', value: 23000, Min警戒值: 0, alert: false },
  { clock: '10', value: 10000, Min警戒值: 0, alert: false },
  { clock: '11', value: 9800, Min警戒值: 0, alert: false },
  { clock: '12', value: 32000, Min警戒值: 0, alert: false },
  { clock: '13', value: 8600, Min警戒值: 0, alert: false },
  { clock: '14', value: 10556, Min警戒值: 0, alert: false },
  { clock: '15', value: 17560, Min警戒值: 0, alert: false },
  { clock: '16', value: 10660, Min警戒值: 0, alert: false },
  { clock: '17', value: 9650, Min警戒值: 0, alert: false },
  { clock: '18', value: 25000, Min警戒值: 0, alert: false },
  { clock: '19', value: 23000, Min警戒值: 0, alert: false },
  { clock: '20', value: 10556, Min警戒值: 0, alert: false },
  { clock: '21', value: 17560, Min警戒值: 0, alert: false },
  { clock: '22', value: 10660, Min警戒值: 0, alert: false },
  { clock: '23', value: 9650, Min警戒值: 0, alert: false },
  { clock: '24', value: 25000, Min警戒值: 0, alert: false },
];

const Powerdata = [
  {
    clock: '0',
    value: -8,
    Max警戒值: 10,
    Min警戒值: -10,
    alert: false,
  },
  {
    clock: '4',
    value: 8,
    Max警戒值: 10,
    Min警戒值: -10,
    alert: false,
  },
  {
    clock: '8',
    value: 20,
    Max警戒值: 10,
    Min警戒值: -10,
    alert: true,
  },
  {
    clock: '12',
    value: 9,
    Max警戒值: 10,
    Min警戒值: -10,
    alert: false,
  },
  {
    clock: '16',
    value: 0,
    Max警戒值: 10,
    Min警戒值: -10,
    alert: false,
  },
  {
    clock: '18',
    value: -15,
    Max警戒值: 10,
    Min警戒值: -10,
    alert: true,
  },
  {
    clock: '24',
    value: -10,
    Max警戒值: 10,
    Min警戒值: -10,
    alert: true,
  },
];
const clock = '2020-2-15 15:58';
// 有用
const lincols = {
  value: {
    min: 0,
    max: 35000,
    range: [0, 1],
  },
  clock: {
    range: [0, 0.9],
    alias: '日期',
    tickInterval: 1,
  },
  警戒值: {
    min: 0,
    max: 35000,
    alias: '警戒值',
  },
};
const timecols = {
  value: {
    min: 0,
    max: 35000,
    range: [0, 1],
    alias: '\n',
  },
  clock: {
    max: 24,
    range: [0.02, 0.95],
    alias: '时间',
    tickInterval: 2,
  },
  Min警戒值: {
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
  clock: {
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
class Collection extends Component {
  render() {
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
          取数时间：{clock}
        </div>
        <div style={{ marginBottom: 12 }}>
          <span>统计口径：</span>
          <Select
            showSearch
            style={{ width: 300 }}
            placeholder="请选择"
            optionFilterProp="children"
            // onChange={onChange}
            // onFocus={onFocus}
            // onBlur={onBlur}
            // onSearch={onSearch}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            <Option value="广西电网公司">广西电网公司</Option>
            <Option value="南宁供电局">南宁供电局</Option>
            <Option value="柳州供电局">柳州供电局</Option>
          </Select>
        </div>
        <div>
          <Row gutter={24} type="flex">
            <Col xl={12} lg={24} style={{ marginBottom: 24 }}>
              <ChartCard
                title="采集完成率"
                action={
                  <Tooltip title="指标说明">
                    <Icon type="info-circle-o" />
                  </Tooltip>
                }
              >
                <Columncolor height={350} data={ColumncolorData} padding={[30, 30, 30, 50]} />
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
              >
                <Columncolor height={350} data={ColumncolorData2} padding={[30, 30, 30, 50]} />
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
              >
                <Columncolor height={350} data={ColumncolorData} padding={[30, 30, 30, 50]} />
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
              >
                <LineChart
                  height={350}
                  data={LineChartData}
                  cols={lincols}
                  padding={[30, 30, 30, 50]}
                />
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
              >
                <LineChart
                  height={350}
                  data={Wholehour}
                  cols={timecols}
                  padding={[30, 40, 30, 75]}
                />
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
              >
                <LineChart
                  height={350}
                  data={Powerdata}
                  cols={lin2wcols}
                  padding={[30, 30, 30, 75]}
                />
              </ChartCard>
            </Col>
            <Col xl={12} lg={24} style={{ marginBottom: 24 }}>
              <ChartCard
                title="售电量分析（与前一日供电量比值）"
                action={
                  <Tooltip title="指标说明">
                    <Icon type="info-circle-o" />
                  </Tooltip>
                }
              >
                <LineChart
                  height={350}
                  data={Powerdata}
                  cols={lin2wcols}
                  padding={[30, 30, 30, 75]}
                />
              </ChartCard>
            </Col>
          </Row>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default Collection;
