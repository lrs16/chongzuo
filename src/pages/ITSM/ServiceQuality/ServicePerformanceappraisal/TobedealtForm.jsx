import React, { useEffect, useState } from 'react';
import {
  Table,
  Form,
  Input,
  Button,
  Popconfirm,
  message,
  DatePicker
} from 'antd';
import moment from 'moment';
import { PageHeaderWrapper } from '@ant-design/pro-layout';


function TobedealtForm(props) {
  const pagetitle = props.route.name;

  return (
    <PageHeaderWrapper title={pagetitle}>
      <p>dd</p>
    </PageHeaderWrapper>
  )
}

export default Form.create({})(TobedealtForm)
