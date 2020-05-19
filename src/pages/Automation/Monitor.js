import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Tooltip } from 'antd';
import numeral from 'numeral';
// import { Pie, WaterWave, Gauge, TagCloud } from '@/components/Charts';
import { Pie, WaterWave, Gauge, TagCloud } from 'ant-design-pro/lib/Charts';
import NumberInfo from '@/components/NumberInfo';
import CountDown from '@/components/CountDown';
import ActiveChart from '@/components/ActiveChart';
// import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './Monitor.less';

const targetTime = new Date().getTime() + 3900000;

// use permission as a parameter
const havePermissionAsync = new Promise(resolve => {
  // Call resolve on behalf of passed
  setTimeout(() => resolve(), 300);
});

@connect(({ jobmonitor, loading }) => ({
  jobmonitor,
  loading: loading.models.jobmonitor,
}))
class Monitor extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'jobmonitor/fetchTags',
    });
  }

  render() {
    const { jobmonitor, loading } = this.props;
    const { tags } = jobmonitor;

    return (
      <div>
        <Row gutter={24}>
          <Col xl={18} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
            <Card title="作业实时执行情况" bordered={false}>
              <Row>
                <Col md={6} sm={12} xs={24}>
                  <NumberInfo
                    subTitle="在执行作业总数"
                    suffix="个"
                    total={numeral(755).format('0,0')}
                  />
                </Col>
                <Col md={6} sm={12} xs={24}>
                  <NumberInfo subTitle="执行成功率" total="92%" />
                </Col>
                <Col md={6} sm={12} xs={24}>
                  <NumberInfo subTitle="最长执行时间" total={<CountDown target={targetTime} />} />
                </Col>
                <Col md={6} sm={12} xs={24}>
                  <NumberInfo
                    subTitle="定时作业总数"
                    suffix="个"
                    total={numeral(234).format('0,0')}
                  />
                </Col>
              </Row>
              <div className={styles.mapChart}>
                <Tooltip title="Waiting for implementation">
                  <img
                    src="https://gw.alipayobjects.com/zos/antfincdn/h%24wFbzuuzz/HBWnDEUXCnGnGrRfrpKa.png"
                    alt="map"
                  />
                </Tooltip>
              </div>
            </Card>
          </Col>
          <Col xl={6} lg={24} md={24} sm={24} xs={24}>
            <Card title="活动情况预测" style={{ marginBottom: 24 }} bordered={false}>
              <ActiveChart />
            </Card>
            <Card
              title="执行效率"
              style={{ marginBottom: 24 }}
              bodyStyle={{ textAlign: 'center' }}
              bordered={false}
            >
              <Gauge title="跳出率" height={180} percent={87} />
            </Card>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xl={12} lg={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
            <Card title="各场景占比" bordered={false} className={styles.pieCard}>
              <Row style={{ padding: '16px 0' }}>
                <Col span={8}>
                  <Pie
                    animate={false}
                    percent={28}
                    subTitle="标准场景"
                    total="28%"
                    height={128}
                    lineWidth={2}
                  />
                </Col>
                <Col span={8}>
                  <Pie
                    animate={false}
                    color="#5DDECF"
                    percent={22}
                    subTitle="应用场景"
                    total="22%"
                    height={128}
                    lineWidth={2}
                  />
                </Col>
                <Col span={8}>
                  <Pie
                    animate={false}
                    color="#2FC25B"
                    percent={32}
                    subTitle="自定义场景"
                    total="32%"
                    height={128}
                    lineWidth={2}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
          <Col xl={6} lg={12} sm={24} xs={24} style={{ marginBottom: 24 }}>
            <Card
              title="热门搜索"
              loading={loading}
              bordered={false}
              bodyStyle={{ overflow: 'hidden' }}
            >
              <TagCloud data={tags} height={161} />
            </Card>
          </Col>
          <Col xl={6} lg={12} sm={24} xs={24} style={{ marginBottom: 24 }}>
            <Card
              title="资源使用率"
              bodyStyle={{ textAlign: 'center', fontSize: 0 }}
              bordered={false}
            >
              <WaterWave height={161} title="资源剩余" percent={34} />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Monitor;
