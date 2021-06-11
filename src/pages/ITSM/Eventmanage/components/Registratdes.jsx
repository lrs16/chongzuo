import React from 'react';
import { Descriptions, Checkbox } from 'antd';
import Downloadfile from '@/components/SysUpload/Downloadfile';
import styles from '../index.less';

function Registratdes(props) {
  const { info, main } = props;
  return (
    <div className={styles.collapse} style={{ marginLeft: 30, marginRight: 10 }}>
      <Descriptions style={{ marginTop: 24 }} size="middle">
        <Descriptions.Item label="事件编号">{main.eventNo}</Descriptions.Item>
        <Descriptions.Item label="建单时间">{main.addTime}</Descriptions.Item>
        <Descriptions.Item label="事件来源">{main.eventSource}</Descriptions.Item>
        <Descriptions.Item label="申报人">{info.applicationUser}</Descriptions.Item>
        <Descriptions.Item label="申报人单位">{info.applicationUnit}</Descriptions.Item>
        <Descriptions.Item label="申报人部门">{info.applicationDept}</Descriptions.Item>
        <Descriptions.Item label="申报人电话">{info.applicationUserPhone}</Descriptions.Item>
        <Descriptions.Item label="手机号码">{info.mobilePhone}</Descriptions.Item>
        <Descriptions.Item label="回访方式">{main.revisitWay}</Descriptions.Item>
        <Descriptions.Item label="事件分类">{main.eventType}</Descriptions.Item>
        <Descriptions.Item label="事件对象" span={4}>{main.eventObject}</Descriptions.Item>
        <Descriptions.Item label="影响度">{main.eventEffect}</Descriptions.Item>
        <Descriptions.Item label="紧急度">{main.eventEmergent}</Descriptions.Item>
        <Descriptions.Item label="优先级" span={3}>
          {main.eventPrior}
        </Descriptions.Item>
        <Descriptions.Item label="事件标题" span={3}>
          {main.title}
        </Descriptions.Item>
        <Descriptions.Item label="事件描述" span={3}>
          <div dangerouslySetInnerHTML={{ __html: main.content?.replace(/[\n]/g, '<br/>') }} />
        </Descriptions.Item>
        <Descriptions.Item label="自行处理">
          <Checkbox defaultChecked={Boolean(Number(info.selfhandle))} disabled />
        </Descriptions.Item>
        <Descriptions.Item label="是否补单" span={4}>
          <Checkbox defaultChecked={info.supplement === '' ? '' : Boolean(Number(info.supplement))} disabled />
        </Descriptions.Item>
        <Descriptions.Item label="附件" span={3}>
          {info.fileIds !== '' && <Downloadfile files={info.fileIds} />}
        </Descriptions.Item>
        <Descriptions.Item label="登记人">{info.registerUser}</Descriptions.Item>
        <Descriptions.Item label="登记人单位">{info.registerUnit}</Descriptions.Item>
        <Descriptions.Item label="登记人部门">{info.registerDept}</Descriptions.Item>
      </Descriptions>
    </div>
  );
}

export default Registratdes;
