import React, { useState } from 'react';
import { Table, Row, Button, Col } from 'antd';

const columns = [
  {
    title: '序号',
    dataIndex: 'key',
    key: 'key',
    align: 'center',
  },
  {
    title: '功能类型',
    dataIndex: 't1',
    key: 't1',
  },
  {
    title: '模块',
    dataIndex: 't2',
    key: 't2',
  },
  {
    title: '功能名称',
    dataIndex: 't3',
    key: 't3',
  },
  {
    title: '问题类型',
    dataIndex: 't4',
    key: 't4',
  },
  {
    title: '测试内容及预期效果',
    dataIndex: 't5',
    key: 't5',
  },
  {
    title: '是否通过',
    dataIndex: 't6',
    key: 't6',
  },
  {
    title: '开发人员',
    dataIndex: 't7',
    key: 't7',
  },
  {
    title: '操作人员',
    dataIndex: 't8',
    key: 't8',
  },
];

function EditeTable(props) {
  const { title } = props;
  const [data, setData] = useState([]);
  const [newbutton, setNewButton] = useState(false);

  // 新增一条记录
  const newMember = () => {
    // setFilesList([]);
    // setKeyUpload('');
    //  const newData = data.map(item => ({ ...item }));
    data.push({
      key: data.length + 1,
      t1: '',
      t2: '',
      t3: '',
      t4: '',
      t5: '',
      t6: '',
      t7: '',
      t8: '',
    });
    //  setData(newData);
    setNewButton(true);
  };
  return (
    <>
      <Row style={{ marginBottom: 8 }} type='flex' align='bottom'>
        <Col span={18}>
          <h4><span style={{ color: '#f5222d', marginRight: 4, fontWeight: 'normal' }}>*</span>{title}</h4>
          <span><b>前台功能统计：</b>
          缺陷修复项<b style={{ color: '#1890ff', padding: '0 3px' }}>0</b>项，
          变更功能项<b style={{ color: '#1890ff', padding: '0 3px' }}>0</b>项，
          完善功能项<b style={{ color: '#1890ff', padding: '0 3px' }}>0</b>项。
          <b>后台功能统计：</b>
          缺陷修复<b style={{ color: '#1890ff', padding: '0 3px' }}>0</b>项，
          变更功能<b style={{ color: '#1890ff', padding: '0 3px' }}>0</b>项，
          完善功能项<b style={{ color: '#1890ff', padding: '0 3px' }}>0</b>项。</span>
        </Col>
        <Col span={6} style={{ textAlign: 'right' }}>
          <Button
            type='primary'
            style={{ marginRight: 8 }}
            onClick={() => newMember()}
            disabled={newbutton}
          >新增</Button>
          <Button type='danger' style={{ marginRight: 8 }} ghost>移除</Button>
          <Button type='primary' >导出清单</Button>
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={data}
        bordered
        size='middle'
        pagination={false}
      />
    </>
  );
}

export default EditeTable;