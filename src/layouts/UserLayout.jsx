import { getPageTitle } from '@ant-design/pro-layout';
import { Helmet } from 'react-helmet';
import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';

const UserLayout = props => {
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const title = getPageTitle({
    pathname: location.pathname,
    formatMessage,
    ...props,
  });
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>
      <div style={{ paddingTop: 56 }}>
        {children}
      </div>
    </>
  );
};

export default connect(({ settings }) => ({ ...settings }))(UserLayout);
