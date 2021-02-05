import React from 'react';
import { Descriptions } from 'antd';
import styles from '../index.less';
import Downloadfile from '@/components/SysUpload/Downloadfile';

function ReturnVisitdes(props) {
  const { info, main } = props;
  return (
    <div className={styles.collapse} style={{ marginLeft: 30, marginRight: 10 }}>
      <Descriptions style={{ marginTop: 24 }} size="middle">
        <Descriptions.Item label="回访方式">{info.revisitWay}</Descriptions.Item>
        <Descriptions.Item label="处理结果">{main.eventResult}</Descriptions.Item>
        <Descriptions.Item label="满意度">{info.satisfaction}</Descriptions.Item>
        <Descriptions.Item label="回访内容" span={3}>
          <div dangerouslySetInnerHTML={{ __html: info.content?.replace(/[\n]/g, '<br/>') }} />
        </Descriptions.Item>
        <Descriptions.Item label="填单时间">{info.addTime}</Descriptions.Item>
        <Descriptions.Item label="回访时间" span={2}>
          {info.revisitTime}
        </Descriptions.Item>
        <Descriptions.Item label="附件" span={3}>
          {info.fileIds !== '' && <Downloadfile files={info.fileIds} />}
        </Descriptions.Item>
        <Descriptions.Item label="回访人">{info.revisitor}</Descriptions.Item>
        <Descriptions.Item label="回访人单位">{info.revisitUnit}</Descriptions.Item>
        <Descriptions.Item label="回访人部门">{info.revisitDept}</Descriptions.Item>
      </Descriptions>
    </div>
  );
}

export default ReturnVisitdes;
