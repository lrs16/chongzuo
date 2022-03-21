import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Steps, Icon } from 'antd';

const { Step } = Steps;

function TaskLinks(props) {
  const { records, taskName } = props;
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (records) {
      if (taskName === '结束') {
        const completeTimes = records.map(obj => obj.completeTime)
        const nodeLength = completeTimes.indexOf(null) - 1;
        setCurrent(nodeLength < 0 ? 10 : nodeLength)
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
        const icondoing = (<Icon type="loading" spin style={{ color: obj.timeoutTime && moment() > moment(obj.timeoutTime) ? '#f5222d' : '' }} />)
        const icons = () => {
          if (obj.timeoutReason) {
            return <Icon type="check-circle" style={{ color: '#f5222d' }} />
          }
          return ''
        }
        if (taskName === '结束') {
          return (
            <Step
              title={obj.taskName}
              key={index.toString()}
              status={obj.timeoutReason ? 'error' : ''}
              icon={obj.completeTime ? <Icon type="check-circle" /> : ''}
            />);
        }
        return (
          <Step
            title={obj.taskName}
            key={index.toString()}
            status={obj.timeoutReason ? 'error' : ''}
            icon={obj.taskName === taskName ? icondoing : icons()}
          />);

      })}
    </Steps>
  );
}

export default TaskLinks;