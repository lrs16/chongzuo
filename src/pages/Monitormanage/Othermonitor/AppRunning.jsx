import React, { useState } from 'react';
import { Card } from 'antd';
import TotalInfo from '../../Alarmmanage/components/TotalInfo';

const infolist = [
  { name: '告警总数', total: 1988, key: '1' },
  { name: '安全接入区', total: 556, key: '2' },
  { name: '安全I区', total: 3855, key: '3' },
  { name: '安全II区', total: 1, key: '4' },
  { name: '安全III区', total: 520, key: '5' },
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