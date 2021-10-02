import React, { useEffect, useState } from 'react';
import {
  Card,
  Row,
  Col,
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  Table,
  Divider,
  Popconfirm
} from 'antd';
import router from 'umi/router';
import moment from 'moment';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';



const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

const { RangePicker } = DatePicker;
const { Option } = Select;
let selectDate;

function Statistic(props) {
  const pagetitle = props.route.name;
  const {
    form: {
      getFieldDecorator,
      resetFields,
      getFieldsValue,
      validateFields
    },
    location,
    dispatch,
    searchUsersarr,
    statsIndexarr
  } = props;
  const [type, setType] = useState('');


  const columns = [
    {
      title: '值班人',
      dataIndex: 'staffName',
      key: 'staffName'
    },
    {
      title: '值班总次数',
      dataIndex: 'total',
      key: 'total',
    },
    {
      title: '工作日值班次数',
      dataIndex: 'workday',
      key: 'workday'
    },
    {
      title: '周末值班次数',
      dataIndex: 'weekend',
      key: 'weekend'
    },
    {
      title: '节假值班次数',
      dataIndex: 'holiday',
      key: 'holiday'
    },
  ];



  const searchdata = (values) => {
    const obj = {
      ...values,
      beginTime: (values && values.time?.length)
        ? moment(values.time[0]).format('YYYY-MM-DD HH:mm:ss')
        : '',
      endTime: (values && values.time?.length)
        ? moment(values.time[1]).format('YYYY-MM-DD HH:mm:ss')
        : '', // 发生时间
    };
    delete obj.time
    dispatch({
      type: 'shifthandover/fetchstatsIndex',
      payload: {
        ...obj
      }
    });
  }

  const handleReset = () => {
    router.push({
      pathname: location.pathname,
      query: {},
      state: {}
    });
    resetFields();
    searchdata({}, 1, 15)
  }

  useEffect(() => {
    const value = getFieldsValue();
    searchdata(value)
  }, [])


  const handleonChange = (value, option) => {
    setType(value)
    dispatch({
      type: 'dutyandtypesetting/staffSearch',
      payload: {
        current: 1,
        size: 1000
      }
    }
    )
  }

  if (searchUsersarr && searchUsersarr.records) {
    selectDate = (searchUsersarr.records).map(item => {
      return {
        userId: item.userId,
        staffName: item.staffName,
        deptId: item.deptId,
        deptName: item.deptName
      }
    })
  }

  const handlesearch = () => {
    const value = getFieldsValue();
    searchdata(value)
  }

  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card>
        <Row gutter={8}>
          <Form {...formItemLayout}>
            <Col span={8}>
              <Form.Item label="起始时间">
                {getFieldDecorator('time', {
                  initialValue: '',
                })(<RangePicker placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="统计方式">
                {getFieldDecorator('type ', {
                  initialValue: '',
                })(
                  <Select
                    onChange={handleonChange}
                  >
                    <Option key='USER' value='USER'>值班人</Option>
                    <Option key='DEPT' value='DEPT'>值班单位</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="">
                {getFieldDecorator('typeValue ', {
                  initialValue: '',
                })(
                  <Select
                  >
                    {(selectDate || []).map(obj => [
                      <Option
                        key={obj.userId}
                        value={type === 'USER' ? obj.userId : obj.deptId}
                      >
                        {type === 'USER' ? obj.staffName : obj.deptName}
                      </Option>,
                    ])}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={8} style={{ textAlign: 'left' }}>
              <Button
                type='primary'
                style={{ marginRight: 8 }}
                onClick={handlesearch}
              >
                查询
              </Button>

              <Button onClick={handleReset}>重置</Button>
            </Col>

            {/* <Col span={24} style={{ textAlign: 'right', paddingTop: 4 }}>{extra}</Col> */}
          </Form>
        </Row>

        <Table
          columns={columns}
          dataSource={statsIndexarr}
        />
      </Card>

    </PageHeaderWrapper>

  )

}
export default Form.create({})(
  connect(({ dutyandtypesetting, shifthandover, loading }) => ({
    searchUsersarr: dutyandtypesetting.searchUsersarr,
    statsIndexarr: shifthandover.statsIndexarr,
    loading: loading.models.dutyandtypesetting
  }))(Statistic),
);