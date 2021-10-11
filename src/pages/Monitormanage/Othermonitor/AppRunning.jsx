import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Layout, Tabs, Row, Col, Tag } from 'antd';
import { querkeyVal } from '@/services/api';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import TotalInfo from '../../Alarmmanage/components/TotalInfo';

const { Sider, Content } = Layout;
const { TabPane } = Tabs;

const panes = [
  { title: 'Tab 1', key: '1' },
  { title: 'Tab 2', key: '2' },
  { title: 'Tab 3', key: '3', },
];

function AppRunning(props) {
  const { dispatch, location, totalinfo } = props;
  const pagetitle = props.route.name;
  const [activeTabKey, setActiveTabKey] = useState('');
  const [tabkeyDist, setTabkeyDist] = useState([{ key: 'index1', tab: '加载中' }]);
  const [activeKey, setActiveKey] = useState('');

  const handleTabChange = (key) => {
    setActiveTabKey(key)
  };

  const onChange = (key) => {
    console(key)
  }

  useEffect(() => {
    dispatch({
      type: 'measuralarm/fetchtotalinfo',
      payload: {
        beginDate: moment().format('YYYY-MM-DD 00:00:00'),
        endDate: moment().format('YYYY-MM-DD HH:mm:ss'),
        warnModule: 'configFile',
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
  }, []);

  useEffect(() => {
    handleTabChange('安全接入区')
  }, [tabkeyDist])

  useEffect(() => {
    if (location.state && location.state.reset) {
      // 点击菜单刷新
      handleTabChange('today');
      dispatch({
        type: 'measuralarm/fetchtotalinfo',
        payload: {
          beginDate: moment().format('YYYY-MM-DD 00:00:00'),
          endDate: moment().format('YYYY-MM-DD HH:mm:ss'),
          warnModule: 'configFile',
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
        <Layout style={{ position: 'relative', minHeight: 'calc(100vh - 450px)', marginTop: '-23px' }}>
          <Sider
            width={250}
            style={{
              background: '#fff',
              borderRight: '1px solid #e8e8e8',
              position: 'absolute',
              left: 0,
              height: '100%',
              overflow: 'auto'
            }}
          >
            111
          </Sider>
          <Content style={{ marginLeft: 249, background: '#fff', padding: 12 }}>
            <Tabs
              onChange={onChange}
              activeKey={activeKey}
              type="editable-card"
            >
              {panes.map(pane => (
                <TabPane tab={pane.title} key={pane.key} closable={false} />
              ))}
            </Tabs>
            <div style={{ marginLeft: 2 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Card>
                    <h3>端口状态</h3>
                    <div>
                      <Tag color="green">8080</Tag>
                      <Tag color="green">8010</Tag>
                    </div>
                  </Card>
                  <Card style={{ marginTop: 16 }}>
                    <h3>端口状态</h3>
                    <div>
                      <Tag color="green">8080</Tag>
                      <Tag color="green">8010</Tag>
                    </div>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card>
                    <h3>进程CPU使用率</h3>

                  </Card>
                </Col>
              </Row>
            </div>
          </Content>
        </Layout>
      </Card>
    </PageHeaderWrapper>
  );
}

export default connect(({ measuralarm, loading }) => ({
  totalinfo: measuralarm.totalinfo,
  loading: loading.models.measuralarm,
}))(AppRunning);