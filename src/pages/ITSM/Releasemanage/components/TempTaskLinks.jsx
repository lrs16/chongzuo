import React, { useEffect, useState } from 'react';
import { Steps, Icon } from 'antd';
import styles from '../index.less';

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
  const { taskName } = props;
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (records) {
      if (taskName === '结束') {
        setCurrent(9)
      } else {
        setCurrent(records.indexOf(taskName));
      }
    }
  }, [records]);

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
      {records.map((obj, index) => {
        if (taskName === '结束') {
          return (
            <Step
              title={obj}
              key={index.toString()}
              icon={<Icon type="check-circle" />}
            />);
        }
        return (
          <Step
            title={obj}
            key={index.toString()}
            icon={obj === taskName ? <Icon type="sync" spin /> : ''}
          />);

      })}
    </Steps>
  );
}

export default TempTaskLinks;