/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import Mock from 'mockjs';
import {
  Row,
  Col,
  Card,
  Table,
  // Pagination ,
  // Empty ,
} from 'antd';
import numeral from 'numeral';
import { GaugeChart } from 'bizcharts';
import SeriesLine from '@/components/CustomizeCharts/SeriesLine';

const { Random } = Mock;
const downdycols = {
  clock: {
    range: [0.05, 0.95],
    alias: '时刻',
    tickInterval: 1,
  },
  value: {
    min: 0,
    // max: 30000,
    range: [0.05, 0.95],
    alias: '整点KAFKA主题LAG数',
    // tickInterval: 10000,
  },
};
function databaseindicator() {
  const list = [];
  const count = 24;
  for (let i = 0; i < count; i += 1) {
    list.push({
      clock: i % 24,
      // type:['WebDataAsk', 'BlParamRequest', 'AutoDataAsk','WebParamRequest','FkRequest'][i % 5],
      name: 'WebDataAsk',
      alerttip: true,
      value: Random.integer(6000, 6800),
    });
    list.push({
      clock: i % 24,
      name: 'BlParamRequest',
      alerttip: false,
      value: Random.integer(5500, 6000),
    });
    list.push({
      clock: i % 24,
      name: 'AutoDataAsk',
      alerttip: false,
      value: Random.integer(5800, 6000),
    });
    list.push({
      clock: i % 24,
      name: 'WebParamRequest',
      alerttip: false,
      value: Random.integer(3000, 7000),
    });
    list.push({
      clock: i % 24,
      name: 'FkRequest',
      alerttip: false,
      value: Random.integer(6000, 6500),
    });
  }
  return list;
}

const dataSource = [
  {
    key: '1',
    name: '胡彦斌',
    status: 'MOMOUNT',
  },
  {
    key: '2',
    name: '胡彦祖',
    status: 'MOMOUNT',
  },
];

class Databaselastcheck extends Component {
  render() {
    const columns = [
      {
        title: '实例名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '实例状态',
        dataIndex: 'status',
        key: 'status',
      },
    ];
    //    const deviceheight = changedate(userindex).length * 60;
    return (
      <Row gutter={24} type="flex">
        <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
          <Card>
            <div style={{ position: 'absolute', top: '15px' }}>表空间增长趋势（GB）</div>
            <SeriesLine
              cols={downdycols}
              data={databaseindicator()}
              height={300}
              padding={[30, 20, 50, 80]}
            />
          </Card>
        </Col>
        <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
          <Card style={{ height: 280 }}>
            <div style={{ position: 'absolute', top: '15px' }}>当前连接数量</div>
            <SeriesLine
              cols={downdycols}
              data={databaseindicator()}
              height={300}
              padding={[30, 20, 50, 80]}
            />
          </Card>
        </Col>
      </Row>
    );
  }
}

export default Databaselastcheck;
