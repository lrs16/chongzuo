import React from 'react';
import { Descriptions } from 'antd';
import styles from '../index.less';

const returnvisit = new Map([
  ['001', '企信回访'],
  ['002', '电话回访'],
  ['003', '短信回访'],
  ['004', '邮箱回访'],
]);

const satisfactions = new Map([
  ['001', '满意'],
  ['002', '一般'],
  ['003', '不满意'],
]);

const result = new Map([
  ['001', '误报'],
  ['002', '根本解决'],
  ['003', '代替方法'],
  ['004', '自动消失'],
  ['005', '转问题解决'],
]);

function ReturnVisitdes(props) {
  const { info, main } = props;
  return (
    <div className={styles.collapse}>
      <Descriptions style={{ marginTop: 24 }}>
        <Descriptions.Item label="回访方式">{returnvisit.get(info.revisitWay)}</Descriptions.Item>
        <Descriptions.Item label="处理结果">{result.get(main.eventResult)}</Descriptions.Item>
        <Descriptions.Item label="满意度">{satisfactions.get(info.satisfaction)}</Descriptions.Item>
        <Descriptions.Item label="回访内容">{info.content}</Descriptions.Item>
        <Descriptions.Item label="填单时间">{info.addTime}</Descriptions.Item>
        <Descriptions.Item label="回访时间">{info.revisitTime}</Descriptions.Item>
        <Descriptions.Item label="登记人">{info.revisitor}</Descriptions.Item>
        <Descriptions.Item label="登记人单位">{info.revisitUnit}</Descriptions.Item>
        <Descriptions.Item label="登记人部门">{info.revisitDept}</Descriptions.Item>
      </Descriptions>
    </div>
  );
}

export default ReturnVisitdes;
