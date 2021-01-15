import React from 'react';
import {  Descriptions, Collapse,Radio } from 'antd';

const { Panel } = Collapse;

function Registrationconfirmdes(props) {
  const { confirmationDetail, loading } = props;
  const { problemFlowNodeRows } = confirmationDetail;
  let value;
  if(problemFlowNodeRows) {
    value = problemFlowNodeRows[6].confirmResult;
    console.log('value: ', value);
  }

  return (
    <>
      {
        loading === false && problemFlowNodeRows && (
          <Collapse 
          expandIconPosition="right" 
          style={{ backgroundColor: 'white', marginTop: '20px' }}
        >
          <Panel header="问题登记人员确认">
            <Descriptions>
              <Descriptions.Item label="确认结果">
                <Radio.Group value={value} disabled>
                <Radio value='1'>通过</Radio>
                <Radio value='0'>不通过</Radio>
              </Radio.Group>
              </Descriptions.Item>
            </Descriptions>

            <Descriptions>
              <Descriptions.Item label="确认时间">
                {confirmationDetail ? confirmationDetail.problemFlowNodeRows[6].confirmTime : ''}
              </Descriptions.Item>
            </Descriptions>

            <Descriptions>
              <Descriptions.Item label="确认意见">
              {confirmationDetail ? confirmationDetail.problemFlowNodeRows[6].confirmTime : ''}
              </Descriptions.Item>
            </Descriptions>
  
            <Descriptions>
              <Descriptions.Item label="上传附件">
                <span style={{ color: 'blue', textDecoration: 'underline' }}>
                {confirmationDetail ? confirmationDetail.problemFlowNodeRows[6].handleAttachIds : ''}
                </span>
              </Descriptions.Item>
            </Descriptions>

            <Descriptions>
              <Descriptions.Item label="确认人">
                {confirmationDetail ? confirmationDetail.problemFlowNodeRows[6].confirmUser : ''}
              </Descriptions.Item>

              <Descriptions.Item label="确认单位">
                {confirmationDetail ? confirmationDetail.problemFlowNodeRows[6].confirmUnit : ''}
              </Descriptions.Item>
                  
              <Descriptions.Item label="确认部门">
                {confirmationDetail ? confirmationDetail.problemFlowNodeRows[6].confirmDept : ''}
              </Descriptions.Item>

            </Descriptions>
          </Panel>
        </Collapse>
        )
      }
    </>
  );
}
export default Registrationconfirmdes;
