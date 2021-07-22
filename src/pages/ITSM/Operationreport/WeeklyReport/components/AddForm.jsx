import React, { useEffect, useRef, useImperativeHandle, useState } from 'react';
import {
  Row,
  Col,
  Form,
  Input,
  Popconfirm,
  Table,
  Button,
  message,
  Icon,
  Descriptions
} from 'antd';
// import AddTable from './AddTable';
import SysUpload from '@/components/SysUpload';
import Downloadfile from '@/components/SysUpload/Downloadfile';

let deleteSign = false;
const { TextArea } = Input;
const AddForm = React.forwardRef((props, ref) => {
  const attRef = useRef();
  useImperativeHandle(
    ref,
    () => ({
      attRef,
    }),
    [],
  );

  const {
    form: { getFieldDecorator, setFieldsValue },
    loading,
    formincontentLayout,
    detailParams,
    dynamicData,
    px,
    addTable,
    ChangeAddRow,
    sign,
    changeDeletesign,
  } = props;
  const [addTitle, setAddTitle] = useState([]);
  const [data, setData] = useState([]);
  const [newbutton, setNewButton] = useState(false);

  // console.log(dynamicData,'dynamicData')

  const handleSubmit = (e, typeParams, tableData, rowdelete) => {
    //  解决异步导致的空行问题
    // const newData = (data).map(item => ({ ...item }));
    // if (!tableData) {
    //   newData.push({
    //     key: data.length,
    //     field1: '',
    //     field2: '',
    //     field3: '',
    //     field4: '',
    //     field5: '',
    //     field6: '',
    //     field7: '',
    //     field8: '',
    //     field9: '',
    //     field10: '',
    //   });
    // }


    props.form.validateFields((err, value) => {
      const editTable = {
        ...value,
        files: value.files ? value.files : '',
        content: typeParams === 'content' ? e : value.content,
        title: typeParams === 'title' ? e : value.title,
        list: tableData || data,
        px: px.toString()
      };
      addTable(editTable, editTable.px, rowdelete);
      ChangeAddRow(false)
    })
  }

  const handleTabledata = () => {
    if (dynamicData !== undefined && dynamicData.list && newbutton === false) {
      const newarr = (dynamicData.list).map((item, index) => {
        return Object.assign(item, { editable: true, isNew: false, key: index })
      })
      setData(newarr)
    }
  }

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
    handleSubmit();
    setData(newData);
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
      return Object.assign(item, { key: index + 1 })
    });

    deleteSign = true;
    handleSubmit(null, null, newarr, false);
    setData(newarr)
  };

  const titleNumber = () => {
    return `标题${px}`
  }

  const contentNumber = () => {
    return `内容${px}`
  }

  const handleFieldChange = (e, fieldName, key) => {
    const newData = (data).map(item => ({ ...item }));
    const target = getRowByKey(key, newData);
    handleSubmit(null, null, newData, true);
    if (target) {
      target[fieldName] = e;
      setData(newData);
    }
  }

  const column = [
    {
      title: '表头1',
      dataIndex: 'field1',
      key: 'field1',
      render: (text, record) => {
        return (
          <TextArea
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field1', record.key)}
            disabled={detailParams}
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
          <TextArea
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field2', record.key)}
            disabled={detailParams}
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
          <TextArea
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field3', record.key)}
            disabled={detailParams}
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
          <TextArea
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field4', record.key)}
            disabled={detailParams}
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
          <TextArea
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field5', record.key)}
            disabled={detailParams}
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
          <TextArea
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field6', record.key)}
            disabled={detailParams}
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
          <TextArea
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field7', record.key)}
            disabled={detailParams}
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
          <TextArea
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field8', record.key)}
            disabled={detailParams}
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
          <TextArea
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field9', record.key)}
            disabled={detailParams}
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
          <TextArea
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field10', record.key)}
            disabled={detailParams}
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


  useEffect(() => {
    handleTabledata();
  }, [dynamicData]);

  useEffect(() => {
    if (sign) {
      setNewButton(false)
      deleteSign = true;
      handleTabledata();
    }
    ChangeAddRow(true);
    setFieldsValue({
      title: dynamicData.title,
      content: dynamicData.content,
      files: dynamicData.files,
    });
  }, [sign]);

  useEffect(() => {
    if (sign || deleteSign) {
      deleteSign = false;
    }
  }, [deleteSign]);

  useEffect(() => {
    handleTabledata();
  }, [newbutton])

  return (
    <>
      {/* {s
        loading === false && dynamicData  && ( */}
      <Row gutter={24}>
        <Form>
          <Col><p>注：第一行数据作为表头</p></Col>


          <Form.Item label={titleNumber()} {...formincontentLayout}>
            {getFieldDecorator(`title`, {
              initialValue: dynamicData.title ? dynamicData.title : ''
            })(
              <Input
                disabled={detailParams}
                onChange={(e) => handleSubmit(e.target.value, 'title')}
              />
            )}
          </Form.Item>

          <Form.Item label={contentNumber()} {...formincontentLayout}>
            {getFieldDecorator(`content`, {
              initialValue: dynamicData.content ? dynamicData.content : ''
            })(
              <TextArea
                autoSize={{ minRows: 3 }}
                disabled={detailParams}
                onChange={(e) => handleSubmit(e.target.value, 'content')}
              />
            )}
          </Form.Item>

          {
            !detailParams && deleteSign === false && (
              <Form.Item label='上传附件'    {...formincontentLayout}>
                {getFieldDecorator(`files`, {
                  initialValue: dynamicData.files ? dynamicData.files : ''
                })(
                  <SysUpload
                    fileslist={dynamicData.files ? JSON.parse(dynamicData.files) : []}
                    // fileslist={[]}
                    ChangeFileslist={newvalue => {
                      setFieldsValue({
                        files: JSON.stringify(newvalue.arr),
                      })
                      handleSubmit();
                    }}
                  />
                )}
              </Form.Item>
            )
          }

          {
            detailParams && (
              <div style={{ marginLeft: 30, marginRight: 10 }}>
                <Descriptions size="middle">
                  <Descriptions.Item label='上传附件'>
                    <span style={{ color: 'blue', textDecoration: 'underline' }} >
                      {dynamicData && <Downloadfile files={dynamicData.files === '' ? '[]' : dynamicData.files} />}
                    </span>
                  </Descriptions.Item>

                </Descriptions>
              </div>

            )
          }

          {
            deleteSign === false && (
              <Table
                columns={column}
                dataSource={data}
              />
            )
          }


          <Button
            style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
            type="primary"
            ghost
            onClick={() => newMember()}
            icon="plus"
            disabled={detailParams}

          >
            新增行
          </Button>

        </Form>
      </Row>
      {/* //   )
      // } */}
    </>
  )
});

AddForm.defaultProps = {
  dynamicData: {
    title: '',
    content: '',
    files: ''
  }
}

export default Form.create({})(AddForm)
