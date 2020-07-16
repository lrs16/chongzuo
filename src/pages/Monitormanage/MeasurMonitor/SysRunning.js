/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { connect } from 'dva';
import numeral from 'numeral';
import moment from 'moment';
import { Row, Col, Icon, Tooltip, Card, Select, Button } from 'antd';
import Treecompactbox from '@/components/CustomizeCharts/Treecompactbox';
import EdgeLine from '@/components/CustomizeCharts/EdgeLine';
import { ChartCard } from '@/components/Charts';
import SelectArea from '@/components/Selects/SelectArea';
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
          <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
            <ChartCard title="登录检测" contentHeight={300}>
              <Treecompactbox datas={treedata} height={300} padding={[15, 60, 15, 50]} />
            </ChartCard>
          </Col>
          <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
            <ChartCard title="数据召测-低压" contentHeight={300}>
              <div
                style={{
                  margin: '10px',
                  position: 'absolute',
                  top: '-38px',
                  left: '120px',
                  zIndex: '100px',
                }}
              >
                <SelectArea />
                <Button type="primary">手工召测</Button>
              </div>
              <EdgeLine datas={facadata} height={300} padding={[15, 60, 15, 50]} />
            </ChartCard>
          </Col>
        </Row>
        <Row gutter={24} type="flex">
          <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
            <ChartCard title="数据召测-负控配变" contentHeight={300}>
              <div
                style={{
                  margin: '10px',
                  position: 'absolute',
                  top: '-38px',
                  left: '120px',
                  zIndex: '100px',
                }}
              >
                <SelectArea />
                <Button type="primary">手工召测</Button>
              </div>
              <EdgeLine datas={facadata} height={300} padding={[15, 60, 15, 50]} />
            </ChartCard>
          </Col>
          <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
            <ChartCard title="数据召测-厂站" contentHeight={300}>
              <div
                style={{
                  margin: '10px',
                  position: 'absolute',
                  top: '-38px',
                  left: '120px',
                  zIndex: '100px',
                }}
              >
                <SelectArea />
                <Button type="primary">手工召测</Button>
              </div>
              <EdgeLine datas={facadata} height={300} padding={[15, 60, 15, 50]} />
            </ChartCard>
          </Col>
        </Row>
      </div>
    );
  }
}

export default SysRunning;
