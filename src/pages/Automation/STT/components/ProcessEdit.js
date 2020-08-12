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
    const { 
      id,
      createUser,
      updateTime,
      courseCode,
      courseName,
      courseRemark,
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
            <Form.Item label="数据编号">
              {getFieldDecorator('id', {
                initialValue: id,
              })(<Input disabled />)}
            </Form.Item>

            <Form.Item label="创建人">
              {getFieldDecorator('createUser', {
                // rules: [
                //   {
                //     required,
                //     message: '请输入',
                //   },
                // ],
                initialValue: createUser,
              })(<Input placeholder="请输入..." />)}
            </Form.Item>

            <Form.Item label="进程代码">
              {getFieldDecorator('courseCode', {
                rules: [
                  {
                    required,
                    message: '请输入',
                  },
                ],
                initialValue: courseCode,
              })(<Input placeholder="请输入..." />)}
            </Form.Item>

            <Form.Item label="进程名称">
              {getFieldDecorator('courseName', {
                rules: [
                  {
                    required,
                    message: '请输入',
                  },
                ],
                initialValue: courseName,
              })(<Input placeholder="请输入..." />)}
            </Form.Item>

            <Form.Item label="进程备注">
              {getFieldDecorator('courseRemark', {
                rules: [
                  {
                    required,
                    message: '请输入',
                  },
                ],
                initialValue: courseRemark,
              })(<Input placeholder="请输入..." />)}
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  }
}
ProcessEdit.defaultProps = {
  title: '添加进程',
  record: {
    id: '',
    createUser: '',
    updateTime: '',
    courseCode: '',
    courseName: '',
    courseRemark: '',
  },
};
export default Form.create()(ProcessEdit);
