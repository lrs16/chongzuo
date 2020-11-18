import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Tabs, Badge, Tag, Anchor, Button } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import AlarmInfo from './components/AlarmInfo';
import OperationRecord from './components/OperationRecord';
import AlarmHistory from './components/AlarmHistory';
import NoticHistory from './components/NoticHistory';

const { TabPane } = Tabs;
const operations = <Button href="/alarmmanage/measuralarm/details">返回列表</Button>;

@connect(({ alarmdetails, loading }) => ({
  alarmdetails,
  loading: loading.effects['alarmdetails/fetchbasic'],
}))
class $detailsid$ extends Component {
  constructor(props) {
    super(props);
    this.detailsid = props.match.params.detailsid;
  }

  componentDidMount() {
    if (this.detailsid) {
      this.getalarmdetailsdatas();
      this.getalarmoperatdatas();
    }
  }

  getalarmdetailsdatas() {
    const { dispatch } = this.props;
    dispatch({
      type: 'alarmdetails/fetchbasic',
      payload: this.detailsid,
    });
  }

  getalarmoperatdatas() {
    const { dispatch } = this.props;
    dispatch({
      type: 'alarmdetails/fetchoperats',
    });
  }

  render() {
    const { alarmdetails = {} } = this.props;
    const { alarmInfo = [], operatslist = [], alarmhistory = [], notichistory = [] } = alarmdetails;
    return (
      <PageHeaderWrapper title="告警详细信息">
        <Card>
          <Tabs defaultActiveKey="1" size="large" tabBarExtraContent={operations}>
            <TabPane tab="基本信息" key="1">
              <AlarmInfo data={alarmInfo} />
            </TabPane>
            <TabPane tab="操作记录" key="2">
              <OperationRecord data={operatslist} />
            </TabPane>
            <TabPane tab="告警历史" key="3">
              <AlarmHistory data={alarmhistory} />
            </TabPane>
            <TabPane tab="告警通知" key="4">
              <NoticHistory data={notichistory} />
            </TabPane>
          </Tabs>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default $detailsid$;
