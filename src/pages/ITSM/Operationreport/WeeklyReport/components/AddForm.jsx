import React, { useEffect, useRef, useImperativeHandle, useContext, useState } from 'react';
import {
  Row,
  Col,
  Form,
  Input,
  Popconfirm,
  Table,
  Button,
  Divider,
  Select,
  message
} from 'antd';
import moment from 'moment';
import SysUpload from '@/components/SysUpload';

const { TextArea } = Input;
const { Option } = Select;

const AddForm = React.forwardRef((props, ref) => {
  const attRef = useRef();
  useImperativeHandle(
    ref,
    () => ({
      attRef,
    }),
    [],
  );
  const required = true;

  const {
    form: { getFieldDecorator, setFieldsValue, validateFields },
    handleDelete,
    formincontentLayout,
    ChangeFiles,
    patrolAndExamine, //  巡检列表
    dynamicData,
    px,
    initialDynamic,
    list,
    files,
    addTable,
    index,
    saveForm,
    loading
  } = props;

  const [data, setData] = useState([]);

  // 初始化把数据传过去
  // useEffect(() => {
  //   props.form.validateFields((err, value) => {
  //     // if (!err) {
  //     const editTable = {
  //       ...value,
  //       list: data,
  //       px,
  //     }
  //     addTable(editTable)
  //     // list([editTable])
  //     // }
  //   })
  // }, [dynamicData]);

  const newMember = (params) => {
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

  const deleteObj = (key, newData) => {
    return (newData || data).filter(item => item.key !== key);
  }

  //  删除数据
  const remove = key => {
    const target = deleteObj(key) || {};
    setData(target)
  };

  const titleNumber = () => {
    return `标题${px}`
  }

  const contentNumber = () => {
    return `内容${px}`
  }

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
            <Popconfirm title="是否要删除此行？" onConfirm={() => remove(record.key)}>
              <a>删除</a>
            </Popconfirm>
          </span>
        )
      }

    }
  ];

  const handleTabledata = () => {
    const newarr = (dynamicData.list?.length ? dynamicData.list : []).map((item, index) => {
      return Object.assign(item, { editable: true, isNew: false, key: index })
    })
    setData(newarr)
  }

  const handleSubmit = () => {
    props.form.validateFields((err, value) => {
      // if (!err) {
      const editTable = {
        ...value,
        list: data,
        px,
      }
      addTable(editTable);
      message.info('暂存保存数据成功')
      // }
    })
  }

  useEffect(() => {
    handleTabledata();
  }, [dynamicData])

  return (
    <>
      <Row gutter={16}>
        <Form>
          {/* {index === 0 && ( */}
            <Button
              type='primary'
              onClick={handleSubmit}
            >
              保存
            </Button>
          {/* // )} */}

          <Col><p>注：第一行数据作为表头</p></Col>

          <Form.Item label={titleNumber()} {...formincontentLayout}>
            {getFieldDecorator(`title`, {
              initialValue: dynamicData.title
            })(
              <Input />
            )}
          </Form.Item>

          <Form.Item label={contentNumber()} {...formincontentLayout}>
            {getFieldDecorator(`content`, {
              initialValue: dynamicData.content
            })(
              <TextArea autoSize={{ minRows: 3 }} />
            )}
          </Form.Item>

          <Form.Item label='上传附件'    {...formincontentLayout}>
            {getFieldDecorator(`files`, {
              initialValue: dynamicData.files ? dynamicData.files : ''
            })(
              <SysUpload
                fileslist={dynamicData.files ? JSON.parse(dynamicData.files) : []}
                ChangeFileslist={newvalue => {
                  setFieldsValue({
                    files: JSON.stringify(newvalue.arr),
                  })
                  handleSubmit();
                }}
              />
            )}
          </Form.Item>

          <Table
            columns={column}
            dataSource={data}
          />
          <Button
            style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
            type="primary"
            ghost
            onClick={() => newMember()}
            icon="plus"
          >
            新增行
          </Button>
        </Form>
      </Row>
    </>
  )
})

AddForm.defaultProps = {
  dynamicData: {
    title: '',
    content: '',
    files: [],
  }
}


export default Form.create({})(AddForm)
