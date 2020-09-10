import React, { Component } from 'react';
import { connect } from 'dva';
import { Drawer, Button, Message } from 'antd';
import SoftTransfer from './SoftTransfer';

// 克隆子元素按钮，并添加事件
const withClick = (element, showDrawer = () => {}) => {
  return <element.type {...element.props} onClick={showDrawer} />;
};
@connect(({ softrole, loading }) => ({
  softrole,
  loading: loading.models.softrole,
}))
class HostSoft extends Component {
  state = {
    visible: false,
    softlist: [],
    courselist: [],
  };

  showDrawer = () => {
    this.setState({
      visible: true,
    });
    if (this.props.hostId) {
      this.loadsoftData();
      this.loadhostData();
    } else if (this.props.softwareId) {
      this.loadsoftList();
      this.loadprocessList();
    }
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  handleChange = softlist => {
    this.setState({ softlist });
  };

  handleOk = () => {
    const { dispatch } = this.props;
    const { hostId } = this.props;
    const { softwareId } = this.props;
    const softvalue = this.state.softlist;
    const coursevalue = this.state.softlist;
    if (this.props.hostId) {
      return dispatch({
        type: 'softrole/updatehostrole',
        payload: { hostId, softvalue },
      }).then(res => {
        if (res.code === 200) {
          Message.success(res.msg);
          this.onClose();
        } else {
          Message.error('配置权限失败');
        }
      });
    } else if (this.props.softwareId) {
      return dispatch({
        type: 'softrole/updatesoftrole',
        payload: { softwareId, coursevalue },
      }).then(res => {
        if (res.code === 200) {
          Message.success(res.msg);
          this.onClose();
        } else {
          Message.error('配置权限失败');
        }
      });
    }
  };

  loadhostData = () => {
    const { dispatch } = this.props;
    const { hostId } = this.props;
    dispatch({
      type: 'softrole/hostShuttlebox',
      payload: { hostId },
    });
  };

  loadsoftData = () => {
    const { hostId } = this.props;
    const { dispatch } = this.props;
    return dispatch({
      type: 'softrole/softShuttlebox',
      payload: { hostId },
    });
  };

  //软件进程的主机列表
  loadsoftList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'softrole/softShuttle',
    });
  };

  loadprocessList = () => {
    const { dispatch } = this.props;
    const { softwareId } = this.props;
    return dispatch({
      type: 'softrole/processShuttlebox',
      payload: { softwareId },
    });
  };

  // loadsofts = () => {
  //   const { roleId } = this.props;
  //   const { dispatch } = this.props;
  //   return dispatch({
  //     type: 'rolemenu/querymune',
  //     payload: { roleId },
  //   });
  // };

  render() {
    const { visible } = this.state;
    const {
      loading,
      children,
      title,
      hostId,
      hostName,
      softwareId,
      softrole: { hostrole, softrole, softdata, processList },
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
          //  key={roleId}
        >
          <SoftTransfer
            hostrole={hostrole}
            softrole={softrole}
            softdata={softdata}
            processList={processList}
            openloading={loading}
            hostId={hostId}
            softwareId={softwareId}
            UpdateRole={this.handleChange}
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
export default HostSoft;
