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
    serviceCompletionlist,
    serviceCompletionthreelist,
    maintenanceService,
    maintenanceArr,
    soluteArr,
    startTime,
    endTime,
    loading,
    dispatch
  } = props;


  const column = [
    {
      title: '一级对象',
      dataIndex: 'first_object',
      key: 'first_object',

    },
    {
      title: '二级对象',
      dataIndex: 'second_object',
      key: 'second_object',
    },
    {
      title: '上周',
      dataIndex: 'last_num',
      key: 'last_num',
    },
    {
      title: '本周',
      dataIndex: 'now_num',
      key: 'now_num',
    },
    {
      title: '环比',
      dataIndex: 'points_count',
      key: 'points_count',
    },
  ];

  const secondlyColumn = [
    {
      title: '服务指标',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '上周',
      dataIndex: 'last',
      key: 'last',
    },
    {
      title: '下周',
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
      payload: { startTime, endTime }
    })

    dispatch({
      type: 'eventstatistics/fetchMaintenancelist',
      payload: { tabActiveKey, startTime, endTime }
    })

    dispatch({
      type: 'eventstatistics/fetchSelfHandleList',
      payload: {  startTime, endTime }
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