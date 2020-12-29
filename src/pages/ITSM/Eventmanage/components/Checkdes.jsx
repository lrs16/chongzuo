import React from 'react';
import { Descriptions } from 'antd';

function Checkdes(props) {
  const { info, main } = props;
  return (
    <Descriptions style={{ marginTop: 24 }}>
      <Descriptions.Item label="审核结果">{info.check_result}</Descriptions.Item>
      <Descriptions.Item label="审核意见">{info.content}</Descriptions.Item>
      <Descriptions.Item label="审核时间">{info.check_time}</Descriptions.Item>
      <Descriptions.Item label="审核人">{info.check_user}</Descriptions.Item>
      <Descriptions.Item label="审核人单位">{info.check_unit}</Descriptions.Item>
      <Descriptions.Item label="申报人部门">{info.check_dept}</Descriptions.Item>
    </Descriptions>
  );
}

export default Checkdes;
