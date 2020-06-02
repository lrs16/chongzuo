import React, { Component } from 'react';
import { connect } from 'dva';
import { Drawer, Button ,Message} from 'antd';
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
    menulist:[],
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

  handleChange = menulist =>{
    this.setState(
      
      { menulist });
  };


  handleOk = () => {
    const { dispatch } = this.props;
    const {roleId} = this.props;
    const menuvalue =  this.state.menulist;
   // console.log(menuvalue);
    return dispatch({
      type: 'rolemenu/unpdatemune',
      payload: { roleId ,menuvalue},
    }).then(res=>{
      if (res.code === 200) {
        Message.success(res.msg);
        this.onClose();
      } else {
        Message.error('配置菜单失败！');
      }

    });
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
      loading,
      children, 
      title ,
      roleId,
      rolemenu: { sysmenu,rolemenus },
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
          // destroyOnClose
          key={roleId}
        >
          <MenuTransfer 
          sysmenu={sysmenu.data}
          rolemenus={rolemenus.data}
          openloading={loading} 
          UpdateMenu={this.handleChange}
         
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
