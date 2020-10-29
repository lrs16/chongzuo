import React, { Component } from 'react';
import { Form, Input, Modal, DatePicker, Tabs, Select, Message } from 'antd';
import moment, { isMoment } from 'moment';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 16 },
    sm: { span: 16 },
  },
  colon: false,
};
const { TextArea } = Input;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const contentSize = '';
const { Option } = Select;
const options = [{ value: 'gold' }, { value: 'lime' }, { value: 'green' }, { value: 'cyan' }];
const rangeConfig = {
  rules: [{ type: 'array', required: true, message: 'Please select time!' }],
};
const withClick = (element, handleClick = () => {}) => {
  return <element.type {...element.props} onClick={handleClick} />;
};

class MaintenancePlanEdit extends Component {
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
  };

  handleopenClick = () => {
    if (this.props.record.length) {
      Message.info('添加用户请不要选择数据');
    } else {
      this.setState({
        visible: true,
      });
      this.props.form.resetFields();
    }
  };

  hanldeCancel = () => {
    this.setState({
      visible: false,
      value: '',
    });
    this.props.form.resetFields();
  };

  onChange = ({ target: { value } }) => {
    this.setState({ value });
    this.contentSize = '您已经输入' + value.length;
  };

  handleOk = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.hanldeCancel();
        this.props.onSumit(values);
        this.props.form.resetFields();
      }
    });
  };

  render() {
    const { visible, value } = this.state;
    // const { children, title, basic, opera, historyInfo, notificationInfo } = this.props;
    // const dataSource = [...opera];
    // const data = [...historyInfo];
    const { children } = this.props;
    const { getFieldDecorator } = this.props.form;
    const required = true;
    const {
      founder,
      programName,
      startTime,
      maintenanceEquipment,
      endTime,
      remark,
    } = this.props.record;
    console.log(maintenanceEquipment);
    return (
      <>
        {withClick(children, this.handleopenClick)}
        <Modal
          width={720}
          title="创建维护计划"
          visible={visible}
          closable={true}
          maskClosable={true}
          onClose={this.onClose}
          centered={true}
          onCancel={this.hanldeCancel}
          onOk={this.handleOk}
        >
          <Form {...formItemLayout}>
            <Form.Item label="创建人">
              {getFieldDecorator('founder', {
                rules: [
                  {
                    required,
                    message: '请输入创建人',
                  },
                ],
                initialValue: founder,
              })(<Input />)}
            </Form.Item>

            <Form.Item label="创建名称">
              {getFieldDecorator('programName', {
                rules: [
                  {
                    required,
                    message: '请输入创建名称',
                  },
                ],
                initialValue: programName,
              })(<Input />)}
            </Form.Item>

            <Form.Item label="维护时间">
              {getFieldDecorator('startTime', {
                rules: [
                  {
                    required,
                    message: '请输入维护时间',
                  },
                ],
                // initialValue: moment(startTime)
                initialValue: [startTime ? moment(startTime) : '', endTime ? moment(endTime) : ''],
              })(<RangePicker showTime />)}
            </Form.Item>

            <Form.Item label="维护设备">
              {getFieldDecorator('maintenanceEquipment', {
                rules: [
                  {
                    required,
                    message: '请输入维护设备',
                  },
                ],
                initialValue: maintenanceEquipment == 'undefined' ? '' : maintenanceEquipment,
              })(
                <Select
                  mode="multiple"
                  // tagRender={tagRender}
                  // defaultValue={['gold', 'cyan']}
                  // style={{ width: '100%' }}
                  // options={options}
                >
                  <Option value="all">全部</Option>
                  <Option value="1">采集服务器1</Option>
                  <Option value="2">采集服务器2</Option>
                  <Option value="3">采集服务器3</Option>
                  <Option value="4">采集服务器4</Option>
                  <Option value="n">采集服务器n</Option>
                </Select>,
              )}
            </Form.Item>
            <Form.Item label="备注" style={{ position: 'relative' }}>
              {getFieldDecorator('remark', {
                rules: [
                  {
                    required,
                    message: '请输入备注信息',
                  },
                ],
                initialValue: remark,
              })(
                <TextArea
                  // value={value}
                  onChange={this.onChange}
                  style={{ height: 150 }}
                ></TextArea>,
              )}

              <Form.Item label="" style={{ position: 'absolute', right: 3, bottom: -30 }}>
                {getFieldDecorator('contentSize', {
                  // rules:[
                  //   {
                  //     required,
                  //     message:'请输入',
                  //   },
                  // ],
                  initialValue: this.contentSize,
                })(<Input style={{ border: 'none' }} />)}
              </Form.Item>
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  }
}
MaintenancePlanEdit.defaultProps = {
  title: '编辑',
  record: {
    founder: '',
    programName: '',
    startTime: '',
    endTime: '',
    maintenanceEquipment: '',
    remark: '',
  },
};
export default Form.create()(MaintenancePlanEdit);
