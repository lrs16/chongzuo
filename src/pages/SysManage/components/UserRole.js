import React, { Component } from 'react';
import { connect } from 'dva';
import { Drawer, Button, Message } from 'antd';
import RoleTransfer from './RoleTransfer';

// 克隆子元素按钮，并添加事件
const withClick = (element, showDrawer = () => {}) => {
  return <element.type {...element.props} onClick={showDrawer} />;
};
@connect(({ userrole, loading }) => ({
  userrole,
  loading: loading.models.userrole,
}))
class UserRole extends Component {
  state = {
    visible: false,
    rolelist: [],
  };

  showDrawer = () => {
    this.setState({
      visible: true,
    });
    this.loadsysRole();
    this.loadroleRole();
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  handleChange = rolelist => {
    this.setState({ rolelist });
    // console.log(this.state.rolelist + 'pp');
  };

  handleOk = () => {
    const { dispatch } = this.props;
    const { userId } = this.props;
    const rolevalue = this.state.rolelist;
    return dispatch({
      type: 'userrole/unpdaterole',
      payload: { userId, rolevalue },
    }).then(res => {
      if (res.code === 200) {
        Message.success(res.msg);
        this.onClose();
      } else {
        Message.error('配置权限失败！');
      }
    });
  };

  loadsysRole = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userrole/fetchdatas',
    });
  };

  loadroleRole = () => {
    const { userId } = this.props;
    const { dispatch } = this.props;
    return dispatch({
      type: 'userrole/queryrole',
      payload: { userId },
    });
  };

  render() {
    const { visible } = this.state;
    const {
      loading,
      children,
      userId,
      userName,
      userrole: { sysrole, userrole },
    } = this.props;

    //  console.log(sysrole,userrole);
    return (
      <>
        {withClick(children, this.showDrawer)}
        <Drawer
          title={userName}
          width={720}
          onClose={this.onClose}
          visible={visible}
          bodyStyle={{ paddingBottom: 60 }}
          key={userId}
        >
          <RoleTransfer
            sysrole={sysrole}
            userrole={userrole}
            openloading={loading}
            UpdateRole={this.handleChange}
          />
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
              取消
            </Button>
            <Button onClick={this.handleOk} type="primary">
              提交
            </Button>
          </div>
        </Drawer>
      </>
    );
  }
}
export default UserRole;
