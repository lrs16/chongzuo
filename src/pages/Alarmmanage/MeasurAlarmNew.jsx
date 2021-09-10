import React, { useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Today from './Today';
import All from './All';

function MeasurAlarm(props) {
  const pagetitle = props.route.name;
  const [tabActivekey, settabActivekey] = useState('today'); // 打开标签

  const handleTabChange = key => {
    settabActivekey(key)
  };
  const tabList = [
    {
      key: 'today',
      tab: '今日告警',
    },
    {
      key: 'all',
      tab: '全部告警',
    },
  ];

  return (
    <PageHeaderWrapper
      title={pagetitle}
      tabList={tabList}
      tabActiveKey={tabActivekey}
      onTabChange={handleTabChange}
    >
      {tabActivekey === 'today' && (<Today />)}
      {tabActivekey === 'all' && (<All />)}
    </PageHeaderWrapper >
  );
}

export default MeasurAlarm;