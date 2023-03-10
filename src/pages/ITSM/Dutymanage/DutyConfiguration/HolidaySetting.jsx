import React, {
  useState,
  useEffect
} from 'react';
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
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import AddHolidaySetting from './components/AddHolidaySetting';


function HolidaySetting(props) {
  const {
    loading,
    dispatch,
    location,
    holidaySearcharr,
  } = props;
  const { pagetitle } = props.route.name;
  const [paginations, setPaginations] = useState({ current: 1, pageSize: 15 });
  const [selectedKeys, setSelectedKeys] = useState([]);

  const searchdata = (current, size) => {
    const newdata = {
      current,
      size
    }

    dispatch({
      type: 'shiftsandholidays/fetchholidaySearch',
      payload: newdata
    })
  }

  useEffect(() => {
    searchdata(paginations.current, paginations.pageSize)
  }, [])


  const handleDelete = (id) => {
    return dispatch({
      type: 'shiftsandholidays/fetchholidayDel',
      payload: id
    }).then(res => {
      if (res.code === 200) {
        message.success(res.msg);
        searchdata(paginations.current, paginations.pageSize)
      } else {
        message.error(res.msg);
      }
    })
  }

  const handleSubmit = (value) => {
    return dispatch({
      type: 'shiftsandholidays/fetchholidaySave',
      payload: value
    }).then(res => {
      if (res.code === 200) {
        message.success(res.msg)
        searchdata(1, 15)
      } else {
        message.error(res.msg)
      }
    }
    )
  }

  const switchOnchange = (record, id) => {
    dispatch({
      type: 'shiftsandholidays/fetchStart',
      payload: id
    }).then(res => {
      if (res.code === 200) {
        message.success(res.msg);
        searchdata(1, 15)
      } else {
        message.error('操作失败')
      }
    })
  }

  const columns = [
    {
      title: '方案名称',
      dataIndex: 'schemeName',
      key: 'schemeName'
    },
    {
      title: '启动方案',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => {
        return (
          <Switch
            defaultChecked={record.status === '1'}
            onChange={() => switchOnchange(record, record.id)}
          />
        )
      }
    },
    {
      title: '创建时间',
      dataIndex: 'ctime',
      key: 'ctime'
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (text, record) => {
        return (
          <>
            <AddHolidaySetting
              title='编辑节假日'
              id={record.id}
              onSubmit={handleSubmit}
            >
              <a>编辑</a>
            </AddHolidaySetting>
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
    searchdata(page, pageSize)
    setPaginations({
      ...paginations,
      pageSize
    })
  }

  const changePage = page => {
    searchdata(page, paginations.pageSize)

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
    total: holidaySearcharr.total,
    showTotal: total => `总共 ${total} 条记录`,
    onChange: (page) => changePage(page)
  }

  useEffect(() => {
    if (location.state && location.state.reset) {
      searchdata(1, 15)
    }
  }, [location.state]);

  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card>
        <AddHolidaySetting
          title='新建节假日'
          onSubmit={handleSubmit}
          id=''
        >
          <Button
            style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
            icon='plus'
          >
            新建节假日
          </Button>
        </AddHolidaySetting>

        {
          loading === false && (
            <Table
              loading={loading}
              columns={columns}
              dataSource={holidaySearcharr.records}
              rowKey={records => records.id}
              pagination={pagination}
              rowSelection={rowSelection}
              scroll={{ x: 800, y: 700 }}
            />
          )
        }

      </Card>

    </PageHeaderWrapper>
  )
}

export default Form.create({})(
  connect(({ shiftsandholidays, loading }) => ({
    holidaySearcharr: shiftsandholidays.holidaySearcharr,
    loading: loading.models.shiftsandholidays
  }))(HolidaySetting)
)