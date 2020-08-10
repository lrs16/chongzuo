import React, { Component } from 'react';
import { Form, Input, Modal, Button, Tabs, Drawer } from 'antd';

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

const { TabPane } = Tabs;
const withClick = (element, handleClick = () => {}) => {
  return <element.type {...element.props} onClick={handleClick} />;
};

class SoftEdit extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    visible: false,
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
    this.props.form.resetFields();
  };

  handleopenClick = () => {
    this.setState({
      visible: true,
    });
    // this.props.form.resetFields();
  };

  hanldeCancel = () => {
    this.setState({
      visible: false,
    });
    this.props.form.resetFields();
  };

  handleOk = () => {
    this.props.form.validateFields((err, value) => {
      if (!err) {
        this.hanldeCancel();
        this.props.onSumit(value);
        this.props.form.resetFields();
      }
    });
  };

  render() {
    const { visible } = this.state;
    const { children, title } = this.props;
    const { getFieldDecorator } = this.props.form;
    const required = true;
    const {
      id,
      softwareName,
      softwareAbsDir,
      softwareLogDir,
      softwareStartCommand,
      softwareStartCommandFinal,
      softwareStopCommand,
      softwareStopCommandFinal,
      softwarePort,
      softwareVersion,
      softwareSort,
      softwareRemark,
    } = this.props.record;

    return (
      <>
        {withClick(children, this.handleopenClick)}
        <Drawer
          width={720}
          title={title}
          visible={visible}
          maskClosable={true}
          onClose={this.onClose}
          centered="true"
          onCancel={this.hanldeCance}
        >
          <Tabs defaultActiveKey="1">
            <TabPane tab="基本信息" key="1">
              <Form {...formItemLayout}>
                <Form.Item label="id">
                  {getFieldDecorator('id', {
                    initialValue: id,
                  })(<Input disabled></Input>)}
                </Form.Item>

                <Form.Item label="软件名称">
                  {getFieldDecorator('softwareName', {
                    rules: [
                      {
                        required,
                        message: '请输入',
                      },
                    ],
                    initialValue: softwareName,
                  })(<Input placeholder="请输入"></Input>)}
                </Form.Item>

                <Form.Item label="软件绝对目录">
                  {getFieldDecorator('softwareAbsDir', {
                    rules: [
                      {
                        required,
                        message: '请输入',
                      },
                    ],
                    initialValue: softwareAbsDir,
                  })(<Input placeholder="请输入" />)}
                </Form.Item>

                <Form.Item label="日志目录路径">
                  {getFieldDecorator('softwareLogDir', {
                    rules: [
                      {
                        required,
                        message: '请输入',
                      },
                    ],
                    initialValue: softwareLogDir,
                  })(<Input placeholder="请输入" />)}
                </Form.Item>

                <Form.Item label="软件使用端口">
                  {getFieldDecorator('softwarePort', {
                    rules: [
                      {
                        required,
                        message: '请输入',
                      },
                    ],
                    initialValue: softwarePort,
                  })(<Input placeholder="请输入" />)}
                </Form.Item>

                <Form.Item label="软件版本">
                  {getFieldDecorator('softwareVersion', {
                    rules: [
                      {
                        required,
                        message: '请输入',
                      },
                    ],
                    initialValue: softwareVersion,
                  })(<Input placeholder="请输入" />)}
                </Form.Item>

                <Form.Item label="软件排序">
                  {getFieldDecorator('softwareSort', {
                    rules: [
                      {
                        required,
                        message: '请输入',
                      },
                    ],
                    initialValue: softwareSort,
                  })(<Input placeholder="请输入" />)}
                </Form.Item>

                <Form.Item label="软件备注">
                  {getFieldDecorator('softwareRemark', {
                    rules: [
                      {
                        required,
                        message: '请输入',
                      },
                    ],
                    initialValue: softwareRemark,
                  })(<Input placeholder="请输入" />)}
                </Form.Item>
              </Form>
            </TabPane>

            <TabPane tab="启动命令" key="2">
              <Form {...formItemLayout}>
                <Form.Item>
                  {getFieldDecorator('softwareStartCommand', {
                    initialValue: softwareStartCommand,
                  })(<Input.TextArea style={{ height: 300 }}></Input.TextArea>)}
                </Form.Item>
              </Form>
            </TabPane>

            <TabPane tab="启动执行命令" key="3">
              <Form {...formItemLayout}>
                <Form.Item>
                  {getFieldDecorator('softwareStartCommandFinal', {
                    initialValue: softwareStartCommandFinal,
                  })(<Input.TextArea style={{ height: 300 }}></Input.TextArea>)}
                </Form.Item>
              </Form>
            </TabPane>

            <TabPane tab="停止命令" key="4">
              <Form {...formItemLayout}>
                <Form.Item>
                  {getFieldDecorator('softwareStopCommand', {
                    initialValue: softwareStopCommand,
                  })(<Input.TextArea style={{ height: 300 }} />)}
                </Form.Item>
              </Form>
            </TabPane>

            <TabPane tab="停止执行命令" key="5">
              <Form {...formItemLayout}>
                <Form.Item>
                  {getFieldDecorator('softwareStopCommandFinal', {
                    initialValue: softwareStopCommandFinal,
                  })(<Input.TextArea style={{ height: 300 }} />)}
                </Form.Item>
              </Form>
            </TabPane>
          </Tabs>
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
SoftEdit.defaultProps = {
  title: '新增软件',
  record: {
    id: '',
    softwareName: '',
    softwareAbsDir: '',
    updateTime: '',
    softwareLogDir: '',
    softwareStartCommand: '',
    softwareStartCommandFinal: '',
    softwareStopCommand: '',
    softwareStopCommandFinal: '',
    softwarePort: '',
    softwareVersion: '',
    softwareSort: '',
    softwareRemark: '',
  },
};
export default Form.create()(SoftEdit);
