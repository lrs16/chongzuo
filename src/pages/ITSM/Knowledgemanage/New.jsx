import React, { useState } from 'react';
import { Card, Row, Col, Form, Input, Select, Button, DatePicker, Table } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import BraftEditor from '@/components/BraftEditor';

function New(props) {
  const pagetitle = props.route.name;

  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card>
        <BraftEditor />
      </Card>
    </PageHeaderWrapper>
  );
}

export default New;