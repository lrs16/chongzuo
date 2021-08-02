import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Collapse, Steps, Spin, message } from 'antd';
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
  const { location, dispatch, userinfo, info, currentTaskStatus, loading, buttype } = props;
  const { taskName, Id } = location.query;
  const [activeKey, setActiveKey] = useState(['form']);
  const [selectdata, setSelectData] = useState({ arr: [], ischange: false }); // 下拉值
  const [uservisible, setUserVisible] = useState(false);        // 是否显示选人组件
  const [userchoice, setUserChoice] = useState(false);          // 已经选择人员  

  // 保存，保存提交
  const RegistratRef = useRef();
  const ImplementationPreRef = useRef();
  const VersionAuditRef = useRef();
  const ExamineRef = useRef();
  const ImplementationRef = useRef();

  // 流转
  const tosubmit = () => {
    dispatch({
      type: 'releasetodo/releaseflow',
      payload: {
        taskId: currentTaskStatus.taskId,
        type: 1,
        userIds: sessionStorage.getItem('NextflowUserId'),
      },
    });
  }
  // 获取出厂测试、平台验证表单信息
  const getregistratformvalues = () => {
    const val = RegistratRef.current.getVal();
    const {
      dutyUnit,
      influenceScope,
      registerTime,
      registerUnit,
      registerUnitId,
      registerUser,
      registerUserId,
      releaseAttaches,
      releaseEnvs,
      releaseLists,
      releaseNo,
      releaseType,
      testEnd,
      testOperator,
      testPlace,
      testResult,
      testStart,
      testUnit
    } = val;
    const register = {
      saveItems: 'releaseRegister,releaseEnvs,releaseLists,releaseAttaches',
      releaseMain: { releaseType, dutyUnit, releaseNo },
      releaseRegister: {
        testStart: moment(testStart).format('YYYY-MM-DD HH:mm:ss'),
        testEnd: moment(testEnd).format('YYYY-MM-DD HH:mm:ss'),
        testPlace, testUnit, testOperator, influenceScope, testResult, registerTime, registerUnit, registerUnitId, registerUser, registerUserId,
      },
      releaseAttaches,
      releaseEnvs,
      releaseLists,
    };
    return register
  };

  const FactorytestSubmit = () => {
    const register = getregistratformvalues();
    dispatch({
      type: 'releasetodo/factorytest',
      payload: {
        register,
        buttype,
      },
    });
    if (buttype === 'flow') {
      setUserChoice(false);
      sessionStorage.removeItem('NextflowUserId');
      RegistratRef.current.Forms((err) => {
        if (err) {
          message.error('请将信息填写完整')
        } else {
          sessionStorage.setItem('flowtype', '1');
          setUserVisible(true);
        }
      })
    }
  }


  const handlesubmit = values => {
    dispatch({
      //  type: 'demandregister/start',
      payload: {
        ...values,
      },
    });
  };

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

  // 点击按钮
  useEffect(() => {
    if (buttype) {
      switch (taskName) {
        case '出厂测试':
          FactorytestSubmit();
          break;
        default:
          break;
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
        {taskName === '出厂测试' && info && (
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
        {taskName === '平台验证' && info && (
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