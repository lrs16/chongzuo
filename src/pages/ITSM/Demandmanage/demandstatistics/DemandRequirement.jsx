import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import {
  Card,
  Row,
  Col,
  Form,
  DatePicker,
  Button,
  Table
} from 'antd';
import Link from 'umi/link';
import moment from 'moment';
import { PageHeaderWrapper } from '@ant-design/pro-layout';


const { RangePicker } = DatePicker;

let statTimeBegin = '';
let statTimeEnd = '';
const columns = [
  {
    title: '一级功能',
    dataIndex: 'firstLevel',
    key: 'firstLevel',
  },
  {
    title: '二级功能',
    dataIndex: 'twoLevel',
    key: 'twoLevel',
  },
  {
    title: '三级功能',
    dataIndex: 'threeLevel',
    key: 'threeLevel',
  },
  {
    title: '工单数',
    dataIndex: 'number',
    key: 'number',
    render: (text, record) => (
      <Link
        to={{
          pathname: '/ITSM/demandmanage/query',
          query: {
            module: record.fullName,
            statisticalType: 'demandRequirement'
          }
        }}
      >
        {text}
      </Link>
    )
  },
];


function DemandRequirement(props) {
  const { pagetitle } = props.route.name;
  const {
    form: { getFieldDecorator, resetFields },
    requirementArr,
    dispatch
  } = props;

  if (requirementArr && requirementArr.length) {
    for (let i = 0; i < requirementArr.length - 1; i++) {
      for (let j = i + 1; j < requirementArr.length; j++) {
        if (requirementArr[i].firstLevel === requirementArr[j].firstLevel) {
          requirementArr[j].firstLevel = '';
        }
      }
    }
  }

  const onChange = (date, dateString) => {
    [statTimeBegin, statTimeEnd] = dateString;
  }



  const handleListdata = () => {
    dispatch({
      type: 'demandstatistic/fetchdemandRequirement',
      payload: { statTimeBegin, statTimeEnd }
    })
  }

  const download = () => {
    dispatch({
      type: 'demandstatistic/downloadrequirement',
      payload: { statTimeBegin, statTimeEnd }
    }).then(res => {
      const filename = '下载.xls';
      const blob = new Blob([res]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    })
  }


  useEffect(() => {
    handleListdata();
  }, [])


  const handleReset = () => {
    statTimeBegin = '';
    statTimeEnd = '';
    resetFields();
  }


  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < moment().endOf('day');
  }

  const disabledRangeTime = (_, type) => {
    if (type === 'start') {
      return {
        disabledHours: () => range(0, 60).splice(4, 20),
        disabledMinutes: () => range(30, 60),
        disabledSeconds: () => [55, 56],
      };
    }
    return {
      disabledHours: () => range(0, 60).splice(20, 4),
      disabledMinutes: () => range(0, 31),
      disabledSeconds: () => [55, 56],
    };
  }


  return (
    <PageHeaderWrapper
      title={pagetitle}
    >
      <Card>
        <Row gutter={24}>
          <Form layout='inline'>
            <>
              <Col span={24}>
                <Form.Item label='起始时间'>
                  {
                    getFieldDecorator('time1', {})
                      (
                        <RangePicker 
                          disabledDate={disabledDate}
                          disabledTime={disabledRangeTime}
                          showTime={{
                            hideDisabledOptions: true,
                            defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                          }}
                          onChange={onChange}
                           />
      
                      )
                  }
                </Form.Item>

                <Button
                  type='primary'
                  style={{ marginTop: 6 }}
                  onClick={() => handleListdata('search')}
                >
                  查询
               </Button>


                <Button
                  style={{ marginLeft: 8 }}
                  onClick={handleReset}
                >
                  重置
              </Button>
              </Col>
            </>


          </Form>
        </Row>

        <div>
          <Button
            type='primary'
            style={{ marginBottom: 24, marginTop: 5 }}
            onClick={download}
          >
            导出数据
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={requirementArr}
          rowKey={record => record.statName}
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default Form.create({})(
  connect(({ demandstatistic }) => ({
    requirementArr: demandstatistic.requirementArr
  }))(DemandRequirement),
);