import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

function TobedealtList(props) {
  const pagetitle = props.route.name;
  console.log('props: ', props);
  return (
    <PageHeaderWrapper title={pagetitle}>
       <p>fff</p>
    </PageHeaderWrapper>
   
  )
}

export default TobedealtList;