import React, { useState } from 'react';
import {
  Table,
  Button,
  Card,
  Switch,
  Divider,
  message,
  Form,
  Popconfirm
} from 'antd';
import { connect } from 'dva';
import AddholidaySetting from './components/AddholidaySetting';
import { PageHeaderWrapper } from '@ant-design/pro-layout';



const dataSource = [{
  name: 'name',
  start: 'start',
  time: 'time'
}]

function HolidaySetting(props) {
  const {
    loading,
    dispatch,
    form: { getFieldsValue }
  } = props;
  const { pagetitle } = props.route.name;
  const [paginations, setPaginations] = useState({ current: 0, pageSize: 15 });
  const [selectedKeys, setSelectedKeys] = useState([]);

  const handleDelete = (id) => {
    return dispatch({
      type: 'qualityassessment/providerDel',
      payload: id
    }).then(res => {
      if (res.code === 200) {
        message.info(res.msg);
        searchdata({}, 1, paginations.pageSize)
      } else {
        message.error(res.msg);
      }
    })
  }

  const switchOnchange = (record,id) => {
  }

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
          <Switch 
            onChange={()=>switchOnchange(record,record.id)}
          />
        )
      }
    },
    {
      title: '创建时间',
      dataIndex: 'time',
      key: 'time'
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (text, record) => {
        return (
          <>
            <AddholidaySetting
              title='编辑节假日'
            >
              <a>编辑</a>
            </AddholidaySetting>
            <Divider type='vertical' />
            <Popconfirm
              title='是否要删除该条数据'
              onConfirm={() => handleDelete(record.id)}
            >
              <a>删除</a>
            </Popconfirm>
          </>
        )
      }

    }
  ]

  const onShowSizeChange = (page, pageSize) => {
    const formdata = getFieldsValue();
    searchdata(formdata, page, pageSize)
    setPaginations({
      ...paginations,
      pageSize
    })
  }

  const changePage = page => {
    const formdata = getFieldsValue();
    searchdata(formdata, page, paginations.pageSize)

    setPaginations({
      ...paginations,
      current: page
    })
  }

  const rowSelection = {
    onChange: (index) => {
      setSelectedKeys([...index])
    }
  }

  const pagination = {
    showSizeChanger: true,
    onShowSizeChange: (page, pagesize) => onShowSizeChange(page, pagesize),
    current: paginations.current,
    pageSize: paginations.pageSize,
    // total: providerArr.total,
    showTotal: total => `总共 ${total} 条记录`,
    onChange: (page) => changePage(page)
  }

  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card>
        <AddholidaySetting
          title='新建节假日'
        >
          <Button
            style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
            icon='plus'
          >
            新建节假日
          </Button>
        </AddholidaySetting>


        <Table
          loading={loading}
          columns={columns}
          dataSource={dataSource}
          rowKey={records => records.id}
          pagination={paginations}
          rowSelection={rowSelection}
          scroll={{ x: 800, y: 700 }}
        />
      </Card>

    </PageHeaderWrapper>
  )
}

export default Form.create({})(
  connect(({ qualityassessment, loading }) => ({
    providerArr: qualityassessment.providerArr,
    loading: loading.models.qualityassessment
  }))(HolidaySetting)
)