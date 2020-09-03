import React, { Component } from 'react';
import { Row, Col, Card } from 'antd';
import moment from 'moment';
import Mock from 'mockjs';
import { ChartCard } from '@/components/Charts';
import LineChart from '@/components/CustomizeCharts/LineChart';
import SeriesLine from '@/components/CustomizeCharts/SeriesLine';

const { Random } = Mock;

function mockdata() {
  const list = [];
  const count = 6;
  for (let i = 0; i < count; i += 1) {
    list.push({
      date: `12:${Random.integer(10, 59)}`,
      value: Random.integer(20, 100),
    });
  }
  return list;
}

const dataArr = datas => {
  const newArr = [];
  if (!Array.isArray(datas)) {
    return newArr;
  }
  for (let i = 0; i < datas.length; i += 1) {
    const vote = {};
    vote.date = moment(datas[i].date).format('HH:mm');
    vote.value = datas[i].value;
    newArr.push(vote);
  }
  return newArr;
};

const dataIOArr = datas => {
  const newArr = [];
  if (!Array.isArray(datas)) {
    return newArr;
  }
  for (let i = 0; i < datas.length; i += 1) {
    const vote = {};
    vote.date = moment(datas[i].date).format('HH:mm');
    vote.name = '读';
    vote.value = datas[i].value;
    newArr.push(vote);
    const iovalue = {};
    iovalue.date = moment(datas[i].date).format('HH:mm');
    iovalue.name = '写';
    iovalue.value = datas[i].action;
    newArr.push(iovalue);
  }
  return newArr;
};

const timecols = {
  value: {
    min: 0,
    max: 100,
    range: [0, 0.95],
    alias: '百分率',
  },
  date: {
    // max: 24,
    range: [0.02, 0.95],
    alias: '时间',
    tickCount: 10,
  },
};
const iocols = {
  value: {
    range: [0, 0.95],
    alias: '速率',
  },
  date: {
    // max: 24,
    range: [0.02, 0.95],
    alias: '时间',
    tickCount: 10,
  },
};

// eslint-disable-next-line react/prefer-stateless-function
class OtherIndicator extends Component {
  render() {
    const { datas } = this.props;
    const cpuUsages = dataArr(datas.cpuUsage);
    const memoryUsages = dataArr(datas.memoryUsage);
    const ioRates = dataIOArr(datas.ioRate);
    console.log(ioRates);
    return (
      <Row gutter={24} type="flex">
        <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
          <ChartCard title="CPU使用率" contentHeight={250}>
            <LineChart height={250} data={mockdata()} cols={timecols} padding={[30, 30, 30, 30]} />
          </ChartCard>
        </Col>
        <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
          <ChartCard title="内存使用率" contentHeight={250}>
            <LineChart height={250} data={mockdata()} cols={timecols} padding={[30, 30, 30, 30]} />
          </ChartCard>
        </Col>
        <Col xl={12} xs={24}>
          <ChartCard title="IO读写速率" contentHeight={250}>
            <SeriesLine
              cols={downdycols}
              data={upotherdata}
              height={350}
              padding={[30, 20, 50, 60]}
            />
          </ChartCard>
        </Col>
      </Row>
    );
  }
}

export default OtherIndicator;
