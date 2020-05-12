/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { connect } from 'dva';
import numeral from 'numeral';
import moment from 'moment';
import { Row, Col, Icon, Tooltip, Card } from 'antd';
import Treecompactbox from '@/components/CustomizeCharts/Treecompactbox';
import { ChartCard, Field } from '@/components/Charts';
// import GridContent from '@/components/PageHeaderWrapper/GridContent';

@connect(({ measur, loading }) => ({
  measur,
  loading: loading.models.measur,
}))
class SysRunning extends Component {
  componentDidMount() {
    this.getSummondatas();
    this.getFafakdatas();
  }

  getFafakdatas() {
    const { dispatch } = this.props;
    dispatch({
      type: 'measur/fetchTreecompactdata',
    });
  }

  getSummondatas() {
    const { dispatch } = this.props;
    dispatch({
      type: 'measur/fetchFacatdata',
    });
  }

  render() {
    const { measur = {} } = this.props;
    const { treedatas = {}, facadatas = {} } = measur;
    const treedata = treedatas;
    const facadata = facadatas;
    return (
      <div>
        <Row gutter={24} type="flex">
          <Col xl={12} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
            <ChartCard
              title="登录检测"
              action={
                <Tooltip title="指标说明">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={numeral(8846).format('0,0')}
              footer={<Field label="日访问量" value={numeral(1234).format('0,0')} />}
              contentHeight={300}
            >
              <Treecompactbox datas={treedata} height={300} padding={[0, 100, 0, 10]} />
            </ChartCard>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
            <ChartCard
              title="数据召测-低压"
              action={
                <Tooltip title="指标说明">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={numeral(8846).format('0,0')}
              footer={<Field label="日访问量" value={numeral(1234).format('0,0')} />}
              contentHeight={300}
            >
              <Treecompactbox datas={facadata} height={300} padding={[0, 30, 0, 60]} />
            </ChartCard>
          </Col>
        </Row>
        <Row gutter={24} type="flex">
          <Col xl={12} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
            <ChartCard
              title="参考下发"
              action={
                <Tooltip title="指标说明">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={numeral(8846).format('0,0')}
              footer={<Field label="日访问量" value={numeral(1234).format('0,0')} />}
              contentHeight={300}
            >
              <Treecompactbox datas={facadata} height={300} padding={[0, 30, 0, 60]} />
            </ChartCard>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
            <ChartCard
              title="测量点主表生成"
              action={
                <Tooltip title="指标说明">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={numeral(8846).format('0,0')}
              footer={<Field label="日访问量" value={numeral(1234).format('0,0')} />}
              contentHeight={300}
            >
              <Treecompactbox datas={facadata} height={300} padding={[0, 30, 0, 60]} />
            </ChartCard>
          </Col>
        </Row>
      </div>
    );
  }
}

export default SysRunning;
