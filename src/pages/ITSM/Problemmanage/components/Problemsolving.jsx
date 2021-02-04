import React from 'react';
import { Descriptions } from 'antd';
import Downloadfile from '@/components/SysUpload/Downloadfile';

function Problemsolving(props) {
  const { info } = props;
  return (
    <div>
      <Descriptions>
        <Descriptions.Item label="接单时间">
          {info.addTime}
        </Descriptions.Item>

        <Descriptions.Item label="处理完成时间">
          {info.addTime}
        </Descriptions.Item>

        <Descriptions.Item label="处理结果">
          {info.handleResult}
        </Descriptions.Item>
      </Descriptions>

      <Descriptions>
        <Descriptions.Item label="解决方案">
          {info.handleContent}
        </Descriptions.Item>
      </Descriptions>

      <Descriptions>
        <Descriptions.Item label="上传附件">
          <span style={{ color: 'blue', textDecoration: 'underline' }} >
            {info.handleAttachments !== null && <Downloadfile files={info.handleAttachments} />}
          </span>
        </Descriptions.Item>
      </Descriptions>

      <Descriptions>
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
