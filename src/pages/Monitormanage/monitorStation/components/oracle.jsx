import React from 'react';
import { Card, Descriptions } from 'antd';

const { Item } = Descriptions;

export default () => {
  return (
    <Card>
      <Descriptions title="基本信息">
        <Item label="名称">xx操作系统</Item>
        <Item label="IP">192.168.1.0</Item>
        <Item label="数据库类型">Oracle</Item>
        <Item label="数据库版本">
          Oracle Database 11g Enterprise Edition Heiease 11.2.0.1.0-64bit Production
        </Item>
        <Item label="状态">在线</Item>
        <Item label="锁表数量">8个</Item>
        <Item label="运行时长">35天17小时26分钟13秒</Item>
      </Descriptions>
    </Card>
  );
};
