import React, { useState } from 'react';
import { Card, Statistic, Row, Col, Icon } from 'antd';
import ChartDrawer from '../ChartDrawer';

function StatisticsCard(props) {
  const { title, value, suffix, des, desval, type, staticName, time1, time2 } = props;
  const [visible, setVisible] = useState(false); // 抽屉是否显示
  const [drawerval, onGetDrawerVal] = useState({});
  const hanlestaticard = val => {
    setVisible(!visible);
    onGetDrawerVal(val);
    if (val.staticName === undefined) {
      setVisible(false);
      onGetDrawerVal({});
    }
  };
  return (
    <>
      <Card style={{ marginLeft: '-1px' }}>
        <Row type="flex" justify="space-between" align="bottom">
          <Col span={24}>{title}</Col>
          <Col
            span={24}
            style={{ cursor: staticName === undefined || staticName === '' ? '' : 'pointer' }}
            onClick={() => {
              setTimeout(() => {
                hanlestaticard({ value, staticName, time1, time2, drawtitle: staticName });
              }, 100);
            }}
            onDoubleClick={() => {
              hanlestaticard({ value, staticName, time1, time2, drawtitle: staticName });
            }}
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
      {/* 抽屉 */}
      <ChartDrawer
        visible={visible}
        ChangeVisible={newvalue => setVisible(newvalue)}
        drawerdata={drawerval}
        destroyOnClose
      />
    </>
  );
}

export default StatisticsCard;
