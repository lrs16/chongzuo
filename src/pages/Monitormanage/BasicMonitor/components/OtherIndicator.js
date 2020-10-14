import React, { Component } from 'react';
import { Row, Col, Empty } from 'antd';
import moment from 'moment';
import { ChartCard } from '@/components/Charts';
import SeriesLine from '@/components/CustomizeCharts/SeriesLine';

const dataArr = (datas, name) => {
  const newArr = [];
  if (!Array.isArray(datas)) {
    return newArr;
  }
  for (let i = 0; i < datas.length; i += 1) {
    const vote = {};
    vote.clock = moment(datas[i].date).format('MM/DD HH:mm');
    vote.value = datas[i].value;
    (vote.name = name), newArr.push(vote);
  }
  return newArr;
};

const dataIOArr = (datas, Rkey, Wkey) => {
  const newArr = [];
  if (!Array.isArray(datas)) {
    return newArr;
  }
  for (let i = 0; i < datas.length; i += 1) {
    const vote = {};
    if (datas[i].action === 1) {
      vote.clock = moment(datas[i].date).format('MM/DD HH:mm');
      vote.value = datas[i].value;
      vote.name = Wkey;
    }
    if (datas[i].action === 0) {
      vote.clock = moment(datas[i].date).format('MM/DD HH:mm');
      vote.value = datas[i].value;
      vote.name = Rkey;
    }
    newArr.push(vote);
  }
  return newArr;
};

const timecols = {
  value: {
    min: 0,
    max: 100,
    range: [0, 0.9],
    alias: '百分率',
  },
  clock: {
    // max: 24,
    range: [0.1, 0.95],
    alias: '时间',
    tickCount: 4,
  },
};
const iocols = {
  value: {
    max: 500,
    range: [0, 0.9],
    alias: '读/写(kb/s)             ',
  },
  clock: {
    // max: 24,
    range: [0.02, 0.95],
    alias: '时间',
    tickCount: 4,
  },
};
const netcols = {
  value: {
    // max:50,
    range: [0, 0.85],
    alias: '接收/发送(kb/s)',
  },
  clock: {
    // max: 24,
    range: [0.02, 0.95],
    alias: '时间',
    tickCount: 6,
  },
};

// eslint-disable-next-line react/prefer-stateless-function
class OtherIndicator extends Component {
  render() {
    const { datas } = this.props;
    const cpuUsages = dataArr(datas.cpuUsage, 'CPU使用率');
    const memoryUsages = dataArr(datas.memoryUsage, '内存使用率');
    const ioRates = dataIOArr(datas.ioRate, '读', '写');
    const networkTraffics = dataIOArr(datas.networkTraffic, '发送', '接收');
    return (
      <Row gutter={24} type="flex">
        <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
          <ChartCard title="CPU使用率" contentHeight={250}>
            {datas.cpuUsage === undefined ||
              (datas.cpuUsage === null && <Empty style={{ height: 250 }} />)}
            {datas.cpuUsage !== undefined && datas.cpuUsage !== null && (
              <SeriesLine
                height={250}
                data={cpuUsages}
                cols={timecols}
                padding={[30, 30, 50, 30]}
              />
            )}
          </ChartCard>
        </Col>
        <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
          <ChartCard title="内存使用率" contentHeight={250}>
            {datas.memoryUsage === undefined && <Empty style={{ height: 250 }} />}
            {datas.memoryUsage !== undefined && datas.memoryUsage !== null && (
              <SeriesLine
                height={250}
                data={memoryUsages}
                cols={timecols}
                padding={[30, 30, 50, 30]}
              />
            )}
          </ChartCard>
        </Col>
        <Col xl={12} xs={24}>
          <ChartCard title="IO读写速率" contentHeight={250}>
            {datas.ioRate === undefined && <Empty style={{ height: 250 }} />}
            {datas.ioRate !== undefined && datas.ioRate !== null && (
              <SeriesLine cols={iocols} data={ioRates} height={250} padding={[20, 20, 50, 30]} />
            )}
          </ChartCard>
        </Col>
        <Col xl={12} xs={24}>
          <ChartCard title="网络流量" contentHeight={250}>
            {datas.networkTraffic === undefined && <Empty style={{ height: 250 }} />}
            {datas.networkTraffic !== undefined && datas.networkTraffic !== null && (
              <SeriesLine
                cols={netcols}
                data={networkTraffics}
                height={250}
                padding={[20, 20, 50, 30]}
              />
            )}
          </ChartCard>
        </Col>
      </Row>
    );
  }
}

export default OtherIndicator;
