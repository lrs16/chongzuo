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

// let startTime;
// let endTime;

const { Option } = Select;

const withClick = (element, handleClick = () => { }) => {
  return <element.type {...element.props} onClick={handleClick} />;
};

function AddDutyclassesSetting(props) {
  const [visible, setVisible] = useState(false);
  const {
    form: { getFieldDecorator, validateFields, setFieldsValue },
    title,
    children,
    onSubmit,
    classSetting,
  } = props;
  const format = 'HH:mm';
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
      const newValue = {
        id: classSetting.id || '',
        ...values,
        beginTime: moment(values.beginTime).format('HH:mm'),
        endTime: moment(values.endTime).format('HH:mm'),
        ctime: moment(values.ctime).format('YYYY-MM-DD HH:mm:ss'),
        status: (values.status === '启动' || values.status === true ) ? '1' : '0'
      }

      if (!err) {
        onSubmit(newValue);
        setVisible(false);
      }
    });
  };

  // const disabledHours = (time1, time2, time3) => {
  //   if (startTime) {
  //     const hours = startTime.split(':');
  //     const nums = [];
  //     for (let i = 0; i < hours[0] - 1; i += 1) {
  //       nums.push(i + 1);
  //     }
  //     return nums;
  //   }
  // };

  // const startdisabledHours = () => {
  //   if (endTime) {
  //     const hours = endTime.split(':');
  //     const nums = [];
  //     for (let i = 0; i < 24 - hours[0]; i += 1) {
  //       nums.push(Number(hours[0]) + i);
  //     }
  //     return nums;
  //   }
  // };

  const hancleChange = (value, option) => {
    const { values } = option.props;
    setFieldsValue(
      {
        groupName: values,
      }
    )
  }

  const getTypebyTitle = titles => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.title === titles)[0].children;
    }
    return []
  };

  const teamname = getTypebyTitle('班组名称');
  const teamtype = getTypebyTitle('班次类型');
  return (
    <>
      {withClick(children, handleopenClick)}
      <SysDict
        typeid='1021'
        commonid="335"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Drawer
        visible={visible}
        title={title}
        width={720}
        centered="true"
        maskClosable='true'
        destroyOnClose='true'
        onClose={handleCancel}
      >
        <Row gutter={8}>
          <Form {...formItemLayout}>
            <Form.Item label="班次编号">
              {getFieldDecorator('shiftNo', {
                initialValue: classSetting.shiftNo
              })(<Input disabled />)}
            </Form.Item>

            <Form.Item label='班组名称'>
              {getFieldDecorator('groupId', {
                rules: [
                  {
                    required,
                    message: '请选择班组名称'
                  }
                ],
                initialValue: classSetting.groupId
              })(
                <Select placeholder="请选择" onChange={hancleChange}>
                  {teamname.map(obj => [
                    <Option
                      key={obj.key}
                      values={obj.title}
                    >
                      {obj.title}
                    </Option>
                  ])}
                </Select>
              )}
            </Form.Item>

            <Form.Item label='班次类型'>
              {getFieldDecorator('shiftType', {
                rules: [
                  {
                    required,
                    message: '请选择班次类型'
                  }
                ],
                initialValue: classSetting.shiftType
              })(
                <Select placeholder="请选择">
                  {teamtype.map(obj => [
                    <Option
                      key={obj.title}
                      values={obj.title}
                    >
                      {obj.title}
                    </Option>
                  ])}
                </Select>
              )}
            </Form.Item>


            <Form.Item style={{ display: 'none' }}>
              {getFieldDecorator('groupName', {
                initialValue: classSetting.groupName
              })(<Input />)}
            </Form.Item>

            <Form.Item label="班次名称">
              {getFieldDecorator('shiftName', {
                rules: [
                  {
                    required,
                    message: '请输入班次名称',
                  },
                ],
                initialValue: classSetting.shiftName
              })(<Input />)}
            </Form.Item>

            <Col>
              <Form.Item label="值班时段">
                <Row>
                  <Col span={11}>
                    {getFieldDecorator('beginTime',
                      {
                        rules: [
                          {
                            required,
                            message: '请选择时间',
                          },
                        ],
                        initialValue: classSetting.beginTime ? moment(classSetting.beginTime, format) : moment(new Date())
                      },
                    )(
                      <TimePicker
                        format={format}
                        allowClear={false}
                        // disabledHours={startdisabledHours}
                        // onChange={startOnchange}
                        style={{ width: '100%' }}
                      />
                    )}
                  </Col>
                  <Col span={2} style={{ textAlign: 'center' }}>-</Col>
                  <Col span={11}>
                    {getFieldDecorator(
                      'endTime',
                      {
                        rules: [
                          {
                            required,
                            message: '请选择时间',
                          },
                        ],
                        initialValue: classSetting.endTime ? moment(classSetting.endTime, format) : moment(new Date())
                      },
                    )(
                      <TimePicker
                        allowClear
                        // disabledHours={disabledHours}
                        format={format}
                        // onChange={endOnchange}
                        style={{ width: '100%' }}
                      />
                    )}
                  </Col>
                </Row>
              </Form.Item>
            </Col>

            <Form.Item label="启用状态">
              {getFieldDecorator('status', {
                valuePropName: classSetting.status === '启动' ? 'checked' : 'value',
                initialValue: classSetting.status
              })(<Switch
                checkedChildren='开启'
                unCheckedChildren='停用'
                
              />)}
            </Form.Item>

            <Form.Item label="创建人">
              {getFieldDecorator('creatorName', {
                initialValue: sessionStorage.getItem('userName')
              })
                (<Input disabled />)
              }
            </Form.Item>

            <Form.Item label="创建时间">{getFieldDecorator('ctime', {
              initialValue: classSetting.ctime ? moment(classSetting.ctime) : moment(new Date())
            })(<DatePicker
              format='YYYY-DD-MM HH:mm'
              disabled
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

        </div>
      </Drawer>
    </>
  );
}

AddDutyclassesSetting.defaultProps = {
  classSetting: {
    shiftNo: '',
    shiftName: '',
    beginTime: '',
    endTime: '',
    creatorName: sessionStorage.getItem('userName'),
    ctime: '',
    shiftType: '',
    groupId: '',
    groupName: '',
    status: '0'
  }
}

export default Form.create({})(AddDutyclassesSetting);
