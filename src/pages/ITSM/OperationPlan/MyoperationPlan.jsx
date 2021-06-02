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
  message,
  Tree,
  Popover,
  Checkbox,
  Icon,
  Badge
} from 'antd';
import router from 'umi/router';
import User from '@/components/SelectUser/User';
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

let searchParams;
const statusMap = ['green', 'gold', 'red'];
const statusContent = ['未超时', '即将超时', '已超时'];

function MyoperationPlan(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, resetFields, validateFields, setFieldsValue },
    dispatch,
    myTaskplanlist,
    operationPersonArr,
    loading,
  } = props;
  let operationPersonSelect;

  //  选人组件
  const [uservisible, setUserVisible] = useState(false); // 是否显示选人组件
  const [userchoice, setUserChoice] = useState(false); // 已经选择人员
  const [changorder, setChangeOrder] = useState(undefined);

  const [expand, setExpand] = useState(false);
  const [paginations, setPaginations] = useState({ current: 0, pageSize: 15 });
  const [selectdata, setSelectData] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表
  let formThead;

  const gotoDetail = (record, delay) => {
    router.push({
      pathname: `/ITSM/operationplan/operationplanform`,
      query: {
        delay,
        mainId: record.mainId,
        status: record.status,
        checkStatus: record.checkStatus,
        orderNo: record.operationNo,
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
      title: '计划开始时间',
      dataIndex: 'plannedStartTime',
      key: 'plannedStartTime',
      width: 150,
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
      dataIndex: 'executeOperationTime',
      key: 'executeOperationTime',
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
      type: 'processmodel/myTasklist',
      payload: {
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
    dispatch({
      type: 'processmodel/myTasklist',
      payload: {
        pageIndex: 0,
        pageSize: paginations.pageSize,
      },
    })
  };

  const searchdata = (values, page, pageSize) => {
    dispatch({
      type: 'processmodel/myTasklist',
      payload: {
        ...values,
        time1: values.addTime?.length ? moment(values.addTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
        time2: values.addTime?.length ? moment(values.addTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
        checkTime1: values.checkTime?.length ? moment(values.checkTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
        checkTime2: values.checkTime?.length ? moment(values.checkTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
        checkTime: '',
        executeOperationTime1: values.executeOperationTime?.length ? moment(values.executeOperationTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
        executeOperationTime2: values.executeOperationTime?.length ? moment(values.executeOperationTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
        executeOperationTime: '',
        plannedStartTime1: values.plannedStartTime?.length ? moment(values.plannedStartTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
        plannedStartTime2: values.plannedStartTime?.length ? moment(values.plannedStartTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
        plannedStartTime: '',
        startTime1: values.startTime?.length ? moment(values.startTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
        startTime2: values.startTime?.length ? moment(values.startTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
        startTime: '',
        plannedEndTime1: values.plannedendTime?.length ? moment(values.plannedendTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
        plannedEndTime2: values.plannedendTime?.length ? moment(values.plannedendTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
        plannedendTime: '',
        endTime1: values.endTime?.length ? moment(values.endTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
        endTime2: values.endTime?.length ? moment(values.endTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
        endTime: '',
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
    total: myTaskplanlist.total,
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
      searchdata(values, 1, paginations.pageSize);
    });
  };

  const exportDownload = () => {
    const exportColumns = columns.map(item => {
      return {
        column: item.dataIndex,
        field: item.title
      }
    })
    validateFields((err, values) => {
      dispatch({
        type: 'processmodel/downloadMyOperationExcel',
        payload: {
          columns: JSON.stringify(exportColumns),
          ...values,
          time1: values.addTime?.length ? moment(values.addTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
          time2: values.addTime?.length ? moment(values.addTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
          checkTime1: values.checkTime?.length ? moment(values.checkTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
          checkTime2: values.checkTime?.length ? moment(values.checkTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
          checkTime: '',
          executeOperationTime1: values.executeOperationTime?.length ? moment(values.executeOperationTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
          executeOperationTime2: values.executeOperationTime?.length ? moment(values.executeOperationTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
          executeOperationTime: '',
          plannedStartTime1: values.plannedStartTime?.length ? moment(values.plannedStartTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
          plannedStartTime2: values.plannedStartTime?.length ? moment(values.plannedStartTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
          plannedStartTime: '',
          startTime1: values.startTime?.length ? moment(values.startTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
          startTime2: values.startTime?.length ? moment(values.startTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
          startTime: '',
          plannedEndTime1: values.plannedendTime?.length ? moment(values.plannedendTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
          plannedEndTime2: values.plannedendTime?.length ? moment(values.plannedendTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
          plannedendTime: '',
          endTime1: values.endTime?.length ? moment(values.endTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
          endTime2: values.endTime?.length ? moment(values.endTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
          endTime: '',
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

  const handleDelay = () => {

    if (selectedRows.length !== 1) {
      message.info('请选择一条数据')
      return false;
    }

    const res = selectedRows.every(item => {

      if (item.status !== '延期中' && item.checkStatus === '已审核') {
        return true
      }

      if ((item.status === '延期中') || item.checkStatus !== '已审核') {
        message.info('延期的条件为:执行状态不可以是延期中,且审核状态为:已审核');
        return false;
      }
      return null;

    })

    if (res === false) {
      return false;
    }

    if (res === true) {
      gotoDetail(selectedRows[0], 'delay')
    }

    return null;
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



  const handleDelete = () => {
    if (selectedRows.length === 0) {
      message.info('至少选择一条数据')
      return false;
    }

    const deleteJudge = selectedRows.every(item => {
      if (item.checkResult || item.fallbackMsg) {
        message.info('请选择审核状态:待送审，审核结果为空，回退信息为空');
        return false;
      }

      if (!item.checkResult && !item.fallbackMsg) {
        return true
      }

      return null;
    })


    if (deleteJudge === false) {
      return false;
    }

    if (deleteJudge === true) {
      const deleteIds = selectedRows.map(res => {
        return res.mainId
      })

      return dispatch({
        type: 'processmodel/taskDelete',
        payload: {
          mainIds: deleteIds.toString()
        }
      }).then(res => {
        if (res.code === 200) {
          message.info(res.msg);
          getTobolist();
        } else {
          message.info(res.msg);
          getTobolist();
        }
      })
    }

    return null;
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
      return null;
    }
    )
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

  const getTypebyTitle = title => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.title === title)[0].children;
    }
    return [];
  };

  const gotoCensorship = () => {
    const allmainId = selectedRows.map(obj => {
      return obj.mainId
    });
    return dispatch({
      type: 'processmodel/censorshipSubmit',
      payload: {
        mainIds: allmainId.toString(),
        userId: sessionStorage.getItem('NextflowUserId')
      }
    }).then(res => {
      if (res.code === 200) {
        message.info('送审成功');
        getTobolist()
      } else {
        message.error('送审失败');
        getTobolist()
      }
    })
  }

  //  送审选人
  useEffect(() => {
    if (userchoice) {
      gotoCensorship()
    }
  }, [userchoice])

  const handleCheck = () => {
    if (selectedRows.length === 0) {
      message.info('请选择要处理的数据');
      return false;
    }

    const checkJudge = selectedRows.every(item => {
      if (item.checkStatus !== '待送审') {
        message.info('请选择审核状态:待送审');
        return false;
      }

      if (item.checkStatus === '待送审') {
        return true
      }
      return null;
    })

    if (checkJudge) {
      setUserVisible(true)
    }

    return null;
  }

  const executeStatus = getTypebyTitle('作业状态');
  const taskType = getTypebyTitle('作业类型');
  const taskNature = getTypebyTitle('作业性质');
  const taskBilling = getTypebyTitle('是否开票');
  const checkStatus = getTypebyTitle('审核状态');
  const timeoutStatus = getTypebyTitle('超时状态');
  const taskResult = getTypebyTitle('作业结果');
  const checkResult = getTypebyTitle('审核结果');
  const taskCompany = getTypebyTitle('作业单位');

  useEffect(() => {
    sessionStorage.setItem('Processtype', 'task');
    getTobolist();
    getoperationPerson();
    setColumns(initialColumns)
  }, []);

  const handleFillin = () => {
    let allmainIds;
    if (selectedRows.length) {
      allmainIds = selectedRows.map(res => {
        return res.mainId
      })
    }

    router.push({
      pathname: '/ITSM/operationplan/operationplanfillin',
      query: {
        mainId: selectedRows.length ? allmainIds : ''
      }
    })
  }

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
                    <Input allowClear />
                  )}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="作业系统名称">
                {getFieldDecorator('systemName', {})(
                  <Input allowClear />
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
                        <Select allowClear>
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
                        <Input allowClear />
                      )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="作业内容">
                    {getFieldDecorator('content', {})
                      (
                        <Input allowClear />
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
                    })
                      (
                        <RangePicker
                          showTime
                          format="YYYY-MM-DD HH:mm:ss"
                        />
                      )}
                  </Form.Item>
                </Col>

                <Col span={16}>
                  <Form.Item label="计划结束时间">
                    {getFieldDecorator('plannedendTime', {
                    })
                      (
                        <RangePicker
                          showTime
                          format="YYYY-MM-DD HH:mm:ss"
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
                    {getFieldDecorator('timeoutStatus', {})
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

                <Col span={8}>
                  <Form.Item label="作业执行情况说明">
                    {getFieldDecorator('executeContent', {})
                      (
                        <Input allowClear />
                      )}
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
              </>
            )}

            {expand === true && (
              <>
                <Col span={8}>
                  <Form.Item label="实际开始时间">
                    {getFieldDecorator('startTime', {
                    })
                      (
                        <RangePicker
                          showTime
                          format="YYYY-MM-DD HH:mm:ss"
                        />
                      )}
                  </Form.Item>
                </Col>

                <Col span={16}>
                  <Form.Item label="实际结束时间">
                    {getFieldDecorator('endTime', {
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

            {expand === true && (
              <>
                <Col span={8}>
                  <Form.Item label="执行操作时间">
                    {getFieldDecorator('executeOperationTime', {
                    })
                      (<RangePicker
                        showTime
                        format="YYYY-MM-DD HH:mm:ss"
                        allowClear />)}
                  </Form.Item>
                </Col>


                <Col span={8}>
                  <Form.Item label="填报人">
                    {getFieldDecorator('addUser', {})
                      (
                        <Input allowClear />
                      )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="填报单位">
                    {getFieldDecorator('addUnit', {})
                      (
                        <Input allowClear />
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
                  <Form.Item label="审核时间">
                    {getFieldDecorator('checkTime', {})
                      (
                        (<RangePicker
                          showTime
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
          <Button type="primary" style={{ marginRight: 8 }} onClick={handleFillin}>
            填报
          </Button>

          <Button type="primary" style={{ marginRight: 8 }} onClick={handleCheck}>
            送审
          </Button>

          <Button type="primary" style={{ marginRight: 8 }} onClick={handleDelay}>
            延期
          </Button>

          <Button type="primary" style={{ marginRight: 8 }} onClick={handleCopy}>
            复制
          </Button>

          <Button
            type="danger"
            ghost
            style={{ marginRight: 8 }}
            onClick={handleDelete}
          >
            删除
          </Button>

          <Button type="primary" style={{ marginRight: 8 }} onClick={exportDownload}>
            导出数据
          </Button>
        </div>

        <div style={{ textAlign: 'right', marginBottom: 8 }}>
          <Popover
            placement="bottomRight"
            trigger="click"
            content={
              <>
                <div style={{ borderBottom: '1px solid #E9E9E9' }}>
                  <Checkbox
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
      </Card>

      {/* 选人组件 */}
      <User
        // taskId={id}
        visible={uservisible}
        ChangeUserVisible={v => setUserVisible(v)}
        changorder={changorder}
        ChangeChoice={v => setUserChoice(v)}
        ChangeType={() => 0}
      />
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ processmodel, loading }) => ({
    myTaskplanlist: processmodel.myTaskplanlist,
    operationPersonArr: processmodel.operationPersonArr,
    loading: loading.models.processmodel,
  }))(MyoperationPlan),
);
