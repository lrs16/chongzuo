import React, { useEffect, useRef, useImperativeHandle, useState } from 'react';
import {
  Table,
  Form,
  Input,
  Button,
  Popconfirm,
  message
} from 'antd';

let deleteSign = false;
const { TextArea } = Input;
const Diskgroup = React.forwardRef((props, ref) => {
  const attRef = useRef();
  useImperativeHandle(
    ref,
    () => ({
      attRef,
    }),
    [],
  );

  const {
    discArr,
    discList,
    reportSearch
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
    // console.log(newKey,'newKey')
    setData([]);
    setData(JSON.parse(JSON.stringify(newData)));
    discList(JSON.parse(JSON.stringify(newData)));
    setNewButton(true);
  };

  //  获取行  
  const getRowByKey = (key, newData) => {
    return (newData || data).filter(item => item.key === key)[0];
  }

  const deleteObj = (key, newData) => {
    // const testdata = [...data];
    return (newData || data).filter(item => item.key !== key);
  }

  //  删除数据
  const remove = key => {
    const target = deleteObj(key) || {};
    console.log('target: ', target);
    const newarr = target.map((item, index) => {
      return Object.assign(item, { editable: true, isNew: false, key: index })
    });

    deleteSign = true;
    setData(newarr)
    discList(newarr)
  };

  const handleFieldChange = (e, fieldName, key) => {
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData);
    discList(newData);
    if (target) {
      target[fieldName] = e;
      setData(newData);
    }
  }

  const handleTabledata = () => {
    if (newbutton === false && discArr && discArr.length) {
      const newarr = discArr.map((item, index) => {
        return Object.assign(item, { editable: true, isNew: false, key: index })
      })
      setData(newarr)
    }
  }

  const column = [
    {
      title: '磁盘组',
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
      title: '总容量GB',
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
      title: '已使用容量GB',
      dataIndex: 'field3',
      key: 'field3',
      render: (text, record) => {
        return (
          <TextArea
            disabled={reportSearch}
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field3', record.key)}
          />
        )
      }
    },
    {
      title: '剩余容量GB（含镜像）',
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
      title: '实际可用',
      dataIndex: 'field5',
      key: 'field5',
      render: (text, record) => {
        return (
          <TextArea
            disabled={reportSearch}
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field5', record.key)}
          />
        )
      }
    },
    {
      title: '使用百分比',
      dataIndex: 'field6',
      key: 'field6',
      render: (text, record) => {
        return (
          <TextArea
            disabled={reportSearch}
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field6', record.key)}
          />
        )
      }
    },
    {
      title: '预计可用时长',
      dataIndex: 'field7',
      key: 'field7',
      render: (text, record) => {
        return (
          <TextArea
            disabled={reportSearch}
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field7', record.key)}
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
  }, [discArr])

  useEffect(() => {
    if(deleteSign) {
      deleteSign = false
    }
  }, [data, deleteSign])


  return (
    <>
      <p>（1）磁盘组</p>

      {deleteSign === false && (
        <Table
          columns={column}
          dataSource={data}
          rowKey={record => record.key}
        />
      )}

      <Button
        style={{ width: '100%', marginTop: 16, }}
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

export default Form.create({})(Diskgroup)
