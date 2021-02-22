import React from 'react';
import { Descriptions, Radio } from 'antd';
import styles from '../index.less';
import Downloadfile from '@/components/SysUpload/Downloadfile';

function Operatorconfirmades(props) {
  const { info } = props;
  let value;
  if (info) {
    value = info.confirmResult;
  }
  return (
    <div className={styles.collapse} style={{ marginLeft: 30, marginRight: 10 }}>
      <Descriptions style={{ marginTop: 24 }} size="middle">
        <Descriptions.Item label="确认结果" span={3}>
          <Radio.Group value={value} disabled>
            <Radio value='1'>通过</Radio>
            <Radio value='0'>不通过</Radio>
          </Radio.Group>
        </Descriptions.Item>

        <Descriptions.Item label="确认时间" span={3}>
          {info.confirmTime}
        </Descriptions.Item>

        <Descriptions.Item label="确认意见" span={3}>
          <div dangerouslySetInnerHTML={{ __html: info.confirmContent?.replace(/[\n]/g, '<br/>') }} />

        </Descriptions.Item>

        <Descriptions.Item label="上传附件" span={3}>
          <span style={{ color: 'blue', textDecoration: 'underline' }} >
            {info.confirmAttachments !== null && <Downloadfile files={info.confirmAttachments} />}
          </span>
        </Descriptions.Item>

        <Descriptions.Item label="确认人">
          {info.confirmUser}
        </Descriptions.Item>

        <Descriptions.Item label="确认单位">
          {info.confirmUnit}
        </Descriptions.Item>

        <Descriptions.Item label="确认部门">
          {info.confirmDept}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
}
export default Operatorconfirmades;
