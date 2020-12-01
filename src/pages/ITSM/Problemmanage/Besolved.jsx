import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

function Besolved(props) {
  const pagetitle = props.route.name;

  return <PageHeaderWrapper title={pagetitle}>123</PageHeaderWrapper>
}

export default Besolved;