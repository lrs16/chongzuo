import React from 'react';
import {
  Descriptions,
  Radio
} from 'antd';
import styles from '../index.less';
import Downloadfile from '@/components/SysUpload/Downloadfile';

function Problemreview(props) {
  const {
    info,
  } = props;

  let value;
  if (info) {
    value = info.checkResult;
  }

  return (
    <div className={styles.collapse} style={{ marginLeft: 30, marginRight: 10 }}>
      <>
        <Descriptions style={{ marginTop: 24 }} size="middle">
          <Descriptions.Item label="审核结果" span={3}>
            <Radio.Group value={value} disabled>
              <Radio value='1'>通过</Radio>
              <Radio value='0'>不通过</Radio>
            </Radio.Group>
          </Descriptions.Item>


          <Descriptions.Item label="审核时间" span={3}>
            {info.checkTime}
          </Descriptions.Item>

          <Descriptions.Item label="审核意见" span={3}>
            <div dangerouslySetInnerHTML={{ __html: info.checkOpinion?.replace(/[\n]/g, '<br/>') }} />
          </Descriptions.Item>

          <Descriptions.Item label="上传附件" span={3}>
            <span style={{ color: 'blue', textDecoration: 'underline' }} >
              {info.checkAttachments !== null && <Downloadfile files={info.checkAttachments} />}
            </span>
          </Descriptions.Item>

          <Descriptions.Item label="审核人">
            {info.checkUser}
          </Descriptions.Item>

          <Descriptions.Item label="审核单位">
            {info.checkUnit}
          </Descriptions.Item>

          <Descriptions.Item label="审核部门">
            {info.checkDept}
          </Descriptions.Item>
        </Descriptions>
      </>
    </div>

  );
}
export default Problemreview;
