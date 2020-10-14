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

const GaugeChartvalue = [{ value: 5.6 }];

const dataSource = [
  {
    key: '1',
    name: '胡彦斌',
    status: 'MOMOUNT',
  },
  {
    key: '2',
    name: '胡彦祖',
    status: 'MOMOUNT',
  },
];

const changedate = datas => {
  const newArr = [];
  if (!Array.isArray(datas)) {
    return newArr;
  }
  for (let i = 0; i < datas.length; i += 1) {
    const vote = {};
    vote.name = datas[i].name;
    vote.usage = datas[i].usage;
    vote.total = 100;
    vote.destotal = 0;
    vote.des = `${datas[i].name}:总容量${numeral(datas[i].totalCapacity).format(
      '0,0.0',
    )}GB；已使用${numeral(datas[i].used).format('0,0.0')}GB；磁盘使用率${numeral(
      datas[i].usage,
    ).format('0,0.0')}%,inodes使用率${numeral(datas[i].inodes).format('0,0.0')}%`;
    newArr.push(vote);
  }
  return newArr;
};
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

    const { loading } = this.props;
    //    const deviceheight = changedate(userindex).length * 60;
    return (
      <Row gutter={24} type="flex">
        <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
          <Card>
            <div style={{ position: 'absolute', top: '15px' }}>Cache命中率</div>
            <Gauge title="Cache命中率" height={230} data={GaugeChartvalue} />
          </Card>
        </Col>
        <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
          <Card style={{ height: 280 }}>
            <div style={{ position: 'absolute', top: '15px' }}>实例状态</div>
            <Table style={{ paddingTop: 30 }} columns={columns} dataSource={dataSource} />
          </Card>
        </Col>
        <Col xl={12} xs={24}>
          <Card style={{ height: 280 }}>
            <div style={{ position: 'absolute', top: '15px' }}>用户等待状态</div>
            <Table style={{ paddingTop: 30 }} columns={columns} dataSource={dataSource} />
          </Card>
        </Col>
      </Row>
    );
  }
}

export default DatabaseChart;
