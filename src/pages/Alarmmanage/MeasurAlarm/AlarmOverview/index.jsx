import React from 'react';
import { Card, Row, Col, Form, Input, Button, Table, Select, DatePicker, Message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

function index(props) {
  let pagetitle = props.route.name;
  const [buttonText, setButtonText] = useState('Click me,   please');

  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card>{buttonText}</Card>
      <Card>{setButtonText}</Card>
    </PageHeaderWrapper>
  );
}

export default index;
