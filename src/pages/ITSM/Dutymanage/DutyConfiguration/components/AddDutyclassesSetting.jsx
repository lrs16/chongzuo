import React, { useState } from 'react';
import {
  Drawer,
  Form,
  Input,
  Button,
  TimePicker,
  DatePicker,
  Switch,
  Select
} from 'antd';
import moment from 'moment';
import SysDict from '@/components/SysDict';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

let startTime;
let endTime;
let minuteStart;
let minuteEnd;

const { Option } = Select;
const Hours = Array.from(Array(24), (v, k) => k);
const Minutes = Array.from(Array(60), (v, k) => k);
const Seconds = Array.from(Array(60), (v, k) => k);

const withClick = (element, handleClick = () => { }) => {
  return <element.type {...element.props} onClick={handleClick} />;
};

function AddDutyclassesSetting(props) {
  const [visible, setVisible] = useState(false);
  const {
    form: { getFieldDecorator, validateFields },
    title,
    children,
    onSubmit,
    id,
    onDelete,
  } = props;
  const [selectdata, setSelectData] = useState('');

  const required = true;

  const handleopenClick = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleOk = () => {
    validateFields((err, values) => {
      if (!err) {
        onSubmit(values);
        setVisible(false);
      }
    });
  };

  const handleDelete = id => {
    onDelete(id);
  };

  const startOnchange = (time, timeString) => {
    startTime = timeString;
    console.log('timeString: ', timeString);
  };

  const endOnchange = (time, timeString) => {
    endTime = timeString;
  };

  const disabledHours = (time1, time2, time3) => {
    if (startTime) {
      const hours = startTime.split(':');
      const nums = [];
      for (let i = 0; i < hours[0] - 1; i += 1) {
        nums.push(i + 1);
      }
      return nums;
    }
  };

  const startdisabledHours = () => {
    if (endTime) {
      const hours = endTime.split(':');
      const nums = [];
      for (let i = 0; i < 24 - hours[0]; i += 1) {
        nums.push(Number(hours[0]) + i);
      }

      console.log(nums, 'nums');
      return nums;
    }
  };

  const disabledMinutes = (h, time2, time3) => { 
    if (endTime) {
      if (h < endTime.hour()) return [];
      const m = endTime.minute();
      return Minutes.slice(m, Minutes.length - 1);
    }
    return [];
  };

  const getTypebyTitle = title => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.title === title)[0].children;
    }
    return []
  };

  const teamname = getTypebyTitle('班组名称');
  return (
    <>
      {withClick(children, handleopenClick)}
      <SysDict
        typeid="1438058740916416514"
        commonid="1354288354950123522"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Drawer visible={visible} title={title} width={720} centered="true">
        <Form {...formItemLayout}>
          <Form.Item label="班次编号">
            {getFieldDecorator('NO', {})(<Input disabled />)}
          </Form.Item>

          <Form.Item label="班组名称">
            {getFieldDecorator('groupname', {})(
              <Select placeholder="请选择">
                {teamname.map(obj => [
                  <Option
                    key={obj.dict_code}
                    values={obj.dict_code}
                  >
                    {obj.title}
                  </Option>
                ])}
              </Select>
            )}
          </Form.Item>

          <Form.Item label="班次名称">
            {getFieldDecorator('name', {})(<Input />)}
          </Form.Item>

          <Form.Item label="值班时段">
            {getFieldDecorator(
              'time',
              {},
            )(
              <div>
                <TimePicker
                  disabledHours={startdisabledHours}
                  format="HH:mm"
                  onChange={startOnchange}
                />
                <span style={{ margin: 'auto 3px' }}>-</span>
                <TimePicker
                  disabledHours={disabledHours}
                  // disabledMinutes={disabledMinutes}
                  onChange={endOnchange}
                  format="HH:mm"
                />
              </div>,
            )}
          </Form.Item>

          <Form.Item label="启用状态">{getFieldDecorator('status', {})(<Switch />)}</Form.Item>

          <Form.Item label="创建人">{getFieldDecorator('person', {})(<Input />)}</Form.Item>

          <Form.Item label="创建时间">{getFieldDecorator('time', {})(<DatePicker />)}</Form.Item>
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
          <Button onClick={handleCancel} style={{ marginRight: 8 }}>
            取消
          </Button>

          <Button onClick={handleOk} type="primary" style={{ marginRight: 8 }}>
            确定
          </Button>

          {id && (
            <Button onClick={handleDelete} type="danger" ghost>
              删除
            </Button>
          )}
        </div>
      </Drawer>
    </>
  );
}

export default Form.create({})(AddDutyclassesSetting);
