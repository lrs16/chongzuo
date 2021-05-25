import React from 'react';
import {
  Modal,
  Form,
  Input,
  Row,
  Col
} from 'antd';

const { TextArea } = Input;

function ModelRollback(props) {
  const required = true;
  const {
    form: { getFieldDecorator, validateFields, resetFields },
    title, visible, ChangeVisible
  } = props;


  const handleCancel = () => {
    ChangeVisible(false);
  }

  const handleOk = () => {
    validateFields((err, values) => {
      if (!err) {
        handleCancel();
        props.rollbackSubmit(values);
        resetFields();
      }
    })
  }




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
              <Form.Item label='回退意见'>
                {
                  getFieldDecorator('rollbackmsg', {
                    rules: [
                      {
                        required,
                        message: '请说明回退原因'
                      }
                    ]
                  })(<TextArea rows={5} />)
                }

              </Form.Item>
            </Col>
          </Form>
        </Row>
      </Modal>

    </>
  )
}

export default Form.create()(ModelRollback)
