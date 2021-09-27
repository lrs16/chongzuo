import React, { useState } from 'react';
import {
  Drawer,
  Form,
  Input,
  Button,
  TimePicker,
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
  const [selectSwitch, setSelectSwitch] = useState(false);
  const [formdata, setFormdata] = useState('');

  console.log(data, 'data')
  const {
    form: { getFieldDecorator, validateFields },
    dispatch,
    title,
    children,
    onSubmit,
    id,
    onDelete,
    holidaySetting,
    records,
  } = props;

  const required = true;

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
          setVisble(true)
        }
      })
    } else {
      setVisble(true)
    }
  }

  const handleCancel = () => {
    setVisble(false)
  }

  const handleOk = () => {
    validateFields((err, values) => {
      if (!err) {
        const result = {
          id,
          ...values,
          holidays: data,
          status: selectSwitch === true ? '1' : '0'
        }

        onSubmit(result);
        setVisble(false)
      }
    })
  }

  const handleDelete = () => {
    onDelete(id)
  }

  //  新增一条记录
  const newMember = () => {
    const newData = data.map(item => ({ ...item }));
    newData.push({
      key: data.length + 1,
      holidayName: '',
      dateType: '工作日',
      beginDate: moment().format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD'),
      editable: true,
    })
    setData(newData)
    setNewButton(true);
  }

  //  获取行
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

  const toggleEditable = (e, key, record) => {
    e.preventDefault();
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData);
    if (target) {
      target.editable = !target.editable;
      setData(newData);
      setNewButton(true);
    }
  }

  // 保存记录
  const saveRow = (e, key) => {
    const target = getRowByKey(key) || {};
    if (!target.holidayName || !target.dateType) {
      message.error('请填写完整信息。');
      e.target.focus();
      return;
    }

    if ((target.beginDate).valueOf() > (target.endDate).valueOf()) {
      message.error('开始时间必须小于结束时间');
      e.target.focus();
      return;
    }
    // delete target.key;
    target.editable = false;
    // const id = target.id === '' ? '' : target.id;
    //  保存数据
    setNewButton(false);
  }

  const columns = [
    {
      title: '节日名称',
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
      title: '类型',
      dataIndex: 'dateType',
      key: 'dateType',
      width: 150,
      render: (text, record) => {
        if (record.editable) {
          return (
            <Select
              placeholder="请选择"
              style={{width:'100%'}}
            >
              <Option key='工作日' value='工作日'>工作日</Option>
              <Option key='节假日' value='节假日'>节假日</Option>
            </Select>
          )
        }

        return text

      }
    },
    {
      title: '节日排期开始时间',
      dataIndex: 'beginDate',
      key: 'beginDate',
      render: (text, record) => {
        const dateFormat = 'YYYY-MM-DD HH:mm:ss';
        if (record.editable) {
          return (
            <div>
              <DatePicker
                allowClear
                defaultValue={moment(text)}
                onChange={e => handleFieldChange(e.format('YYYY-MM-DD HH:mm:ss'), 'beginDate', record.key)}
                // disabledDate={this.disabledStartDate}
                // showTime
                // format="YYYY-MM-DD HH:mm:ss"
                // value={startValue}
                placeholder="Start"
              // onChange={this.onStartChange}
              // onOpenChange={this.handleStartOpenChange}
              />
            </div>
          )
        }

        return text
      }
    },
    {
      title: '节日排期结束时间',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (text, record) => {
        // const dateFormat = 'YYYY-MM-DD HH:mm:ss';
        if (record.editable) {
          return (
            <div>
              <DatePicker
                allowClear
                defaultValue={moment(text)}
                onChange={e => handleFieldChange(e.format('YYYY-MM-DD HH:mm:ss'), 'endDate', record.key)}
                // disabledDate={this.disabledStartDate}
                // showTime
                // format="YYYY-MM-DD HH:mm:ss"
                // value={startValue}
                placeholder="end"
              // onChange={this.onStartChange}
              // onOpenChange={this.handleStartOpenChange}
              />
            </div>
          )
        }
        return text
      }
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      render: (text, record) => {
        if (record.editable) {
          return (
            <span>
              <a onClick={e => saveRow(e, record.key)}>保存</a>
              <Divider type="vertical" />
              <Popconfirm
                title='是否要删除此行'
                onConfirm={() => remove(record.key)}
              >
                <a>删除</a>
              </Popconfirm>
            </span>
          )
        }

        return (
          <span>
            <a onClick={e => toggleEditable(e, record.key)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm
              title='是否要删除此行'
              onConfirm={() => remove(record.key)}
            >
              <a>删除</a>
            </Popconfirm>
          </span>
        )

      }
    }
  ]

  const onChange = (checked) => {
    console.log('checked: ', checked);
    setSelectSwitch(checked)
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
          <Form.Item label='方案名称'>
            {getFieldDecorator('schemeName', {
              rules: [
                {
                  required: true,
                  message: '请填写方案名称'
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
          icon
          onClick={newMember}
          disabled={newbutton}
        >
          新增
        </Button>

        <div style={{ marginTop: 10 }}>
          <span>设为默认节假日方案：</span>
          <Switch
            checkedChildren='开启'
            unCheckedChildren='关闭'
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
            取消
          </Button>

          <Button
            onClick={handleOk}
            type='primary'
            style={{ marginRight: 8 }}
            disabled={newbutton}
          >
            保存
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
  connect(({ dutyandtypesetting, loading }) => ({
    loading: loading.models.dutyandtypesetting
  }))(AddholidaySetting)
)