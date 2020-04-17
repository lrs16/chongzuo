/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { connect } from 'dva';
import numeral from 'numeral';
import moment from 'moment';
import { Row, Col, Icon, Tooltip, Tabs } from 'antd';
import Range from '@/components/CustomizeCharts/Range';
import Treecompactbox from '@/components/CustomizeCharts/Treecompactbox';
import { ChartCard, Field } from '@/components/Charts';
// import GridContent from '@/components/PageHeaderWrapper/GridContent';

const { TabPane } = Tabs;
@connect(({ measur, loading }) => ({
  measur,
  loading: loading.models.measur,
}))
class Fafak extends Component {
  componentDidMount() {
    this.getFafakdatas();
  }

  getFafakdatas() {
    const { dispatch } = this.props;
    dispatch({
      type: 'measur/fetchTreecompactdata',
    });
  }

  render() {
    const { measur = {} } = this.props;
    const { treedatas = {} } = measur;
    const treedata = treedatas;
    return (
      <Tabs defaultActiveKey="1">
        <TabPane tab="3区KAFKA中间件" key="1">
          <div>
            <Row gutter={24} type="flex">
              <Col xl={12} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
                <ChartCard
                  title="KAFKA节点"
                  action={
                    <Tooltip title="指标说明">
                      <Icon type="info-circle-o" />
                    </Tooltip>
                  }
                  total={numeral(76).format('0,0')}
                  footer={<Field label="日访问量" value={numeral(1234).format('0,0')} />}
                  contentHeight={400}
                >
                  <Treecompactbox datas={treedata} height={400} padding={[0, 100, 0, 10]} />
                </ChartCard>
              </Col>
              <Col xl={12} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
                <ChartCard
                  title="主题消费情况"
                  action={
                    <Tooltip title="指标说明">
                      <Icon type="info-circle-o" />
                    </Tooltip>
                  }
                  total={numeral(88).format('0,0')}
                  footer={<Field label="日访问量" value={numeral(1234).format('0,0')} />}
                  contentHeight={400}
                >
                  <Range height={400} />
                </ChartCard>
              </Col>
            </Row>
          </div>
        </TabPane>
        <TabPane tab="安全接入区KAFKA" key="2">
          <div>
            <Row gutter={24} type="flex">
              <Col xl={12} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
                <ChartCard
                  title="KAFKA节点"
                  action={
                    <Tooltip title="指标说明">
                      <Icon type="info-circle-o" />
                    </Tooltip>
                  }
                  total={numeral(55).format('0,0')}
                  footer={<Field label="日访问量" value={numeral(1234).format('0,0')} />}
                  contentHeight={400}
                >
                  123
                </ChartCard>
              </Col>
              <Col xl={12} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
                <ChartCard
                  title="档案同步接口"
                  action={
                    <Tooltip title="指标说明">
                      <Icon type="info-circle-o" />
                    </Tooltip>
                  }
                  total={numeral(8846).format('0,0')}
                  footer={<Field label="日访问量" value={numeral(1234).format('0,0')} />}
                  contentHeight={400}
                >
                  456
                </ChartCard>
              </Col>
            </Row>
          </div>
        </TabPane>
      </Tabs>
    );
  }
}

export default Fafak;
