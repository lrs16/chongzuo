import React, { Component } from 'react';
import { Form, Input, Modal, AutoComplete, Select } from 'antd';
import { connect } from 'dva';
const { Option, OptGroup } = Select;

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
const withClick = (element, handleClick = () => { }) => {
  return <element.type {...element.props} onClick={handleClick} />;
};

@connect(({ softexetute, loading }) => ({
  softexetute,
  loading: loading.models.softexetute,
}))
class StartModal extends Component {
  state = {
    visible: false,
    ipDropdownVal: ['172.16.4.211', '10.172.210.13', '10.172.208.13'], // 主机IP下拉值
    portDropdownVal: ['22', '3000', '8080', '8000'], // 主机端口下拉值
    userNameDropdownVal: ['user', 'root', 'admin', 'Administrator', 'webApp'], // 主机账号下拉值
  };

  handleopenClick = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    this.props.form.validateFields((err, values) => {
      // console.log(values);
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

  onSearchIp = searchText => {
    this.setState({
      IpDropdownVal: !searchText ? [] : [searchText, searchText.repeat(2), searchText.repeat(3)],
    });
  };

  onSearchPort = searchText => {
    this.setState({
      portDropdownVal: !searchText ? [] : [searchText, searchText.repeat(2), searchText.repeat(3)],
    });
  };

  onSearchUsername = searchText => {
    this.setState({
      userNameDropdownVal: !searchText ? [] : [searchText, searchText.repeat(2), searchText.repeat(3)],
    });
  };

  render() {
    const { visible, ipDropdownVal, portDropdownVal, userNameDropdownVal, } = this.state;
    const { children, title, softexetute } = this.props;

    // Form双向绑定
    const { getFieldDecorator } = this.props.form;
    const required = true;
    const { hostsIp } = softexetute.treehostdata || this.props.record;

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
                rules: [
                  {
                    required,
                    message: '主机IP不能为空',
                  },
                ],

              })(
                <AutoComplete
                  dataSource={ipDropdownVal}
                  onSearch={this.onSearchIp}
                  placeholder="请输入主机IP.."
                  allowClear
                />,
              )}
            </Form.Item>
            <Form.Item label="主机端口">
              {getFieldDecorator('hostsSshPort', {
                rules: [
                  {
                    required,
                    message: '主机端口不能为空',
                  },
                ],
              })(
                <AutoComplete
                  dataSource={portDropdownVal}
                  onSearch={this.onSearchPort}
                  placeholder="请输入主机端口.."
                  allowClear
                />,
              )}
            </Form.Item>
            <Form.Item label="主机帐号">
              {getFieldDecorator('hostsSshUsername', {
                rules: [
                  {
                    required,
                    message: '主机帐号不能为空',
                  },
                ],
              })(
                <AutoComplete
                  dataSource={userNameDropdownVal}
                  onSearch={this.onSearchUsername}
                  placeholder="请输入主机帐号.."
                  allowClear
                />,
              )}
            </Form.Item>
            <Form.Item label="主机密码">
              {getFieldDecorator('hostsSshPassword', {
                rules: [
                  {
                    required,
                    message: '主机密码不能为空',
                  },
                ],
              })(<Input type="password" />)}
            </Form.Item>
            <Form.Item label="执行命令">
              {getFieldDecorator('command', {
                rules: [
                  {
                    required,
                    message: '执行命令不能为空',
                  },
                ],
              })(
                <Select 
                   mode="tags" 
                   style={{ width: '100%' }} 
                   placeholder="请输入执行命令.." 
                >
                  <OptGroup label="Manager">
                    <Option value="jack">Jack</Option>
                    <Option value="lucy">Lucy</Option>
                  </OptGroup>
                  <OptGroup label="Engineer">
                    <Option value="Yiminghe">yiminghe</Option>
                  </OptGroup>
                </Select>
              )}
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  }
}
export default Form.create()(StartModal);
