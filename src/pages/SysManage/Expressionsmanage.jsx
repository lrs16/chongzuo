import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

function Expressions(props) {
  const pagetitle = props.route.name;
  return <PageHeaderWrapper title={pagetitle}>111</PageHeaderWrapper>;
}

export default Expressions;
