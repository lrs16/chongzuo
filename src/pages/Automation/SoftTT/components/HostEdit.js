import React, { Component } from 'react';
import { Form, Input, Modal, Radio, Select } from 'antd';
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
const { Option } = Select;
const operatorSystem = [
  { key: 0, value: 'window' },
  { key: 1, value: 'linux' },
];
const systemData = [];

operatorSystem.forEach(function(item) {
  systemData.push(<Option key={item.key}>{item.value}</Option>);
});

const cabinetData = [
  { key: '0', value: 'A座机柜' },
  { key: '1', value: 'B座机柜' },
];
const cabinet = [];
cabinetData.forEach(function(item) {
  cabinet.push(<Option key={item.key}>{item.value}</Option>);
});

// 克隆子元素按钮，并添加事件
const withClick = (element, handleClick = () => {}) => {
  return <element.type {...element.props} onClick={handleClick} />;
};

class HostEdit extends Component {
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
    this.props.form.resetFields();
  };

  handleOk = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // 关闭弹窗
        this.hanldleCancel();
        // 传数据
        // values.createTime = this.formateDate(values.createTime)
        this.props.onSumit(values);
        this.props.form.resetFields();
      }
    });
  };

  //   formateDate = (datetime) => {
  //     function addDateZero(num) {
  //         return (num < 10 ? "0" + num : num);
  //     }
  //     let d = new Date(datetime);
  //     let formatdatetime = d.getFullYear() + '-' + addDateZero(d.getMonth() + 1) + '-' + addDateZero(d.getDate()) + ' ' + addDateZero(d.getHours()) + ':' + addDateZero(d.getMinutes()) + ':' + addDateZero(d.getSeconds());
  //     console.log(formatdatetime);
  //     return formatdatetime;
  // };

  render() {
    const { visible } = this.state;
    const { children, title } = this.props;
    const { cities } = this.state;

    // Form双向绑定
    const { getFieldDecorator } = this.props.form;
    const required = true;
    const {
      id,
      hostsName,
      createTime,
      hostsStatus,
      hostsIp,
      hostsSort,
      hostsZoneId,
      hostsOsId,
      hostsCabinetId,
      hostsRemark,
    } = this.props.record;

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
            <Form.Item label="数据主键">
              {getFieldDecorator('id', {
                initialValue: id,
              })(<Input placeholder="请输入" disabled />)}
            </Form.Item>

            <Form.Item label="主机名称">
              {getFieldDecorator('hostsName', {
                rules: [
                  {
                    required,
                    message: '请输入',
                  },
                ],
                initialValue: hostsName,
              })(<Input placeholder="请输入" />)}
            </Form.Item>

            <Form.Item label="机柜">
              {getFieldDecorator('hostsCabinetId', {
                rules: [
                  {
                    required,
                    message: '请输入',
                  },
                ],
                // initialValue: hostsCabinetId ? hostsCabinetId : '请选择',
                initialValue: hostsCabinetId,
              })(<Select>{cabinet}</Select>)}
            </Form.Item>

            <Form.Item label="ip地址">
              {getFieldDecorator('hostsIp', {
                rules: [
                  {
                    required,
                    message: '请输入',
                  },
                ],
                initialValue: hostsIp,
              })(<Input placeholder="请输入" />)}
            </Form.Item>

            <Form.Item label="主机分区">
              {getFieldDecorator('hostsZoneId', {
                rules: [
                  {
                    required,
                    message: '请输入',
                  },
                ],
                initialValue: hostsZoneId,
              })(
                <Radio.Group>
                  <Radio value="1">安全接入区</Radio>
                  <Radio value="2">二区</Radio>
                  <Radio value="3">三区</Radio>
                </Radio.Group>,
              )}
            </Form.Item>

            <Form.Item label="主机排序">
              {getFieldDecorator('hostsSort', {
                rules: [
                  {
                    required,
                    message: '请输入',
                  },
                ],
                initialValue: hostsSort,
              })(<Input placeholder="请输入" />)}
            </Form.Item>

            <Form.Item label="主机操作系统">
              {getFieldDecorator('hostsOsId', {
                rules: [
                  {
                    required,
                    message: '请输入',
                  },
                ],
                // initialValue: hostsOsId ? hostsOsId : '请选择',
                initialValue: hostsOsId,
              })(<Select>{systemData}</Select>)}
            </Form.Item>

            <Form.Item label="主机备注">
              {getFieldDecorator('hostsRemark', {
                rules: [
                  {
                    required,
                    message: '请输入',
                  },
                ],
                initialValue: hostsRemark,
              })(<Input placeholder="请输入" />)}
            </Form.Item>

            <Form.Item label="主机状态">
              {getFieldDecorator('hostsStatus', {
                rules: [
                  {
                    required,
                    message: '请输入',
                  },
                ],
                initialValue: hostsStatus,
              })(
                <Radio.Group>
                  <Radio value="0">停用</Radio>
                  <Radio value="1">在用</Radio>
                </Radio.Group>,
              )}
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  }
}
HostEdit.defaultProps = {
  title: '添加硬件',
  record: {
    id: '',
    hostsName: '',
    createTime: '',
    hostsStatus: '',
    hostsIp: '',
    hostsSort: '',
    hostsZoneId: '',
    hostsOsId: '',
    hostsCabinetId: '',
    hostsRemark: '',
  },
};
export default Form.create()(HostEdit);
