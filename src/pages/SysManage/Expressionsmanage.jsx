import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Table, Card, Divider, Button, Switch } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import DictLower from '@/components/SysDict/DictLower';
import ExpressionDrawer from './components/ExpressionDrawer';

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
    // render: (text, record) => {
    //   const modulemap = new Map([
    //     ['event', '事件'],
    //     ['problem', '问题'],
    //     ['fault', '故障'],
    //     ['demand', '需求'],
    //   ]);
    //   return modulemap.get(text);
    // },
  },
  {
    title: '启用状态',
    dataIndex: 'status',
    key: 'status',
    render: text => {
      const statusmap = new Map([
        ['1', true],
        ['0', false],
      ]);
      return (
        <Switch checkedChildren="启用" unCheckedChildren="停用" checked={statusmap.get(text)} />
      );
    },
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    fixed: 'right',
    width: 150,
    render: (text, record) => (
      <div>
        <a type="link">编辑</a>
        <Divider type="vertical" />
        <a type="link">删除</a>
        {/* <MenuModal
          onSumit={values => handleEdite(values)}
          title="编辑菜单"
          record={record}
          pidkey={record.pid}
        >
          <a type="link">编辑</a>
        </MenuModal>
        
        <Popconfirm title="确定删除此菜单吗？" onConfirm={() => handleDelete(record.id)}>
          <a type="link">删除</a>
        </Popconfirm> */}
      </div>
    ),
  },
];

function Expressions(props) {
  const pagetitle = props.route.name;
  const { dispatch, list, loading } = props;
  const [visible, setVisible] = useState(false); // 抽屉是否显示
  const [title, setTitle] = useState('');
  const [selectdata, setSelectData] = useState([]); // 数据字典
  const [savetype, setSaveType] = useState(''); // 保存类型  save:新建  update:编辑
  const [issubmit, setIsSubmit] = useState(''); // 提交

  useEffect(() => {
    dispatch({
      type: 'expressionsmanage/query',
      payload: {
        field: '',
        content: '',
        status: '',
      },
    });
  }, []);

  const handleShowDrawer = (drwertitle, savetype) => {
    setVisible(!visible);
    setTitle(drwertitle);
    setSaveType(savetype);
  };

  // 提交
  useEffect(() => {
    console.log('提交');
  }, [issubmit]);

  const getTypebykey = key => {
    console.log(selectdata);
    if (selectdata.length > 0) {
      return selectdata.filter(item => item.key === key)[0].children;
    }
    return [];
  };

  const modulemap = getTypebykey('1366665314435076097'); // 事件来源
  const fieldmap = getTypebykey('1366665671789776897'); // 工单状态

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
        handleSubmit={newvalue => setIsSubmit(newvalue)}
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
