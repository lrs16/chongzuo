import React from 'react';
import { Card, Statistic, Row, Col, Icon } from 'antd';

function StatisticsCard(props) {
  const { title, value, suffix, des, desval, type, onGetVal } = props;
  return (
    <Card style={{ marginLeft: '-1px' }}>
      <Row type="flex" justify="space-between" align="bottom">
        <Col span={24}>{title}</Col>
        <Col span={24}
          onClick={() => {
            setTimeout(() => {
              if (onGetVal) {
                onGetVal()
              }
            }, 200)
          }
          }

          onDoubleClick={() => {
              setTimeout(() => {
                if (onGetVal) {
                  onGetVal()
                }
              }, 200)
            }
          }
        >
          <Statistic value={value} suffix={suffix} />
        </Col>
        <Col span={24} style={{ paddingBottom: 8 }}>
          <span style={{ paddingRight: 12 }}>{des}</span>
          <span>{desval}</span>
          {type === 'up' && <Icon type="caret-up" style={{ color: '#52c41a' }} />}
          {type === 'down' && <Icon type="caret-down" style={{ color: '#f5222d' }} />}
        </Col>
      </Row>
    </Card>
  );
}

export default StatisticsCard;