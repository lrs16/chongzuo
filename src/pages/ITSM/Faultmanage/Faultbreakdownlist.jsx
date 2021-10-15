import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Card,
  Row,
  Col,
  Form,
  DatePicker,
  Button,
} from 'antd';
import Link from 'umi/link';
import MergeTable from '@/components/MergeTable';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const { RangePicker } = DatePicker;
let statTimeBegin;
let statTimeEnd;
let search = false;
const mergeCell = 'statCatalogue';

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

const columns = [
  {
    title: '一级类型',
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
    title: '二级类型',
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
        return <Link
          to={{
            pathname: '/ITSM/faultmanage/querylist',
            query: {
              addTimeBegin: search ? moment(statTimeBegin).format('YYYY-MM-DD 00:00:00'):'',
              addTimeEnd:  search ? moment(statTimeEnd).format('YYYY-MM-DD 23:59:59'):'',
              type: record.statCode,
              dictType: 'type',
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
function Faultbreakdownlist(props) {
  const { pagetitle } = props.route.name;
  const {
    form: { getFieldDecorator, resetFields },
    dispatch,
    faultArr,
    loading
  } = props;


  const onChange = (date, dateString) => {
    [statTimeBegin, statTimeEnd] = dateString;
  }

  const handleList = () => {
    search = true;
    dispatch({
      type: 'faultstatics/fetchfaultlist',
      payload: { statTimeBegin:moment(statTimeBegin).format('YYYY-MM-DD 00:00:00'), statTimeEnd:moment(statTimeEnd).format('YYYY-MM-DD 23:59:59'), dictType: 'type' }
    })
  }

  useEffect(() => {
    statTimeBegin = '';
    statTimeEnd = '';
    search = false;
    dispatch({
      type: 'faultstatics/fetchfaultlist',
      payload: { statTimeBegin, statTimeEnd, dictType: 'type' }
    })
  }, []);

  const handleReset = () => {
    resetFields();
    statTimeBegin = '';
    statTimeEnd = '';
  }

  const download = () => {
    dispatch({
      type: 'faultstatics/downloadFaultdownlist',
      payload: { dictType: 'type', statTimeBegin, statTimeEnd }
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


  return (
    <PageHeaderWrapper title={pagetitle}>
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

            <Col span={8}>
              <Button
                type='primary'
                onClick={() => handleList()}
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
          </Form>
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

        {loading === false && (
          <MergeTable
            column={columns}
            tableSource={faultArr}
            mergecell={mergeCell}
          />
        )}
      </Card>

    </PageHeaderWrapper>
  )
}

export default Form.create({})(
  connect(({ faultstatics,loading }) => ({
    faultArr: faultstatics.faultArr,
    loading: loading.models.faultstatics
  }))(Faultbreakdownlist)
);