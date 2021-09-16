import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Spin, Empty } from 'antd';
import { connect } from 'dva';
import TypeContext from '@/layouts/MenuContext';
import { ChartCard } from '@/components/Charts';
import DonutPCT from '@/components/CustomizeCharts/DonutPCT';
import SmoothLine from '@/components/CustomizeCharts/SmoothLine';
import MessagesList from './components/MessagesList';

const cols = {
  value: {
    min: 100,
    range: [0, 0.95],
    alias: '',
    tickCount: 5,
  },
  date: {
    // max: 24,
    range: [0.02, 0.95],
    alias: '',
  },
};

function MessageContent(props) {
  const { Donutdata, Smoothdata, dispatch, loading } = props;
  const { tabActivekey } = useContext(TypeContext);

  const getdatas = (key) => {
    dispatch({
      type: 'measuralarm/fetchoverdonut',
      payload: { key },
    });
    dispatch({
      type: 'measuralarm/fetchoversmooth',
      payload: { key },
    });
  };

  useEffect(() => {
    if (tabActivekey === 'all') {
      getdatas()
    }
  }, [tabActivekey])

  return (
    <div style={{ marginTop: 24 }}>
      {tabActivekey === 'all' && (
        <Spin spinning={loading}>
          <Row gutter={24}>
            <Col span={12}>
              <ChartCard title='告警概览'>
                <Spin spinning={false} style={{ background: '#ffffff' }}>
                  {Donutdata === undefined && <Empty style={{ height: '250px' }} />}
                  {Donutdata !== undefined && (
                    <DonutPCT data={Donutdata} cols={cols} height={350} padding={[40, 40, 60, 40]} onGetVal={() => { }} />
                  )}
                </Spin>
              </ChartCard>
            </Col>
            <Col span={12}>
              <ChartCard title='告警趋势'>
                <Spin spinning={false} style={{ background: '#ffffff' }}>
                  {Smoothdata === undefined && <Empty style={{ height: '250px' }} />}
                  {Smoothdata !== undefined && (
                    <SmoothLine data={Smoothdata} height={350} padding={[30, 0, 50, 60]} onGetVal={() => { }} />
                  )}
                </Spin>
              </ChartCard>
            </Col>
          </Row>
        </Spin>
      )}
      <MessagesList />
    </div>
  );
}

export default connect(({ measuralarm, loading }) => ({
  Donutdata: measuralarm.Donutdata,
  Smoothdata: measuralarm.Smoothdata,
  loading: loading.models.measuralarm,
}))(MessageContent);