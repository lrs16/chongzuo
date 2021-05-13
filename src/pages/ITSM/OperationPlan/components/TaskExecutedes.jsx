import React from 'react';
import { Descriptions, Radio } from 'antd';
import styles from '../index.less';
import Downloadfile from '@/components/SysUpload/Downloadfile';

function TaskExecutedes(props) {
  const { info } = props;
  console.log('info: ', info);
  let value;
  if (info) {
    value = info.confirmResult;
  }
  return (
    <div className={styles.collapse} style={{ marginLeft: 30, marginRight: 10 }}>
      <Descriptions style={{ marginTop: 24 }} size="middle">

        <Descriptions.Item label="作业结果">
          {info.result}
        </Descriptions.Item>

        <Descriptions.Item label="实际开始时间" >
          {info.startTime}
        </Descriptions.Item>

        <Descriptions.Item label="实际结束时间">
          {info.endTime}
        </Descriptions.Item>

        <Descriptions.Item label="作业执行情况说明" span={3}>
          {info.content}
        </Descriptions.Item>

        <Descriptions.Item label="上传附件" span={3}>
          <span style={{ color: 'blue', textDecoration: 'underline' }} >
            {info.fileIds && <Downloadfile files={info.fileIds} />}
          </span>
        </Descriptions.Item>

        <Descriptions.Item label="执行操作时间">
          {info.operationTime}
        </Descriptions.Item>

      </Descriptions>
    </div>
  );
}
export default TaskExecutedes;
