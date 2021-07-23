import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { Card, Table, Row, Form, Col, DatePicker, Button } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import DictLower from '@/components/SysDict/DictLower';

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

function Statistics(props) {
  const pagetitle = props.route.name;
  const {
    loading, statislist,
    form: { getFieldDecorator, resetFields, getFieldsValue },
    dispatch,
  } = props;
  const [selectdata, setSelectData] = useState('');
  const [searchtime, setSearchtime] = useState({});
  const getTypebyId = key => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.key === key)[0].children;
    }
    return [];
  };
  const typemap = getTypebyId('1412301574201413634');         // 知识分类
  const handleSearch = () => {
    const values = getFieldsValue();

    dispatch({
      type: 'knowledg/fetchstatis',
      payload: {
        time1: values.time1 ? moment(values.time1).format('YYYY-MM-DD HH:mm:ss') : '',
        time2: values.time2 ? moment(values.time2).format('YYYY-MM-DD HH:mm:ss') : '',
      },
    });
    setSearchtime({
      ...searchtime,
      startime: values.time1 ? moment(values.time1).format('X') : '',
      endtime: values.time2 ? moment(values.time2).format('X') : '',
    })
  };
  const handleReset = () => {
    resetFields();
    handleSearch();
  };

  const download = () => {
    const values = getFieldsValue();
    dispatch({
      type: 'knowledg/downloadstatis',
      payload: {
        time1: values.time1 ? moment(values.time1).format('YYYY-MM-DD HH:mm:ss') : '',
        time2: values.time2 ? moment(values.time2).format('YYYY-MM-DD HH:mm:ss') : '',
      },
    }).then(res => {
      const filename = `知识统计${moment().format('YYYY-MM-DD HH:mm')}.xls`;
      const blob = new Blob([res]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  };

  const addcolumns = (title, i) => {
    const handleClick = (addUser) => {
      router.push({
        pathname: `/ITSM/knowledgemanage/query`,
        query: {
          addUser,
          type: title,
          statist: true,
          starttime: searchtime.startime * 1000,
          endtime: searchtime.endtime * 1000,
          pathpush: true
        },
        state: { cache: false, }
      });
    };
    return ({
      title,
      dataIndex: `type${i + 2}`,
      key: `type${i + 2}`,
      render: (text, record) => {
        return (
          <>
            {record.addUser !== '合计' ? (<a onClick={() => handleClick(record.addUser)} > {text}</a>) : (<>{text}</>)}
          </>
        )
      }
    })
  };

  const Setcolumns = (data) => {
    const newArr = [
      { title: '作者', dataIndex: 'addUser', key: 'addUser' },
      {
        title: '知识总数',
        dataIndex: 'type1',
        key: 'type1',
        render: (text, record) => {
          const handleClick = () => {
            router.push({
              pathname: `/ITSM/knowledgemanage/query`,
              query: {
                addUser: record.addUser,
                statist: true,
                starttime: searchtime.startime * 1000,
                endtime: searchtime.endtime * 1000,
                pathpush: true
              },
              state: { cache: false, }
            });
          };
          return (
            <>
              {record.addUser !== '合计' ? (<a onClick={handleClick} > {text}</a>) : (<>{text}</>)}
            </>
          )
        }
      }
    ];
    if (!Array.isArray(data)) {
      return newArr;
    }
    for (let i = 0; i < data.length; i += 1) {
      newArr.push(addcolumns(data[i].title, i))
    }
    return newArr
  }
  const newcolumns = Setcolumns(typemap || [])

  useEffect(() => {
    handleSearch(1, 15);
    dispatch({
      type: 'itsmuser/fetchuser',
    });
  }, []);

  return (
    <PageHeaderWrapper title={pagetitle} >
      <DictLower
        typeid="1412301036722327553"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Card style={{ height: 'calc(100vh - 250px)' }}>
        <Row gutter={8}>
          <Form {...formItemLayout}>
            <Col span={12}>
              <Form.Item label="登记时间">
                <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
                  {getFieldDecorator('time1', {
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
                  {getFieldDecorator('time2', {
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
            <Col span={8} style={{ paddingTop: 4 }}>
              <Button type="primary" onClick={() => handleSearch()}>
                查 询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={handleReset}>
                重 置
              </Button>
            </Col>
          </Form>
        </Row>
        <div style={{ marginBottom: 24 }}>
          <Button type="primary" onClick={() => download()} style={{ marginRight: 8 }}>导出数据</Button >
        </div>
        <Table
          dataSource={statislist}
          columns={newcolumns}
          loading={loading}
          pagination={false}
          rowKey={(_, index) => index.toString()}
        />
      </Card>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ knowledg, itsmuser, loading }) => ({
    statislist: knowledg.statislist,
    userinfo: itsmuser.userinfo,
    loading: loading.models.knowledg,
  }))(Statistics),
);