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
function ServiceTableone(props) {

  const {
    form: { getFieldDecorator },
    maintenanceArr,
    startTime,
    endTime,
    tabActiveKey,
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
      title:  tabActiveKey === 'week' ? '上周':'上月',
      dataIndex: 'last_num',
      key: 'last_num',
    },
    {
      title: tabActiveKey === 'week' ? '本周':'本月',
      dataIndex: 'now_num',
      key: 'now_num',
    },
    {
      title: '环比',
      dataIndex: 'points_count',
      key: 'points_count',
    },
  ];

  const handlemaintenanserviceceArr = () => {
    dispatch({
      type: 'eventstatistics/fetchMaintenancelist',
      payload: { tabActiveKey, startTime, endTime }
    })
  }

  useEffect(() => {
    if (startTime && tabActiveKey) {
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
          <Col span={24}>
            <p style={{ fontWeight: '900', fontSize: '16px', marginTop: '20px' }}>三、运维服务指标完成情况</p>
          </Col>

          <Col span={24}>
            <p>（一）运维分类统计情况 </p>
          </Col>

          <Table
            columns={column}
            dataSource={maintenanceArr.data}
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
  }))(ServiceTableone),
);