import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import moment from 'moment';
import { Row, Col, Form, Input, Radio, DatePicker, Tag } from 'antd';

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

const Examine = forwardRef((props, ref) => {
  const {
    userinfo, check,
    form: { getFieldDecorator, getFieldsValue, resetFields }
  } = props;
  const [adopt, setAdopt] = useState('通过');
  const required = true;

  useImperativeHandle(ref, () => ({
    getVal: () => getFieldsValue(),
    resetVal: () => resetFields(),
    Forms: props.form.validateFieldsAndScroll,
  }), []);

  const handleAdopt = e => {
    setAdopt(e.target.value);
  }
  return (
    <div style={{ marginRight: 24 }}>
      <Row gutter={24}>
        <Form {...formallItemLayout}>
          {/* <Col span={8} style={{ display: 'none' }}>
            <Form.Item label="审核表单id">
              {getFieldDecorator('check_id', {
                initialValue: check.id,
              })(<Input placeholder="请输入" disabled />)}
            </Form.Item>
          </Col> */}
          <Col span={8} >
            <Form.Item label="审核结果">
              {getFieldDecorator('result', {
                rules: [{ required: true, message: '请选择审核结果' }],
                initialValue: check.checkResult,
              })(
                <Radio.Group onChange={handleAdopt}>
                  <Radio value="通过">通过</Radio>
                  <Radio value="不通过">不通过</Radio>
                </Radio.Group>,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="审核时间">
              {getFieldDecorator('checkTime', {
                rules: [{ required: true }],
                initialValue: moment(check.checkTime),
              })(<DatePicker showTime placeholder="请选择时间" format="YYYY-MM-DD HH:mm:ss" />)}
            </Form.Item>
          </Col>
          <Col span={8} >
            <Form.Item label="审核状态">
              <Tag color="blue">{check.status}</Tag>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="审核说明" {...formItemLayout}>
              {getFieldDecorator('content', {
                initialValue: check.content,
              })(<TextArea autoSize={{ minRows: 3 }} placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="审核人">
              {getFieldDecorator('checkUser', {
                rules: [{ required: true }],
                initialValue: userinfo.userName,
              })(<Input placeholder="请输入" disabled />)}
            </Form.Item>
          </Col>
          <Col span={8} style={{ display: 'none' }}>
            <Form.Item label="审核人ID">
              {getFieldDecorator('checkUserId', {
                rules: [{ required: true }],
                initialValue: userinfo.userId,
              })(<Input placeholder="请输入" disabled />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="审核人单位">
              {getFieldDecorator('checkUnit', {
                rules: [{ required: true }],
                initialValue: userinfo.unitName,
              })(<Input placeholder="请输入" disabled />)}
            </Form.Item>
          </Col>
          <Col span={8} style={{ display: 'none' }}>
            <Form.Item label="审核人单位ID">
              {getFieldDecorator('checkUnitId', {
                rules: [{ required: true }],
                initialValue: userinfo.unitId,
              })(<Input placeholder="请输入" disabled />)}
            </Form.Item>
          </Col>
        </Form>
      </Row>
    </div>
  );
});

Examine.defaultProps = {
  check: {
    checkResult: '通过',
    checkTime: undefined,
    status: '待审核',
    content: '',
  },
  userinfo: {}
}

export default Form.create()(Examine);