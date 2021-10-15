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

const { MonthPicker } = DatePicker;
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

let starttime = '';
let endTime = '';

function MymonthlyReport(props) {
  const pagetitle = props.route.name;
  const {
    form: {
      getFieldDecorator,
      resetFields,
      validateFields,
      setFieldsValue,
      getFieldsValue
    },
    queryOrderlist,
    location,
    loading,
    dispatch,
  } = props;
  const [expand, setExpand] = useState(false);
  const [paginations, setPaginations] = useState({ current: 1, pageSize: 10 });
  const [selectdata, setSelectData] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);

  const columns = [
    {
      title: '周报类型',
      dataIndex: 'type',
      key: 'type',
      render: (text, record) => {
        const handleClick = () => {
          switch (text) {
            case '软件运维月报':
              router.push({
                pathname: `/ITSM/operationreport/monthlyreport/monthdetailSoft`,
                query: {
                  mainId: record.id,
                  reporttype: 'month',
                  orderNo: record.id,
                },
              });
              break;
            case '机房运维月报':
              router.push({
                pathname: `/ITSM/operationreport/monthlyreport/monthcomputerroomreportdetail`,
                query: {
                  mainId: record.id,
                  reporttype: 'month',
                  orderNo: record.id,
                },
              });
              break;
            case '数据库运维月报':
              router.push({
                pathname: `/ITSM/operationreport/monthlyreport/monthdatabasereportdetail`,
                query: {
                  mainId: record.id,
                  reporttype: 'month',
                  orderNo: record.id,
                },
              });
              break;
            case '其他运维月报':
              router.push({
                pathname: `/ITSM/operationreport/monthlyreport/monthotherreportdetail`,
                query: {
                  mainId: record.id,
                  reporttype: 'month',
                  orderNo: record.id,
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

  const selectOnchage = (data) => {
    switch (data) {
      case '软件运维月报':
        router.push({
          pathname: `/ITSM/operationreport/monthlyreport/monthsoftreport`,
          query: {
            reporttype: 'month',
            listreportType: selectedRows?.length ? selectedRows[0].type : '',
            listId: selectedRows?.length ? selectedRows[0].id : '',
            addtab: true,
          }
        })
        break;
      case '机房运维月报':
        router.push({
          pathname: `/ITSM/operationreport/monthlyreport/monthcomputerroomreport`,
          query: {
            reporttype: 'month',
            listreportType: selectedRows?.length ? selectedRows[0].type : '',
            listId: selectedRows?.length ? selectedRows[0].id : '',
            addtab: true,
          }
        })
        break;
      case '数据库运维月报':
        router.push({
          pathname: `/ITSM/operationreport/monthlyreport/monthdatabasereport`,
          query: {
            reporttype: 'month',
            listreportType: selectedRows?.length ? selectedRows[0].type : '',
            listId: selectedRows?.length ? selectedRows[0].id : '',
            addtab: true,
          }
        })
        break;
      case '其他运维月报':
        router.push({
          pathname: `/ITSM/operationreport/monthlyreport/monthotherreport`,
          query: {
            reporttype: 'month',
            listreportType: selectedRows?.length ? selectedRows[0].type : '',
            listId: selectedRows?.length ? selectedRows[0].id : '',
            addtab: true,
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
        <span onClick={() => selectOnchage('软件运维月报')}>
          软件运维月报
        </span>
      </Menu.Item>
      <Menu.Item>
        <span onClick={() => selectOnchage('机房运维月报')}>
          机房运维月报
        </span>
      </Menu.Item>
      <Menu.Item>
        <span onClick={() => selectOnchage('数据库运维月报')}>
          数据库运维月报
        </span>
      </Menu.Item>
      <Menu.Item>
        <span onClick={() => selectOnchage('其他运维月报')}>
          其他运维月报
        </span>
      </Menu.Item>
    </Menu>
  );

  const searchdata = (values, page, pageSize) => {
    dispatch({
      type: 'softreport/queryList',
      payload: {
        ...values,
        timeType: '月报',
        userId: sessionStorage.getItem('userauthorityid'),
        plannedStartTime: '',
        time1: starttime,
        time2: endTime,
        pageSize,
        pageIndex: page - 1,
      },
    });
  };

  const handleReset = () => {
    resetFields();
    starttime = '';
    endTime = '';
    validateFields((err, value) => {
      searchdata(value, 1, paginations.pageSize);
    })
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
    onChange: (selected, selectedRow) => {
      setSelectedRows([...selectedRow])
    }
  }

  const handleDelete = () => {
    if (selectedRows.length) {
      const ids = selectedRows.map(item => {
        return item.id
      })

      return dispatch({
        type: 'softreport/deleteAll',
        payload: { ids }
      }).then(res => {
        message.info(res.msg);
        validateFields((err, value) => {
          searchdata(value, 1, paginations.pageSize);
        })
      })
    }

    if (!selectedRows.length) {
      message.info('至少选择一条数据');
    }
  }

  const onChange = (date, dateString) => {
    starttime = date.startOf('month').format('YYYY-MM-DD');
    endTime = date.endOf('month').format('YYYY-MM-DD');
  }

  const handleCopy = () => {
    if (selectedRows.length !== 1) {
      message.info('请选择一条数据')
      return false;
    }

    if (selectedRows.length > 1) {
      message.info('只能选择一条数据复制哦')
      return false;
    }

    if (selectedRows.length === 1) {
      message.info('复制成功')
    }

    return null
  }

  useEffect(() => {
    validateFields((err, value) => {
      searchdata(value, 1, paginations.pageSize);
    })
  }, []);

  useEffect(() => {
    if (location.state && location.state.reset) {
      handleReset();
      const formdata = getFieldsValue()
      searchdata(formdata, 1, 15)
    }
  }, [location.state]);

  const getTypebyTitle = title => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.title === title)[0].children;
    }
    return [];
  }

  const classData = getTypebyTitle('月报分类')

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
                  <Form.Item label="月报名称">
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
                  <Form.Item label="月报分类">
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
                  <Form.Item label='填报日期'>
                    {getFieldDecorator('plannedStartTime', {
                      initialValue: ''
                    })(
                      <MonthPicker
                        style={{ width: '100%' }}
                        onChange={onChange}
                      />
                    )
                    }
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="填报人" >
                    {getFieldDecorator('userName', {
                      initialValue: ''
                    })(<Input placeholder='请输入' allowClear />)}
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

            <div style={{ marginBottom: '10px' }}>
              <Dropdown
                overlay={menu}
                placement="bottomLeft"
              >
                <Button type='primary'>新建</Button>
              </Dropdown>

              <Button
                style={{ marginLeft: 8 }}
                type="primary"
                onClick={handleCopy}
              >
                复制
              </Button>

              <Button
                style={{ marginLeft: 8 }}
                type="danger"
                ghost
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

            {
              loading === false && (
                <Table
                  loading={loading}
                  columns={columns}
                  dataSource={queryOrderlist.rows}
                  rowKey={record => record.id}
                  pagination={pagination}
                  rowSelection={rowSelection}
                />
              )
            }

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
  }))(MymonthlyReport),
);