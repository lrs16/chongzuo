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
import moment from 'moment';
import router from 'umi/router';

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

function MymonthlyReport(props) {
  const pagetitle = props.route.name;
  const {
    form: {
      getFieldDecorator,
      validateFields,
      setFieldsValue,
      resetFields
    },
    queryOrderlist,
    location,
    loading,
    dispatch,
  } = props;
  const [paginations, setPaginations] = useState({ current: 1, pageSize: 10 });
  const [selectdata, setSelectData] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [tabrecord, setTabRecord] = useState({});

  const columns = [
    {
      title: '月报类型',
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
      title: '月报名称',
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
        time1: values.plannedStartTime ? (values.plannedStartTime).startOf('month').format('YYYY-MM-DD') : '',
        time2: values.plannedStartTime ? (values.plannedStartTime).endOf('month').format('YYYY-MM-DD') : '',
        pageSize,
        pageIndex: page - 1,
      },
    });
    setTabRecord({
      ...values,
      timeType: '月报',
      userId: sessionStorage.getItem('userauthorityid'),
      plannedStartTime: '',
      time1: values.plannedStartTime ? (values.plannedStartTime).startOf('month').format('YYYY-MM-DD') : '',
      time2: values.plannedStartTime ? (values.plannedStartTime).endOf('month').format('YYYY-MM-DD') : '',
      paginations: {
        pageSize,
        current: page,
      }
    })
  };

  const handleReset = () => {
    router.push({
      pathname: location.pathname,
      query: {},
      state: {}
    });
    resetFields()
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
      searchdata(values, paginations.current, paginations.pageSize);
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

    return []
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
      localStorage.setItem('listId', selectedRows?.length ? selectedRows[0].id : '')
      localStorage.setItem('listreportType', selectedRows?.length ? selectedRows[0].type : '')
      message.info('复制成功')
    }

    return null
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
      const { time1 } = location.state.cacheinfo;
      setFieldsValue({
        plannedStartTime: time1 ? moment(time1) : ''
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
      // if (location.state.cacheinfo) {
      //   const { current, pageSize } = location.state.cacheinfo.paginations;
      //   setPaginations({ ...paginations, current, pageSize });
      // }
    }
  }, [location.state]);

  useEffect(() => {
    validateFields((err, value) => {
      searchdata(value, cacheinfo.paginations.current, cacheinfo.paginations.pageSize);
    })
  }, []);

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
                      initialValue: cacheinfo.name
                    })(<Input placeholder='请输入' allowClear />)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="月报分类">
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
                  <Form.Item label='填报日期'>
                    {getFieldDecorator('plannedStartTime', {
                      initialValue: ''
                    })(
                      <MonthPicker
                        style={{ width: '100%' }}
                      />
                    )
                    }
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="填报人" >
                    {getFieldDecorator('userName', {
                      initialValue: cacheinfo.userName
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
                  rowKey={records => records.id}
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