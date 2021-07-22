import React, { useState, useEffect } from 'react';
import {
  Table,
  Form,
  Input,
  Col,
  Row,
  Popconfirm,
  Button,
  message
} from 'antd';

const { TextArea } = Input;
let deleteSign = false;
function EventTop(props) {
  const {
    topNList,
    topArr,
    detailParams,
    loading,
  } = props;

  const [data, setData] = useState([]);

  // 新增一条记录
  const newMember = () => {
    const newData = (data).map(item => ({ ...item }));
    newData.push({
      key: data.length + 1,
      field1: data.length + 1,
      field2: '',
      field3: '',
      field4: '',
      field5: '',
    });
    setData(newData);
    topNList(newData)
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
      return Object.assign(item, { editable: true, isNew: false, key: index, field1: index + 1 })
    });

    deleteSign = true;
    setData(newarr);
    topNList(newarr)
  };


  const handleFieldChange = (e, fieldName, key) => {
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData);
    topNList(newData)
    if (target) {
      target[fieldName] = e;
      setData(newData);
    }
  }

  const handleTabledata = () => {
    const newarr = (topArr).map((item, index) => {
      return Object.assign(item, { editable: true, isNew: false, key: index, field1: index + 1 })
    })
    setData(newarr)
  }

  const column = [
    {
      title: '序号',
      dataIndex: 'field1',
      key: 'field1',
      render: (text, record) => {
        return (
          <Input
            disabled={detailParams}
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field1', record.key)}
          />
        )
      }
    },
    {
      title: '分类',
      dataIndex: 'field2',
      key: 'field2',
      render: (text, record) => {
        return (
          <Input
            disabled={detailParams}
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field2', record.key)}
          />
        )
      }
    },
    {
      title: '问题描述',
      dataIndex: 'field3',
      key: 'field3',
      render: (text, record) => {
        return (
          <Input
            disabled={detailParams}
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field3', record.key)}
          />
        )
      }
    },
    {
      title: '工单数',
      dataIndex: 'field4',
      key: 'field4',
      render: (text, record) => {
        return (
          <Input
            disabled={detailParams}
            defaultValue={text}
            onChange={e => handleFieldChange(e.target.value, 'field4', record.key)}
          />
        )
      }
    },
    {
      title: '措施',
      dataIndex: 'field5',
      key: 'field5',
      render: (text, record) => {
        return (
          <TextArea
            disabled={detailParams}
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
        if (text !== '合计') {
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

    }
  ];

  useEffect(() => {
    handleTabledata();
  }, [topArr])

  useEffect(() => {
    if (deleteSign) {
      deleteSign = false
    }
  }, [data, deleteSign])

  return (
    <>
      <Row gutter={16}>
        <Col span={20}>
          <p>（三）工单TopN 事件分析</p>
        </Col>

        {deleteSign === false && (
          <Table
            columns={column}
            dataSource={data}
            pagination={false}
            rowKey={record => record.key}
          />
        )}

        <Button
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          type="primary"
          ghost
          onClick={newMember}
          icon="plus"
          disabled={detailParams}
        >
          新增
        </Button>
      </Row>

    </>
  )
}


export default Form.create({})(EventTop)
