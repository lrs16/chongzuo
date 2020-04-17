/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { Row, Col, Icon, Tooltip, Card } from 'antd';
import numeral from 'numeral';
import moment from 'moment';
import { ChartCard, Field, MiniArea, Bar } from '@/components/Charts';
import Areanull from '@/components/CustomizeCharts/Areanull';
import Donut from '@/components/CustomizeCharts/Donut';
import NumberInfo from '@/components/NumberInfo';
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
const salesData = [];
for (let i = 0; i < 12; i += 1) {
  salesData.push({
    x: `${i + 1}月`,
    y: Math.floor(Math.random() * 1000) + 200,
  });
}
class Collection extends Component {
  render() {
    return (
      <div>
        <Row gutter={24} type="flex">
          <Col xl={12} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
            <ChartCard
              title="资产统计"
              action={
                <Tooltip title="指标说明">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={numeral(8846).format('0,0')}
              footer={<Field label="日访问量" value={numeral(1234).format('0,0')} />}
              contentHeight={200}
            >
              <MiniArea line height={200} data={visitData} />
            </ChartCard>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
            <ChartCard
              title="资产统计"
              action={
                <Tooltip title="指标说明">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={numeral(8846).format('0,0')}
              footer={<Field label="日访问量" value={numeral(1234).format('0,0')} />}
              contentHeight={200}
            >
              <Bar height={200} data={salesData} />
            </ChartCard>
          </Col>
        </Row>
        <Row gutter={24} type="flex">
          <Col xl={12} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
            <ChartCard
              title="资产统计"
              action={
                <Tooltip title="指标说明">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={numeral(8846).format('0,0')}
              footer={<Field label="日访问量" value={numeral(1234).format('0,0')} />}
              contentHeight={300}
            >
              <Areanull height={300} />
            </ChartCard>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
            <ChartCard
              title="资产统计"
              action={
                <Tooltip title="指标说明">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={numeral(8846).format('0,0')}
              footer={<Field label="日访问量" value={numeral(1234).format('0,0')} />}
              contentHeight={300}
            >
              <Donut height={300} padding={[10, 200, 10, 80]} />
            </ChartCard>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Collection;
