import React, { useEffect, useState } from 'react';
import router from 'umi/router';
import { Menu } from 'antd';
import styles from './index.less';

function ComprehensiveQuery(props) {
  const { children, location } = props;
  const [current, setCurrent] = useState([]);
  const handleClick = (e) => {
    setCurrent(e.key);
    router.push({
      pathname: `/ITSM/comprehensivequery/query/${e.key}`,
      state: { cache: false }
    })
  };
  useEffect(() => {
    //  handleClick({ key: location.state?.cacheinfo?.key || 'event' });
    setCurrent(location.state?.cacheinfo?.key || 'event');
    router.push({
      pathname: `/ITSM/comprehensivequery/query/${location.state?.cacheinfo?.key || 'event'}`,
      state: location.state && location.state.cacheinfo ? { cacheinfo: location.state.cacheinfo } : { cache: false }
    })
  }, []);

  return (
    <>
      <div style={{ margin: '-48px -24px 24px -24px', padding: '24px 16px 0', background: '#fff' }}>
        <Menu onClick={handleClick} selectedKeys={current} mode="horizontal">
          <Menu.Item key="event">事件查询</Menu.Item>
          <Menu.Item key="fault">故障查询</Menu.Item>
          <Menu.Item key="problem">问题查询</Menu.Item>
          <Menu.Item key="demand">需求查询</Menu.Item>
          <Menu.Item key="release">计划发布查询</Menu.Item>
          <Menu.Item key="operationplan">作业计划查询</Menu.Item>
        </Menu>
      </div>
      <div className={styles.homequery}>
        {children}
      </div>
    </>
  );
}

export default ComprehensiveQuery;