import React, { useEffect, useState } from 'react';
import {
  Card,
  Row,
  Col,
  Form,
  Select,
  Button,
  DatePicker,
  Table,
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
      setFieldsValue
    },
    location,
    dispatch,
    searchUsersarr,
    statsIndexarr,
    loading
  } = props;
  const [type, setType] = useState('');
  const [tabrecord, setTabRecord] = useState({});
  const [time, setTime] = useState({
    startValue: null,
    endValue: null,
    endOpen: false,
  })

  const [dutytime, setDutytime] = useState({
    startValue: null,
    endValue: null,
    endOpen: false,
  })


  const columns = [
    {
      title: `${type === 'USER' ? '值班人' : '值班单位'}`,
      dataIndex: `${type === 'USER' ? 'staffName' : 'deptName'}`,
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
      beginTime: (values && values.beginTime)
        ? moment(values.beginTime).format('YYYY-MM-DD HH:mm:ss')
        : moment().startOf('month').format('YYYY-MM-DD 00:00:00'),
      endTime: (values && values.endTime)
        ? moment(values.endTime).format('YYYY-MM-DD HH:mm:ss')
        : moment().endOf('month').format('YYYY-MM-DD 23:59:59'), // 发生时间
    };
    dispatch({
      type: 'shifthandover/fetchstatsIndex',
      payload: {
        ...obj
      }
    });
    setTabRecord({ ...obj })
  }

  const handleReset = () => {
    router.push({
      pathname: location.pathname,
      query: {},
      state: {}
    });
    resetFields();
    setType('DEPTName')
    searchdata({}, 1, 15)
  }

  const handleonChange = (value) => {
    const obj = getFieldsValue();
    const resultobj = obj;
    resultobj.type = value
    setType(value);
    setFieldsValue({ typeValue: '' })
    dispatch({
      type: 'dutyandtypesetting/staffSearch',
    })
    searchdata(resultobj)
  }

  if (searchUsersarr && searchUsersarr.records) {
    if (type !== 'USER') {
      const obj = {}
      const arr = (searchUsersarr.records).reduce((item, next) => {
        obj[next.deptName] ? '' : obj[next.deptName] = true && item.push(next)
        return item
      }, []);

      selectDate = (arr).map(item => {
        return {
          userId: item.id,
          staffName: item.staffName,
          deptId: item.deptId,
          deptName: item.deptName
        }
      })
    } else {
      selectDate = (searchUsersarr.records).map(item => {
        return {
          userId: item.id,
          staffName: item.staffName,
          deptId: item.deptId,
          deptName: item.deptName
        }
      })
    }
  }


  const handlesearch = () => {
    const value = getFieldsValue();
    searchdata(value)
  }

  const handleStartOpenChange = (open, types) => {
    if (!open && types === 'create') {
      const obj = time;
      obj.endOpen = true;
      setTime(obj);
    }

    if (!open && types === 'duty') {
      const obj = dutytime;
      obj.endOpen = true;
      setDutytime(obj);
    }
  };

  //  传给多标签的数据
  const record = {
    beginTime: '',
    endTime: '',
    type: '',
    typeValue: '',
  }

  const cacheinfo = (location.state && location.state.cacheinfo === undefined) ? record : location.state.cacheinfo;

  useEffect(() => {
    if (location.state) {
      if (location.state.cache) {
        dispatch({
          type: 'viewcache/gettabstate',
          payload: {
            cacheinfo: {
              ...tabrecord,
              // paginations
            },
            tabid: sessionStorage.getItem('tabid')
          }
        })
      };

      if (location.state.reset) {
        handleReset();
      }
    }
  }, [location.state])

  useEffect(() => {
    const value = getFieldsValue();
    if (cacheinfo && cacheinfo.type) {
      setType(cacheinfo.type)
    }
    searchdata(value)
  }, [])

  //  设置时间的范围
  const disabledStartDate = (startValue, types) => {
    if (types === 'create') {
      const { endValue } = time;
      if (!startValue || !endValue) {
        return false;
      }
      return startValue.valueOf() > endValue.valueOf()
    }

    if (types === 'duty') {
      const { endValue } = dutytime;
      if (!startValue || !endValue) {
        return false;
      }
      return startValue.valueOf() > endValue.valueOf()
    }

    return []

  }

  const disabledEndDate = (endValue, types) => {
    if (types === 'create') {
      const { startValue } = time;
      if (!endValue || !startValue) {
        return false;
      }
      return endValue.valueOf() <= startValue.valueOf();
    }

    if (types === 'duty') {
      const { startValue } = dutytime;
      if (!endValue || !startValue) {
        return false;
      }
      return endValue.valueOf() <= startValue.valueOf();
    }

    return []

  };

  const onChange = (field, value, types) => {
    if (types === 'create') {
      const obj = time;
      switch (field) {
        case 'startValue':
          obj.startValue = value;
          setTime(obj);
          break;
        case 'endValue':
          obj.endValue = value;
          setTime(obj);
          break;
        default:
          break;
      }
    }

    if (types === 'duty') {
      const obj = dutytime;
      switch (field) {
        case 'startValue':
          obj.startValue = value;
          setDutytime(obj);
          break;
        case 'endValue':
          obj.endValue = value;
          setDutytime(obj);
          break;
        default:
          break;
      }
    }
  };

  const onStartChange = (value, types) => {
    onChange('startValue', value, types);
  };

  const onEndChange = (value, types) => {
    onChange('endValue', value, types);
  };

  const handleEndOpenChange = (open, types) => {
    if (types === 'create') {
      const obj = time;
      obj.endOpen = open
      setTime(obj);
    } else {
      const obj = dutytime;
      obj.endOpen = open
      setDutytime(obj);
    }
  };

  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card>
        <Row gutter={24}>
          <Form {...formItemLayout}>
            <Col span={8}>
              <Form.Item label="起始时间" >
                <Row>
                  <Col span={11}>
                    {getFieldDecorator('beginTime', {
                      initialValue: (cacheinfo && cacheinfo.beginTime) ? moment(cacheinfo.beginTime) : moment().startOf('month'),
                    })(
                      <DatePicker
                        disabledDate={(value) => disabledStartDate(value, 'create')}
                        onChange={(value) => onStartChange(value, 'create')}
                        onOpenChange={(value) => handleStartOpenChange(value, 'create')}
                        showTime={{
                          hideDisabledOptions: true,
                          defaultValue: moment('00:00:00', 'HH:mm:ss'),
                        }}
                        placeholder="开始时间"
                        format='YYYY-MM-DD HH:mm:ss'
                        style={{ minWidth: 120, width: '100%' }}
                      />
                    )}
                  </Col>
                  <Col span={2} style={{ textAlign: 'center' }}>-</Col>
                  <Col span={11}>
                    {getFieldDecorator('endTime', {
                      initialValue: (cacheinfo && cacheinfo.endTime) ? moment(cacheinfo.endTime) : moment().endOf('month'),
                    })(
                      <DatePicker
                        disabledDate={(value) => disabledEndDate(value, 'create')}
                        onChange={(value) => onEndChange(value, 'create')}
                        open={time.endOpen}
                        onOpenChange={(value) => handleEndOpenChange(value, 'create')}
                        showTime={{
                          hideDisabledOptions: true,
                          defaultValue: moment('23:59:59', 'HH:mm:ss'),
                        }}
                        placeholder="结束时间"
                        format='YYYY-MM-DD HH:mm:ss'
                        style={{ minWidth: 120, width: '100%' }}
                      />
                    )}
                  </Col>
                </Row>
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item label="统计方式">
                {getFieldDecorator('type', {
                  initialValue: cacheinfo.type
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

            <Col span={6}>
              <Form.Item label="">
                {getFieldDecorator('typeValue', {
                  initialValue: cacheinfo.typeValue
                })(
                  <Select
                  >
                    {(selectDate || []).map(obj => [
                      <Option
                        key={obj.id}
                        value={type === 'USER' ? obj.userId : obj.deptId}
                      >
                        {type === 'USER' ? obj.staffName : obj.deptName}
                      </Option>,
                    ])}
                  </Select>
                )}
              </Form.Item>
            </Col>

            <Col span={4} style={{ textAlign: 'left', marginBottom: 10 }}>
              <Button
                type='primary'
                style={{ marginRight: 8 }}
                onClick={handlesearch}
              >
                查询
              </Button>

              <Button onClick={handleReset}>重置</Button>
            </Col>

          </Form>
        </Row>

        <Table
          loading={loading}
          columns={columns}
          dataSource={statsIndexarr}
          rowKey={(record,index) => { return index}}
        />
      </Card>
    </PageHeaderWrapper>
  )

}
export default Form.create({})(
  connect(({ dutyandtypesetting, shifthandover, loading }) => ({
    searchUsersarr: dutyandtypesetting.searchUsersarr,
    statsIndexarr: shifthandover.statsIndexarr,
    loading: loading.models.shifthandover
  }))(Statistic),
);