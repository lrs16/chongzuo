import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import { Form, Card, Input, Button, Row, Col, Table, Select, DatePicker } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SysDict from '@/components/SysDict';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const { Option } = Select;

const columns = [
  {
    title: '问题编号',
    dataIndex: 'no',
    key: 'no',
    render: (text, record) => {
      const handleClick = () => {
        router.push({
          pathname: `/ITSM/problemmanage/problemquery/detail`,
          query: {
            id: record.id,
            taskName: record.statuscn,
            No: text,
          },
        });
      };
      return <a onClick={handleClick}>{text}</a>;
    },
  },
  {
    title: '问题标题',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: '问题来源',
    dataIndex: 'sourcecn',
    key: 'sourcecn',
  },
  {
    title: '问题分类',
    dataIndex: 'typecn',
    key: 'typecn',
  },
  {
    title: '当前处理环节',
    dataIndex: 'currentNode',
    key: 'currentNode',
  },
  {
    title: '工单状态',
    dataIndex: 'statuscn',
    key: 'statuscn',
  },
  {
    title: '影响范围',
    dataIndex: 'registerScopecn',
    key: 'registerScopecn',
  },
  {
    title: '处理人',
    dataIndex: 'handler',
    key: 'handler',
  },
  {
    title: '处理单位',
    dataIndex: 'handleUnit',
    key: 'handleUnit',
  },
  {
    title: '发送时间',
    dataIndex: 'registerTime',
    key: 'registerTime',
    render: text => {
      return <>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</>;
    }
  },
  {
    title: '重要程度',
    dataIndex: 'importancecn',
    key: 'importancecn',
  },
];

