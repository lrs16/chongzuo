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

const tjsj = {
  webOnline: '', // 主站在线
  fkpb: '', // 负控配变数据召测
  dy: '', // 低压
  cz: '', // 厂站
};

const statusMap = new Map([
  ['失败', '0'],
  ['成功', '1'],
])

const changeTree = datas => {
  const newArr = [];
  const childrendatas = [];
  if (!Array.isArray(datas)) {
    return newArr;
  }
  for (let i = 0; i < datas.length; i += 1) {
    const childrenvote = {};
    childrenvote.nodeName = datas[i].ip;
    childrenvote.nodeStatus = statusMap.get(datas[i].state);
    childrendatas.push(childrenvote);
  }
  const vote = {};
  vote.name = 'login';
  vote.children = childrendatas;
  newArr.push(vote);
  if (datas.length > 0) {
    tjsj.webOnline = datas[0].date;
  }
  return newArr;
};

const changefacetree = (datas, type) => {
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

  // 设置统计时间
  if (datas.length > 0) {
    if (type === 'fkpb') tjsj.fkpb = datas[0].date;
    if (type === 'dy') tjsj.dy = datas[0].date;
    if (type === 'cz') tjsj.cz = datas[0].date;
  }

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
      payload: { type: '负控配变数据召测' },
    });
    dispatch({
      type: 'sysrunning/fetchZCcontrol',
      payload: { type: '低压数据召测' },
    });
    dispatch({
      type: 'sysrunning/fetchZCdown',
      payload: { type: '厂站数据召读' },
    });
  }

  render() {
    const {
      loading,
      sysrunning: { onlinestate, ZCdist, ZCcontrol, ZCdown },
    } = this.props;
    const onlinestates = changeTree(onlinestate);
    const ZCdists = changefacetree(ZCdist, 'fkpb'); // 负控配变数据召测
    const ZCcontrols = changefacetree(ZCcontrol, 'dy'); // 低压
    const ZCdowns = changefacetree(ZCdown, 'cz'); // 厂站

    return (
      <div>
        <Row gutter={24} type="flex">
          <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
            <ChartCard title={`登录检测  （采集时间：${tjsj.webOnline}）`} contentHeight={350}>
              <Spin spinning={loading} style={{ background: '#ffffff' }}>
                {onlinestates.length === 0 && <Empty style={{ height: '250px' }} />}
                {onlinestates.length > 0 && (
                  <Treecompactbox
                    datas={onlinestates[0]}
                    height={350}
                    padding={[15, 180, 15, 20]}
                  />
                )}
              </Spin>
            </ChartCard>
          </Col>
          <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
            <ChartCard title="数据召测-低压" contentHeight={350}>
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
                  <EdgeLine datas={ZCcontrols[0]} height={350} padding={[15, 90, 15, 50]} />
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
                  <EdgeLine datas={ZCdists[0]} height={350} padding={[15, 90, 15, 50]} />
                )}
              </Spin>
            </ChartCard>
          </Col>

          <Col xl={12} xs={24} style={{ marginBottom: 24 }}>
            <ChartCard title="数据召测-厂站" contentHeight={350}>
              <Spin spinning={loading} style={{ background: '#ffffff' }}>
                {ZCdowns.length === 0 && <Empty style={{ height: '250px' }} />}
                {ZCdowns.length > 0 && (
                  <EdgeLine datas={ZCdowns[0]} height={350} padding={[15, 90, 15, 50]} />
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
