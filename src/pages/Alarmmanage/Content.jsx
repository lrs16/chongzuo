import React, { useState, useEffect, useContext } from 'react';
import {
  Card,
  Row,
  Col,
  Spin,
  Empty,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import TypeContext from '@/layouts/MenuContext';
import { ChartCard } from '@/components/Charts';
import DonutPCT from '@/components/CustomizeCharts/DonutPCT';
import SmoothLine from '@/components/CustomizeCharts/SmoothLine';
import MeasurList from './components/MeasurList';
import HostList from './components/HostList';
import ConfigurationFileList from './components/ConfigurationFileList';
import ClockPatrolList from './components/ClockPatrolList';

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

function Today(props) {
  const { match, tabkeyDist, distkey, Donutdata, Smoothdata, dispatch, loading } = props;
  const [activeTabKey, setActiveTabKey] = useState('');
  // const [activeTabInfo, setActiveTabInfo] = useState({});
  const { tabActivekey, tabdate } = useContext(TypeContext);

  const getdatas = (key) => {
    const classify = key === '告警概览' ? '告警概览' : key.slice(0, -2);
    dispatch({
      type: 'measuralarm/fetchoverdonut',
      payload: {
        beginDate: tabdate.beginWarnTime ? moment(tabdate.beginWarnTime).format('YYYY-MM-DD HH:mm:ss') : '',
        endDate: tabdate.endWarnTime ? moment(tabdate.endWarnTime).format('YYYY-MM-DD HH:mm:ss') : '',
        classify,
      },
    });
    dispatch({
      type: 'measuralarm/fetchoversmooth',
      payload: {
        beginDate: tabdate.beginWarnTime ? moment(tabdate.beginWarnTime).format('YYYY-MM-DD HH:mm:ss') : '',
        endDate: tabdate.endWarnTime ? moment(tabdate.endWarnTime).format('YYYY-MM-DD HH:mm:ss') : '',
        classify,
      },
    });
  };

  const handleTabChange = (key) => {
    setActiveTabKey(key);
    if (tabActivekey === 'all') {
      getdatas(key);
    }
  };
  useEffect(() => {
    if (tabkeyDist && tabkeyDist.length > 1) {
      handleTabChange(tabkeyDist[0].key);
    };
  }, [tabkeyDist]);

  useEffect(() => {
    if (tabkeyDist && tabkeyDist.length > 1) {
      handleTabChange(tabkeyDist[0].key);
    };
  }, [tabActivekey]);

  useEffect(() => {
    if (tabdate) {
      handleTabChange('告警概览')
    }
  }, [tabdate])

  return (
    <>
      <Card
        tabList={tabkeyDist}
        activeTabKey={activeTabKey}
        onTabChange={key => { handleTabChange(key) }}
        style={{ marginTop: 24, marginBottom: `${tabActivekey === 'today' ? '-50px' : '-1px'}` }}
      >
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
      </Card>
      {distkey === 'measuralarm' && (<MeasurList ChangeActiveTabKey={(v) => handleTabChange(v)} activeTabKey={activeTabKey} />)}
      {distkey === 'hostalarm' && (<HostList activeTabInfo={activeTabKey} />)}
      {distkey === 'configurationfile' && (<ConfigurationFileList activeTabInfo={activeTabKey} />)}
      {distkey === 'clockpatrol' && (<ClockPatrolList activeTabInfo={activeTabKey} />)}
    </>
  );
}

export default connect(({ measuralarm, loading }) => ({
  Donutdata: measuralarm.Donutdata,
  Smoothdata: measuralarm.Smoothdata,
  loading: loading.models.measuralarm,
}))(Today);