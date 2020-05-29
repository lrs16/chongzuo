import React, { Component } from 'react';
import { Row, Col, Icon, Tooltip, Card, Input } from 'antd';
import numeral from 'numeral';
import { ChartCard } from '@/components/Charts';
import { connect } from 'dva';
import ListHost from './components/ListHost';
import ListDatabase from './components/ListDatabase';
import style from './index.css';
import MonitorDetail from './monitorStation/components/monitorDetail';

const { Search } = Input;
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
    this.getDatabase();
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
      type: 'monitorlist/fetchhost',
      payload: { current: 1, pageSize: 10 },
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

    const { monitorlist = {} } = this.props;
    const { data: dataHost, databaselist: dataBase, monitorGroups } = monitorlist;
    return (
      <div>
        <Row gutter={24} type="flex">
          {monitorGroups.map(g => (
            <Col key={g.id} xl={6} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
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
          hostID={hostID}
          visible={detailVisible}
          onClose={() => this.setState({ detailVisible: false })}
        />
      </div>
    );
  }
}

export default index;
