import React, { useEffect, useState, createContext } from 'react';
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
  Icon,
  Badge
} from 'antd';
import router from 'umi/router';
import moment from 'moment';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SysDict from '@/components/SysDict';
import CheckModel from './components/CheckModel';
import Back from './components/Back';

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
const statusMap = ['green', 'gold', 'red'];
const status = ['0', '1', '2'];
const statusContent = ['未超时', '即将超时', '已超时'];


function OperationplanCheck(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, resetFields, validateFields, setFieldsValue },
    dispatch,
    myTaskplanlist,
    userinfo,
    operationPersonArr,
    loading,
  } = props;
  let operationPersonSelect;

  const [expand, setExpand] = useState(false);
  const [paginations, setPaginations] = useState({ current: 0, pageSize: 10 });
  const [selectdata, setSelectData] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [visible, setVisible] = useState(false);
  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表
  let formThead;

  const gotoDetail = (record) => {
    router.push({
      pathname: `/ITSM/operationplan/operationplanform`,
      query: {
        auditLink: true,
        checkStatus: record.checkStatus,
        mainId: record.mainId,
      }
    })
  };

  const initialColumns = [
    // {
    //   title: '序号',
    //   dataIndex: 'index',
    //   key: 'index',
    //   width: 100,
    //   render: (text, record, index) =>
    //     `${(paginations.current) * paginations.pageSize + (index + 1)}`,
    // },
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
      render: (text, record) => (
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

  // 处理作业负责人数据
  if (operationPersonArr.length) {
    operationPersonSelect = operationPersonArr.map(item => {
      return {
        key: item.id,
        value: item.userName
      }
    })
  }


  const queryDept = () => {
    dispatch({
      type: 'itsmuser/fetchuser',
    });
  };


  const defaultAllkey = columns.map(item => {
    return item.title
  });

  const getTobolist = () => {
    dispatch({
      type: 'processmodel/myTasklist',
      payload: {
        flowNodeName: '计划审核',
        pageIndex: paginations.current,
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
      type: 'processmodel/myTasklist',
      payload: {
        flowNodeName: '计划审核',
        ...values,
        addTime: '',
        pageIndex: page - 1,
        pageSize
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
        flowNodeName: '计划审核',
        time1: values.addTime?.length ? moment(values.addTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
        time2: values.addTime?.length ? moment(values.addTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
        checkTime: values.checkTime ? moment(values.checkTime).format('YYYY-MM-DD HH:mm:ss') : '',
        executeOperationTime: values.executeOperationTime ? moment(values.executeOperationTime).format('YYYY-MM-DD HH:mm:ss') : '',
        plannedStartTime: values.plannedStartTime ? moment(values.plannedStartTime).format('YYYY-MM-DD HH:mm:ss') : '',
        plannedEndTime: values.plannedEndTime ? moment(values.plannedEndTime).format('YYYY-MM-DD HH:mm:ss') : '',
        startTime: values.startTime ? moment(values.startTime).format('YYYY-MM-DD HH:mm:ss') : '',
        endTime: values.endTime ? moment(values.endTime).format('YYYY-MM-DD HH:mm:ss') : '',
        addTime: '',
      }

      searchdata(searchParams, 1, paginations.pageSize);
    });
  };


  const exportDownload = () => {
    const exportColumns = columns.map(function (item) {
      return {
        column: item.dataIndex,
        field: item.title
      }
    })
    validateFields((err, values) => {
      dispatch({
        type: 'processmodel/downloadMyOperationExcel',
        payload: {
          flowNodeName: '计划审核',
          columns: JSON.stringify(exportColumns),
          ...values,
          checkTime: values.checkTime ? moment(values.checkTime).format('YYYY-MM-DD HH:mm:ss') : '',
          executeOperationTime: values.executeOperationTime ? moment(values.executeOperationTime).format('YYYY-MM-DD HH:mm:ss') : '',
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
    onChange: (index, selectedRows) => {
      setSelectedRows([...selectedRows])
    }
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
            <a onClick={() => gotoDetail(record)}>{text}</a>
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
  const checkResult = getTypebyTitle('审核结果');
  const taskCompany = getTypebyTitle('作业单位');

  //  获取作业负责人
  const getoperationPerson = () => {
    dispatch({
      type: 'processmodel/operationPerson',
    });
  }

  // 处理作业负责人数据
  if (operationPersonArr.length) {
    operationPersonSelect = operationPersonArr.map(item => {
      return {
        key: item.id,
        value: item.userName
      }
    })
  }

  useEffect(() => {
    queryDept();
    getoperationPerson();
    getTobolist();
    setColumns(initialColumns)
  }, []);

  const handleClick = () => {
    console.log(1);
  }

  const checkSubmit = (value) => {
    const allmainId = selectedRows.map(obj => {
      return obj.mainId
    });
    console.log(allmainId)

    const allcheckId = selectedRows.map(obj => {
      return obj.id
    });
    console.log(allcheckId)
    dispatch({
      type: 'processmodel/batchCheck',
      payload: {
        ...value,
        mainIds: allmainId.toString(),
        flowNodeName: '计划审核',
        check_id: allcheckId.toString(),
        editState: 'edit',
        check_checkUserId: userinfo.userId,
        check_checkTime: (value.check_checkTime).format('YYYY-MM-DD HH:mm:ss'),
      },
    }).then(res => {
      if (res.code === 200) {
        message.info(res.msg);
        getTobolist();
      } else {
        getTobolist();
        message.error(res.msg);
      }
    });
  }


  // const reasonSubmit = values => {
  //   dispatch({
  //     type: 'processmodel/fallback',
  //     payload: {
  //       mainIds: mainId,
  //       ...values,
  //     },
  //   }).then(res => {
  //     if (res.code === 200) {
  //       message.info(res.msg);
  //       router.push(`/ITSM/operationplan/operationplancheck`)
  //     } else {
  //       message.error(res.msg);
  //     }
  //   });
  // };

  const handleBack = () => {

    if (selectedRows.length !== 1) {
      message.info('请选择一条数据')
      // event.preventDefault();
      return false;
    }

    const backJudge = selectedRows.every(item => {
      if (item.checkResult !== null) {
        message.info('请选择未保存过的单子');
        return false;
      }

      if (item.checkResult === null) {
        return true
      }
    })


    if (backJudge === false) {
      return false;
    }

    if (backJudge === true) {
      setVisible(true)
    }
  }

  const reasonSubmit = values => {
    const ids = selectedRows.map(item => {
      return item.id
    })
    dispatch({
      type: 'processmodel/fallback',
      payload: {
        mainIds: ids.toString(),
        ...values,
      },
    }).then(res => {
      if (res.code === 200) {
        message.info(res.msg);
        getTobolist();
      } else {
        message.error(res.msg);
        getTobolist();
      }
    });
  };
  const pagination = {
    showSizeChanger: true,
    onShowSizeChange: (page, pageSize) => onShowSizeChange(page, pageSize),
    current: paginations.current,
    pageSize: paginations.pageSize,
    total: myTaskplanlist.total,
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
                        </Select>)}</Form.Item>
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
                  <Form.Item label="执行状态">
                    {getFieldDecorator('executeStatus', {
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
                    {getFieldDecorator('status', {})
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
                    {getFieldDecorator('executeOperationTime', {
                    })
                      (<DatePicker
                        format="YYYY-MM-DD HH:mm:ss"
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
                    {getFieldDecorator('addUnit', {})
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
                          format="YYYY-MM-DD HH:mm:ss"
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
                      // initialValue: [moment(time1), moment(time2)] || [moment().startOf('month'), moment()],
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
        <div style={{ display: 'flex', flexDirection: 'row' }} >
          <CheckModel
            onClick={handleClick}
            userinfo={userinfo}
            selectedRows={selectedRows}
            checkSubmit={values => checkSubmit(values)}
          >
            <Button
              type="primary"
              style={{ marginRight: 8 }}
            //  onClick={handleClick}
            >
              审核
          </Button>
          </CheckModel>

          <Back
            selectedRows={selectedRows}
            reasonSubmit={values => reasonSubmit(values)}
          >
            <Button type="primary" style={{ marginRight: 8 }} onClick={handleBack}>
              回退
          </Button>
          </Back>


          <Button type="primary" style={{ marginRight: 8 }} onClick={exportDownload}>
            导出数据
          </Button>
        </div>

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


        <div />
        <Table
          loading={loading}
          columns={columns}
          dataSource={myTaskplanlist.rows}
          scroll={{ x: 1500 }}
          rowKey={record => record.id}
          rowSelection={rowSelection}
          pagination={pagination}
        />

        {/* <Back
          visible={visible}
          reasonSubmit={values => reasonSubmit(values)}
        /> */}

      </Card>

    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ processmodel, itsmuser, loading }) => ({
    myTaskplanlist: processmodel.myTaskplanlist,
    operationPersonArr: processmodel.operationPersonArr,
    userinfo: itsmuser.userinfo,
    loading: loading.models.processmodel,
  }))(OperationplanCheck),
);
