import React, {
  useEffect,
  useState
} from 'react';
import { connect } from 'dva';
// import router from 'umi/router';
import moment from 'moment';
import { Table, Card, Button, Form, Input, Select, Row, Col, DatePicker, Divider, message, Popconfirm } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
// import DictLower from '@/components/SysDict/DictLower';
import { runAutoSoftWork, stopAutoSoftWork, endAutoSoftWork } from './services/api';
import TaskWorkObjectModel from './components/TaskWorkObjectModel';
import SoftWorkLogsDrawer from './components/SoftWorkLogsDrawer';

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

// const colormap = new Map([
//   ['停用', 'error'],
//   ['在用', 'success'],
// ]);

function SoftTTExecute(props) {
  const pagetitle = props.route.name;
  const {
    dispatch,
    location,
    autosoftworklist,
    loading,
    form: {
      getFieldDecorator,
      getFieldsValue,
      resetFields,
    },
  } = props;

  const [expand, setExpand] = useState(false);
  // const [selectdata, setSelectData] = useState({ arr: [], ischange: false }); // 下拉值
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });
  const [visibledrawer, setVisibledrawer] = useState(false); // 抽屉是否显示
  const [titledrawer, setTitledrawer] = useState('');
  const [recordvalues, setRecordvalues] = useState({});
  // const [disable, setdisable] = useState(false);

  const searchdata = (page, size) => {
    const values = getFieldsValue();
    values.createStartTime = values.createStartTime ? moment(values.createStartTime).format('YYYY-MM-DD HH:mm:ss') : '';
    values.createEndTime = values.createEndTime ? moment(values.createEndTime).format('YYYY-MM-DD HH:mm:ss') : '';
    values.examineStartTime = values.examineStartTime ? moment(values.examineStartTime).format('YYYY-MM-DD HH:mm:ss') : '';
    values.examineEndTime = values.examineEndTime ? moment(values.examineEndTime).format('YYYY-MM-DD HH:mm:ss') : '';
    dispatch({
      type: 'autosoftwork/findautosoftworkList',
      payload: {
        values,
        pageNum: page,
        pageSize: size,
      },
    });
  };

  useEffect(() => {
    searchdata(1, 15);
  }, [location]);

  const handleReset = () => {
    resetFields();
    searchdata(1, 15)
    setPageinations({ current: 1, pageSize: 15 });
  };

  const onShowSizeChange = (page, size) => {
    searchdata(page, size);
    setPageinations({
      ...paginations,
      pageSize: size,
    });
  };

  const changePage = page => {
    searchdata(page, paginations.pageSize);
    setPageinations({
      ...paginations,
      current: page,
    });
  };

  const pagination = {
    showSizeChanger: true,
    onShowSizeChange: (page, size) => onShowSizeChange(page, size),
    current: paginations.current,
    pageSize: paginations.pageSize,
    total: autosoftworklist.total,
    showTotal: total => `总共  ${total}  条记录`,
    onChange: page => changePage(page),
  };

  const handleSearch = () => {
    setPageinations({
      ...paginations,
      current: 1,
    });
    searchdata(1, paginations.pageSize);
  };

  const torunAutoSoftWork = id => {
    runAutoSoftWork(id).then(res => {
      if (res.code === 200) {
        message.success(res.msg || '启动成功');
      } else {
        message.error(res.msg);
      }
    })
  };

  const tostopAutoSoftWork = id => {
    stopAutoSoftWork(id).then(res => {
      if (res.code === 200) {
        message.success(res.msg || '停止成功');
      } else {
        message.error(res.msg);
      }
    })
  };

  const toendAutoSoftWork = id => {
    endAutoSoftWork(id).then(res => {
      if (res.code === 200) {
        message.success(res.msg || '结束作业成功！');
        // setdisable(true);
      } else {
        message.error(res.msg);
      }
    })
  };

  const handleShowDrawer = (drwertitle, record) => {
    setVisibledrawer(!visibledrawer);
    setTitledrawer(drwertitle);
    setRecordvalues(record);
  };

  // 查询
  const extra = (<>
    <Button type="primary" onClick={() => handleSearch()}>查 询</Button>
    <Button style={{ marginLeft: 8 }} onClick={() => handleReset()}>重 置</Button>
    <Button
      style={{ marginLeft: 8 }}
      type="link"
      onClick={() => {
        setExpand(!expand);
      }}
    >
      {expand ? (<>关 闭 <UpOutlined /></>) : (<>展 开 <DownOutlined /></>)}
    </Button></>
  )

  const columns = [
    {
      title: '启停申请说明',
      dataIndex: 'workRemarks',
      key: 'workRemarks',
      width: 250,
    },
    {
      title: '状态',
      dataIndex: 'workStatus',
      key: 'workStatus',
      width: 150,
    },
    {
      title: '启停对象',
      dataIndex: 'softWorkObjectNum',
      key: 'softWorkObjectNum',
      width: 150,
      render: (text, record) => {
        return (
          <TaskWorkObjectModel record={record} dispatch={dispatch} values={getFieldsValue()}>
            <a type="link">{text}</a>
          </TaskWorkObjectModel>
        );
      },
    },
    {
      title: '审核结果',
      dataIndex: 'examineStatus',
      key: 'examineStatus',
      width: 150,
    },
    {
      title: '申请人',
      dataIndex: 'createBy',
      key: 'createBy',
      width: 180,
    },
    {
      title: '申请时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 250,
    },
    {
      title: '审核人',
      dataIndex: 'examineBy',
      key: 'examineBy',
      width: 120,
    },
    {
      title: '审核时间',
      dataIndex: 'examineTime',
      key: 'examineTime',
      width: 250,
    },
    {
      title: '审核说明',
      dataIndex: 'examineRemarks',
      key: 'examineRemarks',
      width: 250,
    },
    {
      title: '审核单位',
      dataIndex: 'examineDept',
      key: 'examineDept',
      width: 250,
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      fixed: 'right',
      width: 260,
      render: (text, record) => {
        return (
          <div>
            <Popconfirm title="是否确定启动软件？" onConfirm={() => torunAutoSoftWork(record.id)}>
              <a type="link"
                // disabled={disable}
              >
                启动
              </a>
            </Popconfirm>
            <Divider type="vertical" />
            <Popconfirm title="是否确定停止软件？" onConfirm={() => tostopAutoSoftWork(record.id)}>
              <a type="link"
              // disabled={disable}
              >
                停止
              </a>
            </Popconfirm>
            <Divider type="vertical" />
            <Popconfirm title="是否确定结束作业？" onConfirm={() => toendAutoSoftWork(record.id)}>
              <a type="link"
                // disabled={disable}
              >
                结束作业
              </a>
            </Popconfirm>
            <Divider type="vertical" />
            <a type="link"
              onClick={() => handleShowDrawer('查看执行日志', record)}
            >
              查看日志
            </a>
          </div>
        );
      },
    },
  ];

  // 数据字典取下拉值
  // const getTypebyId = key => {
  //   if (selectdata.ischange) {
  //     return selectdata.arr[0].children.filter(item => item.key === key)[0].children;
  //   }
  //   return [];
  // };

  // const zonemap = getTypebyId('1428182995477942274'); // 区域
  const statusmap = [];
  const checkresultsmap = [];

  return (
    <PageHeaderWrapper title={pagetitle}>
      {/* <DictLower
        typeid="1428178684907835393"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      /> */}
      <Card>
        <Row gutter={16}>
          <Form {...formItemLayout} onSubmit={handleSearch}>
            <Col span={8}>
              <Form.Item label="启停申请人">
                {getFieldDecorator('createBy', {
                  initialValue: '',
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="申请时间">
                <Row>
                  <Col span={11}>
                    {getFieldDecorator('createStartTime', {})(
                      <DatePicker
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
                    {getFieldDecorator('createEndTime', {})(
                      <DatePicker
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
            <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
              <Form.Item label="状态">
                {getFieldDecorator('examineStatus', {
                  initialValue: '1',
                })(<Select placeholder="请选择" allowClear>
                  {statusmap.map(obj => (
                    <Option key={obj.key} value={obj.title}>
                      {obj.title}
                    </Option>
                  ))}
                </Select>)}
              </Form.Item>
            </Col>
            <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
              <Form.Item label="审核结果">
                {getFieldDecorator('checkResults', {
                  initialValue: '',
                })(<Select placeholder="请选择" allowClear>
                  {checkresultsmap.map(obj => (
                    <Option key={obj.key} value={obj.title}>
                      {obj.title}
                    </Option>
                  ))}
                </Select>)}
              </Form.Item>
            </Col>
            <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
              <Form.Item label="审核人">
                {getFieldDecorator('examineBy', {
                  initialValue: '',
                })(<Input placeholder="请输入" allowClear />)}
              </Form.Item>
            </Col>
            <Col span={8} style={{ display: expand ? 'block' : 'none' }}>
              <Form.Item label="审核时间">
                <Row>
                  <Col span={11}>
                    {getFieldDecorator('examineStartTime', {})(
                      <DatePicker
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
                    {getFieldDecorator('examineEndTime', {})(
                      <DatePicker
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
            {expand ? (<Col span={24} style={{ marginTop: 4, textAlign: 'right' }} >{extra}</Col>) : (<Col span={8} style={{ marginTop: 4, paddingLeft: '24px' }}>{extra}</Col>)}
          </Form>
        </Row>
        <Table
          columns={columns}
          dataSource={autosoftworklist.rows}
          loading={loading}
          rowKey={(_, index) => index.toString()}
          pagination={pagination}
          scroll={{ x: 1300 }}
        />
      </Card>
      {/* 抽屉 */}
      <SoftWorkLogsDrawer
        visibledrawer={visibledrawer}
        ChangeVisibledrawer={newvalue => setVisibledrawer(newvalue)}
        titledrawer={titledrawer}
        // dispatch={dispatch}
        recordvalues={recordvalues}
        destroyOnClose
      />
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ autosoftwork, loading }) => ({
    autosoftworklist: autosoftwork.autosoftworklist,
    loading: loading.models.autosoftwork,
  }))(SoftTTExecute),
);