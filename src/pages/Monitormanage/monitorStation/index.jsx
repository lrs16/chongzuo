import React, { Component } from 'react';
import { Row, Col, Icon, Tooltip, Card, Input, Spin, Empty } from 'antd';
import numeral from 'numeral';
import { ChartCard } from '@/components/Charts';
import { connect } from 'dva';
import Cylinder from '@/components/CustomizeCharts/Cylinder';
import style from './index.css';
// import ListDatabase from './components/ListDatabase';
// import ListHost from './components/ListHost';
// import MonitorDetail from './components/monitorDetail';

const cols = {
  rate: {
    // alias: '%',
    // tickCount: 10,
  },
};
// const { Search } = Input;
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
      selectColumn: {},
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

  getDatabase = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'monitorlist/fetchdatabase',
      payload: { current: 1, pageSize: 10 },
    });
  };

  getHost = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'monitorlist/fetchchartdata',
      // payload: { current: 1, pageSize: 10 },
    });
  };

  getMonitorGroup = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'monitorlist/fetchMonitorGroup',
    });
  };

  handDetail = (visible, data) => {
    this.setState({
      detailVisible: visible,
      selectColumn: data,
    });
  };

  render() {
    const { currentIndex, detailVisible, selectColumn } = this.state;

    const { loading, monitorlist = {} } = this.props;
    const { monitorGroups, hosts } = monitorlist;
    console.log(hosts);
    const CPUdatas = hosts.filter(obj => {
      return obj.type === 'CPU';
    });
    const Memorydatas = hosts.filter(obj => {
      return obj.type === '内存';
    });
    const diskdatas = hosts.filter(obj => {
      return obj.type === '磁盘';
    });
    const WEBdatas = hosts.filter(obj => {
      return obj.type === 'WEB响应时间';
    });
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
        {/* {currentIndex !== '数据库' && (
          <Card title="主机监测列表" extra={<Search placeholder="请输入" />}>
            <ListHost datas={dataHost} onClick={e => this.handDetail(true, e)} />
          </Card>
        )}
        {currentIndex === '数据库' && (
          <Card title="数据库监测列表" extra={<Search placeholder="请输入" />}>
            <ListDatabase datas={dataBase} onClick={e => this.handDetail(true, e)} />
          </Card>
        )}
        <MonitorDetail
          data={selectColumn}
          visible={detailVisible}
          onClose={() => this.setState({ detailVisible: false })}
        /> */}
        <Row gutter={24} type="flex">
          <Col xl={12} lg={24} style={{ marginBottom: 24 }}>
            <ChartCard title="CPU TOP5" contentHeight={350}>
              <Spin spinning={loading} style={{ background: '#ffffff' }}>
                {CPUdatas.length === 0 && <Empty style={{ height: '250px' }} />}
                {CPUdatas.length > 0 && (
                  <Cylinder
                    height={350}
                    data={CPUdatas}
                    padding={[0, 50, 30, 150]}
                    symbol="%"
                    cols={cols}
                    colors="l(270) 0:#04e8ff 0.5:#05bdfe 1:#05bdfe"
                  />
                )}
              </Spin>
            </ChartCard>
          </Col>
          <Col xl={12} lg={24} style={{ marginBottom: 24 }}>
            <ChartCard title="内存 TOP5" contentHeight={350}>
              <Spin spinning={loading} style={{ background: '#ffffff' }}>
                {Memorydatas.length === 0 && <Empty style={{ height: '250px' }} />}
                {Memorydatas.length > 0 && (
                  <Cylinder
                    height={350}
                    data={Memorydatas}
                    padding={[0, 50, 30, 150]}
                    symbol="%"
                    cols={cols}
                    colors="l(180) 0:#5bf792 0.5:#29dda1 1:#29dda1"
                  />
                )}
              </Spin>
            </ChartCard>
          </Col>
          <Col xl={12} lg={24} style={{ marginBottom: 24 }}>
            <ChartCard title="磁盘 TOP5" contentHeight={350}>
              <Spin spinning={loading} style={{ background: '#ffffff' }}>
                {diskdatas.length === 0 && <Empty style={{ height: '250px' }} />}
                {diskdatas.length > 0 && (
                  <Cylinder
                    height={350}
                    data={diskdatas}
                    padding={[0, 50, 30, 150]}
                    symbol="%"
                    cols={cols}
                    colors="l(180) 0:#c408f8 0.5:#8105fb 1:#8105fb"
                  />
                )}
              </Spin>
            </ChartCard>
          </Col>
          <Col xl={12} lg={24} style={{ marginBottom: 24 }}>
            <ChartCard title="WEB响应时间 TOP5" contentHeight={350}>
              <Spin spinning={loading} style={{ background: '#ffffff' }}>
                {WEBdatas.length === 0 && <Empty style={{ height: '250px' }} />}
                {WEBdatas.length > 0 && (
                  <Cylinder
                    height={350}
                    data={WEBdatas}
                    padding={[0, 50, 30, 150]}
                    symbol="ms"
                    cols={cols}
                    colors="l(180) 0:#ffbb02 0.5:#fe7402 1:#fe7402"
                  />
                )}
              </Spin>
            </ChartCard>
          </Col>
        </Row>
      </div>
    );
  }
}

export default index;
