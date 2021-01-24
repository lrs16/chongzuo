import React from 'react';
import { connect } from 'dva';
import {  
   Descriptions,
   Collapse,
   Radio  } from 'antd';
import Downloadfile from '@/components/SysUpload/Downloadfile';


const { Panel } = Collapse;

// let id;
function Problemreview(props) {
  const {  
    dispatch,
    reviesDetail,
    loading } = props;

    // if(reviesDetail) {
    //   id =  reviesDetail.problemFlowNodeRows[1].checkAttachIds;
    // }
    const { problemFlowNodeRows } = reviesDetail;
    let value;
    if(problemFlowNodeRows) {
      value = problemFlowNodeRows[1].checkResult;
      console.log('value: ', value);
    }

    const fileDown = (id) => {
      dispatch({
        type:'problemmanage/filedownload',
        payload:{id}
      })
    } 
  return (
    <>
    { loading === false && problemFlowNodeRows && (
      <Collapse 
        expandIconPosition="right" 
        style={{ backgroundColor: 'white', marginTop: '20px' }}
        >
        <Panel 
          header="系统运维商审核" 
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
                <span style={{ color: 'blue', textDecoration: 'underline' }} >
                {problemFlowNodeRows[1].checkAttachments !== null && <Downloadfile files={problemFlowNodeRows[1].checkAttachments} />}          
               </span>
              </Descriptions.Item>
            </Descriptions>

          <Descriptions>
            <Descriptions.Item label="审核人">
                {reviesDetail ? reviesDetail.problemFlowNodeRows[1].checkUser : ''}
              </Descriptions.Item>

              <Descriptions.Item label="审核单位">
                {reviesDetail ? reviesDetail.problemFlowNodeRows[1].checkUnit : ''}
              </Descriptions.Item>

              <Descriptions.Item label="审核部门">
                {reviesDetail ? reviesDetail.problemFlowNodeRows[1].checkDept : ''}
              </Descriptions.Item>
          </Descriptions>
           
        </Panel>
      </Collapse>
      ) }
     
    </>
  );
}
export default (
  connect(({ problemmanage, loading }) => ({
    
    loading: loading.models.problemmanage,
  }))
)
(Problemreview);
