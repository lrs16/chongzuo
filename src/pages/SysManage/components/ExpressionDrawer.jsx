import React from 'react';
import { Drawer, Button, Form, Input, Radio, Select } from 'antd';

const RadioGroup = Radio.Group;
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

function ExpressionDrawer(props) {
  const { visible, ChangeVisible, title, modulemap, fieldmap, handleSubmit } = props;
  const { getFieldDecorator, validateFields } = props.form;
  const required = true;
  const { id, module, field, content, status } = props.record;

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
      }
    });
    ChangeVisible(false);
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
          })(<Input placeholder="系统生成" disabled />)}
        </Form.Item>
        <Form.Item label="工单类型">
          {getFieldDecorator('module', {
            rules: [
              {
                required,
                message: '请选择工单类型',
              },
            ],
            initialValue: module,
          })(
            <Select placeholder="请选择" getPopupContainer={triggerNode => triggerNode.parentNode}>
              {modulemap.map(obj => [
                <Option key={obj.key} value={obj.title}>
                  {obj.title}
                </Option>,
              ])}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="对应字段">
          {getFieldDecorator('field', {
            rules: [
              {
                required,
                message: '请选择对应字段',
              },
            ],
            initialValue: field,
          })(
            <Select placeholder="请选择" getPopupContainer={triggerNode => triggerNode.parentNode}>
              {fieldmap.map(obj => [
                <Option key={obj.key} value={obj.title}>
                  {obj.title}
                </Option>,
              ])}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="常用语">
          {getFieldDecorator('content', {
            rules: [
              {
                required,
                message: '请选择对应字段',
              },
            ],
            initialValue: content,
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item label="启用状态">
          {getFieldDecorator('status', {
            rules: [
              {
                required,
                message: '请选择是否启用',
              },
            ],
            initialValue: status,
          })(
            <RadioGroup>
              <Radio value="1">启用</Radio>
              <Radio value="0">停用</Radio>
            </RadioGroup>,
          )}
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
        <Button onClick={handleOk} type="primary">
          提交
        </Button>
      </div>
    </Drawer>
  );
}

ExpressionDrawer.defaultProps = {
  record: { id: '', module: '', field: '', content: '', status: '' },
};

export default Form.create()(ExpressionDrawer);
