import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import {
  Card,
  Row,
  Col,
  Form,
  Input,
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
let statTimeBegin = '';
let statTimeEnd = '';
const newObj = {};
const renderContent = (value, row, index) => {
  const obj = {
    children: value,
    props: {},
  };
  return obj;
};

function Handlingrate(props) {
  const { pagetitle } = props.route.name;
  const [changearr, setChangeArr] = useState();
  const [tabActiveKey, setTabActiveKey] = useState('1');
  const {
    form: { getFieldDecorator, resetFields },
    handlingratedata,
    dispatch
  } = props;

  const columnsDevelopers = [
    {
      title: '开发商',
      dataIndex: 'handleDept',
      key: 'handleDept',
      render: (text, row, index) => {
        if (row.handler === '小计') {
          return {
            // children: <a>{row.handleDep}</a>,
            props: {
              colSpan: 1,
            },
          }
        };
        if (row.handler === '合计') {
          return {
            // children: <a>{row.handler}</a>,
            props: {
              colSpan: 1,
            },
          }
        };
        if (row.handler !== '小计') {
          return {
            children: <span>{text}</span>
          }
        }
      },
    },
    {
      title: '负责人',
      dataIndex: 'handler',
      key: 'handler',
      render: (text, row, index) => {
        if (row.handler === '小计') {
          return <span style={{ fontWeight: 700 }}>{text}</span>
        }

        if (row.handler === '合计') {
          return <span style={{ fontWeight: 700 }}>{text}</span>
        }

        return <span>{text}</span>
      }
    },
    {
      title: '问题总数',
      dataIndex: 'total',
      key: 'total',
      render: (text, record, index) => {
        // if (record.handler === '合计') {
        //   return <span style={{ fontWeight: 700 }}>{text}</span>
        // }
     
        return <Link
        to={{
          pathname: '/ITSM/problemmanage/problemquery',
          query: {
            problem: 'handle',
            handlerId: record.handlerId,
            status: record.totalCode,
            handleDeptId: record.handleDeptId,
            handleProcessGroupType: tabActiveKey
          }
        }}
      >
        {text}
      </Link>
   
      }
    },
    {
      title: '待处理',
      dataIndex: 'handlingCount',
      key: 'handlingCount',
      render: (text, record) => (
        <Link
          to={{
            pathname: '/ITSM/problemmanage/problemquery',
            query: {
              problem: 'handle',
              handlerId: record.handlerId,
              status: record.handlingCode,
              handleDeptId: record.handleDeptId,
              handleProcessGroupType: tabActiveKey
            }
          }}
        >
          {text}
        </Link>
      )
    },
    {
      title: '已处理待确认',
      dataIndex: 'handledCount',
      key: 'handledCount',
      render: (text, record) => (
        <Link
          to={{
            pathname: '/ITSM/problemmanage/problemquery',
            query: {
              problem: 'handle',
              handlerId: record.handlerId,
              status: record.handledCode,
              handleDeptId: record.handleDeptId,
              handleProcessGroupType: tabActiveKey
            }
          }}
        >
          {text}
        </Link>
      )
    },
    {
      title: '已完成',
      dataIndex: 'closedCount',
      key: 'closedCount',
      render: (text, record) => (
        <Link
          to={{
            pathname: '/ITSM/problemmanage/problemquery',
            query: {
              problem: 'handle',
              handlerId: record.handlerId,
              status: record.closedCode,
              handleDeptId: record.handleDeptId,
              handleProcessGroupType: tabActiveKey
            }
          }}
        >
          {text}
        </Link>
      )
    },
    {
      title: '处理率',
      dataIndex: 'handleRate',
      key: 'handleRate',
      render: (text, record) => (
        <span>{text}%</span>
      )
    },
  ];

  const columnsBusiness = [
    {
      title: '业务负责人',
      dataIndex: 'handler',
      key: 'handler',
      render: (text, row, index) => {
        if (row.handler === '小计') {
          return <span style={{ fontWeight: 700 }}>{text}</span>
        }

        if (row.handler === '合计') {
          return <span style={{ fontWeight: 700 }}>{text}</span>
        }

        return <span>{text}</span>
      }
    },
    {
      title: '问题总数',
      dataIndex: 'total',
      key: 'total',
      render: (text, record, index) => {
        // if (record.handler === '合计') {
        //   return <span style={{ fontWeight: 700 }}>{text}</span>
        // }
     
        return <Link
        to={{
          pathname: '/ITSM/problemmanage/problemquery',
          query: {
            problem: 'handle',
            handlerId: record.handlerId,
            status: record.totalCode,
            handleDeptId: record.handleDeptId,
            handleProcessGroupType: tabActiveKey
          }
        }}
      >
        {text}
      </Link>
   
      }
    },
    {
      title: '待处理',
      dataIndex: 'handlingCount',
      key: 'handlingCount',
      render: (text, record, index) => {
        // if (record.handler === '合计') {
        //   return <span style={{ fontWeight: 700 }}>{text}</span>
        // }
     
        return <Link
        to={{
          pathname: '/ITSM/problemmanage/problemquery',
          query: {
            problem: 'handle',
            handlerId: record.handlerId,
            status: record.handlingCode,
            handleDeptId: record.handleDeptId,
            handleProcessGroupType: tabActiveKey
          }
        }}
      >
        {text}
      </Link>

   
      }
    },
    {
      title: '已处理待确认',
      dataIndex: 'handledCount',
      key: 'handledCount',
      render: (text, record) => {
        // if(record.handler === '合计') {
        //   return <span style={{fontWeight:700}}>{text}</span>
        // }
         return <Link
          to={{
            pathname: '/ITSM/problemmanage/problemquery',
            query: {
              problem: 'handle',
              handlerId: record.handlerId,
              status: record.handledCode,
              handleDeptId: record.handleDeptId,
              handleProcessGroupType: tabActiveKey
            }
          }}
        >
          {text}
        </Link>
      }
    },
    {
      title: '已确认',
      dataIndex: 'closedCount',
      key: 'closedCount',
      render: (text, record) => {
        // if(record.handler === '合计') {
        //   return <span style={{fontWeight:700}}>{text}</span>
        // }
        return <Link
          to={{
            pathname: '/ITSM/problemmanage/problemquery',
            query: {
              problem: 'handle',
              handlerId: record.handlerId,
              status: record.closedCode,
              handleDeptId: record.handleDeptId,
              handleProcessGroupType: tabActiveKey
            }
          }}
        >
          {text}
        </Link>
    }
    },
  ];

  const onChange = (date, dateString) => {
    [statTimeBegin, statTimeEnd] = dateString;
  }

  const handleListdata = () => {
    dispatch({
      type: 'problemstatistics/handleLists',
      payload: { handleProcessGroupType: tabActiveKey, statTimeBegin, statTimeEnd }
    })
  }

  const download = () => {
    dispatch({
      type: 'problemstatistics/solveschedule',
      payload: { handleProcessGroupType: tabActiveKey, statTimeBegin, statTimeEnd }
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

  const handleReset = () => {
    resetFields();
    statTimeBegin = '';
    statTimeEnd = '';
  }

  useEffect(() => {
    statTimeBegin = '';
    statTimeEnd = '';
    handleListdata();
    handleReset();
  }, [tabActiveKey])

  const tabList = [
    {
      key: '1',
      tab: '问题解决进度管控表_开发商',
    },
    {
      key: '2',
      tab: '问题解决进度管控表_自动化科业务人员',
    },
  ];

  const handleTabChange = (key) => { // tab切换
    setTabActiveKey(key);
  };



  return (
    <PageHeaderWrapper
      title={pagetitle}
      tabList={tabList}
      onTabChange={handleTabChange}
      tabActiveKey={tabActiveKey}
    >
      <Card>
        <Row gutter={16}>
          <Form {...formItemLayout}>
            <Col span={8}>
              <Form.Item label='统计时间'>
                {
                  getFieldDecorator('time1', {})
                    (<RangePicker onChange={onChange} />)
                }
              </Form.Item>
            </Col>

            <Col span={8}>
              <Button
                type='primary'
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

        {
          tabActiveKey === '1' &&
          <Table
            columns={columnsDevelopers}
            dataSource={handlingratedata}
            rowKey={record => record.handler}
          />
        }

        {
          tabActiveKey === '2' &&
          <Table
            columns={columnsBusiness}
            dataSource={handlingratedata}
            rowKey={record => record.handler}
          />
        }


      </Card>
    </PageHeaderWrapper>
  )
}

export default Form.create({})(
  connect(({ problemstatistics }) => ({
    handlingratedata: problemstatistics.handlingratedata
  }))(Handlingrate),
);