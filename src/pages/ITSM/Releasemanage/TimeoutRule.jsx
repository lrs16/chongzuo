import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Table, Card, Divider, Button, Message, Popconfirm, Form, Input, Select, Row, Col, DatePicker } from 'antd';
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
      type: 'agentmanage/query',
      payload: {
        pageNum: page,
        pageSize: size,
      },
    });
  };

  // useEffect(() => {
  //   searchdata(1, 30);
  // }, [location]);

  const handleShowDrawer = (drwertitle, type, record) => {
    setVisible(!visible);
    setTitle(drwertitle);
    setSaveType(type);
    setData(record);
  };

  // 提交
  const handleSubmit = values => {
    dispatch({
      type: 'agentmanage/update',
      payload: {
        ...values,
      },
    }).then(res => {
      if (res.code === 200) {
        Message.success(res.msg);
        searchdata(1, 30);
      }
    });
  };


  const columns = [
    {
      title: '发布类型',
      dataIndex: 'agentName',
      key: 'agentName',
    },
    {
      title: '环节名称',
      dataIndex: 'agentHost',
      key: 'agentHost',
    },
    {
      title: '操作开始日期（日）',
      dataIndex: 'agentHyper',
      key: 'agentHyper',
    },
    {
      title: '操作结束日期（日）',
      dataIndex: 'agentPort',
      key: 'agentPort',
    },
    {
      title: '超时提醒（日）',
      dataIndex: 'agentZone',
      key: 'agentZone',
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      fixed: 'right',
      render: (text, record) => {
        return (
          <div>
            <a type="link" onClick={() => handleShowDrawer('编辑超时规则', 'update', record)}>
              编辑
            </a>
            <a type="link" onClick={() => handleShowDrawer('编辑超时规则', 'update', record)}>
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
          dataSource={[]}
          loading={loading}
          rowKey={(_, index) => index.toString()}
          scroll={{ x: 1300 }}
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
        destroyOnClose
      />
    </PageHeaderWrapper>
  );
}

export default connect(({ releasetodo, releaseview, loading }) => ({
  info: releasetodo.info,
  currentTaskStatus: releasetodo.currentTaskStatus,
  loading: loading.models.releasetodo,
}))(TimeoutRule);