import React, { Component } from 'react';
import { Form, Input, Modal, AutoComplete, TreeSelect } from 'antd';
import { connect } from 'dva';

const { Option } = AutoComplete;
const { TreeNode } = TreeSelect;
const { TextArea } = Input;

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
    ipDropdownVal: [],
    userNameDropdownVal: [],
    // portDropdownVal: [], // 主机端口下拉值
    hostsSshPassword: '',
    value: undefined,
    result: [],
  };

  toTree = data => {
    const result = [];
    if (!Array.isArray(data)) {
      return result;
    }
    const map = {};
    data.forEach(item => {
      map[item.weight] = item;
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

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode value={item.name} title={item.name} key={item.id} dataRef={item} >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.id} value={item.name} title={item.name} {...item} />;
    });

  handleopenClick = () => {
    this.setState({
      visible: true,
      result: [],
      value: undefined
    });
    // this.props.form.setFieldsValue({ commands: this.state.value });
    const { dispatch } = this.props;
    dispatch({
      type: 'softexetute/fetchComConfigTree',
    });
    const { hostsIp } = this.props.softexetute.treehostdata;
    if (hostsIp) {
      return dispatch({
        type: 'softexetute/getCascadeInfoLists',
        payload: { hostIp: hostsIp },
      }).then(res => {
        const userNameDropdownVal = res.user.map(item => {
          return item.val;
        })
        const userNameDropdownValnoTrim = userNameDropdownVal.filter(item => {
          return item && item.trim();
        })

        // const portDropdownVal = res.port.map(item => {
        //   return item.val;
        // })

        // const portDropdownValtoString = portDropdownVal.map(String);

        this.setState({
          ipDropdownVal: res.hosts,
          userNameDropdownVal: userNameDropdownValnoTrim,
          hostsSshPassword: res.pass,
          // portDropdownVal: portDropdownValtoString[0],
        });
      })
    }
    return '';
  };

  onChange = value => {
    let emptyCommand;
    const resultCommand = [];
    value.forEach(item => {
      const i = item.indexOf('-');
      if (i === -1) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        emptyCommand = [];
      } else {
        const resultStr = item.substring(i + 1, item.length);
        resultCommand.push(resultStr);
      }

    });
    this.setState({ result: resultCommand, value });
  };

  handleOk = () => {
    this.props.form.validateFields((err, values) => {
      const passWord = this.state.hostsSshPassword;
      // const hostsSshPort = parseInt(this.state.portDropdownVal);
      if (!err) {
        this.handleCancel();
        // this.setState({ value: undefined });
        const { dispatch } = this.props;
        const str = values.command.toString();
        const commands = str.replace(/[\r\n]/g, '');
        const { hostsIp, hostsSshUsername } = values;
        dispatch({ // 执行ssh命令接口
          type: 'softexetute/getExecCommand',
          payload: {
            passWord,
            hostIp: hostsIp,
            port: 22,
            userName: hostsSshUsername,
            command: commands,
          },
        }).then(res => {
          this.props.onSumit({ values, passWord, commitlist: res.msg });
        });
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
      ipDropdownVal: !searchText ? [] : [searchText, searchText.repeat(2), searchText.repeat(3)],
    });
  };

  // onSearchPort = searchText => {
  //   this.setState({
  //     portDropdownVal: !searchText ? [] : [searchText, searchText.repeat(2), searchText.repeat(3)],
  //   });
  // };

  onSearchUsername = searchText => {
    this.setState({
      userNameDropdownVal: !searchText ? [] : [searchText, searchText.repeat(2), searchText.repeat(3)],
    });
  };

  render() {
    const { visible, ipDropdownVal, userNameDropdownVal } = this.state;
    const {
      softexetute,
      children,
      title,
    } = this.props;

    const ipDropdownValChildren = ipDropdownVal.map(item => <Option key={item.key}>{item.val}</Option>);
    // Form双向绑定
    const { getFieldDecorator } = this.props.form;
    const required = true;
    const { hostsIp } = softexetute.treehostdata || this.props.record;

    const treeData = this.toTree(softexetute.comconfigtree);

    return (
      <>
        {withClick(children, this.handleopenClick)}
        <Modal
          title={title}
          visible={visible}
          // centered
          onCancel={this.handleCancel}
          onOk={this.handleOk}
          width={850}
          height={1000}
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
                <AutoComplete onSearch={this.onSearchIp} placeholder="请输入主机IP.." allowClear>
                  {ipDropdownValChildren}
                </AutoComplete>
              )}
            </Form.Item>
            {/* <Form.Item label="主机端口">
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
            </Form.Item> */}
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
            <Form.Item label="选择命令">
              {getFieldDecorator('commands', {
                // initialValue: this.state.value,
              })(
                <>
                  <TreeSelect
                    defaultExpandAll
                    value={this.state.value}
                    style={{ width: '100%' }}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    placeholder="请选择命令"
                    onChange={this.onChange}
                    treeCheckable
                    multiple
                  >
                    {treeData && this.renderTreeNodes(treeData)}
                  </TreeSelect>

                </>
              )}
            </Form.Item>
            <Form.Item label="执行命令">
              {getFieldDecorator('command', {
                initialValue: this.state.result.join(';'),
                rules: [
                  {
                    required,
                    message: '执行命令不能为空',
                  },
                ],
              })(
                <TextArea rows={5}>
                  {this.state.result.join(';')}
                </TextArea>
              )}
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  }
}
export default Form.create()(StartModal);
