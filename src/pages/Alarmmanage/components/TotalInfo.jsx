import React from 'react';
import { Card } from 'antd';
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
        <div>
          {infolist.map((obj, index) =>
            <div style={{ width: `${100 / infolist.length}%`, float: 'left' }}>
              <Info key={index.toString()} title={obj.name} value={obj.total} bordered={index !== infolist.length - 1} />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

export default TotalInfo;