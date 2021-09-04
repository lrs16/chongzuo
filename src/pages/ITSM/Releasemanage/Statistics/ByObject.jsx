import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import { Card, Row, Col, Form, DatePicker, Select, Button, Table, Layout, Cascader } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import DictLower from '@/components/SysDict/DictLower';

const { Option } = Select;
const { Sider, Content } = Layout;

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

function ByObject(props) {
  const pagetitle = props.route.name;
  const {
    dispatch,
    form: { getFieldDecorator, resetFields, getFieldsValue }, loading,
    objectsumlist, objectlist,
  } = props;
  const [selectdata, setSelectData] = useState('');
  const [expand, setExpand] = useState(false);
  const [title, setTitle] = useState('');

  const handleSearch = () => {
    const values = getFieldsValue();
    const val = {
      ...values,
      beginTime: values.beginTime ? moment(values.beginTime).format('YYYY-MM-DD HH:mm:ss') : '',
      endTime: values.endTime ? moment(values.endTime).format('YYYY-MM-DD HH:mm:ss') : '',
      releaseObj: values.releaseObj ? values.releaseObj.join('/') : '',
      pageIndex: 1,
      pageSize: 100,
    };
    dispatch({
      type: 'releasestatistics/fetchobjectsum',
      payload: {
        ...val
      },
    });
  };

  const handleReset = () => {
    resetFields();
    handleSearch();
  }

  useEffect(() => {
    handleSearch()
  }, []);


  const getTypebyId = key => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.key === key)[0].children;
    }
    return [];
  };

  const unitmap = getTypebyId('1384056290929545218');       // 责任单位
  const functionmap = getTypebyId('1384052503909240833');   // 功能类型

  // 合并一级相同的行
  const temp = {};
  const mergeCells = (text, array, columns, unit) => {
    let i = 0;
    if (text !== temp[columns]) {
      temp[columns] = text;
      if (unit) {
        array.forEach((item) => {
          if (item[columns] === temp[columns] && item[unit] === temp[unit]) {
            i += 1;
          }
        });
      } else {
        array.forEach((item) => {
          if (item[columns] === temp[columns]) {
            i += 1;
          }
        });
      }
    }
    return i;
  };
  // 发布环节统计表头
  const columns = [
    {
      title: '责任单位',
      dataIndex: 'dutyUnit',
      key: 'dutyUnit',
      align: 'center',
      render: (text, record) => {
        const obj = {
          children: text,
          props: {},
        };
        obj.props.rowSpan = mergeCells(record.dutyUnit, objectsumlist, 'dutyUnit');
        return obj;
      },
    },
    {
      title: '一级功能',
      dataIndex: 'firstObj',
      key: 'firstObj',
      align: 'center',
      render: (text, record) => {
        const obj = {
          children: text,
          props: {},
        };
        if (objectsumlist.length !== 2) { obj.props.rowSpan = mergeCells(record.firstObj, objectsumlist, 'firstObj', 'dutyUnit') };
        return obj;
      },
    },
    {
      title: '二级功能',
      dataIndex: 'secondObj',
      key: 'secondObj',
      align: 'center',
    },
    {
      title: '功能项',
      dataIndex: 'count',
      key: 'count',
      align: 'center',
      render: (text, record) => {
        const handleClick = () => {
          const values = getFieldsValue();
          const val = {
            beginTime: values.beginTime ? moment(values.beginTime).format('YYYY-MM-DD HH:mm:ss') : '',
            endTime: values.endTime ? moment(values.endTime).format('YYYY-MM-DD HH:mm:ss') : '',
            releaseObj: `${record.firstObj}/${record.secondObj}`,
            dutyUnit: record.dutyUnit,
            pageIndex: 1,
            pageSize: 15,
          };
          dispatch({
            type: 'releasestatistics/fetchobjectlist',
            payload: {
              ...val
            },
          });
          setExpand(true);
          setTitle(`责任单位:${record.dutyUnit}，功能：${record.firstObj}/${record.secondObj}`)
        };
        return (<a onClick={handleClick}>{text}</a>);
      },
    },
  ]

  return (
    <PageHeaderWrapper
      title={pagetitle}
    >
      <DictLower
        typeid="1379323239808897026"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Card>
        <Form {...formItemLayout}>
          <Row>
            <Col span={8}>
              <Form.Item label="起始时间">
                <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
                  {getFieldDecorator('beginTime', {
                    initialValue: '',
                  })(
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
                </Form.Item>
                <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>-</span>
                <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
                  {getFieldDecorator('endTime', {
                    initialValue: '',
                  })(
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
                </Form.Item>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="功能类型">
                {getFieldDecorator('releaseObj', {
                  initialValue: '',
                })(
                  <Cascader
                    fieldNames={{ label: 'title', value: 'title', children: 'children' }}
                    options={functionmap}
                  />,
                )}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="责任单位">
                {getFieldDecorator('dutyUnit', {
                  initialValue: '',
                })(
                  <Select placeholder="请选择" allowClear>
                    {unitmap.map(obj => (
                      <Option key={obj.key} value={obj.title}>
                        {obj.title}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={4} style={{ padding: '4px 0 0 48px' }}>
              <Button type="primary" onClick={() => handleSearch()}>查 询</Button>
              <Button style={{ marginLeft: 8 }} onClick={() => handleReset()}>重 置</Button>
            </Col>
          </Row>
        </Form>
        <Layout style={{ background: '#fff' }}>
          <Content>
            <Table
              loading={loading}
              columns={columns}
              dataSource={objectsumlist || []}
              rowKey={(_, index) => index.toString()}
              pagination={false}
              bordered
            />
          </Content>
          {expand && (<Sider width='800' style={{ background: '#fff' }}>
            <Card style={{ marginLeft: 24 }} >Sider</Card>
          </Sider>)}
        </Layout>

      </Card>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ releasestatistics, loading }) => ({
    objectsumlist: releasestatistics.objectsum,
    objectlist: releasestatistics.objectlist,
    loading: loading.models.releasestatistics,
  }))(ByObject),
);