import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import {
  Card,
  Form,
  Button,
  Steps,
  Collapse,
  Popconfirm,
  message,
  Spin,
  Modal
} from 'antd';

import { PageHeaderWrapper } from '@ant-design/pro-layout';
import FaultEditContext from '@/layouts/MenuContext';
import User from '@/components/SelectUser/User';
import styles from './index.less';
import ModelRollback from './components/ModelRollback'; // 回退组件

// 各个子组件
import RegisterChild from './components/RegisterChild'; // 故障登记
// import ExamineChild from './components/ExamineChild'; // 系统运维商审核
import HandleChild from './components/HandleChild'; // 系统运维商处理
import SummaryChild from './components/SummaryChild'; // 系统运维商总结
import ExamineSecondChild from './components/ExamineSecondChild'; // 自动化科业务负责人审核
import ConfirmChild from './components/ConfirmChild'; // 自动化科专责确认

// 故障查询详情子组件
import RegisterQuery from './components/RegisterQuery'; // 故障登记
import ExamineQuery from './components/ExamineQuery'; // 系统运维商审核
import HandleQuery from './components/HandleQuery'; // 系统运维商处理
import SummaryQuery from './components/SummaryQuery'; // 系统运维商总结
import ExamineSecondQuery from './components/ExamineSecondQuery'; // 自动化科业务负责人审核
import ConfirmQuery from './components/ConfirmQuery'; // 自动化科专责确认

import TimeoutModal from '../components/TimeoutModal';
import { judgeTimeoutStatus, saveTimeoutMsg } from '../services/api'; // 超时接口

// 关联工单
import RelationOrder from './RelationOrder';

const { Step } = Steps;
const { Panel } = Collapse;

const registerLevelmap = new Map([
  ['一般', '001'],
  ['重大', '002'],
  ['紧急', '003'],
]);

let image; // 流程图
let tosaveStatus; // 保存状态
const currenStatus = 'circle'; // 保存状态
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
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

const tabList = [
  {
    key: 'faultForm',
    tab: '故障工单',
  },
  {
    key: 'faultPro',
    tab: '故障流程',
  },
  {
    key: 'relevancy',
    tab: '关联工单',
  }
];

const Collapsekeymap = new Map([
  ['故障登记', 'RegisterChild'], // 故障登记
  ['系统运维商审核', 'ExamineChild'], // 系统运维商审核
  ['系统运维商处理', 'HandleChild'], // 系统运维商处理
  ['系统运维商确认总结', 'SummaryChild'], // 系统运维商确认总结
  ['自动化科业务负责人审核', 'ExamineSecondChild'], // 自动化科业务负责人审核
  // ['自动化科专责确认', 'ConfirmChild'], // 自动化科专责确认
  // 1.25 自动化科专责确认改为自动化科审核
  ['自动化科审核', 'ConfirmChild'], // 自动化科审核
]);