function Besolved(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, resetFields, validateFields },
    location: { query:
      {
        progressStatus,
        type,
        handleDeptId,
        timeStatus,
        handlerId,
        addTimeBegin,
        addTimeEnd,
        status,
        currentNode
      } },
    dispatch,
    queryArr,
    loading,
  } = props;
  const [expand, setExpand] = useState(false);
  const [paginations, setPaginations] = useState({ current: 1, pageSize: 10 });
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectdata, setSelectData] = useState('');

  const getinitiaQuery = () => {
    dispatch({
      type: 'problemmanage/queryList',
      payload: {
        status,
        progressStatus,
        handlerId,
        type,
        timeStatus,
        handleDeptId,
        addTimeBegin,
        addTimeEnd,
        currentNode,
        pageNum: paginations.current,
        pageSize: paginations.pageSize,
      },
    });

  }

  useEffect(() => {
    getinitiaQuery();
  }, []);

  const handleReset = () => {
    resetFields();
  };

  const searchdata = (values, page, pageSize, search) => {
    dispatch({
      type: 'problemmanage/queryList',
      payload: {
        ...values,
        status,
        progressStatus,
        handlerId,
        type,
        timeStatus,
        handleDeptId,
        addTimeBegin,
        addTimeEnd,
        currentNode:values.currentNode?values.currentNode:currentNode,
        pageNum: page,
        pageSize: paginations.pageSize
      },
    });

  };


  const onShowSizeChange = (page, pageSize) => {
    validateFields((err, values) => {
      if (!err) {
        searchdata(values, page, pageSize);
      }
    });
    setPaginations({
      ...paginations,
      pageSize,
    });
  };

  const changePage = (page) => {
    validateFields((err, values) => {
      if (!err) {
        searchdata(values, page, paginations.pageSize);
      }
    });
    setPaginations({
      ...paginations,
      current: page,
    });
  };


  const pagination = {
    showSizeChanger: true,
    onShowSizeChange: (page, pageSize) => onShowSizeChange(page, pageSize),
    current: paginations.current,
    pageSize: paginations.pageSize,
    total: queryArr.total,
    showTotal: total => `总共  ${total}  条记录`,
    onChange: (page) => changePage(page),
  };


  const handleSearch = (search) => {
    setPaginations({
      ...paginations,
      current: 1,
    });
    validateFields((err, values) => {
      if (err) {
        return;
      }
      const obj = values;
      if (values.createTimeBegin) {
        obj.createTimeBegin = (values.createTimeBegin).format('YYYY-MM-DD HH:mm:ss');
      }
      searchdata(obj, 1, paginations.pageSize, search);
    });

  };

  const download = () => {
    validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'problemmanage/eventdownload',
          payload: {
            ...values,
            createTimeBegin: values.createTimeBegin ? (values.createTimeBegin).format('YYYY-MM-DD') : '',
            status,
            progressStatus,
            handlerId,
            type,
            timeStatus,
            handleDeptId,
            addTimeBegin,
            addTimeEnd,
            currentNode:values.currentNode?values.currentNode:currentNode,
          }
        }).then(res => {
          const filename = `问题查询_${moment().format('YYYY-MM-DD HH:mm')}.xls`;
          const blob = new Blob([res]);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        })
      }
    })
  }

  const getTypebyTitle = title => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.title === title)[0].children;
    }
    return [];
  };
  const problemSource = getTypebyTitle('问题来源');
  const priority = getTypebyTitle('严重程度');
  const currentNodeselect = getTypebyTitle('当前处理环节');
  const problemType = getTypebyTitle('问题分类');
  const scopeList = getTypebyTitle('影响范围');

  return (
    <PageHeaderWrapper title={pagetitle}>
      <SysDict
        typeid="1354287742015508481"
        commonid="1354288354950123522"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Card>
        <Row gutter={16}>
          <Form {...formItemLayout}>
            <Col span={8}>
              <Form.Item label="问题编号">
                {getFieldDecorator('no', {
                  rules: [
                    {
                      message: '请输入问题编号',
                    },
                  ],
                })(<Input placeholder='请输入' allowClear />)}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="当前处理环节">
                {getFieldDecorator('currentNode',
                  {},
                )(
                  <Select placeholder="请选择" allowClear>
                    {currentNodeselect.map(obj => [
                      <Option key={obj.key} value={obj.title}>
                        {obj.title}
                      </Option>,
                    ])}
                  </Select>,
                )}
              </Form.Item>
            </Col>


            {expand === true && (
              <>
                <Col span={8}>
                  <Form.Item label="问题标题">
                    {getFieldDecorator('title', {})(<Input placeholder='请输入' allowClear />)}
                  </Form.Item>
                </Col>
              </>
            )}

            {expand === true && (
              <>
                <Col span={8}>
                  <Form.Item label="问题来源">
                    {getFieldDecorator(
                      'source',
                      {},
                    )(
                      <Select placeholder="请选择" allowClear>
                        {problemSource.map(obj => [
                          <Option key={obj.key} value={obj.dict_code}>
                            {obj.title}
                          </Option>,
                        ])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="问题分类">
                    {getFieldDecorator('type', {})
                      (
                        <Select placeholder="请选择" allowClear>
                          {problemType.map(obj => [
                            <Option key={obj.key} value={obj.dict_code}>
                              {obj.title}
                            </Option>,
                          ])}
                        </Select>,
                      )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="影响范围">{getFieldDecorator('registerScope', {})
                    (
                      <Select placeholder="请选择" allowClear>
                        {scopeList.map(obj => [
                          <Option key={obj.key} value={obj.dict_code}>
                            {obj.title}
                          </Option>,
                        ])}
                      </Select>,
                    )}</Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="处理人" >
                    {getFieldDecorator(
                      'handler',
                      {},
                    )(
                      <Input placeholder='请输入' allowClear />
                    )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="处理单位">
                    {getFieldDecorator(
                      'handleUnit',
                      {},
                    )(
                      <Input placeholder='请输入' allowClear />
                    )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="发送人">
                    {getFieldDecorator(
                      'registerUser',
                      {},
                    )(
                      <Input placeholder='请输入' allowClear />
                    )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="发送时间">
                    {getFieldDecorator(
                      'createTimeBegin',
                      {},
                    )(
                      <DatePicker allowClear />
                    )}
                  </Form.Item>
                </Col>


                <Col span={8}>
                  <Form.Item label='重要程度'>
                    {getFieldDecorator(
                      'importance',
                      {},
                    )(
                      <Select placeholder="请选择" allowClear>
                        {priority.map(obj => [
                          <Option key={obj.key} value={obj.dict_code}>
                            {obj.title}
                          </Option>,
                        ])}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
              </>
            )}
            {expand === false && (
              <Col span={8}>
                <Button type="primary" onClick={() => handleSearch('search')}>
                  查询
                </Button>

                <Button style={{ marginLeft: 8 }} onClick={handleReset}>
                  重置
                </Button>

                <Button
                  style={{ marginLeft: 8 }}
                  type="link"
                  onClick={() => {
                    setExpand(!expand);
                  }}
                >
                  {expand ? (
                    <>
                      关闭 <UpOutlined />
                    </>
                  ) : (
                    <>
                      展开 <DownOutlined />
                    </>
                  )}
                </Button>
              </Col>
            )}

            {expand === true && (
              <Col span={24} style={{ textAlign: 'right' }}>
                <Button type="primary" onClick={() => handleSearch('search')}>
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={handleReset}>
                  重置
                </Button>
                <Button
                  style={{ marginLeft: 8 }}
                  type="link"
                  onClick={() => {
                    setExpand(!expand);
                  }}
                >
                  {expand ? (
                    <>
                      关闭 <UpOutlined />
                    </>
                  ) : (
                    <>
                      展开 <DownOutlined />
                    </>
                  )}
                </Button>
              </Col>
            )}
          </Form>
        </Row>
        <div style={{ marginBottom: 24 }}>
          <Button
            type="primary"
            onClick={() => download()}
          >导出数据</Button>
        </div>

        <Table
          loading={loading}
          columns={columns}
          dataSource={queryArr.rows}
          rowKey={record => record.id}
          pagination={pagination}
        />
      </Card>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ problemmanage, problemstatistics, loading }) => ({
    queryArr: problemmanage.queryArr,
    statusdetailList: problemstatistics.statusdetailList,
    loading: loading.models.problemmanage,
  }))(Besolved),
);
