import React, { Component } from 'react';
import DeptTree from './DeptTree';

class DatatoDree extends Component {
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

  render() {
    const treeSoure = this.props.treedatas;
    const treeData = this.toTree(treeSoure);
    console.log(treeData);
    return <DeptTree datas={treeData} />;
  }
}

export default DatatoDree;
