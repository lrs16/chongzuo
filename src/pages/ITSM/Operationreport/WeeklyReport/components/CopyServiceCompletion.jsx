import React, { useEffect, useImperativeHandle, useContext, useState } from 'react';
import {
  Table,
  Form,
  Input,
  Col,
  Row
} from 'antd';

const { TextArea } = Input;
function CopyServiceCompletion(props) {
  const {
    form: { getFieldDecorator },
    selfhandleRow,
    soluteArr,
    mainId,
    detailParams,

  } = props;

  const [data, setData] = useState([]);

  //  获取行  
  const getRowByKey = (key, newData) => {
    return (newData || data).filter(item => item.key === key)[0];
  }

  const handleFieldChange = (e, fieldName, key) => {
    const newData = data.map(item => ({ ...item }));
    const target = getRowByKey(key, newData);
    selfhandleRow(newData);
    if (target) {
      target[fieldName] = e;
      setData(newData);
    }
  }

  const handleTabledata = () => {
    const newarr = (soluteArr).map((item, index) => {
      return Object.assign(item, { editable: true, isNew: false, key: index, index: index + 1 })
    })
    setData(newarr)
  }

  const editColumn = [
    {
      title: '工单受理数量',
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
      title: '一线处理量',
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
      title: '一线解决率',
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
  ];

  useEffect(() => {
    handleTabledata();
  }, [soluteArr])

  return (
    <>
      <Row gutter={16}>

        <Col span={24}>
          <p style={{ fontWeight: '900', fontSize: '16px', marginTop: 10 }}>指标分析:</p>
        </Col>

        <Col span={24}>
          <p>1.一线问题解决情况汇总统计</p>
        </Col>

        <Table
          columns={editColumn}
          dataSource={data}
          pagination={false}
        />
      </Row>
    </>
  )
}

export default Form.create({})(CopyServiceCompletion)
