import React from 'react';
import { Steps } from 'antd';
import styles from '../index.less';

const { Step } = Steps;

const records = [
  { "taskName": "出厂测试", "userName": "Elin", "startTime": "2021-04-02 17:19:44", "endTime": "2021-04-13 10:53:48" },
  { "taskName": "平台验证", "userName": "Elin", "startTime": "2021-04-13 10:53:48", "endTime": "2021-04-13 11:20:39" },
  { "taskName": "业务验证", "userName": "Elin", "startTime": "2021-04-13 11:20:39", "endTime": "2021-04-13 11:20:58" },
  { "taskName": "发布实施准备", "userName": "Elin", "startTime": "2021-04-13 11:20:58", "endTime": "2021-04-13 11:21:11" },
  { "taskName": "版本管理员审批", "userName": "Elin", "startTime": "2021-04-13 11:21:11", "endTime": "2021-04-13 11:21:34" },
  { "taskName": "科室负责人审批", "userName": "Elin", "startTime": "2021-04-13 11:21:34", "endTime": "2021-04-13 11:21:44" },
  { "taskName": "中心领导审批", "userName": "Elin", "startTime": "2021-04-13 11:21:34", "endTime": "2021-04-13 11:21:50" },
  { "taskName": "发布实施", "userName": "Elin", "startTime": "2021-04-13 11:21:50", "endTime": "2021-04-13 11:22:16" },
  { "taskName": "业务复核", "userName": "Elin", "startTime": "2021-04-13 11:22:16", "endTime": null }
];

function VersionAuditFlow(props) {
  return (
    <div className={styles.collapse}>
      <Steps
        current={records.length - 1}
        progressDot
        style={{
          background: '#fff',
          padding: 24,
          overflowX: 'auto',
        }}
      >
        {records.map((obj, index) => {
          const desc = (
            <div>
              <div>处理人：{obj.userName}</div>
              <div>开始时间：{obj.startTime}</div>
              <div>结束时间：{obj.endTime}</div>
            </div>
          );
          return <Step title={obj.taskName} description={desc} key={index.toString()} />;
        })}
      </Steps>
    </div>
  );
}

export default VersionAuditFlow;