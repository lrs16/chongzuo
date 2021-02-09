import React, { useEffect, useState } from 'react';
import { connect } from 'dva';

function DictTree(props) {
  const { dispatch, typeid, commonid, ChangeSelectdata } = props;
  const [ischange, setIsChange] = useState(false);
  const [selectlist, setSelectList] = useState([]);

  const getdata = () => {
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
  };

  useEffect(() => {
    getdata();
    return () => {
      setIsChange(false);
      // selectlist.splice(0, selectlist.length);
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
