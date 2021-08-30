import React from 'react';
import { Drawer, Button, Form, Input, InputNumber, Radio, Select } from 'antd';

const { TextArea } = Input;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
  colon: false,
};

const directormap = [
  { key: '1', title: '张三' },
  { key: '2', title: '李四' },
  { key: '3', title: '王五' },
  { key: '3', title: '赵六' },
];
function SystemScriptDrawer(props) {
  const { visible, ChangeVisible, title, handleSubmit, scriptsourcemap, scripttypemap } = props;
  const { getFieldDecorator, validateFields } = props.form;
  const required = true;
  const {
    id,
    scriptName,
    scriptSource,
    scriptType,
    scriptCont,
    scriptArgs,
    director,
    scriptSorts,
    scriptRemarks,
  } = props.record;

  const hanldleCancel = () => {
    ChangeVisible(false);
  };
  const handleOk = () => {
    validateFields((err, values) => {
      if (!err) {
        // 关闭弹窗
        hanldleCancel();
        // 传数据
        handleSubmit(values);
        props.form.resetFields();
        ChangeVisible(false);
      }
    });
  };

  return (
    <Drawer
      title={title}
      width={600}
      onClose={hanldleCancel}
      visible={visible}
      bodyStyle={{ paddingBottom: 60 }}
      destroyOnClose
    >
      <Form {...formItemLayout} onSubmit={handleOk}>
        <Form.Item label="Id">
          {getFieldDecorator('id', {
            initialValue: id,
          })(<Input disabled />)}
        </Form.Item>
        <Form.Item label="脚本名称">
          {getFieldDecorator('scriptName', {
            rules: [
              {
                required,
                message: '请输入 '
              },
            ],
            initialValue: scriptName,
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item label="脚本来源">
          {getFieldDecorator('scriptSource', {
            rules: [
              {
                required,
                message: '请选择'
              },
            ],
            initialValue: scriptSource || '本地上传',
          })(<Radio.Group>
            {scriptsourcemap.map(obj => (
              <Radio key={obj.key} value={obj.title}>
                {obj.title}
              </Radio>
            ))}
          </Radio.Group>)}
        </Form.Item>
        <Form.Item label="脚本类型">
          {getFieldDecorator('scriptType', {
            rules: [{ required }],
            initialValue: scriptType || 'shell',
          })(<Radio.Group>
            {scripttypemap.map(obj => (
              <Radio key={obj.key} value={obj.title}>
                {obj.title}
              </Radio>
            ))}
          </Radio.Group>)}
        </Form.Item>
        <Form.Item label="脚本内容">
          {getFieldDecorator('scriptCont', {
            rules: [
              {
                required,
                message: '请输入 '
              },
            ],
            initialValue: scriptCont,
          })(<TextArea placeholder="请输入" autoSize={{ minRows: 10 }} allowClear />)}
        </Form.Item>
        <Form.Item label="脚本参数">
          {getFieldDecorator('scriptArgs', {
            rules: [
              {
                required,
                message: '请输入 '
              },
            ],
            initialValue: scriptArgs,
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item label="负责人">
          {getFieldDecorator('director', {
            rules: [
              {
                required,
                message: '请选择 '
              },
            ],
            initialValue: director,
          })(<Select placeholder="请选择" allowClear>
          {directormap.map(obj => (
              <Option key={obj.key} value={obj.title}>
                  {obj.title}
              </Option>
          ))}
      </Select>)}
        </Form.Item>
        <Form.Item label="脚本排序">
          {getFieldDecorator('scriptSorts', {
            initialValue: scriptSorts,
          })(<InputNumber style={{ width: '100%' }} placeholder="请输入数字..." />)}
        </Form.Item>
        <Form.Item label="脚本备注">
          {getFieldDecorator('scriptRemarks', {
            initialValue: scriptRemarks,
          })(<TextArea placeholder="请输入" autoSize={{ minRows: 3 }} allowClear />)}
        </Form.Item>
      </Form>

      <div
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }}
      >
        <Button onClick={hanldleCancel} style={{ marginRight: 8 }}>
          取消
        </Button>
        <Button style={{ marginRight: 8 }}>
          保存
        </Button>
        <Button onClick={handleOk} type="primary">
          提交
        </Button>
      </div>
    </Drawer>
  );
}

SystemScriptDrawer.defaultProps = {
  record: {
    id: '',
    scriptName: '',
    scriptSource: '',
    scriptType: '',
    scriptCont: '',
    scriptArgs: '',
    director: '',
    scriptSorts: '',
    scriptRemarks: '',
  },
};

export default Form.create()(SystemScriptDrawer);