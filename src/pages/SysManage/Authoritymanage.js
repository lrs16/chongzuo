/* eslint-disable react/no-unused-state */
/* eslint-disable react/sort-comp */
/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Form, Tabs, Tree } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const { TabPane } = Tabs;
const { TreeNode } = Tree;
@connect(({ autmanage, loading }) => ({
  autmanage,
  loading: loading.models.autmanage,
}))
class Authoritymanage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabPosition: 'left',
      showLine: 'true',
      TreeDatas: [],
      autoExpandParent: true,
      selectedKeys: [],
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'autmanage/fetch',
    });
  }

  onExpand = expandedKeys => {
    console.log('onExpand', expandedKeys);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onCheck = checkedKeys => {
    console.log('onCheck', checkedKeys);
    this.setState({ checkedKeys });
  };

  onSelect = (selectedKeys, info) => {
    console.log('onSelect', info);
    this.setState({ selectedKeys });
  };

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} {...item} />;
    });

  render() {
    const { autmanage = {} } = this.props;
    const { TreeDatas = [] } = autmanage;
    return (
      <PageHeaderWrapper title="权限管理">
        <Card>
          <Tabs tabPosition={this.state.tabPosition}>
            <TabPane tab="系统管理" key="1">
              <Tree
                checkable
                onExpand={this.onExpand}
                expandedKeys={this.state.expandedKeys}
                autoExpandParent={this.state.autoExpandParent}
                onCheck={this.onCheck}
                checkedKeys={this.state.checkedKeys}
                onSelect={this.onSelect}
                selectedKeys={this.state.selectedKeys}
                showLine={this.state.showLine}
              >
                {this.renderTreeNodes(TreeDatas)}
              </Tree>
            </TabPane>
            <TabPane tab="部门管理" key="2">
              Content of Tab 2
            </TabPane>
            <TabPane tab="配置管理" key="3">
              Content of Tab 3
            </TabPane>
            <TabPane tab="普通用户" key="4">
              Content of Tab 4
            </TabPane>
          </Tabs>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Authoritymanage;
