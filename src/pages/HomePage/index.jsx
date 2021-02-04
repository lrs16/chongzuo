import React from 'react';
import { Radio } from 'antd';

function HomePage(props) {
  return (
    <>
      <div>
        <Radio.Group defaultValue="a" size="large">
          <Radio.Button value="a">IT服务监控台</Radio.Button>
          <Radio.Button value="b">监测告警监控台</Radio.Button>
        </Radio.Group>
      </div>
    </>
  );
}

export default HomePage;
