import React from 'react';
import { Card, Row, Col, Form, Input, Button, Table, Select, DatePicker, Message } from 'antd';
import moment from 'moment';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const { Search } = Input;

const index = props => {
  const handleSearch = values => {
    console.log(values);
  };

  let pagetitle = props.route.name;
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '下拉值分类',
      dataIndex: 'dropClass',
      key: 'dropClass',
    },
    {
      title: '下拉值名称',
      dataIndex: 'dropCode',
      key: 'menuUrl',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      sorter: (a, b) => a.name.length - b.name.length,
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (text, record) => (
        <div>
          <a type="link">编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="确定删除此菜单吗？">
            <a type="link">删除</a>
          </Popconfirm>
        </div>
      ),
    },
  ];
  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card>
        <Form style={{ float: 'right', width: '30%' }}>
          <Search placeholder="请输入关键字" onSearch={values => handleSearch(values)} />
        </Form>
        <Button style={{ width: '100%', marginTop: 16, marginBottom: 8 }} type="dashed" icon="plus">
          新建下拉值
        </Button>
        <Table columns={columns} />
      </Card>
    </PageHeaderWrapper>
  );
};

export default index;
