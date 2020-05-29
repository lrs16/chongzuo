import { getMenuData } from '@ant-design/pro-layout';
// import { Helmet } from 'react-helmet';
// import Link from 'umi/link';
import React from 'react';
import { connect } from 'dva';
// import { formatMessage } from 'umi-plugin-react/locale';
// import logo from '../assets/logo.svg';
import styles from './LoginLayout.less';
import logo from '../../public/logo.png';

const LoginLayout = props => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { breadcrumb } = getMenuData(routes);
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.login}>
          <div className={styles.loginlogo}>
            <img src={logo} alt="" />
          </div>
          {children}
          <div className={styles.logintitle}>广西博联信息通信技术有限责任公司</div>
        </div>
      </div>
    </div>
  );
};

export default connect(({ settings }) => ({ ...settings }))(LoginLayout);
