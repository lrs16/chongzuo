import React, { Component, } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Form, Input, Select, Button, Table, DatePicker, } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';
import Link from 'umi/link';

const { Option } = Select;
const { RangePicker } = DatePicker;
const operations = <Button type="primary"><Link to="/sysmanage/timedtask">返回列表</Link></Button>;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

const statusmap = [
  { key: '0', title: '成功' },
  { key: '1', title: '失败' },
];

const taskName = [
  { key: '0', title: '默认' },
  { key: '1', title: '系统' },
];

@connect(({ timedtaskmodel, loading }) => ({
  timedtaskmodel,
  loading: loading.effects['timedtaskmodel/fetchbasic'],
}))
class $joblogid$ extends Component {
  constructor(props) {
    super(props);
    this.joblogid = props.match.params.joblogid;
  }

  componentDidMount() {
    this.getqrtzjoblogData();
  }

  getqrtzjoblogData = () => {
    this.props.dispatch({
      type: 'timedtaskmodel/getqrtzjoblogData',
      payload: this.joblogid,
    });
  };

  render() {
    const { getFieldDecorator, getFieldsValue, resetFields } = this.props.form;

    const columns = [
      {
        title: '日志编号',
        dataIndex: 'jobLogId ',
        key: 'jobLogId ',
        width: 120,
        sorter: (a, b) => a.jobLogId - b.jobLogId,
      },
      {
        title: '任务名称',
        dataIndex: 'jobName',
        key: 'jobName',
        width: 200,
      },
      {
        title: '任务组名',
        dataIndex: 'jobGroup',
        key: 'jobGroup',
        width: 100,
      },
      {
        title: '调用目标字符串',
        dataIndex: 'invokeTarget',
        key: 'invokeTarget',
        width: 250,
      },
      {
        title: '日志信息',
        dataIndex: 'jobMessage ',
        key: 'jobMessage ',
        width: 250,
      },
      {
        title: '执行状态',
        dataIndex: 'status ',
        key: 'status ',
        width: 100,
      },
      {
        title: '执行时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 250,
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        fixed: 'right',
        width: 200,
        // render: (text, record) => {
        //   return ()

        // },
      },
    ];

    const searchdata = (page, size) => {
      const { dispatch } = this.props;
      const values = getFieldsValue();
      dispatch({
        type: 'timedtaskmodel/toqueryqrtzjoblogList',
        payload: {
          bodyParams: values,
          pageNum: page,
          pageSize: size,
        },
      });
    };

    const handleSearch = () => {
      // setPageinations({
      //   ...paginations,
      //   current: 1,
      // });
      searchdata(1, 15);
    };

    const handleReset = () => {
      resetFields();
      // searchdata(1, 15)
      // setPageinations({ current: 1, pageSize: 15 });
    };

    // const pagination = {
    //   showSizeChanger: true,
    //   onShowSizeChange: (page, size) => onShowSizeChange(page, size),
    //   current: paginations.current,
    //   pageSize: paginations.pageSize,
    //   // total: qrtzjoblist.total,
    //   // showTotal: total => `总共  ${total}  条记录`,
    //   onChange: page => changePage(page),
    // };
    // 查询
    const extra = (<>
      <Button type="primary" onClick={() => handleSearch()} style={{ marginLeft: 15 }}>查 询</Button>
      <Button style={{ marginLeft: 8 }} onClick={() => handleReset()}>重 置</Button></>
    );
    return (
      <PageHeaderWrapper title="调度日志" onBack={() => window.history.back()} extra={operations}>
        <Card>
          <Row gutter={8}>
            <Form {...formItemLayout} onSubmit={handleSearch}>
              <Col span={8}>
                <Form.Item label="任务名称">
                  {getFieldDecorator('jobName', {
                    initialValue: '',
                  })(<Input placeholder="请输入" allowClear />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="任务组名">
                  {getFieldDecorator('jobGroup', {
                    initialValue: '',
                  })(
                    <Select placeholder="请选择" allowClear>
                      {taskName.map(obj => (
                        <Option key={obj.key} value={obj.title}>
                          {obj.title}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="执行状态">
                  {getFieldDecorator('status', {
                    initialValue: '',
                  })(
                    <Select placeholder="请选择" allowClear>
                      {statusmap.map(obj => (
                        <Option key={obj.key} value={obj.key}>
                          {obj.title}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                  <Form.Item label="执行时间">
                    {getFieldDecorator('form4', {
                      initialValue: '',
                    })
                      (
                        <RangePicker
                          showTime={{
                            hideDisabledOptions: true,
                            defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                          }}
                          format="YYYY-MM-DD HH:mm:ss"
                          style={{ width: '100%' }}
                        />
                      )}
                  </Form.Item>
                </Col>
              <Col span={8} style={{ textAlign: 'left', paddingTop: 4 }}>{extra}</Col>
            </Form>
          </Row>

          <div style={{ marginBottom: 24 }}>
            <Button type="danger" ghost style={{ marginRight: 8 }}>删 除</Button>
            <Button type="danger" ghost style={{ marginRight: 8 }}>清 空</Button>
            <Button type="primary" style={{ marginRight: 8 }}>导 出</Button>
            <Button type="primary" style={{ marginRight: 8 }} onClick={() => window.history.back()}>关 闭</Button>
          </div>
          < Table
            // loading={loading}
            columns={columns}
            // dataSource={qrtzjoblist.rows}
            // pagination={pagination}
            // rowSelection={rowSelection}
            rowKey={r => r.jobLogId}
            scroll={{ x: 1500 }}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()($joblogid$);
