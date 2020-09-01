import React, { Component } from 'react';
import { Row, Col, Card } from 'antd';
import moment from 'moment';
import Mock from 'mockjs';
import { ChartCard } from '@/components/Charts';
import LineChart from '@/components/CustomizeCharts/LineChart';

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

function mock2data() {
  const list = [];
  const count = 6;
  for (let i = 0; i < count; i += 1) {
    list.push({
      date: `12:${Random.integer(10, 60)}`,
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

const timecols = {
  value: {
    min: 0,
    max: 100,
    range: [0, 0.95],
    alias: '百分率',
  },
  date: {
    // max: 24,
    range: [0.02, 0.9],
    alias: '时间',
    tickInterval: 2,
  },
};

// eslint-disable-next-line react/prefer-stateless-function
class OtherIndicator extends Component {
  render() {
    const { datas } = this.props;
    const cpuUsages = dataArr(datas.cpuUsage);
    console.log(datas);

    return (
      <Row gutter={24} type="flex">
        <Col xl={12} xs={24}>
          <ChartCard title="CPU使用率" contentHeight={250}>
            <LineChart height={250} data={cpuUsages} cols={timecols} padding={[30, 30, 30, 30]} />
          </ChartCard>
        </Col>
        <Col xl={12} xs={24}>
          <ChartCard title="内存使用率" contentHeight={250}>
            <LineChart height={250} data={mockdata()} cols={timecols} padding={[30, 30, 30, 30]} />
          </ChartCard>
        </Col>
      </Row>
    );
  }
}

export default OtherIndicator;
