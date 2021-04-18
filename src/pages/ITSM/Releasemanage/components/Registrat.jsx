import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { Row, Col, Form, Input } from 'antd';
import EditeTable from './EditeTable';
import DocumentAtt from './DocumentAtt';

function Registrat(props, ref) {
  const { formItemLayout, forminladeLayout, userinfo, register } = props;
  const { getFieldDecorator } = props.form;
  const required = true;

  const formRef = useRef();
  useImperativeHandle(ref, () => ({
    Forms: props.form,
  }))

  return (
    <Row gutter={12} style={{ paddingTop: 24 }}>
      <Form ref={formRef} {...formItemLayout}>
        <Col span={8}>
          <Form.Item label="发布编号">
            {getFieldDecorator('register_id', {
              rules: [{ required, message: `发布编号不能为空` }],
              initialValue: '',
            })(<Input />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="出厂测试开始时间">
            {getFieldDecorator('form2', {
              rules: [{ required, message: `请选择出厂测试开始时间` }],
              initialValue: '',
            })(<Input />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="出厂测试结束时间">
            {getFieldDecorator('form3', {
              rules: [{ required, message: `请选择出厂测试结束时间` }],
              initialValue: '',
            })(<Input />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="出厂测试地点">
            {getFieldDecorator('form4', {
              rules: [{ required, message: `请输入出厂测试地点` }],
              initialValue: '',
            })(<Input />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="参与测试单位">
            {getFieldDecorator('form5', {
              rules: [{ required, message: `请选择参与测试单位` }],
              initialValue: '',
            })(<Input />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="测试人员">
            {getFieldDecorator('form6', {
              rules: [{ required, message: `请输入测试人员` }],
              initialValue: '',
            })(<Input />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="发布类型">
            {getFieldDecorator('form7', {
              rules: [{ required, message: `请选择发布类型` }],
              initialValue: '',
            })(<Input />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="责任单位">
            {getFieldDecorator('form8', {
              rules: [{ required, message: `请选择责任单位` }],
              initialValue: '',
            })(<Input />)}
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="受影响业务范围" {...forminladeLayout}>
            {getFieldDecorator('form9', {
              rules: [{ required, message: `请填写受影响业务范围` }],
              initialValue: '',
            })(<Input />)}
          </Form.Item>
        </Col>
        <Col span={24} style={{ marginBottom: 24 }}>
          <EditeTable title='测试环境' />
        </Col>
        <Col span={24}>
          <EditeTable title='发布清单' />
        </Col>
        <Col span={24}>
          <Form.Item label="出厂测试结论" {...forminladeLayout}>
            {getFieldDecorator('form10', {
              rules: [{ required, message: `请填写受影响业务范围` }],
              initialValue: '',
            })(<Input />)}
          </Form.Item>
        </Col>
        <Col span={24}>
          <DocumentAtt />
        </Col>
      </Form>
    </Row>
  );
}

const WrappedForm = Form.create({ name: 'form' })(forwardRef(Registrat))

export default WrappedForm;