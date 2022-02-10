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
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const { RangePicker } = DatePicker;
let statTimeBegin = '';
let statTimeEnd = '';

function DemandSchedule(props) {
  const { pagetitle } = props.route.name;
  const {
    form: { getFieldDecorator, resetFields },
    demandscheduleArr,
    dispatch,
    location
  } = props;

  //  对象数组去重
  const uniqueObjArr = (arr, fieldName) => {
    const result = [];
    const resultArr = [];
    arr.map(function (item) {
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
      ({ month: item.month })
    );
    const orgArr = uniqueObjArr(orgArrRe, 'month');// 数组去重
    orgArr.map(function (childOne) {
      childOne.children = [];
      dataArr.map(function (childTwo) {
        if (childOne.month === childTwo.month) {
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
    const dataSource = [];
    sortResult.forEach((item) => {
      if (item.children) {
        item.children.forEach((itemOne, indexOne) => {
          const myObj = itemOne;
          myObj.rowSpan = indexOne === 0 ? item.span : 0;
          dataSource.push(myObj);
        });
      }
    });
    return dataSource;
  }


  const columns = [
    {
      title: '月份',
      dataIndex: 'month',
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
      title: '需求总数',
      dataIndex: 'total',
      className: 'center',
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
      title: '所属功能',
      dataIndex: 'features',
      align: 'center',
    },
    {
      title: '所属功能数',
      dataIndex: 'countFeatures',
      align: 'center',
    },
    {
      title: '已开发',
      dataIndex: 'countDevelop',
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
    // {
    //   title: '未开发',
    //   dataIndex: 'countDevelop',
    //   align: 'center',
    //   render: (text, record) => {
    //     const obj = {
    //       children: text,
    //       props: {},
    //     };
    //     obj.props.rowSpan = record.rowSpan;
    //     return obj;
    //   },
    // },
       // {
    //   title: '需求取消',
    //   dataIndex: 'countDevelop',
    //   align: 'center',
    //   render: (text, record) => {
    //     const obj = {
    //       children: text,
    //       props: {},
    //     };
    //     obj.props.rowSpan = record.rowSpan;
    //     return obj;
    //   },
    // },
          // {
    //   title: '需求进度',
    //   dataIndex: 'countDevelop',
    //   align: 'center',
    //   render: (text, record) => {
    //     const obj = {
    //       children: text,
    //       props: {},
    //     };
    //     obj.props.rowSpan = record.rowSpan;
    //     return obj;
    //   },
    // },
    {
      title: '已发布',
      dataIndex: 'countAchieve',
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
      title: '发布率',
      dataIndex: 'countRate',
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
  ];


  const onChange = (date, dateString) => {
    [statTimeBegin, statTimeEnd] = dateString;
  }

  const handleListdata = () => {
    dispatch({
      type: 'demandstatistic/fetchdemandSchedulelist',
      payload: { statTimeBegin, statTimeEnd }
    })
  }

  const download = () => {
    dispatch({
      type: 'demandstatistic/downloaddemandSchedule',
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
                      (<RangePicker onChange={onChange} />)
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

        <Table
          bordered
          columns={columns}
          dataSource={makeData(demandscheduleArr)}
          pagination={false}
          rowKey={(record, index) => { return index }}
        />

      </Card>
    </PageHeaderWrapper>
  )
}

export default Form.create({})(
  connect(({ demandstatistic }) => ({
    demandscheduleArr: demandstatistic.demandscheduleArr
  }))(DemandSchedule),
);