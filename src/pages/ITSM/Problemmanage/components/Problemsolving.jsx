import React from 'react';
import { Descriptions, Collapse } from 'antd';

const { Panel } = Collapse;

function Problemsolving(props) {
  const { solvingDetail, statue,loading } = props;

  return (
    <>
      { loading === false && (
        <Collapse 
          expandIconPosition="right" 
          style={{ backgroundColor: 'white', marginTop: '20px' }}
          >
          <Panel header="系统开发商处理" key={statue} style={{ marginBottom: '0px', paddingBottom: '0px' }}>
            <Descriptions>
              <Descriptions.Item label="接单时间">
                {solvingDetail ? solvingDetail.problemFlowNodeRows[3].addTime : ''}
              </Descriptions.Item>

              <Descriptions.Item label="处理完成时间">
                {solvingDetail ? solvingDetail.problemFlowNodeRows[3].addTime : ''}
              </Descriptions.Item>

              <Descriptions.Item label="处理结果">
                {solvingDetail ? solvingDetail.problemFlowNodeRows[3].handleResult : ''}
              </Descriptions.Item>
            </Descriptions>

              <Descriptions>
                <Descriptions.Item label="解决方案">
                  {solvingDetail ? solvingDetail.problemFlowNodeRows[3].handleTime : ''}
                </Descriptions.Item>
              </Descriptions>

              <Descriptions>
                <Descriptions.Item label="上传附件">
                  <span style={{ color: 'blue', textDecoration: 'underline' }}>11</span>666
                </Descriptions.Item>
              </Descriptions>

              <Descriptions>
                <Descriptions.Item label="处理人">
                  {solvingDetail ? solvingDetail.problemFlowNodeRows[3].handler : ''}
                </Descriptions.Item>
                <Descriptions.Item label="处理单位">
                  {solvingDetail ? solvingDetail.problemFlowNodeRows[3].handleUnit : ''}
                </Descriptions.Item>
                <Descriptions.Item label="处理部门">
                  {solvingDetail ? solvingDetail.problemFlowNodeRows[3].handleDept : ''}
                </Descriptions.Item>
              </Descriptions>

             
           
           
        
          
          </Panel>
          </Collapse>
      )}
     
      {/* { statue >= 69 && querySign && (
         <Collapse 
         expandIconPosition="right" 
         style={{ backgroundColor: 'white', marginTop: '20px' }}
         defaultActiveKey={['49']}
         >
         <Panel header="问题处理" key={statue} style={{ marginBottom: '0px', paddingBottom: '0px' }}>
           <Descriptions>
             <Descriptions.Item label="处理单位">
               {solvingDetail ? solvingDetail.problemFlowNodeRows[3].handleUnit : ''}
             </Descriptions.Item>
             <Descriptions.Item label="处理部门">
               {solvingDetail ? solvingDetail.problemFlowNodeRows[3].handleDept : ''}
             </Descriptions.Item>
             <Descriptions.Item label="处理人">
               {solvingDetail ? solvingDetail.problemFlowNodeRows[3].handler : ''}
             </Descriptions.Item>
             <Descriptions.Item label="接单时间">
               {solvingDetail ? solvingDetail.problemFlowNodeRows[3].addTime : ''}
             </Descriptions.Item>
             <Descriptions.Item label="处理时间">
               {solvingDetail ? solvingDetail.problemFlowNodeRows[3].handleTime : ''}
             </Descriptions.Item>
             <Descriptions.Item label="处理结果">
               {solvingDetail ? solvingDetail.problemFlowNodeRows[3].handleResult : ''}
             </Descriptions.Item>
           </Descriptions>
           <Descriptions>
             <Descriptions.Item label="解决方案">
               {solvingDetail ? solvingDetail.problemFlowNodeRows[3].handleTime : ''}
             </Descriptions.Item>
           </Descriptions>
           <Descriptions>
             <Descriptions.Item label="上传附件">
               <span style={{ color: 'blue', textDecoration: 'underline' }}>11</span>666
             </Descriptions.Item>
           </Descriptions>
         </Panel>
       </Collapse> 
      )
      } */}
    </>
  );
}
export default Problemsolving;
