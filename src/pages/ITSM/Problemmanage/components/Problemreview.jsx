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
    info,
    main,
    loading } = props;

    // if(reviesDetail) {
    //   id =  info.checkAttachIds;
    // }
    // const { problemFlowNodeRows } = reviesDetail;
    let value;
    if(info) {
      value = info.checkResult;
    }

    const fileDown = (id) => {
      dispatch({
        type:'problemmanage/filedownload',
        payload:{id}
      })
    } 
  return (
   
      <div>
         <>
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
              {info.checkTime}
            </Descriptions.Item>
          </Descriptions>

          <Descriptions>
            <Descriptions.Item label="审核意见">
              {info.checkOpinion}
            </Descriptions.Item>
          </Descriptions>

      
          <Descriptions>
              <Descriptions.Item label="上传附件">
                <span style={{ color: 'blue', textDecoration: 'underline' }} >
                {info.checkAttachments !== null && <Downloadfile files={info.checkAttachments} />}          
               </span>
              </Descriptions.Item>
            </Descriptions>

          <Descriptions>
            <Descriptions.Item label="审核人">
                {info.checkUser}
              </Descriptions.Item>

              <Descriptions.Item label="审核单位">
                {info.checkUnit}
              </Descriptions.Item>

              <Descriptions.Item label="审核部门">
                {info.checkDept}
              </Descriptions.Item>
          </Descriptions>
          </>
       </div>
  
  );
}
export default (
  connect(({ problemmanage, loading }) => ({
    
    loading: loading.models.problemmanage,
  }))
)
(Problemreview);
