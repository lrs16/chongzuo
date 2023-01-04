import React from 'react';
import { Drawer, Button, Form, Input } from 'antd';

const { TextArea } = Input;

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

function agentDrawer(props) {
  const { visible, ChangeVisible, title, handleSubmit } = props;
  const { getFieldDecorator, validateFields } = props.form;
  // const required = true;
  const { id, agentName, agentHost, agentHyper, agentPort, agentToken, agentType, agentRemarks, } = props.record;

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
        <Form.Item label="agent名称">
          {getFieldDecorator('agentName', {
            initialValue: agentName,
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item label="agent地址">
          {getFieldDecorator('agentHost', {
            initialValue: agentHost,
          })(<Input placeholder="请输入" disabled />)}
        </Form.Item>
        <Form.Item label="agent协议">
          {getFieldDecorator('agentHyper', {
            initialValue: agentHyper,
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item label="agent端口">
          {getFieldDecorator('agentPort', {
            initialValue: agentPort,
          })(<Input placeholder="请输入" disabled />)}
        </Form.Item>
        <Form.Item label="通信Token">
          {getFieldDecorator('agentToken', {
            initialValue: agentToken,
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item label="agent类型">
          {getFieldDecorator('agentType', {
            initialValue: agentType,
          })(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item label="备注">
          {getFieldDecorator('agentRemarks', {
            initialValue: agentRemarks,
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
        <Button onClick={handleOk} type="primary">
          提交
        </Button>
      </div>
    </Drawer>
  );
}

agentDrawer.defaultProps = {
  record: { id: '', agentName: '', agentHost: '', agentHyper: '', agentPort: '', agentToken: '', agentType: '', agentRemarks: '', },
};

export default Form.create()(agentDrawer);