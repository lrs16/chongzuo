import React, { useState } from 'react';
import {
  Drawer,
  Form,
  Input,
  Button,
  TimePicker,
  DatePicker,
  Switch,
  Select,
  Row,
  Col,
  message
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
let compareStart;
let compareEnd;

const { Option } = Select;

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
    classSetting
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
      const defaultStart = moment(values.time1).format('YYYY-MM-DD HH:mm:ss');
      const defaultEnd = moment(values.time2).format('YYYY-MM-DD HH:mm:ss');

      if (!err) {
        if ((compareEnd < compareStart) || (defaultStart === defaultEnd)) {
          message.info('开始时间必须小于结束时间')
        } else {
          onSubmit(values);
          setVisible(false);
        }

      }
    });
  };

  const handleDelete = id => {
    onDelete(id);
  };

  const startOnchange = (time, timeString) => {
    startTime = timeString;
    compareStart = (new Date(moment(time).format('YYYY-MM-DD HH:mm:ss'))).valueOf();
  };



  const endOnchange = (time, timeString) => {
    endTime = timeString;
    compareEnd = (new Date(moment(time).format('YYYY-MM-DD HH:mm:ss'))).valueOf();
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
      return nums;
    }
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
      <Drawer 
      visible={visible}
       title={title}
        width={720}
         centered="true"
         >
        <Row gutter={8}>
          <Form {...formItemLayout}>
            <Form.Item label="班次编号">
              {getFieldDecorator('NO', {
                initialValue: classSetting.NO
              })(<Input disabled />)}
            </Form.Item>

            <Form.Item label="班组名称">
              {getFieldDecorator('groupname', {
                rules: [
                  {
                    required,
                    message: '请选择班组名称'
                  }
                ],
                initialValue: classSetting.groupname
              })(
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
              {getFieldDecorator('name', {
                rules: [
                  {
                    required,
                    message: '请输入班次名称',
                  },
                ],
                initialValue: classSetting.name
              })(<Input />)}
            </Form.Item>

            <Col>
              <Form.Item label="值班时段">
                <Row>
                  <Col span={11}>
                    {getFieldDecorator('time1',
                      {
                        rules: [
                          {
                            required,
                            message: '请选择时间',
                          },
                        ],
                        initialValue: classSetting.time1 ? moment(classSetting.time1) : moment(new Date())
                      },
                    )(
                      <TimePicker
                        allowClear
                        disabledHours={startdisabledHours}
                        format="HH:mm"
                        onChange={startOnchange}
                        style={{ width: '100%' }}
                      />
                    )}
                  </Col>
                  <Col span={2} style={{ textAlign: 'center' }}>-</Col>
                  <Col span={11}>
                    {getFieldDecorator(
                      'time2',
                      {
                        rules: [
                          {
                            required,
                            message: '请选择时间',
                          },
                        ],
                        initialValue: classSetting.time2 ? moment(classSetting.time2) : moment(new Date())
                      },
                    )(
                      <TimePicker
                        allowClear
                        disabledHours={disabledHours}
                        format="HH:mm"
                        onChange={endOnchange}
                        style={{ minWidth: 120, width: '100%' }}
                      />
                    )}
                  </Col>
                </Row>
              </Form.Item>
            </Col>


            <Form.Item label="启用状态">{getFieldDecorator('status', {
              rules: [
                {
                  required,
                  message: '请输入启用状态',
                },
              ],
              initialValue: classSetting.status
            })(<Switch />)}</Form.Item>

            <Form.Item label="创建人">{getFieldDecorator('person', {
              initialValue: classSetting.person
            })(<Input />)}</Form.Item>

            <Form.Item label="创建时间">{getFieldDecorator('time', {
              initialValue: classSetting.time ? moment(classSetting.time) : moment(new Date())
            })(<DatePicker 
                  format='YYYY-DD-MM HH:mm'
            />)}</Form.Item>
          </Form>

        </Row>

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

AddDutyclassesSetting.defaultProps = {
  classSetting: {
    NO: '',
    groupname: '',
    name: '',
    time1: '',
    time2: '',
    status: '',
    person: sessionStorage.getItem('userName'),
    time: ''
  }
}

export default Form.create({})(AddDutyclassesSetting);
