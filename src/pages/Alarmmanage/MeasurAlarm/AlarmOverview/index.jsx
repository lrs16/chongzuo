import React from 'react';
import router from 'umi/router';
// import { Card, Row, Col, Form, Input, Button, Table, Select, DatePicker, Message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

function AlarmOverview(props) {
  const { match, children, location } = props;
  const pagetitle = props.route.name;

  const handleTabChange = key => {
    switch (key) {
      case 'overview':
        console.log(key);
        router.push({
          pathname: `${match.url}/overview`,
          query: { key },
        });
        break;
      case 'quotas':
        console.log(key);
        router.push({
          pathname: `${match.url}/quotas`,
          query: { key },
        });
        break;
      case 'databaseterminal':
        router.push(`${match.url}/databaseterminal`);
        break;
      case 'connector':
        router.push(`${match.url}/connector`);
        break;
      case 'KAFKA':
        router.push(`${match.url}/KAFKA`);
        break;
      case 'sysrun':
        router.push(`${match.url}/sysrun`);
        break;
      default:
        break;
    }
  };

  const tabList = [
    {
      key: 'overview',
      tab: '告警概览',
    },
    {
      key: 'quotas',
      tab: '业务指标警告',
    },
    {
      key: 'databaseterminal',
      tab: '终端在线和入库告警',
    },
    {
      key: 'connector',
      tab: '接口数据告警',
    },
    {
      key: 'KAFKA',
      tab: 'KAFKA中间件告警',
    },
    {
      key: 'sysrun',
      tab: '主站系统运行',
    },
  ];

  return (
    <PageHeaderWrapper
      title={pagetitle}
      tabList={tabList}
      tabActiveKey={location.pathname.replace(`${match.path}/`, '')}
      onTabChange={handleTabChange}
    >
      {children}
    </PageHeaderWrapper>
  );
}

export default AlarmOverview;
