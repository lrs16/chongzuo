import React from 'react';
import { Form, Input, Row, Col, } from 'antd';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

const sexMap = ['男', '女'];

function ToApplays(props) {
  const { selectedRows } = props;

  return (
    selectedRows && 
    (<Row gutter={24} style={{ marginTop: 24 }}>
      <Form {...formItemLayout}>
        <Col span={8}>
          <Form.Item label='进出申请编号'>
            <Input defaultValue={selectedRows.registNo} disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='姓名'>
            <Input defaultValue={selectedRows.name} disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='性别'>
            <Input defaultValue={sexMap[selectedRows.sex]} disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label='联系电话'>
            <Input defaultValue={selectedRows.phone} disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="进出事由">
            <Input defaultValue={selectedRows.content} disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="计划进入时间"><Input defaultValue={selectedRows.planInTime} disabled /></Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="计划离开时间">
            <Input defaultValue={selectedRows.planOutTime} disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="携带工具">
            <Input defaultValue={selectedRows.carryTool} disabled /></Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="申请人">
            <Input defaultValue={selectedRows.applyUser} disabled /></Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="申请时间">
            <Input defaultValue={selectedRows.applyTime} disabled />
          </Form.Item>
        </Col>
      </Form>
    </Row>)
  );
}
export default ToApplays;
