import React, {
  useState,
  useEffect
} from 'react';
import { connect } from 'dva';
import {
  Card,
  Row,
  Col,
  Form,
  Input,
  Button,
  Table,
  Select,
  message,
  Divider,
  Popconfirm
} from 'antd';
import SysDict from '@/components/SysDict';
import router from 'umi/router';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import AdddutyPersonnelSetting from './components/AdddutyPersonnelSetting';

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

function DutypersonnelSetting(props) {
  const pagetitle = props.route.name;
  const {
    form: {
      getFieldDecorator,
      resetFields,
      getFieldsValue,
      setFieldsValue
    },
    dispatch,
    searchUsersarr,
    location,
    loading
  } = props;
  const [selectdata, setSelectData] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [paginations, setPageinations] = useState({ current: 1, size: 15 });
  const [tabrecord, setTabRecord] = useState({});


  const searchdata = (values, current, size) => {
    const newdata = {
      ...values,
      current,
      size
    }

    dispatch({
      type: 'dutyandtypesetting/staffSearch',
      payload: newdata
    })

    setTabRecord(newdata)
  }



  const handleSearch = () => {
    const formdata = getFieldsValue();
    searchdata(formdata, 1, 15)
  }
  const handleReset = () => {
    router.push({
      pathname: location.pathname,
      query: {},
      state: {}
    })
    resetFields();
    searchdata({}, 1, 15)
  }

  useEffect(() => {
    if (location.state && location.state.reset) {
      handleReset();
      searchdata({}, 1, 15)
    }
  }, [location.state]);

  const handleChange = (value, option, type) => {
    const { values } = option.props;
    switch (type) {
      case 'jobName':
        setFieldsValue(
          {
            jobName: values,
          }
        )
        break;
      case 'group':
        setFieldsValue(
          {
            groupName: values,
          }
        )
        break;
      default:
        break;
    }
  }

  const onSelectChange = (RowKeys) => {
    setSelectedRowKeys(RowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: (key, record) => onSelectChange(key, record),
  };

  const handleSubmit = (submitdata) => {
    return dispatch({
      type: 'dutyandtypesetting/fetchDutysave',
      payload: submitdata
    }).then(res => {
      if (res.code === 200) {
        message.success(res.msg);
        searchdata({}, 1, 15)
      } else {
        message.error(res.msg);
      }
    })
  }

  //  传给多标签的数据
  const record = {
    staffName: '',
    deptName: '',
    jobId: '',
    jobName: '',
    phone: '',
  }
  const cacheinfo = (location.state && location.state.cacheinfo === undefined) ? record : location.state.cacheinfo;

  useEffect(() => {
    if (location.state) {
      if (location.state.cache) {
        dispatch({
          type: 'viewcache/gettabstate',
          payload: {
            cacheinfo: {
              ...tabrecord,
              paginations
            },
            tabid: sessionStorage.getItem('tabid')
          }
        })
      };

      if (location.state.reset) {
        handleReset();
      }
    }
  }, [location.state])

  useEffect(() => {
    if (location.state && location.state.reset) {
      handleReset();
      searchdata({}, 1, 15)
    }
  }, [location.state]);

  useEffect(() => {
    const value = getFieldsValue();
    searchdata(value, 1, 15)
  }, [])

  // 查询
  const extra = (<>
    <Button type="primary" onClick={() => handleSearch()}>查 询</Button>
    <Button style={{ marginLeft: 8 }} onClick={() => handleReset()}>重 置</Button></>
  )

  const handleDelete = (id) => {
    return dispatch({
      type: 'dutyandtypesetting/fetchstaffDel',
      payload: id
    }).then(res => {
      if (res.code === 200) {
        message.success(res.msg);
        searchdata({}, 1, 15)
      } else {
        message.error(res.msg);
      }
    })
  }

  const columns = [
    // {
    //   title: '序号',
    //   dataIndex: 'key',
    //   key: 'key',
    //   width: 60,
    //   align: 'center',
    //   render: (text, record, index) => {
    //     return <>{`${index + 1}`}</>;
    //   },
    // },
    {
      title: '值班人员',
      dataIndex: 'staffName',
      key: 'staffName',
    },
    {
      title: '所属部门',
      dataIndex: 'deptName',
      key: 'deptName',
    },
    {
      title: '所属岗位',
      dataIndex: 'jobName',
      key: 'jobName',
    },
    {
      title: '所属班组',
      dataIndex: 'groupName',
      key: 'groupName',
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '操作',
      dataIndex: 'opertator',
      key: 'opertator',
      render: (text, records) => {
        return (
          <>
            <AdddutyPersonnelSetting
              personnelSetting={records}
              id={records.No}
              title='编辑值班人员'
              onSubmit={submitdata => handleSubmit(submitdata)}
              onDelete={() => handleDelete(records.id)}
            >
              <a>编辑</a>
            </AdddutyPersonnelSetting>
            <Divider type='vertical' />
            <Popconfirm
              title='是否要删除该条数据'
              onConfirm={() => handleDelete(records.id)}>
              <a>删除</a>
            </Popconfirm>
          </>
        )
      }
    }
  ];

  const onShowSizeChange = (page, size) => {
    const values = getFieldsValue();
    searchdata(values, paginations.page, size);
    setPageinations({
      ...paginations,
      size,
    });
  };

  const changePage = page => {
    const values = getFieldsValue();
    searchdata(values, page, paginations.size);
    setPageinations({
      ...paginations,
      current: page,
    });
  };
  const pagination = {
    showSizeChanger: true,
    onShowSizeChange: (page, size) => onShowSizeChange(page, size),
    current: paginations.current,
    pageSize: paginations.size,
    total: searchUsersarr.total || '',
    showTotal: total => `总共  ${total}  条记录`,
    onChange: page => changePage(page),
  };


  const getTypebyTitle = title => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.title === title)[0].children;
    }
    return []
  };

  const teamjobName = getTypebyTitle('所属岗位');

  return (
    <PageHeaderWrapper title={pagetitle}>
      <SysDict
        typeid='1021'
        commonid="335"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Card>
        <div className='noexplain'>
          <Row gutter={8}>
            <Form {...formItemLayout} onSubmit={handleSearch}>
              <Col span={8}>
                <Form.Item label="值班人员">
                  {getFieldDecorator('staffName', {
                    initialValue: cacheinfo.staffName,
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="所属部门">
                  {getFieldDecorator('deptName', {
                    initialValue: cacheinfo.deptName,
                  })(
                    <Input />
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="所属岗位">
                  {getFieldDecorator('jobId', {
                    initialValue: cacheinfo.jobId,
                  })(
                    <Select
                      getPopupContainer={e => e.parentNode}
                      placeholder="请选择"
                      onChange={(value, option) => handleChange(value, option, 'jobName')}
                    >
                      {teamjobName.map(obj => [
                        <Option
                          key={obj.key}
                          values={obj.title}
                        >
                          {obj.title}
                        </Option>
                      ])}
                    </Select>
                  )}
                </Form.Item>
              </Col>

              <Form.Item label='' style={{ display: 'none' }}>
                {
                  getFieldDecorator('jobName', {
                    initialValue: cacheinfo.jobName
                  })(<Input />)
                }
              </Form.Item>

              <Col span={8}>
                <Form.Item label="联系电话">
                  {getFieldDecorator('phone', {
                    initialValue: cacheinfo.phone,
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>


              <Col span={24} style={{ textAlign: 'right', paddingTop: 4, marginBottom: 24 }}>{extra}</Col>
            </Form>
          </Row>
        </div>


        {
          loading === false && (
            <>
              <AdddutyPersonnelSetting
                title='新建值班人员设置'
                onSubmit={submitdata => handleSubmit(submitdata)}
                personnelSetting=''
              >
                <Button
                  style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
                  icon='plus'
                >
                  新建值班人员设置
                </Button>
              </AdddutyPersonnelSetting>
            </>
          )
        }

        <Table
          loading={loading}
          columns={columns}
          pagination={pagination}
          dataSource={searchUsersarr.records}
          rowKey={(_, index) => index.toString()}
          rowSelection={rowSelection}
          scroll={{ x: 1300 }}
        />

      </Card>
    </PageHeaderWrapper >
  );
}

export default Form.create({})(
  connect(({ dutyandtypesetting, loading }) => ({
    searchUsersarr: dutyandtypesetting.searchUsersarr,
    loading: loading.models.dutyandtypesetting
  }))(DutypersonnelSetting),
);