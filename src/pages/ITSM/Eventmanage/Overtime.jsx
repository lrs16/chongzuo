import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

function Overtime(props) {
  const pagetitle = props.route.name;
  return <PageHeaderWrapper title={pagetitle}>查询</PageHeaderWrapper>;
}

export default Overtime;
