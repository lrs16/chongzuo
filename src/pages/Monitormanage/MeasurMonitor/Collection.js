/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { Row, Col, Icon, Tooltip, Select } from 'antd';
import numeral from 'numeral';
import moment from 'moment';
import { ChartCard, Field, MiniArea, Bar } from '@/components/Charts';
import Donut from '@/components/CustomizeCharts/Donut';
import Columncolor from '@/components/CustomizeCharts/Columncolor';
import LineChart from '@/components/CustomizeCharts/LineChart';
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
const LineChartData = [
  {
    day: '6',
    value: 10000,
    警戒值: 27000,
  },
  {
    day: '7',
    value: 9800,
    警戒值: 27000,
  },
  {
    day: '8',
    value: 32000,
    警戒值: 27000,
  },
  {
    day: '9',
    value: 8600,
    警戒值: 27000,
  },
  {
    day: '10',
    value: 10556,
    警戒值: 27000,
  },
  {
    day: '11',
    value: 17560,
    警戒值: 27000,
  },
  {
    day: '12',
    value: 10660,
    警戒值: 27000,
  },
  {
    day: '13',
    value: 9650,
    警戒值: 27000,
  },
  {
    day: '14',
    value: 25000,
    警戒值: 27000,
  },
];

const Wholehour = [
  {
    day: '6',
    value: 10000,
    警戒值: 0,
  },
  {
    day: '7',
    value: 9800,
    警戒值: 0,
  },
  {
    day: '8',
    value: 32000,
    警戒值: 0,
  },
  {
    day: '9',
    value: 8600,
    警戒值: 0,
  },
  {
    day: '10',
    value: 10556,
    警戒值: 0,
  },
  {
    day: '11',
    value: 17560,
    警戒值: 0,
  },
  {
    day: '12',
    value: 10660,
    警戒值: 0,
  },
  {
    day: '13',
    value: 9650,
    警戒值: 0,
  },
  {
    day: '14',
    value: 25000,
    警戒值: 0,
  },
];

class Collection extends Component {
  render() {
    return (
      <PageHeaderWrapper title="采集指标情况">
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
            <Col xl={12} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
              <ChartCard
                title="采集完成率"
                action={
                  <Tooltip title="指标说明">
                    <Icon type="info-circle-o" />
                  </Tooltip>
                }
                contentHeight={275}
              >
                <Columncolor line height={275} data={ColumncolorData} padding={[30, 30, 30, 50]} />
              </ChartCard>
            </Col>
            <Col xl={12} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
              <ChartCard
                title="终端覆盖率"
                action={
                  <Tooltip title="指标说明">
                    <Icon type="info-circle-o" />
                  </Tooltip>
                }
                contentHeight={275}
              >
                <Columncolor line height={275} data={ColumncolorData} padding={[30, 30, 30, 50]} />
              </ChartCard>
            </Col>
            <Col xl={12} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
              <ChartCard
                title="自动抄表率"
                action={
                  <Tooltip title="指标说明">
                    <Icon type="info-circle-o" />
                  </Tooltip>
                }
                contentHeight={275}
              >
                <Columncolor line height={275} data={ColumncolorData} padding={[30, 30, 30, 50]} />
              </ChartCard>
            </Col>
            <Col xl={12} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
              <ChartCard
                title="关口0点采集"
                action={
                  <Tooltip title="指标说明">
                    <Icon type="info-circle-o" />
                  </Tooltip>
                }
                contentHeight={275}
              >
                <LineChart line height={275} data={LineChartData} padding={[30, 30, 30, 50]} />
              </ChartCard>
            </Col>
            <Col xl={12} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
              <ChartCard
                title="关口整点采集"
                action={
                  <Tooltip title="指标说明">
                    <Icon type="info-circle-o" />
                  </Tooltip>
                }
                contentHeight={275}
              >
                <LineChart line height={275} data={Wholehour} padding={[30, 30, 30, 50]} />
              </ChartCard>
            </Col>
          </Row>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default Collection;
