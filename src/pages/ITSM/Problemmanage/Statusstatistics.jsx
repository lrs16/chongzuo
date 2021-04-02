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
import Link from 'umi/link';

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

const columns = [
  {
    title: '当前环节',
    dataIndex: 'statCurrentNode',
    key: 'statCurrentNode',
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
        return <Link
          to={{
            pathname: '/ITSM/problemmanage/problemquery',
            query: {
              problem: 'status',
              status: record.statCode
            }
          }}
        >
          {text}
        </Link>
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
    statusArr
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

  const rowSelection = {
    onChange: (selectedRowkeys, select) => {
    }
  }

  const pagination = {
    pageSize: 20
  }

  const onChange = (date, dateString) => {
    [statTimeBegin, statTimeEnd] = dateString;
  }

  const handleReset = () => {
    resetFields();
    statTimeBegin = '';
    statTimeEnd = '';
  }

  //  对象数组去重
  const uniqueObjArr = (arr, fieldName) => {
    const result = [];
    const resultArr = [];
    arr.map(function (item, index, value) {
      if (result.indexOf(item[fieldName]) === -1) {
        result.push(item[fieldName]);
        resultArr.push(item);
      }
    })
    return resultArr;
  }

  //  去重并合并到children
  const sortData = (dataArr) => {
    const orgArrRe = dataArr.map(item =>
      ({ statCurrentNode: item.statCurrentNode })
    );
    const orgArr = uniqueObjArr(orgArrRe, 'statCurrentNode');// 数组去重
    orgArr.map(function (childOne) {
      childOne.children = [];
      dataArr.map(function (childTwo) {
        if (childOne.statCurrentNode === childTwo.statCurrentNode) {
          childOne.children.push(childTwo);
        }
      })
    })

    // for (const every of orgArr) {
    //   every.span = every.children ? every.children.length : 0;
    // }

    orgArr.forEach((every) => { every.span = every.children ? every.children.length : 0; });
    return orgArr;
  }

  //  遍历子元素，并赋值纵向合并数rowSpan
  const makeData = (data) => {

    const sortResult = sortData(data);
    // console.log('sortResult: ', sortResult);
    const dataSource = [];
    sortResult.forEach((item) => {
      // console.log('item: ', item);
      if (item.children) {
        // console.log('item.children: ', item.children);
        item.children.forEach((itemOne, indexOne) => {
          // console.log('indexOne: ', indexOne);
          const myObj = itemOne;
          myObj.rowSpan = indexOne === 0 ? item.span : 0;
          dataSource.push(myObj);
        });
      }
    });
    return dataSource;
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
          bordered
          columns={columns}
          dataSource={makeData(statusArr)}
          pagination={false}
          rowKey={record => record.statCode}
          // rowSelection={rowSelection}
        />
      </Card>

    </PageHeaderWrapper>
  )
}

export default Form.create({})(
  connect(({ problemstatistics }) => ({
    statusArr: problemstatistics.statusArr
  }))(Statusstatistics),
);