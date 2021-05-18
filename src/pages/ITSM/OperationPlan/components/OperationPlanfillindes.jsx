import React from 'react';
import { Descriptions } from 'antd';
import styles from '../index.less';
import Downloadfile from '@/components/SysUpload/Downloadfile';

function OperationPlanfillindes(props) {
  const { 
    info,
   } = props;
  let value;
  if (info) {
    value = info.confirmResult;
  }
  return (
    <div className={styles.collapse} style={{ marginLeft: 30, marginRight: 10 }}>
      <Descriptions style={{ marginTop: 24 }} size="middle">
        <Descriptions.Item label="作业计划编号">{info.operationNo}</Descriptions.Item>

        <Descriptions.Item label="填报时间" >{info.addTime}</Descriptions.Item>

        <Descriptions.Item label="作业系统名称">{info.systemName}</Descriptions.Item>

        <Descriptions.Item label="作业类型">{info.type} </Descriptions.Item>

        <Descriptions.Item label="作业性质">{info.nature}</Descriptions.Item>

        <Descriptions.Item label="作业单位">{info.operationUnit}</Descriptions.Item>

        <Descriptions.Item label="作业负责人">{info.operationUser}</Descriptions.Item>

        <Descriptions.Item label="开工作票">{info.billing}</Descriptions.Item>

        <Descriptions.Item label="作业状态">{info.status}</Descriptions.Item>
        
        <Descriptions.Item label="作业对象" span={3}>{info.object}</Descriptions.Item>
        
        <Descriptions.Item label="作业内容" span={3}>{info.content}</Descriptions.Item>

        <Descriptions.Item label="计划开始时间">{info.plannedStartTime}</Descriptions.Item>

        <Descriptions.Item label="计划结束时间">{info.plannedStartTime}</Descriptions.Item>

        <Descriptions.Item label="上传附件">
        <span style={{ color: 'blue', textDecoration: 'underline' }} >
            {info.fileIds && <Downloadfile files={info.fileIds} />}
          </span>
        </Descriptions.Item>

        <Descriptions.Item label="填报人">{info.addUser}</Descriptions.Item>

        <Descriptions.Item label="填报单位">{info.addUnit}</Descriptions.Item>

      </Descriptions>
    </div>
  );
}
export default OperationPlanfillindes;
