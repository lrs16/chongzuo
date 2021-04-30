import React from 'react';
import { Descriptions, Radio } from 'antd';
import styles from '../index.less';
import Downloadfile from '@/components/SysUpload/Downloadfile';

function TaskCheckdes(props) {
  const { info } = props;
  let value;
  if (info) {
    value = info.confirmResult;
  }
  return (
    <div className={styles.collapse} style={{ marginLeft: 30, marginRight: 10 }}>
      <Descriptions style={{ marginTop: 24 }} size="middle">

        <Descriptions.Item label="审核结果">
          <Radio.Group value={value} disabled>
            <Radio value='1'>通过</Radio>
            <Radio value='0'>不通过</Radio>
          </Radio.Group>
        </Descriptions.Item>

        <Descriptions.Item label="审核时间" >
        </Descriptions.Item>

        <Descriptions.Item label="审核状态">

        </Descriptions.Item>

        <Descriptions.Item label="审核说明" span={3}>
        </Descriptions.Item>

        <Descriptions.Item label="审核人">
        </Descriptions.Item>

        <Descriptions.Item label="审核单位">
        </Descriptions.Item>

      </Descriptions>
    </div>
  );
}
export default TaskCheckdes;
