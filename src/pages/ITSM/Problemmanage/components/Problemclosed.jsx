import React, { useState } from 'react';
import { Card, Descriptions, Menu, Divider, Collapse } from 'antd';

const { SubMenu } = Menu;
const { Panel } = Collapse;

function Problemclosed(props) {
  const { currentProcess, closeInfo, statue, querySign } = props;

  return (
    <>
    <Collapse 
          expandIconPosition="right" 
          style={{ backgroundColor: 'white',marginTop:'20px' }}
        >
          <Panel header="问题关闭">
            <Descriptions>
              <Descriptions.Item label="关闭意见">
                {closeInfo?closeInfo.problemFlowNodeRows[4].closeContent:''}
              </Descriptions.Item>
            </Descriptions>
            
            <Descriptions>
              <Descriptions.Item label="上传附件">
                <span style={{ color: 'blue', textDecoration: 'underline' }}>
                  {closeInfo.confirmOpinion || ''}
                </span>
              </Descriptions.Item>
            </Descriptions>

            <Descriptions>
              <Descriptions.Item label="关闭单位">{closeInfo?closeInfo.problemFlowNodeRows[4].closeUnit:''}</Descriptions.Item>
              <Descriptions.Item label="关闭部门">
                {closeInfo?closeInfo.problemFlowNodeRows[4].closeDept:''}
              </Descriptions.Item>
              <Descriptions.Item label="关闭人">{closeInfo?closeInfo.problemFlowNodeRows[4].closeUser:''}</Descriptions.Item>
            </Descriptions>

         

          </Panel>
        </Collapse>
    

    {/* {
      statue >= 85 && querySign && (
        <Collapse 
        expandIconPosition="right" 
        style={{ backgroundColor: 'white',marginTop:'20px' }}
        defaultActiveKey={['85']}
      >
        <Panel header="问题关闭" key={statue}>
          <Descriptions>
            <Descriptions.Item label="关闭意见">
              {closeInfo?closeInfo.problemFlowNodeRows[5].closeContent:''}
            </Descriptions.Item>
          </Descriptions>
          
          <Descriptions>
            <Descriptions.Item label="上传附件">
              <span style={{ color: 'blue', textDecoration: 'underline' }}>
                {closeInfo.confirmOpinion || ''}
              </span>
            </Descriptions.Item>
          </Descriptions>

          <Descriptions>
            <Descriptions.Item label="关闭单位">{closeInfo?closeInfo.problemFlowNodeRows[5].closeUnit:''}</Descriptions.Item>
            <Descriptions.Item label="关闭部门">
              {closeInfo?closeInfo.problemFlowNodeRows[5].closeDept:''}
            </Descriptions.Item>
            <Descriptions.Item label="关闭人">{closeInfo?closeInfo.problemFlowNodeRows[5].closeUser:''}</Descriptions.Item>
          </Descriptions>

       

        </Panel>
      </Collapse>
      )
    } */}
    </>
  );
}
export default Problemclosed;
