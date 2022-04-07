import React from 'react';
import { Radio, Form, Input, Row, Col, } from 'antd';
import FormTextArea from './FormTextArea'

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
const forminladeLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 22 },
  },
};

function TaskCheckdes(props) {
  const { info } = props;
  let value;
  if (info) {
    value = info.result;
  }
  return (
    <Row gutter={24}>
      <Form {...formItemLayout}>
        <Col span={8}>
          <Form.Item label='审核结果'>
            <Radio.Group value={value} disabled>
              <Radio value='通过'>通过</Radio>
              <Radio value='不通过'>不通过</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="审核时间" >
            <Input defaultValue={info.checkTime} disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="审核状态">
            <Input defaultValue={info.status} disabled />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="审核说明" {...forminladeLayout}>
            <FormTextArea
              autoSize={1}
              indexText={info.content}
              isEdit={false}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="审核人">
            <Input defaultValue={info.checkUser} disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="审核单位">
            <Input defaultValue={info.checkUnit} disabled />
          </Form.Item>
        </Col>
      </Form>
    </Row>
  );
}
export default TaskCheckdes;
