import React, { useEffect } from 'react';
import { connect } from 'dva';

function GetExpressions(props) {
  const { dispatch, record } = props;
  useEffect(() => {
    if (record !== '') {
      const { modules, field, key } = record;
      dispatch({
        type: 'expressionsmanage/getexpressions',
        payload: {
          modules,
          field,
          key,
        },
      }).then(res => {
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
