import React from 'react';
import { Descriptions, Collapse } from 'antd';
import Downloadfile from '@/components/SysUpload/Downloadfile';
import { connect } from 'dva';

const { Panel } = Collapse;

function Problemregistration(props) {
  const { 
    dispatch,
    registrationDetail,
    statue,
    main,
    querySign,
    loading,
   } = props;
   const { problemFlowNodeRows } = registrationDetail;
 
  return (
    <>
      {statue !== 5 && loading === false && main && problemFlowNodeRows && (
        <Collapse
          expandIconPosition="right"
          defaultActiveKey={['1']}
          style={{ backgroundColor: 'white', marginTop: '20px' }}
        >
          <Panel header="问题登记" key="1">
            <Descriptions>
              <Descriptions.Item label="问题编号">
                { main.no}
              </Descriptions.Item>

              <Descriptions.Item label="登记时间">
                { problemFlowNodeRows[0].registerTime}
              </Descriptions.Item>

              <Descriptions.Item label="发生时间">
                {problemFlowNodeRows[0].registerOccurTime}
              </Descriptions.Item>

              <Descriptions.Item label="问题来源">
                { main.source}
              </Descriptions.Item>

              <Descriptions.Item label="问题分类">
                {main.type}
              </Descriptions.Item>

              <Descriptions.Item label="重要程度">
                {main.emergent}
              </Descriptions.Item>

              <Descriptions.Item label="期待完成时间">
                {problemFlowNodeRows[0].registerExpectTime}
              </Descriptions.Item>

              <Descriptions.Item label="所属项目">
                { problemFlowNodeRows[0].registerProject}
              </Descriptions.Item>

              <Descriptions.Item label="影响范围">
                {registrationDetail.now}
              </Descriptions.Item>
           
            </Descriptions>

            <Descriptions>
             <Descriptions.Item label="联系电话">
                { problemFlowNodeRows[0].registerUserPhone }
              </Descriptions.Item>
            </Descriptions>

            <Descriptions>
              <Descriptions.Item label="问题标题">
                { main.title}
              </Descriptions.Item>
            </Descriptions>

            <Descriptions>
              <Descriptions.Item label="问题描述">
                { main.content}
              </Descriptions.Item>
            </Descriptions>

            <Descriptions>
            <Descriptions.Item label="上传附件">
              <span style={{ color: 'blue', textDecoration: 'underline' }} >
              {problemFlowNodeRows[0].registerAttachments !== null && <Downloadfile files={problemFlowNodeRows[0].registerAttachments} />}          
              </span>
            </Descriptions.Item>
          </Descriptions>

          <Descriptions>
            <Descriptions.Item label="填报人">
              { problemFlowNodeRows[0].registerUser }
            </Descriptions.Item>

            <Descriptions.Item label="填报人单位">
                { problemFlowNodeRows[0].registerUnit }
            </Descriptions.Item>

            <Descriptions.Item label="填报人部门">
                {problemFlowNodeRows[0].registerDept}
              </Descriptions.Item>


          </Descriptions>

     


          </Panel>
        </Collapse>
      )}

    </>
  );
}
export default (
  connect(({ problemmanage, loading }) => ({
    
    loading: loading.models.problemmanage,
  }))
)(Problemregistration);
