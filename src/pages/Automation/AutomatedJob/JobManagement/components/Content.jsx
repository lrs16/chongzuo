import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Form, Input, Radio, Button } from 'antd';
// import moment from 'moment'; DatePicker, 
import SystemScriptList from './SystemScriptList';
import TaskObjectList from './TaskObjectList';
import DictLower from '@/components/SysDict/DictLower';

const { TextArea } = Input;
// const { Option } = Select;  Select, 
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
    form: { getFieldDecorator, getFieldsValue, resetFields, setFieldsValue }
  } = props;

  const required = true;
  const [selectadopt, setselectAdopt] = useState('');
  const [selectdata, setSelectData] = useState({ arr: [], ischange: false }); // 下拉值
  const [showexpand, setshowExpand] = useState(false);
  const [showexpand1, setshowExpand1] = useState(false);

  useImperativeHandle(ref, () => ({
    getVal: () => getFieldsValue(),
    resetVal: () => resetFields(),
    Forms: props.form.validateFieldsAndScroll,
  }), []);

  useEffect(() => {
    setshowExpand(true);
    setshowExpand1(true);
  }, [formrecord && formrecord !== {}])

  const handleAdopt = e => {
    setselectAdopt(e.target.value);
  };

  useEffect(() => {
    if (formrecord !== undefined || formrecord !== {}) {
      setselectAdopt(formrecord.taskModes);
    }
  }, [formrecord]);

  // 数据字典取下拉值
  const getTypebyId = key => {
    if (selectdata.ischange) {
      return selectdata.arr[0].children.filter(item => item.key === key)[0].children;
    }
    return [];
  };
  const taskmodesmap = getTypebyId('200000000000001003'); // 类型

  return (
    <div>
      <Form {...formItemLayout} >
        <DictLower
          typeid="200000000000001001"
          ChangeSelectdata={newvalue => setSelectData(newvalue)}
          style={{ display: 'none' }}
        />
        <Form.Item label="作业名称">
          {getFieldDecorator('taskName', {
            rules: [{ required, message: '请输入作业名称' }],
            initialValue: formrecord.taskName,
          })(<Input />)}
        </Form.Item>
        <Form.Item label="作业对象" {...formItemLayout1}>
          {getFieldDecorator('agentIds', {
            rules: [{ required, message: '请选择作业对象' }],
            initialValue: [""] || formrecord.agentIds,
          })(<Button block onClick={() => {
            setshowExpand1(!showexpand1);
          }}>+作业对象</Button>)}
        </Form.Item>
        {showexpand1 && (
          <Form.Item span={24} {...formItemLayout444} >
            <TaskObjectList GetData={(v) => { setFieldsValue({ agentIds: v });}} />
          </Form.Item>
        )}
        <Form.Item label="作业脚本"  {...formItemLayout1}>
          {getFieldDecorator('scriptIds', {
            rules: [{ required, message: '请选择作业脚本' }],
            initialValue: [""] || formrecord.scriptIds,
          })(<Button block onClick={() => {
            setshowExpand(!showexpand);
          }}>+作业脚本</Button>)}
        </Form.Item>
        {showexpand && (<Form.Item span={24} {...formItemLayout444} >
          <SystemScriptList GetData={(v) => { setFieldsValue({ scriptIds: v }); }} />
        </Form.Item>)}
        <Form.Item label="作业备注">
          {getFieldDecorator('taskRemarks', {
            initialValue: formrecord.taskRemarks,
          })(<TextArea rows="6" />)}
        </Form.Item>
        <Form.Item label="执行方式">
          {getFieldDecorator('taskModes', {
            rules: [{ required }],
            initialValue: formrecord.taskModes || '1',
          })(<RadioGroup onChange={handleAdopt}>
            {taskmodesmap.map(obj => (
              <Radio key={obj.key} value={obj.dict_code}>
                {obj.title}
              </Radio>
            ))}
          </RadioGroup>)}
        </Form.Item>
        {
          selectadopt === '0' && (<Form.Item label="core表达式">
            {getFieldDecorator('taskCores', {
              rules: [{ required, message: '请输入core表达式' }],
              initialValue: formrecord.taskCores,
            })(<Input />)}
          </Form.Item>)
        }
      </Form>
    </div>
  );
});

Content.defaultProps = {
  formrecord: {
    taskName: '',
    scriptIds: [""],
    agentIds: [""],
    taskRemarks: '',
    taskModes: '',
    taskCores: ''
  }
}

export default Form.create()(Content);