import React, { useState, useRef } from 'react';
import { connect } from 'dva';
import { Button, Popover, Collapse, Steps } from 'antd';
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
  const { location, dispatch, userinfo } = props;
  const { taskName, mainId } = location.query;
  const [activeKey, setActiveKey] = useState(['form']);
  const [selectdata, setSelectData] = useState({ arr: [], ischange: false }); // 下拉值
  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表

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
        {(taskName === '发布登记' || taskName === '平台验证' || taskName === '业务验证') && (
          <Panel header={taskName} key="form">
            <div style={{ marginTop: 12 }}>
              <Registrat
                wrappedComponentRef={RegistratRef}
                userinfo={userinfo}
                files={files.arr}
                ChangeFiles={newvalue => {
                  setFiles(newvalue);
                }}
                selectdata={selectdata}
                isEdit
                taskName={taskName}
                mainId={mainId}
                listType='计划'
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
                mainId={mainId}
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
                mainId={mainId}
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
              mainId={mainId}
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
                mainId={mainId}
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
              mainId={mainId}
              listType='临时'
            />
          </Panel>
        )}
        <Panel header='发布登记' key="1">
          <Registrat
            wrappedComponentRef={RegistratRef}
            userinfo={userinfo}
            files={[]}
            ChangeFiles={() => 0}
            selectdata={selectdata}
            isEdit={false}
            taskName='发布登记'
            mainId={mainId}
          />
        </Panel>
      </Collapse>
    </div>
  );
}

export default connect(({ itsmuser, loading }) => ({
  userinfo: itsmuser.userinfo,
}))(WorkOrder);