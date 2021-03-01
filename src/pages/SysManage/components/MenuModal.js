/* eslint-disable no-useless-constructor */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { Form, Input, Drawer, Radio, Button } from 'antd';

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
class MenuModal extends Component {
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
    const { children, title, pidkey } = this.props;

    // Form双向绑定
    const { getFieldDecorator } = this.props.form;
    const required = true;
    // console.log(this.props.record);
    const { id, menuSort, menuIcon, menuUrl, menuName, menuDesc, menuHide } = this.props.record;
    return (
      <>
        {withClick(children, this.handleopenClick)}
        <Drawer
          title={title}
          width={600}
          onClose={this.hanldleCancel}
          visible={visible}
          bodyStyle={{ paddingBottom: 60 }}
        >
          <Form {...formItemLayout}>
            <Form.Item label="菜单编码">
              {getFieldDecorator('id', {
                initialValue: id,
              })(<Input placeholder="系统生成" disabled />)}
            </Form.Item>
            <Form.Item label="Pid">
              {getFieldDecorator('pid', {
                rules: [
                  {
                    required,
                    message: '请输入',
                  },
                ],
                initialValue: pidkey,
              })(<Input placeholder="请输入" />)}
            </Form.Item>
            <Form.Item label="menuSort">
              {getFieldDecorator('menuSort', {
                rules: [
                  {
                    required,
                    message: '请输入',
                  },
                ],
                initialValue: menuSort,
              })(<Input placeholder="请输入" />)}
            </Form.Item>
            <Form.Item label="图标Cord">
              {getFieldDecorator('menuIcon', {
                rules: [
                  {
                    required,
                    message: '请输入',
                  },
                ],
                initialValue: menuIcon,
              })(<Input placeholder="请输入" />)}
            </Form.Item>
            <Form.Item label="路由">
              {getFieldDecorator('menuUrl', {
                rules: [
                  {
                    required,
                    message: '请输入路由',
                  },
                ],
                initialValue: menuUrl,
              })(<Input placeholder="例:/sysmanage" />)}
            </Form.Item>
            <Form.Item label="英文名称">
              {getFieldDecorator('menuName', {
                rules: [
                  {
                    required,
                    message: '请输入菜单名称',
                  },
                ],
                initialValue: menuName,
              })(<Input placeholder="请输入" />)}
            </Form.Item>
            <Form.Item label="中文名称">
              {getFieldDecorator('menuDesc', {
                rules: [
                  {
                    required,
                    message: '请输入菜单名称',
                  },
                ],
                initialValue: menuDesc,
              })(<Input placeholder="请输入" />)}
            </Form.Item>
            <Form.Item label="隐藏菜单">
              {getFieldDecorator('menuHide', {
                initialValue: menuHide,
              })(
                <Radio.Group>
                  <Radio value="0">不隐藏</Radio>
                  <Radio value="1">隐藏</Radio>
                </Radio.Group>,
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
MenuModal.defaultProps = {
  title: '新建菜单',
  record: {
    id: '',
    pid: '',
    menuSort: '',
    menuIcon: '',
    menuUrl: '',
    menuName: '',
    menuDesc: '',
    subDescription: '',
    menuHide: '0',
  },
};
export default Form.create()(MenuModal);
