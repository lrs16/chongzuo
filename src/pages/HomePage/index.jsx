import React from 'react';
import { Radio } from 'antd';
import ITHomePage from './ITHomePage';

function HomePage(props) {
  const RadiaValue = props.route.name;
  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Radio.Group defaultValue={RadiaValue}>
          <Radio.Button value="IT服务监控台">IT服务监控台</Radio.Button>
          <Radio.Button value="b">监测告警监控台</Radio.Button>
        </Radio.Group>
      </div>
      <ITHomePage />
    </>
  );
}

export default HomePage;
