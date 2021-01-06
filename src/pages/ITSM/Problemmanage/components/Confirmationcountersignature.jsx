import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Collapse } from 'antd';

const { Panel } = Collapse;

function Confirmationcountersignature(props) {
  const { 
    countersignatureDetail, 
    statue
   } = props;
   const { problemFlowNodeRows } = countersignatureDetail;
  return (
    <>
      <Collapse 
        expandIconPosition="right" 
        style={{ backgroundColor: 'white', marginTop: '20px' }}
        defaultActiveKey={['65']}
      >
        <Panel header="确认会签" key={statue}>
          <Descriptions>
            <Descriptions.Item label="会签单位">
              {problemFlowNodeRows ? problemFlowNodeRows[4].confirmUnit : ''}
            </Descriptions.Item>
            <Descriptions.Item label="会签部门">
              {problemFlowNodeRows ? problemFlowNodeRows[4].confirmDept : ''}
            </Descriptions.Item>
            <Descriptions.Item label="会签人">
              {problemFlowNodeRows ? problemFlowNodeRows[4].confirmUser : ''}
            </Descriptions.Item>
          </Descriptions>

          <Descriptions>
            <Descriptions.Item label="会签意见">
              {problemFlowNodeRows ? problemFlowNodeRows[4].confirmContent : ''}
            </Descriptions.Item>
          </Descriptions>

          <Descriptions>
            <Descriptions.Item label="上传附件">
              <span style={{ color: 'blue', textDecoration: 'underline' }}>55</span>
            </Descriptions.Item>
          </Descriptions>
        </Panel>
      </Collapse>
      {/* ) */}
      {/* } */}
      {/* {
      expand === '确认会签' && currentObj ==='问题查询' && statue >= state && (
        <Collapse expandIconPosition='right' style={{backgroundColor:'white'}}>
          <Panel header="确认会签" key="5">
          <Descriptions >
              <Descriptions.Item label='会签单位'>{counterInfo.confirmationUnit || ''}</Descriptions.Item>
              <Descriptions.Item label='会签部门'>{ counterInfo.confirmationDepartment || ''}</Descriptions.Item>
              <Descriptions.Item label='会签人'>{counterInfo.confirmer || ''}</Descriptions.Item>
              
            </Descriptions>

            <Descriptions>
              <Descriptions.Item label='会签意见'>{counterInfo.confirmOpinion || ''}</Descriptions.Item>
            </Descriptions>

            <Descriptions>
              <Descriptions.Item label='上传附件'><span style={{color:'blue',textDecoration:'underline'}}>{counterInfo.confirmOpinion || ''}</span></Descriptions.Item>
            </Descriptions>
          </Panel>
        </Collapse>
      )
    } */}
    </>
  );
}
export default Confirmationcountersignature;
