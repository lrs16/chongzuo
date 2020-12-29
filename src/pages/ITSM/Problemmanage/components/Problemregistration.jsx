import React, { useEffect, useState } from 'react';
import { Descriptions, Card, Menu, Steps, Collapse, Timeline } from 'antd';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const { SubMenu } = Menu;
const { Panel } = Collapse;
const { Step } = Steps;

function Problemregistration(props) {
  const { currentProcess, registrationDetail, statue, queryStatue } = props;

  return (
    <>
      {statue !== 5 && (
        <Collapse
          expandIconPosition="right"
          style={{ backgroundColor: 'white', marginTop: '20px' }}
        >
          <Panel header="问题登记" key="1" style={{ marginBottom: '0px', paddingBottom: '0px' }}>
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

      {statue === 5 && (
        <Collapse
          expandIconPosition="right"
          style={{ backgroundColor: 'white', paddingLeft: '0px' }}
        >
          <Panel header="问题登记" key="1" style={{ marginBottom: '0px', paddingBottom: '0px' }}>
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
                {registrationDetail ? registrationDetail.register.registerUnit : ''}
              </Descriptions.Item>
              <Descriptions.Item label="填报人部门">
                {registrationDetail ? registrationDetail.register.registerDept : ''}
              </Descriptions.Item>
              <Descriptions.Item label="填报人">
                {registrationDetail ? registrationDetail.register.registerUser : ''}
              </Descriptions.Item>
              <Descriptions.Item label="联系电话">
                {registrationDetail ? registrationDetail.register.phone : ''}
              </Descriptions.Item>
              <Descriptions.Item label="登记时间">
                {registrationDetail ? registrationDetail.register.registerTime : ''}
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
    </>
  );
}
export default Problemregistration;
