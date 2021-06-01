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
let monthStarttime;
let endTime;

function MymonthlyReport(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, resetFields, validateFields, setFieldsValue },
    myweeklyreportTable,
    dispatch,
  } = props;
  const [expand, setExpand] = useState(false);
  const [paginations, setPaginations] = useState({ current: 1, pageSize: 10 });
  const [selectdata, setSelectData] = useState('');
  const [selectedrows, setSelectedrows] = useState('');
  const columns = [
    {
      title: '周报名称',
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
      title: '填报日期',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: '填报人',
      dataIndex: 'person',
      key: 'person',
    },
  ];

  const selectOnchage = (data) => {
    switch (data) {
      case '软件运维周报':
        router.push({
          pathname:`/ITSM/operationreport/weeklyreport/softreport/`,
          query:{
            type:'month'
          }
        })
        break;
      case '机房运维周报':
        router.push({
          pathname:`/ITSM/operationreport/weeklyreport/computerroomreport`,
          query:{
            type:'month'
          }
        })
        break;
      case '数据库运维周报':
        router.push({
          pathname:'/ITSM/operationreport/weeklyreport/databasereport',
          query:{
            type:'month'
          }
        })
        break;
      case '其他运维周报':
        router.push({
          pathname:'/ITSM/operationreport/weeklyreport/otherreport',
          query:{
            type:'month'
          }
        })
        break;
      default:
        break;
    }
  }

  const menu = (
    <Menu>
      <Menu.Item>
        <span onClick={()=> selectOnchage('软件运维周报')}>
          软件运维周报
        </span>
      </Menu.Item>
      <Menu.Item>
      <span onClick={()=> selectOnchage('机房运维周报')}>
      机房运维周报
        </span>
      </Menu.Item>
      <Menu.Item>
      <span onClick={()=> selectOnchage('数据库运维周报')}>
      数据库运维周报
        </span>
      </Menu.Item>
      <Menu.Item>
      <span onClick={()=> selectOnchage('其他运维周报')}>
      其他运维周报
        </span>
      </Menu.Item>
    </Menu>
  );

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

  const download = () => {
    validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'problemmanage/besolvedownload',
          payload: { ...values }
        }).then(res => {
          const filename = `下载.xls`;
          const blob = new Blob([res]);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        })
      }
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



  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card>
        <Row gutter={16}>
          <Form {...formItemLayout}>
            <Col span={8}>
              <Form.Item label="周报名称">
                {getFieldDecorator('no', {
                  rules: [
                    {
                      message: '请输入问题编号',
                    },
                  ],
                })(<Input placeholder='请输入' allowClear />)}
              </Form.Item>
            </Col>

            <Col span={7}>
              <Form.Item label='填报日期'>
                {getFieldDecorator('time1', {
                  initialValue: starttime ? moment(starttime) : ''
                })(
                  <DatePicker
                    allowClear={false}
                    disabledDate={startdisabledDate}
                    onChange={onChange}
                  />
                )
                }
              </Form.Item>
            </Col>

            <Col span={1}>
              <p style={{ marginTop: 5 }}>-</p>
            </Col>



            <Col span={8}>
              <Form.Item label=''>
                {
                  getFieldDecorator('time2', {
                    initialValue: endTime ? moment(endTime) : ''
                  })
                    (<DatePicker
                      allowClear={false}
                      disabledDate={enddisabledDate}
                      onChange={endonChange}
                    />)
                }
              </Form.Item>
            </Col>

            {expand === true && (
              <>
                <Col span={8}>
                  <Form.Item label="填报人" >
                    {getFieldDecorator('person', {})(<Input placeholder='请输入' allowClear />)}
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

        <div>
          <Dropdown
            overlay={menu}
            placement="bottomLeft"
          >
            <Button type='primary'>新建</Button>
          </Dropdown>

          <Button
            style={{ marginLeft: 8 }}
            type="primary"
          // onClick={() => download()}
          >
            编辑
        </Button>

          <Button
            style={{ marginLeft: 8 }}
            type="primary"
          // onClick={() => download()}
          >
            复制
        </Button>

          <Button
            style={{ marginLeft: 8 }}
            type="primary"
          // onClick={() => download()}
          >
            粘贴
        </Button>

          <Button
            style={{ marginLeft: 8 }}
            type="primary"
            onClick={handleDelete}
          >
            删除
        </Button>

          <Button
            style={{ marginLeft: 8 }}
            type="primary"
            onClick={() => download()}
          >
            导出数据
        </Button>

        </div>

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
  }))(MymonthlyReport),
);