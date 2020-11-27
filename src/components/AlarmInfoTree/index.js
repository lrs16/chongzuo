/* eslint-disable no-restricted-syntax */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Tree,Icon, Menu, Dropdown,Popconfirm,Row,Col } from 'antd';
// import styles from './index.less';
import NotifiGroupadd from '@/pages/Alarmmanage/MeasurAlarm/components/NotifiGroupadd';
// 展示组织结构树
const { TreeNode } = Tree;
let fatherNodeid;

@connect(({ alarminfotree, loading }) => ({
  alarminfotree,
  loading: loading.models.alarminfotree,
}))
class DeptTree extends Component {

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'alarminfotree/fetch',
    });
  }

  handleMenuClick = e => {
    fatherNodeid = e;
  };

  handleConfirm = () => {
    const id = fatherNodeid;
    console.log(id,'id');
  }

  onDelete = (childrenId) => {
    console.log(childrenId,'childrenId');
  }

  menu = (
    <Menu>
      <Menu.Item key="1">
        <NotifiGroupadd>
          <a>编辑通知组 </a>
        </NotifiGroupadd>
      </Menu.Item>
      
      <Menu.Item key="2">
        <Popconfirm
        title="你确定删除解散改组吗?"
        onConfirm={this.handleConfirm}
        // onCancel={cancel}
        okText="Yes"
        cancelText="No"
      >
        <a href="#">删除通知组</a>
      </Popconfirm>
     
      </Menu.Item>
    </Menu>
  );


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
      const obj = item;
      obj.title = (
        <>
          <span>
            {obj.name}
          </span>
          {/* <Icon style={{ marginLeft: 10 }} type='edit' onClick={() => this.onEdit(item.key)} /> */}
          <Icon style={{ marginLeft: 10 }} type='plus' onClick={() => this.onDelete(obj.id)} />
          <Icon style={{ marginLeft: 10 }} type='minus' onClick={() => this.onDelete(obj.id)} />
        </>
      )
      if (item.children) {
        const fatherObj = item;
        fatherObj.title = (
          <>
            {/* <Row> */}
              {/* <Col span={21}> */}
                <span>
                {obj.name}
                </span>
              {/* </Col> */}

              {/* <Col span={3}> */}
                <Dropdown overlay={this.menu} trigger={['click']}>
                  <a className="ant-dropdown-link" onClick={ () => this.handleMenuClick(fatherObj.id)}>
                  <Icon type="menu-unfold" style={{ marginLeft:30,color:'black'}}/>
                  </a>
                </Dropdown>
              {/* </Col> */}
              {/* </Row> */}
          </>
        )

        return (
          //  父节点
          <TreeNode 
          title={fatherObj.name} 
          key={fatherObj.id} 
          dataRef={fatherObj} 
          selectable
          {...fatherObj}
          >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
//  子节点
      return <TreeNode key={obj.id} title={obj.name} {...obj}/>;
    });

  onSelect = (selectedKeys, info) => {
    if(selectedKeys !== undefined) {
      this.props.toFatherValue(selectedKeys);
    }
  };

  render() {

    const {
      alarminfotree: { data },
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
            // switcherIcon={<Icon type="menu" />}
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
