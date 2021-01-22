import React, { useState } from 'react';
import { connect } from 'dva';
import { message, Select } from 'antd';

const { Option } = Select;

function SysDict(props) {
  const { dispatch, dictModule, dictType, handleChange } = props;
  const handleClick = () => {
    dispatch({
      type: 'dicttree/keyval',
      payload: {
        dictModule,
        dictType,
      },
    }).then(res => {
      if (res.code === 200) {
        handleChange(res.data.priority);
      } else {
        message.error('数据加载失败！', 2);
      }
    });
  };
  return <div onClick={() => handleClick()} />;
}

export default connect(({ dicttree, loading }) => ({
  data: dicttree.data,
}))(SysDict);
