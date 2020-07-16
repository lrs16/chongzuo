/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { connect } from 'dva';
import numeral from 'numeral';
import moment from 'moment';
import { Row, Col, Empty, Spin } from 'antd';
import Columnar from '@/components/CustomizeCharts/Columnar';
import SeriesLine from '@/components/CustomizeCharts/SeriesLine';
import { ChartCard } from '@/components/Charts';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

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
    max: 23,
    range: [0.02, 0.95],
    alias: '时刻',
    tickInterval: 1,
  },
  value: {
    min: 0,
    max: 100000,
    range: [0, 0.9],
    alias: '入库数量',
    tickInterval: 10000,
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
    console.log(thehour);
    return (
      <PageHeaderWrapper title="终端工况和数据入库">
        <h3>终端工况</h3>
        <Row gutter={24} type="flex">
          <Col span={24} style={{ marginBottom: 24 }}>
            <ChartCard title="终端工况" contentHeight={350}>
              {operatingmode.length === 0 && <Empty style={{ height: '250px' }} />}
              <Spin spinning={loading} style={{ background: '#ffffff' }}>
                {operatingmode.length > 0 && (
                  <Columnar
                    data={operatingmode}
                    height={350}
                    scale={scale}
                    padding={[60, 20, 40, 60]}
                  />
                )}
              </Spin>
            </ChartCard>
          </Col>
        </Row>
        <h3>入库核查</h3>
        <ChartCard title="测量点主表生成" contentHeight={350}>
          {storagecheck.length === 0 && <Empty style={{ height: '250px' }} />}
          <Spin spinning={loading} style={{ background: '#ffffff' }}>
            {storagecheck.length > 0 && (
              <SeriesLine
                cols={Tablecols}
                data={storagecheck}
                Color={Tablecolor}
                height={350}
                padding={[30, 20, 70, 80]}
              />
            )}
          </Spin>
        </ChartCard>
      </PageHeaderWrapper>
    );
  }
}

export default DatabaseTerminal;
