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
  message,
  DatePicker
} from 'antd';
import moment from 'moment';

const { TextArea } = Input;
function DefectTracking(props) {

  const {
    form: { getFieldDecorator },
    legacyArr,
    legacyList,
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


  const handleFieldChange = (e, fieldName, key) => {
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData)
    if (target) {
      if (fieldName === 'field1' || fieldName === 'field1') {
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
      const newarr = legacyArr.map((item, index) => {
        return Object.assign(item, { editable: true, isNew: false, key: index })
      })
      setData(newarr)
    }
  }


  useEffect(() => {
    handleTabledata()
  }, [legacyArr])

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
      title: '计划完成时间',
      dataIndex: 'field4',
      key: 'field4',
      render: (text, record) => {
        return (
          <DatePicker
            defaultValue={text ? moment(text) : moment(new Date())}
            onChange={e => handleFieldChange(e, 'field4', record.key)}
          />
        )
      }
    },
    {
      title: '备注',
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
      }

    }
  ];

  return (
    <>
      <Row gutter={16}>
        <Col span={24}>
          <p style={{ fontWeight: '900', fontSize: '16px', marginTop: '20px' }}>六、遗留缺陷问题跟踪,遗留问题、缺陷跟踪情况</p>
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
}

export default Form.create({})(DefectTracking)
;