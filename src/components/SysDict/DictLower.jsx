import React, { useEffect, useState } from 'react';
import { connect } from 'dva';

function DictLower(props) {
  const { dispatch, typeid, ChangeSelectdata } = props;
  const [ischange, setIsChange] = useState(false);
  const [selectlist, setSelectList] = useState([]);

  useEffect(() => {
    let doCancel = false;
    if (!doCancel) {
      dispatch({
        type: 'dicttree/childdictLower',
        payload: { id: typeid },
      }).then(res => {
        if (res.code === 200 && !doCancel && res.data.length > 0) {
          selectlist.push(...res.data);
          setIsChange(true);
        }
      });
    }
    return () => {
      setIsChange(false);
      doCancel = true;
    };
  }, []);
  useEffect(() => {
    if (ischange) {
      ChangeSelectdata(selectlist);
    }
    return () => {
      setIsChange(false);
      // selectlist.splice(0, selectlist.length);
    };
  }, [ischange]);

  return null;
}

export default connect(({ dicttree, loading }) => ({
  dicttree,
  loading: loading.models.dicttree,
}))(DictLower);
