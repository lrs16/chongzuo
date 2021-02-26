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

const columns = [
  {
    title: '工单数',
    dataIndex: 'total',
    key: 'total',
  },
  {
    title: '已处理',
    dataIndex: 'processed',
    key: 'processed',
    render: (text, record) => (
      <Link 
        to={{
          pathname:'/ITSM/problemmanage/problemquery',
          query:{handleStatu:'1'}
        }}
      >
        {text}
      </Link>
    )
  },
  {
    title: '未处理',
    dataIndex: 'unprocessed',
    key: 'unprocessed',
    render:(text,record) => (
      <Link
        to={{
          pathname:'/ITSM/problemmanage/problemquery',
          query:{handleStatu:'0'}
        }}
      >
      {text}
      </Link>
    )
  },
  {
    title: '处理率',
    dataIndex: 'treatmentRate',
    key: 'treatmentRate',
  },
]
function Handlingrate(props) {
  const { pagetitle } = props.route.name;
  const [changearr,setChangeArr] = useState();
  const {
    form: { getFieldDecorator,resetFields },
    handleArr,
    dispatch
  } = props;

  const onChange = (date, dateString) => {
    [statTimeBegin, statTimeEnd] = dateString;
  }

  const handleListdata = (params) => {
    dispatch({
        type:'problemstatistics/handleLists',
        payload:params? { statTimeBegin, statTimeEnd } : { statTimeBegin:'', statTimeEnd:'' }
    }).then(res => {
      if(res.code === 200) {
        statTimeBegin = '';
        statTimeEnd = '';
        const newArr = res.data;
        newArr.forEach((item) =>{
          switch (item.statName) {
            case '已处理':
              newObj.processed = item.statCount
              break;
            case '未处理':
              newObj.unprocessed = item.statCount
              break;
            case '合计':
              newObj.total = item.statCount
              break;
            case '处理率':
              newObj.treatmentRate = item.statCount
              break;
            default:
              break;
          }
        });
        const arr = [];
        arr[0] = newObj;
        setChangeArr(arr);
      }
    })
  }

  const download = () => {
    dispatch({
      type:'problemstatistics/downloadHandlegrate'
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
  }

  useEffect(() => {
    handleListdata();
  },[])

  
  return (
    <PageHeaderWrapper title={pagetitle}>
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

        <Table
          columns={columns}
          dataSource={changearr}
          rowKey={record => record.statName}
        />

      </Card>
    </PageHeaderWrapper>
  )
}

export default Form.create({})(
  connect(({ problemstatistics }) => ({
    handleArr: problemstatistics.handleArr
  }))(Handlingrate),
);