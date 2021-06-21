import React, { useEffect, useImperativeHandle, useContext, useState } from 'react';
import {
  Table,
  Form,
  Input,
  Col,
  Row,
  Button,
  Divider,
  Popconfirm,
  message
} from 'antd';
import { connect } from 'dva';
import SysUpload from '@/components/SysUpload';

const { TextArea } = Input;
function Testdemo(props) {

  const {
    form: { getFieldDecorator },
    legacyList,
    legacyArr,
    updateList,
    updateArr,
    startTime,
    endTime,
    dispatch
  } = props;
  const [data, setData] = useState([]);
  const [seconddata, setSeconddata] = useState([]);
  const [cacheOriginData, setcacheOriginData] = useState({});
  const [uploadkey, setKeyUpload] = useState('');
  const [fileslist, setFilesList] = useState([]);
  const [newbutton, setNewButton] = useState(false);

  // 初始化把数据传过去
  useEffect(() => {
    if (data && data.length) {
      legacyList(data)
    }
  }, [data]);

  // 新增一条记录
  const newMember = (params) => {
    setFilesList([]);
    setKeyUpload('');
    const newData = (data).map(item => ({ ...item }));
    newData.push({
      key: data.length + 1,
      field1: '',
      field2: '',
      field3: '',
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
    legacyList(data);
    message.info('暂存该表格数据成功')
  }

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
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData)
    if (target) {
      target[fieldName] = e;
      setData(newData);
    }
  }

  const handleTabledata = () => {
    const newarr = legacyArr.map((item, index) => {
      return Object.assign(item, { editable: true, isNew: false, key: index })
    })
    setData(newarr)
  }



  useEffect(() => {
    handleTabledata()
  }, [])

  const column = [
    {
      title: '日期',
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
      title: '工作项',
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
      title: '工作内容',
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
      title: '完成情况',
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


  // useEffect(() => {
  //   if(loading === false) {
  //     handleTabledata()
  //   }
  // },[loading])

  return (
    <>
      <Row gutter={16}>

        <Col span={24}>
          <p>计划{startTime}至{endTime},计量自动化系统开展 次发布变更（消缺），变更内容如下</p>
        </Col>

        <Button
          type='primary'
          onClick={savedata}
        >
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
        >
          新增巡检情况
          </Button>
      </Row>
    </>
  )
}

// export default Form.create({})(ServiceCompletion)
export default Form.create({})(Testdemo);