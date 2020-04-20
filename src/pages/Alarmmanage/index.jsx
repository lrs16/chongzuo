/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { Row, Col, Icon, Tooltip, Card } from 'antd';
import numeral from 'numeral';
import moment from 'moment';
import { ChartCard, Field, MiniArea, MiniBar, MiniProgress, Pie } from '@/components/Charts';
import Testcase from '@/components/CustomizeCharts/Testcase';
// import NumberInfo from '@/components/NumberInfo';
import Trend from '@/components/Trend';

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

const salesPieData = [
  {
    x: '接口程序',
    y: 562,
  },
  {
    x: '主站系统运行',
    y: 3321,
  },
  {
    x: 'KAFKA中间件',
    y: 3113,
  },
  {
    x: '业务指标',
    y: 2341,
  },
  {
    x: '配网入库',
    y: 1231,
  },
  {
    x: '其他',
    y: 1231,
  },
];
class index extends Component {
  render() {
    return (
      <div>
        <Row gutter={24} type="flex">
          <Col xl={6} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
            <ChartCard
              title="今日新增"
              action={
                <Tooltip title="指标说明">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={numeral(1125).format('0,0')}
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
              {/* <MiniArea line height={46} data={visitData} /> */}
            </ChartCard>
          </Col>
          <Col xl={6} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
            <ChartCard
              title="急需处理的告警"
              action={
                <Tooltip title="指标说明">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={numeral(75).format('0,0')}
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
              {/* <MiniArea line height={46} data={visitData} /> */}
            </ChartCard>
          </Col>
          <Col xl={6} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
            <ChartCard
              title="存在告警的资源"
              action={
                <Tooltip title="指标说明">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={numeral(5).format('0,0')}
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
              {/* <MiniProgress percent={90} strokeWidth={8} target={80} /> */}
            </ChartCard>
          </Col>
          <Col xl={6} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
            <ChartCard
              title="精准防御"
              action={
                <Tooltip title="指标说明">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={numeral(88).format('0,0')}
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
              {/* <MiniProgress percent={99.9} strokeWidth={8} target={80} /> */}
            </ChartCard>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <ChartCard
              title="趋势分析"
              action={
                <Tooltip title="指标说明">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              // total={numeral(8846).format('0,0')}
              footer={<Field label="日访问量" value={numeral(1234).format('0,0')} />}
            >
              <Testcase height={350} />
            </ChartCard>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <ChartCard
              title="待处理告警分布统计"
              action={
                <Tooltip title="指标说明">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              // total={numeral(8846).format('0,0')}
              footer={<Field label="日访问量" value={numeral(1234).format('0,0')} />}
            >
              <Pie
                hasLegend
                title="待处理"
                subTitle="待处理"
                total={() => (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: salesPieData.reduce((pre, now) => now.y + pre, 0),
                    }}
                  />
                )}
                data={salesPieData}
                valueFormat={val => <span dangerouslySetInnerHTML={{ __html: val }} />}
                height={350}
              />
            </ChartCard>
          </Col>
        </Row>
      </div>
    );
  }
}

export default index;
