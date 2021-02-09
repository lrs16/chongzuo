import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Card,
  Row,
  Col,
  Form,
  Button,
  DatePicker,
  Table
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const { RangePicker } = DatePicker;

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

function Overtime(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, resetFields, validateFields },
    loading,
    dispatch,
    faultWorkoderCountList
  } = props;

  const [paginations, setPageinations] = useState({ current: 1, pageSize: 10 });
  const [dictType] = useState('type');

  const columns = [
    {
      title: '一级类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '二级类型',
      dataIndex: 'statName',
      key: 'statName',
    },
    {
      title: '工单数',
      dataIndex: 'statCount',
      key: 'statCount',
    },
  ];

  const getfaultWorkoderCountList = () => { // 列表
    validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'faultcount/getfaultWorkoderCount',
          payload: {
            ...values,
            pageNum: paginations.current,
            pageSize: paginations.pageSize,
            dictType: 'type'
          },
        });
      }
    });
  }

  useEffect(() => {
    getfaultWorkoderCountList();
  }, []);

  const handleReset = () => {
    resetFields();
  };

  const searchdata = (values, page, pageSize, dict) => {
    dispatch({
      type: 'faultcount/getfaultWorkoderCount1',
      payload: {
        values,
        pageSize,
        pageNum: page,
        dictType: dict,
      },
    });
  };

  const handleSearch = () => {
    setPageinations({
      ...paginations,
      current: 1,
    });
    validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      const values = {
        statTimeBegin: moment(fieldsValue.rangeTimeValue[0]).format('YYYY-MM-DD HH:mm:ss'),
        statTimeEnd: moment(fieldsValue.rangeTimeValue[1]).format('YYYY-MM-DD HH:mm:ss'),
      };
      searchdata(values, paginations.current, paginations.pageSize, dictType);
    });
  };

  // const onShowSizeChange = (page, pageSize) => {
  //   validateFields((err, values) => {
  //     if (!err) {
  //       searchdata(values, page, pageSize);
  //     }
  //   });
  //   setPageinations({
  //     ...paginations,
  //     pageSize,
  //   });
  // };

  // const changePage = page => {
  //   validateFields((err, values) => {
  //     if (!err) {
  //       searchdata(values, page, paginations.pageSize);
  //     }
  //   });
  //   setPageinations({
  //     ...paginations,
  //     current: page,
  //   });
  // };

  // const pagination = {
  //   showSizeChanger: true,
  //   onShowSizeChange: (page, pageSize) => onShowSizeChange(page, pageSize),
  //   current: paginations.current,
  //   pageSize: paginations.pageSize,
  //   // total: 
  //   onChange: page => changePage(page),
  // };

  //  下载 /导出功能
  const download = (page, pageSize) => {
    validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'faultcount/faultcountdownload',
          payload: {
            values,
            pageSize,
            current: page,
            dictType
          },
        }).then(() => {
          // console.log(res, 'res')
          // const filename = `下载.xlsx`;
          // const url = window.URL.createObjectURL(res);
          // const a = document.createElement('a');
          // a.href = url;
          // a.download = filename;
          // a.click();
          // window.URL.revokeObjectURL(url);
        });
      }
    });
  };

  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card>
        <Row gutter={12}>
          <Form {...formItemLayout} onSubmit={handleSearch}>
            <Col span={8}>
              <Form.Item label="起始时间">
                {getFieldDecorator('rangeTimeValue', {
                  // initialValue: ['', ''],
                })(
                  <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />,
                )}
              </Form.Item>
            </Col>
            <Col span={4} style={{ textAlign: 'right' }}>
              <Form.Item>
                <Button type="primary" onClick={handleSearch}>
                  查 询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={handleReset}>
                  重 置
                </Button>
              </Form.Item>
            </Col>
          </Form>
        </Row>
        <div style={{ marginBottom: 24 }}>
          <Button type="primary" onClick={() => download()}>导出数据</Button>
        </div>
        <Table
          loading={loading}
          columns={columns}
          dataSource={faultWorkoderCountList}
          table-layout="fixed"
          // pagination={pagination}
          rowKey={record => record.statName}
        />
      </Card>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ faultcount, loading }) => ({
    html: faultcount.html,
    loading: loading.models.faultcount,
    faultWorkoderCountList: faultcount.faultWorkoderCountList,
  }))(Overtime),
);
