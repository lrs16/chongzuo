import React, { useEffect, useState } from 'react';
import {
  Table,
  Form,
  Input,
  Button,
  Popconfirm,
  message,
  DatePicker
} from 'antd';
import moment from 'moment';

let deleteSign = false;
const { TextArea } = Input;
function UnCloseTroublelist(props) {
  const {
    unCloseTroubleList,
    uncloseaultlist,
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
    unCloseTroubleList(newData)
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
    unCloseTroubleList(newarr)
  };

  const handleFieldChange = (e, fieldName, key) => {
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData);
    if (target) {
      if (fieldName === 'field2' || fieldName === 'field5') {
        target[fieldName] = moment(e).format('YYYY-MM-DD');
        unCloseTroubleList(newData)
        setData(newData);
      } else {
        target[fieldName] = e;
        setData(newData);
      }
    }
  }

  const handleTabledata = () => {
    if (uncloseaultlist && uncloseaultlist.length && newbutton === false) {
      const newarr = uncloseaultlist.map((item, index) => {
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
      title: '计划修复时间',
      dataIndex: 'field5',
      key: 'field5',
      render: (text, record) => {
        return (
          <DatePicker
            disabled={reportSearch}
            defaultValue={text ? moment(text) : moment(new Date())}
            onChange={e => handleFieldChange(e, 'field5', record.key)}
          />
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

  }, [uncloseaultlist])

  useEffect(() => {
    if (deleteSign) {
      deleteSign = false
    }
  }, [data, deleteSign])


  return (
    <>
      <p style={{ marginTop: 24 }}>(2)未修复故障清单</p>


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

export default Form.create({})(UnCloseTroublelist)
