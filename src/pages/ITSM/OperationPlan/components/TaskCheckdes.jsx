import React from 'react';
import { Descriptions, Radio } from 'antd';
import styles from '../index.less';

function TaskCheckdes(props) {
  const { info } = props;
  let value;
  if (info) {
    value = info.result;
  }
  return (
    <div className={styles.collapse} style={{ marginLeft: 30, marginRight: 10 }}>
      <Descriptions style={{ marginTop: 24 }} size="middle">

        <Descriptions.Item label="审核结果">
          <Radio.Group value={value} disabled>
            <Radio value='通过'>通过</Radio>
            <Radio value='不通过'>不通过</Radio>
          </Radio.Group>
        </Descriptions.Item>

        <Descriptions.Item label="审核时间" >{info.checkTime}</Descriptions.Item>

        <Descriptions.Item label="审核状态">{info.status}</Descriptions.Item>

        <Descriptions.Item label="审核说明" span={3}>{info.content}</Descriptions.Item>

        <Descriptions.Item label="审核人">{info.checkUser}</Descriptions.Item>

        <Descriptions.Item label="审核单位">{info.checkUnit}</Descriptions.Item>

      </Descriptions>
    </div>
  );
}
export default TaskCheckdes;
