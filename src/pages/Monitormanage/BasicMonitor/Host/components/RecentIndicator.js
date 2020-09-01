/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { Row, Col, Card, Pagination } from 'antd';
import { LiquidChart } from 'bizcharts';
import numeral from 'numeral';
import BasicBarchart from '@/components/CustomizeCharts/BasicBarchart';
import styles from '../index.less';

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

class RecentIndicator extends Component {
  render() {
    const { currentHistory } = this.props;
    const { diskUsage } = currentHistory;
    const deviceheight = changedate(diskUsage).length * 60;
    return (
      <Row gutter={24} type="flex">
        <Col xl={6} xs={12}>
          {currentHistory.cpuUsage !== undefined && (
            <Card>
              <div style={{ position: 'absolute', top: '15px' }}>CPU使用率</div>

              <LiquidChart
                min={0}
                max={100}
                value={currentHistory.cpuUsage}
                liquidStyle={{
                  lineWidth: 1,
                  fill: '#66a6ff',
                  stroke: '#ddd',
                }}
                statistic={{
                  // visible: true,
                  // adjustColor: true,
                  formatter: value => `${numeral(value).format('0,0.0')}%`,
                }}
                height={200}
                forceFit
              />
            </Card>
          )}
        </Col>
        <Col xl={6} xs={12}>
          {currentHistory.memoryUsage !== undefined && (
            <Card>
              <div style={{ position: 'absolute', top: '15px' }}>内存使用率</div>
              <LiquidChart
                min={0}
                max={100}
                value={currentHistory.memoryUsage}
                liquidStyle={{
                  lineWidth: 1,
                  fill: '#56cfb2',
                  stroke: '#ddd',
                }}
                statistic={{
                  // visible: true,
                  // adjustColor: true,
                  formatter: value => `${numeral(value).format('0,0.0')}%`,
                }}
                height={200}
                forceFit
              />
            </Card>
          )}
        </Col>
        <Col xl={6} xs={12}>
          <Card style={{ height: 250 }}>
            <div style={{ position: 'absolute', top: '15px' }}>IO读写速率</div>
            <ul className={styles.IObox} style={{ paddingTop: 40 }}>
              <li className={styles.IOsolidborder} style={{ borderLeftColor: '#15cf5b' }}>
                <font>读取速度</font>
                <br />
                <font className={styles.IOrate}>{currentHistory.ioReadRate}kb/s</font>
              </li>
              <li className={styles.IOdashedborder} style={{ borderLeftColor: '#15cf5b' }}>
                <font>写入速度</font>
                <br />
                <font className={styles.IOrate}>{currentHistory.ioWriteRate}kb/s</font>
              </li>
            </ul>
          </Card>
        </Col>
        <Col xl={6} xs={12}>
          <Card style={{ height: 250 }}>
            <div style={{ position: 'absolute', top: '15px' }}>网络流量</div>
            <ul className={styles.IObox} style={{ paddingTop: 40 }}>
              <li className={styles.IOsolidborder} style={{ borderLeftColor: '#3399db' }}>
                <font>接收速度</font>
                <br />
                <font className={styles.IOrate}>{currentHistory.networkReceiveSpeed}kb/s</font>
              </li>
              <li className={styles.IOdashedborder} style={{ borderLeftColor: '#3399db' }}>
                <font>发送速度</font>
                <br />
                <font className={styles.IOrate}>{currentHistory.networkSendSpeed}kb/s</font>
              </li>
            </ul>
          </Card>
        </Col>
        <Col span={24}>
          <Card style={{ marginTop: 24 }}>
            <div style={{ position: 'absolute', top: '15px' }}>磁盘使用情况</div>
            <BasicBarchart
              height={deviceheight}
              data={changedate(diskUsage)}
              padding={[25, 0, 0, 0]}
            />

            {/* <Pagination 
                  style={{float:'right'}} 
                  simple 
                  // defaultCurrent={1}
                  current={this.state.current}
                  onChange={this.changePage}
                  total={50} 
                /> */}
          </Card>
        </Col>
      </Row>
    );
  }
}

export default RecentIndicator;
