/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import {
  Row,
  Col,
  Card,
  Table,
  Pagination,
  // Empty ,
  Icon,
  Spin,
} from 'antd';
import numeral from 'numeral';
// import GaugeChart from 'bizcharts/lib/plots/GaugeChart';
import Gauge from '@/components/CustomizeCharts/Gauge';
import BasicBarchart from '@/components/CustomizeCharts/BasicBarchart';
import iconfontUrl from '@/utils/iconfont';
import { result } from 'lodash';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: iconfontUrl,
});

const changedate = datas => {
  const newArr = [];
  if (!Array.isArray(datas)) {
    return newArr;
  }
  for (let i = 0; i < datas.length; i += 1) {
    const vote = {};
    vote.name = datas[i].name;
    vote.usage = datas[i].used;
    vote.total = 100;
    vote.destotal = 0;
    vote.des = `${datas[i].name}:总容量${numeral(datas[i].totalCapacity).format(
      '0,0.00',
    )}GB；已使用${numeral(datas[i].used).format('0,0.0000')}GB；表空间使用率${numeral(
      datas[i].usageRate,
    ).format('0,0.00')}%`;
    newArr.push(vote);
  }
  return newArr;
};
class Databaselastcheck extends Component {
  constructor(props) {
    super(props);
    const { tablespace } = props;
    const totaldatas = this.changeArr(tablespace);
    this.state = {
      current: 1,
      pageSize: 5,
      tabledatas: totaldatas[0],
      total: tablespace.length,
    };
  }

  changePage = page => {
    const { tablespace } = this.props;
    const datas = this.changeArr(tablespace);
    const number = page - 1;
    this.setState({
      current: page,
      tabledatas: datas[number],
    });
  };

  changeArr = data => {
    const newArr = [];
    for (let i = 0; i < data.length; i += 5) {
      newArr.push(data.slice(i, i + 5));
    }
    return newArr;
  };

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

    const { tabledatas, total, current, pageSize } = this.state;
    return (
      <Row gutter={24} type="flex">
        <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
          <Card>
            <div style={{ position: 'absolute', top: '15px' }}>表空间使用情况</div>
            {tabledatas !== undefined && (
              <>
                <BasicBarchart height={202} data={changedate(tabledatas)} padding={[30, 0, 0, 0]} />
                <Pagination
                  simple
                  current={current}
                  pageSize={pageSize}
                  onChange={this.changePage}
                  total={total}
                  style={{ float: 'right', marginTop: 5 }}
                />
              </>
            )}
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
                {this.props.connetnumber}
                <span style={{ fontSize: '0.9em' }}>个</span>
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
