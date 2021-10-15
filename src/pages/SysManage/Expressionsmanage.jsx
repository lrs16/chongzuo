import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import {
  Table,
  Card,
  Divider,
  Button,
  Switch,
  Message,
  Popconfirm,
  Form,
  Row,
  Col,
  Input,
  Select,
  Radio,
  Spin,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import DictLower from '@/components/SysDict/DictLower';
import ExpressionDrawer from './components/ExpressionDrawer';

const RadioGroup = Radio.Group;
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

function Expressions(props) {
  const pagetitle = props.route.name;
  const {
    dispatch,
    list,
    loading,
    location,
    form: { getFieldDecorator, resetFields, validateFields },
  } = props;
  const [visible, setVisible] = useState(false); // 抽屉是否显示
  const [title, setTitle] = useState('');
  const [selectdata, setSelectData] = useState([]); // 数据字典
  const [savetype, setSaveType] = useState(''); // 保存类型  save:新建  update:编辑
  const [data, setData] = useState('');
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });

  const getdatas = () => {
    dispatch({
      type: 'expressionsmanage/query',
      payload: {
        field: '',
        content: '',
        status: '',
        pageIndex: paginations.current - 1,
        pageSize: paginations.pageSize,
      },
    });
  };

  useEffect(() => {
    getdatas();
  }, []);

  // 重置
  const handleReset = () => {
    router.push({
      pathname: `/sysmanage/expressionsmanage`,
      state: { cach: false, }
    });
    resetFields();
    dispatch({
      type: 'expressionsmanage/query',
      payload: {
        field: '',
        content: '',
        status: '',
        pageIndex: 0,
        pageSize: 15,
      },
    });
    setPageinations({ current: 1, pageSize: 15 });
  };

  useEffect(() => {
    if (location.state && location.state.reset) {
      // 点击菜单刷新
      handleReset()
    }
  }, [location.state]);

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
        type: 'expressionsmanage/save',
        payload: values,
      }).then(res => {
        Message.success(res.msg);
        if (res.code === 200) {
          getdatas();
        }
      });
    }
    if (savetype === 'update') {
      dispatch({
        type: 'expressionsmanage/update',
        payload: values,
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
      type: 'expressionsmanage/delete',
      payload: ids,
    }).then(res => {
      Message.success(res.msg);
      if (res.code === 200) {
        getdatas();
      }
    });
  };

  // 改变使用状态
  const handleUpdataStatus = (checked, id) => {
    const statusmap = new Map([
      [true, '1'],
      [false, '0'],
    ]);
    dispatch({
      type: 'expressionsmanage/delete',
      payload: {
        status: statusmap.get(checked),
        id,
      },
    }).then(res => {
      Message.success(res.msg);
      if (res.code === 200) {
        getdatas();
      }
    });
  };

  const searchdata = (values, page, size) => {
    dispatch({
      type: 'expressionsmanage/query',
      payload: {
        ...values,
        field: '',
        content: '',
        status: '',
        pageIndex: page - 1,
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
    total: list.total,
    showTotal: total => `总共  ${total}  条记录`,
    onChange: page => changePage(page),
  };

  const handleSearch = () => {
    setPageinations({
      ...paginations,
      current: 1,
    });
    validateFields((err, values) => {
      if (err) {
        return;
      }
      searchdata(values, paginations.current, paginations.pageSize);
    });
  };

  const getTypebykey = key => {
    if (selectdata.ischange) {
      const datas = selectdata.arr[0]?.children;
      return datas.filter(item => item.key === key)[0].children;
    }
    return [];
  };

  const modulemap = getTypebykey(406); // 工单类型
  const fieldmap = getTypebykey(407); // 对应字段

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '常用语',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: '工单字段',
      dataIndex: 'field',
      key: 'field',
    },
    {
      title: '工单类型',
      dataIndex: 'module',
      key: 'module',
    },
    {
      title: '启用状态',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => {
        const statusmap = new Map([
          ['1', true],
          ['0', false],
        ]);
        return (
          <Switch
            checkedChildren="启用"
            unCheckedChildren="停用"
            defaultChecked={statusmap.get(text)}
            onClick={checked => handleUpdataStatus(checked, record.id)}
          />
        );
      },
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
            <a type="link" onClick={() => handleShowDrawer('编辑常用语', 'update', record)}>
              编辑
            </a>
            <Divider type="vertical" />
            <Popconfirm title="确定删除此常用语吗？" onConfirm={() => handleDelete(record.id)}>
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
        {selectdata.length > 0 && (
          <Row gutter={24}>
            <Form {...formItemLayout} onSubmit={handleSearch}>
              <Col span={6}>
                <Form.Item label="常用语">
                  {getFieldDecorator('content', {
                    initialValue: '',
                  })(<Input placeholder="请输入" />)}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="工单字段">
                  {getFieldDecorator('field', {
                    initialValue: '',
                  })(
                    <Select placeholder="请选择">
                      {fieldmap.map(obj => [
                        <Option key={obj.key} value={obj.title}>
                          {obj.title}
                        </Option>,
                      ])}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="启用状态">
                  {getFieldDecorator('status', {
                    initialValue: '',
                  })(
                    <RadioGroup>
                      <Radio value="1">启用</Radio>
                      <Radio value="0">停用</Radio>
                    </RadioGroup>,
                  )}
                </Form.Item>
              </Col>
              <Col span={6} style={{ paddingTop: 4, textAlign: 'right' }}>
                <Button type="primary" onClick={handleSearch}>
                  查 询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={handleReset}>
                  重 置
                </Button>
              </Col>
            </Form>
          </Row>
        )}
        <Button
          style={{ width: '100%', marginBottom: 8 }}
          type="dashed"
          icon="plus"
          onClick={() => handleShowDrawer('新建常用语', 'save')}
        >
          新建常用语
        </Button>
        <Table
          columns={columns}
          dataSource={list.rows}
          loading={loading}
          rowKey={(_, index) => index.toString()}
          pagination={pagination}
        />
      </Card>
      {/* 抽屉 */}
      <ExpressionDrawer
        visible={visible}
        ChangeVisible={newvalue => setVisible(newvalue)}
        title={title}
        modulemap={modulemap}
        fieldmap={fieldmap}
        handleSubmit={newvalue => handleSubmit(newvalue)}
        record={data}
      />
      {/* 下拉值 */}
      <DictLower
        typeid="405"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ expressionsmanage, loading }) => ({
    list: expressionsmanage.list,
    loading: loading.models.expressionsmanage,
  }))(Expressions),
);
