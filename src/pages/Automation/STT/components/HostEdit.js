import React, { Component } from 'react';
import { Form, Input, Modal, Radio, Tabs, Select } from 'antd';
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

// const provinceData = ['Zhejiang', 'Jiangsu'];
// const cityData = {
//   Zhejiang: ['Hangzhou', 'Ningbo', 'Wenzhou'],
//   Jiangsu: ['Nanjing', 'Suzhou', 'Zhenjiang'],
// };

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
    // cities: cityData[provinceData[0]],
    // secondCity: cityData[provinceData[0]][0],
  };

  // handleProvinceChange = value => {
  //   this.setState({
  //     cities: cityData[value],
  //     secondCity: cityData[value][0],
  //   });
  // };

  // onSecondCityChange = value => {
  //   this.setState({
  //     secondCity: value,
  //   });
  // };

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
            <Form.Item label="id">
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

            <Form.Item label="主机IP">
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
              })(<Input placeholder="请输入" />)}
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
              })(
                // <Select
                //   defaultValue={provinceData[0]}
                //   style={{ width: 400 }}
                //   onChange={this.handleProvinceChange}
                // >
                //   {provinceData.map(province => (
                //     <Option key={province}>{province}</Option>
                //   ))}
                // </Select>,
                <Input placeholder="请输入"></Input>,
              )}
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
              })(
                // <Select
                //   style={{ width: 400 }}
                //   value={this.state.secondCity}
                //   onChange={this.onSecondCityChange}
                // >
                //   {cities.map(city => (
                //     <Option key={city}>{city}</Option>
                //   ))}
                // </Select>,
                <Input placeholder="请输入"></Input>,
              )}
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

            <Form.Item label="状态">
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
