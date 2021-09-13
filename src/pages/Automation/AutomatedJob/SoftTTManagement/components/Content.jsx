import React, {
  useState,
  forwardRef, useImperativeHandle
} from 'react';
import moment from 'moment';
import { Button, Form, Input, DatePicker } from 'antd';

const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
};

const formItemLayout1 = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 3 },
  },
};

const Content = forwardRef((props, ref) => {
  const {
    userinfo,
    form: { getFieldDecorator, getFieldsValue, resetFields }
  } = props;

  const [showexpand, setshowExpand] = useState(false);

  useImperativeHandle(ref, () => ({
    getVal: () => getFieldsValue(),
    resetVal: () => resetFields(),
    Forms: props.form.validateFieldsAndScroll,
  }), []);

  return (
    <div style={{ marginRight: 24 }}>
      <Form {...formItemLayout}>
        <Form.Item label="启停对象" {...formItemLayout1}>
          {getFieldDecorator('agentIds', {
            rules: [{ required: true, message: '请选择作业对象' }],
            initialValue: [""],
          })(<Button block onClick={() => {
            setshowExpand(!showexpand);
          }}>+添加对象</Button>)}
        </Form.Item>
        <Form.Item label="申请说明" >
          {getFieldDecorator('content1', {
            rules: [{ required: true, message: '请输入审核说明' }],
            initialValue: '',
          })(<TextArea autoSize={{ minRows: 5 }} placeholder="请输入" />)}
        </Form.Item>
        <Form.Item label="申请人">
          {getFieldDecorator('checkUser', {
            rules: [{ required: true }],
            initialValue: userinfo.userName ? userinfo.userName : '',
          })(<Input placeholder="请输入" disabled />)}
        </Form.Item>
        <Form.Item label="申请人单位">
          {getFieldDecorator('checkUnit', {
            rules: [{ required: true }],
            initialValue: userinfo.unitName ? userinfo.unitName : '',
          })(<Input placeholder="请输入" disabled />)}
        </Form.Item>
        <Form.Item label="申请时间">
          {getFieldDecorator('checkTime', {
            rules: [{ required: true }],
            initialValue: moment(new Date()),
          })(<DatePicker showTime placeholder="请选择时间" format="YYYY-MM-DD HH:mm:ss" disabled />)}
        </Form.Item>
      </Form>
    </div>
  );
});

Content.defaultProps = {
  userinfo: {}
}

export default Form.create()(Content);