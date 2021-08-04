import React, { useState, useEffect, useContext } from 'react';
import { Table, Row, Button, Col, Cascader, Input, Radio, message, Divider, Select, Tabs, Alert } from 'antd';
import UserContext from '@/layouts/MenuContext';              //  选人组件上下文
import CheckOneUser from '@/components/SelectUser/CheckOneUser';
import { dispatchBizUsers } from '@/services/user';
import styles from '../index.less';
import OrderContent from './OrderContent';

const { TextArea } = Input;
const InputGroup = Input.Group;
const RadioGroup = Radio.Group;
const { Option } = Select;
const { TabPane } = Tabs;

function EditeTable(props) {
  const { title, functionmap, modulamap, isEdit, taskName, dataSource, ChangeValue } = props;
  const [data, setData] = useState([]);
  const [newbutton, setNewButton] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [drawervisible, setDrawerVisible] = useState(false);        // 工单详情窗口是否显示
  const [choiceUser, setChoiceUser] = useState({ users: '', ischange: false });
  const [uservisible, setUserVisible] = useState(false); // 是否显示选人组件
  const [userlist, setUserList] = useState([]);
  const { ChangeButtype } = useContext(UserContext);

  // 新增一条记录
  const newMember = () => {
    const newData = data.map(item => ({ ...item }));
    newData.push({
      key: data.length + 1,
      listType: taskName !== '版本管理员审批' ? '计划' : '临时',
      abilityType: '',
      module: '',
      appName: '',
      problemType: '',
      responsible: '',
      responsibleId: '',
      testMenu: '',
      testResult: '',
      testStep: '',
      passTest: '通过',
      developer: '',
      operator: sessionStorage.getItem('userName'),
      operatorId: sessionStorage.getItem('userauthorityid'),
      editable: false,
      isNew: true,
    });
    setData(newData);
    setNewButton(true);
  };

  const onSelectChange = RowKeys => {
    setSelectedRowKeys(RowKeys)
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // 获取用户列表
  const getUserList = () => {
    dispatchBizUsers().then(res => {
      if (res.code === 200) {
        setUserList(res.data.userList)
      } else {
        message.error('获取用户列表失败')
      }
    })
  }

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

  // 选择业务负责人
  const handleResponsible = (e, key) => {
    if (e) {
      const newData = data.map(item => ({ ...item }));
      const target = getRowByKey(key, newData);
      if (target) {
        target.responsible = e.label;
        target.responsibleId = e.key;
        setData(newData);
      }
    }
  }

  // 点击编辑按钮
  const editRow = (e, key) => {
    setNewButton(true)
    e.preventDefault();
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData);
    if (target) {
      target.editable = !target.editable;
      setData(newData);
    }
  }

  // 保存记录
  const saveRow = (e, key) => {
    setNewButton(false)
    e.preventDefault();
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData) || {};
    if (!target.module || !target.abilityType || !target.module || !target.appName || !target.problemType || !target.testMenu || !target.testResult || !target.testStep || !target.developer || !target.responsible || !target.responsibleId) {
      message.error('请填写完整的发布清单信息');
      e.target.focus();
      return;
    }
    if (target && target.editable) {
      target.editable = !target.editable;
      setData(newData);
      ChangeValue(newData);
      if (taskName !== '新建') {
        ChangeButtype('save');
      }
    }
    if (target && target.isNew) {
      target.isNew = !target.isNew;
      setNewButton(false)
      setData(newData);
      ChangeValue(newData);
      if (taskName !== '新建') {
        ChangeButtype('save');
      }
    }
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
    setUserVisible(true)
  }

  useEffect(() => {
    if (dataSource && dataSource.length > 0) {
      const newData = dataSource.map((item, index) => ({
        ...item,
        editable: false,
        key: (index + 1).toString(),
      }));
      setData(newData);
      setNewButton(false);
    };
    if (dataSource && dataSource.length === 0) {
      newMember()
    };
  }, [dataSource])

  useEffect(() => {
    getUserList()
  }, [])

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
            <div className={text === '' ? styles.requiredform : ''}>
              <Cascader
                fieldNames={{ label: 'title', value: 'title', children: 'children' }}
                options={functionmap}
                defaultValue={record.isNew ? [] : text.split('/')}
                onChange={e => handleFieldChange(e.join('/'), 'abilityType', record.key)}
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
      width: 150,
      render: (text, record) => {
        if (record.isNew || record.editable) {
          return (
            <div className={text === '' ? styles.requiredselect : ''}>
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
      width: 150,
      render: (text, record) => {
        if (record.isNew || record.editable) {
          return (
            <div className={text === '' ? styles.requiredform : ''}>
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
            <div className={text === '' ? styles.requiredform : ''}>
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
              <div className={record.testMenu === '' ? styles.requiredform : ''}>
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
              <div className={record.testResult === '' ? styles.requiredform : ''}>
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
              <div className={record.testStep === '' ? styles.requiredform : ''}>
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
      title: '业务负责人',
      dataIndex: 'responsible',
      key: 'responsible',
      width: 100,
      render: (text, record) => {
        if (record.isNew || record.editable) {
          return (
            <div className={text === '' ? styles.requiredselect : ''} onMouseDown={() => getUserList()}>
              <Select
                defaultValue={{ key: record.responsibleId }}
                placeholder="请选择"
                labelInValue
                onChange={e => handleResponsible(e, record.key)}
              >
                {userlist.map(obj => [
                  <Option key={obj.userId} value={obj.userId}>
                    {obj.userName}
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
      title: '开发人员',
      dataIndex: 'developer',
      key: 'developer',
      width: 100,
      render: (text, record) => {
        if (record.isNew || record.editable) {
          return (
            <div className={text === '' ? styles.requiredform : ''}>
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
              <Button type='link' onMouseDown={() => ChangeButtype('')} onClick={e => saveRow(e, record.key)}>{taskName === '新建' ? '暂存' : '保存'}</Button>
              <Button type='link' onClick={e => cancel(e, record.key)}>取消</Button>
            </>
          );
        } if (record.editable) {
          return (
            <Button type='link' onMouseDown={() => ChangeButtype('')} onClick={e => saveRow(e, record.key)}>保存</Button>
          );
        }
        return (
          <>
            {(taskName === '新建' || taskName === '出厂测试' || taskName === '平台验证') && record.listType === '计划' && !newbutton && (<Button type='link' onClick={e => editRow(e, record.key)}>编辑</Button>)}
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
      <h4 style={{ fontSize: '1.1em' }}>
        {(taskName === '新建' || taskName === '出厂测试' || taskName === '平台验证' || taskName === '业务验证') && (
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
        <Col span={16}>
          <span><b>前台功能统计：</b>
            缺陷修复项<b style={{ color: '#1890ff', padding: '0 3px' }}>0</b>项，
            变更功能项<b style={{ color: '#1890ff', padding: '0 3px' }}>0</b>项，
            完善功能项<b style={{ color: '#1890ff', padding: '0 3px' }}>0</b>项。
            <b>后台功能统计：</b>
            缺陷修复<b style={{ color: '#1890ff', padding: '0 3px' }}>0</b>项，
            变更功能<b style={{ color: '#1890ff', padding: '0 3px' }}>0</b>项，
            完善功能项<b style={{ color: '#1890ff', padding: '0 3px' }}>0</b>项。</span>
        </Col>

        <Col span={8} style={{ textAlign: 'right' }}>
          {isEdit && (
            <>
              {taskName === '业务验证' && (
                <Button
                  type='primary'
                  style={{ marginRight: 8 }}
                  onMouseDown={() => getUserList()}
                  onClick={() => hadleAssignment()}
                  disabled={newbutton}
                >
                  分派
                </Button>
              )}
              {taskName === '业务验证' && (
                <Button
                  type='primary'
                  style={{ marginRight: 8 }}
                  onMouseDown={() => getUserList()}
                  onClick={() => hadleAssignment()}
                  disabled={newbutton}
                >
                  重分派
                </Button>
              )}
              <Button type='primary' style={{ marginRight: 8 }} onClick={() => newMember()} disabled={newbutton} >新增</Button>
              <Button type='danger' style={{ marginRight: 8 }} ghost onClick={() => handleDelete()}>移除</Button>
            </>
          )}
          <Button type='primary' >导出清单</Button>
        </Col>

      </Row>
      <Table
        columns={isEdit ? columns : viewcolumns}
        dataSource={data}
        bordered
        size='middle'
        rowKey={(record) => record.key}
        pagination={false}
        rowSelection={rowSelection}
        scroll={{ x: 1500 }}
      />
      {taskName === '新建' && (<Alert message="请先暂存发布清单信息，再保存工单" type="warning" style={{ textAlign: 'center', marginTop: 6, }} />)}
      <UserContext.Provider value={{ setChoiceUser, uservisible, setUserVisible, title: '分派' }}>
        <CheckOneUser userlist={userlist} />
      </UserContext.Provider>
      <OrderContent visible={drawervisible} handleChange={v => setDrawerVisible(v)} />
    </>
  );
}

export default EditeTable;