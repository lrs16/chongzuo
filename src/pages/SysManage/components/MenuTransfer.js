import React from 'react';
import { Transfer, Tree, Spin } from 'antd';
// import difference from 'lodash/difference';

const { TreeNode } = Tree;

// Customize Table Transfer
const isChecked = (selectedKeys, eventKey) => {
  return selectedKeys.indexOf(eventKey) !== -1;
};

const generateTree = (treeNodes = [], checkedKeys = []) => {
  return treeNodes.map(({ children, ...props }) => (
    <TreeNode
      {...props}
      disabled={checkedKeys.includes(props.key)}
      key={props.key}
      title={props.title}
    >
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
      render={item => item.title}
      showSelectAll
      listStyle={{
        height: 'calc(100vh - 150px)',
        overflow: 'auto',
      }}
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

class MenuTransfer extends React.Component {
  state = {
    targetKeys: [],
    treenode: '',
  };

  componentWillReceiveProps() {
    this.gettargetData();
  }

  gettargetData = () => {
    const targetData = this.sort(this.props.rolemenus);
    this.setState({
      targetKeys: targetData,
    });
  };

  onChange = targetdata => {
    this.props.UpdateMenu(targetdata);
    // this.setState({ targetKeys: targetdata});
    setTimeout(() => {
      this.setState({ targetKeys: targetdata });
    }, 0);
  };

  toTree = () => {
    const data = this.addArr(this.props.sysmenu);
    const result = [];
    if (!Array.isArray(data)) {
      return result;
    }
    data.forEach(item => {
      delete item.children;
    });
    const map = {};
    data.forEach(item => {
      map[item.key] = item;
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
      vote.title = datas[i].menuDesc;
      vote.menuSort = datas[i].menuSort;
      vote.pid = datas[i].pid;
      newArr.push(vote);
    }

    return newArr;
  };

  sort = data => {
    const result = [];
    if (!Array.isArray(data)) {
      return result;
    }
    data.forEach(item => {
      result.push(item.id);
    });
    return result;
  };

  render() {
    const mytreeData = this.toTree();
    const listarr = this.addArr(this.props.sysmenu);
    const { targetKeys, treenode } = this.state;

    return (
      <Spin spinning={this.props.openloading}>
        <TreeTransfer
          dataSource={mytreeData}
          targetKeys={targetKeys}
          onChange={this.onChange}
          showSearch
        />
      </Spin>
    );
  }
}

export default MenuTransfer;
