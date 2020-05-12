/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import styles from './login.less';

@connect(({ mylogin, loading }) => ({
  mylogin,
  submitting: loading.effects['mylogin/login'],
}))
class Login extends Component {
  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        console.log(values);
        dispatch({
          // dispath 用于派发请求,调用的 model 的 effects
          type: 'mylogin/login', // 调用统一管理的 service 请求函数: 模块命名空间为login/下的 login effects请求
          payload: {
            // payload: 传递过去的参数
            ...values,
          },
        });
        // 传数据
        // this.props.onSumit(values);
        // console.log(values);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Form className={styles.loginform}>
          <Form.Item onSubmit={this.handleSubmit}>
            {getFieldDecorator('username', {
              rules: [{ required: true, message: '请输入用户名!' }],
            })(
              <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="用户名"
                size="large"
              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入密码!' }],
            })(
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder="密码"
                size="large"
              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true,
            })(<Checkbox>自动登录</Checkbox>)}
            <a className={styles.loginforgot} href="">
              忘记密码
            </a>
            <Button
              onClick={handleSubmit}
              type="primary"
              htmlType="submit"
              className={styles.loginbutton}
              size="large"
            >
              登录
            </Button>
            还没有账号 <a href="">马上注册!</a>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Form.create()(Login);
