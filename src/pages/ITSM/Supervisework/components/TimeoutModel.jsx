import React from 'react';
import { Modal, Form, Input } from 'antd';

const { TextArea } = Input;

function TimeoutModal(props) {
  const { modalvisible, ChangeModalVisible, ChangeTimeOutMsg } = props;
  const { getFieldDecorator, validateFields } = props.form;

  // 超时信息填写完成
  const handleOk = () => {
    validateFields((err, values) => {
      if (err) {
        return;
      }
      ChangeTimeOutMsg(values);
      ChangeModalVisible(false);
    });
  };

  // 超时信息
  const handleCancel = () => {
    ChangeModalVisible(false);
  };

  return (
    <Modal title="填写超时原因" visible={modalvisible} onOk={handleOk} onCancel={handleCancel}>
      <Form>
        <Form.Item label="超时原因">
          {getFieldDecorator('msg', {
            rules: [{ required: 'true', message: '请填写超时原因' }],
          })(<TextArea autoSize={{ minRows: 5 }} placeholder="请输入" />)}
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default Form.create({})(TimeoutModal);
