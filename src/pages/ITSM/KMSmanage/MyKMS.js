import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

function MyKMS(props) {
  const pagetitle = props.route.name;
  return (
    <PageHeaderWrapper title={pagetitle}>
      1111
    </PageHeaderWrapper>
  );
}

export default MyKMS;