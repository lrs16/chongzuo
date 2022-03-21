import React, { useEffect, useState } from 'react';
import { Steps, Icon } from 'antd';

const { Step } = Steps;

const records = [
  '出厂测试',
  '开发商项目经理审核',
  '平台验证',
  '科室负责人审核',
  '版本管理员审核',
  '自动化科审核',
  '中心领导审核',
  '发布验证',
  '业务复核',
]

function TempTaskLinks(props) {
  const { taskName, releaseTempLogs } = props;
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (releaseTempLogs) {
      if (taskName === '结束') {
        const nodeLength = records.indexOf(releaseTempLogs[0]?.operatePrev) - 1;
        setCurrent(releaseTempLogs[0]?.operatePrev === '业务复核' ? 9 : nodeLength);
      } else {
        setCurrent(records.indexOf(taskName));
      }
    }
  }, [releaseTempLogs]);
  return (
    <Steps
      current={current}
      size="small"
      style={{
        background: '#fff',
        padding: 24,
        border: '1px solid #e8e8e8',
        overflowX: 'auto',
      }}
    >
      {releaseTempLogs && records.map((obj, index) => {
        if (taskName === '结束') {
          const nodeLength = records.indexOf(releaseTempLogs[0]?.operatePrev) + 1;
          return (
            <Step
              title={obj}
              key={index.toString()}
              icon={index < nodeLength ? <Icon type="check-circle" /> : ''}
            />);
        }
        return (
          <Step
            title={obj}
            key={index.toString()}
            icon={obj === taskName ? <Icon type="loading" spin /> : ''}
          />);

      })}
    </Steps>
  );
}

export default TempTaskLinks;