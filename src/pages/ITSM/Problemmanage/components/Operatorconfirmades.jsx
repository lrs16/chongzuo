import React from 'react';
import {  Descriptions, Collapse,Radio } from 'antd';
import Downloadfile from '@/components/SysUpload/Downloadfile';

const { Panel } = Collapse;

function Operatorconfirmades(props) {
  const { confirmationDetail, loading } = props;
  const { problemFlowNodeRows } = confirmationDetail;
  let value;
    if(problemFlowNodeRows) {
      value = problemFlowNodeRows[4].confirmResult;
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
          <Panel header="系统运维商确认">
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
                <span style={{ color: 'blue', textDecoration: 'underline' }} >
                {problemFlowNodeRows[4].confirmAttachments !== null && <Downloadfile files={problemFlowNodeRows[4].confirmAttachments} />}          
               </span>
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
