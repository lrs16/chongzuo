/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { connect } from 'dva';
import numeral from 'numeral';
import moment from 'moment';
import { Row, Col, Icon, Tooltip, Card, Select, Button, Spin, Empty } from 'antd';
import Treecompactbox from '@/components/CustomizeCharts/Treecompactbox';
import EdgeLine from '@/components/CustomizeCharts/EdgeLine';
import { ChartCard } from '@/components/Charts';
// import SelectArea from '@/components/Selects/SelectArea';
// import GridContent from '@/components/PageHeaderWrapper/GridContent';

const changeTree = datas => {
  const newArr = [];
  if (!Array.isArray(datas)) {
    return newArr;
  }
  const vote = {};
  vote.name = 'login';
  vote.children = datas;
  newArr.push(vote);

  return newArr;
};

const changefacetree = datas => {
  const newArr = [];
  const data = [];
  if (!Array.isArray(datas)) {
    return newArr;
  }
  // for (let i = 0; i < datas.length; i += 1) {
  //   const childrendata = {};
  //   childrendata.area = datas[i].area;
  //   childrendata.status = datas[i].state;
  //   data.push(childrendata);
  // }
  const vote = {};
  vote.area = '计量中心';
  vote.children = datas;
  newArr.push(vote);

  return newArr;
};
@connect(({ sysrunning, loading }) => ({
  sysrunning,
  loading: loading.models.sysrunning,
}))
class SysRunning extends Component {
  componentDidMount() {
    this.getdatas();
  }

  getdatas() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysrunning/fetchOnlinestate',
    });
    dispatch({
      type: 'sysrunning/fetchZCdist',
      payload: { type: '配变' },
    });
    dispatch({
      type: 'sysrunning/fetchZCcontrol',
      payload: { type: '费控' },
    });
  }

  render() {
    const {
      loading,
      sysrunning: { onlinestate, ZCdist, ZCcontrol },
    } = this.props;
    const onlinestates = changeTree(onlinestate);
    const ZCdists = changefacetree(ZCdist);
    const ZCcontrols = changefacetree(ZCcontrol);
    return (
      <div>
        <Row gutter={24} type="flex">
          <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
            <ChartCard title="登录检测" contentHeight={350}>
              <Spin spinning={loading} style={{ background: '#ffffff' }}>
                {onlinestates.length === 0 && <Empty style={{ height: '250px' }} />}
                {onlinestates.length > 0 && (
                  <Treecompactbox
                    datas={onlinestates[0]}
                    height={350}
                    padding={[15, 130, 15, 20]}
                  />
                )}
              </Spin>
            </ChartCard>
          </Col>
          <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
            <ChartCard title="数据召测-费控" contentHeight={350}>
              {/* <div
                style={{
                  margin: '10px',
                  position: 'absolute',
                  top: '-38px',
                  left: '120px',
                  zIndex: '100px',
                }}
              >
                <SelectArea />
                <Button type="primary">手工召测</Button>
              </div> */}
              <Spin spinning={loading} style={{ background: '#ffffff' }}>
                {ZCcontrols.length === 0 && <Empty style={{ height: '250px' }} />}
                {ZCcontrols.length > 0 && (
                  <EdgeLine datas={ZCcontrols[0]} height={350} padding={[15, 60, 15, 50]} />
                )}
              </Spin>
            </ChartCard>
          </Col>
          <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
            <ChartCard title="数据召测-负控配变" contentHeight={350}>
              {/* <div
                style={{
                  margin: '10px',
                  position: 'absolute',
                  top: '-38px',
                  left: '120px',
                  zIndex: '100px',
                }}
              >
                <SelectArea />
                <Button type="primary">手工召测</Button>
              </div> */}
              <Spin spinning={loading} style={{ background: '#ffffff' }}>
                {ZCdists.length === 0 && <Empty style={{ height: '250px' }} />}
                {ZCdists.length > 0 && (
                  <EdgeLine datas={ZCdists[0]} height={350} padding={[15, 60, 15, 50]} />
                )}
              </Spin>
            </ChartCard>
          </Col>
          {/* <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
            <ChartCard title="数据召测-厂站" contentHeight={350}>
              <div
                style={{
                  margin: '10px',
                  position: 'absolute',
                  top: '-38px',
                  left: '120px',
                  zIndex: '100px',
                }}
              >
                <SelectArea />
                <Button type="primary">手工召测</Button>
              </div>
              <EdgeLine datas={ZCdown} height={350} padding={[15, 60, 15, 50]} />
            </ChartCard>
          </Col> */}
        </Row>
      </div>
    );
  }
}

export default SysRunning;
