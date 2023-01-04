/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { Row, Col, Icon, Tooltip } from 'antd';
import numeral from 'numeral';
import moment from 'moment';
import { ChartCard, Field, MiniArea, MiniBar, MiniProgress } from '@/components/Charts';
import Testcase from '@/components/CustomizeCharts/Testcase';
import Trend from '@/components/Trend';
// import GridContent from '@/components/PageHeaderWrapper/GridContent';

const visitData = [];
const beginDay = new Date().getTime();
for (let i = 0; i < 20; i += 1) {
  visitData.push({
    x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'),
    y: Math.floor(Math.random() * 100) + 10,
  });
}

const tags = [];
for (let i = 0; i < 50; i += 1) {
  tags.push({
    name: `TagClout-Title-${i}`,
    value: Math.floor(Math.random() * 50) + 20,
  });
}
class index extends Component {
  render() {
    return (
      <div>
        <Row gutter={24} type="flex">
          <Col xl={8} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
            <ChartCard
              title="资产统计"
              action={
                <Tooltip title="指标说明">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={numeral(8846).format('0,0')}
              footer={<Field label="日访问量" value={numeral(1234).format('0,0')} />}
              contentHeight={46}
            >
              <MiniArea line height={46} data={visitData} />
            </ChartCard>
          </Col>
          <Col xl={8} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
            <ChartCard
              title="资产统计"
              action={
                <Tooltip title="指标说明">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={numeral(8846).format('0,0')}
              footer={<Field label="日访问量" value={numeral(1234).format('0,0')} />}
              contentHeight={46}
            >
              <MiniBar height={46} data={visitData} />
            </ChartCard>
          </Col>
          <Col xl={8} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
            <ChartCard
              title="CPU使用率"
              action={
                <Tooltip title="指标说明">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total="78%"
              footer={
                <div>
                  <span>
                    周同比
                    <Trend flag="up" style={{ marginLeft: 8, color: 'rgba(0,0,0,.85)' }}>
                      12%
                    </Trend>
                  </span>
                  <span style={{ marginLeft: 16 }}>
                    日环比
                    <Trend flag="down" style={{ marginLeft: 8, color: 'rgba(0,0,0,.85)' }}>
                      11%
                    </Trend>
                  </span>
                </div>
              }
              contentHeight={46}
            >
              <MiniProgress percent={78} strokeWidth={8} target={80} />
            </ChartCard>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ChartCard
              title="告警统计"
              action={
                <Tooltip title="指标说明">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={numeral(8846).format('0,0')}
              footer={<Field label="日访问量" value={numeral(1234).format('0,0')} />}
            >
              <Testcase height={400} />
            </ChartCard>
          </Col>
        </Row>
      </div>
    );
  }
}

export default index;
