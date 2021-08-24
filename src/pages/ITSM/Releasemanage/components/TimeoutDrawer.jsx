import React from 'react';
import { Drawer, Button, Form, Input, InputNumber } from 'antd';

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

function agentDrawer(props) {
  const { visible, ChangeVisible, title, handleSubmit } = props;
  const { getFieldDecorator, validateFields } = props.form;
  const required = true;
  const { id, releaseType, releaseStatus, agentHyper, agentPort, agentToken, } = props.record;

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
        <Form.Item label="发布类型">
          {getFieldDecorator('releaseType', {
            initialValue: releaseType,
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item label="环节名称">
          {getFieldDecorator('releaseStatus', {
            initialValue: releaseStatus,
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item label="操作开始时间（日）">
          {getFieldDecorator('agentHyper', {
            initialValue: agentHyper,
          })(<InputNumber min={1} max={31} style={{ width: '100%' }} />)}
        </Form.Item>
        <Form.Item label="操作结束时间（日）">
          {getFieldDecorator('agentPort', {
            initialValue: agentPort,
          })(<InputNumber min={1} max={31} style={{ width: '100%' }} />)}
        </Form.Item>
        <Form.Item label="超时提醒（日）">
          {getFieldDecorator('agentToken', {
            initialValue: agentToken,
          })(<InputNumber min={1} max={31} style={{ width: '100%' }} />)}
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

agentDrawer.defaultProps = {
  record: { id: '', releaseType: '', releaseStatus: '', agentHyper: '', agentPort: '', agentToken: '', },
};

export default Form.create()(agentDrawer);