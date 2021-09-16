import React, { useState } from 'react';
import { Card } from 'antd';
import TotalInfo from '../../Alarmmanage/components/TotalInfo';

const infolist = [
  { title: '告警总数', value: 1988, key: '1' },
  { title: '安全接入区', value: 556, key: '2' },
  { title: '安全I区', value: 3855, key: '3' },
  { title: '安全II区', value: 1, key: '4' },
  { title: '安全III区', value: 520, key: '5' },
]

const tabkeyDist = [
  { key: '1', tab: '安全接入区' },
  { key: '2', tab: '安全I区' },
  { key: '3', tab: '安全II区' },
  { key: '4', tab: '安全III区' },
]

function AppRunning(props) {
  const [activeTabKey, setActiveTabKey] = useState('1');

  const handleTabChange = (key) => {
    setActiveTabKey(key)
  };

  return (
    <div>
      <TotalInfo infolist={infolist} />
      <Card
        tabList={tabkeyDist}
        activeTabKey={activeTabKey}
        onTabChange={key => { handleTabChange(key) }}
        style={{ margin: '24px 0' }}
      >
        1111
      </Card>
    </div>
  );
}

export default AppRunning;