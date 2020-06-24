import React, { Component } from 'react';
import { Drawer, Button, Form, Avatar } from 'antd';
import styles from './index.less';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
  colon: false,
};
// 克隆子元素按钮，并添加事件
const withClick = (element, showDrawer = () => {}) => {
  return <element.type {...element.props} onClick={showDrawer} />;
};
class UpdateUser extends Component {
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
    const {
      children,
      info: { currentUser },
    } = this.props;
    // Form双向绑定
    return (
      <>
        {withClick(children, this.showDrawer)}
        <Drawer
          title="个人中心"
          width={400}
          onClose={this.onClose}
          visible={visible}
          bodyStyle={{ paddingBottom: 60 }}
          // destroyOnClose
        >
          <div>
            <Avatar size={150} className={styles.avatar} src={currentUser.userHead} alt="avatar" />
          </div>
          <Form {...formItemLayout}>
            <Form.Item label="登录账号" className={styles.antformitem}>
              <span>{currentUser.loginCode}</span>
            </Form.Item>
            <Form.Item label="用户名" className={styles.antformitem}>
              <span>{currentUser.userName}</span>
            </Form.Item>
            <Form.Item label="邮箱" className={styles.antformitem}>
              <span>{currentUser.userEmail}</span>
            </Form.Item>
            <Form.Item label="手机号码" className={styles.antformitem}>
              <span>{currentUser.userMobile}</span>
            </Form.Item>
          </Form>
          <div
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e9e9e9',
              padding: '10px 16px',
              background: '#fff',
              textAlign: 'right',
            }}
          >
            <Button onClick={this.onClose} style={{ marginRight: 8 }}>
              关闭
            </Button>
          </div>
        </Drawer>
      </>
    );
  }
}
export default UpdateUser;
