import React, { Component } from 'react';
import { connect } from 'dva';
import { Drawer, Button, Message } from 'antd';

//克隆子元素按钮，并添加事件
const withClick = (element, showDrawer = () => {}) => {
  return <element.type {...element.props} onClick={showDrawer} />;
};

class SoftProcess extends Component {
  render() {
    return <div>软件与进程关系</div>;
  }
}

export default SoftProcess;
