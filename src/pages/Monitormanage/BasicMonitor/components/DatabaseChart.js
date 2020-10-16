/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import {
  Row,
  Col,
  Card,
  Table,
  // Pagination ,
  // Empty ,
  Icon,
  Spin,
} from 'antd';
import numeral from 'numeral';
// import GaugeChart from 'bizcharts/lib/plots/GaugeChart';
import Gauge from '@/components/CustomizeCharts/Gauge';
import iconfontUrl from '@/utils/iconfont';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: iconfontUrl,
});

class DatabaseChart extends Component {
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

    const columntables = [
      {
        title: '用户名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '用户状态',
        dataIndex: 'status',
        key: 'status',
      },
    ];

    const { cachedata, instancedatas, userdatas } = this.props;
    //    const deviceheight = changedate(userindex).length * 60;

    const GaugeChartvalue = [{ value: `${cachedata}` / 10 }];
    return (
      <Row gutter={24} type="flex">
        <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
          <Card>
            <div style={{ position: 'absolute', top: '15px' }}>Cache命中率</div>
            <Gauge
              title="Cache命中率"
              height={230}
              data={GaugeChartvalue}
              value={numeral(cachedata).format('0.0')}
            />
          </Card>
        </Col>
        <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
          <Card style={{ height: 280 }}>
            <div style={{ position: 'absolute', top: '15px' }}>实例状态</div>
            <Table
              style={{ paddingTop: 30 }}
              columns={columns}
              dataSource={instancedatas}
              rowKey={i => i + 1}
            />
          </Card>
        </Col>
        <Col xl={24} xs={24}>
          <Card>
            <div style={{ position: 'absolute', top: '15px' }}>用户等待状态</div>
            <Table
              style={{ paddingTop: 30 }}
              columns={columntables}
              dataSource={userdatas}
              rowKey={record => record.name}
            />
          </Card>
        </Col>
      </Row>
    );
  }
}

export default DatabaseChart;
