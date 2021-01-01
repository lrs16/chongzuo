import React from 'react';
import { Descriptions, Checkbox } from 'antd';
import styles from '../index.less';

// 来源
const sourcemaps = new Map([
  ['001', '用户电话申告'],
  ['002', '企信'],
]);
//事件分类
const typemap = new Map([
  ['001', '咨询'],
  ['002', '缺陷'],
  ['003', '故障'],
  ['004', '数据处理'],
  ['005', '账号权限'],
  ['006', '其它'],
]);

// 回访方式
const revisitwaymap = new Map([
  ['001', '企信回访'],
  ['002', '电话回访'],
  ['003', '短信回访'],
  ['004', '邮箱回访'],
]);
// 事件对象
const objectmap = new Map([
  ['001', '配网采集'],
  ['002', '主网采集'],
  ['003', '终端掉线'],
  ['004', '配网档案'],
  ['005', '实用化指标'],
  ['006', '账号缺陷'],
]);
// 影响、紧急度
const degreemap = new Map([
  ['001', '低'],
  ['002', '中'],
  ['003', '高'],
  ['004', '紧急'],
]);

function Registratdes(props) {
  const { info, main } = props;
  return (
    <div className={styles.collapse}>
      <Descriptions style={{ marginTop: 24 }}>
        <Descriptions.Item label="事件编号">{main.event_no}</Descriptions.Item>
        <Descriptions.Item label="建单时间">{main.add_time}</Descriptions.Item>
        <Descriptions.Item label="事件来源">{sourcemaps.get(main.event_source)}</Descriptions.Item>
        <Descriptions.Item label="申报人">{info.application_user}</Descriptions.Item>
        <Descriptions.Item label="申报人单位">{info.application_unit}</Descriptions.Item>
        <Descriptions.Item label="申报人部门">{info.application_dept}</Descriptions.Item>
        <Descriptions.Item label="申报人电话">{info.application_user_phone}</Descriptions.Item>
        <Descriptions.Item label="回访方式">
          {revisitwaymap.get(info.revisit_way)}
        </Descriptions.Item>
        <Descriptions.Item label="事件分类">{typemap.get(main.event_type)}</Descriptions.Item>
        <Descriptions.Item label="事件对象">{objectmap.get(main.event_object)}</Descriptions.Item>
        <Descriptions.Item label="影响度">{degreemap.get(info.event_effect)}</Descriptions.Item>
        <Descriptions.Item label="紧急度">{degreemap.get(info.event_emergent)}</Descriptions.Item>
        <Descriptions.Item label="优先级" span={3}>
          {degreemap.get(info.event_prior)}
        </Descriptions.Item>
        <Descriptions.Item label="事件标题" span={3}>
          {main.title}
        </Descriptions.Item>
        <Descriptions.Item label="事件描述" span={3}>
          {main.content}
        </Descriptions.Item>
        <Descriptions.Item label="自行处理">
          <Checkbox defaultChecked={Boolean(Number(info.selfhandle))} disabled />
        </Descriptions.Item>
        <Descriptions.Item label="是否补单">
          <Checkbox defaultChecked={Boolean(Number(info.supplement))} disabled />
        </Descriptions.Item>
        <Descriptions.Item label="附件" span={3}></Descriptions.Item>
        <Descriptions.Item label="登记人">{info.register_user}</Descriptions.Item>
        <Descriptions.Item label="登记人单位">{info.register_unit}</Descriptions.Item>
        <Descriptions.Item label="登记人部门">{info.register_dept}</Descriptions.Item>
      </Descriptions>
    </div>
  );
}

export default Registratdes;
