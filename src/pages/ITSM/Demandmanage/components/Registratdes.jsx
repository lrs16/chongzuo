import React from 'react';
import moment from 'moment';
import { Descriptions } from 'antd';
import Downloadfile from '@/components/SysUpload/Downloadfile';
import styles from '../index.less';

function Registratdes(props) {
  const { info } = props;
  return (
    <div className={styles.collapse} style={{ marginLeft: 30, marginRight: 10 }}>
      <Descriptions style={{ marginTop: 24 }} size="middle">
        <Descriptions.Item label="需求编号">{info.demandId}</Descriptions.Item>
        <Descriptions.Item label="建单时间">
          {info.creationTime}
        </Descriptions.Item>
        <Descriptions.Item label="申请时间">
          {info.registerTime}
        </Descriptions.Item>
        <Descriptions.Item label="期待完成时间">
          {info.completeTime}
        </Descriptions.Item>
        <Descriptions.Item label="申请人">{info.proposer}</Descriptions.Item>
        <Descriptions.Item label="申请人单位">{info.proposingUnit}</Descriptions.Item>
        <Descriptions.Item label="申请人部门">{info.proposingDepartment}</Descriptions.Item>
        <Descriptions.Item label="联系电话" span={4}>
          {info.proposerPhone}
        </Descriptions.Item>
        <Descriptions.Item label="所属项目" span={3}>
          {info.project}
        </Descriptions.Item>
        <Descriptions.Item label="需求类型">{info.demandType}</Descriptions.Item>
        <Descriptions.Item label="功能模块">{info.functionalModule}</Descriptions.Item>
        <Descriptions.Item label="需求优先级">{info.priority}</Descriptions.Item>
        <Descriptions.Item label="需求标题" span={3}>
          {info.title}
        </Descriptions.Item>
        <Descriptions.Item label="需求原因" span={3}>
          <div dangerouslySetInnerHTML={{ __html: info.reason?.replace(/[\n]/g, '<br/>') }} />
        </Descriptions.Item>
        <Descriptions.Item label="需求描述" span={3}>
          <div dangerouslySetInnerHTML={{ __html: info.detail?.replace(/[\n]/g, '<br/>') }} />
        </Descriptions.Item>
        <Descriptions.Item label="附件" span={3}>
          {info.attachment !== '' && <Downloadfile files={info.attachment} />}
        </Descriptions.Item>
        <Descriptions.Item label="登记人">{info.registerPerson}</Descriptions.Item>
        <Descriptions.Item label="登记人单位">{info.registrationUnit}</Descriptions.Item>
        <Descriptions.Item label="登记人部门">{info.registrationDepartment}</Descriptions.Item>
      </Descriptions>
    </div>
  );
}

export default Registratdes;
