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

  //  ????????????????????????
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

  // ??????
  const extra = (<>
    <Button type="primary" onClick={() => handleSearch()}>??? ???</Button>
    <Button style={{ marginLeft: 8 }} onClick={() => handleReset()}>??? ???</Button></>
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
    //   title: '??????',
    //   dataIndex: 'key',
    //   key: 'key',
    //   width: 60,
    //   align: 'center',
    //   render: (text, record, index) => {
    //     return <>{`${index + 1}`}</>;
    //   },
    // },
    {
      title: '????????????',
      dataIndex: 'staffName',
      key: 'staffName',
    },
    {
      title: '????????????',
      dataIndex: 'deptName',
      key: 'deptName',
    },
    {
      title: '????????????',
      dataIndex: 'jobName',
      key: 'jobName',
    },
    {
      title: '????????????',
      dataIndex: 'groupName',
      key: 'groupName',
    },
    {
      title: '????????????',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '??????',
      dataIndex: 'opertator',
      key: 'opertator',
      render: (text, records) => {
        return (
          <>
            <AdddutyPersonnelSetting
              personnelSetting={records}
              id={records.No}
              title='??????????????????'
              onSubmit={submitdata => handleSubmit(submitdata)}
              onDelete={() => handleDelete(records.id)}
            >
              <a>??????</a>
            </AdddutyPersonnelSetting>
            <Divider type='vertical' />
            <Popconfirm
              title='???????????????????????????'
              onConfirm={() => handleDelete(records.id)}>
              <a>??????</a>
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
    showTotal: total => `??????  ${total}  ?????????`,
    onChange: page => changePage(page),
  };


  const getTypebyTitle = title => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.title === title)[0].children;
    }
    return []
  };

  const teamjobName = getTypebyTitle('????????????');

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
                <Form.Item label="????????????">
                  {getFieldDecorator('staffName', {
                    initialValue: cacheinfo.staffName,
                  })(<Input placeholder="?????????" allowClear />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="????????????">
                  {getFieldDecorator('deptName', {
                    initialValue: cacheinfo.deptName,
                  })(
                    <Input />
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="????????????">
                  {getFieldDecorator('jobId', {
                    initialValue: cacheinfo.jobId,
                  })(
                    <Select
                      getPopupContainer={e => e.parentNode}
                      placeholder="?????????"
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
                <Form.Item label="????????????">
                  {getFieldDecorator('phone', {
                    initialValue: cacheinfo.phone,
                  })(<Input placeholder="?????????" allowClear />)}
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
                title='????????????????????????'
                onSubmit={submitdata => handleSubmit(submitdata)}
                personnelSetting=''
              >
                <Button
                  style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
                  icon='plus'
                >
                  ????????????????????????
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