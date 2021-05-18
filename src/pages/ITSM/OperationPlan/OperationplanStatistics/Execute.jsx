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
  Table
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
        return <span>{text}</span>
      }
      return <span style={{ fontWeight: 700 }}>{text}</span>
    }
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
            status: '计划中'
          }
        })
      };
      return <a onClick={() => gotoDetail(record)}>{text}</a>
    }
  },
  {
    title: '延期中',
    dataIndex: 'yqz',
    key: 'yqz',
    render: (text, record) => {
      const gotoDetail = (record) => {
        router.push({
          pathname: `/ITSM/operationplan/operationplansearch`,
          query: {
            time1: record.time1,
            time2: record.time2,
            operationUser: record.user === '合计' ? '' : record.user,
            status: '延期中'
          }
        })
      };
      return <a onClick={() => gotoDetail(record)}>{text}</a>
    }
  },
  {
    title: '已完成',
    dataIndex: 'ywc',
    key: 'ywc',
    render: (text, record) => {
      const gotoDetail = (record) => {
        router.push({
          pathname: `/ITSM/operationplan/operationplansearch`,
          query: {
            time1: record.time1,
            time2: record.time2,
            operationUser: record.user === '合计' ? '' : record.user,
            executeStatus: '已完成'
          }
        })
      };
      return <a onClick={() => gotoDetail(record)}>{text}</a>
    }
  },

];

function Execute(props) {
  const { pagetitle } = props.route.name;
  const {
    form: { getFieldDecorator, setFieldsValue },
    userExecuteStatusArr,
    dispatch
  } = props;

  const onChange = (date, dateString) => {
    startTime = dateString;
    endTime = moment(dateString).add(+6, 'day').format('YYYY-MM-DD');
    setFieldsValue({ time2: moment(endTime) });
  }

  const endonChange = (date, dateString) => {
    endTime = dateString;
    startTime = moment(dateString).subtract('day', 6).format('YYYY-MM-DD');
    setFieldsValue({ time1: moment(startTime) })
  }


  const handleListdata = () => {
    dispatch({
      type: 'taskstatistics/userExecuteStatus',
      payload: { startTime, endTime }
    })
  }

  const download = () => {
    dispatch({
      type: 'taskstatistics/downloadUserExecuteStatus',
      payload: {
        time1: startTime,
        time2: endTime,
      }
    }).then(res => {
      const filename = '下载.xls';
      const blob = new Blob([res]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    })
  }


  const defaultTime = () => {
    //  周统计
    startTime = moment().subtract('days', 6).format('YYYY-MM-DD');
    endTime = moment().format('YYYY-MM-DD');
  }

  useEffect(() => {
    defaultTime();
    handleListdata();
  }, [])

  const startdisabledDate = (current) => {
    return current > moment().subtract('days', 6)
  }

  const enddisabledDate = (current) => {
    return current > moment().endOf('day')
  }

  return (
    <PageHeaderWrapper
      title={pagetitle}
    >
      <Card>
        <Row gutter={24}>
          <Form layout='inline'>
            <>
              <Col span={24}>
                <Form.Item label='起始时间'>
                  {getFieldDecorator('time1', {
                    initialValue: startTime ? moment(startTime) : ''
                  })(<DatePicker
                    format="YYYY-MM-DD"
                    allowClear='false'
                    disabledDate={startdisabledDate}
                    onChange={onChange}
                  />)}
                </Form.Item>

                <p style={{ display: 'inline', marginRight: 8 }}>-</p>

                <Form.Item label=''>
                  {
                    getFieldDecorator('time2', {
                      initialValue: endTime ? moment(endTime) : ''
                    })
                      (<DatePicker
                        disabledDate={enddisabledDate}
                        onChange={endonChange}
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
          <Button
            type='primary'
            style={{ marginBottom: 24, marginTop: 5 }}
            onClick={download}
          >
            导出数据
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={userExecuteStatusArr}
          rowKey={record => record.statName}
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default Form.create({})(
  connect(({ taskstatistics }) => ({
    userExecuteStatusArr: taskstatistics.userExecuteStatusArr
  }))(Execute),
);