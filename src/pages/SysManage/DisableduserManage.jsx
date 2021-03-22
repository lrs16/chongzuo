import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Table, Card, Divider, Button, Switch, Message, Popconfirm, Form, Input } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import DisableduserDrawer from './components/DisableduserDrawer';

const { Search } = Input;

function DisableduserManage(props) {
  const pagetitle = props.route.name;
  const {
    dispatch,
    list,
    loading,
    form: { getFieldDecorator, validateFields },
  } = props;
  const [visible, setVisible] = useState(false); // 抽屉是否显示
  const [title, setTitle] = useState('');
  const [savetype, setSaveType] = useState(''); // 保存类型  save:新建  update:编辑
  const [data, setData] = useState('');
  const [paginations, setPageinations] = useState({ current: 0, pageSize: 15 });

  const getdatas = () => {
    dispatch({
      type: 'disabledusermanage/query',
      payload: {
        user: '',
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
        type: 'disabledusermanage/save',
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
        type: 'disabledusermanage/update',
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
      type: 'disabledusermanage/delete',
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
      type: 'disabledusermanage/query',
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
    total: list.total,
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
      width: 180,
    },
    {
      title: '姓名',
      dataIndex: 'user',
      key: 'user',
      width: 80,
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
      width: 120,
    },
    {
      title: '手机',
      dataIndex: 'mobile',
      key: 'mobile',
      width: 120,
    },
    {
      title: '公司',
      dataIndex: 'unit',
      key: 'unit',
    },
    {
      title: '部门',
      dataIndex: 'dept',
      key: 'dept',
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
            <a type="link" onClick={() => handleShowDrawer('编辑报障用户', 'update', record)}>
              编辑
            </a>
            <Divider type="vertical" />
            <Popconfirm title="确定删除该报障用户吗？" onConfirm={() => handleDelete(record.id)}>
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
        <Form style={{ float: 'right', width: '30%' }}>
          {getFieldDecorator(
            'user',
            {},
          )(<Search placeholder="请输入姓名查询" onSearch={values => handleSearch(values)} />)}
        </Form>
        <Button
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          type="dashed"
          icon="plus"
          onClick={() => handleShowDrawer('新建报障用户', 'save')}
        >
          新建报障用户
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
      <DisableduserDrawer
        visible={visible}
        ChangeVisible={newvalue => setVisible(newvalue)}
        title={title}
        handleSubmit={newvalue => handleSubmit(newvalue)}
        record={data}
        destroyOnClose
      />
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ disabledusermanage, loading }) => ({
    list: disabledusermanage.list,
    loading: loading.models.disabledusermanage,
  }))(DisableduserManage),
);
