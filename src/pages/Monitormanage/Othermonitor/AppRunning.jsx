import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Tabs, Row, Col, Tag, Badge, Spin, Empty } from 'antd';
import { querkeyVal } from '@/services/api';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SmoothLine from '@/components/CustomizeCharts/SmoothLine';
import timerule from '@/pages/SysManage/models/timerule';
import TotalInfo from '../../Alarmmanage/components/TotalInfo';

const { TabPane } = Tabs;

const changeArr = (datas) => {
  const newArr = [];
  if (!Array.isArray(datas)) {
    return newArr;
  }
  for (let i = 0; i < datas.length; i += 1) {
    const vote = {};
    vote.date = datas[i].date;
    vote.name = datas[i].name;
    vote.value = Number(datas[i].value);
    newArr.push(vote);
  }
  return newArr;
};

const hostZone = new Map([
  ['安全接入区', '4'],
  ['安全Ⅰ区', '1'],
  ['安全Ⅱ区', '2'],
  ['安全Ⅲ区', '3']
])

function AppRunning(props) {
  const { dispatch, location, totalinfo, chartdata, chartloading } = props;
  const pagetitle = props.route.name;
  const [activeTabKey, setActiveTabKey] = useState('');
  const [tabkeyDist, setTabkeyDist] = useState([{ key: 'index1', tab: '加载中' }]);
  const [activeKey, setActiveKey] = useState('');
  const [menukey, setMenukey] = useState('');

  const onChange = (key) => {
    setActiveKey(key)
  };

  const handleClick = (key) => {
    setMenukey(key);
    onChange('0')
  };

  const handleTabChange = (key) => {
    setActiveTabKey(key);
    handleClick('0');
    dispatch({
      type: 'orthermonitor/fetchchart',
      payload: {
        hostId: '',
        hostName: '',
        hostZoneId: hostZone.get(key),
        softId: '',
        softProcessName: '',
        dataStartTime: moment().format('YYYY-MM-DD 00:00:00'),
        dataEndTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      },
    });
  };

  useEffect(() => {
    handleTabChange('安全接入区');
    dispatch({
      type: 'measuralarm/fetchtotalinfo',
      payload: {
        beginDate: moment().format('YYYY-MM-DD 00:00:00'),
        endDate: moment().format('YYYY-MM-DD HH:mm:ss'),
        warnModule: 'app',
      },
    });
    querkeyVal('tabkey', 'hostalarm').then(res => {
      if (res.code === 200) {
        const value = Object.values(res.data)[0];
        const newData = value.map(item => {
          return { key: item.val, tab: item.val }
        });
        newData.shift();
        setTabkeyDist(newData);
      }
    });
    let timer = setInterval(() => {
      handleTabChange('安全接入区');
      dispatch({
        type: 'measuralarm/fetchtotalinfo',
        payload: {
          beginDate: moment().format('YYYY-MM-DD 00:00:00'),
          endDate: moment().format('YYYY-MM-DD HH:mm:ss'),
          warnModule: 'app',
        },
      });
    }, 600000);
    return () => {
      clearInterval(timer);
      timer = null
    }
  }, []);

  useEffect(() => {
    if (location.state && location.state.reset) {
      // 点击菜单刷新
      handleTabChange('安全接入区');
      dispatch({
        type: 'measuralarm/fetchtotalinfo',
        payload: {
          beginDate: moment().format('YYYY-MM-DD 00:00:00'),
          endDate: moment().format('YYYY-MM-DD HH:mm:ss'),
          warnModule: 'app',
        },
      });
    }
  }, [location.state]);

  return (
    <PageHeaderWrapper title={pagetitle}>
      <TotalInfo infolist={totalinfo || []} />
      <Card
        tabList={tabkeyDist}
        activeTabKey={activeTabKey}
        onTabChange={key => { handleTabChange(key) }}
        style={{ margin: '24px 0' }}
      >
        <Spin spinning={chartloading}>
          {chartdata && chartdata.length > 0 ? (
            <Tabs tabPosition='left' onChange={handleClick} activeKey={menukey}>
              {chartdata && chartdata.map((pane, index) => (<TabPane
                tab={
                  <>
                    <span style={{ marginRight: 8 }}>{pane.hostAddress}{pane.hostName}</span>
                    {pane.normalNum && (<><Badge status="success" />{pane.normalNum}</>)}
                    {pane.errorNum && (<><Badge status="error" style={{ marginLeft: 8 }} />{pane.errorNum}</>)}
                  </>
                }
                key={index.toString()}
              >
                <div>
                  {pane.appSoftVoList && (
                    <Tabs
                      onChange={onChange}
                      activeKey={activeKey}
                      type="card"
                    >
                      {pane.appSoftVoList && pane.appSoftVoList.map((item, ii) => (
                        <TabPane
                          tab={
                            <>
                              <span style={{ marginRight: 8 }}>{item.softName}</span>
                              <Badge status={item.softStatus === '1' ? 'success' : 'error'} />
                            </>
                          }
                          key={ii.toString()}
                          closable={false}>
                          <Row gutter={16}>
                            <Col span={12}>
                              <Card style={{ height: 130 }}>
                                <h3>端口状态</h3>
                                <div>
                                  {item.softPort && JSON.parse(item.softPort) && (
                                    Object.keys(JSON.parse(item.softPort)).map((obj, i) => {
                                      const val = Object.values(JSON.parse(item.softPort));
                                      return <Tag color={val[i] ? 'green' : 'volcano'} key={i.toString()}>{obj}</Tag>
                                    })
                                  )}
                                </div>
                              </Card>
                            </Col>
                            <Col span={12}>
                              <Card style={{ height: 130 }}>
                                <h3>运行时长</h3>
                                <div>
                                  <span style={{ color: '#1890ff', fontWeight: 700, fontSize: ' 2.0em' }}>{item.softRunDay}</span>day
                                </div>
                              </Card>
                            </Col>
                            <Col span={24} style={{ marginTop: 16 }}>
                              <Card>
                                <h3>进程CPU使用率（%）</h3>
                                <SmoothLine
                                  data={changeArr(item.cpuUse) || []}
                                  height={200}
                                  padding={[30, 0, 60, 60]}
                                  onGetVal={() => { }}
                                />
                              </Card>
                            </Col>
                            <Col span={24} style={{ marginTop: 16 }}>
                              <Card>
                                <h3>进程内存使用率（%）</h3>
                                <SmoothLine
                                  data={changeArr(item.memoryUse) || []}
                                  height={200}
                                  padding={[30, 0, 60, 60]}
                                  onGetVal={() => { }}
                                />
                              </Card>
                            </Col>
                            <Col span={24} style={{ marginTop: 16 }}>
                              <Card>
                                <h3>进程使用物理内存（MB）</h3>
                                <SmoothLine
                                  data={changeArr(item.physicalMemory) || []}
                                  height={200}
                                  padding={[30, 0, 60, 60]}
                                  onGetVal={() => { }}
                                />
                              </Card>
                            </Col>
                            <Col span={24} style={{ marginTop: 16 }}>
                              <Card>
                                <h3>进程使用虚拟内存（MB）</h3>
                                <SmoothLine
                                  data={changeArr(item.virtualMemory) || []}
                                  height={200}
                                  padding={[30, 0, 60, 60]}
                                  onGetVal={() => { }}
                                />
                              </Card>
                            </Col>
                          </Row>
                        </TabPane>
                      ))}
                    </Tabs>
                  )}
                </div>
              </TabPane>
              ))}
            </Tabs>) : <Empty style={{ height: '350px' }} />}
        </Spin>
      </Card>
    </PageHeaderWrapper>
  );
}

export default connect(({ measuralarm, orthermonitor, loading }) => ({
  chartdata: orthermonitor.chartdata,
  totalinfo: measuralarm.totalinfo,
  loading: loading.models.measuralarm,
  chartloading: loading.models.orthermonitor,
}))(AppRunning);