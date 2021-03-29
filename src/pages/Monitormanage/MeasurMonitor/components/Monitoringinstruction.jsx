import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import {
  Table,
  Form,
  Select,
  Row,
  Col,
  Button,
  Input
} from 'antd';

const { Option } = Select;
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

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id'
  },
  {
    title: '指令组',
    dataIndex: 'commGroup',
    key: 'commGroup'
  },
  {
    title: '指令代码',
    dataIndex: 'commCode',
    key: 'commCode'
  },
  {
    title: '指令名称',
    dataIndex: 'commName',
    key: 'commName'
  },
  {
    title: '计划开始时间',
    dataIndex: 'planTime',
    key: 'planTime'
  },
  {
    title: '实际开始时间',
    dataIndex: 'execTime',
    key: 'execTime'
  },
  {
    title: '实际结束时间',
    dataIndex: 'endTime',
    key: 'endTime'
  },
  {
    title: '执行参数',
    dataIndex: 'execParam',
    key: 'execParam'
  },
  {
    title: '执行结果',
    dataIndex: 'execResult',
    key: 'execResult'
  },
  {
    title: '指令状态',
    dataIndex: 'commStatus',
    key: 'commStatus'
  },
  {
    title: '告警状态',
    dataIndex: 'alarmStatus',
    key: 'alarmStatus'
  },
]
function Monitoringinstruction(props) {
  const {
    form: { validateFields, getFieldDecorator },
    dispatch,
    instructionArr
  } = props;
  const [paginations, setPaginations] = useState({ current: 1, pageSize: 10 });

  const getList = () => {
    dispatch({
      type: 'monitorconfiguration/fetchinstructionList',
      payload: {
        rowsPerPage: 10,
        page: 1,
      },
    });
  }

  useEffect(() => {
    // getList();
  }, [])

  const searchdata = (values, page, pageSize) => {
    dispatch({
      type: 'monitorconfiguration/fetchinstructionList',
      payload: {
        rowsPerPage: pageSize,
        page,
      }
    })
  }

  const onShowSizeChange = (page, pageSize) => {
    validateFields((err, values) => {
      if (!err) {
        searchdata(values, page, pageSize);
      }
    });
    setPaginations({
      ...paginations,
      pageSize
    })
  }
  const changePage = (page, pageSize) => {
    validateFields((err, values) => {
      if (!err) {
        searchdata(values, page, paginations.pageSize);
      }
    });
    setPaginations({
      ...paginations,
      current: page
    })
  }

  const pagination = {
    showSizeChanger: true,
    onShowSizeChange: (page, pageSize) => onShowSizeChange(page, pageSize),
    current: paginations.current,
    pageSize: paginations.pageSize,
    total: instructionArr.total,
    showTotal: total => `总共${total}条记录`,
    onChange: (page) => changePage(page),
  }

  const handleSearch = () => {
    validateFields((err, values) => {
      dispatch({
        type: 'monitorconfiguration/searchInstruction',
        payload: {
          ...values,
          rowsPerPage: 10,
          page: 1,
        }
      })
    })
  }

  return (
    <>
      <Row gutter={16}>
        <Form {...formItemLayout}>

          <Col span={8}>
            <Form.Item label='指令名称'>
              {
                getFieldDecorator('commName', {

                })(
                  <Input />
                )
              }
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label='指令状态'>
              {
                getFieldDecorator('commStatus', {
                })(
                  <Select getPopupContainer={triggerNode => triggerNode.parentNode}>
                    <Option key='1' value='1'>生成指令</Option>
                    <Option key='2' value='1'>载入定时任务</Option>
                    <Option key='3' value='1'>正在执行</Option>
                    <Option key='4' value='1'>执行完成</Option>
                    <Option key='5' value='1'>准备和就绪状态可以废除</Option>
                  </Select>
                )
              }
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label='告警状态'>
              {
                getFieldDecorator('alarmStatus', {
                })(
                  <Select getPopupContainer={triggerNode => triggerNode.parentNode}>
                    <Option key='' value=''>全部</Option>
                    <Option key='1' value='1'>正常</Option>
                    <Option key='2' value='2'>异常</Option>
                  </Select>
                )
              }
            </Form.Item>
          </Col>

          <Col span={8} style={{ marginBottom: 20 }}>
            <Button
              type="primary"
              onClick={handleSearch}

            >
              查询
                </Button>
            <Button style={{ marginLeft: 8 }}>
              重置
                </Button>
          </Col>
        </Form>
      </Row>

      <Table
        columns={columns}
        pagination={pagination}
        dataSource={instructionArr.records}
      />
    </>
  )
}

export default Form.create({})(
  connect(({ monitorconfiguration, loading }) => ({
    instructionArr: monitorconfiguration.instructionArr,
  }))(Monitoringinstruction)
)