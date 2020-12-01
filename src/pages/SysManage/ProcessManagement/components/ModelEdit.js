import React, { Component } from 'react';
import { Form, Input, Modal } from 'antd';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
  colon: false,
};

const withClick = (element, handleClick = () => {}) => {
  return <element.type {...element.props} onClick={handleClick} />;
};

class ProcessModel extends Component {

  state = {
    visible: false,
  };

  handleopenClick = () => {
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
    const { getFieldDecorator } = this.props.form;
    const required = true;
 
    const {
      name,
      description,
      key
    } = this.props.record;

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
          <Form {...formItemLayout}>
            <Form.Item label="模型说明">
              {getFieldDecorator('description', {
                initialValue:description || '',
              })(<Input  />)}
            </Form.Item>

            <Form.Item label="模型Key">
              {getFieldDecorator('key', {
                rules: [
                  {
                    required,
                    message: '请输入',
                  },
                ],
                initialValue:key || '' ,
              })(<Input placeholder="请输入..." />)}
            </Form.Item>

            <Form.Item label="模型名称">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required,
                    message: '请输入',
                  },
                ],
                initialValue: name || '',
              })(<Input placeholder="请输入..." />)}
            </Form.Item>

          </Form>
        </Modal>
      </>
    );
  }
}
ProcessModel.defaultProps = {
  title: '添加进程',
  record: {
    description: '',
    key: '',
    name: '',
  },
};
export default Form.create()(ProcessModel);
