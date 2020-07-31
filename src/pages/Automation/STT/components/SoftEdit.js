import React, { Component } from 'react';
import { Form, Input, Modal, Radio } from 'antd';
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

class SoftEdit extends Component {
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

  hanldeCancel = () => {
    this.setState({
      visible: false,
    });
    this.props.form.resetFields();
  };

  handleOk = () => {
    this.props.form.validateFields((err, value) => {
      if (!err) {
        this.hanldeCancel();

        this.props.onSumit(value);
        this.props.form.resetFields();
      }
    });
  };

  render() {
    const { visible } = this.state;
    const { children, title } = this.props;
    const { getFieldDecorator } = this.props.form;
    const required = true;
    const { code, softName, version, updateTime, statue } = this.props.record;

    return (
      <>
        {withClick(children, this.handleopenClick)}
        <Modal
          title={title}
          visible={visible}
          centered
          masClosable={false}
          onCancel={this.hanldeCancel}
          onOk={this.handleOk}
        >
          <Form {...formItemLayout}>
            <Form.Item label="编码">
              {getFieldDecorator('code', {
                initialValue: code,
              })(<Input disabled></Input>)}
            </Form.Item>

            <Form.Item label="软件名称">
              {getFieldDecorator('softName', {
                rules: [
                  {
                    required,
                    message: '请输入',
                  },
                ],
                initialValue: softName,
              })(<Input placeholder="请输入" />)}
            </Form.Item>

            <Form.Item label="版本">
              {getFieldDecorator('version', {
                rules: [
                  {
                    required,
                    message: '请输入',
                  },
                ],
                initialValue: version,
              })(<Input placeholder="请输入" />)}
            </Form.Item>

            <Form.Item label="更新时间">
              {getFieldDecorator('updateTime', {
                rules: [
                  {
                    required,
                    message: '请输入',
                  },
                ],
                initialValue: updateTime,
              })(<Input placeholder="请输入" />)}
            </Form.Item>

            <Form.Item label="状态">
              {getFieldDecorator('statue', {
                initialValue: statue,
              })(
                <Radio.Group>
                  <Radio value="0">离线</Radio>
                  <Radio value="1">在线</Radio>
                </Radio.Group>,
              )}
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  }
}
SoftEdit.defaultProps = {
  title: '编辑软件',
  record: {
    code: '',
    softName: '',
    version: '',
    updateTime: '',
    statue: '',
  },
};
export default Form.create()(SoftEdit);
