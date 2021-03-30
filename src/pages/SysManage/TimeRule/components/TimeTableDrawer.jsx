import React from 'react';
import moment from 'moment';
import { Drawer, Button, Form, Input, DatePicker, TimePicker, Select } from 'antd';

const { TextArea } = Input;
const { Option } = Select;
const format = 'HH:mm';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
  colon: false,
};

function TimeTableDrawer(props) {
  const { visible, ChangeVisible, title, handleSubmit } = props;
  const { getFieldDecorator, validateFields } = props.form;
  const required = true;
  const {
    id,
    actionDate,
    endH,
    endM,
    remark,
    startH,
    startM,
    type,
  } = props.record;
  const hanldleCancel = () => {
    ChangeVisible(false);
  };
  const handleOk = () => {
    validateFields((err, values) => {
      if (!err) {
        // 关闭弹窗
        hanldleCancel();
        // 传数据
        handleSubmit(values);
        props.form.resetFields();
        ChangeVisible(false);
      }
    });
  };
  return (
    <Drawer
      title={title}
      width={600}
      onClose={hanldleCancel}
      visible={visible}
      bodyStyle={{ paddingBottom: 60 }}
      destroyOnClose
    >
      <Form {...formItemLayout} onSubmit={handleOk}>
        <Form.Item label="Id">
          {getFieldDecorator('id', {
            initialValue: id,
          })(<Input placeholder="系统生成" disabled />)}
        </Form.Item>
        <Form.Item label="类型">
          {getFieldDecorator('type', {
            rules: [{ required, message: '请选择类型' }],
            initialValue: type,
          })(
            <Select placeholder="请选择" getPopupContainer={triggerNode => triggerNode.parentNode}>
              <Option value='W'>工作</Option>
              <Option value='R'>休息</Option>
              {/* <Option value='N'>工作时间段记录</Option> */}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="生效日期">
          {getFieldDecorator('actionDate', {
            rules: [{ required, message: '请选择生效日期' }],
            initialValue: moment(actionDate, 'YYYY-MM-DD HH:mm:ss'),
          })(
            <DatePicker
              showTime
              getCalendarContainer={triggerNode => triggerNode.parentNode}
              format='YYYY-MM-DD HH:mm:ss'
            />,
          )}
        </Form.Item>
        <Form.Item label="开始时间">
          {getFieldDecorator('starttime', {
            rules: [{ required, message: '请选择开始时间' }],
            initialValue: moment(`${startH}:${startM}`, 'HH:mm'),
          })(<TimePicker
            format={format}
            getPopupContainer={triggerNode => triggerNode.parentNode}
            minuteStep={10}
          />)}
        </Form.Item>
        <Form.Item label="结束时间">
          {getFieldDecorator('endtime', {
            rules: [{ required, message: '请选择结束时间' }],
            initialValue: moment(`${endH}:${endM}`, 'HH:mm'),
          })(<TimePicker
            format={format}
            getPopupContainer={triggerNode => triggerNode.parentNode}
            minuteStep={10}
          />)}
        </Form.Item>
        <Form.Item label="备注">
          {getFieldDecorator('remark', {
            initialValue: remark,
          })(<TextArea rows={2} />)}
        </Form.Item>

      </Form>

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
        <Button onClick={hanldleCancel} style={{ marginRight: 8 }}>
          取消
        </Button>
        <Button onClick={handleOk} type="primary">
          提交
        </Button>
      </div>
    </Drawer>
  );
}

TimeTableDrawer.defaultProps = {
  record: {
    actionDate: moment(),
    endH: '17',
    endM: '30',
    remark: '',
    startH: '8',
    startM: '0',
    type: 'W',
  },
};

export default Form.create()(TimeTableDrawer);
