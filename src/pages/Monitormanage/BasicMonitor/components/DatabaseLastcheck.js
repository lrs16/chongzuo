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
import BasicBarchart from '@/components/CustomizeCharts/BasicBarchart';
import iconfontUrl from '@/utils/iconfont';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: iconfontUrl,
});

const userindex = [
  { name: 'SYSAUX', totalCapacity: 0.46504402, used: 0.20600414, usage: 47.1704, inodes: 0.2445 },
  { name: 'SYSTEM', totalCapacity: 0.46504402, used: 0.20600414, usage: 47.1704, inodes: 0.2445 },
  { name: 'ITSM', totalCapacity: 0.46504402, used: 0.20600414, usage: 47.1704, inodes: 0.2445 },
  { name: 'USERS', totalCapacity: 191.43872, used: 13.470619, usage: 7.4158, inodes: 1.9484 },
  { name: 'DS_SJJG', totalCapacity: 191.43872, used: 130.470619, usage: 20.4158, inodes: 1.9484 },
];

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
class Databaselastcheck extends Component {
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
            <div style={{ position: 'absolute', top: '15px' }}>表空间使用情况</div>
            <BasicBarchart height={230} data={changedate(userindex)} padding={[30, 0, 0, 0]} />
          </Card>
        </Col>
        <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
          <Card style={{ height: 280 }}>
            <div style={{ position: 'absolute', top: '15px' }}>当前连接数量</div>
            <div style={{ display: 'flex' }}>
              <IconFont
                type="iconmyicon-"
                style={{ float: 'left', fontSize: '12em', padding: '40px 50px 0 50px ' }}
              />
              <div style={{ fontSize: '4em', width: 200, textAlign: 'center', paddingTop: 70 }}>
                50<span style={{ fontSize: '0.9em' }}>个</span>
                <span
                  style={{ fontSize: '14px', display: 'block', height: '20px', marginTop: '-30px' }}
                >
                  <br />
                  连接数量
                </span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    );
  }
}

export default Databaselastcheck;
