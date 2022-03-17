import React from 'react';
import { Form, Input, Row, Col } from 'antd';

const { TextArea } = Input;

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

function SuperviseModelDetails(props) {
  const { info, userinfo } = props;
  return (
    <Row gutter={24}>
      <Form {...formItemLayout}>
        <Col span={24}>
          <Form.Item label="督办内容" {...forminladeLayout}>
            <TextArea autoSize={{ minRows: 3 }} defaultValue={info.content} disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="督办人">
            <Input defaultValue={info.superviseUser} disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="督办人单位">
            <Input defaultValue={userinfo.unitName} disabled />
          </Form.Item>
        </Col>
      </Form>
    </Row>
  );
}
export default SuperviseModelDetails;
