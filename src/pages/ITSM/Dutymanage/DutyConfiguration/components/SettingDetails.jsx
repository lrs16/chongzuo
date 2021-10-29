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
  message
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
    groupName,
    id,
    groupId,
    dispatch,
    settingDetails,
    getTable,
    month,
    currentYear,
    pagetitle
  } = props;

  console.log(settingDetails,'settingDetails')

  const [directorlist, setDirectorlist] = useState([]);// 值班人
  const [shiftlist, setShiftlist] = useState([]);// 值班人

  const required = true;

  const columns = [
    {
      title: '序号',
      key: 'index',
      dataIndex: 'index',
      render: (text, record, index) => {
        return (<span>{index + 1}</span>)
      }
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

  const handleopenClick = () => {
    if (title === '编辑排班信息') {
      dispatch({
        type: 'shiftsandholidays/fetchscheduleDetail',
        payload: id
      })
    }
    setVisible(true)
  }

  const directoruser = directorlist.map((opt) => (
    <Option key={opt.id} value={opt.id} disableuser={opt}>
      <div className={styles.disableuser}>
        <span>{opt.staffName}</span>
      </div>
    </Option>
  ));

  const shifarr = shiftlist.map((opt) => (
    <Option key={opt.id} value={opt.id} disableuser={opt}>
      <div className={styles.disableuser}>
        <span>{opt.shiftName}</span>
        <span>{opt.shiftType}</span>
      </div>
    </Option>
  ));

  //  请求选人
  const SearchDisableduser = (value, type) => {
    switch (type) {
      case 'director':
        staffSearch({ staffName: value, groupId, groupName }).then(res => {
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
    const { id, phone, deptNameExt, groupNames, shiftName, staffName, beginTime, endTime, shiftType } = opt.props.disableuser;
    switch (type) {
      case 'director':
        setFieldsValue({
          staffName, // 用户名称
          teststaffName: staffName,
          staffId: id, // 用户id
          deptName: deptNameExt,
          staffPhone: phone,
          groupName:groupNames
        });
        break;
      case 'shiftName':
        setFieldsValue({
          testshiftName:shiftName,
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
    dispatch({
      type: 'shiftsandholidays/clearstaff',
    })
    setVisible(false)
  }

  const handleSubmit = (newdata) => {
    if (!newdata.id) {
      return dispatch({
        type: 'shiftsandholidays/fetchstaffAdd',
        payload: newdata
      }).then(res => {
        if (res.code === 200) {
          getTable(currentYear, month)
          message.success(res.msg)
        } else {
          message.error(res.msg)
        }
      })
    }

    if (newdata.id) {
      return dispatch({
        type: 'shiftsandholidays/fetchstaffUpdata',
        payload: newdata
      }).then(res => {
        if (res.code === 200) {
          getTable(currentYear, month)
          message.success(res.msg)
        } else {
          message.error(res.msg)
        }
      })
    }
    return []
  }

  const handleOk = () => {
    validateFields((err, values) => {
      const newValue = {
        id,
        groupId: sessionStorage.getItem('groupId'),
        ...values,
        beginTime: moment(values.beginTime).format('HH:mm'),
        endTime: moment(values.endTime).format('HH:mm'),
        ctime: moment(values.ctime).format('YYYY-MM-DD HH:mm:ss'),
        dutyDate: values.dutyDate ? moment(values.dutyDate).format('YYYY-MM-DD HH:mm:ss') : '',
      }
      if (!err) {
        if(values.staffName) {
          if(values.shiftName) {
            handleSubmit(newValue);
            setVisible(false);
            dispatch({
              type: 'shiftsandholidays/clearstaff',
            })
          } else {
            message.error('请通过班次名称下拉值形式选择班次名称')
          }
        } else {
          message.error('请通过值班人下拉值形式选择值班人')
        }
     
      }
    })
  }

  const handleDelete = () => {
    return dispatch({
      type: 'dutyandtypesetting/fetchdelId',
      payload: { id }
    }).then(res => {
      if (res.code === 200) {
        message.success(res.msg);
        getTable(moment(new Date()).format('YYYY'), moment(new Date()).format('MM'))
        setVisible(false);
        dispatch({
          type: 'shiftsandholidays/clearstaff',
        })
      } else {
        message.error(res.msg)
        setVisible(false);
        dispatch({
          type: 'shiftsandholidays/clearstaff',
        })
      }
    })
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
        destroyOnClose='true'
        onClose={handleCancel}
      >
        <Form {...formItemLayout}>
          <Form.Item label="值班人">
            {getFieldDecorator('teststaffName', {
              rules: [
                {
                  required,
                  message: '请选择值班人',
                },
              ],
              initialValue: settingDetails.staffName,
            })(
              <AutoComplete
                disabled={pagetitle === '排班查询' || new Date().valueOf() > new Date(settingDetails.dutyDate).valueOf()}
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
              )(<Input disabled={pagetitle === '排班查询' || new Date().valueOf() > new Date(settingDetails.dutyDate).valueOf()} />)
            }
          </Form.Item>

          <Form.Item label="班次名称">
            {getFieldDecorator('testshiftName', {
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
                  placeholder="可输入班次名称搜索"
                  onSearch={values => SearchDisableduser(values, 'shiftName')}
                  allowClear
                />
              </AutoComplete>,
            )}
          </Form.Item>

          <Form.Item style={{ display: 'none' }}>
            {
              getFieldDecorator('shiftName', {
                initialValue: settingDetails.shiftName
              })(<Input />)
            }
          </Form.Item>

          <Form.Item style={{ display: 'none' }}>
            {
              getFieldDecorator('shiftId', {
                initialValue: settingDetails.shiftId
              })(<Input />)
            }
          </Form.Item>

          <Form.Item style={{ display: 'none' }}>
            {
              getFieldDecorator('groupName', {
                initialValue: settingDetails.groupName
              })(<Input />)
            }
          </Form.Item>

          <Form.Item style={{ display: 'none' }}>
            {
              getFieldDecorator('staffName', {
                initialValue: settingDetails.staffName
              })(<Input />)
            }
          </Form.Item>

          <Form.Item style={{ display: 'none' }}>
            {
              getFieldDecorator('staffId', {
                initialValue: settingDetails.staffId
              })(<Input />)
            }
          </Form.Item>

          <Form.Item label='值班日期'>
            {
              getFieldDecorator('dutyDate', {
                rules: [
                  {
                    required,
                    message: '请选择值班日期',
                  },
                ],
                initialValue: settingDetails.dutyDate ? moment(settingDetails.dutyDate) : '',
              }
              )(
                <DatePicker
                  disabled={title === '编辑排班信息'}
                  format='YYYY-MM-DD'
                  onChange={handleSelecttime}
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
                      initialValue: (settingDetails.shift && settingDetails.shift.beginTime) ? moment(settingDetails.shift.beginTime, format) : ''
                    },
                  )(
                    <TimePicker
                      disabled
                      format={format}
                      allowClear
                      style={{ width: '100%' }}
                    />
                  )}
                </Col>
                <Col span={2} style={{ textAlign: 'center' }}>-</Col>
                <Col span={11}>
                  {getFieldDecorator(
                    'endTime',
                    {
                      initialValue: (settingDetails.shift && settingDetails.shift.endTime) ? moment(settingDetails.shift.endTime, format) : ''
                    },
                  )(
                    <TimePicker
                      disabled
                      format="HH:mm"
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
                initialValue: settingDetails.creatorName || sessionStorage.getItem('userName'),
              }
              )(<Input disabled />)
            }

          </Form.Item>

        </Form>

        <Table
          columns={columns}
          dataSource={settingDetails.log}
        />

        {
          pagetitle === '排班设置' && (
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

              {
                ((settingDetails && settingDetails.dutyDate) ? new Date().valueOf() < new Date(settingDetails.dutyDate).valueOf() : true) && (
                  <Button onClick={handleOk} type='primary' style={{ marginRight: 8 }}>
                    确定
                  </Button>
                )
              }

              {
                pagetitle !== '排班查询' && settingDetails && settingDetails.dutyDate && new Date().valueOf() < new Date(settingDetails.dutyDate).valueOf() && (
                  <Button onClick={handleDelete} type='danger' ghost>
                    删除
                  </Button>
                )
              }
            </div>
          )
        }

        {
          pagetitle === '排班查询' && (
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
            </div>
          )
        }
      </Drawer>
    </>
  )
}

SettingDetails.defaultProps = {
  settingDetails: {
    staffPhone: '',
    dutyDate: '',
    weekday: '',
    shift: { beginTime: '', endTime: '' },
    creatorName: sessionStorage.getItem('userName'),
    createtime: '',
    ctime: '',
    shiftType: '',
    log: [],
    shiftPeriod: ''
  }
}

export default Form.create({})(
  connect(({ shiftsandholidays }) => ({
    settingDetails: shiftsandholidays.settingDetails,
  }))(SettingDetails)
)


