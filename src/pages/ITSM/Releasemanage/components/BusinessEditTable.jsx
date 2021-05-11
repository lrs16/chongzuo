import React, { useState, useEffect } from 'react';
import { Table, Input, Radio, Divider, Card, Button, message } from 'antd';
import styles from '../index.less';

const dataSource = [
  {
    key: 1,
    t0: '计划',
    t1: '前台功能/变弄功能',
    t2: 'ITSM',
    t3: 'ITSM',
    t4: '用于创建一个实体或收集信息。需要对输入的数据类型进行校验时。',
    menu: '运维管理->指标统计->终端运维->采集完整率(新)->零点失败列表补招（按钮）、非零点失败列表补招（按钮）。',
    des: '实现按供电单位进行失败列表的曲线批量召测功能。',
    step: '运维管理->指标统计->终端运维->采集完整率->零点失败列表补招、非零点失败列表补招',
    t6: '001',
    t7: '张晓晓',
    t8: sessionStorage.getItem('userName'),
    t9: '已验证',
    opinion: '已验证'
  },
  {
    key: 2,
    t0: '计划',
    t1: '前台功能/变弄功能',
    t2: 'ITSM',
    t3: 'ITSM',
    t4: '用于创建一个实体或收集信息。需要对输入的数据类型进行校验时。',
    menu: '运维管理->指标统计->终端运维->采集完整率(新)->零点失败列表补招（按钮）、非零点失败列表补招（按钮）。',
    des: '实现按供电单位进行失败列表的曲线批量召测功能。',
    step: '运维管理->指标统计->终端运维->采集完整率->零点失败列表补招、非零点失败列表补招',
    t6: '001',
    t7: '张晓晓',
    t8: sessionStorage.getItem('userName'),
    t9: '待验证',
    opinion: ''
  },
]

const { TextArea } = Input;
const InputGroup = Input.Group;
const RadioGroup = Radio.Group;

function BusinessEditTable(props) {
  const { title, titletype } = props;
  const [data, setData] = useState([]);

  useEffect(() => {
    setData([...dataSource])
  }, [])

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
    }
  };

  // 保存记录
  const saveRow = (e, key) => {
    e.preventDefault();
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData) || {};
    if (!target.t2 || !target.t3) {
      message.error('请填写完整信息。');
      e.target.focus();
      return;
    }
    // delete target.key;
    if (target && target.editable) {
      target.editable = !target.editable;
      setData(newData);
    }
    if (target && target.isNew) {
      target.isNew = !target.isNew;
      setData(newData);
    }
  };

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
    { title: '清单类型', dataIndex: 't0', key: 't0', width: 100, },
    { title: '功能类型', dataIndex: 't1', key: 't1', width: 200, },
    { title: '模块', dataIndex: 't2', key: 't2', width: 100, },
    { title: '功能名称', dataIndex: 't3', key: 't3', width: 80, },
    { title: '问题类型', dataIndex: 't4', key: 't4', width: 150, },
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
              <span style={{ width: 330 }}>{record.menu}</span>
            </InputGroup>
            <Divider type='horizontal' style={{ margin: '6px 0' }} />
            <InputGroup compact>
              <span style={{ width: 70, textAlign: 'right' }}>预期效果：</span>
              <span style={{ width: 330 }}>{record.des}</span>
            </InputGroup>
            <Divider type='horizontal' style={{ margin: '6px 0' }} />
            <InputGroup compact>
              <span style={{ width: 70, textAlign: 'right' }}>验证步骤：</span>
              <span style={{ width: 330 }}>{record.step}</span>
            </InputGroup>
          </>
        );
      }
    },
    {
      title: '是否通过',
      dataIndex: 't6',
      key: 't6',
      width: 80,
      render: (text, record) => {
        return (
          <>
            <RadioGroup value={text} onChange={e => handleFieldChange(e.target.value, 't6', record.key)}>
              <Radio value='001'>通过</Radio>
              <Radio value='002'>不通过</Radio>
            </RadioGroup>
          </>
        )
      }
    },
    { title: '开发人员', dataIndex: 't7', key: 't7', width: 100, },
    { title: '操作人员', dataIndex: 't8', key: 't8', align: 'center', width: 80, },
    { title: '状态', dataIndex: 't9', key: 't9', align: 'center', width: 80, },
    {
      title: '验证意见',
      key: 'opinion',
      dataIndex: 'opinion',
      fixed: 'right',
      width: 300,
      align: 'center',
      render: (text, record) => {
        return (
          <div className={(text === '' && record.t6 === '002') ? styles.requiredform : ''}>
            <TextArea
              defaultValue={text}
              autoSize
              placeholder="请输入"
              onChange={e => handleFieldChange(e.target.value, 'opinion', record.key)}
            />
          </div>
        )
      },
    },
    // {
    //   title: '操作',
    //   key: 'action',
    //   fixed: 'right',
    //   width: 60,
    //   align: 'center',
    //   render: (text, record) => {
    //     return (
    //       <>
    //         <Button type='link' onClick={e => saveRow(e, record.key)}>保存</Button>
    //       </>
    //     )

    //   },
    // },
  ];
  const sclicecolumns = (arr) => {
    const newarr = arr.slice(0);
    newarr.pop();
    return newarr;
  }
  const checkcolumns = sclicecolumns(columns);
  return (
    <Card>
      <h4>
        <span style={{ color: '#f5222d', marginRight: 4, fontWeight: 'normal' }}>*</span>
        {title}
      </h4>
      <Table
        columns={titletype ? columns : checkcolumns}
        dataSource={data}
        bordered
        size='middle'
        rowKey={(_, index) => index.toString()}
        pagination={false}
        scroll={{ x: 1500 }}
      />
    </Card>
  );
}

export default BusinessEditTable;