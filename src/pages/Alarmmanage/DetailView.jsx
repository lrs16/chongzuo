import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Tabs, Button } from 'antd';
import RecordContext from '@/layouts/MenuContext';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import AlarmInfo from './components/AlarmInfo';
import OperationRecord from './components/OperationRecord';
import AlarmHistory from './components/AlarmHistory';
import NoticeHistory from './components/NoticeHistory';

function DetailView(props) {
  const { dispatch, location, location: { query: { Id } } } = props;
  const pagetitle = props.route.name;
  const [tabActivekey, settabActivekey] = useState('1'); // 打开标签
  const { currenttab } = useContext(RecordContext);

  const getalarmdetailsdatas = () => {
    dispatch({
      type: 'alarmdetails/fetchbasic',
      payload: Id,
    });
  };

  const getalarmoperatdatas = () => {
    dispatch({
      type: 'alarmdetails/fetchoperats',
    });
  };

  useEffect(() => {
    if (Id) {
      getalarmdetailsdatas();
      getalarmoperatdatas();
    }

  }, [Id])

  const handleTabChange = key => {
    settabActivekey(key)
  };
  const tabList = [
    {
      key: '1',
      tab: '基本信息',
    },
    {
      key: '2',
      tab: '操作记录',
    },
    {
      key: '3',
      tab: '当月告警历史',
    },
    {
      key: '4',
      tab: '告警通知',
    },
  ];

  const handleclose = () => {
    router.push({
      pathname: `/ITSM/releasemanage/registration`,
      query: { tabid: sessionStorage.getItem('tabid'), closecurrent: true, }
    });
  };
  const operations = (
    <>
      <Button type="default" onClick={() => handleclose()}>关闭</Button>
    </>
  );
  return (
    <PageHeaderWrapper
      title={pagetitle}
      tabList={tabList}
      tabActiveKey={tabActivekey}
      onTabChange={handleTabChange}
      extra={operations}
    >
      <Card>
        {tabActivekey === '1' && (<AlarmInfo data={currenttab && currenttab.state && currenttab.state || {}} />)}
        {tabActivekey === '2' && (<OperationRecord data={[]} />)}
        {tabActivekey === '3' && (<AlarmHistory data={[]} />)}
        {tabActivekey === '4' && (<NoticeHistory data={[]} />)}
      </Card>
    </PageHeaderWrapper>
  );
}

export default connect(({ alarmdetails, loading }) => ({
  alarmdetails,
  loading: loading.models.alarmdetails,
}))(DetailView);