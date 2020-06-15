import React, { Component } from 'react';
import { Drawer, Button, Form, Avatar, Radio, Input, TreeSelect, Select } from 'antd';
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
          title="用户信息"
          width={400}
          onClose={this.onClose}
          visible={visible}
          bodyStyle={{ paddingBottom: 60 }}
          // destroyOnClose
        >
          <Form {...formItemLayout}>
            <Form.Item label="旧密码">
              {getFieldDecorator('oldPassword', {
                // initialValue: userEmail,
              })(<Input />)}
            </Form.Item>
            <Form.Item label="新密码">
              {getFieldDecorator('newPassword', {
                // initialValue: userEmail,
              })(<Input />)}
            </Form.Item>
            <Form.Item label="确认新密码" className={styles.antformitem}>
              {getFieldDecorator('newPassword', {
                // initialValue: userEmail,
              })(<Input />)}
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
            <Button onClick={this.onClose} type="primary" style={{ marginRight: 8 }}>
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
