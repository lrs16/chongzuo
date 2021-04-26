import React, { useState, useRef } from 'react';
import { connect } from 'dva';
import { Button, Popover, Collapse, Steps } from 'antd';
import DictLower from '@/components/SysDict/DictLower';
import Registrat from './components/Registrat';
import ImplementationPre from './components/ImplementationPre';
import styles from './index.less';

const { Panel } = Collapse;
const { Step } = Steps;

function WorkOrder(props) {
  const { taskName, dispatch, userinfo } = props;
  const [activeKey, setActiveKey] = useState(['form']);
  const [selectdata, setSelectData] = useState({ arr: [], ischange: false }); // 下拉值
  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表

  // 保存，保存提交
  const RegistratRef = useRef();
  const ImplementationPreRef = useRef();
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
            />
          </Panel>
        )}
        {taskName === '发布实施准备' && (
          <Panel header={taskName} key="form">
            <ImplementationPre
              wrappedComponentRef={ImplementationPreRef}
              selectdata={selectdata}
              isEdit
              taskName={taskName}
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
          />
        </Panel>
      </Collapse>
    </div>
  );
}

export default connect(({ itsmuser, loading }) => ({
  userinfo: itsmuser.userinfo,
}))(WorkOrder);