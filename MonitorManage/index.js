/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Icon, Tooltip, Card, Input } from 'antd';
import numeral from 'numeral';
import { ChartCard } from '@/components/Charts';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import ListHost from './components/ListHost';
import ListDatabase from './components/ListDatabase';
import style from './index.css';

const { Search } = Input;

@connect(({ hostmonitorlist, loading }) => ({
  hostmonitorlist,
  loading: loading.models.hostmonitorlist,
}))
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentIndex: 1,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'hostmonitorlist/fetch',
      payload: { current: 1, pageSize: 10 },
    });
  }

  tabChoiced = id => {
    // tab切换到方法
    this.setState({
      currentIndex: id,
    });
  };

  render() {
    const { currentIndex } = this.state;

    const { hostmonitorlist = {} } = this.props;
    const dataHost = hostmonitorlist.data;
    // console.log(dataHost);

    return (
      <GridContent>
        <Row gutter={24} type="flex">
          <Col xl={6} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
            <ChartCard
              className={style.charcard}
              onClick={() => this.tabChoiced(1)}
              title="主机"
              action={
                <Tooltip title="主机">
                  <Icon type="container" style={{ fontSize: 30 }} />
                </Tooltip>
              }
              total={numeral(560).format('0,0')}
              footer={
                <div>
                  <span>
                    <Icon
                      type="exclamation-circle"
                      theme="twoTone"
                      twoToneColor="#f00"
                      style={{ marginRight: 5 }}
                    />
                    35
                  </span>
                  <span style={{ marginLeft: 16 }}>
                    <Icon
                      type="exclamation-circle"
                      theme="twoTone"
                      twoToneColor="#f60"
                      style={{ marginRight: 5 }}
                    />
                    104
                  </span>
                  <span style={{ marginLeft: 16 }}>
                    <Icon
                      type="exclamation-circle"
                      theme="twoTone"
                      twoToneColor="#fc0"
                      style={{ marginRight: 5 }}
                    />
                    33
                  </span>
                  <span style={{ marginLeft: 16 }}>
                    <Icon type="exclamation-circle" theme="twoTone" style={{ marginRight: 5 }} />
                    306
                  </span>
                </div>
              }
              contentHeight={46}
            />
          </Col>
          <Col xl={6} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
            <ChartCard
              title="网络设备"
              action={
                <Tooltip title="指标说明">
                  <Icon type="gold" style={{ fontSize: 30 }} />
                </Tooltip>
              }
              total={numeral(75).format('0,0')}
              footer={
                <div>
                  <span>
                    <Icon
                      type="exclamation-circle"
                      theme="twoTone"
                      twoToneColor="#f00"
                      style={{ marginRight: 5 }}
                    />
                    5
                  </span>
                  <span style={{ marginLeft: 16 }}>
                    <Icon
                      type="exclamation-circle"
                      theme="twoTone"
                      twoToneColor="#f60"
                      style={{ marginRight: 5 }}
                    />
                    4
                  </span>
                  <span style={{ marginLeft: 16 }}>
                    <Icon
                      type="exclamation-circle"
                      theme="twoTone"
                      twoToneColor="#fc0"
                      style={{ marginRight: 5 }}
                    />
                    3
                  </span>
                  <span style={{ marginLeft: 16 }}>
                    <Icon type="exclamation-circle" theme="twoTone" style={{ marginRight: 5 }} />1
                  </span>
                </div>
              }
              contentHeight={46}
            />
          </Col>
          <Col xl={6} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
            <ChartCard
              title="中间件"
              action={
                <Tooltip title="指标说明">
                  <Icon type="deployment-unit" style={{ fontSize: 30 }} />
                </Tooltip>
              }
              total={numeral(5).format('0,0')}
              footer={
                <div>
                  <span>
                    <Icon
                      type="exclamation-circle"
                      theme="twoTone"
                      twoToneColor="#f00"
                      style={{ marginRight: 5 }}
                    />
                    53
                  </span>
                  <span style={{ marginLeft: 16 }}>
                    <Icon
                      type="exclamation-circle"
                      theme="twoTone"
                      twoToneColor="#f60"
                      style={{ marginRight: 5 }}
                    />
                    42
                  </span>
                  <span style={{ marginLeft: 16 }}>
                    <Icon
                      type="exclamation-circle"
                      theme="twoTone"
                      twoToneColor="#fc0"
                      style={{ marginRight: 5 }}
                    />
                    31
                  </span>
                  <span style={{ marginLeft: 16 }}>
                    <Icon type="exclamation-circle" theme="twoTone" style={{ marginRight: 5 }} />1
                  </span>
                </div>
              }
              contentHeight={46}
            />
          </Col>
          <Col xl={6} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
            <ChartCard
              className={style.charcard}
              onClick={() => this.tabChoiced(2)}
              title="数据库"
              action={
                <Tooltip title="数据库">
                  <Icon type="database" style={{ fontSize: 30 }} />
                </Tooltip>
              }
              total={numeral(88).format('0,0')}
              footer={
                <div>
                  <span>
                    <Icon
                      type="exclamation-circle"
                      theme="twoTone"
                      twoToneColor="#f00"
                      style={{ marginRight: 5 }}
                    />
                    25
                  </span>
                  <span style={{ marginLeft: 16 }}>
                    <Icon
                      type="exclamation-circle"
                      theme="twoTone"
                      twoToneColor="#f60"
                      style={{ marginRight: 5 }}
                    />
                    94
                  </span>
                  <span style={{ marginLeft: 16 }}>
                    <Icon
                      type="exclamation-circle"
                      theme="twoTone"
                      twoToneColor="#fc0"
                      style={{ marginRight: 5 }}
                    />
                    33
                  </span>
                  <span style={{ marginLeft: 16 }}>
                    <Icon type="exclamation-circle" theme="twoTone" style={{ marginRight: 5 }} />
                    101
                  </span>
                </div>
              }
              contentHeight={46}
            />
          </Col>
        </Row>
        {currentIndex === 1 && (
          <Card title="主机监测列表" extra={<Search placeholder="请输入" />}>
            <ListHost datas={dataHost} />
          </Card>
        )}
        {currentIndex === 2 && (
          <Card title="数据库监测列表" extra={<Search placeholder="请输入" />}>
            <ListDatabase />
          </Card>
        )}
      </GridContent>
    );
  }
}

export default index;
