import React, { useState, useRef, useEffect, useContext } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Collapse, Steps, Spin, message } from 'antd';
import SubmitTypeContext from '@/layouts/MenuContext';
import DictLower from '@/components/SysDict/DictLower';
import User from '@/components/SelectUser/User';
import Registrat from './components/Registrat';
import ImplementationPre from './components/ImplementationPre';
import VersionAudit from './components/VersionAudit';
import Implementation from './components/Implementation';
import BusinessReview from './components/BusinessReview';
import styles from './index.less';

const { Panel } = Collapse;
const { Step } = Steps;

function WorkOrder(props) {
  const { location, dispatch, userinfo, info, currentTaskStatus, buttype, ChangeSaved, statuse } = props;
  const { taskName, Id } = location.query;
  const [activeKey, setActiveKey] = useState(['form']);
  const [selectdata, setSelectData] = useState({ arr: [], ischange: false }); // 下拉值
  const [uservisible, setUserVisible] = useState(false);        // 是否显示选人组件
  const [userchoice, setUserChoice] = useState(false);          // 已经选择人员  
  const { submittype } = useContext(SubmitTypeContext);

  // 保存，保存提交
  const RegistratRef = useRef();
  const ImplementationPreRef = useRef();
  const VersionAuditRef = useRef();
  const ImplementationRef = useRef();
  const BusinessReviewRef = useRef();

  // 流程提交
  const tosubmit = () => {
    if (statuse === 200) {
      dispatch({
        type: 'releasetodo/releaseflow',
        payload: {
          taskId: currentTaskStatus.taskId,
          type: submittype,
          userIds: sessionStorage.getItem('NextflowUserId'),
        },
      });
    }
  }
  // 获取出厂测试、平台验证表单信息
  const getregistratformvalues = () => {
    const val = RegistratRef.current.getVal();
    const { releaseAttaches, releaseEnvs, releaseLists, testOperator, testPlace, testResult, testUnit, } = val;
    const testStart = moment(val.testStart).format('YYYY-MM-DD HH:mm:ss');
    const testEnd = moment(val.testEnd).format('YYYY-MM-DD HH:mm:ss');
    if (taskName === '出厂测试') {
      const { dutyUnit, influenceScope, registerTime, registerUnit, registerUnitId, registerUser, registerUserId, releaseNo, releaseType } = val;
      const register = {
        saveItems: 'releaseRegister,releaseEnvs,releaseLists,releaseAttaches',
        releaseMain: { releaseType, dutyUnit, releaseNo },
        releaseRegister: {
          testStart, testEnd, testPlace, testUnit, testOperator, influenceScope, testResult, registerTime, registerUnit, registerUnitId, registerUser, registerUserId,
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
      formValid: {
        testStart, testEnd, testOperator, testPlace, testResult, testUnit, validResult,
        validComments: val.validResult === '通过' ? val.validComments : val.validComments1,
      },
      releaseAttaches,
      releaseEnvs,
      releaseLists,
    };
    return validform

  };
  // 出厂测试保存流转
  const FactorytestSubmit = () => {
    if (buttype === 'save') {
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
          message.error('请将信息填写完整')
        } else {
          const register = getregistratformvalues();
          dispatch({
            type: 'releasetodo/factorytest',
            payload: {
              register,
              buttype,
            },
          });
          sessionStorage.setItem('flowtype', '1');
          setUserVisible(true);
        }
      })
    }
  }

  // 平台验证保存流转
  const savelatformValid = () => {
    const platform = getregistratformvalues();
    dispatch({
      type: 'releasetodo/platformvalid',
      payload: {
        platform: {
          saveItems: 'platformValid,releaseEnvs,releaseLists,releaseAttaches',
          releaseNo: Id,
          platformValid: platform.formValid,
          releaseAttaches: platform.releaseAttaches,
          releaseEnvs: platform.releaseEnvs,
          releaseLists: platform.releaseLists,
        },
        buttype,
      },
    });
  }
  const platformValidSubmit = () => {
    switch (buttype) {
      case 'save':
        savelatformValid();
        break;
      case 'flow':
        setUserChoice(false);
        sessionStorage.removeItem('NextflowUserId');
        RegistratRef.current.Forms((err) => {
          if (err) {
            message.error('请将信息填写完整')
          } else {
            savelatformValid();
            sessionStorage.setItem('flowtype', '1');
            setUserVisible(true);
          }
        })
        break;
      case 'noPass':
        setUserChoice(false);
        sessionStorage.removeItem('NextflowUserId');
        RegistratRef.current.Forms((err) => {
          if (err) {
            message.error('请将信息填写完整')
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
      },
    });
  }
  const bizValidateParamSubmit = () => {
    switch (buttype) {
      case 'save':
        savebizValidate();
        break;
      case 'flow':
        setUserChoice(false);
        sessionStorage.removeItem('NextflowUserId');
        RegistratRef.current.Forms((err, values) => {
          if (err) {
            message.error('请将信息填写完整')
          } else {
            const releaseStatus = values.releaseLists.map(item => {
              return item.verifyStatus;
            });
            if (releaseStatus.includes('已转出') || releaseStatus.includes(null)) {
              message.error('发布清单还未全部验证，无法流转')
            } else {
              savebizValidate();
              sessionStorage.setItem('flowtype', '1');
              setUserVisible(true);
            }
          }
        })
        break;
      case 'noPass':
        sessionStorage.removeItem('NextflowUserId');
        RegistratRef.current.Forms((err, values) => {
          if (err) {
            message.error('请将信息填写完整')
          } else {
            const releaseStatus = values.releaseLists.map(item => {
              return item.verifyStatus;
            });
            if (releaseStatus.includes('已转出') || releaseStatus.includes(null)) {
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
          },
          practiceDevices: val.practiceDevices,
          practicePersonList: val.practicePersonList,
          practiceRisks: val.practiceRisks,
          practiceSteps: val.practiceSteps,
          releaseAttaches: val.releaseAttaches,
          releaseLists: val.releaseLists,
        },
        buttype,
      },
    });
  }
  const practicePreSubmit = () => {
    switch (buttype) {
      case 'save':
        savepracticePre();
        break;
      case 'flow':
        setUserChoice(false);
        sessionStorage.removeItem('NextflowUserId');
        ImplementationPreRef.current.Forms((err) => {
          if (err) {
            message.error('请将信息填写完整')
          } else {
            savepracticePre();
            sessionStorage.setItem('flowtype', '1');
            setUserVisible(true);
          }
        })
        break;
      default:
        break;
    }
  };

  // 版本管理员审核,科室负责人审核，中心领导审核保存流转
  const saveVersionAudit = () => {
    const values = VersionAuditRef.current.getVal();
    dispatch({
      type: 'releasetodo/checkversion',
      payload: {
        values: { ...values, releaseNo: Id },
        releaseAttaches: { mainId: values.releaseAttaches[0].mainId, taskId: values.releaseAttaches[0].taskId, releaseAttaches: values.releaseAttaches },
        releaseNo: Id,
        buttype,
        taskName,
      },
    });
  }
  const VersionAuditSubmit = () => {
    switch (buttype) {
      case 'save':
        saveVersionAudit()
        break;
      case 'flow':
        setUserChoice(false);
        sessionStorage.removeItem('NextflowUserId');
        VersionAuditRef.current.Forms((err) => {
          if (err) {
            message.error('请将信息填写完整')
          } else {
            saveVersionAudit();
            sessionStorage.setItem('flowtype', '1');
            setUserVisible(true);
          }
        })
        break;
      case 'noPass':
        sessionStorage.removeItem('NextflowUserId');
        VersionAuditRef.current.Forms((err) => {
          if (err) {
            message.error('请将信息填写完整')
          } else {
            saveVersionAudit();
          }
        })
        break;
      default:
        break;
    }
  };

  // 发布实施
  const saveracticeDone = () => {
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
            message.error('请将信息填写完整')
          } else {
            saveracticeDone();
            sessionStorage.setItem('flowtype', '1');
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
    const { releaseAttaches, releaseLists, practiceTime, practicer, doneDesc, legacyDesc } = values;
    dispatch({
      type: 'releasetodo/bizcheck',
      payload: {
        bizcheckparam: {
          releaseNo: Id,
          saveItems: 'releaseBizCheck, releaseLists, releaseAttaches',
          releaseAttaches,
          releaseLists,
          releaseBizCheck: { practiceTime: moment(practiceTime).format('YYYY-MM-DD HH:mm:ss'), practicer, doneDesc, legacyDesc },
        },
        buttype,
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
            message.error('请将信息填写完整')
          } else {
            const releaseStatus = values.releaseLists.map(item => {
              return item.verifyStatus;
            });
            if (releaseStatus.includes('已转出') || releaseStatus.includes(null)) {
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
      dispatch({
        type: 'releasetodo/openflow',
        payload: {
          releaseNo: Id,
          taskName
        },
      });
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

  // 将保存状态返回到父级
  useEffect(() => {
    if (currentTaskStatus) {
      ChangeSaved(currentTaskStatus.saved)
    }
  }, [currentTaskStatus])

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
      } else {
        switch (taskName) {
          case '出厂测试':
            FactorytestSubmit();
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
          case '发布实施':
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
    <div className={styles.collapse}>
      <DictLower
        typeid="1379323239808897026"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Collapse
        expandIconPosition="right"
        activeKey={activeKey}
        bordered={false}
        onChange={callback}
      >
        {taskName === '出厂测试' && info && info.releaseRegister && (
          <Panel header={taskName} key="form">
            <div style={{ marginTop: 12 }}>
              <Registrat
                wrappedComponentRef={RegistratRef}
                selectdata={selectdata}
                isEdit
                taskName='出厂测试'
                info={info}
                userinfo={userinfo}
              />
            </div>
          </Panel>
        )}
        {taskName === '平台验证' && info && info.platformValid && (
          <Panel header={taskName} key="form">
            <div style={{ marginTop: 12 }}>
              <Registrat
                wrappedComponentRef={RegistratRef}
                selectdata={selectdata}
                isEdit
                taskName='平台验证'
                info={info}
                userinfo={userinfo}
              />
            </div>
          </Panel>
        )}
        {taskName === '业务验证' && info && info.releaseBizValid && (
          <Panel header={taskName} key="form">
            <div style={{ marginTop: 12 }}>
              <Registrat
                wrappedComponentRef={RegistratRef}
                selectdata={selectdata}
                isEdit
                taskName='业务验证'
                info={info}
                userinfo={userinfo}
              />
            </div>
          </Panel>
        )}
        {taskName === '发布实施准备' && info && info.releaseAttaches && (
          <Panel header={taskName} key="form">
            <div style={{ marginTop: 12 }}>
              <ImplementationPre
                wrappedComponentRef={ImplementationPreRef}
                selectdata={selectdata}
                isEdit
                taskName={taskName}
                info={info}
                userinfo={userinfo}
              />
            </div>
          </Panel>
        )}
        {taskName === '版本管理员审核' && info && info.mergeOrder && (
          <Panel header={taskName} key="form">
            <div style={{ marginTop: 12 }}>
              <VersionAudit
                wrappedComponentRef={VersionAuditRef}
                selectdata={selectdata}
                isEdit
                taskName={taskName}
                info={info}
                userinfo={userinfo}
              />
            </div>
          </Panel>
        )}
        {(taskName === '科室负责人审核' || taskName === '中心领导审核') && info && info.checkMerge && (
          <Panel header={taskName} key="form">
            <div style={{ marginTop: 12 }}>
              <VersionAudit
                wrappedComponentRef={VersionAuditRef}
                selectdata={selectdata}
                isEdit
                taskName={taskName}
                info={info}
                userinfo={userinfo}
              />
            </div>
          </Panel>
        )}
        {taskName === '发布实施' && info && info.practiceDone && (
          <Panel header={taskName} key="form">
            <div style={{ marginTop: 12 }}>
              <Implementation
                wrappedComponentRef={ImplementationRef}
                selectdata={selectdata}
                isEdit
                taskName={taskName}
                info={info}
                userinfo={userinfo}
              />
            </div>
          </Panel>
        )}
        {taskName === '业务复核' && info && info.releaseAttaches && (
          <Panel header={taskName} key="form">
            <BusinessReview
              wrappedComponentRef={BusinessReviewRef}
              selectdata={selectdata}
              isEdit
              taskName={taskName}
              info={info}
              userinfo={userinfo}
            />
          </Panel>
        )}
        {/* <Panel header='发布登记' key="1">
          <Registrat
            wrappedComponentRef={RegistratRef}
            files={[]}
            ChangeFiles={() => 0}
            selectdata={selectdata}
            isEdit={false}
            taskName='发布登记'
            mainId={Id}
          />
        </Panel> */}
      </Collapse>
      {currentTaskStatus && currentTaskStatus.taskId && (
        <User
          taskId={currentTaskStatus.taskId}
          visible={uservisible}                       // 传参显示选人modle
          ChangeUserVisible={v => setUserVisible(v)}  // 选人完成关闭选人modle
          changorder='平台验证'                        //  下一环节名
          ChangeChoice={v => setUserChoice(v)}         //  选人完成返回状态true，通过true判读，进行
          ChangeType={v => (v)}                        //  取消，重置按钮类型         
        />
      )}
    </div>
  );
}

export default connect(({ releasetodo, itsmuser, loading }) => ({
  info: releasetodo.info,
  currentTaskStatus: releasetodo.currentTaskStatus,
  statuse: releasetodo.statuse,
  userinfo: itsmuser.userinfo,
  loading: loading.models.releasetodo,
}))(WorkOrder);