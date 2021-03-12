import React, { Component } from 'react';
import { Drawer, Button, Form, Input, Radio, Spin, Upload, Avatar, AutoComplete } from 'antd';
import DeptSlectId from '@/components/DeptTree/SelectID';
import { UserOutlined, UploadOutlined, CaretRightOutlined } from '@ant-design/icons';
import { queryUnitList } from '@/services/common';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
  colon: false,
};

const RadioGroup = Radio.Group;
const InputGroup = Input.Group;
const { Search } = Input;
const { Option } = AutoComplete;

// 克隆子元素按钮，并添加事件
const withClick = (element, showDrawer = () => {}) => {
  return <element.type {...element.props} onClick={showDrawer} />;
};
class UpdateUser extends Component {
  state = {
    visible: false,
    detpdrawer: false,
    deptdata: [],
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

  // 关闭组织机构树抽屉
  onDeptDrawerClose = () => {
    this.setState({
      detpdrawer: false,
    });
  };

  render() {
    const { visible, detpdrawer } = this.state;
    const { children, title, loading } = this.props;
    // Form双向绑定
    const { getFieldDecorator } = this.props.form;
    const required = true;

    const {
      id,
      deptNameExt,
      deptId,
      loginCode,
      userEmail,
      userMobile,
      userName,
      userSex,
      userStatus,
    } = this.props.record;

    // 自动完成部门
    const deptoptions = this.state.deptdata.map(opt => (
      <Option key={opt.id} value={opt.deptName}>
        {opt.deptName}
      </Option>
    ));

    // 选择组织结点
    const handleUnitTreeNode = value => {
      this.setState({
        detpdrawer: false,
      });
      this.props.form.setFieldsValue({ deptNameExt: value.title });
      this.props.form.setFieldsValue({ deptId: value.key });
    };

    // 查询部门
    const handleDeptSearch = value => {
      queryUnitList({ key: value }).then(res => {
        if (res.data !== undefined) {
          const arr = [...res.data];
          this.setState({ deptdata: arr });
        }
      });
    };
    return (
      <>
        {withClick(children, this.showDrawer)}
        <Drawer
          title={title}
          width={600}
          onClose={this.onClose}
          visible={visible}
          bodyStyle={{ paddingBottom: 60 }}
          // destroyOnClose
        >
          <div style={{ textAlign: 'center', paddingBottom: '20px' }}>
            <Avatar
              style={{
                backgroundColor: '#87d068',
                marginBottom: '10px',
              }}
              size={64}
              icon={<UserOutlined />}
            />
            <br />
            <Upload>
              <Button>
                <UploadOutlined /> 更新用户头像
              </Button>
            </Upload>
          </div>

          <Spin spinning={loading}>
            <Form {...formItemLayout}>
              <Form.Item label="用户ID">
                {getFieldDecorator('id', {
                  initialValue: id,
                })(<Input disabled />)}
              </Form.Item>
              <Form.Item label="登录账号">
                {getFieldDecorator('loginCode', {
                  initialValue: loginCode,
                })(<Input disabled />)}
              </Form.Item>
              <Form.Item label="用户名">
                {getFieldDecorator('userName', {
                  initialValue: userName,
                  rules: [
                    {
                      required,
                      message: '请输入用户名!',
                    },
                  ],
                })(<Input />)}
              </Form.Item>
              <Form.Item label="所属组织">
                <InputGroup compact>
                  {getFieldDecorator('deptNameExt', {
                    initialValue: deptNameExt,
                  })(
                    <AutoComplete
                      dataSource={deptoptions}
                      optionLabelProp="value"
                      style={{ width: '70%' }}
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                      onSelect={(v, opt) => {
                        this.props.form.setFieldsValue({ deptNameExt: v });
                        this.props.form.setFieldsValue({ deptId: opt.key });
                        this.setState({ deptdata: [] });
                      }}
                    >
                      <Search
                        placeholder="可输入关键字搜索部门"
                        onSearch={values => handleDeptSearch(values)}
                      />
                    </AutoComplete>,
                  )}
                  <Button
                    style={{ width: '30%' }}
                    onClick={() => {
                      this.setState({ detpdrawer: true });
                    }}
                  >
                    <CaretRightOutlined />
                  </Button>
                </InputGroup>
              </Form.Item>
              <Form.Item label="所属组织" style={{ display: 'none' }}>
                {getFieldDecorator('deptId', {
                  initialValue: deptId,
                })(<Input />)}
              </Form.Item>
              <Form.Item label="邮箱">
                {getFieldDecorator('userEmail', {
                  initialValue: userEmail,
                  rules: [
                    {
                      type: 'email',
                      message: '请输入正确的邮箱地址!',
                    },
                  ],
                })(<Input />)}
              </Form.Item>
              {/* <Form.Item label="头像">
              {getFieldDecorator('userHead', {
                initialValue: userHead,
              })(<Input />)}
            </Form.Item> */}
              <Form.Item label="联系电话">
                {getFieldDecorator('userMobile', {
                  initialValue: userMobile,
                  rules: [
                    {
                      pattern: /^1[3|4|5|7|8|9][0-9]\d{8}$/,
                      message: '请输入正确的手机号！',
                    },
                  ],
                })(<Input />)}
              </Form.Item>

              <Form.Item label="性别">
                {getFieldDecorator('userSex', {
                  initialValue: userSex,
                })(
                  <RadioGroup>
                    <Radio value="0">男</Radio>
                    <Radio value="1">女</Radio>
                  </RadioGroup>,
                )}
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
                    <Radio value="0">停用</Radio>
                    <Radio value="1">启用</Radio>
                    <Radio value="2">临时</Radio>
                  </RadioGroup>,
                )}
              </Form.Item>
            </Form>
          </Spin>
          <Drawer
            title="组织机构"
            width={320}
            closable={false}
            onClose={this.onDeptDrawerClose}
            visible={detpdrawer}
          >
            <DeptSlectId
              GetTreenode={newvalue => handleUnitTreeNode(newvalue)}
              pid="7AC3EF0F701402A2E0530A644F130365"
            />
          </Drawer>
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

export default Form.create()(UpdateUser);
