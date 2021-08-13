import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'dva';
import { Table, Row, Button, Col, Cascader, Input, Radio, message, Divider, Select, Tabs, Alert } from 'antd';
import UserContext from '@/layouts/MenuContext';
import CheckOneUser from '@/components/SelectUser/CheckOneUser';
import { dispatchBizUsers } from '@/services/user';
import styles from '../index.less';
import OrderContent from './OrderContent';
import { releaseListAssign } from '../services/api';

const { TextArea } = Input;
const InputGroup = Input.Group;
const RadioGroup = Radio.Group;
const { Option } = Select;
const { TabPane } = Tabs;

function getQueryVariable(variable) {
  const query = window.location.search.substring(1);
  const vars = query.split("&");
  for (let i = 0; i < vars.length; i += 1) {
    const pair = vars[i].split("=");
    if (pair[0] === variable) { return pair[1]; }
  }
  return (false);
}

function EditeTable(props) {
  const { title, functionmap, modulamap, isEdit, taskName, dataSource, ChangeValue, dispatch } = props;
  const [data, setData] = useState([]);
  const [newbutton, setNewButton] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [drawervisible, setDrawerVisible] = useState(false);        // 工单详情窗口是否显示
  const [choiceUser, setChoiceUser] = useState({ users: '', ischange: false });
  const [uservisible, setUserVisible] = useState(false); // 是否显示选人组件
  const [userlist, setUserList] = useState([]);
  const [assign, setAssign] = useState('');              // 分派工单
  const { ChangeButtype, taskId, ChangeaddAttaches } = useContext(UserContext);

  // 新增一条记录
  const newMember = () => {
    const newData = data.map(item => ({ ...item }));
    newData.unshift({
      key: data.length + 1,
      listType: (taskName === '新建' || taskName === '出厂测试') ? '计划' : '临时添加',
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
      developerId: '',
      addStatus: taskId,
      operator: sessionStorage.getItem('userName'),
      operatorId: sessionStorage.getItem('userauthorityid'),
      editable: false,
      isNew: true,
    });
    setData(newData);
    setNewButton(true);
  };

  const onSelectChange = (RowKeys, record) => {
    setSelectedRowKeys(RowKeys);
    setSelectedRecords(record);
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
    e.preventDefault();
    const newlist = data.filter(item => item.addStatus === taskId);
    if (newlist.length > 0) {
      ChangeaddAttaches('add');
    }
    setNewButton(false)
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData) || {};
    if (taskName === '业务验证') {
      if (!target.module || !target.abilityType || !target.module || !target.appName || !target.problemType || !target.testMenu || !target.testResult || !target.testStep || !target.developer) {
        message.error('请填写完整的发布清单信息');
        e.target.focus();
        return;
      };
    } else {
      if (!target.module || !target.abilityType || !target.module || !target.appName || !target.problemType || !target.testMenu || !target.testResult || !target.testStep || !target.developer || !target.responsible || !target.responsibleId) {
        message.error('请填写完整的发布清单信息');
        e.target.focus();
        return;
      };
    }

    if (target && (target.editable || target.verification)) {
      target.editable = !target.editable;
      target.verification = false;
      newData.sort((a, b) => a.key - b.key);
      setData(newData);
      ChangeValue(newData);
      if (taskName !== '新建') {
        ChangeButtype('save');
      }
    };
    if (target && target.isNew) {
      target.isNew = !target.isNew;
      setNewButton(false)
      newData.sort((a, b) => a.key - b.key);
      setData(newData);
      ChangeValue(newData);
      if (taskName !== '新建') {
        ChangeButtype('save');
      }
    };
  };

  // 新建取消按钮
  const newcancel = (e, key) => {
    e.preventDefault();
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData);
    const newArr = newData.filter(item => item.key !== target.key);
    setData(newArr);
    setNewButton(false);
  };
  // 编辑、验证取消
  const cancel = (e, key) => {
    e.preventDefault();
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData);
    if (target) {
      target.verification = false;
      target.editable = false;
      target.options = sessionStorage.getItem('userName');
      target.optionsId = sessionStorage.getItem('userauthorityid');
      setData(newData);
      setNewButton(false);
    };
  };

  // 验证按钮
  const verificationRow = (e, key) => {
    setNewButton(true)
    e.preventDefault();
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData);
    if (target) {
      target.verification = true;
      target.options = sessionStorage.getItem('userName');
      target.optionsId = sessionStorage.getItem('userauthorityid');
      setData(newData);
    }
  }

  // 移除按钮,新建的时候
  const handleDelete = () => {
    setNewButton(false);
    const arr = []
    data.forEach(item => {
      if (!selectedRowKeys.includes(item.key)) {
        arr.push(item)
      }
    });
    setData([...arr]);
    ChangeValue(arr);
    setSelectedRowKeys([]);
    if (taskName !== '新建' && !newbutton) {
      ChangeButtype('save');
    }
  };
  // 有流程ID后的移除按钮
  const ortherDelete = () => {
    if (selectedRecords.length === 0) {
      message.error('您还没有选择数据')
    };
    const newSelectds = selectedRecords.filter(item => item.taskId === item.addStatus);
    const statusSelectds = selectedRecords.filter(item => (item.verifyStatus === '已转出' || item.verifyStatus === '已验证'));
    if (newSelectds.length === 0) {
      message.error('不能移除非本节点临时添加的数据')
    } else if (statusSelectds.length > 0) {
      message.error('不能移除已转出或已验证的数据')
    } else {
      const newArr = data.filter((x) => !selectedRecords.some((item) => item.taskId === item.addStatus && x.id === item.id));
      setData(newArr);
      // 清单中是否还包含本节点添加的数据，如果已不含，附件列表清除补充的文档行
      const deleteAtt = newArr.filter(item => item.taskId === item.addStatus);
      if (deleteAtt.length === 0) {
        ChangeaddAttaches('delete');
      }
      ChangeValue(newArr);
      ChangeButtype('save');
    }
    setSelectedRowKeys([]);
    setSelectedRecords([]);
    setNewButton(false);
  }

  const hadleAssignment = (type) => {
    setAssign('');
    if (type === 'assign') {
      const target = selectedRecords.filter(item => item.verifyStatus !== '已转出' && item.verifyStatus !== '已验证');
      if (target.length > 0) {
        const assignIds = target.map(item => {
          return item.id;
        });
        setAssign(assignIds.toString());
        setUserVisible(true)
      } else {
        message.error('请选择状态为空的数据')
      }
    };
    if (type === 'reassignment') {
      const target = selectedRecords.filter(item => item.verifyStatus === '已转出');
      if (target.length > 0) {
        const assignIds = target.map(item => {
          return item.id;
        });
        setAssign(assignIds.toString());
        setUserVisible(true)
      } else {
        message.error('请选择状态为已转出的数据')
      }
    };
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
    if (choiceUser.ischange) {
      const releaseNo = getQueryVariable("Id");
      const values = { listIds: assign, handlerId: choiceUser.users };
      dispatch({
        type: 'releasetodo/listassign',
        payload: {
          values,
          releaseNo,
        },
      });
    }
  }, [choiceUser.ischange])

  useEffect(() => {
    getUserList()
  }, [])

  const column = [
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
      width: 150,
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
      width: 120,
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
              <TextArea
                onChange={e => handleFieldChange(e.target.value, 'appName', record.key)}
                defaultValue={text}
                autoSize
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
      title: '是否通过',
      dataIndex: 'passTest',
      key: 'passTest',
      fixed: 'right',
      width: 100,
      render: (text, record) => {
        if (record.isNew || record.editable || record.verification) {
          return (
            <>
              <RadioGroup value={text || '通过'} onChange={e => handleFieldChange(e.target.value, 'passTest', record.key)}>
                <Radio value='通过'>通过</Radio>
                <Radio value='不通过'>不通过</Radio>
              </RadioGroup>
            </>
          )
        }
        return <div style={{ textAlign: 'center' }}>{text}</div>;
      }
    },
    {
      title: '业务负责人',
      dataIndex: 'responsible',
      key: 'responsible',
      fixed: 'right',
      align: 'center',
      width: 120,
      render: (text, record) => {
        if (record.isNew || record.editable || record.verification) {
          return (
            <div className={text === '' ? styles.requiredselect : ''} onMouseDown={() => getUserList()}>
              {taskName !== '业务验证' && (
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
              )}
            </div>
          )
        }
        return text;
      }
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 60,
      align: 'center',
      render: (text, record) => {
        const userid = sessionStorage.getItem('userauthorityid');
        if (record.isNew) {
          return (
            <>
              {taskName !== '业务验证' && (
                <Button type='link' onMouseDown={() => ChangeButtype('')} onClick={e => saveRow(e, record.key)}>{taskName === '新建' ? '暂存' : '保存'}</Button>
              )}
              {taskName === '业务验证' && (
                <Button type='link' onMouseDown={() => ChangeButtype('')} onClick={e => saveRow(e, record.key, 'save')}>保存</Button>
              )}
              <Button type='link' onClick={e => newcancel(e, record.key)}>取消</Button>
            </>
          );
        } if (record.editable || record.verification) {
          return (
            <>
              <Button type='link' onMouseDown={() => ChangeButtype('')} onClick={e => saveRow(e, record.key)}>保存</Button>
              <Button type='link' onClick={e => cancel(e, record.key)}>取消</Button>
            </>
          );
        }
        return (
          <>
            {(taskName === '新建' || taskName === '出厂测试' || taskName === '平台验证') && userid === record.operatorId && !newbutton && (<Button type='link' onClick={e => editRow(e, record.key)}>编辑</Button>)}
            {taskName === '业务验证' && userid === record.operatorId && !newbutton && !record.verifyStatus && (<Button type='link' onClick={e => editRow(e, record.key)}>编辑</Button>)}
            {taskName === '平台验证' && userid !== record.operatorId && !newbutton && (<Button type='link' onClick={e => verificationRow(e, record.key)}>验证</Button>)}
            {taskName === '版本管理员审批' && record.listType === '临时' && (<Button type='link' onClick={e => editRow(e, record.key)}>编辑</Button>)}
            {taskName === '版本管理员审批' && record.listType === '计划' && (<Button type='link' >回退</Button>)}
          </>
        )

      },
    },
  ];

  const verifyStatus = {
    title: '状态',
    dataIndex: 'verifyStatus',
    key: 'verifyStatus',
    fixed: 'right',
    width: 100,
    align: 'center',
  };

  const orderid = {
    title: '所属工单',
    dataIndex: 'procInstId',
    key: 'procInstId',
    fixed: 'right',
    width: 100,
    align: 'center',
    render: (text) => {
      return <a onClick={() => setDrawerVisible(true)}>{text}</a>
    }
  };

  const addorderid = (arr) => {
    if (taskName === '业务验证') {
      const newarr = arr;
      newarr.splice(-3, 0, verifyStatus)
      return newarr
    } if (taskName === '版本管理员审批') {
      const newarr = arr;
      newarr.splice(-1, 0, orderid);
      return newarr
    }
    return arr
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
                  onClick={() => hadleAssignment('assign')}
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
                  onClick={() => hadleAssignment('reassignment')}
                  disabled={newbutton}
                >
                  重分派
                </Button>
              )}
              <Button type='primary' style={{ marginRight: 8 }} onClick={() => newMember()} disabled={newbutton} >新增</Button>
              {taskName === '新建' && (
                <Button
                  type='danger'
                  style={{ marginRight: 8 }}
                  ghost
                  onMouseDown={() => ChangeButtype('')} onClick={() => handleDelete()}
                >
                  移除
                </Button>
              )}
              {taskName !== '新建' && (
                <Button
                  type='danger'
                  style={{ marginRight: 8 }}
                  ghost
                  onMouseDown={() => ChangeButtype('')} onClick={() => ortherDelete()}
                >
                  移除
                </Button>
              )}
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
        scroll={{ x: 1740, y: 400 }}
      />
      {taskName === '新建' && (<Alert message="请先暂存发布清单信息，再保存工单" type="warning" style={{ textAlign: 'center', marginTop: 6, }} />)}
      <UserContext.Provider value={{ setChoiceUser, uservisible, setUserVisible, title: '分派' }}>
        <CheckOneUser userlist={userlist} />
      </UserContext.Provider>
      <OrderContent visible={drawervisible} handleChange={v => setDrawerVisible(v)} />
    </>
  );
}

export default connect()(EditeTable);