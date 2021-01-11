import React, {  useRef, useImperativeHandle } from 'react';
import { Row, Col, Form, Input, Select, DatePicker } from 'antd';
import moment from 'moment';


const { Option } = Select;
const { TextArea } = Input;


const Problemconfirmedit = React.forwardRef((props, ref) => {
  const { formItemLayout, forminladeLayout } = props;
  const { getFieldDecorator } = props.form;
  const attRef = useRef();
  useImperativeHandle(
    ref,
    () => ({
      attRef,
    }),
    [],
  );
  const {
    confirm,
    useInfo,
  } = props;

  const required = true;

  return (
    <Row gutter={16}>
      <Form {...formItemLayout}>
    <Col span={8}>
        <Form.Item label="确认人">
          {getFieldDecorator('confirmUser', {
            rules: [
              {
                required,
                message: '请输入确认人',
              },
            ],
            initialValue: confirm ? confirm.confirmUser : '',
          })(<Input />)}
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="确认单位">
          {getFieldDecorator('confirmUnit', {
            initialValue: confirm ? confirm.confirmUnit : '',
          })(<Input />)}
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="确认部门">
          {getFieldDecorator('confirmDept', {
            initialValue: confirm ? confirm.confirmDept : '',
          })(<Input />)}
        </Form.Item>
      </Col>
 
      <Col span={8}>
        <Form.Item label="确认结果">
          {getFieldDecorator('confirmResult', {
            rules: [
              {
                required,
                message: '请输入确认结果',
              },
            ],
            initialValue: confirm ? confirm.confirmResult : '',
          })(
            <Select>
              <Option key={24} value="根本解决">根本解决</Option>
              <Option key={25} value="变通方法">变通方法</Option>
              <Option key={26} value="无法解决">无法解决</Option>
            </Select>,
          )}
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="确认时间">
          {getFieldDecorator('confirmTime', {
            rules: [
              {
                required,
                message: '请输入确认时间',
              },
            ],
            initialValue: confirm ? moment(confirm.confirmTime) : moment(Date.now()),
          })(<DatePicker showTime />)}
        </Form.Item>
      </Col>

      <Col span={22}>
        <Form.Item label="确认意见" {...forminladeLayout}>
          {getFieldDecorator('confirmContent', {
             rules: [
              {
                required,
                message: '请输入确认意见',
              },
            ],
            initialValue: confirm ? confirm.confirmContent : '',
          })(<TextArea />)}
        </Form.Item>
      </Col>

      <Col span={8}>
        <Form.Item label="处理人">
          {getFieldDecorator('handler', {
            // rules: [
            //   {
            //     required,
            //     message: '请输入处理人',
            //   },
            // ],
            initialValue: useInfo?useInfo.loginCode:'',
          })(<Input disabled />)}
        </Form.Item>
      </Col>

      <Col span={8}>
        <Form.Item label="处理单位">
          {getFieldDecorator('handleUnit', {
            initialValue: '单位',
          })(<Input disabled />)}
        </Form.Item>
      </Col>

      <Col span={8}>
        <Form.Item label="处理部门">
          {getFieldDecorator('handleDept', {
            initialValue: useInfo?useInfo.deptNameExt:'',
          })(<Input disabled />)}
        </Form.Item>
      </Col>
    
    </Form>
    </Row>
    
  );
});

export default Form.create({})(Problemconfirmedit);
