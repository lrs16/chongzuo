import React, { useEffect, useState } from 'react';
import {
  Table,
  Form,
  Input,
  Button,
  Popconfirm,
  Select,
  message,
  DatePicker
} from 'antd';
import moment from 'moment';

const { TextArea } = Input;
const { Option } = Select;
function NewTroublelist(props) {

  const {
    faultlist,
    newTroubleList,
    reportSearch,
    mainId,
  } = props;
  const [data, setData] = useState([]);
  const [newbutton, setNewButton] = useState(false);

  // 新增一条记录
  const newMember = () => {
    const newData = (data).map(item => ({ ...item }));
    newData.push({
      key: data.length + 1,
      field1: data.length + 1,
    });
    setData(newData);
    newTroubleList(newData);
    setNewButton(true);
  };

  //  获取行  
  const getRowByKey = (key, newData) => {
    return (newData || data).filter(item => item.key === key)[0];
  }

  const deleteObj = (key, newData) => {
    return (newData || data).filter(item => item.key !== key);
  }

  //  删除数据
  const remove = key => {
    const target = deleteObj(key) || {};
    setData(target);
    newTroubleList(target);
    message.info('删除成功')
  };

  const handleFieldChange = (e, fieldName, key) => {
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData);
    newTroubleList(newData);
    if (target) {
      if (fieldName === 'field1' || fieldName === 'addTime') {
        target[fieldName] = moment(e).format('YYYY-MM-DD');
        setData(newData);
      } else {
        target[fieldName] = e;
        setData(newData);
      }

    }
  }

  const handleTabledata = () => {
    if (faultlist && faultlist.length && newbutton === false) {
      const newarr = faultlist.map((item, index) => {
        return Object.assign(item, { editable: true, isNew: false, key: index, field1: index + 1 })
      })
      setData(newarr)
    }
  }

  const column = [
    {
      title: '序号',
      dataIndex: 'field1',
      key: 'field1',
      render: (text, record) => {
        return (
          <Input
            disabled={reportSearch}
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field1', record.key)}
          />
        )
      }
    },
    {
      title: '日期',
      dataIndex: 'field2',
      key: 'field2',
      render: (text, record) => {
        return (
          <DatePicker
            disabled={reportSearch}
            defaultValue={text ? moment(text) : moment(new Date())}
            onChange={e => handleFieldChange(e, 'field2', record.key)}
          />
        )
      }
    },
    {
      title: '故障类型',
      dataIndex: 'field3',
      key: 'field3',
      render: (text, record) => {
        return (
          <Input
            disabled={reportSearch}
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'typecn', record.key)}
          />
        )
      }
    },
    {
      title: '故障情况',
      dataIndex: 'field4',
      key: 'field4',
      render: (text, record) => {
        return (
          <TextArea
            disabled={reportSearch}
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field4', record.key)}
          />
        )
      }
    },
    {
      title: '是否已修复',
      dataIndex: 'field5',
      key: 'field5',
      render: (text, record) => {
        return (
          <Select
            disabled={reportSearch}
            defaultValue={text}
            onChange={e => handleFieldChange(e, 'field5', record.key)}
          >
            <Option value="是">是</Option>
            <Option value="否">否</Option>
          </Select>
        )
      }
    },
    {
      title: '是否需要报告',
      dataIndex: 'field6',
      key: 'field6',
      render: (text, record) => {
        return (
          <Select
            disabled={reportSearch}
            defaultValue={text}
            onChange={e => handleFieldChange(e, 'field6', record.key)}
          >
            <Option value="是">是</Option>
            <Option value="否">否</Option>
          </Select>
        )
      }
    },
    {
      title: '报告提供方',
      dataIndex: 'field7',
      key: 'field7',
      render: (text, record) => {
        return (
          <Input
            disabled={reportSearch}
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field7', record.key)}
          />
        )
      }
    },
    {
      title: '是否已提供故障处理记录（报告）',
      dataIndex: 'field8',
      key: 'field8',
      render: (text, record) => {
        return (
          <Select
            disabled={reportSearch}
            defaultValue={text}
            onChange={e => handleFieldChange(e, 'field8', record.key)}
          >
            <Option value="是">是</Option>
            <Option value="否">否</Option>
          </Select>
        )
      }
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 120,
      render: (text, record) => {
        return (
          <span>
            <Popconfirm
              title="是否要删除此行？"
              onConfirm={() => remove(record.key)}
              disabled={reportSearch}
            >
              <a>删除</a>
            </Popconfirm>
          </span>
        )
      }
    }
  ];

  const editColumn = [
    {
      title: '序号',
      dataIndex: 'field1',
      key: 'field1',
      render: (text, record) => {
        return (
          <Input
            disabled={reportSearch}
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field1', record.key)}
          />
        )
      }
    },
    {
      title: '日期',
      dataIndex: 'field2',
      key: 'field2',
      render: (text, record) => {
        return (
          <DatePicker
            disabled={reportSearch}
            defaultValue={text ? moment(text) : moment(new Date())}
            onChange={e => handleFieldChange(e, 'field2', record.key)}
          />
        )
      }
    },
    {
      title: '故障类型',
      dataIndex: 'field3',
      key: 'field3',
      render: (text, record) => {
        return (
          <Input
            disabled={reportSearch}
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field3', record.key)}
          />
        )
      }
    },
    {
      title: '故障情况',
      dataIndex: 'field4',
      key: 'field4',
      render: (text, record) => {
        return (
          <TextArea
            disabled={reportSearch}
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field4', record.key)}
          />
        )
      }
    },
    {
      title: '是否已修复',
      dataIndex: 'field5',
      key: 'field5',
      render: (text, record) => {
        return (
          <Select
            disabled={reportSearch}
            defaultValue={text}
            onChange={e => handleFieldChange(e, 'field5', record.key)}
          >
            <Option value="是">是</Option>
            <Option value="否">否</Option>
          </Select>
        )
      }
    },
    {
      title: '是否需要报告',
      dataIndex: 'field6',
      key: 'field6',
      render: (text, record) => {
        return (
          <Select
            disabled={reportSearch}
            defaultValue={text}
            onChange={e => handleFieldChange(e, 'field6', record.key)}
          >
            <Option value="是">是</Option>
            <Option value="否">否</Option>
          </Select>
        )
      }
    },
    {
      title: '报告提供方',
      dataIndex: 'field7',
      key: 'field7',
      render: (text, record) => {
        return (
          <Input
            disabled={reportSearch}
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field7', record.key)}
          />
        )
      }
    },
    {
      title: '是否已提供故障处理记录（报告）',
      dataIndex: 'field8',
      key: 'field8',
      render: (text, record) => {
        return (
          <Select
            disabled={reportSearch}
            defaultValue={text}
            onChange={e => handleFieldChange(e, 'field8', record.key)}
          >
            <Option value="是">是</Option>
            <Option value="否">否</Option>
          </Select>
        )
      }
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 120,
      render: (text, record) => {
        return (
          <span>
            <Popconfirm
              title="是否要删除此行？"
              onConfirm={() => remove(record.key)}
              disabled={reportSearch}
            >
              <a>删除</a>
            </Popconfirm>
          </span>
        )
      }

    }
  ];


  useEffect(() => {
    handleTabledata();
  }, [faultlist])

  let setColumns = column;

  if (mainId) {
    setColumns = editColumn
  }
  return (
    <>
      <p style={{ fontWeight: '900', fontSize: '16px' }}>三、本周新增故障及故障修复情况统计</p>

      <p>(1)新增及已修复故障</p>

      {/* <div style={{ textAlign: 'right', marginBottom: 10 }}>
        <Button
          disabled={reportSearch}
          type='primary'
          onClick={handleSave}>保存</Button>
      </div> */}

      <Table
        columns={setColumns}
        dataSource={data}
        pagination={false}
      />

      <Button
        style={{ width: '100%', marginTop: 16 }}
        type="primary"
        ghost
        onClick={() => newMember()}
        icon="plus"
        disabled={reportSearch}
      >
        新增
      </Button>
    </>
  )
}

export default Form.create({})(NewTroublelist)
