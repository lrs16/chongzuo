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

let startTime;
let endttime;
let actualStarttime;
let actualEndtime;
const statusMap = ['green', 'gold', 'red'];
const status = [0, 1, 2];
const statusContent = ['未超时', '即将超时', '已超时'];

function MyoperationPlan(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, resetFields, validateFields, setFieldsValue },
    dispatch,
    myTaskplanlist,
    loading,
  } = props;

  //  选人组件
  const [uservisible, setUserVisible] = useState(false); // 是否显示选人组件
  const [userchoice, setUserChoice] = useState(false); // 已经选择人员
  const [changorder, setChangeOrder] = useState(undefined);

  const [expand, setExpand] = useState(false);
  const [paginations, setPaginations] = useState({ current: 0, pageSize: 10 });
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
            status={statusMap[status.indexOf(text)]}
            text={statusContent[status.indexOf(text)]} />
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
      dataIndex: 'content',
      key: 'content',
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
  };

  const searchdata = (values, page, pageSize) => {
    dispatch({
      type: 'processmodel/myTasklist',
      payload: {
        ...values,
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
      const searchParams = {
        ...values,
        // time1: values.addTime?.length ? moment(values.addTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
        // time2: values.addTime?.length ? moment(values.addTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
        checkTime: values.addTime ? moment(values.addTime).format('YYYY-MM-DD HH:mm:ss') : '',
        operationTime: values.operationTime ? moment(values.operationTime).format('YYYY-MM-DD HH:mm:ss') : '',
        plannedStarTtime: values.plannedStarTtime ? moment(values.plannedStarTtime).format('YYYY-MM-DD HH:mm:ss') : '',
        plannedEndTime: values.plannedEndTime ? moment(values.plannedEndTime).format('YYYY-MM-DD HH:mm:ss') : '',
        startTime: values.startTime ? moment(values.startTime).format('YYYY-MM-DD HH:mm:ss') : '',
        endTime: values.endTime ? moment(values.endTime).format('YYYY-MM-DD HH:mm:ss') : '',
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
          columns: JSON.stringify(exportColumns),
          ...values
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

  const handleDelay = () => {

    if (selectedRows.length !== 1) {
      message.info('请选择一条数据')
      // event.preventDefault();
      return false;
    }
    const res = selectedRows.every(item => {
      if (item.checkStatus === '延期中') {
        message.info('不可选执行状态:延期中');
        return false
      }

      if (item.checkStatus !== '延期中') {
        return true;
      }

    })


    if (res === false) {
      // event.preventDefault();
      return false;
    }

    if (true) {
      gotoDetail(selectedRows[0], 'delay')
    }


    // router.push({
    //   pathname: `/ITSM/operationplan/operationplanform/${selectedRows[0].operationNo}/${selectedRows[0].timeoutStatus}/${selectedRows[0].checkStatus}/button`,
    // });

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

  const handleCopy = () => {
    if (selectedRows.length !== 1) {
      message.info('请选择一条数据')
      // event.preventDefault();
      return false;
    }



    // router.push({
    //   pathname: `/ITSM/operationplan/operationplanform/${selectedRows[0].operationNo}/${selectedRows[0].timeoutStatus}/${selectedRows[0].checkStatus}/button`,
    // });

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



  const handleDelete = () => {
    if (selectedRows.length === 0) {
      message.info('至少选择一条数据')
      // event.preventDefault();
      return false;
    }

    const deleteJudge = selectedRows.every(item => {
      if (item.checkStatus !== null && item.checkStatus !== '待审核') {
        console.log(1)
        message.info('请选择审核状态:未审核');
        return false;
      }

      if (item.checkStatus === null || item.checkStatus === '待审核') {
        return true
      }
    })

    console.log(deleteJudge, 'deleteJudge')


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
      endttime = dateString;
    } else {
      setFieldsValue({ endTime: moment(dateString) })
      actualEndtime = dateString;
    }

  }

  const startdisabledDate = (current, params) => {
    if (params === 'plan') {
      if (startTime || endttime) {
        return current > moment(endttime)
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
      if (startTime || endttime) {
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
        message.info(message.msg);
        getTobolist()
      } else {
        message.error(res.msg);
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
    setUserVisible(true)
  }

  const executeStatus = getTypebyTitle('执行状态');
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
    setColumns(initialColumns)
  }, []);

  const handleFillin = () => {
    router.push({
      pathname: '/ITSM/operationplan/operationplanfillin',
      query: {
        mainId: selectedRows.length ? selectedRows[0].mainId : ''
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
          <Button type="primary" style={{ marginRight: 8 }} onClick={handleFillin}>
            填报
          </Button>

          <Button type="primary" style={{ marginRight: 8 }} onClick={handleCheck}>
            送审
          </Button>


          {/* <Button type="primary" style={{ marginRight: 8 }} onClick={handleExecute}>
            执行
          </Button> */}

          <Button type="primary" style={{ marginRight: 8 }} onClick={handleDelay}>
            延期
          </Button>

          <Button type="primary" style={{ marginRight: 8 }} onClick={handleCopy}>
            复制
          </Button>

          <Button type="primary" style={{ marginRight: 8 }} onClick={handleDelete}>
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
    loading: loading.models.processmodel,
  }))(MyoperationPlan),
);
