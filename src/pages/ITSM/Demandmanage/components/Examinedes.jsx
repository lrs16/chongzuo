import React from 'react';
import moment from 'moment';
import { Descriptions } from 'antd';
import Downloadfile from '@/components/SysUpload/Downloadfile';
import styles from '../index.less';

const resultmap = new Map([
  [1, '通过'],
  [0, '不通过'],
  [2, '通过'],
  [3, '通过'],
  [4, '通过'],
]);

function Examinedes(props) {
  const { info } = props;
  const text = info.taskName.indexOf('确认') === -1 ? '审核' : '确认';

  return (
    <div className={styles.collapse} style={{ marginLeft: 30, marginRight: 10 }}>
      <Descriptions style={{ marginTop: 24 }} size="middle">
        <Descriptions.Item label={`${text}结果`}>{resultmap.get(info.result)}</Descriptions.Item>
        <Descriptions.Item>
          {info.result === 2 && <>科室领导审核，市场部领导审核</>}
          {info.result === 4 && <>科室领导审核</>}
          {info.result === 3 && <>市场部领导审核</>}
        </Descriptions.Item>
        <Descriptions.Item />
        <Descriptions.Item label={`${text}时间`} span={3}>
          {info.reviewTime}
        </Descriptions.Item>
        <Descriptions.Item label={`${text}意见`} span={3}>
          <div dangerouslySetInnerHTML={{ __html: info.opinion?.replace(/[\n]/g, '<br/>') }} />
        </Descriptions.Item>
        <Descriptions.Item label="附件" span={3}>
          {info.attachment !== '' && <Downloadfile files={info.attachment} />}
        </Descriptions.Item>
        <Descriptions.Item label={`${text}人`}>{info.userName}</Descriptions.Item>
        <Descriptions.Item label={`${text}人单位`}>{info.unit}</Descriptions.Item>
        <Descriptions.Item label={`${text}人部门`}>{info.department}</Descriptions.Item>
      </Descriptions>
    </div>
  );
}

export default Examinedes;
