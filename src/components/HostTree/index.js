/* eslint-disable no-restricted-syntax */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Tree } from 'antd';
import styles from './index.less';

// 展示组织结构树
const { TreeNode } = Tree;
@connect(({ hosttree, loading }) => ({
  hosttree,
  loading: loading.models.hosttree,
}))
class DeptTree extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'hosttree/fetch',
    });
  }

  toTree = data => {
    const result = [];
    if (!Array.isArray(data)) {
      return result;
    }
    // data.forEach(item => {
    //   delete item.children;
    // });
    const map = {};
    data.forEach(item => {
      map[item.weight] = item;
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
          <TreeNode title={item.name} key={item.id} dataRef={item} selectable>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.id} title={item.name} {...item} selectable />;
    });

  onSelect = (selectedKeys, info) => {
    this.props.toFatherValue(selectedKeys);
  };

  render() {
    const {
      hosttree: { data },
    } = this.props;
    const dataSource = [...data];
    const returnTree = this.toTree(dataSource);
    return (
      <>
        {returnTree.length > 0 && (
          <Tree
            defaultExpandAll
            // defaultSelectedKeys={['1310852028620083201']}
            onSelect={this.onSelect}
          >
            {this.renderTreeNodes(returnTree)}
          </Tree>
        )}
      </>
    );
  }
}

export default DeptTree;
