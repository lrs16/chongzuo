/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
// import numeral from 'numeral';
import { Row, Col, Icon, Tooltip, Alert, Empty, Spin } from 'antd';
import Treecompactbox from '@/components/CustomizeCharts/Treecompactbox';
import SeriesLine from '@/components/CustomizeCharts/SeriesLine';
import { ChartCard } from '@/components/Charts';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const changedata = datas => {
  const newArr = [];
  if (!Array.isArray(datas)) {
    return newArr;
  }
  for (let i = 0; i < datas.length; i += 1) {
    const vote = {};
    vote.name = datas[i].topic;
    vote.value = datas[i].lag;
    vote.clock = moment(datas[i].date).format('HH');
    newArr.push(vote);
  }
  return newArr;
};
// const zone3 = '*AutoDataAsk';
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
const othercols = {
  clock: {
    range: [0, 0.95],
    alias: '时刻',
    tickInterval: 1,
  },
  value: {
    nice: true,
    range: [0, 0.9],
    alias: '整点KAFKA主题LAG数',
  },
};

@connect(({ fafak, loading }) => ({
  fafak,
  loading: loading.models.fafak,
}))
class Fafak extends Component {
  componentDidMount() {
    this.getdatas();
    this.interval = setInterval(() => this.getdatas(), 600000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getdatas() {
    const { dispatch } = this.props;
    dispatch({
      type: 'fafak/fetch3zone',
    });
    dispatch({
      type: 'fafak/fetchsafezone',
    });
    dispatch({
      type: 'fafak/fetch2zone',
    });
    dispatch({
      type: 'fafak/fetchdoendy',
    });
    dispatch({
      type: 'fafak/fetchdownother',
    });
    dispatch({
      type: 'fafak/fetch102safezone',
    });
    dispatch({
      type: 'fafak/fetch102down',
    });
    dispatch({
      type: 'fafak/fetchupdy',
    });
    dispatch({
      type: 'fafak/fetchupother',
    });
    dispatch({
      type: 'fafak/fetch102up2zone',
    });
    dispatch({
      type: 'fafak/fetch102safe2zone',
    });
    dispatch({
      type: 'fafak/fetch102upsafezone',
    });
  }

  render() {
    const {
      loading,
      fafak: {
        zone3data,
        safezonedata,
        zone2data,
        downdydata,
        otherdata,
        zone102_2data,
        down102,
        updydata,
        upotherdata,
        up102_2zonedata,
        safe102_2zonedata,
        up102safezone,
      },
    } = this.props;
    // console.log(otherdata);
    const downdydatas = changedata(downdydata);
    const otherdatas = changedata(otherdata);
    const zone102_2datas = changedata(zone102_2data);
    const down102s = changedata(down102);
    const updydatas = changedata(updydata);
    const upotherdatas = changedata(upotherdata);
    const up102_2zonedatas = changedata(up102_2zonedata);
    const safe102_2zonedatas = changedata(safe102_2zonedata);
    const up102safezones = changedata(up102safezone);
    return (
      <PageHeaderWrapper title="KAFKA消费">
        <Alert
          message="注意观察LAG数量趋势，只增不减的主题存在差异"
          type="warning"
          showIcon
          style={{ marginBottom: 12 }}
        />
        <h3>KAFKA节点监控（整点刷新）</h3>
        <Row gutter={24} type="flex">
          <Col xl={8} xs={24} style={{ marginBottom: 24 }}>
            <ChartCard title="3区KAFKA节点" contentHeight={200}>
              <Treecompactbox datas={zone3data} height={200} padding={[15, 60, 10, 25]} />
            </ChartCard>
          </Col>
          <Col xl={8} xs={24} style={{ marginBottom: 24 }}>
            <ChartCard title="安全接入区KAFKA节点" contentHeight={200}>
              <Treecompactbox datas={safezonedata} height={200} padding={[15, 60, 10, 25]} />
            </ChartCard>
          </Col>
          <Col xl={8} xs={24} style={{ marginBottom: 24 }}>
            <ChartCard title="2区KAFKA节点" contentHeight={200}>
              <Treecompactbox datas={zone2data} height={200} padding={[15, 60, 10, 25]} />
            </ChartCard>
          </Col>
        </Row>
        <h3>KAFKA主题消费监控（整点刷新）</h3>
        <h3>下行主题</h3>
        <Row gutter={24} type="flex">
          <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
            <ChartCard title="低压相关" contentHeight={350}>
              <Spin spinning={loading} style={{ background: '#ffffff' }}>
                {downdydatas.length === 0 && <Empty style={{ height: '250px' }} />}
                {downdydatas.length > 0 && (
                  <SeriesLine
                    cols={downdycols}
                    data={downdydatas}
                    height={350}
                    padding={[30, 20, 50, 80]}
                  />
                )}
              </Spin>
            </ChartCard>
          </Col>
          <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
            <ChartCard title="其他回复接口（低压相关）" contentHeight={350}>
              <Spin spinning={loading} style={{ background: '#ffffff' }}>
                {otherdatas.length === 0 && <Empty style={{ height: '250px' }} />}
                {otherdatas.length > 0 && (
                  <SeriesLine
                    cols={othercols}
                    data={otherdatas}
                    height={350}
                    padding={[30, 20, 50, 60]}
                  />
                )}
              </Spin>
            </ChartCard>
          </Col>
          <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
            <ChartCard title="广西102关口方面二区和安全接入区" contentHeight={350}>
              <Spin spinning={loading} style={{ background: '#ffffff' }}>
                {zone102_2datas.length === 0 && <Empty style={{ height: '250px' }} />}
                {zone102_2datas.length > 0 && (
                  <SeriesLine
                    cols={downdycols}
                    data={zone102_2datas}
                    height={350}
                    padding={[30, 20, 50, 60]}
                  />
                )}
              </Spin>
            </ChartCard>
          </Col>
          <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
            <ChartCard title="广西102档案下发(关口相关)" contentHeight={350}>
              <Spin spinning={loading} style={{ background: '#ffffff' }}>
                {down102s.length === 0 && <Empty style={{ height: '250px' }} />}
                {down102s.length > 0 && (
                  <SeriesLine
                    cols={downdycols}
                    data={down102s}
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
              <Spin spinning={loading} style={{ background: '#ffffff' }}>
                {updydatas.length === 0 && <Empty style={{ height: '250px' }} />}
                {updydatas.length > 0 && (
                  <SeriesLine
                    cols={downdycols}
                    data={updydatas}
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
              <Spin spinning={loading} style={{ background: '#ffffff' }}>
                {upotherdatas.length === 0 && <Empty style={{ height: '250px' }} />}
                {upotherdatas.length > 0 && (
                  <SeriesLine
                    cols={downdycols}
                    data={upotherdatas}
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
              <Spin spinning={loading} style={{ background: '#ffffff' }}>
                {up102_2zonedatas.length === 0 && <Empty style={{ height: '250px' }} />}
                {up102_2zonedatas.length > 0 && (
                  <SeriesLine
                    cols={downdycols}
                    data={up102_2zonedatas}
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
              <Spin spinning={loading} style={{ background: '#ffffff' }}>
                {safe102_2zonedatas.length === 0 && <Empty style={{ height: '250px' }} />}
                {safe102_2zonedatas.length > 0 && (
                  <SeriesLine
                    cols={downdycols}
                    data={safe102_2zonedatas}
                    height={350}
                    padding={[30, 20, 50, 60]}
                  />
                )}
              </Spin>
            </ChartCard>
          </Col>
          <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
            <ChartCard
              title="其他回复接口(广西102关口方面-二区和安全接区)"
              action={
                <Tooltip title="指标说明">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              contentHeight={350}
            >
              <Spin spinning={loading} style={{ background: '#ffffff' }}>
                {up102safezones.length === 0 && <Empty style={{ height: '250px' }} />}
                {up102safezones.length > 0 && (
                  <SeriesLine
                    cols={downdycols}
                    data={up102safezones}
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
