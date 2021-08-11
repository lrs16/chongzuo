import React, { useState } from 'react';
import { Modal, Form, Row, Input, message, Col } from 'antd';

const { TextArea } = Input;

const withClick = (element, handleClick = () => { }) => {
  return <element.type {...element.props} onClick={handleClick} />;
};
function Back(props) {
  const [visible, setVisible] = useState(false);
  const required = true;
  const {
    form: { getFieldDecorator, validateFields, resetFields },
    children,
    selectedRows,
    title
  } = props;

  const handleopenClick = () => {
    if (selectedRows.length === 0) {
      message.info('请至少选择一条数据')
      return false;
    }
    const res = selectedRows.every(item => {
      if (item.checkStatus === '待审核') {
        return item.id;
      }
      message.info('请选择审核状态: 待审核');
      return false
    })

    if (res === false) {
      return false;
    }
    setVisible(true);
    return null;
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleOk = () => {
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
        width={850}
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
                  getFieldDecorator('msg', {
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
  );
}

export default Form.create()(Back);
