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
import Examine from './components/Examine';
import Implementation from './components/Implementation';
import BusinessReview from './components/BusinessReview';
import styles from './index.less';

const { Panel } = Collapse;
const { Step } = Steps;

function WorkOrder(props) {
  const { location, dispatch, userinfo, info, currentTaskStatus, buttype } = props;
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
  const ExamineRef = useRef();
  const ImplementationRef = useRef();

  // 流程提交
  const tosubmit = () => {
    dispatch({
      type: 'releasetodo/releaseflow',
      payload: {
        taskId: currentTaskStatus.taskId,
        type: submittype,
        userIds: sessionStorage.getItem('NextflowUserId'),
      },
    });
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
            tosubmit();
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
        RegistratRef.current.Forms((err) => {
          if (err) {
            message.error('请将信息填写完整')
          } else {
            savebizValidate();
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
            tosubmit();
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
        {taskName === '发布实施准备' && (
          <Panel header={taskName} key="form">
            <div style={{ marginTop: 12 }}>
              <ImplementationPre
                wrappedComponentRef={ImplementationPreRef}
                selectdata={selectdata}
                isEdit
                taskName={taskName}
                mainId={Id}
                listType='计划'
              />
            </div>
          </Panel>
        )}
        {taskName === '版本管理员审批' && (
          <Panel header={taskName} key="form">
            <div style={{ marginTop: 12 }}>
              <VersionAudit
                wrappedComponentRef={VersionAuditRef}
                selectdata={selectdata}
                isEdit
                taskName={taskName}
                mainId={Id}
              />
            </div>
          </Panel>
        )}
        {(taskName === '科室负责人审批' || taskName === '中心领导审批') && (
          <Panel header={taskName} key="form">
            <Examine
              wrappedComponentRef={ExamineRef}
              selectdata={selectdata}
              isEdit
              taskName={taskName}
              mainId={Id}
              listType='临时'
            />
          </Panel>
        )}
        {(taskName === '发布实施') && (
          <Panel header={taskName} key="form">
            <div style={{ marginTop: 12 }}>
              <Implementation
                wrappedComponentRef={ImplementationRef}
                selectdata={selectdata}
                isEdit
                taskName={taskName}
                mainId={Id}
              />
            </div>
          </Panel>
        )}
        {(taskName === '业务复核') && (
          <Panel header={taskName} key="form">
            <BusinessReview
              wrappedComponentRef={ImplementationRef}
              selectdata={selectdata}
              isEdit
              taskName={taskName}
              mainId={Id}
              listType='临时'
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
  userinfo: itsmuser.userinfo,
  loading: loading.models.releasetodo,
}))(WorkOrder);