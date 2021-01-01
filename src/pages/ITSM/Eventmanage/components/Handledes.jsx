import React from 'react';
import { Descriptions } from 'antd';
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
//处理结果
const resultmap = new Map([
  ['001', '误报'],
  ['002', '根本解决'],
  ['003', '代替方法'],
  ['004', '自动消失'],
  ['005', '转问题解决'],
]);

function Handledes(props) {
  const { info, main } = props;

  return (
    <div className={styles.collapse}>
      <Descriptions style={{ marginTop: 24 }}>
        <Descriptions.Item label="处理人">{info.handler}</Descriptions.Item>
        <Descriptions.Item label="处理人单位">{info.handle_unit}</Descriptions.Item>
        <Descriptions.Item label="处理人部门">{info.handle_dept}</Descriptions.Item>
        <Descriptions.Item label="事件分类">{typemap.get(main.event_type)}</Descriptions.Item>
        <Descriptions.Item label="事件对象">{objectmap.get(main.event_object)}</Descriptions.Item>
        <Descriptions.Item label="影响度">{degreemap.get(info.event_effect)}</Descriptions.Item>
        <Descriptions.Item label="紧急度">{degreemap.get(info.event_emergent)}</Descriptions.Item>
        <Descriptions.Item label="优先级" span={3}>
          {degreemap.get(info.event_prior)}
        </Descriptions.Item>
        <Descriptions.Item label="处理结果">{resultmap.get(info.handle_result)}</Descriptions.Item>
        <Descriptions.Item label="接单时间">{info.add_time}</Descriptions.Item>
        <Descriptions.Item label="处理完成时间">{info.end_time}</Descriptions.Item>
        {/* <Descriptions.Item label="二线标签"span={3}>No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China</Descriptions.Item> */}
        <Descriptions.Item label="解决方案" span={3}>
          {info.content}
        </Descriptions.Item>
        {/* <Descriptions.Item label="上传附件"span={3}>No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China</Descriptions.Item> */}
      </Descriptions>
    </div>
  );
}

export default Handledes;
