import React, { useEffect, useState } from 'react';
import {
  Form,
  Card,
  Input,
  Button,
  Row,
  Col,
  Table,
  DatePicker,
  Select,
  message,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';

import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SysDict from '@/components/SysDict';

const { RangePicker } = DatePicker;
const { Option } = Select;
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

let starttime;
let endTime;

function WeeklySearch(props) {
  const pagetitle = props.route.name;
  const {
    form: {
      getFieldDecorator,
      validateFields,
      setFieldsValue,
    },
    queryOrderlist,
    dispatch,
    location,
    loading
  } = props;
  const [paginations, setPaginations] = useState({ current: 1, pageSize: 10 });
  const [selectedrows, setSelectedrows] = useState('');
  const [selectdata, setSelectData] = useState('');
  const [tabrecord, setTabRecord] = useState({});

  const columns = [
    {
      title: '周报类型',
      dataIndex: 'type',
      key: 'type',
      render: (text, record) => {
        const handleClick = () => {
          switch (text) {
            case '软件运维周报':
              router.push({
                pathname: `/ITSM/operationreport/weeklyreport/detailSoft`,
                query: {
                  mainId: record.id,
                  reporttype: 'week',
                  orderNo: record.id,
                  reportSearch: true
                },
              });
              break;
            case '机房运维周报':
              router.push({
                pathname: `/ITSM/operationreport/weeklyreport/computerroomreportdetail`,
                query: {
                  mainId: record.id,
                  reporttype: 'week',
                  orderNo: record.id,
                  reportSearch: true
                },
              });
              break;
            case '数据库运维周报':
              router.push({
                pathname: `/ITSM/operationreport/weeklyreport/databasereportdetail`,
                query: {
                  mainId: record.id,
                  reporttype: 'week',
                  orderNo: record.id,
                  reportSearch: true
                },
              });
              break;
            case '其他运维周报':
              router.push({
                pathname: `/ITSM/operationreport/weeklyreport/otherreportdetail`,
                query: {
                  mainId: record.id,
                  reporttype: 'week',
                  orderNo: record.id,
                  reportSearch: true
                },
              });
              break;
            default:
              break;
          }

        }
        return <a onClick={handleClick}>{text}</a>

      }
    },
    {
      title: '周报名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '填报日期',
      dataIndex: 'addTime',
      key: 'addTime',
    },
    {
      title: '填报人',
      dataIndex: 'userName',
      key: 'userName',
    },
  ];

  const searchdata = (values, page, pageSize) => {
    dispatch({
      type: 'softreport/queryList',
      payload: {
        ...values,
        timeType: '周报',
        userId: '',
        plannedStartTime: '',
        time1: values.plannedStartTime?.length ? moment(values.plannedStartTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
        time2: values.plannedStartTime?.length ? moment(values.plannedStartTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
        pageSize,
        pageIndex: page - 1,
      },
    });
    setTabRecord({
      ...values,
      timeType: '周报',
      userId: sessionStorage.getItem('userauthorityid'),
      plannedStartTime: '',
      time1: values.plannedStartTime?.length ? moment(values.plannedStartTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
      time2: values.plannedStartTime?.length ? moment(values.plannedStartTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
      paginations: {
        pageSize,
        current: page + 1,
      }
    })
  };

  const handleReset = () => {
    router.push({
      pathname: location.pathname,
      query: {},
      state: {}
    });
    searchdata({
      name: '',
      type: '',
      plannedStartTime: '',
      userName: ''
    }, 1, paginations.pageSize);
  };

  const onShowSizeChange = (page, pageSize) => {
    validateFields((err, values) => {
      if (!err) {
        searchdata(values, page, pageSize);
      }
    });
    setPaginations({
      ...paginations,
      pageSize,
    });
  };

  const changePage = page => {
    validateFields((err, values) => {
      if (!err) {
        searchdata(values, page, paginations.pageSize);
      }
    });
    setPaginations({
      ...paginations,
      current: page,
    });
  };

  const pagination = {
    showSizeChanger: true,
    onShowSizeChange: (page, pageSize) => onShowSizeChange(page, pageSize),
    current: paginations.current,
    pageSize: paginations.pageSize,
    total: queryOrderlist.total,
    showTotal: total => `总共  ${total}  条记录`,
    onChange: (page) => changePage(page),
  };

  const handleSearch = () => {
    setPaginations({
      ...paginations,
      current: 1,
    });
    validateFields((err, values) => {
      if (err) {
        return;
      }
      const obj = {
        ...values,
        time1: starttime,
        time2: endTime
      };
      searchdata(obj, 1, paginations.pageSize);
    });
  };


  const exportDownload = () => {
    if (selectedrows.length !== 1) {
      message.info('选择一条数据导出哦')
    } else {
      const mainId = selectedrows[0].id;
      dispatch({
        type: 'softreport/exportWord',
        payload: { mainId }
      }).then(res => {
        const filename = `下载.doc`;
        const blob = new Blob([res]);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      })
    }
  }

  const rowSelection = {
    onChange: (selected, selectedRows) => {
      setSelectedrows([...selectedRows])
    }
  }

  const defaultTime = () => {
    //  周统计
    starttime = moment().week(moment().week() - 1).startOf('week').format('YYYY-MM-DD HH:mm:ss');
    endTime = moment().week(moment().week() - 1).endOf('week').format('YYYY-MM-DD');
    endTime = `${endTime} 00:00:00`;
  }

  //  传给多标签的数据
  const record = {
    name: '',
    type: '',
    plannedStartTime: '',
    userName: '',
    paginations: {
      current: 1,
      pageSize: 15
    }
  };

  const cacheinfo = location.state.cacheinfo === undefined ? record : location.state.cacheinfo;

  useEffect(() => {
    if (location && location.state && location.state.cacheinfo) {
      const { time1, time2 } = location.state.cacheinfo;
      setFieldsValue({
        plannedStartTime: time1 ? [moment(time1), moment(time2)] : ''
      })
    }
  }, [location.state])

  useEffect(() => {
    if (location.state) {
      if (location.state.cache) {
        // 传表单数据到页签
        dispatch({
          type: 'viewcache/gettabstate',
          payload: {
            cacheinfo: {
              ...tabrecord,
              registerTime: '',
              paginations,
            },
            tabid: sessionStorage.getItem('tabid'),
          },
        });
      }
      // 点击菜单刷新,并获取数据
      if (location.state.reset) {
        handleReset();
      }
      // 标签切回设置初始值
      if (location.state.cacheinfo) {
        const { current, pageSize } = location.state.cacheinfo.paginations;
        setPaginations({ ...paginations, current, pageSize });
      }
    }
  }, [location.state]);

  useEffect(() => {
    defaultTime();
    validateFields((err, value) => {
      searchdata(value, 1, paginations.pageSize);
    })
  }, []);

  const getTypebyTitle = title => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.title === title)[0].children;
    }
    return [];
  }

  const classData = getTypebyTitle('周报分类')

  return (
    <PageHeaderWrapper title={pagetitle}>
      <SysDict
        typeid='561'
        commonid="335"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />

      {
        sessionStorage.getItem('userauthorityid') && (
          <Card>
            <Row gutter={16}>
              <Form {...formItemLayout}>
                <Col span={8}>
                  <Form.Item label="周报名称">
                    {getFieldDecorator('name', {
                      rules: [
                        {
                          message: '请输入问题编号',
                        },
                      ],
                      initialValue: cacheinfo.name
                    })(<Input placeholder='请输入' allowClear />)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="周报分类">
                    {getFieldDecorator('type', {
                      initialValue: cacheinfo.type
                    })
                      (
                        <Select placeholder="请选择" allowClear>
                          {classData.map(obj => [
                            <Option key={obj.key} value={obj.title}>
                              {obj.title}
                            </Option>,
                          ])}
                        </Select>,
                        <Input />
                      )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="填报人" >
                    {getFieldDecorator('userName', {
                      initialValue: cacheinfo.userName
                    })(<Input placeholder='请输入' allowClear />)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="填报日期">
                    {getFieldDecorator('plannedStartTime', {
                    })
                      (
                        <RangePicker
                          showTime
                          format="YYYY-MM-DD HH:mm:ss"
                          style={{ width: '100%' }}
                        />
                      )}
                  </Form.Item>
                </Col>

                <Col span={16} style={{ textAlign: 'right' }}>
                  <Button type="primary" onClick={handleSearch}>
                    查询
                  </Button>

                  <Button style={{ marginLeft: 8 }} onClick={handleReset}>
                    重置
                  </Button>
                </Col>

              </Form>
            </Row>

            <Button type="primary" style={{ marginRight: 8 }} onClick={exportDownload}>
              导出数据
            </Button>

            <Table
              loading={loading}
              columns={columns}
              dataSource={queryOrderlist.rows}
              rowKey={records=> records.id}
              pagination={pagination}
              rowSelection={rowSelection}
            />
          </Card>

        )
      }
    </PageHeaderWrapper>
  )
}

export default Form.create({})(
  connect(({ softreport, loading }) => ({
    queryOrderlist: softreport.queryOrderlist,
    loading: loading.models.softreport,
  }))(WeeklySearch),
);