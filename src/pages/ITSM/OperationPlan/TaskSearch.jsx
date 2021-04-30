import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
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
  Tree,
  Popover,
  Checkbox,
  Icon
} from 'antd';
import router from 'umi/router';
import moment from 'moment';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SysDict from '@/components/SysDict';

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

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TreeNode } = Tree;

let startTime;
let endtime;
let actualStarttime;
let actualEndtime;

function TaskSearch(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, resetFields, validateFields, setFieldsValue },
    dispatch,
    myTaskplanlist,
    loading,
  } = props;
  const [expand, setExpand] = useState(false);
  const [paginations, setPaginations] = useState({ current: 1, pageSize: 10 });
  const [selectdata, setSelectData] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表
  let formThead;
  const initialColumns = [
    // {
    //   title: '序号',
    //   dataIndex: 'index',
    //   key: 'index',
    //   width: 100,
    //   render: (text, record, index) =>
    //     `${(paginations.current - 1) * paginations.pageSize + (index + 1)}`,
    // },
    {
      title: '作业计划编号',
      dataIndex: 'operationNo',
      key: 'operationNo',
      width: 150,
      fixed: 'left',
      render: (text, record) => (
        <Link
          to={{
            pathname: `/ITSM/operationplan/operationplanform/${record.operationNo}/${record.timeoutStatus}/${record.checkStatus}/list`,
          }}
        >
          {text}
        </Link>
      ),
    },
    {
      title: '填报时间',
      dataIndex: 'addTime',
      key: 'addTime',
      width: 150,

    },
    {
      title: '作业系统名称',
      dataIndex: 'system',
      key: 'system',
      width: 150,
    },
    {
      title: '问题来源',
      dataIndex: 'sourcecn',
      key: 'sourcecn',
      width: 150,
    },
    {
      title: '作业类型',
      dataIndex: 'type',
      key: 'type',
      width: 150,
    },
    {
      title: '作业性质',
      dataIndex: 'nature',
      key: 'nature',
      width: 150,
    },
    {
      title: '作业单位',
      dataIndex: 'operationUnit',
      key: 'operationUnit',
      width: 150,
    },
    {
      title: '作业负责人',
      dataIndex: 'operationUser',
      key: 'operationUser',
      width: 150,
    },
    {
      title: '作业对象',
      dataIndex: 'object',
      key: 'object',
      width: 150,
    },
    {
      title: '作业内容',
      dataIndex: 'content',
      key: 'content',
      width: 150,
    },
    {
      title: '超时状态',
      dataIndex: 'status',
      key: 'status',
      width: 150,
    },
    {
      title: '计划结束时间',
      dataIndex: 'plannedEndTime',
      key: 'plannedEndTime',
      width: 150,
    },
    {
      title: '执行状态',
      dataIndex: 'timeoutStatus',
      key: 'timeoutStatus',
      width: 150,
    },
    {
      title: '审核状态',
      dataIndex: 'checkStatus',
      key: 'checkStatus',
      width: 150,
    },
    {
      title: '是否开票',
      dataIndex: 'billing',
      key: 'billing',
      width: 150,
    },
    {
      title: '作业结果',
      dataIndex: 'result',
      key: 'result',
      width: 150,
    },
    {
      title: '实际开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
      width: 150,
    },
    {
      title: '实际结束时间',
      dataIndex: 'endStart',
      key: 'endStart',
      width: 150,
    },
    {
      title: '作业执行情况说明',
      dataIndex: 'contenttext',
      key: 'contenttext',
      width: 150,
    },
    {
      title: '执行操作时间',
      dataIndex: 'operationTime',
      key: 'operationTime',
      width: 150,
    },
    {
      title: '填报人',
      dataIndex: 'addUser',
      key: 'addUser',
      width: 150,
    },
    {
      title: '填报单位',
      dataIndex: 'addUnit',
      key: 'addUnit',
      width: 150,
    },
    {
      title: '审核人',
      dataIndex: 'checkUser',
      key: 'checkUser',
      width: 150,
    },
    {
      title: '审核结果',
      dataIndex: 'result2',
      key: 'result2',
      width: 150,
    },
    {
      title: '审核时间',
      dataIndex: 'checkTime',
      key: 'checkTime',
      width: 150,
    },
    {
      title: '审核说明',
      dataIndex: 'checkcontent',
      key: 'checkcontent',
      width: 150,
    },
  ];

  const defaultAllkey = columns.map(item => {
    return item.title
  });

  const getTobolist = () => {
    dispatch({
      type: 'processmodel/myTasklist',
      payload: {
        pageNum: paginations.current,
        pageSize: paginations.pageSize,
      },
    });
  };

  // 上传删除附件触发保存
  useEffect(() => {
    if (files.ischange) {
      getTobolist();
    }
  }, [files]);

  const handleReset = () => {
    resetFields();
  };

  const searchdata = (values, page, pageSize) => {
    dispatch({
      type: 'problemmanage/searchBesolve',
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

  // const pagination = {
  //   showSizeChanger: true,
  //   onShowSizeChange: (page, pageSize) => onShowSizeChange(page, pageSize),
  //   current: paginations.current,
  //   pageSize: paginations.pageSize,
  //   total: besolveList.total,
  //   showTotal: total => `总共  ${total}  条记录`,
  //   onChange: (page) => changePage(page),
  // };
  const handleSearch = () => {
    setPaginations({
      ...paginations,
      current: 1,
    });
    validateFields((err, values) => {
      if (err) {
        return;
      }
      const searchParams = {
        ...values,
        time1: values.addTime?.length ? moment(values.addTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
        time2: values.addTime?.length ? moment(values.addTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
        checkTime: values.addTime?moment(values.addTime).format('YYYY-MM-DD HH:mm:ss'):'',
        operationTime: values.operationTime?moment(values.operationTime).format('YYYY-MM-DD HH:mm:ss'):'',
        plannedStarTtime: values.plannedStarTtime?moment(values.plannedStarTtime).format('YYYY-MM-DD HH:mm:ss'):'',
        plannedEndTime: values.plannedEndTime?moment(values.plannedEndTime).format('YYYY-MM-DD HH:mm:ss'):'',
        startTime: values.startTime?moment(values.startTime).format('YYYY-MM-DD HH:mm:ss'):'',
        endTime: values.endTime?moment(values.endTime).format('YYYY-MM-DD HH:mm:ss'):'',
      }
      searchdata(searchParams, paginations.current, paginations.pageSize);
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

  const exportDownload = () => {
    dispatch({
      type: 'problemmanage/exportdownloadExcel',
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

  const rowSelection = {
    onChange: (index, selectedRows) => {
      setSelectedRows([...selectedRows])
    }
  }

  const handleCheck = () => {

    if (selectedRows.length < 1) {
      message.info('请选择一条数据')
      // event.preventDefault();
      return false;
    }
    const res = selectedRows.every(item => {
      if (item.timeoutStatus === '待审核') {
        return item.id;
      }
      message.info('请选择审核状态:待审核');
      return false
    })

    if (res === false) {
      // event.preventDefault();
      return false;
    }

    router.push({
      pathname: `/ITSM/operationplan/operationplanform/${selectedRows[0].operationNo}/作业计划执行`,
    });

    //   router.push({pathname:`/ITSM/operationplan/operationplanform/${selectedRows[0].operationNo}`,
    //   match:{ 
    //     id:selectedRows[0].operationNo,
    //     title:'作业计划执行'
    //   }
    // });

    // return dispatch({
    //   type: 'processmodel/myTasklist',
    //   payload: ids
    // }).then(res => {
    //   if (res.code === 200) {
    //     message.info(res.msg);
    //   } else {
    //     message.info(res.msg);
    //   }
    // })
  }

  const handleDelay = () => {
    if (selectedRows.length !== 1) {
      message.info('请选择一条数据')
      // event.preventDefault();
      return false;
    }


    const res = selectedRows.map(item => {
      return item.id;
    })

    router.push({
      pathname: `/ITSM/operationplan/operationplanform/${selectedRows[0].operationNo}/作业计划延期`,
    });
    // return dispatch({
    //   type: 'processmodel/myTasklist',
    //   payload: ids
    // }).then(res => {
    //   if (res.code === 200) {
    //     message.info(res.msg);
    //   } else {
    //     message.info(res.msg);
    //   }
    // })
  }

  const handleDelete = () => {
    const res = selectedRows.every(item => {
      if (item.timeoutStatus === '已延期') {
        return item.id;
      }
      message.info('请选择执行状态:已延期');
      return false
    })

    if (res === false) {
      return false;
    }
    // return dispatch({
    //   type: 'processmodel/myTasklist',
    //   payload: ids
    // }).then(res => {
    //   if (res.code === 200) {
    //     message.info(res.msg);
    //   } else {
    //     message.info(res.msg);
    //   }
    // })
  }

  const creataColumns = () => {
    // columns
    initialColumns.length = 0;
    formThead.map((val, key) => {
      const obj = {
        key: val.key,
        title: val.title,
        dataIndex: val.key,
        width: 150
      };
      if (key === 0) {
        obj.render = (text, record) => {
          return (
            <Link
              to={{
                pathname: `/ITSM/operationplan/operationplanform/${record.operationNo}`,
                // paneKey: record.status, // 传状态
              }}
            >
              {text}
            </Link>
          )
        }
        obj.fixed = 'left'
      }
      initialColumns.push(obj);
      setColumns(initialColumns);
    })
  }

  const onCheckAllChange = e => {
    setColumns(e.target.checked ? initialColumns : [])
  };

  const onCheck = (checkedValues) => {
    formThead = initialColumns.filter(i =>
      checkedValues.indexOf(i.title) >= 0
    );

    if (formThead.length === 0) {
      setColumns([])
    }
    creataColumns();
  };

  const onChange = (dateString, params) => {
    if (params === 'plan') {
      setFieldsValue({ plannedStarTtime: moment(dateString) })
      startTime = dateString;
    } else {
      setFieldsValue({ startTime: moment(dateString) })
      startTime = dateString;
      actualStarttime = dateString
    }

  }

  const endtimeonChange = (dateString, params) => {
    if (params === 'plan') {
      setFieldsValue({ plannedEndTime: moment(dateString) })
      endtime = dateString;
    } else {
      setFieldsValue({ endTime: moment(dateString) })
      actualEndtime = dateString;
    }

  }

  const startdisabledDate = (current, params) => {
    if (params === 'plan') {
      if (startTime || endtime) {
        return current > moment(endtime)
      }
    }
    if (params !== 'plan') {
      if (actualStarttime || actualEndtime) {
        return current > moment(actualEndtime)
      }
    }

  }

  const enddisabledDate = (current, params) => {
    if (params === 'plan') {
      if (startTime || endtime) {
        return current < moment(startTime)
      }
    }
    if (params !== 'plan') {
      if (actualStarttime || actualEndtime) {
        return current < moment(actualStarttime)
      }
    }
  }


  const customTreeNode = () => {
    return initialColumns.map(item => {
      return (
        <TreeNode
          title={item.title}
          key={item.key}
          disabled={item.title === '作业计划编号' ? true : ''} />
      )
    })
  }

  const getTypebyTitle = title => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.title === title)[0].children;
    }
    return [];
  };

  const executeStatus = getTypebyTitle('执行状态');
  const taskType = getTypebyTitle('作业类型');
  const taskNature = getTypebyTitle('作业性质');
  const taskBilling = getTypebyTitle('是否开票');
  const checkStatus = getTypebyTitle('审核状态');
  const timeoutStatus = getTypebyTitle('超时状态');
  const taskResult = getTypebyTitle('作业结果');
  const checkResult = getTypebyTitle('审核结果')

  useEffect(() => {
    getTobolist();
    setColumns(initialColumns)
  }, []);

  return (
    <PageHeaderWrapper title={pagetitle}>
      <SysDict
        typeid="1385513049263181825"
        commonid="1354288354950123522"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Card>

        <Row gutter={16}>
          <Form {...formItemLayout}>
            <Col span={8}>
              <Form.Item label="作业计划编号">
                {getFieldDecorator('operationNo', {})
                  (
                    <Input />
                  )}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="执行状态">
                {getFieldDecorator('status', {
                  rules: [
                    {
                      message: '请输入处理环节',
                    },
                  ],
                })(
                  <Select placeholder="请选择" allowClear>
                    {executeStatus.map(obj => [
                      <Option key={obj.key} value={obj.title}>
                        {obj.title}
                      </Option>,
                    ])}
                  </Select>,
                  <Input />
                )}
              </Form.Item>
            </Col>

            {expand === true && (
              <>
                <Col span={8}>
                  <Form.Item label="作业类型" >
                    {getFieldDecorator('type', {})
                      (
                        <Select placeholder="请选择" allowClear>
                          {taskType.map(obj => [
                            <Option key={obj.key} value={obj.title}>
                              {obj.title}
                            </Option>,
                          ])}
                        </Select>,
                      )}
                  </Form.Item>
                </Col>
              </>
            )}

            {expand === true && (
              <>
                <Col span={8}>
                  <Form.Item label="作业性质">
                    {getFieldDecorator('nature', {})
                      (
                        <Select placeholder="请选择" allowClear>
                          {taskNature.map(obj => [
                            <Option key={obj.key} value={obj.title}>
                              {obj.title}
                            </Option>,
                          ])}
                        </Select>,
                      )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="作业单位">
                    {getFieldDecorator('operationUnit', {})
                      (
                        <Input />
                      )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="作业负责人">
                    {getFieldDecorator('operationUser', {})
                      (<Input placeholder='请输入' allowClear />)}</Form.Item>
                </Col>
              </>
            )}

            {expand === true && (
              <>
                <Col span={8}>
                  <Form.Item label="是否开票">
                    {getFieldDecorator('billing', {})
                      (
                        <Select placeholder="请选择" allowClear>
                          {taskBilling.map(obj => [
                            <Option key={obj.key} value={obj.title}>
                              {obj.title}
                            </Option>,
                          ])}
                        </Select>,
                      )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="作业对象">
                    {getFieldDecorator('object', {})
                      (
                        <Input />
                      )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="作业内容">
                    {getFieldDecorator('content', {})
                      (
                        <Input />
                      )}
                  </Form.Item>
                </Col>
              </>
            )}
            {expand === true && (
              <>

                <Col span={8}>
                  <Form.Item label="计划开始时间">
                    {getFieldDecorator('plannedStarTtime', {
                      // initialValue: moment(new Date())
                    })
                      (
                        <DatePicker
                          showTime
                          onOk={(value1) => onChange(value1, 'plan')}
                          format="YYYY-MM-DD HH:mm:ss"
                          disabledDate={values => startdisabledDate(values, 'plan')}
                        />
                      )}
                  </Form.Item>
                </Col>


                <Col span={8}>
                  <Form.Item label="计划结束时间">
                    {getFieldDecorator('plannedEndTime', {
                    })
                      (
                        <DatePicker
                          showTime
                          onOk={(value1) => endtimeonChange(value1, 'plan')}
                          format="YYYY-MM-DD HH:mm:ss"
                          disabledDate={values => enddisabledDate(values, 'plan')}
                        />
                      )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="执行状态">
                    {getFieldDecorator('status', {
                    })
                      (
                        <Select placeholder="请选择" allowClear>
                          {executeStatus.map(obj => [
                            <Option key={obj.key} value={obj.title}>
                              {obj.title}
                            </Option>,
                          ])}
                        </Select>,
                      )}
                  </Form.Item>
                </Col>
              </>
            )}

            {expand === true && (
              <>
                <Col span={8}>
                  <Form.Item label="审核状态">
                    {getFieldDecorator('status', {
                    })
                      (
                        <Select placeholder="请选择" allowClear>
                          {checkStatus.map(obj => [
                            <Option key={obj.key} value={obj.title}>
                              {obj.title}
                            </Option>,
                          ])}
                        </Select>,
                      )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="超时状态">
                    {getFieldDecorator('timeout', {})
                      (
                        <Select placeholder="请选择" allowClear>
                          {timeoutStatus.map(obj => [
                            <Option key={obj.key} value={obj.title}>
                              {obj.title}
                            </Option>,
                          ])}
                        </Select>,
                      )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="作业结果">
                    {getFieldDecorator('result', {})
                      (
                        <Select placeholder="请选择" allowClear>
                          {taskResult.map(obj => [
                            <Option key={obj.key} value={obj.title}>
                              {obj.title}
                            </Option>,
                          ])}
                        </Select>,
                      )}
                  </Form.Item>
                </Col>
              </>
            )}

            {expand === true && (
              <>
                <Col span={8}>
                  <Form.Item label="实际开始时间">
                    {getFieldDecorator('startTime', {
                    })
                      (
                        <DatePicker
                          showTime
                          onOk={onChange}
                          format="YYYY-MM-DD HH:mm:ss"
                          disabledDate={startdisabledDate}
                        />
                      )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="实际结束时间">
                    {getFieldDecorator('endTime', {})
                      (
                        <DatePicker
                          showTime
                          onOk={endtimeonChange}
                          format="YYYY-MM-DD HH:mm:ss"
                          disabledDate={enddisabledDate}
                        />
                      )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="作业执行情况说明">
                    {getFieldDecorator('content', {})
                      (
                        <Input />
                      )}
                  </Form.Item>
                </Col>
              </>
            )}

            {expand === true && (
              <>
                <Col span={8}>
                  <Form.Item label="执行操作时间">
                    {getFieldDecorator('operationTime', {
                    })
                      (<DatePicker allowClear />)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="填报人">
                    {getFieldDecorator('addUser', {})
                      (
                        <Input />
                      )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="填报单位">
                    {getFieldDecorator('importance', {})
                      (
                        <Input />
                      )}
                  </Form.Item>
                </Col>
              </>
            )}

            {expand === true && (
              <>
                <Col span={8}>
                  <Form.Item label="审核人">
                    {getFieldDecorator('checkUser', {
                    })
                      (<Input allowClear />)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="审核结果">
                    {getFieldDecorator('result', {})
                      (
                        <Select placeholder="请选择" allowClear>
                          {checkResult.map(obj => [
                            <Option key={obj.key} value={obj.title}>
                              {obj.title}
                            </Option>,
                          ])}
                        </Select>,
                      )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="审核时间">
                    {getFieldDecorator('checkTime', {})
                      (
                        (<DatePicker allowClear />)
                      )}
                  </Form.Item>
                </Col>
              </>
            )}

            {expand === true && (
              <>
                <Col span={8}>
                  <Form.Item label="审核说明">
                    {getFieldDecorator('registerTime', {
                    })
                      (<Input allowClear />)
                    }
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="填报时间">
                    {getFieldDecorator('addTime', {
                    })(
                      <RangePicker
                        showTime
                        format='YYYY-MM-DD HH:mm:ss'
                        allowClear
                      />
                    )}
                  </Form.Item>
                </Col>



              </>
            )}

            {expand === false && (
              <Col span={8}>
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

        <Button type="primary" onClick={exportDownload}>
          导出数据
          </Button>

        <div style={{ textAlign: 'right', marginBottom: 8 }}>
          <Popover
            placement="bottomRight"
            trigger="click"
            // className={styles.dropdown}
            content={
              <>

                <div style={{ borderBottom: '1px solid #E9E9E9' }}>
                  <Checkbox
                    // indeterminate={this.state.indeterminate}
                    onChange={onCheckAllChange}
                    checked={columns.length === initialColumns.length === true}
                  >
                    列表展示
          </Checkbox>
                  <br />
                </div>

                <Checkbox.Group
                  onChange={onCheck}
                  value={defaultAllkey}
                  // className={styles.selsectMenu}
                  defaultValue={columns}
                // onChange={this.changeColumn}
                >
                  {initialColumns.map(item => (
                    <Col key={`item_${item.key}`} style={{ marginBottom: '8px' }}>
                      <Checkbox
                        value={item.title}
                        key={item.key}
                        checked={columns}
                      // disabled={item.disabled}
                      // className={styles.checkboxStyle}
                      >
                        {item.title}
                      </Checkbox>
                    </Col>
                  ))}

                </Checkbox.Group>
              </>

            }
          >
            <Button>
              <Icon type="setting" theme="filled" style={{ fontSize: '14px' }} />
            </Button>
          </Popover>


        </div>

        <Table
          loading={loading}
          columns={columns}
          dataSource={myTaskplanlist}
          scroll={{ x: 1500 }}
          rowKey={record => record.id}
          rowSelection={rowSelection}
        />
      </Card>

    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ processmodel, loading }) => ({
    myTaskplanlist: processmodel.myTaskplanlist,
    loading: loading.models.processmodel,
  }))(TaskSearch),
);
