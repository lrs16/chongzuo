import React from 'react';
import { Drawer, Button, Form, Input, InputNumber, Select } from 'antd';

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
  colon: false,
};

function TimeRulesDrawer(props) {
  const { visible, ChangeVisible, title, handleSubmit, servicetype, ordertype } = props;
  const { getFieldDecorator, validateFields } = props.form;
  const required = true;
  const {
    id,
    module,
    prior,
    orderRemind,
    orderTimeout,
    respondRemind,
    respondTimeout,
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
          })(<Input placeholder="系统生成" disabled />)}
        </Form.Item>
        <Form.Item label="业务类型">
          {getFieldDecorator('module', {
            rules: [
              {
                required,
                message: '请选择业务类型',
              },
            ],
            initialValue: module,
          })(
            <Select placeholder="请选择" getPopupContainer={triggerNode => triggerNode.parentNode}>
              {servicetype.map(({ key, val }) => (
                <Option key={key} value={key}>
                  {val}
                </Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="优先级">
          {getFieldDecorator('prior', {
            rules: [
              {
                required,
                message: '请选择优先级',
              },
            ],
            initialValue: prior,
          })(
            <Select placeholder="请选择" getPopupContainer={triggerNode => triggerNode.parentNode}>
              {ordertype.map(({ key, val }) => (
                <Option key={key} value={key}>
                  {val}
                </Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="工单提醒（分）">
          {getFieldDecorator('orderRemind', {
            rules: [
              {
                required,
                message: '请输入整数',
              },
            ],
            initialValue: orderRemind,
          })(<InputNumber placeholder="请输入" style={{ width: '100%' }} />)}
        </Form.Item>
        <Form.Item label="工单超时（分）">
          {getFieldDecorator('orderTimeout', {
            rules: [
              {
                required,
                message: '请输入整数',
              },
            ],
            initialValue: orderTimeout,
          })(<InputNumber placeholder="请输入" style={{ width: '100%' }} />)}
        </Form.Item>
        <Form.Item label="响应提醒（分）">
          {getFieldDecorator('respondRemind', {
            rules: [
              {
                required,
                message: '请输入整数',
              },
            ],
            initialValue: respondRemind,
          })(<InputNumber placeholder="请输入" style={{ width: '100%' }} />)}
        </Form.Item>
        <Form.Item label="响应超时（分）">
          {getFieldDecorator('respondTimeout', {
            rules: [
              {
                required,
                message: '请输入整数',
              },
            ],
            initialValue: respondTimeout,
          })(<InputNumber placeholder="请输入" style={{ width: '100%' }} />)}
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

TimeRulesDrawer.defaultProps = {
  record: {
    id: '',
    module: '',
    prior: '',
    orderRemind: '',
    orderTimeout: '',
    respondRemind: '',
    respondTimeout: '',
  },
};

export default Form.create()(TimeRulesDrawer);
