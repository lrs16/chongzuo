import React, { useEffect, useState } from 'react';
import { connect } from 'dva';

const selects = [
  { dictModule: 'event', dictType: 'type' },
  { dictModule: 'event', dictType: 'source' },
  { dictModule: 'event', dictType: 'handleresult' },
  { dictModule: 'event', dictType: 'source' },
];

function DictTree(props) {
  const { dispatch, typeid, commonid, ChangeSelectdata } = props;
  const [ischange, setIsChange] = useState(false);
  const [selectlist, setSelectList] = useState([]);

  useEffect(() => {
    dispatch({
      type: 'dicttree/childdictLower',
      payload: { id: typeid },
    }).then(res => {
      if (res.code === 200) {
        const test = res.data.children;
        selectlist.push(res.data.children);
        dispatch({
          type: 'dicttree/childdictLower',
          payload: { id: commonid },
        }).then(ress => {
          if (ress.code === 200) {
            selectlist.push({ ...ress.data.children });
            setIsChange(true);
          }
        });
      }
    });
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
