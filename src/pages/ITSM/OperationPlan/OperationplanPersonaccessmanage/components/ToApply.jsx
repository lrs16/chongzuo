import React, { useState } from 'react';
import {
  Form, Input, Button, Drawer,
  Select,
  DatePicker,
  Message
} from 'antd';
import moment from 'moment';
import router from 'umi/router';

const { Option } = Select;
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

const withClick = (element, handleClick = () => { }) => {
  return <element.type {...element.props} onClick={handleClick} />;
};
function ToApply(props) {
  const [visible, setVisible] = useState(false);
  const required = true;
  const {
    form: { getFieldDecorator, validateFields, resetFields },
    children, title,
    userinfo,
    dispatch
  } = props;

  const handleopenClick = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
    resetFields();
  };

  const handleSave = () => {
    validateFields((err, values) => {
      if (!err) {
        handleCancel();
        props.onSumit(values);
        resetFields();
      }
    });
  };

  const handleSendCheck = () => { // 送审
    validateFields((err, values) => {
      if(!err) {
        dispatch({
          type: 'apply/sendCheck',
          payload: {
            ...values,
            planInTime: (values.planInTime === '' || values.planInTime === 'Invalid date') ? '' : moment(values.planInTime).format('YYYY-MM-DD HH:mm:ss'),
            planOutTime: (values.planOutTime === '' || values.planOutTime === 'Invalid date') ? '' : moment(values.planOutTime).format('YYYY-MM-DD HH:mm:ss'),
            applyTime: (values.applyTime === '' || values.applyTime === 'Invalid date') ? '' : moment(values.applyTime).format('YYYY-MM-DD HH:mm:ss'),
          },
        }).then(res => {
          if (res.code === 200) {
            Message.success(res.msg);
            router.push({
              pathname: '/ITSM/operationplan/personaccessmanage/tocheck',
              query: {
                addtab: false,
              }
            })
          } else {
            Message.error(res.msg);
          }
        });
        handleCancel();
        resetFields();
      }
    });
  };

  return (
    <>
      {withClick(children, handleopenClick)}
      <Drawer
        title={title}
        visible={visible}
        width={720}
        centered="true"
        maskClosable="true"
        onClose={handleCancel}
      >
        <Form {...formItemLayout}>
          <Form.Item label="进出申请编号">
            {getFieldDecorator('registNo', {
              initialValue: '',
            })(<Input placeholder="请输入" disabled />)}
          </Form.Item>

          <Form.Item label="姓名">
            {getFieldDecorator('name', {
              rules: [
                {
                  required,
                  message: '请输入',
                },
              ],
              initialValue: '',
            })(<Input placeholder="请输入" />)}
          </Form.Item>

          <Form.Item label="性别">
            {getFieldDecorator('sex', {
              rules: [
                {
                  required,
                  message: '请选择',
                },
              ],
              initialValue: '',
            })(
              <Select placeholder="请选择" allowClear>
                <Option key='0' value='0'>男</Option>
                <Option key='1' value='1'>女</Option>
              </Select>,
            )}
          </Form.Item>

          <Form.Item label="联系电话">
            {getFieldDecorator('phone', {
              rules: [
                {
                  required,
                  message: '请输入',
                },
              ],
              initialValue: '',
            })(<Input placeholder="请输入" />)}
          </Form.Item>

          <Form.Item label="进出事由">
            {getFieldDecorator('content', {
              rules: [
                {
                  required,
                  message: '请输入',
                },
              ],
              initialValue: '',
            })(<Input placeholder="请输入" />)}
          </Form.Item>

          <Form.Item label="计划进入时间">
            {getFieldDecorator('planInTime', {
              rules: [
                {
                  required,
                  message: '请选择',
                },
              ],
              initialValue: moment(new Date())
            })
              (
                <DatePicker
                  showTime
                  format="YYYY-MM-DD hh:mm:ss"
                  style={{ width: '100%' }}
                  allowClear />
              )}
          </Form.Item>

          <Form.Item label="计划离开时间">
            {getFieldDecorator('planOutTime', {
              rules: [
                {
                  required,
                  message: '请选择',
                },
              ],
              initialValue: moment(new Date())
            })
              (
                <DatePicker
                  showTime
                  format="YYYY-MM-DD hh:mm:ss"
                  style={{ width: '100%' }}
                  allowClear />
              )}
          </Form.Item>

          <Form.Item label="携带工具">
            {getFieldDecorator('carryTool', {
              initialValue: '',
            })(<Input placeholder="请输入" />)}
          </Form.Item>

          <Form.Item label="申请ID" style={{ display: 'none' }}>
            {getFieldDecorator('applyId', {
              initialValue: userinfo.userId,
            })(<Input placeholder="请输入" disabled />)}
          </Form.Item>

          <Form.Item label="申请人">
            {getFieldDecorator('applyUser', {
              initialValue: userinfo.userName,
            })(<Input placeholder="请输入" disabled />)}
          </Form.Item>

          <Form.Item label="申请时间">
            {getFieldDecorator('applyTime', {
              initialValue: moment(new Date()),
            })(<DatePicker
              showTime
              format="YYYY-MM-DD hh:mm:ss"
              style={{ width: '100%' }}
              disabled />)}
          </Form.Item>
        </Form>
        <div
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
          }}
        >
          <Button style={{ marginRight: 8 }} onClick={() => handleCancel()}>
            取消
          </Button>
          <Button style={{ marginRight: 8 }} onClick={() => handleSave()} type="primary">
            保存
          </Button>
          <Button type="primary" onClick={() => handleSendCheck()} >
            送审
          </Button>
        </div>
      </Drawer>
    </>
  );
}

ToApply.defaultProps = {
  userinfo: {
    userId: '',
    userName: '',
  }
};

export default Form.create()(ToApply);
