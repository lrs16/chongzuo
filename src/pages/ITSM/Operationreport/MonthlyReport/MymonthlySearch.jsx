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

function MymonthlySearch(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, resetFields, validateFields, setFieldsValue },
    myweeklyreportTable,
    dispatch,
  } = props;
  const [expand, setExpand] = useState(false);
  const [paginations, setPaginations] = useState({ current: 1, pageSize: 10 });
  const [selectedrows, setSelectedrows] = useState('');
  const [selectdata, setSelectData] = useState('');
  const columns = [
    {
      title: '月报名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => {
        switch (text) {
          case 'name':
            return (
              <Link
                to={{
                  pathname: `/ITSM/operationreport/weeklyreport/softreport/${record.id}`,
                  // paneKey: record.status, // 传状态
                }}
              >
                {text}
              </Link>
            )
          // break;
          case 'bb':
            <Link
              to={{
                pathname: `/ITSM/operationreport/weeklyreport/softreport${record.id}`,
                // paneKey: record.status, // 传状态
              }}
            >
              {text}
            </Link>
            break;

          default:
            break;
        }
      }

    },
    {
      title: '月报分类',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: '填报日期',
      dataIndex: 'person',
      key: 'person',
    },
    {
      title: '填报人',
      dataIndex: 'person1',
      key: 'person1',
    },
  ];

  const getmyweeklyTable = () => {
    dispatch({
      type: 'myweeklyreportindex/myweeklyTable',
      payload: {
        pageNum: paginations.current,
        pageSize: paginations.pageSize,
      },
    });
  };

  const handleReset = () => {
    resetFields();
    starttime = '';
    endTime = '';
  };

  const searchdata = (values, page, pageSize) => {
    dispatch({
      type: 'myweeklyreportindex/myweeklyTable',
      payload: {
        ...values,
        pageSize,
        pageNum: page,
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
    // total: besolveList.total,
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

      searchdata(obj, paginations.current, paginations.pageSize);
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

  const handleDelete = () => {
    if (selectedrows.length) {
      const idList = selectedrows.map(item => {
        return item
      })

      dispatch({
        type: 'myweeklyreportindex/myweeklyTable',
        payload: idList
      }).then(res => {
        // message.info()
        getmyweeklyTable();
      })
    } else {
      message.info('至少选择一条数据');
    }
  }

  const defaultTime = () => {
    //  周统计
    starttime = moment().week(moment().week() - 1).startOf('week').format('YYYY-MM-DD HH:mm:ss');
    endTime = moment().week(moment().week() - 1).endOf('week').format('YYYY-MM-DD');
    endTime = `${endTime} 00:00:00`;
  }

  const startdisabledDate = (current) => {
    return current > moment().subtract('days', 6)
  }

  const onChange = (date, dateString) => {
    starttime = dateString;
    endTime = moment(dateString).add(+6, 'day').format('YYYY-MM-DD');
    setFieldsValue({ time2: moment(endTime) });
  }

  const endonChange = (date, dateString) => {
    endTime = dateString;
    starttime = moment(dateString).subtract('day', 6).format('YYYY-MM-DD');
    setFieldsValue({ time1: moment(starttime) })
  }

  const enddisabledDate = (current) => {
    return current > moment().endOf('day')
  }

  useEffect(() => {
    getmyweeklyTable();
    defaultTime();
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
              <Form.Item label="月报名称">
                {getFieldDecorator('no', {
                  rules: [
                    {
                      message: '请输入问题编号',
                    },
                  ],
                })(<Input placeholder='请输入' allowClear />)}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="月报分类">
                {getFieldDecorator('params1', {
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
                {getFieldDecorator('person', {})(<Input placeholder='请输入' allowClear />)}
              </Form.Item>
            </Col>

            {expand === true && (
              <>
                <Col span={9} {...form10ladeLayout}>
                  <Form.Item label="计划开始时间">
                    {getFieldDecorator('plannedStartTime', {
                    })
                      (
                        <RangePicker
                          showTime
                          format="YYYY-MM-DD HH:mm:ss"
                        />
                      )}
                  </Form.Item>
                </Col>

              </>
            )}

            {expand === false && (
              <Col span={24} style={{ textAlign: 'right' }}>
                <Button type="primary" onClick={handleSearch}>
                  查询
                </Button>

                <Button style={{ marginLeft: 8 }} onClick={handleReset}>
                  重置
                </Button>

                <Button
                  style={{ marginLeft: 8 }}
                  type="link"
                  onClick={() => {
                    setExpand(!expand);
                  }}
                >
                  {expand ? (
                    <>
                      关闭 <UpOutlined />
                    </>
                  ) : (
                    <>
                      展开 <DownOutlined />
                    </>
                  )}
                </Button>
              </Col>
            )}

            {expand === true && (
              <Col span={24} style={{ textAlign: 'right' }}>
                <Button type="primary" onClick={handleSearch}>
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={handleReset}>
                  重置
                </Button>
                <Button
                  style={{ marginLeft: 8 }}
                  type="link"
                  onClick={() => {
                    setExpand(!expand);
                  }}
                >
                  {expand ? (
                    <>
                      关闭 <UpOutlined />
                    </>
                  ) : (
                    <>
                      展开 <DownOutlined />
                    </>
                  )}
                </Button>
              </Col>
            )}
          </Form>
        </Row>

        <Button type="primary" style={{ marginRight: 8 }} onClick={exportDownload}>
          导出数据
          </Button>

        <Table
          // loading={loading}
          columns={columns}
          dataSource={myweeklyreportTable}
          // rowKey={record => record.id}
          pagination={pagination}
          rowSelection={rowSelection}
        />
      </Card>

    </PageHeaderWrapper>
  )
}



export default Form.create({})(
  connect(({ myweeklyreportindex, loading }) => ({
    myweeklyreportTable: myweeklyreportindex.myweeklyreportTable,
    loading: loading.models.myweeklyreportindex,
  }))(MymonthlySearch),
);