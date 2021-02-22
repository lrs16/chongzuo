import React from 'react';
import { Descriptions } from 'antd';
import styles from '../index.less';
import Downloadfile from '@/components/SysUpload/Downloadfile';

function Problemsolving(props) {
  const { info } = props;
  return (
    <div className={styles.collapse} style={{ marginLeft: 30, marginRight: 10 }}>
      <Descriptions style={{ marginTop: 24 }} size="middle">
        <Descriptions.Item label="接单时间">
          {info.addTime}
        </Descriptions.Item>

        <Descriptions.Item label="处理完成时间">
          {info.addTime}
        </Descriptions.Item>

        <Descriptions.Item label="处理结果">
          {info.handleResultcn}
        </Descriptions.Item>

        <Descriptions.Item label="解决方案" span={3}>
          <div dangerouslySetInnerHTML={{ __html: info.handleContent?.replace(/[\n]/g, '<br/>') }} />
        </Descriptions.Item>

        <Descriptions.Item label="上传附件" >
          <span style={{ color: 'blue', textDecoration: 'underline' }} span={3}>
            {info.handleAttachments !== null && <Downloadfile files={info.handleAttachments} />}
          </span>
        </Descriptions.Item>

        <Descriptions.Item label="处理人">
          {info.handler}
        </Descriptions.Item>

        <Descriptions.Item label="处理单位">
          {info.handleUnit}
        </Descriptions.Item>

        <Descriptions.Item label="处理部门">
          {info.handleDept}
        </Descriptions.Item>
      </Descriptions>
    </div>

  );
}
export default Problemsolving;
