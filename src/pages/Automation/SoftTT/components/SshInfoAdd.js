import React, { Component } from 'react';
import { Form, Input, Modal } from 'antd';

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

const withClick = (element, handleClick = () => { }) => {
  return <element.type {...element.props} onClick={handleClick} />;
};

class SshInfoAdd extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    visible: false,
  };

  handleopenClick = () => {
    this.setState({
      visible: true,
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

  handleCancel = () => {
    this.setState({
      visible: false,
    });
    this.props.form.resetFields();
  };

  render() {
    const { visible } = this.state;
    const { children, title } = this.props;
    const { getFieldDecorator } = this.props.form;
    const required = true;
    const { hostsIp } = this.props.hostIp;
    return (
      <>
        {withClick(children, this.handleopenClick)}
        <Modal
          title={title}
          visible={visible}
          centered
          onCancel={this.handleCancel}
          onOk={this.handleOk}
        >
          <Form {...formItemLayout}>
            <Form.Item label="主机IP">
              {getFieldDecorator('hostsIp', {
                initialValue: hostsIp,
              })(<Input disabled />)}
            </Form.Item>

            <Form.Item label="帐号名称">
              {getFieldDecorator('hostsSshUsername', {
                rules: [
                  {
                    required,
                    message: '请输入...',
                  },
                ],
              })(<Input placeholder="请输入..." type="text" />)}
            </Form.Item>

            <Form.Item label="帐号密码">
              {getFieldDecorator('hostsSshPassword', {
                rules: [
                  {
                    required,
                    message: '请输入...',
                  },
                ],
              })(<Input type="password" placeholder="请输入..." />)}
            </Form.Item>

            <Form.Item label="使用端口">
              {getFieldDecorator('hostsSshPort', {
                rules: [
                  {
                    required,
                    message: '请输入...',
                  },
                ],
              })(<Input type="number" placeholder="请输入..." />)}
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  }
}
SshInfoAdd.defaultProps = {
  title: '添加',
  record: {
    hostsIp: '',
    hostsSshUsername: '',
    hostsSshPassword: '',
    hostsSshPort: '',
  },
};
export default Form.create()(SshInfoAdd);

