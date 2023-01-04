/* eslint-disable no-restricted-syntax */
import React, { Component } from 'react';
import { connect } from 'dva';
import { TreeSelect, Form } from 'antd';

// const { SHOW_PARENT } = TreeSelect;
// 选择所在组织机构的组件
@connect(({ softmanagetree, loading }) => ({
  softmanagetree,
  loading: loading.models.softmanagetree,
}))
class SelectID extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    // 经过getFieldDecorator封装以后，props会有value属性，代表外部传递过来的值
    if (nextProps.value !== prevState.value) {
      return {
        value: nextProps.value,
      };
    }
    return null;
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'softmanagetree/fetch',
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
      vote.value = datas[i].id;
      vote.title = datas[i].deptName;
      vote.deptSort = datas[i].deptSort;
      vote.pid = datas[i].pid;
      newArr.push(vote);
    }

    return newArr;
  };

  handleChange = value => {
    this.props.onChange(value);
  };

  render() {
    // 转换树结构
    const {
      softmanagetree: { data },
      loading,
    } = this.props;
    const treeData = this.toTree(data);
    return (
      <>
        <TreeSelect
          style={{ width: '100%' }}
          value={this.props.value}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          getPopupContainer={triggerNode => triggerNode.parentNode} // 解决下拉不显示在上层的问题
          treeData={treeData}
          placeholder="请选择"
          treeDefaultExpandAll
          onChange={this.handleChange}
          loading={loading}
        />
      </>
    );
  }
}

export default SelectID;
// export default Form.create()(SelectID);
