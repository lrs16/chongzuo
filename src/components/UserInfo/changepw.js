import React, { Component } from 'react';
import { connect } from 'dva';
import { Drawer, Button, Form, Input, Message } from 'antd';
import styles from './index.less';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
  colon: false,
};
// 克隆子元素按钮，并添加事件
const withClick = (element, showDrawer = () => {}) => {
  return <element.type {...element.props} onClick={showDrawer} />;
};
@connect(({ userchangpw, loading }) => ({
  userchangpw,
  loading: loading.models.userchangpw,
}))
class ChangePW extends Component {
  state = {
    visible: false,
  };

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  handleOk = () => {
    const { dispatch } = this.props;
    const id = this.props.userid;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { oldPasswordExt, newPasswordExt } = values;
        dispatch({
          type: 'userchangpw/fetch',
          payload: { id, oldPasswordExt, newPasswordExt },
        }).then(res => {
          if (res.code === 200) {
            Message.success(res.msg);
            this.onClose();
            // 关闭弹窗
            this.onClose();
            // 清除数据
            this.props.form.resetFields();
          } else {
            Message.error('修改密码失败！');
          }
        });
      }
    });
  };

  // 自定义校验两次密码是否一致
  validatorPwd = (rule, value, callback) => {
    if (value !== this.props.form.getFieldValue('newPasswordExt')) {
      callback(rule.message);
      return;
    }
    callback();
  };

  render() {
    const { visible } = this.state;
    const { children } = this.props;
    // Form双向绑定
    const { getFieldDecorator } = this.props.form;
    const required = true;
    return (
      <>
        {withClick(children, this.showDrawer)}
        <Drawer
          title="修改密码"
          width={400}
          onClose={this.onClose}
          visible={visible}
          bodyStyle={{ paddingBottom: 60 }}
          // destroyOnClose
        >
          <Form {...formItemLayout}>
            <Form.Item label="旧密码">
              {getFieldDecorator('oldPasswordExt', {
                rules: [{ required, message: '请输入密码' }],
              })(<Input.Password />)}
            </Form.Item>
            <Form.Item label="新密码">
              {getFieldDecorator('newPasswordExt', {
                rules: [{ required, message: '请输入密码' }],
                validateTrigger: 'onBlur',
              })(<Input.Password />)}
            </Form.Item>
            <Form.Item label="确认新密码" className={styles.antformitem}>
              {getFieldDecorator('newPasswordExt2', {
                rules: [
                  { required, message: '请输入密码' },
                  {
                    validator: this.validatorPwd,
                    message: '两次输入的密码不一致！',
                  },
                ],
                validateTrigger: 'onBlur',
              })(<Input.Password />)}
            </Form.Item>
          </Form>
          <div
            style={{
              width: '100%',
              padding: '10px 16px',
              background: '#fff',
              textAlign: 'right',
            }}
          >
            <Button onClick={this.handleOk} type="primary" style={{ marginRight: 8 }}>
              确认
            </Button>
            <Button onClick={this.onClose}>取消</Button>
          </div>
        </Drawer>
      </>
    );
  }
}
export default Form.create()(ChangePW);
