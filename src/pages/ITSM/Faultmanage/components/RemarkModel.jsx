import React from 'react';
import { Modal, Form, Input, Row, Col } from 'antd';

const { TextArea } = Input;

function comfirmModel(props) {
  const required = true;
  const {
    form: { getFieldDecorator, validateFields, resetFields },
    title,
    visible,
    ChangeVisible,
  } = props;

  const handleCancel = () => {
    ChangeVisible(false);
  };

  const handleOk = () => {
    validateFields((err, values) => {
      if (!err) {
        handleCancel();
        props.toconfirmSubmit(values);
        resetFields();
      }
    });
  };

  return (
    <>
      <Modal
        visible={visible}
        maskClosable={false}
        title={title}
        checkable
        onCancel={handleCancel}
        onOk={handleOk}
      >
        <Row gutter={16}>
          <Form>
            <Col span={24}>
              <Form.Item label="确认说明">
                {getFieldDecorator('remark', {
                  rules: [
                    {
                      required,
                      message: '请填写确认说明',
                    },
                  ],
                })(<TextArea rows={5} />)}
              </Form.Item>
            </Col>
          </Form>
        </Row>
      </Modal>
    </>
  );
}

export default Form.create()(comfirmModel);
