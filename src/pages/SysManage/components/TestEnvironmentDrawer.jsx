import React from 'react';
import { Drawer, Button, Form, Input, Radio } from 'antd';

const { TextArea } = Input;

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

function TestEnvironmentDrawer(props) {
  const { visible, ChangeVisible, title, handleSubmit } = props;
  const { getFieldDecorator, validateFields } = props.form;
  const required = true;
  const { id, deviceName, deviceConfig, deployApp, useStatus } = props.record;

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
        <Form.Item label="Id" style={{ display: 'none' }}>
          {getFieldDecorator('id', {
            initialValue: id,
          })(<Input placeholder="系统生成" disabled />)}
        </Form.Item>
        <Form.Item label="设备名称及用途">
          {getFieldDecorator('deviceName', {
            rules: [
              {
                required,
                message: '请输入设备名称及用途',
              },
            ],
            initialValue: deviceName,
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item label="设备型号配置">
          {getFieldDecorator('deviceConfig', {
            rules: [
              {
                required,
                message: '请输入设备型号配置"',
              },
            ],
            initialValue: deviceConfig,
          })(<TextArea autoSize={{ minRows: 10 }} />)}
        </Form.Item>
        <Form.Item label="部署应用">
          {getFieldDecorator('deployApp', {
            rules: [
              {
                required,
                message: '请输入部署应用',
              },
            ],
            initialValue: deployApp,
          })(<TextArea autoSize={{ minRows: 10 }} />)}
        </Form.Item>
        <Form.Item label="是否启用">
          {getFieldDecorator('useStatus', {
            rules: [
              {
                required,
                message: '请选择是否启用',
              },
            ],
            initialValue: useStatus || 'Y',
          })(
            <Radio.Group >
              <Radio value='Y'>启用</Radio>
              <Radio value='N'>停用</Radio>
            </Radio.Group>
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

TestEnvironmentDrawer.defaultProps = {
  record: {},
};

export default Form.create()(TestEnvironmentDrawer);
