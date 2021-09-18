import React, {
  useState,
} from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import {
  Card,
  Row,
  Col,
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  Table,
  Divider,
  Popconfirm
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import AddDutyclassesSetting from './components/AddDutyclassesSetting';

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

const enableStatus = [
  { key: '0', title: '启用' },
  { key: '1', title: '停用' },
];

const dataSource = [
  {
    'No': 'No',
    't1': 't1',
    't2': 't2',
    't3': 't3',
    't4': 't4',
    't5': 't5',
  }
]

function DutyclassesSetting(props) {
  const pagetitle = props.route.name;
  const {
    form: {
      getFieldDecorator,
      resetFields,
      getFieldsValue
    },
    dispatch,
  } = props;
  const [time, setTime] = useState({
    startValue: null,
    endValue: null,
    endOpen: false,
  })

  const [dutytime, setDutytime] = useState({
    startValue: null,
    endValue: null,
    endOpen: false,
  })

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  // const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });


  const searchdata = (values, page, pageSize) => {
    const newdata = {
      ...values,
      time1: values.time1 ? moment(values.time1).format('YYYY-MM-DD HH:mm:ss') : '',
      time2: values.time2 ? moment(values.time2).format('YYYY-MM-DD HH:mm:ss') : '',
      page,
      pageSize
    }

    console.log(newdata, 'newdata')
      // dispatch({
  //   type:'',
  //   payload:{
  //     ...values,
  //     time1:values.time1 ? moment(values.time1).format('YYYY-MM-DD HH:mm:ss'):'',
  //     time2:values.time2 ? moment(values.time2).format('YYYY-MM-DD HH:mm:ss'):'',
  //     page,
  //     pageSize
  //   }
  // })
  }




const handleSearch = () => {
  const values = getFieldsValue()
  searchdata(values, 1, 15)
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

const onSelectChange = (RowKeys) => {
  setSelectedRowKeys(RowKeys);
};
const rowSelection = {
  selectedRowKeys,
  onChange: (key, record) => onSelectChange(key, record),
};

// useEffect(() => {
//   // const values = getFieldsValue();
//   dispatch({
//     // type: '/fetchlist',
//     // payload: {
//     //   ...values,
//     //   pageIndex: paginations.current - 1,
//     //   pageSize: paginations.pageSize,
//     // },
//   });
// }, []);

// 查询
const extra = (<>
  <Button type="primary" onClick={() => handleSearch()}>查 询</Button>
  <Button style={{ marginLeft: 8 }} onClick={() => handleReset()}>重 置</Button></>
)

const handleSubmit = (submitdata) => {

}

const handleDelete = (deleteId) => {


}

const columns = [
  {
    title: '班次编号',
    dataIndex: 'No',
    key: 'No'
  },
  {
    title: '创建时间',
    dataIndex: 't1',
    key: 't1',
    width: 200,
  },
  {
    title: '创建人',
    dataIndex: 't2',
    key: 't2',
  },
  {
    title: '班次名称',
    dataIndex: 't3',
    key: 't3',
  },
  {
    title: '值班时段',
    dataIndex: 't4',
    key: 't4',
  },
  {
    title: '启用状态',
    dataIndex: 't5',
    key: 't5',
  },
  {
    title: '操作',
    dataIndex: 'opertator',
    key: 'opertator',
    render: (text, record) => {
      return (
        <>
          <AddDutyclassesSetting
            classSetting={record}
            id={record.No}
            title='编辑班次'
            onSubmit={(submitdata => handleSubmit(submitdata))}
            onDelete={(id) => { handleDelete(id) }}
          >
            <a
            >
              编辑
            </a>
          </AddDutyclassesSetting>
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
];

//  设置时间的范围
const disabledStartDate = (startValue, type) => {
  if (type === 'create') {
    const { endValue } = time;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf()
  }

  if (type === 'duty') {
    const { endValue } = dutytime;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf()
  }

}

const disabledEndDate = (endValue, type) => {
  if (type === 'create') {
    const { startValue } = time;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  }

  if (type === 'duty') {
    const { startValue } = dutytime;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  }

};


const onChange = (field, value, type) => {
  if (type === 'create') {
    const obj = time;
    switch (field) {
      case 'startValue':
        obj.startValue = value;
        setTime(obj);
        break;
      case 'endValue':
        obj.endValue = value;
        setTime(obj);
        break;
      default:
        break;
    }
  }

  if (type === 'duty') {
    const obj = dutytime;
    switch (field) {
      case 'startValue':
        obj.startValue = value;
        setDutytime(obj);
        break;
      case 'endValue':
        obj.endValue = value;
        setDutytime(obj);
        break;
      default:
        break;
    }
  }

};
const onStartChange = (value, type) => {
  onChange('startValue', value, type);
};

const onEndChange = (value, type) => {
  onChange('endValue', value, type);
};

const handleEndOpenChange = (open, type) => {
  if (type === 'create') {
    const obj = time;
    obj.endOpen = open
    setTime(obj);
  } else {
    const obj = dutytime;
    obj.endOpen = open
    setDutytime(obj);
  }



};

const handleStartOpenChange = (open, type) => {
  if (!open && type === 'create') {
    const obj = time;
    obj.endOpen = true;
    setTime(obj);
  }

  if (!open && type === 'duty') {
    const obj = dutytime;
    obj.endOpen = true;
    setDutytime(obj);
  }
};


return (
  <PageHeaderWrapper title={pagetitle}>
    <Card>
      <Row gutter={8}>
        <Form {...formItemLayout} onSubmit={handleSearch}>
          <Col span={8}>
            <Form.Item label="班次编号">
              {getFieldDecorator('form1', {
                initialValue: '',
              })(<Input placeholder="请输入" allowClear />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="创建时间" >
              <Row>
                <Col span={11}>
                  {getFieldDecorator('time1', {
                    initialValue: undefined,
                  })(
                    <DatePicker
                      disabledDate={(value) => disabledStartDate(value, 'create')}
                      onChange={(value) => onStartChange(value, 'create')}
                      onOpenChange={(value) => handleStartOpenChange(value, 'create')}
                      showTime={{
                        hideDisabledOptions: true,
                        defaultValue: moment('00:00:00', 'HH:mm:ss'),
                      }}
                      placeholder="开始时间"
                      format='YYYY-MM-DD HH:mm:ss'
                      style={{ minWidth: 120, width: '100%' }}
                    />
                  )}
                </Col>
                <Col span={2} style={{ textAlign: 'center' }}>-</Col>
                <Col span={11}>
                  {getFieldDecorator('time2', {
                    initialValue: undefined,
                  })(
                    <DatePicker
                      disabledDate={(value) => disabledEndDate(value, 'create')}
                      onChange={(value) => onEndChange(value, 'create')}
                      open={time.endOpen}
                      onOpenChange={(value) => handleEndOpenChange(value, 'create')}
                      showTime={{
                        hideDisabledOptions: true,
                        defaultValue: moment('23:59:59', 'HH:mm:ss'),
                      }}
                      placeholder="结束时间"
                      format='YYYY-MM-DD HH:mm:ss'
                      style={{ minWidth: 120, width: '100%' }}
                    />
                  )}
                </Col>
              </Row>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="创建人">
              {getFieldDecorator('form2', {
                initialValue: '',
              })(<Input placeholder="请输入" allowClear />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="班次名称">
              {getFieldDecorator('form3', {
                initialValue: '',
              })(<Input placeholder="请输入" allowClear />)}
            </Form.Item>
          </Col>
          {/* <Col span={8}>
              <Form.Item label="值班时段" >
                <Row>
                  <Col span={11}>
                    {getFieldDecorator('time3', {
                      initialValue: undefined,
                    })(
                      <DatePicker
                        disabledDate={(value) => disabledStartDate(value, 'duty')}
                        onChange={(value) => onStartChange(value, 'duty')}
                        onOpenChange={(value) => handleStartOpenChange(value, 'duty')}
                        showTime={{
                          hideDisabledOptions: true,
                          defaultValue: moment('00:00:00', 'HH:mm:ss'),
                        }}
                        placeholder="开始时间"
                        format='YYYY-MM-DD HH:mm:ss'
                        style={{ minWidth: 120, width: '100%' }}
                      />
                    )}
                  </Col>
                  <Col span={2} style={{ textAlign: 'center' }}>-</Col>
                  <Col span={11}>
                    {getFieldDecorator('time4', {
                      initialValue: undefined,
                    })(
                      <DatePicker
                        disabledDate={(value) => disabledEndDate(value, 'duty')}
                        onChange={(value) => onEndChange(value, 'duty')}
                        open={dutytime.endOpen}
                        onOpenChange={(value) => handleEndOpenChange(value, 'duty')}
                        showTime={{
                          hideDisabledOptions: true,
                          defaultValue: moment('23:59:59', 'HH:mm:ss'),
                        }}
                        placeholder="结束时间"
                        format='YYYY-MM-DD HH:mm:ss'
                        style={{ minWidth: 120, width: '100%' }}
                      />
                    )}
                  </Col>
                </Row>
              </Form.Item>
            </Col> */}
          <Col span={8}>
            <Form.Item label="启用状态">
              {getFieldDecorator('form4', {
                initialValue: '',
              })(
                <Select placeholder="请选择" allowClear>
                  {enableStatus.map(obj => (
                    <Option key={obj.key} value={obj.key}>
                      {obj.title}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span={24} style={{ textAlign: 'right', paddingTop: 4 }}>{extra}</Col>
        </Form>
      </Row>

      {/* <div style={{ marginBottom: 24 }}>
          {/* <Button type="primary" style={{ marginRight: 8 }} onClick={() => newclasses()}>新增</Button > */}
      {/* <Button type="danger" ghost style={{ marginRight: 8 }}>删除</Button >
        </div> */}

      <AddDutyclassesSetting
        title='新增班次'
      >
        <Button
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          icon='plus'
          onSubmit={(submitdata => handleSubmit(submitdata))}
        >
          新增
        </Button>
      </AddDutyclassesSetting>
      < Table
        // loading={loading}
        columns={columns}
        dataSource={dataSource}
        //  pagination={pagination}
        rowSelection={rowSelection}
        rowKey={r => r.No}
        scroll={{ x: 1300 }}
      />
    </Card>
  </PageHeaderWrapper >
);
}

export default Form.create({})(
  connect()(DutyclassesSetting),
);
