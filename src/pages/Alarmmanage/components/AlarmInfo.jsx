/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import moment from 'moment';
import { Badge, Form, Input, Row, Col, Checkbox, Dropdown, Menu, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};
const forminladeLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 22 },
  },
};

class AlarmInfo extends Component {
  render() {
    const { data } = this.props;
    let tempTime = '';
    let day = '';
    let houre = '';
    let minutes = '';
    let seconds = '';
    if (data.record && data.record.warnTime && data.record.clearTime) {
      const addtime = moment(data.record.warnTime);
      const endtime = moment(data.record.clearTime);
      const dura = endtime.format('x') - addtime.format('x');
      tempTime = moment.duration(dura);
      if (tempTime.days() !== 0) {
        day = `${tempTime.days()}天`
      };
      if (tempTime.hours() !== 0) {
        houre = `${tempTime.hours()}小时`
      };
      if (tempTime.minutes() !== 0) {
        minutes = `${tempTime.minutes()}分`
      };
      if ((tempTime.days() === 0 && tempTime.hours() === 0 && tempTime.minutes() === 0 && tempTime.seconds() === 0) || tempTime.seconds() !== 0) {
        seconds = `${tempTime.seconds()}秒`
      }
    };

    const handleMenuClick = e => {
      console.log(e)
    };
    const menu = (
      <Menu onClick={handleMenuClick}>
        <Menu.Item key="0">事件工单</Menu.Item>
        <Menu.Item key="1">问题工单</Menu.Item>
        <Menu.Item key="3">发布工单</Menu.Item>
      </Menu>
    );
    return (
      <>
        {data.record && (
          <Row gutter={24} style={{ marginTop: 24 }}>
            <Form {...formItemLayout}>
              <Col span={8}>
                <Form.Item label='告警编号'>
                  <Input defaultValue={data.record.id} disabled />
                </Form.Item>
              </Col>
              {data.type === 'measuralarm' && (
                <>
                  <Col span={8}>
                    <Form.Item label='监控项'>
                      <Input defaultValue={data.record.firstClassify} disabled />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label='监控内容'>
                      <Input defaultValue={data.record.secondClassify} disabled />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label='监控子类'>
                      <Input defaultValue={data.record.thirdClassify} disabled />
                    </Form.Item>
                  </Col>
                </>
              )}
              {data.type === '' && (<>
                <Col span={8}>
                  <Form.Item label='区域'>
                    <Input defaultValue={data.record} disabled />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label='设备IP'>
                    <Input defaultValue={data.record} disabled />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label='设备名称'>
                    <Input defaultValue={data.category} disabled />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label='巡检内容'>
                    <Input defaultValue={data.category} disabled />
                  </Form.Item>
                </Col>
              </>
              )}
              <Col span={8}>
                <Form.Item label='告警时间'>
                  <Input defaultValue={data.record.warnTime} disabled />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label='告警确认时间'>
                  <Input defaultValue={data.record.confirmTime} disabled />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label='告警消除时间'>
                  <Input defaultValue={data.record.clearTime} disabled />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label='持续时长'>
                  <Input defaultValue={`${day}${houre}${minutes}${seconds}`} disabled />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label='告警内容' {...forminladeLayout}>
                  <Input defaultValue={data.record.warnContent} disabled />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label='确认告警'>
                  <Input defaultValue={data.record.confirmStatus} disabled />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label='消除告警'>
                  <Input defaultValue={data.record.clearStatus} disabled />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label='工单编号'  {...forminladeLayout}>
                  <Dropdown overlay={menu}>
                    <Button type="primary" style={{ marginRight: 8 }}>
                      派发工单 <DownOutlined />
                    </Button>
                  </Dropdown>
                  <div><a>SJ202109040013</a>，<a>SJ202109040013</a></div>
                </Form.Item>
              </Col>
            </Form>
          </Row>
        )}
      </>
    );
  }
}

export default AlarmInfo;
