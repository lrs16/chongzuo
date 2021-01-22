import React, { useState } from 'react';
import { Form, Input, Popover, Button } from 'antd';

const { TextArea } = Input;

const Backoff = props => {
  const { ChangeBackvalue, ChangeVisible } = props;
  const { getFieldDecorator, validateFields } = props.form;

  const handleChange = () => {
    validateFields((err, values) => {
      if (err) {
        return;
      }
      ChangeBackvalue(values);
      ChangeVisible(false);
    });
  };

  return (
    <Form>
      <Form.Item label="请填写回退原因">
        {getFieldDecorator('reviewVO', {
          rules: [{ required: 'true', message: '请输入回退原因' }],
        })(<TextArea autoSize={{ minRows: 3 }} placeholder="请输入" />)}
      </Form.Item>
      <Button type="primary" onClick={handleChange} style={{ marginLeft: 40 }}>
        确认回退
      </Button>
    </Form>
  );
};

export default Form.create({})(Backoff);
