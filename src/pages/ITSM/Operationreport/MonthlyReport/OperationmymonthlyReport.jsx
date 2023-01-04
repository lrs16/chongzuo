import  React, { useEffect, useState } from 'react';
import {
  Form
} from 'antd';
import { connect } from 'dva';

import { PageHeaderWrapper } from '@ant-design/pro-layout';

function OperationmymonthlyReport(props) {
  const pagetitle = props.route.name;

  return (
    <PageHeaderWrapper title={pagetitle}>
      <p>fff</p>
    </PageHeaderWrapper>
  )
}

export default OperationmymonthlyReport;