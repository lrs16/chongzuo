import React from 'react';
// import { Card, Row, Col, Form, Input, Button, Table, Select, DatePicker, Message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

function AlarmOverview(props) {
  const pagetitle = props.route.name;

  return <PageHeaderWrapper title={pagetitle}>需求管理</PageHeaderWrapper>;
}

export default AlarmOverview;
