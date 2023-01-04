/* eslint-disable no-useless-constructor */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { Form, Input, Button, Radio, Drawer } from 'antd';

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
const RadioGroup = Radio.Group;
// 克隆子元素按钮，并添加事件
const withClick = (element, handleClick = () => { }) => {
  return <element.type {...element.props} onClick={handleClick} />;
};
class ReloModal extends Component {
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
    // console.log(this.props.record);
    const { id, roleCode, roleName, roleRemark, roleStatus } = this.props.record;
    return (
      <>
        {withClick(children, this.handleopenClick)}
        <Drawer
          title={title}
          width={600}
          onClose={this.hanldleCancel}
          visible={visible}
          bodyStyle={{ paddingBottom: 60 }}
        // destroyOnClose
        >
          <Form {...formItemLayout} onSubmit={this.handleOk}>
            <Form.Item label="ID">
              {getFieldDecorator('id', {
                initialValue: id,
              })(<Input placeholder="系统生成" disabled />)}
            </Form.Item>
            <Form.Item label="角色代码">
              {getFieldDecorator('roleCode', {
                rules: [
                  {
                    required,
                    message: '请输入角色代码',
                  },
                ],
                initialValue: roleCode,
              })(<Input placeholder="请输入" disabled={roleCode === 'admin'} />)}
            </Form.Item>
            <Form.Item label="角色名称">
              {getFieldDecorator('roleName', {
                rules: [
                  {
                    required,
                    message: '请输入角色名称',
                  },
                ],
                initialValue: roleName,
              })(<Input placeholder="请输入" />)}
            </Form.Item>
            <Form.Item label="角色描述">
              {getFieldDecorator('roleRemark', {
                initialValue: roleRemark,
              })(<Input placeholder="请输入" />)}
            </Form.Item>
            <Form.Item label="启用状态">
              {getFieldDecorator('roleStatus', {
                rules: [
                  {
                    required,
                    message: '请选择是否启用',
                  },
                ],
                initialValue: roleStatus,
              })(
                <RadioGroup>
                  <Radio value="1">启用</Radio>
                  <Radio value="0">停用</Radio>
                </RadioGroup>,
              )}
            </Form.Item>
          </Form>
          <div
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e9e9e9',
              padding: '10px 16px',
              background: '#fff',
              textAlign: 'right',
            }}
          >
            <Button onClick={this.hanldleCancel} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button onClick={this.handleOk} type="primary">
              提交
            </Button>
          </div>
        </Drawer>
      </>
    );
  }
}
ReloModal.defaultProps = {
  title: '新建角色',
  record: { id: '', roleCode: '', roleName: '', roleRemark: '', roleStatus: '' },
};
export default Form.create()(ReloModal);
