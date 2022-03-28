import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Spin, Empty } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
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
  const { tabActivekey, tabdate, warnModule } = useContext(TypeContext);

  const getdatas = () => {
    dispatch({
      type: 'measuralarm/fetchoverdonut',
      payload: {
        beginDate: tabdate.beginWarnTime ? moment(tabdate.beginWarnTime).format('YYYY-MM-DD HH:mm:ss') : '',
        endDate: tabdate.endWarnTime ? moment(tabdate.endWarnTime).format('YYYY-MM-DD HH:mm:ss') : '',
        classify: '告警概览',
        warnModule,
      },
    });
    dispatch({
      type: 'measuralarm/fetchoversmooth',
      payload: {
        beginDate: tabdate.beginWarnTime ? moment(tabdate.beginWarnTime).format('YYYY-MM-DD HH:mm:ss') : '',
        endDate: tabdate.endWarnTime ? moment(tabdate.endWarnTime).format('YYYY-MM-DD HH:mm:ss') : '',
        classify: '告警概览',
        warnModule,
      },
    });
  };

  useEffect(() => {
    if (tabActivekey === 'all' && (tabdate && (tabdate.beginWarnTime || tabdate.endWarnTime))) {
      getdatas()
    }
  }, [tabdate])

  return (
    <div style={{ marginTop: 12 }}>
      {tabActivekey === 'all' && (
        <Spin spinning={loading}>
          <Row gutter={24}>
            <Col span={12}>
              <ChartCard title='告警概览'>
                <Spin spinning={false} style={{ background: '#ffffff' }}>
                  {Donutdata && Donutdata.length > 0 ? (
                    <DonutPCT data={Donutdata} cols={cols} height={350} padding={[40, 40, 60, 40]} onGetVal={() => { }} />
                  ) : (<Empty style={{ height: '250px' }} />)}
                </Spin>
              </ChartCard>
            </Col>
            <Col span={12}>
              <ChartCard title='告警趋势'>
                <Spin spinning={false} style={{ background: '#ffffff' }}>
                  {Smoothdata && Smoothdata.length > 0 ? (
                    <SmoothLine data={Smoothdata} height={350} padding={[30, 0, 50, 60]} onGetVal={() => { }} />
                  ) : (<Empty style={{ height: '250px' }} />)}
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