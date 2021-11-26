import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Steps } from 'antd';
import styles from '../index.less';

const { Step } = Steps;

function TaskLinks(props) {
  const { records, taskName } = props;
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (records) {
      if (taskName === '结束') {
        setCurrent(9)
      } else {
        const taskNames = records.map(item => { return item.taskName });
        setCurrent(taskNames.indexOf(taskName));
      }
    }
  }, [records]);

  return (
    <Steps
      current={current}
      size="small"
      // progressDot
      style={{
        background: '#fff',
        padding: 24,
        border: '1px solid #e8e8e8',
        overflowX: 'auto',
      }}
    >
      {records.map((obj, index) => {
        let tempTime = '';
        if (obj.prevCompleteTime && obj.completeTime) {
          const addtime = moment(obj.prevCompleteTime);
          const endtime = moment(obj.completeTime);
          const dura = endtime.format('x') - addtime.format('x');
          tempTime = moment.duration(dura);
        }
        const desc = (
          <div className={obj.timeoutReason ? styles.timeoutstep : styles.stepDescription}>
            处理人：{obj.assignee}
            {/* <DingdingOutlined /> */}
            <div>开始时间：{obj.prevCompleteTime}</div>
            <div>结束时间：{obj.completeTime}</div>
            {tempTime && (<div style={{ color: `${obj.timeoutReason ? '#ff4d4f' : 'rgba(0, 0, 0, 0.85)'}`, fontSize: '16px' }}>用时：
              {tempTime.days() !== 0 && (<>{tempTime.days()}天</>)}
              {tempTime.hours() !== 0 && (<>{tempTime.hours()}小时</>)}
              {tempTime.minutes() !== 0 && (<>{tempTime.minutes()}分</>)}
              {((tempTime.days() === 0 && tempTime.hours() === 0 && tempTime.minutes() === 0 && tempTime.seconds() === 0) || tempTime.seconds() !== 0) && (<>{tempTime.seconds()}秒</>)}
            </div>)}
          </div>
        );
        return <Step
          title={obj.taskName}
          // description={desc}
          key={index.toString()}
        // status={obj.timeoutReason ? 'error' : 'finish'}
        // icon={obj.timeoutReason ? 'clock-circle' : 'check-circle'}
        />;
      })}
    </Steps>
  );
}

export default TaskLinks;