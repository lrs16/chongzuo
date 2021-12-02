import React, { useState } from 'react';
import {
  Form,
  Input,
  Drawer,
} from 'antd';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
  colon: false,
};


const withClick = (element, handleClick = () => { }) => {
  return <element.type {...element.props} onClick={handleClick} />;
};
function ToapplayDetail(props) {
  const [visible, setVisible] = useState(false);
  const {
    children,
    title,
    record,
    form: {
      getFieldDecorator,
      resetFields
    },
  } = props;

  const {
    applyTime,
    applyUser,
    carryTool,
    content,
    name,
    phone,
    planInTime,
    planOutTime,
    registNo,
    sex,
  } = record;

  const handleopenClick = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
    resetFields();
  };
  return (
    <>
      {withClick(children, handleopenClick)}
      <Drawer
        title={title}
        visible={visible}
        width={720}
        centered="true"
        maskClosable="true"
        onClose={handleCancel}
      >
        <Form {...formItemLayout}>
          <Form.Item label="进出申请编号">
            {getFieldDecorator('registNo', {
              initialValue: registNo,
            })(<Input disabled />)}
          </Form.Item>

          <Form.Item label="姓名">
            {getFieldDecorator('name', {
              initialValue: name,
            })(<Input disabled />)}
          </Form.Item>

          <Form.Item label="性别">
            {getFieldDecorator('sex', {
              initialValue: sex === '0' ? '男' : '女',
            })(<Input disabled />)}
          </Form.Item>

          <Form.Item label="联系电话">
            {getFieldDecorator('phone', {
              initialValue: phone,
            })(<Input disabled />)}
          </Form.Item>

          <Form.Item label="进出事由">
            {getFieldDecorator('content', {
              initialValue: content,
            })(<Input disabled />)}
          </Form.Item>

          <Form.Item label="计划进入时间">
            {getFieldDecorator('planInTime', {
              initialValue: planInTime
            })(<Input disabled />)}
          </Form.Item>

          <Form.Item label="计划离开时间">
            {getFieldDecorator('planOutTime', {
              initialValue: planOutTime
            })(<Input disabled />)}
          </Form.Item>

          <Form.Item label="携带工具">
            {getFieldDecorator('carryTool', {
              initialValue: carryTool,
            })(<Input disabled />)}
          </Form.Item>

          <Form.Item label="申请人">
            {getFieldDecorator('applyUser', {
              initialValue: applyUser,
            })(<Input disabled />)}
          </Form.Item>

          <Form.Item label="申请时间">
            {getFieldDecorator('applyTime', {
              initialValue: applyTime,
            })(<Input disabled />)}
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
}

export default Form.create()(ToapplayDetail);
