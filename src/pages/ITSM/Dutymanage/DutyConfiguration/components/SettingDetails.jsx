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
  Table,
  Checkbox
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import styles from '../index.less';
import { staffSearch } from '../services/dutyandtypesetting';
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

const columns = [
  {
    title: '序号',
    key: 'index',
    dataIndex: 'index'
  },
  {
    title: '操作人',
    key: 'operatorName',
    dataIndex: 'operatorName'
  },
  {
    title: '操作',
    key: 'operate',
    dataIndex: 'operate'
  },
  {
    title: '操作描述',
    key: 'comment',
    dataIndex: 'comment'
  },
  {
    title: '操作时间',
    key: 'ctime',
    dataIndex: 'ctime'
  },
]

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
    groupId,
    onDelete,
    dispatch,
    settingDetails,
  } = props;
  const [directorlist, setDirectorlist] = useState([]);// 值班人
  const [shiftlist, setShiftlist] = useState([]);// 值班人

  const required = true;

  const handleopenClick = () => {
    if (title === '编辑排班信息') {
      console.log(1)
      dispatch({
        type: 'dutyandtypesetting/fetchscheduleDetail',
        payload: id
      })
    } 
    if(title !== '编辑排班信息') {
      console.log(2)
      dispatch({
        type: 'dutyandtypesetting/clearstaff',
      })
    }
    setVisible(true)
  }

  const directoruser = directorlist.map((opt, index) => (
    <Option key={opt.id} value={opt.id} disableuser={opt}>
      {/* <Spin spinning={spinloading}> */}
      <div className={styles.disableuser}>
        <span>{opt.staffName}</span>
      </div>
      {/* </Spin> */}
    </Option>
  ));

  const shifarr = shiftlist.map((opt, index) => (
    <Option key={opt.id} value={opt.id} disableuser={opt}>
      {/* <Spin spinning={spinloading}> */}
      <div className={styles.disableuser}>
        <span>{opt.shiftName}</span>
        <span>{opt.shiftType}</span>
      </div>
      {/* </Spin> */}
    </Option>
  ));

  //  请求选人
  const SearchDisableduser = (value, type) => {
    switch (type) {
      case 'director':
        staffSearch({ staffName: value, groupId }).then(res => {
          if (res) {
            const arr = [...(res.data.records)];
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
    const { id, userMobile, deptNameExt, shiftName, staffName, beginTime, endTime, shiftType } = opt.props.disableuser;
    switch (type) {
      case 'director':
        setFieldsValue({
          staffName, // 用户名称
          staffId: id, // 用户id
          deptName: deptNameExt,
          staffPhone: userMobile
        });
        break;
      case 'shiftName':
        setFieldsValue({
          shiftName, // 用户名称
          shiftType,
          shiftId: id,
          beginTime: moment(beginTime, format),
          endTime: moment(endTime, format),
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
        id,
        groupId: sessionStorage.getItem('groupId'),
        ...values,
        beginTime: moment(values.beginTime).format('HH:mm'),
        endTime: moment(values.endTime).format('HH:mm'),
        ctime: moment(values.ctime).format('YYYY-MM-DD HH:mm:ss'),
        dutyDate: values.dutyDate ? moment(values.dutyDate).format('YYYY-MM-DD HH:mm:ss') : '',
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
                initialValue: settingDetails.staffId
              })
            }
          </Form.Item>

          <Form.Item label='联系电话'>
            {
              getFieldDecorator('staffPhone', {
                rules: [
                  {
                    required,
                    message: '请输入联系电话',
                  },
                ],
                initialValue: settingDetails.staffPhone,
              }
              )(<Input />)
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
                disabled={title === '编辑排班信息'}
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

          <Form.Item style={{ display: 'none' }}>
            {
              getFieldDecorator('shiftId', {
                initialValue: settingDetails.shiftId
              })(<Input />)
            }
          </Form.Item>

          <Form.Item label='值班日期'>
            {
              getFieldDecorator('dutyDate', {
                initialValue: settingDetails.dutyDate ? moment(settingDetails.dutyDate) : '',
              }
              )(
                <DatePicker
                  disabled={title === '编辑排班信息'}
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

          <Form.Item label='班次类型'>
            {
              getFieldDecorator('shiftType', {
                initialValue: settingDetails.shiftType,
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
                      initialValue: settingDetails.beginTime ? moment(settingDetails.beginTime, format) : ''
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
                      initialValue: settingDetails.endTime ? moment(settingDetails.endTime, format) : ''
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


          {/* <Form.Item label='创建时间'>
            {
              getFieldDecorator('ctime', {
                initialValue: settingDetails.ctime ? moment(settingDetails.ctime) : moment(new Date()),
              }
              )(<DatePicker disabled />)
            }

          </Form.Item> */}

        </Form>

        <Table
          columns={columns}
          dataSource={settingDetails.log}
        />

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
    ctime: '',
    shiftType: '',
    log: []
  }
}

export default Form.create({})(
  connect(({ dutyandtypesetting, loading }) => ({
    settingDetails: dutyandtypesetting.settingDetails,
    loading: dutyandtypesetting.loading
  }))(SettingDetails)
)


