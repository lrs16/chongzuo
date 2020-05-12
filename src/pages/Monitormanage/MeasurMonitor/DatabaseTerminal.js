/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import numeral from 'numeral';
import moment from 'moment';
import { Row, Col, Icon, Tooltip, Card } from 'antd';
import Columncolor from '@/components/CustomizeCharts/Columncolor';
import Clusteredstacked from '@/components/CustomizeCharts/Clusteredstacked';
import { ChartCard, Field } from '@/components/Charts';
// import GridContent from '@/components/PageHeaderWrapper/GridContent';

class DatabaseTerminal extends Component {
  render() {
    return (
      <div>
        <Row gutter={24} type="flex">
          <Col span={24} style={{ marginBottom: 24 }}>
            <ChartCard
              title="终端工况"
              action={
                <Tooltip title="指标说明">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={numeral(8846).format('0,0')}
              footer={<Field label="日访问量" value={numeral(1234).format('0,0')} />}
              contentHeight={300}
            >
              <Columncolor height={300} padding={[60, 20, 40, 60]} />
            </ChartCard>
          </Col>
          <Col span={24} style={{ marginBottom: 24 }}>
            <ChartCard
              title="数据入库"
              action={
                <Tooltip title="指标说明">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={numeral(8846).format('0,0')}
              footer={<Field label="日访问量" value={numeral(1234).format('0,0')} />}
              contentHeight={300}
            >
              <Clusteredstacked height={300} padding={[20, 160, 80, 60]} />
            </ChartCard>
          </Col>
        </Row>
      </div>
    );
  }
}

export default DatabaseTerminal;
