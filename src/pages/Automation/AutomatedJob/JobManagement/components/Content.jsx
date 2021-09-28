import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Form, Input, Radio, Button,} from 'antd';
// import moment from 'moment'; DatePicker, 
import DictLower from '@/components/SysDict/DictLower';
import SystemScriptList1 from './SystemScriptList1';
import TaskObjectList1 from './TaskObjectList1';
import CronGenerator from './CronExpression';
import AddagentObjDrawer from './AddagentObjDrawer';
import AddsystermScriptDrawer from './AddsystermScriptDrawer';

const { TextArea } = Input;

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
    xs: { span: 2 },
    // sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    // sm: { span: 4 },
  },
};

const Content = forwardRef((props, ref) => {
  const {
    formrecord,
    Noediting,
    form: { getFieldDecorator, getFieldsValue, resetFields, setFieldsValue }
  } = props;

  const required = true;
  const [selectadopt, setselectAdopt] = useState('');
  const [selectdata, setSelectData] = useState({ arr: [], ischange: false }); // 下拉值
  const [visible, setVisible] = useState(false); // 抽屉是否显示
  const [scriptvisible, setScriptVisible] = useState(false); // 抽屉是否显示
  const [title, setTitle] = useState('');
  const [scripttitle, setScriptTitle] = useState('');
  const [rows, setRows] = useState([]);
  const [scriptrows, setScriptRows] = useState([]);

  useImperativeHandle(ref, () => ({
    getVal: () => getFieldsValue(),
    resetVal: () => resetFields(),
    Forms: props.form.validateFieldsAndScroll,
  }), []);

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

  const handleShowObjDrawer = (drwertitle) => {
    setVisible(!visible);
    setTitle(drwertitle);
  };

  const handleShowScriptDrawer = (scriptdrwertitle) => {
    setScriptVisible(!scriptvisible);
    setScriptTitle(scriptdrwertitle);
  };

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
            handleShowObjDrawer('添加作业对象');
          }}>+作业对象</Button>)}
        </Form.Item>
        <Form.Item span={24} {...formItemLayout444}>
          <TaskObjectList1 onChangeSelect={(v)=>setRows(v)} selectrowsData={rows} GetRowskeysData={ (v) => { setFieldsValue({ agentIds: v }); }} Noediting={Noediting}/>
        </Form.Item>
        <Form.Item label="作业脚本"  {...formItemLayout1}>
          {getFieldDecorator('scriptIds', {
            rules: [{ required, message: '请选择作业脚本' }],
            initialValue: [""] || formrecord.scriptIds,
          })(<Button block onClick={() => {
            handleShowScriptDrawer('添加作业脚本');
          }}>+作业脚本</Button>)}
        </Form.Item>
        <Form.Item span={24} {...formItemLayout444}>
          <SystemScriptList1 onChangeSelect={(v)=>setScriptRows(v)} selectrowsData={scriptrows} GetRowskeysData={ (v) => { setFieldsValue({ scriptIds: v }); }} Noediting={Noediting}/>
        </Form.Item>
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
          selectadopt === '0' && (<Form.Item label="core表达式" span={24} {...formItemLayout444}>
            {getFieldDecorator('taskCores', {
              rules: [{ required, message: '请输入core表达式' }],
              initialValue: formrecord.taskCores,
            })(
              <CronGenerator GetCronData={(v) => { setFieldsValue({ taskCores: v });}}
                cronText={formrecord.taskCores}
              />
            )}
          </Form.Item>)
        }
      </Form>
      {/* 抽屉1 */}
      <AddagentObjDrawer
        visible={visible}
        ChangeVisible={newvalue => setVisible(newvalue)}
        title={title}
        GetRowsData={newvalue => setRows(newvalue)}
        GetRowskeysData={(v) => { setFieldsValue({ agentIds: v }); }}
        rows={rows}
        destroyOnClose
      />
      {/* 抽屉2 */}
      <AddsystermScriptDrawer
        visible={scriptvisible}
        ChangeVisible={newvalue => setScriptVisible(newvalue)}
        title={scripttitle}
        GetRowsData={newvalue => setScriptRows(newvalue)}
        GetRowskeysData={(v) => { setFieldsValue({ scriptIds: v }); }}
        rows={scriptrows} 
        destroyOnClose
      />
    </div>
  );
});

Content.defaultProps = {
  formrecord: {
    taskName: '',
    scriptIds: [""],
    agentIds: [""],
    taskRemarks: '',
    taskModes: '1',
    taskCores: ''
  }
}

export default Form.create()(Content);