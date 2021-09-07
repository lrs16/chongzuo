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
  message
} from 'antd';
import moment from 'moment';

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

const withClick = (element, handleClick = () => { }) => {
  return <element.type {...element.props} onClick={handleClick} />
}

function AddholidaySetting(props) {
  const [visble, setVisble] = useState(false);
  const [data, setData] = useState([]);
  const [newbutton, setNewButton] = useState(false);
  const {
    title,
    children,
    onSubmit,
    id,
    onDelete
  } = props;

  const required = true;

  const handleopenClick = () => {
    setVisble(true)
  }

  const handleCancel = () => {
    setVisble(false)
  }

  const handleOk = () => {
    validateFields((err, values) => {
      if (!err) {
        onSubmit(values);
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
      field1: '',
      field2: moment(new Date()),
      field3: moment(new Date()),
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
  }

  // 保存记录
  const saveRow = (e, key) => {
    const target = getRowByKey(key) || {};
    if (!target.field1) {
      message.error('请填写完整信息。');
      e.target.focus();
      return;
    }
    delete target.key;
    target.editable = false;
    const id = target.id === '' ? '' : target.id;
    //  保存数据
    setNewButton(false);

  }

  const columns = [
    {
      title: '节日名称',
      dataIndex: 'field1',
      key: 'field1',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              defaultValue={text}
              onChange={e => handleFieldChange(e.target.value, 'field1', record.key)}
              style={{ borderColor: '#ff4d4f' }}
            />
          )
        }

        return text

      }
    },
    {
      title: '节日排期开始时间',
      dataIndex: 'field2',
      key: 'field2',
      render: (text, record) => {
        if(record.editable){
          return (
            <div>
              <DatePicker
                defaultValue={text}
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
      dataIndex: 'field3',
      key: 'field2',
      render: (text, record) => {
        if(record.editable) {
          return (
            <div>
              <DatePicker
                defaultValue={text}
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
            <a onClick={e => saveRow(e, record.key)}>编辑</a>
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

  console.log(data, 'data')


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

          {
            id && (
              <Button onClick={handleDelete} type='danger' ghost>
                删除
              </Button>
            )
          }

        </div>
      </Drawer>
    </>
  )
}

export default AddholidaySetting