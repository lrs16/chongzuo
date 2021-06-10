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
} from 'antd';
import moment from 'moment';
import SysUpload from '@/components/SysUpload';

const { TextArea } = Input;
const { Option } = Select;

const DatabaseInspectionsummary = React.forwardRef((props, ref) => {
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
    form: { getFieldDecorator, setFieldsValue },
    forminladeLayout,
    developmentList,
    submitdevelopmentlist,
    handleSavedevelopment,
    handleDelete,
    ChangeFiles,
    startTime,
    endTime,
    files,
    loading
  } = props;

  const [data, setData] = useState([]);
  const [seconddata, setSeconddata] = useState([]);
  const [cacheOriginData, setcacheOriginData] = useState({});
  const [uploadkey, setKeyUpload] = useState('');
  const [fileslist, setFilesList] = useState([]);
  const [newbutton, setNewButton] = useState(false);
  const [secondbutton, setSecondbutton] = useState(false);


  useEffect(() => {
    ChangeFiles(fileslist)
  }, [fileslist])
  // 新增一条记录
  const newMember = (params) => {
    setFilesList([]);
    setKeyUpload('');
    const newData = (params ? seconddata : data).map(item => ({ ...item }));
    if (params) {
      newData.push({
        key: data.length + 1,
        id: '',
        num1: 'num1',
        num2: '',
        num3: 'dd',
      });
      setSeconddata(newData);
      setSecondbutton(true);
    } else {
      newData.push({
        key: seconddata.length + 1,
        id: '',
        date: '新增数据',
        date1: '',
        params1: 'dd',
        params2: '',
        params3: '',
      });
      setData(newData);
      setNewButton(true);
    }
  };

  //  获取行  
  const getRowByKey = (key, newData, params) => {
    if (params) {
      return (newData || seconddata).filter(item => item.key === key)[0];
    }
    return (newData || data).filter(item => item.key === key)[0];
  }

  //  删除数据
  const remove = key => {
    const target = getRowByKey(key) || {};
    handleDelete(target.id)
  };

  // 编辑记录
  const toggleEditable = (e, key, record, params) => {
    e.preventDefault();
    const newData = (params ? seconddata : data).map(item => ({ ...item }));
    const target = getRowByKey(key, newData, params);
    if (target) {
      if (!target.editable) {
        setcacheOriginData({ key: { ...target } });
      }
      // target.editable = !target.editable;
      if (params) {
        target.secondtableisNew = true;
        setSeconddata(newData)
      } else {
        target.isNew = true;
        setData(newData);
      }
    }
  }

  //  点击编辑生成filelist
  const handlefileedit = (key, values) => {
    if (!values) {
      setFilesList([]);
    } else {
      setFilesList(JSON.parse(values))
    }
  }

  const savedata = (target, id, params) => {
    handleSavedevelopment(target, id, params)
  }

  const saveRow = (e, key, params) => {
    const target = getRowByKey(key, '', params) || {};
    delete target.key;
    // target.editable = false;
    const id = target.id === '' ? '' : target.id;
    savedata(target, id, params);
    if (params) {
      target.secondtableisNew = false
      setSecondbutton(false)
    } else {
      target.isNew = false
      setNewButton(false)
    }

  }

  const handleFieldChange = (e, fieldName, key, params) => {
    const newData = (params ? seconddata : data).map(item => ({ ...item }));
    const target = getRowByKey(key, newData, params)
    if (target) {
      target[fieldName] = e;
      if (params) {
        setSeconddata(newData)
      } else {
        setData(newData);
      }
    }
  }

  const column = [
    {
      title: '磁盘组',
      dataIndex: 'date',
      key: 'date'
    },
    {
      title: '总容量GB',
      dataIndex: 'date1',
      key: 'date1',
      render: (text, record) => {
        if (record.isNew) {
          return (
            <Input
              defaultValue={text}
              onChange={e => handleFieldChange(e.target.value, 'date1', record.key)}
            />
          )
        }
        if (record.isNew === false) {
          return <span>{text}</span>
        }
      }
    },
    {
      title: '已使用容量GB',
      dataIndex: 'params1',
      key: 'params1',
      render: (text, record) => {
        if (record.isNew) {
          return (
            <Input
              defaultValue={text}
              onChange={e => handleFieldChange(e.target.value, 'params1', record.key)}
            />
          )
        }
        if (record.isNew === false) {
          return <span>{text}</span>
        }
      }
    },
    {
      title: '接口运行情况',
      dataIndex: 'params2',
      key: 'params2',
      render: (text, record) => {
        if (record.isNew) {
          return (
            <Input
              defaultValue={text}
              onChange={e => handleFieldChange(e.target.value, 'params2', record.key)}
            />
          )
        }
        if (record.isNew === false) {
          return <span>{text}</span>
        }
      }
    },
    {
      title: '高级功能运行情况',
      dataIndex: 'params3',
      key: 'params3',
      render: (text, record) => {
        if (record.isNew) {
          return (
            <Input
              defaultValue={text}
              onChange={e => handleFieldChange(e.target.value, 'params3', record.key)}
            />
          )
        }
        if (record.isNew === false) {
          return <span>{text}</span>
        }
      }
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 120,
      render: (text, record) => {
        if (record.isNew === true) {
          return (
            <span>
              <a onClick={e => saveRow(e, record.key)}>保存</a>
              <Divider type='vertical' />
              <Popconfirm title="是否要删除此行？" onConfirm={() => remove(record.key)}>
                <a>删除</a>
              </Popconfirm>
            </span>
          )
        }

        return (
          <span>
            <a
              onClick={e => {
                toggleEditable(e, record.key, record);
                // handlefileedit(record.key, record.attachment)
              }}
            >编辑</a>
            <Divider type='vertical' />
            <Popconfirm title="是否要删除此行？" onConfirm={() => remove(record.key)}>
              <a>删除</a>
            </Popconfirm>
          </span>
        )
      }

    }
  ];

  const submitColumn = [
    {
      title: '表空间名',
      dataIndex: 'num1',
      key: 'num1',
      render: (text, record) => {
        if (record.secondtableisNew) {
          return (
            <Input
              defaultValue={text}
              onChange={e => handleFieldChange(e.target.value, 'num1', record.key, 'secondTable')}
            />
          )
        }
        if (record.secondtableisNew === false) {
          return <span>{text}</span>
        }
      }
    },
    {
      title: `${startTime}占用空间/GB`,
      dataIndex: 'num2',
      key: 'num2',
      render: (text, record) => {
        if (record.secondtableisNew) {
          return (
            <Input
              defaultValue={text}
              onChange={e => handleFieldChange(e.target.value, 'num2', record.key, 'secondTable')}
            />
          )
        }
        if (record.secondtableisNew === false) {
          return <span>{text}</span>
        }
      }
    },
    {
      title: `${endTime}占用空间/GB`,
      dataIndex: 'num3',
      key: 'num3',
      render: (text, record) => {
        if (record.secondtableisNew) {
          return (
            <Input
              defaultValue={text}
              onChange={e => handleFieldChange(e.target.value, 'num3', record.key, 'secondTable')}
            />
          )
        }
        if (record.secondtableisNew === false) {
          return <span>{text}</span>
        }
      }
    },
    {
      title: '11月19日占用空间/GB',
      dataIndex: 'num4',
      key: 'num4',
      render: (text, record) => {
        if (record.secondtableisNew) {
          return (
            <Input
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'num4', record.key, 'secondTable')}
          />
        )
      }
      if (record.secondtableisNew === false) {
        return <span>{text}</span>
      }
      }
    },
    {
      title: '日平均增长/GB',
      dataIndex: 'num5',
      key: 'num5',
      render: (text, record) => {
        if (record.secondtableisNew) {
          return (
            <Select
              defaultValue={text}
              onChange={e => handleFieldChange(e, 'num4', record.key, 'secondTable')}
            >
              <Option key='是' value='是'>是</Option>
              <Option key='否' value='否'>否</Option>
            </Select>
          )
        }
        if (record.secondtableisNew === false) {
          return <span>{text}</span>
        }
      }
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 120,
      render: (text, record) => {
        if (record.secondtableisNew === true) {
          return (
            <span>
              <a onClick={e => saveRow(e, record.key, 'secondTable')}>保存</a>
              <Divider type='vertical' />
              <Popconfirm title="是否要删除此行？" onConfirm={() => remove(record.key)}>
                <a>删除</a>
              </Popconfirm>
            </span>
          )
        }

        return (
          <span>
            <a
              onClick={e => {
                toggleEditable(e, record.key, record, 'secondTable');
                // handlefileedit(record.key, record.attachment)
              }}
            >编辑</a>
            <Divider type='vertical' />
            <Popconfirm title="是否要删除此行？" onConfirm={() => remove(record.key)}>
              <a>删除</a>
            </Popconfirm>
          </span>
        )
      }

    }
  ];

  const handleTabledata = () => {
    const newarr = developmentList.map((item, index) => {
      return Object.assign(item, { editable: true, isNew: false, key: index })
    })
    setData(newarr)
  }

  const secondTabledata = () => {
    const newarr = submitdevelopmentlist.map((item, index) => {
      return Object.assign(item, { editable: true, secondtableisNew: false, key: index })
    })
    setSeconddata(newarr)
  }

  useEffect(() => {
    handleTabledata();
    secondTabledata();
  }, [])

  return (
    <>
      <Row gutter={16}>
        <Form>

          <Col span={24}>
            <p>磁盘组</p>
          </Col>

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
            disabled={newbutton}
          >
            新增磁盘组
       </Button>

          <Col span={24}>
            <p>Top10表空间(正常增长范围120GB-150GB)</p>
          </Col>

          <Table
            columns={submitColumn}
            dataSource={seconddata}
          />

          <Button
            style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
            type="primary"
            ghost
            onClick={() => newMember('secondTable')}
            icon="plus"
            disabled={secondbutton}
          >
            新增Top10表空间
       </Button>


        </Form>
      </Row>


    </>
  )
})


export default Form.create({})(DatabaseInspectionsummary)
