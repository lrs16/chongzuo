import React from 'react';
import { Descriptions } from 'antd';
import styles from '../index.less';
import Downloadfile from '@/components/SysUpload/Downloadfile';

function Problemregistration(props) {
  const {
    main,
    info,
  } = props;

  return (
    <div className={styles.collapse}  style={{ marginLeft: 30, marginRight: 10 }}>
      <>
        <Descriptions style={{ marginTop: 24 }} size="middle">
          <Descriptions.Item label="问题编号">
            {main.no}
          </Descriptions.Item>

          <Descriptions.Item label="登记时间">
            {info.registerTime}
          </Descriptions.Item>

          <Descriptions.Item label="发生时间">
            {info.registerOccurTime}
          </Descriptions.Item>

          <Descriptions.Item label="问题来源">
            {main.sourcecn}
          </Descriptions.Item>

          <Descriptions.Item label="问题分类">
            {main.typecn}
          </Descriptions.Item>

          <Descriptions.Item label="重要程度">
            {main.importancecn}
          </Descriptions.Item>

          <Descriptions.Item label="期待完成时间">
            {info.registerExpectTime}
          </Descriptions.Item>

          <Descriptions.Item label="所属项目">
            {info.registerProjectcn}
          </Descriptions.Item>

          <Descriptions.Item label="影响范围">
            {info.registerScopecn}
          </Descriptions.Item>
    
          <Descriptions.Item label="联系电话" span={3}>
            {info.registerUserPhone}
          </Descriptions.Item>

          <Descriptions.Item label="问题标题" span={3}>
            {main.title}
          </Descriptions.Item>

          <Descriptions.Item label="问题描述" span={3}>
            <div dangerouslySetInnerHTML={{ __html: main.content?.replace(/[\n]/g, '<br/>') }} />
          </Descriptions.Item>

          <Descriptions.Item label="上传附件" span={3}>
            <span style={{ color: 'blue', textDecoration: 'underline' }} >
              {info.registerAttachments !== null && <Downloadfile files={info.registerAttachments} />}
            </span>
          </Descriptions.Item>

          <Descriptions.Item label="填报人">
            {info.registerUser}
          </Descriptions.Item>

          <Descriptions.Item label="填报人单位">
            {info.registerUnit}
          </Descriptions.Item>

          <Descriptions.Item label="填报人部门">
            {info.registerDept}
          </Descriptions.Item>

          </Descriptions>
      </>
    </div>
  );
}
export default Problemregistration;
