import React from 'react';
import { Table, Button, Icon } from 'antd';

const columns = [
  {
    title: '序号',
    dataIndex: 'key',
    key: 'key',
    width: 60,
    align: 'center',
    render: (text, record, index) => {
      return <>{`${index + 1}`}</>;
    },
  },
  {
    title: '文档名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '附件上传',
    dataIndex: 'type',
    key: 'type',
    render: () => {
      return <><Button type='link'><Icon type='upload' />上传文件</Button></>;
    },
  },
  {
    title: '责任单位',
    dataIndex: 'unit',
    key: 'unit',
  },
  {
    title: '文档模板',
    dataIndex: 'mobail',
    key: 'mobail',
    render: () => {
      return <><Button type='link'><Icon type='download' />下载</Button></>;
    },
  },
  {
    title: '备注',
    dataIndex: 'des',
    key: 'des',
  },
];
const dataSource = [
  { name: '功能出厂测试报告', type: '', unit: '', mobail: '', des: '', },
  { name: '平台验证测试报告', type: '', unit: '', mobail: '', des: '', },
  { name: '业务功能测试报告', type: '', unit: '', mobail: '', des: '', },
  { name: '功能清单终稿', type: '', unit: '', mobail: '', des: '', },
  { name: '发布实施方案', type: '', unit: '', mobail: '', des: '', },
  { name: '计划发布申请审批表', type: '', unit: '', mobail: '', des: '', },
  { name: '临时发布申请审批表', type: '', unit: '', mobail: '', des: '', },
  { name: '功能发布报告', type: '', unit: '', mobail: '', des: '', },
  { name: '其它附件', type: '', unit: '', mobail: '', des: '', },
];

function DocumentAtt(props) {
  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      bordered
      size='middle'
      rowKey={(_, index) => index.toString()}
      pagination={false}
    />
  );
}

export default DocumentAtt;