import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import {
  Table,
  Form,
  Input,
  Button,
  Popconfirm,
  Card,
  DatePicker,
  Collapse,
  Tabs
} from 'antd';

const { TabPane } = Tabs;

function Relatedorder(props) {
  const [tablecolumns, setTablecolumns] = useState('');
  const [tablenum,setTablenum] = useState('1');

  const columns = [
    {
      title: '序号',
      dataIndex: '',
      key: ''
    },
    {
      title: `${tablenum === '1' ? '故障单编号' : '发布单编号'}`,
      dataIndex: '',
      key: ''
    },
    {
      title: '标题',
      dataIndex: '',
      key: ''
    },
    {
      title: '状态',
      dataIndex: '',
      key: ''
    },
    {
      title: '关联类型',
      dataIndex: '',
      key: ''
    },
  ];

  useEffect(() => {
    setTablecolumns(columns)
  }, [tablenum]);

  const callback = (key) => {
    setTablenum(key)
    setTablecolumns(columns)
  }

  return (
    <Card>
      {
        tablecolumns && (
          <Tabs onChange={callback}>
            <TabPane tab='故障单' key='1' >
              <Table columns={tablecolumns}/>
            </TabPane>

            <TabPane tab='发布单' key='2'>
              <Table columns={tablecolumns} />
            </TabPane>
          </Tabs>
        )
      }

    </Card>

  )
}

export default Relatedorder;