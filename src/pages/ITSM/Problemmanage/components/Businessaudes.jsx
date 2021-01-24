import React from 'react';
import {  Descriptions, Collapse, Radio } from 'antd';
import Downloadfile from '@/components/SysUpload/Downloadfile';

const { Panel } = Collapse;
function Businessaudes(props) {
  const {  reviesDetail,loading } = props;
  const { problemFlowNodeRows } = reviesDetail;
  let value;
  if(problemFlowNodeRows) {
    value = problemFlowNodeRows[2].checkResult;
    console.log('value: ', value);
  }
  return (
    <>
    { loading === false && problemFlowNodeRows && (
      <Collapse 
        expandIconPosition="right" 
        style={{ backgroundColor: 'white', marginTop: '20px' }}
        >
        <Panel 
          header="自动化科审核" 
          style={{ marginBottom: '0px', paddingBottom: '0px' }}
        >
          <Descriptions>
            <Descriptions.Item label="审核结果">
              <Radio.Group value={value} disabled>
                <Radio value='1'>通过</Radio>
                <Radio value='0'>不通过</Radio>
              </Radio.Group>
            </Descriptions.Item>
          </Descriptions>

          <Descriptions>
            <Descriptions.Item label="审核时间">
              {problemFlowNodeRows ? problemFlowNodeRows[2].checkTime : ''}
            </Descriptions.Item>
          </Descriptions>

          <Descriptions>
            <Descriptions.Item label="审核意见">
              {problemFlowNodeRows ? problemFlowNodeRows[2].checkOpinion : ''}
            </Descriptions.Item>
          </Descriptions>

          <Descriptions>
              <Descriptions.Item label="上传附件">
                <span style={{ color: 'blue', textDecoration: 'underline' }} >
                {problemFlowNodeRows[2].checkAttachments !== null && <Downloadfile files={problemFlowNodeRows[2].checkAttachments} />}          
               </span>
              </Descriptions.Item>
            </Descriptions>

          <Descriptions>
            <Descriptions.Item label="审核人">
                {problemFlowNodeRows ? problemFlowNodeRows[2].checkUser : ''}
              </Descriptions.Item>

              <Descriptions.Item label="审核单位">
                {problemFlowNodeRows ? problemFlowNodeRows[2].checkUnit : ''}
              </Descriptions.Item>

              <Descriptions.Item label="审核部门">
                {problemFlowNodeRows ? problemFlowNodeRows[2].checkDept : ''}
              </Descriptions.Item>
          </Descriptions>
           
        </Panel>
      </Collapse>
      ) }
     
    </>
  );
}
export default Businessaudes;
