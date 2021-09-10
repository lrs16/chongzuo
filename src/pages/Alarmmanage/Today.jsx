import React, { useState } from 'react';
import { Card } from 'antd';
import TotalInfo from './components/TotalInfo';
import OverVies from './components/OverVies';


const tabList = [
  {
    key: 'tab1',
    tab: 'tab1',
  },
  {
    key: 'tab2',
    tab: 'tab2',
  },
];

const tabListNoTitle = [
  {
    key: 'article',
    tab: 'article',
  },
  {
    key: 'app',
    tab: 'app',
  },
  {
    key: 'project',
    tab: 'project',
  },
];

function Today(props) {
  return (
    <>
      <TotalInfo />
      {/* <Card
        tabList={tabList}
        activeTabKey={this.state.key}
        onTabChange={key => {
          onTabChange(key);
        }}
      >
        <OverVies />
      </Card> */}
    </>
  );
}

export default Today;