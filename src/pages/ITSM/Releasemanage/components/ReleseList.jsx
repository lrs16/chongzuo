import React, { useState, useEffect } from 'react';
import { Input, Divider, Table, Row, Col, Button } from 'antd';
import { classifyList } from '../services/api';

const InputGroup = Input.Group;

function getQueryVariable(variable) {
  const query = window.location.search.substring(1);
  const vars = query.split("&");
  for (let i = 0; i < vars.length; i += 1) {
    const pair = vars[i].split("=");
    if (pair[0] === variable) { return pair[1]; }
  }
  return (false);
}

function ReleseList(props) {
  const { dataSource, listmsg } = props;
  const [classify, setClassify] = useState('');
  useEffect(() => {
    if (dataSource) {
      classifyList(getQueryVariable("taskId")).then(res => {
        if (res.code === 200) {
          setClassify(res.data.classifyList.dutyUnitListMsg);
        }
      })
    }
  }, [dataSource])

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
      width: 100,
    },
    {
      title: '开发人员',
      dataIndex: 'developer',
      key: 'developer',
      width: 100,
    },
    // {
    //   title: '操作人员',
    //   dataIndex: 'operator',
    //   key: 'operator',
    //   align: 'center',
    //   width: 100,
    // },
  ];
  return (
    <>
      <Row>
        <Col span={20}>
          <span >{listmsg ? Object.values(listmsg)[0] : Object.values(classify)[0]}</span>
        </Col>
        <Col span={4} style={{ textAlign: 'right' }}><Button type='primary' >导出清单</Button></Col>
      </Row>

      <Table
        columns={columns}
        bordered
        size='middle'
        dataSource={dataSource}
        pagination={false}
        rowKey={(_, index) => index.toString()}
        style={{ marginTop: 12 }}
      />
    </>
  );
}

export default ReleseList;