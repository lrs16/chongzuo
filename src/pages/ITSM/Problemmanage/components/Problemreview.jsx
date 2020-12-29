import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Menu, Collapse } from 'antd';

const { Panel } = Collapse;
function Problemreview(props) {
  const { reviewInfo, currentProcess, statue, reviesDetail } = props;

  return (
    <>
      {/* { */}
      {/* expand !== '问题审核' && statue >= state && ( */}
      <Collapse expandIconPosition="right" style={{ backgroundColor: 'white', marginTop: '20px' }}>
        <Panel header="问题审核" key="2" style={{ marginBottom: '0px', paddingBottom: '0px' }}>
          <Descriptions>
            <Descriptions.Item label="审核单位">
              {reviesDetail
                ? reviesDetail.problemFlowNodeRows[1]
                  ? reviesDetail.problemFlowNodeRows[1].checkUnit
                  : ''
                : ''}
            </Descriptions.Item>
            <Descriptions.Item label="审核部门">
              {reviesDetail ? reviesDetail.problemFlowNodeRows[1].checkDept : ''}
            </Descriptions.Item>
            <Descriptions.Item label="审核人">
              {reviesDetail ? reviesDetail.problemFlowNodeRows[1].checkUser : ''}
            </Descriptions.Item>
          </Descriptions>

          <Descriptions>
            <Descriptions.Item label="审核时间">
              {reviesDetail ? reviesDetail.problemFlowNodeRows[1].checkTime : ''}
            </Descriptions.Item>
          </Descriptions>

          <Descriptions>
            <Descriptions.Item label="审核意见">
              {reviesDetail ? reviesDetail.problemFlowNodeRows[1].checkOpinion : ''}
            </Descriptions.Item>
          </Descriptions>
          <Descriptions>
            <Descriptions.Item label="上传附件">
              <span style={{ color: 'blue', textDecoration: 'underline' }}>000</span>
            </Descriptions.Item>
          </Descriptions>
        </Panel>
      </Collapse>
      {/* ) */}
      {/* } */}
      {/* {
     expand === '问题审核' && currentObj ==='问题查询' && statue >= state && (
      <Collapse expandIconPosition='right' style={{backgroundColor:'white',paddingLeft:'0px'}}>
        <Panel  header="问题审核" key="2" style={{marginBottom:'0px',paddingBottom:'0px'}}>
        <Descriptions>
                    <Descriptions.Item label='审核单位'>{reviewInfo.auditUnit || ''}</Descriptions.Item>
                    <Descriptions.Item label='审核部门'>{reviewInfo.auditDepartment || ''}</Descriptions.Item>
                    <Descriptions.Item label='审核人'>{reviewInfo.Reviewer || ''}</Descriptions.Item>
                   
                  </Descriptions>
                
                <Descriptions>
                  <Descriptions.Item label='审核时间'>{}</Descriptions.Item>
                </Descriptions>

                <Descriptions>
                  <Descriptions.Item label='审核意见'>{reviewInfo.auditOpinion || ''}</Descriptions.Item>
                </Descriptions>
                <Descriptions>
                  <Descriptions.Item label='上传附件'><span style={{color:'blue',textDecoration:'underline'}}>{reviewInfo.auditOpinion || ''}</span></Descriptions.Item>
                </Descriptions>
        </Panel>
      </Collapse>
     )
   } */}
    </>
  );
}
export default Problemreview;
