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
    current: 1,
    pageSize: 20,
    queKey: '',
  };

  showDrawer = () => {
    this.setState({
      visible: true,
    });
    const { hostId } = this.props;
    const { softId } = this.props;
    if(hostId) {
      this.loadleftData();
      this.loadrightData();
    } else if(softId) {
      this.loadsoftleftList(); 
      this.loadsoftrightList();
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

  // handleChange = rolelist => {
  //   console.log('oo');
  //   this.setState({ rolelist });
  //   // console.log(this.state.rolelist + 'pp');
  // };

  handleOk = () => {
    const { dispatch } = this.props;
    const { hostId } = this.props;
    const { softId } = this.props;
    const { softwareId } = this.props;
    const softvalue = this.state.softlist;
    const coursevalue = this.state.softlist;
    if (hostId) {
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
    }  else if (softwareId) {
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

  loadleftData = () => {
    const page = this.state.current;
    const limit = this.state.pageSize;
    const { queKey } = this.state;
    const { dispatch } = this.props;
    const { hostId } = this.props;
    dispatch({
      type: 'softrole/fetchsoft',
      payload: {
        page,
        limit,
        queKey,
      },
    });
  };

  loadrightData = () => {
    const { hostId } = this.props;
    const { dispatch } = this.props;
    return dispatch({
      type: 'softrole/rightShuttlebox',
      payload: { hostId },
    });
  };

  //软件进程的进程列表
  loadsoftleftList = () => {
    const page = this.state.current;
    const limit = this.state.pageSize;
    const { queKey } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'softrole/softleftShuttle',
      payload:{
        page,
        limit,
        queKey
      }
    });
  };

  loadsoftrightList = () => {
    const { dispatch } = this.props;
    const { softId } = this.props;
    return dispatch({
      type: 'softrole/softrightShuttle',
      payload: { softId },
    });
  };

  onShowSizeChange = (current, pageSize) => {
    if(this.props.hostId){
      this.props.dispatch({
        type: 'softrole/fetchsoft',
        payload: {
          queKey: this.state.queKey,
          page: current,
          limit: pageSize,
        },
        },
      );
      setImmediate(() => {
        this.setState({ pageSize });
      },0)
      
    } 
  };
    // else if(this.props.softId) {
    //   this.props.dispatch({
    //     type: 'softrole/softleftShuttle',
    //     payload: {
    //       queKey: this.state.queKey,
    //       page: current,
    //       limit: pageSize,
    //     },
    //     },
    //   );
    // }
  //   setTimeout(() => {
  //     this.setState({ pageSize });
  //   }, 0);
  // };

  changePage = (page) => {
    if (this.props.hostId) {
      this.props.dispatch({
        type: 'softrole/fetchsoft',
        payload: {
          queKey: this.state.queKey,
          page,
          limit: this.state.pageSize,
        },
      });
      setTimeout(() => {
        this.setState({ current: page });
      }, 0);
    } else if (this.props.softId){
      this.props.dispatch({
        type: 'softrole/search',
        payload: {
          queKey: this.state.queKey,
          page,
          limit: this.state.pageSize,
        },
      });
      setTimeout(() => {
        this.setState({ current: page });
      }, 0);
    }
  };

  render() {
    const { visible } = this.state;
    const {
      loading,
      children,
      title,
      hostId,
      softId,
      softwareId,
      softrole: { leftbox, rightdata, softleftdata, processList },
    } = this.props;
    const leftdata = leftbox.rows;
    const softdata = softleftdata.rows;
    const total = leftdata;
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
            total={total}
            leftrole={leftdata}
            rightrole={rightdata}
            softdata={softdata}
            processList={processList}
            openloading={loading}
            hostId={hostId}
            softId={softId}
            UpdateRole={this.handleChange}
            onShowSizeChange={this.onShowSizeChange}
            changePage={this.changePage}

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
