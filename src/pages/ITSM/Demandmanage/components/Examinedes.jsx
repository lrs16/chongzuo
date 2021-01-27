import React from 'react';
import moment from 'moment';
import { Descriptions } from 'antd';
import styles from '../index.less';
import Downloadfile from '@/components/SysUpload/Downloadfile';

const resultmap = new Map([
  [1, '通过'],
  [0, '不通过'],
]);

function Examinedes(props) {
  const { info } = props;
  const content = {
    __html: info.reason?.replace(/[\n]/g, '<br/>'),
  };
  return (
    <div className={styles.collapse}>
      <Descriptions style={{ marginTop: 24 }} size="middle">
        <Descriptions.Item label="审核结果" span={3}>
          {resultmap.get(info.result)}
        </Descriptions.Item>
        <Descriptions.Item label="审核时间" span={3}>
          {moment(info.reviewTime).format('YYYY-MM-DD HH:MM')}
        </Descriptions.Item>
        <Descriptions.Item label="审核意见" span={3}>
          <div dangerouslySetInnerHTML={{ __html: info.opinion?.replace(/[\n]/g, '<br/>') }} />
        </Descriptions.Item>
        <Descriptions.Item label="附件" span={3}>
          {info.attachment !== '' && <Downloadfile files={info.attachment} />}
        </Descriptions.Item>
        <Descriptions.Item label="审核人">{info.userName}</Descriptions.Item>
        <Descriptions.Item label="审核人单位">{info.unit}</Descriptions.Item>
        <Descriptions.Item label="审核人部门">{info.department}</Descriptions.Item>
      </Descriptions>
    </div>
  );
}

export default Examinedes;
