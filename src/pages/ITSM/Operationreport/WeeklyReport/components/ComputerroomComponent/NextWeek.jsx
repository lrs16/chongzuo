import React, { useEffect, useRef, useImperativeHandle, useState } from 'react';
import {
  Table,
  Form,
  Input,
  Col,
  Row,
  Divider,
  Popconfirm,
  message
} from 'antd';
import { connect } from 'dva';
import SysUpload from '@/components/SysUpload';

const { TextArea } = Input;

function NextWeek(props) {
  const {
    form: { getFieldDecorator },
    forminladeLayout,
    myTaskplanlist,
    dispatch
  } = props;

  const [data, setData] = useState([]);
  const [paginations, setPaginations] = useState({ current: 0, pageSize: 10 });
  const [cacheOriginData, setcacheOriginData] = useState({});

  //  获取行  
  const getRowByKey = (key, newData) => {
    return (newData || data).filter(item => item.key === key)[0];
  }

  //  删除数据
  const remove = key => {
    const target = getRowByKey(key) || {};
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

  const savedata = (target, id) => {
    // handleSavethisweek(target)
  }

  const saveRow = (e, key) => {
    const target = getRowByKey(key) || {};
    // delete target.key;
    target.editable = false;
    const id = target.id === '' ? '' : target.id;
    savedata(target, id);
    if (target.isNew) {
      target.isNew = false
      // setNewButton(false)
    }
  }

  const handleFieldChange = (e, fieldName, key) => {
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData)
    if (target) {
      target[fieldName] = e;
      setData(newData);
    }
  }

  const handleTabledata = () => {
    if (myTaskplanlist.rows && myTaskplanlist.rows.length) {
      const newarr = (myTaskplanlist.rows).map((item, index) => {
        return Object.assign(item, { editable: true, isNew: false, key: index })
      })
      setData(newarr)
    }
  }

  const getTobolist = () => {
    return dispatch({
     type: 'processmodel/weekmyTasklist',
     payload: {
       pageIndex: paginations.current,
       pageSize: paginations.pageSize,
     },
   }).then(res => {
     if(res.code === 200 && res.data) {
       const newarr = (res.data.rows).map((item, index) => {
         return Object.assign(item, { editable: true, isNew: false, key: index })
       })
       setData(newarr)
     } else {
       message.error('请求失败')
     }
   });
 };

  useEffect(() => {
    getTobolist();
  }, [])

  const column = [
    {
      title: '序号',
      dataIndex: 'yy11',
      key: 'yy11'
    },
    {
      title: '作业日期',
      dataIndex: 'updateTime',
      key: 'updateTime',
      render: (text, record) => {
        if (record.isNew) {
          return (
            <Input
              defaultValue={text}
              onChange={e => handleFieldChange(e.target.value, 'updateTime', record.key)}
            />
          )
        }
        if (record.isNew === false) {
          return <span>{text}</span>
        }

      }
    },
    {
      title: '作业性质',
      dataIndex: 'nature',
      key: 'nature',
      render: (text, record) => {
        if (record.isNew) {
          return (
            <Input
              defaultValue={text}
              onChange={e => handleFieldChange(e.target.value, 'nature', record.key)}
            />
          )
        }
        if (record.isNew === false) {
          return <span>{text}</span>
        }

      }
    },
    {
      title: '作业对象',
      dataIndex: 'object',
      key: 'object',
      render: (text, record) => {
        if (record.isNew) {
          return (
            <Input
              defaultValue={text}
              onChange={e => handleFieldChange(e.target.value, 'object', record.key)}
            />
          )
        }
        if (record.isNew === false) {
          return <span>{text}</span>
        }

      }
    },
    {
      title: '作业内容',
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
      title: '计划完成时间',
      dataIndex: 'plannedEndTime',
      key: 'plannedEndTime',
      render: (text, record) => {
        if (record.isNew) {
          return (
            <Input
              defaultValue={text}
              onChange={e => handleFieldChange(e.target.value, 'plannedEndTime', record.key)}
            />
          )
        }
        if (record.isNew === false) {
          return <span>{text}</span>
        }

      }
    },
    {
      title: '完成进度',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => {
        if (record.isNew) {
          return (
            <Input
              defaultValue={text}
              onChange={e => handleFieldChange(e.target.value, 'status', record.key)}
            />
          )
        }
        if (record.isNew === false) {
          return <span>{text}</span>
        }

      }
    },
    {
      title: '作业负责人',
      dataIndex: 'operationUser',
      key: 'operationUser',
      render: (text, record) => {
        if (record.isNew) {
          return (
            <Input
              defaultValue={text}
              onChange={e => handleFieldChange(e.target.value, 'operationUser', record.key)}
            />
          )
        }
        if (record.isNew === false) {
          return <span>{text}</span>
        }
      }
    },
    {
      title: '作业单位',
      dataIndex: 'operationUnit',
      key: 'operationUnit',
      render: (text, record) => {
        if (record.isNew) {
          return (
            <Input
              defaultValue={text}
              onChange={e => handleFieldChange(e.target.value, 'operationUnit', record.key)}
            />
          )
        }
        if (record.isNew === false) {
          return <span>{text}</span>
        }
      }
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      render: (text, record) => {
        if (record.isNew) {
          return (
            <Input
              defaultValue={text}
              onChange={e => handleFieldChange(e.target.value, 'remark', record.key)}
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

  return (
    <>
      <Row gutter={16}>

        <Table
          columns={column}
          dataSource={data}
        />

        <Col span={6}>
          <Form.Item
            label='上传附件'
            {...forminladeLayout}
          >
            {getFieldDecorator('params66', {})
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
      </Row>
    </>
  )
}

export default Form.create({})(
  connect(({ processmodel, loading }) => ({
    myTaskplanlist: processmodel.myTaskplanlist,
    loading: loading.models.processmodel
  }))(NextWeek),
);