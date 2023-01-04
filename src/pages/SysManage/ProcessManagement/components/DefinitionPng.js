import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal } from 'antd';
import styles from './../style.less';

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
      // processmanagement: { editInfo },
      id, resourceName
    } = this.props;
    
    this.props.dispatch({
      type: 'processmanagement/imgresource',
      payload: {
        id,
        resourceName,
      },
    }).then(response => {
        const blob = new Blob([response]);
        const imageUrl = (window.URL || window.webkitURL).createObjectURL(blob);
        this.setState({ imgSrc: imageUrl });
    })
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
          width='60%'
          onCancel={this.handleCancel}
          onOk={this.handleOk}
        >
          <div className={styles.blobimg}>
            <img src={this.state.imgSrc} alt="" style={{ background: '#fff' }} />
          </div>
        </Modal>
      </>
    );
  }
}

export default DefinitionPng;
