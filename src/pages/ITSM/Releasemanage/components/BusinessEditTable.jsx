import React, { useState, useEffect } from 'react';
import { Table, Input, Radio, Divider, Row, Col, Button } from 'antd';
import { releaseListEdit, classifyList } from '../services/api'
import styles from '../index.less';

const { TextArea } = Input;
const InputGroup = Input.Group;
const RadioGroup = Radio.Group;

function getQueryVariable(variable) {
  const query = window.location.search.substring(1);
  const vars = query.split("&");
  for (let i = 0; i < vars.length; i += 1) {
    const pair = vars[i].split("=");
    if (pair[0] === variable) { return pair[1]; }
  }
  return (false);
}

function BusinessEditTable(props) {
  const { title, dataSource, type, ChangeValue, loading, isEdit, listmsg } = props;
  const [data, setData] = useState([]);
  const [classify, setClassify] = useState('');

  useEffect(() => {
    if (dataSource && dataSource.length > 0) {
      const newData = dataSource.map((item, index) => ({
        ...item,
        editable: false,
        key: (index + 1).toString(),
      }));
      setData(newData);
      classifyList(getQueryVariable("taskId")).then(res => {
        if (res.code === 200) {
          setClassify(res.data.classifyList.dutyUnitListMsg);
        }
      })
    };
    if (dataSource && dataSource.length === 0) {
      setData(dataSource);
    };
  }, [dataSource])

  // 获取行
  const getRowByKey = (key, newData) => {
    return (newData || data).filter(item => item.key === key)[0];
  };
  // 更新表单信息
  const handleFieldChange = (e, fieldName, key) => {
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData);
    if (target) {
      target[fieldName] = e;
      setData(newData);
      if (type === '发布实施') {
        ChangeValue(newData);
      } else {
        releaseListEdit(target);
      }

    }
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'key',
      key: 'key',
      width: 50,
      align: 'center',
      // render: (text, record, index) => {
      //   return <>{`${index + 1}`}</>;
      // },
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
      width: 400,
      render: (text, record) => {
        return (
          <>
            <InputGroup compact>
              <span style={{ width: 70, textAlign: 'right' }}>功能菜单：</span>
              <span style={{ width: 310 }}>{record.testMenu}</span>
            </InputGroup>
            <Divider type='horizontal' style={{ margin: '6px 0' }} />
            <InputGroup compact>
              <span style={{ width: 70, textAlign: 'right' }}>预期效果：</span>
              <span style={{ width: 310 }}>{record.testResult}</span>
            </InputGroup>
            <Divider type='horizontal' style={{ margin: '6px 0' }} />
            <InputGroup compact>
              <span style={{ width: 70, textAlign: 'right' }}>验证步骤：</span>
              <span style={{ width: 310 }}>{record.testStep}</span>
            </InputGroup>
          </>
        );
      }
    },
    {
      title: '状态',
      dataIndex: 'verifyStatus',
      key: 'verifyStatus',
      width: 100,
    },
    {
      title: '业务负责人',
      dataIndex: 'responsible',
      key: 'responsible',
      align: 'center',
      width: 120,
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
    {
      title: '是否通过',
      dataIndex: 'passTest',
      key: 'passTest',
      fixed: 'right',
      width: 100,
      render: (text, record) => {
        return (
          <>
            {isEdit ? (
              <RadioGroup value={text || '通过'} onChange={e => handleFieldChange(e.target.value, 'passTest', record.key)}>
                <Radio value='通过'>通过</Radio>
                <Radio value='不通过'>不通过</Radio>
              </RadioGroup>
            ) : <>{text}</>}
          </>
        )
      }
    },
    {
      title: '验证意见',
      dataIndex: 'verifyComment',
      key: 'verifyComment',
      fixed: 'right',
      width: 200,
      render: (text, record) => {
        return (
          <>
            {isEdit ? (
              <div className={text === null && record.passTest === '不通过' ? styles.requiredform : ''}>
                <TextArea
                  value={text}
                  autoSize={{ minRows: 4 }}
                  placeholder="请输入"
                  onChange={e => handleFieldChange(e.target.value, 'verifyComment', record.key)}
                />
              </div >
            ) : (<>{text}</>)}
          </>
        )
      }
    },
  ];
  const practicedone = columns.filter(item => item.key !== 'verifyStatus');

  const sclicecolumns = (arr) => {
    const newarr = arr.slice(0);
    newarr.pop();
    return newarr;
  }
  const practicedonecolumns = sclicecolumns(practicedone);

  return (
    <>
      <h4>
        <span style={{ color: '#f5222d', marginRight: 4, fontWeight: 'normal' }}>*</span>
        {title}
      </h4>
      <Row>
        <Col span={20}>
          {classify && isEdit && (<div>{Object.values(classify)[0]}</div>)}
          {listmsg && (<div>{Object.values(listmsg)[0]}</div>)}
        </Col>
        <Col span={4} style={{ textAlign: 'right' }}><Button type='primary' >导出清单</Button></Col>
      </Row>

      <Table
        columns={type === '发布实施' ? practicedonecolumns : columns}
        dataSource={data}
        bordered
        size='middle'
        rowKey={(_, index) => index.toString()}
        pagination={false}
        scroll={{ x: 1700 }}
        loading={loading}
        style={{ marginTop: 12 }}
      />
    </>
  );
}

export default BusinessEditTable;