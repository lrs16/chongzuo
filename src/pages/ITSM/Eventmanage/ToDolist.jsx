import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

function ToDolist(props) {
  const pagetitle = props.route.name;
  return <PageHeaderWrapper title={pagetitle}>待办</PageHeaderWrapper>;
}

export default ToDolist;
