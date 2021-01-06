import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Menu, Divider, Collapse } from 'antd';

const { SubMenu } = Menu;
const { Panel } = Collapse;

function Problemconfirmation(props) {
  const { confirmationDetail, currentProcess, querySign, statue } = props;

  return (
    <>
      {/* { */}
      {/* // expand !== '问题确认' && statue >= state && ( */}
      <Collapse 
        expandIconPosition="right" 
        style={{ backgroundColor: 'white', marginTop: '20px' }}
      >
        <Panel header="问题确认">
          <Descriptions>
            <Descriptions.Item label="确认单位">
              {confirmationDetail ? confirmationDetail.problemFlowNodeRows[3].confirmUnit : ''}
            </Descriptions.Item>
            <Descriptions.Item label="确认部门">
              {confirmationDetail ? confirmationDetail.problemFlowNodeRows[3].confirmDept : ''}
            </Descriptions.Item>
            <Descriptions.Item label="确认人">
              {confirmationDetail ? confirmationDetail.problemFlowNodeRows[3].confirmUser : ''}
            </Descriptions.Item>
            <Descriptions.Item label="确认结果">
              {confirmationDetail ? confirmationDetail.problemFlowNodeRows[3].confirmResult : ''}
            </Descriptions.Item>
            <Descriptions.Item label="确认时间">
              {confirmationDetail ? confirmationDetail.problemFlowNodeRows[3].confirmTime : ''}
            </Descriptions.Item>
          </Descriptions>

          <Descriptions>
            <Descriptions.Item label="确认意见"></Descriptions.Item>
          </Descriptions>

          <Descriptions>
            <Descriptions.Item label="上传附件">
              <span style={{ color: 'blue', textDecoration: 'underline' }}>000</span>
            </Descriptions.Item>
          </Descriptions>
        </Panel>
      </Collapse>

    </>
  );
}
export default Problemconfirmation;
