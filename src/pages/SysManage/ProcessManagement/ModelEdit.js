import React, { Component } from 'react';
import { Form, Button } from 'antd';

class ModelEdit extends Component {
  state = {
    isFullScreen: false,
    height: '',
    content: '全屏',
  };

  componentDidMount() {
    this.getHeight();
  }

  getHeight = () => {
    const iframeheight = document.documentElement.clientHeight;
    this.setState({ height: iframeheight })
  }

  fullScreen = () => {
    if (!this.state.isFullScreen) {
      this.requestFullScreen();
      this.setState({ content: '退出全屏', isFullScreen: true });
    } else {
      this.exitFullscreen();
      this.setState({ content: '全屏', isFullScreen: false });
    }
  };

  // 进入全屏
  requestFullScreen = () => {
    const de = document.documentElement;
    if (de.requestFullscreen) {
      de.requestFullscreen();
    } else if (de.mozRequestFullScreen) {
      de.mozRequestFullScreen();
    } else if (de.webkitRequestFullScreen) {
      de.webkitRequestFullScreen();
    }
  };

  // 退出全屏
  exitFullscreen = () => {
    const de = document;
    if (de.exitFullscreen) {
      de.exitFullscreen();
      this.setState({ content: '全屏', isFullScreen: false });
    } else if (de.mozCancelFullScreen) {
      de.mozCancelFullScreen();
    } else if (de.webkitCancelFullScreen) {
      de.webkitCancelFullScreen();
    }
  };

  render() {
    const { params: { id } } = this.props.match;

    return (
      <>
        <Button type='primary' onClick={this.fullScreen} style={{ float: 'right', marginBottom: 5 }}>{this.state.content}</Button>
        <div>
          <iframe
            id='modelsId'
            title='模型编辑'
            width='100%'
            height={this.state.height}
            frameBorder="0"
            scrolling="no"
            style={{ border: 0 }}
            src={`http://172.16.4.211:9901/modeler/modeler.html?modelId=${id}`}
          />
        </div>
      </>
    );
  }
}

export default Form.create()(ModelEdit);
