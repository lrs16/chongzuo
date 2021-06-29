import React, { useEffect, useRef, useImperativeHandle, useState } from 'react';
import {
  Row,
  Form,
  Input,
  Popconfirm,
  Table,
  Button,
} from 'antd';

const AddTable = React.forwardRef((props, ref) => {
  const attRef = useRef();
  useImperativeHandle(
    ref,
    () => ({
      attRef,
    }),
    [],
  );

  const {
    handleDelete,
    patrolAndExamine, //  巡检列表
    detailParams,
    dynamicTablelist,
  } = props;

  const [data, setData] = useState([]);
  const [newbutton, setNewButton] = useState(false);
  // const [addList, setAddList] = useState([]);
  // const [dynamicTabledata,setDynamicTabledata] = useState([]);

  const newMember = () => {
    const newData = (data).map(item => ({ ...item }));
    newData.push({
      key: data.length + 1,
      field1: '',
      field2: '',
      field3: '',
      field4: '',
      field5: '',
      field6: '',
      field7: '',
      field8: '',
      field9: '',
      field10: '',
    });
    setData(newData);
  };

  //  获取行  
  const getRowByKey = (key, newData) => {
    return (newData || data).filter(item => item.key === key)[0];
  }

  //  删除数据
  const remove = key => {
    const target = getRowByKey(key) || {};
    handleDelete(target.id)
  };

  const handleFieldChange = (e, fieldName, key) => {
    const newData = (data).map(item => ({ ...item }));
    const target = getRowByKey(key, newData)
    if (target) {
      if (target) {
        target[fieldName] = e;
        setData(newData);
      }
    }
  }

  const column = [
    {
      title: '表头1',
      dataIndex: 'field1',
      key: 'field1',
      render: (text, record) => {
        return (
          <Input
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field1', record.key)}
          />
        )
      }
    },
    {
      title: '表头2',
      dataIndex: 'field2',
      key: 'field2',
      render: (text, record) => {
        return (
          <Input
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field2', record.key)}
          />
        )
      }
    },
    {
      title: '表头3',
      dataIndex: 'field3',
      key: 'field3',
      render: (text, record) => {
        return (
          <Input
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field3', record.key)}
          />
        )
      }
    },
    {
      title: '表头4',
      dataIndex: 'field4',
      key: 'field4',
      render: (text, record) => {
        return (
          <Input
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field4', record.key)}
          />
        )
      }
    },
    {
      title: '表头5',
      dataIndex: 'field5',
      key: 'field5',
      render: (text, record) => {
        // if (record.isNew) {
        return (
          <Input
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field5', record.key)}
          />
        )
        // }
        // if (record.isNew === false) {
        //   return <span>{text}</span>
        // }
      }
    },
    {
      title: '表头6',
      dataIndex: 'field6',
      key: 'field6',
      render: (text, record) => {
        // if (record.isNew) {
        return (
          <Input
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field6', record.key)}
          />
        )
      }
    },
    {
      title: '表头7',
      dataIndex: 'field7',
      key: 'field7',
      render: (text, record) => {
        return (
          <Input
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field7', record.key)}
          />
        )
      }
    },
    {
      title: '表头8',
      dataIndex: 'field8',
      key: 'field8',
      render: (text, record) => {
        return (
          <Input
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field8', record.key)}
          />
        )
      }
    },
    {
      title: '表头9',
      dataIndex: 'field9',
      key: 'field9',
      render: (text, record) => {
        return (
          <Input
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field9', record.key)}
          />
        )
      }
    },
    {
      title: '表头10',
      dataIndex: 'field10',
      key: 'field10',
      render: (text, record) => {
        return (
          <Input
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field10', record.key)}
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
              disabled={detailParams}
            >
              <a>删除</a>
            </Popconfirm>
          </span>
        )
      }

    }
  ];


  const handleTabledata = () => {
    const newarr = (patrolAndExamine?.length ? patrolAndExamine : []).map((item, index) => {
      return Object.assign(item, { editable: true, isNew: false, key: index })
    })
    setData(newarr)
  }

  const handleSubmit = () => {
    dynamicTablelist({tableindex:data});
  }

  useEffect(() => {
    handleTabledata();
  }, [patrolAndExamine])

  return (
    <>
      {/* { loading === false && ( */}
      <Row gutter={16}>
        <Form>
          <div>
            <div style={{ textAlign: 'right' }}>
              <Button
                onClick={handleSubmit}
                type='primary'
                
              >
                保存
              </Button>
            </div>

            <div>
              <Table
                columns={column}
                dataSource={data}
              />
            </div>

            <div>
              <Button
                style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
                type="primary"
                ghost
                onClick={() => newMember()}
                icon="plus"
                disabled={newbutton}
              >
                新增行
              </Button>
            </div>
          </div>





        </Form>
      </Row>

      {/* // )} */}

    </>
  )
})



export default Form.create({})(AddTable)
