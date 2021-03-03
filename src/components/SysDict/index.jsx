import React, { useEffect, useState } from 'react';
import { connect } from 'dva';

function DictTree(props) {
  const { dispatch, typeid, commonid, ChangeSelectdata } = props;
  const [ischange, setIsChange] = useState(false);
  const [selectlist, setSelectList] = useState([]);

  useEffect(() => {
    let doCancel = false;
    if (!doCancel) {
      dispatch({
        type: 'dicttree/childdictLower',
        payload: { id: typeid },
      }).then(res => {
        if (res.code === 200) {
          selectlist.push(...res.data);
          dispatch({
            type: 'dicttree/childdictLower',
            payload: { id: commonid },
          }).then(ress => {
            if (ress.code === 200) {
              selectlist.push(...ress.data);
              setIsChange(true);
            }
          });
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
  }, [ischange]);

  return null;
}

export default connect(({ dicttree, loading }) => ({
  dicttree,
  loading: loading.models.dicttree,
}))(DictTree);
