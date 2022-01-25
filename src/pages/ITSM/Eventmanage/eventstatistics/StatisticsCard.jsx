import React, { useEffect, useRef, useCallback } from 'react';
import { Card, Statistic, Row, Col, Icon } from 'antd';

function StatisticsCard(props) {
  const { title, value, suffix, des, desval, type, onGetVal } = props;

  function useDebounce(fn, delay) {
    const { current } = useRef({ fn, timer: null });
    useEffect(function () {
      current.fn = fn;
    }, [fn]);
  
    return useCallback(function f(...args) {
      if (current.timer) {
        clearTimeout(current.timer);
      }
      current.timer = setTimeout(() => {
        current.fn.call(this, ...args);
      }, delay);
    })
  }
  
  const handleValue = useDebounce(v => {
    onGetVal(v)
  }, 300);

  return (
    <Card style={{ marginLeft: '-1px' }}>
      <Row type="flex" justify="space-between" align="bottom">
        <Col span={24}>{title}</Col>
        <Col span={24}
          onClick={() => {
              if (onGetVal) {
                handleValue()
              }
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