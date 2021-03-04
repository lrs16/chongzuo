import React, { useEffect } from 'react';
import { connect } from 'dva';

function GetExpressions(props) {
  const { dispatch, record } = props;
  const getdatas = () => {
    const { module, field, key } = record;
    dispatch({
      type: 'expressionsmanage/getexpressions',
      payload: {
        module,
        field,
        key,
      },
    });
  };
  useEffect(() => {
    if (record !== '') {
      getdatas().then(res => {
        console.log(res);
      });
    }
  }, [record]);
  return null;
}

export default connect(({ expressionsmanage, loading }) => ({
  expressionsmanage,
  loading: loading.models.expressionsmanage,
}))(GetExpressions);
