import React from 'react';
import { Row, Col, Form, Input, Alert, DatePicker, Select, Radio, Divider } from 'antd';

const { TextArea } = Input;
const { Option } = Select;
const InputGroup = Input.Group;
const RadioGroup = Radio.Group;

function ReleseList(props) {
  const columns = [
    {
      title: '序号',
      dataIndex: 'key',
      key: 'key',
      width: 60,
      align: 'center',
      render: (text, record, index) => {
        return <>{`${index + 1}`}</>;
      },
    },
    {
      title: '功能类型',
      dataIndex: 'abilityType',
      key: 'abilityType',
      width: 150,
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
              <span style={{ width: 200 }}>{record.testMenu}</span>
            </InputGroup>
            <Divider type='horizontal' style={{ margin: '6px 0' }} />
            <InputGroup compact>
              <span style={{ width: 70, textAlign: 'right' }}>预期效果：</span>
              <span style={{ width: 200 }}>{record.testResult}</span>
            </InputGroup>
            <Divider type='horizontal' style={{ margin: '6px 0' }} />
            <InputGroup compact>
              <span style={{ width: 70, textAlign: 'right' }}>验证步骤：</span>
              <span style={{ width: 200 }}>{record.testStep}</span>
            </InputGroup>
          </>
        );
      }
    },
    {
      title: '是否通过',
      dataIndex: 'passTest',
      key: 'passTest',
      align: 'center',
      width: 100,
    },
    {
      title: '开发人员',
      dataIndex: 'developer',
      key: 'developer',
      width: 100,
    },
    {
      title: '操作人员',
      dataIndex: 'operator',
      key: 'operator',
      align: 'center',
      width: 100,
    },
  ];
  return (
    <div>
      111
    </div>
  );
}

export default ReleseList;