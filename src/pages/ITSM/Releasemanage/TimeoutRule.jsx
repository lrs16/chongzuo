import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Table, Card, Divider, Button, Message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import DictLower from '@/components/SysDict/DictLower';
import TimeoutDrawer from './components/TimeoutDrawer';

function TimeoutRule(props) {
  const pagetitle = props.route.name;
  const {
    dispatch, list, loading, location,
  } = props;
  const [selectdata, setSelectData] = useState({ arr: [], ischange: false }); // 下拉值
  const [visible, setVisible] = useState(false); // 抽屉是否显示
  const [title, setTitle] = useState('');
  const [savetype, setSaveType] = useState(''); // 保存类型  save:新建  update:编辑
  const [data, setData] = useState('');

  const searchdata = (page, size) => {
    dispatch({
      type: 'releasetimeout/fetchlist',
      payload: {
        pageIndex: page,
        pageSize: size,
        releaseType: '',
        taskName: '',
      },
    });
  };

  useEffect(() => {
    searchdata(1, 30);
  }, [location]);

  const handleShowDrawer = (drwertitle, type, record) => {
    setVisible(!visible);
    setTitle(drwertitle);
    setSaveType(type);
    setData(record);
  };

  // 提交
  const handleSubmit = values => {
    dispatch({
      type: 'releasetimeout/update',
      payload: {
        ...values,
      },
    }).then(res => {
      if (res.code === 200) {
        Message.success(res.msg);
        searchdata(1, 30);
      } else {
        Message.error(res.msg);
      }
    });
  };

  // 删除
  const handleDelete = id => {
    dispatch({
      type: 'releasetimeout/delete',
      payload: {
        id,
      },
    }).then(res => {
      if (res.code === 200) {
        Message.success(res.msg);
        searchdata(1, 30);
      } else {
        Message.error(res.msg);
      }
    });
  };


  const columns = [
    {
      title: '发布类型',
      dataIndex: 'releaseType',
      key: 'releaseType',
      align: 'center',
      sorter: (a, b) => a.taskName.localeCompare(b.releaseType),
    },
    {
      title: '环节名称',
      dataIndex: 'taskName',
      key: 'taskName',
      sorter: (a, b) => a.taskName.localeCompare(b.taskName),
    },
    {
      title: '操作开始日期（日）',
      dataIndex: 'beginMonth',
      key: 'beginMonth',
      colSpan: 2,
      align: 'center',
    },
    {
      title: '操作开始日期（日）',
      dataIndex: 'beginDay',
      key: 'beginDay',
      colSpan: 0,
      align: 'center',
    },
    {
      title: '操作结束日期（日）',
      dataIndex: 'endMonth',
      key: 'endMonth',
      colSpan: 2,
      align: 'center',
    },
    {
      title: '操作结束日期（日）',
      dataIndex: 'endDay',
      key: 'endDay',
      align: 'center',
      colSpan: 0,
    },
    {
      title: '超时提醒（日）',
      dataIndex: 'remindDay',
      key: 'remindDay',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      render: (text, record) => {
        return (
          <div>
            <a type="link" onClick={() => handleShowDrawer('编辑超时规则', 'update', record)}>
              编辑
            </a>
            <Divider type="vertical" />
            <a type="link" onClick={() => handleDelete(record.id)}>
              删除
            </a>
          </div>
        );
      },
    },
  ];

  return (
    <PageHeaderWrapper title={pagetitle}>
      <DictLower
        typeid="1379323239808897026"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Card>
        <Button
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          type="dashed"
          icon="plus"
          onClick={() => handleShowDrawer('新建超时规则', 'save')}
        >
          新建超时规则
        </Button>
        <Table
          columns={columns}
          dataSource={list.records}
          pagination={false}
          loading={loading}
          rowKey={(_, index) => index.toString()}
          bordered
        />
      </Card>
      {/* 抽屉 */}
      <TimeoutDrawer
        visible={visible}
        ChangeVisible={newvalue => setVisible(newvalue)}
        title={title}
        handleSubmit={newvalue => handleSubmit(newvalue)}
        record={data}
        selectdata={selectdata}
        savetype={savetype}
        destroyOnClose
      />
    </PageHeaderWrapper>
  );
}

export default connect(({ releasetimeout, loading }) => ({
  list: releasetimeout.list,
  loading: loading.models.releasetimeout,
}))(TimeoutRule);