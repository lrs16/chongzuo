import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Table, Card, Divider, Button, Switch, Message, Popconfirm } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import DictLower from '@/components/SysDict/DictLower';
import ExpressionDrawer from './components/ExpressionDrawer';

function Expressions(props) {
  const pagetitle = props.route.name;
  const { dispatch, list, loading } = props;
  const [visible, setVisible] = useState(false); // 抽屉是否显示
  const [title, setTitle] = useState('');
  const [selectdata, setSelectData] = useState([]); // 数据字典
  const [savetype, setSaveType] = useState(''); // 保存类型  save:新建  update:编辑
  const [data, setData] = useState('');
  // const [paginations, setPageinations] = useState({ current: 1, pageSize: 10 });

  const getdatas = () => {
    dispatch({
      type: 'expressionsmanage/query',
      payload: {
        field: '',
        content: '',
        status: '',
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

  const getTypebykey = key => {
    const datas = selectdata[0]?.children;
    if (selectdata.length > 0) {
      return datas.filter(item => item.key === key)[0].children;
    }
    return [];
  };

  const modulemap = getTypebykey('1366665314435076097'); // 工单类型
  const fieldmap = getTypebykey('1366665671789776897'); // 对应字段

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
        <Button
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          type="dashed"
          icon="plus"
          onClick={() => handleShowDrawer('新建常用语', 'save')}
        >
          新建常用语
        </Button>
        <Table
          columns={columns}
          dataSource={list}
          loading={loading}
          rowKey={(_, index) => index.toString()}
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
        typeid="1366665043004887042"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
    </PageHeaderWrapper>
  );
}

export default connect(({ expressionsmanage, loading }) => ({
  list: expressionsmanage.list,
  loading: loading.models.expressionsmanage,
}))(Expressions);
