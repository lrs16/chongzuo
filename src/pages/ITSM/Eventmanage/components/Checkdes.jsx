import React from 'react';
import { Descriptions } from 'antd';
import styles from '../index.less';
import Downloadfile from '@/components/SysUpload/Downloadfile';

// 影响、紧急度
const resultmap = new Map([
  ['001', '通过'],
  ['002', '不通过'],
]);

function Checkdes(props) {
  const { info } = props;
  return (
    <div className={styles.collapse}>
      <Descriptions style={{ marginTop: 24 }} size="middle">
        <Descriptions.Item label="审核结果">{resultmap.get(info.checkResult)}</Descriptions.Item>
        <Descriptions.Item label="审核时间">{info.checkTime}</Descriptions.Item>
        <div style={{ clear: 'both' }} />
        <Descriptions.Item label="审核意见" span={3}>
          {info.content}
        </Descriptions.Item>
        <Descriptions.Item label="附件" span={3}>
          {info.fileIds !== '' && <Downloadfile files={info.fileIds} />}
        </Descriptions.Item>
        <Descriptions.Item label="审核人">{info.checkUser}</Descriptions.Item>
        <Descriptions.Item label="审核人单位">{info.checkUnit}</Descriptions.Item>
        <Descriptions.Item label="申报人部门">{info.checkDept}</Descriptions.Item>
      </Descriptions>
    </div>
  );
}

export default Checkdes;
