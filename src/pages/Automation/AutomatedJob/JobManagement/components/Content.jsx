import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Select, Form, Input, Radio, DatePicker, Button } from 'antd';
import moment from 'moment';
import SystemScriptList from './SystemScriptList';

const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
// const { RangePicker } = DatePicker;
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

const formItemLayout444 = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
};

const Content = forwardRef((props, ref) => {
  const {
    formrecord,
    form: { getFieldDecorator, getFieldsValue, resetFields }
  } = props;
  const required = true;
  const [selectadopt, setselectAdopt] = useState('手动');
  const [showexpand, setshowExpand] = useState(false);

  useImperativeHandle(ref, () => ({
    getVal: () => getFieldsValue(),
    resetVal: () => resetFields(),
    Forms: props.form.validateFieldsAndScroll,
  }), []);

  const handleAdopt = e => {
    setselectAdopt(e.target.value);
  };

  return (
    <div>
      <Form {...formItemLayout} >
        <Form.Item label="作业名称">
          {getFieldDecorator('taskName', {
            rules: [{ required, message: '请输入作业名称' }],
            initialValue: formrecord.taskName,
          })(<Input />)}
        </Form.Item>
        <Form.Item label="作业对象" {...formItemLayout1}>
          {getFieldDecorator('taskObjectNum', {
            rules: [{ required, message: '请选择作业对象' }],
            initialValue: formrecord.taskObjectNum,
          })(<Button block>+作业对象</Button>)}
        </Form.Item>
        <Form.Item label="作业脚本"  {...formItemLayout1}>
          {getFieldDecorator('taskScriptNum', {
            rules: [{ required, message: '请选择作业脚本' }],
            initialValue: formrecord.taskScriptNum,
          })(<Button block onClick={() => {
            setshowExpand(!showexpand);
          }}>+作业脚本</Button>)}
        </Form.Item>
        {showexpand && (<Form.Item span={24} {...formItemLayout444} >
          <SystemScriptList />
        </Form.Item>)}
        <Form.Item label="作业备注">
          {getFieldDecorator('taskRemarks', {
            initialValue: formrecord.taskRemarks,
          })(<TextArea rows="6" />)}
        </Form.Item>
        <Form.Item label="执行方式">
          {getFieldDecorator('taskModes', {
            rules: [{ required }],
            initialValue: formrecord.taskModes || '手动',
          })(<RadioGroup onChange={handleAdopt}>
            <Radio value="手动">手动</Radio>
            <Radio value="定时">定时</Radio>
          </RadioGroup>)}
        </Form.Item>
        {
          selectadopt === '定时' && (<>
            <Form.Item label="执行开始时间">
              {getFieldDecorator('startTime', {
                rules: [{ required }],
                initialValue: moment(new Date()),
              })(<DatePicker allowClear style={{ width: '100%' }} />)}
            </Form.Item>
            <Form.Item label="执行结束时间">
              {getFieldDecorator('endTime', {
                rules: [{ required }],
                // initialValue: '',
              })(<DatePicker allowClear style={{ width: '100%' }} />)}
            </Form.Item>
            <Form.Item label="执行周期">
              {getFieldDecorator('exeWeek', {
                rules: [{ required }],
                initialValue: '',
              })(<Select
                style={{
                  width: '20%',
                }}
              >
                <Option value="day">每天</Option>
                <Option value="week">每周</Option>
                <Option value="month">每月</Option>
              </Select>)}
            </Form.Item>
          </>)
        }
      </Form>
    </div>
  );
});

Content.defaultProps = {
  formrecord: {
    taskName: '',
    taskObjectNum: '',
    taskScriptNum: '',
    taskRemarks: '',
    taskModes: '',
  }
}

export default Form.create()(Content);