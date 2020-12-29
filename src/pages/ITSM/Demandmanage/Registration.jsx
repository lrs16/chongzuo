import React, { useContext, useState, useRef } from 'react';
import { Card, Row, Col, Form, Input, Button, Select, Upload, DatePicker, Cascader } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { DownloadOutlined } from '@ant-design/icons';
import Registrat from './components/Registrat';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};
const forminladeLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 22 },
  },
};

function Registration(props) {
  const pagetitle = props.route.name;
  const RegistratRef = useRef();

  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card
        extra={
          <>
            <Button type="primary" style={{ marginRight: 8 }}>
              保 存
            </Button>
            <Button type="primary" style={{ marginRight: 8 }}>
              流 转
            </Button>
            <Button type="default">关 闭</Button>
          </>
        }
      >
        <Registrat />
      </Card>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(Registration);
