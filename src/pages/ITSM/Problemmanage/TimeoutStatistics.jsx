import React, { useEffect } from 'react';
import { connect } from 'dva';
import {
  Card,
  Row,
  Col,
  DatePicker,
  Button,
  Table,
  Form
} from 'antd';
import Link from 'umi/link';
import moment from 'moment';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const { RangePicker } = DatePicker;
let statTimeBegin = '';
let statTimeEnd = '';
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  }
}


function TimeoutStatistics(props) {
  const {
    form: { getFieldDecorator, resetFields },
    dispatch,
    timeoutArr,
    location,
    loading
  } = props;

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index'
    },
    {
      title: '超时状态',
      dataIndex: 'statName',
      key: 'statName'
    },
    {
      title: '工单数',
      dataIndex: 'statCount',
      key: 'statCount',
      render: (text, record) => {
        if (record.statName !== '合计') {
          return <Link
            to={{
              pathname: '/ITSM/problemmanage/problemquery',
              query: {
                problem: 'timeout',
                timeStatus: record.statCode,
                addTimeBegin: statTimeBegin ?  moment(statTimeBegin).format('YYYY-MM-DD 00:00:00') :'',
                addTimeEnd:  statTimeEnd ? moment(statTimeEnd).format('YYYY-MM-DD 23:59:59')  :'',
                pathpush: true
              },
              state: { cache: false, }
            }}
          >
            {text}
          </Link>
        }
        return <span>{text}</span>
      }
    },
  ]
  if (timeoutArr.length) {
    timeoutArr.forEach((item, index) => {
      if (index !== 5) {
        timeoutArr[index].index = index + 1;
      }
    })
  }

  const gettimeoutList = () => {
    dispatch({
      type: 'problemstatistics/timeoutLists',
      payload: { statTimeBegin, statTimeEnd }
    })
  }

  const download = () => {
    dispatch({
      type: 'problemstatistics/timeDownload',
      payload: { statTimeBegin, statTimeEnd }
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

  const onChange = (date, dateString) => {
    [statTimeBegin, statTimeEnd] = dateString;

  }

  const handleReset = () => {
    resetFields();
    statTimeBegin = '';
    statTimeEnd = '';
    dispatch({
      type: 'problemstatistics/timeoutLists',
      payload: { statTimeBegin, statTimeEnd }
    })
  }

  useEffect(() => {
    if (location.state && location.state.reset) {
      handleReset();
      dispatch({
        type: 'problemstatistics/timeoutLists',
        payload: { statTimeBegin, statTimeEnd }
      })
    }
  }, [location.state]);

  useEffect(() => {
    statTimeBegin = '';
    statTimeEnd = '';
    dispatch({
      type: 'problemstatistics/timeoutLists',
      payload: { statTimeBegin, statTimeEnd }
    })
  }, []);

  return (
    <PageHeaderWrapper>
      <Card>
        <Row gutter={16}>
          <Form {...formItemLayout}>
            <Col span={8}>
              <Form.Item label='统计时间'>
                {
                  getFieldDecorator('time', {})
                    (<RangePicker onChange={onChange} />)
                }
              </Form.Item>
            </Col>
          </Form>


          <Col span={8}>
            <Button
              type='primary'
              onClick={() => gettimeoutList('search')}
            >
              查询
            </Button>

            <Button
              style={{ marginLeft: 8 }}
              onClick={handleReset}

            >
              重置
            </Button>
          </Col>
        </Row>

        <div>
          <Button
            type='primary'
            style={{ marginBottom: 24 }}
            onClick={download}

          >
            导出数据
          </Button>
        </div>

        <Table
          loading={loading}
          columns={columns}
          dataSource={timeoutArr}
          rowKey={record => record.statName}
        />


      </Card>
    </PageHeaderWrapper>
  )
}

export default Form.create({})(
  connect(({ problemstatistics,loading }) => ({
    timeoutArr: problemstatistics.timeoutArr,
    loading:loading.models.problemstatistics
  }))(TimeoutStatistics)
);