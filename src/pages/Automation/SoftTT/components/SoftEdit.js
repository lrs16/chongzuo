import React, { Component } from 'react';
import { Form, Input, Message, Button, Tabs, Drawer } from 'antd';

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
    const { hostId } = this.props;
    if(hostId){
      this.setState({
        visible: true,
      });
    }
    else {
      Message.info('需选中一个主机');

    }
  
    this.props.form.resetFields();
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
        const hostIds = this.props.hostId;
        this.props.onSumit(value,hostIds);
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
      softwareStopCommand,
      softwareCheckCommand,
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
          maskClosable="true"
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
                  })(<Input disabled />)}
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
                  })(<Input placeholder="请输入"/>)}
                </Form.Item>

                <Form.Item label="绝对目录">
                  {getFieldDecorator('softwareAbsDir', {
                    initialValue: softwareAbsDir,
                  })(<Input placeholder="请输入" />)}
                </Form.Item>

                <Form.Item label="日志目录">
                  {getFieldDecorator('softwareLogDir', {
                    initialValue: softwareLogDir,
                  })(<Input placeholder="请输入" />)}
                </Form.Item>

                <Form.Item label="使用端口">
                  {getFieldDecorator('softwarePort', {
                    initialValue: softwarePort,
                  })(<Input placeholder="请输入" />)}
                </Form.Item>

                <Form.Item label="软件版本">
                  {getFieldDecorator('softwareVersion', {
                    initialValue: softwareVersion,
                  })(<Input placeholder="请输入" />)}
                </Form.Item>

                <Form.Item label="软件排序">
                  {getFieldDecorator('softwareSort', {
                    initialValue: softwareSort,
                  })(<Input placeholder="请输入" />)}
                </Form.Item>

                <Form.Item label="软件备注">
                  {getFieldDecorator('softwareRemark', {
                    initialValue: softwareRemark,
                  })(<Input placeholder="请输入" />)}
                </Form.Item>
              </Form>
            </TabPane>

            <TabPane tab="启动命令" key="2">
              <Form>
                <Form.Item>
                  {getFieldDecorator('softwareStartCommand', {
                    initialValue: softwareStartCommand||'null',
                  })(<Input.TextArea rows={34} style={{ width: 720 }}/>)}
                </Form.Item>
              </Form>
            </TabPane>

            <TabPane tab="停止命令" key="3">
              <Form>
                <Form.Item>
                  {getFieldDecorator('softwareStopCommand', {
                    initialValue: softwareStopCommand||'null',
                  })(<Input.TextArea rows={34} style={{ width: 720 }} />)}
                </Form.Item>
              </Form>
            </TabPane>

            <TabPane tab="检测命令" key="4">
              <Form>
                <Form.Item>
                  {getFieldDecorator('softwareCheckCommand', {
                    initialValue: softwareCheckCommand||'null',
                  })(<Input.TextArea rows={34} style={{ width: 720 }}/>)}
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
    softwareStopCommand: '',
    softwarePort: '',
    softwareVersion: '',
    softwareSort: '',
    softwareRemark: '',
    softwareCheckCommand: '',
  },
};
export default Form.create()(SoftEdit);
