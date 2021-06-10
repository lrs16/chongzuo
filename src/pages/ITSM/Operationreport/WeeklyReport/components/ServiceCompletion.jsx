import React, { useEffect, useImperativeHandle, useContext, useState } from 'react';
import {
  Table,
  Form,
  Input,
  Col,
  Row
} from 'antd';
import { connect } from 'dva';
import SysUpload from '@/components/SysUpload';

const { TextArea } = Input;
let tabActiveKey = 'week';
function ServiceCompletion(props) {

  const {
    form: { getFieldDecorator },
    forminladeLayout,
    tabActiveKey,
    serviceCompletionthreelist,
    maintenanceService,
    statisList,
    selfhandleRow,
    maintenanceArr,
    soluteArr,
    startTime,
    endTime,
    loading,
    dispatch
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
}, [maintenanceArr]);

// 一线问题解决情况汇总统计
useEffect(() => {
  if(soluteArr && soluteArr.length) {
    const result = JSON.parse(JSON.stringify([soluteArr[soluteArr.length -1]])
    .replace(/not_selfhandle/g, 'field1')
    .replace(/is_selfhandle/g, 'field2')
    .replace(/points/g, 'field3'))
    if(result) {
      selfhandleRow(result)
    }
  }
}, [soluteArr]);


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
  ]

  const handlemaintenanserviceceArr = () => {
    dispatch({
      type: 'eventstatistics/fetcheventServiceList',
      payload: { tabActiveKey,startTime, endTime }
    })

    dispatch({
      type: 'eventstatistics/fetchSelfHandleList',
      payload: {  tabActiveKey,startTime, endTime }
    })
  }

  useEffect(() => {
    if (startTime) {
      handlemaintenanserviceceArr()
    }
  }, [startTime])

  // useEffect(() => {
  //   if(loading === false) {
  //     handleTabledata()
  //   }
  // },[loading])

  return (
    <>
      {loading === false && (
        <Row gutter={16}>
          {/* <Col span={24}>
            <p style={{ fontWeight: '900', fontSize: '16px', marginTop: '20px' }}>三、运维服务指标完成情况</p>
          </Col> */}

          <Col span={24}>
            <p>(二)、软件运维服务指标完成情况</p>
          </Col>

          <Table
            columns={secondlyColumn}
            dataSource={maintenanceService}
          />



          <Col span={24}>
            <p style={{ fontWeight: '900', fontSize: '16px' }}>指标分析:</p>
          </Col>


          <Col span={24}>
            <p>1.一线问题解决情况汇总统计</p>
          </Col>

          <Table
            columns={threeColumn}
            dataSource={[soluteArr[soluteArr.length -1]]}
          />      
        </Row>

      )}

    </>
  )
}

// export default Form.create({})(ServiceCompletion)
export default Form.create({})(
  connect(({ eventstatistics, loading }) => ({
    maintenanceService: eventstatistics.maintenanceService,
    maintenanceArr: eventstatistics.maintenanceArr,
    soluteArr: eventstatistics.soluteArr,
    loading: loading.models.eventstatistics
  }))(ServiceCompletion),
);