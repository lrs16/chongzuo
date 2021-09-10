import React from 'react';
import { Card, Row, Col } from 'antd';
import styles from '../index.less';

const infolist = [
  { title: '告警总数', value: 1988, key: '1' },
  { title: '业务指标监控', value: 556, key: '2' },
  { title: '终端在线和入库', value: 3855, key: '3' },
  { title: '接口数据核查', value: 1, key: '4' },
  { title: 'KAFKA消费', value: 520, key: '5' },
  { title: '主站系统运维', value: 1, key: '6' },
]

function TotalInfo(props) {

  const Info = ({ title, value, bordered }) => (
    <div className={styles.headerInfo}>
      <span>{title}</span>
      <p>{value}</p>
      {bordered && <em />}
    </div>
  );

  return (
    <div className={styles.standardList}>
      <Card bordered>
        <Row>
          {infolist.map((obj, index) =>
            <Col sm={4} xs={24}>
              <Info key={obj.key} title={obj.title} value={obj.value} bordered={index !== infolist.length - 1} />
            </Col>
          )}
        </Row>
      </Card>
    </div>
  );
}

export default TotalInfo;