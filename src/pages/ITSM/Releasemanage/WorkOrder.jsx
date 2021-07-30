import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'dva';
import { Collapse, Steps, Spin } from 'antd';
import DictLower from '@/components/SysDict/DictLower';
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
  const { location, dispatch, info, loading } = props;
  const { taskName, Id } = location.query;
  const [activeKey, setActiveKey] = useState(['form']);
  const [selectdata, setSelectData] = useState({ arr: [], ischange: false }); // 下拉值

  // 保存，保存提交
  const RegistratRef = useRef();
  const ImplementationPreRef = useRef();
  const VersionAuditRef = useRef();
  const ExamineRef = useRef();
  const ImplementationRef = useRef();
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

  // 打开待办
  useEffect(() => {
    if (Id) {
      dispatch({
        type: 'releasetodo/openflow',
        payload: {
          releaseNo: Id,
        },
      })
    }
  }, [Id])

  return (
    <div className={styles.collapse}>
      <DictLower
        typeid="1379323239808897026"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Spin tip="正在加载数据..." spinning={!!loading}>
        <Collapse
          expandIconPosition="right"
          activeKey={activeKey}
          bordered={false}
          onChange={callback}
        >
          {(taskName === '发布登记' || taskName === '平台验证' || taskName === '业务验证') && info && info.register && (
            <Panel header={taskName} key="form">
              <div style={{ marginTop: 12 }}>
                <Registrat
                  wrappedComponentRef={RegistratRef}
                  selectdata={selectdata}
                  isEdit
                  taskName='发布登记'
                  info={info.register}
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
      </Spin>
    </div>
  );
}

export default connect(({ releasetodo, loading }) => ({
  info: releasetodo.info,
  loading: loading.models.releasetodo,
}))(WorkOrder);