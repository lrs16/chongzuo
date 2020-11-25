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
        router.push({
          pathname: `${match.url}/overview`,
        });
        break;
      case 'quotas':
        router.push({
          pathname: `${match.url}/quotas`,
        });
        break;
      case 'databaseterminal':
        router.push({
          pathname: `${match.url}/databaseterminal`,
        });
        break;
      case 'connector':
        router.push({
          pathname: `${match.url}/connector`,
        });
        break;
      case 'KAFKA':
        router.push({
          pathname: `${match.url}/KAFKA`,
        });
        break;
      case 'KAFKA0':
        router.push({
          pathname: `${match.url}/KAFKA0`,
        });
        break;
      case 'sysrun':
        router.push({
          pathname: `${match.url}/sysrun`,
        });
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
      tab: '业务指标告警',
    },
    {
      key: 'databaseterminal',
      tab: '终端在线和入库告警',
    },
    {
      key: 'connector',
      tab: '接口数据核查告警',
    },
    {
      key: 'KAFKA',
      tab: 'KAFKA消费告警',
    },
    {
      key: 'KAFKA0',
      tab: 'KAFKA消费（凌晨）告警',
    },
    {
      key: 'sysrun',
      tab: '主站系统运行告警',
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
