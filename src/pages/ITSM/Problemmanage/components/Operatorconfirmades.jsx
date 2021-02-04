import React from 'react';
import { Descriptions, Radio } from 'antd';
import Downloadfile from '@/components/SysUpload/Downloadfile';

function Operatorconfirmades(props) {
  const { info } = props;
  let value;
  if (info) {
    value = info.confirmResult;
  }
  return (
    <div>
      <Descriptions>
        <Descriptions.Item label="确认结果">
          <Radio.Group value={value} disabled>
            <Radio value='1'>通过</Radio>
            <Radio value='0'>不通过</Radio>
          </Radio.Group>
        </Descriptions.Item>
      </Descriptions>

      <Descriptions>
        <Descriptions.Item label="确认时间">
          {info.confirmTime}
        </Descriptions.Item>
      </Descriptions>

      <Descriptions>
        <Descriptions.Item label="确认意见">
          {info.confirmTime}
        </Descriptions.Item>
      </Descriptions>

      <Descriptions>
        <Descriptions.Item label="上传附件">
          <span style={{ color: 'blue', textDecoration: 'underline' }} >
            {info.confirmAttachments !== null && <Downloadfile files={info.confirmAttachments} />}
          </span>
        </Descriptions.Item>
      </Descriptions>

      <Descriptions>
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
