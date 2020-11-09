import React, { useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const SysSetting = props => {
  let pagetitle = props.route.name;
  const [buttonText, setButtonText] = useState('Click me,   please');
  return <PageHeaderWrapper title={pagetitle}>告警设定</PageHeaderWrapper>;
};

export default SysSetting;
