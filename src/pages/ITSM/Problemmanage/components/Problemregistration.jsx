import React from 'react';
import { Descriptions, Collapse } from 'antd';
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

   const fileDown = (id) => {
    dispatch({
      type:'problemmanage/filedownload',
      payload:{id}
    })
  } 
  return (
    <>
      {statue !== 5 && loading === false && (
        <Collapse
          expandIconPosition="right"
          defaultActiveKey={['1']}
          style={{ backgroundColor: 'white', marginTop: '20px' }}
        >
          <Panel header="问题登记" key="1">
            <Descriptions>
              <Descriptions.Item label="问题编号">
                {main ? main.no : ''}
              </Descriptions.Item>
              <Descriptions.Item label="问题来源">
                {main ? main.source : ''}
              </Descriptions.Item>
              <Descriptions.Item label="问题分类">
                {main ? main.type : ''}
              </Descriptions.Item>
              <Descriptions.Item label="紧急度">
                {main ? main.emergent : ''}
              </Descriptions.Item>
              <Descriptions.Item label="影响度">
                {main ? main.effect : ''}
              </Descriptions.Item>
              <Descriptions.Item label="优先级">
                {main ? main.priority : ''}
              </Descriptions.Item>
              <Descriptions.Item label="填报人单位">
                {problemFlowNodeRows ? problemFlowNodeRows[0].registerUnit : ''}
              </Descriptions.Item>
              <Descriptions.Item label="填报人部门">
                {problemFlowNodeRows ? problemFlowNodeRows[0].registerDept : ''}
              </Descriptions.Item>
              <Descriptions.Item label="填报人">
                {problemFlowNodeRows ? problemFlowNodeRows[0].registerUser : ''}
              </Descriptions.Item>
              <Descriptions.Item label="联系电话">
                {problemFlowNodeRows ? problemFlowNodeRows[0].phone : ''}
              </Descriptions.Item>
              <Descriptions.Item label="登记时间">
                {problemFlowNodeRows ? problemFlowNodeRows[0].registerTime : ''}
              </Descriptions.Item>
              <Descriptions.Item label="建单时间">
                {registrationDetail ? registrationDetail.now : ''}
              </Descriptions.Item>
            </Descriptions>
            <Descriptions>
              <Descriptions.Item label="问题标题">
                {main ? main.title : ''}
              </Descriptions.Item>
            </Descriptions>
            <Descriptions>
              <Descriptions.Item label="问题描述">
                {main ? main.content : ''}
              </Descriptions.Item>
            </Descriptions>

            <Descriptions>
              <Descriptions.Item label="上传附件">
                <span style={{ color: 'blue', textDecoration: 'underline' }} >
                  ff           
               </span>
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
