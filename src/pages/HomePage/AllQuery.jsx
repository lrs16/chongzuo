import React, { useState } from 'react';
import router from 'umi/router';
import { Menu } from 'antd';

const { SubMenu } = Menu;

function AllQuery(props) {
  const { children } = props;
  const [current, setCurrent] = useState([]);
  const handleClick = (e) => {
    setCurrent(e.key);
    switch (e.key) {
      case 'event':
        router.push({
          pathname: `/ITSM/eventmanage/query`,
          query: { pathpush: true },
          state: { cache: false }
        });
        break;
      case 'fault':
        router.push({
          pathname: `/ITSM/faultmanage/querylist`,
          query: { pathpush: true },
          state: { cache: false }
        });
        break;
      case 'problem':
        router.push({
          pathname: `/ITSM/problemmanage/problemquery`,
          query: { pathpush: true },
          state: { cache: false }
        });
        break;
      case 'demand':
        router.push({
          pathname: `/ITSM/demandmanage/query`,
          query: { pathpush: true },
          state: { cache: false }
        });
        break;
      case 'release':
        router.push({
          pathname: `/ITSM/releasemanage/plan/query`,
          query: { pathpush: true },
          state: { cache: false }
        });
        break;
      default:
        break;
    }
  }
  return (
    <div>
      <div style={{ margin: '-48px -24px 16px', padding: '16px', background: '#fff' }}>
        <Menu onClick={handleClick} selectedKeys={current} mode="horizontal">
          <Menu.Item key="event">事件统计分析</Menu.Item>
          <Menu.Item key="fault">故障统计分析</Menu.Item>
          <Menu.Item key="problem">问题统计分析</Menu.Item>
          <Menu.Item key="demand">需求统计分析</Menu.Item>
          <Menu.Item key="release">发布统计分析</Menu.Item>
          <Menu.Item key="achievements">服务绩效统计分析</Menu.Item>
        </Menu>
        {children}
      </div>
    </div>
  );
}

export default AllQuery;