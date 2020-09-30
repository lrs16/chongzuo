import React, { Component } from 'react';
import { Form, Input, Modal, DatePicker, Tabs, Select } from 'antd';
import moment, { isMoment } from 'moment';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 16 },
    sm: { span: 16 },
  },
  // colon: false,
};

const withClick = (element, handleClick = () => {}) => {
  return <element.type {...element.props} onClick={handleClick} />;
};

class EditResources extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    visible: false,
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  handleopenClick = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  handleOk = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.handleCancel();
        this.props.onSumit(values);
        this.props.form.resetFields();
      }
    });
  };

  render() {
    const { visible } = this.state;
    const { children } = this.props;
    const { record } = this.props;
    const { getFieldDecorator } = this.props.form;
    const required = true;

    return (
      <>
        {withClick(children, this.handleopenClick)}
        <Modal
          width={500}
          visible={visible}
          closable="true"
          maskClosable={true}
          onClose={this.onClose}
          centered="true"
          onCancel={this.handleCancel}
          onOk={this.handleOk}
        >
          <Form {...formItemLayout}>
            <Form.Item label="ip地址">
              {getFieldDecorator('ip', {
                rules: [
                  {
                    required,
                    message: '请输入',
                  },
                ],
                initialValue: '',
              })(<Input></Input>)}
            </Form.Item>

            <Form.Item label="检测对象">
              {getFieldDecorator('monitorObj', {
                rules: [
                  {
                    required,
                    message: '请输入',
                  },
                ],
                initialValue: '',
              })(<Input></Input>)}
            </Form.Item>

            <Form.Item label="操作">
              {getFieldDecorator('operation', {
                rules: [
                  {
                    required,
                    message: '请输入',
                  },
                ],
              })(<Input></Input>)}
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  }
}

export default Form.create()(EditResources);
