import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
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
  Popover,
  Checkbox,
  Icon,
  Badge
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

let startTime;
let endtime;
let actualStarttime;
let actualEndtime;
const statusMap = ['green', 'gold', 'red'];
const statusContent = ['未超时', '即将超时', '已超时'];

function TaskSearch(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, resetFields, validateFields, setFieldsValue },
    location: { query: { time1, time2, status, result, executeStatus, timeoutStatus, operationUser } },
    dispatch,
    queryList,
    operationPersonArr,
    loading,
  } = props;
  let operationPersonSelect;

  const [expand, setExpand] = useState(false);
  const [paginations, setPaginations] = useState({ current: 0, pageSize: 10 });
  const [selectdata, setSelectData] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [columns, setColumns] = useState([]);
  let formThead;

  // //  获取作业负责人
  const getoperationPerson = () => {
    dispatch({
      type: 'processmodel/operationPerson',
    });
  }

  // // 处理作业负责人数据
  if (operationPersonArr.length) {
    operationPersonSelect = operationPersonArr.map(item => {
      return {
        key: item.id,
        value: item.userName
      }
    })
  }
  //  打开查询详情页
  const gotoDetail = (record) => {
    router.push({
      pathname: `/ITSM/operationplan/operationplansearchdetail`,
      query: {
        mainId: record.mainId,
      }
    })
  };

  const initialColumns = [
    {
      title: '作业计划编号',
      dataIndex: 'operationNo',
      key: 'operationNo',
      width: 150,
      fixed: 'left',
      render: (text, record) => {
        return <a onClick={() => gotoDetail(record)}>{text}</a>
      },
    },
    {
      title: '填报时间',
      dataIndex: 'addTime',
      key: 'addTime',
      width: 150,

    },
    {
      title: '作业系统名称',
      dataIndex: 'systemName',
      key: 'systemName',
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
      dataIndex: 'timeoutStatus',
      key: 'timeoutStatus',
      width: 150,
      render: (text) => (
        <span>
          <Badge
            status={statusMap[statusContent.indexOf(text)]}
            text={text} />
        </span>
      ),
    },
    {
      title: '计划结束时间',
      dataIndex: 'plannedEndTime',
      key: 'plannedEndTime',
      width: 150,
    },
    {
      title: '作业状态',
      dataIndex: 'status',
      key: 'status',
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
      dataIndex: 'executeResult',
      key: 'executeResult',
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
      dataIndex: 'endTime',
      key: 'endTime',
      width: 150,
    },
    {
      title: '作业执行情况说明',
      dataIndex: 'executeContent',
      key: 'executeContent',
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
      dataIndex: 'checkResult',
      key: 'checkResult',
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
      dataIndex: 'checkContent',
      key: 'checkContent',
      width: 150,
    },
    {
      title: '超时信息',
      dataIndex: 'timeoutMsg',
      key: 'timeoutMsg',
      width: 150,
    },
    {
      title: '回退信息',
      dataIndex: 'fallbackMsg',
      key: 'fallbackMsg',
      width: 150,
    },
  ];

  const defaultAllkey = columns.map(item => {
    return item.title
  });

  const getTobolist = () => {
    dispatch({
      type: 'processmodel/getOperationQueryList',
      payload: {
        time1,
        time2,
        status,
        result,
        executeStatus,
        timeoutStatus,
        operationUser,
        pageIndex: paginations.current,
        pageSize: paginations.pageSize,
      },
    });
  };

  const handleReset = () => {
    resetFields();
  };

  const searchdata = (values, page, pageSize) => {
    dispatch({
      type: 'processmodel/getOperationQueryList',
      payload: {
        ...values,
        status: values.status ? values.status : status,
        result: values.result ? values.result : result,
        executeStatus: values.executeStatus ? values.executeStatus : executeStatus,
        timeoutStatus: values.timeoutStatus ? values.timeoutStatus : timeoutStatus,
        operationUser: values.operationUser ? values.operationUser : operationUser,
        time1: values.addTime?.length ? moment(values.addTime[0]).format('YYYY-MM-DD HH:mm:ss') : time1,
        time2: values.addTime?.length ? moment(values.addTime[1]).format('YYYY-MM-DD HH:mm:ss') : time2,
        checkTime: values.checkTime ? moment(values.checkTime).format('YYYY-MM-DD HH:mm:ss') : '',
        executeOperationTime: values.executeOperationTime ? moment(values.executeOperationTime).format('YYYY-MM-DD HH:mm:ss') : '',
        plannedStartTime: values.plannedStartTime ? moment(values.plannedStartTime).format('YYYY-MM-DD HH:mm:ss') : '',
        plannedEndTime: values.plannedEndTime ? moment(values.plannedEndTime).format('YYYY-MM-DD HH:mm:ss') : '',
        startTime: values.startTime ? moment(values.startTime).format('YYYY-MM-DD HH:mm:ss') : '',
        endTime: values.endTime ? moment(values.endTime).format('YYYY-MM-DD HH:mm:ss') : '',
        pageIndex: page - 1,
        pageSize,
        addTime: ''
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
  // 查询
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
        checkTime: values.checkTime ? moment(values.checkTime).format('YYYY-MM-DD HH:mm:ss') : '',
        operationTime: values.operationTime ? moment(values.operationTime).format('YYYY-MM-DD HH:mm:ss') : '',
        plannedStarTtime: values.plannedStarTtime ? moment(values.plannedStarTtime).format('YYYY-MM-DD HH:mm:ss') : '',
        plannedEndTime: values.plannedEndTime ? moment(values.plannedEndTime).format('YYYY-MM-DD HH:mm:ss') : '',
        startTime: values.startTime ? moment(values.startTime).format('YYYY-MM-DD HH:mm:ss') : '',
        endTime: values.endTime ? moment(values.endTime).format('YYYY-MM-DD HH:mm:ss') : '',
        addTime: '',
      }
      searchdata(searchParams, 1, paginations.pageSize);
    });
  };

  //  导出
  const exportDownload = () => {
    const exportColumns = columns.map(item => {
      return {
        column: item.dataIndex,
        field: item.title
      }
    })
    validateFields((err, values) => {
      dispatch({
        type: 'processmodel/downloadQueryExcel',
        payload: {
          columns: JSON.stringify(exportColumns),
          ...values,
          status: values.status ? values.status : status,
          result: values.result ? values.result : result,
          executeStatus: values.executeStatus ? values.executeStatus : executeStatus,
          timeoutStatus: values.timeoutStatus ? values.timeoutStatus : timeoutStatus,
          checkTime: values.checkTime ? moment(values.checkTime).format('YYYY-MM-DD HH:mm:ss') : '',
          operationTime: values.operationTime ? moment(values.operationTime).format('YYYY-MM-DD HH:mm:ss') : '',
          plannedStartTime: values.plannedStartTime ? moment(values.plannedStartTime).format('YYYY-MM-DD HH:mm:ss') : '',
          plannedEndTime: values.plannedEndTime ? moment(values.plannedEndTime).format('YYYY-MM-DD HH:mm:ss') : '',
          startTime: values.startTime ? moment(values.startTime).format('YYYY-MM-DD HH:mm:ss') : '',
          endTime: values.endTime ? moment(values.endTime).format('YYYY-MM-DD HH:mm:ss') : '',
          addTime: '',
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
    onChange: (index, handleSelect) => {
      setSelectedRows([...handleSelect])
    }
  }

  //  自定义列表
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
            <a onClick={() => gotoDetail(record)}>{text}</a>
          )
        }
        obj.fixed = 'left'
      }
      initialColumns.push(obj);
      setColumns(initialColumns);
      return null;
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

  //  计划开始时间和实际结束开始时间  
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

  //  计划结束时间和实际结束时间 
  const endtimeonChange = (dateString, params) => {
    if (params === 'plan') {
      setFieldsValue({ plannedEndTime: moment(dateString) })
      endtime = dateString;
    } else {
      setFieldsValue({ endTime: moment(dateString) })
      actualEndtime = dateString;
    }
  }

  //  计划开始时间、实际开始时间
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
    return null;
  }

  //  计划实际结束时间、实际结束时间
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
    return null;
  }


  const getTypebyTitle = title => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.title === title)[0].children;
    }
    return [];
  };

  const executeStatusselect = getTypebyTitle('执行状态');
  const taskType = getTypebyTitle('作业类型');
  const taskNature = getTypebyTitle('作业性质');
  const taskBilling = getTypebyTitle('是否开票');
  const checkStatus = getTypebyTitle('审核状态');
  const timeoutStatusselect = getTypebyTitle('超时状态');
  const taskResult = getTypebyTitle('作业结果');
  const checkResult = getTypebyTitle('审核结果');
  const taskCompany = getTypebyTitle('作业单位');

  useEffect(() => {
    getTobolist();
    getoperationPerson();
    setColumns(initialColumns)
  }, []);

  const pagination = {
    showSizeChanger: true,
    onShowSizeChange: (page, pageSize) => onShowSizeChange(page, pageSize),
    current: paginations.current,
    pageSize: paginations.pageSize,
    total: queryList.total,
    showTotal: total => `总共  ${total}  条记录`,
    onChange: (page) => changePage(page),
  };

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
              <Form.Item label="作业系统名称">
                {getFieldDecorator('systemName', {})(

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
                        <Select
                          placeholder="请选择"
                          allowClear
                        >
                          {taskCompany.map(obj => [
                            <Option key={obj.key} value={obj.title}>
                              {obj.title}
                            </Option>,
                          ])}
                        </Select>,
                      )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="作业负责人">
                    {getFieldDecorator('operationUser', {})
                      (
                        <Select>
                          {operationPersonSelect.map(obj => [
                            <Option key={obj.key} value={obj.value}>
                              {obj.value}
                            </Option>
                          ])}

                        </Select>
                      )}</Form.Item>
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
                    {getFieldDecorator('plannedStartTime', {
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
                  <Form.Item label="作业状态">
                    {getFieldDecorator('status', {
                    })
                      (
                        <Select placeholder="请选择" allowClear>
                          {executeStatusselect.map(obj => [
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
                    {getFieldDecorator('checkStatus', {
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
                    {getFieldDecorator('timeoutStatus', {})
                      (
                        <Select placeholder="请选择" allowClear>
                          {timeoutStatusselect.map(obj => [
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
                    {getFieldDecorator('executeResult', {})
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
                    {getFieldDecorator('executeContent', {})
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
                      (<DatePicker
                        showTime
                        allowClear />)}
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
                    {getFieldDecorator('operationUnit', {})
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
                    {getFieldDecorator('checkResult', {})
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
                        (<DatePicker
                          showTime
                          allowClear />)
                      )}
                  </Form.Item>
                </Col>
              </>
            )}

            {expand === true && (
              <>
                <Col span={8}>
                  <Form.Item label="审核说明">
                    {getFieldDecorator('checkContent', {
                    })
                      (<Input allowClear />)
                    }
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="填报时间">
                    {getFieldDecorator('addTime', {
                      // initialValue: [moment(time1), moment(time2)] || [''],
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

        <Button type="primary" style={{ marginRight: 8 }} onClick={exportDownload}>
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
                  defaultValue={columns}
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


        <div />
        <Table
          loading={loading}
          columns={columns}
          dataSource={queryList.rows}
          scroll={{ x: 1500 }}
          rowKey={record => record.id}
          rowSelection={rowSelection}
          pagination={pagination}
        />
      </Card>

    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ processmodel, loading }) => ({
    queryList: processmodel.queryList,
    operationPersonArr: processmodel.operationPersonArr,
    loading: loading.models.processmodel,
  }))(TaskSearch),
);
