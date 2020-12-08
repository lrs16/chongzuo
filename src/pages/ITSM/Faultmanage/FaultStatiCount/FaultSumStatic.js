import React, { Component } from 'react';
import {
  Card,
  Form,
  Row,
  Col,
  Button,
  DatePicker,

} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const { RangePicker } = DatePicker;

class FaultSumStatic extends Component {
  state = {};

  componentDidMount() {
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 20 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 4 },
        sm: { span: 17 },
      },
    };

    const { getFieldDecorator } = this.props.form;
    return (
      <PageHeaderWrapper title="故障汇总统计">
        <Card>
          <Form
            style={{ display: 'block' }}
            id="showItem"
            onSubmit={this.handleSearch}
            {...formItemLayout}
          >
            <Row>
              <Col span={8}>
                <Form.Item label="起始时间">
                  {getFieldDecorator('startEndTime')(<RangePicker style={{ width: '100%' }} />)}
                </Form.Item>
              </Col>

              <Col span={7} style={{ textAlign: 'right' }}>
                <Button type="primary" htmlType="submit" style={{ marginLeft: 8 }}>
                  查 询
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(FaultSumStatic);
