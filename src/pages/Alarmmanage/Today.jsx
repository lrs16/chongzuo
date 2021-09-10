import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import { querkeyVal } from '@/services/api';
import TotalInfo from './components/TotalInfo';
import OverVies from './components/OverVies';

function Today(props) {
  const { match } = props;
  const [activeTabKey, setActiveTabKey] = useState('');
  const [tabkeyDist, setTabkeyDist] = useState([]);
  const [activeTabInfo, setActiveTabInfo] = useState({});

  useEffect(() => {
    const distkey = match.path.substring(match.path.lastIndexOf('/') + 1);
    querkeyVal('tabkey', distkey).then(res => {
      if (res.code === 200) {
        const value = Object.values(res.data)[0];
        const newData = value.map(item => {
          return { key: item.key, tab: item.val }
        })
        setTabkeyDist(newData)
      }
    });
  }, [match.path]);

  const handleTabChange = (key) => {
    setActiveTabKey(key);
    const target = tabkeyDist.filter(item => item.key === key)[0];
    if (target) {
      setActiveTabInfo(target);
    }
  };
  useEffect(() => {
    if (tabkeyDist.length > 0) {
      handleTabChange(tabkeyDist[0].key);
    };
  }, [tabkeyDist]);

  return (
    <>
      <TotalInfo />
      <Card
        tabList={tabkeyDist}
        activeTabKey={activeTabKey}
        onTabChange={key => { handleTabChange(key) }}
        style={{ marginTop: 24 }}
      >
        <OverVies activeTabInfo={activeTabInfo} />
      </Card>
    </>
  );
}

export default Today;