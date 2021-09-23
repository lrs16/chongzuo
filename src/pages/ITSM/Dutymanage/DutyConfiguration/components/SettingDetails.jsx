import React, { useState } from 'react';
import {
  Drawer,
  Form,
  Input,
  Button,
  TimePicker,
  DatePicker,
  AutoComplete,
  Select,
  Col,
  Row,
  message
} from 'antd';
import moment from 'moment';
import styles from '../index.less';
import { operationPerson, searchUsers } from '@/services/common';
import { shiftSearch } from '../services/shiftsandholidays';


const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 }
  }
}

let startTime;
let endTime;
const format = 'HH:mm';

const { Option } = Select;
const { Search } = Input;

const withClick = (element, handleClick = () => { }) => {
  return <element.type {...element.props} onClick={handleClick} />
}

function SettingDetails(props) {
  const [visible, setVisible] = useState(false);
  const {
    form: { getFieldDecorator, validateFields, setFieldsValue },
    title,
    children,
    onSubmit,
    id,
    onDelete,
    settingDetailsparams,
    settingDetails,
  } = props;
  const [directorlist, setDirectorlist] = useState([]);// 值班人
  const [shiftlist, setShiftlist] = useState([]);// 值班人


  const required = true;


  const handleopenClick = () => {
    console.log(settingDetailsparams, 'settingDetailsparams')
    setVisible(true)
  }

  const directoruser = directorlist.map((opt, index) => (
    <Option key={opt.id} value={opt.id} disableuser={opt}>
      {/* <Spin spinning={spinloading}> */}
      <div className={styles.disableuser}>
        <span>{opt.userName}</span>
      </div>
      {/* </Spin> */}
    </Option>
  ));

  const shifarr = shiftlist.map((opt, index) => (
    <Option key={opt.id} value={opt.id} disableuser={opt}>
      {/* <Spin spinning={spinloading}> */}
      <div className={styles.disableuser}>
        <span>{opt.shiftName}</span>
      </div>
      {/* </Spin> */}
    </Option>
  ));

  //  请求选人
  const SearchDisableduser = (value, type) => {
    switch (type) {
      case 'director':
        searchUsers({ userName: value }).then(res => {
          if (res) {
            const arr = [...(res.data)];
            setDirectorlist(arr);
          }
        });
        break;
      case 'shiftName':
        shiftSearch({ shiftName: value }).then(res => {
          if (res) {
            const arr = [...res.data.records];
            setShiftlist(arr);
          }
        });
        break;
      default:
        break;
    }
  };

  // 选择下拉值，信息回填
  const handleDisableduser = (v, opt, type) => {
    const { id, userMobile, deptNameExt, shiftName, userName,beginTime,endTime } = opt.props.disableuser;
    switch (type) {
      case 'director':
        setFieldsValue({
          staffName: userName, // 用户名称
          staffId: id, // 用户id
          deptName: deptNameExt,
          staffPhone: userMobile
        });
        break;
      case 'shiftName':
        setFieldsValue({
          shiftName, // 用户名称
          shiftId:id,
          beginTime: moment(beginTime,format),
          endTime: moment(endTime,format),
        });
        break;

      default:
        break;
    }
  };

  const handleCancel = () => {
    setVisible(false)
  }

  const handleOk = () => {
    validateFields((err, values) => {
      const newValue = {
        // id:classSetting.id || '',
        ...values,
        beginTime: moment(values.beginTime).format('HH:mm'),
        endTime: moment(values.endTime).format('HH:mm'),
        ctime: moment(values.ctime).format('YYYY-MM-DD HH:mm:ss'),
        dutyDate : values.dutyDate ? moment(values.dutyDate).format('YYYY-MM-DD HH:mm:ss'):'',
      }
      if (!err) {
        onSubmit(newValue);
        setVisible(false)
      }
    })
  }

  const handleDelete = (id) => {
    onDelete(id)
  }

  const startOnchange = (time, timeString) => {
    startTime = timeString
    console.log('timeString: ', timeString);
  }

  const endOnchange = (time, timeString) => {
    endTime = timeString
  }

  const disabledHours = (time1, time2, time3) => {
    if (startTime) {
      const hours = startTime.split(':');
      const nums = [];
      for (let i = 0; i < hours[0] - 1; i += 1) {
        nums.push(i + 1);
      }
      return nums;
    }

  }

  const startdisabledHours = () => {
    if (endTime) {
      const hours = endTime.split(':');
      console.log('hours: ', hours);
      const nums = [];
      for (let i = 0; i < 24 - hours[0]; i += 1) {
        nums.push(Number(hours[0]) + i);
      }

      console.log(nums, 'nums')
      return nums;
    }
  }

  const disabledMinutes = (time1, time2, time3) => {

  }

  const handleSelecttime = (value) => {
    setFieldsValue({ weekday: moment(value).format('dddd') })
  }

  return (
    <>
      {withClick(children, handleopenClick)}
      <Drawer
        visible={visible}
        title={title}
        width={720}
        centered='true'
        maskClosable='true'
        onClose={handleCancel}
      >
        <Form {...formItemLayout}>
          <Form.Item label="值班人">
            {getFieldDecorator('staffName', {
              rules: [
                {
                  required,
                  message: '请选择责任人',
                },
              ],
              initialValue: settingDetails.staffName,
            })(
              <AutoComplete
                dataSource={directoruser}
                dropdownMatchSelectWidth={false}
                getPopupContainer={e => e.parentNode}
                dropdownStyle={{ width: 600 }}
                onSelect={(v, opt) => handleDisableduser(v, opt, 'director')}
              >
                <Search
                  placeholder="可输入人名称搜索"
                  onSearch={values => SearchDisableduser(values, 'director')}
                  allowClear
                />
              </AutoComplete>,
            )}
          </Form.Item>

          <Form.Item style={{ display: 'none' }}>
            {
              getFieldDecorator('staffId', {
                initialValue:settingDetails.staffId
              })
            }
          </Form.Item>

          <Form.Item label='联系电话'>
            {
              getFieldDecorator('staffPhone', {
                initialValue: settingDetails.staffPhone,
              }
              )(<Input disabled />)
            }

          </Form.Item>

          <Form.Item label="班次名称">
            {getFieldDecorator('shiftName', {
              rules: [
                {
                  required,
                  message: '请选择班次名称',
                },
              ],
              initialValue: settingDetails.shiftName,
            })(
              <AutoComplete
                dataSource={shifarr}
                dropdownMatchSelectWidth={false}
                getPopupContainer={e => e.parentNode}
                dropdownStyle={{ width: 600 }}
                onSelect={(v, opt) => handleDisableduser(v, opt, 'shiftName')}
              >
                <Search
                  placeholder="可输入人名称搜索"
                  onSearch={values => SearchDisableduser(values, 'shiftName')}
                  allowClear
                />
              </AutoComplete>,
            )}
          </Form.Item>

          <Form.Item style={{display:'none'}}>
              {
                getFieldDecorator('shiftId',{
                  initialValue:settingDetails.shiftId
                })(<Input/>)
              }
          </Form.Item>

          <Form.Item label='值班日期'>
            {
              getFieldDecorator('dutyDate', {
                initialValue: settingDetails.dutyDate,
              }
              )(
                <DatePicker
                  showTime
                  format='YYYY-MM-DD'
                  onOk={handleSelecttime}
                />)
            }

          </Form.Item>

          <Form.Item label='值班星期'>
            {
              getFieldDecorator('weekday', {
                initialValue: settingDetails.weekday,
              }
              )(<Input disabled />)
            }

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
                      // initialValue: classSetting.beginTime ? moment(classSetting.beginTime, format) : moment(new Date())
                    },
                  )(
                    <TimePicker
                      disabled
                      // defaultValue={moment('00:00', 'HH:mm')}
                      format={format}
                      allowClear
                      // disabledHours={startdisabledHours}
                      // format="HH:mm"
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
                      // initialValue: classSetting.endTime ? moment(classSetting.endTime, format) : moment(new Date())
                    },
                  )(
                    <TimePicker
                      disabled
                      // disabledHours={disabledHours}
                      format="HH:mm"
                      // onChange={endOnchange}
                      style={{ minWidth: 120, width: '100%' }}
                    />
                  )}
                </Col>
              </Row>
            </Form.Item>
          </Col>

          <Form.Item label='创建人'>
            {
              getFieldDecorator('creatorName', {
                initialValue: settingDetails.creatorName,
              }
              )(<Input disabled />)
            }

          </Form.Item>


          <Form.Item label='创建时间'>
            {
              getFieldDecorator('ctime', {
                initialValue: settingDetails.ctime || moment(new Date()),
              }
              )(<DatePicker disabled />)
            }

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
          <Button onClick={handleCancel} style={{ marginRight: 8 }}>
            取消
          </Button>

          <Button onClick={handleOk} type='primary' style={{ marginRight: 8 }}>
            确定
          </Button>

          {/* {
            id && ( */}
          <Button onClick={handleDelete} type='danger' ghost>
            删除
          </Button>
          {/* //   )
          // } */}
        </div>
      </Drawer>
    </>
  )
}

SettingDetails.defaultProps = {
  settingDetails: {
    staffName: '',
    staffId: '',
    staffPhone: '',
    dutyDate: '',
    weekday: '',
    creatorName: sessionStorage.getItem('userName'),
    createtime: '',
    ctime:''
  }
}

export default Form.create({})(SettingDetails)