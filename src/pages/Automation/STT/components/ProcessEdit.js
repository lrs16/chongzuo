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

class ProcessEdit extends Component {
  constructor(props) {
    super(props);
  }

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
    const { application, processName, cpu, memory, disk, network } = this.props.record;

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
            <Form.Item label="应用">
              {getFieldDecorator('application', {
                rules: [
                  {
                    required,
                    message: '请输入',
                  },
                ],
                initialValue: application,
              })(<Input placeholder="请输入应用名称" />)}
            </Form.Item>

            <Form.Item label="进程名称">
              {getFieldDecorator('processName', {
                rules: [
                  {
                    required,
                    message: '请输入进程名称',
                  },
                ],
                initialValue: processName,
              })(<Input placeholder="请输入进程名称" />)}
            </Form.Item>

            <Form.Item label="CPU">
              {getFieldDecorator('cpu', {
                rules: [
                  {
                    required,
                    message: '请输入CPU',
                  },
                ],
                initialValue: cpu,
              })(<Input placeholder="请输入CPU" />)}
            </Form.Item>

            <Form.Item label="内存">
              {getFieldDecorator('memory', {
                rules: [
                  {
                    required,
                    message: '请输入内存',
                  },
                ],
                initialValue: memory,
              })(<Input placeholder="请输入内存" />)}
            </Form.Item>

            <Form.Item label="磁盘">
              {getFieldDecorator('disk', {
                rules: [
                  {
                    required,
                    message: '请输入磁盘',
                  },
                ],
                initialValue: disk,
              })(<Input placeholder="请输入磁盘" />)}
            </Form.Item>

            <Form.Item label="网络">
              {getFieldDecorator('network', {
                rules: [
                  {
                    required,
                    message: '请输入网络',
                  },
                ],
                initialValue: network,
              })(<Input placeholder="请输入网络" />)}
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  }
}
ProcessEdit.defaultProps = {
  title: '新建进程',
  record: {
    application: '',
    processName: '',
    cpu: '',
    memory: '',
    disk: '',
    network: '',
  },
};
export default Form.create()(ProcessEdit);
