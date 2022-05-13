import React, { Component } from 'react';
import { connect } from 'dva';
import { Drawer, Button, Message, Tree, Input, Switch } from 'antd';
import MenuTransfer from './MenuTransfer';

const { TreeNode } = Tree;
const { Search } = Input;

const addArr = datas => {
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

const toTree = (datas) => {
  const data = addArr(datas);
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

const generateTree = (treeNodes = []) => {
  return treeNodes.map(({ children, ...props }) => (
    <TreeNode
      {...props}
      key={props.key}
      title={props.title}
    >
      {generateTree(children)}
    </TreeNode>
  ));
};

// 克隆子元素按钮，并添加事件
const withClick = (element, showDrawer = () => { }) => {
  return <element.type {...element.props} onClick={showDrawer} />;
};
@connect(({ rolemenu, loading }) => ({
  rolemenu,
  loading: loading.models.rolemenu,
}))
class RoleMenu extends Component {
  state = {
    visible: false,
    menulist: [],
    expandedKeys: '',
    searchValue: '',
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      // autoExpandParent: false,
    });
  };

  handleChange = (menulist, e) => {
    // const newArr = [...menulist.checked];
    // if (e.checked) {
    //   const index = newArr.indexOf(e.node.props.pid);
    //   if (index === -1) {
    //     newArr.push(e.node.props.pid)
    //   }
    // };
    // console.log(newArr);
    this.setState({ menulist: menulist.checked });
  };

  handleOk = () => {
    const { dispatch } = this.props;
    const { roleId } = this.props;
    const { menulist } = this.state;
    const menuvalue = this.state.menulist;
    return dispatch({
      type: 'rolemenu/unpdatemune',
      payload: { roleId, menuvalue },
    }).then(res => {
      if (res.code === 200) {
        Message.success(res.msg);
        this.onClose();
      } else {
        Message.error('配置菜单失败！');
      }
    });
  };

  loadsysMenu = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rolemenu/fetchdatas',
    });
  };

  loadroleMenu = () => {
    const { roleId, dispatch } = this.props;
    return dispatch({
      type: 'rolemenu/querymune',
      payload: { roleId },
    });
  };

  showDrawer = () => {
    this.setState({
      visible: true,
    });
    this.loadsysMenu();
    this.loadroleMenu();
  };

  getParentKey = (key, data) => {
    let parentKey;
    for (let i = 0; i < data.length; i += 1) {
      if (data[i].id === key && data[i].pid !== '1') {
        parentKey = data[i].pid;
        this.getParentKey(data[i].pid, data);
      }
    }
    return parentKey
  }

  handleSearchChange = value => {
    const { data } = this.props.rolemenu.sysmenu;
    const Keys = data.filter((item) => item && item.menuDesc.indexOf(value) > -1);
    const expandedKeys = Keys.map(item => item.pid);
    const parentKeys = data.map(item => {
      if (item.menuDesc.indexOf(value) > -1) {
        return this.getParentKey(item.pid, data)
      }
    }).filter(item => item && item);
    this.setState({
      expandedKeys: [...expandedKeys, ...parentKeys],
      searchValue: value,
    });
  };

  change

  render() {
    const { visible, expandedKeys, searchValue } = this.state;
    const {
      loading,
      children,
      title,
      roleId,
      rolemenu: { sysmenu, rolemenus },
    } = this.props;
    const dataSource = toTree(sysmenu.data || []);
    const targetKeys = rolemenus && rolemenus.data && rolemenus.data.map(item => item.id);
    // this.setState({ menulist: targetKeys })
    const loop = data =>
      data.map(item => {
        const index = item.title.indexOf(searchValue);
        const beforeStr = item.title.substr(0, index);
        const afterStr = item.title.substr(index + searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span style={{ color: '#f50' }}>{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{item.title}</span>
          );
        if (item.children) {
          return (
            <TreeNode key={item.key} title={title}>
              {loop(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.key} title={title} />;
      });
    return (
      <>
        {withClick(children, this.showDrawer)}
        <Drawer
          title={title}
          width={600}
          onClose={this.onClose}
          visible={visible}
          bodyStyle={{ paddingBottom: 60 }}
          // destroyOnClose
          key={roleId}
        >
          {/* <MenuTransfer
            sysmenu={sysmenu.data}
            rolemenus={rolemenus.data}
            openloading={loading}
            UpdateMenu={this.handleChange}
          /> */}
          {visible && (<div>
            <Search style={{ marginBottom: 8 }} placeholder="请输入关键字" onSearch={this.handleSearchChange} />
            {sysmenu && sysmenu.data && rolemenus && rolemenus.data &&
              <Tree
                checkable
                checkStrictly
                defaultCheckedKeys={targetKeys}
                onCheck={this.handleChange}
                onExpand={this.onExpand}
                expandedKeys={expandedKeys}
                // defaultExpandAll={defaultExpandAll}
                defaultExpandParent
              >
                {loop(dataSource)}
              </Tree>}
          </div>)}
          <div
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e9e9e9',
              padding: '10px 16px',
              background: '#fff',
              textAlign: 'right',
            }}
          >
            <Button onClick={this.onClose} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button onClick={this.handleOk} type="primary">
              提交
            </Button>
          </div>
        </Drawer>
      </>
    );
  }
}
export default RoleMenu;
