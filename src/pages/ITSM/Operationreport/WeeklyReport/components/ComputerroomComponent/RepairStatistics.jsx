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
import { connect } from 'dva';
import SysUpload from '@/components/SysUpload';

const { TextArea } = Input;
const { Option } = Select;

function RepairStatistics(props) {

  const required = true;

  const {
    form: { getFieldDecorator, setFieldsValue },
    forminladeLayout,
    developmentList,
    submitdevelopmentlist,
    handleSavedevelopment,
    faultQueryList,
    handleDelete,
    ChangeFiles,
    files,
    loading,
    dispatch
  } = props;

  const [data, setData] = useState([]);
  const [seconddata, setSeconddata] = useState([]);
  const [cacheOriginData, setcacheOriginData] = useState({});
  const [uploadkey, setKeyUpload] = useState('');
  const [fileslist, setFilesList] = useState([]);
  const [newbutton, setNewButton] = useState(false);
  const [secondbutton, setSecondbutton] = useState(false);
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 10 }); // 分页state

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
      title: '序号',
      dataIndex: 'date',
      key: 'date'
    },
    {
      title: '日期',
      dataIndex: 'addTime',
      key: 'addTime',
      render: (text, record) => {
        if (record.isNew) {
          return (
            <Input
              defaultValue={text}
              onChange={e => handleFieldChange(e.target.value, 'addTime', record.key)}
            />
          )
        }
        if (record.isNew === false) {
          return <span>{text}</span>
        }
      }
    },
    {
      title: '故障类型',
      dataIndex: 'typecn',
      key: 'typecn',
      render: (text, record) => {
        if (record.isNew) {
          return (
            <Input
              defaultValue={text}
              onChange={e => handleFieldChange(e.target.value, 'typecn', record.key)}
            />
          )
        }
        if (record.isNew === false) {
          return <span>{text}</span>
        }
      }
    },
    {
      title: '故障情况',
      dataIndex: 'content',
      key: 'content',
      render: (text, record) => {
        if (record.isNew) {
          return (
            <Input
              defaultValue={text}
              onChange={e => handleFieldChange(e.target.value, 'content', record.key)}
            />
          )
        }
        if (record.isNew === false) {
          return <span>{text}</span>
        }
      }
    },
    {
      title: '是否已修复',
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
      title: '是否需要报告',
      dataIndex: 'params4',
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
      title: '报告提供方',
      dataIndex: 'params5',
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
      title: '是否已提供故障处理记录（报告）',
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
      title: '序号',
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
      title: '日期',
      dataIndex: 'addTime',
      key: 'addTime',
      render: (text, record) => {
        if (record.secondtableisNew) {
          return (
            <Input
              defaultValue={text}
              onChange={e => handleFieldChange(e.target.value, 'addTime', record.key, 'secondTable')}
            />
          )
        }
        if (record.secondtableisNew === false) {
          return <span>{text}</span>
        }
      }
    },
    {
      title: '故障类型',
      dataIndex: 'typecn',
      key: 'typecn',
      render: (text, record) => {
        if (record.secondtableisNew) {
          return (
            <Input
              defaultValue={text}
              onChange={e => handleFieldChange(e.target.value, 'typecn', record.key, 'secondTable')}
            />
          )
        }
        if (record.secondtableisNew === false) {
          return <span>{text}</span>
        }
      }
    },
    {
      title: '故障情况',
      dataIndex: 'content',
      key: 'content',
      render: (text, record) => {
        if (record.secondtableisNew) {
          return (
            <Input
              defaultValue={text}
              onChange={e => handleFieldChange(e.target.value, 'content', record.key, 'secondTable')}
            />
          )
        }
        if (record.secondtableisNew === false) {
          return <span>{text}</span>
        }
      }
    },
    {
      title: '计划修复时间',
      dataIndex: 'num5',
      key: 'num5',
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
    if(faultQueryList && faultQueryList.rows && faultQueryList.rows.length) {
      const newarr = (faultQueryList.rows).map((item, index) => {
        return Object.assign(item, { editable: true, isNew: false, key: index })
      })
      setData(newarr)
    }
    
  }

  const secondTabledata = () => {
    if(faultQueryList && faultQueryList.rows && faultQueryList.rows.length) {
      const newarr = (faultQueryList.rows).map((item, index) => {
        return Object.assign(item, { editable: true, secondtableisNew: false, key: index })
      })
      setSeconddata(newarr)
    }
  }

  const getFaultlist = () => {
      dispatch({
        type: 'fault/getfaultQueryList',
        payload: {
          pageNum: 1,
          pageSize: paginations.pageSize,
        },
      });
  }

  useEffect(() => {
    getFaultlist();
    handleTabledata();
    secondTabledata();
  }, [])

  return (
    <>
    { loading  === false && (
    <Row gutter={16}>
    <Form>
      <Col span={24}>
        <p style={{ fontWeight: '900', fontSize: '16px' }}>3 本周新增故障及故障修复情况统计</p>
      </Col>

      <Col span={24}>
        <p>3.1新增及已修复故障 </p>
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

      <Col span={24}>
        <p>3.2未修复故障清单 </p>
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
        新增巡检情况
      </Button>

    </Form>
  </Row>

    )}
  
    </>
  )
}

export default Form.create({})(
  connect(({ fault, loading }) => ({
    faultQueryList: fault.faultQueryList,
    loading: loading.models.fault,
  }))(RepairStatistics),
);
