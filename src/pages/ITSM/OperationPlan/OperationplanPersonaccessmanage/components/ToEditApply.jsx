import React, { useState } from 'react';
import moment from 'moment';
import {
  Form, Input, Button, Drawer,
  Select,
  DatePicker,
  Message
} from 'antd';

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
function ToEditApply(props) {
  const [visible, setVisible] = useState(false);
  const required = true;
  const {
    form: { getFieldDecorator, validateFields, resetFields },
    children, title,
    selectedRows,
    dispatch,
    onChangeList
  } = props;

  const handleopenClick = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
    resetFields();
  };

  // 保存
  const handleSave = () => {
    validateFields((err, values) => {
      if (!err) {
        handleCancel();
        props.onSumit(values);
        resetFields();
      }
    });
  };

  // 送审
  const handleSendCheck = () => {
    validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'apply/sendCheck',
          payload: {
            ...values,
            id: selectedRows[0].id,
            planInTime: (values.planInTime === '' || values.planInTime === 'Invalid date') ? '' : moment(values.planInTime).format('YYYY-MM-DD HH:mm:ss'),
            planOutTime: (values.planOutTime === '' || values.planOutTime === 'Invalid date') ? '' : moment(values.planOutTime).format('YYYY-MM-DD HH:mm:ss'),
            applyTime: (values.applyTime === '' || values.applyTime === 'Invalid date') ? '' : moment(values.applyTime).format('YYYY-MM-DD HH:mm:ss'),
          },
        }).then(res => {
          if (res.code === 200) {
            Message.success(res.msg);
            onChangeList();
          } else {
            Message.error(res.msg);
          }
        });
        handleCancel();
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
        <Form {...formItemLayout}>
          <Form.Item label="进出申请编号">
            {getFieldDecorator('registNo', {
              initialValue: selectedRows.length === 1 ? selectedRows[0].registNo : '',
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
              initialValue: selectedRows.length === 1 ? selectedRows[0].name : '',
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
              initialValue: selectedRows.length === 1 ? selectedRows[0].sex : '',
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
              initialValue: selectedRows.length === 1 ? selectedRows[0].phone : '',
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
              initialValue: selectedRows.length === 1 ? selectedRows[0].content : '',
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
              initialValue: selectedRows.length === 1 ? moment(selectedRows[0].planTnTime) : moment(Date.now()),
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
              initialValue: selectedRows.length === 1 ? moment(selectedRows[0].planOutTime) : moment(Date.now()),
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
              initialValue: selectedRows.length === 1 ? selectedRows[0].carryTool : '',
            })(<Input placeholder="请输入" />)}
          </Form.Item>
          <Form.Item label="申请人">
            {getFieldDecorator('applyUser', {
              initialValue: selectedRows.length === 1 ? selectedRows[0].applyUser : '',
            })(<Input placeholder="请输入" disabled />)}
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
          {
            (selectedRows[0] !== undefined && selectedRows[0].checkStatus === '0') && (
              <Button type="primary" onClick={() => handleSendCheck()}>
                送审
              </Button>
            )
          }
        </div>
      </Drawer>
    </>
  );
}

ToEditApply.defaultProps = {

};

export default Form.create()(ToEditApply);