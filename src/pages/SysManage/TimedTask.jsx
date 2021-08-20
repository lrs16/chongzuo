import React, {
  useState,
  useEffect
} from 'react';
import { connect } from 'dva';
// import router from 'umi/router';
import {
  Card, Row, Col, Form, Input, Select, Button, Table, message, Divider, Switch,
  // Popconfirm,
  Icon,
  Dropdown,
  Menu,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
// import DictLower from '@/components/SysDict/DictLower';
import TaskModal from './components/TaskModal';

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

const taskStatus = [
  { key: '0', title: '正常' },
  { key: '1', title: '暂停' },
];

const concurrentmap = [
  { key: '0', title: '允许' },
  { key: '1', title: '禁止' },
];

const taskName = [
  { key: '0', title: '默认' },
  { key: '1', title: '系统' },
];

function TimedTask(props) {
  const pagetitle = props.route.name;
  const {
    location,
    loading,
    form: {
      getFieldDecorator,
      resetFields,
      getFieldsValue
    },
    dispatch,
    qrtzjoblist
  } = props;

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });
  const [visible, setVisible] = useState(false); // 弹窗是否显示
  const [title, setTitle] = useState('');
  const [savetype, setSaveType] = useState(''); // 保存类型  save:新建  update:编辑
  const [data, setData] = useState('');

  const hasSelected = selectedRows.length === 1;
  const hasSelected1 = selectedRows.length > 0;

  const searchdata = (page, size) => {
    const values = getFieldsValue();
    dispatch({
      type: 'timedtaskmodel/toquery',
      payload: {
        bodyParams: values,
        pageNum: page,
        pageSize: size,
      },
    });
  };

  useEffect(() => {
    searchdata(1, 15);
  }, [location]);

  const handleShowModal = (modaltitle, type, record) => {
    setVisible(!visible);
    setTitle(modaltitle);
    setSaveType(type);
    setData(record);
  };

  // 提交
  const handleSubmit = values => {
    if (savetype === '' || savetype === 'add') {
      dispatch({
        type: 'timedtaskmodel/toaddqrtzJob',
        payload: {
          ...values,
        },
      }).then(res => {
        if (res.code === 200) {
          message.success(res.msg);
          searchdata(1, 15);
        } else {
          message.error(res.msg);
        }
      });
      setSelectedRowKeys([]);
      setSelectedRows([]);
    }
    if (savetype === 'update') {
      dispatch({
        type: 'timedtaskmodel/toupdateqrtzJob',
        payload: {
          ...values,
        },
      }).then(res => {
        if (res.code === 200) {
          message.success(res.msg);
          searchdata(1, 15);
        } else {
          message.error(res.msg);
        }
      });
      setSelectedRowKeys([]);
      setSelectedRows([]);
    }
  };

  const handleDelete = id => { // 删除
    dispatch({
      type: 'timedtaskmodel/todeleteqrtzJob',
      payload: { jobId: id },
    }).then(res => {
      if (res.code === 200) {
        message.success('删除成功');
        searchdata(1, 15);
      } else {
        message.error(res.msg);
      }
    });
  };

  const handleDeletes = () => { // 批量删除
    const len = selectedRowKeys.length;
    if (len === 0) {
      message.info('至少选择一条数据');
    } else {
      const { jobId } = selectedRows[0];
      dispatch({
        type: 'timedtaskmodel/todeleteqrtzJob',
        payload: { jobId: jobId.toString() },
      }).then(res => {
        if (res.code === 200) {
          message.success('删除成功');
          searchdata(1, 15);
        } else {
          message.error(res.msg);
        }
      });
    }
  }

  const handleSearch = () => {
    setPageinations({
      ...paginations,
      current: 1,
    });
    searchdata(1, paginations.pageSize);
  };

  const handleReset = () => {
    resetFields();
    searchdata(1, 15)
    setPageinations({ current: 1, pageSize: 15 });
  };

  const onShowSizeChange = (page, size) => {
    searchdata(page, size);
    setPageinations({
      ...paginations,
      pageSize: size,
    });
  };

  const changePage = page => {
    searchdata(page, paginations.pageSize);
    setPageinations({
      ...paginations,
      current: page,
    });
  };

  const pagination = {
    showSizeChanger: true,
    onShowSizeChange: (page, size) => onShowSizeChange(page, size),
    current: paginations.current,
    pageSize: paginations.pageSize,
    total: qrtzjoblist.total,
    showTotal: total => `总共  ${total}  条记录`,
    onChange: page => changePage(page),
  };

  const onSelectChange = (RowKeys, Rows) => {
    setSelectedRowKeys(RowKeys);
    setSelectedRows(Rows);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleUpdataStatus = (checked, id) => {   // 状态更改
    const statusmap = new Map([
      [true, '0'],
      [false, '1'],
    ]);
    dispatch({
      type: 'timedtaskmodel/tochangeStatus',
      payload: {
        status: statusmap.get(checked),
        jobId: id,
      },
    }).then(res => {
      message.success(res.msg);
      if (res.code === 200) {
        searchdata(1, 15);
      }
    });
  };

  const handletoRun = (v) => { // 立即执行一次
    console.log(v,'v')
  };

  // 查询
  const extra = (<>
    <Button type="primary" onClick={() => handleSearch()}>查 询</Button>
    <Button style={{ marginLeft: 8 }} onClick={() => handleReset()}>重 置</Button></>
  );

  const itemMenu = (
    <Menu>
      <Menu.Item
        onClick={(v) => handletoRun(v)}
      >
        <span>
          <Icon type="caret-right" />
          执行一次
        </span>
      </Menu.Item>
      <Menu.Item
      // onClick={() => {

      // }}
      >
        <span>
          <Icon type="eye" />
          任务详细
        </span>
      </Menu.Item><Menu.Item
      // onClick={() => {

      // }}
      >
        <span>
          <Icon type="bars" />
          调度日志
        </span>
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: '任务编号',
      dataIndex: 'jobId',
      key: 'jobId',
      fixed: 'left',
      width: 120,
      sorter: (a, b) => a.jobId - b.jobId,
    },
    {
      title: '任务名称',
      dataIndex: 'jobName',
      key: 'jobName',
      width: 200,
    },
    {
      title: '任务组名',
      dataIndex: 'jobGroup',
      key: 'jobGroup',
      width: 100,
    },
    {
      title: '是否并发执行',
      dataIndex: 'concurrentExt',
      key: 'concurrentExt',
      width: 250,
    },
    {
      title: '调用目标字符串',
      dataIndex: 'invokeTarget',
      key: 'invokeTarget',
      width: 250,
    },
    {
      title: 'cron执行表达式',
      dataIndex: 'cronExpression',
      key: 'cronExpression',
      width: 250,
    },
    {
      title: '状态',
      dataIndex: 'statusExt',
      key: 'statusExt',
      width: 100,
      render: (text, record) => {
        const statusmap = new Map([
          ['0', true],
          ['1', false],
        ]);
        return (
          // <Popconfirm title="确认要启用系统默认（无参）任务吗？" 
          //   onCancel={(checked) => hanldleCancel(checked)}
          //   onConfirm={checked => handleUpdataStatus(checked, record.jobId)}
          // >
          //   <Switch
          //     defaultChecked={statusmap.get(record.status)}
          //     // onClick={checked => handleUpdataStatus(checked, record.jobId)}
          //   />
          // </Popconfirm>
          <Switch
            defaultChecked={statusmap.get(record.status)}
            onClick={checked => handleUpdataStatus(checked, record.jobId)}
          />
        );
      },
    },
    {
      title: '计划执行错误策略',
      dataIndex: 'misfirePolicyExt',
      key: 'misfirePolicyExt',
      width: 250,
    },
    {
      title: '任务备注',
      dataIndex: 'remark',
      key: 'remark',
      width: 250,
    },
    {
      title: '创建人',
      dataIndex: 'createByExt',
      key: 'createByExt',
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 250,
    },
    {
      title: '更新人',
      dataIndex: 'updateByExt',
      key: 'updateByExt',
      width: 100,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 250,
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      fixed: 'right',
      width: 200,
      render: (text, record) => {
        return (
          <div>
            <a type="link" onClick={() => handleShowModal('编辑任务', 'update', record)}>
              编辑
            </a>
            <Divider type="vertical" />
            <a type="link" style={{ color: 'red' }} onClick={() => handleDelete(record.jobId)}>
              删除
            </a>
            <Divider type="vertical" />
            <Dropdown
              overlay={itemMenu}
              placement="bottomRight"
            >
              <a type="link">
                &gt;更多
              </a>
            </Dropdown>
          </div>
        );
      },
    },
  ];

  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card>
        <Row gutter={8}>
          <Form {...formItemLayout} onSubmit={handleSearch}>
            <Col span={8}>
              <Form.Item label="任务名称">
                {getFieldDecorator('jobName', {
                  initialValue: '',
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="任务组名">
                {getFieldDecorator('jobGroup', {
                  initialValue: '',
                })(
                  <Select placeholder="请选择" allowClear>
                    {taskName.map(obj => (
                      <Option key={obj.key} value={obj.title}>
                        {obj.title}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="任务状态">
                {getFieldDecorator('status', {
                  initialValue: '',
                })(
                  <Select placeholder="请选择" allowClear>
                    {taskStatus.map(obj => (
                      <Option key={obj.key} value={obj.key}>
                        {obj.title}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="并发执行">
                {getFieldDecorator('concurrent', {
                  initialValue: '',
                })(
                  <Select placeholder="请选择" allowClear>
                    {concurrentmap.map(obj => (
                      <Option key={obj.key} value={obj.key}>
                        {obj.title}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label='调用方法'>
                {getFieldDecorator('invokeTarget', {})(
                  <Input placeholder="请输入调用目标字符串" />
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label='任务备注'>
                {getFieldDecorator('remark', {})(
                  <Input placeholder="请输入" />
                )}
              </Form.Item>
            </Col>
            <Col span={24} style={{ textAlign: 'right', paddingTop: 4 }}>{extra}</Col>
          </Form>
        </Row>

        <div style={{ marginBottom: 24 }}>
          <Button type="primary" style={{ marginRight: 8 }}
            onClick={() => handleShowModal('添加任务', 'add')}
            disabled={hasSelected1}
          >
            新增
          </Button>
          <Button type="primary" style={{ marginRight: 8 }}
            onClick={() => handleShowModal('编辑任务', 'update', selectedRows[0])}
            disabled={!hasSelected}>
            编辑
          </Button>
          <Button type="danger" ghost style={{ marginRight: 8 }} onClick={() => handleDeletes()}>删 除</Button>
          <Button type="primary" style={{ marginRight: 8 }}>
            导出数据
          </Button>
          <Button type="primary" style={{ marginRight: 8 }}>日 志</Button>
        </div>
        < Table
          loading={loading}
          columns={columns}
          dataSource={qrtzjoblist.rows}
          pagination={pagination}
          rowSelection={rowSelection}
          rowKey={r => r.jobId}
          scroll={{ x: 1500 }}
        />
      </Card>
      {/* 弹窗 */}
      <TaskModal
        visible={visible}
        dispatch={dispatch}
        ChangeVisible={newvalue => setVisible(newvalue)}
        title={title}
        centered
        handleSubmit={newvalue => handleSubmit(newvalue)}
        record={data}
        destroyOnClose
      />
    </PageHeaderWrapper >
  );
}

export default Form.create({})(
  connect(({ timedtaskmodel, loading }) => ({
    qrtzjoblist: timedtaskmodel.qrtzjoblist,
    loading: loading.models.timedtaskmodel,
  }))(TimedTask),
);