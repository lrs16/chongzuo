import React, { useState, useEffect } from 'react';
import { Collapse, ConfigProvider } from 'antd';
import Registrat from './Registrat';
import ImplementationPre from './ImplementationPre';
import VersionAudit from './VersionAudit';
import Implementation from './Implementation';
import BusinessReview from './BusinessReview';
import styles from '../index.less';


const { Panel } = Collapse;

const Panelheadermap = new Map([
  ['register', '出厂测试'],
  ['platformValida', '平台验证'],
  ['bizValid', '业务验证'],
  ['practicePre', '发布实施准备'],
  ['checkVersion', '版本管理员审核'],
  ['checkDirector', '科室负责人审核'],
  ['checkLeader', '中心领导审核'],
  ['practiceDone', '发布实施'],
  ['bizCheck', '业务复核'],
]);

function HistoryOrderInfo(props) {
  const { records, selectdata, view, taskName } = props;

  const [activeKey, setActiveKey] = useState([]);
  const [todoRecords, setTodoRecords] = useState([]);

  const callback = key => {
    setActiveKey(key);
  };

  useEffect(() => {
    if (view) {
      setActiveKey(['0']);
    };
  }, [view]);

  useEffect(() => {
    if (view) {
      const newdata = records.map(item => ({ ...item }));
      if (newdata)
        if (taskName === '结束' || (taskName === '出厂测试' && newdata.length === 1)) {
          setTodoRecords(newdata)
        } else {
          newdata.pop();
          setTodoRecords(newdata)
        }
    };
    if (!view) {
      const newdata = records.map(item => ({ ...item }));
      newdata.pop();
      setTodoRecords(newdata)
    }
  }, [records])

  return (
    <div className={styles.collapsetimeout}>
      <Collapse
        expandIconPosition="right"
        activeKey={activeKey}
        bordered={false}
        onChange={callback}
      >
        {todoRecords.map((obj, index) => {
          // panel详情组件
          const taskIdandkey = Object.keys(obj)[1];
          const key = taskIdandkey.split('-')[1];
          const Paneldesmap = new Map([
            ['register', <Registrat info={Object.values(obj)[1]} listmsg={Object.values(obj)[2].dutyUnitListMsg} selectdata={selectdata} isEdit={false} taskName='出厂测试' />],
            ['platformValida', <Registrat info={Object.values(obj)[1]} listmsg={Object.values(obj)[2].dutyUnitListMsg} selectdata={selectdata} isEdit={false} taskName='平台验证' />],
            ['bizValid', <Registrat info={Object.values(obj)[1]} listmsg={Object.values(obj)[2].dutyUnitListMsg} selectdata={selectdata} isEdit={false} taskName='业务验证' />],
            ['practicePre', <ImplementationPre info={Object.values(obj)[1]} listmsg={Object.values(obj)[2].dutyUnitListMsg} selectdata={selectdata} isEdit={false} taskName='发布实施准备' />],
            ['checkVersion', <VersionAudit info={Object.values(obj)[1]} listmsg={Object.values(obj)[2].dutyUnitListMsg} selectdata={selectdata} isEdit={false} taskName='版本管理员审核' />],
            ['checkDirector', <VersionAudit info={Object.values(obj)[1]} listmsg={Object.values(obj)[2].dutyUnitListMsg} selectdata={selectdata} isEdit={false} taskName='科室负责人审核' />],
            ['checkLeader', <VersionAudit info={Object.values(obj)[1]} listmsg={Object.values(obj)[2].dutyUnitListMsg} selectdata={selectdata} isEdit={false} taskName='中心领导审核' />],
            ['practiceDone', <Implementation info={Object.values(obj)[1]} listmsg={Object.values(obj)[2].dutyUnitListMsg} selectdata={selectdata} isEdit={false} taskName='发布实施' />],
            ['bizCheck', <BusinessReview info={Object.values(obj)[1]} listmsg={Object.values(obj)[2].dutyUnitListMsg} selectdata={selectdata} isEdit={false} taskName='业务复核' />],
          ]);
          return (
            <Panel header={Panelheadermap.get(key)} key={index.toString()} className={Object.values(obj)[0] ? styles.timeout : ''} >
              {Paneldesmap.get(key)}
            </Panel>
          );
        })}
      </Collapse>
    </div>
  );
}

export default HistoryOrderInfo;