import React, { useEffect } from 'react';
import { connect } from 'dva';
import {
  Card,
  Row,
  Col,
  Form,
  DatePicker,
  Button,
  Table
} from 'antd';
import Link from 'umi/link';
import moment from 'moment';
import MergeTable from '@/components/MergeTable';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

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

const { RangePicker } = DatePicker;
let statTimeBegin;
let statTimeEnd;
let search = false;
const mergeCell = 'statCurrentNode';


function Statusstatistics(props) {
  const { pagetitle } = props.route.name;
  const {
    form: { getFieldDecorator, resetFields },
    dispatch,
    statusArr,
    loading,
    location
  } = props;

  const columns = [
    {
      title: '当前环节',
      dataIndex: 'statCurrentNode',
      key: 'statCurrentNode',
    },
    {
      title: '工单数',
      dataIndex: 'statCount',
      key: 'statCount',
      align: 'center',
      render: (text, record) => {
        if (record.statName !== '合计') {
          return (<Link
            to={{
              pathname: '/ITSM/problemmanage/problemquery',
              query: {
                problem: 'status',
                addTimeBegin: search ?  moment(statTimeBegin).format('YYYY-MM-DD 00:00:00') : '',
                addTimeEnd: search ? moment(statTimeEnd).format('YYYY-MM-DD 23:59:59')  : '',
                currentNode: record.statCurrentNode,
                pathpush: true
              },
              state: { cache: false, }
            }}
          >
            {text}
          </Link>
          )
        }
        return <span>{text}</span>
      }
    },
  ]

  const handleReset = () => {
    resetFields();
    statTimeBegin = '';
    statTimeEnd = '';
  }

  useEffect(() => {
    if (location.state && location.state.reset) {
      handleReset();
      dispatch({
        type: 'problemstatistics/fetchstatusList',
        payload: { statTimeBegin, statTimeEnd }
      });
    }
  }, [location.state]);

  const statusList = () => {
    search = true;
    dispatch({
      type: 'problemstatistics/fetchstatusList',
      payload: { statTimeBegin, statTimeEnd }
    });
  }

  useEffect(() => {
    search = false;
    statTimeBegin = '';
    statTimeEnd = '';
    dispatch({
      type: 'problemstatistics/fetchstatusList',
      payload: { statTimeBegin, statTimeEnd }
    });
  }, [])

  const download = () => {
    dispatch({
      type: 'problemstatistics/download',
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




  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card>
        <Row gutter={16}>
          <Form {...formItemLayout}>
            <Col span={8}>
              <Form.Item label='统计时间'>
                {
                  getFieldDecorator('time2', {})
                    (<RangePicker onChange={onChange} />)
                }
              </Form.Item>
            </Col>

            <Col span={8}>
              <Button type='primary' onClick={() => statusList('search')}>
                查询
              </Button>

              <Button
                style={{ marginLeft: 8 }}
                onClick={handleReset}
              >
                重置
              </Button>
            </Col>
          </Form>
        </Row>

        <div>
          <Button
            type='primary'
            style={{ marginBottom: 24 }}
            onClick={() => download()}
          >
            导出数据
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={statusArr}
        />
      </Card>

    </PageHeaderWrapper>
  )
}

export default Form.create({})(
  connect(({ problemstatistics, loading }) => ({
    statusArr: problemstatistics.statusArr,
    loading: loading.models.problemstatistics
  }))(Statusstatistics),
);