/* eslint-disable no-useless-constructor */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { Form, Input, Modal } from 'antd';

var forge = require('node-forge');

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

// 克隆子元素按钮，并添加事件
const withClick = (element, handleClick = () => {}) => {
  return <element.type {...element.props} onClick={handleClick} />;
};
class StartModal extends Component {
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

  hanldleCancel = () => {
    //取消按钮
    this.setState({
      visible: false,
    });
  };

  handleOk = () => {
    //确认按钮
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // 关闭弹窗
        this.hanldleCancel();

        const md = forge.md.md5.create();
        md.update(values.psw);
        const password = md.digest().toHex();
        // console.log(password, "password")

        // 存储数据  sessionStorage
        sessionStorage.setItem('ip', values.ip);
        sessionStorage.setItem('port', values.port);
        sessionStorage.setItem('username', values.username);
        sessionStorage.setItem('psw', password);

        // 传数据
        this.props.onSumit(values); //提交表单
        this.props.form.resetFields();
      }
    });
  };

  render() {
    const { visible } = this.state;
    const { children, title } = this.props;

    // Form双向绑定
    const { getFieldDecorator } = this.props.form;
    const required = true;
    // console.log(this.props.record);
    const {
      ip,
      port,
      username, //获取输入的用户名
      psw, //获取输入的密码
    } = this.props.record;

    return (
      <>
        {withClick(children, this.handleopenClick)}
        <Modal
          title={title}
          visible={visible}
          centered
          maskClosable={false}
          onCancel={this.hanldleCancel}
          onOk={this.handleOk}
        >
          <Form {...formItemLayout}>
            <Form.Item label="IP">
              {getFieldDecorator('ip', {
                initialValue: ip,
              })(<Input disabled />)}
            </Form.Item>
            <Form.Item label="端口">
              {getFieldDecorator('port', {
                initialValue: port,
              })(<Input disabled />)}
            </Form.Item>
            <Form.Item label="用户名">
              {getFieldDecorator('username', {
                rules: [
                  {
                    required: true,
                    message: '昵称不能为空',
                  },
                ],
                // rules: [{
                //     required: true,
                //     message: '昵称不能为空',
                // }, {
                //     len: 4,
                //     message: '长度需4个字符',
                // }],
              })(<Input type="text" placeholder="请输入" />)}
            </Form.Item>
            <Form.Item label="密码">
              {getFieldDecorator('psw', {
                rules: [
                  {
                    required: true,
                    message: '密码不能为空',
                  },
                ],
                // rules: [{
                //     required: true,
                //     message: '密码不能为空',
                // }, {
                //     min: 4,
                //     message: '密码不能少于4个字符',
                // }, {
                //     max: 6,
                //     message: '密码不能大于6个字符',
                // }],
              })(<Input placeholder="请输入" type="password" />)}
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  }
}

// 初始化数据表单
StartModal.defaultProps = {
  title: '启停',
  record: {
    ip: '',
    port: '',
    username: '',
    psw: '',
  },
};
export default Form.create()(StartModal);
