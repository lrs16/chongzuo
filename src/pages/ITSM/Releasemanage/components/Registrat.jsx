import React from 'react';
import { Row, Col, Form, Input } from 'antd';

function Registrat(props) {
  const { userinfo, register } = props;
  const { getFieldDecorator } = props.form;
  return (
    <Row gutter={24} style={{ paddingTop: 24 }}>
      <Form>
        <Col span={8} style={{ display: 'none' }}>
          <Form.Item label="表单id">
            {getFieldDecorator('register_id', {
              initialValue: register.id,
            })(<Input disabled />)}
          </Form.Item>
        </Col>
      </Form>
    </Row>
  );
}
Registrat.defaultProps = {
  register: {
    id: ''
  }
}

export default Registrat;