import React from 'react';
import { Descriptions, Collapse } from 'antd';

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
        style={{ backgroundColor: 'white'}}
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
    </>
  );
}
export default Confirmationcountersignature;
