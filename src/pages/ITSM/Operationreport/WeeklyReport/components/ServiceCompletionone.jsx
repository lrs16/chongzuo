import React, { useEffect, useImperativeHandle, useContext, useState } from 'react';
import {
  Table,
  Form,
  Input,
  Col,
  Row
} from 'antd';

const { TextArea } = Input;
let tabActiveKey = 'week';
function ServiceCompletionone(props) {

  const {
    form: { getFieldDecorator },
    forminladeLayout,
    tabActiveKey,
    maintenanceService,
    statisList,
  } = props;

// 初始化把软件运维服务指标完成情况数据传过去
useEffect(() => {
  // typeList(maintenanceArr)
  if(maintenanceService && maintenanceService.length) {
    const result = JSON.parse(JSON.stringify(maintenanceService)
    .replace(/name/g, 'field1')
    .replace(/last/g, 'field2')
    .replace(/now/g, 'field3')
    .replace(/points/g, 'field4')
    .replace(/remark/g, 'field5'))
    if(result) {
      statisList(result)
    }
  }
}, [maintenanceService]);

  const secondlyColumn = [
    {
      title: '服务指标',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: tabActiveKey  === 'week' ? '上周':'上月',
      dataIndex: 'last',
      key: 'last',
    },
    {
      title: tabActiveKey === 'week' ? '下周':'下月',
      dataIndex: 'now',
      key: 'now',
    },
    {
      title: '环比',
      dataIndex: 'points',
      key: 'points',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
    },
  ];


  return (
    <>
        {/* <Row gutter={16}> */}
          {/* <Col span={24}>
            <p style={{ fontWeight: '900', fontSize: '16px', marginTop: '20px' }}>三、运维服务指标完成情况</p>
          </Col> */}

          {/* <Col span={24}> */}
            <p>(二)、软件运维服务指标完成情况</p>
          {/* </Col> */}

          <Table
            columns={secondlyColumn}
            dataSource={maintenanceService}
            pagination={false}
          />
        {/* </Row> */}


    </>
  )
}

// export default Form.create({})(ServiceCompletion)
export default Form.create({})(ServiceCompletionone)
