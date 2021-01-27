/* eslint-disable no-restricted-syntax */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Tree } from 'antd';
// import styles from './index.less';

// 展示组织结构树
const { TreeNode } = Tree;
@connect(({ dicttree, loading }) => ({
  dicttree,
  loading: loading.models.dicttree,
}))
class DeptTree extends Component {
  state = {
    // tree需要的参数
    params: {
      pid: '',
      dictModule: '',
      dictType: '',
      dictCode: '',
      dictName: '',
      dictRemarks: '',
    },
  };

  componentDidMount() {
    const { params } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'dicttree/fetch',
      payload: {
        params,
      },
    });
  }

  //  处理数据，生成更多的父子节点，未知？
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
      map[item.order] = item;
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

  // 生成子节点
  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item} selectable>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} title={item.title} {...item} />;
    });

  //  用户点击每个子节点的事件
  onSelect = selectedKeys => {
    if (selectedKeys !== undefined) {
      this.props.toFatherValue(selectedKeys);
    }
  };

  render() {
    const {
      dicttree: { data },
    } = this.props;
    const dataSource = [...data];
    const returnTree = this.toTree(dataSource);
    // const arr = data.map(i=>{
    //   return i.children;
    // })
    // const hostId = arr.map(item=>{
    //   return item[0].id;
    // })
    return (
      <>
        {returnTree.length > 0 && (
          <Tree
            defaultExpandAll
            // defaultSelectedKeys={hostId}
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
