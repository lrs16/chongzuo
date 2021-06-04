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

const columns = [
  {
    title: '问题分类',
    dataIndex: 'statName',
    key: 'statName'
  },
  {
    title: '工单数',
    dataIndex: 'statCount',
    key: 'statCount',
    render: (text, record) => {
      if(record.statName !== '合计') {
        return <Link
        to={{
          pathname: '/ITSM/problemmanage/problemquery',
          query: {
            problem: 'class',
            type: record.statCode,
            addTimeBegin: search ? statTimeBegin:'',
            addTimeEnd:search ? statTimeEnd:'',
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
];

function ClassifiedStatistics(props) {
  const { pagetitle } = props.route.name;
  const {
    form: { getFieldDecorator, resetFields },
    dispatch,
    classArr
  } = props;

  const onChange = (date, dateString) => {
    [statTimeBegin, statTimeEnd] = dateString;
  }

  const handleList = () => {
    search = true;
    dispatch({
      type: 'problemstatistics/fetchClasslist',
      payload: { statTimeBegin, statTimeEnd, dictType: 'type' }
    })
  }

  useEffect(() => {
    search = false;
    statTimeBegin = '';
    statTimeEnd = '';
    dispatch({
      type: 'problemstatistics/fetchClasslist',
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
      type: 'problemstatistics/downloadClass',
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
          dataSource={classArr}
          rowKey={record => record.statCode}
        />
      </Card>

    </PageHeaderWrapper>
  )
}

export default Form.create({})(
  connect(({ problemstatistics }) => ({
    classArr: problemstatistics.classArr
  }))(ClassifiedStatistics)
);