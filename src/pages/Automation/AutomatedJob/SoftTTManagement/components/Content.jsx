import React, { forwardRef, useImperativeHandle } from 'react';
import { Form, Input, } from 'antd';

const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
};

const Content = forwardRef((props, ref) => {
  const {
    formrecord,
    form: { getFieldDecorator, getFieldsValue, resetFields }
  } = props;


  useImperativeHandle(ref, () => ({
    getVal: () => getFieldsValue(),
    resetVal: () => resetFields(),
    Forms: props.form.validateFieldsAndScroll,
  }), []);

  // const columns = [
  //   {
  //     title: '作业名称',
  //     dataIndex: 'taskName',
  //     key: 'taskName',
  //     width: 200,
  //   },
  //   {
  //     title: '作业状态',
  //     dataIndex: 'taskStatus',
  //     key: 'taskStatus',
  //     width: 150,
  //   }
  // ];

  return (
    <div>
      <Form {...formItemLayout} >
        <Form.Item label="申请说明">
          {getFieldDecorator('content', {
            initialValue: formrecord.content,
          })(<TextArea rows="6" />)}
        </Form.Item>
        <Form.Item label="申请人">
          {getFieldDecorator('proposer', {
            initialValue: formrecord.proposer,
          })(<Input disabled />)}
        </Form.Item>
        <Form.Item label="申请单位">
          {getFieldDecorator('proposingUnit', {
            initialValue: formrecord.proposingUnit,
          })(<Input disabled />)}
        </Form.Item>
      </Form>
    </div>
  );
});

Content.defaultProps = {
  formrecord: {
    content: '',
    proposer: '',
    proposingUnit: ''
  }
}

export default Form.create()(Content);