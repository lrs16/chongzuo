import React, { useEffect, useRef, useImperativeHandle, useContext, useState } from 'react';
import {
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  Table,
  Popconfirm,
  Divider
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
// import TableEdit from '@/components/TableEdit';
import SysUpload from '@/components/SysUpload';

const { TextArea } = Input;
let tabActiveKey = 'week';
function ThisweekMaintenance(props) {
  // const attRef = useRef();
  // useImperativeHandle(
  //   ref,
  //   () => ({
  //     attRef,
  //   }),
  //   [],
  // );
  const required = true;

  const {
    form: { getFieldDecorator, setFieldsValue },
    forminladeLayout,
    maintenanceList,
    startTime,
    endTime,
    getTableindex,
    handleSavethisweek,
    ChangeFiles,
    maintenanceArr,
    type,
    dispatch,
    loading
  } = props;


  const [data, setData] = useState([]);
  const [cacheOriginData, setcacheOriginData] = useState({});
  const [newbutton, setNewButton] = useState(false);
  const [fileslist, setFilesList] = useState([]);

  useEffect(() => {
    ChangeFiles(fileslist);
    // getTableindex('1')
  }, [fileslist])

  //  获取行  
  const getRowByKey = (key, newData) => {
    return (newData || data).filter(item => item.key === key)[0];
  }

  //  删除数据
  const remove = key => {
    const target = getRowByKey(key) || {};
    // dispatch({
    //   type: 'chacklist/trackdelete',
    //   payload: {
    //     id: target.id,
    //   },
    // }).then(res => {
    //   if (res.code === 200) {
    //     message.success(res.msg, 2);
    //     getlistdata();
    //   }
    // });
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
    handleSavethisweek(target)
  }

  const saveRow = (e, key) => {
    const target = getRowByKey(key) || {};
    delete target.key;
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


  const column = [
    {
      title: '系统名称',
      dataIndex: 'params1',
      key: 'params1'
    },
    {
      title: '工单数',
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
      title: '巡检次数',
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
      title: '系统发生影响业务运行的故障次数',
      dataIndex: 'params4',
      key: 'params4',
      render: (text, record) => {
        if (record.isNew) {
          return (
            <Input
              defaultValue={text}
              onChange={e => handleFieldChange(e.target.value, 'dd11', record.key)}
            />
          )
        }
        if (record.isNew === false) {
          return <span>{text}</span>
        }

      }
    },
    {
      title: '性能调优',
      dataIndex: 'params5',
      key: 'params5',
      render: (text, record) => {
        if (record.isNew) {
          return (
            <Input
              defaultValue={text}
              onChange={e => handleFieldChange(e.target.value, 'params5', record.key)}
            />
          )
        }
        if (record.isNew === false) {
          return <span>{text}</span>
        }

      }
    },
    {
      title: '系统升级',
      dataIndex: 'params6',
      key: 'params6',
      render: (text, record) => {
        if (record.isNew) {
          return (
            <Input
              defaultValue={text}
              onChange={e => handleFieldChange(e.target.value, 'params6', record.key)}
            />
          )
        }
        if (record.isNew === false) {
          return <span>{text}</span>
        }

      }
    },
    {
      title: '重要时期业务保障',
      dataIndex: 'params7',
      key: 'params7',
      render: (text, record) => {
        if (record.isNew) {
          return (
            <Input
              defaultValue={text}
              onChange={e => handleFieldChange(e.target.value, 'params7', record.key)}
            />
          )
        }
        if (record.isNew === false) {
          return <span>{text}</span>
        }

      }
    },
    {
      title: '运维材料',
      dataIndex: 'params8',
      key: 'params8',
      render: (text, record) => {
        if (record.isNew) {
          return (
            <Input
              defaultValue={text}
              onChange={e => handleFieldChange(e.target.value, 'params8', record.key)}
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
        // if (record.editable) {
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
        // }

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
    const newarr = maintenanceList.map((item, index) => {
      return Object.assign(item, { editable: true, isNew: false, key: index })
    })
    setData(newarr)
  }

  const handlemaintenanceArr = () => {
    dispatch({
      type: 'eventstatistics/fetchMaintenancelist',
      payload: { tabActiveKey, startTime, endTime }
    })
  }

  useEffect(() => {
    handleTabledata();
    // if(startTime) {
    //   handlemaintenanceArr()
    // }
  }, [])



  return (
    <>
      { loading === false && (
        <>
          {type === 'week' && (
            <p style={{ fontWeight: '900', fontSize: '16px', marginTop: '20px' }}>一、本周运维情况综述</p>
          )}

          {type === 'month' && (
            <p style={{ fontWeight: '900', fontSize: '16px', marginTop: '20px' }}>一、本月运维情况综述</p>
          )}

          <Table
            columns={column}
            dataSource={data}
          />
        </>
      )}

    </>
  )
}



export default Form.create({})(
  connect(({ eventstatistics, loading }) => ({
    maintenanceArr: eventstatistics.maintenanceArr,
    loading: loading.models.eventstatistics,
  }))(ThisweekMaintenance)
)