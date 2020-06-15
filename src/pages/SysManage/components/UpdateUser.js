import React, { Component } from 'react';
import { Drawer, Button, Form, Input, Radio, Spin, Select } from 'antd';
import SelecttreeID from '@/components/DeptTree/SelectID';

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
const { Option } = Select;

const RadioGroup = Radio.Group;
// 克隆子元素按钮，并添加事件
const withClick = (element, showDrawer = () => {}) => {
  return <element.type {...element.props} onClick={showDrawer} />;
};
class UpdateUser extends Component {
  state = {
    visible: false,
  };

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  handleOk = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // 关闭弹窗
        this.onClose();
        // 传数据
        this.props.onSumit(values);
        this.props.form.resetFields();
      }
    });
  };

  toTree = datas => {
    const data = this.addArr(datas);
    //    console.log(data);
    const result = [];
    if (!Array.isArray(data)) {
      return result;
    }
    data.forEach(item => {
      delete item.children;
    });
    const map = {};
    data.forEach(item => {
      map[item.deptSort] = item;
    });
    data.forEach(item => {
      const parent = map[item.pid];
      if (parent) {
        (parent.children || (parent.children = [])).push(item);
      } else {
        result.push(item);
      }
    });
    return result;
  };

  addArr = datas => {
    const newArr = [];
    if (!Array.isArray(datas)) {
      return newArr;
    }
    for (let i = 0; i < datas.length; i += 1) {
      const vote = {};
      vote.id = datas[i].id;
      vote.value = datas[i].id;
      vote.title = datas[i].deptName;
      vote.deptSort = datas[i].deptSort;
      vote.pid = datas[i].pid;
      newArr.push(vote);
    }

    return newArr;
  };

  onChange = value => {
    console.log(value);
    //  this.setState({ value });
  };

  render() {
    const { visible } = this.state;
    const { children, title, loading } = this.props;
    // 转换树结构
    // const treeData = this.toTree(this.props.depdatas);
    // console.log(treeData);
    // Form双向绑定
    const { getFieldDecorator } = this.props.form;
    const required = true;
    // console.log(this.props.record);
    const {
      id,
      loginCode,
      upmsDept,
      userEmail,
      userHead,
      userMobile,
      userName,
      userSex,
      userStatus,
    } = this.props.record;
    return (
      <>
        {withClick(children, this.showDrawer)}
        <Drawer
          title={title}
          width={720}
          onClose={this.onClose}
          visible={visible}
          bodyStyle={{ paddingBottom: 60 }}
          // destroyOnClose
        >
          <Spin spinning={loading}>
            <Form {...formItemLayout}>
              <Form.Item label="用户ID">
                {getFieldDecorator('id', {
                  initialValue: id,
                })(<Input placeholder="系统生成" disabled />)}
              </Form.Item>
              <Form.Item label="角色代码">
                {getFieldDecorator('loginCode', {
                  initialValue: loginCode,
                })(
                  <Select
                    defaultOpen
                    showSearch
                    style={{ width: 200 }}
                    placeholder="Select a person"
                    optionFilterProp="children"
                    onChange={this.onChange}
                    onFocus={this.handleFocus}
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Option value="jack">Jack</Option>
                    <Option value="lucy">Lucy</Option>
                    <Option value="tom">Tom</Option>
                  </Select>,
                )}
              </Form.Item>
              <Form.Item label="所属组织">
                {getFieldDecorator('upmsDept', {
                  initialValue: upmsDept,
                })(
                  //   <TreeSelect
                  //   style={{ width: '100%' }}
                  //   // value={this.state.value}
                  //   dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  //   getPopupContainer={triggerNode => triggerNode.parentNode}// 解决下拉不显示在上层的问题
                  //   treeData={treeData}
                  //   placeholder="请选择"
                  //   treeDefaultExpandAll
                  //   onChange={this.onChange}
                  // />
                  <SelecttreeID />,
                )}
              </Form.Item>
              <Form.Item label="邮箱">
                {getFieldDecorator('userEmail', {
                  initialValue: userEmail,
                })(<Input />)}
              </Form.Item>
              <Form.Item label="头像">
                {getFieldDecorator('userHead', {
                  initialValue: userHead,
                })(<Input />)}
              </Form.Item>
              <Form.Item label="联系电话">
                {getFieldDecorator('userMobile', {
                  initialValue: userMobile,
                })(<Input />)}
              </Form.Item>
              <Form.Item label="用户名">
                {getFieldDecorator('userName', {
                  initialValue: userName,
                })(<Input />)}
              </Form.Item>
              <Form.Item label="性别">
                {getFieldDecorator('userSex', {
                  initialValue: userSex,
                })(<Input />)}
              </Form.Item>
              <Form.Item label="用户密码">
                {getFieldDecorator('userSex', {
                  initialValue: userSex,
                })(<Input />)}
              </Form.Item>
              <Form.Item label="启用状态">
                {getFieldDecorator('userStatus', {
                  rules: [
                    {
                      required,
                      message: '请选择是否启用',
                    },
                  ],
                  initialValue: userStatus,
                })(
                  <RadioGroup>
                    <Radio value="0">启用</Radio>
                    <Radio value="1">停用</Radio>
                  </RadioGroup>,
                )}
              </Form.Item>
            </Form>
          </Spin>
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
            <Button onClick={this.onClose} style={{ marginRight: 8 }}>
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

UpdateUser.defaultProps = {
  title: '新建用户',
  record: {
    id: '',
    loginCode: '',
    upmsDept: '',
    userEmail: '',
    userHead: '',
    userMobile: '',
    userName: '',
    userSex: '',
    userStatus: '',
  },
};
export default Form.create()(UpdateUser);
