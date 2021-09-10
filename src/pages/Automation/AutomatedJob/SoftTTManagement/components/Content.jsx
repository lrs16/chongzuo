import React, { 
  // useState, useEffect, 
  forwardRef, useImperativeHandle 
} from 'react';
// import moment from 'moment';
import { Row, Col, Form, Input } from 'antd';

const { TextArea } = Input;

const formallItemLayout = {
  labelCol: {
    xs: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 18 },
  },
};
const formItemLayout = {
  labelCol: {
    xs: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 22 },
  },
};

const Content = forwardRef((props, ref) => {
  const {
    userinfo,
    form: { getFieldDecorator, getFieldsValue, resetFields }
  } = props;

  useImperativeHandle(ref, () => ({
    getVal: () => getFieldsValue(),
    resetVal: () => resetFields(),
    Forms: props.form.validateFieldsAndScroll,
  }), []);

  return (
    <div style={{ marginRight: 24 }}>
      <Row gutter={24}>
        <Form {...formallItemLayout}>
          <Col span={24}>
            <Form.Item label="申请说明" {...formItemLayout}>
              {getFieldDecorator('content1', {
                rules: [{ required: true, message: '请输入审核说明' }],
                initialValue: '',
              })(<TextArea autoSize={{ minRows: 5 }} placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="申请人">
              {getFieldDecorator('checkUser', {
                rules: [{ required: true }],
                initialValue: userinfo.userName ? userinfo.userName : '',
              })(<Input placeholder="请输入" disabled />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="申请人单位">
              {getFieldDecorator('checkUnit', {
                rules: [{ required: true }],
                initialValue: userinfo.unitName ? userinfo.unitName : '',
              })(<Input placeholder="请输入" disabled />)}
            </Form.Item>
          </Col>
        </Form>
      </Row>
    </div>
  );
});

Content.defaultProps = {
  userinfo: {}
}

export default Form.create()(Content);