import React, { useEffect, useState } from 'react';
import {
  Table,
  Form,
} from 'antd';

function ServiceCompletionone(props) {

  const {
    tabActiveKey,
    maintenanceService,
    statisList,
    mainId,
  } = props;

  const [data, setData] = useState([]);

  // 初始化把软件运维服务指标完成情况数据传过去
  useEffect(() => {
    if (maintenanceService && maintenanceService.length) {
      const result = JSON.parse(JSON.stringify(maintenanceService)
        .replace(/name/g, 'field1')
        .replace(/last/g, 'field2')
        .replace(/now/g, 'field3')
        .replace(/points/g, 'field4')
        .replace(/remark/g, 'field5'))
      if (result) {
        statisList(result)
      }
    }
  }, [data]);

  const columns = [
    {
      title: '服务指标',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: tabActiveKey === 'week' ? '上周' : '上月',
      dataIndex: 'last',
      key: 'last',
    },
    {
      title: tabActiveKey === 'week' ? '下周' : '下月',
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

  const editColumns = [
    {
      title: '服务指标',
      dataIndex: 'field1',
      key: 'field1',
    },
    {
      title: tabActiveKey === 'week' ? '上周' : '上月',
      dataIndex: 'field2',
      key: 'field2',
    },
    {
      title: tabActiveKey === 'week' ? '下周' : '下月',
      dataIndex: 'field3',
      key: 'field3',
    },
    {
      title: '环比',
      dataIndex: 'field4',
      key: 'field4',
    },
    {
      title: '备注',
      dataIndex: 'field5',
      key: 'field5',
    },
  ];

  const handleTabledata = () => {
    const newarr = (maintenanceService).map((item, index) => {
      return Object.assign(item, { editable: true, isNew: false, key: index })
    })
    setData(newarr)
  }

  useEffect(() => {
    handleTabledata();
  }, [maintenanceService])

  return (
    <>
      <p>(二)、软件运维服务指标完成情况</p>

      <Table
        columns={mainId ? editColumns : columns}
        dataSource={maintenanceService}
        pagination={false}
      />
    </>
  )
}

export default Form.create({})(ServiceCompletionone)
