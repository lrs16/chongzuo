import React from 'react';
import { Descriptions, Radio } from 'antd';
import styles from '../index.less';
import Downloadfile from '@/components/SysUpload/Downloadfile';

function OperationPlanfillindes(props) {
  const { info } = props;
  let value;
  if (info) {
    value = info.confirmResult;
  }
  return (
    <div className={styles.collapse} style={{ marginLeft: 30, marginRight: 10 }}>
      <Descriptions style={{ marginTop: 24 }} size="middle">

        <Descriptions.Item label="作业计划编号">
        </Descriptions.Item>

        <Descriptions.Item label="填报时间" >
        </Descriptions.Item>

        <Descriptions.Item label="作业系统名称">

        </Descriptions.Item>

        <Descriptions.Item label="作业类型">
        </Descriptions.Item>

        <Descriptions.Item label="作业性质">
        </Descriptions.Item>

        <Descriptions.Item label="作业单位">
        </Descriptions.Item>

        <Descriptions.Item label="作业负责人">
        </Descriptions.Item>

        <Descriptions.Item label="开工作票">
        </Descriptions.Item>

        <Descriptions.Item label="作业状态">
        </Descriptions.Item>
        
        <Descriptions.Item label="作业对象" span={3}>
        </Descriptions.Item>
        
        <Descriptions.Item label="作业内容" span={3}>
        </Descriptions.Item>

        <Descriptions.Item label="计划开始时间">
        </Descriptions.Item>

        <Descriptions.Item label="计划结束时间" span={2}>
        </Descriptions.Item>

        <Descriptions.Item label="填报人">
        </Descriptions.Item>

        <Descriptions.Item label="填报单位">
        </Descriptions.Item>

      </Descriptions>
    </div>
  );
}
export default OperationPlanfillindes;
