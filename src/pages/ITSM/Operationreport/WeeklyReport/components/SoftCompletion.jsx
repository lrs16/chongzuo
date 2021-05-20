import React, { useEffect, useState, useRef, useImperativeHandle } from 'react';
import {
  Table,
  Form,
  Input,
  Col,
  Row,
  Button,
  Divider,
  Popconfirm
} from 'antd';
import { connect } from 'dva';
import SysUpload from '@/components/SysUpload';

const { TextArea } = Input;

const SoftCompletion = React.forwardRef((props, ref) => {
  const attRef = useRef();
  useImperativeHandle(
    ref,
    () => ({
      attRef,
    }),
    []
  )

  const {
    form: { getFieldDecorator },
    forminladeLayout,
    softCompletionlist,
    completionsecondTablelist
  } = props;
  const [data, setData] = useState([]);
  const [seconddata, setSeconddata] = useState([]);
  const [cacheOriginData, setcacheOriginData] = useState({});
  const [uploadkey, setKeyUpload] = useState('');
  const [fileslist, setFilesList] = useState([]);
  const [newbutton, setNewButton] = useState(false);
  const [secondbutton, setSecondbutton] = useState(false);




  // 新增一条记录
  const newMember = (params) => {
    setFilesList([]);
    setKeyUpload('');
    const newData = (params ? seconddata : data).map(item => ({ ...item }));
    if (params) {
      newData.push({
        key: data.length + 1,
        id: '',
        ww11: 'ww11',
        ww22: '',
        ww33: '',
        ww44: '',
      });
      console.log(1)
      setSeconddata(newData);
      setSecondbutton(true);
    } else {
      console.log(2)
      newData.push({
        key: data.length + 1,
        id: '',
        num1: '新增数据',
        num2: '',
      });
      setData(newData);
      setNewButton(true);
    }
  };

  console.log(seconddata,'seconddata')

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

  const savedata = (target, id, params) => {
    console.log('target: ', target);
    // handleSavedevelopment(target,id,params)

    // console.log('target: ', target);
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

  const handleTabledata = () => {
    const newarr = softCompletionlist.map((item, index) => {
      return Object.assign(item, { editable: true, isNew: false, key: index })
    })
    setData(newarr)
  }

  const secondTabledata = () => {
    const newarr = completionsecondTablelist.map((item, index) => {
      return Object.assign(item, { editable: true, secondtableisNew: false, key: index })
    })
    setSeconddata(newarr)
  }

  useEffect(() => {
    handleTabledata();
    secondTabledata();
  }, [])


  
  const column = [
    {
      title: '日期',
      dataIndex: 'ww11',
      key: 'ww11',
      render: (text, record) => {
        if (record.isNew) {
          return (
            <Input
              defaultValue={text}
              onChange={e => handleFieldChange(e.target.value, 'ww11', record.key)}
            />
          )
        }
        if (record.isNew === false) {
          return <span>{text}</span>
        }
      }
    },
    {
      title: '工作项',
      dataIndex: 'ww22',
      key: 'ww22',
      render: (text, record) => {
        if (record.isNew) {
          return (
            <Input
              defaultValue={text}
              onChange={e => handleFieldChange(e.target.value, 'ww22', record.key)}
            />
          )
        }
        if (record.isNew === false) {
          return <span>{text}</span>
        }
      }
    },
    {
      title: '工作内容',
      dataIndex: 'ww33',
      key: 'ww33',
      render: (text, record) => {
        if (record.isNew) {
          return (
            <Input
              defaultValue={text}
              onChange={e => handleFieldChange(e.target.value, 'ww33', record.key)}
            />
          )
        }
        if (record.isNew === false) {
          return <span>{text}</span>
        }
      }
    },
    {
      title: '完成情况',
      dataIndex: 'ww44',
      key: 'ww44',
      render: (text, record) => {
        if (record.isNew) {
          return (
            <Input
              defaultValue={text}
              onChange={e => handleFieldChange(e.target.value, 'ww44', record.key)}
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

  const secondlyColumn = [
    {
      title: '序号',
      dataIndex: 'num1',
      key: 'num1',
      render: (text, record) => {
        if (record.secondtableisNew) {
          return (
            <Input
              defaultValue={text}
              onChange={e => handleFieldChange(e.target.value, 'num1', record.key)}
            />
          )
        }
        if (record.secondtableisNew === false) {
          return <span>{text}</span>
        }
      }
    },
    {
      title: '材料名称',
      dataIndex: 'num2',
      key: 'num2',
      render: (text, record) => {
        if (record.secondtableisNew) {
          return (
            <Input
              defaultValue={text}
              onChange={e => handleFieldChange(e.target.value, 'num2', record.key)}
            />
          )
        }
        if (record.secondtableisNew === false) {
          return <span>{text}</span>
        }
      }
    },
    {
      title: '是否提交',
      dataIndex: 'num3',
      key: 'num3',
      render: (text, record) => {
        if (record.secondtableisNew) {
          return (
            <Input
              defaultValue={text}
              onChange={e => handleFieldChange(e.target.value, 'num3', record.key)}
            />
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
  
  return (
    <>
      <Row gutter={16}>
        <Form>
          <Col span={24}>
            <p style={{ fontWeight: '900', fontSize: '16px' }}>五、软件作业完成情况</p>
          </Col>

          <Col span={24}>
            <Form.Item style={{ marginTop: '20px' }} label=''>
              {
                getFieldDecorator('params33', {})
                  (<TextArea />)
              }
            </Form.Item>
          </Col>

          <Col span={24}>
            <p>(1)数据库本周进行了补丁升级工作次：</p>
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
            新增巡检情况
          </Button>

          <Col span={20}>
            <p>(2)计划2021年月日至2021年月日,计量自动化系统开展次发布变更（消缺），变更内容如下:</p>
          </Col>

          <Table
            columns={secondlyColumn}
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
            新增巡检情况
          </Button>

          <Col span={6}>
            <Form.Item
              label='上传附件'
              {...forminladeLayout}
            >
              {getFieldDecorator('params22', {})
                (
                  <div style={{ width: 400 }}>
                    <SysUpload
                      fileslist={[]}
                    // ChangeFileslist={newvalue => setFiles(newvalue)}
                    />
                  </div>
                )}

            </Form.Item>
          </Col>
        </Form>
      </Row>
    </>
  )
})


export default Form.create({})(SoftCompletion)
