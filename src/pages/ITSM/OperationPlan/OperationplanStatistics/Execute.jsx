import React, { useEffect } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
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
    title: '作业负责人',
    dataIndex: 'user',
    key: 'user',
    render: (text, record) => {
      if (record.user !== '合计') {
        return <span>{text}</span>;
      }
      return <span style={{ fontWeight: 700 }}>{text}</span>;
    },
  },
  {
    title: '计划中',
    dataIndex: 'jhz',
    key: 'jhz',
    render: (text, record) => {
      const gotoDetail = () => {
        router.push({
          pathname: `/ITSM/operationplan/operationplansearch`,
          query: {
            time1: record.time1,
            time2: record.time2,
            operationUser: record.user === '合计' ? '' : record.user,
            status: '计划中',
            pathpush: true,
          },
          state: { cache: false },
        });
      };
      return <a onClick={() => gotoDetail(record)}>{text}</a>;
    },
  },
  {
    title: '延期中',
    dataIndex: 'yqz',
    key: 'yqz',
    render: (text, record) => {
      const gotoDetail = records => {
        router.push({
          pathname: `/ITSM/operationplan/operationplansearch`,
          query: {
            time1: records.time1,
            time2: records.time2,
            operationUser: records.user === '合计' ? '' : records.user,
            status: '延期中',
            pathpush: true,
          },
          state: { cache: false },
        });
      };
      return <a onClick={() => gotoDetail(record)}>{text}</a>;
    },
  },
  {
    title: '已完成',
    dataIndex: 'ywc',
    key: 'ywc',
    render: (text, record) => {
      const gotoDetail = records => {
        router.push({
          pathname: `/ITSM/operationplan/operationplansearch`,
          query: {
            time1: records.time1,
            time2: records.time2,
            operationUser: records.user === '合计' ? '' : records.user,
            status: '已完成',
            pathpush: true,
          },
          state: { cache: false },
        });
      };
      return <a onClick={() => gotoDetail(record)}>{text}</a>;
    },
  },
];

function Execute(props) {
  const { pagetitle } = props.route.name;
  const {
    form: { getFieldDecorator, validateFields,setFieldsValue },
    userExecuteStatusArr,
    dispatch,
  } = props;

  const handleListdata = () => {
    validateFields((err, value) => {
      startTime = moment(value.time1).format('YYYY-MM-DD');
      endTime = moment(value.time2).format('YYYY-MM-DD');
      if (moment(startTime).valueOf() > moment(endTime).valueOf()) {
        message.error('开始时间必须小于结束时间')
      } else {
        dispatch({
          type: 'taskstatistics/userExecuteStatus',
          payload: { startTime, endTime },
        });
      }
    });
  };

  const download = () => {
    validateFields((err, value) => {
      startTime = moment(value.time1).format('YYYY-MM-DD');
      endTime = moment(value.time2).format('YYYY-MM-DD');
      dispatch({
        type: 'taskstatistics/downloadUserExecuteStatus',
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
      type: 'taskstatistics/userExecuteStatus',
      payload: { startTime, endTime },
    });
  }, []);

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
          dataSource={userExecuteStatusArr}
          rowKey={(record, index) => { return index }}
        />
      </Card>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ taskstatistics }) => ({
    userExecuteStatusArr: taskstatistics.userExecuteStatusArr,
  }))(Execute),
);
