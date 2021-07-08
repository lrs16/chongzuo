import React, { useState } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Form, Input, Select, Button, DatePicker, Table } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import BraftEditor from '@/components/BraftEditor';

function New(props) {
  const pagetitle = props.route.name;

  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card>
        <Form>
          <BraftEditor />
        </Form>
      </Card>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ releasetodo, loading }) => ({
    list: releasetodo.list,
    loading: loading.models.releasetodo,
  }))(New),
);