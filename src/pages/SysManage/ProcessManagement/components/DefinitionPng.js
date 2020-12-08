import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Modal } from 'antd';

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
    imgSrc:''
  };

  handleopenClick = () => {
    const { id } = this.props;
    const { resourceName } = this.props;
    this.props.dispatch({
      type:'processmanagement/imgResource',
      payload: {
        id,
        resourceName
      }
    });
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.handleCancel();
        this.props.onSumit(values);
        this.props.form.resetFields();
      }
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
    this.props.form.resetFields();
  };

  render() {
    const { visible } = this.state;
    const { children, title } = this.props;
    const { imgSrc } = this.props;
    console.log('imgSrc: ', imgSrc);
   
 
    return (
      <>
        {withClick(children, this.handleopenClick)}
        <Modal
          title={title}
          visible={visible}
          centered
          maskClosable={false}
          onCancel={this.handleCancel}
          onOk={this.handleOk}
        >
          <div>
            <img src={this.state.imgSrc} alt="" />
          </div>
         
        </Modal>
      </>
    );
  }
}

export default Form.create()(DefinitionPng);
