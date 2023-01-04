import React, { useEffect } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import {
  Card,
  Row,
  Col,
  Form,
  DatePicker,
  Button,
  Table,
  message
} from 'antd';
import moment from 'moment';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

let startTime;
let endTime;
const columns = [
  {
    title: '作业状态',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: '作业计划数',
    dataIndex: 'num',
    key: 'num',
    render: (text, record) => {
      const gotoDetail = () => {
        router.push({
          pathname: `/ITSM/operationplan/operationplansearch`,
          query: {
            time1: record.time1,
            time2: record.time2,
            status: record.status === '合计' ? '' : record.status,
            pathpush: true,
          },
          state: { cache: false },
        });
      };
      return <a onClick={() => gotoDetail(record)}>{text}</a>;
    },
  },
];

function Status(props) {
  const { pagetitle } = props.route.name;
  const {
    form: { getFieldDecorator, validateFields, setFieldsValue },
    operationStatusArr,
    dispatch,
    location,
  } = props;

  const handleListdata = () => {
    validateFields((err, value) => {
      startTime = moment(value.time1).format('YYYY-MM-DD');
      endTime = moment(value.time2).format('YYYY-MM-DD');
      if (moment(startTime).valueOf() > moment(endTime).valueOf()) {
        message.error('开始时间必须小于结束时间')
      } else {
        dispatch({
          type: 'taskstatistics/operationStatus',
          payload: { startTime, endTime },
        });
      }
    });
  };

  const download = () => {
    validateFields((err, value) => {
      startTime = moment(value.time1).format('YYYY-MM-DD');
      endTime = moment(value.time2).format('YYYY-MM-DD');
      if (moment(startTime).valueOf() > moment(endTime).valueOf()) {
        message.error('开始时间必须小于结束时间')
      } else {
        dispatch({
          type: 'taskstatistics/downloadOperationStatus',
          payload: {
            time1: startTime,
            time2: endTime,
          },
        }).then(res => {
          const filename = '下载.xls';
          const blob = new Blob([res]);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        });
      }
    });
  };

  const defaultTime = () => {
    startTime = moment()
      .subtract('days', 6)
      .format('YYYY-MM-DD');
    endTime = moment().format('YYYY-MM-DD');
    setFieldsValue({
      time1: moment(startTime),
      time2: moment(endTime)
    });
  };

  useEffect(() => {
    defaultTime();
    dispatch({
      type: 'taskstatistics/operationStatus',
      payload: { startTime, endTime },
    });
  }, []);

  useEffect(() => {
    if (location.state && location.state.reset) {
      dispatch({
        type: 'taskstatistics/operationStatus',
        payload: { startTime, endTime },
      });
    }
  }, [location.state]);

  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card>
        <Row gutter={24}>
          <Form layout="inline">
            <>
              <Col span={24}>
                <Form.Item label='起始时间'>
                  {getFieldDecorator('time1', {
                    initialValue: moment(startTime)
                  })(<DatePicker
                    allowClear={false}
                  />)}
                </Form.Item>


                <p style={{ display: 'inline', marginRight: 8 }}>-</p>

                <Form.Item label=''>
                  {
                    getFieldDecorator('time2', {
                      initialValue: moment(endTime)
                    })
                      (<DatePicker
                        allowClear={false}
                      />)
                  }
                </Form.Item>

                <Button
                  type='primary'
                  style={{ marginTop: 6 }}
                  onClick={() => handleListdata('search')}
                >
                  查询
                </Button>
              </Col>
            </>
          </Form>
        </Row>

        <div>
          <Button type="primary" style={{ marginBottom: 24, marginTop: 5 }} onClick={download}>
            导出数据
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={operationStatusArr}
          rowKey={(record, index) => {
            return index;
          }}
        />
      </Card>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ taskstatistics }) => ({
    operationStatusArr: taskstatistics.operationStatusArr,
  }))(Status),
);
