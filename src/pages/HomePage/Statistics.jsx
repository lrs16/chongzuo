import React, { useEffect, useState } from 'react';
import router from 'umi/router';
import { Menu } from 'antd';

function Statistics(props) {
  const { children } = props;
  const [current, setCurrent] = useState([]);
  const handleClick = (e) => {
    setCurrent(e.key);
    router.push({ pathname: `/ITSM/home/${e.key}analysis`, })
  };
  useEffect(() => {
    handleClick({ key: 'event' })
  }, [])
  return (
    <>
      <div style={{ margin: '-48px -24px 16px -24px', padding: '16px 16px 0 16px', background: '#fff' }}>
        <Menu onClick={handleClick} selectedKeys={current} mode="horizontal">
          <Menu.Item key="event">事件统计分析</Menu.Item>
          <Menu.Item key="fault">故障统计分析</Menu.Item>
          <Menu.Item key="problem">问题统计分析</Menu.Item>
          <Menu.Item key="demand">需求统计分析</Menu.Item>
          <Menu.Item key="release">发布统计分析</Menu.Item>
          <Menu.Item key="achievements">服务绩效统计分析</Menu.Item>
        </Menu>
      </div>
      <div style={{ margin: '16px -8px 0 -8px' }}>
        {children}
      </div>
    </>
  );
}

export default Statistics;