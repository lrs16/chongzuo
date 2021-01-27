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
  Spin
} from 'antd';

import { PageHeaderWrapper } from '@ant-design/pro-layout';
// eslint-disable-next-line import/no-unresolved
import creatHistory from 'history/createHashHistory'; // 返回上一页
import SelectUser from '@/components/SelectUser'; // 选人组件
import styles from './index.less';
import ModelRollback from './components/ModelRollback'; // 回退组件

// 各个子组件
import RegisterChild from './components/RegisterChild'; // 故障登记
import ExamineChild from './components/ExamineChild'; // 系统运维商审核
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

const { Step } = Steps;
const { Panel } = Collapse;
const history1 = creatHistory(); // 返回上一页

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
    sm: { span: 18 }
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
];

const Collapsekeymap = new Map([
  ['故障登记', 'RegisterChild'], // 故障登记
  ['系统运维商审核', 'ExamineChild'], // 系统运维商审核
  ['系统运维商处理', 'HandleChild'], // 系统运维商处理
  ['registerDetails', 'RegisterQuery'], // 系统运维商处理详情
  // ['40', 'RegisterQuery'], // 系统运维商处理详情
  ['系统运维商确认总结', 'SummaryChild'], // 系统运维商确认总结
  ['自动化科业务负责人审核', 'ExamineSecondChild'], // 自动化科业务负责人审核
  ['自动化科专责确认', 'ConfirmChild'], // 自动化科专责确认
]);