function Todolistdetails(props) {
  // const pagetitle = props.route.name;
  const [activeKey, setActiveKey] = useState([]);
  const [tabActiveKey, setTabActiveKey] = useState('faultForm');

  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [fileskey, setFileskey] = useState('1'); // 下载列表

  const [result, setResult] = useState('1');
  const [resultsecond, setResultsecond] = useState('1');
  const [resultconfirm, setResultconfirm] = useState('1');
  const [type, setType] = useState('');
  const [buttontype, setButtonType] = useState('');

  const [uservisible, setUserVisible] = useState(false); // 是否显示选人组件
  const [userchoice, setUserChoice] = useState(false); // 已经选择人员
  const [changorder, setChangeOrder] = useState(undefined);

  const [modalvisible, setModalVisible] = useState(false);

  const [modalrollback, setModalRollBack] = useState(false);   // 回退信息modle
  const [faultUploadStatus, setFaultUploadStatus] = useState(false); // 附件状态

  const [createQualityvisible, setcreateQualityvisible] = useState(false);

  const RegisterRef = useRef(); // 故障登记
  const ExamineRef = useRef(); // 系统运维商审核  自动化科业务负责人审核
  const HandleRef = useRef(); // 系统运维商处理
  const SummaryRef = useRef(); // 系统运维商确认总结
  const ConfirmRef = useRef(); // 自动化科专责确认

  const {
    // location: { paneKey }, // 获取传入数据 // paneKey故障登记传过来的当前状态以及待办页传过来的状态（故障登记）
    loading,
    location,
    tododetailslist, // 待办详情数据--编辑
    tododetailslist: {
      troubleFlowLogs,
      check,
      handle,
      finish,
      confirm,
      troubleFlowNodeRows,
      main,
      editState,
      flowNodeName,
    }, // troubleFlowLogs流程图数据  troubleFlowNodeRows详情是数据
    flowimageview, // 故障流程的流程图片数据
    flowlog, // 故障流程的流程日志
    dispatch,
    curruserinfo, // 当前用户登录信息
    curruserinfo: { userId }, // 当前用户登录id
    olduploadstatus,     // 附件上传状态
  } = props;

  const {
    query: { id, mainId, orderNo },
  } = props.location; // 获取taskId


  // 二进制展示流程图
  const blob = new Blob([flowimageview]);
  image = (window.URL || window.webkitURL).createObjectURL(blob);

  const getFlowImage = () => {
    // 流程图
    dispatch({
      type: 'fault/fetchGetFlowImage',
      payload: { id: tododetailslist.main.id },
    });
  };

  const getFlowlog = () => {
    // 流程日志
    dispatch({
      type: 'fault/fetchGetFlowLog',
      payload: { id: tododetailslist.main.id },
    });
  };

  const handleClose = () => {
    // 返回上一页
    router.push({
      pathname: '/ITSM/faultmanage/todolist/record',
      query: { tabid: sessionStorage.getItem('tabid'), closecurrent: true }
    });
  };

  const handleTabChange = key => {
    // tab切换
    setTabActiveKey(key);
    getFlowImage();
    getFlowlog();
  };

  const callback = key => {
    // 激活tab
    setActiveKey(key);
  };

  const getfaultTodoDetailData = () => {
    // 故障待办详情数据
    dispatch({
      type: 'fault/getfaultTodoDetailData',
      payload: { id, mainId },
    });
  };

  const getCurrUserInfo = () => {
    // 获取登录用户信息
    dispatch({
      type: 'fault/fetchuser',
    });
  };

  // 表单校验提示信息
  const formerr = () => {
    message.error('请将信息填写完整...');
  };

  useEffect(() => {
    if (mainId) {
      getfaultTodoDetailData();
      getCurrUserInfo(); // 获取登录用户信息
      sessionStorage.setItem('Processtype', 'troub');
      setTabActiveKey('faultForm');
      sessionStorage.setItem('flowtype', '1');
    }
  }, [mainId]);

  useEffect(() => {
    if (loading === false) {
      setActiveKey([`${Collapsekeymap.get(flowNodeName)}`]);
      if (main && (main.status === '40' || main.status === '45') && editState === 'add') {
        setActiveKey('0');
      }
    }
  }, [loading]);

  const handleDelete = () => {
    // 删除操作！
    dispatch({
      type: 'fault/remove',
      payload: { id: tododetailslist.main.id },
    }).then(res => {
      if (res.code === 200) {
        getfaultTodoDetailData();
        message.success(res.msg);
        router.push(
          {
            pathname: `/ITSM/faultmanage/todolist/record`,
            query: { mainId, closetab: true },
            state: { cache: false }
          });
        router.push(
          {
            pathname: `/ITSM/faultmanage/todolist`,
            query: { pathpush: true },
            state: { cache: false }
          });
      } else {
        message.error(res.msg);
        router.push({
          pathname: `/ITSM/faultmanage/todolist`,
          query: { pathpush: true },
          state: { cach: false, closetabid: mainId }
        });
      }
    });
  };

  const faultcircula = (circulatype) => {
    // 流转
    const taskId = id;
    let results;
    if (circulatype === 'close') {
      results = '255'; // 关闭
    } else if (circulatype === 'transfer') {
      results = '9'; // 转单
    } else {
      results = '1'; // 流转
    }
    return dispatch({
      type: 'fault/getSubmitProToNextNode',
      payload: { taskId, result: results, userIds: sessionStorage.getItem('NextflowUserId') },
    }).then(res => {
      router.push({
        pathname: `/ITSM/faultmanage/todolist/record`,
        query: {
          mainId,
          closetab: true,
        }
      });
      if (res.code === 200) {
        //  getfaultTodoDetailData();  //都要流转了还要获取信息？
        message.success(res.msg);
        router.push({ pathname: `/ITSM/faultmanage/todolist`, query: { pathpush: true }, state: { cache: false } });
      } else {
        message.error(res.msg);
        router.push({
          pathname: `/ITSM/faultmanage/todolist`,
          query: { pathpush: true },
          state: { cach: false, closetabid: mainId }
        });
      }
    });
  };

  // 各个表单验证
  const saveRegister = cirStatus => {
    // 故障登记
    RegisterRef.current.validateFields((err, values) => {
      if (cirStatus ? !err : true) {
        const formValues = values;
        formValues.registerOccurTime = values.registerOccurTime.format('YYYY-MM-DD HH:mm:ss');
        formValues.registerTime = values.registerTime.format('YYYY-MM-DD HH:mm:ss');
        formValues.taskId = id;
        formValues.editState = tododetailslist.editState;
        formValues.registerLevelCode = registerLevelmap.get(values.registerLevel);    // 超时用：一般001，重大002，紧急003
        formValues.registerUserId = userId; // 当前登录人id
        formValues.type = values.type ? values.type[1] : type;
        if (files.ischange && typeof (files.arr) === 'object') {
          formValues.registerAttachments = JSON.stringify(files.arr);
        }

        if (files.ischange === true && typeof (files.arr) === 'string') {
          message.info('上传文件失败，请重新上传');
        }

        // formValues.registerEffect = String(Number(values.registerEffect))
        if (tododetailslist.editState === 'edit') {
          formValues.registerId = tododetailslist.register.id;
        }
        formValues.editState = 'edit';
        return dispatch({
          type: 'fault/getfromsave', // 保存接口
          payload: { formValues },
        }).then(res => {
          if (res) {
            if (res.code === 200) {
              getfaultTodoDetailData();
              if (cirStatus) {
                setUserVisible(true);
              } else {
                message.success(res.msg);
              }
            }
          } else {
            message.error(res.msg);
            router.push({
              pathname: `/ITSM/faultmanage/todolist`,
              query: { pathpush: true },
              state: { cach: false, closetabid: mainId }
            });
          }
        });
      }
      return formerr();
    });
  };

  const saveExamine = cirStatus => {
    // 审核类型：1-系统运维商审核；2-自动化科业务负责人审核
    ExamineRef.current.validateFields((err, values) => {
      const formValues = values;
      formValues.checkOpinion = values.checkOpinion1 || values.checkOpinion2;
      formValues.checkOpinion1 = '';
      formValues.checkOpinion2 = '';

      if (formValues.checkTime) {
        formValues.checkTime = values.checkTime.format('YYYY-MM-DD HH:mm:ss');
      } else {
        formValues.checkTime = '';
      }
      if (cirStatus ? !err : true) {
        formValues.checkUserId = userId; // 当前登录人id
        formValues.taskId = id;
        formValues.checkType = flowNodeName === '系统运维商审核' ? '1' : '2';
        if (files.ischange) {
          formValues.checkAttachments = JSON.stringify(files.arr);
        }

        if (tododetailslist.editState === 'edit') {
          formValues.checkId = tododetailslist.check.id;
          formValues.editState = tododetailslist.editState;
        } else {
          formValues.checkId = tododetailslist.editGuid;
          formValues.editState = 'add';
        }
        return dispatch({
          type: 'fault/getfromsave', // 保存接口
          payload: { formValues },
        }).then(res => {
          if (res.code === 200) {
            // 保存成功后隐藏回退按钮
            getfaultTodoDetailData();
            if (cirStatus) {
              setUserVisible(true);
            } else {
              message.success(res.msg);
            }
          } else {
            message.error(res.msg);
            router.push({
              pathname: `/ITSM/faultmanage/todolist`,
              query: { pathpush: true },
              state: { cach: false, closetabid: mainId }
            });
          }
        });
      }
      return formerr();
    });
  };

  const saveHandle = cirStatus => {
    // 系统运维商处理
    HandleRef.current.validateFields((err, values) => {
      const formValues = values;
      if (formValues.handleStartTime || formValues.handleEndTime) {
        formValues.handleStartTime = values.handleStartTime.format('YYYY-MM-DD HH:mm:ss');
        formValues.handleEndTime = values.handleEndTime.format('YYYY-MM-DD HH:mm:ss');
      }
      if (cirStatus ? !err : true) {
        formValues.taskId = id;
        formValues.editState = tododetailslist.editState;
        formValues.handlerId = userId; // 当前登录人id
        if (tododetailslist.editState === 'edit') {
          formValues.handleId = tododetailslist.handle.id;
          formValues.editState = tododetailslist.editState;
        } else {
          formValues.handleId = tododetailslist.editGuid;
          formValues.editState = 'add';
        }

        return dispatch({
          type: 'fault/getfromsave', // 保存接口
          payload: { formValues },
        }).then(res => {
          if (res.code === 200) {
            getfaultTodoDetailData();
            if (cirStatus) { // 流转状态
              setUserVisible(true)
            } else {
              message.success(res.msg);
            }
          } else {
            message.error(res.msg);
            router.push({
              pathname: `/ITSM/faultmanage/todolist`,
              query: { pathpush: true },
              state: { cach: false, closetabid: mainId }
            });
          }
        });
      }
      return formerr();
    });
  };

  const saveSummary = cirStatus => {
    // 系统运维商确认总结
    SummaryRef.current.validateFields((err, values) => {
      if (cirStatus ? !err : true) {
        const formValues = values;
        formValues.finishAnalysisAttachments = formValues.finishAnalysisAttachments || formValues.finishAnalysisAttachments2;
        formValues.taskId = id;
        formValues.editState = tododetailslist.editState;
        formValues.finishUserId = userId; // 当前登录人id

        if (tododetailslist.editState === 'edit') {
          formValues.finishId = tododetailslist.finish.id;
          formValues.editState = tododetailslist.editState;
        } else {
          formValues.finishId = tododetailslist.editGuid;
          formValues.editState = 'add';
        }

        formValues.finishTime = values.finishTime.format('YYYY-MM-DD HH:mm:ss');
        formValues.finishRequiredTime = values.finishRequiredTime ? values.finishRequiredTime.format('YYYY-MM-DD HH:mm:ss') : ''; // 要求上传时间
        if (files.arr.length !== 0) {
          formValues.finishPracticeTime = files.arr[0].nowtime;
        } else if (values.finishPracticeTime !== '') {
          formValues.finishPracticeTime = values.finishPracticeTime ? values.finishPracticeTime.format('YYYY-MM-DD HH:mm:ss') : '';
        } else {
          formValues.finishPracticeTime = '';
        }

        return dispatch({
          type: 'fault/getfromsave', // 保存接口
          payload: { formValues },
        }).then(res => {
          if (res.code === 200) {
            getfaultTodoDetailData();
            if (cirStatus) {
              setUserVisible(true)
            } else {
              message.success(res.msg);
            }
          } else {
            message.error(res.msg);
            router.push({
              pathname: `/ITSM/faultmanage/todolist`,
              query: { pathpush: true },
              state: { cach: false, closetabid: mainId }
            });
          }
        });
      }
      return formerr();
    });
  };

  const saveConfirm = cirStatus => {
    // 自动化科专责确认
    ConfirmRef.current.validateFields((err, values) => {
      if (cirStatus ? !err : true) {
        const formValues = values;
        formValues.confirmTime = values.confirmTime.format('YYYY-MM-DD HH:mm:ss');
        formValues.taskId = id;
        formValues.editState = tododetailslist.editState;
        formValues.confirmUserId = userId; // 当前登录人id
        if (files.ischange) {
          formValues.confirmAttachments = JSON.stringify(files.arr);
        }

        if (tododetailslist.editState === 'edit') {
          formValues.confirmId = tododetailslist.confirm.id;
        } else {
          formValues.confirmId = tododetailslist.editGuid;
        }
        return dispatch({
          type: 'fault/getfromsave', // 保存接口
          payload: { formValues },
        }).then(res => {
          if (res.code === 200) {
            getfaultTodoDetailData();
            if (cirStatus) {
              faultcircula()
            } else {
              message.success(res.msg);
            }
          } else {
            message.error(res.msg);
            router.push({
              pathname: `/ITSM/faultmanage/todolist`,
              query: { pathpush: true },
              state: { cach: false, closetabid: mainId }
            });
          }
        });
      }
      return formerr();
    });
  };

  const handleSave = savestatus => {
    // 表单编辑保存，流转
    switch (flowNodeName) {
      case '故障登记':
        saveRegister(savestatus);
        break;
      // case '系统运维商审核':
      //   saveExamine(savestatus);
      //   break;
      case '系统运维商处理':
        saveHandle(savestatus);
        break;
      case '系统运维商确认总结':
        saveSummary(savestatus);
        break;
      case '自动化科业务负责人审核':
        saveExamine(savestatus);
        break;
      // case '自动化科专责确认':
      //   saveConfirm(savestatus);
      //   break;
      case '自动化科审核':
        saveConfirm(savestatus);
        break;
      default:
        break;
    }
  };

  // 上传附件触发保存
  useEffect(() => {
    if (files.ischange) {
      handleSave(tosaveStatus);
    }
  }, [files]);

  const handleReceivs = () => {
    // 接单接口
    const taskId = id;
    return dispatch({
      type: 'fault/troubleHandleOrder',
      payload: { taskId },
    }).then(res => {
      if (res.code === 200) {
        message.info(res.msg);
        main.status = '45';
        getfaultTodoDetailData();
      } else {
        message.error(res.msg);
        router.push({
          pathname: `/ITSM/faultmanage/todolist`,
          query: { pathpush: true },
          state: { cach: false, closetabid: mainId }
        });
      }
    });
  };

  const handleRegist = (params) => {
    // 登记按钮回到登记页
    ExamineRef.current.validateFields((err, values) => {
      const formValues = values;
      if (formValues.checkTime) {
        formValues.checkTime = values.checkTime.format('YYYY-MM-DD HH:mm:ss');
      } else {
        formValues.checkTime = '';
      }
      if (params ? !err : true) {
        formValues.checkUserId = userId; // 当前登录人id
        formValues.taskId = id;
        formValues.checkType = flowNodeName === '系统运维商审核' ? '1' : '2';
        if (files.ischange) {
          formValues.checkAttachments = JSON.stringify(files.arr);
        }

        if (tododetailslist.editState === 'edit') {
          formValues.checkId = tododetailslist.check.id;
          formValues.editState = tododetailslist.editState;
        } else {
          formValues.checkId = tododetailslist.editGuid;
          formValues.editState = 'add';
        }
        return dispatch({
          type: 'fault/getfromsave', // 保存接口
          payload: { formValues },
        }).then(res => {
          if (res.code === 200) {
            const taskId = id;
            return dispatch({
              type: 'fault/getSubmitProToNextNode',
              payload: {
                ...values,
                taskId,
                result: '0',
                userIds: '',
              },
            }).then(res1 => {
              if (res1.code === 200) {
                router.push(
                  {
                    pathname: `/ITSM/faultmanage/todolist/record`,
                    query: { mainId, closetab: true },
                    state: { cache: false }
                  });
                message.success(res1.msg);
                router.push({
                  pathname: `/ITSM/faultmanage/todolist`,
                  query: { pathpush: true },
                  state: { cache: false }
                })
              } else {
                message.error(res1.msg);
                router.push(`/ITSM/faultmanage/registration`);
              }
            });
          }
          return null;
        });
      }
      return formerr();
    });
  };

  const toHandle = (params) => {
    // 第二次审核回到处理
    // eslint-disable-next-line consistent-return
    ExamineRef.current.validateFields((err, values) => {
      const formValues = values;
      formValues.checkOpinion = values.checkOpinion1 || values.checkOpinion2;
      formValues.checkOpinion1 = '';
      formValues.checkOpinion2 = '';
      if (formValues.checkTime) {
        formValues.checkTime = values.checkTime.format('YYYY-MM-DD HH:mm:ss');
      } else {
        formValues.checkTime = '';
      }
      if (params ? !err : true) {
        formValues.checkUserId = userId; // 当前登录人id
        formValues.taskId = id;
        formValues.checkType = flowNodeName === '系统运维商审核' ? '1' : '2';
        if (files.ischange) {
          formValues.checkAttachments = JSON.stringify(files.arr);
        }

        if (tododetailslist.editState === 'edit') {
          formValues.checkId = tododetailslist.check.id;
          formValues.editState = tododetailslist.editState;
        } else {
          formValues.checkId = tododetailslist.editGuid;
          formValues.editState = 'add';
        }

        return dispatch({
          type: 'fault/getfromsave', // 保存接口
          payload: { formValues },
        }).then(res => {
          if (res.code === 200) {
            const taskId = id;
            return dispatch({
              type: 'fault/getSubmitProToNextNode',
              payload: {
                ...values,
                taskId,
                result: '0',
                userIds: '',
              },
            }).then(res1 => {
              router.push(
                {
                  pathname: `/ITSM/faultmanage/todolist/record`,
                  query: { mainId, closetab: true },
                  state: { cache: false }
                });
              if (res1.code === 200) {
                message.success(res1.msg);
                router.push({
                  pathname: `/ITSM/faultmanage/todolist`,
                  query: { pathpush: true },
                  state: { cache: false }
                })
              } else {
                message.error(res1.msg);
                router.push({
                  pathname: `/ITSM/faultmanage/todolist`,
                  query: { pathpush: true },
                  state: { cache: false }
                })
              }
            });
          }
          return null;
        });
      }
    });
  };

  const toHandle1 = () => {
    // 确认回到处理
    ConfirmRef.current.validateFields((err, values) => {
      if (!err) {
        const formValues = values;
        formValues.confirmContent = values.confirmContent1 || values.confirmContent2;
        formValues.confirmContent1 = '';
        formValues.confirmContent2 = '';
        formValues.confirmTime = values.confirmTime.format('YYYY-MM-DD HH:mm:ss');
        formValues.taskId = id;
        formValues.editState = tododetailslist.editState;
        formValues.confirmUserId = userId; // 当前登录人id
        if (files.ischange) {
          formValues.confirmAttachments = JSON.stringify(files.arr);
        }

        if (tododetailslist.editState === 'edit') {
          formValues.confirmId = tododetailslist.confirm.id;
        } else {
          formValues.confirmId = tododetailslist.editGuid;
        }
        return dispatch({
          type: 'fault/getfromsave', // 保存接口
          payload: { formValues },
          // eslint-disable-next-line consistent-return
        }).then(res => {
          if (res.code === 200) {
            const taskId = id;
            return dispatch({
              type: 'fault/getSubmitProToNextNode',
              payload: {
                ...values,
                taskId,
                result: '0',
                userIds: '',
              },
            }).then(res1 => {
              router.push(
                {
                  pathname: `/ITSM/faultmanage/todolist/record`,
                  query: { mainId, closetab: true },
                  state: { cache: false }
                });
              if (res1.code === 200) {
                message.success(res1.msg);
                router.push({
                  pathname: `/ITSM/faultmanage/todolist`,
                  query: { pathpush: true },
                  state: { cache: false }
                })
              } else {
                message.error(res1.msg);
                router.push({
                  pathname: `/ITSM/faultmanage/todolist`,
                  uery: { pathpush: true },
                  state: { cache: false }
                })
              }
            });
          }
        });
      }
      return formerr();
    });
  };

  useEffect(() => {
    if (userchoice) {
      if (buttontype === 'transfer') {
        faultcircula('transfer')
      } else (
        faultcircula()
      )
    }
  }, [userchoice])

  // 回退接口
  const postRollBackmsg = (values) => {
    dispatch({
      type: 'fault/rollback',
      payload: { taskId: id, backReason: values.rollbackmsg, result: -1 },
    }).then(res => {
      if (res) {
        if (res.code === 200) {
          router.push({
            pathname: `/ITSM/faultmanage/todolist`,
            query: { pathpush: true },
            state: { cach: false, closetabid: mainId }
          });
        }
        message.info(res.msg);
      } else {
        message.error('回退失败！');
        router.push({
          pathname: `/ITSM/faultmanage/todolist`,
          query: { pathpush: true },
          state: { cach: false, closetabid: mainId }
        });
      }
    });
  }

  const handleHold = (buttype) => {
    switch (buttype) {
      case 'accpt':
        handleReceivs()
        break;
      case 'goback':
        setModalRollBack(true);
        break;
      case 'save':
        handleSave(tosaveStatus);
        break;
      case 'flow':
        handleSave(currenStatus)
        break;
      case 'registback':
        handleRegist('back')
        break;
      case 'handleback':
        toHandle('back')
        break;
      case 'handle':
        toHandle1()
        break;
      case 'submittransfer':
        handleSave(currenStatus);
        setButtonType('transfer');
        break;
      case 'over':
        handleSave(currenStatus);
        break;
      default:
        break;
    }
  }

  // 点击回退,接单,流转、结束
  const handleSubmit = (buttype) => {
    const taskId = id;
    judgeTimeoutStatus(taskId).then(res => {
      if (res.code === 200 && res.status === 'yes' && res.timeoutMsg === '') {
        message.info('该故障单已超时，请填写超时原因...')
        setModalVisible(true);
        setButtonType(buttype);
      };
      if (res.code === 200 && ((res.status === 'yes' && res.timeoutMsg !== '') || res.status === 'no')) {
        handleHold(buttype);
      }
      if (res.code === -1) {
        message.error(res.msg);
        router.push({
          pathname: `/ITSM/faultmanage/todolist`,
          query: {
            tabid: sessionStorage.getItem('tabid'),
            closecurrent: true,
          },
        });
      }
    })
  };

  // 保存超时信息,成功校验表单
  const postTimeOutMsg = (v) => {
    saveTimeoutMsg({
      taskId: id,
      msgType: 'timeout',
      orderId: mainId,
      orderType: 'trouble',
      ...v
    }).then(res => {
      if (res.code === 200) {
        handleHold(buttontype);
      }
    });
  }

  // 点击页签右键刷新
  useEffect(() => {
    if (location.state && location.state.reset && mainId) {
      getfaultTodoDetailData();
      getCurrUserInfo(); // 获取登录用户信息
      sessionStorage.setItem('Processtype', 'troub');
      setTabActiveKey('faultForm');
    }
  }, [location.state])

  //  发起服务绩效
  const createQualityByMainId = (status) => {
    let obj = {};
    if (status) {
      obj = {
        mainId,
        status,
      }
    } else {
      obj = {
        mainId,
      }
    }
    return dispatch({
      type: 'faultcount/createQualityByMainId',
      payload: {
        ...obj
      }
    }).then(res => {
      if (res.code === 200) {
        message.success('发起服务绩效考核成功')
        setcreateQualityvisible(false);
      } else {
        setcreateQualityvisible(true);
      }
    })
  };

  return (
    <PageHeaderWrapper
      extra={
        <>
          {tabActiveKey === 'faultForm' && !loading && (
            <>
              {// 删除按钮只有故障登记有并且没有流转记录
                flowNodeName === '故障登记' && troubleFlowNodeRows.length <= 1 && (
                  <Popconfirm title="确定删除吗？" onConfirm={() => handleDelete()}>
                    <Button type="danger" style={{ marginRight: 8 }} ghost>
                      删除
                    </Button>
                  </Popconfirm>
                )}
              {// 回退按钮--系统运维商审核， 系统运维商确认总结，自动化科业务负责人审核, 自动化科确认有
                flowNodeName !== '故障登记' &&
                flowNodeName !== '故障关闭' &&
                main &&
                main.status !== '45' &&
                !(troubleFlowNodeRows.length > 1 && flowNodeName === '系统运维商处理') &&
                // main &&
                // main.status !== '40' &&
                check === undefined &&
                finish === undefined &&
                confirm === undefined &&
                (
                  <Button type="danger" style={{ marginRight: 8 }} ghost onClick={() => handleSubmit('goback')} disabled={faultUploadStatus}>
                    回退
                  </Button>
                )
              }
              {// 接单只有系统运维商处理时有
                main && (main.status === '40' || main.status === '45') && editState === 'add' && (
                  <Button type="primary" style={{ marginRight: 8 }} onClick={() => handleSubmit('accpt')}>
                    接单
                  </Button>
                )}
              {main && main.status !== '40' && !(main.status === '45' && editState === 'add') && (
                <Button type="primary" style={{ marginRight: 8 }} disabled={faultUploadStatus} onClick={() => { handleSave(tosaveStatus); setButtonType('save') }}>
                  保存
                </Button>
              )}
              {// 转单只有系统运维商处理时有
                main && (main.status === '45' || main.status === '40') && editState === 'edit' && (
                  <Button
                    type="primary"
                    style={{ marginRight: 8 }}
                    onClick={() => { handleSubmit('submittransfer'); setChangeOrder('请选择处理') }}
                    onMouseDown={() => { setButtonType(undefined); setChangeOrder('') }}
                    onMouseOver={() => {
                      sessionStorage.setItem('flowtype', '9');
                    }}
                    onFocus={() => 0}
                    disabled={faultUploadStatus}
                  >
                    转单
                  </Button>
                )}
              {/* 确认过程的时候不需要选人 1通过直接关闭 */}
              {flowNodeName === '自动化科审核'
                ? resultconfirm === '1' && (
                  <Button type="primary" style={{ marginRight: 8 }} onClick={() => { handleSubmit('over'); }} disabled={faultUploadStatus}>
                    结束
                  </Button>
                )
                : main &&
                main.status !== '40' &&
                !(main.status === '45' && editState === 'add') &&
                result === '1' &&
                resultsecond === '1' && (
                  <Button
                    disabled={faultUploadStatus}
                    type="primary"
                    style={{ marginRight: 8 }}
                    onClick={() => { handleSubmit('flow') }}
                    onMouseOver={() => { sessionStorage.setItem('flowtype', '1') }}
                    onMouseDown={() => { setButtonType(undefined); setChangeOrder(undefined) }}
                    onFocus={() => 0}>
                    流转
                  </Button>
                )}
              {result === '0' && (
                <Button type="primary" onClick={() => handleSubmit('registback')} disabled={faultUploadStatus}>
                  重新登记
                </Button>
              )}
              {resultsecond === '0' && (
                <Button type="primary" onClick={() => handleSubmit('handleback')} disabled={faultUploadStatus}>
                  重新处理
                </Button>
              )}
              {resultconfirm === '0' && (
                <Button type="primary" onClick={() => handleSubmit('handle')} disabled={faultUploadStatus}>
                  重新处理
                </Button>
              )}

              {troubleFlowNodeRows !== undefined &&
                troubleFlowNodeRows.length !== 0 &&
                flowNodeName === '故障登记' && (
                  <Button type="primary" onClick={() => faultcircula('close')} disabled={faultUploadStatus}>
                    结束
                  </Button>
                )}
            </>
          )}
          <Button type="default" onClick={handleClose} disabled={faultUploadStatus}>关闭</Button>
        </>
      }
      title={flowNodeName}
      tabList={tabList}
      onTabChange={handleTabChange}
      tabActiveKey={tabActiveKey}
    >
      {tabActiveKey === 'faultForm' && (
        <div className={styles.collapse}>
          {troubleFlowLogs && (
            <Steps
              current={troubleFlowLogs.length - 1}
              size="small"
              style={{
                background: '#fff',
                padding: 24,
                border: '1px solid #e8e8e8',
                overflowX: 'auto',
                marginBottom: 50,
              }}
            >
              {troubleFlowLogs &&
                troubleFlowLogs.map(({ key, name, status, timeText, formHandler, startTime }) => [
                  name !== '开始节点' && name !== '结束节点' && (
                    <Step
                      key={key}
                      title={`${name}${'\xa0'}${'\xa0'}(${status})${'\xa0'}${'\xa0'}${timeText}`}
                      description={
                        <div className={styles.stepDescription}>
                          处理人：{formHandler}
                          <div>结束时间：{moment(startTime).format('YYYY-MM-DD HH:mm:ss')}</div>
                        </div>
                      }
                    />
                  ),
                ])}
            </Steps>
          )}
          <Spin spinning={loading}>
            {loading === false && tododetailslist && (
              <FaultEditContext.Provider value={{
                getUploadStatus: (v) => { setFaultUploadStatus(v) },
              }}>
                <Collapse
                  expandIconPosition="right"
                  activeKey={activeKey}
                  bordered={false}
                  style={{ marginTop: '-25px' }}
                  onChange={callback}
                >
                  {// 故障登记编辑页---（故障登记时）
                    flowNodeName === '故障登记' && (
                      <Panel header="故障登记" key="RegisterChild">
                        <RegisterChild
                          ChangeFiles={newvalue => {
                            setFiles(newvalue);
                          }}
                          ref={RegisterRef}
                          formItemLayout={formItemLayout}
                          forminladeLayout={forminladeLayout}
                          tododetailslist={tododetailslist}
                          main={main}
                          curruserinfo={curruserinfo}
                          saveType={newvalue => {
                            setType(newvalue);
                          }}
                          location={location}
                        />
                      </Panel>
                    )}
                  {/* {// 系统运维商审核编辑页
                    flowNodeName === '系统运维商审核' && ( // 展开系统运维商审核表单时，显示故障登记详情（1）
                      <Panel header="系统运维商审核" key="ExamineChild">
                        <ExamineChild
                          ref={ExamineRef}
                          formItemLayout={formItemLayout}
                          forminladeLayout={forminladeLayout}
                          check={check}
                          curruserinfo={curruserinfo}
                          ChangeFiles={newvalue => {
                            setFiles(newvalue);
                          }}
                          ChangeResult={newvalue => {
                            setResult(newvalue);
                          }}
                          location={location}
                        />
                      </Panel>
                    )} */}
                  {// 系统运维商处理编辑页
                    flowNodeName === '系统运维商处理' &&
                    main &&
                    main.status === '45' &&
                    editState === 'edit' && ( // 展开处理表单时，显示故障审核详情以及登记详情（2）
                      <Panel header="系统运维商处理" key="HandleChild">
                        <HandleChild
                          ref={HandleRef}
                          formItemLayout={formItemLayout}
                          forminladeLayout={forminladeLayout}
                          handle={handle}
                          curruserinfo={curruserinfo}
                          ChangeFiles={newvalue => {
                            setFiles(newvalue);
                          }}
                          ChangeFileskey={newvalue => setFileskey(newvalue)}
                          mainId={mainId}
                          uploadStatus={olduploadstatus}
                        />
                      </Panel>
                    )}
                  {// 系统运维商确认总结编辑页
                    flowNodeName === '系统运维商确认总结' && (
                      <Panel header="系统运维商确认总结" key="SummaryChild">
                        <SummaryChild
                          ref={SummaryRef}
                          formItemLayout={formItemLayout}
                          forminladeLayout={forminladeLayout}
                          tododetailslist={tododetailslist}
                          finish={finish}
                          curruserinfo={curruserinfo}
                          ChangeFiles={newvalue => {
                            setFiles(newvalue);
                          }}
                          id={id}
                          mainId={mainId}
                          orderNo={orderNo}
                          editState={editState}
                          finishId={tododetailslist && tododetailslist.finish && tododetailslist.finish.id}
                          showFilelist={troubleFlowNodeRows[1]}
                          showFilelist2={troubleFlowNodeRows[2]}
                          ChangeFileskey={newvalue => setFileskey(newvalue)}
                          uploadStatus={olduploadstatus}
                        />
                      </Panel>
                    )}
                  {// 自动化科业务负责人审核编辑页
                    flowNodeName === '自动化科业务负责人审核' && (
                      <Panel header="自动化科业务负责人审核" key="ExamineSecondChild">
                        <ExamineSecondChild
                          ref={ExamineRef}
                          formItemLayout={formItemLayout}
                          forminladeLayout={forminladeLayout}
                          check={check}
                          tododetailslist={tododetailslist}
                          curruserinfo={curruserinfo}
                          ChangeFiles={newvalue => {
                            setFiles(newvalue);
                          }}
                          ChangeResult={newvalue => {
                            setResultsecond(newvalue);
                          }}
                          resultsecond={resultsecond}
                          location={location}
                          createQualityByMainId={() => createQualityByMainId('')}
                        />
                      </Panel>
                    )}
                  {// 自动化科专责确认编辑页
                    flowNodeName === '自动化科审核' && (
                      <Panel header="自动化科审核" key="ConfirmChild">
                        <ConfirmChild
                          ref={ConfirmRef}
                          formItemLayout={formItemLayout}
                          forminladeLayout={forminladeLayout}
                          confirm={confirm}
                          main={main}
                          curruserinfo={curruserinfo}
                          ChangeFiles={newvalue => {
                            setFiles(newvalue);
                          }}
                          ChangeResult={newvalue => {
                            setResultconfirm(newvalue);
                          }}
                          location={location}
                        />
                      </Panel>
                    )}

                  {troubleFlowNodeRows &&
                    troubleFlowNodeRows.map((obj, index) => {
                      // panel详情组件
                      const Paneldesmap = new Map([
                        ['故障登记', <RegisterQuery key={1} info={obj} maindata={main} formItemLayout={formItemLayout} forminladeLayout={forminladeLayout} />],
                        ['系统运维商审核', <ExamineQuery key={2} info={obj} maindata={main} formItemLayout={formItemLayout} forminladeLayout={forminladeLayout} />],
                        ['系统运维商处理', <HandleQuery key={3} info={obj} maindata={main} formItemLayout={formItemLayout} forminladeLayout={forminladeLayout} />],
                        ['系统运维商确认总结', <SummaryQuery key={4} info={obj} maindata={main} formItemLayout={formItemLayout} forminladeLayout={forminladeLayout} showFilelist={troubleFlowNodeRows[1]} showFilelist2={troubleFlowNodeRows[2]} />],
                        ['自动化科业务负责人审核', <ExamineSecondQuery key={5} info={obj} maindata={main} formItemLayout={formItemLayout} forminladeLayout={forminladeLayout} />],
                        // ['自动化科专责确认', <ConfirmQuery key={6} info={obj} maindata={main} />],
                        ['自动化科审核', <ConfirmQuery key={6} info={obj} maindata={main} />],
                      ]);
                      return (
                        <Panel Panel header={obj.fnname} key={index.toString()}>
                          {Paneldesmap.get(obj.fnname)}
                        </Panel>
                      );
                    })}
                </Collapse>
              </FaultEditContext.Provider>
            )}
          </Spin>
        </div>
      )}
      {tabActiveKey === 'faultPro' && (
        <>
          <Card title="流程图">
            <div
              style={{
                background: '#fff',
                // padding: 20,
              }}
            >
              <img src={image} alt="" />
            </div>
          </Card>
          <Card title="流转日志" style={{ marginTop: '-1px' }}>
            {loading === false && flowlog && (
              <div className={styles.steps}>
                <Steps
                  current={flowlog.troubleFlowLogs.length - 1}
                  size="small"
                  direction="vertical"
                  progressDot
                  style={{
                    background: '#fff',
                    padding: 24,
                    border: '1px solid #e8e8e8',
                  }}
                >
                  {flowlog &&
                    flowlog.troubleFlowLogs.map(
                      ({ key, name, status, startTime, formHandler, backReason }) => [
                        name !== '开始节点' && name !== '结束节点' && (
                          <Step
                            key={key}
                            title={`${name}${'\xa0'}${'\xa0'}(${status})`}
                            description={
                              <div className={styles.stepDescription}>
                                处理人：{formHandler}
                                <div>{moment(startTime).format('YYYY-MM-DD hh:mm:ss')}</div>
                                <div>{status === '退回' && `回退原因：${backReason}`}</div>
                              </div>
                            }
                          />
                        ),
                      ],
                    )}
                </Steps>
              </div>
            )}
          </Card>
        </>
      )}
      {tabActiveKey === 'relevancy' && <RelationOrder orderId={location.query.mainId} relation />}
      <User
        taskId={id}
        visible={uservisible}
        ChangeUserVisible={v => setUserVisible(v)}
        changorder={changorder}
        ChangeChoice={v => setUserChoice(v)}
        ChangeType={() => 0}
      />
      <TimeoutModal
        modalvisible={modalvisible}
        ChangeModalVisible={v => setModalVisible(v)}
        ChangeTimeOutMsg={v => postTimeOutMsg(v)}
      />
      <ModelRollback
        title="填写回退意见"
        visible={modalrollback}
        flowNodeName={flowNodeName}
        ChangeVisible={v => setModalRollBack(v)}
        rollbackSubmit={v => postRollBackmsg(v)}
      />

      <Modal
        visible={createQualityvisible}
        onOk={() => createQualityByMainId('yes')}
        onCancel={() => setcreateQualityvisible(false)}
      >
        <p>该故障单已发起过服务绩效考核，是否需要再次发起服务绩效考核？</p>
      </Modal>


    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ fault, viewcache, loading }) => ({
    tododetailslist: fault.tododetailslist, // 详情的编辑数据
    olduploadstatus: viewcache.olduploadstatus,
    flowimageview: fault.flowimageview, // 流程图view
    flowlog: fault.flowlog, // 流转日志
    html: fault.html,
    loading: loading.models.fault,
    curruserinfo: fault.userinfo, // 获取登录用户信息
  }))(Todolistdetails),
);
