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
  Badge,
  Tooltip,
  message
} from 'antd';
import router from 'umi/router';
import moment from 'moment';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SysDict from '@/components/SysDict';

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

const { Option } = Select;
const { RangePicker } = DatePicker;

const statusMap = ['green', 'gold', 'red'];
const statusContent = ['未超时', '即将超时', '已超时'];
let params;
let expand = false;

function TaskSearch(props) {
  const {
    form: { getFieldDecorator, resetFields, validateFields, setFieldsValue, getFieldsValue },
    location: {
      query: {
        time1,
        time2,
        status,
        executeResult,
        timeoutStatus,
        operationUser
      },
    },
    dispatch,
    queryList,
    operationPersonArr,
    location,
    loading,
  } = props;
  let operationPersonSelect;
  let titleParams;

  const [paginations, setPaginations] = useState({ current: 1, pageSize: 15 });
  const [selectdata, setSelectData] = useState('');
  const [columns, setColumns] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  let formThead;

  if (time1) {
    titleParams = '作业计划统计查询';
  } else {
    titleParams = '作业计划查询';
  }
  // //  获取作业负责人
  const getoperationPerson = () => {
    dispatch({
      type: 'processmodel/operationPerson',
    });
  };

  // // 处理作业负责人数据
  if (operationPersonArr.length) {
    operationPersonSelect = operationPersonArr.map(item => {
      return {
        key: item.id,
        value: item.userName,
      };
    });
  }
  //  打开查询详情页
  const gotoDetail = record => {
    dispatch({
      type: 'viewcache/gettabstate',
      payload: {
        cacheinfo: {
          ...params,
          paginations,
          expand,
          key: 'operationplan'
        },
        tabid: sessionStorage.getItem('tabid')
      },
    });
    router.push({
      pathname: `/ITSM/operationplan/operationplansearchdetail`,
      query: {
        mainId: record.mainId,
        No: record.operationNo,
      },
      state: {
        runpath: '/ITSM/operationplan/operationplansearch',
        cacheinfo: {
          ...params,
          paginations,
          expand,
          key: 'operationplan'
        },
      }
    });
  };


  const initialColumns = [
    {
      title: '作业计划编号',
      dataIndex: 'operationNo',
      key: 'operationNo',
      width: 180,
      fixed: 'left',
      render: (text, record) => {
        return <a onClick={() => gotoDetail(record)}>{text}</a>;
      },
    },
    {
      title: '填报时间',
      dataIndex: 'addTime',
      key: 'addTime',
      width: 200,
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
      title: '当前处理环节',
      dataIndex: 'flowNodeName',
      key: 'flowNodeName',
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
      ellipsis: true,
      render: text => {
        return (
          <Tooltip placement="topLeft" title={text}>
            <span>{text}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '风险分析',
      dataIndex: 'riskAnalysis',
      key: 'riskAnalysis',
      width: 150,
      ellipsis: true,
      render: text => {
        return (
          <Tooltip placement="topLeft" title={text}>
            <span>{text}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '风险应对措施',
      dataIndex: 'riskMeasures',
      key: 'riskMeasures',
      width: 150,
      ellipsis: true,
      render: text => {
        return (
          <Tooltip placement="topLeft" title={text}>
            <span>{text}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '超时状态',
      dataIndex: 'timeoutStatus',
      key: 'timeoutStatus',
      width: 150,
      render: text => (
        <span>
          <Badge status={statusMap[statusContent.indexOf(text)]} text={text} />
        </span>
      ),
    },
    {
      title: '计划开始时间',
      dataIndex: 'plannedStartTime',
      key: 'plannedStartTime',
      width: 200,
    },
    {
      title: '计划结束时间',
      dataIndex: 'plannedEndTime',
      key: 'plannedEndTime',
      width: 200,
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
      width: 200,
    },
    {
      title: '实际结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
      width: 200,
    },
    {
      title: '作业执行情况说明',
      dataIndex: 'executeContent',
      key: 'executeContent',
      width: 150,
      ellipsis: true,
      render: text => {
        return (
          <Tooltip placement="topLeft" title={text}>
            <span>{text}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '执行操作时间',
      dataIndex: 'executeOperationTime',
      key: 'executeOperationTime',
      width: 200,
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
      ellipsis: true,
      render: text => {
        return (
          <Tooltip placement="topLeft" title={text}>
            <span>{text}</span>
          </Tooltip>
        );
      },
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
      width: 200,
    },
    {
      title: '审核说明',
      dataIndex: 'checkContent',
      key: 'checkContent',
      width: 150,
      ellipsis: true,
      render: text => {
        return (
          <Tooltip placement="topLeft" title={text}>
            <span>{text}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '超时信息',
      dataIndex: 'timeoutMsg',
      key: 'timeoutMsg',
      width: 150,
      ellipsis: true,
      render: text => {
        return (
          <Tooltip placement="topLeft" title={text}>
            <span>{text}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '回退信息',
      dataIndex: 'fallbackMsg',
      key: 'fallbackMsg',
      width: 150,
      ellipsis: true,
      render: text => {
        return (
          <Tooltip placement="topLeft" title={text}>
            <span>{text}</span>
          </Tooltip>
        );
      },
    },
  ];

  const defaultAllkey = columns.map(item => {
    return item.title;
  });

  const searchdata = (values, page, pageSize) => {
    const newvalues = {
      ...values,
      time1: values.addTime?.length
        ? moment(values.addTime[0]).format('YYYY-MM-DD HH:mm:ss')
        : '',
      time2: values.addTime?.length
        ? moment(values.addTime[1]).format('YYYY-MM-DD HH:mm:ss')
        : '',
      checkTime1: values.checkTime?.length
        ? moment(values.checkTime[0]).format('YYYY-MM-DD HH:mm:ss')
        : '',
      checkTime2: values.checkTime?.length
        ? moment(values.checkTime[1]).format('YYYY-MM-DD HH:mm:ss')
        : '',
      checkTime: '',
      executeOperationTime1: values.executeOperationTime?.length
        ? moment(values.executeOperationTime[0]).format('YYYY-MM-DD HH:mm:ss')
        : '',
      executeOperationTime2: values.executeOperationTime?.length
        ? moment(values.executeOperationTime[1]).format('YYYY-MM-DD HH:mm:ss')
        : '',
      executeOperationTime: '',
      plannedStartTime1: values.plannedStartTime?.length
        ? moment(values.plannedStartTime[0]).format('YYYY-MM-DD HH:mm:ss')
        : '',
      plannedStartTime2: values.plannedStartTime?.length
        ? moment(values.plannedStartTime[1]).format('YYYY-MM-DD HH:mm:ss')
        : '',
      plannedStartTime: '',
      startTime1: values.startTime?.length
        ? moment(values.startTime[0]).format('YYYY-MM-DD HH:mm:ss')
        : '',
      startTime2: values.startTime?.length
        ? moment(values.startTime[1]).format('YYYY-MM-DD HH:mm:ss')
        : '',
      startTime: '',
      plannedEndTime1: values.plannedendTime?.length
        ? moment(values.plannedendTime[0]).format('YYYY-MM-DD HH:mm:ss')
        : '',
      plannedEndTime2: values.plannedendTime?.length
        ? moment(values.plannedendTime[1]).format('YYYY-MM-DD HH:mm:ss')
        : '',
      plannedendTime: '',
      endTime1: values.endTime?.length
        ? moment(values.endTime[0]).format('YYYY-MM-DD HH:mm:ss')
        : '',
      endTime2: values.endTime?.length
        ? moment(values.endTime[1]).format('YYYY-MM-DD HH:mm:ss')
        : '',
      endTime: '',
      addTime: '',
    };
    dispatch({
      type: 'processmodel/getOperationQueryList',
      payload: {
        ...values,
        ...newvalues,
        pageIndex: page - 1,
        pageSize,
      },
    });
    params = newvalues;
  };

  const handleReset = () => {
    router.push({
      pathname: location.pathname,
      query: {},
      state: {},
    });
    resetFields();
    searchdata({}, 1, 15);
    setPaginations({ current: 1, pageSize: 15 });
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


  const getTypebyTitle = title => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.title === title)[0].children;
    }
    return [];
  };

  const executeStatusselect = getTypebyTitle('作业状态');
  const taskType = getTypebyTitle('作业类型');
  const taskNature = getTypebyTitle('作业性质');
  const taskBilling = getTypebyTitle('是否开票');
  const checkStatus = getTypebyTitle('审核状态');
  const timeoutStatusselect = getTypebyTitle('超时状态');
  const taskResult = getTypebyTitle('作业结果');
  const checkResult = getTypebyTitle('审核结果');
  const taskCompany = getTypebyTitle('作业单位');

  // 设置时间
  useEffect(() => {
    if (location && location.state && location.state.cacheinfo) {
      const {
        time1,
        time2,
        checkTime1,
        checkTime2,
        executeOperationTime1,
        executeOperationTime2,
        plannedStartTime1,
        plannedStartTime2,
        plannedEndTime1,
        plannedEndTime2,
        startTime1,
        startTime2,
        endTime1,
        endTime2
      } = location.state.cacheinfo;
      setFieldsValue({
        addTime: time1 ? [moment(time1), moment(time2)] : '',
        checkTime: checkTime1 ? [moment(checkTime1), moment(checkTime2)] : '',
        executeOperationTime: executeOperationTime1 ?
          [moment(executeOperationTime1), moment(executeOperationTime2)]
          : '',
        plannedStartTime: plannedStartTime1
          ? [moment(plannedStartTime1), moment(plannedStartTime2)]
          : '',
        plannedendTime: plannedEndTime1?.length
          ? [moment(plannedEndTime1), moment(plannedEndTime2)]
          : '',
        startTime: startTime1 ? [moment(startTime1), moment(startTime2)] : '',
        endTime: endTime1 ? [moment(endTime1), moment(endTime2)] : '',
      });
    } else {
      setFieldsValue({
        addTime: time1 ? [moment(time1), moment(time2)]:'',
      });
    }
  }, [location.state]);

  // 设置初始值
  const record = {
    status,
    executeResult,
    operationUser,
    timeoutStatus,
    addTime: time1 ? [moment(time1), moment(time2)] :'',
    operationNo: '',
    systemName: '',
    type: '',
    nature: '',
    operationUnit: '',
    billing: '',
    object: '',
    content: '',
    checkStatus: '',
    executeContent: '',
    checkResult: '',
    executeOperationTime: '',
    plannedStartTime: '',
    plannedendTime: '',
    endTime: '',
    startTime: '',
    addUser: '',
    addUnit: '',
    checkUser: '',
    checkTime: '',
    paginations,
    checkContent: '',
    time1,
    time2,
  };

  const cacheinfo = location.state.cacheinfo === undefined ? record : location.state.cacheinfo;

  useEffect(() => {
    if (location.state) {
      if (location.state.cache) {
        // 传表单数据到页签
        dispatch({
          type: 'viewcache/gettabstate',
          payload: {
            cacheinfo: {
              ...params,
              paginations,
              expand,
            },
            tabid: sessionStorage.getItem('tabid'),
          },
        });
      }
      // 点击菜单刷新
      if (location.state.reset) {
        handleReset();
        expand = false;
      }
      // 标签切回设置初始值
      if (location.state.cacheinfo) {
        const { current, pageSize } = location.state.cacheinfo.paginations;
        expand = location.state.cacheinfo.expand;
        setPaginations({ ...paginations, current, pageSize });
      }
    }
  }, [location.state]);

  // 查询
  const handleSearch = () => {
    setPaginations({
      ...paginations,
      current: 1,
    });
    validateFields((err, values) => {
      const searchParams = {
        ...values,
      };
      searchdata(searchParams, 1, paginations.pageSize);
    });
  };

  //  导出
  const exportDownload = () => {
    const exportColumns = columns.map(item => {
      return {
        column: item.dataIndex,
        field: item.title,
      };
    });
    validateFields((err, values) => {
      dispatch({
        type: 'processmodel/downloadQueryExcel',
        payload: {
          columns: JSON.stringify(exportColumns),
          ids: selectedKeys.toString(),
          ...values,
          time1: values.addTime?.length
            ? moment(values.addTime[0]).format('YYYY-MM-DD HH:mm:ss')
            : '',
          time2: values.addTime?.length
            ? moment(values.addTime[1]).format('YYYY-MM-DD HH:mm:ss')
            : '',
          checkTime1: values.checkTime?.length
            ? moment(values.checkTime[0]).format('YYYY-MM-DD HH:mm:ss')
            : '',
          checkTime2: values.checkTime?.length
            ? moment(values.checkTime[1]).format('YYYY-MM-DD HH:mm:ss')
            : '',
          checkTime: '',
          executeOperationTime1: values.executeOperationTime?.length
            ? moment(values.executeOperationTime[0]).format('YYYY-MM-DD HH:mm:ss')
            : '',
          executeOperationTime2: values.executeOperationTime?.length
            ? moment(values.executeOperationTime[1]).format('YYYY-MM-DD HH:mm:ss')
            : '',
          executeOperationTime: '',
          plannedStartTime1: values.plannedStartTime?.length
            ? moment(values.plannedStartTime[0]).format('YYYY-MM-DD HH:mm:ss')
            : '',
          plannedStartTime2: values.plannedStartTime?.length
            ? moment(values.plannedStartTime[1]).format('YYYY-MM-DD HH:mm:ss')
            : '',
          plannedStartTime: '',
          startTime1: values.startTime?.length
            ? moment(values.startTime[0]).format('YYYY-MM-DD HH:mm:ss')
            : '',
          startTime2: values.startTime?.length
            ? moment(values.startTime[1]).format('YYYY-MM-DD HH:mm:ss')
            : '',
          startTime: '',
          plannedEndTime1: values.plannedendTime?.length
            ? moment(values.plannedendTime[0]).format('YYYY-MM-DD HH:mm:ss')
            : '',
          plannedEndTime2: values.plannedendTime?.length
            ? moment(values.plannedendTime[1]).format('YYYY-MM-DD HH:mm:ss')
            : '',
          plannedendTime: '',
          endTime1: values.endTime?.length
            ? moment(values.endTime[0]).format('YYYY-MM-DD HH:mm:ss')
            : '',
          endTime2: values.endTime?.length
            ? moment(values.endTime[1]).format('YYYY-MM-DD HH:mm:ss')
            : '',
          endTime: '',
          addTime: '',
        },
      }).then(res => {
        const filename = '下载作业计划查询.xls';
        const blob = new Blob([res]);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      });
    });
  };

  const rowSelection = {
    onChange: (index, handleSelect) => {
      setSelectedKeys([...index]);
      setSelectedRows([...handleSelect]);
    },
  };

  //  自定义列表
  const creataColumns = () => {
    // columns
    initialColumns.length = 0;
    formThead.map((val, key) => {
      const obj = {
        key: val.key,
        title: val.title,
        dataIndex: val.key,
        width: val.width,
      };
      if (key === 0) {
        obj.width = 180;
        obj.render = (text, records) => {
          return <a onClick={() => gotoDetail(records)}>{text}</a>;
        };
        obj.fixed = 'left';
      }
      if (val.title === '超时状态') {
        obj.render = text => {
          return (
            <span>
              <Badge status={statusMap[statusContent.indexOf(text)]} text={text} />
            </span>
          );
        };
      }

      if (
        val.title === '填报单位' ||
        val.title === '超时信息' ||
        val.title === '回退信息' ||
        val.title === '审核说明' ||
        val.title === '作业执行情况说明' ||
        val.title === '作业内容' ||
        val.title === '风险分析' ||
        val.title === '风险应对措施'
      ) {
        obj.ellipsis = true;
        obj.render = (text, records) => {
          return (
            <Tooltip placement="topLeft" title={text}>
              {key === 0 ? <a onClick={() => gotoDetail(records)}>{text}</a> : <span>{text}</span>}
            </Tooltip>
          );
        };
      }
      initialColumns.push(obj);
      setColumns(initialColumns);
      return null;
    });
  };

  const onCheckAllChange = e => {
    setColumns(e.target.checked ? initialColumns : []);
  };

  const onCheck = checkedValues => {
    formThead = initialColumns.filter(i => checkedValues.indexOf(i.title) >= 0);

    if (formThead.length === 0) {
      setColumns([]);
    }
    creataColumns();
  };

  const handleCopy = () => {
    if (selectedKeys.length !== 1) {
      message.info('请选择一条数据');
      return false;
    }

    if (selectedKeys.length > 1) {
      message.info('只能选择一条数据复制哦');
      return false;
    }

    if (selectedKeys.length === 1) {
      message.success('复制成功，可往填报中粘贴');
      const type = taskType.filter(item => item.title === selectedRows[0].type)[0]?.dict_code || '';
      const nature = taskNature.filter(item => item.title === selectedRows[0].nature)[0]?.dict_code || '';
      const operationUnit = taskCompany.filter(item => item.title === selectedRows[0].operationUnit)[0]?.dict_code || '';
      const billing = taskBilling.filter(item => item.title === selectedRows[0].billing)[0]?.dict_code || '';
      localStorage.setItem('copy', JSON.stringify({
        ...selectedRows[0],
        type,
        nature,
        operationUnit,
        billing,
        operationNo: ''
      }));
    }

    return null;
  };

  useEffect(() => {
    if (cacheinfo !== undefined) {
      const values = getFieldsValue();
      searchdata(values, cacheinfo.paginations.current, cacheinfo.paginations.pageSize);
    }
    getoperationPerson();
    setColumns(initialColumns);
  }, []);


  const pagination = {
    showSizeChanger: true,
    onShowSizeChange: (page, pageSize) => onShowSizeChange(page, pageSize),
    current: paginations.current,
    pageSize: paginations.pageSize,
    total: queryList.total,
    showTotal: total => `总共  ${total}  条记录`,
    onChange: page => changePage(page),
  };

  return (
    <PageHeaderWrapper title={titleParams}>
      <SysDict
        typeid="481"
        commonid="335"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Card>
        <Row gutter={24}>
          <Form {...formItemLayout}>
            <>
              {operationPersonSelect && operationPersonSelect.length > 0 && (
                <>
                  <Col span={8}>
                    <Form.Item label="作业计划编号">
                      {getFieldDecorator('operationNo', {
                        initialValue: cacheinfo.operationNo,
                      })(<Input allowClear />)}
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item label="作业状态">
                      {getFieldDecorator('status', {
                        initialValue: cacheinfo.status,
                      })(
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

                  <Col span={8}>
                    <Form.Item label="作业结果">
                      {getFieldDecorator('executeResult', {
                        initialValue: cacheinfo.executeResult,
                      })(
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
                    <Form.Item label="作业负责人">
                      {getFieldDecorator('operationUser', {
                        initialValue: cacheinfo.operationUser,
                      })(
                        <Select allowClear>
                          {operationPersonSelect.map(obj => [
                            <Option key={obj.key} value={obj.value}>
                              {obj.value}
                            </Option>,
                          ])}
                        </Select>,
                      )}
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item label="超时状态">
                      {getFieldDecorator('timeoutStatus', {
                        initialValue: cacheinfo.timeoutStatus,
                      })(
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
                    <Form.Item label="填报时间">
                      {getFieldDecorator('addTime', {
                         initialValue: cacheinfo.time1
                         ? [
                           moment(cacheinfo.time1),
                           moment(cacheinfo.time2),
                         ]
                         : '',
                      })(
                        <RangePicker
                        showTime={{
                          hideDisabledOptions: true,
                          defaultValue: [
                            moment('00:00:00', 'HH:mm:ss'),
                            moment('23:59:59', 'HH:mm:ss'),
                          ],
                        }}
                        format="YYYY-MM-DD HH:mm:ss"
                        style={{ width: '100%' }}
                        allowClear
                      />,
                      )}
                    </Form.Item>
                  </Col>

                </>
              )}
            </>
            <div style={{ display: expand ? 'block' : 'none' }}>
              <>
                <Col span={8}>
                  <Form.Item label="作业类型">
                    {getFieldDecorator('type', {
                      initialValue: cacheinfo.type,
                    })(
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

                <Col span={8}>
                  <Form.Item label="作业性质">
                    {getFieldDecorator('nature', {
                      initialValue: cacheinfo.nature,
                    })(
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
                    {getFieldDecorator('operationUnit', {
                      initialValue: cacheinfo.operationUnit,
                    })(
                      <Select placeholder="请选择" allowClear>
                        {taskCompany.map(obj => [
                          <Option key={obj.key} value={obj.title}>
                            {obj.title}
                          </Option>,
                        ])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
              </>

              <>
                <Col span={8}>
                  <Form.Item label="是否开票">
                    {getFieldDecorator('billing', {
                      initialValue: cacheinfo.billing,
                    })(
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
                    {getFieldDecorator('object', {
                      initialValue: cacheinfo.object,
                    })(<Input allowClear />)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="作业内容">
                    {getFieldDecorator('content', {
                      initialValue: cacheinfo.content,
                    })(<Input allowClear />)}
                  </Form.Item>
                </Col>
              </>

              <>
                <Col span={8}>
                  <Form.Item label="计划开始时间">
                    {getFieldDecorator('plannedStartTime', {
                      initialValue: cacheinfo.plannedStartTime1
                        ? [
                          moment(cacheinfo.plannedStartTime1),
                          moment(cacheinfo.plannedStartTime2),
                        ]
                        : '',
                    })(
                      <RangePicker
                        showTime={{
                          hideDisabledOptions: true,
                          defaultValue: [
                            moment('00:00:00', 'HH:mm:ss'),
                            moment('23:59:59', 'HH:mm:ss'),
                          ],
                        }}
                        format="YYYY-MM-DD HH:mm:ss"
                        style={{ width: '100%' }}
                      />,
                    )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="计划结束时间">
                    {getFieldDecorator('plannedendTime', {
                      initialValue: cacheinfo.plannedEndTime1
                        ? [
                          moment(cacheinfo.plannedEndTime1),
                          moment(cacheinfo.plannedEndTime2),
                        ]
                        : '',
                    })(
                      <RangePicker
                        showTime={{
                          hideDisabledOptions: true,
                          defaultValue: [
                            moment('00:00:00', 'HH:mm:ss'),
                            moment('23:59:59', 'HH:mm:ss'),
                          ],
                        }}
                        format="YYYY-MM-DD HH:mm:ss"
                        style={{ width: '100%' }}
                      />,
                    )}
                  </Form.Item>
                </Col>
              </>

              <>
                <Col span={8}>
                  <Form.Item label="审核状态">
                    {getFieldDecorator('checkStatus', {
                      initialValue: cacheinfo.checkStatus,
                    })(
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
                    {getFieldDecorator('timeoutStatus', {
                      initialValue: cacheinfo.timeoutStatus,
                    })(
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
                  <Form.Item label="作业执行情况说明">
                    {getFieldDecorator('executeContent', {
                      initialValue: cacheinfo.executeContent,
                    })(<Input allowClear />)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="审核结果">
                    {getFieldDecorator('checkResult', {
                      initialValue: cacheinfo.checkResult,
                    })(
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

              <>
                <Col span={8}>
                  <Form.Item label="实际开始时间">
                    {getFieldDecorator('startTime', {
                      initialValue: cacheinfo.startTime1
                        ? [
                          moment(cacheinfo.startTime1),
                          moment(cacheinfo.startTime2),
                        ]
                        : '',
                    })(
                      <RangePicker
                        showTime={{
                          hideDisabledOptions: true,
                          defaultValue: [
                            moment('00:00:00', 'HH:mm:ss'),
                            moment('23:59:59', 'HH:mm:ss'),
                          ],
                        }}
                        format="YYYY-MM-DD HH:mm:ss"
                        style={{ width: '100%' }}
                        allowClear
                      />,
                    )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="实际结束时间">
                    {getFieldDecorator('endTime', {
                      initialValue: cacheinfo.endTime1
                        ? [
                          moment(cacheinfo.endTime1),
                          moment(cacheinfo.endTime2),
                        ]
                        : '',
                    })(
                      <RangePicker
                        showTime={{
                          hideDisabledOptions: true,
                          defaultValue: [
                            moment('00:00:00', 'HH:mm:ss'),
                            moment('23:59:59', 'HH:mm:ss'),
                          ],
                        }}
                        format="YYYY-MM-DD HH:mm:ss"
                        style={{ width: '100%' }}
                        allowClear
                      />,
                    )}
                  </Form.Item>
                </Col>
              </>

              <>
                <Col span={8}>
                  <Form.Item label="执行操作时间">
                    {getFieldDecorator('executeOperationTime', {
                      initialValue: cacheinfo.executeOperationTime1
                        ? [
                          moment(cacheinfo.executeOperationTime1),
                          moment(cacheinfo.executeOperationTime2),
                        ]
                        : '',
                    })(
                      <RangePicker
                        showTime={{
                          hideDisabledOptions: true,
                          defaultValue: [
                            moment('00:00:00', 'HH:mm:ss'),
                            moment('23:59:59', 'HH:mm:ss'),
                          ],
                        }}
                        format="YYYY-MM-DD HH:mm:ss"
                        style={{ width: '100%' }}
                        allowClear
                      />,
                    )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="填报人">
                    {getFieldDecorator('addUser', {
                      initialValue: cacheinfo.addUser,
                    })(<Input allowClear />)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="填报单位">
                    {getFieldDecorator('addUnit', {
                      initialValue: cacheinfo.addUnit,
                    })(<Input allowClear />)}
                  </Form.Item>
                </Col>
              </>

              <>
                <Col span={8}>
                  <Form.Item label="审核人">
                    {getFieldDecorator('checkUser', {
                      initialValue: cacheinfo.checkUser,
                    })(<Input allowClear />)}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="审核时间">
                    {getFieldDecorator('checkTime', {
                      initialValue: cacheinfo.checkTime1
                        ? [
                          moment(cacheinfo.checkTime1),
                          moment(cacheinfo.checkTime2),
                        ]
                        : '',
                    })(
                      <RangePicker
                        showTime={{
                          hideDisabledOptions: true,
                          defaultValue: [
                            moment('00:00:00', 'HH:mm:ss'),
                            moment('23:59:59', 'HH:mm:ss'),
                          ],
                        }}
                        format="YYYY-MM-DD HH:mm:ss"
                        style={{ width: '100%' }}
                        allowClear
                      />,
                    )}
                  </Form.Item>
                </Col>
              </>

              <>
                <Col span={8}>
                  <Form.Item label="审核说明">
                    {getFieldDecorator('checkContent', {
                      initialValue: cacheinfo.checkContent,
                    })(<Input allowClear />)}
                  </Form.Item>
                </Col>
              </>
            </div>

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
                    expand = !expand
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
                    expand = !expand
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

        <Button type="primary" style={{ marginRight: 8 }} onClick={() => handleCopy()}>
          复制
        </Button>

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
                    checked={(columns.length === initialColumns.length) === true}
                  >
                    列表展示
                  </Checkbox>
                  <br />
                </div>

                <Checkbox.Group onChange={onCheck} value={defaultAllkey} defaultValue={columns}>
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
          columns={columns && columns.length === (initialColumns && initialColumns.length) ? initialColumns : columns}
          dataSource={queryList.rows}
          scroll={{ x: 1500, y: 700 }}
          rowKey={records => records.id}
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