function Todolistdetails(props) {
  const pagetitle = props.route.name;
  const [activeKey, setActiveKey] = useState([]);
  const [tabActiveKey, setTabActiveKey] = useState('faultForm');

  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表
  const [fileskey, setFileskey] = useState('1'); // 下载列表

  const [result, setResult] = useState('1');
  const [resultsecond, setResultsecond] = useState('1');
  const [resultconfirm, setResultconfirm] = useState('1');

  // 数据字典--处理结果
  const [selectvalue, setSelectValue] = useState('');

  const [showButton, setShowButton] = useState();

  const RegisterRef = useRef(); // 故障登记
  const ExamineRef = useRef(); // 系统运维商审核  自动化科业务负责人审核
  const HandleRef = useRef(); // 系统运维商处理
  const SummaryRef = useRef(); // 系统运维商确认总结
  const ConfirmRef = useRef(); // 自动化科专责确认

  const {
    location: { paneKey }, // 获取传入数据 // paneKey故障登记传过来的当前状态以及待办页传过来的状态（故障登记）
    loading,
    tododetailslist, // 待办详情数据--编辑
    tododetailslist: { troubleFlowLogs, check, handle, finish, confirm, troubleFlowNodeRows, main }, // troubleFlowLogs流程图数据  troubleFlowNodeRows详情是数据
    flowimageview, // 故障流程的流程图片数据
    flowlog, // 故障流程的流程日志
    dispatch,
    curruserinfo, // 当前用户登录信息
    curruserinfo: { userId } // 当前用户登录id
  } = props;

  const { params: { id } } = props.match; // 获取taskId

  // 二进制展示流程图
  const blob = new Blob([flowimageview]);
  image = (window.URL || window.webkitURL).createObjectURL(blob);

  const handleClose = () => { // 返回上一页
    history1.goBack();
  }

  const getFlowImage = () => { // 流程图
    dispatch({
      type: 'fault/fetchGetFlowImage',
      payload: { id: tododetailslist.main.id }
    });
  }

  const getFlowlog = () => { // 流程日志
    dispatch({
      type: 'fault/fetchGetFlowLog',
      payload: { id: tododetailslist.main.id }
    })
  }

  const handleTabChange = (key) => { // tab切换
    setTabActiveKey(key);
    getFlowImage();
    getFlowlog();
  };

  const callback = key => { // 激活tab
    setActiveKey(key);
  };

  const getfaultTodoDetailData = () => { // 故障待办详情数据
    dispatch({
      type: 'fault/getfaultTodoDetailData',
      payload: { id }
    })
  };

  const getCurrUserInfo = () => {  // 获取登录用户信息
    dispatch({
      type: 'fault/getCurrUserInfo'
    });
  }

  const dictDatas = () => { // 处理结果
    dispatch({
      type: 'fault/keyval',
      payload: {
        dictModule: 'trouble',
        dictType: 'handleresult',
      },
    }).then(res => {
      setSelectValue(res.data.handleresult);
    });
  }

  useEffect(() => {
    getCurrUserInfo(); // 获取登录用户信息
    setActiveKey([`${Collapsekeymap.get(paneKey)}`]);
    getfaultTodoDetailData();
    sessionStorage.setItem('Processtype', 'troub');
    dictDatas();
  }, []);

  useEffect(() => {
    sessionStorage.setItem('flowtype', '1');
  }, ['1']);

  const handleDelete = () => { // 删除操作！
    dispatch({
      type: 'fault/remove',
      payload: { id: tododetailslist.main.id }
    }).then(res => {
      if (res.code === 200) {
        getfaultTodoDetailData();
        message.success(res.msg);
        router.push(`/ITSM/faultmanage/todolist`);
      } else {
        message.error(res.msg);
      }
    })
  }

  const faultcircula = () => { // 流转
    const taskId = id;
    return dispatch({
      type: 'fault/getSubmitProToNextNode',
      payload: { taskId, result: '1', userIds: sessionStorage.getItem('NextflowUserId') }
    }).then(res => {
      if (res.code === 200) {
        getfaultTodoDetailData();
        message.success(res.msg);
        router.push(`/ITSM/faultmanage/todolist`);
      } else {
        message.error(res.msg);
        router.push(`/ITSM/faultmanage/todolist`);
      }
    })
  }

  // 各个表单验证
  const saveRegister = (cirStatus) => { // 故障登记
    // eslint-disable-next-line consistent-return
    RegisterRef.current.validateFields((err, values) => {
      if (cirStatus ? !err : true) {
        const formValues = values;
        formValues.registerOccurTime = values.registerOccurTime.format('YYYY-MM-DD HH:mm:ss');
        formValues.registerTime = values.registerTime.format('YYYY-MM-DD HH:mm:ss');
        formValues.taskId = id;
        formValues.editState = tododetailslist.editState;
        formValues.registerUserId = userId; // 当前登录人id
        if (files.ischange) {
          formValues.registerAttachments = JSON.stringify(files.arr);
        }

        // formValues.registerEffect = String(Number(values.registerEffect))
        if (tododetailslist.editState === 'edit') {
          formValues.registerId = tododetailslist.register.id;
        }
        formValues.editState = 'edit';
        return dispatch({
          type: 'fault/getfromsave', // 保存接口
          payload: { formValues }

        }).then(res => {
          if (res.code === 200) {
            getfaultTodoDetailData();
            if (cirStatus) {
              faultcircula();
            } else {
              message.success(res.msg);
            }
          } else {
            message.error(res.msg);
          }
        })
      }
    });
  }

  const saveExamine = (cirStatus) => { // 审核类型：1-系统运维商审核；2-自动化科业务负责人审核
    // eslint-disable-next-line consistent-return
    ExamineRef.current.validateFields((err, values) => {
      const formValues = values;
      if (formValues.checkTime) {
        formValues.checkTime = values.checkTime.format('YYYY-MM-DD HH:mm:ss');
      } else {
        formValues.checkTime = '';
      }
      if (cirStatus ? !err : true) {
        formValues.checkUserId = userId; // 当前登录人id
        formValues.taskId = id;
        formValues.checkType = paneKey === '系统运维商审核' ? '1' : '2';
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
          payload: { formValues }
        }).then(res => {
          if (res.code === 200) {
            // 保存成功后隐藏回退按钮
            setShowButton(false);
            getfaultTodoDetailData();
            if (cirStatus) {
              faultcircula();
            } else {
              message.success(res.msg);
            }
          } else {
            setShowButton(true);
            message.error(res.msg);
          }
        })
      }
    });
  }

  const saveHandle = (cirStatus) => { // 系统运维商处理
    // eslint-disable-next-line consistent-return
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
        if (fileskey === '1') {
          formValues.handleRecordAttachments = JSON.stringify(files.arr);
        } else if (fileskey === '2') {
          formValues.handlePictureAttachments = JSON.stringify(files.arr);
        } else if(fileskey === '3') {
          formValues.handleAttachments = JSON.stringify(files.arr);
        }

        if (tododetailslist.editState === 'edit') {
          formValues.handleId = tododetailslist.handle.id;
          formValues.editState = tododetailslist.editState;
        } else {
          formValues.handleId = tododetailslist.editGuid;
          formValues.editState = 'add';
        }
        // console.log(formValues, 'formValues')
        return dispatch({
          type: 'fault/getfromsave', // 保存接口
          payload: { formValues }
        }).then(res => {
          if (res.code === 200) {
            getfaultTodoDetailData();
            if (cirStatus) {
              faultcircula();
            } else {
              message.success(res.msg);
            }
          } else {
            message.error(res.msg);
          }
        })
      }
    });
  }

  const saveSummary = (cirStatus) => { // 系统运维商确认总结
    // eslint-disable-next-line consistent-return
    SummaryRef.current.validateFields((err, values) => {
      if (cirStatus ? !err : true) {
        const formValues = values;
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
        if (files.ischange) {
          if (fileskey === '1') {
            formValues.finishAnalysisAttachments = JSON.stringify(files.arr);
          } else {
            formValues.finishAttachments = JSON.stringify(files.arr);
          }
        }

        formValues.finishTime = values.finishTime.format('YYYY-MM-DD HH:mm:ss');
        formValues.finishRequiredTime = values.finishRequiredTime.format('YYYY-MM-DD HH:mm:ss'); // 要求上传时间
        if ((files.arr).length !== 0) {
          formValues.finishPracticeTime = (files.arr)[0].nowtime;
        } else if (values.finishPracticeTime !== '') {
          formValues.finishPracticeTime = values.finishPracticeTime.format('YYYY-MM-DD HH:mm:ss');
        } else {
          formValues.finishPracticeTime = ''
        }

        return dispatch({
          type: 'fault/getfromsave', // 保存接口
          payload: { formValues }
        }).then(res => {
          if (res.code === 200) {
            setShowButton(false);
            getfaultTodoDetailData();
            if (cirStatus) {
              faultcircula();
            } else {
              message.success(res.msg);
            }
          } else {
            message.error(res.msg);
          }
        })
      }
    });
  }

  const saveConfirm = (cirStatus) => { // 自动化科专责确认
    // eslint-disable-next-line consistent-return
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
          payload: { formValues }
        }).then(res => {
          if (res.code === 200) {
            setShowButton(false);
            getfaultTodoDetailData();
            if (cirStatus) {
              faultcircula();
            } else {
              message.success(res.msg);
            }
          } else {
            message.error(res.msg);
          }
        })
      }
    });
  }

  const handleSave = (savestatus) => { // 表单编辑保存，流转
    switch (paneKey) {
      case '故障登记':
        saveRegister(savestatus);
        break;
      case '系统运维商审核':
        saveExamine(savestatus);
        break;
      case '系统运维商处理':
        saveHandle(savestatus);
        break;
      case '系统运维商确认总结':
        saveSummary(savestatus);
        break;
      case '自动化科业务负责人审核':
        saveExamine(savestatus);
        break;
      case '自动化科专责确认':
        saveConfirm(savestatus);
        break;
      default:
        break
    }
  };

  // 上传附件触发保存
  useEffect(() => {
    if (files.ischange) {
      handleSave(tosaveStatus);
    }
  }, [files]);

  const rollbackSubmit = (values) => { // 回退操作
    dispatch({
      type: 'fault/rollback',
      payload: { taskId: id, backReason: values.rollbackOpinion, result: -1 }
    }).then(res => {
      if (res.code === 200) {
        message.info(res.msg);
        router.push(`/ITSM/faultmanage/todolist`);
      } else {
        message.error(res.msg);
      }
    })
  }

  const handleReceivs = () => { // 接单接口
    const taskId = id;
    return dispatch({
      type: 'fault/troubleHandleOrder',
      payload: { taskId }
    }).then(res => {
      if (res.code === 200) {
        message.info(res.msg);
        main.status = '45';
        getfaultTodoDetailData();
      } else {
        message.error(res.msg);
      }
    })
  }

  const handleFaulttransfer = () => { // 转单接口操作！
    const taskId = id;
    return dispatch({
      type: 'fault/getSubmitProToNextNode',
      payload: {
        taskId,
        result: '9',
        userIds: sessionStorage.getItem('NextflowUserId')
      }
    }).then(res => {
      if (res.code === 200) {
        message.success(res.msg);
        router.push(`/ITSM/faultmanage/todolist`);
      } else {
        message.error(res.msg);
        router.push(`/ITSM/faultmanage/todolist`);
      }
    })
  }

  const handleRegist = () => { // 登记按钮回到登记页
    // eslint-disable-next-line consistent-return
    ExamineRef.current.validateFields((err, values) => {
      const formValues = values;
      if (formValues.checkTime) {
        formValues.checkTime = values.checkTime.format('YYYY-MM-DD HH:mm:ss');
      } else {
        formValues.checkTime = '';
      }
      if (!err) {
        formValues.checkUserId = userId; // 当前登录人id
        formValues.taskId = id;
        formValues.checkType = paneKey === '系统运维商审核' ? '1' : '2';
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
          payload: { formValues }
        // eslint-disable-next-line consistent-return
        }).then(res => {
          if(res.code === 200) {
            const taskId = id;
            return dispatch({
              type: 'fault/getSubmitProToNextNode',
              payload: {
                ...values,
                taskId,
                result: '0',
                userIds: ''
              }
            }).then(res1 => {
              if (res1.code === 200) {
                message.success(res1.msg);
                router.push(`/ITSM/faultmanage/registration`);
              } else {
                message.error(res1.msg);
                router.push(`/ITSM/faultmanage/registration`);
              }
            })
          }
        })
      }
    });
  }

  const toHandle = () => { // 第二次审核回到处理
    // eslint-disable-next-line consistent-return
    ExamineRef.current.validateFields((err, values) => {
      const formValues = values;
      if (formValues.checkTime) {
        formValues.checkTime = values.checkTime.format('YYYY-MM-DD HH:mm:ss');
      } else {
        formValues.checkTime = '';
      }
      if (!err) {
        formValues.checkUserId = userId; // 当前登录人id
        formValues.taskId = id;
        formValues.checkType = paneKey === '系统运维商审核' ? '1' : '2';
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
          payload: { formValues }
        // eslint-disable-next-line consistent-return
        }).then(res => {
          if(res.code === 200) {
            const taskId = id;
            return dispatch({
              type: 'fault/getSubmitProToNextNode',
              payload: {
                ...values,
                taskId,
                result: '0',
                userIds: ''
              }
            }).then(res1 => {
              if (res1.code === 200) {
                message.success(res1.msg);
                router.push(`/ITSM/faultmanage/todolist`);
              } else {
                message.error(res1.msg);
                router.push(`/ITSM/faultmanage/todolist`);
              }
            })
          }
        })
      }
    });
  }

  const toHandle1 = () => { // 确认回到处理
    // eslint-disable-next-line consistent-return
    ConfirmRef.current.validateFields((err, values) => {
      if (!err) {
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
          payload: { formValues }
        // eslint-disable-next-line consistent-return
        }).then(res => {
          if(res.code === 200) {
            const taskId = id;
            return dispatch({
              type: 'fault/getSubmitProToNextNode',
              payload: {
                ...values,
                taskId,
                result: '0',
                userIds: ''
              }
            }).then(res1 => {
              if (res1.code === 200) {
                message.success(res1.msg);
                router.push(`/ITSM/faultmanage/todolist`);
              } else {
                message.error(res1.msg);
                router.push(`/ITSM/faultmanage/todolist`);
              }
            })
          }
        })
      }
    });
  }

  return (
    <PageHeaderWrapper
      extra={
        <>
          { // 删除按钮只有故障登记有
            paneKey === '故障登记' && (
              <Popconfirm title="确定删除吗？" onConfirm={() => handleDelete()}>
                <Button type="danger">删除</Button>
              </Popconfirm>
            )
          }
          { // 回退按钮--系统运维商审核， 系统运维商确认总结，自动化科业务负责人审核, 自动化科确认有
            (paneKey !== '故障登记' && paneKey !== '故障关闭' && (main && main.status !== '45') && (main && main.status !== '40')) && showButton !== false && (
              <ModelRollback title="填写回退意见" rollbackSubmit={values => rollbackSubmit(values)}>
                <Button type="danger" ghost>回退</Button>
              </ModelRollback>
            )
          }
          { // 接单只有系统运维商处理时有
            (main && main.status === '40') && (
              <Button type="primary" onClick={() => handleReceivs()}>接单</Button>
            )
          }
          {(main && main.status !== '40') && (<Button type="primary" onClick={() => handleSave(tosaveStatus)}>保存</Button>)}
          { // 转单只有系统运维商处理时有
            (main && main.status === '45') && (
              <SelectUser
                handleSubmit={handleFaulttransfer}
                taskId={id}
                changorder="请选择转单处理"
              >
                <Button type="primary">转单</Button>
              </SelectUser>
            )
          }
          {/* 确认过程的时候不需要选人 1通过直接关闭 */}
          {
            paneKey === '自动化科专责确认' ?
              (resultconfirm === '1' && (<Button
                type="primary"
                onClick={() => handleSave(currenStatus)}
              >
                关闭
              </Button>))
              :
              ((main && main.status !== '40') && result === '1' && resultsecond === '1') && (<SelectUser
                handleSubmit={() => handleSave(currenStatus)}
                taskId={id}
              >
                <Button
                  type="primary"
                >
                  流转
                    </Button>
              </SelectUser>)
          }
          {result === '0' && (<Button
            type="primary"
            onClick={handleRegist}
          >
            登记
          </Button>)}
          {(resultsecond === '0') && (<Button
            type="primary"
            onClick={toHandle}
          >
            处理
          </Button>)}
          {resultconfirm === '0' && (<Button
            type="primary"
            onClick={toHandle1}
          >
            处理
          </Button>)}
          <Button type="default" onClick={handleClose}>返回</Button>
        </>
      }
      title={pagetitle}
      tabList={tabList}
      onTabChange={handleTabChange}
      tabActiveKey={tabActiveKey}
    >
      {
        (tabActiveKey === 'faultForm' &&
          <div className={styles.collapse}>
            <Card
              style={{
                background: '#fff',
                // padding: 10,
                border: '1px solid #e8e8e8',
                overflowX: 'auto',
              }}
            >
              {
                troubleFlowLogs &&
                (<Steps
                  current={troubleFlowLogs.length - 1}
                  size="small"
                >
                  {
                    troubleFlowLogs && troubleFlowLogs.map(({ key, name, status, timeText, formHandler, startTime }) => [
                      name !== '开始节点' && name !== '结束节点' && <Step key={key} title={`${name}${'\xa0'}${'\xa0'}(${status})${'\xa0'}${'\xa0'}${timeText}`} description={
                        <div className={styles.stepDescription}>
                          处理人：{formHandler}
                          <div>开始时间：{moment(startTime).format('YYYY-MM-DD hh:mm:ss')}</div>
                        </div>
                      } />
                    ])}
                </Steps>)
              }
            </Card>
            <Spin spinning={loading}>
              {
                loading === false && tododetailslist && (
                  <Collapse
                    expandIconPosition="right"
                    activeKey={activeKey}
                    bordered={false}
                    style={{ marginTop: '-25px' }}
                    onChange={callback}
                  >
                    { // 故障登记编辑页---（故障登记时）
                      (paneKey === '故障登记') && (
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
                          />
                        </Panel>
                      )
                    }
                    { // 系统运维商审核编辑页
                      (paneKey === '系统运维商审核') &&
                      ( // 展开系统运维商审核表单时，显示故障登记详情（1）
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
                            result={result}
                          />
                        </Panel>
                      )
                    }
                    { // 系统运维商处理编辑页
                      (paneKey === '系统运维商处理') && (main && main.status === '45') &&
                      ( // 展开处理表单时，显示故障审核详情以及登记详情（2）
                        <Panel header="系统运维商处理" key="HandleChild">
                          <HandleChild
                            ref={HandleRef}
                            formItemLayout={formItemLayout}
                            forminladeLayout={forminladeLayout}
                            handle={handle}
                            curruserinfo={curruserinfo}
                            selectvalue={selectvalue}
                            ChangeFiles={newvalue => {
                              setFiles(newvalue);
                            }}
                            ChangeFileskey={newvalue => setFileskey(newvalue)}
                          />
                        </Panel>
                      )
                    }
                    { // 系统运维商确认总结编辑页
                      (paneKey === '系统运维商确认总结') && (
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
                            ChangeFileskey={newvalue => setFileskey(newvalue)}
                          />
                        </Panel>
                      )
                    }
                    { // 自动化科业务负责人审核编辑页
                      (paneKey === '自动化科业务负责人审核') && (
                        <Panel header="自动化科业务负责人审核" key="ExamineSecondChild">
                          <ExamineSecondChild
                            ref={ExamineRef}
                            formItemLayout={formItemLayout}
                            forminladeLayout={forminladeLayout}
                            check={check}
                            curruserinfo={curruserinfo}
                            ChangeFiles={newvalue => {
                              setFiles(newvalue);
                            }}
                            ChangeResult={newvalue => {
                              setResultsecond(newvalue);
                            }}
                            resultsecond={resultsecond}
                          />
                        </Panel>
                      )
                    }
                    {// 自动化科专责确认编辑页
                      (paneKey === '自动化科专责确认') &&
                      (
                        <Panel header="自动化科专责确认" key="ConfirmChild">
                          <ConfirmChild
                            ref={ConfirmRef}
                            formItemLayout={formItemLayout}
                            forminladeLayout={forminladeLayout}
                            confirm={confirm}
                            curruserinfo={curruserinfo}
                            ChangeFiles={newvalue => {
                              setFiles(newvalue);
                            }}
                            ChangeResult={newvalue => {
                              setResultconfirm(newvalue);
                            }}
                            resultconfirm={resultconfirm}
                          />
                        </Panel>
                      )
                    }

                    {troubleFlowNodeRows && (troubleFlowNodeRows.map((obj) => {
                      // panel详情组件
                      const Paneldesmap = new Map([
                        ['故障登记', <RegisterQuery info={obj} maindata={main} />],
                        ['系统运维商审核', <ExamineQuery info={obj} maindata={main} />],
                        ['系统运维商处理', <HandleQuery info={obj} maindata={main} />],
                        ['系统运维商确认总结', <SummaryQuery info={obj} maindata={main} />],
                        ['自动化科业务负责人审核', <ExamineSecondQuery info={obj} maindata={main} />],
                        ['自动化科专责确认', <ConfirmQuery info={obj} maindata={main} />],
                      ]);
                      return (
                        <Panel Panel header={obj.fnname} key={obj.id}>
                          {Paneldesmap.get(obj.fnname)}
                        </Panel>
                      );
                    }))
                    }
                  </Collapse>
                )
              }
            </Spin>
          </div>
        )
      }
      {
        (tabActiveKey === 'faultPro' && (
          <div className={styles.collapse}>
            <Card title='故障管理流程'>
              <div
                style={{
                  background: '#fff',
                  // padding: 20,
                }}
              >
                {/* 通过图片--二进制 展示流程图 */}
                <img src={image} alt='' />
              </div>
            </Card>
            <Card title='流转日志' style={{ marginTop: '-1px' }}>
              {
                loading === false && flowlog &&
                (
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
                      {
                        flowlog && flowlog.troubleFlowLogs.map(({ key, name, status, startTime, formHandler, backReason }) => [
                          name !== '开始节点' && name !== '结束节点' && <Step key={key} title={`${name}${'\xa0'}${'\xa0'}(${status})`} description={
                            <div className={styles.stepDescription}>
                              处理人：{formHandler}
                              <div>{moment(startTime).format('YYYY-MM-DD hh:mm:ss')}</div>
                              <div>{status === '退回' && `回退原因：${backReason}`}</div>
                            </div>
                          } />
                        ])}
                    </Steps>
                  </div>
                )
              }
            </Card>
          </div>
        ))
      }
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ fault, loading }) => ({
    tododetailslist: fault.tododetailslist, // 详情的编辑数据
    flowimageview: fault.flowimageview, // 流程图view
    flowlog: fault.flowlog, // 流转日志
    html: fault.html,
    loading: loading.models.fault,
    curruserinfo: fault.curruserinfo, // 获取登录用户信息
  }))(Todolistdetails),
);