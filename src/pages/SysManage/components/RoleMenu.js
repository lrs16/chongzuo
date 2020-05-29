import React, { Component } from 'react';
import { connect } from 'dva';
import { Drawer, Button } from 'antd';
import MenuTransfer from './MenuTransfer';

// 克隆子元素按钮，并添加事件
const withClick = (element, showDrawer = () => {}) => {
  return <element.type {...element.props} onClick={showDrawer} />;
};
@connect(({ rolemenu, loading }) => ({
  rolemenu,
  loading: loading.models.rolemenu,
}))
class RoleMenu extends Component {

  state = {
    visible: false,
  };

  showDrawer = () => {
    this.setState({
      visible: true,
    });
    this.loadsysMenu();
    this.loadroleMenu();
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  handleOk = () => {
    this.onClose();
    // 传数据
    // this.props.onDoSumit(values);
  };

  loadsysMenu = () =>{
    const { dispatch } = this.props;
    dispatch({
      type: 'rolemenu/fetchdatas',
    });
  };

  loadroleMenu = () => {
    const {roleId} = this.props;
    const { dispatch } = this.props;
    return dispatch({
      type: 'rolemenu/querymune',
      payload: { roleId },
    });
  };

  render() {
    const { visible } = this.state;
    const { 
      children, 
      title ,
      rolemenu: { sysmenu,rolemenus },
      loading,
    } = this.props;
    return (
      <>
        {withClick(children, this.showDrawer)}
        <Drawer
          title={title}
          width={720}
          onClose={this.onClose}
          visible={visible}
          bodyStyle={{ paddingBottom: 60 }}
        >
          <MenuTransfer 
          loading={loading} 
          sysmenu={sysmenu.data}
          rolemenus={rolemenus.data}
          />
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
            <Button onClick={this.onClose} type="primary">
              提交
            </Button>
          </div>
        </Drawer>
      </>
    );
  }
}
export default RoleMenu;
