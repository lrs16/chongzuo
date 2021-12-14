import React from 'react';
import { Input, Divider } from 'antd';

const InputGroup = Input.Group;

export const columns = [
  {
    title: '发布编号',
    dataIndex: 'releaseNo',
    key: 'releaseNo',
    sorter: (a, b) => a.releaseNo.localeCompare(b.releaseNo),
  },
  {
    title: '发布类型',
    dataIndex: 'releaseType',
    key: 'releaseType',
    sorter: (a, b) => a.releaseType.localeCompare(b.releaseType),
  },
  {
    title: '责任单位',
    dataIndex: 'dutyUnit',
    key: 'dutyUnit',
    sorter: (a, b) => a.dutyUnit.localeCompare(b.dutyUnit),
  },
  {
    title: '出厂测试登记人',
    dataIndex: 'registerUser',
    key: 'registerUser',
    sorter: (a, b) => a.registerUser.localeCompare(b.registerUser),
  },
  {
    title: '发送人',
    dataIndex: 'sender',
    key: 'sender',
    sorter: (a, b) => a.sender.localeCompare(b.sender),
  },
  {
    title: '发送时间',
    dataIndex: 'sendTime',
    key: 'sendTime',
    sorter: (a, b) => a.sendTime.localeCompare(b.sendTime),
  },
];
export const columnstask = [
  {
    title: '发布编号',
    dataIndex: 'releaseNo',
    key: 'releaseNo',
    sorter: (a, b) => a.releaseNo.localeCompare(b.releaseNo),
  },
  {
    title: '上一环节处理人',
    dataIndex: 'prevAssignee',
    key: 'prevAssignee',
  },
  {
    title: '当前环节处理人',
    dataIndex: 'assignee',
    key: 'assignee',
  },
  {
    title: '超时环节',
    dataIndex: 'taskName',
    key: 'taskName',
  },
  {
    title: '超时时间',
    dataIndex: 'timeoutTime',
    key: 'timeoutTime',
  },
  {
    title: '超时原因',
    dataIndex: 'timeoutReason',
    key: 'timeoutReason',
  },
];

export const columnrelease = [
  {
    title: '发布编号',
    dataIndex: 'releaseNo',
    key: 'releaseNo',
    sorter: (a, b) => a.releaseNo.localeCompare(b.releaseNo),
  },
  {
    title: '功能类型',
    dataIndex: 'abilityType',
    key: 'abilityType',
    width: 120,
  },
  {
    title: '模块',
    dataIndex: 'module',
    key: 'module',
    width: 120,
  },
  {
    title: '功能名称',
    dataIndex: 'appName',
    key: 'appName',
    width: 150,
  },
  {
    title: '问题类型',
    dataIndex: 'problemType',
    key: 'problemType',
    width: 150,
  },
  {
    title: '测试内容及预期效果',
    dataIndex: 't5',
    key: 't5',
    width: 300,
    render: (text, record) => {
      return (
        <>
          <InputGroup compact>
            <span style={{ width: 70, textAlign: 'right' }}>功能菜单：</span>
            <span style={{ width: 210 }}>{record.testMenu}</span>
          </InputGroup>
          <Divider type='horizontal' style={{ margin: '6px 0' }} />
          <InputGroup compact>
            <span style={{ width: 70, textAlign: 'right' }}>预期效果：</span>
            <span style={{ width: 210 }}>{record.testResult}</span>
          </InputGroup>
          <Divider type='horizontal' style={{ margin: '6px 0' }} />
          <InputGroup compact>
            <span style={{ width: 70, textAlign: 'right' }}>验证步骤：</span>
            <span style={{ width: 210 }}>{record.testStep}</span>
          </InputGroup>
        </>
      );
    }
  },
  {
    title: '状态',
    dataIndex: 'verifyStatus',
    key: 'verifyStatus',
    align: 'center',
    width: 100,
  },
  {
    title: '是否通过',
    dataIndex: 'passTest',
    key: 'passTest',
    align: 'center',
    width: 100,
  },
  {
    title: '业务负责人',
    dataIndex: 'responsible',
    key: 'responsible',
    width: 120,
  },
  {
    title: '开发人员',
    dataIndex: 'developer',
    key: 'developer',
    width: 100,
  },
  {
    title: '操作人',
    dataIndex: 'operator',
    key: 'operator',
    align: 'center',
    width: 100,
  },
];
