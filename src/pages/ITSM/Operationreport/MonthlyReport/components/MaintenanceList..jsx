import React, { useEffect, useState } from 'react';
import {
  Table,
  Form,
  Input,
  Button,
  Popconfirm,
  message,
  DatePicker,
  Select
} from 'antd';
import moment from 'moment';

let deleteSign = false;
const { TextArea } = Input;
const { Option } = Select;
function MaintenanceList(props) {
  const {
    gettroubleList,
    troubleList,
    mainId,
    reportSearch
  } = props;
  const [data, setData] = useState([]);
  const [newbutton, setNewButton] = useState(false);

  // 新增一条记录
  const newMember = () => {
    const newData = (data).map(item => ({ ...item }));
    newData.push({
      key: data.length + 1,
      field1: data.length + 1
    });
    setData(newData);
    gettroubleList(newData)
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
    const newarr = target.map((item, index) => {
      return Object.assign(item, { editable: true, isNew: false, key: index, field1: index + 1 })
    });

    deleteSign = true;
    setData(newarr);
    gettroubleList(newarr)
  };

  const handleFieldChange = (e, fieldName, key) => {
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData);
    gettroubleList(newData)
    if (target) {
      if (fieldName === 'field2') {
        target[fieldName] = moment(e).format('YYYY-MM-DD');
        gettroubleList(newData)
        setData(newData);
      } else {
        target[fieldName] = e;
        setData(newData);
      }
    }
  }

  const handleTabledata = () => {
    if (troubleList && troubleList.length && newbutton === false) {
      const newarr = troubleList.map((item, index) => {
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
            format='MM-DD'
            defaultValue={text ? moment(text) : ''}
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
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field4', record.key)}
          />
        )
      }
    },
    {
      title: '是否修复',
      dataIndex: 'field5',
      key: 'field5',
      render: (text, record) => {
        return (
          <Select
            defaultValue={text}
            onChange={e => handleFieldChange(e, 'field5', record.key)}
          >
            <Option value='是'>是</Option>
            <Option value='否'>否</Option>
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
  }, [troubleList])

  useEffect(() => {
    if (deleteSign) {
      deleteSign = false
    }
  }, [data, deleteSign])

  return (
    <>
      <p style={{ marginTop: 24 }}>(2)本月运维事件(故障)清单</p>
      {deleteSign === false && (
        <Table
          columns={column}
          dataSource={data}
          pagination={false}
          rowKey={record => record.key}
        />
      )}

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

export default Form.create({})(MaintenanceList)
