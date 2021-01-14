import React from 'react';
import {  Descriptions, Collapse } from 'antd';

const { Panel } = Collapse;
function Businessaudes(props) {
  const {  reviesDetail,loading } = props;
  console.log('reviesDetail: ', reviesDetail);
  return (
    <>
    { loading === false && (
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
            {reviesDetail ? reviesDetail.problemFlowNodeRows[2].checkResult : ''}
            </Descriptions.Item>
          </Descriptions>

          <Descriptions>
            <Descriptions.Item label="审核时间">
              {reviesDetail ? reviesDetail.problemFlowNodeRows[2].checkTime : ''}
            </Descriptions.Item>
          </Descriptions>

          <Descriptions>
            <Descriptions.Item label="审核意见">
              {reviesDetail ? reviesDetail.problemFlowNodeRows[2].checkOpinion : ''}
            </Descriptions.Item>
          </Descriptions>

          <Descriptions>
            <Descriptions.Item label="上传附件">
            <span style={{ color: 'blue', textDecoration: 'underline' }}>000</span>
            </Descriptions.Item>
          </Descriptions>

          <Descriptions>
            <Descriptions.Item label="审核人">
                {reviesDetail ? reviesDetail.problemFlowNodeRows[2].checkUser : ''}
              </Descriptions.Item>

              <Descriptions.Item label="审核单位">
                {reviesDetail ? reviesDetail.problemFlowNodeRows[2].checkUnit : ''}
              </Descriptions.Item>

              <Descriptions.Item label="审核部门">
                {reviesDetail ? reviesDetail.problemFlowNodeRows[2].checkDept : ''}
              </Descriptions.Item>
          </Descriptions>
           
        </Panel>
      </Collapse>
      ) }
     
    </>
  );
}
export default Businessaudes;
