import React, { useState, useEffect } from 'react';
import { Table, Row, Button, Col, Cascader, Input, Radio, message, Divider, Select, Tabs } from 'antd';
import styles from '../index.less';
import AssignmentModal from './AssignmentModal';
import OrderContent from './OrderContent';

const { TextArea } = Input;
const InputGroup = Input.Group;
const RadioGroup = Radio.Group;
const { Option } = Select;
const { TabPane } = Tabs;

function EditeTable(props) {
  const { title, functionmap, modulamap, isEdit, taskName, mainId, dataSource, ChangeValue } = props;
  const [data, setData] = useState([]);
  const [newbutton, setNewButton] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [visible, setVisible] = useState(false);                    // 分派窗口是否显示
  const [drawervisible, setDrawerVisible] = useState(false);        // 工单详情窗口是否显示

  useEffect(() => {
    setData([...dataSource])
  }, [])

  // 新增一条记录
  const newMember = () => {
    // setFilesList([]);
    // setKeyUpload('');
    const newData = data.map(item => ({ ...item }));
    newData.push({
      key: data.length + 1,
      listType: taskName === '发布登记' ? '计划' : '临时',
      abilityType: '',
      module: '',
      appName: '',
      problemType: '',
      testMenu: '',
      testResult: '',
      testStep: '',
      passTest: '通过',
      developer: '',
      operator: sessionStorage.getItem('userName'),
      operatorId: sessionStorage.getItem('userauthorityid'),
      mainId,
      editable: false,
      isNew: true,
    });
    setData(newData);
    setNewButton(true);
  };

  useEffect(() => {
    if (data.length === 0) {
      newMember();
      setNewButton(true);
    }
  }, [data])

  const onSelectChange = RowKeys => {
    setSelectedRowKeys(RowKeys)
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

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

  // 点击编辑按钮
  const editRow = (e, key) => {
    e.preventDefault();
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData);
    if (target) {
      target.editable = !target.editable;
      setData(newData);
    }
    // const target = getRowByKey(key);
    // if (target) {
    //   data[key - 1].editable = true;
    //   data[key - 1].isNew = false;
    // }
  }

  // 保存记录
  const saveRow = (e, key) => {
    e.preventDefault();
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData) || {};
    if (!target.module || !target.abilityType || !target.module || !target.appName || !target.problemType || !target.testMenu || !target.testResult || !target.testStep || !target.developer) {
      message.error('请填写完整信息。');
      e.target.focus();
      return;
    }
    if (target && target.editable) {
      target.editable = !target.editable;
      setData(newData);
      ChangeValue(newData);
    }
    if (target && target.isNew) {
      target.isNew = !target.isNew;
      setNewButton(false)
      setData(newData);
      ChangeValue(newData);
    }
    // const id = target.id === '' ? '' : target.id;
    // savedata(target, id);
  };

  // 取消按钮
  const cancel = (e, key) => {
    e.preventDefault();
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData);
    const newArr = newData.filter(item => item.key !== target.key);
    setData(newArr);
    setNewButton(false);
  };

  // 移除按钮
  const handleDelete = () => {
    const arr = []
    data.forEach(item => {
      if (!selectedRowKeys.includes(item.key)) {
        arr.push(item)
      }
    });
    setData([...arr]);
    ChangeValue(arr);
    setSelectedRowKeys([]);
  }

  const hadleAssignment = () => {
    setVisible(true)
  }


  const column = [
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
      title: '清单类型',
      dataIndex: 'listType',
      key: 'listType',
      width: 100,
      align: 'center',
      render: (text) => {
        return text
      }
    },
    {
      title: '功能类型',
      dataIndex: 'abilityType',
      key: 'abilityType',
      width: 200,
      render: (text, record) => {
        if (record.isNew || record.editable) {
          return (
            <div className={text === '' && dataSource.length !== 0 ? styles.requiredform : ''}>
              <Cascader
                fieldNames={{ label: 'title', value: 'title', children: 'children' }}
                options={functionmap}
                defaultValue={record.isNew ? [] : text.split('/')}
                onChange={e => handleFieldChange(e, 'abilityType', record.key)}

              />
            </div>
          )
        }
        return text
      }
    },
    {
      title: '模块',
      dataIndex: 'module',
      key: 'module',
      width: 100,
      render: (text, record) => {
        if (record.isNew || record.editable) {
          return (
            <div className={text === '' && dataSource.length !== 0 ? styles.requiredselect : ''}>
              <Select
                defaultValue={record.module}
                placeholder="请选择"
                onChange={e => handleFieldChange(e, 'module', record.key)}
              >
                {modulamap.map(obj => [
                  <Option key={obj.key} value={obj.title}>
                    {obj.title}
                  </Option>,
                ])}
              </Select>
            </div>
          )
        }
        return text;
      }
    },
    {
      title: '功能名称',
      dataIndex: 'appName',
      key: 'appName',
      width: 80,
      render: (text, record) => {
        if (record.isNew || record.editable) {
          return (
            <div className={text === '' && dataSource.length !== 0 ? styles.requiredform : ''}>
              <Input
                onChange={e => handleFieldChange(e.target.value, 'appName', record.key)}
                defaultValue={text}
                placeholder="请输入"
              />
            </div>
          )
        }
        return text;
      }
    },
    {
      title: '问题类型',
      dataIndex: 'problemType',
      key: 'problemType',
      width: 150,
      render: (text, record) => {
        if (record.isNew || record.editable) {
          return (
            <div className={text === '' && dataSource.length !== 0 ? styles.requiredform : ''}>
              <TextArea
                defaultValue={text}
                autoSize
                placeholder="请输入"
                onChange={e => handleFieldChange(e.target.value, 'problemType', record.key)}
              />
            </div>
          )
        }
        return text;
      }
    },
    {
      title: '测试内容及预期效果',
      dataIndex: 't5',
      key: 't5',
      width: 400,
      render: (text, record) => {
        if (record.isNew || record.editable) {
          return (
            <>
              <div className={record.testMenu === '' && dataSource.length !== 0 ? styles.requiredform : ''}>
                <InputGroup compact style={{ marginBottom: 12 }}>
                  <span style={{ width: 70, textAlign: 'right', paddingTop: 4 }}>功能菜单：</span>
                  <TextArea
                    defaultValue={record.testMenu}
                    autoSize
                    style={{ width: 330 }}
                    onChange={e => handleFieldChange(e.target.value, 'testMenu', record.key)}
                  />
                </InputGroup>
              </div>
              <div className={record.testResult === '' && dataSource.length !== 0 ? styles.requiredform : ''}>
                <InputGroup compact style={{ marginBottom: 12 }}>
                  <span style={{ width: 70, textAlign: 'right', paddingTop: 4 }}>预期效果：</span>
                  <TextArea
                    defaultValue={record.testResult}
                    autoSize
                    style={{ width: 330 }}
                    onChange={e => handleFieldChange(e.target.value, 'testResult', record.key)}
                  />
                </InputGroup>
              </div>
              <div className={record.testStep === '' && dataSource.length !== 0 ? styles.requiredform : ''}>
                <InputGroup compact>
                  <span style={{ width: 70, textAlign: 'right', paddingTop: 4 }}>验证步骤：</span>
                  <TextArea
                    defaultValue={record.testStep}
                    autoSize
                    style={{ width: 330 }}
                    onChange={e => handleFieldChange(e.target.value, 'testStep', record.key)}
                  />
                </InputGroup>
              </div>
            </>
          )
        }
        return (
          <>
            <InputGroup compact>
              <span style={{ width: 70, textAlign: 'right' }}>功能菜单：</span>
              <span style={{ width: 330 }}>{record.testMenu}</span>
            </InputGroup>
            <Divider type='horizontal' style={{ margin: '6px 0' }} />
            <InputGroup compact>
              <span style={{ width: 70, textAlign: 'right' }}>预期效果：</span>
              <span style={{ width: 330 }}>{record.testResult}</span>
            </InputGroup>
            <Divider type='horizontal' style={{ margin: '6px 0' }} />
            <InputGroup compact>
              <span style={{ width: 70, textAlign: 'right' }}>验证步骤：</span>
              <span style={{ width: 330 }}>{record.testStep}</span>
            </InputGroup>
          </>
        );
      }
    },
    {
      title: '是否通过',
      dataIndex: 'passTest',
      key: 'passTest',
      width: 80,
      align: 'center',
      render: (text, record) => {
        if (record.isNew || record.editable) {
          return (
            <>
              <RadioGroup value={text} onChange={e => handleFieldChange(e.target.value, 'passTest', record.key)}>
                <Radio value='通过'>通过</Radio>
                <Radio value='不通过'>不通过</Radio>
              </RadioGroup>
            </>
          )
        }
        return text;
      }
    },
    {
      title: '开发人员',
      dataIndex: 'developer',
      key: 'developer',
      width: 100,
      render: (text, record) => {
        if (record.isNew || record.editable) {
          return (
            <div className={text === '' && dataSource.length !== 0 ? styles.requiredform : ''}>
              <TextArea
                defaultValue={text}
                autoSize
                placeholder="请输入"
                onChange={e => handleFieldChange(e.target.value, 'developer', record.key)}
              />
            </div>
          )
        }
        return text;
      }
    },
    {
      title: '操作人员',
      dataIndex: 'operator',
      key: 'operator',
      align: 'center',
      width: 100,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 60,
      align: 'center',
      render: (text, record) => {
        if (record.isNew) {
          return (
            <>
              <Button type='link' onClick={e => saveRow(e, record.key)}>保存</Button>
              <Divider type="vertical" />
              <Button type='link' onClick={e => cancel(e, record.key)}>取消</Button>
            </>
          );
        } if (record.editable) {
          return (
            <Button type='link' onClick={e => saveRow(e, record.key)}>保存</Button>
          );
        }
        return (
          <>
            {taskName !== '版本管理员审批' && record.listType === '计划' && (<Button type='link' onClick={e => editRow(e, record.key)}>编辑</Button>)}
            {taskName === '版本管理员审批' && record.listType === '临时' && (<Button type='link' onClick={e => editRow(e, record.key)}>编辑</Button>)}
            {taskName === '版本管理员审批' && record.listType === '计划' && (<Button type='link' >回退</Button>)}
          </>
        )

      },
    },
  ];

  const orderid = {
    title: '所属工单',
    dataIndex: 't9',
    key: 't9',
    fixed: 'right',
    width: 100,
    align: 'center',
    render: (text) => {
      return <a onClick={() => setDrawerVisible(true)}>{text}</a>
    }
  };

  const addorderid = (arr) => {
    const newarr = arr.slice(0);
    if (taskName === '版本管理员审批') {
      newarr.splice(-1, 0, orderid);
    };
    return newarr
  };
  const columns = addorderid(column);

  const sclicecolumns = (arr) => {
    const newarr = arr.slice(0);
    newarr.pop();
    return newarr;
  }
  const viewcolumns = sclicecolumns(columns);

  return (
    <>
      <h4>
        {(taskName === '发布登记' || taskName === '平台验证' || taskName === '业务验证') && (
          <span style={{ color: '#f5222d', marginRight: 4, fontWeight: 'normal' }}>*</span>
        )}
        {title}
      </h4>
      {(taskName === '版本管理员审批' || taskName === '科室负责人审批' || taskName === '中心领导审批' || taskName === '业务复核') && (
        <Tabs type='card'>
          <TabPane tab='博联' key='1' />
          <TabPane tab='南瑞' key='2' />
        </Tabs>
      )}
      <Row style={{ marginBottom: 8 }} type='flex' align='bottom'>
        <Col span={18}>
          <span><b>前台功能统计：</b>
            缺陷修复项<b style={{ color: '#1890ff', padding: '0 3px' }}>0</b>项，
            变更功能项<b style={{ color: '#1890ff', padding: '0 3px' }}>0</b>项，
            完善功能项<b style={{ color: '#1890ff', padding: '0 3px' }}>0</b>项。
            <b>后台功能统计：</b>
            缺陷修复<b style={{ color: '#1890ff', padding: '0 3px' }}>0</b>项，
            变更功能<b style={{ color: '#1890ff', padding: '0 3px' }}>0</b>项，
            完善功能项<b style={{ color: '#1890ff', padding: '0 3px' }}>0</b>项。</span>
        </Col>
        <Col span={6} style={{ textAlign: 'right' }}>
          {isEdit && (
            <>
              <Button
                type='primary'
                style={{ marginRight: 8 }}
                onClick={() => newMember()}
                disabled={newbutton}
              >新增</Button>
              <Button type='danger' style={{ marginRight: 8 }} ghost onClick={() => handleDelete()}>移除</Button>
            </>
          )}
          {taskName === '业务复核' && (
            <Button
              type='primary'
              style={{ marginRight: 8 }}
              onClick={() => hadleAssignment()}
              disabled={newbutton}
            >
              分派
            </Button>
          )}
          <Button type='primary' >导出清单</Button>
        </Col>
      </Row>
      <Table
        columns={isEdit ? columns : viewcolumns}
        dataSource={data}
        bordered
        size='middle'
        rowKey={(_, index) => index.toString()}
        pagination={false}
        rowSelection={rowSelection}
        scroll={{ x: 1500 }}
      />
      <AssignmentModal visible={visible} handleChange={v => setVisible(v)} />
      <OrderContent visible={drawervisible} handleChange={v => setDrawerVisible(v)} />
    </>
  );
}

export default EditeTable;