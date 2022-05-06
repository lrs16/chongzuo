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
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  onExpand = expandedKeys => {
    this.setState({
      // expandedKeys,
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
    const menuvalue = this.state.menulist;
    console.log(menuvalue);
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

  handleSearchChange = e => {
    const { value } = e.target;
    console.log(value);
  };

  change

  render() {
    const { visible } = this.state;
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
          <div>
            <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={this.handleSearchChange} />
            {sysmenu && sysmenu.data && rolemenus && rolemenus.data &&
              <Tree
                checkable
                checkStrictly
                defaultCheckedKeys={targetKeys}
                onCheck={this.handleChange}
                // onExpand={this.onExpand}
                // //expandedKeys={expandedKeys}
                // defaultExpandAll={defaultExpandAll}
                defaultExpandParent
              >
                {generateTree(dataSource, targetKeys)}
              </Tree>}
          </div>
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
