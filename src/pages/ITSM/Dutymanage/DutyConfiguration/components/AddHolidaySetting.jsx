import React, { useState } from 'react';
import {
  Drawer,
  Form,
  Input,
  Button,
  DatePicker,
  Switch,
  Table,
  Popconfirm,
  Divider,
  message,
  Row,
  Col,
  Select
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 }
  }
}

const { Option } = Select;

const withClick = (element, handleClick = () => { }) => {
  return <element.type {...element.props} onClick={handleClick} />
}

function AddholidaySetting(props) {
  const [visble, setVisble] = useState(false);
  const [data, setData] = useState([]);
  const [newbutton, setNewButton] = useState(false);
  const [selectSwitch, setSelectSwitch] = useState(0);
  const [formdata, setFormdata] = useState('');
  const [time, setTime] = useState({
    startValue: moment(new Date(moment(new Date()).format('YYYY-MM-DD 00:00:00'))),
    endValue: moment(new Date(moment(new Date()).format('YYYY-MM-DD 23:59:59'))),
    endOpen: false,
  })

  const {
    form: { getFieldDecorator, validateFields },
    dispatch,
    title,
    children,
    onSubmit,
    id,
  } = props;

  const handleopenClick = () => {
    if (id) {
      dispatch({
        type: 'dutyandtypesetting/fetchholidayId',
        payload: id
      }).then(res => {
        if (res.code === 200) {
          const newarr = (res.data.holidays).map((item, index) => {
            return Object.assign(item, { editable: false, isNew: false, key: index })
          })
          setData(newarr);
          setFormdata(res.data)
          setVisble(true);
          setSelectSwitch(res.data.status)
        }
      })
    } else {
      setVisble(true)
    }
  }

  const handleCancel = () => {
    setVisble(false);
    setFormdata('');
    setData([])
  }

  const handleOk = () => {
    validateFields((err, values) => {
      if (!err) {
        const result = {
          id,
          ...values,
          holidays: data,
          status: selectSwitch
        }
        onSubmit(result);
        setVisble(false);
        setFormdata('');
        setData([])
      }
    })
  }

  //  ??????????????????
  const newMember = () => {
    const newData = data.map(item => ({ ...item }));
    newData.push({
      key: data.length + 1,
      holidayName: '',
      dateType: '?????????',
      beginDate: moment(new Date()).format('YYYY-MM-DD'),
      endDate: moment(new Date()).format('YYYY-MM-DD'),
      duringTime: ['', ''],
      editable: true,
    })
    setData(newData)
    setNewButton(true);
  }

  //  ?????????
  const getRowByKey = (key, newData) => {
    return (newData || data).filter(item => item.key === key)[0];
  }

  const handleFieldChange = (e, fieldName, key) => {
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData);

    if (target) {
      target[fieldName] = e;
      setData(newData)
    }
  }

  const deleteObj = (key, newData) => {
    return (newData || data).filter(item => item.key !== key);
  }

  const remove = key => {
    const target = deleteObj(key);
    const newarr = target.map((item, index) => {
      return Object.assign(item, { key: index })
    })
    setData(newarr);
    setNewButton(false)
  }

  const toggleEditable = (e, key) => {
    e.preventDefault();
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData);
    if (target) {
      target.editable = !target.editable;
      setData(newData);
      setNewButton(true);
    }
  }

  // ????????????
  const saveRow = (e, key) => {
    const target = getRowByKey(key) || {};
    if (!target.holidayName || !target.dateType) {
      message.error('????????????????????????');
      e.target.focus();
      return;
    }

    if ((target.beginDate).valueOf() > (target.endDate).valueOf()) {
      message.error('????????????????????????????????????');
      e.target.focus();
      return;
    }

    target.editable = false;
    //  ????????????
    setNewButton(false);
  }

  //  ????????????????????????????????????
  //  ?????????????????????
  // const disabledStartDate = (startValue, type,detailstart,detailend) => {
  //   if (type === 'create') {
  //     const { endValue } = time;
  //     if (!startValue || !endValue) {
  //       console.log(11)
  //       return false;
  //     }

  //     console.log(startValue,'startValue');
  //     console.log(detailstart,'detailstart');

  //     return detailstart.valueOf() > detailend.valueOf()
  //   }

  //   if (type === 'duty') {
  //     const { endValue } = dutytime;
  //     if (!startValue || !endValue) {
  //       return false;
  //     }
  //     return startValue.valueOf() > endValue.valueOf()
  //   }

  // }
  // const handleStartOpenChange = (open, type) => {
  //   if (!open && type === 'create') {
  //     const obj = time;
  //     obj.endOpen = true;
  //     setTime(obj);
  //   }

  //   if (!open && type === 'duty') {
  //     const obj = dutytime;
  //     obj.endOpen = true;
  //     setDutytime(obj);
  //   }
  // };

  // const disabledEndDate = (endValue, type,detailstart,detailend) => {
  //   if (type === 'create') {
  //     const { startValue } = time;
  //     if (!endValue || !startValue) {
  //       return false;
  //     }
  //     return (detailend || endValue).valueOf() <= (detailstart || startValue).valueOf();
  //   }

  //   if (type === 'duty') {
  //     const { startValue } = dutytime;
  //     if (!endValue || !startValue) {
  //       return false;
  //     }
  //     return endValue.valueOf() <= startValue.valueOf();
  //   }

  // };

  // const timeonChange = (field, value, type) => {
  //   if (type === 'create') {
  //     const obj = time;
  //     switch (field) {
  //       case 'startValue':
  //         obj.startValue = value;
  //         setTime(obj);
  //         break;
  //       case 'endValue':
  //         obj.endValue = value;
  //         setTime(obj);
  //         break;
  //       default:
  //         break;
  //     }
  //   }

  //   if (type === 'duty') {
  //     const obj = dutytime;
  //     switch (field) {
  //       case 'startValue':
  //         obj.startValue = value;
  //         setDutytime(obj);
  //         break;
  //       case 'endValue':
  //         obj.endValue = value;
  //         setDutytime(obj);
  //         break;
  //       default:
  //         break;
  //     }
  //   }

  // };

  // const hancleChange = (value, option) => {
  //   const { values } = option.props;
  //   setFieldsValue(
  //     {
  //       groupName: values,
  //     }
  //   )
  // }

  // const onStartChange = (value, type) => {
  //   timeonChange('startValue', value, type);
  // };

  // const onEndChange = (value, type) => {
  //   timeonChange('endValue', value, type);
  // };

  // const handleEndOpenChange = (open, type) => {
  //   if (type === 'create') {
  //     const obj = time;
  //     obj.endOpen = open
  //     setTime(obj);
  //   } else {
  //     const obj = dutytime;
  //     obj.endOpen = open
  //     setDutytime(obj);
  //   }

  // };

  const columns = [
    {
      title: '????????????',
      dataIndex: 'holidayName',
      key: 'holidayName',
      render: (text, record) => {
        if (record.editable) {
          if (text === '') {
            return (
              <Input
                defaultValue={text}
                onChange={e => handleFieldChange(e.target.value, 'holidayName', record.key)}
                style={{ borderColor: '#ff4d4f' }}
              />
            )
          }

          if (text) {
            return (
              <Input
                defaultValue={text}
                onChange={e => handleFieldChange(e.target.value, 'holidayName', record.key)}
              />
            )
          }
        }
        return text
      }
    },
    {
      title: '??????',
      dataIndex: 'dateType',
      key: 'dateType',
      width: 150,
      render: (text, record) => {
        if (record.editable) {
          return (
            <Select
              allowClear={false}
              defaultValue={text}
              onChange={e => handleFieldChange(e, 'dateType', record.key)}
              placeholder="?????????"
              style={{ width: '100%' }}
            >
              <Option key='?????????' value='?????????'>?????????</Option>
              <Option key='?????????' value='?????????'>?????????</Option>
            </Select>
          )
        }

        return text

      }
    },
    {
      title: '??????????????????',
      dataIndex: 'duringTime',
      key: 'duringTime',
      width: 300,
      render: (text, record) => {
        if (record.editable) {
          return (
            <Row>
              <Col span={10}>
              <DatePicker
                allowClear={false}
                // disabled={!record.editable}
                // disabledDate={(value) => disabledStartDate(value, 'create',moment(moment(new Date(record.beginDate)).format('YYYY-MM-DD')),moment(moment(new Date(record.endDate)).format('YYYY-MM-DD')))}
                onChange={(value) => { handleFieldChange(value.format('YYYY-MM-DD'), 'beginDate', record.key) }}
                // onOpenChange={(value) => handleStartOpenChange(value, 'create')}
                defaultValue={record.beginDate ? moment(record.beginDate) : time.startValue}
                placeholder="????????????"
                format='YYYY-MM-DD'
                style={{ minWidth: 100, width: '100%' }}
              />
              </Col>
              <Col span={1} style={{ textAlign: 'center' }}>-</Col>
              <Col span={10}>
              <DatePicker
                allowClear={false}
                // disabled={!record.editable}
                // disabledDate={(value) => disabledEndDate(value, 'create',moment(moment(new Date(record.beginDate)).format('YYYY-MM-DD')),moment(moment(new Date(record.endDate)).format('YYYY-MM-DD')))}
                onChange={(value) => { handleFieldChange(value.format('YYYY-MM-DD'), 'endDate', record.key) }}
                // open={time.endOpen}
                // onOpenChange={(value) => handleEndOpenChange(value, 'create')}
                // showTime={{
                //   hideDisabledOptions: true,
                //   defaultValue: moment('23:59:59', 'HH:mm:ss'),
                // }}
                defaultValue={record.endDate ? moment(record.endDate) : time.endValue}
                // value={record.endDate ? moment(record.endDate) : time.endValue}
                placeholder="????????????"
                format='YYYY-MM-DD'
                style={{ minWidth: 100, width: '100%' }}
              />
              </Col>
            </Row>
          )
        }

        return <span>{record.beginDate} - {record.endDate}</span>
      }
    },
    {
      title: '??????',
      key: 'action',
      fixed: 'right',
      render: (text, record) => {
        if (record.editable) {
          return (
            <span>
              <a onClick={e => saveRow(e, record.key)}>??????</a>
              <Divider type="vertical" />
              <Popconfirm
                title='?????????????????????'
                onConfirm={() => remove(record.key)}
              >
                <a>??????</a>
              </Popconfirm>
            </span>
          )
        }

        return (
          <span>
            <a onClick={e => toggleEditable(e, record.key)}>??????</a>
            <Divider type="vertical" />
            <Popconfirm
              title='?????????????????????'
              onConfirm={() => remove(record.key)}
            >
              <a>??????</a>
            </Popconfirm>
          </span>
        )
      }
    }
  ]

  const onChange = (checked) => {
    setSelectSwitch(checked === true ? '1' : '0')
  }

  return (
    <>
      {withClick(children, handleopenClick)}
      <Drawer
        visible={visble}
        title={title}
        width={720}
        centered='true'
        maskClosable='true'
        destroyOnClose='true'
        onClose={handleCancel}
      >
        <Form {...formItemLayout}>
          <Form.Item label='????????????'>
            {getFieldDecorator('schemeName', {
              rules: [
                {
                  required: true,
                  message: '?????????????????????'
                }
              ],
              initialValue: formdata.schemeName
            })
              (<Input />)
            }
          </Form.Item>

        </Form>

        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
        />

        <Button
          style={{ width: '100%', marginTop: '16', marginBottom: '8' }}
          type='primary'
          ghost
          onClick={newMember}
          disabled={newbutton}
        >
          ??????
        </Button>

        <div style={{ marginTop: 10 }}>
          <span>??????????????????????????????</span>
          <Switch
            checkedChildren='??????'
            unCheckedChildren='??????'
            defaultChecked={Number(formdata.status)}
            onChange={onChange}
          />
        </div>

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
            ??????
          </Button>

          <Button
            onClick={handleOk}
            type='primary'
            style={{ marginRight: 8 }}
            disabled={newbutton}
          >
            ??????
          </Button>

        </div>
      </Drawer>
    </>
  )
}

AddholidaySetting.defaultProps = {
  holidaySetting: {
    schemeName: '',
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

export default Form.create({})(
  connect(({ loading }) => ({
    loading: loading.models.dutyandtypesetting
  }))(AddholidaySetting)
)