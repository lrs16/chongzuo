/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { connect } from 'dva';
// import numeral from 'numeral';
import { Row, Col, Icon, Tooltip, Alert, Empty, Spin } from 'antd';
import SeriesLine from '@/components/CustomizeCharts/SeriesLine';
import StackingArea from '@/components/CustomizeCharts/StackingArea';
import { ChartCard } from '@/components/Charts';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const zone3 = '*AutoDataAsk';
const downdycols = {
  clock: {
    range: [0.05, 0.95],
    alias: '时刻',
    tickInterval: 1,
  },
  value: {
    min: 0,
    max: 10000,
    range: [0, 0.9],
    alias: '整点KAFKA主题LAG数',
    tickInterval: 2000,
  },
};
const othercols = {
  clock: {
    range: [0, 0.95],
    alias: '时刻',
    tickInterval: 1,
  },
  value: {
    // min:0,
    // max:10000,
    nice: true,
    range: [0, 0.9],
    alias: '整点KAFKA主题LAG数',
    // tickInterval: 2000,
  },
};

@connect(({ fafakmatinal, loading }) => ({
  fafakmatinal,
  loading: loading.models.fafakmatinal,
}))
class Fafak extends Component {
  componentDidMount() {
    this.getdatas();
    this.interval = setInterval(() => this.getdatas(), 300000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getdatas() {
    const { dispatch } = this.props;
    dispatch({
      type: 'fafakmatinal/fetchdoendy',
    });
    dispatch({
      type: 'fafakmatinal/fetchdownother',
    });
    dispatch({
      type: 'fafakmatinal/fetch102zone2',
    });
    dispatch({
      type: 'fafakmatinal/fetch102safezone',
    });
    dispatch({
      type: 'fafakmatinal/fetchupdy',
    });
    dispatch({
      type: 'fafakmatinal/fetch102up2zone',
    });
    dispatch({
      type: 'fafakmatinal/fetch102safe2zone',
    });
    dispatch({
      type: 'fafakmatinal/fetch102upsafezone',
    });
  }

  render() {
    const {
      loading,
      fafakmatinal: {
        downdydata,
        otherdata,
        zone102_2data,
        zone102_safedata,
        updydata,
        up102_2zonedata,
        safe102_2zonedata,
        up102safezone,
      },
    } = this.props;
    // console.log(downdydata);
    return (
      <PageHeaderWrapper title="KAFKA消费">
        <Alert
          message="注意观察LAG数量趋势，只增不减的主题存在差异"
          type="warning"
          showIcon
          style={{ marginBottom: 12 }}
        />
        <h3>KAFKA主题消费监控（2-4点)/5min刷新</h3>
        <h3>下行主题</h3>
        <Row gutter={24} type="flex">
          <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
            <ChartCard title="低压相关" contentHeight={350}>
              {downdydata.length === 0 && <Empty style={{ height: '250px' }} />}
              <Spin spinning={loading} style={{ background: '#ffffff' }}>
                {downdydata.length > 0 && (
                  <SeriesLine
                    cols={downdycols}
                    data={downdydata}
                    alerttitle={zone3}
                    height={350}
                    padding={[30, 20, 50, 60]}
                  />
                )}
              </Spin>
            </ChartCard>
          </Col>
          <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
            <ChartCard title="其他回复接口（低压相关）" contentHeight={350}>
              {otherdata.length === 0 && <Empty style={{ height: '250px' }} />}
              <Spin spinning={loading} style={{ background: '#ffffff' }}>
                {otherdata.length > 0 && (
                  <StackingArea
                    cols={othercols}
                    data={otherdata}
                    height={350}
                    padding={[30, 20, 50, 60]}
                  />
                )}
              </Spin>
            </ChartCard>
          </Col>
          <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
            <ChartCard title="其他回复接口（低压相关）" contentHeight={350}>
              {zone102_2data.length === 0 && <Empty style={{ height: '250px' }} />}
              <Spin spinning={loading} style={{ background: '#ffffff' }}>
                {zone102_2data.length > 0 && (
                  <SeriesLine
                    cols={downdycols}
                    data={zone102_2data}
                    height={350}
                    padding={[30, 20, 50, 60]}
                  />
                )}
              </Spin>
            </ChartCard>
          </Col>
          <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
            <ChartCard title="其他回复接口（低压相关）" contentHeight={350}>
              {zone102_safedata.length === 0 && <Empty style={{ height: '250px' }} />}
              <Spin spinning={loading} style={{ background: '#ffffff' }}>
                {zone102_safedata.length > 0 && (
                  <SeriesLine
                    cols={downdycols}
                    data={zone102_safedata}
                    height={350}
                    padding={[30, 20, 50, 75]}
                  />
                )}
              </Spin>
            </ChartCard>
          </Col>
        </Row>
        <h3>上行主题</h3>
        <Row gutter={24} type="flex">
          <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
            <ChartCard
              title="低压相关"
              action={
                <Tooltip title="指标说明">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              contentHeight={350}
            >
              {updydata.length === 0 && <Empty style={{ height: '250px' }} />}
              <Spin spinning={loading} style={{ background: '#ffffff' }}>
                {updydata.length > 0 && (
                  <SeriesLine
                    cols={downdycols}
                    data={updydata}
                    height={350}
                    padding={[30, 20, 50, 60]}
                  />
                )}
              </Spin>
            </ChartCard>
          </Col>
          <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
            <ChartCard
              title="低压相关-其他回复接口"
              action={
                <Tooltip title="指标说明">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              contentHeight={350}
            >
              {downdydata.length === 0 && <Empty style={{ height: '250px' }} />}
              <Spin spinning={loading} style={{ background: '#ffffff' }}>
                {downdydata.length > 0 && (
                  <SeriesLine
                    cols={downdycols}
                    data={downdydata}
                    height={350}
                    padding={[30, 20, 50, 60]}
                  />
                )}
              </Spin>
            </ChartCard>
          </Col>
          <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
            <ChartCard
              title="广西102关口方面二区和安全接入区1"
              action={
                <Tooltip title="指标说明">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              contentHeight={350}
            >
              {up102_2zonedata.length === 0 && <Empty style={{ height: '250px' }} />}
              <Spin spinning={loading} style={{ background: '#ffffff' }}>
                {up102_2zonedata.length > 0 && (
                  <SeriesLine
                    cols={downdycols}
                    data={up102_2zonedata}
                    height={350}
                    padding={[30, 20, 50, 60]}
                  />
                )}
              </Spin>
            </ChartCard>
          </Col>
          <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
            <ChartCard
              title="广西102关口方面二区和安全接入区2"
              action={
                <Tooltip title="指标说明">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              contentHeight={350}
            >
              {safe102_2zonedata.length === 0 && <Empty style={{ height: '250px' }} />}
              <Spin spinning={loading} style={{ background: '#ffffff' }}>
                {safe102_2zonedata.length > 0 && (
                  <SeriesLine
                    cols={downdycols}
                    data={safe102_2zonedata}
                    height={350}
                    padding={[30, 20, 50, 60]}
                  />
                )}
              </Spin>
            </ChartCard>
          </Col>
          <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
            <ChartCard
              title="低压相关"
              action={
                <Tooltip title="指标说明">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              contentHeight={350}
            >
              {up102safezone.length === 0 && <Empty style={{ height: '250px' }} />}
              <Spin spinning={loading} style={{ background: '#ffffff' }}>
                {up102safezone.length > 0 && (
                  <SeriesLine
                    cols={downdycols}
                    data={up102safezone}
                    height={350}
                    padding={[30, 20, 50, 60]}
                  />
                )}
              </Spin>
            </ChartCard>
          </Col>
        </Row>
      </PageHeaderWrapper>
    );
  }
}

export default Fafak;
