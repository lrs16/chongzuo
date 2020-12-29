import React, { useState } from 'react';
import { Card, Descriptions, Menu, Divider, Collapse } from 'antd';

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
      <Collapse expandIconPosition="right" style={{ backgroundColor: 'white', marginTop: '20px' }}>
        <Panel header="问题处理" key="3" style={{ marginBottom: '0px', paddingBottom: '0px' }}>
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
              {solvingDetail ? solvingDetail.problemFlowNodeRows[2].handleTime : ''}
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
      {/* ) */}
      {/* //  } */}

      {/* {
     expand === '问题处理' && currentObj === '问题查询' && statue >= state && (
      <Collapse expandIconPosition='right' style={{backgroundColor:'white',paddingLeft:'0px'}}>
        <Panel header="问题处理" key="3" style={{marginBottom:'0px',paddingBottom:'0px'}}>
          <Descriptions>
            <Descriptions.Item label='处理单位'>{ solvingInfo.processingUnit  || ''}</Descriptions.Item>
            <Descriptions.Item label='处理部门'>{ solvingInfo.processingDepartment  || ''}</Descriptions.Item>
            <Descriptions.Item label='处理人'>{ solvingInfo.handler  || ''}</Descriptions.Item>
            <Descriptions.Item label='接单时间'>{}</Descriptions.Item>
            <Descriptions.Item label='处理时间'>{}</Descriptions.Item>
            <Descriptions.Item label='处理结果'>{solvingInfo.processingResults  || ''}</Descriptions.Item>
          </Descriptions>
            <Descriptions>
              <Descriptions.Item label='解决方案'>{solvingInfo.solution  || ''}</Descriptions.Item>
            </Descriptions>
            <Descriptions>
              <Descriptions.Item label='上传附件'><span style={{color:'blue',textDecoration:'underline'}}>{solvingInfo.solution  || ''}</span></Descriptions.Item>
            </Descriptions>
        </Panel>
      </Collapse>
     )
   } */}
    </>
  );
}
export default Problemsolving;
