import React from 'react';
import { Card, Steps } from 'antd';

const { Step } = Steps;

function Process(props) {
  return (
    <>
      <Card>流程图</Card>
      <Card title="流转日志">
        <Steps progressDot current={1} direction="vertical">
          <Step title="事件登记" description="2020-10-19" />
          <Step title="事件处理" description="2020-10-19" />
          <Step title="事件回访" description="2020-10-19" />
        </Steps>
      </Card>
    </>
  );
}

export default Process;
