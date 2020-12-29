import React, { useState } from 'react';
import { Card, Descriptions, Menu, Divider, Collapse } from 'antd';

const { SubMenu } = Menu;
const { Panel } = Collapse;

function Problemclosed(props) {
  const { currentProcess, closeInfo, statue, currentObj } = props;

  return (
    <>
      {expand === '问题关闭' && currentObj === '问题查询' && statue >= state && (
        <Collapse expandIconPosition="right" style={{ backgroundColor: 'white' }}>
          <Panel header="问题关闭" key="1">
            <Descriptions>
              <Descriptions.Item label="关闭单位">{closeInfo.closeUnit || ''}</Descriptions.Item>
              <Descriptions.Item label="关闭部门">
                {closeInfo.confirmationDepartment || ''}
              </Descriptions.Item>
              <Descriptions.Item label="关闭人">{closeInfo.confirmer || ''}</Descriptions.Item>
            </Descriptions>

            <Descriptions>
              <Descriptions.Item label="问题总结">
                {closeInfo.confirmOpinion || ''}
              </Descriptions.Item>
            </Descriptions>

            <Descriptions>
              <Descriptions.Item label="上传附件">
                <span style={{ color: 'blue', textDecoration: 'underline' }}>
                  {closeInfo.confirmOpinion || ''}
                </span>
              </Descriptions.Item>
            </Descriptions>
          </Panel>
        </Collapse>
      )}
    </>
  );
}
export default Problemclosed;
