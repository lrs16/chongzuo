import React, { useState } from 'react';
import { Form, } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import TimedExecuteList from './components/TimedExecuteList';
import ManualExecuteList from './components/ManualExecuteList';

const tabList = [
  {
    key: 'manualexecute',
    tab: '手动执行',
  },
  {
    key: 'timedexecute',
    tab: '定时执行',
  },
];

function JobExecute(props) {
  const pagetitle = props.route.name;
  const {
    location,
  } = props;

  const [tabActivekey, settabActivekey] = useState('manualexecute'); // 打开标签

  const handleTabChange = key => {
    settabActivekey(key);
  };

  return (
    <PageHeaderWrapper
      title={pagetitle}
      tabList={tabList}
      tabActiveKey={tabActivekey}
      onTabChange={handleTabChange}
    >
      {/* 手动执行 */}
      {tabActivekey === 'manualexecute' && (<ManualExecuteList location={location} />
      )}
      {/* 定时执行 */}
      {tabActivekey === 'timedexecute' && (<TimedExecuteList location={location} />)}
    </PageHeaderWrapper>
  );
}

export default Form.create({})(JobExecute);