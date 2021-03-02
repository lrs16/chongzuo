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

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
let startTime;
let endTime;
const newObj = {};
const columns = [
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
    title: '上周工单数',
    dataIndex: 'last_num',
    key: 'last_num',
    render: (text, record) => (
      <Link
        to={{
          pathname: '/ITSM/problemmanage/problemquery',
          query: { handleStatu: '0' }
        }}
      >
        {text}
      </Link>
    )
  },
  {
    title: '本周工单数',
    dataIndex: 'now_num',
    key: 'now_num',
    render: (text, record) => (
      <Link
        to={{
          pathname: '/ITSM/problemmanage/problemquery',
          query: { handleStatu: '0' }
        }}
      >
        {text}
      </Link>
    )
  },
  {
    title: '环比',
    dataIndex: 'points_count',
    key: 'points_count',
  },
];

function Maintenance(props) {
  const { pagetitle } = props.route.name;
  const [tabActiveKey, setTabActiveKey] = useState('week');
  const {
    form: { getFieldDecorator, resetFields },
    maintenanceArr,
    dispatch
  } = props;

  const onChange = (date) => {
    if(tabActiveKey === 'week') {
      const date1 = new Date(date._d);
      const date2 = new Date(date._d);
      startTime = `${date1.getFullYear()}-${(date1.getMonth() + 1)}-${date1.getDate()}`;
      date2.setDate(date1.getDate() + 7);
      endTime = `${date2.getFullYear()}-${(date2.getMonth() + 1)}-${date2.getDate()}`;
    } else {
      startTime = '';
      endTime = '';
      const date1 = new Date(date._d);
      const date2 = new Date(date._d);
      startTime = `${date1.getFullYear()}-${(date1.getMonth() + 1)}-${date1.getDate()}`;
      console.log('startTime: ', startTime);
      date2.setDate(date1.getDate() -30);
      endTime = `${date2.getFullYear()}-${(date2.getMonth() + 2)}-${date2.getDate()}`;
      console.log('endTime: ', endTime);
    }
  }


  const handleListdata = (params) => {
    dispatch({
      type: 'eventstatistics/fetchMaintenancelist',
      payload:{ tabActiveKey,startTime, endTime }
    })
  }

  const download = () => {
    dispatch({
      type: 'problemstatistics/downloadHandlegrate'
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

  const handleReset = () => {
    startTime = '';
    endTime = '';
    resetFields();
  }
  

  const defaultTime = (tabActiveKey) => {
    //  周统计
    if(tabActiveKey === 'week') {
      const day2 = new Date();
      day2.setTime(day2.getTime());
      endTime = `${day2.getFullYear()}-${(day2.getMonth() + 1)}-${day2.getDate()}`;
      const date2 = new Date(day2);
      date2.setDate(day2.getDate() - 7);
      startTime = `${date2.getFullYear()}-${(date2.getMonth() + 1)}-${date2.getDate()}`;
    } else { // 月统计
      console.log('ff');
      const day2 = new Date();
      day2.setTime(day2.getTime());
      endTime = `${day2.getFullYear()}-${(day2.getMonth() + 1)}-${day2.getDate()}`;
      console.log('endTime: ', endTime);
      const date2 = new Date(day2);
      date2.setDate(day2.getDate() - 30);
      startTime = `${date2.getFullYear()}-${(date2.getMonth() +1)}-${date2.getDate()}`;
      console.log('startTime: ', startTime);
    }
  }
  console.log(endTime,'endTime');

  useEffect(() => {
    defaultTime();
    handleListdata();
  }, [tabActiveKey])

  const tabList = [
    {
      key: 'week',
      tab: '运维分类统计情况(周)',
    },
    {
      key: 'month',
      tab: '运维分类统计情况(月)',
    },
  ];

  const handleTabChange = (key) => { // tab切换
    setTabActiveKey(key);
  };


  return (
    <PageHeaderWrapper
      title={pagetitle}
      tabList={tabList}
      onTabChange={handleTabChange}
      tabActiveKey={tabActiveKey}
    >
      <Card>
        <Row gutter={16}>
          <Form {...formItemLayout}>
            {/* {
              tabActiveKey === 'week' && (
                <>
                <Col span={8}>
                <Form.Item label='开始时间'>
                  {getFieldDecorator('time1', {
                     initialValue: startTime ? moment(startTime) : ''
                  })(<DatePicker
                    format="YYYY-MM-DD"
                    onChange={onChange}
                  />)}
                </Form.Item>
              </Col>
  
              <Col span={8}>
                <Form.Item label='结束时间'>
                  {
                    getFieldDecorator('time2', {
                      initialValue: endTime ? moment(endTime) : ''
                    })
                      (<DatePicker disabled />)
                  }
                </Form.Item>
              </Col>
              </>
              )
            } */}

            {
              tabActiveKey === 'month' && (
                <>
                <Col span={8}>
                <Form.Item label='开始时间1'>
                  {getFieldDecorator('time1', {
                     initialValue: startTime ? moment(startTime) : ''
                  })(<DatePicker
                    format="YYYY-MM-DD"
                    onChange={onChange}
                  />)}
                </Form.Item>
              </Col>
  
              <Col span={8}>
                <Form.Item label='结束时间1'>
                  {
                    getFieldDecorator('time2', {
                      initialValue: endTime ? moment(endTime) : ''
                    })
                      (<DatePicker disabled />)
                  }
                </Form.Item>
              </Col>
              </>
              )
            }
            <p>{endTime}</p>
          
            <Col span={8}>
              <Button
                type='primary'
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
          </Form>
        </Row>

        <div>
          <Button
            type='primary'
            style={{ marginBottom: 24 }}
            onClick={download}
          >
            导出数据
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={maintenanceArr}
          rowKey={record => record.statName}
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default Form.create({})(
  connect(({ eventstatistics }) => ({
    maintenanceArr: eventstatistics.maintenanceArr
  }))(Maintenance),
);