import React, { Component } from 'react';
import { Row, Col, Icon, Tooltip, Card, Spin, Empty } from 'antd';
import numeral from 'numeral';
import { ChartCard } from '@/components/Charts';
import { connect } from 'dva';
// import ListHost from './components/ListHost';
// import ListDatabase from './components/ListDatabase';
import Cylinder from '@/components/CustomizeCharts/Cylinder';
import style from './index.css';
import MonitorDetail from './monitorStation/components/monitorDetail';
import MonitorStation from './monitorStation/index';

const index = () => {
  return <MonitorStation />;
};


// const { Search } = Input;
const cpucolors = 'l (270) 0:#05bafe .5:#05bafe 1:#13e6fe';
const Memoryolors = 'l (270) 0:#0cd995 .5:#0cd995 1:#64f798';
const diskolors = 'l (300) 0:#8105fb .5:#c716f7 1:#c716f7';
const webolors = 'l (300) 0:#fe7402 .5:#fe7402 1:#ffbb02';
const scale = {
  rate: {
    min: 0,
    max: 100,
    range: [0, 1],
    alias: '已使用',
  },
};
@connect(({ monitorlist, loading }) => ({
  monitorlist,
  loading: loading.models.monitorlist,
}))
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentIndex: '主机',
      detailVisible: false,
      hostID: '',
    };
  }

  componentDidMount() {
    this.getMonitorGroup();
    //    this.getDatabase();
    this.getHost();
  }

  tabChoiced = id => {
    // tab切换到方法
    this.setState({
      currentIndex: id,
    });
  };

  // getDatabase = () => {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'monitorlist/fetchdatabase',
  //     payload: { current: 1, pageSize: 10 },
  //   });
  // };

  getHost = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'monitorlist/fetchhost',
      // payload: { current: 1, pageSize: 10 },
    });
  };

  getMonitorGroup = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'monitorlist/fetchMonitorGroup',
    });
  };

  handDetail = (visible, id) => {
    this.setState({
      detailVisible: visible,
      hostID: id,
    });
  };

  render() {
    const { currentIndex, detailVisible, hostID } = this.state;

    const { loading, monitorlist = {} } = this.props;
    const { hosts, monitorGroups } = monitorlist;
    const CPUdata = hosts.filter(obj => {
      return obj.type === 'CPU';
    });
    const Memorydata = hosts.filter(obj => {
      return obj.type === '内存';
    });
    const diskdata = hosts.filter(obj => {
      return obj.type === '磁盘';
    });
    const WEBdata = hosts.filter(obj => {
      return obj.type === 'WEB响应时间';
    });
    console.log(monitorlist);
    return (
      <div>
        <Row gutter={24} type="flex">
          {monitorGroups.map(g => (
            <Col key={g.id} xl={6} xs={24} style={{ marginBottom: 24 }}>
              <ChartCard
                className={style.charcard}
                onClick={() => this.tabChoiced(g.typeName)}
                title={g.typeName}
                action={
                  <Tooltip title={g.typeName}>
                    <Icon type="container" style={{ fontSize: 30 }} />
                  </Tooltip>
                }
                total={numeral(g.number).format('0,0')}
                footer={
                  <div>
                    <span>
                      <Icon
                        type="exclamation-circle"
                        theme="twoTone"
                        twoToneColor="#f00"
                        style={{ marginRight: 5 }}
                      />
                      {g.urgent}
                    </span>
                    <span style={{ marginLeft: 16 }}>
                      <Icon
                        type="exclamation-circle"
                        theme="twoTone"
                        twoToneColor="#f60"
                        style={{ marginRight: 5 }}
                      />
                      {g.warning}
                    </span>
                    <span style={{ marginLeft: 16 }}>
                      <Icon
                        type="exclamation-circle"
                        theme="twoTone"
                        twoToneColor="#fc0"
                        style={{ marginRight: 5 }}
                      />
                      {g.ordinary}
                    </span>
                    <span style={{ marginLeft: 16 }}>
                      <Icon type="exclamation-circle" theme="twoTone" style={{ marginRight: 5 }} />
                      {g.restore}
                    </span>
                  </div>
                }
                contentHeight={46}
              />
            </Col>
          ))}
        </Row>
        {currentIndex !== '数据库' && (
          // <Card title="主机监测列表" extra={<Search placeholder="请输入" />}>
          //   <ListHost datas={dataHost} onClick={e => this.handDetail(true, e)} />
          // </Card>
          <Row gutter={24} type="flex">
            <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
              <ChartCard title="CPU Top5" contentHeight={350}>
                <Spin spinning={loading} style={{ background: '#ffffff' }}>
                  {CPUdata.length === 0 && <Empty style={{ height: '250px' }} />}
                  {CPUdata.length > 0 && (
                    <Cylinder
                      height={350}
                      scale={scale}
                      colors={cpucolors}
                      data={CPUdata}
                      padding={[10, 30, 30, 120]}
                      symbol="%"
                    />
                  )}
                </Spin>
              </ChartCard>
            </Col>
            <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
              <ChartCard title="内存 Top5" contentHeight={350}>
                <Spin spinning={loading} style={{ background: '#ffffff' }}>
                  {Memorydata.length === 0 && <Empty style={{ height: '250px' }} />}
                  {Memorydata.length > 0 && (
                    <Cylinder
                      height={350}
                      scale={scale}
                      colors={Memoryolors}
                      data={Memorydata}
                      padding={[10, 30, 30, 120]}
                      symbol="%"
                    />
                  )}
                </Spin>
              </ChartCard>
            </Col>
            <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
              <ChartCard title="磁盘 Top5" contentHeight={350}>
                <Spin spinning={loading} style={{ background: '#ffffff' }}>
                  {diskdata.length === 0 && <Empty style={{ height: '250px' }} />}
                  {diskdata.length > 0 && (
                    <Cylinder
                      height={350}
                      scale={scale}
                      colors={diskolors}
                      data={diskdata}
                      padding={[10, 30, 30, 120]}
                      symbol="%"
                    />
                  )}
                </Spin>
              </ChartCard>
            </Col>
            <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
              <ChartCard title="WEB响应时间 Top5" contentHeight={350}>
                <Spin spinning={loading} style={{ background: '#ffffff' }}>
                  {WEBdata.length === 0 && <Empty style={{ height: '250px' }} />}
                  {WEBdata.length > 0 && (
                    <Cylinder
                      height={350}
                      scale={scale}
                      colors={webolors}
                      data={WEBdata}
                      padding={[10, 30, 30, 120]}
                      symbol="ms"
                    />
                  )}
                </Spin>
              </ChartCard>
            </Col>
          </Row>
        )}
        {currentIndex === '数据库' &&
          // <Card title="数据库监测列表" extra={<Search placeholder="请输入" />}>
          //   <ListDatabase datas={dataBase} onClick={e => this.handDetail(true, e)} />
          // </Card>
          1}
        <MonitorDetail
          hostID={hostID}
          visible={detailVisible}
          onClose={() => this.setState({ detailVisible: false })}
        />
      </div>
    );
  }
}

export default index;
