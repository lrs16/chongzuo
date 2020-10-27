/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import Mock from 'mockjs';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Table,
  // Pagination ,
  // Empty ,
} from 'antd';
import SeriesLine from '@/components/CustomizeCharts/SeriesLine';
import { ConsoleSqlOutlined } from '@ant-design/icons';

const changetime = datas => {
  const newArr = [];
  if (!Array.isArray(datas)) {
    return newArr;
  }
  for (let i = 0; i < datas.length; i += 1) {
    const vote = {};
    vote.name = '连接数';
    vote.value = datas[i].value;
    vote.clock = moment(datas[i].date).format('MM/DD HH:mm');
    newArr.push(vote);
  }
  return newArr;
};

const changedate = datas => {
  const newArr = [];
  if (!Array.isArray(datas)) {
    return newArr;
  }
  for (let i = 0; i < datas.length; i += 1) {
    const vote = {};
    vote.name = datas[i].name;
    vote.value = datas[i].value;
    vote.clock = moment(datas[i].time).format('MM/DD HH:mm');
    newArr.push(vote);
  }
  return newArr;
};
const downdycols = {
  clock: {
    range: [0.05, 0.95],
    alias: ' ',
    tickCount: 5,
    //tickInterval: 1,
  },
  value: {
    min: 0,
    // max: 30000,
    range: [0.05, 0.95],
    alias: ' ',
  },
};

class Databaselastcheck extends Component {
  render() {
    const { spaceusage, spaceuconnet } = this.props;
    const usagedatas = changedate(spaceusage);
    const spaceuconnets = changetime(spaceuconnet);
    return (
      <Row gutter={24} type="flex">
        <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
          <Card>
            <div style={{ position: 'absolute', top: '15px' }}>表空间增长趋势（GB）</div>
            <SeriesLine
              cols={downdycols}
              data={usagedatas}
              height={300}
              padding={[30, 20, 60, 20]}
            />
          </Card>
        </Col>
        <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
          <Card>
            <div style={{ position: 'absolute', top: '15px' }}>当前连接数量</div>
            <SeriesLine
              cols={downdycols}
              data={spaceuconnets}
              height={300}
              padding={[30, 20, 60, 20]}
            />
          </Card>
        </Col>
      </Row>
    );
  }
}

export default Databaselastcheck;
