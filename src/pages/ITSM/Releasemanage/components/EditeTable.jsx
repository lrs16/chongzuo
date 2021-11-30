import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Table, Row, Button, Col, Cascader, Input, Radio, message, Divider, Select, Tabs, Alert, Tooltip } from 'antd';
import UserContext from '@/layouts/MenuContext';
import CheckOneUser from '@/components/SelectUser/CheckOneUser';
import { dispatchBizUsers } from '@/services/user';
import styles from '../index.less';
import OrderContent from './OrderContent';
import { releaseListEdit, releaseListDel, classifyList, releaseListsDownload } from '../services/api';                   // 版本管理员审批清单添加编辑

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
  const { title, functionmap, modulamap, isEdit, taskName, dataSource, ChangeValue, listmsg,
    dispatch, dutyUnits, dutyUnitListMsg, dutyUnitTotalMsg, dutyUnitList, ChangeAttActiveKey, orderNos, ChangeTabdisabled } = props;
  const [data, setData] = useState([]);
  const [newbutton, setNewButton] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [drawervisible, setDrawerVisible] = useState(false);        // 工单详情窗口是否显示
  const [choiceUser, setChoiceUser] = useState({ users: '', ischange: false });
  const [uservisible, setUserVisible] = useState(false); // 是否显示选人组件
  const [userlist, setUserList] = useState([]);
  const [assign, setAssign] = useState('');              // 分派工单
  const [tabActivekey, settabActivekey] = useState(''); // 公司页签
  const [deletebut, setDeletBut] = useState(false);
  const [orderFilters, setOrderFilters] = useState([]);    // 所属工单筛选项
  const [filteredInfo, setFilteredInfo] = useState({})     // 已选择的筛选项
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 2 });
  const [releaseNoandId, setReleaseNo] = useState({ releaseNo: '', processInstanceId: '' });
  const [classify, setClassify] = useState('');
  const { ChangeButtype, taskId, ChangeaddAttaches, location } = useContext(UserContext);

  const listTypeFilter = [{ text: '计划', value: '计划' }, { text: '临时添加', value: '临时添加' }]

  // 数组去重
  const uniqueNo = (arr) => {
    const res = new Map();
    return arr.filter((item) => !res.has(item.releaseNo) && res.set(item.releaseNo, 1))
  }

  // 版本管理员审核点击新增时先判断该责任单位多少个工单
  const checknewpre = (newData) => {
    const releaseNoList = uniqueNo(newData);
    const orderkeys = releaseNoList.map((item) => {
      return item.releaseNo
    })
    if (orderkeys.length === 1) {
      ChangeAttActiveKey(orderkeys[0])
    }
  }

  // 新增一条记录
  const newMember = () => {
    setPageinations({ current: 1, pageSize: 1 });
    const newData = data.map(item => ({ ...item }));
    if (taskName === '版本管理员审核') {
      checknewpre(newData);
      ChangeTabdisabled(true);
    };
    newData.unshift({
      key: data.length + 1,
      listType: (taskName === '新建' || taskName === '出厂测试') ? '计划' : '临时添加',
      abilityType: '',
      module: '',
      appName: '',
      problemType: '',
      responsible: '',
      responsibleId: '',
      releaseNo: '',
      testMenu: '',
      testResult: '',
      testStep: '',
      passTest: '通过',
      developer: '',
      developerId: '',
      addStatus: (taskName === '版本管理员审核' || taskName === '出厂测试' || taskName === '新建') ? 'add' : taskId,
      verifyStatus: taskName === '版本管理员审核' ? '已验证' : '',
      operator: sessionStorage.getItem('userName'),
      operatorId: sessionStorage.getItem('userauthorityid'),
      editable: false,
      isNew: true,
    });
    setData(newData);
    setNewButton(true);
    ChangeaddAttaches('');
  };

  const onSelectChange = (RowKeys, record) => {
    setDeletBut(false)
    setSelectedRowKeys(RowKeys);
    setSelectedRecords(record);
    if (taskName === '版本管理员审核') {
      if (RowKeys.length > 0) {
        const releaseNoList = uniqueNo(record);                                // 工单号数组去重
        const target = releaseNoList.filter(item => item.releaseNo !== '');    // 数组中不含空值的
        const releaseNos = target.map((item) => {                              // 取出发布工单号组成新的数组
          return item.releaseNo
        });
        if (releaseNos.length > 1) {
          setDeletBut(true)
        };
        if (releaseNos.length === 1) {
          ChangeAttActiveKey(releaseNos[0]);
          ChangeTabdisabled(true);
        }
      } else {
        ChangeTabdisabled(false);
      }
    }
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
      if (target.verification) {
        ChangeValue(newData);
        releaseListEdit(target);
      }
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
        if (target.verification) {
          ChangeValue(newData);
          releaseListEdit(target);
        }
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
    ChangeaddAttaches('');
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

      setPageinations({ current: Math.ceil(newData.length / 2), pageSize: 2 });
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
      setPageinations({ current: Math.ceil(newData.length / 2), pageSize: 2 });
      ChangeValue(newData);
      if (taskName !== '新建') {
        ChangeButtype('save');
      }
    };
  };

  // 版本管理员审核保存
  const checsaveRow = (e, key) => {
    e.preventDefault();
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData) || {};
    if (!target.module || !target.abilityType || !target.module || !target.appName || !target.problemType || !target.testMenu || !target.testResult || !target.testStep || !target.developer || !target.responsible) {
      message.error('请填写完整的发布清单信息');
      e.target.focus();
      return;
    };
    const taskIdtarget = data.filter(item => item.releaseNo === target.releaseNo);
    if (target) {
      if (target.releaseNo) {
        target.mainId = taskIdtarget[taskIdtarget.length - 1].mainId;
        target.taskId = taskIdtarget[taskIdtarget.length - 1].taskId;
        target.addStatus = taskIdtarget[taskIdtarget.length - 1].taskId;
      } else {
        target.mainId = newData[newData.length - 1].mainId;
        target.taskId = newData[newData.length - 1].taskId;
        target.addStatus = newData[newData.length - 1].taskId;
      };
      setData(newData);
      setPageinations({ current: Math.ceil(newData.length / 2), pageSize: 2 });
      const newlist = newData.filter(item => item.addStatus === item.taskId);
      if (newlist.length > 0) {
        ChangeaddAttaches('add');
      }
      releaseListEdit(target).then(res => {
        if (res.code === 200) {
          ChangeButtype('save');
          ChangeTabdisabled(false);
        } else {
          message.error(res.msg)
        }
      });
      setNewButton(false);
      // dispatch({
      //   type: 'releasetodo/checkaddlist',
      //   payload: {
      //     values: target,
      //     releaseNo,
      //   },
      // });
    }
  }

  // 新建取消按钮
  const newcancel = (e, key) => {
    e.preventDefault();
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData);
    const newArr = newData.filter(item => item.key !== target.key);
    setData(newArr);
    setNewButton(false);
    if (taskName === '版本管理员审核') {
      ChangeTabdisabled(false)
    }
  };
  // 编辑、验证取消
  const cancel = (e, key) => {
    e.preventDefault();
    const newData = dataSource.map((item, index) => ({
      ...item,
      editable: false,
      key: (index + 1).toString(),
    }));
    setData(newData);
    // const target = getRowByKey(key, newData);
    setNewButton(false);
    // if (target) {
    //   target.verification = false;
    //   target.editable = false;
    //   target.options = sessionStorage.getItem('userName');
    //   target.optionsId = sessionStorage.getItem('userauthorityid');
    //   setData(newData);
    //   setNewButton(false);
    // };
  };

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
    const haveNew = selectedRecords.filter(item => item.developerId === '');
    if (selectedRecords.length === 0) {
      message.error('您还没有选择数据')
    } if (haveNew.length === 1 && selectedRecords.length === 1) {
      const newArr = data.filter((x) => !selectedRecords.some((item) => x.key === item.key));
      setData(newArr);
    } else {
      const newSelectds = selectedRecords.filter(item => item.taskId === item.addStatus);
      if (newSelectds.length === 0) {
        message.error('请选择本节点临时添加的数据')
      } else {
        const statusSelectds = selectedRecords.filter(item => (item.verifyStatus === '已转出' || item.verifyStatus === '已验证'));
        if (statusSelectds.length > 0) {
          message.error('不能移除已转出或已验证的数据')
        } else {
          const newArr = data.filter((x) => !selectedRecords.some((item) => item.taskId === item.addStatus && x.id === item.id));
          setData(newArr);
          // 清单中是否还包含本节点添加的数据，如果已不含，附件列表清除补充的文档行
          const deleteAtt = newArr.filter(item => item.taskId === item.addStatus);
          if (deleteAtt.length === 0) {
            ChangeaddAttaches('delete');
          };
          ChangeValue(newArr);
          ChangeButtype('save');
        }
      };
    }
    setSelectedRowKeys([]);
    setSelectedRecords([]);
    setNewButton(false);
  }

  // 版本管理员移除
  const checkDelete = () => {
    const haveNew = selectedRecords.filter(item => item.developerId === '');
    if (selectedRecords.length === 0) {
      message.error('您还没有选择数据')
    } if (haveNew.length === 1 && selectedRecords.length === 1) {
      const newArr = data.filter((x) => !selectedRecords.some((item) => x.key === item.key));
      setData(newArr);
    } else {
      const newSelectds = selectedRecords.filter(item => item.taskId === item.addStatus);
      if (newSelectds.length === 0) {
        message.error('请选择本节点临时添加的数据')
      } else {
        const newArr = data.filter((x) => !selectedRecords.some((item) => item.taskId === item.addStatus && x.id === item.id));
        setData(newArr);
        // 清单中是否还包含本工单本节点添加的数据，如果已不含，附件列表清除补充的文档行
        const deleteAtt = newArr.filter(item => item.taskId === item.addStatus && item.taskId === selectedRecords[0].taskId);
        if (deleteAtt.length === 0) {
          ChangeaddAttaches('delete');
        };
        const listIds = newSelectds.map((item) => {                              // 取出发布清单编号组成新的数组
          return item.id
        });
        if (listIds.length > 0) {
          releaseListDel({ listIds }).then(res => {
            if (res.code === 200) {
              ChangeButtype('save');
            } else {
              message.error(res.msg)
            }
          })
        } else {
          message.error('请选择本节点临时添加的数据')
        }

      };
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
    setSelectedRowKeys([]);
    setSelectedRecords([]);
  }

  useEffect(() => {
    if (dataSource && dataSource.length > 0) {
      const newData = dataSource.map((item, index) => ({
        ...item,
        editable: false,
        verification: taskName === '平台验证' && item.addStatus !== item.taskId,
        key: (index + 1).toString(),
      }));
      setData(newData);
      setNewButton(false);
      setSelectedRowKeys([]);
      setSelectedRecords([]);
      if (taskName !== '新建') {
        classifyList(getQueryVariable("taskId")).then(res => {
          if (res.code === 200) {
            setClassify(res.data.classifyList.dutyUnitListMsg);
          }
        })
      }
    };
    // if (isEdit && dataSource && dataSource.length === 0 && data.length === 0) {
    //   newMember()
    // };
  }, [dataSource])

  useEffect(() => {
    if (taskName === '新建' && location && location.state && (location.state.cache || location.state.reset)) {
      setData([]);
    }
  }, [location]);

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

  // 分页
  const onShowSizeChange = (page, size) => {
    setPageinations({
      ...paginations,
      pageSize: size,
    });
  };

  const changePage = page => {
    setPageinations({
      ...paginations,
      current: page,
    });
  };

  const pagination = {
    showSizeChanger: true,
    onShowSizeChange: (page, size) => onShowSizeChange(page, size),
    current: paginations.current,
    pageSize: paginations.pageSize,
    pageSizeOptions: ['2', '5', '10', '20', '30', '40', '50'],
    total: data.length,
    showTotal: total => `总共  ${total}  条记录`,
    onChange: page => changePage(page),
  };

  const column = [
    {
      title: '序号',
      dataIndex: 'key',
      key: 'key',
      width: 50,
      align: 'center',
    },
    // {
    //   title: '清单类型',
    //   dataIndex: 'listType',
    //   key: 'listType',
    //   width: 120,
    //   align: 'center',
    //   render: (text) => {
    //     return text
    //   },
    //   sorter: (a, b) => a.listType.localeCompare(b.listType),
    // },
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
                defaultValue={record.isNew || !text ? [] : text.split('/')}
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
                    style={{ width: 310 }}
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
                    style={{ width: 310 }}
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
                    style={{ width: 310 }}
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
              <span style={{ width: 310 }} dangerouslySetInnerHTML={{ __html: record.testMenu?.replace(/[\n]/g, '<br/>') }} />
            </InputGroup>
            <Divider type='horizontal' style={{ margin: '6px 0' }} />
            <InputGroup compact>
              <span style={{ width: 70, textAlign: 'right' }}>预期效果：</span>
              <span style={{ width: 310 }} dangerouslySetInnerHTML={{ __html: record.testResult?.replace(/[\n]/g, '<br/>') }} />
            </InputGroup>
            <Divider type='horizontal' style={{ margin: '6px 0' }} />
            <InputGroup compact>
              <span style={{ width: 70, textAlign: 'right' }}>验证步骤：</span>
              <span style={{ width: 310 }} dangerouslySetInnerHTML={{ __html: record.testStep?.replace(/[\n]/g, '<br/>') }} />
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
        if ((record.isNew || record.editable || record.verification) && isEdit) {
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
        if ((record.isNew || record.editable || record.verification) && isEdit) {
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
              {taskName !== '业务验证' && taskName !== '版本管理员审核' && (
                <Button type='link' onMouseDown={() => ChangeButtype('')} onClick={e => saveRow(e, record.key)}>{taskName === '新建' ? '暂存' : '保存'}</Button>
              )}
              {taskName === '业务验证' && (
                <Tooltip placement="topLeft" title="保存后请将清单分派给指定业务负责人">
                  <Button type='link' onMouseDown={() => ChangeButtype('')} onClick={e => saveRow(e, record.key, 'save')}>保存</Button>
                </Tooltip>
              )}
              {taskName === '版本管理员审核' && (
                <Button type='link' onMouseDown={() => { ChangeButtype('') }} onClick={e => checsaveRow(e, record.key)}>保存</Button>
              )}
              <Button type='link' onClick={e => newcancel(e, record.key)}>取消</Button>
            </>
          );
        } if (record.editable) {
          return (
            <>
              {taskName !== '版本管理员审核' && (
                <>
                  <Button type='link' onMouseDown={() => ChangeButtype('')} onClick={e => saveRow(e, record.key)}>保存</Button>
                  <Button type='link' onClick={e => cancel(e, record.key)}>取消</Button>
                </>
              )}
              {taskName === '版本管理员审核' && (
                <>
                  <Button type='link' onMouseDown={() => { ChangeButtype('') }} onClick={e => checsaveRow(e, record.key)}>保存</Button>
                  <Button type='link' onClick={e => cancel(e, record.key)}>取消</Button>
                </>
              )}
            </>
          );
        }
        return (
          <>
            {(taskName === '新建' || taskName === '出厂测试') && userid === record.operatorId && !newbutton && (<Button type='link' onClick={e => editRow(e, record.key)}>编辑</Button>)}
            {taskName === '平台验证' && userid === record.operatorId && record.taskId === record.addStatus && !newbutton && (<Button type='link' onClick={e => editRow(e, record.key)}>编辑</Button>)}
            {taskName === '业务验证' && userid === record.operatorId && !newbutton && !record.verifyStatus && (<Button type='link' onClick={e => editRow(e, record.key)}>编辑</Button>)}
            {/* {(taskName === '平台验证' || taskName === '发布实施') && userid !== record.operatorId && !newbutton && (<Button type='link' onClick={e => verificationRow(e, record.key)}>验证</Button>)} */}
            {taskName === '版本管理员审核' && record.listType === '临时添加' && userid === record.operatorId && record.taskId === record.addStatus && !newbutton && (<Button type='link' onClick={e => editRow(e, record.key)}>编辑</Button>)}
            {/* {taskName === '版本管理员审核' && !newbutton && dutyUnits && dutyUnits.length > 1 && !saved && (<Button type='link' onMouseDown={() => { ChangeButtype('') }} onClick={() => ChangeButtype('goback')}>回退</Button>)} */}
          </>
        )
      },
    }
  ];

  const verifyStatus = {
    title: '状态',
    dataIndex: 'verifyStatus',
    key: 'verifyStatus',
    width: 100,
    align: 'center',
  };

  const orderid = {
    title: '所属工单',
    dataIndex: 'releaseNo',
    key: 'releaseNo',
    fixed: 'right',
    width: 150,
    align: 'center',
    render: (text, record) => {
      if ((record.isNew || record.editable) && taskName === '版本管理员审核') {
        const newData = data.map(item => ({ ...item }));
        if (record.isNew) {
          newData.shift()
        }
        const releaseNoList = uniqueNo(newData);
        const orderkeys = releaseNoList.map((item) => {
          return item.releaseNo
        })
        return (
          <div className={text === '' ? styles.requiredform : ''}>
            {orderkeys.length > 1 ? (<Select
              defaultValue={record.releaseNo}
              placeholder="请选择"
              onChange={e => { handleFieldChange(e, 'releaseNo', record.key); ChangeAttActiveKey(e) }}
            >
              {orderkeys.map(obj => [
                <Option key={obj} value={obj}>
                  {obj}
                </Option>,
              ])}
            </Select>) : (<span>{orderkeys[0]}</span>)}
          </div>
        )
      }
      return <a onClick={() => { setReleaseNo({ releaseNo: record.releaseNo, processInstanceId: record.mainId }); setDrawerVisible(true) }}>{text}</a>
    },
    sorter: (a, b) => a.releaseNo.localeCompare(b.releaseNo),
    filters: orderFilters,
    filteredValue: filteredInfo.releaseNo || null,
    onFilter: (value, record) => record.releaseNo.indexOf(value) === 0,
  };

  const sclicecolumns = (arr) => {
    const newarr = arr.slice(0);
    newarr.pop();
    return newarr;
  };

  const addorderid = (arr) => {
    if (taskName === '平台验证') {
      const newarr = sclicecolumns(arr);
      return newarr
    }
    if (taskName === '业务验证') {
      const newarr = sclicecolumns(arr);
      newarr.splice(-3, 0, verifyStatus)
      return newarr
    } if ((taskName === '版本管理员审核' || taskName === '科室负责人审核' || taskName === '中心领导审核') && orderNos && orderNos.length > 1) {
      const newarr = sclicecolumns(arr);
      newarr.splice(-1, 0, orderid);
      return newarr
    }
    return arr
  };
  const columns = addorderid(column);
  const viewcolumns = sclicecolumns(columns);

  // 表格操作：清除筛选
  const TableChange = (page, filters, sorter) => {
    setFilteredInfo(filters)
  };

  // 点击公司页签
  const handleTabChange = key => {
    settabActivekey(key);
    setFilteredInfo({});
    setSelectedRowKeys([]);
    setSelectedRecords([]);
    ChangeTabdisabled(false);
    if (dutyUnitList && dutyUnitList[key]) {
      const newData = dutyUnitList[key].map((item, index) => ({
        ...item,
        editable: false,
        key: (index + 1).toString(),
      }));
      setData(newData);
      setNewButton(false);
      const releaseNoList = uniqueNo(newData);                               // 工单号数组去重
      const target = releaseNoList.filter(item => item.releaseNo !== '');    // 数组中不含空值的
      const releaseNos = target.map((item) => {                              // 取出发布工单号组成新的数组
        return { text: item.releaseNo, value: item.releaseNo }
      });
      setOrderFilters(releaseNos);
    };
  };

  // 初始化公司页签
  useEffect(() => {
    if (dutyUnitListMsg && dutyUnits) {
      if (tabActivekey && dutyUnits.length > 1) {
        handleTabChange(tabActivekey);
      } else {
        handleTabChange(dutyUnits[0]);
      };
    }
  }, [dutyUnitList]);

  // 清单导出
  const handleDlownd = () => {
    let ids = []
    if (selectedRowKeys.length > 0) {
      ids = selectedRecords.map(item => {
        return item.id
      });
    } else {
      ids = data.map(item => {
        return item.id
      });
    };
    releaseListsDownload({ listIds: ids.toString() }).then(res => {
      if (res) {
        const filename = `发布清单${moment().format('YYYY-MM-DD HH:mm')}.xlsx`;
        const blob = new Blob([res], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    })
  }
  return (
    <>
      <h4 style={{ fontSize: '1.1em' }}>
        {(taskName === '新建' || taskName === '出厂测试' || taskName === '平台验证' || taskName === '业务验证') && (
          <span style={{ color: '#f5222d', marginRight: 4, fontWeight: 'normal' }}>*</span>
        )}
        {title}
      </h4>
      {(taskName === '版本管理员审核' || taskName === '科室负责人审核' || taskName === '中心领导审核') && dutyUnitListMsg && dutyUnits && dutyUnits.length > 1 && (
        <div style={{ paddingBottom: 12 }}>{dutyUnitTotalMsg}</div>
      )}
      {(taskName === '版本管理员审核' || taskName === '科室负责人审核' || taskName === '中心领导审核') && dutyUnits && dutyUnits.length > 1 && (
        <Tabs type='card' onClick={() => setPageinations({ current: 1, pageSize: 2 })} onChange={handleTabChange} activeKey={tabActivekey}>
          {dutyUnits.map((obj) => {
            return [
              <TabPane key={obj} tab={obj} />,
            ]
          })}
        </Tabs>
      )}

      <Row style={{ marginBottom: 8 }} type='flex' align='bottom' >
        <Col span={16}>
          {dutyUnitTotalMsg && (
            <span key={tabActivekey} style={{ paddingBottom: 12 }}>{tabActivekey}：{dutyUnitListMsg[tabActivekey]}</span>
          )}
          {((taskName === '出厂测试' || taskName === '平台验证' || taskName === '业务验证') && isEdit) && (<span style={{ paddingBottom: 12 }}>{listmsg ? Object.values(listmsg)[0] : Object.values(classify)[0]}</span>)}
          {taskName === '发布实施准备' && (<span style={{ paddingBottom: 12 }}>{listmsg ? Object.values(listmsg)[0] : Object.values(classify)[0]}</span>)}
          {!isEdit && listmsg && (<span style={{ paddingBottom: 12 }}>{Object.values(listmsg)[0]}</span>)}
        </Col>
        <Col span={8} style={{ textAlign: 'right' }}>
          {isEdit && (
            <>
              {/* {taskName === '业务验证' && (
                <Button
                  type='primary'
                  style={{ marginRight: 8 }}
                  onMouseDown={() => { setChoiceUser({ users: '', ischange: false }); getUserList() }}
                  onClick={() => hadleAssignment('assign')}
                  disabled={newbutton}
                >
                  分派
                </Button>
              )} */}
              {taskName === '业务验证' && (
                <Button
                  type='primary'
                  style={{ marginRight: 8 }}
                  onMouseDown={() => { setChoiceUser({ users: '', ischange: false }); getUserList() }}
                  onClick={() => hadleAssignment('reassignment')}
                  disabled={newbutton}
                >
                  重分派
                </Button>
              )}
              {(taskName === '新建' || taskName === '出厂测试') && (<Button type='primary' style={{ marginRight: 8 }} onClick={() => { newMember() }} disabled={newbutton} >新增</Button>)}
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
              {taskName === '出厂测试' && (
                <Button
                  type='danger'
                  style={{ marginRight: 8 }}
                  ghost
                  onMouseDown={() => { ChangeButtype(''); ChangeaddAttaches(''); }}
                  onClick={() => ortherDelete()}
                >
                  移除
                </Button>
              )}
              {/* {taskName === '版本管理员审核' && (
                <Tooltip placement="topLeft" title="仅能移除同一个发布工单的数据">
                  <Button
                    type='danger'
                    style={{ marginRight: 8 }}
                    ghost
                    onMouseDown={() => { ChangeButtype(''); ChangeaddAttaches(''); }}
                    onClick={() => checkDelete()}
                    disabled={deletebut}
                  >
                    移除
                  </Button>
                </Tooltip>
              )} */}
            </>
          )}
          {taskName !== '新建' && (<Button type='primary' disabled={newbutton} onClick={() => handleDlownd()}>导出清单</Button>)}
        </Col>
      </Row>
      <div id='list'>
        <Table
          columns={isEdit ? columns : viewcolumns}
          dataSource={data}
          bordered
          size='middle'
          rowKey={(record) => record.key}
          pagination={pagination}
          rowSelection={rowSelection}
          scroll={{ x: 1500, }}
          rowClassName={(record, index) => {
            let className = 'light-row';
            if (index % 2 === 1) className = styles.darkRow;
            return className;
          }}
          scrollToFirstRowOnChange
          onChange={TableChange}
        />
      </div>
      {taskName === '新建' && (<Alert message="请先暂存发布清单信息，再保存工单" type="warning" style={{ textAlign: 'center', }} />)}
      <UserContext.Provider value={{ setChoiceUser, uservisible, setUserVisible, title: '分派' }}>
        <CheckOneUser userlist={userlist} />
      </UserContext.Provider>
      <OrderContent data={releaseNoandId} visible={drawervisible} handleChange={v => setDrawerVisible(v)} />
    </>
  );
}

export default connect()(EditeTable);