import React from 'react';
import { Descriptions, Radio } from 'antd';
import styles from '../index.less';
import Downloadfile from '@/components/SysUpload/Downloadfile';

function TaskExecutedes(props) {
  const { info } = props;
  let value;
  if (info) {
    value = info.confirmResult;
  }
  return (
    <div className={styles.collapse} style={{ marginLeft: 30, marginRight: 10 }}>
      <Descriptions style={{ marginTop: 24 }} size="middle">

        <Descriptions.Item label="作业结果">
     
        </Descriptions.Item>

        <Descriptions.Item label="实际开始时间" >
        </Descriptions.Item>

        <Descriptions.Item label="实际结束时间">

        </Descriptions.Item>

        <Descriptions.Item label="作业执行情况说明" span={3}>
        </Descriptions.Item>

        <Descriptions.Item label="上传附件" span={3}>
        </Descriptions.Item>

        <Descriptions.Item label="执行操作时间">
        </Descriptions.Item>

      </Descriptions>
    </div>
  );
}
export default TaskExecutedes;
