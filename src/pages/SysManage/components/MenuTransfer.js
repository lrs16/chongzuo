import React from 'react';
import { Transfer, Tree } from 'antd';
// import difference from 'lodash/difference';

const { TreeNode } = Tree;

// Customize Table Transfer
const isChecked = (selectedKeys, eventKey) => {
  return selectedKeys.indexOf(eventKey) !== -1;
};

const generateTree = (treeNodes = [], checkedKeys = []) => {
  return treeNodes.map(({ children, ...props }) => (
    <TreeNode {...props} disabled={checkedKeys.includes(props.id)} key={props.id} title={props.menuDesc}>
      {generateTree(children, checkedKeys)}
    </TreeNode>
  ));
};

const TreeTransfer = ({ dataSource, targetKeys, ...restProps }) => {
// 此处的targetKeys，为左边菜单已先中的值
  const transferDataSource = [];
  function flatten(list = []) {
    list.forEach(item => {
      transferDataSource.push(item);
      flatten(item.children);
    });
  }
  flatten(dataSource);

  return (
    <Transfer
      {...restProps}
      targetKeys={targetKeys}
      dataSource={transferDataSource}
      className="tree-transfer"
      render={item => item.menuDesc}
      showSelectAll
    >
      {({ direction, onItemSelect, selectedKeys }) => {
        if (direction === 'left') {
          const checkedKeys = [...selectedKeys, ...targetKeys];
          return (
            <Tree
              blockNode
              checkable
              checkStrictly
              defaultExpandAll
              checkedKeys={checkedKeys}
              onCheck={(
                _,
                {
                  node: {
                    props: { eventKey },
                  },
                },
              ) => {
                onItemSelect(eventKey, !isChecked(checkedKeys, eventKey));
              }}
              onSelect={(
                _,
                {
                  node: {
                    props: { eventKey },
                  },
                },
              ) => {
                onItemSelect(eventKey, !isChecked(checkedKeys, eventKey));
              }}
            >
              {generateTree(dataSource, targetKeys)}
            </Tree>
          );
        }
      }}
    </Transfer>
  );
};

// const treeData = [
//   { key: '0-0', title: '自动化运维' },
//   {
//     key: '0-1',
//     title: '监测管理',
//     children: [{ key: '0-1-0', title: '0-1-0' }, { key: '0-1-1', title: '0-1-1' }],
//   },
//   { key: '告警管理', title: '0-3' },
// ];

class MenuTransfer extends React.Component {
  // state = {
  //   targetKeys: [],
  // };

  onChange = targetKeys => {
    console.log('Target Keys:', targetKeys);
    // this.setState({ targetKeys });
  };

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
      map[item.menuSort] = item;
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

  sort= () => {
    const result = [];
    const data = this.props.rolemenus;
    if (!Array.isArray(data)) {
      return result;
    }
    data.forEach(item => {
      result.push(item.id);
    });    
    return result;
  };

 
  render() {
    // const { targetKeys } = this.state;
    const mytreeData = this.toTree(this.props.sysmenu);
    const targetKeys = this.sort(this.props.rolemenus);
    return (
      <div>
        <TreeTransfer 
        dataSource={mytreeData} 
        targetKeys={targetKeys} 
        onChange={this.onChange} 
        />
      </div>
    );
  }
}

export default MenuTransfer;
