import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Card, Form, Row, Col, Select, Button, Table, Message, Divider, Popconfirm } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { querkeyVal } from '@/services/api';
import TimeRulesDrawer from './components/TimeRulesDrawer';

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

function TimeRules(props) {
  const pagetitle = props.route.name;
  const { dispatch, list, listtotal, loading } = props;
  const { getFieldDecorator, resetFields, validateFields } = props.form;
  const [visible, setVisible] = useState(false); // 抽屉是否显示
  const [title, setTitle] = useState('');
  const [savetype, setSaveType] = useState(''); // 保存类型  save:新建  update:编辑
  const [data, setData] = useState('');
  const [paginations, setPageinations] = useState({ current: 0, pageSize: 10 });
  const [servicetype, setServiceType] = useState([]);
  const [ordertype, setOrderType] = useState([]);
  // 请求数据字典
  useEffect(() => {
    querkeyVal('servicetype', 'service').then(res => {
      if (res.code === 200) {
        const arr = [...res.data.service];
        setServiceType(arr);
      }
    });
    querkeyVal('order', 'priority').then(res => {
      if (res.code === 200) {
        const arr = [...res.data.priority];
        setOrderType(arr);
      }
    });
  }, []);
  const getdatas = () => {
    dispatch({
      type: 'timerule/query',
      payload: {
        pageIndex: paginations.current,
        pageSize: paginations.pageSize,
      },
    });
  };

  useEffect(() => {
    getdatas();
  }, []);

  const handleShowDrawer = (drwertitle, type, record) => {
    setVisible(!visible);
    setTitle(drwertitle);
    setSaveType(type);
    setData(record);
  };

  // 提交
  const handleSubmit = values => {
    if (savetype === 'save') {
      dispatch({
        type: 'timerule/save',
        payload: {
          ...values,
          dept: values.dept !== '' ? values.dept : values.unit,
          deptId: values.deptId !== '' ? values.deptId : values.unitId,
        },
      }).then(res => {
        Message.success(res.msg);
        if (res.code === 200) {
          getdatas();
        }
      });
    }
    if (savetype === 'update') {
      dispatch({
        type: 'timerule/update',
        payload: {
          ...values,
          dept: values.dept !== '' ? values.dept : values.unit,
          deptId: values.deptId !== '' ? values.deptId : values.unitId,
        },
      }).then(res => {
        Message.success(res.msg);
        if (res.code === 200) {
          getdatas();
        }
      });
    }
  };

  // 删除
  const handleDelete = ids => {
    dispatch({
      type: 'timerule/delete',
      payload: { ids },
    }).then(res => {
      Message.success(res.msg);
      if (res.code === 200) {
        getdatas();
      }
    });
  };

  const searchdata = (values, page, size) => {
    dispatch({
      type: 'timerule/query',
      payload: {
        ...values,
        pageIndex: page,
        pageSize: size,
      },
    });
  };

  const onShowSizeChange = (page, size) => {
    validateFields((err, values) => {
      if (!err) {
        searchdata(values, page, size);
      }
    });
    setPageinations({
      ...paginations,
      pageSize: size,
    });
  };

  const changePage = page => {
    validateFields((err, values) => {
      if (!err) {
        searchdata(values, page, paginations.pageSize);
      }
    });
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
    total: listtotal,
    showTotal: total => `总共  ${total}  条记录`,
    onChange: page => changePage(page),
  };

  const handleSearch = () => {
    setPageinations({
      ...paginations,
      current: 0,
    });
    validateFields((err, values) => {
      if (err) {
        return;
      }
      searchdata(values, paginations.current, paginations.pageSize);
    });
  };
  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '模块',
      dataIndex: 'module',
      key: 'module',
      sorter: (a, b) => a.module - b.module,
      render: text => {
        const textmaps = new Map([
          ['event', '事件管理'],
          ['problem', '问题管理'],
          ['trouble', '故障管理'],
          ['demand', '需求管理'],
        ]);
        return <>{textmaps.get(text)}</>;
      },
    },
    {
      title: '优先级',
      dataIndex: 'prior',
      key: 'prior',
      sorter: (a, b) => a.prior - b.prior,
      render: text => {
        const textmaps = new Map([
          ['001', '低'],
          ['002', '中'],
          ['003', '高'],
        ]);
        return <>{textmaps.get(text)}</>;
      },
    },
    {
      title: '工单提醒（分）',
      dataIndex: 'orderRemind',
      key: 'orderRemind',
    },
    {
      title: '工单超时（分）',
      dataIndex: 'orderTimeout',
      key: 'orderTimeout',
    },
    {
      title: '响应提醒（分）',
      dataIndex: 'respondRemind',
      key: 'respondRemind',
    },
    {
      title: '响应超时（分）',
      dataIndex: 'respondTimeout',
      key: 'respondTimeout',
    },

    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      fixed: 'right',
      width: 150,
      render: (text, record) => {
        return (
          <div>
            <a type="link" onClick={() => handleShowDrawer('编辑超时规则', 'update', record)}>
              编辑
            </a>
            <Divider type="vertical" />
            <Popconfirm title="确定删除该超时规则吗？" onConfirm={() => handleDelete(record.id)}>
              <a type="link">删除</a>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card>
        {/* <Row gutter={24}>
          <Form {...formItemLayout}>
            <Col span={8}>
              <Form.Item label="业务类型">
                {getFieldDecorator('module', {
                  initialValue: ''
                })(
                  <Select placeholder="请选择">
                    {servicetype.map(({ key, val }) => (
                      <Option key={key} value={key}>
                        {val}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="优先级">
                {getFieldDecorator('prior', { initialValue: '' })(
                  <Select placeholder="请选择">
                    {ordertype.map(({ key, val }) => (
                      <Option key={key} value={key}>
                        {val}
                      </Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item>
                <Button type="primary" onClick={handleSearch}>
                  查 询
                  </Button>
                <Button style={{ marginLeft: 8 }} onClick={() => { resetFields(); getdatas() }}>
                  重 置
                  </Button>
              </Form.Item>
            </Col>
          </Form>
        </Row> */}
        <Button
          block
          style={{ marginBottom: 8 }}
          type="dashed"
          icon="plus"
          onClick={() => handleShowDrawer('新建超时规则', 'save')}
        >
          新建超时规则
        </Button>
        <Table
          columns={columns}
          dataSource={list}
          loading={loading}
          rowKey={(_, index) => index.toString()}
          pagination={pagination}
        />
      </Card>
      <TimeRulesDrawer
        visible={visible}
        ChangeVisible={newvalue => setVisible(newvalue)}
        title={title}
        handleSubmit={newvalue => handleSubmit(newvalue)}
        record={data}
        servicetype={servicetype}
        ordertype={ordertype}
        destroyOnClose
      />
    </PageHeaderWrapper>
  );
}

export default Form.create()(
  connect(({ timerule, loading }) => ({
    list: timerule.list,
    total: timerule.total,
    loading: loading.models.timerule,
  }))(TimeRules),
);
