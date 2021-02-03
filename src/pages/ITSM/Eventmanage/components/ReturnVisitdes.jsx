import React from 'react';
import { Descriptions } from 'antd';
import styles from '../index.less';
import Downloadfile from '@/components/SysUpload/Downloadfile';

function ReturnVisitdes(props) {
  const { info, main } = props;
  return (
    <div className={styles.collapse} style={{ marginTop: 24 }} size="middle">
      <Descriptions style={{ marginTop: 24 }}>
        <Descriptions.Item label="回访方式">{info.revisitWay}</Descriptions.Item>
        <Descriptions.Item label="处理结果">{main.eventResult}</Descriptions.Item>
        <Descriptions.Item label="满意度">{info.satisfaction}</Descriptions.Item>
        <Descriptions.Item label="回访内容">{info.content}</Descriptions.Item>
        <Descriptions.Item label="填单时间">{info.addTime}</Descriptions.Item>
        <Descriptions.Item label="回访时间">{info.revisitTime}</Descriptions.Item>
        <Descriptions.Item label="附件" span={3}>
          {info.fileIds !== '' && <Downloadfile files={info.fileIds} />}
        </Descriptions.Item>
        <Descriptions.Item label="登记人">{info.revisitor}</Descriptions.Item>
        <Descriptions.Item label="登记人单位">{info.revisitUnit}</Descriptions.Item>
        <Descriptions.Item label="登记人部门">{info.revisitDept}</Descriptions.Item>
      </Descriptions>
    </div>
  );
}

export default ReturnVisitdes;
