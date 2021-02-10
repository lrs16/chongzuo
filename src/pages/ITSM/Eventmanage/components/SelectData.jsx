import React, { useEffect, useState } from 'react';
import { connect } from 'dva';

function SelectData(props) {
  const { dispatch, typeid, commonid, ChangeSelectdata } = props;
  const [ischange, setIsChange] = useState(false);
  const [selectlist, setSelectList] = useState([]);

  useEffect(() => {
    let doeventCancel = false;
    if (!doeventCancel) {
      dispatch({
        type: 'dicttree/childdictLower',
        payload: { id: typeid },
      }).then(res => {
        if (res.code === 200) {
          selectlist.push(...res.data[0]?.children);
          dispatch({
            type: 'dicttree/childdictLower',
            payload: { id: commonid },
          }).then(ress => {
            if (ress.code === 200) {
              selectlist.push(...ress.data[0]?.children);
              setIsChange(true);
            }
          });
        }
      });
    }
    return () => {
      setIsChange(false);
      doeventCancel = true;
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
}))(SelectData);
