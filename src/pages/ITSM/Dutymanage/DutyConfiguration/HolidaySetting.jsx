import React from 'react';
import {
  Table,
  Button,
  Card,
  Switch
} from 'antd';
import AddholidaySetting from './components/AddholidaySetting';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const columns = [
  {
    title: '方案名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '启动方案',
    dataIndex: 'start',
    key: 'start',
    render: (text, record) => {
      return (
        <Switch />
      )
    }
  },
  {
    title: '创建时间',
    dataIndex: 'time',
    key: 'time'
  },
]

const dataSource = [{
  name: 'name',
  start: 'start',
  time: 'time'
}]

function HolidaySetting(props) {
  const { pagetitle } = props.route.name;
  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card>
        <AddholidaySetting>
          <Button
            style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
            icon='plus'
          >
            新建节假日
          </Button>
        </AddholidaySetting>


        <Table
          columns={columns}
          dataSource={dataSource}
          scroll={{ x: 1500, y: 700 }}
        />
      </Card>

    </PageHeaderWrapper>
  )
}

export default HolidaySetting;