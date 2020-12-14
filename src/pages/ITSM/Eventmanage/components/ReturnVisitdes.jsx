import React from 'react';
import { Descriptions } from 'antd';

function ReturnVisitdes(props) {
  return (
    <Descriptions style={{ marginTop: 24 }}>
      <Descriptions.Item label="回访方式">sj202004100001</Descriptions.Item>
      <Descriptions.Item label="结果处理">2020-04-10</Descriptions.Item>
      <Descriptions.Item label="满意度">用户电话申告</Descriptions.Item>
      <Descriptions.Item label="回访内容" span={3}>
        张三三
      </Descriptions.Item>
      <Descriptions.Item label="回访时间">广西博联</Descriptions.Item>
      <Descriptions.Item label="上传附件">系统集成部</Descriptions.Item>
      <Descriptions.Item label="回访人">sj202004100001</Descriptions.Item>
      <Descriptions.Item label="回访人单位">2020-04-10</Descriptions.Item>
      <Descriptions.Item label="回访人部门">用户电话申告</Descriptions.Item>
    </Descriptions>
  );
}

export default ReturnVisitdes;
