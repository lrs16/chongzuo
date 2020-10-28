import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Alert } from 'antd';

@connect(({ itlogin, loading }) => ({
  itlogin,
  loading: loading.models.itlogin,
}))
class index extends Component {
  componentDidMount() {
    const urlParams = this.props.location;
    const { search } = urlParams;
    const logincode = search.match(/\?(\S*)\//)[1];
    const password = search.match(/\/(\S*)/)[1];
    const Authorization = `Basic d2ViQXBwX2l0c20=`;
    const { dispatch } = this.props;
    dispatch({
      type: 'itlogin/login',
      payload: {
        logincode,
        password,
        Authorization,
      },
    });
  }

  render() {
    const { itlogin, loading } = this.props;
    const { status, msg } = itlogin;
    return (
      <>
        {loading === true && (
          <Spin tip="用户验证中..." spinning={loading}>
            <Alert message="" type="info" style={{ height: 200, marginTop: 50 }} />
          </Spin>
        )}
        {status === -1 && (
          <Alert
            message="Error"
            description={msg}
            type="error"
            showIcon
            style={{ marginTop: 50 }}
          />
        )}
      </>
    );
  }
}

export default index;
