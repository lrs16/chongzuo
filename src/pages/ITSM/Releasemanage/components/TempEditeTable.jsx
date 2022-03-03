import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Table, Row, Button, Col, Cascader, Input, Radio, message, Divider, Select, Alert, Popconfirm } from 'antd';
import UserContext from '@/layouts/MenuContext';
import { dispatchBizUsers, dispatchPlatsers } from '@/services/user';
import { querkeyVal } from '@/services/api';
import styles from '../index.less';
import { releaseListEdit, releaseListsDownload } from '../services/temp';                   // 版本管理员审批清单添加编辑

const { TextArea } = Input;
const InputGroup = Input.Group;
const RadioGroup = Radio.Group;
const { Option } = Select;

function EditeTable(props) {
  const { title, functionmap, modulamap, isEdit, taskName, dataSource, ChangeValue, listmsg } = props;
  const [data, setData] = useState([]);
  const [newbutton, setNewButton] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [userlist, setUserList] = useState([]);
  const [formValiduser, setFormValiduser] = useState([]);
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 5 });
  const [selectdata, setSelectData] = useState([]); // 下拉值
  const [visible, setVisible] = useState(false);
  const [reviewResult, setReviewResult] = useState(null);
  const [rowKey, setRowKey] = useState(0)
  const { ChangeButtype, taskId, location, getSelectedRecords, clearselect } = useContext(UserContext);

  // 新增一条记录
  const newMember = () => {
    const newData = data.map((item, index) => ({ ...item, key: (index + 1).toString() }));
    newData.push({
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
      tempRegisterResult: '通过',
      developer: '',
      developerId: '',
      addStatus: taskName === '新建' ? 'add' : taskId,
      verifyStatus: '',
      operator: sessionStorage.getItem('userName'),
      operatorId: sessionStorage.getItem('userauthorityid'),
      editable: false,
      isNew: true,
    });
    setData(newData);
    setPageinations({ current: Math.ceil(newData.length / 5), pageSize: 5 });
    setNewButton(true);
    setTimeout(() => {
      const tableBox = document.getElementsByClassName('ant-table-body')[0];
      const scrollheight = tableBox?.scrollHeight;
      const height = tableBox?.clientHeight || 150;
      if (tableBox && scrollheight - height > 0) { tableBox.scrollTop = scrollheight - height; }
    }, 100);

    setTimeout(() => {
      const isaddTr = document.getElementsByTagName('firstRow');
      const tableTr = document.getElementsByClassName('ant-table-fixed')[3]?.getElementsByClassName('ant-table-tbody')[0].getElementsByTagName('tr');
      if (tableTr && isaddTr) { tableTr[tableTr.length - 1].style.height = '145px' }
    }, 300)
  };

  const onSelectChange = (RowKeys, record) => {
    setSelectedRowKeys(RowKeys);
    setSelectedRecords(record);
    if (getSelectedRecords) {
      getSelectedRecords(record)
    }
  };

  useEffect(() => {
    if (clearselect) {
      setSelectedRowKeys([]);
      setSelectedRecords([]);
    }
  }, [clearselect])

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
    });
    if (taskName === '平台验证' || taskName === '发布验证') {
      dispatchPlatsers().then(res => {
        setFormValiduser(res?.data?.userList || [])
      })
    }
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
      target.taskId = taskId;
      if (taskName === '科室负责人审核') {
        target.tempDirector = sessionStorage.getItem('userName');
      };
      if (taskName === '业务复核') {
        target.tempReviewVerifier = sessionStorage.getItem('userName');
      };
      setData(newData);
      if (target.verification || target.depaudit || target.validate) {
        ChangeValue(newData);
        releaseListEdit({ taskId, itsmReleaseList: newData });
      };
      if (target.review) {
        ChangeValue(newData);
        releaseListEdit({ taskId, itsmReleaseList: newData });
        const allreview = newData.filter(item => !item.tempReviewResult);
        if (allreview.length === 0) {
          ChangeButtype('submit')
        }
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
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData) || {};
    if (!target.module || !target.abilityType || !target.module || !target.appName || !target.problemType || !target.testMenu || !target.testResult || !target.testStep || !target.developer || !target.responsible || !target.responsibleId) {
      message.error('请填写完整的发布清单信息');
      e.target.focus();
      return;
    };
    if (target && (target.isNew || target.editable)) {
      target.isNew = false;
      target.editable = false;
      setNewButton(false)
      newData.sort((a, b) => a.key - b.key);
      setData(newData);
      setPageinations({ current: Math.ceil(newData.length / 5), pageSize: 5 });
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
    const newData = dataSource.map((item, index) => ({
      ...item,
      editable: false,
      key: (index + 1).toString(),
    }));
    setData(newData);
    setNewButton(false);
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
    const newData = arr.map((item, index) => ({ ...item, key: (index + 1).toString() }));
    setData(newData);
    ChangeValue(newData);
    setSelectedRowKeys([]);
    if (taskName !== '新建' && !newbutton) {
      ChangeButtype('save');
    }
  };


  useEffect(() => {
    if (dataSource && dataSource.length > 0) {
      const newData = dataSource.map((item, index) => ({
        ...item,
        editable: false,
        verification: taskName === '平台验证',
        depaudit: taskName === '科室负责人审核',
        validate: taskName === '发布验证',
        review: taskName === '业务复核',
        key: (index + 1).toString(),
      }));
      setData(newData);
      setNewButton(false);
      setSelectedRowKeys([]);
      setSelectedRecords([]);
    };
  }, [dataSource])

  useEffect(() => {
    if (taskName === '新建' && location && location.state && (location.state.cache || location.state.reset)) {
      setData([]);
    }
  }, [location]);
  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        const morepop = document.getElementsByClassName('ant-popover');
        if (morepop[0]) { morepop[0].style.display = 'none' }
      }, 50)
    }
  }, [visible])

  useEffect(() => {
    getUserList();
    querkeyVal('public', 'devdirector').then(res => {
      if (res.code === 200) {
        setSelectData(res.data.devdirector)
      }
    });
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
    {
      title: '功能类型',
      dataIndex: 'abilityType',
      key: 'abilityType',
      width: 150,
      render: (text, record) => {
        if (record.isNew || record.editable) {
          return (
            <div className={!text ? styles.requiredform : ''}>
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
            <div className={!text ? styles.requiredselect : ''}>
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
      width: 130,
      render: (text, record) => {
        if (record.isNew || record.editable) {
          return (
            <div className={!text ? styles.requiredform : ''}>
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
      width: 120,
      render: (text, record) => {
        if (record.isNew || record.editable) {
          return (
            <div className={!text ? styles.requiredform : ''}>
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
      width: 370,
      render: (text, record) => {
        // const w = width - 80;
        if (record.isNew || record.editable) {
          const w = (window.document?.getElementById('textbox')?.offsetWidth || 350) - 80
          return (
            <div id='textbox'>
              <div className={!record.testMenu ? styles.requiredform : ''}>
                <InputGroup compact style={{ marginBottom: 12 }}>
                  <span style={{ width: 70, textAlign: 'right', paddingTop: 4 }}>功能菜单：</span>
                  <TextArea
                    defaultValue={record.testMenu}
                    autoSize
                    style={{ width: w }}
                    onChange={e => handleFieldChange(e.target.value, 'testMenu', record.key)}
                  />
                </InputGroup>
              </div>
              <div className={!record.testResult ? styles.requiredform : ''}>
                <InputGroup compact style={{ marginBottom: 12 }}>
                  <span style={{ width: 70, textAlign: 'right', paddingTop: 4 }}>预期效果：</span>
                  <TextArea
                    defaultValue={record.testResult}
                    autoSize
                    style={{ width: w }}
                    onChange={e => handleFieldChange(e.target.value, 'testResult', record.key)}
                  />
                </InputGroup>
              </div>
              <div className={!record.testStep ? styles.requiredform : ''} >
                <InputGroup compact>
                  <span style={{ width: 70, textAlign: 'right', paddingTop: 4 }}>验证步骤：</span>
                  <TextArea
                    defaultValue={record.testStep}
                    autoSize
                    style={{ width: w }}
                    onChange={e => handleFieldChange(e.target.value, 'testStep', record.key)}
                  />
                </InputGroup>
              </div>
            </div>
          )
        }
        return (
          <div >
            <InputGroup compact>
              <div style={{ position: 'relative' }}>
                <div style={{ width: 70, textAlign: 'right', position: 'absolute', left: 0, top: 0 }}>功能菜单：</div>
                <div style={{ marginLeft: 70 }} dangerouslySetInnerHTML={{ __html: record.testMenu?.replace(/[\n]/g, '<br/>') }} />
              </div>
            </InputGroup>
            <Divider type='horizontal' style={{ margin: '6px 0' }} />
            <InputGroup compact>
              <div style={{ position: 'relative' }}>
                <div style={{ width: 70, textAlign: 'right', position: 'absolute', left: 0, top: 0 }}>预期效果：</div>
                <div style={{ marginLeft: 70 }} dangerouslySetInnerHTML={{ __html: record.testResult?.replace(/[\n]/g, '<br/>') }} />
              </div>
            </InputGroup>
            <Divider type='horizontal' style={{ margin: '6px 0' }} />
            <InputGroup compact>
              <div style={{ position: 'relative' }}>
                <div style={{ width: 70, textAlign: 'right', position: 'absolute', left: 0, top: 0 }}>验证步骤：</div>
                <div style={{ marginLeft: 70 }} dangerouslySetInnerHTML={{ __html: record.testStep?.replace(/[\n]/g, '<br/>') }} />
              </div>
            </InputGroup>
          </div>
        );
      }
    },
    {
      title: '出厂测试结果',
      dataIndex: 'tempRegisterResult',
      key: 'tempRegisterResult',
      width: 120,
      render: (text, record) => {
        if ((record.isNew || record.editable) && isEdit) {
          return (
            <div id='firstRow'>
              <RadioGroup value={text} onChange={e => handleFieldChange(e.target.value, 'tempRegisterResult', record.key)}>
                <Radio value='通过'>通过</Radio>
                <Radio value='不通过'>不通过</Radio>
              </RadioGroup>
            </div>
          )
        }
        return <div style={{ textAlign: 'center' }}>{text}</div>;
      }
    },
    {
      title: '研发测试人员',
      dataIndex: 'developer',
      key: 'developer',
      width: 120,
      render: (text, record) => {
        if (record.isNew || record.editable) {
          return (
            <div className={text ? '' : styles.requiredselect}>
              <Select
                placeholder="请选择"
                mode="multiple"
                onChange={v => {
                  let val = ''
                  if (v && v.length && v.length > 0) {
                    val = v.toString(',')
                  };
                  handleFieldChange(val, 'developer', record.key)
                }}
                defaultValue={text ? text.split(',') : []}
              >
                {selectdata && selectdata.length && selectdata.map(obj => [
                  <Option key={obj.key} value={obj.val}>
                    {obj.val}
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
      title: '业务负责人',
      dataIndex: 'responsible',
      key: 'responsible',
      align: 'center',
      width: 100,
      render: (text, record) => {
        if ((record.isNew || record.editable) && isEdit) {
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
              <Button type='link' onMouseDown={() => ChangeButtype('')} onClick={e => saveRow(e, record.key)}>{taskName === '新建' ? '暂存' : '保存'}</Button>
              <Button type='link' onClick={e => newcancel(e, record.key)}>取消</Button>
            </>
          );
        } if (record.editable) {
          return (
            <>
              <Button type='link' onMouseDown={() => ChangeButtype('')} onClick={e => saveRow(e, record.key)}>保存</Button>
              <Button type='link' onClick={e => cancel(e, record.key)}>取消</Button>
            </>
          );
        }
        return (
          <>
            {(taskName === '新建' || taskName === '出厂测试') && userid === record.operatorId && !newbutton && (<Button type='link' onClick={e => editRow(e, record.key)}>编辑</Button>)}
          </>
        )
      },
    }
  ];

  const platform = [
    {
      title: `平台验证结果`,
      dataIndex: 'tempPlatformResult',
      key: 'tempPlatformResult',
      fixed: taskName === '平台验证' ? 'right' : '',
      width: 120,
      render: (text, record) => {
        if (record.verification && isEdit) {
          return (
            <div id='firstRow'>
              <RadioGroup value={text} onChange={e => handleFieldChange(e.target.value, 'tempPlatformResult', record.key)}>
                <Radio value='通过'>通过</Radio>
                <Radio value='不通过'>不通过</Radio>
              </RadioGroup>
            </div>
          )
        }
        return <div style={{ textAlign: 'center' }}>{text}</div>;
      }
    },
    {
      title: '平台验证人',
      dataIndex: 'tempPlatformVerifier',
      key: 'tempPlatformVerifier',
      align: 'center',
      fixed: taskName === '平台验证' ? 'right' : '',
      width: 120,
      render: (text, record) => {
        if (record.verification && isEdit) {
          return (
            <div className={text ? '' : styles.requiredselect}>
              <Select
                placeholder="请选择"
                mode="multiple"
                onChange={v => {
                  let val = ''
                  if (v && v.length && v.length > 0) {
                    val = v.toString(',')
                  };
                  handleFieldChange(val, 'tempPlatformVerifier', record.key)
                }}
                defaultValue={text ? text.split(',') : []}
              >
                {formValiduser && formValiduser.length && formValiduser.map(obj => [
                  <Option key={obj.userId} value={obj.userName}>
                    {obj.userName}
                  </Option>,
                ])}
              </Select>
            </div>
          )
        }
        return <>{text}</>
      }
    }
  ];

  const DirectorResult = [
    {
      title: '科室审核结果',
      dataIndex: 'tempDirectorResult',
      key: 'tempDirectorResult',
      fixed: taskName === '科室负责人审核' ? 'right' : '',
      width: 120,
      render: (text, record) => {
        if (record.depaudit && isEdit) {
          return (
            <RadioGroup value={text} onChange={e => handleFieldChange(e.target.value, 'tempDirectorResult', record.key)}>
              <Radio value='通过'>通过</Radio>
              <Radio value='不通过'>不通过</Radio>
            </RadioGroup>
          )
        }
        return <div style={{ textAlign: 'center' }}>{text}</div>;
      }
    },
    {
      title: '科室审核人',
      dataIndex: 'tempDirector',
      key: 'tempDirector',
      align: 'center',
      fixed: taskName === '科室负责人审核' ? 'right' : '',
      width: 100,
    }
  ];

  const ValidateResult = [
    {
      title: '发布验证结果',
      dataIndex: 'tempValidateResult',
      key: 'tempValidateResult',
      fixed: taskName === '发布验证' ? 'right' : '',
      width: 120,
      render: (text, record) => {
        if (record.validate && isEdit) {
          return (
            <RadioGroup value={text} onChange={e => handleFieldChange(e.target.value, 'tempValidateResult', record.key)}>
              <Radio value='通过'>通过</Radio>
              <Radio value='不通过'>不通过</Radio>
            </RadioGroup>
          )
        }
        return <div style={{ textAlign: 'center' }}>{text}</div>;
      }
    },
    {
      title: '发布验证人',
      dataIndex: 'tempValidateVerifier',
      key: 'tempValidateVerifier',
      align: 'center',
      fixed: taskName === '发布验证' ? 'right' : '',
      width: 120,
      render: (text, record) => {
        if (record.validate && isEdit) {
          return (
            <div className={text ? '' : styles.requiredselect}>
              <Select
                placeholder="请选择"
                mode="multiple"
                onChange={v => {
                  let val = ''
                  if (v && v.length && v.length > 0) {
                    val = v.toString(',')
                  };
                  handleFieldChange(val, 'tempValidateVerifier', record.key)
                }}
                defaultValue={text ? text.split(',') : []}
              >
                {formValiduser && formValiduser.length && formValiduser.map(obj => [
                  <Option key={obj.userId} value={obj.userName}>
                    {obj.userName}
                  </Option>,
                ])}
              </Select>
            </div >
          )
        }
        return <>{text}</>
      }
    }
  ];

  const ReviewResult = [
    {
      title: '业务复核结果',
      dataIndex: 'tempReviewResult',
      key: 'tempReviewResult',
      fixed: taskName === '业务复核' ? 'right' : '',
      width: 120,
      render: (text, record) => {
        if (record.review && isEdit) {
          return (
            <>
              {rowKey === Number(record.key) ? (
                <Popconfirm
                  title="该清单不属于您的功能业务复核，是否确定复核？"
                  onConfirm={() => { setVisible(false); handleFieldChange(reviewResult, 'tempReviewResult', record.key) }}
                  visible={visible}
                  onCancel={() => setVisible(false)}
                  placement="leftTop"
                  key={record.key}
                >
                  <RadioGroup
                    value={text}
                    onMouseDown={() => { setVisible(false); setReviewResult(null); }}
                    onChange={e => {
                      if (record.responsible !== sessionStorage.getItem('userName')) {
                        setVisible(true);
                        setReviewResult(e.target.value);
                      } else {
                        handleFieldChange(e.target.value, 'tempReviewResult', record.key)
                      }
                    }}
                  >
                    <Radio value='通过'>通过</Radio>
                    <Radio value='不通过'>不通过</Radio>
                  </RadioGroup>
                </Popconfirm>) : (
                <RadioGroup value={text}>
                  <Radio value='通过'>通过</Radio>
                  <Radio value='不通过'>不通过</Radio>
                </RadioGroup>
              )}
            </>
          )
        }
        return <div style={{ textAlign: 'center' }}>{text}</div>;
      }
    },
    {
      title: '业务复核人',
      dataIndex: 'tempReviewVerifier',
      key: 'tempReviewVerifier',
      align: 'center',
      fixed: taskName === '业务复核' ? 'right' : '',
      width: 100,
    }
  ];

  const sclicecolumns = (arr) => {
    const newarr = (arr || column).slice(0);
    newarr.pop();
    return newarr;
  };

  const addorderid = (arr) => {
    let newArr;
    switch (taskName) {
      case '新建':
      case '出厂测试':
        newArr = arr;
        break;
      case '平台验证': {
        const newarr = sclicecolumns(arr);
        newArr = [...newarr, ...platform];
        break;
      }
      case '科室负责人审核':
      case '版本管理员审核':
      case '自动化科审核':
      case '中心领导审核':
        {
          const newarr = sclicecolumns(arr);
          newArr = [...newarr, ...platform, ...DirectorResult];
          break;
        }
      case '发布验证': {
        const newarr = sclicecolumns(arr);
        newArr = [...newarr, ...platform, ...DirectorResult, ...ValidateResult];
        break;
      }
      case '业务复核':
      case '结束': {
        const newarr = sclicecolumns(arr);
        newArr = [...newarr, ...platform, ...DirectorResult, ...ValidateResult, ...ReviewResult];
        break;
      }
      default:
        break;
    };
    return newArr
  };
  const columns = addorderid(column);
  const viewcolumns = sclicecolumns(columns);

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
  };

  const setTableHeight = () => {
    let height = 500;
    const clientHeight = window.document?.body?.clientHeight || 500;
    const tableHeight = window.document.getElementById('list')?.offsetHeight;
    if (tableHeight && tableHeight > 235 && clientHeight - 320 < tableHeight) {
      height = clientHeight - 320
    } else {
      height = null
    };
    return height
  }

  return (
    <>
      <h4 style={{ fontSize: '1.1em' }}>
        {(taskName === '新建' || taskName === '出厂测试' || taskName === '平台验证' || taskName === '科室负责人审核' || taskName === '业务验证') && (
          <span style={{ color: '#f5222d', marginRight: 4, fontWeight: 'normal' }}>*</span>
        )}
        {title}
      </h4>
      <Row style={{ marginBottom: 8 }} type='flex' align='bottom' >
        <Col span={16}>{listmsg}</Col>
        <Col span={8} style={{ textAlign: 'right' }}>
          {isEdit && (
            <>
              {(taskName === '新建' || taskName === '出厂测试') && (
                <>
                  <Button
                    type='primary'
                    style={{ marginRight: 8 }}
                    onClick={() => { newMember() }}
                    disabled={newbutton}
                  >
                    新增
                  </Button>
                  <Button
                    type='danger'
                    style={{ marginRight: 8 }}
                    ghost
                    onMouseDown={() => ChangeButtype('')}
                    onClick={() => handleDelete()}
                    disabled={newbutton}
                  >
                    移除
                  </Button>
                </>)}
            </>
          )}
          {taskName !== '新建' && (<Button type='primary' disabled={newbutton} onClick={() => handleDlownd()}>导出清单</Button>)}
        </Col>
      </Row>
      <div id='list'>
        <Table
          columns={!isEdit && (taskName === '出厂测试' || taskName === '新建') ? viewcolumns : columns}
          dataSource={data}
          bordered
          size='middle'
          rowKey={(record) => record.key}
          pagination={pagination}
          rowSelection={rowSelection}
          scroll={{ x: 1500, y: setTableHeight() }}
          rowClassName={(record, index) => {
            let className = 'light-row';
            if (index % 2 === 1) className = styles.darkRow;
            return className;
          }}
          onRow={record => {
            return {
              onMouseEnter: e => { e.preventDefault(); setRowKey(Number(record.key)); setVisible(false) },
            };
          }}
          scrollToFirstRowOnChange
        />
      </div>
      {taskName === '新建' && (<Alert message="请先暂存发布清单信息，再保存工单" type="warning" style={{ textAlign: 'center', }} />)}
    </>
  );
}

export default connect()(EditeTable);