import React, { useState } from 'react';
import {  Descriptions, Menu, Collapse } from 'antd';

const { SubMenu } = Menu;
const { Panel } = Collapse;

function Problemsolving(props) {
  const { solvingDetail, currentProcess, statue, currentObj } = props;
  const [expand, setExpand] = useState(currentProcess);
  const [state, setState] = useState(3);

  return (
    <>
      {/* { */}
      {/* expand !== '问题处理' && statue >= state && ( */}
      <Collapse 
        expandIconPosition="right" 
        style={{ backgroundColor: 'white', marginTop: '20px' }}
        defaultActiveKey={['45']}
        >
        <Panel header="问题处理" key={statue} style={{ marginBottom: '0px', paddingBottom: '0px' }}>
          <Descriptions>
            <Descriptions.Item label="处理单位">
              {solvingDetail ? solvingDetail.problemFlowNodeRows[2].handleUnit : ''}
            </Descriptions.Item>
            <Descriptions.Item label="处理部门">
              {solvingDetail ? solvingDetail.problemFlowNodeRows[2].handleDept : ''}
            </Descriptions.Item>
            <Descriptions.Item label="处理人">
              {solvingDetail ? solvingDetail.problemFlowNodeRows[2].handler : ''}
            </Descriptions.Item>
            <Descriptions.Item label="接单时间">
              {solvingDetail ? solvingDetail.problemFlowNodeRows[2].addTime : ''}
            </Descriptions.Item>
            <Descriptions.Item label="处理时间">
              {solvingDetail ? solvingDetail.NodeRows[2].handleTime : ''}
            </Descriptions.Item>
            <Descriptions.Item label="处理结果">
              {solvingDetail ? solvingDetail.problemFlowNodeRows[2].handleResult : ''}
            </Descriptions.Item>
          </Descriptions>
          <Descriptions>
            <Descriptions.Item label="解决方案">
              {solvingDetail ? solvingDetail.problemFlowNodeRows[2].handleTime : ''}
            </Descriptions.Item>
          </Descriptions>
          <Descriptions>
            <Descriptions.Item label="上传附件">
              <span style={{ color: 'blue', textDecoration: 'underline' }}>11</span>666
            </Descriptions.Item>
          </Descriptions>
        </Panel>
      </Collapse>
    </>
  );
}
export default Problemsolving;
