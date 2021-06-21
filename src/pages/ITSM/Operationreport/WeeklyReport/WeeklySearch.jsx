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
  Dropdown,
  Menu
} from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';
import moment from 'moment';
import router from 'umi/router';

import { DownOutlined, UpOutlined } from '@ant-design/icons';
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

const form10ladeLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

let starttime;
let monthStarttime;
let endTime;

function WeeklySearch(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, resetFields, validateFields, setFieldsValue },
    queryOrderlist,
    dispatch,
    loading
  } = props;
  const [expand, setExpand] = useState(false);
  const [paginations, setPaginations] = useState({ current: 1, pageSize: 10 });
  const [selectedrows, setSelectedrows] = useState('');
  const [selectdata, setSelectData] = useState('');
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
                pathname: `/ITSM/operationreport/weeklyreport/detailSoft/`,
                query: {
                  mainId: record.id,
                  reporttype: 'week',
                  reportSearch:true
                },
              });
              break;
            case '机房运维周报':
              router.push({
                pathname: `/ITSM/operationreport/weeklyreport/computerroomreportdetail`,
                query: {
                  mainId: record.id,
                  reporttype: 'week',
                  reportSearch:true
                },
              });
              break;
            case '数据库运维周报':
              router.push({
                pathname: `/ITSM/operationreport/weeklyreport/databasereportdetail`,
                query: {
                  mainId: record.id,
                  reporttype: 'week',
                  reportSearch:true
                },
              });
              break;
            case '其他运维周报':
              router.push({
                pathname: `/ITSM/operationreport/weeklyreport/otherreportdetail`,
                query: {
                  mainId: record.id,
                  reporttype: 'week',
                  reportSearch:true
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
      dataIndex: 'time1',
      key: 'time1',
    },
    {
      title: '填报人',
      dataIndex: 'userName',
      key: 'userName',
    },
  ];

  const handleReset = () => {
    resetFields();
    starttime = '';
    endTime = '';
    validateFields((err, value) => {
      searchdata(value, 1, paginations.pageSize);
    })
  };

  const searchdata = (values, page, pageSize) => {
    dispatch({
      type: 'softreport/queryList',
      payload: {
        ...values,
        timeType:'周报',
        userId: '',
        plannedStartTime: '',
        time1: values.plannedStartTime?.length ? moment(values.plannedStartTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
        time2: values.plannedStartTime?.length ? moment(values.plannedStartTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
        pageSize,
        pageIndex: page - 1,
      },
    });
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
    validateFields((err, values) => {
      dispatch({
        type: 'processmodel/downloadMyOperationExcel',
        payload: {
          ...values,
        }
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
    })
  }

  const rowSelection = {
    onChange: (selectedRows) => {
      setSelectedrows([...selectedRows])
    }
  }


  const defaultTime = () => {
    //  周统计
    starttime = moment().week(moment().week() - 1).startOf('week').format('YYYY-MM-DD HH:mm:ss');
    endTime = moment().week(moment().week() - 1).endOf('week').format('YYYY-MM-DD');
    endTime = `${endTime} 00:00:00`;
  }

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
        typeid="1399541895977242626"
        commonid="1354288354950123522"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
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
                  initialValue: ''
                })(<Input placeholder='请输入' allowClear />)}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="周报分类">
                {getFieldDecorator('type', {
                  initialValue: ''
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
                  initialValue: ''
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
          rowKey={record => record.id}
          pagination={pagination}
          rowSelection={rowSelection}
        />
      </Card>

    </PageHeaderWrapper>
  )
}



export default Form.create({})(
  connect(({ softreport, loading }) => ({
    queryOrderlist: softreport.queryOrderlist,
    loading: loading.models.softreport,
  }))(WeeklySearch),
);