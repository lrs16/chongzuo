import React from 'react';
import { Descriptions } from 'antd';
import Downloadfile from '@/components/SysUpload/Downloadfile';
import styles from '../index.less';

function Handledes(props) {
  const { info, main } = props;
  return (
    <div className={styles.collapse} style={{ marginLeft: 30, marginRight: 10 }}>
      <Descriptions style={{ marginTop: 24 }} size="middle">
        <Descriptions.Item label="处理人">{info.handler}</Descriptions.Item>
        <Descriptions.Item label="处理人单位">{info.handleUnit}</Descriptions.Item>
        <Descriptions.Item label="处理人部门">{info.handleDept}</Descriptions.Item>
        <Descriptions.Item label="事件分类">{main.eventType}</Descriptions.Item>
        <Descriptions.Item label="事件对象">{main.eventObject}</Descriptions.Item>
        <Descriptions.Item label="处理结果">{info.handleResult}</Descriptions.Item>
        <Descriptions.Item label="接单时间">{info.addTime}</Descriptions.Item>
        <Descriptions.Item label="处理完成时间" span={4}>
          {info.endTime}
        </Descriptions.Item>
        {/* <Descriptions.Item label="二线标签"span={3}>No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China</Descriptions.Item> */}
        <Descriptions.Item label="解决方案" span={3}>
          <div dangerouslySetInnerHTML={{ __html: info.content?.replace(/[\n]/g, '<br/>') }} />
        </Descriptions.Item>
        <Descriptions.Item label="附件" span={3}>
          {info.fileIds !== 'null' && <Downloadfile files={info.fileIds} />}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
}

export default Handledes;
