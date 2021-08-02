import React, { useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Form,
  Input,
  Modal,
  DatePicker,
  Row,
  Col,
  message
} from 'antd';

const { TextArea } = Input;

// 克隆子元素按钮，并添加事件
const withClick = (element, handleClick = () => { }) => {
  return <element.type {...element.props} onClick={handleClick} />;
};

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 15 },
  },
};

const forminladeLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 22 },
  },
};

function SuperviseModel(props) {
  const [visible, setVisible] = useState(false);
  const {
    form: { getFieldDecorator, validateFields, resetFields },
    children,
    title,
    userinfo,
    selectedRows
  } = props;

  const required = true;

  const handleCancel = () => {
    setVisible(false);
    resetFields();
  };

  const handleSubmit = () => {
    validateFields((err, values) => {
      if (!err) {
        handleCancel();
        props.onSumit(values);
        resetFields();
      }
    })
  }

  const handleopenClick = () => {
    if (selectedRows.length === 0) {
      message.info('请至少选择一条数据')
      return false;
    }
    setVisible(true);
  };

  return (
    <>
      {withClick(children, handleopenClick)}
      <Modal
        title={title}
        visible={visible}
        width={1000}
        centered='true'
        maskClosable='true'
        onCancel={handleCancel}
        onOk={handleSubmit}
      >
        <Row gutter={16}>
          <Form {...formItemLayout}>
            <Col span={24}>
              <Form.Item label='督办内容' {...forminladeLayout}>
                {
                  getFieldDecorator('content', {
                    rules: [
                      {
                        required,
                        message: '请输入'
                      }
                    ],
                  })(<TextArea rows={4} />)
                }
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="督办人">
                {getFieldDecorator('superviseUser', {
                  initialValue: userinfo.userName,
                })(<Input disabled />)}
              </Form.Item>
              <Form.Item label="督办id" style={{ display:'none' }}>
                {getFieldDecorator('superviseUserId', {
                  initialValue: userinfo.userId,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="督办时间">
                {getFieldDecorator('superviseTime', {
                  initialValue: moment(new Date()),
                })(
                  <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                  />)}
              </Form.Item>
            </Col>
          </Form>
        </Row>
      </Modal>
    </>
  );
}
export default Form.create({})(
  connect()(SuperviseModel),
);
