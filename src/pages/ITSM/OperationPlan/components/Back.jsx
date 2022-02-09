import React, { useState } from 'react';
import {
  Modal,
  Form,
  Card,
  Input,
  message,
  Row,
  Col
} from 'antd';

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
    detailPage,
    backProcessname
  } = props;
  const handleopenClick = () => {
    if (!detailPage) {
      if (selectedRows.length === 0) {
        message.info('请至少选择一条数据');
        return false;
      }
      const res = selectedRows.every(item => {
        if (item.checkStatus === '待审核') {
          return item.id;
        }

        message.info('请选择审核状态:待审核');
        return false;
      });

      if (res === false) {
        return false;
      }
    }
    setVisible(true);
    return [];
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
        maskClosable={false}
        checkable
        onCancel={handleCancel}
        onOk={handleReasonregression}
      >
        <Row>
          <Form>
            <Col style={{ color: 'red' }}>回退至 【{backProcessname}】</Col>
            <Col span={24}>
              <Form.Item label="退回原因">
                {getFieldDecorator('msg', {
                  rules: [
                    {
                      required,
                      message: '请说明退回原因',
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

export default Form.create()(Back);
