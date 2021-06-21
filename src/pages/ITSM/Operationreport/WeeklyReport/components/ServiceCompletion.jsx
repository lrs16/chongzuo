import React, { useEffect, useImperativeHandle, useContext, useState } from 'react';
import {
  Table,
  Form,
  Input,
  Col,
  Row
} from 'antd';

const { TextArea } = Input;
function ServiceCompletion(props) {
  const {
    form: { getFieldDecorator },
    selfhandleRow,
    soluteArr,
    mainId
  } = props;

// 初始化把软件运维服务指标完成情况数据传过去
// 一线问题解决情况汇总统计
useEffect(() => {
  if(soluteArr && soluteArr.length) {
    const result = JSON.parse(JSON.stringify(soluteArr)
    .replace(/not_selfhandle/g, 'field1')
    .replace(/is_selfhandle/g, 'field2')
    .replace(/points/g, 'field3'))
    // if(result) {
      selfhandleRow(result)
    // }
  }
}, []);

  const threeColumn = [
    {
      title: '工单受理数量',
      dataIndex: 'not_selfhandle',
      key: 'not_selfhandle',
    },
    {
      title: '一线处理量',
      dataIndex: 'is_selfhandle',
      key: 'is_selfhandle',
    },
    {
      title: '一线解决率',
      dataIndex: 'points',
      key: 'points',
    },
  ];

  const editColumn = [
    {
      title: '工单受理数量',
      dataIndex: 'field1',
      key: 'field1',
    },
    {
      title: '一线处理量',
      dataIndex: 'field2',
      key: 'field2',
    },
    {
      title: '一线解决率',
      dataIndex: 'field3',
      key: 'field3',
    },
  ]

  return (
    <>
        <Row gutter={16}>

          <Col span={24}>
            <p style={{ fontWeight: '900', fontSize: '16px' }}>指标分析:</p>
          </Col>

          <Col span={24}>
            <p>1.一线问题解决情况汇总统计</p>
          </Col>

          <Table
            columns={mainId?editColumn:threeColumn}
            dataSource={soluteArr}
          />      
        </Row>
    </>
  )
}

export default Form.create({})(ServiceCompletion)
