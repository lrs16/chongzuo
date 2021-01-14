import React from 'react';
import {  Descriptions, Collapse } from 'antd';

const { Panel } = Collapse;

function Operatorconfirmades(props) {
  const { confirmationDetail, loading } = props;

  return (
    <>
      {
        loading === false && confirmationDetail && (
          <Collapse 
          expandIconPosition="right" 
          style={{ backgroundColor: 'white', marginTop: '20px' }}
        >
          <Panel header="系统运维商确认">
            <Descriptions>
              <Descriptions.Item label="确认结果">
                {confirmationDetail ? confirmationDetail.problemFlowNodeRows[4].confirmResult : ''}
              </Descriptions.Item>
            </Descriptions>

            <Descriptions>
              <Descriptions.Item label="确认时间">
                {confirmationDetail ? confirmationDetail.problemFlowNodeRows[4].confirmTime : ''}
              </Descriptions.Item>
            </Descriptions>

            <Descriptions>
              <Descriptions.Item label="确认意见">
              {confirmationDetail ? confirmationDetail.problemFlowNodeRows[4].confirmTime : ''}
              </Descriptions.Item>
            </Descriptions>
  
            <Descriptions>
              <Descriptions.Item label="上传附件">
                <span style={{ color: 'blue', textDecoration: 'underline' }}>000</span>
              </Descriptions.Item>
            </Descriptions>

            <Descriptions>
              <Descriptions.Item label="确认人">
                {confirmationDetail ? confirmationDetail.problemFlowNodeRows[4].confirmUser : ''}
              </Descriptions.Item>

              <Descriptions.Item label="确认单位">
                {confirmationDetail ? confirmationDetail.problemFlowNodeRows[4].confirmUnit : ''}
              </Descriptions.Item>
                  
              <Descriptions.Item label="确认部门">
                {confirmationDetail ? confirmationDetail.problemFlowNodeRows[4].confirmDept : ''}
              </Descriptions.Item>

            </Descriptions>
          </Panel>
        </Collapse>
        )
      }
    </>
  );
}
export default Operatorconfirmades;
