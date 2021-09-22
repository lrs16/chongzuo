import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import {
  Form,
  Row,
  Col,
  Input,
  Select,
  Button,
  DatePicker,
  Card,
  Table,
  Message
} from 'antd';

import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import moment from 'moment';
import ToApply from './components/ToApply';
import ToEditApply from './components/ToEditApply';
import ToapplayDetail from './components/ToapplayDetail';
// import SysDict from '@/components/SysDict';

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

const sexMap = ['男', '女'];
const statusMap = ['已登记','待审核', '已审核'];
const sexselectmap = [
  { key: '0', title: '男' },
  { key: '1', title: '女' }
];

const checkresultMap = ['通过', '不通过'];

const checkStatus1 = [
  { key: '0', title: '已登记' },
  { key: '1', title: '待审核' },
  { key: '2', title: '已审核' }
];

const checkResult1 = [
  { key: '0', title: '通过' },
  { key: '1', title: '不通过' }
];

function Toregister(props) {
  const pagetitle = props.route.name;
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    form: { getFieldDecorator, resetFields, validateFields, getFieldsValue },
    dispatch,
    location,
    findRegistlist,
    userinfo,
    loading
  } = props;

  const [expand, setExpand] = useState(false);
  const [paginations, setPaginations] = useState({ current: 1, pageSize: 15 });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [tabrecord, setTabrecord] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  // const [selectdata, setSelectData] = useState('');

  // const getApplayTitle = title => { // 数据字典
  //   if (selectdata.ischange) {
  //     return selectdata.arr.filter(item => item.title === title)[0].children;
  //   }
  //   return [];
  // }

  // const checkStatus = getApplayTitle('审核状态');
  // const checkResult = getApplayTitle('审核结果');

  const columns = [
    {
      title: '进出申请编号',
      dataIndex: 'registNo',
      key: 'registNo',
      width: 200,
      fixed: 'left',
      render: (text, record) =>
      (
        <ToapplayDetail
          title="人员进出申请详情"
          record={record}
        >
          <a type="link">{text}</a>
        </ToapplayDetail>
      )
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 150,

    },
    {
      title: '性别',
      dataIndex: 'sex',
      key: 'sex',
      width: 150,
      render: (text, record) => {
        return <span>{sexMap[record.sex]}</span>;
      },
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
      width: 200,
    },
    {
      title: '进出事由',
      dataIndex: 'content',
      key: 'content',
      width: 250,
    },
    {
      title: '计划进入时间',
      dataIndex: 'planInTime',
      key: 'planInTime',
      width: 250,
    },
    {
      title: '计划离开时间',
      dataIndex: 'planOutTime',
      key: 'planOutTime',
      width: 250,
    },
    {
      title: '携带工具',
      dataIndex: 'carryTool',
      key: 'carryTool',
      width: 250,
    },
    {
      title: '审核状态',
      dataIndex: 'checkStatus',
      key: 'checkStatus',
      width: 150,
      render: (text, record) => {
        return <span>{statusMap[record.checkStatus]}</span>;
      },
    },
    {
      title: '申请人',
      dataIndex: 'applyUser',
      key: 'applyUser',
      width: 150,
    },
    {
      title: '审核结果',
      dataIndex: 'checkResult',
      key: 'checkResult',
      width: 250,
      render: (text, record) => {
        return <span>{checkresultMap[record.checkResult]}</span>;
      },
    },
    {
      title: '审核说明',
      dataIndex: 'checkContent',
      key: 'checkContent',
      width: 250,
    },
    {
      title: '审核人',
      dataIndex: 'checkUser',
      key: 'checkUser',
      width: 150,
    },
    {
      title: '审核单位',
      dataIndex: 'checkUnit',
      key: 'checkUnit',
      width: 200,
    },
  ];

  const queryItsmuser = () => {
    dispatch({
      type: 'itsmuser/fetchuser',
    });
  };

  const getfindRegistList = () => {
    dispatch({
      type: 'apply/findRegistList',
      payload: {
        pageIndex: paginations.current - 1,
        pageSize: paginations.pageSize,
      },
    });
  };

  useEffect(() => {
    getfindRegistList();
    queryItsmuser();
  }, []);

  const onSelectChange = (RowKeys, Rows) => {
    setSelectedRowKeys(RowKeys);
    setSelectedRows(Rows);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRows.length === 1;
  const hasSelected1 = selectedRows.length > 0;

  // 申请人员进出添加
  const handleAdd = values => {
    dispatch({
      type: 'apply/saveApplyForm',
      payload: {
        ...values,
        planInTime: (values.planInTime === '' || values.planInTime === 'Invalid date') ? '' : moment(values.planInTime).format('YYYY-MM-DD HH:mm:ss'),
        planOutTime: (values.planOutTime === '' || values.planOutTime === 'Invalid date') ? '' : moment(values.planOutTime).format('YYYY-MM-DD HH:mm:ss'),
        applyTime: (values.applyTime === '' || values.applyTime === 'Invalid date') ? '' : moment(values.applyTime).format('YYYY-MM-DD HH:mm:ss'),
      },
    }).then(res => {
      if (res.code === 200) {
        Message.success(res.msg);
        getfindRegistList();
      } else {
        Message.error(res.msg);
      }
    });
    setSelectedRowKeys([]);
    setSelectedRows([]);
  };

  // 申请人员进出编辑
  const handleEdite = values => {
    dispatch({
      type: 'apply/saveApplyForm',
      payload: {
        ...values,
        id: selectedRows[0].id,
        planInTime: (values.planInTime === '' || values.planInTime === 'Invalid date') ? '' : moment(values.planInTime).format('YYYY-MM-DD HH:mm:ss'),
        planOutTime: (values.planOutTime === '' || values.planOutTime === 'Invalid date') ? '' : moment(values.planOutTime).format('YYYY-MM-DD HH:mm:ss'),
      },
    }).then(res => {
      if (res.code === 200) {
        Message.success(res.msg);
        getfindRegistList();
      } else {
        Message.error(res.msg);
      }
    });
    setSelectedRowKeys([]);
    setSelectedRows([]);
  };

  // 申请人员进出删除
  const handleDelete = () => {
    const {id} = selectedRows[0];
    const len = selectedRowKeys.length;

    if (len === 1) { // 单条数据
      dispatch({
        type: 'apply/deleteApplyForms',
        payload: {
          registIds: id,
        }
      }).then(res => {
        if (res.code === 200) {
          Message.success('删除成功');
          getfindRegistList();
        };
        if (res.code === -1) {
          Message.error(res.msg);
        };
      });
    } else if (len > 1) { // 批量删除
      const registIds = selectedRows.map(item => {
        return item.id;
      })

      dispatch({
        type: 'apply/deleteApplyForms',
        payload: { registIds: registIds.toString() },
      }).then(res => {
        if (res.code === 200) {
          Message.success('删除成功');
          getfindRegistList();
        } else {
          Message.error(res.msg);
        }
      });
    } else {
      Message.info('请选择一条数据');
    }
    setSelectedRowKeys([]);
    setSelectedRows([]);
  };

  // 重置
  const handleReset = () => {
    resetFields();
    dispatch({
      type: 'apply/findRegistList',
      payload: {
        pageIndex: 0,
        pageSize: paginations.pageSize,
      },
    })
  };

  // 查询请求数据
  const searchdata = (values, page, pageSize) => {
    const newValue = {
      ...values,
      // 计划进入时间
      planInTime1: values.planInTime ? moment(values.planInTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
      planInTime2: values.planInTime ? moment(values.planInTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
      planInTime: '',
      // 计划离开时间
      planOutTime1: values.planOutTime ? moment(values.planOutTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
      planOutTime2: values.planOutTime ? moment(values.planOutTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
      planOutTime: '',
      // 申请时间
      applyTime1: values.applyTime ? moment(values.applyTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
      applyTime2: values.applyTime ? moment(values.applyTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
      applyTime: '',
      // 审核时间
      checkTime1: values.checkTime ? moment(values.checkTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
      checkTime2: values.checkTime ? moment(values.checkTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
      checkTime: ''
    }
    setTabrecord({ ...newValue });
    dispatch({
      type: 'apply/findRegistList',
      payload: {
        ...newValue,
        pageSize,
        pageIndex: page - 1,
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

  // 分页
  const pagination = {
    showSizeChanger: true, // 改变条数pageSize
    // pageSize 变化的回调
    onShowSizeChange: (page, pageSize) => onShowSizeChange(page, pageSize),
    current: paginations.current,
    pageSize: paginations.pageSize,
    total: findRegistlist.total,
    // 用于显示数据总量和当前数据顺序
    showTotal: total => `总共 ${total} 条记录`,
    // 页码改变的回调，参数是改变后的页码及每页条数
    onChange: (page) => changePage(page),
  };

  // 查询传数据
  const handleSearch = () => {
    setPaginations({
      ...paginations,
      current: 1
    })
    validateFields((err, values) => {
      if (err) {
        return;
      }
      searchdata(values, paginations.current, paginations.pageSize);
    });
  };

  useEffect(() => {
    if (location.state) {
      // 点击菜单刷新,并获取数据
      if (location.state.reset) {
        handleReset();
      };
    }
  }, [location.state]);

  // 设置展开收起
  const extra = (<>
    <Button type="primary" onClick={() => handleSearch()}>查 询</Button>
    <Button style={{ marginLeft: 8 }} onClick={() => handleReset()}>重 置</Button>
    <Button
      style={{ marginLeft: 8 }}
      type="link"
      onClick={() => {
        setExpand(!expand);
      }}
    >
      {expand ? (<>关 闭 <UpOutlined /></>) : (<>展 开 <DownOutlined /></>)}
    </Button></>)

  // 下载、导出
  const exportDownload = () => {
    const values = getFieldsValue();
    dispatch({
      type: 'apply/downloadRegistExport',
      payload: {
        ...values,
        // 计划进入时间
        planInTime1: values.planInTime ? moment(values.planInTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
        planInTime2: values.planInTime ? moment(values.planInTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
        planInTime: '',
        // 计划离开时间
        planOutTime1: values.planOutTime ? moment(values.planOutTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
        planOutTime2: values.planOutTime ? moment(values.planOutTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
        planOutTime: '',
        // 申请时间
        applyTime1: values.applyTime ? moment(values.applyTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
        applyTime2: values.applyTime ? moment(values.applyTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
        applyTime: '',
        // 审核时间
        checkTime1: values.checkTime ? moment(values.checkTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
        checkTime2: values.checkTime ? moment(values.checkTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
        checkTime: ''
      },
    }).then(res => {
      const filename = `人员进出登记_${moment().format('YYYY-MM-DD HH:mm')}.xls`;
      const blob = new Blob([res]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  return (
    <PageHeaderWrapper title={pagetitle}>
      {/* <SysDict
        typeid="1385513049263181825"
        commonid="1354288354950123522"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      /> */}
      <Card>
        <Row gutter={24}>
          <Form {...formItemLayout} onSubmit={handleSearch}>
            <>
              <Col span={8}>
                <Form.Item label="进出申请编号">
                  {getFieldDecorator('registNo', {
                    // initialValue: a.registNo,
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="审核状态">
                  {getFieldDecorator('checkStatus', {
                    // initialValue: a.checkStatus,
                  })(
                    <Select placeholder="请选择" allowClear>
                      {checkStatus1.map(obj => [
                        <Option key={obj.key} value={obj.key}>
                          {obj.title}
                        </Option>,
                      ])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            </>
            <span style={{ display: expand ? 'block' : 'none' }}>
              <Col span={8}>
                <Form.Item label="姓名">
                  {getFieldDecorator('name', {
                    // initialValue: a.name,
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="性别">
                  {getFieldDecorator('sex', {
                  })(
                    <Select placeholder="请选择" allowClear>
                      {sexselectmap.map(({ key, title }) => [
                        <Option key={key} value={key}>
                          {title}
                        </Option>,
                      ])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="联系电话">
                  {getFieldDecorator('phone', {
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="进出事由">
                  {getFieldDecorator('content', {
                    initialValue: '',
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="计划进入时间">
                  {getFieldDecorator('planInTime', {
                    initialValue: '',
                  })
                    (
                      <RangePicker
                        showTime={{
                          hideDisabledOptions: true,
                          defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                        }}
                        format="YYYY-MM-DD HH:mm:ss"
                        style={{ width: '100%' }}
                      />
                    )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="计划离开时间">
                  {getFieldDecorator('planOutTime', {
                    initialValue: '',
                  })
                    (
                      <RangePicker
                        showTime={{
                          hideDisabledOptions: true,
                          defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                        }}
                        format="YYYY-MM-DD HH:mm:ss"
                        style={{ width: '100%' }}
                      />
                    )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="携带工具">
                  {getFieldDecorator('carryTool', {
                    initialValue: '',
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="申请人">
                  {getFieldDecorator('applyUser', {
                    initialValue: '',
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="申请时间">
                  {getFieldDecorator('applyTime', {
                    initialValue: '',
                  })
                    (
                      <RangePicker
                        showTime={{
                          hideDisabledOptions: true,
                          defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                        }}
                        format="YYYY-MM-DD HH:mm:ss"
                        style={{ width: '100%' }}
                      />
                    )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="审核结果">
                  {getFieldDecorator('checkResult', {
                    initialValue: '',
                  })(
                    <Select placeholder="请选择" allowClear>
                      {checkResult1.map(({ key, title }) => [
                        <Option key={key} value={key}>
                          {title}
                        </Option>,
                      ])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="审核时间">
                  {getFieldDecorator('checkTime', {
                    initialValue: '',
                  })
                    (
                      <RangePicker
                        showTime={{
                          hideDisabledOptions: true,
                          defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                        }}
                        format="YYYY-MM-DD HH:mm:ss"
                        style={{ width: '100%' }}
                      />
                    )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="审核说明">
                  {getFieldDecorator('checkContent', {
                    initialValue: '',
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="审核人">
                  {getFieldDecorator('checker', {
                    initialValue: '',
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>
              <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
                <Form.Item label="审核单位">
                  {getFieldDecorator('checkUnit', {
                    initialValue: '',
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>
            </span>
            {expand ? (<Col span={24} style={{ textAlign: 'right' }}>{extra}</Col>) : (<Col span={8} style={{ marginTop: 4 }}>{extra}</Col>)}
          </Form>
        </Row>
        <div style={{ marginBottom: 24 }}>
          <ToApply
            title='新增人员进出申请'
            dispatch={dispatch}
            userinfo={userinfo}
            onSumit={values => handleAdd(values)}
            onChangeList={()=>getfindRegistList()}
          >
            <Button type="primary" style={{ marginRight: 8 }} disabled={hasSelected1}>
              申请
            </Button>
          </ToApply>
          <ToEditApply
            title='编辑人员进出申请'
            dispatch={dispatch}
            selectedRows={selectedRows}
            onSumit={values => handleEdite(values)}
            onChangeList={()=>getfindRegistList()}
          >
            <Button type="primary" style={{ marginRight: 8 }} disabled={!hasSelected}>
              编辑
            </Button>
          </ToEditApply>
          <Button type="danger" ghost style={{ marginRight: 8 }} onClick={() => handleDelete()}>删 除</Button>
          <Button type="primary" style={{ marginRight: 8 }} onClick={() => exportDownload()}>
            导出数据
          </Button>
        </div>
        <Table
          loading={loading}
          columns={columns}
          dataSource={findRegistlist.rows}
          scroll={{ x: 1600 }}
          rowKey={r => r.registNo}
          pagination={pagination}
          rowSelection={rowSelection}
        />
      </Card>
    </PageHeaderWrapper >
  );
}

export default Form.create({})(
  connect(({ apply, itsmuser, loading }) => ({
    findRegistlist: apply.findRegistlist, // 登记列表
    userinfo: itsmuser.userinfo,
    loading: loading.models.apply,
  }))(Toregister)
);