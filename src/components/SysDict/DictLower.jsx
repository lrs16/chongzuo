import React, { useEffect, useState } from 'react';
import { connect } from 'dva';

function DictLower(props) {
  const { dispatch, typeid, ChangeSelectdata } = props;
  const [ischange, setIsChange] = useState(false);
  const [selectlist, setSelectList] = useState([]);

  useEffect(() => {
    dispatch({
      type: 'dicttree/childdictLower',
      payload: { id: typeid },
    }).then(res => {
      if (res.code === 200) {
        selectlist.push(...res.data[0].children);
        setIsChange(true);
      }
    });
  }, []);
  useEffect(() => {
    if (ischange) {
      ChangeSelectdata(selectlist);
    }
    return () => {
      setIsChange(false);
    };
  }, [ischange]);

  return null;
}

export default connect(({ dicttree, loading }) => ({
  dicttree,
  loading: loading.models.dicttree,
}))(DictLower);
