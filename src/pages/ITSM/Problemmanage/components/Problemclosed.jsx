import React from 'react';
import { Descriptions, Collapse } from 'antd';

const { Panel } = Collapse;

function Problemclosed(props) {
  const { closeInfo } = props;

  return (
    <>
      <Collapse
        expandIconPosition="right"
        style={{ backgroundColor: 'white'}}
      >
        <Panel header="问题关闭">
          <Descriptions>
            <Descriptions.Item label="关闭意见">
              {closeInfo ? closeInfo.problemFlowNodeRows[4].closeContent : ''}
            </Descriptions.Item>
          </Descriptions>

          <Descriptions>
            <Descriptions.Item label="上传附件">
              <span style={{ color: 'blue', textDecoration: 'underline' }}>
                {closeInfo.confirmOpinion || ''}
              </span>
            </Descriptions.Item>
          </Descriptions>

          <Descriptions>
            <Descriptions.Item label="关闭单位">{closeInfo ? closeInfo.problemFlowNodeRows[4].closeUnit : ''}</Descriptions.Item>
            <Descriptions.Item label="关闭部门">
              {closeInfo ? closeInfo.problemFlowNodeRows[4].closeDept : ''}
            </Descriptions.Item>
            <Descriptions.Item label="关闭人">{closeInfo ? closeInfo.problemFlowNodeRows[4].closeUser : ''}</Descriptions.Item>
          </Descriptions>
        </Panel>
      </Collapse>
    </>
  );
}
export default Problemclosed;
