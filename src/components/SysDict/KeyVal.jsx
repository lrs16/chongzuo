import React, { useEffect } from 'react';
import { connect } from 'dva';

function KeyVal(props) {
  const { dispatch, dictModule, dictType, ChangeSelectdata } = props;
  useEffect(() => {
    dispatch({
      type: 'dicttree/keyval',
      payload: {
        dictModule,
        dictType,
      },
    }).then(res => {
      if (res.code === 200) {
        ChangeSelectdata(res.data);
      } else {
        ChangeSelectdata([]);
      }
    });
  }, []);

  return null;
}

export default connect(({ dicttree }) => ({
  dicttree,
}))(KeyVal);
