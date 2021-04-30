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
const mergeCell = 'statCurrentNode';

const columns = [
  {
    title: '当前环节',
    dataIndex: mergeCell,
    key: mergeCell,
    align: 'center',
    render: (text, record) => {
      const obj = {
        children: text,
        props: {},
      };
      obj.props.rowSpan = record.rowSpan;
      return obj;
    },
  },
  {
    title: '工单状态',
    dataIndex: 'statName',
    key: 'statName',
    align: 'center',
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
              status: record.statCode,
              addTimeBegin: statTimeBegin,
              addTimeEnd: statTimeEnd,
            }
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
function Statusstatistics(props) {
  const { pagetitle } = props.route.name;
  const {
    form: { getFieldDecorator, resetFields },
    dispatch,
    statusArr,
    loading
  } = props;

  const statusList = () => {
    dispatch({
      type: 'problemstatistics/fetchstatusList',
      payload: { statTimeBegin, statTimeEnd }
    });
  }

  useEffect(() => {
    statTimeBegin = '';
    statTimeEnd = '';
    statusList();
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

  const handleReset = () => {
    resetFields();
    statTimeBegin = '';
    statTimeEnd = '';
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

        {loading === false && (
          <MergeTable
            column={columns}
            tableSource={statusArr}
            mergecell={mergeCell}
          />
        )}


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