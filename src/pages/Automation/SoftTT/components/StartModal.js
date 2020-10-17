import React, { Component } from 'react';
import { Form, Input, Modal, Checkbox, AutoComplete } from 'antd';
import { connect } from 'dva';

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

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 20,
      offset: 20,
    },
  },
};

// 克隆子元素按钮，并添加事件
const withClick = (element, handleClick = () => {}) => {
  return <element.type {...element.props} onClick={handleClick} />;
};

@connect(({ softexetute, loading }) => ({
  softexetute,
  loading: loading.models.softexetute,
}))
class StartModal extends Component {
  state = {
    visible: false,
    inputvalueList: [],
  };

  handleopenClick = () => {
    this.setState({
      visible: true,
    });
  };

  hanldleCancel = () => {
    // 取消按钮
    this.setState({
      visible: false,
    });
  };

  handleSearch = () => {
    // 用户名查询
    // eslint-disable-next-line consistent-return
    this.props.form.validateFields((err, values) => {
      // if (!err) {
      const { hostsIp, hostsSshUsername } = values;
      if (hostsIp !== '' && hostsSshUsername !== '') {
        const { dispatch } = this.props;
        return dispatch({
          type: 'softexetute/getByUserNameAndIp',
          payload: { hostsIp, hostsSshUsername },
        }).then(res => {
          if (
            res.code === 200 &&
            res.data.MeterHostsSshEntity !== '' &&
            res.data.MeterHostsSshEntity !== undefined
          ) {
            setTimeout(() => {
              this.props.form.setFieldsValue({
                hostsSshPassword: res.data.MeterHostsSshEntity.hostsSshPasssalt,
                command: res.data.historyExecStrList[0],
                remember: true,
              });
            }, 0);
            this.setState({
              inputvalueList: res.data.historyExecStrList,
            });
          } else {
            this.props.form.setFieldsValue({ hostsSshPassword: '', command: '', remember: false });
          }
        });
      }
      // }
    });
  };

  handleOk = () => {
    // 确认按钮
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // 关闭弹窗
        this.hanldleCancel();
        const { dispatch } = this.props;
        const encryptStr = values.hostsSshPassword;
        // 密码加密请求
        dispatch({
          type: 'softexetute/getHostEncryptStr',
          payload: { encryptStr },
        }).then(res => {
          if (res.code === 200) {
            const { hostsIp, hostsSshPort, hostsSshUsername, command, hostsSshPassword } = values;
            const port = hostsSshPort;
            const userName = hostsSshUsername;
            const hostIp = hostsIp;
            const passWord = res.data;
            dispatch({
              type: 'softexetute/getExecCommand',
              payload: { passWord, hostIp, port, userName, command },
            }).then(res => {
              const commitlist = res;
              if (res.code === 200) this.props.onSumit(values, commitlist, passWord); // 提交表单
            });

            if (values.remember === true) {
              const hostsSshPasssalt = passWord;
              dispatch({
                type: 'softexetute/newuserInfo',
                payload: {
                  hostsSshPassword,
                  hostsIp,
                  hostsSshPort,
                  hostsSshUsername,
                  hostsSshPasssalt,
                },
              });
            }
          }
        });

        this.props.form.resetFields();
      }
    });
  };

  onSearch = searchText => {
    this.setState({
      inputvalueList: !searchText ? [] : [searchText, searchText.repeat(2), searchText.repeat(3)],
    });
  };

  render() {
    const { visible, inputvalueList } = this.state;
    const { children, title, softexetute } = this.props;

    // Form双向绑定
    const { getFieldDecorator } = this.props.form;
    // const required = true;
    // const { hostsIp } = this.props.record;
    const { hostsIp } = softexetute.treehostdata;
    return (
      <>
        {withClick(children, this.handleopenClick)}
        <Modal
          title={title}
          visible={visible}
          centered
          destroyOnClose
          maskClosable={false}
          onCancel={this.hanldleCancel}
          onOk={this.handleOk}
        >
          <Form {...formItemLayout}>
            <Form.Item label="IP">
              {getFieldDecorator('hostsIp', {
                rules: [
                  {
                    required: true,
                    message: 'IP不能为空',
                  },
                ],
                initialValue: hostsIp || '',
              })(<Input type="text" />)}
            </Form.Item>
            <Form.Item label="端口">
              {getFieldDecorator('hostsSshPort', {
                rules: [
                  {
                    required: true,
                    message: '端口不能为空',
                  },
                ],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="用户名">
              {getFieldDecorator('hostsSshUsername', {
                rules: [
                  {
                    required: true,
                    message: '用户名不能为空',
                  },
                ],
              })(<Input placeholder="请输入用户名" onBlur={() => this.handleSearch()} />)}
            </Form.Item>
            <Form.Item label="密码">
              {getFieldDecorator('hostsSshPassword', {
                rules: [
                  {
                    required: true,
                    message: '密码不能为空',
                  },
                ],
              })(<Input type="password" />)}
            </Form.Item>
            <Form.Item label="SSH命令">
              {getFieldDecorator('command', {
                rules: [
                  {
                    required: true,
                    message: 'SSH命令不能为空',
                  },
                ],
              })(
                <AutoComplete
                  dataSource={inputvalueList}
                  onSearch={this.onSearch}
                  placeholder="输入命令.."
                />,
              )}
            </Form.Item>
            <Form.Item {...tailFormItemLayout} style={{ marginBottom: 0 }}>
              {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: false,
              })(<Checkbox>记住密码</Checkbox>)}
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  }
}
StartModal.defaultProps = {
  record: {
    hostsIp: '',
  },
};
export default Form.create()(StartModal);
