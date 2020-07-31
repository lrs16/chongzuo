/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { connect } from 'dva';
import numeral from 'numeral';
import moment from 'moment';
import { Row, Col, Empty, Spin, Card } from 'antd';
import Columnar from '@/components/CustomizeCharts/Columnar';
import SeriesLine from '@/components/CustomizeCharts/SeriesLine';
import { ChartCard } from '@/components/Charts';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const dataArr = datas => {
  const newArr = [];
  if (!Array.isArray(datas)) {
    return newArr;
  }
  for (let i = 0; i < datas.length; i += 1) {
    const vote = {};
    vote.rate = datas[i].rate * 100;
    vote.type = datas[i].area.substring(0, 2);
    newArr.push(vote);
  }

  return newArr.slice(0, -1);
};
const dataLine = datas => {
  const newArr = [];
  if (!Array.isArray(datas)) {
    return newArr;
  }
  for (let i = 0; i < datas.length; i += 1) {
    const vote = {};
    vote.value = parseInt(datas[i].value);
    vote.name = datas[i].type;
    vote.clock = moment(datas[i].date).format('HH');
    newArr.push(vote);
  }

  return newArr;
};

const datathehoure = datas => {
  const newArr = [];
  if (!Array.isArray(datas)) {
    return newArr;
  }
  for (let i = 0; i < datas.length; i += 1) {
    const vote = {};
    vote.value = parseInt(datas[i].value);
    vote.name = datas[i].type;
    vote.clock = moment(datas[i].date);
    newArr.push(vote);
  }

  return newArr.slice(98, -1);
};
const scale = {
  rate: {
    min: 0,
    max: 100,
    range: [0, 1],
    alias: '终端在线率',
  },
};
const Tablecols = {
  clock: {
    min: 0,
    range: [0.02, 0.95],
    alias: '时刻',
    tickCount: 24,
  },
  value: {
    min: 0,
    range: [0, 0.9],
    alias: '入库数量',
  },
};
const Tablecolor = ['#4061d7', '#f00'];
@connect(({ databaseterminal, loading }) => ({
  databaseterminal,
  loading: loading.models.databaseterminal,
}))
class DatabaseTerminal extends Component {
  componentDidMount() {
    this.getdatas();
    this.interval = setInterval(() => this.getdatas(), 60000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getdatas() {
    const { dispatch } = this.props;
    dispatch({
      type: 'databaseterminal/fetchoperat',
    });
    dispatch({
      type: 'databaseterminal/fetchstorge',
    });
    dispatch({
      type: 'databaseterminal/fetchthehour',
    });
  }

  render() {
    const {
      loading,
      databaseterminal: {
        operatingmode,
        storagecheck,
        thehour,
        // list
      },
    } = this.props;

    const operatingmodes = dataArr(operatingmode);
    const storagechecks = dataLine(storagecheck);
    const thehours = dataLine(thehour);
    console.log(thehour);
    return (
      <PageHeaderWrapper title="终端工况和数据入库">
        <h3>终端工况</h3>
        <ChartCard contentHeight={350} style={{ marginBottom: 24 }}>
          <Spin spinning={loading} style={{ background: '#ffffff' }}>
            {(operatingmodes.length === 0 || operatingmode === undefined) && (
              <Empty style={{ height: '250px' }} />
            )}
            {operatingmodes.length > 0 && (
              <Columnar
                data={operatingmodes}
                height={350}
                scale={scale}
                padding={[60, 20, 40, 60]}
              />
            )}
          </Spin>
        </ChartCard>
        <h3>入库核查</h3>
        <ChartCard contentHeight={350} style={{ marginBottom: 24 }}>
          <Spin spinning={loading} style={{ background: '#ffffff' }}>
            {storagechecks.length === 0 && <Empty style={{ height: '250px' }} />}
            {storagechecks.length > 0 && (
              <SeriesLine
                cols={Tablecols}
                data={storagechecks}
                Color={Tablecolor}
                height={350}
                padding={[30, 20, 70, 80]}
              />
            )}
          </Spin>
        </ChartCard>
        <h3>入库数量（2-4时）</h3>
        <ChartCard contentHeight={350} style={{ marginBottom: 24 }}>
          <Spin spinning={loading} style={{ background: '#ffffff' }}>
            {thehours.length === 0 && <Empty style={{ height: '250px' }} />}
            {thehours.length > 0 && (
              <SeriesLine
                cols={Tablecols}
                data={thehours}
                Color={Tablecolor}
                height={350}
                padding={[30, 20, 70, 80]}
              />
            )}
          </Spin>
        </ChartCard>
        <h3>入库量历史查询（5分钟入库量）</h3>
        <Card>123123</Card>
      </PageHeaderWrapper>
    );
  }
}

export default DatabaseTerminal;
