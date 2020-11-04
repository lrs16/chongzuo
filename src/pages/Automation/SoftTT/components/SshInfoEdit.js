import React, { Component } from 'react';
import { connect } from 'dva';
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

const withClick = (element, handleClick = () => { }) => {
  return <element.type {...element.props} onClick={handleClick} />;
};

@connect(({ softexetute, loading }) => ({
  softexetute,
  loading: loading.models.softexetute,
}))

class SshInfoEdit extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    visible: false,
    values: {},
  };

  handleInputValueFous = () => {
    this.props.form.setFieldsValue({ hostsSshPassword: '' });
  }

  handleInputValueBlur = () => {
    this.props.form.validateFields((err, values) => {
      const { hostsSshPassword } = values;
      if (hostsSshPassword === this.state.values.hostsSshPassword || hostsSshPassword === '') {
        this.props.form.setFieldsValue({ hostsSshPassword: this.state.values.hostsSshPassword });
      } else {
        this.props.form.setFieldsValue({ hostsSshPassword });
      }
    });
  }

  handleopenClick = () => {
    this.setState({
      visible: true,
    });
    const id = this.props.record.id;
    const { dispatch } = this.props;
    return dispatch({
      type: 'softexetute/searchSshInfotoEdit',
      payload: { id },
    }).then(res => {
      if (res.code === 200) {
        this.setState({ values: res.data });
      }
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
    // const { hostsIp, hostsSshUsername, hostsSshPassword, hostsSshPort} = this.props.record;
    const { hostsIp, hostsSshUsername, hostsSshPassword, hostsSshPort } = this.state.values;
    return (
      <>
        {withClick(children, this.handleopenClick)}
        <Modal
          title={title}
          visible={visible}
          centered
          onCancel={this.handleCancel}
          onOk={this.handleOk}
        >
          <Form {...formItemLayout}>
            <Form.Item label="主机IP">
              {getFieldDecorator('hostsIp', {
                initialValue: hostsIp,
              })(<Input disabled />)}
            </Form.Item>

            <Form.Item label="帐号名称">
              {getFieldDecorator('hostsSshUsername', {
                rules: [
                  {
                    required,
                    message: '请输入...',
                  },
                ],
                initialValue: hostsSshUsername,
              })(<Input disabled />)}
            </Form.Item>

            <Form.Item label="帐号密码">
              {getFieldDecorator('hostsSshPassword', {
                rules: [
                  {
                    required,
                    message: '请输入...',
                  }, {
                    min:4,
                    message: '密码不能少于4个字符',
                  }, {
                    max:6,
                    message: '密码不能大于6个字符',
                  }
                ],
                initialValue: hostsSshPassword,
              })(<Input type="password" onFocus={() => this.handleInputValueFous()} onBlur={() => this.handleInputValueBlur()} />)}
            </Form.Item>

            <Form.Item label="使用端口">
              {getFieldDecorator('hostsSshPort', {
                rules: [
                  {
                    required,
                    message: '请输入...',
                  },
                ],
                initialValue: hostsSshPort,
              })(<Input type="number" />)}
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  }
}
SshInfoEdit.defaultProps = {
  title: '编辑',
  record: {
    hostsIp: '',
    hostsSshUsername: '',
    hostsSshPassword: '',
    hostsSshPort: '',
  },
};
export default Form.create()(SshInfoEdit);

