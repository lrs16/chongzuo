/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { Table, Divider, Badge, Popconfirm, Message } from 'antd';
import moment from 'moment';
import DeptModal from './DeptModal';

const statusMap = ['success', 'default'];
const status = ['启用', '停用'];
class DeptList extends Component {
  onEdite(values) {
    this.props.doEdite(values);
  }

  onDelete = id => {
    this.props.DeleteData(id);
  };

  render() {
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '上级编号',
        dataIndex: 'pid',
        key: 'pid',
      },
      {
        title: '组织序号',
        dataIndex: 'deptSort',
        key: 'deptSort',
      },
      {
        title: '组织名称',
        dataIndex: 'deptName',
        key: 'deptName',
      },

      {
        title: '更新时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        sorter: (a, b) => a.name.length - b.name.length,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '启用状态',
        dataIndex: 'deptStatus',
        key: 'deptStatus',
        render: (text, record) => (
          <span>
            <Badge status={statusMap[record.deptStatus]} text={status[record.deptStatus]} />
          </span>
        ),
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => (
          <div>
            <DeptModal onSumit={values => this.onEdite(values)} title="编辑脚本" record={record}>
              <a type="link">编辑</a>
            </DeptModal>
            <Divider type="vertical" />
            <Popconfirm title="确定删除此菜单吗？" onConfirm={() => this.onDelete(record.id)}>
              <a type="link">删除</a>
            </Popconfirm>
          </div>
        ),
      },
    ];
    const pagination = {
      showSizeChanger: true,
      onShowSizeChange: (current, pageSize) => this.onShowSizeChange(current, pageSize),
      current: this.state.current,
      pageSize: this.state.pageSize,
      total: this.props.total,
      onChange: page => this.changePage(page),
    };
    const dataSource = this.props.datas;
    return (
      <div>
        <Table 
        dataSource = {dataSource} 
        columns = {columns} 
        rowKey = {record => record.id} 
        pagination = {pagination}
        />
      </div>
    );
  }
}

export default DeptList;
