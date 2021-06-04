import React, { useEffect, useRef, useState, createContext } from 'react';
import {
  Form,
  Button,
  message,
  Collapse,
  Steps,
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import Link from 'umi/link';
import router from 'umi/router';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import User from '@/components/ProblemSelect/User';
import Registrat from './components/Registrat';
import Systemoperatoredit from './components/Systemoperatoredit';
import Developerprocessdit from './components/Developerprocessdit';
import Operatorconfirmaedit from './components/Operatorconfirmaedit';

import Problemsolving from './components/Problemsolving';
import Problemreview from './components/Problemreview';
import Operatorconfirmades from './components/Operatorconfirmades';
import Problemregistration from './components/Problemregistration';
import Reasonregression from './components/Reasonregression';
import Problemflow from './components/Problemflow';
import Systemoperatorsecond from './components/Systemoperatorsecond';

import TimeoutModal from '../components/TimeoutModal';                // 超时信息填写
import { judgeTimeoutStatus, saveTimeoutMsg } from '../services/api'; // 超时接口

import styles from './index.less';

const { Panel } = Collapse;
const { Step } = Steps;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 15 },
  },
};

const forminladeLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 22 },
  },
};

let currntStatus = '';
let showEdit = false;
const saveSign = '';
const circaSign = 'problem';
let problemFlowid;
let flowNodeName;
let fileSign;
let selSign;
let changeOrder = '';

