import React, { useEffect, useState } from 'react';
import router from 'umi/router';
import moment from 'moment';
import { Badge, Form, Input, Row, Col, Message, Dropdown, Menu, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { createOrder, getOrder } from '../services/api';

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

function AlarmInfo(props) {
  const { data } = props;
  const [temptime, setTemptime] = useState('');
  const [orderList, setOrderList] = useState([])
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
    const { key } = e;
    const warnId = data.record.id;
    createOrder({ orderType: key, warnId }).then(res => {
      if (res.code === 200) {
        Message.success(res.msg);
        switch (key) {
          case 'event':
            router.push({
              pathname: `/ITSM/eventmanage/to-do`,
              query: { pathpush: true },
              state: { cache: false }
            });
            break;
          case 'problem':
            router.push({
              pathname: `/ITSM/problemmanage/besolved`,
              query: { pathpush: true },
              state: { cache: false }
            });
            break;
          case 'trouble':
            router.push({
              pathname: `/ITSM/faultmanage/todolist`,
              query: { pathpush: true },
              state: { cache: false }
            });
            break;
          default:
            break;
        }
      } else {
        Message.error('操作失败');
      }
    })
  };
  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="event">事件工单</Menu.Item>
      <Menu.Item key="problem">问题工单</Menu.Item>
      <Menu.Item key="trouble">故障工单</Menu.Item>
    </Menu>
  );

  useEffect(() => {
    if (data && data.record && data.record.id) {
      getOrder({ warnId: data.record.id }).then(res => {
        if (res.code === 200) {
          setOrderList(res.data);
        }
      })
    };
  }, [data]);

  const handleClick = (val) => {
    // const type = val.orderNo.substring(0, 2);
    switch (val.orderType) {
      case 'event':
        router.push({
          pathname: `/ITSM/eventmanage/query/details`,
          query: {
            pangekey: val.flowNodeName,
            id: val.mainId,
            // mainId: val.mainId,
            No: val.orderNo,
          },
        });
        break;
      case 'problem':
        router.push({
          pathname: `/ITSM/problemmanage/problemquery/detail`,
          query: {
            id: val.mainId,
            taskName: val.flowNodeName,
            No: val.orderNo,
          },
        });
        break;
      case 'trouble':
        router.push({
          pathname: `/ITSM/faultmanage/querylist/record`,
          query: {
            id: val.mainId,
            No: val.orderNo,
          },
        });
        break;
      default:
        break;
    }
  }

  return (
    <>
      {data && data.record && (
        <Row gutter={24} style={{ marginTop: 24 }}>
          <Form {...formItemLayout}>
            <Col span={8}>
              <Form.Item label='告警编号'>
                <Input defaultValue={data.record.sourceCode} disabled />
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
                <Dropdown overlay={menu} disabled={!data.record.id || data.record.confirmStatus === '待确认'} >
                  <Button type="primary" style={{ marginRight: 8 }}>
                    派发工单 <DownOutlined />
                  </Button>
                </Dropdown>
                <div>
                  {orderList.map(item => {
                    return (
                      <a onClick={() => handleClick(item)} style={{ marginRight: 24 }}>{item.orderNo}</a>
                    )
                  })}
                </div>
              </Form.Item>
            </Col>
          </Form>
        </Row>
      )}
    </>
  );
}

export default AlarmInfo;