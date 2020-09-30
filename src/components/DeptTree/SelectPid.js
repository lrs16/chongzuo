/* eslint-disable no-restricted-syntax */
import React, { Component } from 'react';
import { connect } from 'dva';
import { TreeSelect } from 'antd';

// 选择父级组织机构组件
@connect(({ deptree, loading }) => ({
  deptree,
  loading: loading.models.deptree,
}))
class SelectPid extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'deptree/fetch',
    });
  }

  toTree = datas => {
    const data = this.addArr(datas);
    const result = [];
    if (!Array.isArray(data)) {
      return result;
    }
    data.forEach(item => {
      delete item.children;
    });
    const map = {};
    data.forEach(item => {
      map[item.deptSort] = item;
    });
    data.forEach(item => {
      const parent = map[item.pid];
      if (parent) {
        (parent.children || (parent.children = [])).push(item);
      } else {
        result.push(item);
      }
    });
    return result;
  };

  addArr = datas => {
    const newArr = [];
    if (!Array.isArray(datas)) {
      return newArr;
    }
    for (let i = 0; i < datas.length; i += 1) {
      const vote = {};
      vote.id = datas[i].id;
      vote.key = datas[i].id;
      vote.value = datas[i].deptSort;
      vote.title = datas[i].deptName;
      vote.deptSort = datas[i].deptSort;
      vote.pid = datas[i].pid;
      newArr.push(vote);
    }

    return newArr;
  };

  handleChange = value => {
    this.props.onChange(value);
    //  this.setState({ value });
  };

  render() {
    // 转换树结构
    const {
      deptree: { data },
      loading,
    } = this.props;
    const treeData = this.toTree(data);
    return (
      <TreeSelect
        style={{ width: '100%' }}
        // value={this.state.value}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        getPopupContainer={triggerNode => triggerNode.parentNode} // 解决下拉不显示在上层的问题
        treeData={treeData}
        placeholder="请选择"
        treeDefaultExpandAll
        onChange={this.onChange}
      />
      // <Input width='100%'/>
    );
  }
}

export default SelectPid;
