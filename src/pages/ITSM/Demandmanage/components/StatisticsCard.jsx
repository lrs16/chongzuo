import React from 'react';
import { Card, Statistic, Row, Col, Icon } from 'antd';

function StatisticsCard(props) {
  const { title, value, suffix, des, desval, type } = props;
  return (
    <Card style={{ marginLeft: '-1px', border: 'none'  }}>
      <Row type="flex" justify="space-between" align="bottom">
        <Col span={24}>{title}</Col>
        <Col span={24}>
          <Statistic value={value} suffix={suffix} />
        </Col>
        <Col span={24} style={{ paddingBottom: 8 }}>
          <span style={{ paddingRight: 12 }}>{des}</span>
          <span>{desval}</span>
          {type === 'up' && <Icon type="caret-up" style={{ color: '#f5222d' }} />}
          {type === 'down' && <Icon type="caret-down" style={{ color: '#52c41a' }} />}
        </Col>
      </Row>
    </Card>
  );
}

export default StatisticsCard;