import React, { useState, useRef, useEffect, useContext } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Collapse, message } from 'antd';
import { openNotification } from '@/utils/utils';
import SubmitTypeContext from '@/layouts/MenuContext';
import DictLower from '@/components/SysDict/DictLower';
import User from '@/components/SelectUser/User';
import Registrat from './components/Registrat';
import Examine from './components/Examine';
import ImplementationPre from './components/ImplementationPre';
import VersionAudit from './components/VersionAudit';
import Implementation from './components/Implementation';
import BusinessReview from './components/BusinessReview';
import TaskLinks from './components/TaskLinks';
import HistoryOrderInfo from './components/HistoryOrderInfo';

const { Panel } = Collapse;

function WorkOrder(props) {
  const { location, dispatch, userinfo, info, currentTaskStatus, buttype, statuse, tasklinks, historyinfo, timeoutinfo, userlist, indexUser, defaultUsers } = props;
  const { taskName, Id } = location.query;
  const [activeKey, setActiveKey] = useState(['form']);
  const [selectdata, setSelectData] = useState({ arr: [], ischange: false }); // 下拉值
  const [uservisible, setUserVisible] = useState(false);        // 是否显示选人组件
  const [userchoice, setUserChoice] = useState(false);          // 已经选择人员
  const { submittype } = useContext(SubmitTypeContext);

  // 保存，保存提交
  const RegistratRef = useRef();
  const ExamineRef = useRef();
  const ImplementationPreRef = useRef();
  const VersionAuditRef = useRef();
  const ImplementationRef = useRef();
  const BusinessReviewRef = useRef();

  // 流程提交
  const tosubmit = (type) => {
    if (statuse === 200 && userlist) {
      dispatch({
        type: 'releasetodo/releaseflow',
        payload: {
          taskId: currentTaskStatus.taskId,
          type: type || submittype,
          userIds: sessionStorage.getItem('NextflowUserId'),
        },
      });
    }
  }
  // 获取出厂测试、平台验证表单信息
  const getregistratformvalues = () => {
    const val = RegistratRef.current.getVal();
    const { releaseAttaches, releaseEnvs, releaseLists, testOperator, testPlace, testResult, testUnit, versionNo } = val;
    const testStart = moment(val.testStart).format('YYYY-MM-DD HH:mm:ss');
    const testEnd = moment(val.testEnd).format('YYYY-MM-DD HH:mm:ss');
    if (taskName === '出厂测试') {
      const { dutyUnit, influenceScope, registerTime, registerUnit, registerUnitId, registerUser, registerUserId, releaseNo, releaseType } = val;
      const register = {
        saveItems: 'releaseRegister,releaseEnvs,releaseLists,releaseAttaches',
        releaseMain: { releaseType, dutyUnit, releaseNo },
        releaseRegister: {
          testUnit: testUnit.toString(),
          testStart, testEnd, testPlace, testOperator, influenceScope, testResult, registerTime, registerUnit, registerUnitId, registerUser, registerUserId,
        },
        releaseAttaches,
        releaseEnvs,
        releaseLists,
      };
      return register
    }
    const { validResult } = val;
    const validform = {
      releaseNo: Id,
      versionNo,
      formValid: {
        testUnit: testUnit ? testUnit.toString() : '',
        testStart, testEnd, testOperator, testPlace, testResult, validResult,
        //  validComments: val.validResult === '通过' ? val.validComments : val.validComments1,
      },
      releaseAttaches,
      releaseEnvs,
      releaseLists,
    };
    return validform

  };
  // 出厂测试保存流转
  const FactorytestSubmit = () => {
    if (buttype === 'save' || buttype === 'over') {
      const register = getregistratformvalues();
      dispatch({
        type: 'releasetodo/factorytest',
        payload: {
          register,
          buttype,
        },
      });
    };
    if (buttype === 'flow') {
      setUserChoice(false);
      sessionStorage.removeItem('NextflowUserId');
      RegistratRef.current.Forms((err) => {
        if (err) {
          // message.error('请将信息填写完整')
          openNotification(Object.values(err))
        } else {
          sessionStorage.setItem('flowtype', '1');
          const register = getregistratformvalues();
          dispatch({
            type: 'releasetodo/factorytest',
            payload: {
              register,
              buttype,
            },
          });
          setUserVisible(true)
        }
      })
    }
  }
  // 开发商项目经理审核
  const saveExamine = () => {
    const val = ExamineRef.current.getVal();
    const examineform = () => {
      let formval = {}
      if (taskName === '开发商项目经理审核') {
        formval = {
          saveItems: `'devmanageCheck,releaseAttaches'`,
          releaseNo: Id,
          devmanageCheck: {
            checkResult: val.checkResult,
            testResult: val.testResult,
          },
          releaseAttaches: val.releaseAttaches,
        };
      } else {
        formval = {
          saveItems: `'devopsCheck,releaseAttaches'`,
          releaseNo: Id,
          devopsCheck: {
            checkResult: val.checkResult,
            testResult: val.testResult,
          },
          releaseAttaches: val.releaseAttaches,
        }
      };
      return formval;
    }
    dispatch({
      type: 'releasetodo/check',
      payload: {
        examineform: examineform(),
        buttype,
        submitval: {
          taskId: currentTaskStatus.taskId,
          type: submittype,
          userIds: sessionStorage.getItem('NextflowUserId'),
        },
        taskName
      },
    });
  }
  const examineSubmit = () => {
    switch (buttype) {
      case 'save':
        saveExamine();
        break;
      case 'flow':
        setUserChoice(false);
        sessionStorage.removeItem('NextflowUserId');
        ExamineRef.current.Forms((err) => {
          if (err) {
            // message.error('请将信息填写完整')
            openNotification(Object.values(err))
          } else {
            sessionStorage.setItem('flowtype', '1');
            saveExamine();
            setUserVisible(true);
            // tosubmit();  
          }
        })
        break;
      case 'noPass':
        // setUserChoice(false);
        sessionStorage.removeItem('NextflowUserId');
        ExamineRef.current.Forms((err) => {
          if (err) {
            // message.error('请将信息填写完整')
            openNotification(Object.values(err))
          } else {
            saveExamine();
          }
        })
        break;
      default:
        break;
    }
  }

  // 平台验证保存流转
  const savelatformValid = () => {
    //  const userIds = userlist.map(obj => obj.userId);
    const platform = getregistratformvalues();
    dispatch({
      type: 'releasetodo/platformvalid',
      payload: {
        platform: {
          saveItems: 'platformValid,releaseEnvs,releaseLists,releaseAttaches',
          releaseNo: Id,
          versionNo: platform.versionNo,
          platformValid: platform.formValid,
          releaseAttaches: platform.releaseAttaches,
          releaseEnvs: platform.releaseEnvs,
          releaseLists: platform.releaseLists,
        },
        buttype,
        submitval: {
          taskId: currentTaskStatus.taskId,
          type: submittype,
          userIds: sessionStorage.getItem('NextflowUserId'),
        }
      },
    });
  }
  const platformValidSubmit = () => {
    switch (buttype) {
      case 'save':
        savelatformValid();
        break;
      case 'flow':
        // setUserChoice(false);
        sessionStorage.removeItem('NextflowUserId');
        RegistratRef.current.Forms((err) => {
          if (err) {
            // message.error('请将信息填写完整')
            openNotification(Object.values(err))
          } else {
            sessionStorage.setItem('flowtype', '1');
            savelatformValid();
            setUserVisible(true);
            // tosubmit();  
          }
        })
        break;
      case 'noPass':
        // setUserChoice(false);
        sessionStorage.removeItem('NextflowUserId');
        RegistratRef.current.Forms((err) => {
          if (err) {
            // message.error('请将信息填写完整')
            openNotification(Object.values(err))
          } else {
            savelatformValid();
          }
        })
        break;
      default:
        break;
    }
  }

  // 业务验证保存流转
  const savebizValidate = () => {
    // const userIds = userlist.map(obj => obj.userId);
    const bizValidate = getregistratformvalues();
    dispatch({
      type: 'releasetodo/bizvalid',
      payload: {
        bizValidate: {
          saveItems: 'releaseBizValid,releaseEnvs,releaseLists,releaseAttaches',
          releaseNo: Id,
          releaseBizValid: bizValidate.formValid,
          releaseAttaches: bizValidate.releaseAttaches,
          releaseEnvs: bizValidate.releaseEnvs,
          releaseLists: bizValidate.releaseLists,
        },
        buttype,
        userIds: sessionStorage.getItem('NextflowUserId'),
        taskId: currentTaskStatus.taskId,
      },
    });
  }
  const bizValidateParamSubmit = () => {
    switch (buttype) {
      case 'save':
        savebizValidate();
        break;
      case 'flow':
        // setUserChoice(false);
        sessionStorage.removeItem('NextflowUserId');
        RegistratRef.current.Forms((err, values) => {
          if (err) {
            // message.error('请将信息填写完整')
            openNotification(Object.values(err))
          } else {
            const releaseStatus = values.releaseLists.map(item => {
              return item.verifyStatus;
            });
            if (releaseStatus.includes('已转出') || releaseStatus.includes(null) || releaseStatus.includes('')) {
              message.error('发布清单还未全部验证，无法流转')
            } else {
              savebizValidate();
              sessionStorage.setItem('flowtype', '1');
              setUserVisible(true);
              // tosubmit();
            }
          }
        })
        break;
      case 'noPass':
        // 点击出厂测试按钮（20211118取消该按钮）
        sessionStorage.removeItem('NextflowUserId');
        RegistratRef.current.Forms((err, values) => {
          if (err) {
            // message.error('请将信息填写完整')
            openNotification(Object.values(err))
          } else {
            const releaseStatus = values.releaseLists.map(item => {
              return item.verifyStatus;
            });
            if (releaseStatus.includes('已转出') || releaseStatus.includes(null) || releaseStatus.includes('')) {
              message.error('发布清单还未全部验证，无法流转')
            } else {
              savebizValidate();
            }
          }
        })
        break;
      default:
        break;
    }
  }

  // 发布实施准备保存流转
  const savepracticePre = () => {
    //  const userIds = userlist.map(obj => obj.userId);
    const val = ImplementationPreRef.current.getVal();
    dispatch({
      type: 'releasetodo/implementationpre',
      payload: {
        formValue: {
          saveItems: 'practicePre, practiceDevices, practicePersonList, practiceSteps, practiceRisks, releaseLists, releaseAttaches',
          releaseNo: Id,
          practicePre: {
            summary: val.summary,
            adjustRunMode: val.adjustRunMode,
            appModule: val.appModule,
            beginPlanTime: moment(val.beginPlanTime).format('YYYY-MM-DD HH:mm:ss'),
            endPlanTime: moment(val.endPlanTime).format('YYYY-MM-DD HH:mm:ss'),
            bizStopBegin: moment(val.bizStopBegin).format('YYYY-MM-DD HH:mm:ss'),
            bizStopEnd: moment(val.bizStopEnd).format('YYYY-MM-DD HH:mm:ss'),
            bizStopVisit: val.bizStopVisit,
            syncData: val.syncData,
            affectBiz: val.syncData,
            affectUser: val.affectUser,
            specialRequest: val.specialRequest,
            rollbackPaln: val.rollbackPaln,
            platformCheck: val.platformCheck,
            preResult: val.preResult,
            preAdvise: val.preResult === '通过' ? val.preAdvise1 : val.preAdvise,
          },
          practiceDevices: val.practiceDevices,
          practicePersonList: val.practicePersonList,
          practiceRisks: val.practiceRisks,
          practiceSteps: val.practiceSteps,
          releaseAttaches: val.releaseAttaches,
          releaseLists: val.releaseLists,
        },
        buttype,
        submitval: {
          taskId: currentTaskStatus.taskId,
          type: submittype,
          userIds: sessionStorage.getItem('NextflowUserId'),
        }
      },
    });
  }
  const practicePreSubmit = () => {
    switch (buttype) {
      case 'save':
        savepracticePre();
        break;
      case 'flow':
        ImplementationPreRef.current.Forms((err) => {
          if (err) {
            // message.error('请将信息填写完整')
            openNotification(Object.values(err))
          } else {
            savepracticePre();
            sessionStorage.setItem('flowtype', '1');
            setUserVisible(true);
            // tosubmit();
          }
        })
        break;
      case 'noPass':
        // setUserChoice(false);
        sessionStorage.removeItem('NextflowUserId');
        ImplementationPreRef.current.Forms((err) => {
          if (err) {
            // message.error('请将信息填写完整')
            openNotification(Object.values(err))
          } else {
            savepracticePre();
            sessionStorage.setItem('flowtype', '1');
            // setUserVisible(true);
            // tosubmit();
          }
        })
        break;
      default:
        break;
    }
  };

  // 版本管理员审核,科室负责人审核，中心领导审核保存流转
  const saveVersionAudit = () => {
    // const userIds = userlist.map(obj => obj.userId);
    const values = VersionAuditRef.current.getVal();
    dispatch({
      type: 'releasetodo/checkversion',
      payload: {
        values: {
          ...values,
          releaseNo: Id,
          releaseBeginTime: values.releaseBeginTime ? moment(values.releaseBeginTime).format('YYYY-MM-DD HH:mm:ss') : '',
          releaseEndTime: values.releaseBeginTime ? moment(values.releaseEndTime).format('YYYY-MM-DD HH:mm:ss') : '',
        },
        releaseAttaches: { mainId: values.releaseAttaches[0].mainId, taskId: values.releaseAttaches[0].taskId, releaseAttaches: values.releaseAttaches },
        releaseNo: Id,
        buttype,
        taskName,
        // userIds: sessionStorage.getItem('NextflowUserId'),
        taskId: currentTaskStatus.taskId,
      },
    });
  }
  const VersionAuditSubmit = () => {
    switch (buttype) {
      case 'save':
        saveVersionAudit()
        break;
      case 'flow': {
        setUserChoice(false);
        sessionStorage.removeItem('NextflowUserId');
        const orderkeyAndTimeout = info && info.releaseMains && info.releaseMains.filter(item => item.timeoutResult && item.timeoutResult.timeout && !item.timeoutResult.reason);
        if (orderkeyAndTimeout.length > 0 && info.releaseMains?.length > 1) {
          message.error('有工单已超时且没有填写超时原因')
        } else {
          VersionAuditRef.current.Forms((err) => {
            if (err) {
              // message.error('请将信息填写完整')
              openNotification(Object.values(err))
            } else {
              sessionStorage.setItem('flowtype', '1');
              saveVersionAudit();
              setUserVisible(true);
            }
          })
        }
      }
        break;
      case 'noPass':
        sessionStorage.removeItem('NextflowUserId');
        VersionAuditRef.current.Forms((err) => {
          if (err) {
            // message.error('请将信息填写完整')
            openNotification(Object.values(err))
          } else {
            saveVersionAudit();
          }
        })
        break;
      default:
        break;
    }
  };

  // 发布验证
  const saveracticeDone = () => {
    //  const userIds = userlist.map(obj => obj.userId);
    const values = ImplementationRef.current.getVal();
    const { releaseAttaches, releaseLists, practiceTime, practicer, doneDesc, legacyDesc } = values;
    dispatch({
      type: 'releasetodo/racticedone',
      payload: {
        practicedoneparam: {
          releaseNo: Id,
          saveItems: 'practiceDone, releaseLists, releaseAttaches',
          releaseAttaches,
          releaseLists,
          practiceDone: { practiceTime: moment(practiceTime).format('YYYY-MM-DD HH:mm:ss'), practicer, doneDesc, legacyDesc },
        },
        buttype,
        // userIds: userIds.join(','),
        taskId: currentTaskStatus.taskId,
      },
    });
  }
  const racticeDoneSubmit = () => {
    switch (buttype) {
      case 'save':
        saveracticeDone()
        break;
      case 'flow':
        setUserChoice(false);
        sessionStorage.removeItem('NextflowUserId');
        ImplementationRef.current.Forms((err) => {
          if (err) {
            // message.error('请将信息填写完整')
            openNotification(Object.values(err))
          } else {
            sessionStorage.setItem('flowtype', '1');
            // setUserVisible(true);
            // tosubmit();
            saveracticeDone();
            setUserVisible(true);
          }
        })
        break;
      default:
        break;
    }
  };

  // 业务复核
  const savebusinessReview = () => {
    const values = BusinessReviewRef.current.getVal();
    const { releaseAttaches, releaseLists, practiceTime, practicer, doneDesc, legacyDesc, checkComments } = values;
    dispatch({
      type: 'releasetodo/bizcheck',
      payload: {
        bizcheckparam: {
          releaseNo: Id,
          saveItems: 'releaseBizCheck, releaseLists, releaseAttaches',
          releaseAttaches,
          releaseLists,
          releaseBizCheck: { practiceTime: moment(practiceTime).format('YYYY-MM-DD HH:mm:ss'), practicer, doneDesc, legacyDesc, checkComments },
        },
        buttype,
        userIds: '',
        taskId: currentTaskStatus.taskId,
      },
    });
  }
  const businessReviewSubmit = () => {
    switch (buttype) {
      case 'save':
        savebusinessReview()
        break;
      case 'flow':
        setUserChoice(false);
        sessionStorage.removeItem('NextflowUserId');
        BusinessReviewRef.current.Forms((err, values) => {
          if (err) {
            // message.error('请将信息填写完整')
            openNotification(Object.values(err))
          } else {
            const releaseStatus = values.releaseLists.map(item => {
              return item.verifyStatus;
            });
            if (releaseStatus.includes('已转出') || releaseStatus.includes(null) || releaseStatus.includes('')) {
              message.error('发布清单还未全部复核，无法流转')
            } else {
              savebusinessReview();
            }
          }
        })
        break;
      default:
        break;
    }
  }

  const callback = key => {
    setActiveKey(key);
  };

  // 初始化用户信息，流程类型
  useEffect(() => {
    dispatch({
      type: 'itsmuser/fetchuser',
    });
    sessionStorage.setItem('Processtype', 'release');
    return () => {
      sessionStorage.removeItem('Processtype');
    }
  }, []);

  // 打开待办
  useEffect(() => {
    if (Id) {
      // 打开待办
      dispatch({
        type: 'releasetodo/openflow',
        payload: {
          releaseNo: Id,
          taskName
        },
      });
      // 获取工单历史信息
      dispatch({
        type: 'releaseview/fetchview',
        payload: {
          releaseNo: Id,
        },
      });
      // 获取超时信息
      dispatch({
        type: 'releasetodo/gettimeoutinfo',
        payload: {
          taskId: location.query.taskId,
        },
      });
      // 获取流转用户列表
      if (taskName !== '业务复核') {
        dispatch({
          type: 'itsmuser/releaseuserlist',
          payload: {
            taskId: location.query.taskId,
            type: '1',
          },
        });
      }
    }
  }, [Id])

  useEffect(() => {
    if (location.state) {
      // 点击菜单刷新,并获取数据
      if (location.state.reset) {
        dispatch({
          type: 'releasetodo/openflow',
          payload: {
            releaseNo: Id,
            taskName
          },
        });
      };
    }
  }, [location.state]);

  // 点击按钮
  useEffect(() => {
    if (buttype) {
      if (buttype === 'goback') {
        dispatch({
          type: 'releasetodo/releaseflow',
          payload: {
            taskId: currentTaskStatus.taskId,
            type: 2,
            userIds: '',
          },
        });
      } if (buttype === 'open') {
        // 业务验证分派重分派成功重新获取数据
        dispatch({
          type: 'releasetodo/openflow',
          payload: {
            releaseNo: Id,
            taskName
          },
        });
      } else if (userlist || taskName === '业务复核') {
        switch (taskName) {
          case '出厂测试':
            FactorytestSubmit();
            break;
          case '开发商项目经理审核':
          case '系统运维商经理审核':
            examineSubmit();
            break;
          case '平台验证':
            platformValidSubmit();
            break;
          case '业务验证':
            bizValidateParamSubmit();
            break;
          case '发布实施准备':
            practicePreSubmit();
            break;
          case '版本管理员审核':
          case '科室负责人审核':
          case '中心领导审核':
            VersionAuditSubmit();
            break;
          case '发布验证':
            racticeDoneSubmit();
            break;
          case '业务复核':
            businessReviewSubmit();
            break;
          default:
            break;
        }
      }
    }
  }, [buttype])

  // 选人完成走提交接口
  useEffect(() => {
    if (userchoice) {
      tosubmit()
    }
  }, [userchoice])

  return (
    <>
      <DictLower
        typeid="443"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      {(taskName !== '版本管理员审核' || taskName === '版本管理员审核' && info && info.releaseMains && info.releaseMains.length === 1) && (
        <TaskLinks records={tasklinks || []} taskName={taskName} />
      )}
      <div className='ordercollapse'>
        <Collapse
          expandIconPosition="right"
          activeKey={activeKey}
          bordered={false}
          onChange={callback}
        >
          {taskName === '出厂测试' && info && info.releaseRegister && (
            <Panel header={taskName} key="form">
              <Registrat
                wrappedComponentRef={RegistratRef}
                selectdata={selectdata}
                isEdit
                taskName='出厂测试'
                info={info}
                userinfo={userinfo}
                timeoutinfo={timeoutinfo}
              />
            </Panel>
          )}
          {taskName === '开发商项目经理审核' && info && info.devmanageCheck && (
            <Panel header={taskName} key="form">
              <Examine
                wrappedComponentRef={ExamineRef}
                selectdata={selectdata}
                isEdit
                taskName={taskName}
                info={info}
                userinfo={userinfo}
                timeoutinfo={timeoutinfo}
              />
            </Panel>
          )}
          {taskName === '平台验证' && info && info.platformValid && (
            <Panel header={taskName} key="form">
              <Registrat
                wrappedComponentRef={RegistratRef}
                selectdata={selectdata}
                isEdit
                taskName='平台验证'
                info={info}
                userinfo={userinfo}
                timeoutinfo={timeoutinfo}
              />
            </Panel>
          )}
          {taskName === '系统运维商经理审核' && info && info.devopsCheck && (
            <Panel header={taskName} key="form">
              <Examine
                wrappedComponentRef={ExamineRef}
                selectdata={selectdata}
                isEdit
                taskName={taskName}
                info={info}
                userinfo={userinfo}
                timeoutinfo={timeoutinfo}
              />
            </Panel>
          )}
          {taskName === '业务验证' && info && info.releaseBizValid && (
            <Panel header={taskName} key="form">
              <Registrat
                wrappedComponentRef={RegistratRef}
                selectdata={selectdata}
                isEdit
                taskName='业务验证'
                info={info}
                userinfo={userinfo}
                timeoutinfo={timeoutinfo}
              />
            </Panel>
          )}
          {taskName === '发布实施准备' && info && info.releaseAttaches && (
            <Panel header={taskName} key="form">
              <ImplementationPre
                wrappedComponentRef={ImplementationPreRef}
                selectdata={selectdata}
                isEdit
                taskName={taskName}
                info={info}
                userinfo={userinfo}
                timeoutinfo={timeoutinfo}
              />
            </Panel>
          )}
          {taskName === '版本管理员审核' && info && info.mergeOrder && (
            <Panel header={taskName} key="form">
              <VersionAudit
                wrappedComponentRef={VersionAuditRef}
                selectdata={selectdata}
                isEdit
                taskName={taskName}
                info={info}
                userinfo={userinfo}
                timeoutinfo={timeoutinfo}
              />
            </Panel>
          )}
          {(taskName === '科室负责人审核' || taskName === '中心领导审核') && info && info.checkMerge && (
            <Panel header={taskName} key="form">
              <VersionAudit
                wrappedComponentRef={VersionAuditRef}
                selectdata={selectdata}
                isEdit
                taskName={taskName}
                info={info}
                userinfo={userinfo}
                timeoutinfo={timeoutinfo}
              />
            </Panel>
          )}
          {taskName === '发布验证' && info && info.practiceDone && (
            <Panel header={taskName} key="form">
              <Implementation
                wrappedComponentRef={ImplementationRef}
                selectdata={selectdata}
                isEdit
                taskName={taskName}
                info={info}
                userinfo={userinfo}
                timeoutinfo={timeoutinfo}
              />
            </Panel>
          )}
          {taskName === '业务复核' && info && info.releaseBizCheck && (
            <Panel header={taskName} key="form">
              <BusinessReview
                wrappedComponentRef={BusinessReviewRef}
                selectdata={selectdata}
                isEdit
                taskName={taskName}
                info={info}
                userinfo={userinfo}
                timeoutinfo={timeoutinfo}
              />
            </Panel>
          )}
        </Collapse>
      </div>
      {historyinfo && <HistoryOrderInfo records={historyinfo} selectdata={selectdata} />}
      {currentTaskStatus && currentTaskStatus.taskId && (
        <User
          taskId={currentTaskStatus.taskId}
          visible={uservisible}                       // 传参显示选人modle
          ChangeUserVisible={v => setUserVisible(v)}  // 选人完成关闭选人modle
          changorder='平台验证'                        //  下一环节名
          ChangeChoice={v => setUserChoice(v)}         //  选人完成返回状态true，通过true判读，进行
          ChangeType={v => (v)}                        //  取消，重置按钮类型    
          indexUser={taskName === '发布验证' && defaultUsers?.length ? defaultUsers.map(obj => obj.userId) : indexUser}
          defaultUsers={taskName === '发布验证' ? defaultUsers : undefined}
          submitStatus={statuse}
        />
      )}
    </>
  );
}

export default connect(({ releasetodo, releaseview, itsmuser, loading }) => ({
  info: releasetodo.info,
  currentTaskStatus: releasetodo.currentTaskStatus,
  tasklinks: releasetodo.tasklinks,
  timeoutinfo: releasetodo.timeoutinfo,
  statuse: releasetodo.statuse,
  historyinfo: releaseview.historyinfo,
  userinfo: itsmuser.userinfo,
  userlist: itsmuser.userlist,
  defaultUsers: itsmuser.defaultUsers,
  loading: loading.models.releasetodo,
}))(WorkOrder);