export const FatherContext = createContext();
function Workorder(props) {
  const RegistratRef = useRef();
  const PreviesRef = useRef();
  const HandleRef = useRef();
  const ProblemconfirmRef = useRef();
  const [flowtype, setFlowtype] = useState('1');
  const [uservisible, setUserVisible] = useState(false); // 是否显示选人组件
  //  const [changorder, setChangeOrder] = useState(undefined);
  const [problemHandle, setProblemHandle] = useState('');
  const [userchoice, setUserChoice] = useState(false); // 已经选择人员
  const [butandorder, setButandOrder] = useState('');    // 暂存按钮类型
  const [tabActiveKey, setTabActiveKey] = useState('workorder');
  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表

  const [buttontype, setButtonType] = useState('');
  const [modalvisible, setModalVisible] = useState(false);
  const [modalrollback, setModalRollBack] = useState(false);   // 回退信息modle

  const {
    dispatch,
    todoDetail,
    todoDetail: { check, handle, confirm, register, main },
    newno,
    problemlist,
    handleList,
    keyVallist,
    typelist,
    prioritylist,
    scopeList,
    projectList,
    userinfo,
    loading
  } = props;

  let showback = true;
  if (problemlist.selSign !== undefined) {
    if (flowNodeName === '系统开发商处理') {
      selSign = '0';
    } else {
      selSign = problemlist.selSign
    }
  }

  const { id, taskName, mainId } = props.location.query;

  const { problemFlowLogs, problemFlowNodeRows } = todoDetail;

  const selectNextflow = () => {
    switch (flowNodeName) {
      case '问题登记':
        sessionStorage.setItem('Nextflowmane', '系统运维商审核');
        break;
      case '系统运维商审核':
        sessionStorage.setItem('Nextflowmane', '自动化科审核');
        break;
      case '自动化科审核':
        sessionStorage.setItem('Nextflowmane', '系统开发商处理');
        break;
      case '系统开发商处理':
        sessionStorage.setItem('Nextflowmane', '系统运维商确认');
        break;
      case '系统运维商确认':
        sessionStorage.setItem('Nextflowmane', '自动化科业务负责人确认');
        break;
      case '自动化科业务负责人确认':
        sessionStorage.setItem('Nextflowmane', '问题登记人员确认');
        break;
      default:
        break;
    }
  }

  const solvingDisbled = () => {
    const statueList = (currntStatus === 29 || currntStatus === 9 || currntStatus === 40);
    if (statueList) {
      showEdit = true;
    } else {
      showEdit = false;
    }
  };

  if (todoDetail.main) {
    currntStatus = Number(todoDetail.main.status);
    const editstate = todoDetail.editState;
    problemFlowid = todoDetail.main.id;
    flowNodeName = todoDetail.flowNodeName;
    const backbutton = (currntStatus === 25 || (currntStatus === 65 && editstate === 'edit'));
    if (backbutton) {
      showback = false;
    }
    selectNextflow();
    solvingDisbled();
  }

  const queryDept = () => {
    dispatch({
      type: 'itsmuser/fetchuser',
    });
  }
  const getNewno = () => {
    dispatch({
      type: 'problemmanage/getregisterNo',
    });
  };

  const getInformation = () => {
    dispatch({
      type: 'problemmanage/ToDodetails',
      payload: { id },
    })
  };

  // 表单校验提示信息
  const formerr = () => {
    message.error('请将信息填写完整...');
  };


  const gotoCirapi = (closessign) => {
    let result;
    if (closessign) {
      result = 255
    } else {
      result = flowtype;
    }

    if (flowNodeName === '系统开发商处理' && changeOrder === '') {
      result = 1
    }

    let selectPerson;
    if (flowNodeName === '系统运维商审核' && flowtype === '1') {
      selectPerson = `${sessionStorage.getItem('NextflowUserId')},${sessionStorage.getItem('AutoflowUserId')}`;
    } else {
      selectPerson = sessionStorage.getItem('NextflowUserId');
    }

    return dispatch({
      type: 'problemmanage/gotoCirculation',
      payload: {
        flow: {
          taskId: id,
          result,
          userIds: selectPerson,
        }
      },
    }).then(res => {
      if (res.code === 200) {
        message.success(res.msg);
        router.push({
          pathname: `/ITSM/problemmanage/besolveddetail/workorder`,
          query: {
            mainId,
            closetab: true,
          }
        });
        router.push({
          pathname: `/ITSM/problemmanage/besolved`,
          query: { pathpush: true },
          state: { cache: false }
        })
      } else {
        message.success(res.error);
      }
    })
  };

  const closeOrder = () => {
    const closeWork = '关闭';
    gotoCirapi(closeWork);
  }

  const saveApi = (saveData, params2) => {
    return dispatch({
      type: 'problemmanage/tobeSave',
      payload: { ...saveData },
    }).then(res => {
      if (res.code === 200) {
        showback = false;
        if (!params2) {
          message.success('保存成功');
          getInformation();
        }
        // else {
        //   getInformation();
        // }

        if (params2 && params2 !== '系统开发商处理' && flowtype === '1' && !files.ischange) {
          setUserVisible(true);
        }
        if ((params2 === '系统开发商处理' && changeOrder === '' && !files.ischange)) {
          gotoCirapi();
        }

        if ((params2 && params2 !== '系统开发商处理' && flowtype === '0' && !files.ischange)) {
          gotoCirapi();
        }

      } else {
        message.error(res.msg);
      }
    });
  };

  useEffect(() => {
    if (userchoice || butandorder) {
      gotoCirapi();
    }
  }, [userchoice, butandorder])

  //  问题登记
  const saveRegister = (params2) => {
    RegistratRef.current.validateFields((err, values) => {
      if (params2 ? !err : true) {
        return dispatch({
          type: 'problemmanage/tobeSave',
          payload: {
            ...values,
            registerTime: (values.registerTime).format('YYYY-MM-DD HH:mm:ss'),
            registerOccurTime: (values.registerOccurTime).format('YYYY-MM-DD HH:mm:ss'),
            registerExpectTime: (values.registerExpectTime).format('YYYY-MM-DD HH:mm:ss'),
            taskId: id,
            editState: todoDetail.editState === 'edit' ? 'edit' : 'add',
            registerId: todoDetail.editState === 'edit' ? todoDetail.register.id : todoDetail.editGuid,
            registerAttachments: files.ischange ? JSON.stringify(files.arr) : null
          },
        }).then(res => {
          if (res.code === 200) {
            message.success(res.msg);
            setFiles({ ...files, ischange: false });
            getInformation();
            if (params2) {
              // gotoCirapi();
              setUserVisible(true);
            }
          } else {
            message.error(res.msg);
          }
        });
      }
      if (params2 && uservisible === false) {
        return formerr();
      }

    });
  };

  //  审核保存
  const savePrevies = (params2, uploadSive) => {
    PreviesRef.current.validateFields((err, values) => {
      if (params2 ? !err : true) {
        const saveData = {
          ...values,
          checkTime: values.checkTime ? (values.checkTime).format('YYYY-MM-DD HH:mm:ss') : '',
          taskId: id,
          editState: todoDetail.editState === 'edit' ? 'edit' : 'add',
          checkId: todoDetail.editState === 'edit' ? todoDetail.check.id : todoDetail.editGuid,
          checkType: flowNodeName === '系统运维商审核' ? '1' : '2',
          checkAttachments: files.ischange ? JSON.stringify(files.arr) : null,
          checkOpinion: values.checkOpinion1 || values.checkOpinion2,
          checkOpinion1: '',
          checkOpinion2: ''
        }
        saveApi(saveData, params2, uploadSive);
      }
      if (params2 && err) {
        return formerr();
      }

    });
  };

  //   处理保存
  const saveHandle = (params2, uploadSive) => {

    HandleRef.current.validateFields((err, values) => {
      if (params2 ? !err : true) {
        const saveData = {
          ...values,
          handleTime: values.handleTime ? (values.handleTime).format('YYYY-MM-DD HH:mm:ss') : '',
          orderReceivingtime: values.orderReceivingtime ? (values.orderReceivingtime).format('YYYY-MM-DD HH:mm:ss') : '',
          planEndTime: values.planEndTime ? (values.planEndTime).format('YYYY-MM-DD HH:mm:ss') : '',
          taskId: id,
          editState: todoDetail.editState === 'edit' ? 'edit' : 'add',
          handleId: todoDetail.editState === 'edit' ? todoDetail.handle.id : todoDetail.editGuid,
          handleAttachments: files.ischange ? JSON.stringify(files.arr) : null
        }
        saveApi(saveData, params2, uploadSive);
        if (params2 && changeOrder) {
          setUserVisible(true);
        }
      }
      if (params2 && err) {
        return formerr();
      }
    });
  };


  //  确认保存
  const saveConfirm = (params2, uploadSive) => {
    ProblemconfirmRef.current.validateFields((err, values) => {
      if (params2 ? !err : true) {
        const saveData = {
          ...values,
          taskId: id,
          confirmTime: values.confirmTime.format('YYYY-MM-DD HH:mm:ss'),
          editState: todoDetail.editState === 'edit' ? 'edit' : 'add',
          confirmId: todoDetail.editState === 'edit' ? todoDetail.confirm.id : todoDetail.editGuid,
          confirmAttachments: files.ischange ? JSON.stringify(files.arr) : null,
          confirmContent: values.confirmContent1 || values.confirmContent2,
          confirmContent1: '',
          confirmContent2: ''
        }
        switch (todoDetail.flowNodeName) {
          case '系统运维商确认':
            saveData.confirmType = 1;
            break;
          case '自动化科业务人员确认':
            saveData.confirmType = 2;
            break;
          case '问题登记人员确认':
            saveData.confirmType = 3;
            break;
          default:
            break
        }
        saveApi(saveData, params2, uploadSive);
      }
      if (params2 && uservisible === true) {
        return formerr();
      }
    });
  };

  // 回退
  const reasonSubmit = values => {
    dispatch({
      type: 'problemmanage/tobeBack',
      payload: {
        id,
        values,
        userIds: sessionStorage.getItem('NextflowUserId')
      },
    }).then(res => {
      if (res.code === 200) {
        message.success(res.msg);
        router.push({
          pathname: `/ITSM/problemmanage/besolveddetail/workorder`,
          query: { mainId, closetab: true, }
        });
        router.push({
          pathname: `/ITSM/problemmanage/besolved`,
          query: { pathpush: true, },
          state: { cach: false }
        });
      } else {
        message.error(res.msg);
      }
    });
  };

  const handleDelete = () => {
    const deleteid = todoDetail.main.id;
    dispatch({
      type: 'problemmanage/delete',
      payload: { deleteid },
    }).then(res => {
      if (res.code === 200) {
        message.success(res.msg);
        router.push({
          pathname: `/ITSM/problemmanage/besolveddetail/workorder`,
          query: {
            mainId,
            closetab: true,
          }
        });
        router.push({
          pathname: `/ITSM/problemmanage/besolved`,
          query: { pathpush: true },
          state: { cache: false }
        })
      } else {
        message.error(res.msg);
      }
    });
  };

  const problemHandleOrder = () => {
    return dispatch({
      type: 'problemmanage/problemHandleOrder',
      payload: { id },
    }).then(res => {
      if (res.code === 200) {
        message.success(res.msg);
        showEdit = false;
        currntStatus = 45;
        getInformation();
      } else {
        message.error(res.msg);
      }
    });
  };

  const handleSubmit = (params2, uploadSive) => {
    switch (flowNodeName) {
      case '问题登记':
        saveRegister(params2, uploadSive);
        break;
      case '系统运维商审核':
      case '自动化科审核':
        savePrevies(params2, uploadSive);
        break;
      case '系统开发商处理':
        saveHandle(params2, uploadSive);
        break;
      case '系统运维商确认':
      case '自动化科业务人员确认':
      case '问题登记人员确认':
        saveConfirm(params2, uploadSive);
        break;
      default:
        break;
    }
  };

  // 上传删除附件触发保存
  useEffect(() => {
    fileSign = '附件';
    if (files.ischange) {
      handleSubmit(saveSign, fileSign);
    }
  }, [files]);


  const getUserinfo = () => {
    dispatch({
      type: 'problemmanage/fetchUseinfo',
    });
  };

  const gethandle = () => {
    const dictModule = 'problem';
    const dictType = 'handleresult';
    dispatch({
      type: 'problemdropdown/keyvalsource',
      payload: { dictModule, dictType }
    });
  }

  const getSourceapi = (dictModule, dictType) => {
    dispatch({
      type: 'problemdropdown/keyvalsource',
      payload: { dictModule, dictType }
    });
  }
  //  问题来源
  const getSource = () => {
    const dictModule = 'problem';
    const dictType = 'source';
    getSourceapi(dictModule, dictType);
  }
  //  问题分类
  const gettype = () => {
    const dictModule = 'problem';
    const dictType = 'type';
    getSourceapi(dictModule, dictType);
  }
  //  重要程度
  const getpriority = () => {
    const dictModule = 'public';
    const dictType = 'priority';
    getSourceapi(dictModule, dictType);
  }
  //  影响范围
  const getscope = () => {
    const dictModule = 'public';
    const dictType = 'effect';
    getSourceapi(dictModule, dictType);
  }

  // 所属项目
  const getProject = () => {
    const dictModule = 'public';
    const dictType = 'project';
    getSourceapi(dictModule, dictType);
  }

  const getSelectperson = () => {
    const taskId = id;
    dispatch({
      type: 'itsmuser/problemuserlist',
      payload: {
        taskId,
        result: 1,
      },
    });
  }

  useEffect(() => {
    getInformation();
    getUserinfo();
    getNewno();
    gethandle();
    getSelectperson();
    getSource();
    gettype();
    getpriority();
    getscope();
    getProject();
    queryDept();
    sessionStorage.setItem('Processtype', 'problem');
    sessionStorage.setItem('Nextflowmane', '');
    setTabActiveKey('workorder')
  }, [mainId]);

  useEffect(() => {
    sessionStorage.setItem('flowtype', flowtype);
  }, [flowtype]);

  useEffect(() => {
    if (currntStatus === 45) {
      setFlowtype(9);
    } else {
      setFlowtype('1');
    }
    sessionStorage.setItem('flowtype', flowtype);
  }, [currntStatus]);

  // 监听todoDetail是否已更新
  useEffect(() => {
    if (check) {
      setFlowtype(check.checkResult);
    }
    if (confirm) {
      setFlowtype(confirm.confirmResult);
    }
  }, [todoDetail]);

  const tabList = [
    {
      key: 'workorder',
      tab: '问题工单',
    },
    {
      key: 'process',
      tab: '问题流程',
    },
  ];

  const handleTabChange = (key) => { // tab切换
    setTabActiveKey(key);
  };


  const changeorderFunction = () => {
    changeOrder = '转单';
  }

  const cancelChangeorder = () => {
    changeOrder = ''
  }

  const setChange = () => {
    files.ischange = false;
  }

  // 点击回退,接单,流转、结束
  const onClickSubmit = (buttype) => {
    const taskId = id;
    judgeTimeoutStatus(taskId).then(res => {
      if (res.code === 200 && res.status === 'yes' && res.timeoutMsg === '') {
        message.success('该故问题单已超时，请填写超时原因...')
        setModalVisible(true);
        setButtonType(buttype);
      };
      if (res.code === 200 && ((res.status === 'yes' && res.timeoutMsg !== '') || res.status === 'no')) {
        switch (buttype) {
          case 'accpt':
            problemHandleOrder()
            break;
          case 'goback':
            setModalRollBack(true);
            break;
          case 'flowNodeName':
            handleSubmit(flowNodeName);
            break;
          case 'circaSign':
            handleSubmit(circaSign);
            break;
          default:
            break;
        }
      }
    })
  };

  // 保存超时信息,成功校验表单
  const postTimeOutMsg = (v) => {
    saveTimeoutMsg({
      taskId: id,
      msgType: 'timeout',
      orderId: mainId,
      orderType: 'problem',
      ...v
    }).then(res => {
      if (res.code === 200) {
        switch (buttontype) {
          case 'accpt':
            problemHandleOrder()
            break;
          case 'goback':
            setModalRollBack(true);
            break;
          case 'flowNodeName':
            handleSubmit(flowNodeName);
            break;
          case 'circaSign':
            handleSubmit(circaSign);
            break;
          default:
            break;
        }
      }
    });
  }

  return (
    <PageHeaderWrapper
      title={taskName}
      extra={
        <>
          {tabActiveKey === 'workorder' && (
            <>
              { (flowNodeName === '问题登记' && problemFlowLogs && problemFlowLogs.length === 1) && (
                <Button type="danger" ghost style={{ marginRight: 8 }} onClick={handleDelete}>
                  删除
                </Button>
              )}

              { (flowNodeName === '问题登记' && problemFlowLogs && problemFlowLogs.length >= 3 && problemFlowLogs[problemFlowLogs.length - 2].status === '退回') && (
                <Button type="danger" ghost style={{ marginRight: 8 }} onClick={handleDelete}>
                  删除
                </Button>
              )}

              {
                (flowNodeName === '系统运维商审核' || flowNodeName === '系统运维商确认'
                  || flowNodeName === '自动化科业务人员确认' || flowNodeName === '问题登记人员确认')
                && showback === true && (
                  <Button type="primary" style={{ marginRight: 8 }} onClick={() => onClickSubmit('goback')}>
                    回退
                  </Button>
                )}

              {
                flowNodeName !== '系统开发商处理' && (currntStatus !== 29 && currntStatus !== 40) && tabActiveKey === 'workorder' && (
                  <Button
                    type="primary"
                    style={{ marginRight: 8 }}
                    onClick={() => handleSubmit()}
                  >
                    保存
                  </Button>
                )
              }
              {
                flowNodeName === '系统开发商处理' && (currntStatus !== 29 && currntStatus !== 40 && handle !== undefined) && tabActiveKey === 'workorder' && (
                  <Button
                    type="primary"
                    style={{ marginRight: 8 }}
                    onClick={() => { handleSubmit() }}
                  >
                    保存
                  </Button>
                )
              }
              {
                (currntStatus === 45) && handle !== undefined && (
                  <Button
                    type="primary"
                    style={{ marginRight: 8 }}
                    onClick={() => { changeorderFunction(); onClickSubmit('flowNodeName'); }}
                  >
                    转单
                  </Button>
                )
              }

              { (currntStatus === 29 || currntStatus === 40 || currntStatus === 45) && handle === undefined && (
                <Button type="primary" style={{ marginRight: 8 }} onClick={() => onClickSubmit('accpt')}>
                  接单
                </Button>
              )}

              {
                flowtype === '1' &&
                (selSign === '1') &&
                tabActiveKey === 'workorder' && loading === false &&
                (
                  <Button
                    type="primary"
                    style={{ marginRight: 8 }}
                    onFocus={() => 0}
                    onClick={() => { onClickSubmit('circaSign'); setProblemHandle('handle'); setChange() }}>
                    流转
                  </Button>
                )
              }

              {
                flowNodeName === '问题登记' && (problemFlowLogs && problemFlowLogs.length > 2) && (
                  <Button
                    type='primary'
                    onClick={closeOrder}
                  >
                    关闭工单
                  </Button>
                )
              }

              {
                (
                  flowtype === '0'
                )
                &&
                (flowNodeName !== '系统开发商处理' && flowNodeName !== '问题登记') && loading === false &&
                (currntStatus !== 29 && currntStatus !== 40) &&
                tabActiveKey === 'workorder' &&
                (
                  <Button
                    type="primary"
                    style={{ marginRight: 8 }}
                    onClick={() => { onClickSubmit('flowNodeName') }}
                  >
                    {
                      (flowNodeName === '自动化科审核' || flowNodeName === '系统运维商审核')
                        ? '重新登记' : '重新处理'}
                  </Button>
                )
              }
              {
                selSign === '0' && flowtype === '1' && flowNodeName !== '系统开发商处理' && loading === false && (
                  <Button
                    type="primary"
                    style={{ marginRight: 8 }}
                    onClick={() => { handleSubmit(); setButandOrder('end') }}
                  >
                    {
                      flowNodeName === '问题登记人员确认' ? '结束' : '流转'
                    }
                  </Button>
                )
              }
              {
                (
                  flowtype === '0' ||
                  (problemlist && selSign === '0')
                )
                && handle !== undefined && loading === false &&
                flowNodeName === '系统开发商处理' &&
                (currntStatus !== 29 && currntStatus !== 40) &&
                tabActiveKey === 'workorder' &&
                (
                  <Button
                    type="primary"
                    style={{ marginRight: 8 }}
                    onClick={() => { cancelChangeorder(); onClickSubmit('flowNodeName') }}
                  >
                    流转
                  </Button>
                )
              }
            </>
          )}
          <Button type="default">
            <Link
              to={{
                pathname: '/ITSM/problemmanage/besolved',
                query: { pathpush: true },
                state: { cache: false }
              }}
            >
              返回
                </Link>
          </Button>
        </>
      }
      tabList={tabList}
      onTabChange={handleTabChange}
      tabActiveKey={tabActiveKey}
    >
      {/* 编辑页 */}
      {
        (tabActiveKey === 'workorder' && todoDetail &&
          <>
            <div className={styles.collapse}>
              {problemFlowLogs && (
                <Steps
                  current={problemFlowLogs.length - 1}
                  size="small"
                  style={{
                    background: '#fff',
                    padding: 24,
                    border: '1px solid #e8e8e8',
                    overflowX: 'auto',
                    marginBottom: 24
                  }}
                >
                  {
                    problemFlowLogs && problemFlowLogs.map(({ key, name, status, timeText, formHandler, startTime }) => [
                      name !== '开始节点' && name !== '结束节点' && <Step key={key} title={`${name}${'\xa0'}${'\xa0'}(${status})${'\xa0'}${'\xa0'}${timeText}`} description={
                        <div className={styles.stepDescription}>
                          处理人：{formHandler}
                          <div>结束时间：{moment(startTime).format('YYYY-MM-DD HH:mm:ss')}</div>
                        </div>
                      } />
                    ])}
                </Steps>
              )
              }
            </div>

            <div className={styles.collapse}>
              <Collapse
                expandIconPosition="right"
                defaultActiveKey={['1']}
                bordered={false}
              >
                {
                  (currntStatus === 5 || currntStatus === 0) && loading === false && (
                    <Panel
                      header="问题登记"
                      key='1'
                      style={{ backgroundColor: 'white' }}
                    >
                      <Registrat
                        formItemLayout={formItemLayout}
                        forminladeLayout={forminladeLayout}
                        ref={RegistratRef}
                        registerno={newno}
                        useInfo={userinfo}
                        register={register}
                        main={main}
                        // location={location}
                        files={
                          todoDetail.register !== undefined && todoDetail.register.registerAttachments ? JSON.parse(todoDetail.register.registerAttachments) : []
                        }
                        ChangeFiles={newvalue => {
                          setFiles(newvalue);
                        }}
                        source={keyVallist.source}
                        type={typelist.type}
                        priority={prioritylist.priority}
                        scope={scopeList.effect}
                        project={projectList.project}
                      />
                    </Panel>
                  )
                }

                {
                  flowNodeName === '系统运维商审核' && loading === false && (
                    <Panel
                      header="系统运维商审核环节"
                      key='1'
                      style={{ backgroundColor: 'white' }}
                    >
                      <FatherContext.Provider value={{ flowtype, setFlowtype }}>
                        <Systemoperatoredit
                          formItemLayout={formItemLayout}
                          forminladeLayout={forminladeLayout}
                          ref={PreviesRef}
                          useInfo={userinfo}
                          check={check}
                          loading={loading}
                          flowNodeName={flowNodeName}
                          allInfo={todoDetail}
                          files={
                            todoDetail.check !== undefined && todoDetail.check.checkAttachments ? JSON.parse(todoDetail.check.checkAttachments) : []
                          }
                          ChangeFiles={newvalue => {
                            setFiles(newvalue);
                          }}
                        // location={location}
                        />
                      </FatherContext.Provider>
                    </Panel>
                  )
                }

                {
                  flowNodeName === '自动化科审核' && loading === false && (
                    <Panel
                      header="自动化科审核"
                      key='1'
                      style={{ backgroundColor: 'white' }}
                    >
                      <FatherContext.Provider value={{ flowtype, setFlowtype }}>
                        <Systemoperatoredit
                          formItemLayout={formItemLayout}
                          forminladeLayout={forminladeLayout}
                          ref={PreviesRef}
                          useInfo={userinfo}
                          check={check}
                          loading={loading}
                          flowNodeName={flowNodeName}
                          allInfo={todoDetail}
                          files={
                            todoDetail.check !== undefined && todoDetail.check.checkAttachments ? JSON.parse(todoDetail.check.checkAttachments) : []
                          }
                          ChangeFiles={newvalue => {
                            setFiles(newvalue);
                          }}
                        />
                      </FatherContext.Provider>

                    </Panel>
                  )
                }

                {
                  flowNodeName === '系统开发商处理' && handle !== undefined && loading === false && (
                    <Panel
                      header='系统开发商处理'
                      key='1'
                      style={{ backgroundColor: 'white' }}
                    >
                      <Developerprocessdit
                        formItemLayout={formItemLayout}
                        forminladeLayout={forminladeLayout}
                        showEdit={showEdit}
                        ref={HandleRef}
                        useInfo={userinfo}
                        handle={handle}
                        handleresult={handleList.handleresult}
                        files={
                          todoDetail.handle !== undefined && todoDetail.handle.handleAttachments ? JSON.parse(todoDetail.handle.handleAttachments) : []
                        }
                        ChangeFiles={newvalue => {
                          setFiles(newvalue);
                        }}
                        loading={loading}
                      />
                    </Panel>
                  )
                }

                {
                  flowNodeName === '系统运维商确认' && loading === false && (
                    <Panel
                      header='系统运维商确认'
                      key='1'
                      style={{ backgroundColor: 'white' }}
                    >
                      <FatherContext.Provider value={{ flowtype, setFlowtype }}>
                        <Systemoperatorsecond
                          formItemLayout={formItemLayout}
                          forminladeLayout={forminladeLayout}
                          showEdit={showEdit}
                          ref={ProblemconfirmRef}
                          useInfo={userinfo}
                          handle={confirm}
                          flowNodeName={flowNodeName}
                          files={
                            todoDetail.confirm !== undefined && todoDetail.confirm.confirmAttachments ? JSON.parse(todoDetail.confirm.confirmAttachments) : []
                          }
                          ChangeFiles={newvalue => {
                            setFiles(newvalue);
                          }}
                          loading={loading}
                          confirm={confirm}
                        />
                      </FatherContext.Provider>
                    </Panel>
                  )
                }

                {
                  flowNodeName === '自动化科业务人员确认' && loading === false && (
                    <Panel
                      header='自动化科业务负责人确认'
                      key='1'
                      style={{ backgroundColor: 'white' }}
                    >
                      <FatherContext.Provider value={{ flowtype, setFlowtype }}>
                        <Systemoperatorsecond
                          formItemLayout={formItemLayout}
                          forminladeLayout={forminladeLayout}
                          showEdit={showEdit}
                          ref={ProblemconfirmRef}
                          useInfo={userinfo}
                          confirm={confirm}
                          flowNodeName={flowNodeName}
                          files={
                            todoDetail.confirm !== undefined && todoDetail.confirm.confirmAttachments ? JSON.parse(todoDetail.confirm.confirmAttachments) : []
                          }
                          ChangeFiles={newvalue => {
                            setFiles(newvalue);
                          }}
                          loading={loading}
                        />
                      </FatherContext.Provider>

                    </Panel>
                  )
                }

                {
                  flowNodeName === '问题登记人员确认' && loading === false && (
                    <Panel
                      header='问题登记人员确认'
                      key='1'
                      style={{ backgroundColor: 'white' }}
                    >
                      <FatherContext.Provider value={{ flowtype, setFlowtype }}>
                        <Operatorconfirmaedit
                          formItemLayout={formItemLayout}
                          forminladeLayout={forminladeLayout}
                          showEdit={showEdit}
                          ref={ProblemconfirmRef}
                          useInfo={userinfo}
                          handle={confirm}
                          flowNodeName={flowNodeName}
                          files={
                            todoDetail.confirm !== undefined && todoDetail.confirm.confirmAttachments ? JSON.parse(todoDetail.confirm.confirmAttachments) : []
                          }
                          ChangeFiles={newvalue => {
                            setFiles(newvalue);
                          }}
                          confirm={confirm}
                          loading={loading}
                        />
                      </FatherContext.Provider>
                    </Panel>
                  )
                }
              </Collapse>
            </div>

            <div className={styles.collapse}>
              {problemFlowNodeRows && loading === false && (
                <Collapse
                  expandIconPosition="right"
                  bordered={false}
                  defaultActiveKey={['0']}
                >
                  {problemFlowNodeRows.map((obj, index) => {
                    // panel详情组件
                    const Paneldesmap = new Map([
                      ['问题登记', <Problemregistration
                        info={obj}
                        statue={currntStatus}
                        problemFlowNodeRows={problemFlowNodeRows}
                        main={main}
                        key='0'
                      />],
                      ['系统运维商审核', <Problemreview
                        info={obj}
                        main={main}

                      />],
                      ['自动化科审核', <Problemreview
                        info={obj}
                        main={main}
                      />],
                      ['系统开发商处理', <Problemsolving
                        info={obj}
                        main={main}
                      />],
                      ['系统运维商确认', <Operatorconfirmades
                        info={obj}
                        main={main}
                      />],
                      ['自动化科业务人员确认', <Operatorconfirmades
                        info={obj}
                        main={main}
                      />],
                      ['问题登记人员确认', <Operatorconfirmades
                        info={obj}
                        main={main}
                      />],
                    ]);
                    return (
                      <Panel Panel header={obj.fnname} key={index}>
                        {Paneldesmap.get(obj.fnname)}
                      </Panel>
                    );
                  })}
                </Collapse>
              )}
            </div>
          </>
        )
      }

      {
        (tabActiveKey === 'process' && (
          <Problemflow id={problemFlowid} />
        ))
      }
      <User
        taskId={id}
        visible={uservisible}
        ChangeUserVisible={v => setUserVisible(v)}
        changorder={undefined}
        ChangeChoice={v => setUserChoice(v)}
        currentPeocess={flowNodeName}
        ChangeType={() => 0}
      />
      <TimeoutModal
        modalvisible={modalvisible}
        ChangeModalVisible={v => setModalVisible(v)}
        ChangeTimeOutMsg={v => postTimeOutMsg(v)}
      />
      <Reasonregression
        title="填写回退意见"
        visible={modalrollback}
        ChangeVisible={v => setModalRollBack(v)}
        rollbackSubmit={v => reasonSubmit(v)}
      />
    </PageHeaderWrapper>
  );
}
export default Form.create({})(
  connect(({ problemmanage, demandtodo, itsmuser, problemdropdown, loading }) => ({
    todoDetail: problemmanage.todoDetail,
    reviewInfo: problemmanage.reviewInfo,
    eventtableList: problemmanage.eventtableList,
    solvingInfo: problemmanage.solvingInfo,
    confirmInfo: problemmanage.confirmInfo,
    counterInfo: problemmanage.counterInfo,
    closeInfo: problemmanage.closeInfo,
    newno: problemmanage.newno,
    useInfo: problemmanage.useInfo,
    handleList: problemdropdown.handleList,
    info: demandtodo.info,
    problemlist: itsmuser.problemlist,
    userinfo: itsmuser.userinfo,
    keyVallist: problemdropdown.keyVallist,
    typelist: problemdropdown.typelist,
    prioritylist: problemdropdown.prioritylist,
    scopeList: problemdropdown.scopeList,
    projectList: problemdropdown.projectList,
    loading: loading.models.problemmanage,
  }))(Workorder),
);
