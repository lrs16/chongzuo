/* eslint-disable no-useless-constructor */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { Form, Input, Modal, Radio } from 'antd';
// import SelectPid from '@/components/DeptTree/SelectPid';
// import { element } from 'prop-types';

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
const withClick = (element, handleClick = () => {}) => {
  return <element.type {...element.props} onClick={handleClick} />;
};
class MenuModal extends Component {
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

  getPid = () => {};

  render() {
    const { visible } = this.state;
    const { children, title } = this.props;

    // Form双向绑定
    const { getFieldDecorator } = this.props.form;
    const required = true;
    // console.log(this.props.record);
    const { id, deptName, deptRemark, deptSort, pid, deptStatus } = this.props.record;
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
            <Form.Item label="组织编码">
              {getFieldDecorator('id', {
                initialValue: id,
              })(<Input placeholder="系统生成" disabled />)}
            </Form.Item>
            <Form.Item label="组织名称">
              {getFieldDecorator('deptName', {
                rules: [
                  {
                    required,
                    message: '请输入组织名称',
                  },
                ],
                initialValue: deptName,
              })(<Input placeholder="请输入" />)}
            </Form.Item>
            <Form.Item label="组织备注">
              {getFieldDecorator('deptRemark', {
                initialValue: deptRemark,
              })(<Input placeholder="请输入" />)}
            </Form.Item>
            <Form.Item label="组织序号">
              {getFieldDecorator('deptSort', {
                rules: [
                  {
                    required,
                    pattern: new RegExp(/^[0-9]\d*$/, 'g'),
                    message: '组织序号只能为数字',
                  },
                ],
                initialValue: deptSort,
              })(<Input placeholder="请输入" />)}
            </Form.Item>
            <Form.Item label="上级组织">
              {getFieldDecorator('pid', {
                rules: [
                  {
                    required,
                    pattern: new RegExp(/^[0-9]\d*$/, 'g'),
                    message: '上级编号只能为数字',
                  },
                ],
                initialValue: pid,
              })(
                <Input placeholder="根目录编号为0" />,
                // <SelectPid onchange={()=>this.getPid} />,
              )}
            </Form.Item>
            <Form.Item label="启用状态">
              {getFieldDecorator('deptStatus', {
                rules: [
                  {
                    required,
                    message: '请选择是否启用',
                  },
                ],
                initialValue: deptStatus,
              })(
                <RadioGroup>
                  <Radio value="0">启用</Radio>
                  <Radio value="1">停用</Radio>
                </RadioGroup>,
              )}
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  }
}
MenuModal.defaultProps = {
  title: '新建组织',
  record: { id: '', deptName: '', deptRemark: '', deptSort: '', pid: '', deptStatus: '' },
};
export default Form.create()(MenuModal);
