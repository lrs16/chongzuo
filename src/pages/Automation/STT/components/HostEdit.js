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

// 克隆子元素按钮，并添加事件
const withClick = (element, handleClick = () => {}) => {
  return <element.type {...element.props} onClick={handleClick} />;
};

class HostEdit extends Component {
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

  hanldleCancel = () => {
    this.setState({
      visible: false,
    });
    this.props.form.resetFields();
  };

  handleOk = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // 关闭弹窗
        this.hanldleCancel();
        // 传数据
        this.props.onSumit(values);
        this.props.form.resetFields();
      }
    });
  };

  render() {
    const { visible } = this.state;
    const { children, title } = this.props;

    // Form双向绑定
    const { getFieldDecorator } = this.props.form;
    const required = true;
    const { code, group, equipmentName, ip, statue } = this.props.record;

    return (
      <>
        {withClick(children, this.handleopenClick)}
        <Modal
          title={title}
          visible={visible}
          centered
          maskClosable={false}
          onCancel={this.hanldleCancel}
          onOk={this.handleOk}
        >
          <Form {...formItemLayout}>
            <Form.Item label="编码">
              {getFieldDecorator('code', {
                initialValue: code,
              })(<Input placeholder="系统生成" disabled />)}
            </Form.Item>

            <Form.Item label="分组">
              {getFieldDecorator('group', {
                rules: [
                  {
                    required,
                    message: '请输入',
                  },
                ],
                initialValue: group,
              })(<Input placeholder="请输入" />)}
            </Form.Item>

            <Form.Item label="主机名称">
              {getFieldDecorator('equipmentName', {
                rules: [
                  {
                    required,
                    message: '请输入',
                  },
                ],
                initialValue: equipmentName,
              })(<Input placeholder="请输入" />)}
            </Form.Item>

            <Form.Item label="IP">
              {getFieldDecorator('ip', {
                rules: [
                  {
                    required,
                    message: '请输入',
                  },
                ],
                initialValue: ip,
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
HostEdit.defaultProps = {
  title: '编辑硬件',
  record: {
    code: '',
    group: '',
    equipmentName: '',
    ip: '',
    statue: '',
  },
};
export default Form.create()(HostEdit);
