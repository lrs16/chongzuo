import { Avatar, Icon, Menu, Spin } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import React from 'react';
import { connect } from 'dva';
// import router from 'umi/router';
import HeaderDropdown from '../HeaderDropdown';
import UserInfo from '../UserInfo';
import ChangePW from '../UserInfo/changepw';
import styles from './index.less';

class AvatarDropdown extends React.Component {
  // onMenuClick = event => {
  //   const { key } = event;
  //   if (key === 'logout') {
  //     const { dispatch } = this.props;
  //     if (dispatch) {
  //       dispatch({
  //         type: 'login/logout',
  //       });
  //     }
  //   //  return;
  //   }
  // //  router.push(`/account/${key}`);
  // };

  onClicklogout = () => {
    const { dispatch } = this.props;
    const access_token = sessionStorage.getItem('access_token');
    dispatch({
      type: 'login/logout',
      payload: { access_token },
    });
  };

  render() {
    const {
      // currentUser = {
      //   avatar: '',
      //   name: '',
      // },
      currentUser,
      // menu,
    } = this.props;
    // console.log(this.props);
    const menuHeaderDropdown = (
      <Menu
        className={styles.menu}
        // selectedKeys={[]}
        // onClick={this.onMenuClick}
      >
        {/* {menu && (
          <Menu.Item key="center">
            <Icon type="user" />
            <FormattedMessage id="menu.account.center" defaultMessage="account center" />
          </Menu.Item>
        )}
        {menu && (
          <Menu.Item key="settings">
            <Icon type="setting" />
            <FormattedMessage id="menu.account.settings" defaultMessage="account settings" />
          </Menu.Item>
        )}
        {menu && <Menu.Divider />} */}

        <Menu.Item key="center">
          <UserInfo info={this.props}>
            <div>
              <Icon type="user" />
              <FormattedMessage id="menu.account.center" defaultMessage="account center" />
            </div>
          </UserInfo>
        </Menu.Item>
        <Menu.Item key="respassword">
          <ChangePW userid={this.props.currentUser.id}>
            <div>
              <Icon type="lock" />
              <FormattedMessage id="menu.account.changpw" defaultMessage="account resetpassword" />
            </div>
          </ChangePW>
        </Menu.Item>
        <Menu.Item key="logout" onClick={this.onClicklogout}>
          <Icon type="logout" />
          <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
        </Menu.Item>
      </Menu>
    );
    return currentUser && currentUser.userName ? (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar size="small" className={styles.avatar} src={currentUser.userHead} alt="avatar" />
          <span className={styles.name} style={{ color: '#bbb' }}>
            {currentUser.userName}
          </span>
        </span>
      </HeaderDropdown>
    ) : (
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    );
  }
}

export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(AvatarDropdown);
