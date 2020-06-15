/* eslint-disable no-restricted-syntax */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Tree } from 'antd';

// 展示组织结构树
const { TreeNode } = Tree;
@connect(({ deptree, loading }) => ({
  deptree,
  loading: loading.models.deptree,
}))
class DeptTree extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'deptree/fetch',
    });
  }

  toTree = data => {
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

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.deptName} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.id} title={item.deptName} {...item} />;
    });

  render() {
    const {
      deptree: { data },
    } = this.props;
    const dataSource = [...data];
    const returnTree = this.toTree(dataSource);
    return (
      <>
        {returnTree.length > 0 && (
          <Tree
            defaultExpandAll
            // showLine
          >
            {this.renderTreeNodes(returnTree)}
          </Tree>
        )}
      </>
    );
  }
}

export default DeptTree;
