import React, { useEffect, useState } from 'react';
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
import moment from 'moment';
import Link from 'umi/link';
import MergeTable from '@/components/MergeTable';

import { PageHeaderWrapper } from '@ant-design/pro-layout';

const { RangePicker } = DatePicker;

let statTimeBegin;
let statTimeEnd;
let search = false;

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


function Breakdownlist(props) {
  const { pagetitle } = props.route.name;
  const {
    form: { getFieldDecorator, resetFields },
    dispatch,
    faultdetailArr,
    loading
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
      render: (text, record) => {
        if (record.statName !== '合计') {
          return <Link
            to={{
              pathname: '/ITSM/faultmanage/querylist',
              query: {
                status: record.statCode,
                addTimeBegin: search ? statTimeBegin : '',
                addTimeEnd: search ? statTimeEnd : '',
                currentNode: record.statCurrentNode,
                statName: record.statName,
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

  const onChange = (date, dateString) => {
    [statTimeBegin, statTimeEnd] = dateString;
  }

  const handleList = () => {
    search = true;
    dispatch({
      type: 'faultstatics/fetchfaulthandle',
      payload: { statTimeBegin: moment(statTimeBegin).format('YYYY-MM-DD 00:00:00'), statTimeEnd:moment(statTimeEnd).format('YYYY-MM-DD 23:59:59'), dictType: 'type' }
    })
  }

  useEffect(() => {
    search = false;
    statTimeBegin = '';
    statTimeEnd = '';
    dispatch({
      type: 'faultstatics/fetchfaulthandle',
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
      type: 'faultstatics/downloadFaultdetail',
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
                onClick={() => handleList('search')}
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

        <Table
          columns={columns}
          dataSource={faultdetailArr}
        />
      </Card>

    </PageHeaderWrapper>
  )
}

export default Form.create({})(
  connect(({ faultstatics, loading }) => ({
    faultdetailArr: faultstatics.faultdetailArr,
    loading: loading.models.faultstatics
  }))(Breakdownlist)
);