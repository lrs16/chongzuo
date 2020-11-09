import React, { useState } from 'react';
import router from 'umi/router';
import { Card, Row, Col, Form, Input, Button, Table, Select, DatePicker, Message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

function index(props) {
  const { match, children, location } = props;
  let pagetitle = props.route.name;
  const [tabkey, setButtonText] = useState(' ,   please');
  function handleTabChange(key) {
    switch (key) {
      case 'index':
        router.push(`${match.url}`);

        break;
      case 'quotas':
        router.push(`${match.url}/quotas`);
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
  }

  const tabList = [
    {
      key: 'index',
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

export default index;
