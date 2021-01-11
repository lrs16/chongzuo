import React from 'react';
import { Descriptions, Collapse } from 'antd';

const { Panel } = Collapse;

function Problemregistration(props) {
  const { 
    registrationDetail,
    statue,
    problemFlowNodeRows,
    main,
    querySign,
    loading
   } = props;

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
                {registrationDetail ? registrationDetail.main.no : ''}
              </Descriptions.Item>
              <Descriptions.Item label="问题来源">
                {registrationDetail ? registrationDetail.main.source : ''}
              </Descriptions.Item>
              <Descriptions.Item label="问题分类">
                {registrationDetail ? registrationDetail.main.type : ''}
              </Descriptions.Item>
              <Descriptions.Item label="紧急度">
                {registrationDetail ? registrationDetail.main.emergent : ''}
              </Descriptions.Item>
              <Descriptions.Item label="影响度">
                {registrationDetail ? registrationDetail.main.effect : ''}
              </Descriptions.Item>
              <Descriptions.Item label="优先级">
                {registrationDetail ? registrationDetail.main.priority : ''}
              </Descriptions.Item>
              <Descriptions.Item label="填报人单位">
                {registrationDetail ? registrationDetail.problemFlowNodeRows[0].registerUnit : ''}
              </Descriptions.Item>
              <Descriptions.Item label="填报人部门">
                {registrationDetail ? registrationDetail.problemFlowNodeRows[0].registerDept : ''}
              </Descriptions.Item>
              <Descriptions.Item label="填报人">
                {registrationDetail ? registrationDetail.problemFlowNodeRows[0].registerUser : ''}
              </Descriptions.Item>
              <Descriptions.Item label="联系电话">
                {registrationDetail ? registrationDetail.problemFlowNodeRows[0].phone : ''}
              </Descriptions.Item>
              <Descriptions.Item label="登记时间">
                {registrationDetail ? registrationDetail.problemFlowNodeRows[0].registerTime : ''}
              </Descriptions.Item>
              <Descriptions.Item label="建单时间">
                {registrationDetail ? registrationDetail.now : ''}
              </Descriptions.Item>
            </Descriptions>
            <Descriptions>
              <Descriptions.Item label="问题标题">
                {registrationDetail ? registrationDetail.main.title : ''}
              </Descriptions.Item>
            </Descriptions>
            <Descriptions>
              <Descriptions.Item label="问题描述">
                {registrationDetail ? registrationDetail.main.content : ''}
              </Descriptions.Item>
            </Descriptions>

            <Descriptions>
              <Descriptions.Item label="上传附件">
                <span style={{ color: 'blue', textDecoration: 'underline' }}>yy</span>
              </Descriptions.Item>
            </Descriptions>
          </Panel>
        </Collapse>
      )}

      {querySign !=='' &&  loading === false && statue === 5 && (
        <Collapse
          expandIconPosition="right"
          defaultActiveKey={['1']}
          style={{ backgroundColor: 'white', paddingLeft: '0px' }}
        >
          <Panel header="问题登记" key="1" style={{ marginBottom: '0px', paddingBottom: '0px' }}>
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
                {problemFlowNodeRows ? problemFlowNodeRows[0].addTime : ''}
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
                <span style={{ color: 'blue', textDecoration: 'underline' }}>yy</span>
              </Descriptions.Item>
            </Descriptions>
          </Panel>
        </Collapse>
      )}
    </>
  );
}
export default Problemregistration;
