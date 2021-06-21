import React, { useEffect, useRef, useImperativeHandle, useState } from 'react';
import {
  Table,
  Form,
  Input,
  Col,
  Row,
  Button,
  Divider,
  Popconfirm,
  DatePicker,
  message
} from 'antd';
import { connect } from 'dva';
import SysUpload from '@/components/SysUpload';
import moment from 'moment';

const { TextArea } = Input;
const PatrolAndExamine = React.forwardRef((props, ref) => {
  const attRef = useRef();
  useImperativeHandle(
    ref,
    () => ({
      attRef,
    }),
    [],
  );

  const {
    form: { getFieldDecorator },
    patrolAndExamineList,
    patrolAndExamine
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
      patrolAndExamineList(data)
    }
  }, [data]);

  // 新增一条记录
  const newMember = (params) => {
    setFilesList([]);
    setKeyUpload('');
    const newData = (data).map(item => ({ ...item }));
    newData.push({
      key: data.length + 1,
      id: '',
      field1: '',
      field2: '',
      field3: '',
      field4: '',
      field5: ''
    });
    setData(newData);
    setNewButton(true);
  };

  //  获取行  
  const getRowByKey = (key, newData) => {
    return (newData || data).filter(item => item.key === key)[0];
  }

  const deleteObj = (key,newData) => {
    return (newData || data).filter(item => item.key !== key);
  }
  //  删除数据
  const remove = key => {
    const target = deleteObj(key) || {};
    setData(target)
  };

  const handleFieldChange = (e, fieldName, key) => {
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData)
    if (target) {
      if (fieldName === 'field1') {
        target[fieldName] = moment(e).format('YYYY-MM-DD');
        setData(newData);
      } else {
        target[fieldName] = e;
        setData(newData);
      }

    }
  }

  const handleTabledata = () => {
    if(newbutton === false) {
      const newarr = patrolAndExamine.map((item, index) => {
        return Object.assign(item, { editable: true, isNew: false, key: index })
      })
      setData(newarr)
    }
  }

  const column = [
    {
      title: '日期',
      dataIndex: 'field1',
      key: 'field1',
      render: (text, record) => {
          return (
            <DatePicker
              defaultValue={text ? moment(text) : moment(new Date())}
              onChange={e => handleFieldChange(e, 'field1', record.key)}
            />
          )
      }
    },
    {
      title: '四大率指标',
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
      title: '基础功能运行情况',
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
      title: '接口运行情况',
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
      title: '高级功能运行情况',
      dataIndex: 'field5',
      key: 'field5',
      render: (text, record) => {
          return (
            <Input
              defaultValue={text}
              onChange={e => handleFieldChange(e.target.value, 'field5', record.key)}
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

        // return (
        //   <span>
        //     <a
        //       onClick={e => {
        //         toggleEditable(e, record.key, record);
        //         // handlefileedit(record.key, record.attachment)
        //       }}
        //     >编辑</a>
        //     <Divider type='vertical' />
        //     <Popconfirm title="是否要删除此行？" onConfirm={() => remove(record.key)}>
        //       <a>删除</a>
        //     </Popconfirm>
        //   </span>
        // )
      }

    }
  ];

  useEffect(() => {
    handleTabledata();
  }, [patrolAndExamine])


  return (
    <>
      <Row gutter={16}>
        <Col span={20}>
          <p style={{ fontWeight: '900', fontSize: '16px' }}>二、常规运维工作开展情况</p>
        </Col>

        <Col span={24}>
          <p style={{ marginTop: '20px' }}>（二）巡检情况</p>
        </Col>

        <Table
          columns={column}
          dataSource={data}
          pagination={false}
        />

        <Button
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          type="primary"
          ghost
          onClick={() => newMember()}
          icon="plus"
        >
          新增
        </Button>
      </Row>
    </>
  )
})

export default Form.create({})(PatrolAndExamine)
