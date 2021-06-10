import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import {
  Card,
  Row,
  Col,
  Form,
  DatePicker,
  Button,
  Table,
} from 'antd';
import Link from 'umi/link';
import MergeTable from '@/components/MergeTable';
import moment from 'moment';
import { PageHeaderWrapper } from '@ant-design/pro-layout';


const { RangePicker } = DatePicker;
let searchSign = '';

let statTimeBegin = '';
let statTimeEnd = '';
const mergecell = 'firstLevel';
const columns = [
  {
    title: '一级功能',
    dataIndex: mergecell,
    key: mergecell,
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
    title: '二级功能',
    dataIndex: 'twoLevel',
    key: 'twoLevel',
  },
  {
    title: '三级功能',
    dataIndex: 'threeLevel',
    key: 'threeLevel',
  },
  {
    title: '工单数',
    dataIndex: 'number',
    key: 'number',
    render: (text, record) => (
      <Link
        to={{
          pathname: '/ITSM/demandmanage/query',
          query: {
            module: record.fullName,
            statisticalType: 'demandRequirement',
            startTime: searchSign ? statTimeBegin : '',
            endTime: searchSign ? statTimeEnd : '',
            pathpush: true
          },
          state: { cache: false, }
        }}
      >
        {text}
      </Link>
    )
  },
];


function DemandRequirement(props) {
  const { pagetitle } = props.route.name;
  const {
    form: { getFieldDecorator, resetFields },
    requirementArr,
    dispatch,
    loading,
    location
  } = props;

  // if (requirementArr && requirementArr.length) {
  //   for (let i = 0; i < requirementArr.length - 1; i++) {
  //     for (let j = i + 1; j < requirementArr.length; j++) {
  //       if (requirementArr[i].firstLevel === requirementArr[j].firstLevel) {
  //         requirementArr[j].firstLevel = '';
  //       }
  //     }
  //   }
  // }

  const onChange = (date, dateString) => {
    [statTimeBegin, statTimeEnd] = dateString;
  }



  const handleListdata = (params) => {
    if (params) {
      searchSign = 'searchSign';
    }
    dispatch({
      type: 'demandstatistic/fetchdemandRequirement',
      payload: { statTimeBegin, statTimeEnd }
    })
  }

  const download = () => {
    dispatch({
      type: 'demandstatistic/downloadrequirement',
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


  useEffect(() => {
    searchSign = '';
    handleListdata();
  }, [])

  const handleReset = () => {
    statTimeBegin = '';
    statTimeEnd = '';
    resetFields();
    handleListdata();
  }

  useEffect(() => {
    handleReset();
    if (location.state) {
      // 点击菜单刷新,并获取数据
      if (location.state.reset) {
        handleReset()
      };
    }
  }, [location]);


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
                  {
                    getFieldDecorator('time1', {})
                      (<RangePicker
                        onChange={onChange} />)
                  }
                </Form.Item>

                <Button
                  type='primary'
                  style={{ marginTop: 6 }}
                  onClick={() => handleListdata('search')}
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

        {/* <Table
          columns={columns}
          dataSource={requirementArr}
          rowKey={record => record.statName}
        /> */}

        {/* {loading === false && ( */}
        <MergeTable
          column={columns}
          tableSource={requirementArr}
          mergecell={mergecell}
        />
        {/* )} */}
      </Card>
    </PageHeaderWrapper>
  )
}

export default Form.create({})(
  connect(({ demandstatistic, loading }) => ({
    requirementArr: demandstatistic.requirementArr,
    loading: loading.models.demandstatistic,
  }))(DemandRequirement),
);