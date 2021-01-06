import React, { useState } from 'react';
import { Modal, Form, Card, Input } from 'antd';

const { TextArea } = Input;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 21 },
  },
};

const withClick = (element, handleClick = () => {}) => {
  return <element.type {...element.props} onClick={handleClick} />;
};
function Reasonregression(props) {
  const [visible, setVisible] = useState(false);
  const [golist, setGolist] = useState(false);
  const required = true;
  const {
    form: { getFieldDecorator, validateFields, resetFields },
    children,
  } = props;

  const handleopenClick = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleReasonregression = () => {
    validateFields((err, values) => {
      if (!err) {
        handleCancel();
        props.reasonSubmit(values);
        resetFields();
      }
    });
  };

  return (
    <>
      {withClick(children, handleopenClick)}
      <Modal
        visible={visible}
        // centered='true'
        maskClosable={false}
        width={850}
        checkable
        // height={1000}
        onCancel={handleCancel}
        onOk={handleReasonregression}
      >
        <Card>
          <Form {...formItemLayout}>
            <Form.Item label="退回原因">
              {getFieldDecorator('backReason', {
                rules: [
                  {
                    required,
                    message: '请说明退回原因',
                  },
                ],
              })(<TextArea style={{height:'200px'}}/>)}
            </Form.Item>
          </Form>
        </Card>
      </Modal>
    </>
  );
}

export default Form.create()(Reasonregression);
