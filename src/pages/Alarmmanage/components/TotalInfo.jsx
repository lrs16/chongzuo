import React from 'react';
import { Card, Row, Col } from 'antd';
import styles from '../index.less';

function TotalInfo(props) {
  const { infolist } = props;
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
            <div style={{ width: `${100 / infolist.length}%`, float: 'left' }}>
              <Info key={obj.key} title={obj.title} value={obj.value} bordered={index !== infolist.length - 1} />
            </div>
          )}
        </Row>
      </Card>
    </div>
  );
}

export default TotalInfo;