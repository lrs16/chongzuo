import React, { useEffect, useRef, useImperativeHandle, useState } from 'react';
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
const Morethan5g = React.forwardRef((props, ref) => {
  const attRef = useRef();
  useImperativeHandle(
    ref,
    () => ({
      attRef,
    }),
    [],
  );

  const {
    table5Garr,
    table5GList,
    reportSearch,
  } = props;

  const [data, setData] = useState([]);
  const [newbutton, setNewButton] = useState(false);

  // 新增一条记录
  const newMember = () => {
    const newData = (data).map(item => ({ ...item }));
    newData.push({
      key: data.length,
      id: '',
      field1: '',
      field2: '',
      field3: '',
      field4: '',
    });
    setData(newData);
    table5GList(newData)
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
      return Object.assign(item, { editable: true, isNew: false, key: index })
    });

    deleteSign = true;
    setData(target);
    table5GList(target)
  };


  const handleFieldChange = (e, fieldName, key) => {
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData);
    table5GList(newData)
    if (target) {
      if(fieldName === 'field5') {
        target[fieldName] = moment(e).format('YYYY-MM-DD');
        setData(newData);
      } else {
        target[fieldName] = e;
        setData(newData);
      }
    }
  }

  const handleTabledata = () => {
    if (newbutton === false && table5Garr && table5Garr.length) {
      const newarr = table5Garr.map((item, index) => {
        return Object.assign(item, { editable: true, isNew: false, key: index })
      })
      setData(newarr)
    }
  }

  const column = [
    {
      title: '用户名',
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
      title: '表名',
      dataIndex: 'field2',
      key: 'field2',
      render: (text, record) => {
        return (
          <Input
            disabled={reportSearch}
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field2', record.key)}
          />
        )
      }
    },
    {
      title: '表总大小/GB',
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
      title: `表所处空间`,
      dataIndex: 'field4',
      key: 'field4',
      render: (text, record) => {
        return (
          <Input
            disabled={reportSearch}
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field4', record.key)}
          />
        )
      }
    },
    {
      title: `创建时间`,
      dataIndex: 'field5',
      key: 'field5',
      render: (text, record) => {
        return (
          <DatePicker
            disabled={reportSearch}
            defaultValue={text ? moment(text) :''}
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
  }, [table5Garr]);

  useEffect(() => {
    if (deleteSign) {
      deleteSign = false
    }
  }, [data, deleteSign])

  return (
    <>
      <p style={{ marginTop: 24 }}>（4）新增容量超过5G的表</p>

      {deleteSign === false && (
        <Table
          columns={column}
          dataSource={data}
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
})

export default Form.create({})(Morethan5g)
