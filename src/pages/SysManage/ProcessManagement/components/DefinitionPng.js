import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal } from 'antd';

const withClick = (element, handleClick = () => {}) => {
  return <element.type {...element.props} onClick={handleClick} />;
};

@connect(({ processmanagement, loading }) => ({
  processmanagement,
  loading: loading.models.processmanagement,
}))
class DefinitionPng extends Component {
  state = {
    visible: false,
    imgSrc: '',
  };

  handleopenClick = () => {
    const {
      processmanagement: { editInfo },
    } = this.props;
    const blob = new Blob([editInfo]);
    const imageUrl = (window.URL || window.webkitURL).createObjectURL(blob);
    this.setState({ imgSrc: imageUrl });

    const { id } = this.props;
    const { resourceName } = this.props;
    this.props.dispatch({
      type: 'processmanagement/imgResource',
      payload: {
        id,
        resourceName,
      },
    });
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    this.handleCancel();
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { visible } = this.state;
    const { children, title } = this.props;
    return (
      <>
        {withClick(children, this.handleopenClick)}
        <Modal
          title={title}
          visible={visible}
          centered
          maskClosable={false}
          width={750}
          onCancel={this.handleCancel}
          onOk={this.handleOk}
        >
          <img src={this.state.imgSrc} alt="" />
        </Modal>
      </>
    );
  }
}

export default DefinitionPng;
