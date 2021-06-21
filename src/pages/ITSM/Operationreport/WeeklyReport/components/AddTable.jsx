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

const AddTable = React.forwardRef((props, ref) => {
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
    files,
    addTable,
    loading
  } = props;

  const [data, setData] = useState([]);
  const [seconddata, setSeconddata] = useState([]);
  const [cacheOriginData, setcacheOriginData] = useState({});
  const [newbutton, setNewButton] = useState(false);
  const [addList, setAddList] = useState([]);

  // useEffect(() => {
  //   ChangeFiles(fileslist)
  // }, [fileslist])
  // 新增一条记录
  const newMember = (params) => {
    setFilesList([]);
    setKeyUpload('');
    const newData = (params ? seconddata : data).map(item => ({ ...item }));
    newData.push({
      key: seconddata.length + 1,
      field1: '新增数据',
      field2: '',
      field3: 'dd',
      field4: '',
      field5: '',
    });
    setData(newData);
    setNewButton(true);
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

  // 编辑记录
  const toggleEditable = (e, key, record) => {

    e.preventDefault();
    const newData = data.map(item => ({ ...item })
    );
    const target = getRowByKey(key, newData);
    if (target) {
      if (!target.editable) {
        setcacheOriginData({ key: { ...target } });
      }
      // target.editable = !target.editable;
      target.isNew = true;
      setData(newData);
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
    setAddList(data)
  }

  console.log(data, 'data')


  const saveRow = (e, key) => {
    const target = getRowByKey(key) || {};
    delete target.key;
    target.editable = false;
    const id = target.id === '' ? '' : target.id;
    savedata(target, id);
    if (target.isNew) {
      target.isNew = false;
      setNewButton(false);
    }
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
      title: '日期',
      dataIndex: 'field1',
      key: 'field1',
      render: (text, record) => {
        if (record.isNew) {
          return (
            <Input
              defaultValue={text}
              onChange={e => handleFieldChange(e.target.value, 'field1', record.key)}
            />
          )
        }
        if (record.isNew === false) {
          return <span>{text}</span>
        }
      }
    },
    {
      title: '四大率指标',
      dataIndex: 'field2',
      key: 'field2',
      render: (text, record) => {
        if (record.isNew) {
          return (
            <Input
              defaultValue={text}
              onChange={e => handleFieldChange(e.target.value, 'field2', record.key)}
            />
          )
        }
        if (record.isNew === false) {
          return <span>{text}</span>
        }
      }
    },
    {
      title: '基础功能运行情况',
      dataIndex: 'field3',
      key: 'field3',
      render: (text, record) => {
        if (record.isNew) {
          return (
            <Input
              defaultValue={text}
              onChange={e => handleFieldChange(e.target.value, 'field3', record.key)}
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
      dataIndex: 'field4',
      key: 'field4',
      render: (text, record) => {
        if (record.isNew) {
          return (
            <Input
              defaultValue={text}
              onChange={e => handleFieldChange(e.target.value, 'field4', record.key)}
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
      dataIndex: 'field5',
      key: 'field5',
      render: (text, record) => {
        if (record.isNew) {
          return (
            <Input
              defaultValue={text}
              onChange={e => handleFieldChange(e.target.value, 'field5', record.key)}
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


  const handleTabledata = () => {
    const newarr = (patrolAndExamine?.length ? patrolAndExamine : []).map((item, index) => {
      return Object.assign(item, { editable: true, isNew: false, key: index })
    })
    setData(newarr)
  }

  const handleSubmit = () => {
    props.form.validateFields((err, value) => {
      if (!err) {
        const editTable = {
          ...value,
          list: data,
          px
        }
        addTable(editTable)
      }
    })
  }



  // useEffect(() => {
  //   handleTabledata();
  // }, [patrolAndExamine])

  return (
    <>
      {/* { loading === false && ( */}
      <Row gutter={16}>
        <Form>
          <Button onClick={handleSubmit}>
            保存
          </Button>
      

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
            新增行
       </Button>
        </Form>
      </Row>

      {/* // )} */}

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


export default Form.create({})(AddTable)
